/* Bizzing India — northern story content (fourth tranche).

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js,
   on its own global (IND_STORIES_NORTH) so all four sets can be loaded and merged
   independently. NOTE: app.js does not yet concat this global — wire it in when
   this tranche ships.

   This file brings every northern state and UT to at least eight stories:
   Delhi and Chandigarh from zero, plus Himachal, J&K, Haryana, Punjab and
   Uttarakhand. It is also the first file to use all three badges:

     katha    — a story as it is told. Sources name the tradition honestly.
     itihaas  — what evidence shows. Real people, kept to what is well attested,
                sourced, with no invented dates or quotations.
     aaj      — how a place lives today. Chandigarh is the honest test case:
                the city is new and its stories are modern, and the sources
                say so instead of pretending otherwise.

   Softening notes (docs/05, and the age band): Himal and Nagrai keeps only the
   gentle first movement of a long, sad Kashmiri romance; Dulla Bhatti's end is
   not part of the children's song and is not told; the Vipasha telling holds
   the sage's grief at a distance a child can stand. Each says so in `source`.

   needs_review: the Chandigarh founding story touches Partition in one gentle
   sentence and is flagged for a named human reviewer per policy — do not
   publish it directly.

   Sikh material note: no Guru is depicted or cast anywhere in this file, in
   art or otherwise. Dulla Bhatti is a Punjabi-Muslim folk hero and is told
   with warmth, from inside the Lohri tradition that sings him.

   Scene fields: art (avatar ids), who (speaker id, 'mithu' the teller, or null),
   text, mood (think|wow|sad), optional ask { q, options[], answer, right, wrong }.
*/

window.IND_STORIES_NORTH = [

/* ============================================================== DILLI ====== */

{
  id: 'fk.seven-cities',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'aaj',
  title: 'The City Made of Cities',
  hook: 'Ask Delhi how old it is and it will not give you one answer. It will give you at least seven.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'royal_elephant'],
  minutes: 4,
  place: ['IN-DL'],
  words_hi: [['शहर', 'shehar', 'city'], ['पुराना', 'purana', 'old'], ['दिल', 'dil', 'heart']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दिल्ली की एक बच्ची ने अपने दादाजी से एक सीधा-सा सवाल पूछा — हमारा शहर कितना पुराना है? — और जवाब देने के बजाय, उन्होंने टहलने वाले जूते पहन लिए। "दिल्ली कोई एक शहर नहीं है," उन्होंने कहा। "यह शहरों का एक ढेर है। आओ, इन्हें गिनते हैं।"',
      text: 'A girl in Delhi asked her grandfather a simple question — how old is our city? — and instead of answering, he put on his walking shoes. "Delhi is not one city," he said. "It is a pile of cities. Come and count them."' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'उन्होंने महरौली में शुरुआत की, क़ुतुब मीनार की तलहटी से, जो मीनार इतनी ऊँची थी कि उसकी चोटी देखने के लिए बच्ची को अपना दुपट्टा संभालना पड़ा। "पहला शहर," दादाजी ने कहा। "जब बस इतना ही था, तब राजा यहीं से राज करते थे।"',
      text: 'They started in Mehrauli, at the foot of the Qutb Minar, a tower so tall she had to hold her dupatta to look at the top of it. "City one," said her grandfather. "Kings ruled from here when this was all there was."' },
    { art: ['courtier'], who: null,
      hi: 'फिर सीरी, जहाँ पुरानी दीवारें अब चुपचाप पार्कों से होकर और घरों के पास से गुज़रती हैं। फिर तुग़लक़ाबाद, इतना बड़ा और पथरीला क़िला कि लगता है जैसे किसी पहाड़ ने इमारत बनने का फ़ैसला कर लिया हो। दूसरा शहर। तीसरा शहर।',
      text: 'Then Siri, where the old walls now wander through parks and past houses, minding their own business. Then Tughlaqabad, a fort so huge and stony it looks like a mountain that decided to become a building. City two. City three.' },
    { art: ['guard'], who: null,
      hi: 'जहाँपनाह, जिसके नाम का मतलब है दुनिया की पनाह, जिसने दो शहरों को समेटकर एक कर दिया। फ़िरोज़ाबाद, जहाँ फ़िरोज़ शाह का कोटला आज भी क्रिकेट के मैदान के पास खड़ा है, ताकि एक बहुत पुराना शहर और एक बहुत शोरगुल वाला शहर एक ही दीवार साझा कर सकें। चार। पाँच।',
      text: 'Jahanpanah, whose name means the Refuge of the World, folded two cities into one. Firozabad, where Firoz Shah\'s kotla still stands by the cricket ground, so that a very old city and a very loud one share a wall. Four. Five.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: 'पुराना क़िला पर — छठा शहर — बच्ची रुक गई। "लेकिन असली दिल्ली कौन-सी है?" उसने पूछा। दादाजी ऐसे मुस्कुराए जैसे कोई पूरे दिन से इसी सवाल का इंतज़ार कर रहा हो।',
      text: 'At the Purana Qila — the Old Fort, city six — the girl stopped. "But which one is the real Delhi?" she asked. Her grandfather smiled the smile of a man who has been waiting all day for a question.',
      ask: {
        q: 'Seven cities, one name. Which one is the real Delhi?',
        options: ['The oldest one', 'The newest one', 'All of them at once'],
        answer: 2,
        right: 'That is exactly what he said. "You are standing on all of them at once. That is what Delhi is."',
        wrong: 'Her grandfather shook his head. "All of them at once. You are standing on every one of them right now. That is what Delhi is."'
      } },
    { art: ['royal_elephant', 'courtier'], who: null, mood: 'wow',
      hi: 'सातवाँ शहर था शाहजहानाबाद — लाल क़िला जिसकी दीवारें शाम के रंग जैसी हैं, जामा मस्जिद जिसकी सीढ़ियाँ कबूतरों से भरी हैं, और पुरानी दिल्ली की ऐसी चहल-पहल से भरी तंग गलियाँ कि हवा में भी खाने की ख़ुशबू महकती है।',
      text: 'City seven was Shahjahanabad — the Red Fort with its walls the colour of evening, the Jama Masjid with its steps full of pigeons, and the lanes of Old Delhi packed so tight with life that the air itself smells of food.' },
    { art: ['courtier'], who: 'guard',
      hi: '“और फिर अंग्रेज़ों ने नई दिल्ली बनाई, यानी आठ शहर, और तब से हर कोई कुछ न कुछ बनाता ही जा रहा है, यानी कुल मिलाकर—” उसके दादाजी ने पूरे क्षितिज की तरफ़ हाथ घुमाया “—सच कहूँ तो मेरी तो गिनती ही छूट गई है।”',
      text: '"And then the British built New Delhi, which makes eight, and everyone since has kept building, which makes — " her grandfather waved his hand at the whole horizon " — I have honestly lost count."' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'घर लौटती बस में उसने बाहर देखा—मकबरों के ऊपर खड़े फ़्लाईओवर, पुराने दरवाज़ों के पास से सरकती मेट्रो ट्रेनें, और उस दीवार के आगे क्रिकेट खेलते बच्चे जिसने कभी सुल्तानों को आते-जाते देखा था।',
      text: 'On the bus home she looked out at flyovers standing over tombs, and metro trains sliding past old gateways, and children playing cricket against a wall that had watched sultans go by.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'उस सैर में मिलने वाला हर शहर आज भी वहीं है, और तुम आज भी वह सैर कर सकते हो। दिल्ली कभी किसी शहर को फेंकती नहीं है। वह तो बस उसके पास ही अगला शहर बना देती है, और उन सबको आपस में बातें करने देती है।',
      text: 'Every city on that walk is still there, and you can still do the walk. Delhi never throws a city away. It just builds the next one alongside, and lets them all keep talking.' }
  ],
  moral: 'Some places grow old by staying the same. Delhi grew old by becoming somewhere new, again and again, without ever leaving.',
  source: 'The "seven cities of Delhi" — Mehrauli, Siri, Tughlaqabad, Jahanpanah, Firozabad, Dinpanah/Shergarh and Shahjahanabad — a way Delhi has described itself for generations. All of these places stand and can be visited today.'
},

{
  id: 'fk.iron-pillar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'katha',
  title: 'The Nail That Came Loose',
  hook: 'There is an iron pillar in Delhi that has stood for over a thousand years without rusting. The old story says it was never meant to be pulled up. Somebody pulled it up.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-DL'],
  words_hi: [['लोहा', 'loha', 'iron'], ['कील', 'keel', 'nail'], ['साँप', 'saanp', 'snake']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दिल्ली के क़ुतुब परिसर के आँगन में लोहे का एक खंभा खड़ा है, चार आदमियों से भी ऊँचा, अपने आस-पास की लगभग हर चीज़ से पुराना। पंद्रह सौ से भी ज़्यादा सालों से इस पर बारिश बरस रही है। इस पर कभी ज़ंग नहीं लगा। वैज्ञानिक आज भी यह समझने आते हैं कि ऐसा क्यों है।',
      text: 'In the courtyard of the Qutb complex in Delhi stands an iron pillar, taller than four men, older than almost anything around it. Rain has fallen on it for more than fifteen hundred years. It has never rusted. Scientists still come to study why.' },
    { art: ['courtier'], who: null,
      hi: 'इतनी बात तो सच है और तुम जाकर इसे देख भी सकते हो। लेकिन दिल्ली इस खंभे के बारे में एक और भी पुरानी कहानी सुनाती है—कि इसे वहाँ क्यों लगाया गया था, और तब क्या हुआ जब एक राजा के मन में उत्सुकता जागी।',
      text: 'That much is true and you can go and see it. But Delhi tells an older story about that pillar — about why it was put there, and what happened when a king got curious.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'कहते हैं कि यह खंभा ज़मीन में एक बड़ी कील की तरह गाड़ा गया था, और नीचे बहुत गहराई में, किसी भी कुएँ से भी गहरे, यह दुनिया को थामने वाले नागराज वासुकि के सिर पर टिका था। “जब तक यह कील खड़ी रहेगी,” ज्ञानियों ने राजा से कहा, “तब तक आपका राजसिंहासन टिका रहेगा।”',
      text: 'They say the pillar was driven into the earth like a great nail, and that far below, deeper than any well, it rested on the head of Vasuki, the king of the serpents who holds the world steady. "As long as the nail stands," the wise men told the king, "your throne stands."' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'राजा अनंगपाल थे, और अनंगपाल का स्वभाव ऐसा था कि वे किसी बात को बिना छेड़े नहीं रह सकते थे। एक कील। एक नाग के सिर पर। उनके अपने ही आँगन के नीचे। नाश्ते के वक़्त वे उसी के बारे में सोचते। दरबार में भी उसी के बारे में सोचते। और रात को जब नींद न आती, तो बिस्तर पर लेटे-लेटे भी उसी के बारे में सोचते।',
      text: 'The king was Anangpal, and Anangpal had the kind of mind that cannot leave a thing alone. A nail. On a serpent\'s head. Under his own courtyard. He thought about it at breakfast. He thought about it at durbar. He thought about it lying awake at night.',
      ask: {
        q: 'The wise men say: whatever you do, do not pull up the nail. What does the king do?',
        options: ['Leaves it alone forever', 'Posts guards so nobody touches it', 'Pulls it up, just to check'],
        answer: 2,
        right: 'Of course he did. There has never been a king in any story who was told "do not" and did not.',
        wrong: 'A sensible answer — but this is a story about a king, and kings in stories are never sensible. He had it pulled up, just to check.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'इसलिए एक सुबह उन्होंने हुक्म दे ही दिया। वह खंभा ज़मीन से बाहर निकाला गया — और कहते हैं कि उसका निचला सिरा गहरे लाल रंग से रंगा हुआ था, किसी ऐसी चीज़ से जो बहुत-बहुत नीचे से आई थी, इतनी गहराई से जहाँ कोई खुदाई कभी नहीं पहुँच पाती।',
      text: 'So one morning he ordered it done. The pillar came up out of the ground — and the end of it, they say, was stained deep red, with something from far, far below, from a depth no digging ever reaches.' },
    { art: ['guard'], who: 'guard', mood: 'sad',
      hi: 'विद्वानों ने अपने चेहरे ढक लिए। "इसे वापस लगा दो," उन्होंने कहा। और उसी घड़ी, पूजा-पाठ के साथ उसे वापस गाड़ दिया गया। लेकिन जो कील एक बार उखड़ जाए, वह फिर कभी मज़बूती से नहीं बैठती। वह खड़ा तो रहा — पर ढीला ही रहा। ढिल्ली।',
      text: 'The wise men covered their faces. "Put it back," they said. And it was put back, that same hour, with prayers. But a nail that has once been pulled never again sits tight. It stood — but it stood loose. Dhilli.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और लोग तुकबंदी में कहने लगे, जिसे दिल्ली आज भी याद रखती है: \'किल्ली तो ढिल्ली भई\' — यानी कील ढीली हो गई। कुछ लोग कहते हैं कि शहर का नाम यहीं से पड़ा। ढिल्ली। डिल्ली। दिल्ली। ढीली कील का शहर।',
      text: 'And people began to say it in a rhyme that Delhi still remembers: killi to dhilli bhai — the nail has come loose. Some say that is where the city\'s name comes from. Dhilli. Dilli. Delhi. The city of the loosened nail.' },
    { art: ['guard'], who: null,
      hi: 'कहानी कहती है कि इसके बाद अनंगपाल का वंश ज़्यादा समय तक राजगद्दी पर नहीं टिका, और हज़ार साल तक दिल्ली का तख़्त बदलता ही रहा — मानो यह शहर खुद ही थोड़ा ढीला पड़ गया हो, और फिर कभी पूरी तरह जम ही न पाया हो।',
      text: 'Anangpal\'s line did not keep the throne long after that, says the story, and thrones in Delhi kept changing hands for a thousand years — as if the city itself had come a little loose, and never quite settled again.' },
    { art: ['guard'], who: 'mithu',
      hi: 'वह खंभा सचमुच का है, और आज भी आप उसके सामने खड़े हो सकते हैं। पहले लोग अच्छी क़िस्मत के लिए अपनी पीठ के पीछे हाथ ले जाकर उसे घेरते थे, जब तक कि उसकी हिफ़ाज़त के लिए चारों तरफ़ घेरा नहीं लगा दिया गया। वह नाग, वह राजा और वह कहावत — ये सब दिल्ली की अपनी बातें हैं। और दिल्ली इन्हें सुनाती है।',
      text: 'The pillar is real, and you can stand in front of it today. People used to clasp their hands behind their backs around it for luck, until a fence went up to protect it. The serpent, the king and the rhyme — those are Delhi\'s to tell. And Delhi tells them.' }
  ],
  moral: 'Some things hold the world steady precisely because nobody checks how.',
  source: 'The legend of Anangpal Tomar and the loose nail — killi to dhilli — an old Delhi tradition told to explain the city\'s name. The iron pillar itself is real: a Gupta-period pillar, over 1,500 years old, standing in the Qutb complex, famous for resisting rust. The serpent and the rhyme are legend, and told here as legend.'
},

{
  id: 'it.razia-sultan',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'itihaas',
  title: 'The Ruler Nobody Expected',
  hook: 'Almost eight hundred years ago, the throne of Delhi went to the one child nobody powerful wanted it to go to. She took it anyway, and she was good at it.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'royal_elephant'],
  minutes: 4,
  place: ['IN-DL'],
  words_hi: [['सिक्का', 'sikka', 'coin'], ['बेटी', 'beti', 'daughter'], ['हिम्मत', 'himmat', 'courage']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'लगभग आठ सौ साल पहले, दिल्ली पर सुल्तान इल्तुतमिश का राज था। उनके कई बेटे थे और एक बेटी थी—रज़िया। बेटे तो राजकुमार थे और राजकुमारों की तरह ही रहते थे। पर रज़िया अपने पिता के पास बैठकर उन्हें काम करते देखती और समझती कि असल में राज कैसे चलाया जाता है।',
      text: 'Almost eight hundred years ago, Delhi was ruled by Sultan Iltutmish, who had many sons and one daughter, Razia. The sons were princes and behaved like it. Razia sat with her father while he worked, and watched how a kingdom is actually run.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उसने घुड़सवारी सीखी, अगुआई करना सीखा और राजकाज के कागज़ात पढ़ना सीखा। और इल्तुतमिश ने एक ऐसी बात देखी जिसे उस ज़माने के इतिहासकारों ने भी लिखा: उनके सब बच्चों में, एक शासक जैसी समझ सिर्फ़ इस बेटी के पास ही थी।',
      text: 'She learned to ride, to lead, to read the papers of state. And Iltutmish noticed something that the chroniclers of the time wrote down: of all his children, the one with a ruler\'s head on her shoulders was the daughter.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      hi: 'इसलिए उन्होंने वह किया जो दिल्ली के किसी सुल्तान ने पहले कभी नहीं किया था। उन्होंने अपने बाद राज संभालने के लिए रज़िया को चुना। दरबारी सन्न रह गए। "एक बेटी? जबकि बेटे मौजूद हैं!" पुरानी किताबों में उनका जवाब दर्ज है: मेरे बेटे तो ऐश-ओ-आराम में खोए हैं। यह अकेली उन सब पर भारी है।',
      text: 'So he did something no Sultan of Delhi had done. He named Razia as the one fit to rule after him. The nobles were horrified. "A daughter? There are sons!" The old chronicle records his answer: my sons are lost in their pleasures. She is worth more than all of them.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'जब इल्तुतमिश चल बसे, तो दरबारियों ने उनकी बात नहीं मानी और एक बेटे को गद्दी पर बिठा ही दिया। बहुत जल्द सब कुछ बिगड़ने लगा। और साल भर के भीतर ही दिल्ली—वहाँ के दरबारी, वहाँ की फ़ौज और वहाँ की जनता—आख़िरकार उस बेटी के पास ही आई।',
      text: 'When Iltutmish died, the nobles ignored his wish and crowned a son anyway. It went badly, fast. And within a year, Delhi — its nobles, its army, its people — turned to the daughter after all.',
      ask: {
        q: 'The throne the nobles refused her is now offered to her, with all its troubles attached. What does Razia do?',
        options: ['Refuse — they did not want her before', 'Take it, and rule properly', 'Take it, but let the nobles decide everything'],
        answer: 1,
        right: 'She took it — and she ruled. Not as anyone\'s puppet, and not to prove a point. To do the job.',
        wrong: 'She took the throne, and she took the whole job with it — not as anyone\'s puppet, and not just to prove a point.'
      } },
    { art: ['courtier', 'royal_elephant'], who: null,
      hi: 'उसने खुद को सुल्तान कहलवाया, सुल्ताना नहीं—सुल्ताना तो किसी सुल्तान की पत्नी होती, और वह किसी की पत्नी नहीं, खुद हुक्मरान थी। उसके नाम के सिक्के ढाले गए। कुछ सिक्के आज भी बचे हुए हैं। तुम किसी म्यूज़ियम में ऐसा सिक्का देख सकते हो और उस पर उसका नाम पढ़ सकते हो।',
      text: 'She called herself Sultan, not Sultana — a queen was a king\'s wife, and she was nobody\'s wife; she was the ruler. Coins were struck with her name on them. Some of those coins still exist. You can see one in a museum and read her name on it.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'उसने पर्दा छोड़ दिया और सुल्तान का चोगा पहनकर, हाथी पर सवार होकर खुलेआम अपनी फ़ौज के आगे चली, ताकि उसके सैनिक और उसकी प्रजा साफ़ देख सकें कि उनकी अगुआई कौन कर रहा है। वह खुद लोगों की फ़रियादें सुनती थी। उसने अपने अफ़सर भी खुद चुने, सिर्फ़ उनकी काबिलियत देखकर।',
      text: 'She gave up the veil and rode openly at the head of her army on an elephant, dressed in a ruler\'s coat, so her soldiers and her people could see exactly who was leading them. She heard petitions herself. She appointed her own officers, on ability.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'यह राज तीन-चार साल तक ही चला। उनके आसपास के कुछ ताकतवर लोगों के लिए यह बात बर्दाश्त से बाहर थी, जो किसी हुक्मरान की हर बात माफ कर सकते थे, सिवाय इसके कि वह उनसे बेहतर काम करे। वे उनके खिलाफ खड़े हो गए, और उनसे उनका राज छीन लिया गया।',
      text: 'It lasted between three and four years. That was too much for some of the powerful men around her, who could forgive a ruler almost anything except being better at the job than they were. They rose against her, and her rule was taken from her.' },
    { art: ['courtier'], who: null,
      hi: 'उस दौर के इतिहासकार मिन्हाज ने उनके बारे में साफ-साफ लिखा था: वे एक समझदार और इंसाफपसंद हुक्मरान थीं, जिनमें बादशाहों वाले सारे गुण थे — और फिर उन्होंने उदास होकर लिखा कि उस ज़माने के मर्दों की नज़र में, उनका औरत होना ही बाकी सब बातों पर भारी पड़ गया।',
      text: 'The chronicler Minhaj, who lived in those times, wrote of her plainly: she was a wise and just ruler, with every kingly quality — and then he added, sadly, that in the eyes of the men of her age, being a woman outweighed all of it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'सदियों तक दिल्ली के तख्त पर बैठने वाली वे इकलौती महिला रहीं। किसी को उनसे यह उम्मीद नहीं थी। उनके पिता को थी। और तीन साल से भी ज़्यादा वक्त तक, दिल्ली ने देखा कि उनके पिता बिल्कुल सही थे।',
      text: 'For centuries she was the only woman ever to sit on the throne of Delhi. Nobody expected her. Her father did. And for three years and more, Delhi found out he had been right.' }
  ],
  moral: 'The person fit to lead is not always the person everyone expects — and everyone expecting otherwise does not change who is fit.',
  source: 'Razia Sultan ruled Delhi c. 1236–1240 CE. The contemporary chronicle Tabaqat-i-Nasiri of Minhaj-i-Siraj records her father\'s preference for her, her open rule, and its judgement of her qualities; coins in her name survive. Her defeat is history; the details of her end are disputed and are not told here.'
},

{
  id: 'fk.chandni-chowk',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'katha',
  title: 'The Square of Moonlight',
  hook: 'The busiest, loudest market in Delhi is named after the quietest thing there is: moonlight on water.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-DL'],
  words_hi: [['चाँदनी', 'chandni', 'moonlight'], ['बाज़ार', 'bazaar', 'market'], ['नहर', 'nahar', 'canal']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब शाहजहाँ ने अपना नया शहर शाहजहानाबाद बसाया — लाल किला, बड़ी मस्जिद और शहरपनाह — तो वहाँ का सबसे शानदार नया बाज़ार बादशाह ने बिल्कुल नहीं बनाया था। उसे उनकी बेटी, जहाँआरा बेगम ने तैयार किया था।',
      text: 'When Shah Jahan built his new city of Shahjahanabad — the Red Fort, the great mosque, the walls — the finest new bazaar in it was not designed by the emperor at all. It was designed by his daughter, Jahanara Begum.' },
    { art: ['courtier'], who: null,
      hi: 'इमारतों को सजाने-संवारने में जहाँआरा का हुनर वैसा ही था, जैसा कुछ लोगों का संगीत में होता है। उन्होंने किले से निकलती दुकानों की एक लंबी, चौड़ी सड़क बनाई, जिसके बीच में एक हौज था, और — सबसे खास बात तो यह थी कि — पूरी सड़क के ठीक बीचों-बीच साफ पानी की एक नहर बहती थी।',
      text: 'Jahanara was clever with buildings the way some people are clever with music. She laid out a long, wide street of shops leading from the fort, with a pool at its centre, and — this was the touch — a canal of clear water running straight down the middle of the whole street.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'दिन में यह नहर सड़क को ठंडा रखती और पेड़ों को पानी देती। लेकिन यह कहानी तो रात की है। कहते हैं कि पूनम की रातों में, पानी चाँद को थाम लेता और झिलमिलाते हुए पूरे बाज़ार में बहा ले जाता — बंद दुकानों के बीच बहती चाँदी की रोशनी की एक लंबी लकीर।',
      text: 'By day the canal cooled the street and watered the trees. But the story is about the night. On full-moon nights, they say, the water caught the moon and carried it, shimmering, down the entire length of the bazaar — one long ribbon of silver light between the shuttered shops.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और इस तरह लोगों ने उस सड़क को वही एक नाम दिया जो उस पर जँचता था: चाँदनी चौक। यानी चाँदनी का चौक।',
      text: 'And so people gave the street the only name that would do: Chandni Chowk. The moonlight square.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'वह नहर तो कब की गायब हो चुकी है — उसे पाट दिया गया, उस पर इमारतें बन गईं, और वह बस नाम में ही याद रह गई है। इससे एक पहेली बनती है: उस सड़क पर बहुत लंबे समय से चाँदनी नहीं दिखी है। तो क्या वह नाम भी चले जाना चाहिए था?',
      text: 'The canal is long gone — filled in, built over, remembered only in the name. Which leaves a puzzle: the moonlight has not been seen on that street for a very long time. Should the name have gone too?',
      ask: {
        q: 'The canal vanished more than a century ago. Why does Delhi still call it Chandni Chowk?',
        options: ['Nobody got around to changing it', 'The name keeps the memory the street lost', 'It is short and easy to say'],
        answer: 1,
        right: 'That is what a name like this is for. The street forgot its canal; the name refuses to.',
        wrong: 'Delhi does not keep names by accident. The street forgot its canal — the name is how it refuses to forget completely.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'आज चाँदनी चौक भारत की सबसे भीड़-भाड़ वाली जगहों में से एक है — रिक्शे, शादी के लहँगों की दुकानें, सिर के ऊपर आसमान जितने बड़े चिड़िया के घोंसले जैसे उलझे तार, और तरह-तरह का खाना: एक गली में जलेबियाँ, तो एक पूरी गली ही पराठों की दुकानों से भरी हुई।',
      text: 'Today Chandni Chowk is one of the most crowded places in India — rickshaws, wedding-lehenga shops, wires overhead like a bird\'s nest the size of the sky, and food: jalebis in one lane, parathas in a lane entirely made of paratha shops.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और उस सारे शोर-शराबे के बीच, अगर तुम्हें कहानी मालूम हो, तो तुम वहीं खड़े होकर जहाँ पानी बहता था, सोच सकते हो: ठीक यहीं, मेरे पैरों के नीचे, कभी एक राजकुमारी ने चाँद को सड़क पर उतारा था।',
      text: 'And in the middle of all that noise, if you know the story, you can stand where the water ran and think: right here, under my feet, a princess once made the moon walk down a street.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगली पूनम को, तुम चाहे जहाँ भी हो, चाँद को देखना और जहाँआरा को याद करना — उस बेटी को जिसने एक शहर पर अपना नाम पत्थरों से नहीं, बल्कि रोशनी से लिखा था।',
      text: 'Next full moon, wherever you are, look at the moon and remember Jahanara — the daughter who signed her name on a city not in stone, but in light.' }
  ],
  moral: 'Build something beautiful and it may outlive itself — living on in a name long after the thing is gone.',
  source: 'Jahanara Begum, daughter of Shah Jahan, laid out Chandni Chowk in the 1650s as part of Shahjahanabad; a canal ran down the street. That much is history. The moonlight on the water giving the street its name is the tradition Delhi tells, and it is told here as tradition.'
},

{
  id: 'fk.kabootarbaz',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'aaj',
  title: 'The Sky Over Old Delhi',
  hook: 'Every evening, above the rooftops of Old Delhi, whole flocks of pigeons turn together in the sky — and on the roofs below, people are talking to them.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier', 'guard'],
  minutes: 3,
  place: ['IN-DL'],
  words_hi: [['कबूतर', 'kabootar', 'pigeon'], ['छत', 'chhat', 'roof'], ['आसमान', 'aasmaan', 'sky']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पुरानी दिल्ली में, ढलती दोपहर के वक़्त, एक लड़का अपने चाचा की छत पर चढ़ा और उसने देखा कि वे मुंडेर पर खड़े, ऊपर आसमान में देखते हुए, लंबी आवाज़ लगा रहे थे — आओ, आओ, आ — किसी ऐसे को पुकारते हुए जो लड़के को दिखाई नहीं दे रहा था।',
      text: 'In the old city of Delhi, late in the afternoon, a boy climbed to his uncle\'s rooftop and found him standing at the edge, looking up, making a long call — aao, aao, aa — to nobody the boy could see.' },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'wow',
      hi: 'तभी उसने उन्हें देखा। कबूतरों का एक झुंड, बहुत ऊँचाई पर, एक साथ ऐसे मुड़ रहा था जैसे आसमान में किसी ने सलेटी दुपट्टा लहरा दिया हो। उसके चाचाजी ने सीटी बजाई, कपड़ा फहराया, फिर आवाज़ दी — और पूरा झुंड चक्कर काटकर, पंखों की फड़फड़ाहट के साथ, अपनी ही छत पर नीचे उतर आया।',
      text: 'Then he saw them. A flock of pigeons, high up, turning all together like one grey scarf thrown across the sky. His uncle whistled, flagged a cloth, called again — and the whole flock wheeled and came down, in a rush of wings, onto their own roof.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"इसे कबूतरबाज़ी कहते हैं," चाचाजी ने कहा। "कबूतर उड़ाना। मेरे पिताजी भी यही करते थे, और उनके पिताजी भी, और इस छत पर तो बादशाहों के ज़माने से कोई न कोई यह करता आ रहा है। ये परिंदे मेरी आवाज़ पहचानते हैं। यहाँ की हर छत की अपनी एक टोली है, और हर टोली अपनी छत को पहचानती है।"',
      text: '"This is kabootarbazi," said his uncle. "Pigeon-flying. My father did it, and his father, and on this roof, someone has been doing it since the time of the emperors. The birds know my voice. Every roof around here has its own flock, and every flock knows its own roof."' },
    { art: ['guard', 'pt_crow'], who: 'guard',
      hi: 'बगल वाली छत से एक पड़ोसी ने आवाज़ लगाई: "आज अपने नए परिंदों का ध्यान रखना!" — क्योंकि असली खेल यही है। जब दो झुंड एक साथ उड़ते हैं, तो हवा में आपस में मिल जाते हैं। और जब वे नीचे उतरते हैं, तो कुछ कबूतर ग़लत पुकार के पीछे-पीछे किसी और की छत पर पहुँच जाते हैं।',
      text: 'From the next roof, a neighbour called across: "Careful with your new birds today!" — because here is the game. When two flocks fly at once, they mix in the air. And when they come down, some birds follow the wrong caller home.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'सारा हुनर आवाज़ में होता है। एक अच्छा कबूतरबाज़ मिले-जुले झुंड में से भी अपने कबूतरों को वापस बुला लेता है — और कभी-कभी, अगर उसकी पुकार बहुत पक्की हो, तो पड़ोसी के भी कुछ कबूतर साथ चले आते हैं।',
      text: 'The skill is in the voice. A good kabootarbaz can call his own birds back out of a mixed flock — and sometimes, if his call is very good, a few of the neighbour\'s birds come too.',
      ask: {
        q: 'Three of the neighbour\'s pigeons land on your roof with your flock. What does the tradition say you do?',
        options: ['Keep them — the sky decided', 'Return them, or settle it over tea', 'Chase them off'],
        answer: 1,
        right: 'Mostly it ends in tea, teasing, and the birds going home. The rivalry is the fun; the neighbours are still neighbours.',
        wrong: 'On these rooftops the rivalry is the fun, not a war. Mostly it ends in teasing, tea, and the birds going home — and a vow to win them properly next time.'
      } },
    { art: ['courtier', 'pt_crow'], who: null,
      hi: 'लड़के ने इसके पीछे की मेहनत समझी: नाप-तौल कर दाना डालना, पानी बदलना, दड़बों की सफ़ाई, और हर कबूतर को उसके नाम और रंग से पहचानना — चितकबरा वाला, सफ़ेद पूँछ वाला, और वह आलसी कबूतर जो हमेशा सबसे आख़िर में उतरता है।',
      text: 'The boy learned the work behind it: grain measured out, water changed, the loft cleaned, every bird known by name and colour — the checkered one, the white-tailed one, the lazy one who always lands last.' },
    { art: ['courtier'], who: null,
      hi: 'और उसने उस ख़ास वक़्त को भी पहचाना। दिन की रोशनी की वह आख़िरी घड़ी, जब गलियों से तपिश उतरने लगती है, एक के बाद एक छत से कबूतरों के झुंड आसमान में उठते हैं, और वह पूरा भीड़-भाड़, शोर-शराबे से भरा पुराना शहर बस एक पल के लिए ठहरकर ऊपर आसमान की तरफ़ देखने लगता है।',
      text: 'And he learned the hour. That last hour of light, when the heat lets go of the lanes, and roof after roof sends its flock up, and the whole crowded, noisy, jam-packed old city stands still for a moment, looking up.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: '"पुरानी दिल्ली के ऊपर, अक्सर शाम के वक़्त, यह नज़ारा आज भी दिखाई देता है। अगर तुम कभी सूरज ढलते समय वहाँ हो, तो कोई ऊँची जगह ढूँढ़कर ऊपर देखना। पुराने शहर के इस आसमान को इतने बरसों से उन लोगों ने सँभाल रखा है जिन्हें तुम कभी नहीं देख पाओगे, जो अपनी छतों पर खड़े रहते हैं।"',
      text: 'It is still happening, most evenings, over Old Delhi. If you are ever there at sunset, find a high place and look up. The sky over the old city has been kept, all this time, by people you will never see, standing on their roofs.' }
  ],
  moral: 'A city is not only its streets. Some of it is kept in the air, by people who look up.',
  source: 'Kabootarbazi, the rooftop pigeon-flying of Old Delhi — a living tradition, practised since Mughal times and still kept by kabootarbaz families in the old city today. Ask anyone in the old city at sunset.'
},

{
  id: 'fk.ghalib-mangoes',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'katha',
  title: 'The Poet and the Mangoes',
  hook: 'Delhi\'s greatest poet had two great loves. One was poetry. The other was mangoes, and it was not always clear which came first.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-DL'],
  words_hi: [['आम', 'aam', 'mango'], ['शायर', 'shayar', 'poet'], ['मीठा', 'meetha', 'sweet']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"क़रीब डेढ़ सौ साल पहले, पुरानी दिल्ली की बल्लीमारान नाम की एक गली में मिर्ज़ा ग़ालिब रहते थे — इतने शानदार शायर कि लोग आज भी उनके शेर ज़बानी याद करते हैं, और हम सबके बाद भी बहुत समय तक याद करते रहेंगे।"',
      text: 'A hundred and fifty-odd years ago, in a lane of Old Delhi called Ballimaran, lived Mirza Ghalib — a poet so good that people are still learning his verses by heart today, and will be long after all of us.' },
    { art: ['courtier'], who: null,
      hi: '"ग़ालिब ने मोहब्बत, दुख और दुनिया के अजब-गज़ब रंगों के बारे में लिखा। और उन्होंने आमों के बारे में भी खूब लिखा। उनके असली ख़त आज भी मौजूद हैं, और उनमें गहरी बातों के बीच-बीच, वे दूसरे शहरों के दोस्तों से बस आम भेजने की फ़रमाइश करते रहते हैं — अच्छे आम, और ढेर सारे।"',
      text: 'Ghalib wrote about love and sorrow and the strangeness of the world. And he wrote, quite a lot, about mangoes. His real letters survive, and in them, between deep thoughts, he is forever asking friends in other cities to send him mangoes — good ones, and plenty.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"जब किसी ने उनसे पूछा कि एक उम्दा आम में क्या ख़ूबी होनी चाहिए, तो उनका जो जवाब हम तक पहुँचा है वह ठेठ ग़ालिब वाला है: बस दो ही बातें होनी चाहिए। एक तो मीठा हो। और दूसरा, बहुत सारा हो।"',
      text: 'When someone asked him what makes a mango truly great, the answer that has come down to us is pure Ghalib: only two things are required. It should be sweet. And there should be a lot of it.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"अब सुनिए वह मशहूर क़िस्सा। ग़ालिब आँगन में अपने एक दोस्त के साथ बैठे थे — ऐसा दोस्त जिसे, अफ़सोस, आम बिल्कुल पसंद नहीं थे और जो पूरा मौसम ग़ालिब से आमों की तारीफ़ें सुन-सुनकर पक चुका था। तभी गली से एक गधा गुज़रा, उसने वहाँ पड़े आम के छिलकों के ढेर को सूँघा, और बिना मुँह लगाए आगे बढ़ गया।"',
      text: 'Now, the famous story. Ghalib was sitting in a courtyard with a friend — a friend who, sadly for him, did not care for mangoes, and had endured a whole season of Ghalib praising them. A donkey wandered down the lane, sniffed at a heap of mango peels lying there, and walked on without touching them.',
      ask: {
        q: 'The friend sees his chance for a joke at the mangoes\' expense. What does he say?',
        options: ['"Even the donkey is full today"', '"Look — even donkeys don\'t eat mangoes"', '"That donkey has fine manners"'],
        answer: 1,
        right: 'Exactly that, with great satisfaction. And then he made his real mistake: he waited for Ghalib to be stumped.',
        wrong: 'He pointed at the donkey and said, with great satisfaction: "Look — even donkeys don\'t eat mangoes." And then he made his real mistake: he waited for Ghalib to be stumped.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: '"ग़ालिब ने गधे को देखा। फिर अपने दोस्त को देखा। और बिना एक पल गँवाए बोले: \\"देखा! सिर्फ़ गधे ही आम नहीं खाते।\\""',
      text: 'Ghalib looked at the donkey. He looked at his friend. And without missing a beat he said: "Quite so. Only donkeys don\'t eat mangoes."' },
    { art: ['guard'], who: null,
      hi: 'दोस्त ने मुँह खोला, कहने को कुछ न मिला, और फिर बंद कर लिया। सुना है कि उसने उसी दोपहर एक आम खाया, सिर्फ़ खुद को उस गिनती से बाहर करने के लिए।',
      text: 'The friend opened his mouth, found nothing whatsoever in it, and closed it again. It is reported that he ate a mango that very afternoon, if only to remove himself from the category.' },
    { art: ['courtier'], who: null,
      hi: 'दिल्ली तब से यह किस्सा सुनाती आ रही है — आमों के मौसम में, कटे हुए फलों की थाली पर, और अक्सर उस मेहमान की चुटकी लेते हुए जिसने अभी-अभी कहा हो, "जी नहीं, शुक्रिया।"',
      text: 'Delhi has told this story ever since — at mango time, over cut fruit, usually at the expense of whichever guest has just said no thank you.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'बल्लीमारान में ग़ालिब का घर अब एक छोटा-सा संग्रहालय है, और आप वहाँ जा सकते हैं। और हर गर्मी में, जब आम आते हैं, दिल्ली में कहीं न कहीं कोई यह बात फिर दोहराता है — और एक बार फिर, आखिरी बात शायर के नाम ही रहती है।',
      text: 'Ghalib\'s house in Ballimaran is a little museum now, and you can visit it. And every summer, when the mangoes come in, somewhere in Delhi somebody says the line again — and the poet gets the last word, one more time.' }
  ],
  moral: 'A quick wit turns the joke made against you into the joke you are remembered by.',
  source: 'Mirza Ghalib (1797–1869) of Ballimaran, Delhi. His love of mangoes is documented in his own surviving letters; the donkey retort and the "sweet, and plenty" answer belong to the anecdote tradition told about him ever since, recorded by his biographers and retold at mango time everywhere. The anecdotes are told here as anecdotes.'
},

