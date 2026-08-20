/* Bizzing India — west & central story content (fourth tranche).

   Same shape as data-stories.js, data-stories-regional.js and data-stories-more.js,
   on its own globals so all four sets can be loaded and merged independently.

   This tranche exists to light two territories that had nothing at all — Dadra &
   Nagar Haveli and Daman & Diu — and to fill the west and the centre: Goa,
   Maharashtra, Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh.

   Badges (docs/05): most objects are 'katha' — a story as it is told. A handful are
   'aaj' — how something lives today, told truthfully. Four are 'itihaas' — real
   people (Jijabai and Shivaji, Tansen, Amrita Devi, Teejan Bai), told from
   well-attested tradition only, with the source line saying honestly what is record
   and what is tradition. No dates are invented anywhere; where a community keeps a
   date, the source says whose date it is.

   Adivasi and community traditions here — Warli, Dhodia, Kokna, Koli, Machhi,
   Kharvi, Maldhari, Kharva, Bishnoi, Raika, Charan, Gond, Muria, Agaria, Pardhi —
   are told from the inside and credited by name, exactly as every other tradition
   in this app is. Where a tale is a NEW telling composed for this app around a real
   place or a real practice (a lighthouse, a fort cat, a singing waterfall), the
   source line says so plainly rather than dressing it up as a collected tale.

   Softening note (docs/05, and the age band): the Khejarli story of Amrita Devi is
   about protection; the cost is stated in a single clause, offstage, and the object
   is flagged needs_review for a human editor before it ships.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_WEST = [

/* ======================================= DADRA & NAGAR HAVELI ============ */
{
  id: 'fk.warli-chauk',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Painting Made of Rice',
  hook: 'White paint on a warm mud wall — and the paint is made of rice. Every wedding in the village starts with a square.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['चावल', 'chaawal', 'rice'], ['दीवार', 'deewar', 'wall'], ['शादी', 'shaadi', 'wedding']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दादरा और नगर हवेली की हरी-भरी पहाड़ियों में, जहाँ वारली लोग इतने पुराने समय से रह रहे हैं कि कोई गिन भी नहीं सकता, वहाँ के घर मिट्टी और बाँस के बने होते हैं, और दीवारें उसी मिट्टी के रंग की होती हैं जिस पर वे टिके हैं। और उन्हीं दीवारों पर, वारली लोग चित्र बनाते हैं।',
      text: 'In the green hills of Dadra and Nagar Haveli, where the Warli people have lived for longer than anyone can count, the houses are made of mud and bamboo, and the walls are the colour of the earth they stand on. And on those walls, the Warli paint.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'दुकान से खरीदे रंगों से नहीं। चावल से। चावल को पीसकर आटा बनाया जाता है, पानी में घोलकर सफ़ेद लेप तैयार होता है, और बाँस की चबाई हुई टहनी को ब्रश बनाकर चित्र उकेरे जाते हैं। लाल-भूरी दीवार पर चावल के सफ़ेद चित्र — लोग, पेड़, चिड़ियाँ, पूरे-के-पूरे गाँव, सब गोलों, तिकोनों और लकीरों से बने हुए।',
      text: 'Not with shop paint. With rice. Rice ground to powder, mixed with water into a white paste, put on with a chewed bamboo twig for a brush. White rice pictures on a red-brown wall — people, trees, birds, whole villages, all made of circles and triangles and lines.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'एक बार किसी मुसाफ़िर ने एक वारली दादी से पूछा कि ये चित्र इतने सीधे-सादे क्यों हैं। उन्होंने कुछ देर उसे देखा। "गोला सूरज और चाँद है," वे बोलीं। "तिकोना पहाड़ और पेड़ है। इसके सिवा और है ही क्या? तुम कोई एक ऐसी चीज़ बताओ जो मेरे चित्र में न हो।"',
      text: 'A visitor once asked a Warli grandmother why the pictures were so simple. She looked at him for a while. "A circle is the sun and the moon," she said. "A triangle is a mountain and a tree. What else is there? You tell me one thing that is not in my painting."' },
    { art: ['courtier'], who: null,
      hi: 'इन सबमें सबसे ज़रूरी चित्र होता है चौक — यानी चौकोर घेरा। जब कोई शादी होती है, तो परिवार की शादीशुदा औरतें दीवार पर एक बड़ा सा चौक बनाती हैं, और उसके अंदर विराजती हैं शादी की देवी पालघाट, और उनके चारों ओर पूरी दुनिया: सूरज, कंघी, सीढ़ी और लोग।',
      text: 'The most important painting of all is the chauk — the square. When there is a wedding, the married women of the family paint a big square on the wall, and inside it goes Palaghata, the goddess of the marriage, and around her the whole world: the sun, the comb, the ladder, the people.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और इसे पहली बार बनते देखकर बच्चे यही सवाल पूछते हैं। शादी पर परिवार इतना ख़र्च करता है — कपड़ों पर, खाने पर, हर चीज़ पर। तो फिर पूरे घर का यह सबसे ज़रूरी चित्र महज़ सादे चावल से क्यों बनाया जाता है?',
      text: 'And here is the question children ask when they first watch it being done. The family will spend money on the wedding — on clothes, on food, on everything. So why is the most important picture in the whole house painted with plain rice?',
      ask: {
        q: 'Why paint the wedding square with rice paste instead of something costly and golden?',
        options: ['Rice is all they could find', 'Rice is the real wealth — it is what feeds everyone', 'Gold paint would not stick to mud'],
        answer: 1,
        right: 'That is it exactly. Rice is life. Painting with it says: may this house always have enough.',
        wrong: 'The Warli would smile at that. Rice is the real treasure — it is what feeds the family. Painting with rice says: may this house always have enough.'
      } },
    { art: ['guard'], who: null,
      hi: 'इन चित्रों पर कोई अपना नाम नहीं लिखता और न ही इन्हें दीवार से उतारकर बेचा जाता है। जब दीवार की मरम्मत होती है, तो चित्र मिट जाता है, और अगली शादी या अगली फ़सल पर एक नया चित्र बन जाता है। असली बात चित्र नहीं है। असली बात तो उसे मिलकर बनाना है।',
      text: 'The paintings are not signed and they are not sold off the wall. When the wall is mended, the painting goes, and a new one is made for the next wedding, the next harvest. The picture is not the point. The making of it, together, is the point.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'आजकल वारली चित्रकला पहाड़ियों से बहुत दूर-दूर तक मशहूर है — कपड़ों पर, गैलरियों में, और दूर-दराज़ के शहरों में। और वारली कलाकार आपको नम्रता से मगर साफ़ तौर पर बताएंगे: यह महज़ कोई डिज़ाइन नहीं है, यह हमारी अपनी है। इसका एक घर है, और उस घर का एक नाम है।',
      text: 'These days Warli painting is famous far beyond the hills — on cloth, in galleries, in faraway cities. And Warli artists will tell you, politely but firmly: it is not a pattern, it is ours. It has a home, and the home has a name.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'तो अगर तुम कभी एक-दूसरे का हाथ पकड़े हुए उन नन्हे तिकोने इंसानों को बनाओ — और तुम्हें ज़रूर बनाना चाहिए, चित्र बनाने का यह बहुत प्यारा तरीका है — तो यह ज़रूर बताना कि यह कहाँ से आई है। कहना: यह वारली है, उन पहाड़ियों से जहाँ गुजरात और महाराष्ट्र मिलते हैं, और बीच में दादरा और नगर हवेली है।',
      text: 'So if you ever draw those little triangle people holding hands — and you should, it is a lovely way to draw — say where it comes from. Say: this is Warli, from the hills where Gujarat and Maharashtra meet, and Dadra and Nagar Haveli in between.' }
  ],
  moral: 'The most precious paint is the one that feeds you.',
  source: 'The Warli painting tradition of Dadra & Nagar Haveli and the neighbouring hills — the rice-paste chauk, painted by the married women of the house, with Palaghata at its centre. A living tradition, credited to the Warli by name.'
},

{
  id: 'fk.warli-tarpa',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Why the Dance Goes Round',
  hook: 'One long horn, played till the stars come out — and a whole village dancing in a coil around it, holding hands.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['नाच', 'naach', 'dance'], ['हाथ', 'haath', 'hand'], ['गोला', 'gola', 'circle']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'जब फ़सल कट कर घर आ जाती है, तब दादरा और नगर हवेली के वारली गाँवों में, एक आदमी खुले मैदान में तारपा लेकर खड़ा होता है — सूखी लौकी और बाँस से बना एक लंबा बाजा, जो खुद उस आदमी से भी ऊँचा होता है। वह अपने सीने में गहरी साँस भरता है और बजाना शुरू करता है, एक लंबी, कभी न ख़त्म होने वाली तान।',
      text: 'When the harvest is in, in the Warli villages of Dadra and Nagar Haveli, a man stands in an open place with a tarpa — a long horn made of dried gourds and bamboo, taller than the man himself. He fills his chest and begins to play, one endless winding note.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और पूरा गाँव चला आता है। हर कोई — दादियाँ, किसान, और नन्हे बच्चे जो अभी ठीक से चल भी नहीं पाते — पास वाले का हाथ थाम लेता है, और तारपा बजाने वाले के चारों ओर कतार घूमने लगती है। गोल-गोल, अंदर की ओर मुड़ती हुई और बाहर की ओर खुलती हुई, जैसे कोई बढ़ती हुई बेल हो।',
      text: 'And the village comes. Everyone — grandmothers, farmers, children who can barely walk — takes the hand of the next person, and the line begins to move around the tarpa player. Round, and round, coiling in and uncoiling out, like a creeper growing.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'एक बार एक लड़के ने अपने दादाजी से पूछा, "ऐसे गोल घेरे में क्यों? शहर में तो सब सामने देखकर नाचते हैं, जहाँ हर कोई उन्हें देख सके।" दादाजी नाचते रहे, क्योंकि अगर नाच में अपनापन हो, तो आप नाचते-नाचते बात भी कर सकते हैं। उन्होंने कहा, "ज़रा इस कतार को देखो, और बताओ कि इसमें सबसे पहला कौन है?"',
      text: 'A boy once asked his grandfather, "Why in a circle? In the town they dance facing the front, where everyone can see them." His grandfather kept dancing, because you can talk and dance at the same time if the dance is kind. "Look at the line, and tell me who is first in it," he said.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लड़के ने देखा। कतार तारपा बजाने वाले के चारों तरफ़ गोल-गोल घूम रही थी। सबसे पीछे वाले ने बीच वाले का हाथ पकड़ा हुआ था, और बीच वाले ने सबसे आगे वाले का।',
      text: 'The boy looked. The line curled round and round the tarpa player. The end held hands with the middle, the middle with the beginning.',
      ask: {
        q: 'Who is first in a dance that goes in a circle?',
        options: ['The best dancer', 'The one nearest the tarpa', 'Nobody — a circle has no front'],
        answer: 2,
        right: '"Exactly," said his grandfather. "No first, no last. Nobody wins the tarpa dance. That is why everyone comes."',
        wrong: 'The boy guessed that too. "Look again," said his grandfather. "A circle has no front and no back. No first, no last. Nobody wins the tarpa dance. That is why everyone comes."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'यह वही घेरा है जो वारली लोग अपनी दीवारों पर बनाते हैं: एक-दूसरे का हाथ थामे, गोल-गोल घूमती छोटी-छोटी आकृतियों का घेरा। जब आप उस चित्र को देखते हैं, तो असल में आप इसी नाच को देख रहे होते हैं। पैरों ने जो किया, वह दीवार को याद रहता है।',
      text: 'It is the same circle the Warli paint on their walls: the ring of little joined figures, hand in hand, going round. When you see that painting, you are looking at this dance. The wall remembers what the feet did.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'तारपा बजाने वाला बीच में खड़ा रहता है और रुक नहीं सकता, क्योंकि जैसे ही बाजा रुका, नाच भी रुक जाता है। इसलिए वह तब तक बजाता है जब तक उसकी सांस पूरी न हो जाए, और फिर बिना कोई रुकावट आए दूसरा बजाने वाला चुपके से उसकी जगह संभाल लेता है — बिल्कुल वैसे ही जैसे कोई भरा हुआ कटोरा संभालकर पकड़ाए, ताकि कुछ छलके नहीं।',
      text: 'The tarpa player stands in the middle and cannot stop, because the moment the horn stops the dance stops, so he plays until his breath is done and another player slides in and takes over without a gap — the way you pass a full bowl carefully, so nothing spills.' },
    { art: ['courtier'], who: null,
      hi: 'वे अच्छी फसल के लिए नाचते हैं, हरियाली के देवताओं के लिए नाचते हैं, और इसलिए भी क्योंकि साल का यह समय ही इसके लिए होता है। और जो बच्चा इस कतार में जुड़ जाता है, वह बिना किसी सीख के सब कुछ सीख जाता है — कदम हाथों-हाथ कतार में आगे बढ़ते हुए उसके पैरों में उतर आते हैं।',
      text: 'They dance for the harvest, and for the gods of the green, and because it is the time of year for it. And a child who joins the line learns the whole thing without one lesson — the steps travel down the line, hand to hand, into their feet.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'दुनिया की सबसे पुरानी पाठशाला यही है: हाथ पकड़ो, साथ निभाओ, गोल-गोल घूमो। अपने परिवार से पूछो कि क्या वे कोई घेरे वाला नाच जानते हैं — भारत के कई हिस्सों में ऐसे नाच होते हैं, और हर नाच का अपना एक अलग ही रूप होता है।',
      text: 'That is the oldest school there is: hold hands, keep up, go round. Ask your family if they know a circle dance — many parts of India have one, and each one is its own.' }
  ],
  moral: 'In a circle, nobody is first and nobody is last — which is the whole idea.',
  source: 'The tarpa dance of the Warli of Dadra & Nagar Haveli and the surrounding hills — the gourd-and-bamboo horn, the joined-hands coiling line, and the painted circle of dancers on Warli walls. A living tradition, credited to the Warli by name.'
},

{
  id: 'fk.waghoba-watch',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Tiger Who Keeps Watch',
  hook: 'At the edge of the village stands a carved wooden tiger. Nobody is afraid of him. He is the watchman.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['बाघ', 'baagh', 'tiger'], ['जंगल', 'jangal', 'forest'], ['रखवाला', 'rakhwala', 'guardian']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जहाँ वारली या कोकना गाँव के खेत खत्म होते हैं और दादरा और नगर हवेली का जंगल शुरू होता है, वहाँ अक्सर एक छोटा सा मंदिर होता है — लकड़ी का एक नक्काशीदार खंभा, या रंगा हुआ पत्थर, जिस पर बाघ बना होता है। उनका नाम वाघोबा है, और पहली बात जो समझनी चाहिए वह यह है कि वे कोई दुश्मन नहीं हैं।',
      text: 'Where the fields of a Warli or Kokna village end and the forest of Dadra and Nagar Haveli begins, there is often a small shrine — a carved wooden post, or a painted stone, with a tiger on it. His name is Waghoba, and the first thing to understand is that he is not the enemy.' },
    { art: ['pt_lion'], who: null,
      hi: 'वाघोबा बाघ देवता हैं, सबसे बड़े, पंजों और धारियों वाले हर जीव के स्वामी। जंगल उनका घर है। गाँव लोगों का घर है। और यह मंदिर ठीक दोनों की चौखट पर बना है, क्योंकि पहरेदार वहीं तो खड़ा होता है।',
      text: 'Waghoba is the tiger god, the big one, the lord of everything with paws and stripes. The forest is his house. The village is the people\'s house. And the shrine stands exactly on the doorstep between the two, because that is where a watchman stands.' },
    { art: ['courtier', 'pt_lion'], who: 'courtier',
      hi: 'एक बार एक बच्ची ने अपनी दादी से पूछा, "हम बाघ को भेंट क्यों चढ़ाते हैं? क्या हमें उससे छुपना नहीं चाहिए?" दादी थान पर चावल और गेंदे का फूल सजा रही थीं, और उन्होंने जवाब देने में कोई जल्दबाज़ी नहीं की।',
      text: 'A girl once asked her grandmother, "Why do we give offerings to the tiger? Shouldn\'t we hide from him instead?" Her grandmother was arranging rice and a marigold at the shrine, and she did not hurry her answer.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"जब तुम्हारे चाचा आते हैं," उन्होंने कहा, "तो हम उन्हें खाना खिलाते हैं और आदर से बात करते हैं, तभी तो वो परिवार हैं, कोई पराये नहीं। जंगल के साथ भी ऐसा ही है। वाघोबा हमारे सबसे बड़े पड़ोसी हैं। पड़ोसी से कोई छुपता नहीं है। उनका कायदे से आदर-सत्कार करो, और फिर दोनों जानते हैं कि कैसा बर्ताव करना है।"',
      text: '"When your uncle visits," she said, "we feed him and speak to him with respect, and so he is family and not a stranger. It is the same with the forest. Waghoba is our biggest neighbour. You do not hide from a neighbour. You greet him properly, and then you both know how to behave."' },
    { art: ['pt_lion'], who: null, mood: 'think',
      hi: 'और जब रात में सचमुच कोई तेंदुआ या बाघ गाँव के पास से गुज़रता—नाले के पास पंजों के निशान, किसी बकरी को देखा ज़रूर पर उठाया नहीं—तो बुज़ुर्ग सिर हिलाकर कहते: वाघोबा अपना फेरा लगा गए।',
      text: 'And when a real leopard or a tiger passed near the village in the night — a pug mark by the stream, a goat looked at but not taken — the old people would nod and say: Waghoba walked his round.',
      ask: {
        q: 'A tiger passed by in the night and took nothing. What do the old people say?',
        options: ['We were lucky', 'Waghoba walked his round, checking on us', 'The tiger was not hungry'],
        answer: 1,
        right: 'That is how it is said. The watchman went past on his rounds — and everything was found in order.',
        wrong: 'Maybe — but that is not how it is said. The old people say: Waghoba walked his round. The watchman went past, and found everything in order.'
      } },
    { art: ['courtier', 'pt_lion'], who: null,
      hi: 'फ़सल कटाई के समय पूरा गाँव साथ मिलकर थान पर जाता है। चढ़ावा सीधा-सादा होता है—चावल, एक नारियल, थोड़ा सा सिंदूर—और विनती भी सीधी-सादी होती है: आप अपनी तरफ़ रहिए, हम अपनी तरफ़ रहेंगे, और दोनों में से कोई भी घर दूसरे को परेशान न करे।',
      text: 'At harvest time the village goes to the shrine together. The offerings are simple — rice, a coconut, a daub of red — and the asking is simple too: keep to your side, we will keep to ours, and let neither house trouble the other.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'इन पहाड़ियों में बड़ी बिल्लियों का अध्ययन करने वाले वैज्ञानिकों ने एक ग़ौर करने लायक बात देखी है: जिन गाँवों में वाघोबा का थान होता है, वहाँ लोग तेंदुओं के बारे में घबराने के बजाय आदर से बात करते हैं। वो पुराना समझौता आज भी चलता है, दोनों तरफ़ से।',
      text: 'Scientists who study big cats in these hills have noticed something worth noticing: villages that keep Waghoba\'s shrine tend to speak of leopards with respect instead of panic. The old agreement still works, both ways.' },
    { art: ['pt_lion'], who: 'mithu',
      hi: 'धारियों वाले एक देवता, जिनका काम दो घरों के बीच अमन-चैन बनाए रखना है। कोई राक्षस नहीं। एक पड़ोसी, एक पहरेदार, और सबसे बड़े बुज़ुर्ग।',
      text: 'A god with stripes, whose job is to keep the peace between two houses. Not a monster. A neighbour, and a watchman, and very much senior to everybody.' }
  ],
  moral: 'Respect is the oldest fence, and the only one a tiger honours.',
  source: 'Waghoba, the tiger deity honoured by the Warli and Kokna communities of Dadra & Nagar Haveli and the hills around — the boundary shrines, the harvest offerings, and the living practice of speaking of the big cats with respect. Credited to those communities by name.'
},

{
  id: 'fk.kansari-grain',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Kansari and the Last Handful',
  hook: 'Grandmother picks up every single spilled grain of rice, every time. There is a reason, and the reason has a name.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['अनाज', 'anaaj', 'grain'], ['माँ', 'maa', 'mother'], ['भूख', 'bhookh', 'hunger']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दादरा और नगर हवेली के वारली और धोड़िया गाँवों में, चावल सिर्फ़ खाना नहीं है। दाने के अंदर कंसारी बसती हैं — अन्न की माँ, जो सबका पेट भरती हैं। इसका मतलब यह है कि चावल की हाँडी कभी सिर्फ़ चावल की हाँडी नहीं होती। वह एक ऐसा घर होती है जिसके अंदर कोई रहता है।',
      text: 'In the Warli and Dhodia villages of Dadra and Nagar Haveli, the rice is not just food. Inside the grain lives Kansari — the grain mother, the one who feeds everybody. Which means a pot of rice is never only a pot of rice. It is a house with somebody in it.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक बच्ची अपनी आजी के साथ चूल्हे तक चावल ले जाने में मदद कर रही थी, तभी टोकरी ज़रा सी टेढ़ी हो गई और चावल के सफ़ेद दाने छिटककर धूल में जा गिरे। वह उन्हें झाड़ू से दरवाज़े के बाहर करने ही वाली थी कि उसकी आजी ने उसका हाथ पकड़ लिया।',
      text: 'A girl was helping her grandmother carry rice to the cooking fire when the basket tipped, and a small white spray of grains went into the dust. She was going to sweep them out of the door. Her grandmother caught her hand.' },
    { art: ['guard'], who: 'guard',
      hi: '"इन्हें उठाओ," आजी ने कहा। "एक-एक दाना।" और अपनी उम्र के बावजूद, वे घुटनों के बल बैठ गईं और उँगलियों के पोरों से धूल में से एक-एक दाना ऐसे सहेजकर उठाने लगीं, मानो वे किसी हार के मोती हों।',
      text: '"Pick them up," said her grandmother. "Every one." And she got down on her knees, old as she was, and began picking grains out of the dust with her fingertips, one by one, as carefully as if they were beads from a necklace.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"आजी, यह तो बस एक मुट्ठी ही है," बच्ची ने कहा। "हमारे पास तो पूरी टोकरी भरी है।" आजी थोड़ा पीछे हटकर बैठ गईं और उसे देखने लगीं, और बच्ची समझ गई कि उसने अनजाने में ही कोई बहुत बड़ी बात कह दी है।',
      text: '"Aaji, it is only a handful," said the girl. "We have a whole basket." Her grandmother sat back and looked at her, and the girl understood that she had said something important without knowing what.',
      ask: {
        q: 'Why does one spilled handful matter when the basket is full?',
        options: ['Because rice costs money', 'Because Kansari lives in every grain, not just the full baskets', 'Because the floor gets dirty'],
        answer: 1,
        right: '"Kansari is in the handful as much as in the harvest," said her grandmother. "Throw her in the dust, and why would she stay in your house?"',
        wrong: '"It is not about the money," said her grandmother. "Kansari is in the handful as much as in the harvest. Throw her in the dust, and why would she stay in your house?"'
      } },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'फिर उन्होंने उसे पुरखों की समझाई बात बताई। अन्न-माता कंसारी वहीं जाती हैं जहाँ उनका आदर होता है। जिस घर में चावल बर्बाद किया जाता है, इधर-उधर फेंका जाता है, सड़ने के लिए छोड़ दिया जाता है, वहाँ से वे चुपचाप अपना पल्ला समेटकर चली जाती हैं — और जिस घर से वे चली जाती हैं, उस घर को भूख का मुँह देखना पड़ता है।',
      text: 'Then she told her the old understanding. Kansari the grain mother goes where she is honoured. In a house where rice is wasted, thrown about, left to spoil, she quietly gathers her skirts and leaves — and a house she has left is a house that will know hunger.' },
    { art: ['courtier'], who: null,
      hi: 'लेकिन जिस घर में हर दाने का मेहमान की तरह आदर होता है — उसे चुनकर सहेजा जाता है, सूखा रखा जाता है, प्यार से पकाया जाता है, और बिना किसी कंजूसी के बाँटा जाता है — वहाँ कंसारी चूल्हे के पास बैठी दादी की तरह हमेशा के लिए रम जाती हैं, और उस घर की हाँडी में किसी न किसी तरह एक और जन के लिए खाना हमेशा निकल ही आता है।',
      text: 'But in a house where every grain is treated as a guest — gathered up, stored dry, cooked with attention, shared without grudging — Kansari settles in like a grandmother by the fire, and the pot in that house somehow always stretches to one more person.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"जब फ़सल कटकर आती है, तो गाँव वाले पूरे आदर से उनका सत्कार करते हैं — किसी और के खाने से पहले नए अनाज का पहला हिस्सा उन्हीं का होता है। इसलिए नहीं कि वे डरावनी हैं। बल्कि इसलिए कि वे माँ हैं, और माँ को सबसे पहले परोसा जाता है।"',
      text: 'When the harvest comes in, the villages honour her properly — the first of the new grain is hers before anyone else eats. Not because she is fierce. Because she is the mother, and the mother is served first.' },
    { art: ['guard'], who: 'mithu',
      hi: '"वह लड़की बड़ी हुई और ज़िंदगी भर ज़मीन पर गिरे दाने उठाती रही, एक अकेले दाने के लिए भी घुटनों के बल झुक जाती थी, और उसके अपने पोते-पोतियों ने उससे इसकी वजह पूछी। और कंसारी को भी यह कहानी बिल्कुल इसी तरह आगे बढ़ना पसंद है।"',
      text: 'The girl grew up and picked up spilled grains all her life, kneeling down for a single one, and her own grandchildren asked her why. Which is exactly how Kansari likes the story to be passed on.' }
  ],
  moral: 'Treat every grain as a guest, and your house will never feel empty.',
  source: 'Kansari, the grain mother honoured by the Warli and Dhodia communities of Dadra & Nagar Haveli — the first-grain offering and the teaching that grain is never wasted. The household telling here follows that living tradition; wordings differ from family to family.'
},

{
  id: 'fk.damanganga-winds',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The River That Would Not Hurry',
  hook: 'The sea is not far, as the crow flies. So why does the river take the long way — bending and bending through every village?',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['नदी', 'nadi', 'river'], ['रास्ता', 'raasta', 'way'], ['धीरे', 'dheere', 'slowly']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"दमन गंगा पूरब की पहाड़ियों से निकलती है, और उसे दमन के समंदर तक पहुँचना है — यह सब जानते हैं, यहाँ तक कि खुद नदी भी। पर बच्चों को जो बात उलझन में डालती है, वह है नक्शा। समंदर कोई दूर नहीं है। फिर भी नदी मुड़ती है, मुड़ती है, और फिर मुड़ती है, दादरा और नगर हवेली से यूँ चक्कर काटती हुई निकलती है जैसे उसके पास दुनिया भर का समय हो।"',
      text: 'The Daman Ganga is born in the hills to the east, and she is bound for the sea at Daman — everyone knows that, even the river. What puzzles children is the map. The sea is not far. And yet the river bends, and bends, and bends again, looping through Dadra and Nagar Haveli as if she had all the time in the world.' },
    { art: ['pt_tortoise'], who: null,
      hi: '"यह वही कहानी है जो एक दादाजी ने किनारे बैठकर, पानी में पैर डाले सुनाई थी, और उन्होंने इसे ऐसे सुनाया मानो वे खुद वहाँ मौजूद रहे हों।"',
      text: 'This is the story one grandfather told about it, sitting on the bank with his feet in the water, and he told it as if he had been there.' },
    { art: ['courtier', 'pt_tortoise'], who: 'courtier',
      hi: '"जब नदी पहली बार पहाड़ियों से नीचे उतरी, चंचल और तेज़, तो उसका इरादा सीधे समंदर की तरफ़ दौड़ने का था। लेकिन पहले ही गाँव में एक किसान ने पुकारा: "बहना! मेरे खेत सूखे पड़े हैं — क्या तुम ज़रा इस तरफ़ आ सकती हो?" और उसने सोचा, भला इसमें मेरा रास्ता ही कितना छूटेगा, और वह उसकी तरफ़ मुड़ गई।"',
      text: 'When the river first came down from the hills, young and quick, she meant to run straight to the sea. But at the first village a farmer called out: "Sister! My fields are dry — could you come just a little this way?" And she thought, well, it is hardly out of my path, and she bent towards him.' },
    { art: ['pt_tortoise'], who: null,
      hi: '"अगले गाँव में भैंसें गर्मी के मारे जीभ निकाले खड़ी थीं, और वह फिर मुड़ गई। फिर पुराने आम के पेड़ों का एक बगीचा मिला। फिर कपड़े धोने की एक शिला। फिर मछुआरों का एक गाँव, जहाँ उसके बिना मछलियाँ ही न होतीं। हर बार बस एक छोटा सा मोड़। बस ज़रा सा।"',
      text: 'At the next village the buffaloes were standing in the heat with their tongues out, and she bent again. Then a grove of old mango trees. Then a washing stone. Then a fishing village that would have no fish without her. Each time only a little bend. Only a little.' },
    { art: ['pt_tortoise'], who: null, mood: 'think',
      hi: 'और दमन में इंतज़ार करते समंदर ने रेत पर एक लहर भेजकर पूछा: तुम्हें इतनी देर क्यों लग रही है?',
      text: 'And the sea, waiting at Daman, sent a wave up the sand to ask: what is keeping you?',
      ask: {
        q: 'The river could run straight and arrive quickly. What should she tell the sea?',
        options: ['Sorry — I will straighten out and hurry', 'I am coming — but I am coming the way that fills everyone\'s pots', 'I have decided not to come at all'],
        answer: 1,
        right: 'That is what she said. "You will get every drop in the end. But I will not pass a thirsty village to reach you sooner."',
        wrong: 'She did not apologise and she did not stop. She said: "You will get every drop in the end. But I will not pass a thirsty village to reach you sooner."'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'तो नक्शा ही कहानी है। दमन गंगा का हर मोड़ ऐसी जगह है जहाँ कभी किसी ने पुकारा था और नदी ने उसकी बात सुनी। सीधा रास्ता तो शुरू से वहीं था। पर उसने काम आने वाला रास्ता चुना।',
      text: 'So the map is the story. Every bend in the Daman Ganga is a place where somebody once called out and the river answered. The straight path was there all along. She chose the useful one.' },
    { art: ['courtier', 'pt_tortoise'], who: null,
      hi: 'और आज भी यह बात बिल्कुल साफ़ सच है: समंदर तक एक बूँद पहुँचने से पहले, नदी का पानी इस छोटे-से हरे-भरे इलाके के खेतों, गाँवों और कस्बों के काम आता है। उसके किनारे खेती करने वाले किसी से भी पूछ लो।',
      text: 'And it is true today in the plainest way: the river\'s water works for the fields, the villages and the towns of this small green territory before one drop of it reaches the sea. Ask anyone who farms beside her.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: 'जो लोग सबको पीछे छोड़कर तेज़ी से भागते हैं, वे पहुँचते तो जल्दी हैं, मगर अकेले पहुँचते हैं। दमन गंगा समंदर तक उन सभी गाँवों का धन्यवाद समेटे हुए पहुँचती है, जिनके लिए वह मुड़ी थी।',
      text: 'People who rush past everyone arrive quickly, and arrive alone. The Daman Ganga arrives at the sea trailing the thanks of every village she bent for.' }
  ],
  moral: 'The long way that helps everyone beats the short way that helps no one.',
  source: 'A new telling composed for this app around the real Daman Ganga, which winds through Dadra & Nagar Haveli to the sea at Daman and waters the villages along her way. Told in the riverbank manner of the valley; not a collected tale, and the source says so honestly.'
},

{
  id: 'fk.kokna-honey',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Half for the Bees',
  hook: 'High in the tree hangs a comb full of honey. The boy wants all of it. His uncle takes out his knife — and cuts exactly half.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['शहद', 'shahad', 'honey'], ['मधुमक्खी', 'madhumakkhi', 'bee'], ['आधा', 'aadha', 'half']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दादरा और नगर हवेली के कोकणा लोग जंगल को हमेशा से वैसे ही जानते हैं जैसे तुम अपनी रसोई को जानते हो—कौन-सा पेड़ क्या देता है, कब देता है, और कितना देता है। और जंगल से मिलने वाली हर चीज़ में सबसे मीठा होता है शहद, जो पुराने पेड़ों पर ऊँचे-ऊँचे बड़े छत्तों में लटका रहता है।',
      text: 'The Kokna people of Dadra and Nagar Haveli have always known the forest the way you know your own kitchen — which tree gives what, and when, and how much. And of everything the forest gives, the sweetest is honey, hanging in great combs high in the old trees.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'एक लड़का पहली बार अपने चाचा के साथ शहद इकट्ठा करने गया। वे सुबह जल्दी निकले, मधुमक्खियों को सुस्त करने के लिए धुआँ और पत्तों से बिछी टोकरी लेकर। और उसके चाचा पेड़ पर ऐसे चढ़े जैसे कोई यह काम सौ बार कर चुका हो—क्योंकि वे सचमुच कर चुके थे।',
      text: 'A boy went honey-gathering with his uncle for the first time. They went early, with smoke to make the bees sleepy and a basket lined with leaves, and his uncle climbed like a man who had done it a hundred times, because he had.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'छत्ता बहुत ही बड़ा था — सुनहरा, भारी, सूप जितना बड़ा। नीचे ज़मीन पर खड़े लड़के के मुँह में पानी भर आया। "पूरा निकाल लीजिए, काका!" उसने ऊपर आवाज़ लगाई। "देखिए तो कितना बड़ा है!"',
      text: 'The comb was enormous — golden, heavy, big as a winnowing tray. The boy\'s mouth watered all the way from the ground. "Take it all, kaka!" he called up. "Look at the size of it!"' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'काका ने एक पल के लिए छत्ते को देखा। फिर उन्होंने अपना चाकू निकाला और काटा — पूरा छत्ता नहीं। बस आधा। उन्होंने बाकी आधा छत्ता, मधुमक्खियों समेत, वहीं लटकता छोड़ दिया और नीचे उतर आए।',
      text: 'His uncle looked at the comb for a moment. Then he took out his knife and cut — not the whole comb. Half. He left the other half hanging where it was, bees and all, and came down.',
      ask: {
        q: 'The whole comb was right there in his hand. Why take only half?',
        options: ['Half was all the basket could hold', 'The other half is the bees\' — leave it, and there will be honey next year too', 'He was afraid of the bees'],
        answer: 1,
        right: '"The honey is theirs," said his uncle. "We are guests taking a share. Take it all, and the hive dies — and then who makes honey for anybody?"',
        wrong: 'The basket had plenty of room, and his uncle had climbed to those bees for thirty years without fear. "The honey is theirs," he said. "Take it all, and the hive dies — and then who makes honey for anybody?"'
      } },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'घर लौटते रास्ते में काका ने उसे बाकी बातें भी समझाईं। छत्ते का रानी मक्खी वाला हिस्सा, जिसे कभी नहीं छुआ जाता। वह मौसम जब बिल्कुल शहद नहीं निकाला जाता, क्योंकि तब मधुमक्खियाँ छत्ता बना रही होती हैं। वह पेड़ जिसे इस साल छोड़ दिया जाता है, क्योंकि पिछले साल उससे शहद लिया था।',
      text: 'On the walk home his uncle showed him the rest of it. The queen\'s part of the comb, never touched. The season when you do not gather at all, because the bees are building. The tree you skip this year because you took from it last year.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"आपको ये सारे नियम किसने सिखाए?" लड़के ने पूछा। "मेरे काका ने," काका ने कहा। "और उन्हें, उनके काका ने। किसी को याद नहीं कि सबसे पहला कौन था। शायद जंगल ने ही सबसे पहले वाले को सिखाया होगा — किसी लालची के आगे खाली होकर।"',
      text: '"Who taught you all the rules?" asked the boy. "My uncle," said his uncle. "And him, his uncle. Nobody remembers who was first. The forest taught the first one, probably — by going empty on somebody who was greedy."' },
    { art: ['guard'], who: null,
      hi: 'और इन नियमों का सबूत आज भी जंगल में घूमता दिखता है: कोकणा लोग अनगिनत पीढ़ियों से इन पहाड़ियों से शहद इकट्ठा करते आए हैं, और पहाड़ियों में आज भी मधुमक्खियाँ गूँज रही हैं। दोनों बातें एक साथ सच हैं। यही तो सारा कमाल है।',
      text: 'And the proof of the rules walks about in the forest to this day: the Kokna have gathered honey from these hills for generations beyond counting, and the hills still hum with bees. Both things are true at once. That is the whole trick of it.' },
    { art: ['guard'], who: 'mithu',
      hi: 'आधा लो, आधा छोड़ो। यह शहद के लिए काम करता है। ज़रा सोच कर देखो, तो यह लगभग हर चीज़ के लिए काम करता है।',
      text: 'Take half, leave half. It works for honey. It works, if you think about it, for nearly everything.' }
  ],
  moral: 'Take a share, never the whole — that is how there is always more.',
  source: 'The forest ethic of the Kokna and neighbouring Adivasi communities of Dadra & Nagar Haveli — take a share and leave the hive living — is real and long-practised. This particular uncle-and-nephew telling is composed for this app around that practice, and the source says so honestly.'
},

{
  id: 'fk.dhodia-road',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Road the Grandmothers Remember',
  hook: 'Ask a Dhodia grandmother where the family is from, and she will not name the village you were born in. She will name a road.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['सफ़र', 'safar', 'journey'], ['घर', 'ghar', 'home'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'आज धोड़िया लोग दादरा और नगर हवेली और उसके आस-पास के इलाके में रहते हैं — ज़्यादातर किसान हैं, जो यहीं बस चुके हैं और जिनकी जड़ें यहीं हैं। लेकिन उनके अपने किस्सों में इससे भी पुरानी बात याद रखी गई है: कि एक ज़माने में, बहुत पहले, लोग कहीं और से पैदल चलकर आए थे, उत्तर और पूरब की दूर पहाड़ियों से।',
      text: 'The Dhodia people live today across Dadra and Nagar Haveli and the country round it — farmers, mostly, settled and rooted. But their own tellings remember something older: that once, long ago, the people came from somewhere else, walking, from the hill country away to the north and east.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक लड़की परिवार के एक जमावड़े में अपनी आजी के पास बैठी थी, ऐसा जमावड़ा जहाँ बड़े-बुज़ुर्ग देर रात तक बातें करते हैं, और उसने वही सवाल पूछा जो बच्चे कभी-न-कभी ज़रूर पूछते हैं: "आजी, हम कहाँ से हैं?"',
      text: 'A girl sat with her grandmother at a family gathering, the kind where the old people talk late, and asked the question children always ask sooner or later: "Aaji, where are we from?"' },
    { art: ['guard'], who: 'guard',
      hi: 'उसकी आजी ने अपने गाँव का नाम नहीं बताया, हालाँकि वे चार पीढ़ियों से वहीं रह रहे थे। उन्होंने कहा, "हम आए थे। हमारे पुरखे पैदल चले, अपने बीजों को हिफ़ाज़त से बाँधकर और अपने देवताओं को बड़े जतन से सँभाले हुए। उन्होंने नदियाँ पार कीं, और वे उतरकर इस हरे-भरे इलाके में आए, और यहाँ सब अच्छा लगा, और वे यहीं बस गए।"',
      text: 'Her grandmother did not say the name of their village, though they had lived in it for four generations. She said, "We came. The old people walked, with their seed-grain tied up safe and their gods carried carefully, and they crossed the rivers, and they came down into this green country, and it was good, and they stayed."' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"लेकिन वह तो बहुत पुरानी बात है," लड़की ने कहा। "आपकी आजी की आजी से भी पहले की। हम अब भी यह कहानी क्यों सुनाते हैं? असली रास्ता तो किसी को याद भी नहीं।"',
      text: '"But that was so long ago," said the girl. "Before your grandmother\'s grandmother. Why do we still tell it? Nobody remembers the actual road."',
      ask: {
        q: 'Nobody living has seen the old road. Why keep telling the story of the journey?',
        options: ['In case they ever have to go back', 'Because a people that remembers arriving remembers that home is something you make', 'Because old people like old stories'],
        answer: 1,
        right: 'Her grandmother nodded slowly. "We made this home once, out of walking and work. Remember that, and you will never be afraid of a new beginning."',
        wrong: '"Not to go back," said her grandmother. "We made this home once, out of walking and work. Remember that, and you will never be afraid of a new beginning."'
      } },
    { art: ['guard', 'courtier'], who: null,
      hi: 'तब आजी ने अपनी उँगलियों पर गिनाया कि रास्ते में पुरखे अपने साथ क्या-क्या लेकर चले थे: बोने के लिए बीज। अपने देवताओं के नाम। गीत। शादियाँ रचाने का तौर-तरीका। "हर वह चीज़ जो मायने रखती थी," उन्होंने कहा, "वह उनके हाथों और उनके दिमाग़ में समा गई थी। इस बात पर ध्यान दो।"',
      text: 'Then the grandmother counted off, on her fingers, what the old people had carried on the road: seed for planting. The names of their gods. The songs. The way of doing weddings. "Everything that mattered," she said, "fit in their hands and their heads. Notice that."' },
    { art: ['courtier'], who: null,
      hi: 'लड़की ने चारों तरफ़ उस जमावड़े को देखा — खाना, बातें, गोदी में सोए छोटे बच्चे — और समझ गई कि वह उसी सब के बीच बैठी थी जो वे चलने वाले अपने साथ लाए थे। रास्ता तो पीढ़ियों पहले ख़त्म हो चुका था। पर वह सामान आज भी हर रोज़ इस्तेमाल हो रहा था।',
      text: 'The girl looked around the gathering — the food, the talk, the little ones asleep in laps — and understood that she was sitting inside everything the walkers had carried. The road had ended generations ago. The luggage was still being used every day.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'भारत के कई समुदायों के पास अपने सफ़र की ऐसी ही एक याद होती है, सबकी अपनी-अपनी। यह एक ख़ास तरह का ख़ज़ाना है: एक ऐसी कहानी जो कहती है, हम भी कभी मुसाफ़िर थे, और देखो — हमने यह सब कुछ बनाया।',
      text: 'Many peoples of India carry a journey-memory like this one, each their own. It is a particular kind of treasure: a story that says, we were travellers once, and look — we built all this.' },
    { art: ['guard'], who: 'mithu',
      hi: 'अपने परिवार से पूछो कि वे कहाँ से आए, कैसे आए, और अपने साथ क्या लेकर आए। हर परिवार के भीतर कहीं-न-कहीं एक रास्ता ज़रूर होता है। ज़्यादातर में तो कई होते हैं।',
      text: 'Ask your own family where they came from, and how, and what they carried. Every family has a road in it somewhere. Most have several.' }
  ],
  moral: 'Home is not where you happen to be — it is what your people built, and the story of the building is yours to keep.',
  source: 'The Dhodia community of Dadra & Nagar Haveli and the surrounding country keep an oral memory of having come long ago from hill country to the north-east; tellings differ from family to family, and this one is a household framing of that remembered journey, credited to the Dhodia by name.'
},

{
  id: 'fk.hirwa-green',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'Hirwa of the Green',
  hook: 'There is a god whose whole job is the colour green. In June, everybody in the hills is waiting for him.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DN'],
  words_hi: [['हरा', 'hara', 'green'], ['बारिश', 'baarish', 'rain'], ['खेत', 'khet', 'field']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'मई के आख़िर तक, दादरा और नगर हवेली की पहाड़ियों में सब कुछ भूरा हो जाता है। खेतों में कटी फ़सलों के ठूंठ हैं, नदियाँ सिर्फ़ पत्थर बन चुकी हैं, बड़े-बड़े पेड़ धूल से भरे खड़े हैं, और गर्मी ज़मीन पर किसी सोती हुई भैंस की तरह पसरी रहती है। मई के महीने में, हरे रंग पर यक़ीन कर पाना भी मुश्किल हो जाता है।',
      text: 'By the end of May, in the hills of Dadra and Nagar Haveli, everything is brown. The fields are cut stubble, the streams are stones, the big trees stand dusty, and the heat lies on the land like a sleeping buffalo. It is hard, in May, to believe in green at all.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'लेकिन वारली जानते हैं कि किसका महीना आने वाला है। उनके देवताओं में एक हैं हिरवा — हरे-भरे देवता, उगती हुई चीज़ों के, फूटते बीजों और पत्तों से भरते पेड़ों के देवता, और उन सब चीज़ों के जिन्हें बारिश जगा देती है। ये सूखे-भूरे महीने तो बस हिरवा के सफ़र पर जाने के दिन हैं।',
      text: 'But the Warli know whose month is coming. Among their gods is Hirwa — the green one, the god of growing things, of the sprouting seed and the leafing tree and everything the rain wakes up. The brown months are simply Hirwa away on a journey.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'भीषण गर्मी में एक लड़के ने अपने पिता से पूछा, "अगर वे इस साल वापस न आए तो?" उसके पिता हल ठीक कर रहे थे, तैयारी में जुटे थे, जो अपने आप में एक तरह का जवाब था। उन्होंने कहा, "वे पहले साल से लेकर अब तक हर साल वापस आए हैं। लेकिन फिर भी, उनसे ठीक तरह से विनती करना ही सही है।"',
      text: 'A boy asked his father, in the worst of the heat, "What if he does not come back this year?" His father was mending the plough, getting ready, which is itself a kind of answer. "He has come back every year since the first year," he said. "But it is right to ask him properly, all the same."' },
    { art: ['guard'], who: null,
      hi: 'इसलिए बुवाई से पहले, गाँव हिरवा और उस जगह के देवताओं का आदर-सत्कार करता है — चावल से, मुर्गे या नारियल से, उन पुराने बोलों के साथ जिन्हें जानने वाले बुज़ुर्ग कहते हैं — और साफ़-साफ़ वही माँगता है जो हर जगह के किसान माँगते हैं: ज़रूरत भर बारिश, बहुत ज़्यादा नहीं, और ऐसी हरियाली जो खूब ज़ोर से लहलहा उठे।',
      text: 'So before the sowing, the village honours Hirwa and the gods of the place — with rice, with a fowl or a coconut, with the old words said by the old man who knows them — and asks plainly for what farmers everywhere ask: rain enough, and not too much, and the green to come up strong.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और फिर एक दिन आसमान लोहे के रंग जैसा हो जाता है, और हवा रुख बदलती है और उसमें बहुत दूर से आती गीली मिट्टी की खुशबू भर जाती है।',
      text: 'And then one day the sky goes the colour of iron, and the wind turns and smells of wet earth arriving from far away.',
      ask: {
        q: 'The first fat drops are about to fall on the dust. What happens to the hills now?',
        options: ['Nothing changes for weeks', 'Hirwa comes home — and the whole country turns green almost overnight', 'Only the river fills up'],
        answer: 1,
        right: 'Anyone who has seen a Konkan June knows it. Within days the brown is gone as if it was never there. The green does not creep in. It arrives.',
        wrong: 'Much faster and much bigger than that. Within days the brown hills are green to the very tops. In these parts the green does not creep in. It arrives.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'मेड़ों पर घास। धूल भरे पेड़ों पर पत्ते। पानी से लबालब खेतों में धान की पनीरी हरी लपटों की तरह। रात भर मेंढक ऐसे शोर मचाते हैं मानो पानी उन्होंने ही बनाया हो। यह पूरा इलाक़ा, जो भारत के सबसे छोटे इलाक़ों में से एक है, ऐसी सबसे हरी-भरी जगहों में बदल जाता है जैसी तुमने कभी देखी हो।',
      text: 'Grass on the bunds. Leaves on the dusty trees. Rice seedlings in the flooded fields like green flame. Frogs shouting all night as if they had invented water. The whole territory, one of the smallest in India, becomes one of the greenest places you will ever see.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'और मिट्टी की दीवारों पर बने वारली चित्रों में, बाक़ी सबके बीच इन सबके देवता भी मौजूद हैं — क्योंकि जो लोग बारिश और बीज के सहारे जीते हैं, वे अच्छी तरह जानते हैं कि वे किस देवता के बिना नहीं रह सकते।',
      text: 'And in the Warli paintings on the mud walls, the god of all this is there among the others — because a people who live by the rain and the seed know exactly which god they cannot do without.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगली बार जब तुम साल की पहली असली बारिश को सूखी ज़मीन पर गिरते देखो, तो देखना कि धरती उसे कैसे पीती है। दमन गंगा के ऊपर की पहाड़ियों में कहीं लोग तुम्हें बताएंगे: वह हिरवा हैं, जो फिर से घर लौट आए हैं।',
      text: 'Next time you see the first real rain of the year hit dry ground, watch the earth drink. Somewhere in the hills above the Daman Ganga, they would tell you: that is Hirwa, home again.' }
  ],
  moral: 'The green always comes back — and the people who depend on it have never once taken it for granted.',
  source: 'Hirwa, the green god of growing things in the Warli pantheon, honoured before the sowing in Dadra & Nagar Haveli and the hills around; the monsoon transformation of the territory is plain fact. Credited to the Warli by name; household wordings differ.'
},

/* ============================================== DAMAN & DIU ============== */
{
  id: 'fk.diu-hokka',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Trees That Crossed the Sea',
  hook: 'On the island of Diu grow fat, upside-down-looking trees whose family lives in Africa. How does a tree cross an ocean?',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['पेड़', 'ped', 'tree'], ['समुद्र', 'samudra', 'sea'], ['बीज', 'beej', 'seed']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दीव के छोटे से द्वीप पर घूमो तो कभी न कभी तुम रुककर एक पेड़ को ताकने लगोगे। वह बहुत ही मोटा है — तना जैसे पानी की कोई सलेटी टंकी हो — और ऊपर ठूंठ जैसी छोटी-छोटी डालियाँ, मानो किसी ने उसे उखाड़कर उल्टा लगा दिया हो। दीव में लोग इसे होक्का का पेड़ कहते हैं।',
      text: 'Walk around the little island of Diu and sooner or later you will stop and stare at a tree. It is enormously fat — the trunk like a grey water-tank — with stubby branches on top, as if somebody had pulled it up and planted it upside down. In Diu they call it the hokka tree.' },
    { art: ['pt_elephant'], who: null, mood: 'wow',
      hi: 'अनोखी बात तो यह है। यह पेड़ बाओबाब है — और बाओबाब का पुश्तैनी घर एक समंदर पार अफ़्रीका में है। इसके भाई-बंधु अफ़्रीका के मैदानों में खड़े हैं जहाँ हाथी उनसे अपनी पीठ खुजाते हैं। पूरे भारत में ऐसे बस मुट्ठी भर पेड़ हैं। और दीव, इस अकेले छोटे से द्वीप पर, ये जगह-जगह फैले हुए हैं।',
      text: 'Here is the strange part. This tree is a baobab — and the baobab\'s family home is Africa, an ocean away. Its cousins stand on the African plains where elephants scratch against them. There are only a handful in all of India. And Diu, this one small island, has a whole scatter of them.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'तो दीव का हर बच्चा कभी-न-कभी यह बड़ा ही बढ़िया सवाल पूछता है: पेड़ तैर तो सकते नहीं, और वे नाव का टिकट भी बिल्कुल नहीं खरीद सकते। फिर होक्का यहाँ पहुँचा कैसे?',
      text: 'So every child in Diu eventually asks the excellent question: trees cannot swim, and they certainly cannot buy a boat ticket. How did the hokka get here?',
      ask: {
        q: 'How does an African tree end up growing on an Indian island?',
        options: ['Its seeds floated across the whole ocean by themselves', 'People carried it — sailors and traders crossing the sea long ago', 'Birds flew it across'],
        answer: 1,
        right: 'That is what the trees remember for us. Ships, sailors, and seeds in somebody\'s bundle — the sea road between Africa and India is very, very old.',
        wrong: 'The ocean is too big for a floating seed and too far for a bird with a heavy pod. It was people. Ships, sailors, and seeds in somebody\'s bundle, on the old sea road between Africa and India.'
      } },
    { art: ['courtier'], who: null,
      hi: 'सैकड़ों सालों से भारत के पश्चिमी तट और अफ़्रीका के तट के बीच जहाज़ आते-जाते रहे हैं — कपड़ा, खजूर, लकड़ी, सब चीज़ों का व्यापार करते हुए। उन दिनों, जब दीव एक बड़ा बंदरगाह था और बाद में एक पुर्तगाली बंदरगाह बना, तो कई तटों से आए नाविक इसकी गलियों में घूमा करते थे। किसी ने, कभी न कभी, अपने घर से लाया एक बीज यहाँ बो दिया।',
      text: 'For many hundreds of years, ships have gone back and forth between India\'s west coast and the coast of Africa — trading cloth, dates, timber, everything. In the years when Diu was a great port, and later a Portuguese one, sailors from many coasts walked its lanes. Somebody, sometime, planted a seed from home.' },
    { art: ['pt_elephant'], who: null,
      hi: 'बाओबाब मुसाफ़िरों का बड़ा प्यारा पेड़ है। वह अपने उस मोटे तने में पानी जमा रखता है, खारी हवा और सूखे की कोई परवाह नहीं करता, और इतना लंबा जीता है कि कोई ठीक-ठीक अंदाज़ा भी नहीं लगा सकता। समंदर के किसी छोटे और सूखे टापू पर इसे लगा दो, तो यह कहता है: यह जगह बिल्कुल सही रहेगी।',
      text: 'The baobab is a good traveller\'s tree. It stores water in that fat trunk, shrugs off salt wind and drought, and lives longer than anyone can properly measure. Plant one on a dry little island in the sea and it says: this will do nicely.' },
    { art: ['courtier', 'pt_elephant'], who: null, mood: 'wow',
      hi: 'तो दीव के ये होक्का पेड़ दरअसल बंदरगाह का जीता-जागता हिसाब-किताब हैं। इनमें से हर एक पेड़ कहता है: जहाज़ दूर-दूर से यहाँ आए, और जहाज़ों के साथ लोग आए, और जो कुछ वे अपने साथ लाए थे, उसमें से कुछ ने यहाँ अपनी जड़ें जमा लीं। तुम इसे बिना एक भी किताब खोले पढ़ सकते हो — बस पेड़ के नीचे खड़े हो जाओ और ऊपर देखो।',
      text: 'So the hokka trees of Diu are living harbour records. Every one of them says: ships came here from far away, and people came with the ships, and some of what they carried put down roots. You can read it without opening a single book — just stand under the tree and look up.' },
    { art: ['courtier'], who: null,
      hi: 'दीव के लोग इसके फल इस्तेमाल करते हैं, इसकी छांव में आराम करते हैं, और बाहर से आने वालों को बड़े अपनेपन और गर्व के साथ ये पेड़ दिखाते हैं। समंदर पार करके आया यह पेड़ अब पीढ़ियों से पक्का दीव-वाला बन चुका है — और अगर सोच कर देखो, तो दुनिया के हर बंदरगाह वाले शहर की यही कहानी है।',
      text: 'The people of Diu use the fruit, rest in the shade, and point the trees out to visitors with a certain owner\'s pride. The tree that crossed the sea is a Diu-wallah now, generations deep — which is, when you think about it, the story of every port town in the world.' },
    { art: ['pt_elephant'], who: 'mithu',
      hi: 'एक बंदरगाह उन सभी समंदरों के तोहफ़े सँभाल कर रखता है, जिन्हें उसने कभी छुआ हो। कुछ तोहफ़े म्यूज़ियम में रखे हैं। और जो सबसे अच्छे हैं, वे ज़िंदा हैं, और आज भी छांव दे रहे हैं।',
      text: 'A port keeps gifts from every sea it has ever touched. Some are in the museum. The best ones are alive, and still making shade.' }
  ],
  moral: 'Look closely at what grows in a place, and it will tell you who has visited.',
  source: 'The baobabs of Diu — locally called hokka — are real and much loved, a living trace of the old Indian Ocean trade between Africa and India\'s west coast through the port of Diu. How each tree arrived is not recorded; the sea road that brought them is well documented.'
},

{
  id: 'fk.daman-lighthouse',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Keeper of the Small Light',
  hook: 'Every evening, one old man climbed one dark stair to light one small lamp. The whole sea depended on it.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['रोशनी', 'roshni', 'light'], ['किनारा', 'kinara', 'shore'], ['भरोसा', 'bharosa', 'trust']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"जहाँ दमन गंगा नदी समुद्र से मिलती है, वहाँ मछुआरों के बंदरगाह के ऊपर नानी दमन का पुराना क़िला खड़ा है, और उसकी दीवार के ऊपर उठता है एक लाइटहाउस। यह कहानी उसी लाइटहाउस के रखवाले की है, उस ज़माने की जब दमन पुर्तगालियों का शहर हुआ करता था और बत्ती बिजली से नहीं, तेल से जलती थी।"',
      text: 'Where the Daman Ganga meets the sea, the old fort of Nani Daman stands over the fishing harbour, and above its wall rises a lighthouse. This is a tale told about a keeper of that light, in the years when Daman was a Portuguese town and the lamp burned oil, not electricity.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"वे एक बूढ़े व्यक्ति थे, और सीढ़ियाँ बहुत खड़ी थीं, फिर भी वे अपनी ज़िंदगी की हर एक शाम उन्हें चढ़ते थे — ऊपर लैंप वाले कमरे तक जाना, बत्ती तराशना, काँच चमकाना और लौ जलाना। फिर वे घिरते अँधेरे में समंदर की ओर देखते और शहर के रिवाज़ के मुताबिक, दूर समंदर में मौजूद हर नाव से कहते, \\"बोआ नोइते\\" — यानी पुर्तगाली में, शुभ रात्रि।"',
      text: 'He was an old man, and the stair was steep, and he climbed it every single evening of his life — up into the lamp room, trim the wick, polish the glass, light the flame. Then he would look out at the darkening sea and say, in the way of the town, "Boa noite" — good night, in Portuguese — to every boat still out.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"उनका पोता कभी-कभी उनके साथ चढ़ता था, सीढ़ियाँ गिनता जाता और उनमें से ज़्यादातर की शिकायत भी करता जाता। \\"यह कितना छोटा सा लैंप है,\\" एक शाम लड़के ने कहा। \\"समंदर इतना बड़ा है। इससे क्या फ़र्क पड़ सकता है?\\""',
      text: 'His grandson climbed with him sometimes, counting the steps and complaining about most of them. "It is such a small lamp," the boy said one evening. "The sea is so big. What difference can it make?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: '"रखवाले ने लैंप को टाँगा और उसकी लौ को स्थिर होते देखा। \\"समंदर को किसी बड़ी रोशनी की ज़रूरत नहीं होती,\\" उन्होंने कहा। \\"उसे ऐसी रोशनी चाहिए जो हमेशा मौजूद रहे। किसी भी मछुआरे से पूछ लो कि उसे क्या पसंद होगा — कभी-कभार जलने वाला अलाव, या हर रात उसी एक जगह जलने वाली मोमबत्ती।\\""',
      text: 'The keeper hung the lamp and watched it steady. "The sea does not need a big light," he said. "It needs a light that is always there. Ask any fisherman which he would rather have — a bonfire sometimes, or a candle every night, always in the same place."',
      ask: {
        q: 'Which light is worth more to a boat coming home in the dark?',
        options: ['A huge bright fire that burns some nights', 'A small lamp that burns every night without fail, in the same place', 'They are worth the same'],
        answer: 1,
        right: 'Every sailor answers the same way. A light you can count on is a place on the map. A light that comes and goes is worse than none.',
        wrong: 'Ask the fishermen at Nani Daman. A small light that never fails is a place on the map — you steer home by it. A big light that comes and goes is worse than none.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: '"मॉनसून की एक रात हवा बहुत तेज़ और तिरछी चलने लगी, और मछुआरों का बेड़ा अभी भी समंदर में ही था। उस रात उस खड़खड़ाते लैंप रूम में लौ को जलता रखने के लिए रखवाले तीन बार सीढ़ियाँ चढ़े, और जब भी हवा का झोंका लौ तक पहुँचता, वे अपने हाथों की ओट देकर उसे बचा लेते।"',
      text: 'One monsoon night the wind came in hard and sideways, and the fishing fleet was still out. The keeper climbed the stair three times that night to keep the flame alive in the rattling lamp room, cupping it with his own hands when the draught found it.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और बाहर उस काले पानी पर, एक-एक करके, दमन के मछुआरों ने हिलते-डुलते अँधेरे के पूरे समंदर में उस एक स्थिर बिंदु को ढूँढ निकाला, अपनी नावों का सिरा उसी की सीध में रखा, और क़िले की दीवार पार कर नदी के शांत पानी में लौट आए — पूरी तरह भीगे हुए, नाव से पानी उलीचते हुए, और ज़िंदा।"',
      text: 'And out on the black water, boat by boat, the fishermen of Daman found the one steady point in a whole world of moving dark, and lined their bows on it, and came in past the fort wall into the calm of the river — soaked, bailing, and alive.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: 'लाईटहाउस के रखवाले की किसी ने जय-जयकार नहीं की। शायद ही किसी को यह बात सूझी भी हो। हमेशा की तरह सुबह होते ही उसने बत्ती बुझाई, बंदरगाह से "बोम दिया" — यानी सुप्रभात — कहा, और लंबी सीढ़ियाँ उतरकर अपनी चाय पीने चला गया। नावें किनारे लौट आई थीं। रोशनी अपना काम कर चुकी थी। बस, बात इतनी ही थी।',
      text: 'Nobody cheered the keeper. Hardly anyone knew to. He put out the lamp at dawn as always, said "Bom dia" — good morning — to the harbour, and went down the long stair to his tea. The boats were in. The light had done its work. That was the whole of it.' },
    { art: ['guard'], who: 'mithu',
      hi: 'नानी दमन के ऊपर वह लाईटहाउस आज भी खड़ा है, और उस तट पर हर रात बत्तियाँ अब भी जलती हैं, जिन्हें ऐसे लोग सँभालते हैं जिनके नाम नावों को कभी पता नहीं चलते। जिस भी रोशनी के सहारे तुम अपनी राह तय करते हो, उसकी रखवाली कोई न कोई ज़रूर कर रहा होता है। यह बात याद रखने लायक है।',
      text: 'The lighthouse still stands over Nani Daman, and lights still burn on that coast every night, tended by people whose names the boats never learn. Somebody keeps every light you steer by. It is worth remembering.' }
  ],
  moral: 'Be the small light that never fails, not the big one that sometimes does.',
  source: 'The fort of Nani Daman and its lighthouse over the fishing harbour are real, as is Daman\'s Portuguese-era history. This keeper\'s tale is a new telling composed for this app in the manner of the coast\'s stories, and the source says so honestly rather than inventing a collector.'
},

{
  id: 'fk.nagoa-shankh',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Shell That Called the Boats',
  hook: 'Before there were phones, before there were sirens, the beach at Nagoa had a way to call every boat home: one boy and one enormous shell.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['शंख', 'shankh', 'conch shell'], ['आवाज़', 'awaaz', 'sound'], ['तूफ़ान', 'toofan', 'storm']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दीव द्वीप की नागोवा खाड़ी चाँद की तरह मुड़ी हुई है, और वहाँ के मछुआरे परिवार इतने पुराने ज़माने से काम करते आए हैं जितना किसी की परदादी की परदादी को भी याद न हो। समंदर मछलियाँ देता है, और सीपियाँ — और कभी-कभार बहुत लंबे अरसे में एक बड़ा सा शंख भी देता है, किसी छोटे बच्चे के सिर जितना बड़ा।',
      text: 'The bay at Nagoa, on the island of Diu, curves like a moon, and the fishing families have worked it for as long as anyone\'s grandmother\'s grandmother could say. The sea gives fish, and shells — and once in a long while, it gives a great conch, a shankh, big as a baby\'s head.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'तूफ़ान के बाद एक लड़के को लहरों के किनारे रेत में आधा दबा हुआ ऐसा ही एक शंख मिला, और वह उसे दोनों हाथों से थामकर घर ले आया। उसके दादाजी ने उसे एक बार उलट-पलट कर देखा और सिर हिलाया। "यह कोई खिलौना नहीं है," उन्होंने कहा। "यह एक आवाज़ है। इसे यहाँ लाओ, मैं तुम्हें दिखाता हूँ।"',
      text: 'A boy found one after a storm, half buried at the tideline, and carried it home with both arms. His grandfather turned it over once and nodded. "That is not a toy," he said. "That is a voice. Bring it here and I will show you."' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'बुज़ुर्ग ने शंख को अपने होंठों से लगाया और फूँक मारी — और उसमें से ऐसी आवाज़ निकली जिसे लड़के ने कानों से सुनने से पहले अपनी छाती में महसूस किया। गहरी, गूँजती हुई और बहुत भारी। वह खाड़ी के ऊपर ऐसे गरजती हुई फैली जैसे बादल गरजते हैं, और समुद्र तट पर मौजूद हर सिर एक साथ ऊपर उठ गया।',
      text: 'The old man put the shell to his lips and blew — and out of it came a sound the boy felt in his chest before he heard it in his ears. Deep, round, enormous. It rolled out over the bay the way thunder rolls, and every head on the beach came up at once.' },
    { art: ['guard'], who: 'guard',
      hi: '"जब मैं छोटा था, तब यही इस तट की आवाज़ हुआ करती थी," दादाजी ने कहा। "एक लंबी फूँक: वापस लौट आओ, मौसम बिगड़ रहा है। दो फूँक: सब सुरक्षित हैं, सबकी गिनती हो गई है। जहाँ लहरों के किनारे चीख भी दम तोड़ देती है, वहाँ चट्टानों के उस पार तक शंख की गूँज सुनाई देती है। समंदर ने ही हमें यह हुनर सिखाया, और यह साज़ भी उसी ने दिया।"',
      text: '"When I was young, this was the beach\'s voice," said his grandfather. "One long blast: come in, weather is turning. Two: all safe, all counted. A shell can be heard past the reef when a shout dies at the surf line. The sea taught us that trick, and gave us the instrument too."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'तो वह लड़का अभ्यास करता रहा — चेहरा लाल, सिर चकराता हुआ, और मुँह से ज़्यादातर बत्तखों जैसी आवाज़ें निकलती हुईं — जब तक कि एक दोपहर शंख से सचमुच की आवाज़ नहीं निकली, जिससे सबसे ज़्यादा वह खुद ही चौंक गया। और फिर मौसम के ढलते एक दिन ऐसा आया, जब पश्चिम में आसमान का रंग अजीब सा हरा-धूसर हो गया और सारी नावें बाहर समुद्र में थीं।',
      text: 'So the boy practised — red-faced, dizzy, producing mostly duck noises — until one afternoon the real sound came out of the shell, and startled him more than anyone. And then came a day, late in the season, when the sky to the west went a bad green-grey and the boats were all out.',
      ask: {
        q: 'The weather is turning fast and the boats are beyond the reef. What must the boy do?',
        options: ['Run along the beach shouting', 'Blow one long blast, and keep blowing it', 'Wait for the boats to notice the sky themselves'],
        answer: 1,
        right: 'One long blast, again and again — the old signal. His grandfather counted the boats in as they came.',
        wrong: 'Shouting dies at the surf, and the sky can hide behind a sail. He blew the shell — one long blast, again and again — and his grandfather counted the boats in.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'चट्टानों के पार नावों ने वह आवाज़ सुनी, वे मुड़ीं, और पहली तूफ़ानी हवा के पीछे-पीछे उछलती लहरों को चीरती हुई लौट आईं, और जैसे ही बारिश दीवार की तरह आ गिरी, आखिरी नाव भी शांत पानी में सुरक्षित पहुँच गई। तब दो छोटी फूँकें बजीं, हालाँकि मूसलाधार बारिश में उन्हें कोई नहीं सुन सका: सब सुरक्षित थे। सबकी गिनती पूरी थी।',
      text: 'The boats heard it past the reef, and turned, and came in through the chop with the first squall chasing them, and the last one crossed into the calm as the rain arrived like a wall. Two short blasts then, though nobody could hear them in the downpour: all safe. All counted.' },
    { art: ['guard'], who: null,
      hi: 'उस लड़के ने वह शंख ज़िंदगी भर अपने पास रखा, एक ऐसे ताक पर जहाँ नमकीन समुद्री हवा उस तक पहुँच सके, और वह उसे त्योहारों पर बजाता था जब यह मंदिर की एक पवित्र और खुशियों भरी आवाज़ बन जाता था। लेकिन वह उसे वैसे ही चमकाकर रखता था जैसे काम आने वाले औज़ार को रखा जाता है, क्योंकि वह जानता था कि वह सिर्फ़ एक शंख नहीं, कुछ और भी था।',
      text: 'The boy kept that shankh all his life, on a shelf where the salt air could reach it, and blew it on festival days when it was a temple sound and a happy one. But he kept it polished the way you keep a working tool, because he knew what else it was.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आजकल तो मौसम का हाल नाव में रखे फोन पर आ जाता है। लेकिन अगर तुम किसी बड़े शंख को अपने कान से लगाओ, तो कहते हैं कि तुम्हें समुद्र की आवाज़ सुनाई देती है — और अगर तुम उसे बजाना सीख जाओ, तो याद रखना: तुमने समुद्र तट का सबसे पुराना लाउडस्पीकर थाम रखा है।',
      text: 'These days the weather report comes to a phone in the boat. But if you hold a big shell to your ear, they say you hear the sea — and if you learn to blow one, remember: you are holding the beach\'s oldest loudspeaker.' }
  ],
  moral: 'The best tools are the ones the sea itself hands you — if you learn to use them.',
  source: 'Nagoa bay and its fishing families are real, and the conch as signal and temple voice is an old coastal practice. This particular boy-and-shell telling is composed for this app in the Koli fisher manner of the coast, and the source says so honestly.'
},

{
  id: 'fk.diu-fort-cat',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Cat of the Sea Fort',
  hook: 'The great fort of Diu has walls, cannons and a lighthouse. It also has a cat, and the cat believes she outranks everybody.',
  hero: 'pt_mouse',
  cast: ['pt_mouse', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['किला', 'qila', 'fort'], ['बिल्ली', 'billi', 'cat'], ['पहरा', 'pehra', 'guard duty']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दीव का समुद्री किला करीब पाँच सौ साल पुराना है — पुर्तगालियों के ज़माने का बना हुआ, चट्टान जैसी ऊँची दीवारों वाला, पत्थरों को काटकर बनाई गई खाई और सोते हुए मगरमच्छों की तरह यहाँ-वहाँ पड़ी पुरानी तोपों वाला। कभी जहाज़ इससे थर्राते थे। अब स्कूली बच्चे यहाँ पिकनिक मनाते हैं। और एक बिल्ली इस किले पर राज करती है।',
      text: 'The sea fort of Diu is nearly five hundred years old — built in the days of the Portuguese, with walls like cliffs, a moat cut from rock, and old cannons still lying about like sleeping crocodiles. Ships once feared it. Schoolchildren now picnic in it. And a cat runs it.' },
    { art: ['pt_mouse', 'guard'], who: null,
      hi: 'किले में हमेशा से एक बिल्ली रही है — रखवाले यही कहानी सुनाते हैं। पुराने ज़माने में किले में अनाज और बारूद के गोदाम हुआ करते थे, और जहाँ अनाज का भंडार हो वहाँ चूहे होते हैं, और जहाँ चूहे हों, वहाँ बिल्ली कोई पालतू जानवर नहीं होती। बिल्ली वहाँ की कर्मचारी होती है।',
      text: 'There has always been a fort cat — that is the story the caretakers tell. In the old days the fort kept storerooms of grain and gunpowder, and where there is stored grain there are rats, and where there are rats, a cat is not a pet. A cat is staff.' },
    { art: ['guard'], who: 'guard',
      hi: 'कहानी कहती है कि पुराने ज़माने के सिपाही क़िले की पहली बिल्ली को अपने खाने में से खिलाते थे, क्योंकि वह अपने ख़ास काम में दस सिपाहियों के बराबर थी। उसकी निगरानी में कोई चूहा बोरियों को कुतर नहीं पाता था। वह रात के वक़्त किसी नन्ही धारीदार हवलदार की तरह दीवारों पर गश्त लगाती थी, और हर चीं-चीं करने वाला जीव उससे दूर ही रहता था।',
      text: 'The soldiers of long ago fed the first fort cat from their own rations, the tale goes, because she was worth ten of them at her particular job. No rat chewed the sacks on her watch. She patrolled the walls at night like a small striped sergeant, and everything squeaky kept its distance.' },
    { art: ['pt_mouse'], who: null, mood: 'think',
      hi: 'उन सिपाहियों को गुज़रे सदियाँ बीत चुकी हैं। अनाज के गोदाम अब खाली कमरे हैं जहाँ अबाबीलें घोंसले बनाती हैं। लेकिन आज भी अगर आप क़िले में जाएँ, तो पूरी उम्मीद है कि वहाँ एक बिल्ली मिल ही जाएगी — धूप से गरमाई तोप पर सोई हुई, जिसका एक कान रडार की तरह आपकी आहट पर घूम जाता है।',
      text: 'The soldiers are centuries gone. The grain stores are empty rooms where swallows nest. But go to the fort today and, likely as not, a cat is there — asleep on a cannon the sun has warmed, one ear turning to follow you like a radar.',
      ask: {
        q: 'The rats and the grain are long gone. Why does the fort still suit a cat so well?',
        options: ['Cats like history', 'Warm stones, high walls, fish from the harbour, and nobody telling her what to do', 'She is waiting for the soldiers to come back'],
        answer: 1,
        right: 'A fort is simply a palace, if you are a cat. Sun-warmed stone, walls to walk, the harbour smell of fish on the wind, and total command of the garrison.',
        wrong: 'Nothing so sentimental. A fort is simply a palace, if you are a cat — warm stone, walls to walk, fish on the harbour wind, and total command of the garrison.'
      } },
    { art: ['pt_mouse', 'guard'], who: null,
      hi: 'सैलानी नज़ारा देखने के लिए क़िले की चोटी पर बने लाइटहाउस पर चढ़ते हैं — वही दूर-दूर तक फैला नीला समंदर, जिस पर कभी तोपें नज़र रखती थीं। बिल्ली दीवार पर बैठकर बड़े पेशेवर अंदाज़ में वही नज़ारा देखती है, ठीक वैसे ही जैसे उसकी पुरखिनें अनाज के भंडार पर नज़र रखती थीं। पुरानी आदतें, नई सदियाँ।',
      text: 'Visitors climb to the lighthouse at the fort\'s top for the view — the whole blue sweep of sea that the cannons once watched. The cat takes the same view from the wall, professionally, the way her ancestors watched the granary. Old habits, new centuries.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'यहाँ आने वाले बच्चे उसे हमेशा ढूँढ लेते हैं, या वह खुद उन्हें ढूँढ लेती है — किसी कस्टम अफ़सर की तरह ऐन सही वक़्त पर पिकनिक की टोकरी के पास आ धमकती है। उसे कुछ खिलाइए, तो वह बड़े अदब से उसे कुबूल कर लेती है, जैसे बहुत दिनों से अटका हुआ किराया वसूल रही हो। आख़िरकार, यह क़िला उसी का तो है। किसी और मालिक के होने के सारे रिकॉर्ड संदिग्ध हैं।',
      text: 'Children who visit always find her, or she finds them — materialising beside a picnic with the timing of a customs officer. Feed her something and she accepts it graciously, as rent long owed. This is, after all, her fort. Records of any other owner are disputed.' },
    { art: ['pt_mouse'], who: null,
      hi: 'और बंद होने के वक़्त, जब आख़िरी सैलानी पुरानी खाई को पार कर लौट जाता है और फाटक बंद हो जाता है, तब क़िला अपनी असली छावनी के हवाले हो जाता है: अबाबीलें, झरोखों से गुज़रती समुद्री हवा, और दीवार पर पहरा देती एक अकेली बिल्ली, जैसे-जैसे ढलती धूप सुनहरी होती जाती है।',
      text: 'And at closing time, when the last visitor crosses back over the old moat and the gate is shut, the fort returns to its true garrison: the swallows, the sea wind in the embrasures, and one cat on the wall, on watch, as the light goes gold.' },
    { art: ['guard'], who: 'mithu',
      hi: 'हर पुरानी और आलीशान जगह के अपने छोटे रखवाले होते हैं — महल की गौरैया, रेलवे प्लेटफ़ॉर्म का कुत्ता, क़िले की बिल्ली। ये ऐतिहासिक इमारतें इतिहास की धरोहर हैं। और इतिहास, बदले में, उसी का होता है जो सचमुच वहाँ रहता है।',
      text: 'Every grand old place has its small caretakers — the sparrows of the palace, the dog of the railway platform, the cat of the fort. The monuments belong to history. History, in turn, belongs to whoever actually lives there.' }
  ],
  moral: 'Grand places are kept alive by small, unofficial staff — and it is polite to acknowledge them.',
  source: 'The Portuguese-built sea fort of Diu, its moat, cannons and lighthouse, is real; forts everywhere kept cats for their granaries, and Diu\'s visitors will confirm the current management. This telling is composed for this app, warmly, and the source says so honestly.'
},

{
  id: 'fk.gangeshwar-tide',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Shrine the Sea Visits',
  hook: 'Most temples are washed by their priests. At this one, twice a day, the sea itself walks in and does it.',
  hero: 'shiva',
  cast: ['shiva', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['लहर', 'lehar', 'wave'], ['मंदिर', 'mandir', 'temple'], ['ज्वार', 'jwaar', 'tide']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दीव के पथरीले किनारे पर, नीचे लहरों के कुंडों के बीच, जहाँ ज़मीन समंदर से जा मिलती है, गंगेश्वर नाम का एक छोटा सा धाम है। न तो इसका कोई ऊँचा शिखर है, न कोई बड़ा मंडप। यहाँ तो चट्टान में नीचे स्थापित पाँच शिवलिंग हैं — और उनका पुजारी खुद यह समंदर है।',
      text: 'On the rocky shore of Diu, down among the tide pools where the land gives way to the sea, there is a small shrine called Gangeshwar. It has no tall tower and no great hall. It has five shivlings, set low in the rock — and it has the ocean for a priest.' },
    { art: ['shiva'], who: null,
      hi: 'दीव में यह कथा कुछ यूँ सुनाई जाती है। बहुत पुरानी बात है, अपने वनवास के दिनों में, पाँचों पांडव भाई इस तट पर पहुँचे। वे शिवजी की पूजा करना चाहते थे, पर वहाँ कोई मंदिर नहीं था — इसलिए हर भाई ने समंदर के किनारे, उसी जीती-जागती चट्टान में एक-एक शिवलिंग स्थापित कर दिया, पाँचों एक साथ।',
      text: 'This is how the katha is told in Diu. Long ago, in their years of wandering, the five Pandava brothers came along this shore. They wished to worship Shiva, and there was no temple — so each brother set a shivling in the living rock, five together, at the edge of the sea.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'कथा कहती है कि उन्होंने यह जगह पूरी तरह सोच-समझकर चुनी थी। ऊपर सूखे किनारे पर सुरक्षित नहीं। बल्कि नीचे, पानी की सीमारेखा पर, जहाँ समंदर आसानी से पहुँच सके। और जब ज्वार आया और पहली लहर ने पाँचों लिंगों को नहला दिया, तो भाइयों ने देखा कि सब कुछ बिल्कुल सही था, और वे संतुष्ट होकर अपने रास्ते आगे बढ़ गए।',
      text: 'They chose the spot, the telling goes, with open eyes. Not safely up the beach. Down at the tideline, where the sea could reach. And when the tide came in and the first wave washed over the five lings, the brothers saw that it was exactly right, and went on their way content.' },
    { art: ['shiva'], who: null, mood: 'think',
      hi: 'क्योंकि हर दिन दो बार, बिना चूके, समंदर उमड़ता है और चट्टानों पर सरसराता हुआ आता है, पाँचों शिवलिंगों पर खुद को उंडेल देता है, और फिर वापस बह जाता है — उन्हें धुला हुआ, चमकता हुआ और झाग की माला पहनाए छोड़कर।',
      text: 'Because twice every day, without fail, the sea rises and comes hushing in over the rocks, and pours itself over the five shivlings, and drains away again — leaving them washed, gleaming, and garlanded with foam.',
      ask: {
        q: 'In a temple, pouring water over the shivling is the abhishek — the honouring bath. Who performs it at Gangeshwar?',
        options: ['The priests of Diu, at dawn', 'The tide — the sea itself does it, twice a day, and has never once missed', 'Pilgrims who carry seawater up in pots'],
        answer: 1,
        right: 'That is the wonder of the place. The ocean performs the abhishek — on time, twice a day, since the day the shrine was made.',
        wrong: 'People bring flowers and prayers — but the bath itself is the sea\'s duty. The tide performs the abhishek, twice a day, and has never once missed.'
      } },
    { art: ['courtier', 'shiva'], who: null, mood: 'wow',
      hi: 'तीर्थयात्री ज्वार-भाटे के हिसाब से ही यहाँ आने का समय तय करते हैं, जिससे यह दुनिया के उन गिने-चुने मंदिरों में से एक बन जाता है जिसका समय खुद चाँद तय करता है। भाटे के समय आप पास बैठ सकते हैं, चट्टानों में पानी की साँसें सुन सकते हैं, और ठंडे पत्थर को छू सकते हैं। और जब ज्वार आता है, तो समंदर आपसे कहता है कि ज़रा पीछे हटिए और अपनी बारी का इंतज़ार कीजिए।',
      text: 'Pilgrims time their visit by the tide chart, which must make this one of the few temples anywhere with the moon for a timetable. At low tide you can sit close, hear the water breathe in the rocks, and touch the cool stone. At high tide, the sea asks you to step back and wait your turn.' },
    { art: ['courtier'], who: null,
      hi: 'लोग भीगी चट्टान पर फूल चढ़ाते हैं, और अगली ही लहर उन्हें समेटकर अपने साथ बहा ले जाती है — और इस धाम में, ऐसा बिल्कुल नहीं लगता कि भेंट बहकर खो गई। बल्कि ऐसा लगता है कि भेंट स्वीकार कर ली गई है।',
      text: 'People leave flowers on the wet rock, and the next wave gathers them up and carries them out — which, at this shrine, does not feel like the offering being lost. It feels like the offering being accepted.' },
    { art: ['shiva'], who: null,
      hi: 'कहते हैं, गंगा शिवजी की जटाओं में रहती हैं — जब वह स्वर्ग से उतरीं, तो यह महान नदी उनकी लटों में समा गई थी। गंगेश्वर में ऐसा लगता है मानो ठीक यहीं आकर कहानी उलट गई हो: पानी दिन में दो बार उनके पास आता है, बिल्कुल वैसे ही जैसे कोई नदी झुककर प्रणाम कर रही हो।',
      text: 'Ganga, they say, lives in Shiva\'s hair — the great river caught in his locks as she fell from heaven. At Gangeshwar it is as if the story turned itself around, just here: the water comes to him, twice a day, respectful as a river bowing.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'कई परिवारों में कहा जाता है कि पूरी दुनिया अपने-अपने तरीके से पूजा करती है — पक्षी भोर में गाकर, और पेड़ फूल खिलाकर। दीव में लोग आपको समुद्र को ऐसा करते हुए दिखा सकते हैं। अपने परिवार से पूछिए कि वे इस बारे में क्या सोचते हैं; इस पर कितनी अच्छी बातचीत हो सकती है।',
      text: 'In many families it is said the whole world worships in its own way — the birds by singing at dawn, the trees by flowering. In Diu they can show you the sea doing it. Ask your family what they think of that; it is a good conversation.' }
  ],
  moral: 'Holiness is not always behind high walls — sometimes it sits in the open, where the sea can reach it.',
  source: 'The Gangeshwar Mahadev shrine on the Diu shore, its five tide-washed shivlings, and the katha connecting them to the five Pandavas, as the tradition of the place tells it. A living shrine, told from the inside; the katha is presented as it is told.'
},

{
  id: 'fk.koli-stars',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Fisherman\'s Compass',
  hook: 'The shiny brass compass fell into the sea. The grandfather laughed — because the real compass was still aboard.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['तारा', 'taara', 'star'], ['हवा', 'hawa', 'wind'], ['दिशा', 'disha', 'direction']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दमन के मछुआरा परिवार — कोली और माछी लोग, जिनकी नावें अनगिनत पीढ़ियों से इस तट पर उतरती रही हैं — तब से समुद्र में जा रहे हैं जब किसी के पास कोई यंत्र भी नहीं होता था। उन्हीं के अंदाज़ में यह एक कहानी है, एक बच्ची, उसके दादाजी, और एक बहुत ही चमकदार कंपास के बारे में।',
      text: 'The fisher families of Daman — Koli and Machhi people, whose boats have worked this coast for generations past counting — put to sea long before anyone aboard owned an instrument. This is a tale in their manner, about a girl, her grandfather, and a very shiny compass.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'लड़की ने बाज़ार से इसे खरीदने के लिए पैसे जोड़े थे: पीतल का बना, एक सुई जो जादू की तरह घूमती थी और एक ढक्कन जो \'क्लिक\' की आवाज़ के साथ बंद होता था। वह बड़े गर्व के साथ इसे अपने दादाजी की नाव पर लेकर आई। दादाजी ने बड़े चाव से उसकी तारीफ की, जैसे दादाजी किया करते हैं, और उसे संभालकर नाव के पटरे पर रख दिया।',
      text: 'The girl had saved up for it at the market: brass, with a needle that swung like magic and a lid that clicked. She brought it aboard her grandfather\'s boat with enormous pride. Her grandfather admired it properly, the way grandfathers do, and put it carefully on the thwart.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"अब आप कभी रास्ता नहीं भटकेंगे, दादाजी," उसने कहा। दादाजी ने समुद्र की ओर देखा और वैसी ही हल्की-सी आवाज़ निकाली जैसी पुराने मछुआरे निकालते हैं, जिसका कुछ भी मतलब हो सकता है। "मैं साठ सालों में कभी नहीं भटका," उन्होंने कहा। "लेकिन यह कंपास वाकई बहुत बढ़िया है।"',
      text: '"Now you can never be lost, dada," she said. Her grandfather looked at the sea and made the small sound old fishermen make, which can mean anything. "I have not been lost in sixty years," he said. "But it is a fine compass."' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'वे बहुत दूर निकल आए थे, जहाँ से दमन का सपाट किनारा दिखना बंद हो गया था, तभी पानी की एक लहर पटरे से टकराई और कंपास नाव से नीचे गिर गया — बस एक पल को चमका, और पानी में समा गया। बच्ची फूट-फूट कर रोने लगी। उसकी सारी जमा-पूँजी चली गई थी, और उससे भी बुरा यह था कि अब उसे पक्का यकीन हो गया था कि वे रास्ता भटक चुके हैं।',
      text: 'They were far out, past sight of the flat Daman shore, when a swell knocked the thwart and the compass went over the side — one gleam, and gone. The girl burst into tears. All her savings, and worse: now, she was sure, they were lost.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'उसके दादाजी ने पतवार के पास उसे अपने पास खींच लिया। "रास्ता भटक गईं? अपने चारों तरफ़ देखो। अगर सुई पढ़ना आता हो, तो यह पूरा समंदर ही एक कम्पास है। मुझे बताओ — अभी इस वक़्त तुम्हें क्या दिख रहा है और क्या महसूस हो रहा है?"',
      text: 'Her grandfather pulled her in beside him at the tiller. "Lost? Look about you. The whole sea is a compass, if you know how to read the needle. Tell me — what do you see and feel, right now?"',
      ask: {
        q: 'No compass, no land in sight. What can still show a fisher family the way home?',
        options: ['Nothing — without the instrument you drift', 'The swell\'s direction, the wind, the birds\' evening flight, the sun and stars', 'Only luck'],
        answer: 1,
        right: '"Now you are reading it," said her grandfather. "The swell has run from the southwest all day. The birds go home to land at dusk. The sun sets over the open sea. Home is that way — and always was."',
        wrong: '"Drift? Luck?" Her grandfather snorted. "The swell has run from the southwest all day. The birds go home to land at dusk. The sun sets over the open sea. Read those, and home is that way — and always was."'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'वापसी के पूरे रास्ते वे उसे दिखाते रहे: पानी उथला होने पर लहरें कैसे मुड़ती हैं, शाम के वक़्त ज़मीन की तरफ़ से आने वाली हवा की महक कैसे बदल जाती है, और पहला तारा ठीक वहीं कैसे चमकता है जहाँ उनके दादाजी के ज़माने में चमकता था। आसमान चाँदी की बिंदियों से सजे नक्शे की तरह निखर आया, और उन्होंने उन तारों के नाम बताए जिनकी मदद से मछुआरे नाव संभालते हैं।',
      text: 'All the way in he showed her: how the swell bends as the water shallows, how the wind smells different off the land in the evening, how the first star hangs where it hung for his grandfather. The sky came out like a chart pricked in silver, and he named the stars fishermen steer by.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'दमन की बत्तियाँ ठीक वहीं नज़र आईं जहाँ उन्होंने बताया था। "दुकान वाला कम्पास अच्छा होता है," नाव बाँधते हुए उन्होंने कहा। "एक और ख़रीद लेना। लेकिन इसे भी" — उन्होंने उसके माथे को थपथपाया — "हमेशा चालू रखना। औज़ार समंदर में गिर जाते हैं। जो तुम जानती हो, वह तैरता रहता है।"',
      text: 'They raised the lights of Daman exactly where he said they would be. "The shop compass is good," he said, tying up. "Buy another. But keep this one too" — he tapped her forehead — "wound up and working. Instruments fall in the sea. What you know floats."' },
    { art: ['guard'], who: 'mithu',
      hi: 'उसने ज़िंदगी भर उस तट पर मछलियाँ पकड़ीं — नाव में रखे एक कम्पास के साथ और अपनी आँखों के पीछे बसे उससे भी बेहतर कम्पास के साथ। दोनों ही ज़रूरी हैं। मगर उनमें से सिर्फ़ एक ऐसा है जो कभी गिर नहीं सकता।',
      text: 'She fished that coast all her life, with a compass aboard and a better one behind her eyes. Both matter. Only one of them can never be dropped.' }
  ],
  moral: 'Tools help, but knowing holds — learn the thing itself, not just the instrument.',
  source: 'The seamanship of the Koli and Machhi fisher communities of Daman — steering by swell, wind, birds and stars — is real, old knowledge. This grandfather-and-granddaughter telling is composed for this app in their manner, and the source says so honestly.'
},

{
  id: 'fk.narali-punam',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Coconut for the Sea',
  hook: 'Once a year, the fisher families of Daman walk to the water\'s edge and give the sea a present. Then, and only then, the boats go out.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['पूर्णिमा', 'purnima', 'full moon'], ['मौसम', 'mausam', 'season']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पूरे मानसून भर, दमन की मछुआरा नावें किनारे पर ही रहती हैं। बारिश के दिनों में इस तट का समंदर किसी के भी जाने लायक नहीं होता, और मछुआरों के परिवार — कोली और माछी लोग जो इसे सबसे अच्छी तरह जानते हैं — उससे उलझते नहीं हैं। वे अपने जाल सुधारते हैं, नावों के पेंदे रंगते हैं, और एक ख़ास पूर्णिमा का इंतज़ार करते हैं।',
      text: 'All through the monsoon, the fishing boats of Daman stay in. The sea off this coast in the rains is no place for anyone, and the fisher families — Koli and Machhi people who know it best — do not argue with it. They mend nets, paint hulls, and wait for a particular full moon.' },
    { art: ['guard'], who: null,
      hi: 'यह मानसून के ख़त्म होने पर आती है: नारली पूर्णिमा, यानी नारियल वाली पूर्णिमा। उस दिन, पूरे पश्चिमी तट पर, मछुआरा बस्तियों के लोग सज-धजकर, गाते-बजाते, हाथों में नारियल लिए पानी के पास जाते हैं — और उन्हें समंदर को अर्पित कर देते हैं।',
      text: 'It comes at the monsoon\'s end: Narali Purnima, the coconut full moon. On that day, all along the western coast, fishing communities go down to the water dressed in their best, singing, carrying coconuts — and give them to the sea.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"दमन में नावें शादी में आए रिश्तेदारों की तरह सजती हैं — नया रंग, झंडियाँ और आगे के हिस्से पर सजे फूल। परिवार साथ मिलकर तट की ओर जाते हैं, प्रार्थना करते हुए लहरों को नारियल चढ़ाए जाते हैं, और सलेटी-हरी लहरों पर चमकते हुए नारियल पानी के झकोरों के साथ बह निकलते हैं।"',
      text: 'In Daman the boats are decorated like relatives at a wedding — fresh paint, flags, flowers on the prow. Families walk down together, the coconuts are offered into the waves with prayers, and the water rocks them away, bright against the grey-green swell.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'पहली बार यह सब देख रहे एक लड़के ने अपनी माँ से एक सीधा और बड़ा ही बढ़िया सवाल पूछा, "समुंदर के पास तो पहले से ही सब कुछ है। फिर हम उसे नारियल क्यों दे रहे हैं?"',
      text: 'A boy watching for the first time asked his mother the obvious, excellent question. "The sea is full of everything already. Why are we giving it a coconut?"',
      ask: {
        q: 'Why offer a coconut to the sea, which needs nothing?',
        options: ['To feed the fish', 'It is a greeting between neighbours — respect and thanks before asking to work in the sea\'s house again', 'It is just for the photographs'],
        answer: 1,
        right: 'That is the heart of it. The sea feeds these families all year. Before the season begins, you greet it, thank it, and ask nicely. You would do the same at any neighbour\'s door.',
        wrong: 'The fish do enjoy it, but that is not the point. It is a greeting between neighbours — thanks for last season, respect before the new one. You would knock politely at any neighbour\'s door.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"हम समुंदर के घर में काम करते हैं," उसकी माँ ने कहा। "साल भर वह हमारा पेट भरता है। साल में एक बार, हम उसके दरवाज़े पर खड़े होकर शुक्रिया कहते हैं, और फिर से अंदर आने की इजाज़त माँगते हैं। हमारे लोग हमेशा से नारियल देकर ही यह बात कहते आए हैं — यह इस किनारे की सबसे अच्छी उपज है, इसलिए हम यही भेंट लाते हैं।"',
      text: '"We work in the sea\'s house," his mother said. "All year it feeds us. Once a year, we stand at its door and say thank you, and ask leave to come in again. The coconut is how our people have always said it — it is the best thing the shore grows, so it is what we bring."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और यह भेंट चढ़ते ही नए मौसम की शुरुआत हो जाती है। कुछ ही दिनों में तड़के ही बंदरगाह खाली हो जाता है, और नावें उस पानी पर दूर-दूर तक फैल जाती हैं जिससे, सबकी नज़र में, बाकायदा बात कर ली गई हो। वह पुराना समझौता, एक और साल के लिए नया हो जाता है।',
      text: 'And with the offering made, the season opens. Within days the harbour empties at dawn, the boats spreading out over water that has, in everyone\'s eyes, been properly spoken to. The old agreement, renewed for another year.' },
    { art: ['courtier'], who: null,
      hi: 'पूरे समुद्र तट पर — महाराष्ट्र में, गुजरात में, और यहाँ दमन में — मछुआरे इस दिन को अपने-अपने ढंग से, अपने गीतों के साथ मनाते हैं। कई परिवारों में बाद में नारियल को फोड़कर आपस में बाँटा भी जाता है; किसी तटीय परिवार से पूछकर देखिए कि उनके यहाँ यह कैसे किया जाता है।',
      text: 'Up and down the coast — in Maharashtra, in Gujarat, here in Daman — fishing communities keep this day, each in their own way, with their own songs. In many families the coconut is broken and shared afterwards too; ask a coastal family how theirs does it.' },
    { art: ['guard'], who: 'mithu',
      hi: 'ज़िंदगी में एक बार रेत पर खड़े होकर यह देखना तो बनता ही है: पूरा समुदाय समुंदर के सामने खड़ा है, और सब मिलकर, ज़ोर से उसे धन्यवाद कह रहे हैं। समुंदर कोई जवाब नहीं देता। नावें पूरे मौसम सही-सलामत लौटती हैं। दमन में लोग आपको बताएँगे कि इन दोनों बातों का आपस में गहरा रिश्ता है।',
      text: 'It is worth standing on the sand for, once in your life: a whole community facing the sea, saying thank you to it, out loud, together. The sea does not answer. The boats come home all season. In Daman they will tell you those two sentences are connected.' }
  ],
  moral: 'Say thank you to what feeds you — out loud, together, every year.',
  source: 'Narali Purnima, the coconut full-moon offering kept by Koli, Machhi and other fishing communities along the west coast including Daman, marking the monsoon\'s end and the opening of the fishing season. A living practice, told from the inside.'
},

{
  id: 'fk.moti-daman-bells',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Bell That Answered Ships',
  hook: 'Inside the great fort of Moti Daman stands a church, and in the church a bell — and the bell\'s job, at dusk, was to say one word: home.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DD'],
  words_hi: [['घंटी', 'ghanti', 'bell'], ['शाम', 'shaam', 'evening'], ['वापसी', 'waapsi', 'homecoming']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"दमन गंगा के दक्षिणी किनारे पर मोती दमन खड़ा है — वह बड़ा सा किला, जिसकी दीवारों पर आप चल सकते हैं और जिसके अंदर एक पूरा पुराना कस्बा बसा हुआ है। और उन्हीं दीवारों के भीतर खड़ा है सदियों पुराना बॉम जीसस चर्च, नक्काशीदार दरवाज़ों, सोने की वेदी और मीनार में लगी अपनी एक घंटी के साथ।"',
      text: 'On the south bank of the Daman Ganga stands Moti Daman — the big fort, with walls you can walk along and a whole old town tucked inside. And inside the walls stands the Church of Bom Jesus, centuries old, with carved doors, a golden altar, and a bell up in its tower.' },
    { art: ['courtier'], who: null,
      hi: '"यह कहानी उसी घंटी की है, उन दिनों की जब दमन पुर्तगालियों का एक बंदरगाह हुआ करता था और किले के नीचे नदी में पालों वाली नावें चहल-पहल मचाती थीं। यह कहानी बिल्कुल वैसे ही सुनाई जाती है जैसे बंदरगाहों के किस्से सुनाए जाते हैं — किसी दीवार का सहारा लेकर, बहते पानी को निहारते हुए।"',
      text: 'This is a tale of that bell, from the days when Daman was a Portuguese port and the river below the fort was busy with sails. It is told the way harbour tales are told — leaning on a wall, watching the water.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"हर शाम गोधूलि वेला में, नदी के पार वह घंटी गूंजती थी, और समुद्र से लौटता हर जहाज़ उसे सुनता था। दिनों से समंदर में भीगे और थके हुए मल्लाहों के लिए, पानी पर तैरकर आती वह आवाज़ किसी भी धार्मिक बात से पहले सिर्फ एक ही बात कहती थी: दमन। हम घर आ गए हैं।"',
      text: 'Every evening at dusk the bell rang across the river, and every vessel coming up from the sea heard it. To a crew that had been out for days, wet and tired, that sound reaching them over the water meant one thing before it meant anything churchly: Daman. We are home.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"कहते हैं कि बूढ़ा घंटा बजाने वाला यह बात बखूबी समझता था। एक बार एक पादरी ने उसे एक बेहद तूफ़ानी और अंधेरी शाम को, तय समय बीत जाने के बहुत बाद भी, तेज़ हवा में पूरी ताकत से रस्सी खींचते हुए पाया। \\"समय तो बीत चुका है,\\" पादरी ने कहा। \\"तुम किसके लिए घंटी बजा रहे हो?\\""',
      text: 'The old bell-ringer, the tale goes, understood this perfectly. A priest once found him ringing on a foul black evening, long past the usual hour, hauling away in the wind. "The hour is gone," said the priest. "For whom are you ringing?"',
      ask: {
        q: 'Why is the bell-ringer still ringing into the storm, after the hour has passed?',
        options: ['He lost track of the time', 'There is a boat still out — and the bell can be heard when nothing can be seen', 'He likes the sound of it'],
        answer: 1,
        right: '"Fernandes\' boat is not in," said the bell-ringer, and kept hauling. "On a night like this the river mouth hides. But my bell carries. Let him find home by his ears."',
        wrong: 'He knew the hour exactly. "Fernandes\' boat is not in," he said, and kept hauling. "On a night like this the river mouth hides. But my bell carries. Let him find home by his ears."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"और कहानी कहती है कि उस अंधेरे में, देर से आ रही नाव ने वह आवाज़ सुनी — बारिश के बीच से आती कांसे की खनकती डोर जैसी आवाज़ — और उसी के सहारे नाव मोड़ते हुए, वह किले की दीवार के पार नदी में सुरक्षित आ पहुंची। घंटा बजाने वाले ने पानी की तरफ से आती पुकारें सुनीं, खुशी से दो बार और घंटी बजाई, और अपने घर रात का खाना खाने चला गया।"',
      text: 'And out in the dark, the story says, the late boat heard it — a thread of bronze sound through the rain — and steered on it, and came up the river past the fort wall, safe. The bell-ringer heard the shouts from the water, rang twice more for gladness, and went home to his supper.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"तब भी और आज भी, दमन की शाम की सबसे प्यारी बात यही है। चर्च की घंटी ही वहां अकेली आवाज़ नहीं है। जैसे ही रोशनी ढलती है, पूरे शहर में मस्जिद से अज़ान गूंजती है और मंदिरों से आरती की घंटियां बज उठती हैं — अलग-अलग इबादतगाहों में अलग-अलग प्रार्थनाएं, जो एक ही नदी के ऊपर तैरती हुई आगे बढ़ जाती हैं।"',
      text: 'Here is the lovely thing about a Daman evening, then and now. The church bell is not the only voice. Across the town, as the light goes, the azaan rises from the mosque, and the aarti bells sound from the temples — different prayers, in different houses of God, floating out over the same river.' },
    { art: ['guard'], who: null,
      hi: 'और उन सभी आवाज़ों में, चाहे और कुछ भी हो, घंटी बजाने वाले का यह संदेश भी होता है। दिन ढल रहा है। तुम अकेले नहीं हो। घर लौट आओ। हर धर्म के नाविक उस आवाज़ के सहारे अपनी राह पकड़ते जो उन तक पहुँचती, और वे उन सभी आवाज़ों को सुनकर खुश होते।',
      text: 'And every one of those sounds, whatever else it carries, carries the bell-ringer\'s message too. Day is ending. You are not alone. Come home. Sailors of every faith steered by whichever voice reached them, and were glad of them all.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'कभी शाम ढले मोती दमन की दीवार पर खड़े होकर बस सुनिए। एक पुराने बंदरगाह शहर की शाम की आवाज़ें, जो अपनी-अपनी भाषा में वही एक बात कह रही हैं। यह भारत की सबसे खूबसूरत आवाज़ों में से एक है।',
      text: 'Stand on the wall of Moti Daman at dusk sometime and just listen. The evening voices of an old port town, all saying the same word in their own languages. It is one of the best sounds in India.' }
  ],
  moral: 'Every call to prayer is also a call home — and a town with many voices calls the more surely.',
  source: 'The fort of Moti Daman and the Church of Bom Jesus within it are real, as are Daman\'s shared evening voices. This bell-ringer\'s tale is a new telling composed for this app in the harbour manner, and the source says so honestly. Both faiths appear here as their own people know them.'
},

/* ===================================================== GOA =============== */
{
  id: 'fk.goa-two-bells',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Two Bells of the Valley',
  hook: 'A white church on one hill, a temple on the other, and two bells that learned to ring to each other across the paddy fields.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['गाँव', 'gaon', 'village'], ['सुबह', 'subah', 'morning'], ['पड़ोसी', 'padosi', 'neighbour']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'गोवा में एक ख़ास तरह का गाँव होता है — जो आपको हर तालुके में मिल जाएगा — जो नारियल और धान की हरी-भरी घाटी में बसा होता है, जहाँ एक पहाड़ी पर सफ़ेद चूने से पुता चमकता हुआ चर्च है और दूसरी पर दीपस्तंभ, यानी दीयों की मीनार वाला एक मंदिर। यह कहानी ऐसे ही एक गाँव की है।',
      text: 'There is a kind of Goan village — you will find it in every taluka — that sits in a green valley of coconut and rice, with a whitewashed church shining on one hill and a temple with a deepastambha, a lamp tower, on the other. This is a tale told about one such village.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'हर पहाड़ी की अपनी घंटी थी। चर्च की घंटी बड़ी और काँसे की थी, जो मास और एंजेलस की प्रार्थना के लिए बजती थी। मंदिर की घंटी छोटी और चमकदार थी, जो सुबह और शाम की आरती के लिए बजती थी। और उनके बीच, घाटी में, सबकी नज़रों के सामने सबका धान उगता था।',
      text: 'Each hill had its bell. The church bell was big and bronze and rang for Mass and the Angelus. The temple bell was smaller and brighter and rang for the morning and evening aarti. And between them, in the valley, everybody\'s rice grew in everybody\'s sight.' },
    { art: ['guard'], who: null,
      hi: 'दोनों घंटी बजाने वालों ने कभी आपस में कुछ तय नहीं किया था। लेकिन घाटी में घंटियों की आवाज़ गूँजती है, और धीरे-धीरे, सालों के साथ, एक लिहाज़ बन गया। अगर मंदिर की घंटी बज रही होती, तो चर्च वाला उसके थमने का इंतज़ार करता और फिर शुरू करता। अगर चर्च की घंटी बज रही होती, तो मंदिर वाला उसे पूरा होने देता। कोई भी दूसरे की आवाज़ के ऊपर अपनी घंटी नहीं बजाता था।',
      text: 'The two bell-ringers had never planned anything. But bells carry in a valley, and slowly, over years, a politeness grew. If the temple bell was sounding, the church ringer waited for the pause before he began. If the church bell was mid-peal, the temple ringer let it finish. Neither would ring over the other.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक बार एक बच्ची ने अपनी आजी से इस बारे में पूछा — जो संयोग से एक कैथोलिक आजी थीं और अपने बालकाव में बैठी मटर छील रही थीं। "आजी, हमारी घंटी उनकी घंटी का इंतज़ार क्यों करती है?"',
      text: 'A child once asked her grandmother about it — a Catholic grandmother, as it happens, shelling peas on her balcao. "Aji, why does our bell wait for theirs?"',
      ask: {
        q: 'Why would each bell-ringer wait for the other to finish?',
        options: ['It is a rule the village council made', 'Because you do not talk over a neighbour who is praying', 'So people can tell the bells apart'],
        answer: 1,
        right: '"When Salkar-bab\'s family prays, we do not shout across it," said her grandmother. "When we pray, they do not shout across us. That is not a rule, child. That is manners."',
        wrong: 'No council ever discussed it. "When Salkar-bab\'s family prays, we do not shout across it," said her grandmother. "When we pray, they do not shout across us. That is not a rule. That is manners."'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: '"और ख़ास त्योहारों के दिनों में तो यह शिष्टाचार और भी ख़ूबसूरत रंग ले लेता था। चर्च की दावत के दिन, घाटी के मंदिर वाले हिस्से के लोग चर्च के नीचे लगे मेले में आते, और हर दिशा में घरों को मिठाइयाँ जाती थीं। शिगमो और दिवाली पर, चर्च वाले गलियों में खड़े होकर ढोल-नगाड़ों और दीयों की बहार देखते, और दोनों पहाड़ियों के बच्चे एक टोली बनकर दौड़ते-भागते थे।"',
      text: 'And on the great days, the politeness turned into something better. At the church feast, the temple side of the valley came to the fair below the church, and sweets went home in every direction. At Shigmo and Diwali, the church side stood in the lanes to watch the drums and lamps go by, and the children of both hills ran in one flock.' },
    { art: ['courtier'], who: null,
      hi: '"बाहर से आए लोग कभी-कभी गाँव वालों से पूछते कि दोनों पहाड़ियों के लोग आपस में इतना मिल-जुलकर कैसे रहते हैं, जैसे यह कोई अचरज की बात हो। गाँव वालों को यह सवाल बड़ा अजीब लगता। वे कहते, "हम दोनों तो हमेशा से यहीं रहे हैं। घाटी तो एक ही है, और धान भी कोई दो रंगों में नहीं उगता।""',
      text: 'People from away sometimes asked the villagers how the two hills got along so well, as if it were a wonder. The villagers found the question odd. "We have always been here," they would say, "both of us. The valley is one valley. The rice does not grow in two colours."' },
    { art: ['guard'], who: null,
      hi: '"शाम के समय, जब दोनों तरफ़ घंटियाँ बज चुकतीं और खेतों में मेंढकों की आवाज़ें शुरू हो जातीं, तब आप दोनों पहाड़ियों के बीच की मेड़ पर खड़े होकर इसे महसूस कर सकते थे: ढलती शाम में जगमगाते ईश्वर के दो घर, जहाँ दोनों अपनी-अपनी प्रार्थनाएँ भी कर रहे होते और साथ ही एक-दूसरे की आवाज़ पर भी कान लगाए रखते।"',
      text: 'In the evenings, when both bells had rung and the frogs were starting up in the paddies, you could stand on the bund between the hills and feel it: two houses of God, lit against the dusk, each keeping its own prayers and keeping, also, an ear for the other.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"कोंकणी में एक शब्द है, "मोग" — यानी सीधा-सादा, अपना सा प्यार। किसी गोआ वाले से पूछिए कि ऐसे गाँव को आपस में क्या जोड़े रखता है, तो आपको यही सुनने को मिलेगा। एक जैसा होना नहीं, बल्कि मोग, तहज़ीब, और धान की एक साझी घाटी।"',
      text: 'Konkani has a word, "mog" — love, plain and homely. Ask a Goan what holds a village like that together and you will hear it. Not sameness. Mog, and manners, and a shared valley of rice.' }
  ],
  moral: 'Neighbours who let each other\'s prayers finish will never lack for company at their festivals.',
  source: 'A composite village tale composed for this app. What it is made of is real and documented: Goan villages where church and temple share a valley, and the long tradition of Hindu and Catholic Goans attending one another\'s feasts. Both faiths are shown from the inside, as their own people keep them.'
},

{
  id: 'fk.goa-coconut',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Tree That Held the Village',
  hook: 'The flood took the rice, the year\'s work, everything. It could not take the trees — and the trees, it turned out, were a whole pantry.',
  hero: 'courtier',
  cast: ['courtier', 'pt_monkey'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['नारियल', 'nariyal', 'coconut'], ['छत', 'chhat', 'roof'], ['रस्सी', 'rassi', 'rope']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"कोंकणी में नारियल के पेड़ को माड कहते हैं, और गोआ की पुरानी समझ के मुताबिक जिस परिवार के पास माड के पेड़ हों, वो कभी सचमुच ग़रीब नहीं हो सकता था, चाहे कोई भी विपत्ति क्यों न आ जाए। गोआ के समुद्री तट पर सुनाई जाने वाली यह कहानी उसी साल की है, जब बाक़ी सब कुछ बिगड़ गया था।"',
      text: 'In Konkani the coconut palm is the maad, and in the old Goan reckoning a family that owned maad trees was never truly poor, whatever else went wrong. This tale, told along the Goan coast, is about the year everything else went wrong.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"उस साल बारिश ऐसे आई मानो समंदर ही उलट पड़ा हो। नदी अपने पाट से निकलकर खेतों में फैल गई और धान पर ऐसी जम बैठी कि फ़सल पूरी तरह ख़त्म हो गई। जब पानी आख़िरकार पीछे हटा, तो पूरा गाँव उस सलेटी कीचड़ को देखता रह गया, जहाँ साल भर का खाना होना चाहिए था।"',
      text: 'The rains came that year like an upturned sea. The river left its bed, walked through the fields, and sat on the rice until the rice was gone. When the water finally drew back, the village stood looking at grey mud where a year of food should have been.' },
    { art: ['pt_monkey', 'courtier'], who: null,
      hi: 'लेकिन कीचड़ में से बेपरवाह खड़े, हमेशा की तरह थोड़ा झुके हुए — वे नारियल के पेड़ थे। बाढ़ का पानी पूरे एक हफ़्ते उनके तनों के इर्द-गिर्द घूमता रहा और वे बस डटे रहे। ताड़ के पेड़ पानी को अच्छी तरह पहचानते हैं। वे तो अपनी पूरी ज़िंदगी लगभग समंदर में पाँव डाले ही बड़े होते हैं।',
      text: 'But standing out of the mud, untroubled, leaning the way they always leaned — the coconut palms. The flood had swirled round their trunks for a week and they had simply held on. Palms know water. They grow with their feet nearly in the sea all their lives.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'गाँव की मुखिया ने सबको इकट्ठा किया। उन्होंने कहा, "चावल तो चले गए और अगली फ़सल आने में अभी महीनों बाकी हैं। अब — इससे पहले कि कोई निराश हो — मुझे गिनकर बताओ कि हमारे पास अभी भी क्या बचा है।" और उन्होंने ऊपर पेड़ों की ओर इशारा किया।',
      text: 'The village headwoman gathered everyone. "The rice is gone and the next harvest is months away," she said. "Now — before anyone despairs — somebody count for me what we still have." And she pointed up at the palms.',
      ask: {
        q: 'What can a village actually get from its coconut palms?',
        options: ['Just coconuts to eat', 'Food, drink, oil, rope, roofs, brooms, bowls, fuel — nearly everything', 'Shade and not much else'],
        answer: 1,
        right: 'They counted, and the counting turned into courage. Tender coconuts to drink. Flesh to eat. Oil for cooking and lamps. Coir for rope and nets. Fronds for roofs and brooms. Shells for bowls and fuel. The maad is a pantry, a workshop and a roof, standing on one leg.',
        wrong: 'Far more than that — the counting turned into courage. Tender coconuts to drink. Flesh to eat. Oil for lamps. Coir for rope and nets. Fronds for roofs and brooms. Shells for bowls and fuel. The maad is a pantry, a workshop and a roof, standing on one leg.'
      } },
    { art: ['pt_monkey', 'courtier'], who: null,
      hi: 'तो अगली बुवाई तक गाँव इसी तरह गुज़ारा करता रहा। चढ़ने वाले लोग अपने पैरों में फंदे बाँधकर ऊपर चढ़े और सैकड़ों नारियल नीचे उतारे। जटाओं को बटकर रस्सियाँ बनाई गईं और रस्सियों को बेचा गया। पत्तों से उन छतों की फिर से मरम्मत की गई जिन्हें बाढ़ ने भिगो दिया था। हर हाँडी में नारियल का दूध पड़ा, और किसी का भी बच्चा भूखा नहीं सोया।',
      text: 'So that is how the village lived until the next planting. The climbers went up with their ankle-loops and brought down nuts by the hundred. Coir was twisted into rope and the rope sold. Fronds re-roofed what the flood had soaked. Coconut milk went into every pot, and nobody\'s children went to sleep hungry.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'जब सुधरे हुए खेतों में आख़िरकार नया धान हरा-भरा होकर खड़ा हो गया, तो मुखिया ने एक बार फिर पूरे गाँव को बुलाया — इस बार पेड़ों के नीचे — और वही ऐलान किया जिसके लिए यह कहानी सुनाई जाती है: "इस साल से, इस गाँव में कोई भी एक तंदुरुस्त माड नहीं काटेगा। मुझे फ़र्क़ नहीं पड़ता कि वह किसकी ज़मीन पर खड़ा है। ये पेड़ इस गाँव की दादियाँ हैं।"',
      text: 'When the new rice finally stood green in the mended fields, the headwoman called the village together once more — under the palms this time — and made the announcement the tale is really told for: "From this year, no one in this village cuts a healthy maad. I do not care whose land it stands on. These trees are the village\'s grandmothers."' },
    { art: ['courtier', 'pt_monkey'], who: null,
      hi: 'गोवा के लोग नारियल के पेड़ को कल्पवृक्ष — पुरानी कहानियों का हर इच्छा पूरी करने वाला पेड़ — सदियों से कहते आए हैं, और वे सचमुच ऐसा ही मानते हैं। किसी भी गोआई घराने से पूछिए कि उनकी रसोई की कितनी चीज़ें माड से आई हैं। और फिर ज़रा छत को भी गिन लीजिए।',
      text: 'Goans have called the coconut palm kalpavriksha — the wish-fulfilling tree of the old stories — for as long as anyone can say, and they mean it almost literally. Ask a Goan household how many things in the kitchen came from the maad. Then count the roof.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'बाढ़ तो हर बार सुनाने में कोई न कोई अलग कहानी बन जाती है। पर पेड़ों के नीचे बैठकर गिनती करने वाली बात हमेशा वही रहती है। दौलत सिर्फ़ वही नहीं जो आप इस साल काटते हैं — दौलत वह भी है जो पानी आने पर भी खड़ी रहती है।',
      text: 'The flood is one story or another in every telling. The counting under the trees is always the same. Wealth is not only what you harvest this year — it is also what keeps standing when the water comes.' }
  ],
  moral: 'Know what you truly have before you decide you have nothing.',
  source: 'A Konkani coastal telling of a widespread Goan truth: the coconut palm — the maad — as the tree of a thousand uses, honoured as kalpavriksha. The flood-year framing follows the way such tales are told along the coast; versions differ, and no single collector is claimed.'
},

{
  id: 'fk.goa-frog-rain',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Frog Who Called the Rain',
  hook: 'The smallest frog in the paddy kept singing to an empty sky. Everyone told him to save his breath. Then the sky answered.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'pt_crow'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['मेंढक', 'mendhak', 'frog'], ['वर्षा', 'varsha', 'rain'], ['गीत', 'geet', 'song']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      hi: 'गोवा के धान वाले इलाकों में किसान आपको बताएंगे कि मानसून की खबर सबसे पहले मेंढकों को ही होती है। जब धान के खेत मेंढकों के गीतों से गूंजने लगें, तो समझो बारिश आ रही है — मेंढक ही वो संदेशवाहक हैं जो गाकर बारिश को बुलाते हैं। यह कहानी उस साल की है जब इन संदेशवाहकों ने लगभग हार ही मान ली थी।',
      text: 'In the rice country of Goa, the farmers will tell you the frogs know the monsoon before anyone. When the paddies begin to shout with frog-song, the rain is coming — the frogs are the heralds, singing it in. This is a tale about the year the heralds nearly gave up.' },
    { art: ['pt_tortoise'], who: null, mood: 'sad',
      hi: 'बारिश में देर हो गई थी। बहुत ही ज़्यादा देर। जून ख़त्म होने को था, खेत पुराने मिट्टी के बर्तनों की तरह चटके पड़े थे, और मेंढक अपनी जान बचाते हुए आख़िरी नम गड्ढों में चुपचाप दुबके बैठे थे। उन्होंने कहा, "बारिश को गाकर बुलाने का क्या फ़ायदा, जब सुनने के लिए बारिश ही नहीं है?"',
      text: 'The rains were late. Terribly late. June was ending, the fields lay cracked like old pottery, and the frogs sat silent in the last damp hollows, saving themselves. What is the point of singing the rain in, they said, when there is no rain to sing to?' },
    { art: ['pt_tortoise', 'pt_crow'], who: null,
      hi: 'सिवाय एक के। सबसे निचले खेत का सबसे छोटा मेंढक — अंगूठे के नाखून जितना नन्हा, और आवाज़ भी वैसी ही नन्हीं — हर शाम मिट्टी के एक ढेले पर चढ़ता और फिर भी गाता। टिंक। टिंक। टिंक। अकेले, पीतल के रंग जैसे सूखे आसमान की ओर।',
      text: 'All but one. The smallest frog in the lowest paddy — a frog the size of a thumbnail, with a voice to match — climbed onto a clod every evening and sang anyway. Tink. Tink. Tink. Alone, into a dry sky the colour of brass.' },
    { art: ['pt_crow'], who: 'pt_crow',
      hi: 'मेड़ पर बैठे एक कौवे ने उसे टोका, क्योंकि कौवों की तो आदत ही होती है। "अपनी साँस बचाओ, छोटे। बड़े मेंढक भी चुप हो चुके हैं। आसमान नहीं सुन रहा है।" छोटे मेंढक ने पहले अपनी तान पूरी की, बड़ी विनम्रता से, और फिर जवाब दिया: "मैं आसमान के लिए ही तो गा रहा हूँ। किसी न किसी को तो न्योता खुला रखना ही पड़ेगा।"',
      text: 'A crow heckled him from the bund, because crows will. "Save your breath, little one. The big frogs have stopped. The sky is not listening." The little frog finished his verse first, politely, and then answered: "The sky is exactly who I am singing to. Somebody has to keep the invitation open."' },
    { art: ['pt_tortoise'], who: null, mood: 'think',
      hi: 'और किसान, जो इसके अलावा कुछ कर भी नहीं सकते थे, उन्होंने वही किया जो कोंकण के किसान सूखे के दिनों में सदियों से करते आए हैं — उन्होंने मेंढकों का मान बढ़ाया। बुज़ुर्गों ने कहा, अगर बारिश को बुलाने वाले ही खामोश हैं, तो पुकारने में उनकी मदद करो।',
      text: 'And the farmers, who could do nothing else, did what Konkan farmers have long done in a dry year — they honoured the frogs. If the rain-callers are silent, the old ones said, help them ask.',
      ask: {
        q: 'The rain is late and even the frogs have gone quiet. What do the village children do?',
        options: ['Give up like the big frogs', 'Join the little frog — sing and drum for the rain along with him', 'Chase the frogs away'],
        answer: 1,
        right: 'That is the old way. The children came out to the field with pots to drum on and sang for rain beside the smallest frog — and his tink-tink-tink kept the beat.',
        wrong: 'The opposite. The children came out with pots to drum on and sang for rain beside the smallest frog — his tink-tink-tink keeping the beat for the whole crowd.'
      } },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'और उसी रात — कहानी इस बात पर बड़ा ज़ोर देती है — हवा समुद्र की तरफ़ से घूम पड़ी, घाटी में भीगी मिट्टी की सोंधी महक भर गई, और धूल पर पहली मोटी बूँदें छनछनाती हुई गिरीं। सुबह होते-होते पूरा आसमान खुल पड़ा था, और गोवा का हर मेंढक अपने पूरे ज़ोर-ओ-शोर से गा रहा था।',
      text: 'And that night — the tale insists on this part — the wind swung round to the sea, and a smell of wet earth came up the valley, and the first fat drops fell hissing on the dust. By morning the whole sky had opened, and every frog in Goa was singing at the absolute top of its voice.' },
    { art: ['pt_tortoise', 'pt_crow'], who: null,
      hi: 'धान के खेत भर गए। धान लगा दिया गया। और कहते हैं, बड़े मेंढक इतने खुश थे कि उन्हें कोई शर्मिंदगी ही नहीं हुई — हालाँकि कौवे ने मेड़ पर बैठकर उन्हें जमकर ताने सुनाए।',
      text: 'The paddies filled. The rice went in. And the big frogs, it is said, were too glad to be embarrassed — though the crow made sure they heard about it, at length, from the bund.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: 'क्या छोटा मेंढक बारिश लेकर आया, या बारिश बस यूँ ही आ गई? इस कहानी के किसानों ने कभी इस बात पर बहस नहीं की। उन्होंने तो बस यह देखा कि जब बारिश आई, तब कौन-सा मेंढक गा रहा था।',
      text: 'Did the little frog bring the rain, or did the rain simply come? The farmers of the tale never argued about it. They just noticed which frog had still been singing when it arrived.' }
  ],
  moral: 'Keep singing your song even before the answer comes — someone must hold the invitation open.',
  source: 'A Konkan paddy telling. The beliefs it is built from are real and widespread: frog-song as the monsoon\'s herald, and the old custom in many parts of India of honouring frogs to ask for rain. This shaping of the tale is for this app; versions of frog-and-rain tales differ across the coast.'
},

{
  id: 'fk.goa-shigmo',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'When Spring Beats the Drum',
  hook: 'For most of the year the village drums sleep. Then spring arrives in Goa, and the drums wake up the entire state.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['वसंत', 'vasant', 'spring'], ['ढोल', 'dhol', 'drum'], ['झंडा', 'jhanda', 'flag']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'हर साल, जैसे ही ठंड ढलती है और आम के पेड़ों पर बौर आते हैं, गोवा के हिंदू गाँव अपने ढोल कसने लगते हैं। शिगमो आ रहा है — कोंकण का वसंत का बड़ा त्योहार, गोवा की अपनी होली, और कई-कई दिनों तक पूरा राज्य बस ढोल बजाने वालों और नाचने वालों का हो जाता है।',
      text: 'Every year, as winter loosens and the mango trees flower, Goa\'s Hindu villages begin tuning their drums. Shigmo is coming — the great spring festival of the Konkan, Goa\'s own cousin of Holi, and for days on end the state belongs to the drummers and the dancers.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'इसकी शुरुआत गाँवों से होती है। नाचने वालों की मंडलियाँ — जिन्हें \'रोमटामेल\' कहते हैं — आग के रंग जैसे झंडों, ढोल और ताशों, झांझ और बाँसुरियों के साथ घर-घर और मंदिर-मंदिर जाती हैं, और उन्हीं गलियों में नाचती हैं जहाँ वे सदियों से नाचती आई हैं।',
      text: 'It begins in the villages. Bands of dancers — the romta mell — go from house to house and temple to temple with flags the colour of flame, with dhol and tasha drums, with cymbals and flutes, dancing in the lanes they have danced in for centuries.' },
    { art: ['courtier'], who: null,
      hi: 'पुरानी कहानियों में शिगमो की शुरुआत के कई किस्से मिलते हैं। कई गाँवों में इसे घर लौटने का त्योहार माना जाता है — वह मौसम, जब बहुत पहले युद्ध या सफ़र पर गए लोग अपने परिवारों के पास लौटते थे, और गलियों में ढोल, नाच और फूलों के साथ उनका स्वागत होता था।',
      text: 'The old tellings give Shigmo more than one beginning. In many villages it is told as the festival of homecoming — the season when, long ago, the men who had been away at war or on journeys came home to their families, and were met with drums, dancing and flowers in the streets.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'अपनी बेटी को ताल सिखाते हुए एक ढोल वादक ने इसे यूँ समझाया: "सर्दियाँ शांत और संभलकर चलने वाली होती हैं। खेत कट चुके होते हैं, रातें ठंडी होती हैं, हर कोई बचाकर रखता है और इंतज़ार करता है। फिर फूल खिलते हैं। और जब इंतज़ार ख़त्म हो जाए, तो इंसान को भला क्या करना चाहिए?"',
      text: 'A drummer teaching his daughter the rhythms put it this way: "Winter is quiet and careful. The fields are cut, the nights are cool, everyone saves and waits. Then the flowers come. And what should a person do when the waiting ends?"',
      ask: {
        q: 'After the quiet, careful months, what does Shigmo say a village should do?',
        options: ['Stay quiet — save the energy for farming', 'Come out into the lanes together and be loud and glad on purpose', 'Celebrate quietly at home, each family alone'],
        answer: 1,
        right: '"Exactly," said the drummer. "Gladness kept indoors goes stale. Spring is for the whole lane together, as loud as the drums can say it."',
        wrong: '"No," said the drummer, "that is what winter was for. Gladness kept indoors goes stale. Spring is for the whole lane together, as loud as the drums can say it."'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'शहरों में शिगमो बहुत भव्य हो गया है: मुख्य सड़कों पर झांकियों के जुलूस, सैकड़ों नर्तकों की मंडलियाँ, और पुरानी कहानियों के ऐसे दृश्य जो मकानों से भी बड़े बनाए गए हैं और दोपहर के सूरज जैसे जगमगाते हैं। गाँव का शिगमो और शहर का शिगमो, छोटा ढोल और बड़ी परेड — एक ही त्योहार मानो दो अलग तरह के कपड़े पहने हुए हो।',
      text: 'In the towns, Shigmo has grown grand: float parades down the main streets, dancers in troupes of hundreds, scenes from the old stories built bigger than houses and lit like the noon sun. Village Shigmo and city Shigmo, small drum and big parade — the same festival wearing two sets of clothes.' },
    { art: ['courtier'], who: null,
      hi: 'और गोवा के अपने खास अंदाज़ में, गलियाँ हर किसी से भर जाती हैं। कैथोलिक पड़ोसी \'मेल\' का जुलूस देखने बाहर आते हैं और ढोल बजाने वालों को नाम से पहचानते हैं; आने वालों के चेहरों पर रंग लग जाता है और हाथों में मिठाइयाँ आ जाती हैं। गोवा का त्योहार कभी किसी एक फाटक के भीतर सिमट कर नहीं रहा।',
      text: 'And in the proper Goan way, the lanes fill with everybody. Catholic neighbours come out to watch the mell go past and know the drummers by name; visitors get colour on their faces and sweets in their hands. A Goan festival has never been good at staying inside one gate.' },
    { art: ['guard'], who: null,
      hi: 'ढोल कंधे से कंधे तक, पिता से बेटी और चाचा से भतीजे तक सौंपे जाते हैं। शिगमो के गाँव का बच्चा ये ताल वैसे ही सीख जाता है जैसे तैरना सीखा जाता है — हर बसंत इसके बीच रहते-रहते, जब तक कि एक साल ढोल खुद उसके अपने कंधे पर नहीं आ जाता।',
      text: 'The drums pass down from shoulder to shoulder, father to daughter, uncle to nephew. A child in a Shigmo village learns the rhythms the way they learn to swim — by being in the middle of it every spring until, one year, the drum is on their own shoulder.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'भारत का हर हिस्सा बसंत का स्वागत अपने अंदाज़ में करता है — होली के रंग, बिहू के गीत, और गोवा में शिगमो के ढोल। अपने परिवार से पूछो कि जहाँ के तुम्हारे अपने हैं, वहाँ बसंत का स्वागत कैसे होता है। कोई न कोई ज़रूर गुनगुनाने लगेगा।',
      text: 'Every part of India welcomes spring in its own voice — Holi\'s colours, Bihu\'s songs, and in Goa, the drums of Shigmo. Ask your family how spring is welcomed where your people are from. Somebody will start humming.' }
  ],
  moral: 'Gladness is meant to be shared at full volume, at least once a year.',
  source: 'Shigmo, the spring festival of Goa\'s Hindu communities — the village romta mell processions, the dhol-tasha drumming, the flags, the homecoming tellings, and the modern town parades. A living festival, told from the inside.'
},

{
  id: 'fk.mandovi-mugger',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Crocodile Who Owns His Stretch',
  hook: 'In the tidal creeks off the Mandovi live real crocodiles. The farmers nearby do something surprising about it: once a year, they honour one.',
  hero: 'pt_crocodile',
  cast: ['pt_crocodile', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['मगर', 'magar', 'crocodile'], ['मिट्टी', 'mitti', 'clay'], ['आदर', 'aadar', 'respect']],
  scenes: [
    { art: ['pt_crocodile'], who: null,
      hi: 'गोवा की दो बड़ी नदियों, मांडवी और जुआरी के बीच, मैंग्रोव के जंगलों से होकर एक संकरी खाड़ी बहती है — और उसके गुनगुने हरे पानी में मगरमच्छ रहते हैं: असली, जंगली दलदली मगरमच्छ, जो कीचड़ भरे किनारों पर लकड़ी के लट्ठों जैसी शांति से ऊँघते रहते हैं।',
      text: 'Between Goa\'s two great rivers, the Mandovi and the Zuari, winds a tidal channel through the mangroves — and in its warm green water live muggers: real, wild marsh crocodiles, dozing on the mud banks with the patience of logs.' },
    { art: ['courtier'], who: null,
      hi: 'वे वहाँ किसी के भी लिखे इतिहास से भी पहले से रह रहे हैं। उस खाड़ी में काम करने वाले मछुआरे उनके धूप सेंकने की जगहों को वैसे ही जानते हैं जैसे तुम जानते हो कि किस पड़ोसी का कौन-सा स्कूटर है, और वे उनके रास्ते में नहीं आते। और मगरमच्छ भी, अपनी तरफ़ से, ज़्यादातर अपने ही बड़े काम से काम रखते हैं।',
      text: 'They have been there longer than anyone\'s records. The fisherfolk who work the channel know their haul-out banks the way you know which neighbour\'s scooter is whose, and give them room. The crocodiles, for their part, mostly mind their own considerable business.' },
    { art: ['pt_crocodile', 'courtier'], who: null, mood: 'wow',
      hi: '"और इन जलधाराओं के पास बसे गाँवों में किसान एक ऐसा रिवाज़ निभाते हैं, जिसके बारे में सुनकर हर कोई हैरान रह जाता है। साल में एक बार, फसल कटने के बाद, वे पानी के किनारे बाँध पर गीली मिट्टी और सीपियों से एक असली आकार का मगरमच्छ बनाते हैं, और फूलों व चढ़ावे से उसका सत्कार करते हैं।"',
      text: 'And in villages by these waters, the farmers keep a custom that surprises everyone who hears of it. Once a year, after the harvest, they build a crocodile — life-sized, out of wet clay and shells — on the bund beside the water, and honour it with flowers and offerings.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"इस रिवाज़ को मान्गे थापणी कहते हैं — यानी मगरमच्छ की स्थापना करना। एक बार किसी मुसाफ़िर ने एक बुज़ुर्ग किसान से वही सीधा सवाल पूछ लिया: उस जीव का सत्कार क्यों करना, जिससे ज़्यादातर लोग बस पीछा ही छुड़ाना चाहते हैं?"',
      text: 'The custom is called Mannge Thapnee — the setting-up of the crocodile. A visitor once asked an old farmer the obvious question: why honour the animal most people would rather wish away?',
      ask: {
        q: 'Why would farmers honour the crocodile in their creek instead of just fearing it?',
        options: ['To tame it like a pet', 'Because it belongs to these waters as they do — honouring it renews an old agreement to share', 'To make it leave the creek'],
        answer: 1,
        right: '"He was here before my grandfather\'s bund," said the farmer. "He keeps his stretch, we keep ours. Once a year we say so out loud. That is all a good fence is — an agreement said out loud."',
        wrong: 'Nobody tames a mugger and nobody expects him to leave. "He was here before my grandfather\'s bund," said the farmer. "He keeps his stretch, we keep ours. Once a year we say so out loud."'
      } },
    { art: ['pt_crocodile'], who: null,
      hi: '"पुरानी समझ के अनुसार, मगरमच्छ इन पानी के रास्तों का रखवाला है — वही जो खेतों के लिए किनारों और पानी के फाटकों की हिफ़ाज़त करता है। रिवाज़ कहता है कि उसे आदर दो, तो जल-जगत में सब ठीक-ठाक रहता है। यह वही सोच है जो पहाड़ी लोग अपने बाघ देवता के लिए रखते हैं: एक बड़ा पड़ोसी, जिसका सलीके से स्वागत किया जाए।"',
      text: 'In the old understanding, the crocodile is the guardian of the waters — the one who keeps the banks and the sluice gates safe for the fields. Treat him with respect, the custom says, and the water-world stays in order. It is the same thought the hill people give their tiger god: the big neighbour, greeted properly.' },
    { art: ['courtier', 'pt_crocodile'], who: null,
      hi: '"उधर वैज्ञानिक दूरबीन और कॉपियाँ लेकर आते हैं, मगरमच्छों की गिनती करते हैं और यह समझते हैं कि इतने बड़े जंगली जीव इतने सारे इंसानों के इतने करीब कैसे रहते हैं। संक्षेप में उनका नतीजा यही है: यह तालमेल ज़्यादातर बढ़िया काम करता है — और इसकी एक बड़ी वजह है वही पुराना आदर-सम्मान।"',
      text: 'Meanwhile the scientists come with binoculars and notebooks, counting the muggers and studying how such big wild animals live so close to so many people. Their finding, in short: the sharing mostly works — and the old respect is a large part of why.' },
    { art: ['pt_crocodile'], who: null, mood: 'wow',
      hi: '"तो किसी शांत सुबह आप जलधारा में नाव से बहते हुए यह सब एक साथ देख सकते हैं: मैंग्रोव के पेड़, मछुआरों की डोंगी, खंभे पर मूर्ति की तरह थमा हुआ बगुला, और दूर किनारे पर धूप में सोता तीन मीटर लंबा मगरमच्छ — हर कोई कमोबेश सलीके से अपने-अपने दायरे में मग्न।"',
      text: 'So on a quiet morning you can drift down the channel and see it all at once: mangroves, fishing canoes, a heron statue-still on a post, and on the far bank a three-metre mugger asleep in the sun — everyone keeping, more or less politely, to their own stretch.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"मगरमच्छ का सम्मान करने के लिए आपको यह ढोंग करने की ज़रूरत नहीं कि वह कोई प्यारा सा खिलौना है। गोवा की खाड़ियों के गाँवों ने पीढ़ियों से यह दिखाया है कि अचरज और सावधानी दोनों एक ही नाव में साथ-साथ चल सकते हैं।"',
      text: 'You do not have to pretend a crocodile is cuddly to respect it. Goa\'s creek villages have shown for generations that wonder and carefulness can live in the same boat.' }
  ],
  moral: 'You can honour what you are careful of — respect and caution are old friends.',
  source: 'The wild mugger crocodiles of the tidal channel between Goa\'s Mandovi and Zuari rivers, and Mannge Thapnee, the annual clay-crocodile honouring kept by farming villages beside these waters. A living practice, told from the inside.'
},

{
  id: 'fk.goa-mando',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'aaj',
  title: 'The Song That Keeps the Story',
  hook: 'At a Goan wedding, the grandmother begins to sing, slow and sweet — and inside the song, a hundred years of the family is listening.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['गाना', 'gaana', 'song'], ['परिवार', 'parivaar', 'family'], ['विदाई', 'vidaai', 'farewell']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'गोवा के कैथोलिक परिवारों में एक तरह का गीत गाया जाता है जिसे \'मांडो\' कहते हैं — धीमा, सुंदर, कोंकणी में गाया जाने वाला, जिसमें हर कोई बीच-बीच में सुर मिलाता है। यह कोई मंच पर गाने वाला संगीत नहीं है, भले ही आज यह मंचों तक भी पहुँच चुका हो। इसका असली घर तो शाम के वक़्त, किसी शादी में, कमरे में एक साथ इकट्ठा हुआ परिवार ही है।',
      text: 'In the Catholic households of Goa there is a kind of song called the mando — slow, graceful, sung in Konkani, with everyone joining the refrain. It is not stage music, though it has reached stages. Its true home is a family gathered in a hall, at a wedding, in the evening.' },
    { art: ['guard'], who: null,
      hi: 'गाने वाले सब साथ खड़े होते हैं, और उनके साथ बजता है \'घुमट\' — गोवा का अपना मिट्टी का बाजा, जिसे बजाने से पहले आग पर थोड़ा सेका जाता है ताकि उसकी आवाज़ बिल्कुल सही निकले — और साथ में शायद एक वायलिन, जिसे पुर्तगाली दौर ने गोवा के घरों की बैठकों में वैसे ही छोड़ दिया था जैसे समंदर किनारे पर सीपियाँ छोड़ जाता है।',
      text: 'The singers stand together, and with them plays the ghumot — Goa\'s own clay-pot drum, warmed by a fire before playing so its voice comes right — and maybe a violin, which the Portuguese years left behind in Goan parlours the way the sea leaves shells.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'हर मांडो कोई-न-कोई कहानी कहता है। कुछ प्यार के अफ़साने हैं, जिनमें आँगन के आर-पार की तड़प भरी होती है। कुछ बहुत पुराने ज़माने की सच्ची घटनाओं को याद करते हैं — कोई शादी, कोई जुदाई, यहाँ तक कि गाँव के झगड़े और पुरानी नाइंसाफ़ियाँ भी, जिन्हें सुरों की मिठास में ऐसा ढाल दिया गया कि परिवार उन्हें अपने दिल में संजो कर रख सके। मांडो दरअसल गोवा के कैथोलिक परिवारों की डायरी लिखने का अपना तरीक़ा था: नज़्मों में, कोंकणी में, चार सुरों की मिठास के साथ।',
      text: 'Every mando tells something. Some are love stories, full of longing across a courtyard. Some remember real happenings from long ago — a wedding, a parting, even village quarrels and old injustices, all smoothed by melody into something a family can hold. The mando is how Goan Catholic families kept their diary: in verse, in Konkani, in four-part sweetness.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक शादी का बड़ा प्यारा सा क़िस्सा है, एक बच्चे ने अपनी दादी से फुसफुसाकर पूछा: "सब लोग रोने जैसे क्यों लग रहे हैं? आज तो ख़ुशी का दिन है।" दादी उस वक़्त गीत की टेक गा रही थीं, इसलिए उन्होंने उसे कड़ी ख़त्म होने तक इंतज़ार कराया, और यही सही तरीक़ा भी है।',
      text: 'At one wedding, so the affectionate joke goes, a boy whispered to his grandmother: "Why is everyone nearly crying? It is a happy day." His grandmother was singing the refrain and made him wait for the verse-end, which is the correct order of things.',
      ask: {
        q: 'Why do people\'s eyes shine when the mando is sung at a happy wedding?',
        options: ['The song is too long', 'Because the song holds everyone they remember — the family\'s whole story is in the room while it lasts', 'Weddings make people tired'],
        answer: 1,
        right: '"When we sing it," she said, "I hear my mother singing it, and she heard hers. Happy and full-of-remembering are neighbours, child. The mando invites them both."',
        wrong: '"Listen," she said. "When we sing it, I hear my mother singing it, and she heard hers. The song holds everyone we remember. Happy and full-of-remembering are neighbours, child."'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'इसके साथ होने वाला नाच भी गीत की तरह ही धीमा और सहज होता है — कतारों में जोड़ियाँ, हाथ में धीरे-धीरे हिलता पंखा, और ऐसे क़दम जो दस साल की बच्ची के साथ उसकी परदादी भी मिला सकें, और असल बात भी यही है। यहाँ कोई अपनी कला का दिखावा नहीं कर रहा होता। सब मिलकर एक ही साझी विरासत को सँभाल रहे होते हैं।',
      text: 'The dancing that goes with it is as unhurried as the song — couples in lines, a fan turning in a hand, steps that a great-grandmother can do beside a girl of ten, which is precisely the point. Nobody is showing off. Everybody is carrying the same thing together.' },
    { art: ['courtier'], who: null,
      hi: 'हर नई घटना पर, बीतते दशकों के साथ नए-नए मांडो बनते चले गए, और इस तरह परिवारों के साथ-साथ गीतों का यह ख़ज़ाना भी बढ़ता गया। अगर आप किसी गाँव के सारे मांडो सिलसिलेवार गा लें, तो समझिए आपने उसका पूरा इतिहास गा लिया — बिल्कुल अंदर से सुनाया हुआ, अपनी रसोई की अपनी घरेलू भाषा में।',
      text: 'New mandos were made for new happenings, decade after decade, so the songbook grew along with the families. Sing through a village\'s mandos in order and you have sung its history — told from the inside, in its own kitchen language.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'आज मांडो के उत्सव और प्रतियोगिताएँ होती हैं, गायक-मंडलियाँ हैं जो इसे चाँदी की तरह चमकाती हैं, और ऐसी रिकॉर्डिंगें हैं जो इसे लिस्बन, लंदन और टोरंटो में बसे गोआई परिवारों तक पहुँचाती हैं—जो इन्हें अपनी शादियों में बजाते हैं, और उस ठंडे मौसम में भी वही अपनेपन के आँसू बहाते हैं।',
      text: 'Today there are mando festivals and competitions, choirs that polish it like silver, recordings that carry it to Goan families in Lisbon and London and Toronto — who play them at their own weddings, and cry the same good tears in a colder climate.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'हर समुदाय अपनी यादों को कहीं न कहीं सहेजकर रखता है—पोथियों में, महाकाव्यों में, नानी-दादी की रसोई में। गोवा के कैथोलिक परिवार अपनी यादों का एक बड़ा हिस्सा गीतों में सँजोते हैं। अपने परिवार से पूछना कि किन गीतों में तुम्हारी कहानी बसी है। कम से कम एक गीत तो ज़रूर होगा।',
      text: 'Every community keeps its memory somewhere — in scrolls, in epics, in grandmother\'s kitchen. Goa\'s Catholic families keep a good part of theirs in song. Ask your family what songs hold your story. There will be at least one.' }
  ],
  moral: 'A family that sings its story together never really loses anyone from it.',
  source: 'The mando tradition of Goan Catholic families — Konkani story-songs with the ghumot clay drum, sung at weddings and gatherings and now at festivals worldwide. A living tradition, told from the inside.'
},

{
  id: 'fk.kharvi-wave',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'coast-forest',
  badge: 'katha',
  title: 'The Sea Speaks in Sevens',
  hook: 'Before any boat went out, the old fisherman stood on the sand doing something strange: counting waves.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-GA'],
  words_hi: [['लहरें', 'lehrein', 'waves'], ['गिनती', 'ginti', 'counting'], ['धैर्य', 'dhairya', 'patience']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'खारवी गोवा के मछुआरे हैं—जिनकी नावें और जाल समंदर की इन लहरों पर तब से उतर रहे हैं, जब गोवा के बारे में कुछ भी लिखा नहीं गया था। यह कहानी उन्हीं के अंदाज़ में है, जो किनारे के सबसे पुराने हुनर के बारे में बताती है: समंदर से उलझने से पहले उसकी आवाज़ सुनना।',
      text: 'The Kharvi are Goa\'s fisher people — the ones whose canoes and nets have worked this surf since long before anyone wrote anything down about Goa at all. This is a tale in their manner, about the oldest skill on the beach: listening to the sea before you argue with it.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'हर सुबह, नावें निकलने से पहले, बूढ़े पेद्रू—जो सबके बड़े-दादा थे और नारियल की रस्सी जैसे पक्के भूरे थे—पानी के किनारे तक चलकर जाते और बस चुपचाप खड़े हो जाते। देखते हुए। मन ही मन कुछ गिनते हुए। बड़ी देर बाद वे मुड़ते और कहते "हाँ" या "ना", और पूरा किनारा मौसम की तरह उनकी बात मानता था।',
      text: 'Every morning, before the boats went out, old Pedru — everyone\'s grand-uncle, brown as a coir rope — walked to the water\'s edge and simply stood there. Watching. Counting under his breath. Only after a long while would he turn and say "yes" or "no", and the beach obeyed him like weather.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'आखिरकार एक लड़के ने उनसे पूछ ही लिया कि वे क्या गिन रहे थे। "लहरें," पेद्रू बोले। "समंदर सबको एक जैसा नहीं भेजता। वह उन्हें कुनबों में भेजता है—कुछ छोटी, फिर बड़ी लहरें एक साथ। यहाँ थोड़ी देर चुपचाप खड़े रहो, तो समझ आ जाएगा कि आज वह कितना बड़ा कुनबा भेज रहा है, और किस मिज़ाज में भेज रहा है।"',
      text: 'A boy finally asked him what he was counting. "The waves," said Pedru. "The sea does not send them all alike. She sends them in families — some small, then the big ones together. Stand still long enough and you learn the size of the family she is sending today, and the mood she sent it in."' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'उन्होंने लड़के को समंदर को सुनने की बाकी बातें भी सिखाईं। जहाँ लहरें टूटती हैं, उससे पार गहरे पानी का रंग। हवा और उठती लहरों के आपस में न मिलने का क्या मतलब होता है। और यह कि पानी पर बैठी चिड़ियाँ कुछ और कहती हैं, और ऊँचाई पर चुपचाप उड़ते पक्षी कुछ और।',
      text: 'He taught the boy the rest of the listening, too. The colour of the water out past the break. What it means when the wind and the swell disagree with each other. Why birds sitting on the water say one thing and birds flying high and silent say another.',
      ask: {
        q: 'The morning looks sunny and lovely, but Pedru counts the waves and says "no boats today". What has he noticed?',
        options: ['He is being too careful for no reason', 'The swell — big wave-families arriving from a storm far out at sea that the sky here cannot show', 'The fish have moved away'],
        answer: 1,
        right: 'That is the deep trick of it. A storm far over the horizon sends its waves ahead of it. The sky above you can be innocent while the sea beneath you is already carrying the news.',
        wrong: 'Pedru was never careful for no reason. A storm far over the horizon sends its swell ahead of it — the sky here can be innocent while the sea is already carrying the news. The waves told him what the weather had not.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: '"और सचमुच—अगर ऐसा न होता तो यह कहानी ही क्यों कही जाती—दोपहर होते-होते क्षितिज भीगे स्लेट जैसा गहरा हो गया, लहरें आदमी के कद से भी ऊँची उठने लगीं, और उस किनारे की सारी नावें रेत पर ऊपर खींच ली गईं, क्योंकि नाश्ते से पहले एक बुज़ुर्ग ने कुछ बार सात तक गिनती गिनी थी।"',
      text: 'And sure enough — the tale would not be told otherwise — by afternoon the horizon turned the colour of wet slate, and the surf stood up taller than a man, and the boats of that beach were all high on the sand, because an old man had counted to seven a few times before breakfast.' },
    { art: ['courtier'], who: null,
      hi: '"वह लड़का बड़ा होकर ऐसा आदमी बना जो अपनी बारी आने पर खुद पानी के किनारे खड़ा होकर गिनती गिनता था, और पास खड़ा एक बच्चा पूछता था कि आप क्या कर रहे हैं। बैरोमीटर आने से पहले सदियों तक खारवी लोगों ने अपनी समझ ऐसे ही संजोकर रखी: एक-एक किनारा, एक-एक सुबह, और एक-एक बार बड़े धीरज से समझाते हुए।"',
      text: 'The boy grew into the man who stood at the water\'s edge in his turn, counting, with a child beside him asking what he was doing. That is how the Kharvi kept their knowledge for all the centuries before barometers: one beach, one dawn, one patient explanation at a time.' },
    { art: ['guard'], who: null,
      hi: '"अब नावों में इंजन लग गए हैं, और फ़ोन मौसम का हाल बता देता है। लेकिन कभी किसी सुबह रेत पर गोवा के किसी बुज़ुर्ग मछुआरे को देखिएगा। स्क्रीन पर भरोसा करने से पहले वे अब भी अपनी आँखों से पानी को पढ़कर परखते हैं—मानो समंदर के अपने दस्तख़त से चिट्ठी का मिलान कर रहे हों।"',
      text: 'The boats have engines now, and the phone knows the forecast. But watch an old Goan fisherman on the sand some morning. He will still be reading the water with his eyes before he trusts the screen — checking the sea\'s own signature against the letter.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"समंदर उनसे बातें करता है जो चुपचाप खड़े होकर सुनने का सब्र रखते हैं। और सच तो यह है कि ज़्यादातर चीज़ें भी ऐसा ही करती हैं।"',
      text: 'The sea talks to those who stand still long enough to listen. So do most things, actually.' }
  ],
  moral: 'Listen first, decide second — the world sends its news ahead, for those who read it.',
  source: 'The sea-craft of the Kharvi fisher community of Goa — reading swell, wind and birds before launching — is real, old knowledge. This Pedru telling is composed for this app in their manner, and the source says so honestly rather than claiming a collected tale.'
},

/* ============================================= MAHARASHTRA =============== */
{
  id: 'it.jijabai-stories',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'itihaas',
  title: 'The Stories His Mother Told',
  hook: 'Before Shivaji ever held a sword, he held his mother\'s hand and listened. The stories came first. They always do.',
  hero: 'shivaji',
  cast: ['shivaji', 'courtier'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['माता', 'mata', 'mother'], ['कहानी', 'kahani', 'story'], ['हिम्मत', 'himmat', 'courage']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'शिवाजी का जन्म महाराष्ट्र के सह्याद्रि पहाड़ों में, शिवनेरी के पहाड़ी किले में हुआ था — यह बात इतिहास में पक्की दर्ज है। और हर दस्तावेज़ यही मानता है कि उनके बचपन के केंद्र में थीं उनकी माँ: जीजाबाई।',
      text: 'Shivaji was born in the hill fort of Shivneri, in the Sahyadri mountains of Maharashtra — that much is solid record. And the person at the centre of his childhood, every account agrees, was his mother: Jijabai.' },
    { art: ['shivaji', 'courtier'], who: null,
      hi: 'उन वर्षों में ज़्यादातर समय उनके पिता शहाजी दूर दक्षिण में सेवा में थे, इसलिए बालक का पालन-पोषण जीजाबाई ने ही किया — पहले शिवनेरी में, फिर पुणे में, जहाँ वे और नन्हे शिवाजी बसे और एक उजड़ी हुई जगह को अपना घर और एक नई शुरुआत बना दिया।',
      text: 'His father Shahaji served far away in the south for much of those years, so it was Jijabai who raised the boy — first at Shivneri, later at Pune, where she and young Shivaji settled and made a half-ruined place into a home and a beginning.' },
    { art: ['courtier'], who: null,
      hi: 'और उस परवरिश के बारे में मराठा परंपरा जिसे सबसे गहराई से याद रखती है, जिसे पीढ़ियों से बार-बार सुनाया जाता रहा है, वह यह है: जीजाबाई ने अपने बेटे को महाकाव्य सौंपे। रामायण की शामें। महाभारत, जिसे एक दृढ़ संकल्पी माँ के अंदाज़ में सुनाया गया — न्यायप्रिय राजाओं पर ज़ोर देते हुए, वचन निभाने पर, और जो गलत है उसके आगे सिर न झुकाने पर।',
      text: 'And this is what the Maratha tradition remembers best about that upbringing, told over and over down the generations: Jijabai gave her son the epics. Evenings of the Ramayana. The Mahabharata, told the way a strong-minded mother tells it — dwelling on the just kings, the keeping of word, the refusal to bow to what is wrong.' },
    { art: ['shivaji'], who: null, mood: 'think',
      hi: 'ज़रा उस बालक की कल्पना कीजिए जो यह सब सुन रहा है। उसके चारों ओर साफ़ नज़र आ रही थी वह दुनिया, जिसे ये कहानियाँ परख रही थीं: हर पहाड़ी पर बने किले, गुज़रती हुई सेनाएँ, और इस सब का बोझ उठाते आम किसान। पुरानी बखरें — यानी मराठी ऐतिहासिक दस्तावेज़ — कहती हैं कि माँ के सुनाने के ढंग और उनकी अपनी अटूट निष्ठा ने उस बालक के पूरे व्यक्तित्व को गढ़ा।',
      text: 'Picture the boy listening. Around him, in plain sight, the world the stories judged: forts on every hilltop, armies passing, ordinary farmers bearing the weight of it all. The old bakhars — the Marathi chronicles — say the mother\'s telling and the mother\'s own fierce piety shaped everything the boy became.',
      ask: {
        q: 'What did Jijabai actually give Shivaji with those evening stories?',
        options: ['A way to fall asleep', 'A measuring stick — stories of how a just ruler behaves, to hold against everything he saw', 'Lessons in sword-fighting'],
        answer: 1,
        right: 'That is what the tradition says the stories were for. Rama and Yudhishthira were not bedtime decoration. They were the standard the boy learned to measure kings by — including, one day, himself.',
        wrong: 'The sword-masters taught the fighting. The stories did something bigger: they gave him a measuring stick — how a just ruler behaves — to hold against everything he saw. Including, one day, himself.'
      } },
    { art: ['shivaji', 'courtier'], who: null,
      hi: 'कहानियों के साथ-साथ बाकी तालीम भी चलती रही: पहाड़ियों को समझना, उन पर घुड़सवारी करना, घाटियों के उन मावली किसान लड़कों को जानना जो एक दिन उनके पहले साथी बनने वाले थे। जीजाबाई खुद इन सब पर नज़र रखती थीं, जबकि भरोसेमंद बुजुर्ग पुणे में घर-बार और बालक के प्रशिक्षण का इंतज़ाम संभालते थे।',
      text: 'Alongside the stories came the rest of an education: reading the hills, riding them, knowing the Mavali farm boys of the valleys who would one day be his first companions. Jijabai oversaw it all, with trusted elders managing the household and the boy\'s training at Pune.' },
    { art: ['shivaji'], who: null, mood: 'wow',
      hi: 'आगे चलकर यह सब किसमें बदल गया? एक ऐसे महापुरुष में, जिसने ऐतिहासिक प्रमाणों के अनुसार किले और नौसेना बनाई, मराठी में राजकाज चलाया, जिनका रायगढ़ में राज्याभिषेक हुआ — और जिनके गुणगान महाराष्ट्र के लोकगीत साढ़े तीन सौ सालों से एक ऐसे राजा के रूप में गाते आ रहे हैं, जिसे वे पुरानी कहानियाँ भी सच्चा राजा मानतीं।',
      text: 'What did it grow into? A man who, by the plain record, built forts and a navy, ran an administration in Marathi, was crowned at Raigad — and whom the ballads of Maharashtra have sung for three and a half centuries as the king the old stories would have approved of.' },
    { art: ['courtier'], who: null,
      hi: 'और जीजाबाई यह देखने के लिए जीती रहीं। वे रायगढ़ में हुए राज्याभिषेक के ठीक बाद तक जीवित रहीं — मानो, जैसा कि पुरानी बातें कहती हैं, वे बस तब तक रुकी रहीं जब तक कि उनकी सुनाई कहानी सच न हो गई।',
      text: 'And Jijabai lived to see it. She lived until just after the coronation at Raigad — as if, the tradition likes to say, she stayed exactly long enough to see the story she had been telling come true.' },
    { art: ['shivaji'], who: 'mithu',
      hi: 'इस बात को साफ़ समझना चाहिए कि क्या लिखित इतिहास है और क्या यादें: बखर तो घटनाओं के बीत जाने के बाद लिखे गए थे, और किसी ने भी उन शामों को उसी वक़्त दर्ज नहीं किया था जब वे घट रही थीं। लेकिन परंपरा का हर एक सिरा, पुराने इतिहास से लेकर उन पोवाड़ों तक जिन्हें गायक आज भी गाते हैं, वही एक तस्वीर संजोए हुए है — माँ, बेटा, और सबसे पहले कहानियाँ। अभी इस वक़्त भी कोई आपको कहानियाँ सुना रहा है। ध्यान दीजिए कि वे कौन-सी हैं। वे ही तो सब थामे खड़ी हैं।',
      text: 'Be honest about what is record and what is memory: the bakhars were written after the events, and no one wrote down those evenings as they happened. But every strand of the tradition, from the chronicles to the powadas the singers still perform, keeps the same picture — the mother, the boy, the stories first. Somebody is telling you stories right now. Notice which ones. They are load-bearing.' }
  ],
  moral: 'The stories a child is given become part of the adult\'s strength — choose and tend them well.',
  source: 'Shivaji\'s birth at Shivneri, Jijabai\'s central role in his upbringing at Shivneri and Pune, and her death shortly after the Raigad coronation are well attested. The evening-story picture rests on the Maratha bakhar tradition (e.g. the Sabhasad bakhar, written a generation later) and the powada ballad tradition — honoured memory, recorded after the fact, and presented here as exactly that.'
},

{
  id: 'fk.warkari-ant',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'The Ant on the Palkhi Road',
  hook: 'Every year, lakhs of people walk for days to Pandharpur, singing. One year — the story says — an ant set out with them.',
  hero: 'pt_mouse',
  cast: ['pt_mouse', 'courtier'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['यात्रा', 'yatra', 'pilgrimage'], ['चींटी', 'cheenti', 'ant'], ['संग', 'sang', 'together']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हर साल, आषाढ़ के बरसाती महीने में, महाराष्ट्र की सड़कें पदयात्रियों से भर जाती हैं — लाखों-लाख वारकरी, जो संतों की पालकियों के पीछे कई दिनों तक पैदल चलते हैं, ताकि पंढरपुर में अपनी ईंट पर खड़े इंतज़ार कर रहे साँवले देवता विट्ठल तक पहुँच सकें। वे पूरे रास्ते गाते हुए चलते हैं। यह शायद इस धरती की सबसे बड़ी पदयात्रा है।',
      text: 'Every year, in the rain month of Ashadh, the roads of Maharashtra fill with walkers — the Warkaris, lakhs upon lakhs of them, walking for days behind the palkhis of the saints to reach Vitthal, the dark god who stands waiting on his brick in Pandharpur. They sing the whole way. It is quite possibly the biggest walk on Earth.' },
    { art: ['pt_mouse', 'courtier'], who: null,
      hi: 'यह एक ऐसी कहानी है जिसे वारकरी कथावाचक उस रास्ते के बारे में सुनाना पसंद करते हैं। एक साल, उस विशाल डिंडी के सबसे पिछले हिस्से में, एक यात्री ने नीचे देखा तो उसे एक चींटी दिखाई दी — एक छोटी-सी काली चींटी, जो धूल में चलती हुई उसी तरफ़ जा रही थी जिधर बाकी सब जा रहे थे।',
      text: 'This is a story the Warkari tellers like to tell about that road. One year, at the very tail of the great procession, a walker looked down and saw an ant — one small black ant, walking in the dust, heading the same way as everybody else.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"और तुम कहाँ जा रही हो, नन्हीं सी?" उसने हँसी-मज़ाक में पूछा। "पंढरपुर," चींटी ने बिना रुके कहा, "विट्ठल के दर्शन करने।" यात्री अपनी हँसी रोक नहीं पाया। "मावशी, मेरे लिए तो यह कई दिनों की पैदल यात्रा है। तुम्हारे लिए तो यह दस जन्मों का सफ़र है। तुम कभी नहीं पहुँच पाओगी।"',
      text: '"And where are you going, little one?" he asked, mostly joking. "To Pandharpur," said the ant, not stopping, "to see Vitthal." The walker laughed before he could help it. "Mavshi, it is many days\' walking for me. For you it is the journey of ten lifetimes. You will never reach."' },
    { art: ['pt_mouse'], who: 'pt_mouse', mood: 'think',
      hi: 'चींटी चलती रही। "तो मैं दस जन्मों में पहुँचूँगी," उसने कहा। "तुम इसलिए चल रहे हो क्योंकि तुम उनसे प्रेम करते हो। मैं इसलिए चल रही हूँ क्योंकि मैं उनसे प्रेम करती हूँ। भला तुम्हारा चलना मेरे चलने से बड़ा कैसे हो गया?"',
      text: 'The ant kept walking. "Then I will reach in ten lifetimes," she said. "You are walking because you love him. I am walking because I love him. In what way is your walking bigger than mine?"',
      ask: {
        q: 'The walker laughed at the ant\'s tiny steps. Was he right — is his pilgrimage worth more than hers?',
        options: ['Yes — he will actually get there', 'No — the love is the pilgrimage, and hers is the same size as his', 'Ants cannot go on pilgrimage'],
        answer: 1,
        right: 'That is the answer the Warkari path itself gives. On this road nobody\'s devotion outranks anybody\'s. The walking is love made visible — and love does not come in sizes.',
        wrong: 'The walker thought so too, for a moment. Then he understood what the road had been teaching all along: the love IS the pilgrimage, and hers was exactly the size of his.'
      } },
    { art: ['courtier', 'pt_mouse'], who: null, mood: 'wow',
      hi: 'यात्री की हँसी थम गई। वह नीचे झुका, अपनी हथेली धूल पर सीधी फैलाई, और चींटी को उस पर चढ़ने दिया। "तो फिर मेरे साथ चलो, मावशी। तुम्हारे पैरों ने आज का अपना हिस्सा पूरा कर लिया है।" और उसने उसे अपने कंधे पर बिठा लिया, और जब उसने आराम किया, तो किसी दूसरे यात्री ने उसे उठा लिया, और फिर किसी और ने।',
      text: 'The walker stopped laughing. He bent down, held his palm flat in the dust, and let the ant climb on. "Then ride with me, mavshi. Your feet have done their share of today." And he carried her on his shoulder, and when he rested, another walker carried her, and then another.' },
    { art: ['courtier'], who: null,
      hi: 'कहानी सुनाने वाले इसी बात पर ज़ोर देते हैं। वारकरी की राह पर, हर यात्री दूसरे यात्री को "माउली" — यानी माँ — कहता है, चाहे वह कोई प्रोफ़ेसर हो, किसान हो या फिर कोई चींटी ही क्यों न हो। जो भी थकता है, बाकी सब उसे साथ लेकर आगे बढ़ते हैं। यह जत्था एक लाख पैरों वाला एक ही शरीर है।',
      text: 'That is the part the tellers lean on. On the Warkari road, every walker calls every other walker "Mauli" — mother — whether they are a professor or a farmer or, apparently, an ant. Whoever tires is carried along by the rest. The procession is one body with a lakh of feet.' },
    { art: ['pt_mouse'], who: null,
      hi: 'क्या वह चींटी पंढरपुर पहुँची? कहानियों के अनुसार, वह गाते-गुनगुनाते कंधों पर सवार होकर नगर पहुँची, और रास्ते की सबसे बेहतरीन जगह से उसने विट्ठल के दर्शन किए। दस जन्मों का सफ़र, एक ही में पूरा हो गया — इसलिए नहीं कि उसकी टाँगें लंबी हो गई थीं, बल्कि इसलिए कि रास्ते ने खुद उसे उठा लिया था।',
      text: 'Did the ant reach Pandharpur? In the telling, she rode into town on a singing shoulder, and saw Vitthal from the best seat on the road. Ten lifetimes\' journey, done in one — not because her legs grew longer, but because the road itself picked her up.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'वारकरी संतों ने गाया है कि सबसे छोटे जीव की भक्ति भी सूरज को निगल सकती है। जब आपके पास प्रेम और साथ हो, तो कहानीकार कहते हैं, गणित भी हार मान लेता है। साथ चले रास्ते का कुल जोड़ वह कभी गिन नहीं पाता।',
      text: 'The Warkari saints sang that the smallest creature\'s devotion can swallow the sun. When you have love and company, the tellers say, arithmetic gives up. It cannot count what a shared road adds up to.' }
  ],
  moral: 'On a road walked together, the smallest walker arrives with everyone else.',
  source: 'A teaching tale in the manner of Warkari kirtan tellings, set on the real Pandharpur wari of Maharashtra — the annual pilgrimage where walkers call one another Mauli and the tired are carried along. The wari and its customs are living fact; this ant\'s telling varies from teller to teller, as kirtan tales do.'
},

{
  id: 'fk.tukaram-notebooks',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'The Notebooks That Came Back',
  hook: 'They made him sink his life\'s poems in the river. He sat on the bank and waited. This is the katha of what the river did.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['कविता', 'kavita', 'poem'], ['नदी', 'nadi', 'river'], ['श्रद्धा', 'shraddha', 'faith']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'चार सौ साल पहले, पुणे के पास इंद्रायणी नदी के किनारे बसे देहू गाँव में, तुकाराम नाम के एक दुकानदार-किसान रहते थे — और उनके भीतर से कविताओं का झरना फूट पड़ा। इन्हें अभंग कहा जाता है: विट्ठल के लिए रचे गए छोटे, तेजस्वी पद, जो सीधी-सादी मराठी में थे — रसोई और खेत-खलिहान की भाषा में।',
      text: 'Four hundred years ago, in the village of Dehu on the Indrayani river near Pune, lived a shopkeeper-farmer named Tukaram — and out of him poured poems. Abhangs, they are called: short, blazing verses to Vitthal, in plain Marathi, the language of the kitchen and the field.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'वही सादगी उनकी खूबी भी थी, और वही मुसीबत भी। कोई किसान हल चलाते हुए उन्हें गा सकता था। कोई दादी-नानी उन्हें एक दीए की तरह थाम सकती थीं। लेकिन उस ज़माने के कुछ विद्वान भड़क उठे: उनका कहना था कि पवित्र बातें सिर्फ संस्कृत और सही हाथों की धरोहर हैं। यह गँवई आदमी कौन होता है, जो रोज़मर्रा के शब्दों में भगवान को बहा रहा है?',
      text: 'That plainness was the wonder of them, and the trouble. A farmer could sing them at the plough. A grandmother could hold one like a lamp. But some learned men of the day were scandalised: sacred things, they said, belonged in Sanskrit, in the proper hands. Who was this villager, pouring God out in everyday words?' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'दबाव आखिरकार एक बेरहम माँग में बदल गया। वे कॉपियाँ — वे वहियाँ जिनमें तुकाराम जी के जीवन भर के अभंग लिखे थे — इंद्रायणी नदी में डुबोई जानी थीं। और, कथा कहती है, उन्हें सचमुच डुबो दिया गया: वज़न बाँधकर नदी में बहा दिया गया, और तुकाराम जी बस देखते रहे।',
      text: 'The pressure ended in a cruel demand. The notebooks — the vahis in which Tukaram\'s life of poems was written — were to be sunk in the Indrayani. And, the katha says, sunk they were: weighted, and given to the river, while Tukaram watched.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'जब किसी कवि की ज़िंदगी भर की मेहनत पानी में डूब जाए, तो वह क्या करे? तुकाराम जी न तो चिल्लाए, और न ही घर लौटे। वे इंद्रायणी के किनारे बैठ गए और उनका ध्यान धरने लगे जिनके लिए उन्होंने अपनी हर एक पंक्ति लिखी थी। परंपरा याद करती है कि वे वहाँ तेरह दिनों तक उपवास करते रहे, विट्ठल के भजन गाते रहे।',
      text: 'What does a poet do when his life\'s work goes under the water? Tukaram did not shout, and he did not go home. He sat down on the bank of the Indrayani and turned to the one he had written every line for. The tradition remembers him fasting there, singing to Vitthal, for thirteen days.',
      ask: {
        q: 'The poems are at the bottom of the river. What is Tukaram\'s answer?',
        options: ['Write them all again from memory', 'Sit at the river and put the whole matter in Vitthal\'s hands', 'Give up poetry forever'],
        answer: 1,
        right: 'That is the katha. He gave the matter to the one the poems belonged to, and waited — thirteen days on the bank, singing.',
        wrong: 'He might have — his memory held them all. But the katha tells it otherwise: he gave the matter to the one the poems belonged to, and waited on the bank, singing, for thirteen days.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और तेरहवें दिन, कथा कहती है, नदी ने उन्हें वापस लौटा दिया। वहियाँ पानी की सतह पर तैर आईं — पूरी की पूरी सुरक्षित, न पन्ने खराब हुए, न स्याही फैली, इतनी सूखी मानो धूप में रखी रही हों। इंद्रायणी ने उन्हें ठीक वैसे ही सँभाले रखा जैसे कोई सहेली अपनी दोस्त की दी हुई चीज़ सँभाल कर रखती है।',
      text: 'And on the thirteenth day, the katha says, the river gave them back. The vahis rose to the surface — carried up whole, the pages unspoiled, the ink unblurred, dry as if they had been lying in sunshine. The Indrayani had kept them the way a friend keeps what you hand her.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'यह बात नदी की लहरों की तरह ही तेज़ी से गाँव-गाँव फैल गई। हर किसी को वही बात समझ आई जो उन पढ़े-लिखे विरोधियों को बिल्कुल पसंद नहीं थी: ईश्वर को मराठी से कोई परहेज़ नहीं था। पंढरपुर के भगवान अपनी चौके-चूल्हे की आम भाषा वाली कविताओं को डूबने नहीं दे सकते थे।',
      text: 'Word of it ran through the villages like the river itself. The message everyone took was the one the learned objectors least wanted: heaven, apparently, had no quarrel with Marathi. The god of Pandharpur would not let the kitchen-language poems drown.' },
    { art: ['courtier'], who: null,
      hi: 'उस दिन से लेकर आज तक, वारकरी उन अभंगों को गाते आ रहे हैं। लाखों लोगों को वे ज़बानी याद हैं — पंढरपुर की राह पर, खेतों में, और रात को सोते समय। कॉपियों को डुबोना, सच कहें तो, कविताओं की किताब के साथ की गई सबसे बेअसर बात साबित हुई।',
      text: 'The Warkaris have sung those abhangs from that day to this. Millions know them by heart — on the Pandharpur road, in the fields, at bedtime. Sinking the notebooks, it turned out, was the least effective thing anyone ever did to a book of poems.' },
    { art: ['guard'], who: 'mithu',
      hi: 'तुकाराम जी एक जीते-जागते इंसान थे, और उनके अभंग भी सच हैं — तुम आज रात भी कोई एक अभंग गा सकते हो। वे तेरह दिन और पानी पर तैरती वहियाँ उनकी कथा हैं, जिसे चार सदियों से बड़े प्यार से सुनाया जाता रहा है। चाहे जो भी हो, एक बात तो पक्की है: जो दिल से लिखा जाए, और लोगों की अपनी बोली में हो, उसे डुबो पाना बहुत मुश्किल होता है।',
      text: 'Tukaram was a real man, and his abhangs are real — you can sing one tonight. The thirteen days and the rising vahis are his katha, told with love for four centuries. What is certain either way: what is written from the heart, in the people\'s own tongue, is very hard to sink.' }
  ],
  moral: 'What is written from the heart does not sink.',
  source: 'The katha of Sant Tukaram\'s vahis and the Indrayani river, as the Warkari tradition of Maharashtra tells it. Tukaram of Dehu (17th century) and his Marathi abhangs are historical; the thirteen days and the river\'s return of the notebooks are presented as katha — the story as it is told and sung, from the inside.'
},

{
  id: 'fk.hirkani-cliff',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'Hirkani\'s Wall',
  hook: 'The fort gates shut at sunset, with the milkmaid inside — and her baby at home, far below the cliff no one had ever climbed down.',
  hero: 'courtier',
  cast: ['courtier', 'shivaji'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['दूध', 'doodh', 'milk'], ['चट्टान', 'chattan', 'cliff'], ['ममता', 'mamta', 'a mother\'s love']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'शिवाजी महाराज की महान राजधानी, रायगढ़, एक ऐसे पहाड़ पर खड़ा है जिसका सिर बादलों में रहता है — जहाँ ज़रूरत थी वहाँ दीवारें हैं, और जहाँ सीधी खड़ी चट्टान है, वहाँ बिल्कुल कोई दीवार नहीं, क्योंकि किसी दीवार की कोई ज़रूरत ही नहीं थी। रायगढ़ की चट्टानों पर कोई नहीं चढ़ सकता। रायगढ़ का पूरा विचार ही यही था।',
      text: 'Raigad, Shivaji\'s great capital, stands on a mountain with its head in the clouds — walls where walls are needed, and where the cliff falls sheer, no walls at all, because none were needed. Nobody climbs Raigad\'s cliffs. That was the whole idea of Raigad.' },
    { art: ['courtier'], who: null,
      hi: 'हर सुबह, नीचे के गाँवों की औरतें दूध बेचने के लिए क़िले के लंबे रास्ते पर चढ़ती थीं — कथा कहती है कि उन्हीं में हिरकणी नाम की एक नौजवान गवली ग्वालन भी थी, जो रास्ते पर तेज़ी से चलती थी, और गाँव में घर पर उसका एक नन्हा बेटा था।',
      text: 'Every morning, women from the villages below climbed the long fort path to sell milk — among them, the katha says, a young Gavli milkmaid named Hirkani, quick on the path, with a baby son at home in the village.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'एक शाम दूध बेचने में देर हो गई, और सूर्यास्त की तोप की आवाज़ गूँजी, और रायगढ़ के भारी दरवाज़े बंद हो गए — जैसा हर रात होता था, सुबह तक किसी के लिए भी न खुलने वाले। यह क़िले का पक्का नियम था, और इसी नियम ने क़िले को सुरक्षित रखा था। हिरकणी अंदर ही फँसी रह गई थी। उसका बच्चा नीचे था।',
      text: 'One evening the selling ran late, and the sunset gun sounded, and the great gates of Raigad swung shut — as they did every night, opening for no one until dawn. That was the fort\'s iron rule, and it had kept the fort alive. Hirkani was on the wrong side of it. Her baby was below.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'उसने दरवाज़े पर बहुत मिन्नतें कीं। पहरेदारों को अफ़सोस हुआ — सचमुच बहुत अफ़सोस — पर उन्होंने दरवाज़ा नहीं खोला। जो नियम किसी एक के लिए बदल जाए, वह नियम ही नहीं होता। वह धुंधलके में खड़ी थी और सामने पूरी रात पड़ी थी, और उसके क़दम, लगभग अपने आप ही, उसे दीवार के साथ-साथ वहाँ ले गए जहाँ दीवार ख़त्म होती थी: चट्टान के किनारे।',
      text: 'She begged at the gate. The guards were sorry — genuinely sorry — and did not open it. Rules that bend for one person are not rules. She stood in the dusk with the whole night ahead, and her feet, almost by themselves, took her along the wall to where the wall ended: the cliff edge.',
      ask: {
        q: 'The gates will not open until dawn. Her baby is at the bottom of the mountain. What does Hirkani do?',
        options: ['Wait for morning — the baby is with family', 'Go down the cliff nobody has ever climbed, in the dark', 'Shout down to the village from the wall'],
        answer: 1,
        right: 'She went down the cliff. In the dark. The katha does not pretend it was sensible — it says her baby was crying, and that settled it.',
        wrong: 'Any sensible person would. But a mother\'s arithmetic is different: her baby was crying at the bottom of the mountain, so she went down the cliff. In the dark.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'हाथ-दर-हाथ, पैर-दर-पैर, ऐसी जड़ों, दरारों और पत्थरों के सहारे जहाँ जाने से एक बकरी भी इनकार कर देती, हिरकणी अँधेरे में रायगढ़ की चट्टान से नीचे उतरती गई — लहूलुहान, जगह-जगह से छिलती हुई, पर बिना पकड़ छोड़े — और आधी रात से पहले अपने घर पहुँचकर उसने अपने बेटे को गले से लगा लिया।',
      text: 'Hand under hand, toe by toe, by roots and cracks and ledges a goat would have refused, Hirkani climbed down the cliff of Raigad in the darkness — torn, bleeding, never letting go — and walked into her own house before midnight, and picked up her son.' },
    { art: ['shivaji', 'courtier'], who: null,
      hi: 'सुबह यह बात शिवाजी महाराज तक पहुँची। एक पहरेदार को लगा कि महाराज बहुत क्रोधित होंगे — क़िले की नामुमकिन चट्टान को एक ग्वालन ने पार कर लिया था। कथा कहती है कि राजा ने हिरकणी को बुलवाया, उसकी पूरी बात सुनी, और उसका सम्मान किया: एक साड़ी, ढेरों उपहार, और उसके उस साहस की खुले दिल से प्रशंसा जिसकी बराबरी करने में उनके सैनिकों को भी मुश्किल होती।',
      text: 'In the morning the story reached Shivaji. A guard expected fury — the fort\'s unclimbable cliff, climbed by a milkmaid. The katha says the king sent for Hirkani, heard her out, and honoured her: a sari, gifts, and his open admiration for a courage his soldiers would struggle to match.' },
    { art: ['shivaji'], who: 'shivaji',
      hi: 'और फिर उन्होंने वही किया जिसे यह कथा सबसे अनमोल मानती है। जहाँ से वह नीचे उतरी थी, वहाँ उन्होंने दीवार को आगे बढ़ाने का आदेश दिया — और उस नए बुर्ज का नाम उसके नाम पर रखा। किसी सेनापति के नाम पर नहीं। उस ग्वालिन के नाम पर। हिरकणी बुर्ज: हिरकणी का बुर्ज।',
      text: 'And then he did the thing the katha treasures most. Where she had climbed down, he ordered the wall extended — and named the new bastion after her. Not after a general. After the milkmaid. Hirkani Buruj: Hirkani\'s Tower.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज आप रायगढ़ पर चढ़ें तो हिरकणी बुर्ज पर खड़े हो सकते हैं — वह सचमुच वहाँ है, नक्शों पर दर्ज है, और गाइड आपको वहीं खड़े होकर यह कथा सुनाएँगे। सिपाहियों से भरा एक किला, और उसकी दीवार पर उस माँ का नाम है जो बस अपने घर पहुँचना चाहती थी। तब से आज तक महाराष्ट्र यह कथा सुनाता आ रहा है, और सुनकर समझ आता है कि क्यों।',
      text: 'Climb Raigad today and you can stand on Hirkani Buruj — it is real, it is on the maps, and guides will tell you this katha on the spot. A fortress full of soldiers, and the wall bears the name of a mother who wanted to get home. Maharashtra has been telling it ever since, and one hears why.' }
  ],
  moral: 'Love finds the path that no one else can see — and deserves its name on the wall.',
  source: 'The katha of Hirkani the Gavli milkmaid and the cliff of Raigad, as told in Maharashtra for generations. The fort of Raigad and the bastion called Hirkani Buruj are real; the tale of the night climb and Shivaji\'s honouring of her is tradition, presented as katha.'
},

/* ================================================== GUJARAT ============== */
{
  id: 'fk.gir-maldhari',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'aaj',
  title: 'The Forest With Two Kinds of Families',
  hook: 'In the last forest of the Asiatic lion, there also live people — and the lions and the herders both know exactly how to behave.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'guard'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['शेर', 'sher', 'lion'], ['भैंस', 'bhains', 'buffalo'], ['पड़ाव', 'padaav', 'settlement']],
  scenes: [
    { art: ['pt_lion'], who: null,
      hi: 'पूरी दुनिया में बाकी हर जगह, जंगली शेरों का घर अफ़्रीका है। हर जगह, सिवाय गुजरात के एक सूखे, कँटीले और खूबसूरत जंगल के, जिसका नाम है गिर — एशियाई शेरों का आखिरी ठिकाना। एशिया का हर जंगली शेर इसी एक जंगल में और इसके आस-पास रहता है। और वे वहाँ अकेले नहीं हैं।',
      text: 'Everywhere else on Earth, the wild lion\'s home is Africa. Everywhere except one dry, thorny, beautiful forest in Gujarat called Gir — the last home of the Asiatic lion. Every wild lion in Asia lives in and around this one forest. And they are not alone in it.' },
    { art: ['guard'], who: null,
      hi: 'गिर के जंगलों में भीतर मालधारी रहते हैं — पशुपालक परिवार, जिनकी बस्तियाँ जिन्हें नेस कहा जाता है, ठीक शेरों के जंगल के बीच बसी हैं। काँटों की बाड़ से घिरे बाड़े, मिट्टी के घर, और बड़ी-बड़ी काली भैंसों के झुंड। मालधारी का मतलब है मवेशी पालने वाले; वे इतनी पुरानी पीढ़ियों से इन ज़मीनों पर अपने जानवर चराते आए हैं कि किसी को याद भी नहीं।',
      text: 'Deep inside Gir live the Maldharis — herding families whose settlements, called nesses, sit right in the lion\'s forest. Thorn-fence corrals, mud houses, and herds of big black buffaloes. Maldhari means keeper of animals; they have grazed these lands for generations beyond memory.' },
    { art: ['pt_lion', 'guard'], who: null, mood: 'wow',
      hi: 'इसका मतलब है कि मालधारी बच्चे उस तरह बड़े होते हैं जैसे दुनिया में शायद ही कोई और बच्चा होता हो: जंगली शेरों के पड़ोस में। बाड़े में बंद शेरों के नहीं। पानी के रास्ते पर मिलते शेर, रात के सन्नाटे में दहाड़ते शेर, बस एक खेत दूर छाँव में आराम करते शेर।',
      text: 'Which means Maldhari children grow up in a way almost no other children on Earth do: with wild lions as neighbours. Not lions in an enclosure. Lions on the path to the water, lions calling across the night, lions resting in the shade a field away.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'किसी मालधारी बुज़ुर्ग से पूछिए कि यह भला कैसे मुमकिन हो पाता है, तो वे बताएँगे कि यह सब कायदों से चलता है — शेरों के भी और उनके अपने भी। "हम उनके तौर-तरीके जानते हैं, वे हमारे," वे कहेंगे। "दोनों में से कोई किसी को चौंकाता नहीं। असली ख़तरा तो बस अचानक सामने आ जाने में है।"',
      text: 'Ask a Maldhari elder how that can possibly work and he will tell you it works on manners — the lions\' and theirs. "We know their ways, they know ours," he will say. "Neither side surprises the other. Surprise is the only real danger."',
      ask: {
        q: 'What actually keeps the peace between herders and lions in Gir?',
        options: ['High walls around every ness', 'Knowing each other\'s ways — respectful distance, buffalo herds guarded, no surprises', 'The lions are tame'],
        answer: 1,
        right: 'That is the heart of it. The herds are corralled at night behind thorn, people move with awareness, the lions keep their hunting to the wild. Two kinds of families, each predictable to the other.',
        wrong: 'The lions of Gir are entirely wild, and thorn fences stop no lion that has decided otherwise. What works is knowledge: each side knows the other\'s ways, and neither surprises the other.'
      } },
    { art: ['pt_lion'], who: null,
      hi: '"इसकी एक क़ीमत चुकानी पड़ती है — कभी-कभी शेर किसी चरवाहे की भैंस ले जाता है, और यह उस परिवार के लिए सचमुच एक बड़ा नुक़सान होता है। फिर भी, अगर आप मालधारियों से पूछें कि क्या शेरों को चले जाना चाहिए, तो हर बार जवाब \'ना\' ही होता है। शेर जंगल की शान हैं, और उनकी भी। बिना शेरों के गिर, गिर नहीं रहेगा।"',
      text: 'It costs something — a herder sometimes loses a buffalo to a lion, and that is a real loss borne by a family. Yet ask Maldharis whether the lions should go, and the answer, again and again, is no. The lion is the forest\'s honour, and theirs. A Gir without lions would not be Gir.' },
    { art: ['guard', 'pt_lion'], who: null,
      hi: '"सौ साल पहले शेर लगभग ख़त्म ही हो चुके थे — बस कुछ दर्जन बचे थे। उन्हें बचाया जूनागढ़ के शासकों द्वारा शुरू की गई सुरक्षा ने, जिसे बाद में वनकर्मियों ने जारी रखा; और जिस बात ने इस बचाव को आज भी ज़िंदा रखा है, वह यह है: एक ऐसा जंगल जहाँ शेरों के सबसे पास रहने वाले लोग हर रोज़ उनके साथ मिलकर रहना चुनते हैं।"',
      text: 'A century ago the lions were nearly gone — down to a few dozen. What saved them was protection begun by the rulers of Junagadh and carried on by foresters since; and what has kept the saving alive is this: a forest where the people who live closest to lions choose, daily, to live with them.' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      hi: '"आज शेरों की संख्या सैकड़ों में है और वे जंगल की सीमाओं से आगे तक फैल चुके हैं, सौराष्ट्र के खेतों और मंदिरों के पास से बेफ़िक्र टहलते हुए निकलते हैं, जहाँ ज़्यादातर लोग गर्व से उनका स्वागत करते हैं। किसी गुजराती से गिर के शेर के बारे में पूछकर देखिए और देखिए वे कैसे शान से तनकर खड़े हो जाते हैं।"',
      text: 'Today the lions number in the hundreds and have spread beyond the forest edges, walking coolly past farms and temples of Saurashtra, greeted mostly with pride. Ask a Gujarati about the Gir lion and watch their back straighten.' },
    { art: ['guard'], who: 'mithu',
      hi: '"इंसान और बड़े जंगली जानवर, सदियों से आपसी अदब और समझदारी के साथ एक ही घर बाँट रहे हैं। यह भारत की सबसे उम्मीद भरी सच्ची कहानियों में से एक है — और गिर के मालधारी इसके रखवाले हैं।"',
      text: 'People and big wild animals sharing one home, by mutual good manners, for centuries. It is one of the most hopeful true stories in India — and the Maldharis of Gir are its keepers.' }
  ],
  moral: 'Sharing a home takes manners on both sides — and it can be done; Gir is the proof.',
  source: 'The Asiatic lions of Gir, Gujarat — their last wild home — and the Maldhari herding communities whose nesses lie within the forest. The near-loss of the lions a century ago, their protection begun under Junagadh, and the living coexistence are documented fact, told here from the Maldhari side as well as the lion\'s.'
},

{
  id: 'fk.garba-lamp',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'The Lamp Inside the Pot',
  hook: 'In the middle of the biggest dance in the world sits the smallest thing: one clay pot, with holes, and a lamp burning inside it.',
  hero: 'durga',
  cast: ['durga', 'courtier'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['दीपक', 'deepak', 'lamp'], ['घड़ा', 'ghada', 'clay pot'], ['नौ', 'nau', 'nine']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर साल पतझड़ की नौ रातों में — नवरात्रि पर — गुजरात झूमकर नाचता है। ऐसा नहीं कि मंच पर नर्तक हों और दर्शक बैठ कर देख रहे हों: पूरे के पूरे मोहल्ले, पूरे के पूरे शहर, नन्हे बच्चों से लेकर परदादियों तक, सभी देर रात तक बड़े-बड़े गोल घेरों में नाचते हैं। यह शायद पूरी दुनिया का सबसे बड़ा नृत्य है। इसे गरबा कहते हैं।"',
      text: 'For nine nights every autumn — Navratri — Gujarat dances. Not a stage of dancers and an audience watching: whole neighbourhoods, whole towns, everyone from toddlers to great-grandmothers, dancing in enormous circles late into the night. It may be the biggest dance on Earth. It is called garba.' },
    { art: ['durga', 'courtier'], who: null,
      hi: '"और इन गोल घेरों के बीच में, जहाँ आप किसी मंच या किसी बड़े कलाकार की उम्मीद करेंगे, वहाँ एक साधारण सी चीज़ रखी होती है: मिट्टी का एक मटका, जिसमें चारों तरफ़ छोटे-छोटे छेद होते हैं और अंदर एक तेल का दीया जल रहा होता है। उस मटके को \'गरबो\' कहते हैं। इसी के नाम पर इस नाच का नाम पड़ा है। हर कोई उसी नन्ही सी रोशनी के इर्द-गिर्द घूमता है।"',
      text: 'And at the centre of the circles, where you might expect a stage or a star performer, sits something humble: a clay pot, pierced all over with little holes, with an oil lamp burning inside. The pot is the garbo. The dance is named after it. Everything turns around that small light.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'अपनी पहली नवरात्रि पर एक बच्ची ने अपनी माँ से बिल्कुल सही सवाल पूछा: "हम एक मटके के चारों तरफ क्यों नाचते हैं?" उसकी माँ उसे बीच में ले गईं और उसे ध्यान से देखने दिया — वह मिट्टी, उसमें बने छेद, और हर छेद से बाहर चमकती हुई लौ।',
      text: 'A girl at her first Navratri asked her mother the right question: "Why do we dance around a pot?" Her mother took her to the centre and let her look at it properly — the clay, the holes, the flame glowing out through each one.',
      ask: {
        q: 'What does the lamp inside the clay pot stand for?',
        options: ['It is just a decoration', 'The pot is the body, the lamp is the life inside — the Devi\'s spark in every one of us', 'It marks the middle so dancers do not get lost'],
        answer: 1,
        right: '"This is you," her mother said. "This is all of us. Clay outside, light inside. For nine nights we honour the Mother — and her lamp burning in every single body dancing here."',
        wrong: 'It does mark the middle — but that is the smallest part of it. "This is you," her mother said. "Clay outside, light inside. The Devi\'s lamp burns in every single body dancing here."'
      } },
    { art: ['durga'], who: null,
      hi: 'ये नौ रातें देवी की होती हैं — माता के अनेक रूपों की, जिनका आदर दिन में व्रत रखकर और रात में नाचकर किया जाता है। कई परिवारों में घर पर भी गरबो की स्थापना की जाती है, दीया जलता रहता है, जो त्योहार के दौरान घर का अपना एक छोटा सा केंद्र बन जाता है।',
      text: 'The nine nights belong to the Devi — the Mother Goddess in her many forms, honoured with fasting by day and dancing by night. In many families the garbo is installed at home too, the lamp kept burning, the household\'s own small centre for the festival.' },
    { art: ['courtier', 'durga'], who: null, mood: 'wow',
      hi: 'और यह नाच खुद इस रहस्य को दोहराता है। गरबा गोल घेरे में घूमता है — न कोई आगे, न कोई कोना, न कोई सबसे अच्छी जगह। यह घेरा उस रोशनी के चारों ओर वैसे ही घूमता है जैसे ध्रुवतारे के चारों ओर तारे घूमते हैं, जैसे साल भर मौसम घूमते हैं। नाचने वाले अपने कदमों से यही कहते हैं: सब कुछ घूमता रहता है; रोशनी अपनी जगह टिकी रहती है।',
      text: 'And the dance itself repeats the secret. Garba goes in circles — no front, no corners, no best seat. The circle wheels around the light the way the stars wheel around the pole star, the way the seasons wheel around the year. The dancers say it with their feet: everything turns; the light holds still.' },
    { art: ['courtier'], who: null,
      hi: 'दादियाँ-नानियाँ अंदर के धीमे घेरों में नाचती हैं, किशोर बाहर के तेज़ घेरों में घूमते हैं, और हज़ारों हाथों की तालियाँ एक ही ताल पर एक साथ पड़ती हैं। फिर डांडिया की डंडियाँ निकल आती हैं और घेरे आपस में टकराती, हँसती-खिलखिलाती नदियाँ बन जाते हैं। किसी को रिहर्सल की ज़रूरत नहीं होती। गुजरात सदियों से इसका अभ्यास कर रहा है।',
      text: 'Grandmothers dance the slow inner circles, teenagers spin in the fast outer ones, and the claps come down on the same beat from a thousand hands. Then the dandiya sticks come out and the circles become clashing, laughing rivers. Nobody needs a rehearsal. Gujarat has been rehearsing for centuries.' },
    { art: ['durga', 'courtier'], who: null,
      hi: 'दुनिया में गुजराती परिवार जहाँ भी गए हैं — और वे तो हर जगह गए हैं — नवरात्रि भी उनके साथ गई है। लंदन, न्यू जर्सी और नैरोबी के हॉलों में, वही घेरे उसी छोटे से दीये के चारों ओर घूमते हैं, और जिन बच्चों ने कभी गुजरात नहीं देखा, वे वे कदम सीखते हैं जो उनकी परदादियों को आते थे।',
      text: 'Wherever Gujarati families have gone in the world — and they have gone everywhere — Navratri goes too. In halls in London and New Jersey and Nairobi, the same circles turn around the same small lamp, and children who have never seen Gujarat learn the steps their great-grandmothers knew.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'दुनिया का सबसे बड़ा नाच, सबसे छोटी रोशनी के इर्द-गिर्द रचा हुआ — और वह रोशनी ही सबसे ज़रूरी बात है। कई परिवारों में लोग आपसे कहेंगे: ऐसे नाचो ताकि तुम्हारे अंदर की लौ भी जलती रहे।',
      text: 'The biggest dance in the world, arranged around the smallest light — and the light is the point. In many families they will tell you: dance so that the one inside you stays lit.' }
  ],
  moral: 'Honour the light inside — yours and everyone\'s — and the circle has room for all.',
  source: 'The garba of Gujarat: the pierced clay garbo with its lamp as the Devi\'s emblem and the body\'s indwelling light, danced in circles through the nine nights of Navratri, at home and across the Gujarati diaspora. A living devotional tradition, told from the inside; family explanations vary, and the telling says so.'
},

{
  id: 'fk.kutch-flamingo',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'aaj',
  title: 'The Pink City in the Salt',
  hook: 'In the middle of a white salt desert where nothing grows, a city appears every year — with a lakh of citizens, all of them pink.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'courtier'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['नमक', 'namak', 'salt'], ['सफ़ेद', 'safed', 'white'], ['घोंसला', 'ghonsla', 'nest']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'गुजरात के सुदूर पश्चिम में भारत के सबसे अनोखे इलाक़ों में से एक मौजूद है: कच्छ का बड़ा रण। सूखे महीनों में यह आँखें चौंधिया देने वाला एक सफ़ेद सन्नाटा होता है — जहाँ तक नज़र जाए बस नमक, मेज़ जैसा सपाट, तपती धूप में चमकता हुआ। न कोई पेड़। न कोई घास। आम नज़र से देखें, तो ज़िंदगी का कोई नामोनिशान नहीं।',
      text: 'In the far west of Gujarat lies one of the strangest landscapes in India: the Great Rann of Kutch. In the dry months it is a dazzling white nothing — salt to the horizon, flat as a table, shimmering with heat. No trees. No grass. By every ordinary measure, no life.' },
    { art: ['pt_heron'], who: null,
      hi: 'फिर मानसून आता है, और समंदर व नदियाँ इस नमक के ऊपर उथला पानी फैला देती हैं, और रण मीलों-मील टखने भर पानी वाला एक विशाल चमकता हुआ आईना बन जाता है। और तभी आसमान से, लंबी गुलाबी कतारों में, दसियों हज़ार फ्लेमिंगो आ पहुँचते हैं।',
      text: 'Then the monsoon comes, and the sea and the rivers push shallow water out over the salt, and the Rann becomes an enormous glittering mirror, ankle-deep for mile after mile. And out of the sky, in long pink skeins, the flamingos arrive — in their tens of thousands.' },
    { art: ['pt_heron', 'courtier'], who: null, mood: 'wow',
      hi: 'उस उथले पानी में बहुत दूर, कीचड़ के ऐसे टीलों पर जहाँ कोई सड़क नहीं पहुँचती, वे अपना शहर बसाते हैं। हर जोड़ा कीचड़ का एक छोटा टीला खड़ा करता है, जो किसी नन्हे ज्वालामुखी जैसा घोंसला होता है, ऐसे हज़ारों-हज़ार घोंसले पास-पास सटकर बने होते हैं। पक्षी-वैज्ञानिकों ने जब पहली बार इसका नक्शा बनाया, तो इसे एक बिल्कुल सही नाम दिया: फ्लेमिंगो सिटी।',
      text: 'Far out in that shallow water, on mudflats no road reaches, they build their city. Each pair heaps up a little tower of mud, a nest like a tiny volcano, thousands upon thousands of them packed together. Ornithologists who first mapped it gave the place its perfect name: Flamingo City.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'उस सफ़ेद वीराने को देखकर कोई भी बच्चा स्वाभाविक तौर पर यही पूछेगा: यहाँ क्यों? भारत की तमाम हरी-भरी और सुहानी जगहों को छोड़कर, फ्लेमिंगो नमक के इस रेगिस्तान में अपने बच्चों का बसेरा क्यों बनाते हैं?',
      text: 'A child looking at that white emptiness asks the obvious: why here? Of all the green, comfortable places in India, why do the flamingos build their nursery in a salt desert?',
      ask: {
        q: 'Why raise chicks in the middle of a harsh salt flat?',
        options: ['They are lost', 'Because nothing hunts there — the empty salt that feeds no fox or cat keeps every egg safe', 'The salt keeps the eggs clean'],
        answer: 1,
        right: 'That is the flamingo\'s secret. A land too harsh for foxes, dogs and cats is the safest nursery in India. What looks like nothing to us looks like a fortress to them.',
        wrong: 'The flamingos know exactly where they are. The point is what is NOT there: no foxes, no dogs, no cats — nothing that hunts eggs can live on the open salt. The emptiness is the fortress.'
      } },
    { art: ['pt_heron'], who: null,
      hi: 'और यह उथला पानी एक सुरक्षा खाई भी है और रसोई भी: इसमें ढेर सारे नन्हे झींगे और काई तैरते रहते हैं, जिन्हें फ्लेमिंगो अपनी मुड़ी हुई चोंच से छानकर खाते हैं — यही वह भोजन है जो उनके पंखों को गुलाबी रंग देता है। खारा पानी अंदर गया, गुलाबी पंछी बाहर निकला। यह रेगिस्तान जिस शहर की हिफ़ाज़त करता है, उसे पालता भी है।',
      text: 'And the shallow water is a kitchen as well as a moat: it swarms with the tiny shrimps and algae the flamingos sieve through their bent beaks — the very food that turns their feathers pink. Salt water in, pink bird out. The desert feeds the city it protects.' },
    { art: ['courtier', 'pt_heron'], who: null,
      hi: 'कच्छ के लोग — चरवाहे, नमक बनाने वाले, और वे दस्तकार जिनकी कढ़ाई दुनिया भर में मशहूर है — हमेशा से इन मेहमानों के साथ अपनी अनोखी धरती साझा करते आए हैं, और गुजरात भी इस पक्षी का आदर करता है: फ्लेमिंगो यहाँ का राज्य पक्षी है, और रण में उनका यह विशाल जमावड़ा एक अनमोल खज़ाना माना जाता है।',
      text: 'The people of Kutch — herders, salt-workers, craftspeople whose embroidery is famous across the world — have always shared their strange land with these visitors, and Gujarat honours the bird: the flamingo is the state bird, and the great Rann gatherings are counted a treasure.' },
    { art: ['pt_heron'], who: null, mood: 'wow',
      hi: 'अच्छे सालों में, जब बारिश और पानी की मेहरबानी होती है, तो कच्छ के रण में एक लाख से भी ज़्यादा फ्लेमिंगो जमा हो सकते हैं — दुनिया में पक्षियों का ऐसा अनोखा नज़ारा, जो देश की सबसे सूनी दिखने वाली जगह में खिल उठता है। फिर पानी सूख जाता है, परिंदों का यह शहर खाली हो जाता है, और इंतज़ार करता हुआ सफेद सन्नाटा फिर लौट आता है।',
      text: 'In a good year, when rain and water levels are kind, a lakh and more flamingos may gather in the Rann — one of the great bird spectacles on Earth, blooming out of the emptiest-looking place in the country. Then the water dries, the city empties, and the white silence returns to wait.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'जो जगह आपको खाली लगती है, वह किसी न किसी के लिए बिल्कुल सही होती है। कच्छ का रण हर अच्छे साल में, लाखों बार, गुलाबी रंग में यही बात सिखाता है।',
      text: 'What looks empty to you is exactly right for somebody. The Rann teaches it in pink, a lakh of times over, every good year.' }
  ],
  moral: 'What looks like nothing to you may be everything to somebody — emptiness too has its citizens.',
  source: 'The Great Rann of Kutch, Gujarat, and its breeding flamingos: the monsoon flooding of the salt flats, the mud-tower nest colonies known as Flamingo City since ornithologists documented them, and the flamingo\'s place as Gujarat\'s state bird. Documented natural history, told as it stands today.'
},

{
  id: 'fk.narsinh-hundi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'The Note of Trust',
  hook: 'The pilgrims handed their money to the poorest man in Junagadh, and he wrote them a note payable in Dwarka — signed, essentially, by God.',
  hero: 'krishna',
  cast: ['krishna', 'courtier'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['भक्ति', 'bhakti', 'devotion'], ['चिट्ठी', 'chitthi', 'note'], ['विश्वास', 'vishwas', 'trust']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पाँच सौ से भी ज़्यादा साल पहले, सौराष्ट्र के जूनागढ़ में नरसिंह मेहता रहते थे — कृष्ण के भक्त और ऐसे प्यारे गीतों के रचयिता कि गुजरात उन्हें अपना आदिकवि यानी पहला कवि कहता है। उनका एक भजन, "वैष्णव जन तो", इतना दूर-दूर तक पहुँचा कि सदियों बाद वह गाँधीजी का पसंदीदा बन गया। गीतों के मामले में तो वे बेहद अमीर थे। पर पैसों के मामले में — जाने-माने अंदाज़ में, हँसते-खेलते, बिल्कुल भी नहीं।',
      text: 'Five hundred years and more ago, in Junagadh in Saurashtra, lived Narsinh Mehta — a bhakta of Krishna and a maker of songs so beloved that Gujarat calls him its Adi Kavi, the first poet. One of his songs, "Vaishnav jan to", travelled so far that centuries later it became Gandhiji\'s favourite. Rich in songs, then. In money — famously, cheerfully, not at all.' },
    { art: ['courtier'], who: null,
      hi: 'गुजरात को उनके बारे में यह कथा सबसे ज़्यादा पसंद है। तीर्थयात्रियों की एक टोली दूर समुद्र किनारे बसी कृष्ण की नगरी द्वारका के लिए निकल रही थी, और रास्ता लंबा भी था और पैसों के लिहाज से असुरक्षित भी। उन दिनों मुसाफिर हुंडी का इस्तेमाल करते थे — एक शहर के किसी भरोसेमंद आदमी को पैसे देकर लिखवाई गई चिट्ठी, जिसे दूसरे शहर में उसके साथी से भुनाकर पैसे लिए जा सकते थे।',
      text: 'This is the katha Gujarat loves best about him. A party of pilgrims was setting out for Dwarka, Krishna\'s city on the far coast, and the road was long and unsafe for a purse. In those days travellers used hundis — a note of money paid to a trusted man in one town, to be redeemed from his partner in another.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'जूनागढ़ में किसी ने — मज़ाक में या चिढ़कर, कहानियों में अलग-अलग बातें आती हैं — यात्रियों को नरसिंह मेहता के घर का रास्ता दिखा दिया: "द्वारका में उनका बड़ा लेन-देन है।" मज़ाक यह था कि कवि के पास अपनी करताल के सिवा शायद ही कुछ था। यात्रियों ने दरवाज़ा खटखटाया और पूछा: क्या आप हमारे लिए द्वारका में भुनाई जाने वाली हुंडी लिख देंगे?',
      text: 'Someone in Junagadh — mischievous, or spiteful, the tellings differ — pointed the pilgrims to Narsinh Mehta\'s house: "He has dealings in Dwarka." The joke being that the poet owned almost nothing but his cymbals. The pilgrims knocked and asked: would he write them a hundi payable in Dwarka?',
      ask: {
        q: 'Narsinh has no money and no business partner anywhere. What can he possibly do with the pilgrims\' request?',
        options: ['Send them away — he has no partner in Dwarka', 'Take the money, and write the hundi in the name of the one he trusts in Dwarka: Krishna himself', 'Keep the money for the poor'],
        answer: 1,
        right: 'That is what he did. He took their coins, gave every one to the town\'s poor by nightfall, and wrote the note to the merchant "Shamalsha Seth of Dwarka" — his own name for his dark Lord. Then he sang all night.',
        wrong: 'Turning away trust was not in the man. He took their coins, gave them to the town\'s poor by nightfall, and wrote the hundi on the only partner he had in Dwarka — "Shamalsha Seth", his own name for his dark Lord. Then he sang all night.'
      } },
    { art: ['courtier'], who: null,
      hi: 'यात्री द्वारका पहुँचे और बाज़ार में बड़े व्यापारी शामलशा सेठ के बारे में पूछने लगे। बाज़ार वालों ने उनका नाम कभी सुना ही नहीं था। यात्री हाथ में वह बेकार कागज़ लिए गुस्से से लाल होकर सड़क पर खड़े रह गए, और सोचने लगे कि जूनागढ़ लौटकर उस ढोंगी कवि को ठीक-ठीक क्या-क्या सुनाएँगे।',
      text: 'The pilgrims reached Dwarka and asked the bazaar for the great merchant Shamalsha Seth. The bazaar had never heard of him. The pilgrims stood in the street with a worthless paper, hot with anger, deciding exactly what they would say to that fraud of a poet back in Junagadh.' },
    { art: ['krishna', 'courtier'], who: null, mood: 'wow',
      hi: 'और फिर — कथा कहती है — एक व्यापारी उन्हें ही ढूंढता हुआ आया। सजीला, दमकता हुआ, सांवला-सलोना, बिल्कुल ऐसे मानो वह ज़िंदगी भर इसी हुंडी का इंतज़ार कर रहा हो। "शायद आपके पास मेरी एक हुंडी है। मेरे नरसिंह की भेजी हुई।" और उसने एक-एक सिक्का गिनकर पूरा भुगतान कर दिया, और इससे पहले कि वे धन्यवाद के शब्द जुटा पाते, वह ओझल हो चुका था।',
      text: 'And then — the katha says — a merchant came looking for THEM. Gracious, glowing, dark and beautiful, exactly as if he had been expecting the note all his life. "You hold a hundi of mine, I think. From my Narsinh." And he paid it out in full, coin for coin, and was gone before their thanks found words.' },
    { art: ['krishna'], who: null,
      hi: 'परंपरा कहती है कि वह व्यापारी बनकर खुद कृष्ण आए थे — क्योंकि उनके भक्त ने भरोसे के दस्तखत उन पर किए थे, और उस दस्तखत का मान उन्होंने कभी नहीं टाला। तीर्थयात्री घर लौटकर यही बात सुनाने लगे, और जूनागढ़ की हंसी किसी गहरी खामोशी में बदल गई।',
      text: 'Krishna himself had come as the merchant, the tradition says — because his bhakta had signed trust over to him, and that particular signature he has never once dishonoured. The pilgrims came home telling it, and Junagadh\'s laughter turned to something quieter.' },
    { art: ['courtier'], who: null,
      hi: 'गुजरात तब से नरसिंह मेहता के पद गाता आ रहा है — पूजा-प्रार्थना में, त्योहारों में, सुबह के रागों में — और साथ ही सुनाता है यह कथा: नगर के सबसे गरीब इंसान की, जिसकी साख स्वर्ग में भी चलती थी।',
      text: 'Gujarat has sung Narsinh Mehta\'s songs ever since — at prayer, at festivals, in the morning ragas — and told this katha alongside them: the poorest man in town, whose credit was good in heaven.' },
    { art: ['krishna'], who: 'mithu',
      hi: 'कई वैष्णव परिवारों में यह सीधी-सी बात कही जाती है: अपना भरोसा पूरी तरह सौंप दो, तो वह कभी खाली नहीं जाता — भले ही वह फल किसी अनसोचे रूप में मिले, किसी व्यापारी की शॉल ओढ़े हुए।',
      text: 'In many Vaishnav families they say it simply: give your trust wholly, and it is never left unpaid — though the payment may arrive in a form you did not expect, wearing a merchant\'s shawl.' }
  ],
  moral: 'Trust wholly given has a way of being honoured — the katha says even heaven signs for it.',
  source: 'The hundi katha of Narsinh Mehta of Junagadh (15th century), as the Gujarati Vaishnav tradition tells it. Narsinh Mehta and his bhajans — including "Vaishnav jan to" — are historical; the hundi redeemed at Dwarka by Krishna as Shamalsha Seth is presented as katha, the story as it is told, from the inside.'
},

{
  id: 'fk.mandvi-ships',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'aaj',
  title: 'The Ships Built by Hand',
  hook: 'No blueprints. No cranes. On a riverbank in Kutch, families build wooden ships the size of buildings — from plans kept entirely in their heads.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['जहाज़', 'jahaaz', 'ship'], ['लकड़ी', 'lakdi', 'wood'], ['कारीगर', 'kaarigar', 'craftsman']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'कच्छ के मांडवी में रुक्मावती नदी के किनारे, इमारतों जितने बड़े लकड़ी के कंकाल खड़े दिखते हैं — बड़े-बड़े जहाजों के ढांचे, जिन पर चारों तरफ बढ़ई जुटे रहते हैं। ये \'ढो\' हैं: लकड़ी से हाथों से बनाए जाने वाले मालवाहक समुद्री जहाज, जिन्हें मांडवी चार सौ से भी ज़्यादा सालों से इसी तरह बनाता आ रहा है।',
      text: 'On the bank of the Rukmavati river at Mandvi, in Kutch, stand wooden skeletons the size of buildings — the ribs of great ships, swarming with carpenters. They are dhows: ocean-going cargo ships built of timber, by hand, the way Mandvi has built them for over four hundred years.' },
    { art: ['courtier'], who: null,
      hi: 'इन्हें बनाने वाले ज़्यादातर खारवा समुदाय के लोग हैं, जो मांडवी के पुश्तैनी नाविक और जहाजसाज़ हैं, और ये गोदी-बाड़े परिवारों की परंपरा से चलते हैं — एक लड़का अपने पिता के लिए कीलें पकड़ते-पकड़ते काम सीखता है, जिन्होंने कभी अपने पिता के लिए कीलें पकड़कर सीखा था। बसूला, बरमा, रंदा: ऐसे औज़ार जिन्हें सदियों पुराना कोई कारीगर भी बिना एक पल सोचे हाथ में थाम लेता।',
      text: 'The builders are mostly of the Kharva community, Mandvi\'s hereditary seafarers and shipwrights, and the yards run on family lines — a boy learns holding nails for his father, who learned holding nails for his. The adze, the auger, the plane: tools a shipwright of centuries ago would pick up without a question.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'अब सबसे हैरानी की बात सुनो। जहाज़ बनाने वाले उस्ताद — यानी मिस्त्री — से अगर जहाज़ का नक्शा मांगो, तो वे अपने माथे पर उंगली रख देंगे। नक्शा तो कोई है ही नहीं। न कोई ब्लूप्रिंट, न कंप्यूटर का मॉडल। पूरा का पूरा जहाज़ — उसकी एक-एक पसली का घुमाव, भविष्य के सैकड़ों टन भारी जहाज़ का हर हिस्सा — सब उनके दिमाग में बसा होता है, और रस्सी, डंडियों व चालीस साल के तजुर्बे की पैनी नज़र से नापा जाता है।',
      text: 'Now the astonishing part. Ask the master builder — the mistri — for the ship\'s drawings, and he will tap his forehead. There are none. No blueprint, no computer model. The whole ship — every curve of every rib, hundreds of tonnes of future vessel — is held in his head, and measured out with string, rods and forty years of eye.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक बार किसी मुसाफ़िर ने एक मिस्त्री से पूछा कि कोई पूरे जहाज़ को अपने दिमाग में कैसे रख सकता है। बुज़ुर्ग मिस्त्री ने इस बारे में कुछ पल सोचा, जबकि उनके हाथ बिना देखे ही अपने-आप लकड़ी के एक तख्ते की धार को परखते रहे।',
      text: 'A visitor once asked a mistri how anyone can keep a whole ship in his head. The old man thought about it while his hands went on checking a plank\'s edge, entirely unsupervised.',
      ask: {
        q: 'How is a whole ship carried without a single drawing?',
        options: ['It cannot be — there must be secret plans', 'The way a song is carried: learned whole from a master, years of practice, until the shape lives in you', 'Each builder does his own part and hopes'],
        answer: 1,
        right: '"How do you carry a song?" the mistri said. "I stood in my father\'s yard from age six. The ship is in my hands the way his songs are in my mother\'s throat. Paper would only slow it down."',
        wrong: 'There are no secret plans, and hope has nothing to do with it. "How do you carry a song?" the mistri said. "I stood in my father\'s yard from age six. The ship is in my hands the way songs are in a singer\'s throat."'
      } },
    { art: ['guard'], who: null,
      hi: 'बहुत पहले ऐसे ही जहाज़ों ने मांडवी को खुशहाल बनाया था — जो मॉनसून की हवाओं के सहारे कच्छ से मस्कट, ज़ांज़ीबार और अफ़्रीकी तट तक जाते थे, और कपड़े, खजूर व लकड़ी का व्यापार करते थे। मांडवी के नाविक पश्चिमी सागर को वैसे ही पहचानते थे जैसे किसान अपने खेतों को पहचानते हैं।',
      text: 'It was ships like these that made Mandvi rich long ago — sailing from Kutch to Muscat and Zanzibar and the African coast with the monsoon winds, trading cloth and dates and timber. Mandvi\'s sailors knew the western ocean the way farmers know their fields.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'और ये कारखाने कोई म्यूज़ियम नहीं हैं। आज भी यहां ऑर्डर आते हैं — खाड़ी के व्यापारियों से, मज़बूत लकड़ी के जहाज़ चाहने वाली कंपनियों से — और ये ढो आज भी रुक्मावती नदी से होते हुए समंदर में उतरते हैं। अब इनमें डीज़ल इंजन लगे होते हैं, मगर इनके ढांचे बिल्कुल वैसे ही तराशे जाते हैं जैसे परदादा-लकड़दादा तराशा करते थे।',
      text: 'And the yards are no museum. Orders still come — from Gulf traders, from companies wanting stout wooden vessels — and the dhows still go down the Rukmavati into the sea, diesel-engined now, but hulls shaped exactly as the great-great-grandfathers shaped them.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'अगर कभी मौका मिले तो जहाज़ को समंदर में उतरते ज़रूर देखना: हाथों से बना पूरा का पूरा जहाज़, नारियल फोड़कर और प्रार्थना करके, उसे बनाने वाले परिवारों के सामने हौले-हौले पानी में सरकता है — उसका एक-एक तख्ता यादों से तराशा गया, और यादें एकदम खरी उतरीं।',
      text: 'Watch a launch if you ever can: an entire handmade ship, blessed with coconut and prayer, easing into the water in front of the families who built it — every plank of it pulled out of memory, and the memory holding true.' },
    { art: ['guard'], who: 'mithu',
      hi: 'हम ज्ञान को किताबों, ड्राइव्स और क्लाउड में संभालकर रखते हैं। मांडवी भारत की इस धरोहर को हाथों और दिमागों में ज़िंदा रखता है, जो पीढ़ी-दर-पीढ़ी गर्माहट के साथ सौंपी जाती है। कुछ पुस्तकालयों में अलमारियां होती हैं। इस पुस्तकालय में पोते होते हैं।',
      text: 'We keep knowledge in books and drives and clouds. Mandvi keeps some of India\'s in hands and heads, passed down warm. Some libraries have shelves. This one has grandsons.' }
  ],
  moral: 'Some libraries are kept in hands — and they hold true for centuries.',
  source: 'The dhow-building yards on the Rukmavati at Mandvi, Kutch — a living craft of the Kharva community for over four centuries, built without drawn plans, heir to Mandvi\'s old ocean trade with Arabia and East Africa. Documented living tradition, told as it stands today.'
},

/* ================================================ RAJASTHAN ============== */
{
  id: 'it.amrita-devi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'itihaas',
  needs_review: true,
  title: 'The Woman Who Held the Tree',
  hook: 'Soldiers came to the village to cut the sacred trees. One woman walked out and put her arms around the first trunk.',
  hero: 'courtier',
  cast: ['courtier', 'pt_deer'],
  minutes: 4,
  place: ['IN-RJ'],
  words_hi: [['पेड़', 'ped', 'tree'], ['रक्षा', 'raksha', 'protection'], ['हरियाली', 'hariyali', 'greenery']],
  scenes: [
    { art: ['pt_deer'], who: null,
      hi: '"पश्चिमी राजस्थान के रेगिस्तानी इलाके में बिश्नोई रहते हैं — एक ऐसा समुदाय जिसे पाँच सौ से भी ज़्यादा साल पहले गुरु जंभेश्वर ने शुरू किया था, जिन्होंने उन्हें जीने के लिए उनतीस नियम दिए थे। उन नियमों में दो नियम खंभों की तरह सबसे मज़बूत हैं: हरे पेड़ मत काटो, और जानवरों को नुकसान मत पहुँचाओ। बिश्नोई यह बात अच्छी तरह समझते थे कि रेगिस्तान में पेड़ और जंगली जीव ही तो जीवन हैं।"',
      text: 'In the desert country of western Rajasthan live the Bishnoi — a community founded over five hundred years ago by Guru Jambheshwar, who gave them twenty-nine rules to live by. Among those rules, two stand like pillars: do not cut green trees, and do not harm animals. In a desert, the Bishnoi understood, the trees and the wild creatures are life itself.' },
    { art: ['courtier'], who: null,
      hi: '"इसीलिए बिश्नोई गाँवों के आस-पास खेजड़ी के पेड़ खूब घने और पुराने होते हैं, और काले हिरण व चिंकारा बिना किसी डर के बिल्कुल घरों के पास चरते हैं — क्योंकि सदियों से किसी भी बिश्नोई का हाथ उन पर कभी नहीं उठा। उस ज़माने में आने-जाने वाले मुसाफ़िरों ने भी यह देखा था। और आप इसे आज भी देख सकते हैं।"',
      text: 'So around Bishnoi villages the khejri trees grow thick and old, and blackbuck and chinkara graze unafraid at the very edges of the houses — because for centuries no Bishnoi hand has ever been raised against them. Travellers noticed it then. You can still see it today.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"बिश्नोईयों को वह साल आज भी याद है — समुदाय के इतिहास के अनुसार 1730 का साल — जब जोधपुर के राजा के आदमी खेजड़ली गाँव आए थे। एक बड़ी इमारत के लिए चूना पकाना था, और चूना पकाने के लिए लकड़ी चाहिए थी, और खेजड़ली के आस-पास ठीक वही चीज़ खड़ी थी जो उन्हें चाहिए थी: हरी-भरी खेजड़ी के झुरमुट।"',
      text: 'The Bishnoi remember a year — 1730, as the community keeps the date — when men from the ruler of Jodhpur came to the village of Khejarli. Lime was to be burnt for a great building, and burning lime needs wood, and around Khejarli stood exactly what they wanted: groves of green khejri.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"गाँव की एक महिला, अमृता देवी, बाहर आईं और कुल्हाड़ियों के आगे खड़ी हो गईं। उन्होंने उनसे कहा कि ये पेड़ उनकी आस्था और उनके गाँव के लिए पवित्र हैं — इन्हें काटा नहीं जाएगा। उन आदमियों को गाँव की एक औरत की आस्था की कोई परवाह नहीं थी। और इसलिए अमृता देवी आगे बढ़कर पहली खेजड़ी के पास गईं और अपनी बांहों में उसे थाम लिया।"',
      text: 'A woman of the village, Amrita Devi, came out and stood before the axes. The trees were sacred to her faith and to her village, she told them — they would not be cut. The men were not interested in a village woman\'s faith. And so Amrita Devi walked to the first khejri and put her arms around it.',
      ask: {
        q: 'What is Amrita Devi saying, with her arms around the trunk?',
        options: ['That she is stronger than the axemen', 'That the tree\'s life is worth her standing in its place — the tree will not be cut while she holds it', 'That the men should cut a different tree'],
        answer: 1,
        right: 'The community remembers her very words: a tree\'s life is worth a great price — and she offered her own standing in its place. Her daughters came and held the next trees, and the village came behind them.',
        wrong: 'Not strength, and not another tree — every khejri was equally hers to defend. She was saying: the tree will not be cut while I hold it. Her daughters came and held the next trees, and the village came behind them.'
      } },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"वे आदमी नहीं रुके, और पेड़ों को अपनी बांहों में थामे हुए अमृता देवी और उनके गाँव के कई लोगों ने उस दिन अपनी जान दे दी। बिश्नोई खेजड़ली और आस-पास के गाँवों के तीन सौ तिरसठ रक्षकों को याद करते हैं, और बड़े आदर से उनके हर एक नाम का सम्मान करते हैं।"',
      text: 'The men did not stop, and Amrita Devi and many of her village gave their lives that day, holding their trees. The Bishnoi count three hundred and sixty-three protectors, from Khejarli and the villages around, and keep every name in honour.' },
    { art: ['courtier'], who: null,
      hi: '"कहा जाता है कि जब यह बात जोधपुर के महाराजा तक पहुँची, तो वे गहरे दुख और शर्म से भर गए। पेड़ों की कटाई रोक दी गई, और बिश्नोई गाँवों को एक ऐसा वचन दिया गया जिसे यह समुदाय आज तक सँजोए हुए है: उनके पेड़ों और उनके जानवरों को फिर कभी हाथ नहीं लगाया जाएगा।"',
      text: 'When word reached the Maharaja of Jodhpur, the tradition holds, he was struck with grief and shame. The cutting was stopped, and the Bishnoi villages were given a promise the community treasures to this day: their trees and their animals would not be touched again.' },
    { art: ['pt_deer', 'courtier'], who: null, mood: 'wow',
      hi: 'और वह सुरक्षा बनी रही — यही इस कहानी का जीता-जागता हिस्सा है। आज खेजड़ली में एक स्मृति-उपवन है, और हर साल बिश्नोई समाज के लोग उनकी याद में वहाँ जुटते हैं। उनके गाँवों के आस-पास खेजड़ी के पेड़ आज भी घने खड़े हैं, और काले हिरन आज भी दरवाज़ों से ज़रा ही दूर, हमेशा की तरह पूरी तरह सुरक्षित चरते हैं।',
      text: 'And the protection held — that is the living part of this story. Khejarli today has its memorial grove, and every year the Bishnoi gather there in remembrance. Around their villages the khejri still stand thick, and the blackbuck still graze within a stone\'s throw of the doors, safe as ever.' },
    { art: ['courtier'], who: null,
      hi: 'खेजड़ली की इस घटना के ढाई सौ साल बाद, जब हिमालय की पहाड़ियों में गाँव वालों ने अपने जंगलों को बचाने के लिए पेड़ों को गले लगा लिया — जिसे चिपको आंदोलन कहा गया — तब भारत ने अमृता देवी को रास्ता दिखाने वाली के रूप में याद किया। भारत सरकार ने वन्यजीव संरक्षण के अपने राष्ट्रीय पुरस्कार का नाम उन्हीं के नाम पर रखा।',
      text: 'Two and a half centuries after Khejarli, when villagers in the Himalayan hills hugged trees to save their forests — the Chipko movement — India remembered Amrita Devi as the one who had shown the way. The Government of India named its national award for wildlife protection after her.' },
    { art: ['pt_deer'], who: 'mithu',
      hi: 'बिश्नोई यह कहानी दुखी होने के लिए नहीं सुनाते। वे इसे वैसे ही सुनाते हैं जैसे एक दीया जलाए रखा जाता है: यह दिखाने के लिए कि उनके नियमों का क्या मोल है, और उनकी दादियों-नानियों के लिए जीवन की क्या कीमत थी। खेजड़ली के पेड़ अभी भी हरे-भरे हैं, आज इसी शाम भी। यही इस कहानी का अंत है।',
      text: 'The Bishnoi do not tell this story to be sad. They tell it the way you keep a lamp lit: to show what their rules are worth, and what their grandmothers thought life was worth. The trees at Khejarli are green right now, this very evening. That is the ending.' }
  ],
  moral: 'What your people hold sacred, hold — and the protection can outlive you by centuries.',
  source: 'The Khejarli sacrifice of Amrita Devi and the Bishnoi, kept by the Bishnoi community of Rajasthan, who hold the date as 1730 and the number as 363, with an annual remembrance at Khejarli; Guru Jambheshwar\'s twenty-nine tenets and the living Bishnoi protection of khejri and blackbuck are documented. India\'s Amrita Devi Award for wildlife protection is named for her. Flagged needs_review: a human editor confirms tone and detail before this ships.'
},

{
  id: 'fk.dhola-maru',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'Dhola, Maru and the Wind-Swift Camel',
  hook: 'A forgotten promise, a singer who would not give up, and a camel that ran like the desert wind — Rajasthan\'s favourite chase.',
  hero: 'courtier',
  cast: ['courtier', 'pt_deer'],
  minutes: 5,
  place: ['IN-RJ'],
  words_hi: [['ऊँट', 'oont', 'camel'], ['रेत', 'ret', 'sand'], ['वचन', 'vachan', 'promise']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'राजस्थान के गवैयों के पास एक कहानी है जिसे वे सदियों से गाते आए हैं, \'ढोला-मारू\' नाम की उस लंबी गाथा में। रेगिस्तान की कहानियों की तरह, इसकी शुरुआत भी एक वादे से होती है — दो परिवारों के बीच हुआ एक वादा, जिसने नरवर के एक छोटे राजकुमार ढोला और पूगल की एक नन्हीं राजकुमारी मारू को उस वक्त एक रिश्ते में बाँध दिया था, जब दोनों इतने छोटे थे कि उन्हें यह याद भी नहीं रह सकता था।',
      text: 'The singers of Rajasthan have a story they have sung for centuries, in the long ballad called Dhola-Maru. It begins, as desert stories often do, with a promise — made between two families, joining a little prince named Dhola of Narwar and a little princess named Maru of Pugal, when both were far too young to remember it.' },
    { art: ['courtier'], who: null,
      hi: 'रेत के पार दोनों परिवार अपने-अपने घर लौट गए, साल बीतते गए, और नरवर में वह वादा धूल खाता रहा और — ठीक-ठीक कहें तो टूटा नहीं, बस भुला दिया गया। ढोला पूगल के बारे में कुछ भी जाने बिना बड़ा हुआ। लेकिन पूगल में मारू को सब याद था। और मारू ऐसी नहीं थी जो किसी सच्ची बात को खो जाने दे।',
      text: 'The families went home across the sands, the years went by, and in Narwar the promise gathered dust and was — not broken, exactly. Forgotten. Dhola grew up knowing nothing of Pugal. But in Pugal, Maru remembered. And Maru was not a person who let a true thing stay lost.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'गाथा कहती है कि चिट्ठियाँ रास्ते में ही भटक गईं, और संदेशवाहकों को लौटा दिया गया। इसलिए मारू ने वह एक चीज़ भेजी जिसे रेगिस्तान भी नहीं रोक सकता: गाने वाले। घुमंतू गायक जो चलते-चलते नरवर पहुँचे, ढोला के दरबार में खड़े हुए और उन्होंने गाया — पूगल के बारे में, उस पुराने वादे के बारे में, और उस राजकुमारी के बारे में जिसने उस वादे को निभाए रखा।',
      text: 'Letters went astray, the ballad says, and messengers were turned back. So Maru sent the one thing the desert cannot stop: singers. Wandering minstrels who walked to Narwar and stood at Dhola\'s court and sang — sang of Pugal, of the old promise, of the princess who kept it.',
      ask: {
        q: 'Messengers failed and letters vanished. Why did the singers get through?',
        options: ['Singers walk faster', 'Nobody bars the door to a song — a story slips in where a message is stopped', 'They knew a secret road'],
        answer: 1,
        right: 'Everyone welcomes singers, and so the truth walked straight into the court dressed as an evening\'s entertainment — and Dhola heard his own forgotten story sung back to him.',
        wrong: 'The roads were the same ones. But nobody bars the door to a song — and so the truth walked into the court dressed as an evening\'s entertainment, and Dhola heard his own forgotten story sung back to him.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'वह गीत ढोला पर ठंडे पानी की तरह गिरा। एक वादा — उसी का वादा — इतने सालों से पूगल में ज़िंदा था, और उसे निभाया था किसी ऐसे ने जिससे वह कभी मिला भी नहीं था! उसने नरवर के सबसे तेज़ ऊँट को बुलवाया, और लोकगीत उस ऊँट पर भी लगभग उतना ही प्यार लुटाता है जितना उस राजकुमार पर: हवा पीने वाला, रेत पर तैरने वाला, और क्षितिज की तरह कभी न थकने वाला।',
      text: 'The song struck Dhola like cold water. A promise — his promise — alive all these years in Pugal, kept by someone he had never met! He called for the swiftest camel in Narwar, and the ballad gives that camel almost as much love as the prince: a wind-drinker, a sand-skimmer, tireless as the horizon.' },
    { art: ['pt_deer', 'courtier'], who: null,
      hi: 'थार के पार वह सवार होकर निकला — टीलों के दिन, तारों की रोशनी में खोजे गए कुएँ, ऊँट के बड़े-बड़े पैर रेत को उड़ाते हुए — और आखिरकार वह पूगल पहुँच ही गया, जहाँ मारू को वादा निभाने का इनाम मिला: वह इंसान जिस पर उसने भरोसा किया था, आखिरकार दरवाज़े पर खड़ा था, धूल से पूरी तरह लथपथ।',
      text: 'Across the Thar he rode — days of dunes, wells found by starlight, the camel\'s great feet spooning the sand — and reached Pugal at last, where Maru met the promise-keeper\'s reward: the person she had believed in, finally standing in the doorway, extremely dusty.' },
    { art: ['courtier'], who: null,
      hi: 'वे दोनों साथ में नरवर के लिए निकल पड़े, और अब यह लोकगीत एक असली दौड़-भाग बन जाता है। रेगिस्तान का एक सरदार, उमरा, उन्हें रोकना चाहता था और उसने उन दोनों के पीछे घुड़सवार भेज दिए; गाने वाले इस हिस्से को बड़े मजे से खींचते हैं — पीछे टापों की आवाज़, ऊँट बहते पानी की तरह आसानी से दौड़ता हुआ, और मारू अपने जाने-पहचाने टीलों के सहारे रास्ता दिखाती हुई।',
      text: 'They set out for Narwar together, and now the ballad becomes a proper chase. A desert chieftain, Umra, wished to stop them and sent riders after the pair; the singers stretch this part deliciously — hoofbeats behind, the camel running smooth as poured water, Maru navigating by the dunes she knew.' },
    { art: ['pt_deer'], who: null, mood: 'wow',
      hi: 'रास्ते की हर मुसीबत को, लोकगीत ज़ोर देकर कहता है, उन्होंने मिलकर हराया — एक ने बचाया तो फिर बारी-बारी से दूसरे ने, यहाँ तक कि पीछा करने वालों की उड़ाई धूल क्षितिज के पार गायब हो गई और ऊँट उन्हें नरवर ले आया, दुबला-पतला, विजयी, और जो एक बार भी पीछे नहीं छूटा था।',
      text: 'The trouble of the road, the ballad insists, they beat together — each rescue answered by another, turn and turn about, until the pursuers\' dust dropped below the horizon and the camel walked them into Narwar, thin, triumphant, and never once outrun.' },
    { art: ['courtier'], who: null,
      hi: 'आप उन्हें आज भी देख सकते हैं: पूरे राजस्थान में दीवारों पर बने चित्रों में, एक ही ऊँट पर दो लोग, किसी की चौखट के ऊपर तेज़ चाल में चलते हुए। रेगिस्तान का कोई भी बच्चा आपको बता सकता है कि वे कौन हैं। ढोला और मारू, घर लौटते हुए। और ऊँट को, ज़ाहिर है, सबसे बड़ा बनाया जाता है।',
      text: 'You can still see them today: on painted walls all over Rajasthan, two figures on one camel, mid-stride across somebody\'s doorway. Any child of the desert can tell you who they are. Dhola and Maru, going home. The camel, naturally, gets painted the biggest.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'गाने वाले कहते हैं कि रेगिस्तान वह कुछ नहीं भूलता जिसे गाया गया हो — सिर्फ़ वही भूलता है जो खामोश हो जाए। मारू का वादा इसलिए ज़िंदा रहा क्योंकि वह उसे दोहराती रही। यह बात याद रखने लायक है।',
      text: 'The desert forgets nothing that is sung, the singers say — only what falls silent. Maru\'s promise survived because she kept telling it. That is worth filing away.' }
  ],
  moral: 'A promise is a road — someone must keep walking it, and then it carries you home.',
  source: 'The Dhola-Maru ballad of Rajasthan, sung for centuries by the desert\'s hereditary singers and painted on walls across the state; told here as the adventure of the promise, the singers and the camel, in the manner of the tradition. Versions differ widely between singers, as they always have.'
},

{
  id: 'fk.pabuji-camels',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'How the Camels Came to the Desert',
  hook: 'A wedding gift was promised: strange, humped animals from beyond the desert that no one in Rajasthan had ever herded. Someone had to go and fetch them.',
  hero: 'guard',
  cast: ['guard', 'pt_deer'],
  minutes: 4,
  place: ['IN-RJ'],
  words_hi: [['भेंट', 'bhent', 'gift'], ['झुंड', 'jhund', 'herd'], ['वीर', 'veer', 'hero']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'थार के गाँवों में, जब रात घिर आती है, तो कभी-कभी एक भोपा — गाने वाले पुजारी — घर की दीवार जितना लंबा एक चित्रपट खोलते हैं, दीया जलाते हैं, और पाबूजी की गाथा गाने लगते हैं: रेगिस्तान के लोकनायक, पशुओं के रक्षक और नामुमकिन वादे निभाने वाले वीर। इस चित्रपट को फड़ कहते हैं, और इसके सामने गाते-गाते पूरी-पूरी रातें बीत सकती हैं। यह उसी महान कहानी का एक हिस्सा है।',
      text: 'In the villages of the Thar, when night falls, a bhopa — a singer-priest — sometimes unrolls a painted scroll as long as a house wall, lights a lamp, and begins to sing the epic of Pabuji: the folk hero of the desert, protector of herds, keeper of impossible promises. The scroll is a phad, and singing before it can take whole nights. This is one strand of that great story.' },
    { art: ['guard', 'pt_deer'], who: null,
      hi: 'गाथा बताती है कि पाबूजी ने अपनी नन्ही भतीजी केलम को शादी का एक ऐसा अनोखा तोहफ़ा देने का वादा किया था, जैसा किसी ने न देखा हो: ऊँट। उसने कभी ऊँट नहीं देखा था। सच कहें तो रेगिस्तान में शायद ही किसी ने देखा था — क्योंकि पुरानी मान्यता है कि उन दिनों राजस्थान में ऊँट होते ही नहीं थे। वे बहुत दूर, रेगिस्तान की सीमाओं के पार रहते थे, कड़ी निगरानी में और किसी भी क़ीमत पर न बिकने वाले।',
      text: 'Pabuji, the epic tells, promised his little niece Kelam a wedding gift like no other: camels. She had never seen one. Hardly anyone in the desert had — for in those days, the tradition says, there were no camels in Rajasthan at all. They lived far away, beyond the desert\'s edge, guarded and not for sale.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'यह वादा सुनकर दरबार मुस्कुरा दिया। रेत के पार से लाए गए कूबड़ वाले अजीब जानवर, वो भी एक नन्ही बच्ची की शादी के लिए? लेकिन पाबूजी कह चुके थे, और रेगिस्तान की गाथाओं में मुँह से निकला वचन पत्थर की लकीर होता है।',
      text: 'The court smiled at the promise. Strange humped beasts from beyond the sands, for a little girl\'s wedding? But Pabuji had said it, and in the desert epics a spoken promise is iron.',
      ask: {
        q: 'The gift is absurd, the journey dangerous, and the promise was made to a child. What does Pabuji do?',
        options: ['Send a fine gift of horses instead', 'Go himself, however far, and bring the camels — a promise to a child weighs the same as any other', 'Explain to Kelam that it was only a manner of speaking'],
        answer: 1,
        right: 'That is the whole character of Pabuji, and why the desert loves him. He rode for the camels himself — a promise made to the smallest person binding him exactly as much as one made to a king.',
        wrong: 'Horses she had seen, and Pabuji never in his life said "manner of speaking". He rode for the camels himself — a promise to the smallest person binding him exactly as much as one made to a king.'
      } },
    { art: ['pt_deer'], who: null, mood: 'wow',
      hi: 'इस सफ़र का वर्णन कई-कई छंदों में आता है — कठिन घुड़सवारी, चतुराई, ख़तरों का सामना और उन पर जीत — और गायक इसे पूरी जान लगाकर गाते हैं। और आख़िरकार, दक्षिणी क्षितिज से राजस्थान की धरती पर, गाथा की दुनिया में पहली बार ऊँट पहुँचे: लंबे, झूमते हुए, उत्सुक आँखों वाले, और हर बात पर सुरीले अंदाज़ में शिकायत करते हुए, जैसा ऊँट तब से लेकर आज तक करते आए हैं।',
      text: 'The journey fills many verses — hard riding, cleverness, danger met and beaten — and the singers give it everything they have. And at the end of it, up out of the southern horizon into Rajasthan, for the first time ever in the epic\'s world, came the camels: tall, swaying, curious-eyed, complaining musically about everything, the way camels have done ever since.' },
    { art: ['guard'], who: null,
      hi: 'केलम को उसकी शादी का तोहफ़ा मिल गया, और रेगिस्तान को उससे भी बड़ी चीज़ मिली। भला इस धरती के लिए इससे बेहतर जानवर और कौन सा हो सकता था? एक ऐसा जीव जो अपना पानी खुद जमा रखता है, रेत पर ऐसे चलता है मानो कालीन पर चल रहा हो, और जहाँ घोड़े भी हिम्मत हार जाएँ, वहाँ भी मौज से रहता है। गाथा कहती है कि ऊँट और थार तो बने ही एक-दूसरे के लिए थे — पाबूजी ने तो बस दोनों की मुलाकात करवाई थी।',
      text: 'Kelam got her wedding gift, and the desert got something greater. For what animal could suit this land better? A creature that stores its own water, walks on sand as if on carpet, and thrives where horses despair. The camel and the Thar, the epic says, were made for each other — Pabuji simply performed the introduction.' },
    { art: ['pt_deer', 'guard'], who: null,
      hi: 'और यही वजह है कि रेगिस्तान के ऊँट पालक — जिन्हें राइका या रेबारी कहा जाता है — पाबूजी को अपना ख़ास रक्षक मानते हैं। राइका कहते हैं कि शुरुआत से ही ऊँटों की देखभाल की ज़िम्मेदारी उनके समाज को सौंपी गई थी, और जब कोई ऊँट बीमार पड़ता है, तो वे पाबूजी के ही गीत गाते हैं। ये रेवड़ और यह नायक हमेशा के लिए एक-दूसरे के हैं।',
      text: 'And this is why the camel-herding people of the desert — the Raika, also called Rebari — hold Pabuji as their own special protector. The Raika say their community was entrusted with the care of camels from the beginning, and it is Pabuji they sing to when a camel falls sick. The herds and the hero belong to each other.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'इसलिए जब भोपा ऊंटों वाले छंदों पर पहुँचता है, और फड़ पर चित्रित झुंड के आगे दीया ले जाता है, तो सुनने वाले चरवाहे एकदम तनकर बैठ जाते हैं। वह फड़ पर बनी महज़ कोई कहानी नहीं है। वह तो उनके पुश्तैनी काम की शुरुआत का पक्का दस्तावेज़ है।',
      text: 'So when the bhopa reaches the camel verses, lamp held to the painted herd on the phad, the herders in the audience sit up straighter. That is not just a story on the scroll. That is the family trade, being handed its founding papers.' },
    { art: ['pt_deer'], who: 'mithu',
      hi: 'कहावतें मुस्कुराते हुए कहती हैं कि राजस्थान में दिखने वाला ऊंटों का हर झुंड शादी के एक तोहफ़े की ही देन है — जो दुनिया के दूसरे कोने से लाया गया था, क्योंकि एक छोटी बच्ची से वादा किया गया था, और वह वादा निभाया गया था। तुम भी अपने वादे ऐसे ही निभाना।',
      text: 'Every herd of camels you ever see in Rajasthan, the tradition winks, descends from a wedding present — fetched across the world because a little girl was promised, and the promise was kept. Keep yours like that.' }
  ],
  moral: 'A promise to the smallest person weighs the same as any other — keep it like a hero.',
  source: 'The camel episode of the epic of Pabuji, as sung by bhopa singer-priests before the painted phad scroll — a living Rajasthani tradition — and the Raika (Rebari) camel-herders\' veneration of Pabuji as their protector. Credited to the bhopa and Raika traditions by name; tellings differ between singers.'
},

{
  id: 'fk.deshnoke-mice',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'aaj',
  title: 'The Temple of the Small Ones',
  hook: 'In one Rajasthan temple, the most honoured worshippers run on four small feet — and everyone steps carefully, and everyone is glad.',
  hero: 'pt_mouse',
  cast: ['pt_mouse', 'courtier'],
  minutes: 4,
  place: ['IN-RJ'],
  words_hi: [['चूहा', 'chooha', 'mouse'], ['मंदिर', 'mandir', 'temple'], ['परिवार', 'parivaar', 'family']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'राजस्थान के रेगिस्तान में, बीकानेर के पास देशनोक नाम के कस्बे में, चांदी के दरवाज़ों और संगमरमर की जालियों वाला एक मंदिर खड़ा है, जो करणी माता के सम्मान में बनाया गया था — चारण समुदाय की एक पूज्य साध्वी जो छह सदियों पहले यहाँ रहती थीं, और जिन्हें उनके लोग साक्षात देवी माँ का अवतार मानकर पूजते हैं।',
      text: 'In the town of Deshnoke, near Bikaner in the desert of Rajasthan, stands a temple with silver doors and marble lattices, built in honour of Karni Mata — a sainted woman of the Charan community who lived here six centuries ago, and whom her people revere as an embodiment of the Mother Goddess herself.' },
    { art: ['pt_mouse'], who: null, mood: 'wow',
      hi: 'अंदर कदम रखो, और मंदिर का मशहूर अजूबा हर तरफ़ पैरों के नीचे दिखता है: चूहे। हज़ारों-हज़ार चूहे — चिकने, फुर्तीले, बिल्कुल बेझिझक — बड़े-बड़े कटोरों से दूध पीते हुए, दीवारों के सहारे-सहारे दौड़ते हुए, गर्माहट में ढेरों के रूप में ऊंघते हुए। यहाँ उन्हें काबा कहा जाता है, और वे कोई आफ़त नहीं हैं। वे ही तो इस मंदिर की असली जान हैं।',
      text: 'Step inside, and the temple\'s famous wonder is everywhere underfoot: mice. Thousands upon thousands of them — sleek, quick, entirely at home — drinking milk from great bowls, flowing along the walls, dozing in warm heaps. Here they are called kaba, and they are not pests. They are the whole point.' },
    { art: ['courtier'], who: null,
      hi: 'मान्यता कुछ यूँ है: करणी माता ने अपने लोगों के एक बच्चे के जाने पर दुखी होकर, मृत्यु के देवता यमराज से एक अनोखा इंतज़ाम करवा लिया — उनके लोग यमलोक नहीं जाएँगे, बल्कि उनके मंदिर में काबा के रूप में रहेंगे, और फिर से उनके ही समुदाय में जन्म लेंगे। यानी साफ़ शब्दों में कहें तो, ये चूहे उनका अपना परिवार हैं।',
      text: 'The tradition tells it this way: Karni Mata, grieving for a child of her people, won from Yama, the lord of death, an extraordinary arrangement — her people would not pass into death\'s realm, but would live on as kaba in her temple, and be born back into her community again. The mice, in other words, are family.' },
    { art: ['courtier', 'pt_mouse'], who: 'courtier', mood: 'think',
      hi: 'इसलिए ज़रा श्रद्धालुओं के पैरों को देखना। इस मंदिर में कोई भी लंबे डग भरकर नहीं चलता। हर कोई ज़मीन पर पैर घसीटते हुए चलता है, उन्हें ज़रा भी ऊपर उठाए बिना, बिल्कुल स्केटिंग करने वालों की तरह।',
      text: 'So watch the pilgrims\' feet. Nobody strides through this temple. Everyone slides their feet along the floor, never lifting them, shuffling like skaters.',
      ask: {
        q: 'Why does everyone shuffle instead of stepping normally?',
        options: ['The marble is slippery', 'So no kaba can ever be stepped on — you cannot crush what you never step over', 'It is more respectful to walk slowly'],
        answer: 1,
        right: 'That is exactly it. A sliding foot gives a mouse time to move and never comes down on top of one. In this temple, hurting a kaba even by accident is a grief — so the walk itself is redesigned around their safety.',
        wrong: 'The marble is fine, and slowness alone is not the point. A sliding foot can never come down on top of a mouse. The walk itself is redesigned so that the smallest ones are safe from every step.'
      } },
    { art: ['pt_mouse'], who: null,
      hi: '"काबा के साथ प्रसाद ऐसे बांटा जाता है जैसे किसी आदरणीय मेहमान के साथ — अनाज, मिठाइयां और दूध के वे बड़े-बड़े कटोरे, जिनके चारों ओर नन्हे पीने वाले घिरे होते हैं और उनकी पूंछें झालर की तरह लटकती हैं। काबा का जूठा किया हुआ खाना ख़राब नहीं, बल्कि आशीर्वाद माना जाता है। आने वाले लोग देखते हैं कि कैसे उनकी अपनी झिझक, आमतौर पर बस कुछ ही मिनटों में, ख़ुशी में बदल जाती है।"',
      text: 'Prasad is shared with the kaba as with honoured guests — grain and sweets and those great bowls of milk, ringed with small drinkers, tails hanging like fringe. Food a kaba has nibbled is counted blessed, not spoiled. Visitors watch their own flinch dissolve, usually within minutes, into delight.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और हज़ारों काले काबाओं के बीच कुछ सफ़ेद काबा भी रहते हैं — जो बहुत कम दिखते हैं, और जिन्हें देखने की हर कोई आस लगाए रहता है। तीर्थयात्रियों का कहना है कि सफ़ेद काबा का दिखना एक ख़ास वरदान है: कुछ लोगों का तो मानना है कि वे खुद करणी माता और उनके सबसे करीबी परिजन हैं। बच्चे उन्हें ऐसे धीरज और चाव से ढूंढते हैं, जैसे कोई पंछियों को निहार रहा हो।"',
      text: 'And among the thousands of dark kaba live a few white ones — rarely seen, eagerly hoped for. To spot a white kaba, pilgrims say, is a special blessing: some hold they are Karni Mata and her closest kin themselves. Children search for them with the happy patience of birdwatchers.' },
    { art: ['pt_mouse', 'courtier'], who: null,
      hi: '"चारण सदियों से इस मंदिर की सेवा करते आ रहे हैं, और राजस्थान में करणी माता की मान्यता बहुत गहरी है — बीकानेर और जोधपुर के शासकों ने उनके जीवनकाल में उनका आदर किया था, और तब से लेकर आज तक उनके अपने लोग ही उनके मंदिर की देखभाल करते आए हैं।"',
      text: 'The Charans have served this temple for centuries, and Karni Mata\'s standing runs deep in Rajasthan — the rulers of Bikaner and Jodhpur honoured her in her lifetime, and her shrine has been cared for by her people ever since.' },
    { art: ['pt_mouse'], who: 'mithu',
      hi: '"एक ऐसी जगह जहाँ सबसे छोटे, जिसे अक्सर अनदेखा कर दिया जाता है ऐसे जीव को भी प्यारे परिवार की तरह माना जाता है — और जहाँ ऐसे दस हज़ार जीव भरपेट खाकर, आराम से और पूरी तरह बेख़ौफ़ रहते हैं। दुनिया भर से लोग यह महसूस करने आते हैं कि यह कैसा लगता है। और यह सचमुच महसूस करने जैसा है।"',
      text: 'A place where the smallest, most ignorable creature is treated as beloved family — and where ten thousand of them live warm and fed and utterly unafraid. People travel across the world to feel what that is like. It is worth feeling.' }
  ],
  moral: 'Holiness can be small, quick and whiskered — a place is measured by how it treats its least.',
  source: 'The Karni Mata temple at Deshnoke, Rajasthan — the kaba mice, the milk bowls, the sliding-foot custom, the hoped-for white kaba, and the temple\'s keeping by the Charan community, who revere Karni Mata (15th century) as the Mother Goddess embodied. A living shrine, told from the inside.'
},

{
  id: 'fk.chand-baori',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'west-lands',
  badge: 'katha',
  title: 'The Well That Goes Down Like a Mountain Upside-Down',
  hook: 'Three and a half thousand steps, thirteen floors deep, cut into the desert — and the village says it was built in a single night.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-RJ'],
  words_hi: [['सीढ़ी', 'seedhi', 'stair'], ['कुआँ', 'kuaan', 'well'], ['गहरा', 'gehra', 'deep']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"पूर्वी राजस्थान के आभानेरी गाँव में ज़मीन में एक ऐसा गड्ढा है जिसे देखकर लोग बोलते-बोलते रुक जाते हैं। चाँद बावड़ी: एक बावड़ी — यानी सीढ़ियों वाला कुआँ — लेकिन इतनी विशाल कि यह शब्द भी उसके सामने छोटा पड़ जाए। तेरह मंज़िल गहरी। लगभग साढ़े तीन हज़ार सीढ़ियाँ, जैसा कि आमतौर पर गिना जाता है, जो एक के बाद एक दीवारों पर बिलकुल सधे हुए टेढ़े-मेढ़े त्रिकोणों में नीचे उतरती हैं, जैसे कोई उल्टा पहाड़ बना दिया गया हो।"',
      text: 'In the village of Abhaneri, in eastern Rajasthan, there is a hole in the ground that stops people mid-sentence. Chand Baori: a stepwell — a well with stairs — but of such a size that the word hardly serves. Thirteen storeys deep. Around three and a half thousand steps, as they are usually counted, descending wall after wall in perfect zigzag triangles, like a mountain built upside-down.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"किनारे पर खड़े होकर नीचे देखिए तो आँखें उस बनावट पर फिसलती जाती हैं — सीढ़ियाँ, सीढ़ियाँ और सीढ़ियाँ, जो नीचे हरी छाया में उतरती जाती हैं जहाँ तल में पानी इंतज़ार करता है, तहखाने जैसा ठंडा जबकि ऊपर रेगिस्तान तप रहा होता है। यह एक हज़ार साल से भी ज़्यादा पुरानी है, और आज भी देखने वालों की सांसें बिलकुल वैसे ही थाम लेती है जैसा कि चाहा गया था।"',
      text: 'Stand at the rim and look down and your eyes slide on the pattern — steps, steps, steps, sharpening down into green shadow where the water waits at the bottom, cool as a cellar while the desert above bakes. It is more than a thousand years old, and it still takes the breath exactly as intended.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"गाँव वाले यह कहानी अपने ही अनोखे अंदाज़ में सुनाते हैं। वे कहते हैं कि चाँद बावड़ी को रूहों ने बस एक ही रात में बना दिया था। एक सूरज ढलने और अगले सूरज के उगने के बीच ज़मीन फटी, अंधेरे में हज़ारों सीढ़ियाँ अपने-आप बिछती चली गईं, और सुबह होते-होते बावड़ी पूरी तैयार मिली — इंसानी हाथों के लिए कुछ ज़्यादा ही बेमिसाल और इंसानी सब्र के लिए कुछ ज़्यादा ही गहरी।"',
      text: 'The village tells its story the proper way. Chand Baori, they say, was built in a single night — by spirits. Between one sunset and one sunrise the ground opened, the thousands of steps laid themselves down in the dark, and the dawn found the well complete, too perfect for human hands and too deep for human patience.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"और पुराने इतिहास की दूसरी ही कहानी है: इस बावड़ी को एक हज़ार से भी ज़्यादा साल पहले निकुंभ वंश के राजा चंदा ने बनवाया था — जिसे इंसानी कारीगरों ने कई सालों की मेहनत से, एक-एक पत्थर तराशकर और जोड़कर बनाया। इसलिए बावड़ी के किनारे खड़े बच्चे को दो कहानियाँ मिलती हैं और एक बहुत बढ़िया सवाल।"',
      text: 'And the old records tell it the other way: the well was ordered by a king remembered as Chanda, of the Nikumbha line, more than a thousand years ago — cut and fitted by human builders, stone by stone, over years. So a child at the rim gets two stories and one excellent question.',
      ask: {
        q: 'One night by spirits, or years of work by builders — which story should we keep?',
        options: ['Only the builders\' — the other is not true', 'Only the spirits\' — it is more fun', 'Both — the record tells you how it was made, and the legend tells you how it FEELS to stand here'],
        answer: 2,
        right: 'Keep both, each doing its own job. The record honours the builders. The legend honours the astonishment — because standing at that rim, one night and a thousand spirits is exactly what it feels like.',
        wrong: 'Keep both, each doing its own job. The record honours the builders who really cut these steps. The legend honours the astonishment — standing at the rim, one night and a thousand spirits is exactly what it feels like.'
      } },
    { art: ['guard'], who: null,
      hi: '"आखिर ऐसी चीज़ बनाई ही क्यों जाए? क्योंकि रेगिस्तान में पानी यूँ ही नहीं मिल जाता — पानी तक पहुँचना पड़ता है। बारिश थोड़ी देर के लिए आती है और गहराई में समा जाती है, और सूखे महीनों में बावड़ी का पानी नीचे और नीचे उतरता जाता है। बावड़ी में आप पानी के पीछे-पीछे नीचे उतरते हैं: पानी चाहे जिस भी तल पर चला जाए, वहाँ तक सीढ़ियाँ जाती हैं।"',
      text: 'Why build such a thing at all? Because in the desert, water is not found — it is reached. The rains come briefly and sink deep, and the well\'s level falls and falls through the dry months. In a stepwell you follow the water down: whatever floor it has sunk to, there are steps to it.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और बावड़ी सिर्फ पानी की व्यवस्था भर कभी नहीं थी। जब ऊपर की दुनिया भट्टी जैसी तपती है, तो उन सीढ़ियों के नीचे ठंडक होती है; वो गहरे दालान मिलने-जुलने की जगह थे, सुस्ताने के ठिकाने थे, तीर्थयात्रियों के रास्तों पर छाँव भरे बसेरे थे। रेगिस्तान के लोगों ने अपनी पानी की जगह को खूबसूरत बनाया क्योंकि वे वहाँ इकट्ठा होते थे — जिस कमरे में सब मिलते हैं, उसे सजाया तो जाता ही है।"',
      text: 'And a baori was never just plumbing. Down those stairs it is cool when the world above is furnace; the deep galleries were meeting place, resting place, a shaded refuge on pilgrim roads. The desert people made their water-place beautiful because they gathered at it — you decorate the room where everyone meets.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"राजस्थान और गुजरात में सैकड़ों बावड़ियाँ बिखरी पड़ी हैं — कुछ सादी, तो कुछ महलों की तरह तराशी हुईं — हर बावड़ी इसी समझ की गवाही देती है: सूखे इलाके में पानी ही खज़ाना है, और खज़ाने की इमारत भी तो शानदार होनी चाहिए। चाँद बावड़ी बस उसी समझ का सबसे बड़ा नमूना है।"',
      text: 'Rajasthan and Gujarat are dotted with hundreds of stepwells — some plain, some carved like palaces — each one a signature of the same understanding: in dry country, water is the treasure, and the treasury deserves architecture. Chand Baori is simply the signature written largest.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगली बार जब तुम बिना सोचे-समझे पानी का गिलास भरो, तो आभानेरी को याद करना: एक ऐसा गाँव जिसने साढ़े तीन हज़ार सीढ़ियों से पानी का आदर किया। और अगर कोई पूछे कि इसे किसने बनाया — तो खैर, अब तुम्हें दोनों जवाब मालूम हैं।"',
      text: 'Next time you fill a glass without thinking, remember Abhaneri: a village that honoured water with three and a half thousand steps. And if anyone asks who built it — well. You know both answers now.' }
  ],
  moral: 'In dry country, water is climbed for — and what a people treasures, they build beautifully.',
  source: 'Chand Baori at Abhaneri, Rajasthan — attributed by tradition and inscription-based scholarship to the Nikumbha ruler Chanda over a thousand years ago — and the village legend of its building in one night by spirits, told alongside. The well, its roughly 3,500 steps and 13 storeys are real and much visited; the legend is presented as legend.'
},

/* ========================================== MADHYA PRADESH =============== */
{
  id: 'fk.gond-mahua',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'katha',
  title: 'The Tree That Feeds Everyone',
  hook: 'Before dawn, whole families walk out to the big trees and gather the night\'s fallen flowers — sweet enough to eat, bright enough to thank a god for.',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'courtier'],
  minutes: 4,
  place: ['IN-MP'],
  words_hi: [['फूल', 'phool', 'flower'], ['मीठा', 'meetha', 'sweet'], ['भोर', 'bhor', 'dawn']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"मध्य भारत के जंगलों में—जो दुनिया के सबसे बड़े आदिवासी समुदायों में से एक, गोंड लोगों की मातृभूमि है—महुआ नाम का एक विशाल, दानी पेड़ उगता है। और गोंड लोगों और उनके पड़ोसियों के लिए महुआ सिर्फ एक आम पेड़ नहीं है। वह पालनहार है। ऐसा पेड़ जो सबका पेट भरता है।"',
      text: 'Across the forest country of central India — the homeland of the Gond people, one of the largest Adivasi communities in the world — there grows a broad, generous tree called the mahua. And for the Gond and their neighbours, the mahua is not one tree among many. It is the provider. The tree that feeds everyone.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"इसकी ख़ास बात यह है। गर्मी के मौसम में, जब खेत खाली होते हैं और खाने की सबसे ज़्यादा कमी होती है, तब महुआ पर फूल खिलते हैं—और वे फूल खुद ही भोजन होते हैं। गोल-मटोल, हल्के रंग के, शहद जैसे मीठे छोटे-छोटे गोले। और पेड़ किसी के मांगने का इंतज़ार नहीं करता: हर रात वह बस उन्हें नीचे गिरा देता है। सुबह होने तक नीचे की ज़मीन पर मिठास ही मिठास बिखर जाती है।"',
      text: 'Here is its wonder. In the hot season, when the fields are empty and food is shortest, the mahua flowers — and the flowers themselves are food. Fat, pale, honey-sweet little globes, and the tree does not wait to be asked: each night it simply lets them fall. By dawn the ground beneath is scattered with sweetness.' },
    { art: ['pt_elephant', 'courtier'], who: null,
      hi: '"इसलिए महुआ के मौसम में गाँव सूरज उगने से पहले ही जाग जाते हैं। पूरे परिवार अपने-अपने पेड़ों की ओर चल पड़ते हैं—क्योंकि ये पेड़ जाने-पहचाने होते हैं और खेतों की तरह पीढ़ी-दर-पीढ़ी सौंपे जाते हैं, हर परिवार अपने ही पेड़ के नीचे इकट्ठा होता है—और उजाला फैलते ही गिरे हुए फूलों को टोकरियों में चुन लेता है। चाहे ताज़ा खाओ, साल भर के लिए सुखा कर रखो, या उनसे मिठाइयाँ बनाओ: यह जंगल की अपनी फ़सल है, जो बिना हल चलाए मिलती है।"',
      text: 'So in mahua season the villages rise before the sun. Whole families walk out to their trees — for the trees are known and kept, passed down like fields, each family gathering under its own — and pick the fallen flowers into baskets while the light comes up. Eaten fresh, dried for the year, cooked into sweets: the forest\'s own harvest, given without a plough.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"जब गोंड समाज के एक बुज़ुर्ग से पूछा गया कि सिर्फ़ महुआ का ही इतना आदर क्यों होता है, तो उन्होंने बड़ों के अंदाज़ में सवाल के बदले सवाल पूछा: "सोचो, एक पेड़ किस-किस तरह से तुम्हारा पेट भर सकता है। अब मुझे बताओ—महुआ अपने पास क्या बचाकर रखता है?""',
      text: 'A Gond elder, asked why the mahua alone is honoured so, put the question back, as elders do: "Think of every way a tree can feed you. Now tell me — what does the mahua keep for itself?"',
      ask: {
        q: 'Flowers to eat, fruit for oil, shade in the hot months, and it feeds the wild creatures too. What does the mahua keep back?',
        options: ['Its wood — that is forbidden to touch', 'Nothing — it gives by dropping its gifts freely, and is never cut for them', 'Its flowers, which must be climbed for'],
        answer: 1,
        right: '"Nothing," said the elder. "It drops its wealth at your feet and asks only to stand. That is why a green mahua is not cut. You do not put an axe in the one who feeds you."',
        wrong: 'The flowers are never climbed for — the tree drops them itself, freely, at your feet. "It gives everything and asks only to stand," said the elder. "That is why a green mahua is never cut."'
      } },
    { art: ['pt_elephant'], who: null,
      hi: '"और गोंड समझ के अनुसार, पेड़ के नीचे का परिवार सिर्फ इंसानों तक सीमित नहीं है। भालुओं को महुआ के फूल बहुत ही पसंद हैं—और वैसे ही हिरनों, जंगली सूअरों, पक्षियों और पूरे जंगल के बटोरने वालों को भी। पेड़ बिना कोई हिसाब रखे सबको खिलाता है, और समझदार बीनने वाला दूर गिरे फूलों को उन चौपायों के लिए छोड़ देता है।"',
      text: 'And the family under the tree, in the Gond understanding, is bigger than the human one. The bears love mahua flowers famously — so do deer, wild pigs, birds, a whole forest of gatherers. The tree feeds them all without keeping accounts, and the wise gatherer leaves the far-fallen flowers for the four-footed.' },
    { art: ['courtier'], who: null,
      hi: '"गोंड लोग अपने महान देवता बड़ा देव का आदर करते हैं, और जंगल के पुराने तौर-तरीके उनकी छत्रछाया में निभाए जाते हैं: पहली भेंट, फूल बीनते समय गाए जाने वाले गीत, और उन पेड़ों का सम्मान जो लोगों को भूख से बचाते हैं। उन पेड़ों में महुआ सबसे आगे है, और यह लोगों तक कैसे पहुँचा, इसकी कहानियाँ हर गाँव में अलग-अलग हैं—पर हर कहानी में एक जैसा ही धन्यवाद बसा है।"',
      text: 'The Gond honour the great god they call Bada Dev, and the old ways of the forest are kept in his sight: the first offerings, the songs at gathering time, the respect for the trees that stand between the people and hunger. The mahua stands first among those trees, and the tellings of how it came to the people differ from village to village — each one carrying the same thanks.' },
    { art: ['courtier', 'pt_elephant'], who: null, mood: 'wow',
      hi: '"महुआ को पूरे साल अपना काम करते देखो: तंगी के दिनों में फूल, फिर ऐसे फल जिनके बीजों से दीये का तेल और पकाने का तेल मिले, फिर भट्टी जैसे तपते महीनों में घनी छांव, और फिर मवेशियों के लिए पत्ते। एक तने पर खड़ा पूरा का पूरा घर-संसार, जो बिना किसी ख़र्च के हर बार खुद को नया बना लेता है।"',
      text: 'Watch the mahua work through a whole year: flowers in the hungry season, then fruit whose seed gives lamp-oil and cooking oil, then deep shade in the furnace months, then leaves for the cattle. An entire household economy, standing on one trunk, renewing itself for free.' },
    { art: ['pt_elephant'], who: 'mithu',
      hi: '"महुआ सिखाता है कि सबसे बड़ा दानी वही है, जो बिना कुछ छीने देता है — और जिसका आदर उसे कभी नुकसान न पहुंचाकर किया जाता है। गोंड लोगों ने इस पेड़ के साथ यह नाता इतने लंबे समय से निभाया है कि कोई गिनती भी नहीं कर सकता। और दोनों आज भी फल-फूल रहे हैं।"',
      text: 'The best giver, the mahua teaches, gives without being taken from — and is honoured by never being harmed. The Gond have kept that bargain with this tree for longer than anyone can count. Both sides are still flourishing.' }
  ],
  moral: 'Honour what feeds you by letting it stand — the best harvests are the given ones.',
  source: 'The mahua tree in the life of the Gond and neighbouring Adivasi communities of Madhya Pradesh and central India — the dawn flower-gathering, the family trees, the rule against cutting a green mahua, and reverence for Bada Dev — is documented living tradition. Village tellings of the tree\'s origin differ, and this telling says so rather than picking one and calling it the original.'
},

{
  id: 'it.tansen-tigers',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'itihaas',
  title: 'The Boy Who Spoke Tiger',
  hook: 'Travellers on the forest road froze — a tiger\'s roar, close by. Then the tiger stepped out, laughing: a small boy, extremely pleased with himself.',
  hero: 'tansen',
  cast: ['tansen', 'akbar'],
  minutes: 4,
  place: ['IN-MP'],
  words_hi: [['संगीत', 'sangeet', 'music'], ['आवाज़', 'awaaz', 'voice'], ['गुरु', 'guru', 'teacher']],
  scenes: [
    { art: ['tansen'], who: null,
      hi: '"साढ़े चार सौ साल पहले, आज के मध्य प्रदेश में ग्वालियर के पास, बेहट नाम के एक गांव में रामतनु नाम का एक लड़का रहता था। आगे चलकर दुनिया उसे एक दूसरे नाम से जानने वाली थी — तानसेन, अपने ज़माने का सबसे महान गायक। लेकिन यह कहानी उस सबसे पहले की है, और यही वह कहानी है जिसे लोग सबसे ज़्यादा चाव से सुनाते हैं।"',
      text: 'Four and a half centuries ago, near Gwalior in what is now Madhya Pradesh, in a village called Behat, there lived a boy named Ramtanu. The world would come to know him by another name — Tansen, the greatest singer of his age. But this story is from before all that, and it is the story his tradition loves best.' },
    { art: ['tansen'], who: null, mood: 'wow',
      hi: '"पुरानी बातों से पता चलता है कि उस लड़के के कान सबसे अनोखे थे। जो कुछ वह सुनता, हूबहू दोहरा देता। गाड़ी की चरमराहट, मोर की पुकार, घाटी के पार किसी चरवाहे की आवाज़ — बस एक बार सुना, और वह आवाज़ उसकी हो गई। और उसकी सबसे कमाल की कला, जिसे उसने बेहट के जंगलों में मांझ-मांझ कर निखारा था, वह थी बाघ की दहाड़।"',
      text: 'The boy, the accounts agree, had an ear like nobody else\'s. What he heard, he could give back. The creak of a cart, a peacock\'s cry, a herdsman\'s call across a valley — one hearing, and it was his. And his masterpiece, polished in the forests around Behat, was the roar of a tiger.' },
    { art: ['tansen'], who: null,
      hi: '"कहानियों में बताया जाता है कि जंगल के रास्ते पर चलते मुसाफ़िर झाड़ियों से आती दहाड़ सुनकर पेड़ों की तरफ भाग छूटते — और फिर झाड़ियों में से बाघ के बजाय एक छोटा सा लड़का बाहर निकलता, जो खुशी से फूला न समाता। यह किस्सा हंसते हुए सुनाया जाता है, और लगता है कि बाद में खुद उस लड़के ने इसे बादशाहों को और भी मज़ेदार ढंग से सुनाया होगा।"',
      text: 'The tradition tells of travellers on the forest road scattering for the trees at a roar from the thickets — and of the thicket then producing, instead of a tiger, one small boy, delighted beyond measure. The story is told laughing, and one suspects the boy told it best himself, later, to emperors.' },
    { art: ['tansen'], who: null, mood: 'think',
      hi: '"एक दिन — किस्सा आगे कहता है — महान संत-गायक स्वामी हरिदास अपने शिष्यों के साथ उसी रास्ते से गुज़रे, और झाड़ियों में छिपे लड़के ने बाघ की दहाड़ में अपनी पूरी जान झोंक दी। लेकिन आवाज़ों के उस्ताद को आवाज़ के धोखे से चकमा देना आसान नहीं होता। हरिदास जी ने ध्यान से सुना, और वह सुन लिया जो बाकी कोई नहीं सुन पाया था।"',
      text: 'One day — so the tradition continues — the great singer-saint Swami Haridas came along that road with his disciples, and the boy in the bushes gave his tiger everything he had. But a master of sound is a bad audience for a trick of sound. Haridas listened, and heard what the others had not.',
      ask: {
        q: 'The travellers heard a tiger. What did Swami Haridas hear?',
        options: ['A rude boy playing pranks', 'A once-in-a-generation ear — a child who could truly LISTEN, hiding inside a joke', 'An actual tiger'],
        answer: 1,
        right: 'That is the turn of the story. Where the road heard danger and a village heard mischief, the master heard the rarest raw material in music: an ear that caught the world exactly. He asked for the boy as his student.',
        wrong: 'No tiger — and Haridas was not interested in scolding. Where the road heard danger, the master heard the rarest raw material in music: an ear that caught the world exactly. He asked for the boy as his student.'
      } },
    { art: ['tansen'], who: null,
      hi: 'तो रामतनु हरिदास जी के पास सीखने चले गए — परंपरा के अनुसार यह कई सालों की तालीम थी जो वृंदावन में हुई — और जिस कान ने बाघों की आवाज़ें संभाली थीं, उसने रागों को संभालना सीख लिया। जो लड़का किसी भी चीज़ की आवाज़ बन सकता था, वह बड़ा होकर एक ऐसा इंसान बना जो सुर-दर-सुर, आवाज़ से कोई भी अहसास जगा सकता था।',
      text: 'So Ramtanu went to study with Haridas — years of training the tradition places in Vrindavan — and the ear that had held tigers learnt to hold ragas. The boy who could become any sound grew into a man who could build any feeling out of sound, note by note.' },
    { art: ['akbar', 'tansen'], who: null, mood: 'wow',
      hi: 'यहाँ से आगे की बातें इतिहास में साफ़ दर्ज हैं। तानसेन की शोहरत मध्य भारत के दरबारों में गूँजने लगी — पहले रीवा में, फिर उन्हें सबसे बड़े दरबार में बुलाया गया: अकबर के दरबार में। बादशाह ने उन्हें अपने नवरत्नों में शामिल कर लिया, और उस दौर के इतिहासकारों ने उनके गायन को दुनिया के किसी अजूबे की तरह लिखा।',
      text: 'From there the record firms up. Tansen\'s fame filled the courts of central India — first at Rewa, then summoned to the greatest court of all: Akbar\'s. The emperor made him one of the navaratnas, the nine jewels, and the chronicles of the age wrote of his singing as of a wonder of the world.' },
    { art: ['tansen'], who: null,
      hi: 'इस इंसान के इर्द-गिर्द पतंगों की तरह कहानियाँ जमा होने लगीं — ऐसे राग जिनसे दीये जल उठते, ऐसे राग जो बारिश बुला लाते। वे अपनी ही कथाएँ हैं, जिन्हें प्यार से सुनाया जाता है और जहाँ भी यह ऐप उन्हें सुनाता है, उन्हें उसी रूप में पेश करता है। पर इनके पीछे जो ठोस हकीकत है, वह भी कुछ कम अनोखी नहीं: ध्रुपद की वह परंपरा जिसे उन्होंने आगे बढ़ाया, और संगीतकारों की कई पीढ़ियाँ जो अपनी जड़ें उन्हीं से जोड़ती हैं।',
      text: 'Around the man, stories gathered like moths — ragas that lit lamps, ragas that called rain. Those are their own kathas, told with love and badged as such wherever this app tells them. What is solid underneath is remarkable enough: the dhrupad tradition he carried, and generations of musicians tracing their lineage to him.' },
    { art: ['tansen'], who: 'mithu',
      hi: 'उन्हें ग्वालियर में, उनके सूफ़ी उस्ताद मुहम्मद ग़ौस के पास ही दफ़नाया गया, और हर साल ग्वालियर उनके सम्मान में तानसेन समारोह आयोजित करता है, जो भारत के सबसे बड़े संगीत उत्सवों में से एक है — आज भी गायक उनके मक़बरे पर जुटते हैं। सच तो यह है कि बेहट के उस बाघ-बालक की बात बाद में लिखी गई परंपरा है, जिसकी तारीख़ें और बाकी सब बातें पक्की नहीं हैं। लेकिन हर कहानी में वही एक बीज मौजूद है, और हर संगीतकार के बारे में यही सच है: एक पूरे दौर की आवाज़ बनने से पहले, वह एक ऐसा बच्चा था जिसने किसी से भी ज़्यादा ध्यान लगाकर सुना था।',
      text: 'He is buried in Gwalior, beside his Sufi teacher Muhammad Ghaus, and every year Gwalior holds the Tansen Samaroh, one of India\'s great music festivals, in his honour — singers still gather at his tomb. Be honest about the joins: the tiger-boy of Behat is tradition written down later, dates and all uncertain. But every version keeps the same seed, and it is a true one about every musician: before he was the voice of an age, he was a child who listened harder than anyone.' }
  ],
  moral: 'Great skill begins as great attention — listen to the world hard enough and one day it sings back through you.',
  source: 'The childhood tradition of Tansen (Ramtanu) of Behat near Gwalior — the imitated animal calls, the tiger, and the discovery by Swami Haridas — as preserved in the Gwalior and dhrupad traditions and later written accounts; dates uncertain and said so. His place among Akbar\'s navaratnas, the contemporary fame recorded in Mughal-era chronicles, his tomb beside Muhammad Ghaus at Gwalior and the annual Tansen Samaroh are historical record.'
},

/* ============================================== CHHATTISGARH ============= */
{
  id: 'it.teejan-pandavani',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'itihaas',
  title: 'The Girl Who Sang the Mahabharata',
  hook: 'In Chhattisgarh the great epic is not read aloud — it is SUNG, by one performer who becomes the whole battlefield. And the greatest of them started as a girl listening at her grandfather\'s knee.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['गायन', 'gaayan', 'singing'], ['वीणा', 'veena', 'a stringed instrument'], ['मंच', 'manch', 'stage']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'महाभारत को बयाँ करने का छत्तीसगढ़ का अपना एक अलग अंदाज़ है, और यह पूरे भारत में सबसे जुदा है। इसे पंडवानी कहते हैं — यानी पांडवों के गीत। एक गायक, एक मंच, हाथ में सुर छेड़ता तंबूरा — और उस अकेले इंसान से पूरा महाकाव्य बाहर निकल आता है: हर वीर, हर ताना, हर लड़ाई, पूरे जोश के साथ गाई और निभाई जाती है।',
      text: 'Chhattisgarh has its own way with the Mahabharata, and it is like nothing else in India. It is called Pandavani — the songs of the Pandavas. One singer, one stage, a drone-stringed tambura in hand — and out of that one person comes the whole epic: every hero, every taunt, every battle, sung and acted at full blaze.' },
    { art: ['guard'], who: null,
      hi: 'तंबूरा ही उनका गुप्त हथियार है। पंडवानी गायक के हाथों में वह महज़ एक साज़ नहीं रह जाता, बल्कि सब कुछ बन जाता है: ऊपर घुमाया, तो वह भीम की गदा है। सीधा ताना, तो अर्जुन का धनुष है। सिर के ऊपर उठाया, तो रथ की ध्वजा है। सुनने वालों को कुरुक्षेत्र का मैदान नज़र आता है; जबकि सामान के नाम पर बस एक तंबूरा होता है।',
      text: 'The tambura is the secret weapon. In a Pandavani singer\'s hands it stops being an instrument and becomes everything else: swung up, it is Bhima\'s mace. Levelled, it is Arjuna\'s bow. Raised overhead, a chariot banner. The audience sees a battlefield; the prop list is one lute.' },
    { art: ['courtier'], who: null,
      hi: '“और जिस नाम से पूरी दुनिया पंडवानी को जानती है, वह है तीजन बाई। उनका जन्म दुर्ग के पास एक पारधी परिवार में हुआ था, और जब वे छोटी बच्ची थीं, तो अपने नाना बृजलाल को छत्तीसगढ़ी परंपरा में महाभारत की कथा गाते सुनती थीं। उन्होंने सब कुछ पूरी तरह अपने भीतर उतार लिया — घंटों लंबा महाकाव्य, सिर्फ़ सुनकर सीखा हुआ, बिल्कुल वैसे ही जैसे उनकी धरती पर यह हमेशा से अगली पीढ़ी को सौंपा जाता रहा था।”',
      text: 'And the name the whole world knows Pandavani by is Teejan Bai. She was born near Durg, in a Pardhi family, and as a small girl she would listen to her grandfather, Brijlal, singing the Mahabharata verses of the Chhattisgarhi tradition. She swallowed them whole — hours of epic, learned by ear, the way her land had always passed it down.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '“लेकिन उनके रास्ते में एक दीवार खड़ी थी। उन दिनों जो औरतें पंडवानी गाती थीं, वे वेदमती शैली में गाती थीं — शांत भाव से, बैठकर, पूरा महाकाव्य बैठकर ही सुनाया जाता था। पर जोश से भरी, मंच पर घूम-घूमकर गदा भांजने वाली शैली — कापालिक — केवल पुरुषों के लिए थी। और बैठकर सुनाने का यह अंदाज़ वह नहीं था, जिस तरह महाकाव्य तीजन बाई के भीतर धधक रहा था।”',
      text: 'But there was a wall in her way. Women who sang Pandavani in those days sang in the vedmati style — seated, decorous, the epic delivered sitting down. The blazing, striding, mace-swinging performance style — kapalik — was for men. And seated was not how the epic burned inside Teejan Bai.',
      ask: {
        q: 'Tradition says a girl sings sitting down. The epic inside her wants to stride. What does she do?',
        options: ['Sing seated, as expected', 'Stand up — sing kapalik, stride the stage, and let the singing answer the doubters', 'Give up performing'],
        answer: 1,
        right: 'She stood up. As a young teenager she performed standing, in full kapalik fire — and the power of the singing itself silenced the objections, village by village, stage by stage.',
        wrong: 'Seated could not hold what she carried, and giving up was never in her. She stood up — sang kapalik as a young teenager, striding, blazing — and the singing itself silenced the objections, village by village.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '“जब लोगों ने उन्हें देखा, तो उनके देखते ही सारी बहस ख़त्म हो गई। जब तीजन बाई पूरे रंग में होती हैं, तो लगता है जैसे पूरा महाकाव्य एक ही इंसान में समा गया हो: नगाड़े जैसी गूँजती आवाज़, तंबूरा कभी चमकता हुआ धनुष बन जाता तो कभी गदा, द्रौपदी का क्रोध और भीम की दहाड़ एक ही गले से फूट पड़ते। जो गाँव कल तक फुसफुसा रहे थे, वे अगली रात फिर लौट आए और साथ में अपने पड़ोसियों को भी ले आए।”',
      text: 'What audiences saw, once they saw her, ended the argument. Teejan Bai in full flight is the epic weather-fronted into one person: voice like a festival drum, the tambura flashing from bow to mace, Draupadi\'s fury and Bhima\'s laughter pouring out of the same throat. Villages that had muttered came back the next night and brought their neighbours.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '“गाँव के मंचों से आगे बढ़कर वे देश के सबसे बड़े मंचों पर पहुँचीं, और फिर दुनिया भर में — पूरे भारत और उससे भी दूर-दूर तक उन्होंने प्रस्तुतियाँ दीं। वे छत्तीसगढ़ के महाभारत सुनाने के अंदाज़ को उन श्रोताओं तक ले गईं, जो छत्तीसगढ़ी का एक शब्द भी नहीं समझते थे, फिर भी मंत्रमुग्ध होकर सुनते रहे। देश ने उन्हें अपने सर्वोच्च कला सम्मान दिए, जिनमें पद्म पुरस्कार भी शामिल हैं।”',
      text: 'From village stages she went on to the country\'s biggest, and then the world\'s — performing across India and far beyond, carrying Chhattisgarh\'s way of telling the Mahabharata to audiences who spoke not a word of Chhattisgarhi and sat spellbound anyway. The nation gave her its highest artistic honours, Padma awards among them.' },
    { art: ['courtier'], who: null,
      hi: '“और उनके बाद, जो दरवाज़ा उन्होंने खोला था वह खुला ही रहा। आज पूरे छत्तीसगढ़ में लड़कियाँ दोनों शैलियों में पंडवानी सीखती हैं — बैठकर भी और खड़े होकर घूमते हुए भी। उनमें से कई कहती हैं कि यह हिम्मत उन्हें तीजन बाई को देखकर ही मिली। जब वे उठकर खड़ी हुईं, तो परंपरा टूटी नहीं। बल्कि उसमें एक नई डाल फूट पड़ी, और वह डाल आज गाने वालों से भरी हुई है।”',
      text: 'And behind her, the door she opened stayed open. Girls across Chhattisgarh now learn Pandavani in both styles, seated and striding, many of them naming Teejan Bai as the reason they dared. The tradition did not break when she stood up. It grew a new branch, and the branch is full of singers.' },
    { art: ['guard'], who: 'mithu',
      hi: '“कोई भी महाकाव्य नई आवाज़ें पाकर ही ज़िंदा रहता है — और कभी-कभी उस नई आवाज़ को पहले खड़े होने का अधिकार जीतना पड़ता है। यह सब कुछ आँखों देखी सच्चाई है, कोई पुरानी कहानी नहीं: तीजन बाई सचमुच हैं, उनकी रिकॉर्डिंग बस एक खोज की दूरी पर हैं, और इसी मौसम में छत्तीसगढ़ में पंडवानी गाई जा रही है। सारा श्रेय वहीं जाता है जिसका यह हक़ है: पंडवानी की परंपरा को, और उस लड़की को जो इसके भीतर उठ खड़ी हुई।”',
      text: 'An epic stays alive by finding new voices — and sometimes the new voice must first win the right to stand. All of this is living memory, not legend: Teejan Bai is real, her recordings are a search away, and Pandavani is being sung in Chhattisgarh this very season. Credit where it belongs: to the Pandavani tradition, and the girl who stood up inside it.' }
  ],
  moral: 'An old story stays alive by finding new voices — even when the new voice has to fight to stand.',
  source: 'Teejan Bai of Chhattisgarh and the Pandavani tradition — her learning of the Chhattisgarhi Mahabharata from her grandfather Brijlal Pardhi, her taking up of the standing kapalik style as a young performer when women were expected to sing seated vedmati, her national and international career and Padma honours — is documented contemporary record. The tradition is credited by name.'
},

{
  id: 'fk.ghotul-lamps',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'aaj',
  title: 'The Children\'s Own House',
  hook: 'In some Bastar villages there is a big house that belongs to no family — because it belongs to the village\'s young people, who run it themselves.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['घर', 'ghar', 'house'], ['नियम', 'niyam', 'rule'], ['ज़िम्मेदारी', 'zimmedari', 'responsibility']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दक्षिणी छत्तीसगढ़ के जंगली इलाके बस्तर में, मुरिया समाज की एक ऐसी पुरानी परंपरा चली आ रही है जो बाहर से आने वाले हर किसी को हैरान कर देती है। गाँव में एक बड़ा और खुला सा घर होता है — जो अक्सर पूरे गाँव में सबसे बढ़िया ढंग से सँभाला हुआ होता है — पर वह किसी एक परिवार का नहीं होता। यह है घोटुल: नौजवानों का अपना घर।',
      text: 'In the forest country of Bastar, in southern Chhattisgarh, the Muria people have long kept an institution that visitors from everywhere find astonishing. In the village stands a spacious house — often the finest-kept in the village — that belongs to no family at all. It is the ghotul: the young people\'s own house.' },
    { art: ['guard'], who: null,
      hi: 'शाम को, जब दिन भर का काम पूरा हो जाता है, तो गाँव के लड़के-लड़कियाँ वहाँ इकट्ठे होते हैं — और बड़े-बूढ़े वहाँ से दूर ही रहते हैं। यह पक्का नियम है, जिसका पालन खुद बड़े-बुजुर्ग करते हैं। घोटुल के अंदर, सब कुछ नौजवान ही संभालते हैं।',
      text: 'In the evenings, when the day\'s work is done, the village\'s boys and girls gather there — and the grown-ups stay away. That is the standing rule, kept by the elders themselves. Inside the ghotul, the young run everything.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और वे इसे चलाते भी बड़े सलीके से हैं। घोटुल के अपने नौजवानों में से ही चुने हुए मुखिया होते हैं, आपस में बँटी हुई ज़िम्मेदारियाँ होती हैं — झाड़ू-सफ़ाई, जलाने की लकड़ियाँ लाना, मरम्मत करना — अपने तौर-तरीके और नियम होते हैं, और कामचोरी करने पर क्या होगा, यह भी सदस्य खुद तय करते हैं। घास-फूस की छत वाला एक छोटा-सा चलता-फिरता गणराज्य।',
      text: 'And run it they do, properly. The ghotul has its own chosen leaders from among the young people, its own duties shared out — sweeping, firewood, repairs — its own code of conduct, and its own consequences for slacking, decided by the members. A small working republic, with a thatched roof.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक बार बाहर से आए एक मेहमान ने मुरिया समाज के एक बुज़ुर्ग से पूछा कि गाँव अपने बच्चों को पूरा घर सौंपकर खुद पीछे क्यों हट जाता है। बुज़ुर्ग को यह सवाल उतना ही अजीब लगा, जितना उस मेहमान को घोटुल लगा था।',
      text: 'A visitor once asked a Muria elder why the village hands its young an entire house and steps back. The elder found the question as strange as the visitor found the ghotul.',
      ask: {
        q: 'Why give the young people a house of their own to run?',
        options: ['To keep them out of the way', 'Because running something real — rules, duties, fairness — is how you learn to be a grown-up, and learning needs a place to practise', 'Because the family houses are too small'],
        answer: 1,
        right: '"Where else would they learn?" said the elder. "You cannot learn to carry a village by watching. In the ghotul they carry a small one first — settle their own disputes, keep their own house. By the time they marry, they have practised being responsible for years."',
        wrong: '"Out of the way?" The elder laughed. "The ghotul is the centre! There they settle their own disputes, keep their own house, carry a small village before they must carry the real one. You cannot learn responsibility by watching it."'
      } },
    { art: ['guard'], who: null,
      hi: 'वे शामें अपने आप में एक अनमोल खज़ाना होती हैं: जहाँ गीत सीखे और सिखाए जाते हैं, मुरिया कहानियों का विशाल खज़ाना आगे बढ़ता है, त्योहारों के लिए नाच का अभ्यास होता है — क्योंकि गाँव के बड़े मौकों पर घोटुल के सदस्य ही ढोल बजाते और नाचते हैं, और उनकी यह प्रस्तुति पूरे गाँव की शान होती है।',
      text: 'The evenings themselves are the treasure: songs learned and taught, the great story-hoard of the Muria passed down, dances rehearsed for the festivals — for it is the ghotul members who drum and dance at the village\'s great occasions, and their performances are the village\'s pride.' },
    { art: ['courtier'], who: null,
      hi: 'छोटे बच्चे बड़ों से सीखते हैं और उनका आदर करते हैं; बड़े बच्चे सिखाने का धीरज सीखते हैं। आपसी झगड़े घोटुल के नियमों के तहत अंदर ही सुलझा लिए जाते हैं, किसी बड़े की आवाज़ के बिना। जिस किसी ने भी कभी कोई क्लब हाउस, खेल की टीम या कक्षा की मॉनिटर व्यवस्था संभाली हो, उसने उस बात का एक छोटा-सा कोना छूकर देखा है जिसे घोटुल पूरी तरह साकार करता है।',
      text: 'Younger children look up to older ones and are taught by them; older ones learn the patience of teaching. Quarrels are settled inside, by ghotul rules, without an adult voice in the room. Anyone who has ever run a clubhouse, a team or a classroom monitor system has touched a corner of what the ghotul does whole.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"घोटुल कितना पुराना है, यह कोई नहीं बता सकता — और जैसे-जैसे बस्तर बदला, यह भी बदलता गया; कुछ गाँवों में यह आज भी खूब फलता-फूलता है, तो कुछ में धीमा पड़ गया है, और हमेशा की तरह मुरिया लोग खुद ही इसका भविष्य तय करते हैं। इसका अध्ययन करने आए विद्वान जब लौटे, तो उन्होंने इसे पूरी दुनिया में सामुदायिक जीवन की सबसे अनोखी पाठशालाओं में से एक बताया।"',
      text: 'The ghotul is old — how old, nobody can say — and it has changed as Bastar changes; in some villages it thrives, in others it has faded, and the Muria themselves decide its future, as they always have. Scholars who came to study it went home describing one of the most remarkable schools of community life anywhere on Earth.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"एक ऐसा घर जहाँ नौजवानों पर पूरा भरोसा करके उन्हें असली ज़िम्मेदारी सौंपी जाती है, और पीढ़ी-दर-पीढ़ी वे इस पर खरे उतरते हैं। खुद से पूछिए कि अगर सचमुच आपको चाबियाँ थमा दी जाएँ, तो आप किस चीज़ को सबसे अच्छी तरह चला पाएँगे? मुरिया लोग सदियों से इसी सवाल का जवाब देते आ रहे हैं।"',
      text: 'A house where the young are trusted with real responsibility, and rise to it, generation after generation. Ask yourself what you would run well, if you were truly handed the keys. The Muria have been answering that question for centuries.' }
  ],
  moral: 'Trust the young with something real, and they will practise their way into carrying it.',
  source: 'The ghotul of the Muria people of Bastar, Chhattisgarh — the youth house with its own chosen leaders, duties, code and evenings of song, dance and story — as documented by scholars from Verrier Elwin onward and continued, where the Muria keep it, today. Told here in its children\'s-commons aspect, from the inside, and credited to the Muria by name.'
},

{
  id: 'fk.bastar-chariot',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'aaj',
  title: 'The Chariot the Whole Forest Pulls',
  hook: 'The world\'s longest festival runs for some seventy-five days — and at its heart, hundreds of hands haul a giant wooden chariot built new every single year.',
  hero: 'guard',
  cast: ['guard', 'durga'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['रथ', 'rath', 'chariot'], ['त्योहार', 'tyohar', 'festival'], ['रस्सी', 'rassi', 'rope']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"छत्तीसगढ़ में बस्तर की पुरानी राजधानी, जगदलपुर में मनाया जाने वाला दशहरा भारत के बाकी हिस्सों से बिल्कुल अलग है — और इतना लंबा चलता है जितना कोई और त्यौहार नहीं। अपने सभी पड़ावों को मिलाकर बस्तर दशहरा लगभग पचहत्तर दिनों तक चलता है: इसे अक्सर दुनिया का सबसे लंबा त्यौहार कहा जाता है।"',
      text: 'In Jagdalpur, the old capital of Bastar in Chhattisgarh, they keep a Dussehra unlike any other in India — and they keep it longer than anyone keeps anything. Bastar Dussehra runs, with all its stages counted, for around seventy-five days: often called the longest festival in the world.' },
    { art: ['durga'], who: null,
      hi: '"और यहाँ आने वालों के लिए पहला अचंभा यह है: बस्तर दशहरा रामायण की किसी जीत से जुड़ा नहीं है। यह देवी का पर्व है — सबसे बढ़कर दंतेश्वरी माता का, जो बस्तर की महादेवी हैं और जिन्हें यह पूरी धरती अपनी मानकर पूजती है। यह त्यौहार बस्तर का अपने ही अंदाज़ में अपनी देवी के चरणों में जुटने का पर्व है।"',
      text: 'And here is the first surprise for visitors: Bastar Dussehra is not about a victory in the Ramayana. It belongs to the Devi — above all to Danteshwari, the great mother goddess of Bastar, whom the whole land honours as its own. The festival is Bastar gathering to its goddess, in Bastar\'s own way.' },
    { art: ['guard', 'durga'], who: null, mood: 'wow',
      hi: '"इस उत्सव के केंद्र में चलता है रथ: ठोस लकड़ी और बड़े-बड़े पहियों वाला एक भारी-भरकम रथ, जो किसी घर जितना ऊँचा होता है — और इसे हर साल बिल्कुल नया बनाया जाता है। पूरे विधि-विधान से जंगल से पेड़ लाए जाते हैं, और खास गाँवों के पुश्तैनी बढ़ई परिवार अपने हाथों के औज़ारों से इन्हें गढ़ते हैं, ठीक वैसे ही जैसे उनके बाप-दादा करते आए थे। हर गाँव उस काम को सँभालता है जो पीढ़ियों से उसका सम्मान रहा है।"',
      text: 'At its heart rolls the rath: a massive chariot of solid wood on great solid wheels, tall as a house — built completely new each year. Trees are brought from the forest with due ceremony, and hereditary carpenter families from particular villages shape them with hand tools, as their fathers and grandfathers did, each village keeping the task that has been its honour for generations.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: '"फिर बारी आती है रथ खींचने की। न कोई इंजन, न कोई जानवर। लंबी, भारी रस्सियाँ — और मुरिया तथा अन्य आदिवासी समुदायों के सैकड़ों नौजवान, जो रथ खींचने का पुश्तैनी हक़ लेकर गाँवों से आते हैं और रस्सियों पर अपनी-अपनी जगह सँभाल लेते हैं।"',
      text: 'Then comes the pulling. No engine, no animals. Long, heavy ropes — and hundreds of young men of the Adivasi communities, Muria and others, who come in from the villages holding the hereditary right to pull the rath, take their places on the lines.',
      ask: {
        q: 'Why build a new giant chariot every year and pull it by hundreds of hands, when wheels and engines exist?',
        options: ['Nobody thought of engines', 'Because the building and the pulling ARE the festival — every village\'s task, every hauler\'s rope, is a share in honouring the Devi', 'To save money'],
        answer: 1,
        right: 'That is the heart of it. An engine would carry the chariot and lose the festival. The tree-bringers, the carpenter villages, the rope teams — each has a hereditary share, and the sharing out of the work IS Bastar honouring its goddess together.',
        wrong: 'Bastar knows all about engines — and a new rath each year costs far more effort, not less. The building and pulling ARE the festival: every village\'s hereditary task, every hauler\'s rope, is a share in honouring the Devi together.'
      } },
    { art: ['durga', 'guard'], who: null,
      hi: '"कई दिनों तक जगदलपुर की गलियों में बड़े-बड़े पहिए चरचराते हुए घूमते हैं, रस्सियाँ खींचने वालों के हाथ कसे होते हैं, भारी भीड़ उमड़ती है और हवा में नगाड़ों की गूंज भर जाती है। इस त्योहार के कई पड़ाव होते हैं, जिनके अपने-अपने नाम और रीति-रिवाज़ हैं, जो महीनों तक चलते हैं — और इस पूरे समय, देवी का मान-सम्मान बारी-बारी से हर समाज मिलकर संभालता है, उतनी ही हिफ़ाज़त से जितनी हिफ़ाज़त से रथ को खींचा जाता है।"',
      text: 'For days the great wheels groan around the streets of Jagdalpur, the ropes taut with hauliers, the crowds vast, the air full of drums. The festival\'s many stages have their own names and rites, months of them — and through it all, the goddess\'s honour is carried by turns, community by community, as carefully as the chariot itself.' },
    { art: ['guard'], who: null,
      hi: '"एक मशहूर रात तो ऐसी भी होती है, जिसे कार्यक्रम में सुनते ही हर बच्चा खुश हो जाता है, जब रथ को चुपके से ले जाकर रस्म के तौर पर "चुरा" लिया जाता है — और फिर मान-मनौव्वल और दावत के साथ उसे ढूंढकर वापस लाना पड़ता है। बस्तर में यह त्योहार इतने ज़माने से मनाया जा रहा है कि पूजा-पाठ के विधान में भी हँसी-मज़ाक रच-बस गया है।"',
      text: 'There is even a famous night, beloved of every child who hears the schedule, when the rath is spirited away and ceremonially "stolen" — and must be found and brought back with negotiation and feasting. Bastar has been running this festival so long it has built comedy into the liturgy.' },
    { art: ['durga'], who: null,
      hi: '"जब सब पूरा हो जाता है, तो देवी को अगले साल तक के लिए आदर सहित विदा किया जाता है, रथ का काम पूरा हो जाता है, और बढ़इयों के गाँवों को पहले से पता होता है कि अगले साल जंगल नए पेड़ देगा और उनके हाथ फिर से यह सब नया बनाएँगे। कुछ भी सहेजकर नहीं रखा जाता। हर चीज़ नए सिरे से बनती है। यही बस्तर का तरीका है।"',
      text: 'When it all ends, the Devi is seen off with honour until the next year, the rath\'s duty is done, and the carpenter villages already know that next year the forest will give new trees and their hands will build it all again. Nothing is stored. Everything is renewed. That is the Bastar way.' },
    { art: ['guard'], who: 'mithu',
      hi: '"त्योहार एक ऐसी मशीन की तरह है जो हर किसी के काम से चलती है — और बस्तर हर साल इस मशीन को नए सिरे से बनाता है, जंगल की लकड़ी से लेकर रस्सियों तक, अपनी याददाश्त और हाथों के हुनर से। कोई पचहत्तर दिन, और एक भी दिन खाली नहीं। अगर हो सके, तो ज़िंदगी में एक बार इसे जाकर ज़रूर देखना।"',
      text: 'A festival is a machine made of everyone\'s jobs — and Bastar builds the machine fresh every year, from forest to rope, by memory and hand. Some seventy-five days, and not one of them idle. Go and see it once in your life if you can.' }
  ],
  moral: 'The doing together is the celebration — share out the work and the festival builds itself.',
  source: 'Bastar Dussehra at Jagdalpur, Chhattisgarh — its roughly 75-day span, its dedication to Devi Danteshwari rather than to the Ramayana victory, the annually rebuilt wooden rath made and pulled by hereditary right by villages of the Muria and other Adivasi communities of Bastar, and the rath-stealing night — is a documented living festival, told from the inside and credited to the communities who keep it.'
},

{
  id: 'fk.myna-judge',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'katha',
  title: 'The Myna Who Judged the Quarrel',
  hook: 'Two loud neighbours, one disputed mango tree, and a judge with feathers who says nothing of her own — she only repeats.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_jackal'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['झगड़ा', 'jhagda', 'quarrel'], ['मैना', 'maina', 'myna bird'], ['फ़ैसला', 'faisla', 'judgement']],
  scenes: [
    { art: ['pt_crow'], who: null,
      hi: '"छत्तीसगढ़ के बस्तर के जंगलों में चमकीले काले रंग की एक चिड़िया रहती है, जिसके कानों के पास चटख पीले निशान होते हैं, जिसे पहाड़ी मैना कहते हैं — और उसके पास एक मशहूर हुनर है। वह जो भी आवाज़ सुनती है, हूबहू वैसी ही आवाज़ निकाल सकती है। छत्तीसगढ़ उसे इतना प्यार करता है कि उसने उसे अपना राजकीय पक्षी बना लिया। यह कहानी उसी के सम्मान में सुनाई जाती है।"',
      text: 'In the forests of Bastar, in Chhattisgarh, lives a glossy black bird with bright yellow wattles called the hill myna — and she has one famous gift. She can repeat, perfectly, any voice she hears. Chhattisgarh loves her so well it made her the state bird. This is a fable told in her honour.' },
    { art: ['pt_jackal'], who: null,
      hi: '"जंगल से लगे एक गाँव के किनारे आम का एक पेड़ था, और उस पेड़ के दोनों तरफ दो पड़ोसी रहते थे, और उनके बीच एक झगड़ा चला आ रहा था जो इतना पुराना था मानो उसने वहीं अपना घर बना लिया हो। पेड़ किसका है? आम किसके हैं? हर मौसम में फलों के साथ-साथ यह चीख-पुकार भी लौट आती थी।"',
      text: 'On the edge of a forest village stood a mango tree, and on either side of the mango tree lived two neighbours, and between them stood a quarrel so old it had practically built its own house. Whose tree? Whose mangoes? Every season the shouting came back with the fruit.' },
    { art: ['pt_jackal', 'pt_crow'], who: null,
      hi: 'उस साल वे इतनी देर तक और इतना ज़ोर-ज़ोर से चिल्लाए कि पूरे जंगल को उनके भाषण मुँह-ज़बानी याद हो गए। और खुद उसी आम के पेड़ पर, बड़े पेशेवर अंदाज़ में ध्यान से सुनती हुई, एक पहाड़ी मैना बैठी थी।',
      text: 'They shouted so long and loud that year that the whole forest knew the speeches by heart. And in the mango tree itself, listening with professional interest, sat a hill myna.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'एक सुबह पड़ोसी वहाँ पहुँचे, तो उन्होंने देखा कि मैना सबसे निचली डाली पर किसी मजिस्ट्रेट की तरह इंतज़ार कर रही थी। "जंगल ने मुझे जज बनाया है," उसने बड़े रौबदार अंदाज़ में ऐलान किया — यह आवाज़ उसने गाँव की मुखिया से सीखी थी। "अपनी-अपनी बात पेश करो। मैं एक-एक शब्द पर गौर करूँगी।"',
      text: 'One morning the neighbours arrived to find the myna on the lowest branch, waiting like a magistrate. "The forest has appointed me judge," she announced — in a voice of great authority, which she had borrowed from the village headwoman. "Present your cases. I will consider every word."',
      ask: {
        q: 'The myna cannot make speeches of her own — she can only repeat what she hears. What kind of judgement can such a judge give?',
        options: ['None — she is useless as a judge', 'She can repeat each neighbour\'s words back to them — and let them hear themselves for the first time', 'She can ask the trees to decide'],
        answer: 1,
        right: 'That was her entire plan, and it was enough. Each neighbour spoke; the myna repeated them — exactly, tone and sneer and all — to their own faces.',
        wrong: 'The trees keep their opinions to themselves. The myna\'s plan was simpler: she repeated each neighbour\'s own words back — exactly, tone and sneer and all — to their own faces.'
      } },
    { art: ['pt_jackal'], who: null, mood: 'wow',
      hi: 'पहले पड़ोसी ने अपनी बात रखी, पूरी की पूरी शिकायतों और गरज से भरी हुई। मैना ने अपनी गर्दन तिरछी की और उसकी बात ज्यों-की-त्यों उसे लौटा दी — एक-एक शब्द, हर फुंकार, और ठीक उसी लहजे में निकला, "और वो आदमी खुद को पड़ोसी कहता है!" वह खड़ा-खड़ा खुद की ही बातें सुनता रहा, और धीरे-धीरे उसके कान लाल होते गए।',
      text: 'The first neighbour gave his speech, all grievance and thunder. The myna cocked her head and gave it back to him — every word, every snort, the exact curl of "and THAT man calls himself a neighbour!" He stood there hearing himself, and his ears slowly went red.' },
    { art: ['pt_jackal', 'pt_crow'], who: null,
      hi: 'दूसरी पड़ोसन का हाल भी कुछ बेहतर न रहा। उसका अपना भाषण, जिसे मैना ने हूबहू दोहरा दिया था — उसने अब जाकर गौर किया — उसमें तीन ताने थे, पेड़ जितना बड़ा एक बतंगड़ था, और आमों के बारे में तो कोई बात ही नहीं थी। मैना अपनी चमकीली आँखों से देखती हुई इंतज़ार करती रही, दूसरों की बातों को दोहराने के अलावा वह पूरी तरह खामोश थी।',
      text: 'The second neighbour fared no better. Her own speech, returned with perfect fidelity, contained — she now noticed — three insults, one exaggeration the size of the tree itself, and nothing whatsoever about mangoes. The myna waited, bright-eyed, entirely silent except for other people\'s words.' },
    { art: ['pt_crow'], who: null,
      hi: 'अब वे करते भी क्या? खुद को सुनना बड़ी असरदार दवा साबित हुआ। उन दोनों ने पेड़ की जड़ों के आर-पार एक-दूसरे को देखा, शर्मिंदा होकर आखिरकार सच्चाई पर आ ही गए, और पूरे दस मिनट में मामला सुलझा लिया: पेड़ किसी का नहीं था और फल सबके थे, ठीक आधे-आधे बाँटे जाएँगे, और एक टोकरी जज के लिए होगी।',
      text: 'What could they do? Hearing yourself is a strong medicine. The two of them looked at each other over the roots, embarrassed into honesty at last, and settled the matter in ten minutes flat: the tree was nobody\'s and the fruit was everybody\'s, shared down the middle, with a basket for the judge.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'मैना ने अपने आम लिए और किसी और को सुनने के लिए उड़ गई। उसने एक बार भी अपनी कोई राय नहीं दी, और न ही उसे कभी ज़रूरत पड़ी। इंसाफ़ करने का आधा काम तो लोगों को खुद उनकी ही आवाज़ सुना देना होता है — बाकी का काम तो वे आमतौर पर खुद ही सँभाल लेते हैं।',
      text: 'The myna accepted her mangoes and flew off to listen to somebody else. She never once gave an opinion, and she never had to. Half of judging, it turns out, is letting people hear themselves — the rest they can usually manage on their own.' }
  ],
  moral: 'Hear yourself as others hear you, and half the quarrel settles itself.',
  source: 'A fable composed for this app around Chhattisgarh\'s state bird, the hill myna of Bastar, whose gift of perfect mimicry is natural fact. Told in the manner of the region\'s animal tales; not presented as a collected Chhattisgarhi tale, and the source says so honestly.'
},

{
  id: 'fk.agaria-first-fire',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'katha',
  title: 'The People of the First Furnace',
  hook: 'Before the tools, before the ploughs, someone had to be first to coax metal out of stone — and their descendants still greet the fire politely.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['लोहा', 'loha', 'iron'], ['आग', 'aag', 'fire'], ['भट्ठी', 'bhatthi', 'furnace']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'छत्तीसगढ़ और मध्य भारत के पहाड़ी इलाकों में अगरिया लोग रहते हैं — एक ऐसा समुदाय जिसके नाम में ही आग बसी है, क्योंकि कई भाषाओं की तरह उनकी बोली में भी \'आग\' का मतलब आग ही होता है। अनगिनत सदियों से अगरिया ही लोहा बनाने वाले रहे हैं: ऐसे लोग जो धरती से काला पत्थर निकालते हैं और कोयले, धौंकनी तथा अपनी समझ-बूझ से उसे धातु बनने के लिए मना लेते हैं।',
      text: 'Across the hill country of Chhattisgarh and central India live the Agaria — a community whose very name carries fire in it, for ag is fire in their tongue as in many. For centuries beyond reckoning, the Agaria have been the iron-makers: the people who take dark stone out of the earth and, with charcoal and bellows and knowledge, persuade it to become metal.' },
    { art: ['courtier'], who: null,
      hi: 'अगरिया लोगों की समझ में \'मनाना\' ही सही शब्द है। उनके लिए लोहा कोई बेजान चीज़ नहीं है। उनकी परंपरा मानती है कि भट्टी में लोहासुर बसते हैं — लोहे के देवता, धातु के स्वामी — और उनका आदर किए बिना लोहा गलाने का काम शुरू नहीं होता। भट्टी के सामने कोई यूँ ही बेपरवाह नहीं चला आता। पहले वहाँ रहने वाले को प्रणाम किया जाता है।',
      text: 'Persuade is the right word, in the Agaria understanding. Iron is not a dead thing to them. In the furnace, their tradition holds, dwells Lohasur — the iron spirit, the lord of the metal — and no smelting begins without honouring him first. You do not barge into a forge. You greet the one who lives there.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'जहाँ आज भी यह पुराना हुनर बचा है, वहाँ इसे देखिए: मिट्टी की एक छोटी सी भट्टी जो खड़े हुए इंसान जैसी बनाई जाती है, जिसमें कच्चे लोहे के पत्थरों और कोयले की परतें भरी होती हैं; घंटों तक एक लय में चलती बकरे की खाल की धौंकनी, जो आग के लिए साँसें भरती है; और फिर वह पल आता है — जब भट्टी खोली जाती है, और जो कभी पत्थर था, उसमें से असली लोहे का दहकता हुआ गोला बाहर निकलता है, किसी नए जन्मे जीव की तरह फुफकारता हुआ।',
      text: 'Watch the old craft, where it survives: a small clay furnace built like a standing person, packed with layers of ore and charcoal; the goat-skin bellows worked in rhythm for hours, breathing for the fire; and then the moment — the furnace opened, and out of what was stone comes a glowing sponge of real iron, hissing like something being born.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'एक अगरिया बुज़ुर्ग जब एक लड़के को धौंकनी चलाना सिखा रहे थे, तब लड़के ने उनसे पूछा कि काम शुरू करने से पहले वे हर बार आग और लोहे का धन्यवाद क्यों करते हैं, जबकि उनका परिवार दसियों हज़ार बार यह काम कर चुका है।',
      text: 'An Agaria elder, teaching a boy the bellows, was asked by him why they thank the fire and the iron before beginning, every single time, when the family has done this ten thousand times.',
      ask: {
        q: 'After ten thousand successful smeltings, why still greet Lohasur before each one?',
        options: ['In case the others were luck', 'Because the craft began as a friendship with something wild — and friendship kept carelessly is friendship lost', 'It is required by law'],
        answer: 1,
        right: '"Fire was wild before it was ours," said the elder. "Iron was stone before it agreed to be tools. The greeting is how we remember it is an agreement — and agreements are kept fresh, or they end."',
        wrong: 'No law, and no luck. "Fire was wild before it was ours," said the elder. "Iron was stone before it agreed to be tools. The greeting keeps the agreement fresh — and an agreement kept carelessly ends."'
      } },
    { art: ['courtier'], who: null,
      hi: 'और ज़रा सोचिए कि उस समझौते ने बाकी सबको क्या दिया। किसान के हल का फाल, कुल्हाड़ी, हँसिया, तीर की नोक, हाँडी की तिपाई — सदियों तक मध्य भारत के गाँव अगरिया लोहे के दम पर ही चलते रहे। गाँव के छोर पर भट्टी के पास बैठा वह शांत परिवार दुनिया का आधा काम सँभाले हुए था।',
      text: 'And think what that agreement gave everyone else. The farmer\'s ploughshare, the axe, the sickle, the arrowhead, the cooking pot\'s stand — for centuries, the villages of central India ran on Agaria iron. The quiet family at the furnace on the village edge was holding up half the world\'s work.' },
    { art: ['guard'], who: null,
      hi: 'पहली भट्टी और पहले लोहे के बारे में अगरिया लोगों की अपनी कहानियाँ बड़ी समृद्ध हैं — लोहासुर, पहले लुहारों, और आग व इंसानों के बीच हुए कड़े समझौतों से भरी हुईं। पीढ़ियों पहले विद्वानों ने इनमें से कुछ को लिख लिया था; पर समुदाय के बुज़ुर्ग ही इनके सच्चे रखवाले हैं, और जैसा कि हर जीती-जागती परंपरा में होता है, गाँव-गाँव के साथ इन कहानियों के रंग बदलते जाते हैं।',
      text: 'The Agaria\'s own tellings of the first furnace and the first iron are theirs, and they are rich — full of the iron spirit, the first smiths, and hard bargains between fire and people. Scholars wrote some of them down generations ago; the community\'s own elders remain the true keepers, and versions differ village to village, as living lore does.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'अब भारत का लोहा बड़े-बड़े कारखानों में बनता है, और मिट्टी की पुरानी भट्ठियाँ बहुत कम बची हैं। लेकिन यह हुनर कि कोई नदी किनारे की मिट्टी से भट्ठी बना ले और पत्थर में फूँक मारकर धातु निकाल ले — वह आज भी वहीं बसता है जहाँ हमेशा से था: अगरिया लोगों की यादों में, और उन हाथों में जो छोटों को दिखाने के लिए आज भी पुरानी तरह से लोहा गलाते हैं।',
      text: 'Big mills make India\'s iron now, and the old clay furnaces are few. But the knowledge that a person can build a furnace from riverbank clay and breathe stone into metal — that lives where it always lived: in Agaria memory, and in the hands of those who still demonstrate the old smelting for the young to see.' },
    { art: ['guard'], who: 'mithu',
      hi: 'तुमने आज तक जो भी औज़ार इस्तेमाल किया है, वह किसी की सुलगाई पहली आग से ही निकला है। अगरिया लोग वह बात याद रखते हैं जिसे बाकी सब भूल जाते हैं: यह सब किसी जंगली ताक़त के साथ हुए समझौते से शुरू हुआ था — और वे आज भी अपने हिस्से का शुक्रिया अदा करते हैं।',
      text: 'Every tool you have ever used descends from somebody\'s first fire. The Agaria remember what the rest of us forget: it all began as an agreement with something wild — and they still say thank you to their half of it.' }
  ],
  moral: 'Every craft began as a friendship with something wild — honour the agreement and it holds.',
  source: 'The Agaria iron-smelting communities of Chhattisgarh and central India — the clay furnaces, the bellows craft, and the honouring of Lohasur, the iron spirit of the furnace — as kept in Agaria tradition and recorded by scholars including Verrier Elwin (The Agaria, 1942). The Agaria\'s own origin tellings are theirs and vary; this telling stays within what the tradition holds and says so.'
},

{
  id: 'fk.chitrakote-sings',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'katha',
  title: 'The Waterfall That Sings',
  hook: 'In the rains it roars like a crowd; in winter it plays like a flute. The people who live beside it say the river is practising.',
  hero: 'pt_tortoise',
  cast: ['pt_tortoise', 'courtier'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['झरना', 'jharna', 'waterfall'], ['गीत', 'geet', 'song'], ['मौसम', 'mausam', 'season']],
  scenes: [
    { art: ['pt_tortoise'], who: null,
      hi: 'छत्तीसगढ़ के बस्तर में, इंद्रावती नदी घोड़े की नाल जैसी चट्टान तक पहुँचती है और एक साथ नीचे छलाँग लगा देती है। गिरते पानी की यह चादर इतनी चौड़ी है कि लोग चित्रकोट को भारत का सबसे चौड़ा झरना कहते हैं — देश का अपना छोटा नयाग्रा, जो हमेशा धुंध का दुपट्टा ओढ़े रहता है।',
      text: 'In Bastar, in Chhattisgarh, the Indravati river comes to a horseshoe-shaped cliff and steps off it, all at once, in a curtain of falling water so wide that people call Chitrakote the widest waterfall in India — the country\'s own little Niagara, wearing a permanent scarf of mist.' },
    { art: ['courtier'], who: null,
      hi: 'आस-पास के गाँवों के लोग हमेशा से इस झरने के साथ रहे हैं, और वे तुम्हें वही बात बताएँगे जो हर मुसाफ़िर को देर-सवेर समझ आती है: चित्रकोट की आवाज़ कभी एक जैसी नहीं रहती। जैसे इंसानों की आवाज़ बदलती है, वैसे ही इसके सुरों के भी मौसम होते हैं। नदी किनारे रहने वाले एक दादाजी ने अपनी पोती को इसी के बारे में यह बात बताई थी।',
      text: 'The villages of the country around have lived with the falls forever, and they will tell you what every visitor eventually notices: Chitrakote never sounds the same twice. It has seasons of voice, as a person does. This is the telling one riverside grandfather gave his granddaughter about that.' },
    { art: ['pt_tortoise', 'courtier'], who: null, mood: 'wow',
      hi: '"बरसात में," उन्होंने कहा, "वह किसी भीड़ जैसी होती है — पूरा मटमैला पानी एक साथ किनारे से गरजता हुआ गिरता है, और उसके पास अपनी बात सुनाने के लिए तुम्हें भी चिल्लाना पड़ता है। शरद में वह उजली होकर कई सुरों में गाती है। और सूखे के महीनों में वह सिमटकर चाँदी के धागों जैसी हो जाती है, और दावत के बाद बजने वाली बाँसुरी की तरह धीमे-धीमे बहती है।"',
      text: '"In the monsoon," he said, "she is a crowd — the whole brown flood shouting over the edge at once, and you must shout too, to be heard beside her. In autumn she is a choir, white and many-voiced. And in the dry months she narrows to silver threads, and plays soft, like a flute at the end of a feast."' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'बच्ची ने एक बड़ा अच्छा सवाल पूछा: "इतने सारे गाने क्यों? चट्टानें तो पूरे साल वही की वही रहती हैं।"',
      text: 'The girl asked the good question: "Why so many songs? The rocks are the same rocks all year."',
      ask: {
        q: 'Same cliff, same river — why does the waterfall sound different every season?',
        options: ['The rocks change shape', 'The river changes — how much water she carries changes her whole voice, though the cliff never moves', 'It only seems different because we change'],
        answer: 1,
        right: '"The cliff is her instrument," said her grandfather. "She is the player. Full of the monsoon she plays it thundering; lean in summer she plays it sweet. Same sitar — different song, depending what the player carries."',
        wrong: 'The rocks hold still for centuries — and the change is real, not imagined; you can measure it. "The cliff is her instrument," said her grandfather. "The river is the player. What she carries decides the song."'
      } },
    { art: ['pt_tortoise'], who: null,
      hi: '"लोग भी बिल्कुल ऐसे ही होते हैं," बूढ़े दादाजी ने बात आगे बढ़ाई, क्योंकि दादाजी लोग झरने का मौका कभी खाली नहीं जाने देते। "शोरगुल के मौसम, खामोश मौसम, भरे-पूरे साल और तंगी के दिन — और इन सब के पीछे इंसान वही का वही। किसी के शांत महीने को उसका पूरा संगीत समझने की भूल मत करना।"',
      text: '"People are the same," the old man added, since a grandfather never wastes a waterfall. "Loud seasons, soft seasons, full years and lean ones — and the same person underneath all of it. Do not mistake somebody\'s quiet month for their whole music."' },
    { art: ['courtier', 'pt_tortoise'], who: null,
      hi: 'इंद्रावती बस्तर की सबसे बड़ी नदी है — अपने पूरे रास्ते में बसे लोगों को खेत और मछलियाँ देने वाली — और यह झरना उसका सबसे भव्य रूप है। पूर्णिमा की रातों में झरने के ऊपर उठती धुंध चांदी जैसी चमकने लगती है, और नीचे के कुंड चाँद को किसी सिक्के की तरह संभाल लेते हैं, और किसी को भी घर लौटने की जल्दी नहीं होती।',
      text: 'The Indravati is Bastar\'s great river — the giver of fields and fish for the communities along her whole length — and the falls are her grandest public appearance. On full-moon nights the mist over the drop goes silver, and the pools below hold the moon like a coin, and nobody hurries home.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'अब दुनिया भर से मुसाफ़िर कैमरे लिए आते हैं, और गाँव वाले उन्हें चाय बेचते हैं और एक-एक करके उन्हें वही राज़ पाते देखते हैं जो बस्तर हमेशा से जानता था: चित्रकूट की सिर्फ़ तस्वीर नहीं उतारी जा सकती। आप उसकी फुहारों में खड़े होते हैं, और वह जिस भी मौसम का गीत साध रही हो उसे गाने देते हैं, और बदले में वही अपने साथ घर ले जाते हैं।',
      text: 'Travellers come now from across the world with cameras, and the villages sell them tea and watch them discover, one by one, what Bastar always knew: you do not really photograph Chitrakote. You stand in the spray and let her sing whichever season\'s song she is practising, and you take that home instead.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'एक नदी, कई आवाज़ें, और इन सबके भीतर एक ही वजूद — किसी गायक की तरह, किसी परिवार की तरह, या साल भर बदलते तुम्हारे अपने रूप की तरह। जब से इंद्रावती बह रही है, यह झरना मुफ्त में यही सिखाता आ रहा है।',
      text: 'One river, many voices, one self underneath — like a singer, like a family, like you across a year. The falls have been teaching it free of charge for as long as the Indravati has run.' }
  ],
  moral: 'The same heart sings differently by season — judge no one by a single month\'s song.',
  source: 'Chitrakote Falls on the Indravati river in Bastar, Chhattisgarh — its horseshoe cliff, its dramatic seasonal changes of flow and sound — is real and much loved. This grandfather\'s telling is composed for this app in the riverside manner of the region, and the source says so honestly.'
},

{
  id: 'fk.danteshwari-bastar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'heart-lands',
  badge: 'katha',
  title: 'The Goddess Who Walked Behind',
  hook: 'The goddess made the king one promise: I will follow you into the new land — walk ahead, listen for my anklets, and do not look back.',
  hero: 'durga',
  cast: ['durga', 'guard'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['देवी', 'devi', 'goddess'], ['पायल', 'paayal', 'anklets'], ['संगम', 'sangam', 'river-meeting']],
  scenes: [
    { art: ['durga'], who: null,
      hi: 'दक्षिणी छत्तीसगढ़ के विशाल जंगलों की धरती बस्तर की एक माँ हैं: दंतेश्वरी। इस इलाके का हर समुदाय — गाँव और शहर, जंगल और खेत — उन्हें इस धरती की अपनी देवी मानकर पूजता है, और उनका मुख्य मंदिर दंतेवाड़ा में है, जहाँ दो नदियाँ मिलती हैं। यह उनके आगमन की कथा है, ठीक वैसी ही जैसी बस्तर में सुनाई जाती है।',
      text: 'Bastar, the great forest land of southern Chhattisgarh, has a mother: Danteshwari. Every community of the region — village and town, forest and field — honours her as the land\'s own goddess, and her chief temple stands at Dantewada, where two rivers meet. This is the katha of how she came, told as Bastar tells it.' },
    { art: ['guard'], who: null,
      hi: 'कहा जाता है कि बहुत समय पहले, अन्नमदेव नाम के एक राजा अपना पुराना राज्य छोड़कर दक्षिण के जंगलों में एक नया राज्य बसाने जा रहे थे। रवाना होने से पहले, उन्होंने उसी देवी की प्रार्थना की जिनकी सेवा उनका परिवार हमेशा से करता आया था — और देवी ने उन्हें एक वचन दिया, और साथ में एक शर्त भी, और देवियों के वचन आम तौर पर ऐसे ही मिला करते हैं।',
      text: 'Long ago, the telling goes, a king called Annamdeva was leaving his old kingdom to found a new one in the southern forests. Before he set out, he prayed to the goddess his family had always served — and she gave him a promise, and a condition, which is how promises from goddesses usually arrive.' },
    { art: ['durga', 'guard'], who: 'durga',
      hi: '"मैं आपके साथ चलूँगी," उन्होंने कहा। "मैं आपके पीछे-पीछे चलूँगी, और जहाँ-जहाँ मेरे क़दम पड़ेंगे, वहीं आपका राज्य होगा। आप मुझे देख नहीं पाएँगे — लेकिन हर क़दम पर, अपने पीछे आपको मेरी पायलों की आवाज़ सुनाई देगी। आगे बढ़ते रहिए, और उस आवाज़ पर भरोसा रखिए। और पीछे मुड़कर मुझे मत देखिएगा। बस यही एक शर्त है।"',
      text: '"I will come with you," she said. "I will walk behind you, and where my feet go, your kingdom will be. You will not see me — but you will hear my anklets at your back, every step. Walk ahead, and trust the sound. And do not look back at me. That is the whole of the condition."' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'तो राजा कई दिनों तक दक्षिण की ओर चलते रहे, जंगलों और पहाड़ियों को पार करते हुए — और उनके पीछे-पीछे हमेशा, छम, छम, पायलों की वही चाँदी जैसी आवाज़ गूँजती रही, उनकी अपनी दिल की धड़कन की तरह नियमित। जब तक कि वे उस जगह नहीं पहुँच गए जहाँ दो नदियाँ मिलती हैं, और जैसे ही उन्होंने उथले पानी में क़दम रखा — वह आवाज़ थम गई।',
      text: 'So the king walked south, day upon day, through forests and over hills — and always behind him, chham, chham, the silver sound of the anklets, steady as his own heartbeat. Until he came to a place where two rivers meet, and crossed into the shallows, and there — the sound stopped.',
      ask: {
        q: 'The anklets have gone silent behind him. What should the king do?',
        options: ['Keep walking and trust her — sand and water can silence any anklet', 'Look back — he must know if she is still there', 'Stop and wait without turning'],
        answer: 0,
        right: 'That is the harder, wiser road — in soft sand and running water, anklets go quiet though the feet still follow. But the king was human: his heart lurched, and he turned.',
        wrong: 'The king chose as you might — he turned to look. And there she stood in the river-crossing, real as morning: it was only the water and sand that had silenced the anklets. She had never stopped following.'
      } },
    { art: ['durga'], who: null,
      hi: 'शर्त टूट चुकी थी, और देवी वहीं रुक गईं जहाँ राजा की नज़र उन पर पड़ी थी। "यहाँ तक मैं चलकर आई," उन्होंने कहा, "और इतना ही बहुत है। यहाँ, जहाँ नदियाँ मिलती हैं, मैं यहीं रहूँगी — और यहीं से मैं आपकी पूरी धरती को सँभालूँगी।" कहानी सुनाने वाले ज़ोर देकर कहते हैं कि इसमें ज़रा भी ग़ुस्सा नहीं था। देवी तो किसी टूटी हुई शर्त को भी एक सुंदर आशीर्वाद में बदल देती हैं।',
      text: 'The condition was broken, and the goddess stayed where his glance had found her. "This far I have walked," she said, "and this far is enough. Here, where the rivers meet, I remain — and from here I will hold your whole land." There was no anger in it, the tellers insist. A goddess turns even a broken condition into a blessing with a good address.' },
    { art: ['guard', 'durga'], who: null, mood: 'wow',
      hi: 'और इसीलिए दंतेश्वरी का मंदिर आज भी दंतेवाड़ा में, शंखिनी और डंकिनी नाम की नदियों के संगम पर शान से खड़ा है, ठीक उसी जगह जहाँ पायलें ख़ामोश हुई थीं — और उस नगर का नाम भी उन्हीं के नाम पर पड़ा। राजा ने अपना राज्य उन्हीं के इर्द-गिर्द बसाया, और शुरू से उस वचन का यही तो असली मतलब था।',
      text: 'And so the temple of Danteshwari stands to this day at Dantewada, at the meeting of the rivers called Shankhini and Dankini, on the very spot where the anklets fell silent — and the town itself bears her name. The king built his kingdom around her, which is what the promise had meant all along.' },
    { art: ['durga'], who: null,
      hi: 'हर साल बस्तर दशहरे के पचहत्तर दिनों के महापर्व पर, दंतेश्वरी को पूरे आदर के साथ जगदलपुर लाया जाता है, और पूरा बस्तर उनके पास जुटता है। उस धरती का यह सबसे भव्य उत्सव उसी देवी के चारों ओर घूमता है, जो कभी अपने पैरों में चाँदी की पायलें पहने एक राजा के पीछे चली थीं।',
      text: 'Each year at Bastar Dussehra, the great seventy-five-day festival, Danteshwari is brought with honour to Jagdalpur, and all Bastar gathers to her. The whole festival, grandest in the land, turns around the goddess who once walked behind a king with silver at her ankles.' },
    { art: ['durga'], who: 'mithu',
      hi: 'बस्तर के कई परिवारों में यह कथा विश्वास के एक मीठे से सबक के साथ पूरी होती है: कुछ वादे आपसे सिर्फ़ एक आवाज़ के भरोसे चलते रहने की माँग करते हैं। और जब विश्वास डगमगा भी गया — ज़रा सुनिए — तब भी देवी वहीं रहीं। वे आज भी उसी संगम पर विराजमान हैं।',
      text: 'In many Bastar families the katha ends with a gentle word about trust: some promises ask you to keep walking on the strength of a sound. And even when trust stumbles — listen — the goddess stayed anyway. She is there at the sangam still.' }
  ],
  moral: 'Some promises ask you to walk on trust — and even a stumble can end in a blessing, where there is love.',
  source: 'The founding katha of the Danteshwari temple at Dantewada, Chhattisgarh — the goddess following king Annamdeva by the sound of her anklets, the silence at the river-crossing of the Shankhini and Dankini, and the backward glance — as the tradition of Bastar tells it. The temple, and Danteshwari\'s presiding place in Bastar Dussehra, are living fact; the katha is presented from the inside, as it is told.'
}
];

/* Shelf registry, merged by allCollections() alongside the other story files. */
window.IND_COLLECTIONS_WEST = [
  { id: 'coast-forest', name: 'The Coast and the Forest', note: 'Warli country, the Daman shore and Goa — Dadra & Nagar Haveli and Daman & Diu lit at last.', avatar: 'pt_crocodile' },
  { id: 'west-lands',   name: 'The Western Lands',        note: 'Maharashtra, Gujarat and Rajasthan — mothers, milkmaids, lions, stepwells and one very reliable camel.', avatar: 'pt_lion' },
  { id: 'heart-lands',  name: 'The Heart of the Land',    note: 'Madhya Pradesh and Chhattisgarh — the mahua, the boy who spoke tiger, and the epic that is sung standing up.', avatar: 'tansen' }
];