{
  id: 'fk.republic-day',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'aaj',
  title: 'The Morning the Whole Country Comes to One Road',
  hook: 'One winter morning a year, all of India — every state, every corner — walks down a single road in Delhi.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'royal_elephant'],
  minutes: 3,
  place: ['IN-DL'],
  words_hi: [['गणतंत्र', 'gantantra', 'republic'], ['झाँकी', 'jhaanki', 'tableau'], ['तिरंगा', 'tiranga', 'the tricolour flag']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'छब्बीस जनवरी को दिल्ली अँधेरे में ही जाग जाती है। कड़ाके की ठंड होती है — बिल्कुल दिल्ली की सर्दियों वाली ठंड, कोहरे से भरी — और सब परिवार शॉल और मंकी कैप लपेटकर एक लंबी, चौड़ी सड़क की ओर चल पड़ते हैं, जिसके छोर पर इंडिया गेट खड़ा है।',
      text: 'On the twenty-sixth of January, Delhi gets up in the dark. It is cold — proper Delhi-winter cold, the kind with fog in it — and families wrap up in shawls and monkey caps and head for one long, wide road with India Gate standing at the end of it.' },
    { art: ['guard'], who: null,
      hi: 'यह तारीख कोई इत्तेफ़ाक नहीं है। सन् 1950 में इसी दिन भारत का संविधान लागू हुआ था — नियमों की वह किताब जो देश ने खुद अपने लिए लिखी थी, जिसकी शुरुआत होती है इन शब्दों से: हम, भारत के लोग। गणतंत्र दिवस उसी किताब का जन्मदिन है।',
      text: 'The date is not an accident. On this day in 1950, India\'s Constitution came into force — the book of rules the country wrote for itself, that begins with the words We, the people of India. Republic Day is the birthday of that book.' },
    { art: ['guard', 'royal_elephant'], who: null, mood: 'wow',
      hi: 'और फिर परेड आती है। सैनिक ऐसे सटीक ताल मिलाकर कदमताल करते हैं कि उनकी आवाज़ एक विशाल कदम जैसी लगती है। बैंड। घोड़े। ऊँट — ऊँटों का दस्ता, ऊँचा और बेपरवाह। और ऊपर, आसमान को चीरते हुए ऐसी बनावट में उड़ते जेट विमान कि पूरी भीड़ एक साथ दंग रह जाती है।',
      text: 'And then the parade comes. Soldiers marching so exactly together they sound like one enormous footstep. Bands. Horses. Camels — the camel regiment, tall and unbothered. And overhead, jets ripping the sky open in formations that make the whole crowd gasp at once.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"मगर बाद में किसी बच्चे से पूछिए कि उसे सबसे अच्छा क्या लगा, तो वह आमतौर पर झांकियाँ ही होती हैं। हर राज्य एक झांकी भेजता है: पहियों पर चलता एक मंच, जो अपने एक हिस्से को साथ लिए चलता है। केरल की नावें। राजस्थान का रेगिस्तान। नाचता हुआ पूर्वोत्तर। हर तीस सेकंड में एक अलग ही भारत।"',
      text: 'But ask a child afterwards what they loved best and it is usually the jhaankis — the tableaux. Every state sends one: a rolling stage carrying a piece of itself. Kerala\'s boats. Rajasthan\'s desert. The Northeast dancing. A different India every thirty seconds.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"अपनी दादी के साथ देख रही एक बच्ची ने पूछा कि यह परेड दिल्ली में ही क्यों होती है। उसकी दादी ने पलटकर उसी से सवाल पूछ लिया।"',
      text: 'A girl watching with her grandmother asked why Delhi gets the parade. Her grandmother turned the question around.',
      ask: {
        q: 'Why does the whole country\'s parade happen on this one Delhi road?',
        options: ['Because Delhi is the biggest city', 'Because Delhi is where the country keeps its promises to itself', 'Because the road is the widest one'],
        answer: 1,
        right: '"This is the capital," said her grandmother. "It belongs to every Indian. Today you can see all of them arriving to collect it."',
        wrong: '"Not size," said her grandmother. "This is the capital — it belongs to every Indian everywhere. Today you can see all of them arriving to collect it."' } },
    { art: ['guard'], who: null,
      hi: '"परेड में बच्चे भी होते हैं — पुरस्कार जीतने वाले, नाचने वाले, और वे स्कूली बच्चे जिन्होंने कोहरे में महीनों तक अभ्यास किया था। और एक पल ऐसा आता है जब झंडा ऊपर फहराया जाता है और लाखों लोगों की पूरी भीड़ एक साथ खड़ी होकर बिल्कुल शांत हो जाती है।"',
      text: 'There are children in the parade too — award winners, dancers, schools that practised for months in the fog. And there is one moment when the flag goes up and the whole crowd, lakhs of people, stands and goes quiet together.' },
    { art: ['courtier'], who: null,
      hi: '"पूरे देश में वही सुबह: हर राज्य के स्कूल के मैदानों में झंडे फहराए जा रहे होते हैं, मिठाइयाँ बाँटी जाती हैं, हज़ारों तरह के लहजों में राष्ट्रगान गाया जाता है। परेड दिल्ली में होती है, मगर यह दिन हर जगह होता है।"',
      text: 'All over the country, the same morning: flags going up in school yards in every state, sweets given out, the anthem sung in a thousand accents. The parade is in Delhi, but the day is everywhere.' },
    { art: ['guard'], who: 'mithu',
      hi: '"अगर आप कभी जनवरी के आख़िरी दिनों में दिल्ली में हों, तो ज़रूर जाइए — या फिर अपने परिवार के साथ टीवी पर देखिए, जैसे ज़्यादातर भारत देखता है, कंबलों में लिपटे हुए, झांकियों की तरफ उँगली दिखाते हुए, और खुशी-खुशी इस बात पर बहस करते हुए कि किस राज्य की झांकी सबसे अच्छी थी।"',
      text: 'If you are ever in Delhi in late January, go — or watch it on a screen with your family, which is how most of India sees it, wrapped in blankets, pointing at the jhaankis, arguing happily about whose state\'s was best.' }
  ],
  moral: 'A country is a promise its people make to each other — and once a year it is worth standing in the cold to watch the promise walk past.',
  source: 'Republic Day, 26 January — kept since 1950, when the Constitution of India came into force. The parade along Kartavya Path in New Delhi, with its state tableaux and flypast, happens every year and is broadcast across the country.'
},

{
  id: 'it.hauz-khas',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'dilli',
  badge: 'itihaas',
  title: 'The King Who Mended Things',
  hook: 'One king dug a great tank so a city could drink. It silted up and died. Then came a rarer kind of king: one who fixed other people\'s things.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_deer'],
  minutes: 4,
  place: ['IN-DL'],
  words_hi: [['तालाब', 'taalaab', 'tank, pond'], ['पानी', 'paani', 'water'], ['मरम्मत', 'marammat', 'repair']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"लगभग सात सौ साल पहले, सुल्तान अलाउद्दीन ख़लजी ने दिल्ली में अपने लिए एक नया शहर बनवाया, जिसका नाम था सीरी। शहर को पानी की ज़रूरत होती है, और दिल्ली की गर्मियाँ बड़ी बेरहम होती हैं — इसलिए उसने मानसून का पानी इकट्ठा करने के लिए पास ही एक बहुत बड़ा तालाब खुदवाया: हौज-ए-अलाई, यानी शाही जलाशय।"',
      text: 'About seven hundred years ago, Sultan Alauddin Khalji built himself a new city at Delhi, called Siri. A city is thirsty, and Delhi\'s summers are merciless — so he had a vast tank dug nearby to catch the monsoon: the Hauz-i-Alai, the royal reservoir.' },
    { art: ['courtier'], who: null,
      hi: 'काम बन गया। बारिश ने उसे लबालब भर दिया, और झुलसती गर्मी के पूरे मौसम में पानी टिका रहा — पीने के लिए, नहाने-धोने के लिए, जानवरों के लिए, हर किसी के लिए। पुरानी दिल्ली में कोई बड़ा तालाब सिर्फ़ सजावट की चीज़ नहीं था। वही तय करता था कि कोई जगह एक शहर बने या फिर वीराना।',
      text: 'It worked. The rains filled it, and all through the burning months the water lasted — for drinking, for washing, for animals, for everyone. A big tank in old Delhi was not a decoration. It was the difference between a city and an empty place.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'लेकिन बाकी सब चीज़ों की तरह, तालाबों को भी देखरेख की ज़रूरत होती है। राजा बदलते गए, ध्यान हटता गया, और साल-दर-साल गाद भरती गई और नालियाँ बंद होती गईं, यहाँ तक कि उस बड़े तालाब में नाममात्र का पानी भी न बचा। उस ज़माने के इतिहास बताते हैं कि लोगों ने उसके सूखे तलवे में कुएँ तक खोदने शुरू कर दिए थे।',
      text: 'But tanks, like everything, need looking after. Kings changed, attention wandered, and year by year the silt crept in and the channels choked, until the great tank held hardly any water at all. The chronicles say people had even begun digging wells in its dry bed.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'फिर आए फ़िरोज़ शाह तुग़लक़ — और फ़िरोज़ शाह बड़े अनोखे सुल्तान थे। ज़्यादातर राजा अपने नाम से नई चीज़ें बनवाना चाहते हैं। मगर फ़िरोज़ शाह का एक ऐसा शौक़ था जिसके बारे में उनके दौर के इतिहासकारों ने बड़े अचरज के साथ लिखा है: उन्हें पुरानी चीज़ों की मरम्मत करना पसंद था।',
      text: 'Then came Firoz Shah Tughlaq — and Firoz Shah was an unusual sort of Sultan. Most kings want to build new things with their own names on them. Firoz Shah had a passion the histories of his own time wrote about with some wonder: he liked repairing old things.',
      ask: {
        q: 'A king finds the great tank of a long-dead rival king lying ruined. What does the usual king do — and what did Firoz Shah do?',
        options: ['Build his own bigger tank next to it', 'Repair the old one, keeping the old name too', 'Leave it — it was not his'],
        answer: 1,
        right: 'He cleared it, restored its channels, and let it fill again — another man\'s tank, made to work for everyone. That is why he is remembered.',
        wrong: 'The usual king builds his own. Firoz Shah cleared the old one, restored its channels, and let it fill again — another man\'s tank, made to work for everyone.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उन्होंने पूरी दिल्ली में यही किया — पुराने मक़बरे, पुराने तालाब, सदियों पहले गुज़रे राजाओं की पुरानी इमारतें, सब उनके हुक्म से फिर से दुरुस्त की गईं। यहाँ तक कि उन्होंने अपने शासन के ब्योरे में इसे उन कामों में लिखवाया जिन पर उन्हें सबसे ज़्यादा गर्व था। नई जीत नहीं। पुरानी चीज़ों की देखभाल।',
      text: 'He did the same all over Delhi — old tombs, old tanks, old buildings of kings long gone, patched up at his order. He even had it written down, in his own account of his reign, as one of the things he was proudest of. Not conquest. Maintenance.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और उस संवारे गए तालाब के किनारे उन्होंने एक मदरसा — यानी एक कॉलेज — बनवाया, जिसमें पत्थर के हवादार कमरे थे जिनका रुख़ पानी की तरफ़ था, ताकि छात्र पानी की आवाज़ सुनते-सुनते अपने सबक याद कर सकें। उस जगह का नाम पड़ा हौज़ ख़ास: यानी शाही तालाब।',
      text: 'And on the banks of the restored tank he built a madrasa — a college — with airy stone rooms looking out over the water, so that students learned their lessons to the sound of it. The place came to be called Hauz Khas: the royal tank.' },
    { art: ['pt_deer', 'courtier'], who: null,
      hi: 'यह सब कुछ आज भी वहीं मौजूद है। मॉनसून में तालाब आज भी भर जाता है। पानी के किनारे मदरसे के वे पत्थर के कमरे आज भी खड़े हैं। अब उसके आस-पास एक हिरन पार्क है, कैफ़े हैं, और आर्ट गैलरी हैं, और विद्यार्थी आज भी आकर ठीक वहीं बैठते हैं जहाँ छह सौ साल पहले विद्यार्थी बैठा करते थे।',
      text: 'All of it is still there. The tank still fills in the monsoon. The madrasa\'s stone rooms still stand at the water\'s edge. Around it now there is a deer park, and cafes, and art galleries, and students still come and sit where students sat six hundred years ago.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"दिल्ली अपने विजेता राजाओं को तो याद रखती ही है। लेकिन कभी शाम को उस पानी के किनारे जाकर बैठिए, जब तोते ऊपर से उड़कर अपने घर लौट रहे हों, तो शायद आप उस दूसरे तरह के राजा के शुक्रगुज़ार हो जाएँ — वो राजा जिसने चीज़ों को सँवारा था।"',
      text: 'Delhi remembers its conqueror kings, of course. But go and sit by that water in the evening, with the parakeets coming home over it, and you may find yourself grateful to the other kind — the king who mended things.' }
  ],
  moral: 'Building something new makes you famous. Fixing what others left broken makes you useful — and sometimes that lasts longer.',
  source: 'The Hauz-i-Alai was dug under Alauddin Khalji (reigned 1296–1316) for his city of Siri; Firoz Shah Tughlaq (reigned 1351–1388) restored the silted tank and built the madrasa on its banks. Firoz Shah\'s pride in repairing earlier rulers\' works is recorded in his own Futuhat-i-Firozshahi and in court histories of his reign. Tank, madrasa and deer park stand at Hauz Khas today.'
},

/* ========================================================= CHANDIGARH ====== */
/* Chandigarh is a new city, and its stories are honestly modern. That is not a
   gap to paper over — it IS the folklore here: a plan, a garden built in
   secret, a hand that turns in the wind. Every source below says plainly that
   these are stories of living memory, not old tradition. */

{
  id: 'fk.city-from-drawing',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  needs_review: true,
  title: 'The City That Began as a Drawing',
  hook: 'Most cities grow up slowly, like trees. One Indian city was drawn on paper first — every road, every garden — and then built, exactly as drawn.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-CH'],
  words_hi: [['नक्शा', 'naksha', 'plan, map'], ['नया', 'naya', 'new'], ['सपना', 'sapna', 'dream']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '1947 में भारत आज़ाद हुआ, और उसी मुश्किल साल में देश बँट भी गया, और पंजाब की पुरानी शानदार राजधानी, लाहौर, अब भारत में नहीं रही। पंजाब को एक राजधानी चाहिए थी। पर देने के लिए कोई शहर था ही नहीं।',
      text: 'In 1947 India became free, and in the same difficult year the country was divided, and Punjab\'s grand old capital, Lahore, was no longer in India. Punjab needed a capital. There wasn\'t one to give it.' },
    { art: ['guard'], who: null,
      hi: 'आसान रास्ता तो यह था कि किसी पहले से बसे शहर में ही गुज़ारा कर लिया जाए। लेकिन भारत ने इसके बजाय जो रास्ता चुना वह हैरान कर देने वाला था: एक नया शहर बनाना। बिल्कुल शुरू से। शिवालिक की पहाड़ियों के नीचे फैले खुले खेतों में। प्रधानमंत्री नेहरू ने कहा कि यह नया शहर पुरानी परंपराओं की बेड़ियों से आज़ाद होना चाहिए — भविष्य में देश के भरोसे का एक प्रतीक।',
      text: 'The easy answer was to squeeze into some existing town. The answer India chose instead was astonishing: build a city. From nothing. In the open farmland below the Shivalik hills. Prime Minister Nehru said the new city should be unfettered by the traditions of the past — a symbol of the nation\'s faith in the future.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'फ़्रांस से एक मशहूर वास्तुकार को लाया गया — ली कोर्बुज़िए — और भारतीय व यूरोपीय इंजीनियरों और वास्तुकारों के साथ मिलकर उन्होंने वह काम किया जो शायद ही कभी किसी को करने को मिलता है: वे कोरा कागज़ लेकर बैठे और किसी शहर के बनने से पहले ही पूरे शहर का नक्शा खींच दिया।',
      text: 'A famous architect was brought from France — Le Corbusier — and with Indian and European engineers and architects he did something almost nobody gets to do: he sat down with blank paper and drew a whole city before it existed.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'उन्होंने इसे एक शरीर की तरह बनाया। सबसे ऊपर सिर — कैपिटल, जहाँ सरकार बैठती है। बीच में दिल — सेक्टर 17, यानी बाज़ार। फेफड़ों की तरह बीच से गुज़रती हरी-भरी सुंदर वादियाँ। रफ़्तार के हिसाब से बंटी सड़कें, ताकि तेज़ गाड़ियाँ और साइकिल चलाते बच्चे कभी आमने-सामने न आएँ।',
      text: 'He drew it like a body. A head at the top — the Capitol, where the government sits. A heart in the middle — Sector 17, the marketplace. Green leisure valleys running through it like lungs. Roads sorted by speed, so fast traffic and cycling children never meet.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'और धागों की तरह उलझी गलियों की जगह, उन्होंने साफ़-सुथरे चौकोर हिस्से बनाए जिन्हें सेक्टर कहा गया, हर एक का अपना नंबर, हर एक अपने आप में एक नन्हीं दुनिया — घर, स्कूल, बाज़ार, बाग़-बगीचे — ताकि रोज़मर्रा की ज़िंदगी बस पंद्रह मिनट की पैदल दूरी में ही सिमट जाए।',
      text: 'And instead of lanes tangled like string, he drew neat rectangles called sectors, each numbered, each meant to be a little world of its own — homes, school, market, garden — so that daily life fits inside a fifteen-minute walk.',
      ask: {
        q: 'Every sector got homes, a school, a market and a garden of its own. What was the idea?',
        options: ['To make the city look tidy from the air', 'So a family\'s whole daily life is a short walk', 'To keep sectors from meeting each other'],
        answer: 1,
        right: 'That was the dream: bread, books and green grass within reach of every front door.',
        wrong: 'The rectangles were never the point. The point was that bread, books and green grass should be a short walk from every front door.'
      } },
    { art: ['courtier'], who: null,
      hi: 'फिर वह नक्शा कागज़ से उठकर हक़ीक़त बन गया। सरसों के खेतों के बीच से सड़कें निकल आईं। कंक्रीट की इमारतें खड़ी हो गईं — विशाल, बेबाक, सादी, जैसी किसी ने कभी न देखी हों। लोग हर जगह से एक ऐसे शहर में रहने चले आए जिसका रंग-रोगन अभी सूखा भी नहीं था।',
      text: 'Then the drawing stood up off the paper. Roads were laid through mustard fields. Concrete buildings rose — huge, bold, bare, like nothing anyone had seen. People came from everywhere to live in a city with wet paint on it.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'शुरू-शुरू में यह बड़ा अजीब लगा। एक ऐसा शहर जिसमें न कोई पुराना इलाक़ा था, न कोई खंडहर, न किस्से-कहानियों से भरा कोई क़िला — बस नंबर, बगीचे और नन्हे-नन्हे पेड़। वहाँ पलकर बड़े होने वाले पहले बच्चे, पंजाब के हज़ार साल के इतिहास में ऐसे पहले लोग थे जो किसी एकदम नई जगह के रहने वाले थे।',
      text: 'It was strange at first. A city with no old quarter, no ruins, no story-soaked fort — just numbers and gardens and young trees. The first children who grew up there were the first people in a thousand years of Punjab to be from a brand-new place.' },
    { art: ['courtier'], who: null,
      hi: 'वे बच्चे अब दादा-दादी और नाना-नानी बन चुके हैं। उनके लगाए पेड़ अब विशाल हो गए हैं। और इस शहर का एक ऐसा नाम है जिसे यह बड़े नाज़ से अपनाता है: \'द सिटी ब्यूटीफुल\'।',
      text: 'Those children are grandparents now. The trees they planted are giants. And the city has a name it wears without blushing: the City Beautiful.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'चंडीगढ़ के लोक-किस्से पुराने नहीं हैं — यही तो उसका किस्सा है। एक देश, जिसने अपनी ज़िंदगी का सबसे कठिन साल अभी-अभी झेला था, उसने खाली खेतों की तरफ़ देखा और कहा: यहाँ हम अपना भविष्य बनाएँगे। अगर तुम्हारा परिवार चंडीगढ़ से है, तो उनसे पूछना कि वे पहले किस सेक्टर में रहते थे। यह बात सबको याद रहती है।',
      text: 'Chandigarh\'s folklore is not old — it is this. A country that had just been through the hardest year of its life looked at empty farmland and said: here we will draw a future. If your family is from Chandigarh, ask them which sector they first lived in. Everyone remembers.' }
  ],
  moral: 'When the past is too heavy to carry, one answer is to draw the future carefully — and then build the drawing.',
  source: 'The planning and building of Chandigarh, 1950s — planned by Le Corbusier with Pierre Jeanneret, Maxwell Fry, Jane Drew and Indian engineers and architects, after an initial plan by Albert Mayer. Nehru\'s "unfettered by the traditions of the past" speech is documented. This is modern history within living memory, told as the city itself tells it; the Partition sentence is flagged for human review per policy.'
},

{
  id: 'it.nek-chand',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'itihaas',
  title: 'The Secret Kingdom of Broken Things',
  hook: 'For nearly twenty years, a roads inspector spent his evenings building a hidden kingdom in the forest — out of everything the city threw away. Then somebody found it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-CH'],
  words_hi: [['पत्थर', 'patthar', 'stone'], ['टूटा', 'toota', 'broken'], ['बाग़', 'baag', 'garden']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब चंडीगढ़ बन रहा था, तो नेक चंद नाम के एक नौजवान रोड इंस्पेक्टर हर रोज़ साइकिल से निर्माण की जगहों का चक्कर लगाते थे। और जहाँ भी वे जाते, उन्हें दिखता कि बनता हुआ शहर अपने पीछे क्या छोड़ जाता है: टूटी टाइलें, चटके हुए बर्तन, फ़्यूज़ बल्ब, टूटी चूड़ियाँ, अजीबोगरीब पत्थर। कचरा, सब यही मानते थे।',
      text: 'While Chandigarh was being built, a young roads inspector named Nek Chand cycled around the works every day. And everywhere he went, he saw what a rising city leaves behind: broken tiles, cracked pots, dead bulbs, smashed bangles, odd stones. Rubbish, everyone agreed.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'नेक चंद ऐसा बिल्कुल नहीं मानते थे। उन्होंने चुपचाप चीज़ें इकट्ठा करना शुरू कर दिया। यहाँ से टूटी चूड़ियों की एक बोरी। वहाँ से नदी के पत्थरों का एक ढेर, जिनमें से हर पत्थर किसी न किसी चीज़ जैसा दिखता था — कोई चिड़िया, कोई चेहरा, कोई बैठा हुआ भालू। वे उन्हें साइकिल पर लादकर झील के पास जंगल की एक ऐसी घाटी में ले जाते, जहाँ कभी कोई नहीं जाता था।',
      text: 'Nek Chand did not quite agree. He began, quietly, to collect. A sack of broken bangles here. A load of river stones there, each one shaped like something — a bird, a face, a sitting bear. He carried them by bicycle into a forest gorge near the lake where nobody ever went.' },
    { art: ['guard'], who: null,
      hi: 'बस एक मुश्किल थी, और वह कोई छोटी मुश्किल नहीं थी: वह ज़मीन संरक्षित थी। वहाँ किसी को भी कुछ भी बनाने की इजाज़त नहीं थी। किसी को भी नहीं। और शहर के ही कचरे से, एक सरकारी रोड इंस्पेक्टर के ज़रिये, चुपके-चुपके कुछ बनाने की तो बिल्कुल भी नहीं।',
      text: 'There was one problem, and it was not small: that land was protected. Nothing was allowed to be built there. Not by anyone. Certainly not a secret anything, by a government roads inspector, out of the city\'s own rubbish.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'फिर भी वे बनाते रहे। शामें, रातें, छुट्टियाँ — बरसों तक, अकेले। उन्होंने थोड़ी सी जगह साफ़ करके एक झोपड़ी बनाई, फिर तरह-तरह की आकृतियाँ: चूड़ियों के टुकड़ों वाले घाघरे पहने नाचती हुई मूर्तियाँ, टूटी क्रॉकरी की खाल वाले जानवर, पत्थर के चेहरों वाले छोटे लोगों की फ़ौजें, आँगन, झरने, और इतने नीचे दरवाज़ों वाली घुमावदार दीवारें कि बड़ों को भी झुककर अंदर जाना पड़े।',
      text: 'He built anyway. Evenings, nights, holidays — alone, for years. He cleared a little space and made a hut, then figures: dancers with bangle-shard skirts, animals with crockery skins, armies of little people with stone faces, courtyards, waterfalls, winding walls with low doorways that make even grown-ups bow to enter.' },
    { art: ['courtier'], who: null,
      hi: 'लगभग बीस सालों तक, किसी को भी पता नहीं चला। पेड़ों के बीच उनका यह साम्राज्य फलता-फूलता रहा — पहले सैकड़ों आकृतियाँ, फिर हज़ारों — जबकि पहाड़ी की दूसरी तरफ़ बसे शहर को भनक तक नहीं थी कि उसका कोई जुड़वाँ भी है।',
      text: 'For close to twenty years, almost nobody knew. His kingdom grew in the trees — hundreds of figures, then thousands — while the city on the other side of the ridge had no idea it had a twin.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'फिर, 1970 के दशक में, जंगल साफ़ करने वाली सरकारी कर्मचारियों की एक टोली झाड़ियों को हटाती हुई आगे बढ़ी और एकदम सन्न रह गई। पेड़ों के बीच पत्थर के लोग कतारों में खड़े उन्हें ताक रहे थे। एकड़ों में फैले हुए। किसी ने यहाँ अंदर एक पूरी दुनिया बसा दी थी।',
      text: 'Then, in the 1970s, a government clearing party working in the forest pushed through the undergrowth and stopped dead. Stone people stood in ranks between the trees, watching them. Acres of them. Somebody had built a world in here.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'अफ़सरों के सामने एक असली मुश्किल आ खड़ी हुई। नियम साफ़ थे: यह सब ग़ैरक़ानूनी था, इसकी एक-एक दीवार, और क़ानून कहता था कि इसे तोड़ दिया जाए। लेकिन फ़ैसला लेने से पहले अफ़सर इसे देखने आए — और फिर और भी अफ़सर आए, और फिर उनके परिवार भी।',
      text: 'The officials had a genuine problem. The rules were clear: it was all illegal, every wall of it, and the law said demolish. But officials came to see it before deciding — and then more officials, and then their families.',
      ask: {
        q: 'The secret garden breaks every rule in the book. The rulebook says tear it down. What should the city do?',
        options: ['Tear it down — rules are rules', 'Keep it — some things matter more than the rulebook', 'Fine Nek Chand and keep the garden'],
        answer: 1,
        right: 'The city chose the garden. It kept the rulebreaker too — and gave him a salary and workers to keep building.',
        wrong: 'The people of Chandigarh had fallen in love with it, rules or no rules. The city kept the garden — and gave Nek Chand a salary and workers to keep building.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'रॉक गार्डन सबके लिए खोल दिया गया। नेक चंद, जिन्होंने बीस साल तक अपने काम को छिपाकर रखा था, अपनी बाक़ी की लंबी ज़िंदगी खुलेआम इसे ही बनाते हुए बिताई — झरने, झूलों वाला एक बड़ा दालान, मूर्तियों से भरे पूरे-पूरे आँगन — जिन्हें देखने दुनिया भर से हज़ारों-हज़ार लोग आए।',
      text: 'The Rock Garden opened to everyone. Nek Chand, the man who had hidden his work for twenty years, spent the rest of his long life building it in the open — waterfalls, a hall of swings, whole courtyards of figures — visited by thousands upon thousands of people from all over the world.' },
    { art: ['courtier'], who: null,
      hi: 'और सबसे प्यारी बात यह है: यह सब अब भी टूटी-फूटी चीज़ों से ही बना है। किसी भी नर्तकी को ध्यान से देखो, तो तुम्हें किसी के टूटे हुए चाय के कप, किसी के जले हुए सॉकेट, किसी के बाथरूम की चटकी हुई टाइलें नज़र आएँगी — हर वह चीज़ जिसे शहर ने बेकार मान लिया था, आज एक-दूसरे का हाथ थामे नाच रही है।',
      text: 'And here is the loveliest part: it is all still broken things. Look closely at any dancer and you are looking at somebody\'s smashed teacups, somebody\'s burnt-out sockets, somebody\'s cracked bathroom tiles — everything a city decided was worthless, holding hands and dancing.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'चंडीगढ़ में, झील के बिल्कुल पास, रॉक गार्डन आज खुला है। छोटे-छोटे दरवाज़ों से होकर निकलो। जहाँ दीवार झुकाए, वहाँ झुक जाओ। आख़िरकार, यह एक अनोखा राज्य ही तो है।',
      text: 'The Rock Garden is open today, in Chandigarh, right next to the lake. Go through the low doorways. Bow when the wall makes you bow. It is a kingdom, after all.' }
  ],
  moral: 'Nothing is rubbish until the last person stops imagining what it could be.',
  source: 'Nek Chand Saini (1924–2015) and the Rock Garden of Chandigarh — built in secret on protected land from around 1957, discovered by officials in the mid-1970s, then embraced by the city, which gave him a salary and a workforce. Well documented in the garden\'s own records and many published accounts; the garden receives visitors daily.'
},

{
  id: 'fk.open-hand',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'The Hand That Turns With the Wind',
  hook: 'Above Chandigarh stands a giant metal hand, taller than a house. It is nobody\'s statue. Its job is to turn in the wind — and to mean something.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 3,
  place: ['IN-CH'],
  words_hi: [['हाथ', 'haath', 'hand'], ['हवा', 'hawa', 'wind'], ['देना', 'dena', 'to give']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'चंडीगढ़ के सबसे ऊपरी हिस्से में, जहाँ पीछे पहाड़ियों के सामने कंक्रीट के एक बड़े से मैदान में सरकारी इमारतें खड़ी हैं, स्कूल की सैर पर आई एक लड़की ने आसमान में कुछ अनोखा देखा: एक ऊँचे खंभे पर धातु का बना एक विशालकाय हाथ, जो इस तरह खुला था जैसे कोई हाथ हिलाकर नमस्ते कह रहा हो।',
      text: 'At the top of Chandigarh, where the government buildings stand in a great concrete plaza with the hills behind them, a girl on a school trip saw something strange against the sky: an enormous metal hand, high on a mast, open like a wave hello.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"वह \'ओपन हैंड\' है," टीचर ने कहा। "हमारे शहर का प्रतीक। यह पाँच मंज़िला इमारत से भी ऊँचा है, इसका वज़न दर्जन भर हाथियों जितना है — और ज़रा एक मिनट इसे ध्यान से देखो।"',
      text: '"That is the Open Hand," said the teacher. "The symbol of our city. It is taller than a five-storey building, it weighs as much as a dozen elephants — and watch it for a minute."' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'उसने देखा। शिवालिक की पहाड़ियों से हवा बहकर आई, और वह पूरा विशाल हाथ अपनी धुरी पर हौले से घूमकर एक नई दिशा की ओर मुड़ गया, जैसे किसी पुरानी लोककथा जितना बड़ा कोई वेदरवेन हो। कुछ बच्चों को लगा कि अब यह एक खुली हथेली जैसा दिख रहा है। दूसरों ने कहा, उड़ती हुई कोई चिड़िया।',
      text: 'She watched. The wind came down off the Shivaliks, and the whole gigantic hand swung gently on its bearings and faced a new direction, like a weathervane the size of a myth. Some children thought it now looked like an open palm. Others said a bird in flight.' },
    { art: ['guard'], who: 'guard',
      hi: '"हमारे शहर का नक्शा बनाने वाले वास्तुकार ने इसे यहाँ लगाया था," टीचर ने बताया, "और उन्होंने इसे एक विचार दिया: देने के लिए भी खुला, और लेने के लिए भी खुला। वे चाहते थे कि यह शहर ख़ुद यह वादा करे। जो हाथ मुट्ठी बन जाए, वह इन दोनों में से कुछ नहीं कर सकता।"',
      text: '"The architect who drew our city put it here," said the teacher, "and he gave it a motto: open to give, and open to receive. He wanted the city itself to make that promise. A hand that is a fist can do neither."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लौटती हुई बस में, वह लड़की इसी बारे में सोचती रही — एक ऐसा स्मारक जो घोड़े पर सवार कोई राजा नहीं है, न तलवार थामे कोई सेनापति। बस एक हाथ, जो खुला है और घूम रहा है।',
      text: 'On the bus back, the girl kept thinking about it — a monument that is not a king on a horse, not a general with a sword. Just a hand, open, turning.',
      ask: {
        q: 'Cities usually put up statues of famous people. Why did this one put up an open hand instead?',
        options: ['Nobody famous was available', 'The promise mattered more than any one person', 'Hands are easier to build than faces'],
        answer: 1,
        right: 'A statue honours somebody who is finished. An open hand asks something of everybody who is not.',
        wrong: 'Chandigarh was too new to have heroes yet — but that is not the reason. A statue honours somebody who is finished. An open hand asks something of everybody who is not.'
      } },
    { art: ['courtier'], who: null,
      hi: 'उस शाम उसके दादाजी को यह सवाल बहुत पसंद आया। "देने के लिए भी खुला और पाने के लिए भी खुला," उन्होंने दोहराया। "यह बात किसी शहर पर भी लागू होती है और किसी इंसान पर भी। पूरे एक दिन इनमें से कोई एक बनकर तो देखो। तुम देखोगे कि पाना उतना आसान नहीं होता जितना देना।"',
      text: 'Her grandfather liked the question that evening. "Open to give and open to receive," he repeated. "It works for a city and it works for a person. Try being one or the other for a whole day. The giving is easier than the receiving, you will find."' },
    { art: ['guard'], who: null,
      hi: 'वह हाथ आज भी वहीं ऊपर घूम रहा है। दशकों से वह पहाड़ियों से आने वाली हर हवा का सामना करता आ रहा है — न कभी किसी की तरफ इशारा करता है, न कभी मुट्ठी बांधता है, और न ही कभी पूरी तरह थमता है।',
      text: 'The hand is still up there, turning. It has faced every wind that has come off the hills for decades — never pointing at anyone, never closing, never quite still.' },
    { art: ['guard'], who: 'mithu',
      hi: 'अगर तुम वहां जाओ, तो उसके नीचे चौक में खड़े होकर उसे हिलते हुए देख सकते हो। यह दुनिया के उन गिने-चुने स्मारकों में से एक है जिसका पूरा काम ही अपनी दिशा बदलते रहना है — और ऐसा करते हुए भी अपने हाथ को हमेशा खुला रखना है।',
      text: 'If you visit, you can stand in the plaza below it and watch it move. It is one of the only monuments anywhere whose whole job is to keep changing its mind — and keep its hand open while it does.' }
  ],
  moral: 'Stay open to give and open to receive — and let the winds turn you without closing you.',
  source: 'The Open Hand Monument at the Capitol Complex, Chandigarh — designed by Le Corbusier as the city\'s emblem, about 26 metres high, mounted to rotate with the wind. "Open to give, open to receive" is Corbusier\'s own documented motto for it. A modern monument with a modern story, told as such.'
},

{
  id: 'fk.sukhna-birds',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'The Lake That Invites Winter Guests',
  hook: 'Chandigarh\'s lake was made by people, on purpose. The birds that fly thousands of kilometres to it every winter do not care in the slightest.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'courtier', 'guard'],
  minutes: 3,
  place: ['IN-CH'],
  words_hi: [['झील', 'jheel', 'lake'], ['पंछी', 'panchhi', 'bird'], ['सुबह', 'subah', 'morning']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब चंडीगढ़ नया-नया था, तो इसे बनाने वालों ने शिवालिक की पहाड़ियों से लुढ़कते-बहते \'सुखना चो\' नाम के एक बरसाती नाले को देखा और उसके आगे मिट्टी का एक बांध बना दिया। उस नाले का पानी रुका, चारों तरफ फैला और एक झील बन गया — सुखना झील, जिसे इंसानों ने अपने हाथों से, बड़े जतन से बनाया था।',
      text: 'When Chandigarh was young, its makers looked at a seasonal stream called the Sukhna Choe, tumbling down from the Shivalik hills, and built an earthen dam across it. The stream pooled and spread and became a lake — Sukhna Lake, made by hands, on purpose.' },
    { art: ['guard'], who: null,
      hi: 'फिर एक ऐसा नियम बना जिसने आगे की हर बात तय कर दी: कोई भी शोर मचाने वाली मोटरबोट नहीं चलेगी। झील को शांत ही रहना था — टहलने वालों के लिए, चप्पू से नाव चलाने वालों के लिए, सुबह-सवेरे योग करने वालों के लिए, और उन मेहमानों के लिए भी जिनके बारे में शहर की योजना बनाने वालों ने शायद सोचा भी नहीं था।',
      text: 'A rule was set that shaped everything after: no roaring motorboats. The lake was to stay quiet — for walkers, for rowers, for people doing yoga at dawn, and for guests the planners had perhaps not even thought about.' },
    { art: ['pt_heron'], who: null, mood: 'wow',
      hi: 'क्योंकि यह खबर चारों तरफ फैल गई। इंसानों में नहीं — परिंदों में। हर सर्दी में, हैरान कर देने वाली दूरियों से पक्षी यहां आने लगे: बत्तखें और पानी में चलने वाले पक्षी जो सुदूर उत्तर में, साइबेरिया और मध्य एशिया में अंडे देते हैं, और ठंड आते ही हज़ारों किलोमीटर उड़कर दक्षिण की ओर चले आते हैं।',
      text: 'Because word got around. Not among people — among birds. Every winter, birds began arriving from astonishingly far away: ducks and waders that breed in the far north, in Siberia and Central Asia, and fly south for thousands of kilometres when the cold comes.' },
    { art: ['pt_heron', 'courtier'], who: null,
      hi: 'पहाड़ों को पार करके आए किसी थके हुए पक्षी के लिए सवाल यह नहीं होता कि झील किसने बनाई या कब बनाई। सवाल तो यह होता है: क्या पानी है, क्या खाना है, क्या यहाँ सुकून है? सुखना कहती है—हाँ, हाँ, हाँ। इसलिए वे नीचे उतरते हैं, छप-छप करते हैं, और पूरे मौसम यहीं ठहरते हैं।',
      text: 'To a tired bird that has crossed mountains, the question is not who made a lake or when. The question is: is there water, is there food, is it calm? Sukhna answers yes, yes, yes. So they come down, splash, and stay for the season.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: 'अपनी दादी के साथ झील के रास्ते पर टहलते हुए एक लड़के ने बत्तखों की एक कतार को कागज़ के तीरों की तरह उतरते देखा। "लेकिन झील तो इंसानों ने बनाई है," उसने कहा। "पक्षियों को कैसे पता चलता है कि यह भी काम की है?"',
      text: 'A boy walking the lake path with his grandmother watched a line of ducks land like paper darts. "But the lake is man-made," he said. "How do the birds know it counts?"',
      ask: {
        q: 'Does a made lake count as a real lake?',
        options: ['No — only natural lakes count', 'Yes — the herons have signed off on it', 'Only if it is very old'],
        answer: 1,
        right: 'His grandmother laughed. "Ask the ducks. If the wild things adopt what you made, you made it well."',
        wrong: 'His grandmother pointed at the ducks. "They flew three thousand kilometres and chose it. If the wild things adopt what you made, you made it well."'
      } },
    { art: ['courtier'], who: null,
      hi: 'झील के अपने इंसानी मौसम भी होते हैं। सुबह ठीक छह बजे एक-दूसरे का अभिवादन करते सैर करने वाले लोग। चमकती कतारों में अभ्यास करते नाविक—इस झील में नौकायन की बड़ी-बड़ी प्रतियोगिताएँ हुई हैं। शाम को किनारे पर टहलते और आइसक्रीम खाते लोगों की भीड़, जबकि पहाड़ियाँ बैंगनी रंग में ढलने लगती हैं।',
      text: 'The lake has its human seasons too. Morning walkers who greet each other at six sharp. Rowers training in flashing lines — the lake has hosted big rowing competitions. Evening crowds eating ice cream on the promenade while the hills go purple.' },
    { art: ['pt_heron'], who: null,
      hi: 'और इस सब के बीच, सर्दियों के ये मेहमान बिना किसी बात पर ध्यान दिए पानी में तैरते और डुबकी लगाते रहते हैं, जब तक कि वसंत के किसी दिन मौसम बदल नहीं जाता। फिर वे सब एक साथ ऊपर उठते हैं और उत्तर की ओर, वापस पहाड़ों के पार उड़ चलते हैं, मानो किसी ने ऐसी घंटी बजा दी हो जो सिर्फ़ उन्हें ही सुनाई देती है।',
      text: 'And in the middle of it all, the winter guests bob and dive and pay no attention, until one day in spring the weather turns, and they rise together and head north, back over the mountains, as if someone had rung a bell only they can hear.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'अगर हो सके, तो जनवरी में सूर्योदय के समय जाइए। पानी पर छाया कोहरा, पीछे पहाड़ियाँ, और दुनिया के दूसरे छोर से आए मेहमान किनारे पर पानी में छपछपाते हुए। उस झील के लिए यह बुरा नहीं है, जिसकी शुरुआत सिर्फ़ एक नक़्शे और एक बाँध से हुई थी।',
      text: 'Go at sunrise in January if you can. Mist on the water, the hills behind, and visitors from the other side of the planet dabbling by the bank. Not bad for a lake that began as a drawing and a dam.' }
  ],
  moral: 'Make a kind place and keep it quiet, and guests will find it — some from farther away than you can imagine.',
  source: 'Sukhna Lake, Chandigarh — created in 1958 by damming the Sukhna Choe; kept calm by long-standing bans on power boating; a regular winter halt for migratory waterfowl. A made lake with a modern story, told as such.'
},

{
  id: 'fk.rose-garden',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'A City With Gardens for Rooms',
  hook: 'Most cities have gardens. In Chandigarh it is the other way round: the gardens have a city.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_rabbit'],
  minutes: 3,
  place: ['IN-CH'],
  words_hi: [['गुलाब', 'gulaab', 'rose'], ['माली', 'maali', 'gardener'], ['ख़ुशबू', 'khushboo', 'fragrance']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब योजनाकारों ने चंडीगढ़ का नक़्शा बनाया, तो उन्होंने इसके ठीक बीचों-बीच, एक सेक्टर से दूसरे सेक्टर तक फैली हरियाली की एक पट्टी खींची, और उसके पास एक नियम लिख दिया: यह हमेशा बाग़ ही रहेगा। हमेशा। चाहे कुछ भी हो जाए।',
      text: 'When the planners drew Chandigarh, they drew a ribbon of green running right through the middle of it, sector after sector, and wrote a rule beside it: this stays garden. Forever. No matter what.' },
    { art: ['guard'], who: null,
      hi: 'लोग उसे लेज़र वैली कहते थे, और इसके किनारे-किनारे और चारों तरफ एक के बाद एक कई बगीचे बनते चले गए, हर एक का अपना ही अलग मिज़ाज था — यहाँ तक कि पूरे शहर में बगीचे ऐसे हो गए जैसे किसी घर में कमरे होते हैं।',
      text: 'They called it the Leisure Valley, and along it and around it grew garden after garden, each with its own character — until the city ended up with gardens the way a house has rooms.' },
    { art: ['courtier', 'pt_rabbit'], who: null, mood: 'wow',
      hi: 'सबसे शानदार कमरा है \'रोज़ गार्डन\' — एशिया के सबसे बड़े गुलाब के बगीचों में से एक — जहाँ दूर-दूर तक फैली क्यारियों में सैकड़ों किस्मों के गुलाब खिलते हैं: ऐसे लाल गुलाब जो भीतर से चमकते हुए लगते हैं, सफेद, लगभग काले दिखने वाले, मशहूर हस्तियों के नाम पर रखे गए गुलाब, और ऐसे गुलाब जिनकी खुशबू किसी मिठाई की दुकान जैसी लगती है।',
      text: 'The grandest room is the Rose Garden — one of the largest in Asia — where hundreds and hundreds of kinds of roses grow in great sweeping beds: reds that look lit from inside, whites, near-blacks, roses named after famous people, roses that smell like the inside of a sweet shop.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'वहाँ के एक माली — जो दशकों से इन क्यारियों की देखभाल कर रहे थे — स्कूल के बच्चों से कहना पसंद करते थे: "लोगों को लगता है कि बगीचा सिर्फ फूलों से बनता है। बगीचा तो मेहनत से बनता है। सही हफ्ते में छँटाई करना। सही वक्त पर पानी देना। फूल तो बस बगीचे का \'धन्यवाद\' कहने का तरीका हैं।"',
      text: 'A gardener there — a maali who had tended the beds for decades — liked to tell schoolchildren: "People think the garden is the flowers. The garden is the work. Pruning in the right week. Water at the right hour. The flowers are just the garden saying thank you."' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'हर साल, सर्दियों के आखिर में, शहर में \'रोज़ फेस्टिवल\' मनाया जाता है — लाखों खिले फूलों के बीच लोगों की भीड़, तरह-तरह के मुकाबले और बच्चों की चहल-पहल के दिन। इतने सारे फूल देखकर हैरान एक बच्ची ने बूढ़े माली से पूछा कि सबसे अच्छा गुलाब कौन-सा है।',
      text: 'Every year, at the end of winter, the city throws its Rose Festival — days of crowds, competitions and children among a million blooms. One girl, overwhelmed, asked the old maali which rose was the best one.',
      ask: {
        q: 'Hundreds of varieties, one question: which rose is the best?',
        options: ['The biggest red one', 'The rarest one', 'Whichever one you stopped in front of'],
        answer: 2,
        right: '"The one that stopped you," said the maali. "A rose\'s whole job is to stop somebody. That one did its job on you."',
        wrong: 'The maali shook his head at rankings. "Whichever one stopped you. A rose\'s whole job is to stop somebody. That one did its job on you."'
      } },
    { art: ['courtier'], who: null,
      hi: 'यहाँ कुछ और भी अनोखे कमरे हैं। सिर्फ कैक्टस का एक बगीचा। बोगनवेलिया का एक बगीचा, जो हर बसंत में बैंगनी लपटों की तरह दमक उठता है। जड़ी-बूटियों का एक बगीचा। और एक सीढ़ीदार बगीचा, जो शाम की रोशनी को किसी प्याले की तरह सहेज लेता है।',
      text: 'There are stranger rooms too. A garden only of cactuses. A bougainvillea garden that goes up in purple flames every spring. A garden of medicinal herbs. A terraced garden that holds evening light like a bowl.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और इन सबके पीछे एक ऐसी फ़ौज है जिसके लिए कोई तालियाँ नहीं बजाता: शहर के माली, जो पानी के पाइप और कैंची लेकर सुबह तड़के ही निकल पड़ते हैं, और कागज़ पर किए गए उस वादे को निभा रहे हैं जो उनमें से ज़्यादातर के पैदा होने से भी पहले किया गया था।',
      text: 'And behind all of them, an army nobody claps for: the city\'s gardeners, out at dawn with hoses and secateurs, keeping a promise made on paper before most of them were born.' },
    { art: ['pt_rabbit'], who: 'mithu',
      hi: '"अगर तुम गुलाबों के मौसम में — फ़रवरी, मार्च में — चंडीगढ़ जाओ, तो जाना और किसी गुलाब के पास ज़रूर ठहरना। फिर किसी माली को ढूँढ़ना और उससे उसका नाम पूछना। उन्हें हमेशा पता होता है, और कोई उनसे पूछे तो उन्हें हमेशा बड़ी ख़ुशी होती है।"',
      text: 'If you visit Chandigarh in rose season — February, March — go and let one stop you. Then find a maali and ask its name. They always know, and they are always pleased to be asked.' }
  ],
  moral: 'A beautiful city is not built once. It is gardened, every single morning, by people keeping an old promise.',
  source: 'The Zakir Hussain Rose Garden (opened 1967, among Asia\'s largest, with hundreds of varieties), the Leisure Valley and Chandigarh\'s annual Rose Festival — the living garden culture of a planned city, told as it is today.'
},

{
  id: 'fk.village-before',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'The Villages Under the Sectors',
  hook: 'Before the sectors had numbers, this land had names. Some of the names are still here, hiding inside the city — and so are some of the villages.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_bull'],
  minutes: 4,
  place: ['IN-CH'],
  words_hi: [['गाँव', 'gaon', 'village'], ['खेत', 'khet', 'field'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'चंडीगढ़ के एक लड़के ने एक बार अपनी परदादी से वही सवाल पूछा जो किसी नए शहर का हर बच्चा कभी न कभी पूछता ही है: "यहाँ पहले क्या था?" उन्होंने एक पल के लिए उसे देखा, फिर फ़्लैट के फ़र्श की तरफ़ इशारा किया। "इसके नीचे? गेहूँ," उन्होंने कहा। "जहाँ तुम्हारा बिस्तर है, वहाँ मैंने गेहूँ काटा है।"',
      text: 'A boy in Chandigarh once asked his great-grandmother the question every child of a new city asks eventually: "What was here before?" She looked at him for a moment, then pointed at the floor of the flat. "Under this? Wheat," she said. "I have cut wheat where your bed is."' },
    { art: ['pt_bull', 'courtier'], who: null,
      hi: '"शहर बनने से पहले, यह पहाड़ियों के नीचे की खेती की ज़मीन थी — पुराने नामों वाले दूर-दूर बसे कुछ गाँव, आम के बाग़, कुएँ, मवेशी, और सर्दियों में सुनहरी होती सरसों के खेत। लोग यहाँ कई-कई पीढ़ियों से रहते और खेती करते आए थे।"',
      text: 'Before the city, this was farmland below the hills — a scatter of villages with old names, mango groves, wells, cattle, mustard going gold in winter. People had lived and farmed here for generations upon generations.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: '"और फिर शहर आया, और सच तो यह कहना ही पड़ेगा: गाँव वालों के लिए यह बिल्कुल भी आसान नहीं था। नई राजधानी के लिए जो ज़मीन चुनी गई, वह उन्हीं की ज़मीन थी। वे खेत, जिन्होंने सदियों से परिवारों का पेट भरा था, नापे गए, ले लिए गए और उन पर इमारतें बना दी गईं। कई गाँव दूसरी जगह हटा दिए गए। लोगों को पैसे तो मिले, लेकिन खेत सिर्फ़ पैसा नहीं होता, और यह बात हर कोई जानता था।"',
      text: 'And then the city came, and it must be said honestly: for the villagers, it did not come gently. The land for the new capital was their land. Fields that had fed families for centuries were measured, acquired and built over. Many villages were moved. People were paid, but a field is not only money, and everyone knew it.' },
    { art: ['courtier'], who: 'courtier',
      hi: '“एक ही हफ़्ते में हमें गर्व भी हुआ और दुख भी,” परदादी ने कहा। “उन्होंने हमें भविष्य के चित्र दिखाए। जो आप खो रहे हैं, उसकी तस्वीर कोई नहीं बनाता।”',
      text: '"We were proud and we were sad in the same week," the great-grandmother said. "They showed us drawings of the future. Nobody draws you a picture of what you are losing."' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"लेकिन सब कुछ ख़त्म नहीं हुआ। कुछ गाँव तो कभी तोड़े ही नहीं गए—बस उनके चारों तरफ़ सेक्टर बना दिए गए। आज भी अगर आप चंडीगढ़ के किसी बाज़ार की सही गली से होकर निकलें, तो सड़कों का यह ग्रिड अचानक रुक जाता है: गलियाँ सँकरी और घुमावदार हो जाती हैं, घर एक-दूसरे से सट जाते हैं, और आप एक ऐसे गाँव में पहुँच जाते हैं जो अपने चारों ओर बसे इस शहर से भी पुराना है।"',
      text: 'But not everything vanished. Some villages were never demolished at all — the sectors were simply drawn around them. Walk through the right gap in a Chandigarh market today and the grid suddenly stops: lanes narrow and bend, houses lean together, and you are in a village older than the city wrapped around it.',
      ask: {
        q: 'A crooked old village lane, alive inside a perfectly straight planned city. What is it?',
        options: ['A mistake the planners missed', 'The land\'s memory, still being lived in', 'A museum nobody visits'],
        answer: 1,
        right: 'Places like Burail and Attawa are not exhibits — people live, cook, argue and celebrate there. The old land is still being lived on, inside the new.',
        wrong: 'It is no mistake and no museum. Places like Burail and Attawa are lived-in villages — the old land still being lived on, inside the new.'
      } },
    { art: ['courtier'], who: null,
      hi: '"पुराने नाम भी बचे हुए हैं, बस स्टॉप और बाज़ार के बोर्डों पर, चुपचाप नंबरों से आगे टिके हुए। और यहाँ-वहाँ किसी कार पार्किंग में बरगद या आम का कोई पुराना पेड़ बाकी सब चीज़ों से ज़रा हटकर एक अजीब से कोण पर खड़ा है — क्योंकि वह वहाँ पहले आया था, और शहर का बड़प्पन देखिए कि वह उसके किनारे से होकर गुज़र गया।"',
      text: 'The old names survive too, on bus stops and market boards, quietly outlasting the numbers. And here and there an ancient banyan or mango tree stands in a car park at a strange angle to everything — because it was there first, and the city, to its credit, went around it.' },
    { art: ['guard'], who: null,
      hi: '"लड़के ने ध्यान दिया कि परदादी को दया नहीं चाहिए थी। वह बस चाहती थीं कि उसे पता रहे। "शहर तो अच्छा शहर है," उन्होंने कहा। "लेकिन जब तुम सेक्टर 22 में चलो, तो किसी मेहमान की तरह चलना। उसके नीचे किसी के खेत दबे हैं।""',
      text: 'The great-grandmother did not want pity, the boy noticed. She wanted him to know. "The city is a good city," she said. "But when you walk in Sector 22, walk like a guest. Somebody\'s fields are under there."' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर आपका परिवार चंडीगढ़ से है — या किसी भी शहर से — तो अपने सबसे बुज़ुर्ग इंसान से पूछिए कि जहाँ आज आपका घर है, वहाँ पहले क्या था। कई परिवारों के जवाब में कोई खेत, कोई गाँव या कोई पेड़ निकल आता है। हर शहर किसी के \'पहले\' पर खड़ा होता है।"',
      text: 'If your family is from Chandigarh — or from any city — ask the oldest person you know what stood where your home is now. In many families there is a field, a village, a tree in that answer. Every city stands on somebody\'s before.' }
  ],
  moral: 'A new city is built on old ground. Knowing what was there before is not sadness — it is manners.',
  source: 'The villages of the Chandigarh site — some acquired and moved for the capital in the 1950s, others like Burail and Attawa still inhabited inside the sector grid today. Modern living memory, told honestly; ask your family is the real source here.'
},

{
  id: 'fk.chandi-name',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'The Goddess the City Is Named For',
  hook: 'Chandigarh is one of India\'s newest cities. Its name is one of the oldest things about it.',
  hero: 'durga',
  cast: ['durga', 'courtier', 'guard'],
  minutes: 3,
  place: ['IN-CH'],
  words_hi: [['नाम', 'naam', 'name'], ['देवी', 'devi', 'goddess'], ['गढ़', 'garh', 'fort']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर नाम एक छोटी सी कहानी होती है, जो तह करके रखी गई हो। चंडीगढ़ को ही लीजिए और उसकी तहें खोलिए: चंडी-गढ़। यानी चंडी का किला। कंक्रीट और गोल चक्करों का एक बिल्कुल नया शहर, जो एक देवी का नाम लिए हुए है।"',
      text: 'Every name is a little story folded up small. Take Chandigarh and unfold it: Chandi-garh. The fort of Chandi. A brand-new city of concrete and roundabouts, carrying the name of a goddess.' },
    { art: ['durga'], who: null,
      hi: '"चंडी, देवी का एक उग्र और रक्षा करने वाला रूप हैं — वही महान देवी जिन्हें कई लोग दुर्गा के नाम से भी जानते हैं। इस इलाके की पहाड़ियों और मैदानों में सदियों से उन्हें पूजा और याद किया जाता रहा है: वही देवी, जिनके पास आप तब जाते हैं जब किसी मुश्किल का सामना करना हो।"',
      text: 'Chandi is a fierce and protective form of the Devi — the great Goddess whom many also know as Durga. In the hills and plains of this region she has been loved and called on for centuries: the one you go to when something must be faced.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"शहर से थोड़ी ही दूर, जहाँ मैदान शिवालिक की पहाड़ियों से मिलते हैं, उनका पुराना मंदिर है — चंडी मंदिर। यह मंदिर तब से वहाँ था, जब किसी ने सेक्टरों का सपना भी नहीं देखा था। तीर्थयात्री पैदल चलकर यहाँ आते थे, जब यह सब कुछ सिर्फ़ खेत हुआ करता था।"',
      text: 'A little way from the city, where the plains meet the Shivalik hills, stands her old temple — the Chandi Mandir. It was there long before anyone dreamed of sectors. Pilgrims walked to it when all this was fields.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'जब पास ही नई राजधानी बनने लगी, तो उसे एक नाम की ज़रूरत थी। और कोई नया-चमकीला नाम गढ़ने के बजाय, शहर ने वही नाम अपना लिया जो उस ज़मीन का पहले से था — यह इलाका बहुत पहले से देवी के मंदिर के नाम से जाना जाता था।',
      text: 'When the new capital rose nearby, it needed a name. And rather than inventing something shiny, the city took the name the land already had — the area had long been known by the goddess\'s temple.',
      ask: {
        q: 'A futuristic planned city takes its name from an old temple nearby. What does that choice say?',
        options: ['They ran out of ideas', 'The new city wanted roots as well as plans', 'Temples were fashionable that year'],
        answer: 1,
        right: 'A drawing can give you streets, but only the land can give you a name. The newest city in India chose to be anchored by the oldest thing around.',
        wrong: 'It was no shortage of ideas. A drawing can give you streets, but only the land can give you a name — the new city chose to be anchored by the oldest thing around.'
      } },
    { art: ['durga', 'courtier'], who: null,
      hi: 'तो इस तरह भविष्य का यह शहर, नाम के हिसाब से, देवी का किला ही है। इस इलाके के कई परिवारों में, खासकर नवरात्रि पर चंडी की पूजा होती है, जब नौ रातों तक उनकी शक्ति का उत्सव मनाया जाता है — हालांकि हर परिवार का अपना अलग तरीका होता है। अपने परिवार से पूछो कि उनके यहाँ क्या रिवाज़ है।',
      text: 'So the city of the future is, by name, the goddess\'s fort. In many families of the region, Chandi is honoured especially at Navratri, when her strength is celebrated for nine nights — though every family keeps its own way. Ask your family what they keep.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'लोग कहते हैं, इसमें कुछ बहुत सटीक बात है। एक मुश्किल दौर के बाद हिम्मत से बसाया गया शहर, जिसका नाम उस देवी पर रखा गया जिन्हें किसी चुनौती का सामना करते वक्त याद किया जाता है। शहर की योजना बनाने वालों ने यह सोचा था या नहीं, पर नाम ने यह बात पूरी कर दी।',
      text: 'There is something fitting in it, people say. A city built from courage after a hard year, named for the goddess you call on when something must be faced. Whether the planners thought of that or not, the name did.' },
    { art: ['guard'], who: null,
      hi: 'वह मंदिर आज भी वहीं है, और श्रद्धालु आज भी वहाँ जाते हैं — अब तो शहर की बसें भी लगभग पूरे रास्ते तक जाती हैं। सबसे नया शहर और प्राचीन देवी, दोनों आपस में बड़े अच्छे पड़ोसी बन गए हैं।',
      text: 'The temple still stands, and pilgrims still go — now with the city\'s buses running most of the way. The newest city and the old goddess have settled into being neighbours.' },
    { art: ['durga'], who: 'mithu',
      hi: 'कभी अपने शहर के नाम की परतें खोलकर देखना। भारत में लगभग हर जगह के नाम के भीतर कोई न कोई कहानी छिपी होती है — किसी देवी की, नदी की, उपवन की या किसी संस्थापक की। चंडीगढ़ तो बस अपनी कहानी को ऐसे खुलकर रखता है कि हर कोई उसे पढ़ सके।',
      text: 'Unfold the name of your own town sometime. Almost every place name in India has a story pressed inside it — a goddess, a river, a grove, a founder. Chandigarh just wears its story where everyone can read it.' }
  ],
  moral: 'Even the newest place stands on an old name — and a name is the land\'s own memory.',
  source: 'Chandigarh takes its name from the Chandi Mandir, the temple of the goddess Chandi (a form of Durga) at the foot of the Shivaliks nearby, which long predates the city. The goddess is presented here as her devotees know her. The naming is modern civic history; the devotion is living and old.'
},

{
  id: 'fk.tree-streets',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya-shehar',
  badge: 'aaj',
  title: 'The City That Planted Its Own Calendar',
  hook: 'In Chandigarh you can tell the month without a calendar. You look at which streets have caught fire — in yellow, or red, or purple.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_monkey'],
  minutes: 3,
  place: ['IN-CH'],
  words_hi: [['पेड़', 'ped', 'tree'], ['फूल', 'phool', 'flower'], ['रंग', 'rang', 'colour']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब चंडीगढ़ की योजना बनी, तो पेड़ों की भी पूरी योजना बनाई गई — और यूँ ही नहीं। योजनाकारों ने हर सड़क के लिए सोच-समझकर पेड़ों की किस्में चुनीं, जैसे कोई चित्रकार अपनी रंग-पेटी से रंग चुनता है, और हर सड़क पर एक ही किस्म के हज़ारों पेड़ लगाए, इससे पहले कि कई घरों पर छतें भी पड़ पातीं।',
      text: 'When Chandigarh was planned, the trees were planned too — and not casually. The planners chose species avenue by avenue, like an artist choosing colours from a paintbox, and planted each road with its own kind of tree, thousands of them, before many of the houses even had roofs.' },
    { art: ['guard'], who: null,
      hi: 'बरसों तक वह नया शहर किसी नर्सरी में खड़े शहर जैसा लगता था — हर सड़क पर खूँटियों से बँधे पतले-दुबले पौधे, जिनकी छाया इतनी कम थी कि रूमाल में समेट लो। लोग उन्हें पानी देते और इंतज़ार करते।',
      text: 'For years the young city looked like a city standing in a nursery — thin saplings tied to stakes down every avenue, casting shade you could fold into a handkerchief. People watered them and waited.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'फिर पेड़ बड़े हुए, और पूरी योजना सामने आ गई। मई में अमलतास वाली सड़कें झूलते हुए सोने जैसी बन जाती हैं, मानो पूरी सड़क से पीला रंग टपक रहा हो। गर्मियों में गुलमोहर सुर्ख लाल हो जाते हैं। बसंत में सेमल पक्षियों के लिए बड़े-बड़े लाल प्याले थाम लेता है, और जकारंदा पर बैंगनी धुंध छा जाती है।',
      text: 'Then the trees grew up, and the plan revealed itself. In May, the amaltas avenues turn to hanging gold, whole streets dripping yellow. In summer the gulmohars go scarlet. In spring the semal holds out big red cups for the birds, and the jacarandas haze over in purple.' },
    { art: ['pt_monkey', 'courtier'], who: null,
      hi: 'क्योंकि हर सड़क पर एक खास किस्म का पेड़ है, इसलिए हर सड़क की अपनी बहार का एक महीना होता है — इस तरह पूरा शहर साल भर, एक-एक इलाक़ा करके, धीरे-धीरे अपने रंग बदलता रहता है। पक्षी और बंदर यह टाइम-टेबल किसी से भी बेहतर जानते हैं।',
      text: 'Because each avenue has its own species, each avenue has its own month of glory — so the city changes colour in slow waves, one neighbourhood at a time, all year round. The birds and the monkeys know the timetable better than anyone.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: 'सोने की छत जैसी सड़क के नीचे साइकिल से स्कूल जाती एक बच्ची ने अपने पिताजी से पूछा कि किसी ने ऐसी योजना क्यों बनाई होगी, जब पहली अच्छी बहार आने से पहले ही योजना बनाने वाले खुद बूढ़े हो चुके होंगे।',
      text: 'A girl cycling to school under a gold-roofed avenue asked her father why anyone would plan a thing like that, when the planners themselves would be old before the first good bloom.',
      ask: {
        q: 'The planners planted trees whose full beauty they might never see. Why?',
        options: ['They forgot how slowly trees grow', 'They were planting for people not born yet', 'Saplings were cheap'],
        answer: 1,
        right: '"For us," said her father. "You are cycling through somebody\'s gift to a stranger. That is what planting a tree is."',
        wrong: 'Planners of all people knew how slowly trees grow. "They planted for people not born yet," said her father. "You are cycling through a gift to a stranger."'
      } },
    { art: ['courtier'], who: null,
      hi: 'यह शहर अपने पेड़ों की हिफ़ाज़त वैसे ही करता है जैसे दूसरे शहर अपनी ऐतिहासिक इमारतों की करते हैं। किसी एक को भी काटना बहुत गंभीर बात है; किसी भले पुराने पेड़ के लिए सड़कों तक को मुड़ते देखा गया है। चंडीगढ़ खुद को \'द सिटी ब्यूटीफुल\' कहता है, और सब जानते हैं कि इसकी आधी वजह ये पेड़ ही हैं।',
      text: 'The city guards its trees the way other cities guard monuments. Cutting one is a serious matter; roads have been known to bend around a good old tree. Chandigarh calls itself the City Beautiful, and everyone knows the trees are half the reason.' },
    { art: ['pt_monkey', 'guard'], who: null,
      hi: 'और यह योजना बिना किसी के कहे यूँ ही चलती रहती है। तोते अपना पूरा साल सेमल के हिसाब से तय करते हैं। स्कूल के बच्चे जान जाते हैं कि उनकी अपनी सड़क किस महीने सुनहरी होगी। हर मानसून में अब भी नए पौधे लगाए जाते हैं, खूँटियों से बँधे, रूमाल जितनी छाया देते हुए — अगले पचास साल, जो आज ही रोप दिए गए हैं।',
      text: 'And the plan keeps working without being asked. Parakeets budget their year around the semal. Schoolchildren learn which month their own street turns gold. New saplings still go in every monsoon, tied to their stakes, casting handkerchief shade — the next fifty years, already planted.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर तुम कभी मई के महीने में वहाँ जाओ, तो अमलतास के पेड़ों वाली कोई सड़क ढूँढना और हवा चलने पर उसके नीचे खड़े हो जाना। वहाँ पीली पंखुड़ियों की बर्फ़ सी गिरती है। चंडीगढ़ के किसी इंसान से पूछ कर देखना कि फूलों का सबसे अच्छा महीना कौन-सा होता है — और फिर आराम से बैठ जाना, क्योंकि हर किसी की अपनी ही राय होती है।"',
      text: 'If you are ever there in May, find an amaltas avenue and stand under it when the wind moves. It snows yellow petals. Ask someone from Chandigarh which flowering month is best — and settle in, because they all have opinions.' }
  ],
  moral: 'Plant something whose shade you will never sit in. Someone will cycle through it and be glad.',
  source: 'Chandigarh\'s planned avenue plantation — species chosen avenue by avenue by the city\'s planners and horticulturists from the 1950s onward (amaltas, gulmohar, semal, jacaranda and many more), still maintained and protected today. Modern civic tradition, told as it lives.'
},

/* ==================================================== HIMACHAL PRADESH ====== */

{
  id: 'fk.kullu-dussehra',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'The Festival Where the Gods Travel',
  hook: 'In most places, people travel to the gods. In the Kullu valley, once a year, the gods travel — hundreds of them, carried on shoulders down the mountain roads.',
  hero: 'rama',
  cast: ['rama', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['देवता', 'devta', 'deity'], ['पालकी', 'paalki', 'palanquin'], ['मेला', 'mela', 'fair']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हिमाचल की कुल्लू घाटी में, लगभग हर गाँव के अपने एक देवता होते हैं — अपने ईष्टदेव, जो गाँव के मंदिर में रहते हैं, गाँव का हर हाल-चाल जानते हैं, और किसी समझदार बुज़ुर्ग की तरह उनसे सलाह ली जाती है। यह कोई बहुत पुरानी कहानी नहीं है। आज भी यह घाटी ऐसे ही चलती है।',
      text: 'In the Kullu valley of Himachal, nearly every village has its own devta — its own deity, who lives in the village temple, knows the village\'s business, and is consulted like a wise elder. This is not a story from long ago. It is how the valley works today.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'और साल में एक बार, जब दशहरा आता है, तो कुछ ऐसा होता है जो इतने बड़े पैमाने पर दुनिया में कहीं और नहीं होता: देवता यात्रा पर निकलते हैं। हर देवता अपने गाँव से एक पालकी — यानी रथ — में सवार होकर निकलते हैं, जो चाँदी के मुखौटों और गेंदे के फूलों से चमक रहा होता है, और जिसे गाँव वाले अपने कंधों पर उठाकर चलते हैं।',
      text: 'And once a year, when Dussehra comes, something happens that happens nowhere else on this scale: the devtas travel. Each one sets out from its village in a palanquin — a rath — gleaming with silver masks and marigolds, carried on the shoulders of its own villagers.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'पहाड़ी रास्तों से उतरते हुए वे आते हैं, दर्जनों के दर्जनों, जिनमें से कुछ तो कई दिनों तक पैदल चलते हैं — आगे-आगे बजते ढोल, गूँजते हुए नरसिंगे, झूलती हुई पालकी — और खेतों में काम करने वाले लोग हाथ रोककर अपने पड़ोसियों के देवताओं को गुज़रते हुए देखने लगते हैं।',
      text: 'Down the mountain paths they come, dozens upon dozens of them, some walking for days — drums in front, horns crying out, the palanquin swaying — while the fields stop work to watch their neighbours\' gods go by.' },
    { art: ['rama'], who: null,
      hi: 'वे सब एक ही जगह जा रहे होते हैं: कुल्लू का बड़ा मैदान, रघुनाथ-जी के दर्शन करने — भगवान राम, जिन्हें यह घाटी इसी नाम से जानती है — जिनका अपना रथ लंबी रस्सियों से भीड़ के बीच खींचा जाता है, और हर कोई उस रस्सी को एक बार छूना चाहता है।',
      text: 'They are all going to the same place: the great maidan at Kullu, to visit Raghunath-ji — Lord Rama as this valley knows him — whose own chariot is drawn through the crowds by long ropes that everyone wants a hand on.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'think',
      hi: 'और इसका एक खास नियम होता है जो इस घाटी का हर बच्चा सीखता है। यह उत्सव यूँ ही शुरू नहीं हो जाता। वह इंतज़ार करता है — मनाली के ऊपर देवदार के जंगलों से आने वाले एक खास मेहमान का।',
      text: 'And there is an order to it that every child of the valley learns. The festival does not simply start. It waits — for one particular guest from the cedar woods above Manali.',
      ask: {
        q: 'Hundreds of devtas assemble, and still the festival waits. Who must arrive before Kullu Dussehra can begin?',
        options: ['The king of Kullu', 'Hadimba Devi, the grandmother from the cedar wood', 'The oldest drummer'],
        answer: 1,
        right: 'Hadimba. The festival of a whole valley does not begin until the grandmother arrives. If you know her story, you know why nobody argues.',
        wrong: 'Not the king — the king himself waits. It is Hadimba Devi, the grandmother from the cedar wood, and the festival of a whole valley does not begin until she arrives.'
      } },
    { art: ['courtier'], who: null,
      hi: 'एक हफ्ते तक वह मैदान देवताओं और उनके मेहमानों का शहर बन जाता है। देवता कतारों में विराजते हैं और किसी शादी में आए रिश्तेदारों की तरह एक-दूसरे से मिलने जाते हैं। उनके चारों तरफ मेला सजता है — शॉल बेचने वाले, गन्ने का रस निकालने वाले, बड़े-बड़े झूले और मानो आधा हिमाचल वहाँ उमड़ पड़ा हो।',
      text: 'For a week the maidan becomes a city of gods and their guests. The devtas are set up in rows, visiting each other like relatives at a wedding. Around them swirls the mela — shawl sellers, sugar-cane crushers, giant wheels, and half of Himachal.' },
    { art: ['guard'], who: null,
      hi: '"लोग कहते हैं कि वहाँ देवता अपने पुराने दोस्तों से मिलते हैं। गाँव वाले तो ज़रूर मिलते हैं। उस मैदान पर, पालकियों के बीच मचे शोर-शराबे में शादियाँ तय हुई हैं, झगड़े सुलझे हैं और बिछड़े हुए भाई-बहन मिले हैं।"',
      text: 'People say the devtas meet old friends there. Villagers certainly do. Marriages have been arranged, quarrels patched, and lost cousins found on that maidan, in the noise between the palanquins.' },
    { art: ['courtier'], who: null,
      hi: '"फिर, जब सब पूरा हो जाता है, तो घाटी उल्टे क्रम में खाली होने लगती है: हर देवता को फिर से कांधे पर उठाया जाता है और आगे-आगे बजते ढोलों के साथ, अपने-अपने पहाड़ पर घर वापस ले जाया जाता है, अगले साल तक के लिए।"',
      text: 'Then, when it is done, the valley empties in reverse: every devta is shouldered again and carried home up its own mountain, drums going before it, until next year.' },
    { art: ['rama'], who: 'mithu',
      hi: '"कुल्लू दशहरा तब शुरू होता है जब बाकी पूरे भारत में दशहरा खत्म होता है — और यहाँ न तो कोई पुतला होता है और न ही उसे जलाया जाता है। बस पूरी घाटी अपने देवताओं को एक मिलन के लिए साथ लेकर चलती है, जैसे वह सैकड़ों सालों से करती आई है। अगर तुम्हें कभी मौका मिले, तो जाकर रस्सियों के पास खड़े होना।"',
      text: 'Kullu Dussehra begins when Dussehra ends everywhere else in India — and there is no effigy and no burning here. Just the valley walking its gods to a meeting, the way it has for hundreds of years. If you ever get the chance, go and stand near the ropes.' }
  ],
  moral: 'In the mountains, faith is not a place you visit. It is a neighbour who travels with you.',
  source: 'Kullu Dussehra — the annual assembly of the village devtas of the Kullu valley around Raghunath-ji, held on the Dhalpur maidan since the seventeenth century and thriving today. The devta system and Hadimba\'s precedence are living valley tradition; see also the Hadimba story in the previous tranche.'
},

{
  id: 'fk.gaddi-dog',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'katha',
  title: 'The Shepherd\'s Other Shepherd',
  hook: 'A Gaddi shepherd counts his sheep every night. One terrible night the count came up one short — and so did another count he had not thought to make.',
  hero: 'pt_jackal',
  cast: ['pt_jackal', 'courtier', 'pt_deer'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['भेड़', 'bhed', 'sheep'], ['कुत्ता', 'kutta', 'dog'], ['बर्फ़', 'barf', 'snow']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"गद्दी हिमाचल के चरवाहे हैं, जो भरमौर और कांगड़ा के आसपास धौलाधार के इलाके से आते हैं। साल में दो बार वे अपने रेवड़ों को ऊँचे दर्रों के पार ले जाते हैं — गर्मियों में ऊपर चरागाहों की तरफ, और बर्फबारी से पहले नीचे — महीनों तक लगातार चलते-फिरते ही बसर करते हुए।"',
      text: 'The Gaddis are the shepherd people of Himachal, from the Dhauladhar country around Bharmour and Kangra. Twice a year they walk their flocks over the high passes — up to the summer meadows, down before the snow — living for months on the move.' },
    { art: ['courtier', 'pt_jackal'], who: null,
      hi: '"एक गद्दी चरवाहा दो साथियों के साथ चलता है: उसका रेवड़, और उसका कुत्ता। वह कुत्ता कोई पालतू जानवर नहीं है। वह तो उसका एक साथी है — घने बालों वाला एक बड़ा और शांत पहाड़ी कुत्ता, जो रास्ता पहचानता है, हर भेड़ को उसकी गंध से पहचानता है, और जब चरवाहा सोता है, तो रात भर पहरा देता है।"',
      text: 'A Gaddi shepherd walks with two companions: his flock, and his dog. The dog is not a pet. He is a colleague — a big, calm, heavy-coated mountain dog who knows the route, knows every sheep by smell, and takes the night watch while the shepherd sleeps.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"यह कहानी ऐसी ही एक जोड़ी की है। चरवाहा साल के बहुत आखिर में दर्रा पार कर रहा था — बहुत ही देर से, जैसा कि बुज़ुर्ग सिर हिलाकर कहते — तभी दर्रे पर मौसम अचानक बदल गया, जैसा कि वहाँ होता ही है: पहले धूप, फिर हवा, और फिर भरी दोपहर में ही बर्फ की एक सफ़ेद दीवार।"',
      text: 'This tale is told of one such pair. The shepherd was crossing late in the year — too late, the old people would say, shaking their heads — when the weather turned on the pass, the way it does: sunshine, then wind, then a white wall of snow with the afternoon still in it.' },
    { art: ['pt_deer', 'courtier'], who: null, mood: 'sad',
      hi: 'वह भेड़ों के झुंड को दर्रे के नीचे बाड़े में सुरक्षित ले आया और हर रात की तरह सुन्न पड़ चुके होंठों से दरवाज़े पर उन्हें गिनने लगा। पर गिनती में एक कम निकला। एक मेमना — वही छोटा वाला, जो सबसे बाद में जन्मा था। ऊपर कहीं उस तूफ़ान में।',
      text: 'He got the flock down to shelter below the pass, counting them through the gate of the fold with numb lips the way he did every night. And the count came up one short. A lamb — the late-born one, the small one. Somewhere up there in the storm.' },
    { art: ['courtier', 'pt_jackal'], who: null, mood: 'think',
      hi: 'बर्फ़ के साथ-साथ रात भी घिरती जा रही थी। वापस ऊपर जाने का मतलब था अपनी जान जोखिम में डालना। न जाने का मतलब था मेमने की जान जाना। वह बाड़े के दरवाज़े पर कशमकश में खड़ा रहा — और तभी उसे एहसास हुआ कि वह वहाँ अकेला है। कुत्ता उसके साथ नहीं था।',
      text: 'Night was coming down with the snow. Going back up meant risking his life. Not going meant the lamb\'s. He stood in the doorway of the shelter, torn — and then realised he was alone in it. The dog was not at his side.',
      ask: {
        q: 'Where is the dog?',
        options: ['Asleep by the fire, storm or no storm', 'Already gone back up the mountain', 'Hiding from the thunder'],
        answer: 1,
        right: 'Already gone. Nobody had told him to. Nobody had counted for him. He had done his own count, and left.',
        wrong: 'Not asleep, and afraid of nothing. He was already gone, back up into the storm. Nobody had told him to — he had done his own count, and left.'
      } },
    { art: ['pt_jackal'], who: null,
      hi: 'पूरी रात तूफ़ान बाड़े से टकराता रहा, और गड़ेरिया लालटेन लिए दरवाज़े के पास जागता बैठा रहा। वह हवा के थपेड़ों को सुनता रहा और बीतते हर पहर से नफ़रत करता रहा।',
      text: 'All night the storm leaned on the shelter, and the shepherd sat awake by the door with a lamp, listening to the wind and hating every hour of it.' },
    { art: ['pt_jackal', 'pt_deer'], who: null, mood: 'wow',
      hi: 'सुबह के धुंधलके में वह ऊपर गया — और दर्रे के ठीक नीचे एक झुकी हुई चट्टान की आड़ में उसने उन्हें ढूँढ़ निकाला: बर्फ़ का एक ढेर, उस ढेर में बनी एक खोह, और उस खोह में वह मेमना, बिल्कुल सुरक्षित, गरमा-गरम और थोड़ा झल्लाया हुआ, कुत्ते के घने रोएँ में दुबका बैठा था, जो उसके इर्द-गिर्द धड़कती हुई दीवार की तरह घेरा बनाकर बैठा हुआ था।',
      text: 'At grey first light he went up — and found them under a leaning rock just below the pass: a snowdrift, a hollow in the snowdrift, and in the hollow the lamb, warm and cross and completely unharmed, pressed into the deep coat of the dog, who had curled around it like a wall with a heartbeat.' },
    { art: ['courtier', 'pt_jackal'], who: 'courtier',
      hi: 'कुत्ता उठ खड़ा हुआ, उसने अपने ऊपर से बर्फ़ झाड़ी, और गड़ेरिये की तरफ़ ऐसे मुँह बनाकर देखा जैसे कह रहा हो: तुम देर से आए। फिर वह उन सबसे आगे-आगे बाड़े की तरफ़ चल दिया, मानो यह सब तो बस उसका रोज़ का काम था। जो कि, उसके लिए, सच में था।',
      text: 'The dog stood up, shook off a small avalanche, and looked at the shepherd with a face that said: you are late. Then he walked down to the fold ahead of them, as if the whole thing were simply the job. Which, to him, it was.' },
    { art: ['pt_jackal'], who: 'mithu',
      hi: 'गद्दी गड़ेरिये ऐसी बहुत-सी कहानियाँ सुनाते हैं, और वे आपको साफ़-साफ़ यह भी बताएँगे: ये कहानियाँ सिर्फ़ कहानियाँ नहीं हैं। उन दर्रों से गुज़रे किसी भी इंसान से पूछिए कि उस कुत्ते की क्या कीमत है। वे यह नहीं कहते "बहुत ज़्यादा।" वे कहते हैं: वह हममें से ही एक है।',
      text: 'Gaddi shepherds tell many stories like this one, and they will also tell you plainly: the stories are barely stories. Ask anyone who has walked the passes what the dog is worth. They do not say "a lot." They say: he is one of us.' }
  ],
  moral: 'The truest guardians do not wait to be asked. They keep their own count.',
  source: 'Shepherd lore of the Gaddi pastoral community of Himachal Pradesh, whose flocks and famous mountain dogs still cross the Dhauladhar passes each season. Oral tradition with no single collector — tales of the night-watch dog are told in many versions around Gaddi fires, and this telling follows their common shape.'
},

{
  id: 'fk.vipasha',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'katha',
  title: 'The River That Unties Knots',
  hook: 'The Beas has an older name: Vipasha — the one who unbinds. It earned that name, the old story says, one knot at a time.',
  hero: 'courtier',
  cast: ['courtier', 'pt_heron'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['नदी', 'nadi', 'river'], ['रस्सी', 'rassi', 'rope'], ['आज़ाद', 'azaad', 'free']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: '"ब्यास नदी हिमाचल के ऊंचे पहाड़ों में, रोहतांग दर्रे के पास जन्म लेती है, और पंजाब के मैदानों के अपने लंबे रास्ते पर कुल्लू घाटी से होकर कलकल बहती, हरी-भरी और ठंडी-ठंडी नीचे उतरती है। इतनी पुरानी नदियां सिर्फ पानी ही नहीं बहातीं। वे अपने साथ नाम भी लेकर चलती हैं।"',
      text: 'The Beas is born high in the mountains of Himachal, near the Rohtang pass, and comes down through the Kullu valley loud and green and cold, on its long way to the plains of Punjab. Rivers this old carry more than water. They carry names.' },
    { art: ['courtier'], who: null,
      hi: '"और ब्यास के पास दो नाम हैं। एक नाम ऋषि व्यास की याद दिलाता है, जिनके बारे में कहा जाता है कि वे इसके झरनों के पास रहते थे और तपस्या करते थे। लेकिन पुराना नाम और भी अनोखा और सुंदर है: विपाशा। इसका मतलब कुछ ऐसा है जैसे बंधनों से मुक्त करने वाली — जो गांठे खोल दे।"',
      text: 'And the Beas carries two. One remembers the sage Vyas, who is said to have lived and meditated by its springs. But the older name is stranger and more beautiful: Vipasha. It means something like the unbinder — the one who unties.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"इसके पीछे की पुरानी कहानी महान ऋषि वशिष्ठ के बारे में है। उनके परिवार पर बहुत गहरा दुख आ पड़ा — कहानी इसकी बारीकियों से दूर ही रहती है, और हम भी दूर ही रहेंगे — और वे ऋषि, जिन्होंने बड़े-बड़े राजाओं को ढांढस बंधाया था और वीरों को सिखाया था, खुद अपने मन को सांत्वना नहीं दे पाए।"',
      text: 'The old story behind it is about the great sage Vashishtha. A terrible sadness came upon his family — the story keeps its distance from the details, and so shall we — and the sage, who had comforted kings and taught heroes, found that he could not comfort himself.' },
    { art: ['courtier'], who: null,
      hi: '"उनका दुख इतना भारी हो गया कि वे बस सब खत्म कर देना चाहते थे — खुद को नदी को सौंप देना चाहते थे ताकि वह उन्हें बहा ले जाए। और क्योंकि घोर निराशा में भी वे पक्के इरादे वाले थे, उन्होंने पहले खुद को बांधा, मजबूत रस्सियों से खुद को बार-बार लपेटकर गांठ पर गांठ लगा दी, ताकि कोई भी बात उनका फैसला न बदल सके।"',
      text: 'His grief grew so heavy that he wanted only to be done — to give himself to the river and let it carry him away. And because even in despair he was thorough, he bound himself first, wrapping himself around and around with strong rope, knot upon knot, so that nothing could change his mind.' },
    { art: ['courtier', 'pt_heron'], who: null, mood: 'think',
      hi: '"फिर वे पानी में उतर गए। और उस नदी ने — बर्फ से पोषित इस ठंडी, तेज़ पहाड़ी नदी ने — कुछ ऐसा किया जिसकी किसी को, और सबसे कम खुद ऋषि को, उम्मीद थी।"',
      text: 'Then he walked into the water. And the river — this cold, fast, snow-fed mountain river — did something no one, least of all the sage, expected.',
      ask: {
        q: 'A great soul, bound in ropes, gives himself to the current. What does the river do?',
        options: ['Carries him away, as he asked', 'Refuses — and unties every knot', 'Freezes solid around him'],
        answer: 1,
        right: 'It refused. The water worked at the ropes like patient fingers, loosened every knot, and laid him — free, breathing, astonished — gently on the bank.',
        wrong: 'Rivers in stories do not always do as they are told. This one refused: it worked at the ropes like patient fingers, untied every knot, and laid him gently on the bank.'
      } },
    { art: ['courtier'], who: null,
      hi: '"ऋषि हर तरह से बंधनों से मुक्त होकर गर्म पत्थरों पर लेटे रहे, और पास से बहती नदी को सुनते रहे। कहानी कहती है कि रस्सियों के साथ-साथ उनके भीतर की कोई गांठ भी ढीली पड़ गई। उस दिन उनका दुख खत्म तो नहीं हुआ। लेकिन वे उठ खड़े हुए। और वे वहीं रुके रहे।"',
      text: 'The sage lay on the warm stones, unbound in every sense, and listened to the river go by. The story says something in him loosened along with the ropes. He did not stop being sad that day. But he stood up. And he stayed.' },
    { art: ['pt_heron'], who: null, mood: 'wow',
      hi: 'और तब से उस नदी को विपाशा कहा जाने लगा — बंधनों को खोलने वाली, गांठें सुलझाने वाली — क्योंकि निराशा ने उसे जो सौंपना चाहा था, नदी ने उसे अपने पास नहीं रखा।',
      text: 'And the river was called Vipasha ever after — the unbinder, the untier of knots — because it would not keep what despair had tried to give it.' },
    { art: ['courtier'], who: null,
      hi: 'घाटी के लोग आज भी ब्यास नदी के बारे में कुछ-कुछ ऐसा ही मानते हैं, बिल्कुल वैसे जैसे कोई उस नदी पर यकीन करता है जिसके किनारे वह बड़ा हुआ हो: कि उसकी आवाज़ भारी सीने को हल्का कर देती है, और जो कोई उसके पास देर तक बैठता है, वह उठते समय हल्का महसूस करता है।',
      text: 'People in the valley still half-believe it of the Beas, in the way one believes things about a river one has grown up beside: that its sound loosens a tight chest, and that a person who sits by it long enough gets up lighter.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'अगर कोई दिन कभी तुम्हें उलझनों में बांध दे, तो घाटी की यह सलाह बहुत पुरानी भी है और एकदम मुफ़्त भी: जाओ, बहते पानी के किनारे बैठो और उसे उन गांठों को खोलने दो। और अगर तुम नदी तक नहीं जा सकते — तो किसी को बताओ कि तुम कैसा महसूस कर रहे हो। उससे भी गांठें सुलझ जाती हैं। भारी बात को कभी सिर्फ़ अपने तक मत रखो।',
      text: 'If a day ever ties you in knots, the valley\'s advice is old and free of charge: go and sit beside running water and let it work at them. And if you cannot get to a river — tell somebody how you feel. That unties knots too. Never keep the heavy thing to yourself.' }
  ],
  moral: 'When grief ties you up, do not give yourself to it — give it to something that unties. Moving water helps. So does telling someone.',
  source: 'The Vipasha legend of the sage Vashishtha, told of the river Beas since ancient times — the name Vipasha ("unfettered") and its story appear in old Sanskrit tradition, including the Mahabharata. The sage\'s bereavement is held offstage here for the age band, and the tale is told, as it always has been, as katha.'
},

{
  id: 'it.apple-road',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'itihaas',
  title: 'The Man Who Brought the Apples',
  hook: 'Himachal\'s hillsides of apple orchards look as old as the mountains. They are younger than some people\'s grandmothers — and they begin with one stubborn man from across the world.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['सेब', 'seb', 'apple'], ['पौधा', 'paudha', 'sapling'], ['पहाड़', 'pahaad', 'mountain']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'सौ से कुछ ही साल पहले, फ़िलाडेल्फ़िया शहर से सैमुअल इवांस स्टोक्स नाम का एक नौजवान अमरीकी हिमाचल की पहाड़ियों में आया। वह शिमला के पास बीमार लोगों के एक घर में मदद करने आया था — और पहाड़ों ने उसके साथ वही किया जो वे कुछ लोगों के साथ करते हैं: उन्होंने उसे वहीं रोक लिया।',
      text: 'A little more than a hundred years ago, a young American named Samuel Evans Stokes came from the city of Philadelphia to the hills of Himachal. He came to help at a home for sick people near Shimla — and the mountains did to him what mountains do to some people: they kept him.' },
    { art: ['courtier'], who: null,
      hi: 'वह सतलुज के ऊपर कोटगढ़ में बस गया, वहाँ की भाषा सीखी, वहीं के एक परिवार में शादी की, और अपने पड़ोसियों की तरह ही जीने लगा। और पड़ोसियों की तरह जीते हुए, उसे उनकी सबसे बड़ी मुश्किल समझ में आई: इन खूबसूरत पहाड़ी ढलानों पर बमुश्किल ही कुछ उग पाता था। परिवार साल भर सीढ़ीदार खेतों में मेहनत करते, फिर भी गरीब ही रहते थे।',
      text: 'He settled in Kotgarh, above the Sutlej, learned the language, married into the community, and lived like his neighbours. And living like his neighbours, he learned their hardest problem: the beautiful hillsides grew barely enough. Families worked terraced fields all year and stayed poor.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'स्टोक्स इस बात पर लगातार सोचता रहा। ज़मीन ढलान वाली थी, सर्दियाँ बहुत ठंडी और गर्मियाँ खिली धूप वाली — न गेहूँ के लिए अच्छी, न चावल के लिए। और तभी उसे एक बात समझ आई: ये कोई कमियाँ नहीं थीं। ठंडी सर्दियाँ और खिली धूप वाली गर्मियाँ तो ठीक वही मौसम था, जो एक ख़ास फ़सल को सबसे ज़्यादा पसंद था।',
      text: 'Stokes kept turning the problem over. The land was steep, the winters cold, the summers bright — bad for wheat, bad for rice. And then it struck him: those were not flaws. Cold winters and bright summers were exactly what one particular crop loved.',
      ask: {
        q: 'What does a cold-wintered, sun-drenched mountainside grow better than almost anywhere?',
        options: ['Sugarcane', 'Apples', 'Coconuts'],
        answer: 1,
        right: 'Apples. The hills\' hardship — the cold — was an apple tree\'s idea of perfect weather.',
        wrong: 'Sugarcane and coconuts want heat and plains. Apples want exactly what these hills had: real winter cold and bright summer sun.'
      } },
    { art: ['courtier'], who: null,
      hi: 'इसलिए उन्होंने यहाँ के मौसम के अनुकूल अमरीकी सेब की उम्दा किस्मों के पौधे मँगवाए और कोटगढ़ में एक बगीचा लगाया। पड़ोसी बड़े अदब से उन्हें देखते रहे, जैसे किसी धुन के पक्के इंसान को देखा जाता है। पेड़ों के बड़े होने में तो कई साल लगते हैं। उन्होंने खरपतवार हटाई, क़लम बाँधी और इंतज़ार किया।',
      text: 'So he sent for saplings of fine American apple varieties suited to the climate, and planted an orchard at Kotgarh. Neighbours watched politely, the way one watches an enthusiast. Trees take years. He weeded, grafted, waited.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और फिर पेड़ों पर फल लद गए, और सेब इतने लाजवाब थे — कि अचानक इन पहाड़ों का पूरा हिसाब-किताब ही हमेशा के लिए बदल गया। सेबों के चंद सीढ़ीदार खेत इतनी कमाई कर सकते थे, जितनी अनाज से भरी पूरी पहाड़ियाँ भी नहीं कर पाती थीं।',
      text: 'And then the trees came into bearing, and the apples were superb — and suddenly the mathematics of the mountainside had changed forever. A few terraces of apples could earn what whole hillsides of grain could not.' },
    { art: ['courtier'], who: null,
      hi: 'और इन पहाड़ों को सबसे ज़्यादा जो बात याद है, वह यह: उन्होंने यह फ़ायदा सिर्फ़ अपने तक नहीं रखा। उन्होंने अपने पड़ोसियों को पौधे दिए और क़लम लगाना सिखाया। वे लोगों को समझाते रहे, उनके पीछे पड़े रहे और हौसला बढ़ाते रहे, जब तक कि ढलानों पर एक के बाद एक सेब के बगीचे नहीं लहलहा उठे — पहले कोटगढ़, फिर एक के बाद एक घाटियाँ, और आख़िरकार कुल्लू और किन्नौर तक, जिनके सेब आज पूरे भारत में मशहूर हैं।',
      text: 'Here is the part the hills remember best: he did not keep it. He gave saplings and grafting lessons to his neighbours, and argued, badgered and encouraged until orchard after orchard climbed the slopes — Kotgarh first, then valley after valley, on eventually to Kullu and Kinnaur, whose apples are now famous across India.' },
    { art: ['guard'], who: null,
      hi: 'स्टोक्स ख़ुद भी हर तरह से इन पहाड़ों के होकर रह गए। वे भारत की आज़ादी की लड़ाई में शामिल हुए और इसके लिए जेल भी गए। उन्होंने पुराने धर्मग्रंथ पढ़े और आगे चलकर हिंदू धर्म अपना लिया, साथ ही अपना नाम सत्यानंद रखा। वे अपने पेड़ों के बीच, कोटगढ़ में ही जिए और वहीं उन्होंने आख़िरी साँस ली।',
      text: 'Stokes himself became a man of these hills in every way. He joined India\'s freedom struggle and went to jail for it. He studied the old scriptures, and in time embraced Hinduism, taking the name Satyanand. He lived and died in Kotgarh, among his trees.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज हिमाचल में पतझड़ का मतलब है सेब की पेटियों से लदे एक के बाद एक ट्रक, जो घुमावदार पहाड़ी रास्तों से नीचे उतरते हैं — भारत की सबसे शानदार फ़सलों में से एक, जिसे शुरू हुए अभी मुश्किल से सौ साल हुए हैं। अगली बार जब तुम हिमाचली सेब खाओ, तो तुम्हें पता है कि किसे शुक्रिया कहना है: इन पहाड़ों को, सेब उगाने वालों को, और उस एक इंसान को जिसने समझा कि इस ठंड की असली ख़ासियत क्या थी।',
      text: 'Autumn in Himachal now means truck after truck of apple crates winding down the mountain roads — one of the great harvests of India, barely a century old. The next time you eat a Himachali apple, you know who to thank: the hills, the growers, and one man who saw what the cold was for.' }
  ],
  moral: 'Look at a hardship long enough and you may find it is a gift facing the wrong way.',
  source: 'Samuel Evans Stokes / Satyanand Stokes (1882–1946), who settled at Kotgarh, introduced suitable American apple varieties to the Shimla hills in the 1910s–20s and spread orcharding among his neighbours; he also took part in the freedom movement. Documented in published biography (including by his granddaughter Asha Sharma) and in Himachal\'s own telling of its apple economy.'
},

{
  id: 'fk.spiti-ghost',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'The Grey Ghost of Spiti',
  hook: 'In the high cold desert of Spiti lives a cat the mountains keep almost invisible. Seeing one, even once, is the kind of thing people remember all their lives.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['तेंदुआ', 'tendua', 'leopard'], ['चुप', 'chup', 'silent'], ['सर्दी', 'sardi', 'winter']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हिमाचल के दूरदराज़ ऊँचे कोने में बसा स्पीति एक ठंडा रेगिस्तान है — सूखे भूरे पहाड़, नदी के साथ-साथ चलती हरियाली की एक पतली लकीर, और गहरे सन्नाटे के बीच सफ़ेद घरों के गाँव। सर्दियों में यहाँ ठंड शून्य से बहुत नीचे चली जाती है और यह सन्नाटा और भी गहरा हो जाता है।',
      text: 'Spiti, in the far high corner of Himachal, is a cold desert — bare brown mountains, a ribbon of green along the river, villages of white houses under enormous silence. In winter it drops far below freezing and the silence gets even bigger.' },
    { art: ['pt_lion'], who: null,
      hi: '"और उसी सन्नाटे में कहीं, लगभग हमेशा सबकी नज़रों से छिपा, रहता है हिम तेंदुआ। सलेटी-सुनहरा, जिसका रूप-रंग खुद पहाड़ जैसा है, एक बड़ी और मुलायम रस्सी जैसी पूंछ, और बर्फ के लिए ही बने पंजे। ऊंचे गांवों के लोग इसे सलेटी भूत कहते हैं।"',
      text: 'And somewhere in that silence, almost always unseen, lives the snow leopard. Grey-gold, patterned like the mountain itself, with a tail like a great soft rope and paws made for snow. The people of the high villages call it the grey ghost.' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      hi: '"उसे यह नाम एक सीधी-सी वजह से मिला है: वह वहीं होता है, पर आप उसे देख नहीं पाते। पथरीली ढलान पर बैठा हिम तेंदुआ मानो ढलान का ही हिस्सा बन जाता है — चरवाहे मिनटों तक उसी की तरफ देखते रहे और उन्हें सिर्फ पत्थर ही नज़र आए, जब तक कि उनमें से एक पत्थर धुएं की तरह चुपचाप ऊपर पहाड़ की ओर खिसक नहीं गया।"',
      text: 'It is called that for a simple reason: it is there, and you cannot see it. A snow leopard on a rocky slope simply becomes the slope — herders have stared straight at one for minutes and seen only stones, until one stone flowed away uphill like smoke.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"सर्दियों में, जब जंगली भेड़ें और आइबेक्स नीचे उतरते हैं, तो यह भूत भी उनके पीछे-पीछे नीचे आ जाता है — और यही उसे ढूंढने का मौसम होता है। दुनिया भर से लोग पार्सल की तरह गर्म कपड़ों में खुद को लपेटकर स्पीति आते हैं, ताकि इस कड़ाके की ठंड में घंटों दूरबीन के पीछे बैठकर उम्मीद भरी नज़रों से ताक सकें।"',
      text: 'In winter, when the wild sheep and ibex come down lower, the ghost follows them down — and that is the season of looking. People come to Spiti from across the world, wrapped like parcels, to sit for hours behind telescopes in the cold, hoping.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"उन्हें सबसे बढ़िया पहचानने वाले यहीं के स्थानीय लोग होते हैं — वे गांव वाले जिन्होंने ज़िंदगी भर इन ढलानों को पढ़ा है। और गांवों तथा इस भूत के बीच एक पुरानी और असली मुश्किल भी है: हिम तेंदुआ कभी-कभार किसी बकरी या भेड़ को उठा ले जाता है, और किसी भी परिवार की बकरियां ही उनकी असली पूंजी होती हैं।"',
      text: 'The best spotters are local — villagers who have read these slopes all their lives. And between the villages and the ghost there is an old, real difficulty: a snow leopard sometimes takes a goat or a sheep, and a family\'s goats are a family\'s wealth.',
      ask: {
        q: 'The beautiful ghost sometimes costs a family a goat. What have the villages and the ghost worked out?',
        options: ['The villages drove the leopards away', 'People protect the leopard, and are helped when it takes a goat', 'Everyone pretends it is not there'],
        answer: 1,
        right: 'That is today\'s arrangement: losses are made good, corrals are built stronger, and the villages have become the ghost\'s protectors — and its proudest hosts.',
        wrong: 'Nobody drove anyone away. Losses are made good, corrals are built stronger, and the villages have become the ghost\'s protectors — and its proudest hosts.'
      } },
    { art: ['courtier'], who: null,
      hi: '"स्पीति के बच्चे सबसे अनोखी भूतिया कहानियों को सुनते हुए बड़े होते हैं: उस पड़ोसी की कहानी जिसे तड़के गांव के चारों ओर बड़े-बड़े मुलायम पंजों के निशान मिले; उस सर्दी की कहानी जब एक तेंदुआ छत पर ऐसे बैठा था मानो कोई राजा अपनी रियासत का मुआयना कर रहा हो; और दूरबीन का वह पल जब दूर की एक सलेटी चट्टान ने अचानक जम्हाई ले ली।"',
      text: 'Children in Spiti grow up on ghost stories of the best kind: the neighbour who found big soft pawprints circling the village at dawn; the winter a leopard sat on a rooftop like a king surveying his country; the telescope moment when a far grey rock yawned.' },
    { art: ['pt_lion'], who: null,
      hi: '"उन पर अध्ययन करने वाले वैज्ञानिकों का कहना है कि दुनिया भर के ऊंचे पहाड़ों में अब बस कुछ हज़ार हिम तेंदुए ही बचे हैं, जो स्पीति की इन ढलानों को बेहद अनमोल बनाता है: धरती की उन चुनिंदा जगहों में से एक, जहां यह भूत आज भी टहलता है।"',
      text: 'Scientists who study them say there are only a few thousand snow leopards left in all the world\'s high mountains, which makes Spiti\'s slopes something precious: one of the places on Earth where the ghost still walks.' },
    { art: ['pt_lion'], who: 'mithu',
      hi: '"अगर तुम कभी जाओ, तो सर्दियों में जाना, किसी पार्सल की तरह ख़ूब कपड़े पहनकर जाना, और धीरज रखना। शायद तुम्हें सिर्फ़ पहाड़ ही दिखाई दें। लेकिन पूरे दिन तुम्हें यह पता रहेगा कि उन ढलानों पर कहीं कुछ बहुत अनोखा तुम्हें देख रहा है — बड़ी शालीनता से, ख़ामोशी से, अपनी अदृश्य दुनिया के भीतर से।"',
      text: 'If you ever go, go in winter, dress like a parcel, and be patient. You will probably see only mountains. But you will know, all day, that somewhere on those slopes something wonderful is watching you — politely, silently, from inside its own invisibility.' }
  ],
  moral: 'Some of the world\'s best things are almost never seen. Knowing they are there is its own kind of seeing.',
  source: 'The snow leopards of Spiti, Himachal Pradesh — a stronghold of a species counted only in the low thousands worldwide. Winter spotting around villages like Kibber, local spotter expertise, and community conservation with compensation for livestock losses are all present-day reality, told here as it is.'
},

{
  id: 'fk.malana-sabha',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'The Village That Governs Itself',
  hook: 'High up a side valley in Himachal is a small village that has been holding its own assembly, under its own rules, for longer than anyone can count.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['सभा', 'sabha', 'assembly'], ['फ़ैसला', 'faisla', 'decision'], ['गाँव', 'gaon', 'village']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"कुल्लू घाटी से अलग, एक खड़ी तंग घाटी के ऊपर मलाना बसा है — नदी से बहुत ऊँचाई पर पत्थरों और लकड़ी के घरों वाला एक गाँव, जहाँ इतिहास के ज़्यादातर समय में सिर्फ़ पैदल ही पहुँचा जा सकता था। यहाँ के लोग अपनी ही एक भाषा बोलते हैं, कनाशी, जो धरती पर कहीं और नहीं बोली जाती।"',
      text: 'Off the Kullu valley, up a steep side gorge, sits Malana — a village of stone and timber houses high above the river, reachable for most of its history only on foot. Its people speak their own language, Kanashi, spoken nowhere else on Earth.' },
    { art: ['guard'], who: null,
      hi: '"मलाना में फ़ैसले करने का अपना ही तरीक़ा है, और यह बहुत पुराना है — इतना पुराना कि बाहर से आने वाले लोग अर्से से इस गाँव को दुनिया के सबसे प्राचीन जीवित लोकतंत्रों में से एक कहते आए हैं। गाँव वाले इसे और सीधे शब्दों में कहते हैं: जमलू यही चाहते हैं।"',
      text: 'Malana keeps its own way of deciding things, and it is old — so old that visitors have long called the village one of the world\'s most ancient living democracies. The villagers put it more simply: this is how Jamlu wants it done.' },
    { art: ['courtier'], who: null,
      hi: '"जमलू गाँव के देवता हैं — मलाना के देवता, जिनकी बात गाँव का सबसे बड़ा क़ानून है। लेकिन जमलू अकेले राज नहीं करते, और कमाल की बात यही है: गाँव अपना काम-काज अपनी सभा के ज़रिए चलाता है, जिसमें सदस्यों की एक परिषद होती है और इन ज़िम्मेदारियों को ख़ुद गाँव के लोग ही संभालते हैं।"',
      text: 'Jamlu is the village devta — the deity of Malana, whose word is the village\'s highest law. But Jamlu does not rule alone, and this is the remarkable part: the village runs its affairs through its own assembly, with a council of members whose roles the village itself fills.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"जब किसी बात को सुलझाना होता है — खेत की मेड़ को लेकर कोई झगड़ा, जंगल को पहुँचा नुक़सान, या मंदिर से जुड़ा कोई सवाल — तो यह सभा खुले में, गाँव के बीचों-बीच जुटती है, और हर संबंधित इंसान अपनी बात रखता है। ज़ोर से। सबके सामने।"',
      text: 'When something must be settled — a dispute over a field boundary, damage to the forest, a question about the temple — the assembly gathers in the open, in the middle of the village, and everyone concerned has their say. Out loud. In front of everyone.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"और फ़ैसला जल्दबाज़ी के उस तरीक़े से नहीं किया जाता, जिसमें बस हाथ गिनकर ज़्यादा गिनती वाले हिस्से को जिता दिया जाए।"',
      text: 'And a decision is not done the quick way, by counting hands and letting the bigger half win.',
      ask: {
        q: 'How does the Malana assembly finish a difficult matter?',
        options: ['The oldest man decides alone', 'They talk until the village can accept the answer together', 'They flip a coin blessed by the devta'],
        answer: 1,
        right: 'They keep talking — for hours, sometimes across days — until an answer is reached that the village can live with together. And on the hardest matters, Jamlu is asked.',
        wrong: 'No one elder, and no coin. They keep talking — sometimes for days — until an answer is reached the village can live with together. And on the hardest matters, Jamlu is asked.'
      } },
    { art: ['guard'], who: null,
      hi: 'जब सभा पूरी तरह उलझ जाती है, तो सवाल उनके माध्यम के ज़रिए खुद जमलू देवता के पास जाता है — और जो भी जवाब आए, गाँव के दोनों पक्ष बिना किसी बहस के उसे स्वीकार कर लेते हैं। देवता का फैसला मामले को ऐसे शांत कर देता है जैसे बारिश धूल को।',
      text: 'When the assembly is truly stuck, the question goes to Jamlu himself, through his oracle — and whatever answer comes, the village accepts, both sides, without appeal. A verdict from the devta ends the matter the way rain ends dust.' },
    { art: ['courtier'], who: null,
      hi: 'मलाना अपने रिवाज़ों को मज़बूती से थामे हुए है, और बाहर से आने वालों से उसके नियमों का आदर करने को कहा जाता है — कहाँ चलना है, किसे हाथ नहीं लगाना है — जैसा कि मेहमानों को कहीं भी करना चाहिए। यह गाँव कोई म्यूज़ियम नहीं है। यह एक ऐसा समुदाय है जिसने सभा-दर-सभा यही तय किया है कि वह जैसा है, वैसा ही रहेगा।',
      text: 'Malana keeps its customs firmly, and visitors are asked to respect its rules — where to walk, what not to touch — as guests should anywhere. The village is not a museum. It is a community that has decided, assembly after assembly, to remain itself.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'पंचायतें — यानी गाँव की सभाएँ — पूरे भारत में बैठती हैं, और बच्चे अपनी नागरिक शास्त्र की कक्षा में उनके बारे में पढ़ते हैं। मलाना इस बात की याद दिलाता है कि यह जड़ कितनी गहरी है: एक ऊँची, ठंडी घाटी में खुले आसमान के नीचे बैठे लोग, जो किसी समस्या पर तब तक बात करते हैं जब तक उसका पूरा हल न निकल आए। यह कोई पुरानी बात नहीं है। यह तो वह धुरी है जिस पर बाकी सब कुछ चलता है।',
      text: 'Panchayats — village councils — meet all over India, and children learn about them in civics class. Malana is a reminder of how deep that root goes: people in a high cold valley, sitting in the open, talking a problem all the way to the end. That is not old-fashioned. That is the machine everything else runs on.' }
  ],
  moral: 'Talking a problem all the way to the end is slower than voting and older than kings — and it is how neighbours stay neighbours.',
  source: 'Malana village, Kullu district, Himachal Pradesh — its Kanashi language, its devta Jamlu, and its ancient village assembly and council, often described as one of the oldest functioning local democracies. Told from published accounts and the village\'s own reputation in the valley; Malana\'s customs are its own, and are described here with a guest\'s respect.'
},

{
  id: 'fk.kangra-brush',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'The Painters of the Small Monsoon',
  hook: 'In the Kangra valley, painters learned to fit whole worlds — monsoon skies, gardens, love, and the blue god himself — onto pages smaller than this screen.',
  hero: 'krishna',
  cast: ['krishna', 'courtier', 'pt_mouse'],
  minutes: 4,
  place: ['IN-HP'],
  words_hi: [['चित्र', 'chitra', 'picture'], ['रंग', 'rang', 'colour'], ['बारीक', 'baareek', 'fine, delicate']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'दो सौ से कुछ साल पहले, धौलाधार की बर्फ़ीली चोटियों के नीचे बसी हरी-भरी काँगड़ा घाटी में, चित्रकारों के ऐसे परिवार काम करते थे जिनकी बनाई तस्वीरें इतनी छोटी थीं कि दोनों हाथों में आ जाएँ — और फिर भी, न जाने कैसे, उनमें सब कुछ समाया हुआ था।',
      text: 'Two hundred and some years ago, in the green Kangra valley under the Dhauladhar snows, there worked families of painters whose paintings were small enough to hold in two hands — and held, somehow, everything.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'नीले-काले बादलों से घिरा सावन का आसमान, और उसे पार करता हुआ एक सफ़ेद बगुला। शहद की बूँदों जैसे दीयों से जगमगाता रात का एक बगीचा। पहाड़ियाँ, नदियाँ, मवेशियों के झुंड — और हर जगह, बार-बार, वही कृष्ण: शाम की तरह साँवले, पेड़ों के नीचे अपनी बाँसुरी बजाते हुए, और उस चित्रित दुनिया का हर जीव जैसे झुककर उन्हें सुन रहा हो।',
      text: 'A monsoon sky stacked with blue-black clouds, and one white crane crossing it. A garden at night with lamps like drops of honey. Hills, rivers, herds — and everywhere, again and again, Krishna: blue as evening, playing his flute under the trees while the whole painted world leans in to listen.' },
    { art: ['krishna'], who: null,
      hi: 'यह है काँगड़ा चित्रकला — काँगड़ा क़लम — जो भारतीय लघुचित्रों की महान पहाड़ी शैलियों में से एक है। इन चित्रकारों को सबसे ज़्यादा लगाव कृष्ण और राधा के काव्य से था, और उन्होंने उसी की कोमलता हर पत्ते और हर बादल में पिरो दी।',
      text: 'This is Kangra painting — Kangra kalam, the Kangra brush — one of the great pahari, or hill, schools of Indian miniature painting. The painters loved the poetry of Krishna and Radha above all, and painted its tenderness into every leaf and cloud.' },
    { art: ['pt_mouse', 'courtier'], who: 'courtier',
      hi: 'और यह सब कैसे बना, यह अपने आप में एक कहानी है। पलकों और बारिश की बूँदों के लिए इतने बारीक ब्रश कि शायद उनमें सिर्फ़ एक ही बाल हो। दुनिया भर की चीज़ों से हाथ से पीसे गए रंग: लाल और पीले के लिए खनिज और मिट्टी, नीले के लिए कीमती पत्थर, और मुकुट की चमक के लिए असली सोना।',
      text: 'And the how of it is a story in itself. Brushes so fine they might hold a single hair, for eyelashes and raindrops. Colours ground by hand from the world: minerals and earths for reds and yellows, precious stone for the blues, real gold for the light on a crown.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'ऐसी किसी कार्यशाला में काम सीखने वाला — जो अक्सर कोई बेटा या भतीजा होता था, क्योंकि यह परिवार का ही हुनर होता था — अपने शुरुआती साल शायद बिना एक भी तस्वीर बनाए ही बिता देता था।',
      text: 'An apprentice in such a workshop — often a son or nephew, for these were family ateliers — might spend his first years never painting a single picture.',
      ask: {
        q: 'What does the youngest apprentice in a painter\'s family spend years doing first?',
        options: ['Painting the main figures', 'Grinding colours and drawing lines, ten thousand times', 'Selling paintings in the bazaar'],
        answer: 1,
        right: 'Grinding, mixing, and line after line after line — until the hand is steady enough to be trusted with an eyelash. The masterpiece begins years before the masterpiece.',
        wrong: 'The main figures came last, after years. First: grinding colours, mixing them, and drawing line after line — until the hand was steady enough to be trusted with an eyelash.'
      } },
    { art: ['courtier'], who: null,
      hi: 'कला से प्यार करने वाले पहाड़ी राजाओं की छत्रछाया में ये चित्रकार खूब फले-फूले — कांगड़ा के महाराजा संसार चंद के दौर में यह कला सबसे ज़्यादा चमकी, जिनके दरबार में कई उस्ताद चित्रकार काम करते थे — और उनकी बनाई तस्वीरें पहाड़ों से बहुत दूर-दूर तक पहुँचीं और सहेजी गईं।',
      text: 'The painters flourished under hill rajas who loved the art — the school shone brightest under Maharaja Sansar Chand of Kangra, whose court kept many master painters at work — and their paintings travelled and were treasured far beyond the hills.' },
    { art: ['krishna', 'courtier'], who: null,
      hi: 'यह परंपरा कोई बंद किताब नहीं है। पुरानी नायाब कलाकृतियाँ भारत और दुनिया भर के संग्रहालयों में लगी हैं — और आज भी कांगड़ा घाटी में कलाकार इस क़लम को सीखते और साधते हैं, रंग पीसते हैं, और इस परंपरा को ज़िंदा रखते हैं।',
      text: 'The tradition is not a closed book. The old masterpieces hang in museums in India and across the world — and in the Kangra valley today, artists still learn and practise the kalam, grinding colours, keeping the line alive.' },
    { art: ['krishna'], who: 'mithu',
      hi: 'अगर तुम कभी कांगड़ा की कोई पेंटिंग देखो, तो शीशे के जितना पास जा सको जाकर उसमें बनी सबसे छोटी चीज़ को देखना — एक चूड़ी, बारिश की एक बूँद, घास का एक तिनका। किसी ने उस एक बूँद को बनाने में पूरी एक दोपहर लगा दी थी। कांगड़ा के ब्रश का यही मतलब है।',
      text: 'If you ever see a Kangra painting, get as close as the glass allows and look at the smallest thing in it — one bangle, one raindrop, one blade of grass. Someone gave that raindrop a whole afternoon. That is what the Kangra brush means.' }
  ],
  moral: 'Greatness does not need a big canvas. It needs a steady hand, real colours, and the patience to give a raindrop an afternoon.',
  source: 'Kangra miniature painting (Kangra kalam), the pahari school of the Kangra valley, Himachal Pradesh, at its height under Maharaja Sansar Chand (late 18th–early 19th century); its Krishna-and-Radha themes, mineral pigments and family ateliers are documented in museum scholarship, and the tradition is still practised and taught in the valley. The tradition and region are credited here by name, as folk and court art always should be.'
},

/* ==================================================== JAMMU & KASHMIR ====== */

{
  id: 'fk.satisar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'katha',
  title: 'The Valley That Was a Lake',
  hook: 'Kashmir\'s own oldest story says the whole valley was once one enormous lake — and that it took a sage with great patience to let the land out.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_heron'],
  minutes: 4,
  place: ['IN-JK'],
  words_hi: [['घाटी', 'ghaati', 'valley'], ['झील', 'jheel', 'lake'], ['केसर', 'kesar', 'saffron']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: '"बहुत, बहुत पुरानी बात है — जैसा कश्मीर की अपनी सबसे पुरानी कहानी बताती है — तब कश्मीर की कोई घाटी थी ही नहीं। बड़े-बड़े पहाड़ों के घेरे के बीच बस एक बहुत बड़ी झील फैली थी, विशाल, गहरी और ठंडी, जिसे सतीसर कहते थे, यानी देवी सती की झील।"',
      text: 'Long, long ago — so says Kashmir\'s own oldest telling — there was no valley of Kashmir at all. Between the ring of great mountains lay one enormous lake, vast and deep and cold, called Satisar, the lake of the goddess Sati.' },
    { art: ['courtier'], who: null,
      hi: '"वह सुंदर तो थी, पर जिसे सूखी ज़मीन चाहिए थी उसके किसी काम की नहीं थी। इससे भी बुरी बात यह थी कि उसकी गहराइयों में कुछ ऐसा रहता था जिसने पानी को ख़तरनाक बना रखा था, इतना कि लोग उसके किनारों पर भी नहीं बस सकते थे। कहानी उस जीव को अंधेरे में ही रहने देती है, और हम भी उसे वहीं छोड़ देते हैं।"',
      text: 'It was beautiful and it was useless to anyone who needed dry ground. Worse: something dwelt in its depths that made the waters dangerous, so that people could not settle even on the shores. The story keeps that creature down in the dark, and we will leave it there.' },
    { art: ['courtier'], who: null,
      hi: '"उस झील के पास महान ऋषि कश्यप आए — पुरानी कहानियों में कई जातियों के पितामह, बड़े ही शांत स्वभाव वाले। वे पहाड़ों के पूरे घेरे पर घूमे और उस फंसे हुए पानी को ठीक वैसे देखा जैसे कोई कारीगर लकड़ी की किसी गांठ को देखता है।"',
      text: 'To that lake came the great sage Kashyapa, grandfather of many peoples in the old stories, a man of enormous calm. He walked the whole rim of the mountains, looking at the trapped water the way a craftsman looks at a knot in wood.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      hi: '"गहराइयों में छिपी उस आफ़त से निपटने के लिए खुद देवताओं ने भी हाथ बढ़ाया — ठीक कैसे, इस पर कहानियों के अपने-अपने तरीके हैं, और कश्मीरी लोग दो हज़ार सालों से इन बारीकियों पर मज़े से बहस करते आए हैं। पर ऋषि की भूमिका को लेकर हर कहानी एकमत है।"',
      text: 'The gods themselves took a hand against the trouble in the depths — the tellings differ on exactly how, and Kashmiris have argued the details pleasantly for two thousand years. But every telling agrees on the sage\'s part.',
      ask: {
        q: 'A lake full of trouble, ringed by mountains. What is Kashyapa\'s answer?',
        options: ['Build boats and live on the water', 'Open the mountain wall and let the lake out', 'Wait for the lake to dry on its own'],
        answer: 1,
        right: 'He opened the wall. At the place now called Baramulla the barrier was cut, and the great lake began to pour away.',
        wrong: 'Neither boats nor waiting. At the place now called Baramulla the mountain barrier was cut open, and the great lake began to pour away.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और जैसे-जैसे पानी कम होता गया, घाटी उसमें से ऐसे बाहर निकल आई जैसे कोई तोहफ़ा खोला जा रहा हो: पहले चोटियां, फिर ढलानें, और फिर दूर तक फैला हरा-भरा मैदान जिसमें नदियां पहले से ही बह रही थीं — और बीच में से झेलम किसी दस्तख़त की तरह बलखाती हुई गुज़र रही थी।"',
      text: 'And as the water sank, the valley rose out of it like a gift being unwrapped: ridges first, then slopes, then the wide green floor with its rivers already running — the Jhelum winding down the middle like a signature.' },
    { art: ['pt_heron', 'courtier'], who: null,
      hi: '"लोग आए और इस नई ज़मीन पर बस गए, और यह धरती की सबसे सुंदर जगहों में से एक निकली: सेब और अख़रोट के बाग़, केसर के खेत — दुनिया का सबसे कीमती मसाला, जो पतझड़ में बैंगनी हो जाता है — चिनार के पेड़, और पीछे छूट गई झीलें जो पुराने सतीसर के टुकड़ों की तरह उसकी याद संजोए हुए थीं।"',
      text: 'People came and settled the new land, and it turned out to be one of the loveliest places on Earth: orchards of apples and walnuts, fields of saffron — the world\'s most precious spice, purple in autumn — chinar trees, and lakes left behind like pieces of the old Satisar keeping the memory.' },
    { art: ['courtier'], who: null,
      hi: 'मान्यता है कि इस घाटी का नाम खुद उस ऋषि के नाम पर पड़ा: कश्यप की भूमि — कश्मीर। और नौ सौ साल पहले जब कश्मीर के पहले महान इतिहासकार, कल्हण, राजाओं की गाथा लिखने बैठे, तो उन्होंने इसी कहानी से शुरुआत की।',
      text: 'They named the valley, says the tradition, for the sage himself: Kashyapa\'s land — Kashmir. And when Kashmir\'s first great historian, Kalhana, sat down nine hundred years ago to write his chronicle of kings, this is the story he began with.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'वैसे, भूवैज्ञानिक भी घाटी की मिट्टी देखकर कहते हैं कि इतिहास से भी पुराने समय में यह सचमुच एक विशाल झील के नीचे डूबी हुई थी। पुराने किस्सागो यह बात बड़े आराम से मान लेते। वे कहते: हमने तो पहले ही बताया था। हम दो हज़ार सालों से यही तो कहते आ रहे हैं।',
      text: 'Geologists, by the way, looking at the valley\'s soil, say it truly did lie under a great lake in deep prehistory. The old storytellers would accept that news calmly. They would say: we told you. We have been telling you for two thousand years.' }
  ],
  moral: 'Under every settled, beautiful place there is an older story of how it was made livable — and someone patient in it.',
  source: 'The Satisar legend — the sage Kashyapa and the draining of the primordial lake at Baramulla (Varahamula) — from the Nilamata Purana, retold at the opening of Kalhana\'s Rajatarangini (12th century). The trouble in the deep is kept offstage for this age band. That the valley floor was once a prehistoric lakebed is also the finding of modern geology; the two tellings are left to shake hands on their own.'
},

{
  id: 'fk.himal-nagrai',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'katha',
  title: 'Himal and the Serpent Prince',
  hook: 'Kashmir\'s most beloved fairy tale begins with a spring that was not just a spring, and a prince who was not just a prince.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crocodile'],
  minutes: 4,
  place: ['IN-JK'],
  words_hi: [['झरना', 'jharna', 'spring, stream'], ['राजकुमार', 'rajkumar', 'prince'], ['कहानी', 'kahani', 'story']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'कश्मीर चश्मों की घाटी है — चिनार के पेड़ों के नीचे ज़मीन से फूटते ठंडे, साफ़ पानी के ताल। और कश्मीरी हमेशा से कहते आए हैं कि ये चश्मे दरवाज़े हैं: कि पुरानी कहानियों के नाग लोग, पानी के उस पार अपने चमकते राज्यों में रहते हैं।',
      text: 'Kashmir is a valley of springs — cold, clear pools that rise out of the earth under the chinar trees. And Kashmiris have always said that springs are doors: that the naga folk, the serpent people of the old stories, live in shining kingdoms on the other side of the water.' },
    { art: ['pt_crocodile'], who: null,
      hi: 'कश्मीरी कहानियों में सबसे प्यारी कहानी ऐसे ही एक चश्मे से शुरू होती है। नागराय नागों का राजकुमार था — अपने राज्य में एक तेजस्वी युवा राजा; और हमारी दुनिया में, जब उसकी मर्ज़ी हो, चाँदी के फीते की तरह पानी में सरकता हुआ एक साँप।',
      text: 'The most beloved of all Kashmiri tales begins at such a spring. Nagrai was a prince of the naga people — in his own kingdom a shining young king; in ours, when he chose, a serpent slipping through the water like a ribbon of silver.' },
    { art: ['courtier'], who: null,
      hi: 'ज़मीन के ऊपर हिमाल रहती थी, एक राजकुमारी — दयालु, होशियार, और इतनी अकेली जितना किसी को अंदाज़ा भी न था। कहानियाँ चाहे जैसे भी शुरू हों, वे सब एक दिन उसे उसी चश्मे के किनारे ले आती हैं।',
      text: 'Above the ground lived Himal, a princess — kind, clever, and lonelier than anyone knew. The tellings begin in different ways, but they all bring her, one day, to the edge of that spring.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और वहाँ उसने उसे देखा — और उसने उसे देखा — और दोनों दुनियाओं के बीच का पानी जैसे गायब ही हो गया। वे तब तक बातें करते रहे जब तक परछाइयाँ ढलने नहीं लगीं। वह अपने राज्य से ऊपर आया; वह अपने महल से नीचे आई; और पुरानी कहानियों के दस्तूर के मुताबिक, यानी पलक झपकते ही, दोनों को एक-दूसरे से प्यार हो गया।',
      text: 'And there she saw him — and he saw her — and the water between the two worlds might as well not have been there. They talked till the shadows moved. He came up from his kingdom; she came down from her palace; and by the old measure of such things, which is instantly, they loved each other.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      hi: 'मगर ज़मीन की एक राजकुमारी और पानी का एक राजकुमार — दोनों की ही दुनियाओं को इस बात पर ऐतराज़ था। उसके अपने लोग चाहते थे कि वह नीचे ही रहे। और राजकुमारी के लोग यह समझ ही नहीं पा रहे थे कि वह आख़िर क्या चीज़ है।',
      text: 'But a princess of the land and a prince of the water — both their worlds had opinions about that. His people wanted him below. Hers could not understand what he was.',
      ask: {
        q: 'Two worlds, one spring between them. What do Himal and Nagrai choose?',
        options: ['To forget each other, as everyone advises', 'To marry, and let the two worlds get used to it', 'To never meet again but write letters'],
        answer: 1,
        right: 'They married. Storytellers say the wedding was the valley\'s loveliest — flowers on the water, songs on the shore, guests from both sides of the spring.',
        wrong: 'Forgetting was never really on the table. They married — and storytellers say the wedding was the valley\'s loveliest, with flowers on the water and guests from both sides of the spring.'
      } },
    { art: ['courtier'], who: null,
      hi: 'कुछ समय के लिए — और इस कहानी में हम यही हिस्सा सुना रहे हैं — वे दोनों बस बेहद खुश रहे। उसने राजकुमारी को झरने के नीचे दीयों से जगमगाते कमरे दिखाए, जहाँ की दीवारें किसी सीप के अंदरूनी हिस्से की तरह चमकती थीं। और राजकुमारी ने उसे खुबानी के फूल दिखाए, बर्फ़ दिखाई, और महसूस कराया कि ताज़ी रोटी की खुशबू कैसी होती है।',
      text: 'For a time — and this is the part of the tale this telling keeps — they were simply happy. He showed her the lamplit rooms below the spring, where the walls glimmered like the inside of a shell. She showed him apricot blossom, and snow, and how bread smells.' },
    { art: ['courtier', 'pt_crocodile'], who: null,
      hi: 'पूरी कहानी, जो दादियाँ सर्दियों की कई-कई रातों में सुनाती हैं, इससे बहुत आगे तक जाती है — जलन, भूल-चूक और एक लंबे अफ़सोस से गुज़रती हुई — क्योंकि आख़िरकार, यह दुनिया की सबसे दर्दभरी कहानियों में से एक है, और कश्मीर भी इसे झुठलाने की कोशिश नहीं करता।',
      text: 'The full tale, the one grandmothers tell over many winter nights, goes on far past this — through jealousy and mistakes and long sorrow — for it is, in the end, one of the world\'s great sad stories, and Kashmir does not pretend otherwise.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'मगर हर लंबी दास्तान यहाँ, इस सुखद मोड़ पर ज़रूर ठहरती है, ताकि सुनने वाले थोड़ी देर इस पल को जी सकें। और कश्मीर के चश्मों को आज भी बड़े प्यार से सहेजा जाता है, और बच्चे आज भी उस साफ़ पानी में ज़रूरत से ज़रा ज़्यादा देर तक झाँकते हैं। याद है न, वे दरवाज़े।',
      text: 'But every long telling still pauses here, at the happy middle, to let the listeners live in it a while. And springs in Kashmir are still treated gently, and children still look into the clear water a moment longer than they need to. Doors, remember.' }
  ],
  moral: 'Love does not check which world someone comes from. It is everyone else who checks.',
  source: 'Himal and Nagrai (Himal-Nagraya), the most famous of Kashmiri folk romances, told for centuries and recorded by collectors of Kashmiri tales since the nineteenth century. The full tale is long and ends in sorrow; this telling keeps, honestly and on purpose, its gentle first movement, and says so.'
},

{
  id: 'fk.lal-ded',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'katha',
  title: 'The Woman Everyone Claims',
  hook: 'Seven hundred years ago a woman walked the Kashmir valley speaking short, blazing verses. Kashmiris are still quoting her — and still lovingly arguing about whose she is.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-JK'],
  words_hi: [['बोली', 'boli', 'saying, speech'], ['कविता', 'kavita', 'poem'], ['सब', 'sab', 'everyone']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लगभग सात सौ साल पहले, कश्मीर की घाटी में लल्ला नाम की एक स्त्री रहती थीं। कम उम्र में ही उनका ब्याह एक ऐसे घर में कर दिया गया था जहाँ लोग उनके साथ बहुत बेरहमी से पेश आते थे, और एक दिन — सभी कहानियाँ इस बात पर एकमत हैं — वह ईश्वर की खोज में उस पूरी ज़िंदगी को हमेशा के लिए पीछे छोड़ कर निकल पड़ीं।',
      text: 'Around seven hundred years ago, in the Kashmir valley, there lived a woman called Lalla. She had been married young into a house that was unkind to her, and one day — the tellings agree on this — she walked out of that life entirely, to seek God.' },
    { art: ['courtier'], who: null,
      hi: 'वह अपनी बाकी की ज़िंदगी उस घाटी में घूमती रहीं, न उनके पास कोई धन-दौलत थी, न किसी बात का डर। और चलते-चलते वह कविताएँ कहती जाती थीं — कश्मीरी में छोटी, असरदार रचनाएँ, बस चंद पंक्तियों की, जिन्हें \'वाख\' कहा जाता है। यानी वचन।',
      text: 'She wandered the valley for the rest of her days, owning nothing, fearing nothing. And as she walked, she spoke poems — short, sharp verses in Kashmiri, each one a handful of lines, called vakhs. Sayings.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: '"ये वाख ऐसे थे जैसे किसी ने पहले कभी न सुने हों। उनमें कहा गया था कि ईश्वर किसी मंदिर या किताब में दूर नहीं, बल्कि पास हैं — अपनी सांस से भी ज़्यादा पास — और ईश्वर को पाने का मतलब है पूरी ईमानदारी से, हर दिखावे से परे अपने अंदर झांकना। जिसने भी एक बार कोई वाख सुना, वह उसे फिर कभी भूल नहीं पाया।"',
      text: 'The vakhs were unlike anything anyone had heard. They said that God was not far away in some temple or some book, but near — nearer than your own breath — and that finding God meant looking inward, honestly, past every pretence. People heard one and could not forget it.' },
    { art: ['courtier'], who: null,
      hi: '"किसी के इन्हें लिखने से पहले सैकड़ों सालों तक ये पद गीतों की तरह फैलते रहे — ज़ुबान से ज़ुबान, माँ से बच्चे और गड़ेरिए से गड़ेरिए तक। आज भी कश्मीरी लोग बातचीत में ऐसे कोई वाख कह देते हैं जैसे बाकी लोग कोई कहावत बोलते हैं, और हर कोई हामी में सिर हिलाता है।"',
      text: 'The verses spread the way songs spread — from mouth to mouth, mother to child, shepherd to shepherd — for hundreds of years before anyone wrote them down. To this day, Kashmiris drop a vakh into conversation the way others quote a proverb, and everyone nods.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'think',
      hi: '"और फिर एक बड़ी प्यारी बहस भी है। कश्मीरी हिंदू उन्हें अपनी परंपरा की महान संत लल्लेश्वरी मानकर पूजते हैं। कश्मीरी मुसलमान उन्हें अपनी परंपरा की महान फ़क़ीर लल्ला आरिफ़ा के रूप में सम्मान देते हैं। दोनों ही उनकी कहानियाँ संजोए हैं। दोनों ही उनके पद दोहराते हैं। वह किसकी हैं?"',
      text: 'And then there is the beautiful argument. Kashmiri Hindus revere her as Lalleshwari, a great saint of their tradition. Kashmiri Muslims revere her as Lalla Arifa, a great mystic of theirs. Both keep her stories. Both quote her verses. Whose is she?',
      ask: {
        q: 'Two communities, one beloved Lalla. Whose is she?',
        options: ['Whichever claim is older wins', 'Both — and she would have smiled at the question', 'Neither, if they cannot agree'],
        answer: 1,
        right: 'Both, and everyone\'s. Her whole message was that the labels people wear matter far less than what is inside — so the shared claim is not a problem. It is her point, proven.',
        wrong: 'No court will ever rule on this, and none should. Both claim her, both are right — and her whole message was that labels matter less than what is inside. The shared claim is her point, proven.'
      } },
    { art: ['courtier'], who: null,
      hi: '"उनके इर्द-गिर्द वैसे ही किस्से-कहानियाँ पनप गईं जैसे चिनार पर काई जमती है — ऐसी कहानियाँ कि कैसे उन्होंने गुरुओं को हैरान कर दिया और एक सीधे-सादे वाक्य से घमंडी लोगों का घमंड तोड़ दिया। कहानियाँ भले अलग हों, पर इन पदों को उनकी ज़रूरत नहीं है। ये पद ही असली चमत्कार हैं।"',
      text: 'Legends grew around her the way moss grows on a chinar — tales of teachers she astonished and proud men she deflated with one plain sentence. The legends differ; the verses do not need them. The verses are the miracle.' },
    { art: ['courtier'], who: null,
      hi: '"विद्वान आपको पूरी संजीदगी से बताएंगे: कश्मीरी साहित्य की शुरुआत उन्हीं से होती है। इस भाषा की जो सबसे पुरानी कविता हम तक पहुँची है, वह लल्ला की ही देन है — एक ऐसी घुमक्कड़ स्त्री जिनके पास अपना कुछ नहीं था, पर जो इस घाटी के लिए सबसे अनमोल विरासतों में से एक छोड़ गईं।"',
      text: 'Scholars will tell you soberly: she is the beginning of Kashmiri literature itself. The oldest poetry in the language that came down to us comes from Lalla — a wandering woman who owned nothing and left one of the richest inheritances in the valley.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"उनके वाख सच्चे हैं, और जब तुम बड़े हो जाओगे तो उन्हें अनुवाद में पढ़ सकते हो — वे आज भी चुभते हैं और जगमगाते हैं। अभी के लिए बस उनकी यह छवि याद रखो: कोई ऐसा जो बेरुखी से निकलकर सीधे सच की राह पर चल पड़ा, और पूरी घाटी को — हर कोने और हर एक इंसान को — पहले से कहीं ज़्यादा अमीर बना गया।"',
      text: 'Her vakhs are real, and when you are older you can read them in translation — they still sting and shine. For now, keep the shape of her: someone who walked out of unkindness, straight toward truth, and left the whole valley — all of it, everyone — richer.' }
  ],
  moral: 'Speak truth plainly enough and everyone will claim you — because truth, spoken plainly, belongs to everyone.',
  source: 'Lal Ded (Lalla, Lalleshwari, Lalla Arifa), fourteenth-century Kashmiri mystic poet. Her vakhs survive, transmitted orally for centuries and collected from the nineteenth century onward; she stands at the fountainhead of Kashmiri literature and is revered by Kashmiri Hindus and Muslims alike. Her life-stories are hagiographic legend and are told here as such; her verses are real and are deliberately not paraphrased into invented quotations.'
},

{
  id: 'fk.dal-morning',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'aaj',
  title: 'The Lake That Is a Neighbourhood',
  hook: 'On Dal Lake in Srinagar, houses float, gardens float, the school run goes by boat — and the vegetable market opens on open water before the sun is properly up.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-JK'],
  words_hi: [['नाव', 'naav', 'boat'], ['सब्ज़ी', 'sabzi', 'vegetable'], ['पानी', 'paani', 'water']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: 'श्रीनगर की डल झील पर सूरज उगने से पहले, पानी चारों तरफ खड़े पहाड़ों के बीच स्लेटी रेशम की चादर जैसा लगता है — और अंधेरे में से, हर दिशा से नावें निकलकर आने लगती हैं। लकड़ी की लंबी और पतली नावें जिन्हें शिकारा कहते हैं, दिल के आकार वाले चप्पुओं से चलाई जाती हैं और ऊपर तक सब्ज़ियों से लदी होती हैं।',
      text: 'Before sunrise on Dal Lake, in Srinagar, the water is a sheet of grey silk with mountains standing round it — and out of the dark, from every direction, come boats. Long, slim wooden boats called shikaras, paddled with heart-shaped oars, loaded to the gunwales with vegetables.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'वे झील के ठीक बीचों-बीच मिलती हैं, और वहीं — बिना किसी दुकान, सड़क या सूखी ज़मीन के — बाज़ार सज जाता है। नावें एक-दूसरे से सटकर जुड़ जाती हैं; पानी के ऊपर ही टमाटर, साग-सब्ज़ी, कमल ककड़ी और ताज़ी रोटियाँ एक हाथ से दूसरे हाथ जाती हैं; और कश्मीरी में बड़े जोश के साथ मोल-भाव चलता है।',
      text: 'They meet in the middle of the lake, and there — with no shop, no street, no dry land anywhere in sight — the market opens. Boats raft up side by side; tomatoes, greens, lotus stems and fresh bread change hands over the water; the haggling is in Kashmiri and it is enthusiastic.' },
    { art: ['courtier'], who: null,
      hi: 'जब तक सूरज पहाड़ों के ऊपर आता है, बाज़ार खत्म हो चुका होता है। नावें बिखर जाती हैं, रेशमी पानी फिर शांत हो जाता है, और देर से जागने वाला कोई सैलानी कभी अंदाज़ा भी नहीं लगा पाएगा कि झील पर सुबह-सुबह का पूरा कारोबार निपट भी चुका है।',
      text: 'By the time the sun clears the mountains, it is over. The boats scatter, the silk smooths out, and a visitor waking late would never guess the lake had already done a whole morning\'s business.' },
    { art: ['guard'], who: null,
      hi: 'क्योंकि डल सिर्फ देखने भर की कोई झील नहीं है — यह तो एक पूरा मोहल्ला है। लोग इस पर और इसके इर्द-गिर्द रहते हैं: पगडंडियों और विलो के पेड़ों वाले तैरते हुए पूरे गाँव, खुद चप्पू चलाकर स्कूल जाते बच्चे, और शिकारे पर बैठकर अपनी डाक बाँटता डाकिया।',
      text: 'Because Dal is not just a lake to look at — it is a neighbourhood. People live on it and around it: whole floating villages of walkways and willows, children paddling themselves to school, a postman doing his round by shikara.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'यहाँ के बाग़-बगीचे भी तैरते हैं। किसान सरकंडों और झील की घास से क्यारियाँ बुनते हैं, उन पर झील की उपजाऊ मिट्टी बिछाते हैं, और तैरते हुए तख्तों पर सब्ज़ियाँ उगाते हैं — ऐसे बाग़ जिन्हें खींचकर कहीं भी ले जाया जा सकता है। एक दादाजी ने घूमने आए अपने पोते को यह बात बताई, जिसे तब तक एक भी बात का यकीन नहीं हुआ जब तक कि वह खुद ऐसे एक बाग़ पर खड़ा नहीं हो गया।',
      text: 'The gardens float too. Farmers weave beds of reeds and lake-weed, spread them with rich lake mud, and grow vegetables on rafts — gardens you can tow. A grandfather explained it to his visiting grandson, who did not believe a word until he stood on one.',
      ask: {
        q: 'Where does the soil of a floating garden get its goodness?',
        options: ['Trucked in from the mountains', 'From the lake itself — mud and weed from the bottom', 'Fertiliser from shops'],
        answer: 1,
        right: 'The lake feeds its own gardens. Mud and weed hauled up from the bottom make some of the richest growing beds in Kashmir.',
        wrong: 'No trucks needed. The lake feeds its own gardens — mud and weed hauled up from the bottom make some of the richest growing beds in Kashmir.'
      } },
    { art: ['courtier'], who: null,
      hi: 'और फिर हाउसबोट भी हैं — नक्काशीदार लकड़ी के लंबे घर जो अपने खूंटों से बंधे पानी पर तैरते रहते हैं, जिनमें बैठकें, फूलों वाले परदे और शान से लिखे नाम होते हैं। यह सिलसिला पीढ़ियों पुराना है: बहुत पहले जो सैलानी ज़मीन पर घर नहीं बना सकते थे, उन्होंने पानी पर घर बना लिए, और कश्मीरी कारीगरों ने उन्हें बेहद खूबसूरत बना दिया।',
      text: 'And then there are the houseboats — long carved wooden houses that ride at their moorings, with sitting rooms and flowered curtains and names painted in proud letters. The tradition goes back generations: visitors long ago who could not build houses on the land built them on the water instead, and Kashmiri craftsmen made them beautiful.' },
    { art: ['pt_heron', 'courtier'], who: null,
      hi: 'झील की अपनी परेशानियाँ हैं — सालों में यह सिकुड़ती चली गई है, जंगली घास और गंदगी ने इसे जकड़ रखा है, और बहुत से लोग इसे साफ़ करने और बचाने में जुटे हैं, क्योंकि ऐसा अनूठा आस-पड़ोस दोबारा नहीं मिल सकता।',
      text: 'The lake has its worries — it has shrunk over the years, and weeds and dirt press it hard, and many people work to clean and protect it, because a neighbourhood this rare cannot be replaced.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'अगर तुम कभी श्रीनगर जाओ, तो वह मुश्किल काम ज़रूर करना: मुँह-अँधेरे उठना। भोर होते ही शिकारे पर बैठकर सब्ज़ी मंडी पहुँचना और नाव के किनारे से ही कुछ — कुछ भी — ख़रीदना। पूरी दुनिया में ऐसी गिनी-चुनी जगहें ही हैं जहाँ खुले पानी पर बाज़ार लगता है। और यह बाज़ार तो सदियों से खुला हुआ है।',
      text: 'If you are ever in Srinagar, do the hard thing: get up in the dark. Take a shikara out to the vegetable market at dawn and buy something — anything — over the side of a boat. There are only a few places on Earth where you can shop on open water. This one has been open for centuries.' }
  ],
  moral: 'People make a home wherever they are — even on water. Given time, they make it beautiful too.',
  source: 'Dal Lake, Srinagar — the dawn floating vegetable market, the shikaras, the floating gardens (raad), the lake-dwelling communities and the houseboat tradition, which grew in the nineteenth century when visitors barred from owning land built on the water. All present-day life, told as it is, including the lake\'s conservation worries.'
},

{
  id: 'fk.boonyi-year',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'aaj',
  title: 'A Year Under the Chinar',
  hook: 'Kashmir measures its year by one enormous tree — green, greener, on fire, and bare — and has done for five hundred years.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 3,
  place: ['IN-JK'],
  words_hi: [['पेड़', 'ped', 'tree'], ['पतझड़', 'patjhad', 'autumn'], ['मौसम', 'mausam', 'season']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'कश्मीरी में इसे बून कहते हैं; किताबों में, चिनार। यह प्लेन प्रजाति का पेड़ है, और कश्मीर में यह इतना विशाल हो जाता है कि देखे बिना यक़ीन ही न हो — तने कमरे से भी ज़्यादा चौड़े, हरी घटा जैसी छतरी, और कुछ पेड़ तो इतने पुराने हैं कि जब वे नन्हे पौधे थे, तब शायद मुग़ल बादशाह भी उनके नीचे बैठे होंगे।',
      text: 'In Kashmiri it is called the boon; in books, the chinar. It is a plane tree, and in Kashmir it grows to a size that has to be seen to be believed — trunks wider than a room, crowns like green weather, some trees so old that Mughal emperors may have sat under them as saplings.' },
    { art: ['guard'], who: null,
      hi: 'ये बड़े-बड़े पेड़ सदियों पहले सोच-समझकर लगाए गए थे — मुग़ल बाग़ों के किनारे, दरगाहों के इर्द-गिर्द, गाँव के मैदानों में और झीलों के टापुओं पर — क्योंकि हर कोई एक बात पर राज़ी था: अगले पाँच सौ सालों में लोग जहाँ भी जुटें, उनके सिर पर एक चिनार ज़रूर होना चाहिए।',
      text: 'The great ones were planted on purpose, centuries ago — along the Mughal gardens, around shrines, on village greens and island corners of the lakes — because everyone agreed on one thing: wherever people would gather for the next five hundred years, there should be a chinar over them.' },
    { art: ['courtier', 'pt_crow'], who: null,
      hi: 'बसंत में यह पेड़ ताज़े, नए हरे पत्तों से खिल उठता है। पूरी गर्मियों में यह गाँव का सबसे बड़ा कमरा बन जाता है — ताश खेलने, ऊन कातने, गपशप लड़ाने, होमवर्क करने और झपकी लेने के लिए ठंडी छाँव, और ऊपर डालियों पर फ़ाख़्ताएँ अपने काम में लगी रहती हैं।',
      text: 'In spring the tree unfolds a fresh young green. All summer it is the village\'s largest room — shade for card games, wool-spinning, gossip, homework and naps, with the doves conducting their business upstairs.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और फिर आता है पतझड़, और चिनार वही करता है जिसके लिए वह मशहूर है: बिना जले आग पकड़ लेना। पहले सुनहरा, फिर चमकीला नारंगी, और फिर गहरा दहकता हुआ लाल — एक ही पेड़ पर ये तीनों रंग एक साथ दिख जाते हैं, और चिनारों की पूरी सड़क राहगीरों के क़दम और दिल दोनों थाम लेती है।',
      text: 'And then comes autumn, and the chinar does the thing it is famous for: it catches fire without burning. Gold first, then amber, then a deep blazing crimson — a single tree can hold all three at once, and a whole avenue of them stops traffic and hearts alike.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      hi: 'बच्चे गिरे हुए पत्ते बटोरते हैं — पाँच कोनों वाले, फैली हुई हथेली जितने बड़े — और जिस किसी के पास भी किताब होती है, उसने पन्नों के बीच एक पत्ता दबाकर ज़रूर रखा होता है। इन सूखे पत्तों के कुछ और पुराने काम भी हैं।',
      text: 'Children gather the fallen leaves — five-pointed, big as a spread hand — and everyone with a book has pressed one flat between the pages. The dry leaves have older uses too.',
      ask: {
        q: 'What did Kashmiris traditionally do with heaps of dry chinar leaves?',
        options: ['Throw them in the lake', 'Burn them slowly into charcoal for the winter fire-pots', 'Nothing — leaves are useless'],
        answer: 1,
        right: 'They became winter\'s fuel — smouldered into charcoal for the kangri, the little fire-pot that keeps a Kashmiri warm. The tree\'s autumn pays for the people\'s winter.',
        wrong: 'Nothing so wasteful. They were smouldered into charcoal for the kangri, the little winter fire-pot — the tree\'s autumn paying for the people\'s winter.'
      } },
    { art: ['courtier'], who: null,
      hi: 'फिर आती है सर्दी: बर्फ़ के बीच वह विशाल पेड़ बिना पत्तों के काला और रूपहला खड़ा रहता है, जैसे स्याही से उकेरा गया हो, सुस्ताता हुआ। कश्मीरी आपको बताएँगे कि वह तब भी ख़ूबसूरत लगता है — शायद सबसे ज़्यादा तभी, जब आप उस पूरी ताक़त को देख पाते हैं जिसने उस सारी शान को सँभाल रखा है।',
      text: 'Then winter: the great tree stands bare and black-silver against the snow, drawn in ink, resting. Kashmiris will tell you it is beautiful even then — perhaps most of all then, when you can see the whole shape of the strength that holds up all that glory.' },
    { art: ['courtier'], who: null,
      hi: 'इन पुराने विशाल पेड़ों की अब गिनती होती है और इन्हें सुरक्षित रखा जाता है, किसी स्मारक की तरह हर एक पर नंबर दर्ज है — क्योंकि जिस पेड़ को खुद को बनाने में सदियाँ लग जाती हैं, वह एक ही दोपहर में ख़त्म हो सकता है, और घाटी जानती है कि उसके पास क्या है।',
      text: 'The old giants are counted and protected now, each one numbered like a monument — because a tree that takes centuries to become itself can be lost in an afternoon, and the valley knows what it has.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'हर जगह कोई न कोई ऐसा जीव या पौधा होता है जिससे लोग समय और मौसम का हिसाब लगाते हैं। कई कश्मीरी परिवारों के लिए यह बून है। आप अपने परिवार से पूछिए कि आप जहाँ से हैं वहाँ ऐसी क्या चीज़ है — कोई पेड़, किसी चिड़िया का आना, या मौसम का पहला फल। हर किसी के पास दीवार पर टंगे कैलेंडर से भी पुराना एक कैलेंडर होता है।',
      text: 'Every place has some living thing it tells time by. In many Kashmiri families it is the boon. Ask your family what it is where you come from — a tree, a bird\'s arrival, a first fruit. Everyone has a calendar older than the one on the wall.' }
  ],
  moral: 'Plant patience in the middle of the village, and for five hundred years everything good happens in its shade.',
  source: 'The chinar (boon) of Kashmir — planted along Mughal-era gardens and village commons, blazing each autumn, its leaves traditionally charcoaled for kangris; the oldest trees are today enumerated and protected. Living seasonal tradition of the valley, told as it lives.'
},

{
  id: 'fk.kangri-winter',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'wadi',
  badge: 'aaj',
  title: 'The Fire You Can Carry',
  hook: 'The coldest stretch of the Kashmiri winter has a name, like a visiting relative. Kashmiris meet it with a woollen gown — and a personal fire, carried like a secret.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-JK'],
  words_hi: [['सर्दी', 'sardi', 'winter'], ['अंगारा', 'angaara', 'ember'], ['ऊन', 'oon', 'wool']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'कश्मीर की सर्दी सचमुच की कड़ाके की सर्दी होती है — खिड़कियों की चौखट तक बर्फ़, बाड़े के खंभों जैसी बर्फ़ की लटकनें, और घर के अंदर भी मुँह से धुएँ की तरह निकलती साँस। इसके सबसे कठिन दौर का तो एक नाम भी है: चिल्लई कलाँ, यानी "बड़ी ठंड", कड़ाके की सर्दी के वे चालीस दिन जब घाटी पूरी तरह जम जाती है।',
      text: 'Kashmiri winter is serious winter — snow to the windowsills, icicles like fence posts, breath like smoke indoors. Its hardest stretch even has a name: Chillai Kalan, "the great cold," forty days in the deep of winter when the valley truly freezes.' },
    { art: ['courtier'], who: null,
      hi: 'इस ठंड से बचने के लिए कश्मीरियों ने बहुत पहले दो नायाब चीज़ें ईजाद की थीं। पहला है फेरन — एक लंबा, ढीला-ढाला ऊनी गाउन जो सारे कपड़ों के ऊपर पहना जाता है और लगभग टखनों तक आता है। यह इतना खुला होता है कि आप अपने दोनों हाथ पूरी तरह अंदर खींच सकते हैं और असल में, सिर निकला हुआ एक छोटा गरम तंबू बन सकते हैं।',
      text: 'Against it, Kashmiris long ago perfected two pieces of equipment. The first is the pheran — a long, loose woollen gown that goes on over everything and reaches nearly to the ankles, roomy enough to pull your arms inside entirely and become, in effect, a small warm tent with a head.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'दूसरा तरीका तो कमाल की सूझबूझ वाला है। कांगड़ी: दहकते अंगारों वाली मिट्टी की एक छोटी-सी हाँडी, जो हत्थेदार सुंदर बुनी हुई बेंत की टोकरी में आराम से समा जाती है। आप इसे फेरन के नीचे, अपने से सटाकर रखते हैं — आपकी अपनी, साथ चलने वाली, न दिखने वाली आग।',
      text: 'The second is the genius part. The kangri: a little clay pot of glowing embers, snug in a beautifully woven willow basket with a handle. You carry it under the pheran, held against you — your own personal, portable, invisible fire.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'कई घरों में सुबह-सुबह कांगड़ी तैयार करना एक छोटे-से नियम जैसा होता है, और यह ज़िम्मेदारी अक्सर दादी या नानी की होती है: कोयले को ठीक से बिछाना, अंगारों को सुलगाना, और ऊपर से राख की परत चढ़ाना ताकि गर्माहट घंटों बनी रहे। अगर अच्छे से तैयार की जाए, तो एक बार भरी कांगड़ी कड़ाके की ठंड में आधा दिन आराम से निकाल देती है।',
      text: 'Filling the kangri is a small morning ceremony in many houses, and it often belongs to a grandmother: charcoal laid just so, embers coaxed, ash banked over the top so the warmth will last for hours. Done well, one filling sees you through half a day of the great cold.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'बाहर से आया एक बच्चा, जो सर्दियों में अपने रिश्तेदारों के यहाँ गया था, उसने देखा कि इतने ठंडे कमरे में भी सब बड़े आराम और चैन से बैठे हैं, और उसने झट से पूछा कि आखिर यह जादू क्या है।',
      text: 'A child from outside, visiting winter relatives, once watched everyone sitting comfortably in a freezing room, mysteriously content, and demanded to know the trick.',
      ask: {
        q: 'No heater in sight, deep snow outside, and everyone perfectly cosy. What is the trick?',
        options: ['Kashmiris do not feel cold', 'Every pheran has a little fire hiding under it', 'The walls are heated'],
        answer: 1,
        right: 'The cousins opened their pherans like coats of a secret society: a glowing kangri under every one. The room was cold. The people were not.',
        wrong: 'Kashmiris feel the cold perfectly well — they have just out-thought it. The cousins opened their pherans: a glowing kangri under every one.'
      } },
    { art: ['courtier'], who: null,
      hi: 'इसके हर हिस्से में एक हुनर है: बेंत बुनने वाले कारीगर जो टोकरियाँ बनाते हैं — कुछ रोज़मर्रा के लिए सादी, तो कुछ तोहफ़ों के लिए सुंदर और रंग-बिरंगी — और इसे बरतने का सलीका भी, क्योंकि कांगड़ी को बड़ी इज़्ज़त और हिफ़ाज़त से संभाला जाता है, जैसा आग रखने वाली हर चीज़ के साथ होना चाहिए।',
      text: 'There is craft in every part of it: the willow-weavers who make the baskets — some plain for every day, some patterned and bright for gifts — and the etiquette of it, because a kangri must be handled with respect and care, as anything holding fire must.' },
    { art: ['courtier'], who: null,
      hi: 'अब इसमें सर्दियों का नाश्ता भी जोड़ लीजिए — गुलाब के रंग जैसी भाप उड़ाती नमकीन चाय, सुबह-सुबह बेकरी से आई ताज़ा रोटी, और सबसे ठंडी सुबहों में गरमा-गरम हरीसा — तो चिल्लई कलाँ दुश्मन नहीं, बल्कि ऐसा मौसम लगने लगता है जिसके लिए ही यह पूरा रिवाज़ बना हो।',
      text: 'Add the winter table — steaming salt tea the colour of a rose, fresh bread from the baker\'s morning batch, harissa on the coldest mornings — and Chillai Kalan starts to look less like an enemy and more like the season the whole culture was designed for.' },
    { art: ['guard'], who: 'mithu',
      hi: 'दुनिया की हर ठंडी जगह ने सर्दी का अपना ही एक तोड़ निकाला है। कांगड़ी कश्मीर का जवाब है, और शायद यह सबसे सुकून भरा जवाब है: ठंड से लड़ो मत। बस थोड़ी-सी आग अपने साथ रखो, और अदब से उसके साथ कमरे में बैठो।',
      text: 'Every cold place on Earth has invented its own answer to winter. The kangri is Kashmir\'s, and it may be the cosiest answer anyone has ever given: do not fight the cold. Just carry a small fire, and share the room with it politely.' }
  ],
  moral: 'You cannot argue with winter, but you can out-think it — with wool, willow, and a small fire carried close.',
  source: 'The kangri and pheran of Kashmir, and Chillai Kalan, the named forty-day deep of the Kashmiri winter (late December to end of January) — living winter culture of the valley, including the willow-craft of kangri weaving. Told as it is lived today.'
},

/* ============================================================ HARYANA ====== */

{
  id: 'it.rakhigarhi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'itihaas',
  title: 'The Village on Top of a Lost City',
  hook: 'The children of one Haryana village always played on the big dusty mounds outside it. Nobody knew the mounds were the roofs of a city five thousand years old.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_bull'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['टीला', 'teela', 'mound'], ['मिट्टी', 'mitti', 'earth, clay'], ['खुदाई', 'khudai', 'digging']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हरियाणा के हिसार ज़िले में राखीगढ़ी नाम का एक किसानी गाँव है — भैंसें, गेहूँ के खेत, ईंटों के मकान और वही आम सा मौसम। और उसके पास और उसके नीचे दबे हैं धूल भरे बड़े-बड़े टीले, जहाँ बच्चे हमेशा से पतंग उड़ाते और बकरियाँ चराते आए हैं।',
      text: 'In Hisar district of Haryana there is a farming village called Rakhigarhi — buffaloes, wheat, brick houses, the usual weather. And beside and beneath it, a set of great dusty mounds, where children have always flown kites and grazed goats.' },
    { art: ['pt_bull', 'courtier'], who: null,
      hi: 'गाँव वालों को हमेशा से पता था कि ये टीले कुछ अजीब हैं। हलों से टकराकर मिट्टी के बहुत पुराने बर्तनों के अजीबोगरीब टुकड़े निकल आते। बारिश के बाद ज़मीन से मोती बाहर निकल आते — छोटे-छोटे, सलीके से गढ़े हुए, छेददार मोती, जैसे किसी दुकान पर नहीं मिलते थे। लोग कंधे उचकाते, सुंदर मोतियों को जेब में रख लेते और वापस खेती-किसानी में लग जाते।',
      text: 'The village always knew the mounds were strange. Ploughs turned up odd bits of very old pottery. After rain, the ground offered up beads — tiny, neat, drilled beads of a kind no shop sold. People shrugged, pocketed the pretty ones, and got on with farming.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'फिर अपने ब्रश और अपने सब्र के साथ पुरातत्वविद आए, और बड़े ध्यान से, एक-एक चौकोर खाने को बड़ी आहिस्ता-आहिस्ता खोलते हुए, उन्होंने उन टीलों को खंगालना शुरू किया।',
      text: 'Then the archaeologists came, with their brushes and their patience, and began — very slowly, square by careful square — to take the mounds apart.',
      ask: {
        q: 'What was inside the mounds the children played on?',
        options: ['Nothing but earth', 'An entire city, thousands of years old', 'A buried fort from the time of the kings'],
        answer: 1,
        right: 'A city. Streets, houses, drains, wells — a whole planned city, from the Harappan civilisation, five thousand years old.',
        wrong: 'Older than any fort, and far more than earth: an entire planned city of the Harappan civilisation, around five thousand years old — streets, houses, drains and all.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और कोई ऐसा-वैसा शहर नहीं। जैसे-जैसे खुदाई आगे बढ़ी, राखीगढ़ी एक बहुत ही विशाल शहर निकला — अब तक मिले हड़प्पा सभ्यता के सबसे बड़े शहरों में से एक, मशहूर मोहनजोदड़ो और हड़प्पा के ही परिवार का, और क्षेत्रफल में उनमें से ज़्यादातर से भी बड़ा।',
      text: 'And not just any city. As the digging spread, Rakhigarhi turned out to be enormous — one of the largest Harappan cities ever found, in the same family as the famous Mohenjo-daro and Harappa, and bigger in area than most of them.' },
    { art: ['courtier'], who: null,
      hi: 'धरती के भीतर से पचास सदियों पहले के लोगों की रोज़मर्रा की ज़िंदगी बाहर निकल आई: सीधी गलियों के किनारे बने कच्ची ईंटों के घर, चूल्हे, अनाज रखने के बड़े-बड़े मटके, मिट्टी के नन्हे पहियों वाली खिलौना गाड़ियाँ, चूड़ियाँ और हज़ारों की तादाद में वही मोती — क्योंकि राखीगढ़ी मोती बनाने का एक बहुत बड़ा केंद्र रहा था, और लगता है कि उसके कारख़ाने दूर-दूर तक मशहूर थे।',
      text: 'Out of the earth came the everyday life of people from fifty centuries ago: mud-brick houses along straight lanes, kitchen hearths, storage jars, toy carts with little clay wheels, bangles, and thousands of those beads — for Rakhigarhi had been a great bead-making town, its workshops famous, it seems, far and wide.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'ज़रा सोचिए कि उन खिलौना गाड़ियों का क्या मतलब है: पाँच हज़ार साल पहले, ठीक इसी ज़मीन पर, बच्चे खिलौना बैलगाड़ियों से खेलते थे — जबकि खुदाई के खंदकों के ठीक बाहर, आज के राखीगढ़ी की असली बैलगाड़ियाँ चरमराहट के साथ गुज़र रही थीं। खुद पुरातत्वविदों ने भी इस बात पर हैरत जताई।',
      text: 'Think what the toy carts mean: five thousand years ago, on this exact ground, children played with toy bullock carts — while outside the trench, present-day Rakhigarhi\'s actual bullock carts creaked past. The archaeologists themselves remarked on it.' },
    { art: ['courtier'], who: null,
      hi: 'खुदाई मौसम-दर-मौसम चलती रहती है, और अब यह गाँव भी इसका हिस्सा बन चुका है — स्थानीय लोग खुद इस खुदाई में काम करते हैं, मिली हुई चीज़ों के लिए एक संग्रहालय बनाया गया है, और राखीगढ़ी के लोग भारत की एक महान प्राचीन जगह के मेज़बान बन गए हैं।',
      text: 'The digging goes on, season by season, and the village is part of it now — locals work the excavations, a museum has been built for the finds, and the people of Rakhigarhi have become hosts of one of India\'s great ancient places.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'याद रखने वाली बात यह है: वे टीले हमेशा से वहीं थे। पतंग उड़ाने और बकरियों के चरने के नीचे, वह खोया हुआ शहर हज़ारों साल तक बड़े सब्र के साथ इंतज़ार करता रहा। भारत की धरती ऐसी ही है — अनोखे अचरजों से भरी, बिल्कुल शांत, बस हाथ में ब्रश लिए किसी खोजी का इंतज़ार करती हुई।',
      text: 'Here is the thought to keep: those mounds were always there. The lost city waited under the kite-flying and the goat-grazing for thousands of years, perfectly patient. India\'s earth is like that — full of astonishments, holding still, waiting for somebody curious with a brush.' }
  ],
  moral: 'The ground under ordinary life is often extraordinary. The difference is somebody deciding to look carefully.',
  source: 'Rakhigarhi, Hisar district, Haryana — among the largest cities of the Harappan (Indus) civilisation, excavated in campaigns by the Archaeological Survey of India and by Deccan College, Pune; finds include planned streets, bead workshops and terracotta toys. Kept to what excavation reports and their published accounts state; wider debates about that civilisation are left to scholars.'
},

{
  id: 'fk.akhara-pond',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'aaj',
  title: 'The Wrestlers by the Village Pond',
  hook: 'In a Haryana village, the day starts before the sun — at the pond, where the buffaloes soak, and beside it, where the wrestlers dig their pit.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_bull'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['कुश्ती', 'kushti', 'wrestling'], ['मिट्टी', 'mitti', 'earth, soil'], ['दंगल', 'dangal', 'wrestling bout, tournament']],
  scenes: [
    { art: ['pt_bull'], who: null,
      hi: 'हरियाणा के हर गाँव का अपना एक जोहड़ होता है — यानी गाँव का तालाब — जहाँ भैंसें चमकते काले टापुओं की तरह पानी में डूबी रहती हैं और बगुले धीरे-धीरे पहरा देते हैं। और तालाब के पास, गाँव-गाँव में, एक और चीज़ भी होती है: अखाड़ा। यानी कुश्ती की मिट्टी।',
      text: 'Every proper Haryana village has its johad — the village pond — where the buffaloes soak like glossy black islands and the herons do their slow patrolling. And near the pond, in village after village, there is something else: the akhara. The wrestling pit.' },
    { art: ['guard'], who: null,
      hi: 'अखाड़ा एक खास मिट्टी का चौकोर घेरा होता है — नरम, गहरी, जिसे तब तक खोदा, समेटा और सींचा जाता है जब तक कि वह कोको पाउडर जैसी न हो जाए — और यह एक तरह से पवित्र ज़मीन होती है। पहलवान इसमें कदम रखने से पहले इसे माथे से लगाते हैं। इसमें जूते पहनकर नहीं जाते। इसमें थूकते नहीं हैं। कभी भी नहीं।',
      text: 'The akhara is a square of special earth — soft, deep, turned and raked and watered until it is like cocoa powder — and it is holy ground of a sort. Wrestlers touch it to their foreheads before they step in. You do not wear shoes in it. You do not spit in it. Ever.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'सूरज निकलने से पहले ही अखाड़ा भर जाता है। पहलवानों की कतारें मुगदर घुमाती हैं, रस्सियों पर चढ़ती हैं, और इतनी दंड-बैठक लगाती हैं कि जब तक आप खुद वहाँ खड़े होकर न गिनें, तब तक यह सिर्फ़ मनगढ़ंत बातें ही लगेंगी।',
      text: 'Before dawn, the pit fills. Rows of wrestlers — pehelwans — swing clubs, climb ropes, and do dand-baithak, push-ups and squats, in numbers that sound like made-up bragging until you stand there and count along.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'पुराने उस्ताद — जो हर अखाड़े में होते हैं — इस जगह को दो ही ईंधनों पर चलाते हैं: अनुशासन और दूध। "कुश्ती कोई लड़ाई नहीं है," वे नए बच्चों से कहते हैं। "लड़ाई गुस्सा होती है। कुश्ती तो अभ्यास, खुराक, नींद और इज़्ज़त है। इस अखाड़े का सबसे ताक़तवर इंसान वही है, जो सबसे ज़्यादा सालों तक सबसे पहले सोकर उठा है।"',
      text: 'The old coach — every akhara has one — runs the place on two fuels: discipline and milk. "Kushti is not fighting," he tells the new children. "Fighting is anger. Kushti is practice, food, sleep, respect. The strongest person in this pit is the one who got up earliest for the most years."' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'बहुत, बहुत लंबे समय तक अखाड़ा सिर्फ़ लड़कों के लिए ही था। फिर, अभी कुछ ही साल पहले, हरियाणा में लड़कियाँ भी अखाड़ों में उतरने लगीं — और पूरे ज़िले की त्योरियों के बावजूद कुछ पिताओं और कोचों ने उनका साथ दिया।',
      text: 'For a long, long time, the pit was only for boys. Then, not so many years ago, girls in Haryana began stepping into the akharas too — and some fathers and coaches backed them against every frown in the district.',
      ask: {
        q: 'The village frowns: girls, wrestling? What settled the argument?',
        options: ['The frowning won; the girls went home', 'The girls started winning — medals, for India, on the world\'s biggest stages', 'Wrestling was banned for everyone'],
        answer: 1,
        right: 'They won. Haryana\'s daughters came home from world championships and Olympic Games with medals — and the frowning had nothing left to say.',
        wrong: 'The girls did not go home. They went to world championships and Olympic Games and came home with medals for India — and the frowning had nothing left to say.'
      } },
    { art: ['guard'], who: null,
      hi: 'यह छोटा-सा राज्य अब भारत के कुश्ती और मुक्केबाज़ी के पदकों का एक बड़ा हिस्सा जीतता है, और हर किसी की अपनी राय है — यहाँ का दूध, घी, हवा, या यहाँ की ज़िद। कोच मुस्कुराते हैं और अखाड़े की ओर इशारा करते हैं: यह बरसों-बरस सुबह जल्दी उठने की बात है।',
      text: 'This little state now produces an outsized share of India\'s wrestling and boxing medals, and everyone has a theory — the milk, the ghee, the air, the stubbornness. The coaches smile and point at the pit: it is the getting up early, for the most years.' },
    { art: ['courtier'], who: null,
      hi: 'और जब कोई दंगल होता है — यानी कुश्ती का मुकाबला — तो पूरा इलाका उमड़ पड़ता है। खुले में मिट्टी पर दाँव-पेंच, लाउडस्पीकर, गन्ने बेचने वाले, दाँव-पेचों पर अपनी पक्की राय रखने वाली दादियाँ, और सबसे आगे की कतार में बैठकर अपने भविष्य का फ़ैसला करते छोटे-छोटे बच्चे।',
      text: 'And when a dangal is held — a tournament — the whole countryside comes. Bouts on the earth in the open, loudspeakers, sugarcane sellers, grandmothers with strong opinions about technique, and small children in the front row, deciding their futures.' },
    { art: ['guard'], who: 'mithu',
      hi: 'अगर आपका परिवार हरियाणा से है, तो पूछिए कि परिवार में कौन-कौन कुश्ती लड़ता था — कई परिवारों में यह जवाब पीढ़ियों पुराना है, और अब इसमें कोई बुआ या भतीजी भी शामिल है। वह तालाब, वह अखाड़ा, वह भोर: सब कुछ आज भी वहीं है, हर सुबह।',
      text: 'If your family is from Haryana, ask who in the family wrestled — in many families the answer goes back generations, and now includes an aunt or a niece. The pond, the pit, the dawn: it is all still there, every morning.' }
  ],
  moral: 'Strength is not a gift some people are given. It is dawn after dawn after dawn, stacked up quietly.',
  source: 'The akhara and dangal culture of rural Haryana — living tradition, from the sanctity of the pit earth to the dawn regimen — and the modern rise of Haryana\'s wrestlers, including its celebrated women medallists at world and Olympic level. Told as it lives today; ask any village with a johad.'
},

{
  id: 'fk.surajkund',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'aaj',
  title: 'The Sun Pool Where India Comes to Sell Wonders',
  hook: 'A thousand-year-old pool shaped like the rising sun stands quiet most of the year. Then, every spring, all of India\'s craftspeople arrive at once.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-HR'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['कुंड', 'kund', 'pool, tank'], ['कारीगर', 'kaarigar', 'craftsperson']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दक्षिणी हरियाणा के फ़रीदाबाद में, अरावली पहाड़ियों के पुराने पथरीले कंधों पर, सीढ़ियों के एक बड़े घुमाव में बना पत्थरों का एक प्राचीन कुंड है — जिसका आकार, जैसा कि लोग हमेशा कहते आए हैं, उगते सूरज जैसा है। इसका नाम भी यही कहता है: सूरजकुंड। यानी सूरज का कुंड।',
      text: 'In Faridabad, in southern Haryana, on the rocky old shoulders of the Aravalli hills, there is an ancient stone pool built in a great curve of steps — shaped, people have always said, like the rising sun. Its name says the same: Surajkund. The pool of the sun.' },
    { art: ['courtier'], who: null,
      hi: 'मान्यताएँ इसे तोमर वंश के एक सरदार सूरजपाल से जोड़ती हैं, जिनके बारे में कहा जाता है कि उन्होंने इसे करीब एक हज़ार साल पहले बनवाया था — बारिश का पानी सहेजने की एक जगह, जिसके सीढ़ीदार पथरीले किनारों पर धूप चाहने वाले बैठ सकें। वह पुराना कुंड आज भी वक्त की मार झेले, शांत भाव से अपने उसी घुमाव को थामे खड़ा है।',
      text: 'Tradition ties it to a chieftain of the Tomar clan, named Surajpal, who is said to have built it around a thousand years ago — a place to catch and keep the rain, with stepped stone banks where the sun-loving could sit. The old pool still holds its curve, weathered and calm.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"साल के ज़्यादातर दिनों में यह एक शांत सा स्मारक रहता है। और फिर फ़रवरी का महीना आता है — और इस पुराने सूरज कुंड के किनारे, दुनिया के सबसे बड़े हस्तशिल्प मेलों में से एक के दरवाज़े खुल जाते हैं: सूरजकुंड मेला।"',
      text: 'For most of the year it is a quiet monument. And then February comes — and beside the old sun pool, one of the biggest craft fairs on Earth opens its gates: the Surajkund Mela.' },
    { art: ['courtier'], who: null,
      hi: '"भारत के कोने-कोने से कारीगर यहाँ आते हैं। दक्षिण से बुनकर आते हैं, ऐसा रेशम लेकर जो पानी की तरह बहता है। जयपुर की ब्लू पॉटरी। पूर्वोत्तर का बाँस का काम। पास के ही पंजाब की फुलकारी कढ़ाई। शीशे का काम, पत्थर की नक्काशी, काँसे के बर्तन, खिलौने — गलियों की गलियाँ यह दिखाती हुईं कि हुनरमंद हाथ क्या-क्या कर सकते हैं।"',
      text: 'Craftspeople come from every corner of India. Weavers from the south with silk that pours like water. Blue pottery from Jaipur. Bamboo work from the Northeast. Phulkari embroidery from Punjab next door. Mirror-work, stone-work, bell metal, toys — lane upon lane of hands showing what hands can do.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: '"मेले में अपने माता-पिता के साथ आई एक लड़की ने एक कुम्हार को एक मिनट से भी कम समय में चाक पर मटका बनाते देखा, और उसने उनसे पूछा कि यह सीखने में उन्हें कितना समय लगा।"',
      text: 'A girl at the mela with her parents watched a potter throw a pot in under a minute and asked him how long it took to learn to do that.',
      ask: {
        q: 'One minute to make the pot. How long to learn the minute?',
        options: ['About a week', 'A childhood — and usually several generations before that', 'You just need a good wheel'],
        answer: 1,
        right: '"My whole childhood," said the potter, "and my father\'s, and his father\'s. The pot takes a minute. The minute took a hundred years."',
        wrong: 'The potter laughed at "a week." "My whole childhood," he said, "and my father\'s, and his father\'s. The pot takes a minute. The minute took a hundred years."'
      } },
    { art: ['guard'], who: null,
      hi: '"यहाँ हर जगह का खाना है, हर साल किसी अलग राज्य के लोक नर्तक और ढोल बजाने वाले हैं, इन सबके ऊपर घूमता एक बड़ा सा झूला है — और शाम होते-होते, अपने हाथों में मिट्टी की चिड़िया, बुना हुआ थैला या छोटी सी दरी लिए बाहर निकलते परिवार हैं, मानो हर कोई किसी के सौ सालों की मेहनत अपने घर ले जा रहा हो।"',
      text: 'There is food from everywhere, folk dancers and drummers from a different featured state each year, a great wheel turning over it all — and by evening, families walking out with a clay bird, a woven bag, a small carpet, each one carrying somebody\'s hundred years home.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और सूरज कुंड की पुरानी पत्थरों वाली सीढ़ियाँ एक बार फिर काम में आने लगती हैं — बैठने की जगह की तरह। हज़ार साल पुराने उस घेरे पर बैठकर भीड़ नीचे नाचने वालों को देखती है, जिसे देखकर इसे बनाने वालों को शायद बहुत ख़ुशी होती: उन्होंने पानी के किनारे लोगों के जुटने की जगह बनाई थी, और लोग आज भी वहाँ जुट रहे हैं।"',
      text: 'And the old stone steps of the sun pool get used again — as seats. Crowds settle on the thousand-year-old curve to watch the dancers below, which would probably please the builders: they made a place for people to gather by water, and people are still gathering.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"पुराने बनाने वालों ने अपने लोगों के लिए पानी सहेजने को एक कुंड बनाया था। एक हज़ार साल बाद, हर बसंत में कुछ हफ़्तों के लिए, यह पानी की जगह पूरे भारत को अपने में समेट लेता है। अगर तुम कभी फ़रवरी में जा सको — तो ज़रूर जाना, और जो सबसे बुज़ुर्ग हाथ तुम्हें दिखें, उनकी बनाई कोई चीज़ ख़रीदना।"',
      text: 'The old builders made a pool to hold water for their people. A thousand years later, for a few weeks each spring, it holds all of India instead. If you can ever go in February — go, and buy the thing made by the oldest hands you can find.' }
  ],
  moral: 'A crafted thing is time made visible — a minute of skill standing on a hundred years of learning.',
  source: 'Surajkund, Faridabad, Haryana — the sun-shaped reservoir attributed by tradition to the Tomar chief Surajpal (c. 10th century), and the annual Surajkund International Crafts Mela held beside it each February since 1987. The pool\'s attribution is tradition and is told as tradition; the mela is very much present-day fact.'
},

{
  id: 'fk.kurukshetra-waters',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'The Land Where the Gita Was Spoken',
  hook: 'Haryana\'s flat green farmland holds the stage of India\'s greatest epic — and a banyan tree under which, tradition says, the most famous conversation in the world took place.',
  hero: 'krishna',
  cast: ['krishna', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['तीर्थ', 'teerth', 'pilgrimage place'], ['बरगद', 'bargad', 'banyan'], ['जल', 'jal', 'water']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हरियाणा के गेहूँ और सरसों के खेतों के बीच उत्तर की ओर बढ़िए, तो एक ऐसा नाम सामने आता है जिसे सुनते ही पूरा महाभारत मानो चौंककर खड़ा हो जाता है: कुरुक्षेत्र। देखने में साधारण पर असल में बेहद अनोखा यह भूभाग वही जगह है, जहाँ परंपरा के अनुसार इस महाकाव्य का सबसे बड़ा मोड़ आया था — और इसके अलावा भी बहुत कुछ हुआ था।',
      text: 'Drive north through Haryana\'s wheat and mustard and you come to a name that makes the whole Mahabharata sit up: Kurukshetra. This ordinary-looking, extraordinary stretch of land is where tradition places the epic\'s great turning — and much more besides.' },
    { art: ['guard'], who: null,
      hi: 'पुराने ग्रंथ इस पूरे इलाके को धर्मक्षेत्र कहते हैं — यानी धर्म और सही रास्ते पर चलने की भूमि — और बताते हैं कि यह इस महागाथा से भी बहुत पहले से पावन रहा है: ऋषियों, यज्ञों और पवित्र सरोवरों की धरती, जहाँ युगों-युगों की प्रार्थनाएँ मिट्टी में रची-बसी थीं।',
      text: 'The old texts call this whole region Dharmakshetra — the field of dharma, of doing right — and say it was hallowed long before the epic: a land of sages, sacrifices, and sacred waters, where prayers had soaked into the ground for ages.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'यहाँ के सरोवर आज भी इसकी शान हैं। कुरुक्षेत्र के दिल में बसा है ब्रह्म सरोवर — एक ऐसा पावन कुंड, जो इतना विशाल है कि शांत चौकोर समंदर जैसा लगता है, जिसके चारों तरफ़ नीचे उतरती सीढ़ियाँ हैं और त्योहारों के समय इस पर इतने दीये तैराए जाते हैं कि पानी छोटी-छोटी लपटों का आसमान बन जाता है।',
      text: 'The waters are still its glory. At the heart of Kurukshetra lies the Brahma Sarovar — a sacred pool so vast it feels like a calm square sea, with steps going down on every side and lamps floated on it at festival time until the water is a sky of small fires.' },
    { art: ['courtier'], who: null,
      hi: 'पास ही सन्निहित सरोवर है, जिसके बारे में मान्यता है कि कुछ ख़ास मौक़ों पर सारे पावन जल यहाँ आकर मिलते हैं। और सूर्य ग्रहण के दिनों में यहाँ लाखों तीर्थयात्री स्नान करने आते हैं — क्योंकि एक पुरानी मान्यता है कि ग्रहण के समय कुरुक्षेत्र में स्नान करने से एक साथ सारे तीर्थों का पुण्य मिल जाता है।',
      text: 'Nearby lies the Sannihit Sarovar, where tradition says all the sacred waters gather and meet at certain times. And on days of solar eclipse, lakhs of pilgrims come to bathe here — for an old belief holds that at eclipse, bathing at Kurukshetra carries the merit of all tirthas at once.' },
    { art: ['krishna', 'courtier'], who: null, mood: 'think',
      hi: 'और फिर इन सबमें सबसे शांत और सबसे प्रभावशाली जगह आती है: पुराने सरोवर के किनारे स्थित ज्योतिसर, जहाँ एक बरगद का पेड़ खड़ा है। परंपरा मानती है कि इसी बरगद के पूर्वज के नीचे — और कुछ के अनुसार ठीक इसी पेड़ के नीचे — श्रीकृष्ण ने अर्जुन को भगवद्गीता सुनाई थी।',
      text: 'And then there is the quietest, mightiest spot of all: Jyotisar, on the old pool\'s edge, where a banyan tree stands. Tradition holds that under this banyan\'s ancestor — some say this very tree — Krishna spoke the Bhagavad Gita to Arjuna.',
      ask: {
        q: 'The Gita begins at the hardest moment of Arjuna\'s life — he loses heart and cannot go on. What does Krishna do?',
        options: ['Scolds him and orders him forward', 'Stops everything, and talks with him — all the way through it', 'Leaves him to work it out alone'],
        answer: 1,
        right: 'He stops the whole world, and talks with his friend — about duty, about fear, about what a self really is — until Arjuna can stand up again. That conversation is the Gita.',
        wrong: 'No scolding, no leaving. Krishna stops the whole world and talks with his friend — about duty, fear, and what a self really is — until Arjuna can stand up again. That conversation is the Gita.'
      } },
    { art: ['krishna'], who: null,
      hi: 'उस पेड़ के नीचे जो कहा गया, उस पर पूरे के पूरे पुस्तकालय लिखे जा चुके हैं, और दुनिया भर के लोग आज भी इसे तब पढ़ते हैं जब ज़िंदगी के किसी मोड़ पर उनका दिल डगमगाने लगता है। दुनिया की यह सबसे ज़्यादा पढ़ी जाने वाली बातचीत हरियाणा के एक खेत में, एक बरगद के नीचे हुई — यह बात बिल्कुल सही लगती है: आख़िर भारत में ज्ञान को पेड़ों की छाँव में बैठना ही तो पसंद है।',
      text: 'Whole libraries have been written about what was said under that tree, and people across the world still read it when their own hearts fail them at some crossing. That the world\'s most-read conversation is placed in a Haryana field, under a banyan, feels exactly right: wisdom, in India, likes to sit under trees.' },
    { art: ['courtier'], who: null,
      hi: '"आज भी कुरुक्षेत्र ने यह सब कुछ सहेज रखा है — बड़े-बड़े सरोवर, ज्योतिसर का बरगद, मंदिर, और हर सर्दियों में दीयों से जगमगाते सरोवरों वाला गीता महोत्सव — और इसके चारों तरफ़, हर ओर, गेहूं की फ़सल लहलहाती रहती है, जैसा कि होना ही चाहिए।"',
      text: 'Today Kurukshetra keeps it all together — the great pools, the banyan at Jyotisar, temples, a Gita festival each winter with the pools full of lamps — and around it, on every side, the wheat goes on growing, as it should.' },
    { art: ['krishna'], who: 'mithu',
      hi: '"कई परिवारों में गीता पढ़ी जाती है, या उसका कोई श्लोक ज़ुबानी याद होता है; दूसरे परिवार दूसरी किताबें और दूसरी सीख संभाल कर रखते हैं। अपने परिवार से पूछिए कि जब किसी दोराहे पर मन डगमगाने लगे, तो वे किसका सहारा लेते हैं। हर किसी का कहीं न कहीं एक ज्योतिसर ज़रूर होता है।"',
      text: 'In many families the Gita is read, or a verse of it is known by heart; other families keep other books and other wisdom. Ask your family what they turn to when the heart fails at a crossing. Everyone has a Jyotisar somewhere.' }
  ],
  moral: 'When someone loses heart, the greatest help is not a push — it is somebody willing to stop and talk it all the way through.',
  source: 'Kurukshetra, Haryana — Dharmakshetra of the Mahabharata\'s opening verse; the Brahma Sarovar and Sannihit Sarovar with their eclipse-bathing tradition; and the banyan of Jyotisar, held by tradition to mark where the Gita was spoken. Sacred geography told as the tradition tells it; the battle itself is not the subject here and is left offstage.'
},

{
  id: 'fk.bail-race',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'The Race of the Two Bullock Carts',
  hook: 'One farmer had the shiniest new bullocks in the village. One had two old steady ones. Naturally, there had to be a race.',
  hero: 'pt_bull',
  cast: ['pt_bull', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['बैल', 'bail', 'ox, bullock'], ['गाड़ी', 'gaadi', 'cart'], ['धीरे', 'dheere', 'slowly']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"यह किस्सा हरियाणा के गांवों में सुनाया जाता है, जहां कभी बैलों की एक अच्छी जोड़ी ही किसी परिवार का ट्रैक्टर, ट्रक और शान—सब कुछ हुआ करती थी, और जहां मेले के वक्त बैलगाड़ी की दौड़ पूरे जिले में साल भर तक चर्चा और बहस का मुद्दा बनी रह सकती थी।"',
      text: 'They tell this one in the villages of Haryana, where a good pair of bullocks was once a family\'s tractor, truck and pride all in one, and where a bullock-cart race at fair time could keep the district in arguments for a year.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"एक किसान — उन्हें चौधरी रामफल कह लीजिए, सब यही कहते हैं — पशु मेले से बैलों की एक शानदार नई जोड़ी लेकर घर लौटे: जवान, ऊंचे-पूरे, ताज़े दूध जैसे सफेद, रंगे हुए सींगों और पीतल की घंटियों वाले। वे उन्हें गांव के बीच से दो बार धीरे-धीरे लेकर निकले, ताकि कोई उन्हें देखने से चूक न जाए।"',
      text: 'A farmer — call him Chaudhary Ramphal, everyone does — came home from the cattle fair with a magnificent new pair: young, tall, white as fresh milk, with painted horns and brass bells. He drove them through the village twice, slowly, to make sure nobody missed them.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"उनके पड़ोसी, बूढ़े हुकम सिंह के पास वही पुरानी जोड़ी थी जिसे वे बारह सालों से जोत रहे थे — सलेटी, शांत, बिना किसी हड़बड़ी वाली, और दोनों में से एक का सींग मुड़ा हुआ। \\"बढ़िया जानवर हैं,\\" उन्होंने धीमे से कहा। \\"मेरे वाले तो बस दो ही बातें जानते हैं। मगर कायदे से जानते हैं।\\" रामफल ने, ज़ाहिर है, वहीं के वहीं दौड़ लगाने की चुनौती दे डाली।"',
      text: 'His neighbour, old Hukum Singh, had the same pair he had worked for twelve years — grey, quiet, unhurried, with one bent horn between them. "Fine animals," he said mildly. "Mine only know two things. But they know them properly." Ramphal, of course, proposed a race on the spot.' },
    { art: ['pt_bull'], who: null,
      hi: '"दौड़ के दिन तीन गांवों की भीड़ उमड़ पड़ी। रास्ता तय था: तालाब के किनारे-किनारे, दूर वाले बरगद का चक्कर काटकर, वापस कुएं तक। गाड़ियां चमकाई गईं। घंटियां चमकाई गईं। छोटे लड़कों को अच्छा नज़ारा देखने के लिए पेड़ों पर चढ़ाया गया, पेड़ों से उतारा गया, और फिर चढ़ाया गया।"',
      text: 'Race day pulled in three villages. The course: out along the pond, around the far banyan, and back to the well. Carts polished. Bells shined. Small boys placed in trees for a better view, and removed from trees, and placed again.' },
    { art: ['pt_bull', 'guard'], who: null, mood: 'wow',
      hi: 'पगड़ी गिरते ही सब छूटे — और रामफल की सफ़ेद जोड़ी हवा की तरह भागी। तालाब तक आते-आते वे दस गाड़ी आगे निकल चुके थे। रामफल गाड़ी में खड़ा होकर भीड़ की तरफ़ हाथ हिलाने लगा, जो किसी भी कहानी में हमेशा वही पल होता है जब चिंता शुरू हो जानी चाहिए।',
      text: 'At the drop of the pagri they were off — and Ramphal\'s white pair went like the wind. By the pond they were ten lengths ahead. Ramphal stood up in the cart waving to the crowd, which is always, in any story, the moment to start worrying.' },
    { art: ['pt_bull', 'courtier'], who: null, mood: 'think',
      hi: 'क्योंकि उस जवान जोड़ी में तेज़ी तो थी, लेकिन रास्ता दूर वाले बरगद के पास मुड़ता था — और सरपट दौड़ती बैलगाड़ी को मोड़ना तेज़ी का काम बिल्कुल नहीं होता।',
      text: 'Because the young pair had speed, but the far banyan is where the course turns — and turning a galloping bullock cart is not about speed at all.',
      ask: {
        q: 'A sharp turn at full gallop, with a proud driver standing up waving. What happens at the banyan?',
        options: ['The white pair turn perfectly and win', 'The white pair miss the turn and end up in the mustard field', 'Both carts stop for a rest'],
        answer: 1,
        right: 'Straight past the banyan and into Sarpanch-ji\'s mustard, cart and all, where the young bullocks decided the race was over and lunch had begun.',
        wrong: 'Turning is a skill, and nobody had taught it to them at that speed. Straight past the banyan they went, into Sarpanch-ji\'s mustard field, where they decided the race was over and lunch had begun.'
      } },
    { art: ['pt_bull', 'guard'], who: null,
      hi: 'और पीछे-पीछे आए हुकम सिंह के बूढ़े सलेटी बैल — धीरे-धीरे, दोपहर की परछाईं की तरह सधे हुए — बरगद का मोड़ ऐसे काटा जैसे सुई में धागा पिरोया जाता है, क्योंकि उन्होंने बारह सालों में दस हज़ार मोड़ काटे थे, और अपनी ही चाल में चलते हुए, सबसे पहले कुएँ पर पहुँचे।',
      text: 'And along came Hukum Singh\'s old greys — dheere, dheere, steady as the noon shadow — took the banyan turn like thread going through a needle, because they had turned ten thousand corners in twelve years, and came home to the well at their own pace, first.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'रामफल ने सरसों का हर्जाना भरा, जो सबको सबसे मज़ेदार बात लगी, और पूरी भीड़ को गन्ने का रस पिलाया। उसने सफ़ेद जोड़ी को अपने पास ही रखा — बारह साल तक मोड़ काटते-काटते वे भी बहुत बढ़िया निकले। और उसके बाद वह चलती गाड़ी में कभी खड़ा नहीं हुआ।',
      text: 'Ramphal paid for the mustard, which everyone agreed was the funniest part, and stood the whole crowd sugarcane juice. He kept the white pair — they turned out fine, once they had done their twelve years of corners. And he never stood up in a moving cart again.' },
    { art: ['pt_bull'], who: 'mithu',
      hi: 'कुएँ के पास बैठे बुज़ुर्ग आज भी यह कहानी इसी बात पर ख़त्म करते हैं: रफ़्तार तो मेले में ख़रीदी जा सकती है। पर ठहराव नहीं। वह तो बस एक-एक मोड़ काटकर ही आता है।',
      text: 'The old men by the well still close this story the same way: speed you can buy at the fair. Steadiness you cannot. It only comes one corner at a time.' }
  ],
  moral: 'Speed wins the straight parts. Steadiness wins the corners — and every course has corners.',
  source: 'A race-day tale of the kind told in rural Haryana, where bullock-cart races were long the pride of village fairs. Village-humour oral tradition with no single collector and many local versions; this telling follows the common shape of the slow-and-steady race tale, and says so honestly.'
},

{
  id: 'fk.charpai-darbar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'aaj',
  title: 'The Parliament Under the Banyan',
  hook: 'Every Haryana village has an open-air parliament. Its benches are rope cots, its roof is a banyan tree, and its sessions begin when the day\'s work ends.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_bull'],
  minutes: 3,
  place: ['IN-HR'],
  words_hi: [['चारपाई', 'charpai', 'rope cot'], ['बातें', 'baatein', 'talk, conversation'], ['हुक्का', 'hukka', 'hookah pipe']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'शाम को, जब भैंसों का दूध दुह लिया जाता है और औज़ार खूँटी पर टांग दिए जाते हैं, तब चारपाइयाँ बाहर निकलती हैं — उत्तर भारत की लकड़ी और रस्सी वाली खाट — और खुले में, बड़े बरगद के नीचे या किसी की बैठक के बाहर, एक दोस्ताना गोल घेरे में बिछा दी जाती हैं।',
      text: 'In the evening, when the buffaloes have been milked and the tools hung up, the charpais come out — the wooden-framed rope cots of the north — and are set down in the open, under the big banyan or beside somebody\'s gate, in a rough friendly circle.' },
    { art: ['guard'], who: null,
      hi: 'यह है गाँव की बैठक — जहाँ सब आकर बैठते हैं। बड़े-बुजुर्ग खाटों पर जगह लेते हैं, बीच में एक पुराना हुक्का पीढ़ियों से चले आ रहे अंदाज़ में धीरे-धीरे गुड़गुड़ाता हुआ घेरे में घूमता है, और बातें शुरू हो जाती हैं। यह सिलसिला तब तक खत्म नहीं होगा, जब तक आसमान में तारे पूरी तरह से निकल न आएँ।',
      text: 'This is the village baithak — the sitting. The elders take the cots, in the middle an old hookah gurgles its way slowly around their circle as it has for generations, and the talk begins. It will not end until the stars are properly out.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और बातें भी कैसी-कैसी! गेहूँ के भाव। किसके बेटे को सरकारी नौकरी मिली। आने वाली कोई शादी। देर से आती बारिश, जिस पर ऐसे चर्चा होती है मानो मंत्रियों की कोई गंभीर बैठक चल रही हो। और हर बात में घुला होता है मशहूर हरियाणवी मज़ाक — लू की हवा जैसा सूखा, सपाट चेहरे वाला, तीखा और एक ही साथ प्यार भरा भी।',
      text: 'And what talk it is. The price of wheat. Whose son got a government job. The wedding coming up. The rain that is late, discussed with the seriousness of a cabinet meeting. And laced through everything, the famous Haryanvi humour — dry as the loo wind, deadpan, merciless and affectionate at once.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'आधी बातचीत तो पीढ़ियों से तराशी हुई कहावतें और ताने होते हैं। कोई शेखी बघारता है, तो एक ही जुमले में उसकी हवा निकल जाती है। कोई रोना रोता है, तो उसे ऐसे आदमी की कहानी सुना दी जाती है जो उससे भी ज़्यादा रोता था। कोई बच नहीं पाता, और कोई बचना चाहता भी नहीं — क्योंकि इस घेरे में खिंचाई होना ही तो इस बात का सबूत है कि आप उनके अपने हैं।',
      text: 'Half the talk is proverbs and taunts polished by generations. A boaster gets deflated in one line. A complainer gets a story about a man who complained more. Nobody escapes, and nobody would want to — being teased in the circle is how you know you belong to it.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'और हँसी-मज़ाक के बीच, चुपके से यह बैठक बड़े-बड़े काम भी निपटा देती है। खेत की मेड़ का कोई झगड़ा छिड़ जाता है — घुमा-फिराकर, जैसे ऐसे मसले उठा करते हैं। हर कोई अपनी बात रखता है। किसी को याद आता है कि दादा-परदादाओं ने इसे कैसे सुलझाया था।',
      text: 'And quietly, between the jokes, the circle does real work. A quarrel over a field boundary comes up — sideways, as these things do. Everyone has a say. Somebody remembers how the grandfathers settled it.',
      ask: {
        q: 'A quarrel reaches the charpai circle. What usually happens to it there?',
        options: ['It grows into a bigger quarrel', 'It gets talked, teased and remembered down to a settlement', 'It is forbidden to mention quarrels'],
        answer: 1,
        right: 'Between the proverbs and the memory of how it was done before, most quarrels shrink until they fit inside a handshake. That is the circle\'s real business.',
        wrong: 'Quarrels come to the circle precisely to shrink. Between the teasing and the memory of the grandfathers, most of them end up small enough to fit inside a handshake.'
      } },
    { art: ['pt_bull', 'courtier'], who: null,
      hi: 'बच्चों को कहने के लिए तो सोने भेज दिया जाता है, मगर वे बाहर की खाटों पर सोने का नाटक करते हुए पड़े रहते हैं और सब कुछ समेटते जाते हैं — कहानियाँ, इतिहास और मज़ाक उड़ाने की बिल्कुल सही टाइमिंग। यह एक तरह का स्कूल ही है, और सब ऐसा दिखाते हैं जैसे यह कोई स्कूल नहीं, इसीलिए तो यह इतना बढ़िया चलता है।',
      text: 'Children are technically sent to bed and actually lie on the outer cots pretending to sleep, collecting everything — the stories, the history, the exact timing of the jokes. This is a school, and everyone pretends it is not, which is why it works.' },
    { art: ['guard'], who: null,
      hi: 'देर रात, जब बैठक आखिरकार उठती है, तो गरम दूध के गिलास बांटे जाते हैं, खाटों को दीवार के सहारे खड़ा कर दिया जाता है, और बरगद सुबह तक चौपाल को अकेले अपने पास संभाल लेता है — संसद स्थगित हो गई, जो कल अपने तय समय पर फिर बैठेगी, यानी जैसे ही दिन भर का काम खत्म हो जाएगा।',
      text: 'Late, when the circle finally breaks up, glasses of hot milk go round, the cots are stood up against the walls, and the banyan keeps the square to itself till morning — the parliament adjourned, to reconvene tomorrow at the usual hour, which is whenever the work is done.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आजकल की शामों पर भले ही फ़ोन और टीवी का कब्ज़ा हो गया हो, फिर भी गाँव-गाँव में चारपाइयाँ बाहर बिछती हैं और महफ़िल जमती है। अगर आपका परिवार इन इलाकों से है, तो अपने सबसे बुज़ुर्ग रिश्तेदार से पूछिए कि उनके बचपन की बैठकों में किन बातों की चर्चा होती थी। फिर देखिएगा, वे एक घंटे तक बोलते ही चले जाएँगे।',
      text: 'Phones and televisions bid hard for the evenings now, and still, in village after village, the cots come out and the circle forms. If your family comes from these parts, ask your oldest relative what the baithak of their childhood talked about. Then notice them talk for an hour.' }
  ],
  moral: 'A village stays a village because its people sit down together in the evening with nothing but talk — and the talk turns out to be everything.',
  source: 'The evening charpai baithak of rural Haryana — the open-air circle of cots, hookah etiquette among elders, proverb-laden Haryanvi wit and informal dispute-settling. Living village culture, told as it is; the archive is oral, and its keepers are on the cots. Ask your family.'
},

/* ============================================================= PUNJAB ====== */

{
  id: 'fk.dulla-bhatti',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'The Song Around the Lohri Fire',
  hook: 'Every January, around bonfires across Punjab, children sing a song to a man who lived four hundred years ago. This is who they are singing to.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['आग', 'aag', 'fire'], ['बेटी', 'beti', 'daughter'], ['गुड़', 'gud', 'jaggery']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'लोहड़ी की रात, पंजाब की कड़ाके की ठंड में, अलाव जल उठता है और बच्चे गाते हुए घर-घर जाते हैं — और हर बच्चे को इस गीत की पहली पंक्तियाँ याद होती हैं: सुंदर मुंदरिए, हो! तेरा कौन विचारा, हो! दुल्ला भट्टी वाला, हो! सुंदर लड़की, अरे! तुम्हारा ख़्याल कौन रखेगा? दुल्ला भट्टी रखेगा!',
      text: 'On Lohri night, in the middle of the Punjabi winter, the bonfire goes up and the children go round the houses singing — and every child knows the song\'s first lines: Sundar mundriye, ho! Tera kaun vichara, ho! Dulla Bhatti wala, ho! Pretty girl, hey! Who will look out for you? Dulla Bhatti will!' },
    { art: ['courtier'], who: null,
      hi: 'दुल्ला भट्टी सचमुच का इंसान था — बादशाह अकबर के ज़माने में, सांदल बार इलाके के भट्टी कबीले का एक पंजाबी मुसलमान। लोकगीतों में उसे बार के अपने रॉबिन हुड के रूप में याद किया जाता है: जो बादशाह के लगान वसूलने वालों के आगे कभी नहीं झुका, ग़रीबों के लिए जिसका हाथ हमेशा खुला रहा, और जो सचमुच किसी से नहीं डरता था।',
      text: 'Dulla Bhatti was real — a Punjabi Muslim of the Bhatti clan, from the Sandal Bar country, in the days of the emperor Akbar. The ballads remember him as the Bar\'s own Robin Hood: defiant of the emperor\'s tax-men, open-handed to the poor, and afraid of exactly nobody.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'यह गीत जिस कारनामे को याद दिलाता है, वह यह है। उन मुश्किल दिनों में, ऐसे दुष्ट लोग थे जो बेटियों को चुरा लेते थे — ग़रीब परिवारों की लड़कियों को ज़बरदस्ती उठा ले जाते और उन्हें बेचने के लिए ले जाते थे। उन परिवारों के पास न तो सिपाही थे और न ही सोना। उनके पास गुहार लगाने के लिए कोई रास्ता नहीं था।',
      text: 'The deed the song keeps is this. In those rough times, there were men wicked enough to steal daughters — to take girls from poor families by force and carry them off to be sold. The families had no soldiers and no gold. They had nowhere to turn.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'वे उस बागी की शरण में पहुँचे। दुल्ला भट्टी तक ख़बर पहुँची कि दो लड़कियों, सुंदरी और मुंदरी को — गीत की वही सुंदर मुंदरिए — उनके गाँव से उठा लिया गया है।',
      text: 'They turned to the outlaw. Word reached Dulla Bhatti of two girls, Sundri and Mundri — the sundar mundriye of the song — taken from their village.',
      ask: {
        q: 'The girls\' families come to an outlaw for help against powerful men. What does Dulla do?',
        options: ['Asks what they can pay him', 'Brings the girls home — and then does something even better', 'Sends them to petition the emperor'],
        answer: 1,
        right: 'He brought them home. And then came the deed Punjab sings about: he made them his own.',
        wrong: 'He asked for nothing. He brought the girls home — and then came the deed Punjab actually sings about.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'उसने उन्हें अपनी बेटियाँ घोषित कर दिया। अपनी खुद की बेटियाँ। बचाई गई लड़की के बारे में शायद लोग पीठ पीछे बातें करते — लेकिन दुल्ला भट्टी की बेटी के बारे में कानाफूसी करने की किसी में हिम्मत नहीं थी। और जब वक़्त आया, तो उसने सबके सामने उनका पिता बनकर खुद उनकी शादियाँ रचाईं।',
      text: 'He declared them his daughters. His. A rescued girl might still be whispered about — but nobody whispers about the daughter of Dulla Bhatti. And when it was time, he arranged their weddings himself, standing as their father in front of everyone.' },
    { art: ['guard'], who: 'guard',
      hi: 'उस शादी की एक-एक बात उस गीत में आज भी याद की जाती है: उस बाग़ी के पास न तो पंडित की दक्षिणा थी और न ही कोई शानदार तोहफ़े, तो जो बन पड़ा उसने वही किया — उसने आग जलाई, दुआएँ दीं, और शादी के शगुन में बच्चियों की झोली में नाप कर शक्कर डाल दी। एक पिता की मिठास, जो एक ऐसे इंसान ने दी जिसे हुकूमत मुजरिम कहती थी।',
      text: 'The song remembers the details of that wedding: the outlaw who had no priest\'s fee and no fine gifts did what he could — he lit a fire, said the blessings, and poured a measure of shakkar, of sugar, into the girls\' laps as their wedding gift. A father\'s sweetness, given by a man the empire called a criminal.' },
    { art: ['courtier'], who: null,
      hi: 'इसीलिए लोहड़ी उसी की मानी जाती है। वह अलाव, वे गीत, वे मिठाइयाँ — तिल और गुड़, और आग की लपटों में डाला जाने वाला पॉपकॉर्न — लोहड़ी की हर आग, एक तरह से, उस शादी की वही आग है जो आज भी जल रही है।',
      text: 'That is why Lohri belongs to him. The bonfire, the songs, the sweets — the til and the gud, the sesame and the jaggery, the popcorn thrown in the flames — every Lohri fire is, in a way, that wedding fire still burning.' },
    { art: ['courtier'], who: null,
      hi: 'हुकूमत के ख़िलाफ़ दुल्ला की बगावत का अंत वैसा ही हुआ जैसा ऐसी कहानियों का अक्सर होता है, किसी भी अलाव से बहुत दूर — पुराने गीतों में यह बात कही गई है, और बड़े इसे वहाँ ढूँढ सकते हैं। बच्चों का गीत उस मोड़ तक नहीं जाता, और न ही हम जाएँगे। यह गीत तो बस उस आग, उन बेटियों और उस शक्कर के साथ ही रहता है।',
      text: 'Dulla\'s defiance of the empire ended the way such stories usually end, far from any bonfire — the ballads tell it, and grown-ups can find it there. The children\'s song does not go to that place, and neither do we. The song stays with the fire, and the daughters, and the sugar.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'पंजाब और उससे बहुत दूर-दूर तक कई परिवारों में लोहड़ी मनाई जाती है — और यह नन्हे बच्चों और नई दुल्हनों के लिए पहली लोहड़ी का त्योहार भी होता है। अगर आपका परिवार आग जलाता है, तो इस साल उसके नाम को ध्यान से सुनना। चार सौ साल बाद भी, पंजाब का हर बच्चा गीत के उस सवाल का आज भी वही जवाब देता है: तुम्हारा ध्यान कौन रखेगा? दुल्ला भट्टी रखेगा।',
      text: 'Lohri is kept in many families in Punjab and far beyond — and it is a first-Lohri festival too, for new babies and new brides. If your family lights the fire, listen for his name this year. Four hundred years on, every child in Punjab still answers the song\'s question the same way: who will look out for you? Dulla Bhatti will.' }
  ],
  moral: 'The strongest thing a strong person can do is make somebody safe — and call them family, out loud, in front of everyone.',
  source: 'Dulla Bhatti (Abdullah Bhatti) of the Sandal Bar, a Punjabi Muslim folk hero of Akbar\'s time, remembered in Punjabi ballads and in the Lohri song Sundar Mundriye, still sung at Lohri fires. His rescue of Sundri and Mundri and the sugar poured in their laps is the folk tradition as sung; his historical end is not part of the children\'s song and is deliberately not told here. The tradition is Punjabi and is credited as such, with warmth.'
},

{
  id: 'fk.sheikh-chilli-pot',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'Sheikh Chilli Builds a Palace',
  hook: 'Sheikh Chilli was carrying a pot of oil to market when he began, in his head, to spend the money. It was going extremely well until his legs joined in.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-PB'],
  words_hi: [['सपना', 'sapna', 'dream'], ['मटका', 'matka', 'clay pot'], ['अंडा', 'anda', 'egg']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'शेख़ चिल्ली — पंजाब और हरियाणा में शेख़ चिल्ली को कौन नहीं जानता — दुनिया का सबसे बड़ा सपने देखने वाला था। उसकी जेब में कभी दो सिक्के भी खनकने को नहीं होते थे, मगर अपने दिमाग़ में वह हमेशा ठाठ-बाट से रईस रहता था। उसकी योजनाओं के अंदर भी योजनाएँ चलती थीं।',
      text: 'Sheikh Chilli — everyone in Punjab and Haryana knows Sheikh Chilli — was the greatest dreamer who ever lived. He never had two coins to rub together, but inside his head he was permanently, gloriously rich. His plans had plans.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'एक दिन एक व्यापारी ने उसे सिर पर तेल का एक बड़ा मटका रखकर बाज़ार तक ले जाने की मज़दूरी दी। "रास्ते में देर मत लगाना और ख़्याली पुलाव मत पकाना," व्यापारी ने कहा, जिससे यह साबित हो गया कि वह शेख़ चिल्ली से पहले कभी नहीं मिला था।',
      text: 'One day a merchant paid him to carry a big pot of oil to the market town, balanced on his head. "Do not dawdle and do not daydream," said the merchant, proving he had never met Sheikh Chilli before.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'चिल्ली चल पड़ा, और दूसरे मील के पत्थर तक पहुँचते-पहुँचते सपने शुरू हो चुके थे। "अपनी मज़दूरी से मैं अंडे ख़रीदूँगा। अंडों से निकलेंगी मुर्गियाँ। मुर्गियों से और अंडे, और फिर और मुर्गियाँ — मेरे तो घुटनों तक मुर्गियाँ ही मुर्गियाँ होंगी। मैं उन्हें बेचकर बकरियाँ ख़रीदूँगा। बकरियों से बनेंगी भैंसें। और भैंसों से बनेंगे खेत।"',
      text: 'Chilli set off, and by the second milestone the dream had started. "With my wages I shall buy eggs. Eggs become hens. Hens become more eggs, and more hens — I shall be up to my knees in hens. I shall sell them and buy goats. Goats become buffaloes. Buffaloes become fields."' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'चौथे मील के पत्थर तक उसके पास नक्काशीदार दरवाज़ों वाली एक हवेली थी। पाँचवें तक, सपने में, सात गाँवों की सबसे समझदार और सबसे सुंदर औरत से उसकी शादी हो चुकी थी, और उनका नन्हा बेटा आँगन में डगमगाते कदमों से बाहें फैलाए उसकी तरफ़ आ रहा था — बड़ा ही प्यारा, और ज़रा सा कीचड़ में सना हुआ।',
      text: 'By the fourth milestone he had a haveli with carved doors. By the fifth he was married, in the dream, to the wisest and loveliest woman in seven villages, and their little son was toddling towards him across the courtyard, arms out, adorable, slightly muddy.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"अरे, पर अनुशासन भी तो कोई चीज़ है!" सपनों वाले चिल्ली ने अपने सपनों वाले बेटे से सख्ती से कहा। "कीचड़ भरे हाथ मेरे नए कोट से दूर रखो! जब मैंने ना कह दिया, तो ना—" और यहाँ असली शेख चिल्ली ने, असली सड़क पर, सचमुच अपना पैर ज़मीन पर पटका और ज़ोर से हाथ हिलाया, यह दिखाने के लिए कि एक अमीर आदमी कितनी सख्ती से \'ना\' कहता है।',
      text: '"Ah, but discipline!" dream-Chilli told his dream-son sternly. "Muddy hands off my new coat! When I say no—" and here the real Sheikh Chilli, on the real road, gave a real stamp of his foot and a great sweep of his arm to show just how firmly a rich man says no.',
      ask: {
        q: 'A stamp and a grand sweep of the arm — with a pot of oil balanced on his head. What happens?',
        options: ['Nothing; he catches it in time', 'Down comes the pot — hens, haveli, wedding and all', 'The dream son apologises'],
        answer: 1,
        right: 'Down it came. And with that one crash went the eggs, the hens, the goats, the buffaloes, the haveli and the muddy little boy — the whole empire, in one puddle of oil.',
        wrong: 'There was no catching it. Down came the pot — and with it the eggs, the hens, the goats, the haveli and the muddy little boy: the whole empire, in one puddle of oil.'
      } },
    { art: ['guard', 'courtier'], who: null,
      hi: 'शेख चिल्ली देर तक उस पोखर को देखता खड़ा रहा। फिर वह उसके पास बैठ गया और एक-एक करके ज़ोर-ज़ोर से विलाप करने लगा: "हाय मेरा बेटा! मेरी हवेली! मेरी भैंसें! मेरी मुर्गियाँ!" — और इस तरह गुस्से से तमतमाता हुआ व्यापारी जब पहुँचा, तो उसने देखा कि एक आदमी खाली सड़क पर बैठकर ऐसे रिश्तेदारों के लिए रो रहा था जिन्हें सिर्फ़ वही देख सकता था।',
      text: 'Sheikh Chilli stood looking at the puddle for a long moment. Then he sat down beside it and mourned, loudly, in order: "My son! My haveli! My buffaloes! My hens!" — which is how the merchant, arriving furious, found a man weeping over an empty road full of relatives only he could see.' },
    { art: ['courtier'], who: null,
      hi: 'व्यापारी ने उसकी मज़दूरी काट ली और गुस्से में वहाँ से चला गया। गाँव वाले हफ्ते भर हँसते रहे — पर वे शेख चिल्ली के अंदाज़ में हँसे, जिसमें ज़्यादातर प्यार ही होता है, क्योंकि उनमें से हर एक ने कभी न कभी राह चलते एक-दो हवेलियाँ बनाई ही थीं, और वे यह बात जानते थे।',
      text: 'The merchant docked his wages and stormed off. The village laughed for a week — but they laughed the Sheikh Chilli way, which is mostly love, because every single one of them had built a haveli or two on the road at some time, and knew it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'पंजाब यह कहानी बच्चों को सपने देखने से रोकने के लिए कभी नहीं सुनाता — जी भरकर सपने देखो, हवेली बनाओ, भैंसों के नाम रखो। बस वह एक नियम याद रखो जिसे शेख चिल्ली बार-बार भूल जाता है: जब सपना मीनार की ऊँचाइयों पर हो, तो मटकी को थामे रखने वाला भी कोई होना चाहिए।',
      text: 'Punjab never tells this story to stop children dreaming — dream away, build the haveli, name the buffaloes. Just remember the one rule Sheikh Chilli keeps forgetting: while the dream is up in the tower, somebody has to hold the pot.' }
  ],
  moral: 'Dream as tall as you like — but keep your hands on what you are actually carrying.',
  source: 'Sheikh Chilli, the beloved daydreamer of Punjabi and North Indian folk humour, whose tales are told across Punjab and Haryana (his tomb-monument stands at Thanesar). The spilled-pot daydream is among the oldest and most-told of his cycle, cousin to daydreamer tales the world over. Oral tradition, many versions.'
},

{
  id: 'fk.sheikh-chilli-branch',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'Sheikh Chilli and the Branch',
  hook: 'Sheikh Chilli climbed a tree, sat down on a branch, and began to saw it off. There was one detail he had not fully considered.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-PB'],
  words_hi: [['पेड़', 'ped', 'tree'], ['डाल', 'daal', 'branch'], ['हँसी', 'hansi', 'laughter']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'शेख चिल्ली को जलाने के लिए लकड़ी चाहिए थी, और वह भी कम से कम मेहनत में—क्योंकि मेहनत तो ऐसी चीज़ थी जिसे वह किसी बड़ी मुसीबत के लिए बचाकर रखता था। उसने सड़क किनारे एक बढ़िया छायादार पेड़ चुना, एक अच्छी-मोटी डाल देखी, और दाँतों में आरी दबाकर पेड़ पर चढ़ गया।',
      text: 'Sheikh Chilli needed firewood, and he needed it with the least possible effort, effort being a thing he saved carefully for emergencies. He picked a fine shady tree by the road, spotted a good thick branch, and climbed up with his saw between his teeth.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अब, आरी चलाते समय बैठा कहाँ जाए? चिल्ली ने हमेशा की तरह बड़ी गहराई से सोचा, और बैठने के लिए सबसे आरामदायक जगह चुन ली—जो कि, ज़ाहिर है, वह डाल ही थी। उस डाल का बाहरी सिरा। ठीक उस जगह के पार, जहाँ से वह उसे काट रहा था।',
      text: 'Now, where to sit while sawing? Chilli considered the matter with his usual care, and chose the most comfortable seat available — which was, naturally, the branch itself. The outer end of it. On the far side of where he was cutting.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'तभी सड़क से एक मुसाफ़िर निकला। वह रुका, ऊपर देखा और आँखें झपकाईं। "भाई," उसने आवाज़ दी, "तुम तो आरी के गलत तरफ़ बैठे हो! जब वह डाल कटेगी, तो तुम भी उसके साथ ही नीचे गिरोगे।"',
      text: 'Along the road came a traveller, who stopped, looked up, and blinked. "Bhai," he called, "you are sitting on the wrong side of your own sawing. When that branch comes off, you are coming with it."' },
    { art: ['courtier'], who: 'courtier',
      hi: 'शेख चिल्ली ने बड़ी दया भरी नज़रों से नीचे देखा। "तुम्हारे पैदा होने से पहले से मैं लकड़ी काट रहा हूँ," उसने कहा—जो कि सरासर झूठ था—"और आज तक किसी डाल की इतनी हिम्मत नहीं हुई कि कोई बदमाशी करे। मेहरबानी करके आप आगे बढ़िए और बढ़ई का काम बढ़ई पर ही छोड़ दीजिए।" मुसाफ़िर ने कंधे उचकाए और चल दिया।',
      text: 'Sheikh Chilli looked down with enormous pity. "I have been cutting wood since before you were born," he said, which was not true, "and no branch of mine has ever misbehaved. Kindly walk on and leave carpentry to carpenters." The traveller shrugged and walked on.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'चिल्ली आरी चलाता रहा। डाल से चरमराहट हुई। चिल्ली गुनगुनाते हुए आरी चलाता ही गया। डाल कड़-कड़ करके टूटी—और डाल, आरी और शेख चिल्ली, तीनों एक साथ नीचे आ गिरे! और मूर्खों पर रहने वाली खास मेहरबानी से, वह नरम घास पर धड़ाम से गिरा, पगड़ी उसकी आँखों पर आ गिरी और उसकी सारी शानो-शौकत पेड़ पर ही कहीं अटकी रह गई।',
      text: 'Chilli sawed. The branch creaked. Chilli sawed on, humming. The branch cracked — and down came branch, saw and Sheikh Chilli together, landing — by the mercy that watches over all fools — flump in the soft grass, with his turban over his eyes and his dignity somewhere up in the tree.',
      ask: {
        q: 'Flat in the grass, unhurt, with the traveller\'s words ringing in his ears. What does Sheikh Chilli conclude?',
        options: ['"I sat on the wrong side of the cut"', '"That stranger can see the future!"', '"The tree pushed me"'],
        answer: 1,
        right: 'That is what you or I would conclude. Sheikh Chilli sat up and gasped: "He said I would fall — and I fell! That man is a seer!" And he ran off down the road after him.',
        wrong: 'Nothing so ordinary. Chilli sat up and gasped: "He said I would fall — and I fell! That man is a seer!" And off he ran down the road after him.'
      } },
    { art: ['guard', 'courtier'], who: null,
      hi: 'उसने उस बेचारे मुसाफ़िर की आस्तीन पकड़ ली। "हे त्रिकालदर्शी! तुमने मेरे गिरने की बात पहले ही जान ली थी! अब मुझे बाकी बातें भी बताइए—मेरा भविष्य बताइए!" मुसाफ़िर ने उसे देखा, फिर धीरे से अपनी आस्तीन छुड़ाई। "दोस्त, मुझे बस इतना ही दिखता है: जो जिस डाल पर बैठा है अगर उसी को काटेगा, तो ज़मीन पर ही आ गिरेगा। बस इतना ही है मेरा सारा जादू। इसे \'आँखें खोलकर देखना\' कहते हैं।"',
      text: 'He caught the poor traveller by the sleeve. "Great knower of things! You foresaw my fall! Now tell me the rest — tell me my future!" The traveller stared, then freed his sleeve gently. "Friend, I foresee this much: whoever saws the branch he is sitting on will meet the ground. That is the whole of my magic. It is called looking."' },
    { art: ['courtier'], who: null,
      hi: 'शेख चिल्ली बहुत प्रभावित होकर घर की ओर चल पड़े, और उन्होंने देखने की इस ज़बरदस्त कला को अपनाने की ठान ली — कल से शुरुआत करेंगे, या शायद परसों से। उनके पीछे, पूरा गाँव पहले से ही यह किस्सा एक-दूसरे को सुना रहा था और उसमें और भी मज़ेदार बातें जोड़ रहा था, और इसी तरह चार सौ सालों से उनके किस्से बढ़ते चले आ रहे हैं।',
      text: 'Sheikh Chilli walked home deeply impressed, resolving to take up this powerful art of looking — starting tomorrow, or perhaps the day after. Behind him, the village was already retelling the story, and adding better details, which is how his stories have been growing for four hundred years.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"और पंजाब उससे नफ़रत करने के बजाय उससे इतना प्यार क्यों करता है, इसका राज़ यह है: कभी न कभी हर किसी ने उसी डाल को काटा है जिस पर वह बैठा था। शेख़ चिल्ली तो बस हम सब की तरफ़ से यह काम सबके सामने खुलकर कर देता है, ताकि हम एक सुरक्षित दूरी से ख़ुद पर हँस सकें।"',
      text: 'And here is the secret of why Punjab loves him instead of scorning him: everybody, at some time, has sat on the branch they were sawing. Sheikh Chilli just does it for all of us, out loud, so we can laugh at ourselves from a safe distance.' }
  ],
  moral: 'Before you start cutting, check what you are sitting on. Most of wisdom is just looking.',
  source: 'The branch-sawing tale from the Sheikh Chilli cycle of Punjabi and North Indian folk humour — one of the most widespread fool\'s-wisdom tales in the world, told of Chilli across Punjab and Haryana. Oral tradition, many versions; the fall is a soft one in every telling for children, including this one.'
},

{
  id: 'fk.chiri-kaan',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'The Sparrow, the Crow and the Khichdi',
  hook: 'A sparrow and a crow found one grain of rice and one grain of dal, and decided to cook khichdi together. "Together" turned out to need some discussion.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_heron'],
  minutes: 3,
  place: ['IN-PB'],
  words_hi: [['चिड़िया', 'chidiya', 'sparrow'], ['कौआ', 'kaua', 'crow'], ['खिचड़ी', 'khichdi', 'khichdi — rice and dal cooked together']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: '"इक सी चिड़ी, इक सी कां — एक थी चिड़िया, एक था कौआ।" पंजाब की दादियाँ-नानियाँ इसी तरह शुरू करती हैं, और हर पंजाबी बच्चा फ़ौरन टिक कर बैठ जाता है, क्योंकि उन्हें ठीक-ठीक पता होता है कि आगे क्या आने वाला है।',
      text: 'Ik si chiri, ik si kaan — there was once a sparrow, there was once a crow. That is how the grandmothers of Punjab begin it, and every Punjabi child settles down at once, because they know exactly what is coming.' },
    { art: ['pt_heron', 'pt_crow'], who: null,
      hi: 'चिड़ी को चावल का एक दाना मिला। कान को दाल का एक दाना मिला। "साथी!" कौवे ने बड़े ठाठ से कहा। "हम दोनों के पास खिचड़ी बनाने का सामान है। चलो इसे पकाते हैं और मिलकर दावत उड़ाते हैं, आधा-आधा बाँटकर।" चिड़िया, जो छोटी तो थी पर बुद्धू बिल्कुल नहीं थी, बोली, "मिलकर का मतलब है दोनों काम करेंगे।" "बिल्कुल," कौवे ने कहा।',
      text: 'The chiri found a grain of rice. The kaan found a grain of dal. "Partner!" said the crow grandly. "Between us we have the makings of khichdi. Let us cook it and feast together, share and share alike." The sparrow, who was small but nobody\'s fool, said, "Together means both work."  "Obviously," said the crow.' },
    { art: ['pt_heron', 'pt_crow'], who: 'pt_crow',
      hi: '"पानी कौन लाएगा?" गौरैया ने पूछा। "मैं ले आता," कौए ने कहा, "लेकिन आज मेरी चोंच में दर्द है। तुम ही ले आओ, साथी — मैं दानों की रखवाली करता हूँ।" तो गौरैया नन्हे-नन्हे जग भर-भरकर कुएँ तक उड़ती और लौटती रही, जबकि कौआ दानों की रखवाली करता रहा — ज़्यादातर एक आरामदायक डाल पर आँखें मूँदे हुए।',
      text: '"Who will fetch the water?" asked the sparrow. "I would," said the crow, "but my beak is aching today. You fetch it, partner — I shall guard the grains." So the sparrow flew to the well and back, jug by tiny jug, while the crow guarded the grains, mostly from a comfortable branch, with his eyes shut.' },
    { art: ['pt_crow', 'pt_heron'], who: null,
      hi: '“लकड़ियां कौन इकट्ठी करेगा?” “मैं तो कर देता,” कौवा बोला, “लेकिन मेरा पंख अकड़ा हुआ है — कल तक बिल्कुल ठीक हो जाएगा। तुम ही इकट्ठी कर लो, साथी।” चिड़िया ने लकड़ियां इकट्ठी कर लीं। “हांड़ी कौन चलाएगा?” “मैं चला देता, लेकिन धुएं से मेरी आंखों में तकलीफ़ होती है। तुम चलाती रहो, साथी। तुम बहुत बढ़िया कर रही हो।”',
      text: '"Who will gather the sticks?" "I would," said the crow, "but my wing is stiff — tomorrow it will be perfect. You gather, partner." The sparrow gathered. "Who will stir the pot?" "I would, but the smoke troubles my eyes. Stir on, partner. You are doing splendidly."' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'और फिर सुनहरी और भाप छोड़ती खिचड़ी पककर तैयार हो गई, और तभी एक गज़ब का डॉक्टरी चमत्कार हुआ: कौवे की चोंच, पंख और आँखें—सब एक ही पल में बिल्कुल ठीक हो गए। "साझीदार!" अपनी थाली लेकर नीचे फुदकते हुए वह चिल्लाया, "हमने कर दिखाया! निकालो हमारी खिचड़ी!"',
      text: 'And then the khichdi was done, golden and steaming, and a remarkable medical miracle occurred: the crow\'s beak, wing and eyes all recovered in the same instant. "Partner!" he cried, hopping down with his plate. "We have done it! Serve out our khichdi!"' },
    { art: ['pt_heron'], who: null, mood: 'think',
      hi: 'गौरैया ने कौवे की तरफ़ देखा। उसने उस हाँडी को देखा जिसे उसने भरा था, उस आग को देखा जिसे उसने सुलगाया था, और जिसे उसने अपने नन्हे हाथों के पूरे ज़ोर से चलाया था। हमारी खिचड़ी।',
      text: 'The sparrow looked at the crow. She looked at the pot she had filled, over the fire she had built, stirred with the strength of her small arms. Our khichdi.',
      ask: {
        q: 'What should the sparrow do with the crow who owns one grain of dal and a lot of excuses?',
        options: ['Give him half — a deal is a deal', 'Give him none — he did nothing', 'Give him a taste, and the washing-up'],
        answer: 2,
        right: 'That is the grandmothers\' favourite ending: a spoonful for his grain of dal — fair is fair — and every pot, pan and plate to wash for the rest. He scrubbed till moonrise.',
        wrong: 'The grandmothers have a better ending than that: a spoonful for his grain of dal — fair is fair — and every pot and plate to wash for the rest. He scrubbed till moonrise.'
      } },
    { art: ['pt_crow', 'pt_heron'], who: null,
      hi: 'और यहाँ याद रखने वाली बात यह है: अगली बार जब उन दोनों को दाने मिले, तो गौरैया के कहने से पहले ही कौवा पानी ले आया। दर्द करती चोंच के बावजूद। कुछ लोग तो कहते हैं कि उसने खिचड़ी चलाई भी। और सब मानते हैं कि वह खिचड़ी खाने में दोगुनी स्वादिष्ट लगी।',
      text: 'And here is the part worth keeping: the next time the two of them found grains, the crow fetched the water before the sparrow had finished asking. Aching beak and all. Some say he even stirred. The khichdi, everyone agrees, tasted twice as good.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'कुछ पुरानी कहानियों में कौवे को बर्तन धोने से भी कड़ा सबक मिलता है—पंजाबी दादियाँ अपनी गोद में बैठे बच्चे के हिसाब से कहानी का अंत बदल लेती हैं, और इस कहानी में भी यही हुआ है। लेकिन बीच की कहानी कभी नहीं बदलती: साझीदार, मेरी चोंच में दर्द है; साझीदार, मेरा पंख अकड़ गया है। ऐसे बहानों पर ज़रा कान देना। तुम ज़िंदगी भर इन्हें सुनोगे, और कभी-कभी तो अपनी ही आवाज़ में।',
      text: 'In some older tellings the crow gets a harder lesson than washing-up — Punjabi grandmothers adjust the ending to the child on their lap, and so has this one. But the middle never changes: partner, my beak aches; partner, my wing is stiff. Listen for those excuses. You will hear them all your life, and sometimes in your own voice.' }
  ],
  moral: 'Share the eating with those who shared the working. And when your own beak conveniently aches — notice.',
  source: 'The chiri and kaan (sparrow and crow) khichdi tale, a Punjabi nursery favourite from the ik si chiri, ik si kaan cycle — cousin to work-and-feast tales across India. Oral tradition, many versions with endings adjusted to the listener; this telling says so. Its Gujarati cousin, the wax-and-wood house tale, is told separately in this app.'
},

{
  id: 'fk.raja-rasalu',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'panj-ab',
  badge: 'katha',
  title: 'The Prince Who Rode Out of the Story',
  hook: 'Raja Rasalu grew up inside palace walls, forbidden to be seen. The day he finally rode out, Punjab got the hero its bards would sing for a thousand years.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_crow'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['तोता', 'tota', 'parrot'], ['घोड़ा', 'ghoda', 'horse'], ['राजा', 'raja', 'king']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'बहुत पुरानी बात है, पुराने पंजाब के सियालकोट में राजा सालवाहन के घर एक बेटा हुआ—और ज्योतिषियों ने सितारे देखकर एक अजीब हिदायत दी: बारह साल तक यह बालक बाहर किसी को दिखाई नहीं देना चाहिए। सो रसालू चारदीवारी के पीछे पला-बढ़ा, एक ऐसे महल में जहाँ दुनिया को छोड़कर बाकी सब कुछ था।',
      text: 'Long ago in Sialkot, in old Punjab, a son was born to King Salvahan — and the wise men read the stars and gave a strange instruction: for twelve years, the boy must not be seen abroad. So Rasalu grew up behind walls, in a palace with everything in it except the world.' },
    { art: ['guard', 'pt_crow'], who: null,
      hi: 'वह अकेला बड़ा नहीं हुआ। उसके दो ऐसे दोस्त थे जिन्हें लोकगीत कभी नहीं छोड़ते: एक अकलमंद तोता जो ज़्यादातर मंत्रियों से भी समझदारी की बात करता था, और भौंर इराक़ी नाम का एक बछेड़ा—कुछ गाने वाले कसम खाकर कहते हैं कि वह ठीक उसी रात पैदा हुआ था जिस रात रसालू का जन्म हुआ था, और वह उत्तर की किसी भी कहानी का सबसे तेज़ घोड़ा था।',
      text: 'He did not grow up alone. He had two friends the ballads never leave out: a wise parrot who talked better sense than most ministers, and a colt called Bhaunr Iraqi — foaled, some singers swear, on the very night Rasalu was born, and the fastest horse in any story of the north.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'दीवारों के पीछे से रसालू को बाहर की दुनिया सुनाई देती थी — घंटियों की आवाज़, पहियों की घड़घड़ाहट, शादियाँ, और दूसरों के खेतों पर बरसती बारिश। ग्यारह साल तक सिर्फ़ सुनते रहना बहुत लंबा वक़्त होता है। एक दिन, जब बारहवाँ साल शुरू ही हुआ था, वह दरवाज़े पर खड़ा था और सिटकनी पर उसका हाथ था।',
      text: 'From the walls, Rasalu could hear the world — bells, wheels, weddings, rain on other people\'s fields. Eleven years of listening is a long time. One day, with the twelfth year barely begun, he stood at the gate with his hand on the bolt.',
      ask: {
        q: 'The stars said twelve years. The gate is unlocked. The horse is saddled. What does Rasalu do?',
        options: ['Waits out the last year, as instructed', 'Rides out — a hero\'s story cannot start behind a wall', 'Sends the parrot to look around and report back'],
        answer: 1,
        right: 'He rode out — parrot on his shoulder, Bhaunr Iraqi under him — and that is the moment the bards begin the song. Punjab has always liked its heroes a little early.',
        wrong: 'The parrot did suggest patience. But heroes\' stories cannot start behind a wall: he rode out, parrot on shoulder, and that is the moment the bards begin the song.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'वह पंजाब की दुनिया में निकल पड़ा — नदियाँ, जंगल, चारदीवारी वाले शहर, अजनबियों से भरी सड़कें — और उसने देखा कि यह दुनिया ग्यारह साल तक सुनी बातों से कहीं बड़ी, अनोखी और बेहतर थी। और तुरंत ही लोकगीत हमें दिखाते हैं कि वह किस तरह का नायक बनने वाला था।',
      text: 'Out he went into Punjab — rivers, forests, walled towns, roads full of strangers — and found it bigger and stranger and better than eleven years of listening had promised. And straightaway the ballads show us what kind of hero he would be.' },
    { art: ['pt_crow', 'guard'], who: 'pt_crow',
      hi: 'गाने वाले कहते हैं कि रास्ते में रसालू हमेशा छोटी-छोटी बातों के लिए रुक जाया करता था। किसी फँसे हुए परिंदे को आज़ाद कर दिया। किसी मुसीबत में पड़े जीव की मदद कर दी, जबकि तोता देरी होने पर बड़बड़ाता रहता। लगभग हर लोकगीत में कोई न कोई पूछता है, "इतनी झंझट की क्या ज़रूरत है?" और रसालू जवाब देता है: आगे के रास्ते में की गई कोई भी भलाई कभी बेकार नहीं जाती।',
      text: 'For on the road, the singers say, Rasalu was forever stopping for small things. A trapped bird set loose. A creature in trouble helped out of it, while the parrot muttered about delays. "Why bother?" asks someone in nearly every ballad. And Rasalu answers: no kindness is wasted on the road ahead.' },
    { art: ['guard'], who: null,
      hi: 'और लोकगीत भी उसके इस नियम को पूरी तरह निभाते हैं: वे छोटे-छोटे जीव जिनकी उसने मदद की थी, ठीक सही वक़्त पर बार-बार लौटकर आते हैं — वक़्त पर दी गई चेतावनी, नाकाम की गई चाल, बचाई गई बाज़ी — हर नेकी कहानी में ठीक उसी पल लौट आती है जब नायक को उसकी सबसे ज़्यादा ज़रूरत होती है।',
      text: 'And the ballads keep his rule scrupulously: the small ones he helped come back, again and again, at exactly the right moment — a warning cried in time, a trick spoiled, a game saved — each good turn walking back into the story just when the hero needs it most.' },
    { art: ['courtier'], who: null,
      hi: 'उसके कारनामों से अनगिनत सर्दियों की रातें भर जाती हैं — चालाक राजाओं के साथ मुक़ाबले, पहेलियाँ, बाल-बाल बचना, और भौंर इराक़ी का चार पैरों वाले हर जानवर से आगे निकल जाना — और सदियों तक भाट गाँव-गाँव इन्हें गाते रहे, और हर किसी ने इसमें एक नई चमक जोड़ी।',
      text: 'His adventures fill winter nights beyond counting — contests with tricky kings, riddles, narrow escapes, Bhaunr Iraqi outrunning everything on four legs — and they were sung from village to village by bards for centuries, each one adding a polish.' },
    { art: ['guard'], who: 'mithu',
      hi: 'सौ से भी ज़्यादा साल पहले एक संग्रहकर्ता ने इनमें से कई कहानियाँ सीधे गवैयों के मुँह से सुनकर लिख लीं, इसीलिए वे आज भी हमारे पास हैं। लेकिन इन्हें असली रूप में पुराने तरीक़े से ही सँभालकर रखा गया: पंजाब को अपना वह राजकुमार बहुत भा गया जो सवेरे ही घोड़े पर निकला था और रास्ते भर दयालु रहा — और पंजाब ने उसकी दास्तान सुनाना कभी बंद ही नहीं किया।',
      text: 'A collector wrote many of them down more than a hundred years ago, from the mouths of the singers themselves, so we still have them. But the real keeping was done the old way: Punjab liked its prince who rode out early and was kind on the road — and simply never stopped telling him.' }
  ],
  moral: 'Set out when your story calls you — and be kind on the road. Every kindness travels ahead and waits for you.',
  source: 'The Raja Rasalu cycle of Punjabi legend — the sheltered prince of Sialkot, his parrot and his horse Bhaunr Iraqi — sung by bards for centuries and recorded from oral tellings in colonial-era collections including Flora Annie Steel\'s Tales of the Punjab (1894). The cycle\'s darker episodes belong to grown-up tellings and are not entered here; this telling keeps to its gentle opening movement and its helped-creatures motif, and says so.'
},

/* ======================================================== UTTARAKHAND ====== */

{
  id: 'fk.ganga-yamuna-sisters',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'katha',
  title: 'The Two Sisters Who Took Different Roads',
  hook: 'Two rivers are born a mountain apart in Uttarakhand, take completely different roads through the world — and keep an appointment made at the beginning of time.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['बहन', 'behen', 'sister'], ['नदी', 'nadi', 'river'], ['संगम', 'sangam', 'the meeting of rivers']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: 'उत्तराखंड के ऊँचे पहाड़ों में, जितना तुम सोच सकते हो उससे भी पास, दो नदियाँ जन्म लेती हैं। गंगोत्री के ऊपर की बर्फ़ से गंगा निकलती है। यमुनोत्री के ऊपर, बंदरपूँछ की ढलानों से यमुना निकलती है। पहाड़ों का एक ही पड़ोस; दो शुरुआतें।',
      text: 'High in the mountains of Uttarakhand, closer together than you might think, two rivers are born. From the ice above Gangotri comes the Ganga. From the flanks of Bandarpunch, above Yamunotri, comes the Yamuna. One mountain neighbourhood; two beginnings.' },
    { art: ['courtier'], who: null,
      hi: 'इन पहाड़ों की परंपराओं में वे सिर्फ नदियाँ नहीं हैं। वे देवियाँ हैं, और—जैसा कि पुरानी कहानियों में सुनाया जाता है—वे दो बहनों जैसी हैं: एक ही ऊँचे देश में एक-दूसरे के पास जन्मीं, एक जैसी ही बर्फ के बीच पली-बढ़ीं, और एक-दूसरे से उतनी ही अलग जितनी दो बहनें हमेशा होती हैं।',
      text: 'To the traditions of these hills they are not just rivers. They are goddesses, and — in the way the old stories are often told — they are like two sisters: born near each other in the same high country, raised among the same snows, and as different as two sisters always are.' },
    { art: ['pt_heron'], who: null,
      hi: 'गंगा गरजती-शोर मचाती हुई नीचे उतरती हैं। वे बड़ी हैं, मशहूर हैं—ऋषिकेश से उछलती-कूदती, हरिद्वार में पहाड़ों से बाहर कदम रखती हुई, दूसरी नदियों को सहेलियों की तरह साथ समेटती हुई, जहाँ मैदानों के बड़े-बड़े शहर अपने किनारों को सजाकर उनके आने पर घंटियाँ बजाने का इंतज़ार करते हैं।',
      text: 'Ganga comes down loud. She is the elder, the famous one — leaping through Rishikesh, striding out of the hills at Haridwar, gathering tributaries like companions, with the great cities of the plains waiting to line her banks and ring bells at her arrival.' },
    { art: ['pt_heron', 'guard'], who: null,
      hi: 'यमुना कुछ साँवली और शांत होकर नीचे उतरती हैं, अपनी ही धुन में। जहाँ गंगा का पानी चमकीला बहता है, वहीं यमुना का पानी गहरा नीला-हरा होकर बहता है। उनका रास्ता दूर तक घूमकर निकलता है, जंगलों और पुरानी रियासतों के पास से—और आगे चलकर, सीधे दिल्ली के तख़्त और खुद ताज महल के पास से।',
      text: 'Yamuna comes down darker and quieter, keeping her own counsel. Her waters run a deep blue-green where Ganga\'s run bright. Her road swings wide and away, past forests and old kingdoms — and, in her middle years, right past the throne of Delhi and the Taj Mahal itself.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'think',
      hi: 'सैकड़ों-सैकड़ों किलोमीटर तक दोनों के रास्ते अलग-अलग रहते हैं—इतनी दूर कि एक नदी के किनारे बैठा बच्चा शायद कभी दूसरी के बारे में सोचे भी न। लेकिन पहाड़ों की कहानियाँ इस बात पर मुस्कुरा देती हैं, ठीक वैसे ही जैसे दूरियों के झगड़ों पर दादियाँ मुस्कुरा देती हैं।',
      text: 'For hundreds and hundreds of kilometres the two roads stay apart — so far apart that a child by one river might never think of the other. But the hill tellings smile at that, the way grandmothers smile at quarrels about distance.',
      ask: {
        q: 'Two sisters, two roads, half a country apart. How does the story end?',
        options: ['They never meet again', 'They meet — as agreed — at Prayag, and go on together', 'They race to see who reaches the sea first'],
        answer: 1,
        right: 'At Prayag — Prayagraj — the two roads join, and the sisters walk on to the sea as one. The meeting has a name every Indian knows: the Sangam.',
        wrong: 'No race, and no forgetting. At Prayag — Prayagraj — the two roads join, and the sisters go on to the sea together. The meeting is the Sangam.'
      } },
    { art: ['pt_heron'], who: null, mood: 'wow',
      hi: 'और अचरज की बात यह है: आप इसे खुद देख सकते हैं। संगम पर नावें आपको ठीक उसी जगह ले जाती हैं जहाँ दोनों नदियाँ मिलती हैं—और वे सचमुच दो अलग रंगों की दिखती हैं, एक हल्की और दूसरी गहरी, एक ही बहाव में साथ-साथ बहती हुई, जैसे दो बहनें बाहों में बाहें डाले चल रही हों और फिर भी अपनी-अपनी पहचान बनाए हुए हों।',
      text: 'And here is the wonder: you can see it. At the Sangam, boats take you to the exact place where the two waters meet — and they truly are two colours, the pale and the deep running side by side in one bed, like two sisters walking arm in arm, still recognisably themselves.' },
    { art: ['courtier'], who: null,
      hi: 'यह भारत के सबसे पवित्र मिलन-स्थलों में से एक है, जहाँ त्योहारों के बरसों में भारी मेले जुड़ते हैं। परंपरा इस मिलन में एक तीसरी बहन को भी जोड़ती है—सरस्वती, जो अनदेखी हैं, कहानियों में मौजूद भले ही कोई आँख उन्हें ढूँढ न पाए। पहाड़ों की मान्यता है: परिवार के कुछ सदस्य बिना दिखे भी साथ आते हैं। उनकी भी गिनती होती है।',
      text: 'It is one of the most sacred meeting-places in India, where vast gatherings assemble in festival years. Tradition adds a third sister to the meeting — the Saraswati, the unseen one, present in story though no eye finds her. The hills say: some family members attend invisibly. They still count.' },
    { art: ['guard'], who: null,
      hi: '"वहाँ ऊपर उत्तराखंड में, तीर्थयात्री आज भी दोनों उद्गमों की चढ़ाई चढ़ते हैं — गंगोत्री और यमुनोत्री, जो पहाड़ों के चार पवित्र धामों में से दो हैं — ताकि हर बहन से उसके अपने ऊँचे घर में मिल सकें, जहाँ वे बस एक चमकती, ठंडी धारा भर हैं जिसे कोई बच्चा भी एक कदम में लाँघ ले।"',
      text: 'Back up in Uttarakhand, pilgrims still climb to both beginnings — Gangotri and Yamunotri, two of the four holy places of the hills — to greet each sister in her own high home, where each is only a bright cold stream a child could step across.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: '"अगर तुम्हारी कोई बहन या भाई है, या उनके जैसा कोई कज़िन, तो तुम यह कहानी पहले से ही समझते हो: अलग रास्ते, अलग मिज़ाज, पर एक ही परिवार। दूरी तो बस सफ़र का बीच का हिस्सा है। आगे चलकर एक संगम भी है।"',
      text: 'If you have a sister or a brother, or a cousin like one, you already understand this story: different roads, different tempers, one family. Distance is just the middle of the journey. There is a sangam further on.' }
  ],
  moral: 'Sisters may take roads a whole world apart. The meeting at the end is part of the family, too.',
  source: 'The Ganga and Yamuna, born at Gangotri and Yamunotri in Uttarakhand — both goddesses in Hindu tradition, their sisterly pairing a common way the rivers are spoken of in the hills and at the Sangam of Prayagraj, where the two visibly distinct waters meet, joined in tradition by the unseen Saraswati. Sacred river tradition told as katha; the geography can be checked on any map, and the two colours from any boat.'
},

{
  id: 'it.corbett',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'itihaas',
  title: 'The Hunter Who Put Down His Rifle',
  hook: 'The most famous hunter in India spent the second half of his life fighting for the very animal he was famous for hunting. This is how a heart turns around.',
  hero: 'courtier',
  cast: ['courtier', 'pt_lion', 'guard'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['जंगल', 'jangal', 'forest'], ['बाघ', 'baagh', 'tiger'], ['कैमरा', 'camera', 'camera']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"जिम कॉर्बेट का जन्म करीब डेढ़ सौ साल पहले नैनीताल में हुआ था, जो आज के उत्तराखंड की कुमाऊँ पहाड़ियों में है। वे खुद भी लगभग आधे-जंगली जैसे ही बड़े हुए — एक ऐसे लड़के की तरह जिसने अपना हर मुमकिन पल जंगल में बिताया, जब तक कि वह उसे किसी किताब की तरह पढ़ना और उसकी ख़तरे की पुकारों व सन्नाटों की भाषा बोलना न सीख गया।"',
      text: 'Jim Corbett was born about a hundred and fifty years ago in Nainital, in the Kumaon hills of what is now Uttarakhand, and grew up half-wild himself — a boy who spent every possible hour in the forest, until he could read it like a book and speak its language of alarm calls and silences.' },
    { art: ['pt_lion', 'courtier'], who: null,
      hi: '"इसी हुनर ने उन्हें वक़्त के साथ वह इंसान बना दिया, जिन्हें पहाड़ी गाँव वाले अपनी सबसे बड़ी मुसीबत में बुलावा भेजते थे। बहुत ही कम ऐसा होता था कि कोई बाघ या तेंदुआ — जो आमतौर पर बूढ़ा, ज़ख्मी, या अपने जंगली शिकार से महरूम हो — इंसानों का शिकार करने लगे, और पूरी की पूरी घाटियाँ ख़ौफ़ के साए में जीने लगें। तब कॉर्बेट अकेले और पैदल आते, और इस ख़तरे को ख़त्म कर देते।"',
      text: 'That skill made him, in time, the man the hill villages sent for in their worst trouble. Very rarely, a tiger or leopard — usually old, hurt, or robbed of its wild prey — turned to hunting people, and whole valleys lived in terror. Corbett would come, alone and on foot, and end the danger.' },
    { art: ['courtier'], who: null,
      hi: '"उन्होंने सालों तक अपनी जान जोखिम में डालकर यह किया, गाँव वालों से कभी कोई पैसा नहीं लिया, और पहाड़ के लोग उन पर आँख मूँदकर भरोसा करने लगे। लेकिन उन लंबी, ख़ामोश पगडंडियों पर कुछ और भी हो रहा था: पूरे भारत में कोई भी जंगली बाघों को इतने करीब से नहीं देख रहा था, जितना वह इंसान जिसे उनमें से चंद का शिकार करने भेजा गया था।"',
      text: 'He did this for years, at great risk, refusing payment from the villagers, and the hill people came to trust him completely. But something else was happening on all those long quiet walks: nobody in India was watching wild tigers more closely than the man sent to hunt a few of them.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"और साल-दर-साल जो कुछ उन्होंने देखा, उसने उन्हें और भी ज़्यादा बेचैन कर दिया। जंगल सिमटते जा रहे थे। बंदूकें हर तरफ़ थीं, और बाघ का शिकार करना एक फ़ैशनेबल खेल बन चुका था। वह जानवर जिसे वे — खुद उनके लिखे शब्दों में — \'एक बड़े दिल वाला शरीफ़ इंसान\' मानते थे, इससे पहले कि भारत कुछ समझ पाता, भारत से गायब होता जा रहा था।"',
      text: 'And what he saw, year after year, troubled him more and more. The forests were shrinking. Guns were everywhere, and shooting a tiger had become a fashionable sport. The animal he considered — his own written words — a large-hearted gentleman was disappearing from India before India had noticed.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'तो देश के सबसे मशहूर शिकारी के सामने एक अजीब सवाल आ खड़ा हुआ: जिस दुनिया में बाघ ख़त्म होते जा रहे हों, वहाँ कोई अपने हुनर का क्या करे?',
      text: 'So the most famous hunter in the country faced a strange question: what should a man do with skills like his, in a world running out of tigers?',
      ask: {
        q: 'What did Corbett take into the jungle for the rest of his life?',
        options: ['A bigger rifle', 'A camera', 'Nothing — he never went back'],
        answer: 1,
        right: 'A camera. The same patience, the same silent stalking, the same closeness — but now the tiger walked away afterwards. He called it the better sport, and meant it.',
        wrong: 'He never stopped going back — but what he carried changed. A camera: the same patience and silent stalking, but now the tiger walked away afterwards. He called it the better sport.'
      } },
    { art: ['pt_lion'], who: null, mood: 'wow',
      hi: 'उन्होंने उस ज़माने में जंगली बाघों की फ़िल्में बनाईं और तस्वीरें खींचीं, जब दुनिया में शायद ही किसी ने ऐसा किया था। उन्होंने स्कूली बच्चों को जाकर बताया कि जंगल क्यों इतने ज़रूरी हैं। उन्होंने किताबें लिखीं — \'मैन-ईटर्स ऑफ़ कुमाऊँ\' ने तो उन्हें पूरी दुनिया में मशहूर कर दिया — और अपने कारनामों के बीच-बीच में, उन्होंने जंगल के लिए प्यार और उसके भविष्य की चिंता उन पन्नों में भर दी।',
      text: 'He filmed and photographed wild tigers when almost no one on Earth had done it. He gave talks to schoolchildren about why the forest mattered. He wrote books — Man-Eaters of Kumaon made him famous across the world — and filled them, between adventures, with love for the jungle and alarm for its future.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'और उन्होंने बाकी लोगों के साथ मिलकर उस चीज़ के लिए ज़ोर लगाया जो उस वक़्त भारत में न के बराबर थी: सुरक्षित ज़मीन, जहाँ जंगल और उसके जानवरों को बिना छेड़े छोड़ दिया जाए। उनकी प्यारी कुमाऊँ की तलहटी का एक विशाल रिज़र्व भारत के पहले राष्ट्रीय उद्यानों में से एक बना — और उनके गुज़रने के बाद उनके सम्मान में उसका नाम बदलकर \'कॉर्बेट नेशनल पार्क\' रख दिया गया।',
      text: 'And he pushed, with others, for something India barely had then: protected land, where the forest and its animals would simply be left alone. A great reserve in his beloved Kumaon foothills became one of India\'s first national parks — and after his death it was renamed in his honour: Corbett National Park.' },
    { art: ['courtier'], who: null,
      hi: 'दशकों बाद, जब भारत ने बाघों को विलुप्त होने से बचाने के लिए अपनी सबसे बड़ी मुहिम शुरू की, तो उसकी शुरुआत इसी पार्क से हुई। आख़िरकार, उस शिकारी का बदला हुआ दिल पूरे देश की नीति बन चुका था।',
      text: 'Decades later, when India launched its great campaign to save the tiger from extinction, that park was where it began. The hunter\'s changed heart had become, in the end, national policy.' },
    { art: ['pt_lion'], who: 'mithu',
      hi: 'कॉर्बेट के जंगलों में आज भी जंगली बाघ घूमते हैं — तुम वहाँ जा सकते हो और क़िस्मत अच्छी रही तो एक बाघ देख भी सकते हो, जिसकी गारंटी पिछली लगभग पूरी सदी में कोई नहीं दे सकता था। यह याद रखना ज़रूरी है कि यह सब कैसे बच पाया: किसी ऐसे इंसान की वजह से नहीं जो हमेशा सब कुछ पहले से जानता था, बल्कि उसकी वजह से जिसने चीज़ों को बड़े ग़ौर से देखा, और जो देखा उससे खुद को बदलने दिया।',
      text: 'Wild tigers still walk in Corbett\'s forest today — you can go and, with luck, see one, which for most of a century was not a thing anyone could promise. It is worth remembering how that was saved: not by someone who always knew better, but by someone who watched closely, and let what he saw change him.' }
  ],
  moral: 'It is never too late to change what you aim at. The strongest people let what they learn turn them around.',
  source: 'Jim Corbett (1875–1955) of Nainital, Kumaon — hunter of man-eating tigers and leopards at the villages\' request, later pioneering wildlife photographer, author (Man-Eaters of Kumaon, 1944) and campaigner for protection; "large-hearted gentleman" is his own published description of the tiger. India\'s first national park, in these foothills, was later renamed Corbett National Park in his honour and became a launch site of Project Tiger. Kept to his own books and standard published biography.'
},

{
  id: 'fk.bugyal-rules',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'The Meadows Above the Trees',
  hook: 'High above the last trees of Uttarakhand lie meadows so beautiful the hills say they belong to the gods. People may visit — but there are rules, and the rules are old.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['घास', 'ghaas', 'grass'], ['बादल', 'baadal', 'cloud'], ['फूल', 'phool', 'flower']],
  scenes: [
    { art: ['pt_deer'], who: null,
      hi: 'उत्तराखंड की किसी भी बड़ी पहाड़ी पर चढ़ो तो जंगल भी तुम्हारे साथ-साथ ऊपर चढ़ता है — पहले बाँज, फिर बुरांश, फिर देवदार और चीड़ — जब तक कि अचानक से पेड़ ख़त्म न हो जाएँ। उस रेखा के ऊपर पहाड़ खुली घास की चादर ओढ़ लेता है: बादलों को छूते, दूर तक फैले मखमली घास के मैदान, जिन्हें बुग्याल कहते हैं।',
      text: 'Climb any big hill in Uttarakhand and the forest climbs with you — oak, then rhododendron, then deodar and fir — until, quite suddenly, the trees stop. Above that line the mountain wears open grass: rolling, cloud-brushed meadows called bugyals.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'गर्मियों में बुग्याल फूलों से झूम उठते हैं — नीले पॉपी, पोटेंटिला, और बर्फ़ीली चोटियों के साए में रंगों से भरी पूरी की पूरी ढलानें — और गढ़वाल तथा कुमाऊँ के गड़ेरिये अपने रेवड़ों को चराने ऊपर ले जाते हैं, बिल्कुल वैसे ही जैसे उनके परिवार तब से करते आ रहे हैं जितने पुराने लोगों के गीत हैं।',
      text: 'In summer the bugyals go mad with flowers — blue poppies, potentillas, whole slopes of colour with snow peaks standing over them — and the shepherds of Garhwal and Kumaon walk their flocks up to graze, as their families have for as long as anyone\'s songs remember.' },
    { art: ['guard'], who: null,
      hi: 'लेकिन पहाड़ का हर बच्चा बचपन में ही सीख जाता है: बुग्याल कोई आम चरागाह नहीं होते। इन ऊँचे घास के मैदानों को देवताओं — यानी पहाड़ों के भगवानों के बगीचे और रहने की जगह माना जाता है। वहाँ आप एक मेहमान हैं। और मेहमानों का एक सलीका होता है।',
      text: 'But every hill child learns early: a bugyal is not an ordinary pasture. These high meadows are held to be the gardens and dwelling-grounds of the devtas — the gods of the hills. You are a guest up there. And guests have manners.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'पुराने नियम बड़े पक्के हैं, और गड़ेरिये आज भी उनका पालन करते हैं। धीरे-धीरे चलो और चिल्लाओ मत — ये ऊँचाइयाँ शोर मचाने की जगह नहीं हैं। अपने जानवरों के चरने के अलावा वहाँ से कुछ मत लो। किसी भी तरह की गंदगी मत छोड़ो। कुछ मैदानों को तो बिल्कुल भी नहीं छेड़ना है, और आदर के कारण उनके ऊपर की कुछ चोटियों पर कभी नहीं चढ़ना है।',
      text: 'The old rules are quite exact, and shepherds keep them still. Walk gently and do not shout — the heights are not a place for noise. Take nothing but what your animals graze. Leave no mess of any kind. Certain meadows are not to be disturbed at all, and some peaks above them are never to be climbed, out of respect.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अपने दादाजी के रेवड़ के साथ पहली बार जा रहे एक लड़के ने एक बार वही सीधा सा सवाल पूछा: क्या देवताओं को सचमुच शोर और गंदगी से बुरा लगता है?',
      text: 'A boy going up for his first season with his grandfather\'s flock once asked the obvious question: do the gods really mind noise and mess?',
      ask: {
        q: 'What did his grandfather answer?',
        options: ['"No — the rules are just old habit"', '"Look at what the rules protect, and tell me the rules are foolish"', '"Only shout when it rains"'],
        answer: 1,
        right: 'The grandfather swept his arm across the flowers, the clean streams, the grass that feeds every village below. "The devtas\' rules have kept this perfect for a thousand years. Respect that works is not superstition. It is care, wearing its Sunday clothes."',
        wrong: 'The grandfather did not argue theology. He swept his arm across the flowers and clean streams. "These rules have kept this perfect for a thousand years. Respect that works is care, wearing its Sunday clothes."'
      } },
    { art: ['pt_deer', 'courtier'], who: null,
      hi: 'और यह सच भी है: ये नियम चाहे जो भी हों, असल में प्रकृति की रक्षा ही हैं। वे मैदान जहाँ कोई चिल्लाता नहीं, खुदाई नहीं करता, कचरा नहीं फैलाता या हद से ज़्यादा समय नहीं रुकता, वही मैदान हैं जहाँ घास पहाड़ की नाज़ुक मिट्टी को बाँधे रखती है, झरने साफ़ बहते हैं, और फूल हर एक गर्मी में फिर से खिल उठते हैं।',
      text: 'And it is true: the rules are conservation, whatever else they are. Meadows where no one shouts, digs, litters or overstays are meadows where the grass holds the thin mountain soil, the streams run clean, and the flowers return every single summer.' },
    { art: ['guard'], who: null,
      hi: 'बुग्यालों पर अब नए खतरे हैं — मशहूर जगहों पर बहुत ज़्यादा सैलानी, और सभी जगहों पर बदलता मौसम — इसलिए अदालतों और गाँवों दोनों ने मिलकर उनकी रक्षा के लिए कदम उठाए हैं, और ऐसे नियम बनाए हैं जो बिल्कुल दादाजी के नियमों जैसे ही लगते हैं: धीरे से जाओ, कुछ भी मत लाओ, कुछ भी मत छोड़ो।',
      text: 'The bugyals face new pressures now — too many visitors in famous ones, changing weather in all of them — and courts and villages have both stepped in to protect them, with rules that sound remarkably like the grandfather\'s: go gently, take nothing, leave nothing.' },
    { art: ['pt_deer'], who: 'mithu',
      hi: 'सबसे मशहूर बुग्यालों के नाम ऐसे हैं जिन्हें ट्रैकर किसी कविता की तरह लेते हैं — आली, बेदनी, दयारा, औली। अगर तुम कभी इनमें से किसी एक में खड़े हो जाओ, तो किसी को तुमसे आवाज़ धीमी करने के लिए कहना नहीं पड़ेगा। वह जगह खुद ही तुम्हें शांत कर देती है। वहाँ जो ख़ामोशी तुम महसूस करोगे, वह सबसे पुराना नियम है, जो आज भी काम कर रहा है।',
      text: 'The most famous bugyals have names trekkers say like poetry — Ali, Bedni, Dayara, Auli. If you ever stand in one, you will not need to be told to lower your voice. The place does it for you. That hush you will feel is the oldest rule of all, still working.' }
  ],
  moral: 'The oldest rules of respect are often care in disguise. Keep them, and the beautiful places keep themselves.',
  source: 'The bugyals — alpine meadows — of Garhwal and Kumaon, Uttarakhand: their summer pastoral use, their standing in hill tradition as the devtas\' own grounds with attendant rules of quiet and restraint, and their present-day protection by village custom and court order alike. Living tradition and present practice, told from inside the hills\' own understanding.'
},

{
  id: 'fk.nanda-raj-jat',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'pahad',
  badge: 'aaj',
  title: 'Walking the Goddess Home',
  hook: 'Once in a generation, the hills of Uttarakhand walk their beloved goddess home to her mountain — for weeks, on foot, behind a four-horned ram.',
  hero: 'durga',
  cast: ['durga', 'courtier', 'guard', 'pt_deer'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['यात्रा', 'yatra', 'journey'], ['विदाई', 'vidaai', 'farewell, send-off'], ['पहाड़', 'pahaad', 'mountain']],
  scenes: [
    { art: ['durga'], who: null,
      hi: 'गढ़वाल और कुमाऊँ के ऊपर नंदा देवी खड़ी हैं — भारत के सबसे ऊँचे पर्वतों में से एक, और सिर्फ़ एक पर्वत से कहीं बढ़कर। पहाड़ के लोगों के लिए वह नंदा हैं, यानी देवी — और बड़े लाड़-प्यार से, वह इन पहाड़ों की अपनी बेटी भी हैं, जिनका ब्याह ऊँचे बर्फीले पहाड़ों में हुआ है।',
      text: 'Over Garhwal and Kumaon stands Nanda Devi — one of the highest mountains in India, and much more than a mountain. To the hill people she is Nanda, the goddess — and, tenderly, she is also the hills\' own daughter, married into the high snows.' },
    { art: ['courtier'], who: null,
      hi: 'क्योंकि पहाड़ों की कहानियों में, नंदा इसी धरती की बेटी हैं, जिनका ब्याह भगवान शिव से हुआ है, जिनका वास गहरे हिमालय में है। और दूर ब्याही गई हर पहाड़ी बेटी की तरह, वह भी अपने मायके — अपनी माँ के घर — मिलने आती हैं, और फिर समय आने पर, उन्हें पैदल विदा करके वापस ससुराल पहुँचाना होता है।',
      text: 'For in the hills\' telling, Nanda is a daughter of this very country, wedded to Lord Shiva, whose home is the deep Himalaya. And like every pahari daughter married far away, she comes back to visit her maika — her mother\'s home — and must, in time, be walked back to her husband\'s.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'हर साल उनके लिए छोटे-छोटे त्योहार होते हैं। लेकिन लगभग हर बारह साल में एक बार आता है महा-उत्सव — नंदा देवी राज जात — जब पूरा पहाड़ी इलाका अपनी बेटी को पूरे ठाठ-बाट से विदा करने के लिए इकट्ठा होता है। लोग इसके लिए अपना पूरा बचपन इंतज़ार करते हैं।',
      text: 'Every year there are small festivals for her. But roughly once every twelve years comes the great one — the Nanda Devi Raj Jat — when the whole country of the hills assembles to escort its daughter home in state. People wait their whole childhoods for it.' },
    { art: ['pt_deer', 'durga'], who: null, mood: 'wow',
      hi: 'यह यात्रा पैदल चलती है। कोई कहावत नहीं: सचमुच पैदल चलती है, लगभग तीन हफ़्तों तक, गढ़वाल के गाँव-गाँव से होते हुए ऊपर — पालकी में बैठी देवी, भीड़ के ऊपर डोलती घाटी के मंदिरों की सुनहरी छतरियाँ, और पुराने रिवाज़ के मुताबिक सबसे आगे, एक चौसिंग्या खाडू: चार सींगों वाला मेढ़ा, जो इसी यात्रा के लिए जन्मा है और आगे-आगे रास्ता दिखाता है।',
      text: 'The procession walks. Not a metaphor: it walks, for about three weeks, village to village up through Garhwal — the goddess in her palanquin, gold umbrellas from valley temples bobbing over the crowds, and at the head of everything, by old custom, a chausingya khadu: a four-horned ram, born for the journey, who leads the way.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'हर पड़ाव अपने घर लौटने जैसा है। रास्ते के गाँव देवी को रात भर के लिए अपने परिवार की तरह ठहराते हैं — गीत, दीये, आँसू, त्योहार का खाना — क्योंकि वह सिर्फ़ उनके गाँव से गुज़र नहीं रही हैं। वह उनकी अपनी हैं, जो लंबी बर्फ़ में जाने से पहले, एक आख़िरी रात के लिए मिलने आई हैं।',
      text: 'Every halt is a homecoming. Villages on the route host the goddess overnight as family — songs, lamps, tears, festival food — because she is not passing through their village. She is theirs, visiting, one last night before the long snows.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और रास्ते भर गाए जाने वाले गीत एक खास तरह के होते हैं, जिन्हें हर पहाड़ी परिवार अपनी रग-रग से जानता है: विदाई के गीत। विदाई के गीत — यानी वो गीत जो तब गाए जाते हैं जब कोई बेटी अपने मायके से विदा होकर ससुराल जाती है।',
      text: 'And the songs along the road are a particular kind that every hill family knows in its bones: vidaai songs. Farewell songs — the songs sung when a daughter leaves her parents\' home for her husband\'s.',
      ask: {
        q: 'Why does a goddess\'s grand procession sing the same songs as an ordinary family at a daughter\'s send-off?',
        options: ['They are the only songs everyone knows', 'Because to these hills she IS the daughter — every family\'s farewell is in her farewell', 'To keep the walkers awake'],
        answer: 1,
        right: 'That is the whole heart of it. Every mother who ever sent off a daughter, every daughter who ever left — the Raj Jat carries all of them. The hills are not watching a goddess leave. They are feeling every leaving at once.',
        wrong: 'Everyone knows many songs. They sing vidaai because to these hills Nanda IS the daughter — every family\'s own farewell is folded into hers. The hills are feeling every leaving at once.'
      } },
    { art: ['guard', 'pt_deer'], who: null,
      hi: 'सफ़र के आख़िरी पड़ाव गाँवों से आगे, बुग्यालों के पार, वीरान ऊँचाइयों से होते हुए पहाड़ की तरफ़ बढ़ते हैं — जहाँ आख़िरकार विदाई होती है, और वह मेढ़ा सारे पहाड़ों का प्यार समेटे आख़िरी सफ़र पर अकेले ही बर्फ़ की ओर आगे बढ़ जाता है, और लोग अपने घरों की तरफ़ लौट पड़ते हैं।',
      text: 'The last marches climb beyond the villages, beyond the bugyals, into the bare high country toward the mountain — where at last the farewell is made, and the ram goes on ahead alone toward the snows, carrying the hills\' love the final distance, and the people turn for home.' },
    { art: ['courtier'], who: null,
      hi: 'वे नीचे उतरते हैं तो मन एक साथ हल्का भी होता है और भारी भी, ठीक वैसे ही जैसे किसी सच्ची विदाई के बाद होता है। और कहते हैं कि उस रात गाँवों में अगली राज जात की बातें होने लगती हैं — जो बारह साल बाद आनी है — और यह कि अगली बार कौन-से बच्चे इतने बड़े हो जाएँगे जो पूरा रास्ता पैदल चल सकें।',
      text: 'They walk back down lighter and heavier at once, the way you are after a true goodbye. And in villages that night, they say, the talk is of the next Raj Jat — twelve years off — and which children will be old enough to walk the whole way, next time.' },
    { art: ['durga'], who: 'mithu',
      hi: 'पिछली बड़ी राज जात में लाखों लोग पैदल चले थे, और अगली राज जात का इंतज़ार हमेशा बना रहता है। कई पहाड़ी परिवारों में बेटी की विदाई में आज भी नंदा के गीत गाए जाते हैं, और नंदा की विदाई में उनके गीत। अगर आपके परिवार में भी विदाई के गीत गाए जाते हैं — चाहे किसी भी परंपरा के हों — तो एक गीत सुनाने के लिए ज़रूर कहिए। आख़िरकार वे सारे गीत एक ही बात कहते हैं: सुख से जाओ, सदा प्यार मिले, और लौटकर फिर आना।',
      text: 'The last great Raj Jat drew lakhs of walkers, and the next is always coming. In many pahari families, a daughter\'s send-off still borrows Nanda\'s songs, and Nanda\'s borrows theirs. If your family has vidaai songs — from any tradition — ask to hear one. They are all, in the end, the same song: go well, be loved, come back.' }
  ],
  moral: 'The deepest festivals are ordinary feelings made enormous — every family\'s farewell, walked up a mountain together.',
  source: 'The Nanda Devi Raj Jat of Uttarakhand — the generational (roughly twelve-yearly) three-week pilgrimage escorting Nanda from her homeland temples toward the high Himalaya, led by the four-horned ram, with vidaai songs sung along the route; the most recent great Jat drew hundreds of thousands. Living tradition of Garhwal and Kumaon, told from inside the hills\' own understanding of Nanda as daughter and goddess; annual smaller jats continue between the great ones.'
}

];

window.IND_COLLECTIONS_NORTH = [
  { id: 'dilli',       name: 'The Cities of Dilli',   note: 'Seven cities deep and still going — pillars, poets, pigeons and one ruler nobody expected.', avatar: 'guard' },
  { id: 'naya-shehar', name: 'The City Beautiful',    note: 'Chandigarh\'s stories are new, and that is the point — a city drawn on paper, and a secret kingdom of broken things.', avatar: 'courtier' },
  { id: 'pahad',       name: 'Stories from the High Hills', note: 'Himachal and Uttarakhand — travelling gods, untied knots, grey ghosts and the goddess walked home.', avatar: 'pt_deer' },
  { id: 'wadi',        name: 'The Valley and the Lake', note: 'Kashmir — the lake that became a valley, the serpent prince, and the woman everyone claims.', avatar: 'pt_heron' },
  { id: 'panj-ab',     name: 'Fields of Punjab and Haryana', note: 'Lohri\'s hero, the khichdi partners, the wrestlers by the pond and a village on a lost city.', avatar: 'pt_bull' }
];
