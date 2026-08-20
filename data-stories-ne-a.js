/* Bizzing India — folklore of the eastern Northeast (Assam, Meghalaya, Mizoram, Tripura).

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js, on its
   own globals (IND_STORIES_NE_A / IND_COLLECTIONS_NE_A) so it can be loaded and merged
   independently.

   These are living traditions of specific named communities — Assamese, Mising, Bodo,
   Khasi, War Khasi, War Jaintia, Garo, Pnar, Mizo, Tripuri, Jamatia, Reang, Chakma.
   Every source line names the community; nothing here is credited to "the Northeast"
   as though that were one people.

   Softening note (docs/05, and the age band): several of these tales are harsher in
   their oldest tellings than they are here — Tejimola, the sparrow and the elephant,
   Ngaitei, Mauruangi. Each one says so in its own `source` line rather than quietly
   rewriting the tradition.

   Skipped as untellable for this age band, deliberately, rather than softened past
   recognition: Ka Likai of the falls (Khasi), U Thlen (Khasi), U Sier Lapalang (Khasi),
   Tula and Teja, Champavati and the Kite's Daughter (Assamese), Chawngchilhi and
   Rimenhawihi (Mizo). Skipped for a different reason — no telling could be found that
   we could vouch for, and inventing one for a named community is worse than a gap:
   Kanchanmati (Assamese), Thailungi and Lasiri-and-Lasari (Mizo), and the Tripuri
   tale of the moon's marks.

   Badges: katha for tales as they are told; aaj for festivals and crafts as they live
   today. Kokborok, Mizo, Khasi, Garo and Assamese words sit in the story text with a
   gloss, the way a grandmother would give them; words_hi stays Hindi as the field
   requires. */

window.IND_STORIES_NE_A = [

/* ================================================================ ASSAM ==== */
{
  id: 'fk.tejimola',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Tejimola, Who Kept Becoming',
  hook: 'They tried to make her gone. She came back as a vine, then a tree, then a lotus — and she never once stopped singing.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-AS'],
  words_hi: [['बेटी', 'beti', 'daughter'], ['कमल', 'kamal', 'lotus'], ['गीत', 'geet', 'song']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'असम में, उस बड़ी नदी के किनारे, एक व्यापारी और उसकी बेटी तेजिमोला रहते थे। माँ चल बसी थी, और पिता बेटी को ऐसे सहेजकर प्यार करते थे जैसे कोई ठंडी रात में आखिरी सुलगते अंगारे को रखता है। वह काम करते-करते गाती रहती थी — उस किनारे का हर कोई उसका चेहरा देखने से पहले ही उसकी मीठी आवाज़ पहचानता था।',
      text: 'In Assam, on the bank of the great river, lived a merchant and his daughter Tejimola. Her mother was gone, and her father loved her the way you hold the last ember on a cold night. She sang while she worked — everyone on that bank knew her voice before they knew her face.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'पिता ने दूसरा विवाह कर लिया, और फिर वह मौसम आ गया जब उन्हें ब्रह्मपुत्र में नाव लेकर व्यापार के लिए निकलना था। "मेरी तेजिमोला का ध्यान रखिएगा," उन्होंने कहा। नई पत्नी सिर्फ होठों से मुस्कुराई। नाव आगे निकल गई, और घर में सन्नाटा छा गया।',
      text: 'Her father married again, and then the season came for him to take his boat down the Brahmaputra to trade. "Look after my Tejimola," he said. The new wife smiled with her mouth. The boat went, and the house went quiet.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'नाव के जाते ही सौतेली माँ की बची-खुची दया भी चली गई। कड़वे बोल, कड़े काम, और एक दिन उसने तेजिमोला को ढेंकी पर धान कूटने भेज दिया — वह बड़ा सा लकड़ी का कूटने वाला यंत्र, जो झूले की तरह ऊपर-नीचे होता है। यहाँ पुरानी कहानी बड़ी कठोर हो जाती है, और हम इस बात पर ज़्यादा नहीं ठहरेंगे। सौतेली माँ ने तेजिमोला को मिटा देने की कोशिश की। बस इतना ही कहना काफी है — क्योंकि असली बात तो इसके बाद हुई।',
      text: 'The stepmother\'s kindness left with the boat. Hard words, hard chores, and one day she sent Tejimola to pound paddy at the dheki — the great wooden rice-pounder that rises and falls like a see-saw. There the old telling turns harsh, and this one will not linger. The stepmother tried to make Tejimola gone. That is all that needs saying — because of what happened next.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'जहाँ यह हुआ था, उसी बाड़े के पास रात ही रात में लौकी की एक बेल उग आई — चमकदार, तेज़ी से बढ़ती हुई, और किसी भी आम बेल से कहीं ज़्यादा मजबूत। पड़ोस की एक काकी लौकी तोड़ने के लिए रुकीं, तो पूरी बेल काँप उठी और गा उठी: "मुझे मत तोड़िए, काकी। मैं कोई लौकी नहीं हूँ। मैं तो तेजिमोला हूँ।"',
      text: 'By the fence where it happened, a gourd vine came up overnight — glossy, quick, stronger than any vine has a right to be. A neighbour woman stopped to pick a gourd, and the whole vine trembled and sang: "Do not pick me, aunty. I am no gourd. I am Tejimola."' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'सौतेली माँ ने यह सुना, तो बेल उखाड़कर घर के पीछे फेंक दी। कुछ ही दिनों में वहाँ एक बोगोरी — बेर का जंगली पेड़ — खड़ा हो गया, जो फलों से लदा था। बच्चों ने बेर तोड़ने के लिए हाथ बढ़ाया, तो डालियाँ झूम उठीं और गा उठीं: "मुझे मत तोड़ो। मैं कोई बेर का पेड़ नहीं हूँ। मैं तो तेजिमोला हूँ।"',
      text: 'The stepmother heard of it, tore the vine up and flung it behind the house. Within days a bogori stood there — a wild plum tree — hung with fruit. Children reached for the plums and the branches swayed and sang: "Do not pick me. I am no plum tree. I am Tejimola."' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'तो उस पेड़ को काट दिया गया और नदी में बहा दिया गया। और वह नदी — जो उसके पिता को दूर ले गई थी और उन्हें वापस घर लाने वाली थी — उसने लकड़ी को अपने भीतर खींच लिया, और जहाँ उसने पानी को छुआ, वहाँ एक कमल खिल उठा। बीच धारा में अकेला कमल, जहाँ कभी कोई कमल नहीं उगता।',
      text: 'So the tree was cut and thrown in the river. And the river — which had carried her father away and would carry him home — took the wood under, and where it touched the water, a lotus opened. One lotus, in midstream, where no lotus grows.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'महीनों बाद नदी के रास्ते व्यापार की एक नाव आई। व्यापारी ने उस फूल को देखा और उसे पाना चाहा। लेकिन जैसे ही मल्लाह ने हाथ बढ़ाया, कमल बहकर दूर चला गया। पर जब व्यापारी खुद नाव से झुका, तो वह तैरकर पास आ गया। और उसे सुनाई दी — इतनी धीमी कि सुनने से ज़्यादा उसने महसूस की — एक जानी-पहचानी आवाज़।',
      text: 'Months later a trading boat came up the river, and the merchant saw the flower and wanted it. But when the boatman reached out, the lotus drifted away. When the merchant himself leaned from the boat, it drifted close. And he heard — so small he felt it more than heard it — a voice he knew.',
      ask: {
        q: 'A lotus that comes only to him, with a voice he knows. How do you test whether a flower is your daughter?',
        options: ['Pick it quickly before it drifts off', 'Say her name, and ask her to show him', 'Ask the boatman what he thinks'],
        answer: 1,
        right: 'Just so. "If you are my Tejimola," he said, "become a little bird, and come to my hand."',
        wrong: 'He did something gentler. "If you are my Tejimola," he said, "become a little bird, and come to my hand."'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'कमल की पंखुड़ियाँ सिमट गईं, और पानी में से उड़कर एक मैना उसकी हथेली पर आ बैठी, और घर तक के पूरे रास्ते उसके कंधे से नहीं उतरी। अपने दरवाज़े पर पहुँचकर उसने कहा, "अब पूरी तरह से। अपने असली रूप में।" और वहाँ खड़ी थी तेजिमोला — पहले से दुबली, आँखों से कुछ बड़ी, और रूप पूरा बदलने से पहले ही गाने लगी।',
      text: 'The lotus folded, and a mynah flew up out of the water and landed on his palm, and would not leave his shoulder the whole way home. At his own door he said, "Now all of it. Your own shape." And there stood Tejimola — thinner, older about the eyes, and singing before she was done becoming.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उसने उसे सब कुछ बता दिया, साफ़-साफ़, जैसे वह अपनी हर बात कहती थी। सौतेली माँ को वापस उसके गाँव भेज दिया गया, और बात वहीं ख़त्म हुई — घर को चीखने-चिल्लाने की ज़रूरत नहीं थी, उसे तो अपना खोया हुआ गाना वापस चाहिए था, और वह उसे मिल गया।',
      text: 'She told him everything, plainly, the way she did all things. The stepmother was sent back to her own village, and that was the whole of it — the house did not need shouting, it needed its singing back, and it got it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'असम के बच्चों को ठीक-ठीक पता होता है कि इस कहानी में गाने कहाँ आते हैं, और कहानी सुनाती दादी हर गाने से पहले ज़रा ठहरती हैं ताकि सब मिलकर वही आवाज़ निकाल सकें। तुम भी साथ गा सकते हो। बल्कि तुम्हें तो साथ गाना ही चाहिए।',
      text: 'Assamese children know exactly where the songs come in this story, and a grandmother telling it will pause before each one so everybody can do the voice. You are allowed to join in. You are supposed to.' }
  ],
  moral: 'Love keeps becoming. You cannot pull it up, cut it down, or float it away.',
  source: 'Tejimola — Assamese, collected in Lakshminath Bezbaroa\'s Burhi Aair Sadhu ("Grandmother\'s Tales") and older than the book in the telling. The oldest versions are harsher about what happened at the dheki; this telling keeps to the becoming, and says so.'
},

{
  id: 'fk.bordoisila',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Wind Who Runs Home to Her Mother',
  hook: 'Every spring, just before Bihu, a wild wind bangs through Assam. It is not a storm. It is a daughter, running.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['आँधी', 'aandhi', 'storm wind'], ['घर', 'ghar', 'home'], ['वसंत', 'vasant', 'spring']],
  scenes: [
    { art: ['guard', 'courtier'], who: null,
      hi: 'असम में ठंड के मौसम के बिल्कुल आख़िर में, जब आम के पेड़ों पर बौर आ जाता है, हमेशा एक ऐसी शाम आती है जब हवा अचानक तेज़ हो उठती है — दरवाज़ों को खटखटाती, बरामदे से बर्तनों को लुढ़काती और सबको सूखते कपड़े समेटने के लिए दौड़ाती हुई। और दादी अपने काम से सिर उठाकर कहेंगी, "लो आ गई। बोरदोईसिला।"',
      text: 'At the very end of the cold season in Assam, when the mango trees are in flower, there always comes an evening when the wind gets up all at once — banging doors, rolling pots off verandas, sending everyone running for the washing. And a grandmother will look up from her work and say, "There she is. Bordoisila."' },
    { art: ['courtier'], who: null,
      hi: 'कहते हैं कि बोरदोईसिला एक बेटी है — जिसकी शादी बहुत दूर हुई थी, जैसे पुराने ज़माने में बेटियों की हुआ करती थी, अपनी माँ के घर से पूरे साल भर के पहाड़ों और नदियों की दूरी पर। साल भर वह अपने ससुराल के गाँव में काम करती है। साल भर वह इंतज़ार करती है।',
      text: 'Bordoisila, the telling goes, is a daughter — married far away, the way daughters used to be, a whole year of hills and rivers from her mother\'s house. All year she works in her husband\'s village. All year she waits.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और जब बोहाग आता है — असमिया साल का पहला महीना, बिहू का महीना — तो उसे अपनी माँ के घर जाने की इजाज़त मिल जाती है। वह चलती नहीं है। वह दौड़ती है। नदियों के ऊपर से, बाँसों के बीच से, उड़ते घाघरे और खुले बिखरे बालों के साथ, रास्ते भर चीज़ों को गिराती हुई और एक भी चीज़ उठाने के लिए बिना रुके।',
      text: 'And when Bohag comes — the first month of the Assamese year, the month of Bihu — she is allowed to go home to her mother. She does not walk. She runs. Over the rivers, through the bamboo, skirts flying, hair loose, knocking things over the whole way and not stopping to pick up a single one of them.' },
    { art: ['guard'], who: 'guard',
      hi: '"इसीलिए बिहू से पहले छतों को बाँध दिया जाता है," दादी कहती हैं। "इसलिए नहीं कि हवा नाराज़ है। बल्कि इसलिए कि जिस लड़की ने साल भर से अपनी माँ को न देखा हो, वह तुम्हारी बाड़ के आगे अपनी रफ़्तार धीमी नहीं करती।"',
      text: '"That is why the roofs get tied down before Bihu," the grandmother says. "Not because the wind is angry. Because a girl who has not seen her mother in a year does not slow down for your fence."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'फिर खुद बिहू के दिन आते हैं, और मौसम शांत हो जाता है — क्योंकि बोरदोईसिला घर पर है, अपनी माँ के पास बैठी हुई, माँ के हाथों से खाती हुई, सारी बातें सुनाती हुई, और पूरा आसमान वैसे ही ठहर जाता है जैसे बेटी के वापस आ जाने पर पूरा घर ठहर जाता है।',
      text: 'Then come the Bihu days themselves, and the weather goes gentle — because Bordoisila is home, sitting with her mother, being fed, telling everything, and the whole sky settles the way a house settles when the daughter is back in it.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लेकिन आना तो कुछ ही दिनों का होता है। त्योहार के बाद उसे लौटना ही पड़ता है — और तब एक दूसरी हवा चलती है, धीमी हवा, जो पाँव घसीटती हुई चलती है और बारिश से भीगी होती है।',
      text: 'But a visit is a visit. After the festival she has to go back — and there is a second wind then, a slower one, that drags its feet and drips with rain.',
      ask: {
        q: 'The wind coming home is wild, and the wind leaving is slow and wet. Why the difference?',
        options: ['She is tired from the festival', 'Joy runs, and grief walks', 'The rains have simply started'],
        answer: 1,
        right: 'That is exactly how the elders say it. She arrives laughing at full speed, and she leaves crying, looking back.',
        wrong: 'The elders say it differently: joy runs, and grief walks. She arrives laughing at full speed, and leaves crying, looking back.'
      } },
    { art: ['guard'], who: null,
      hi: 'इसलिए असम में कोई भी वसंत के इस तूफ़ान को नहीं कोसता, या कम से कम ज़्यादा देर तक तो नहीं। वे छतों को बाँधते हैं, चटाई पर सूख रही मिर्चें अंदर ले आते हैं, और कहते हैं: उसे आने दो। पूरा एक साल हो गया है।',
      text: 'So nobody in Assam curses the spring storm, or not for long. They tie the roof, they bring in the chillies drying on the mat, and they say: let her come. It has been a year.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगली बार जब वसंत की हवा धड़ाम से तुम्हारा दरवाज़ा खोल दे, तुम चाहे जहाँ भी रहते हो, तुम भी यही कह सकते हो। कहीं न कहीं, किसी की बेटी जल्दी-जल्दी अपनी माँ के घर जा रही है — और बाहर से देखने पर मौसम बिल्कुल ऐसा ही दिखता है।',
      text: 'Next time a spring wind bangs your door open, wherever you live, you can say it too. Somewhere, somebody\'s daughter is hurrying home to her mother — and the weather is just what that looks like from outside.' }
  ],
  moral: 'Joy runs and grief walks, and both of them are wind.',
  source: 'Bordoisila — the storm wind that comes before Bohag Bihu, told of in Assamese tradition as a married daughter racing home to her mother for the new year. Many tellings.'
},

{
  id: 'fk.xorai-elephant',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Sparrow, the Frog, and the Very Big Elephant',
  hook: 'He was the biggest thing in the forest and he never once looked where he was going. The smallest things in the forest decided to teach him.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_elephant', 'pt_tortoise'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['घोंसला', 'ghonsla', 'nest'], ['कीचड़', 'keechad', 'mud'], ['माफ़ी', 'maafi', 'a sorry']],
  scenes: [
    { art: ['pt_crow'], who: null,
      hi: '"असम के एक जंगल में, सिमलू यानी सेमल के एक पेड़ पर — वही जिस पर पत्ते आने से पहले लाल फूल खिलते हैं — गौरैया के एक जोड़े ने घोंसला बनाया। उसमें अंडे थे, और दोनों बारी-बारी से अंडों को सेते रहते और एक-दूसरे से कहते कि घोंसले की जगह चुनने में वे कितने समझदार निकले।"',
      text: 'In an Assamese forest, in a simolu tree — the silk-cotton, the one that flowers red before it leafs — a pair of sparrows built a nest, and there were eggs in it, and the two of them took turns keeping the eggs warm and telling each other how clever they had been about the location.' },
    { art: ['pt_elephant'], who: 'pt_elephant', mood: 'wow',
      hi: '"उसी जंगल में एक ऐसा हाथी घूमता था जिसे कभी किसी ने \'ना\' नहीं कहा था। \\"मैं जहाँ चाहूँ, वहाँ जाता हूँ,\\" वह ज़्यादातर खुद से ही कहता, क्योंकि उसके साथ कोई चलता ही नहीं था। और उसे बिना ऊपर देखे सिमलू के पेड़ से अपनी पीठ रगड़ना पसंद था — ज़ोर-ज़ोर से।"',
      text: 'Through that forest walked an elephant who had never once been told no. "I go where I like," he said, mostly to himself, since nobody walked with him. And he liked to scratch his back on the simolu tree — hard — without looking up.' },
    { art: ['pt_crow'], who: null, mood: 'sad',
      hi: '"पेड़ हिला, डाली झूली, और अंडों समेत घोंसला नीचे आ गिरा। हाथी ने ध्यान तक नहीं दिया। गौरैया ने बाद में कहा, सबसे बुरी बात यही थी — यह नहीं कि हाथी इतना बड़ा था, बल्कि यह कि उसने ध्यान तक नहीं दिया।"',
      text: 'The tree shook, the branch swung, and the nest came down, eggs and all. The elephant did not notice. That was the worst part, the sparrow said afterwards — not that he was big, but that he did not even notice.' },
    { art: ['pt_crow', 'pt_tortoise'], who: null,
      hi: '"वह खाली डाली पर बैठकर रोने लगी, और उसका रोना सुनकर उसके दोस्त आ पहुँचे: कठफोड़वा, नन्हीं मधुमक्खी और काले तालाब का मेंढक। \\"रोना ठीक है,\\" मेंढक बोला। \\"और रोने वाले के दोस्त भी होते हैं। अब सुनो।\\""',
      text: 'She sat on the empty branch and cried, and her crying brought her friends: the woodpecker, the little bee, and the frog from the black pool. "Crying is right," said the frog. "And crying has friends. Now listen."' },
    { art: ['pt_tortoise'], who: 'pt_tortoise', mood: 'think',
      hi: '"मेंढक की तरकीब में किसी के भी ताक़तवर होने की ज़रूरत नहीं थी। दोपहर में, मधुमक्खी हाथी के कानों के पास अपनी सबसे धीमी और मीठी धुन गुनगुनाने लगी, जब तक कि उसकी आँखें भारी न हो गईं और वह सोचना-समझना न भूल गया। शाम ढले, प्यासा और आधी नींद में, उसने मेंढक को सुना — जो बरसात के गहरे दलदल के बीच से ज़ोर-ज़ोर से, खुशी-खुशी टर्रा रहा था। और यह तो सब जानते ही हैं कि मेंढक वहीं बैठते हैं जहाँ अच्छा पानी होता है।"',
      text: 'The frog\'s plan needed nobody to be strong. At noon, the bee hummed her softest song round the elephant\'s ears until his eyes went heavy and he forgot to think. At dusk, thirsty and half-asleep, he heard the frog — croaking, loud and happy, from the middle of the deep monsoon bog. And everyone knows frogs sit by good water.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      hi: '"वह बिना देखे टर्र-टर्र की आवाज़ की तरफ़ चल पड़ा — बेशक बिना देखे ही — और दलदल ने उसे कंधों तक खींच लिया और एक मुट्ठी की तरह जकड़ लिया। वह रात भर ज़ोर लगाता रहा पर कहीं न पहुँच सका। यह उसकी ज़िंदगी की पहली रात थी जब वह किसी और की दया पर था, और वह रात बहुत लंबी थी।"',
      text: 'He walked toward the croaking without looking — of course without looking — and the bog took him to the shoulders and held him like a fist. He pulled all night and got nowhere. It was the first night of his life at somebody else\'s mercy, and it was very long.' },
    { art: ['pt_crow', 'pt_elephant'], who: 'pt_crow',
      hi: 'भोर होते ही गौरैया उड़कर नीचे आई और उसके कान के पास बैठ गई, किसी पत्ते जैसी छोटी। "क्या तुम मुझे पहचानते हो?" उसने सोचा। और फिर, ठंड से कांपते, थके-हारे और कंधों तक कीचड़ में धंसे होने के बावजूद उसे सब याद आ गया — वह पेड़, वह डाली, वह घोंसला जिस पर उसने कभी ध्यान ही नहीं दिया था। "मुझे माफ़ कर दो," उसने कहा, और सचमुच दिल से कहा, जो कि अपने आप में पहली बार हुआ था।',
      text: 'At dawn the sparrow flew down and sat by his ear, small as a leaf. "Do you know me?" He thought about it. And then, cold and tired and shoulder-deep in mud, he did — the tree, the branch, the nest he had not noticed. "I am sorry," he said, and meant it, which was another first.',
      ask: {
        q: 'He is stuck fast, and he is truly sorry. What should the small ones do now?',
        options: ['Leave him there — he earned it', 'Pull him out at once and say no more', 'Ask him to promise to look where he walks — then everybody pulls'],
        answer: 2,
        right: 'That is what they did. Sorry is a door, not a payment — he had to walk through it.',
        wrong: 'They chose a third way. He promised, out loud, to look where he walks — and then the whole forest helped pull.'
      } },
    { art: ['pt_elephant', 'pt_tortoise'], who: null, mood: 'wow',
      hi: 'भैंसों को किनारे की मिट्टी रौंदनी पड़ी, उसके पैरों के नीचे डालियां लगानी पड़ीं, और लगभग आधी सुबह बीत गई। वह कीचड़ से मटमैला होकर बाहर निकला, पर पूरी तरह बदल चुका था। उसके बाद से वह हाथी हमेशा धीरे-धीरे चलता, और किसी पेड़ को छूने से पहले ऊपर की तरफ देखता — और लोग कहते हैं कि यह वही हाथी था, जो अपनी सूंड की नोक से गिरे हुए घोंसले को उठाकर वापस डाली पर रख देता था।',
      text: 'It took the buffaloes treading the bank down, and branches under his feet, and most of a morning. He came out grey with mud and completely changed. Ever after, that elephant walked slowly, and looked up before he touched a tree — and it was that same elephant, people say, who would lift a fallen nest back onto its branch with the tip of his trunk.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'गौरैयों ने सिमलु के पेड़ पर फिर से अपना घोंसला बनाया। आदत के मुताबिक थोड़ा और ऊपर। पर अब उन्हें ऐसा करने की ज़रूरत नहीं थी।',
      text: 'The sparrows built again in the simolu tree. Higher, out of habit. But they did not need to.' }
  ],
  moral: 'Being big is not a licence, being small is not helpless — and a sorry only counts when your feet change.',
  source: 'Told in Assam as a sadhu — a grandmother-tale — of the small birds and the proud elephant; a close cousin of the tale appears in the Panchatantra. The old tellings end far worse for the elephant; this one lets him climb out changed, and says so.'
},

{
  id: 'fk.burhi-aair-sadhu',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Grandmother\'s Stories, Written Down',
  hook: 'The stories lived in evening voices, and evening voices do not last. One man decided the stories would.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['कहानी', 'kahani', 'story'], ['दादी', 'daadi', 'grandmother'], ['किताब', 'kitaab', 'book']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'जितने पुराने समय तक कोई याद कर सके, असम की कहानियां बस एक ही जगह बसती थीं: शाम के वक्त में। एक दिया, एक चटाई, और एक दादी-नानी — यानी एक ‘आई’, जो असमिया में माँ को कहते हैं, और ‘बुढ़ी आई’ यानी बूढ़ी माँ — और उनके चारों तरफ धान की फ़सल की तरह बैठे बच्चे, जो तेजिमोला की, चतुर जानवरों की, और नाम वाली हवाओं की कहानियां सुन रहे होते।',
      text: 'For as long as anybody can count, the stories of Assam lived in one place: the evening. A lamp, a mat, a grandmother — an aai, which is the Assamese word for mother, and a burhi aai is an old mother — and children arranged around her like a rice harvest, being told about Tejimola, about clever animals, about winds with names.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'फिर छापेखाने आए, और स्कूल की किताबें आईं, और वे किताबें दूसरों की भाषाओं में थीं। और उनके साथ एक अजीब-सा ख्याल चुपके से दाखिल हो गया: कि किताबों की कहानियां ही असली होती हैं, और दादी-नानी की कहानियां छोटी होती हैं — अच्छी, मगर छोटी। किसी ने यह बात खुलकर नहीं कही। यह ख्याल बस धूल की तरह धीरे-धीरे जम गया।',
      text: 'Then came printing presses, and schoolbooks, and the schoolbooks were in other people\'s languages. And a strange idea crept in with them: that stories in books were the real ones, and grandmother stories were small — nice, but small. Nobody said it out loud. It just settled, like dust.' },
    { art: ['courtier'], who: null,
      hi: 'उन्हीं शामों के बीच बड़ा हुआ एक लड़का आगे चलकर लेखक बना। उनका नाम था लक्ष्मीनाथ बेजबरुआ, और उन्होंने बहुत-सी चीज़ें लिखीं — मगर वे बार-बार एक ही विचार पर लौट आते थे। कि जब भी असम में किसी बूढ़ी औरत की मौत होती, कहानियों की एक पूरी अलमारी उनके साथ जलकर राख हो जाती, और कोई इन आगों की गिनती भी नहीं कर रहा था।',
      text: 'A boy who had grown up inside those evenings became a writer. His name was Lakshminath Bezbaroa, and he wrote many things — but he kept coming back to one thought. Every time an old woman in Assam died, a shelf of stories burned down with her, and no one was even counting the fires.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'तो उन्होंने तय किया कि वे दादियों-नानियों की सुनाई कहानियाँ बटोरेंगे और उन्हें एक किताब में दर्ज करेंगे। और तुरंत ही उनके सामने एक चुनाव आ गया, जिस पर सब कुछ टिका हुआ था।',
      text: 'So he decided to gather the tales the grandmothers told and put them in a book. And straight away there was a choice to make, and everything hung on it.',
      ask: {
        q: 'He is a famous writer. The tales are plain fireside talk. How should he write them down?',
        options: ['Polish them up into fine literary Assamese', 'Write them the way they are spoken, songs and pauses and all', 'Translate them into English so the world can see them'],
        answer: 1,
        right: 'That is what he chose. The way they are spoken — because that, not the polish, was the treasure.',
        wrong: 'He chose the plainer, braver thing: the way they are spoken, songs and pauses and all. That, not polish, was the treasure.'
      } },
    { art: ['courtier'], who: 'courtier',
      hi: 'उन्होंने किताब का नाम रखा \'बुढ़ी आईर साधु\' — यानी बूढ़ी माँ की कहानियाँ। \'साधु\' असमिया भाषा में लोककथा को कहते हैं; और \'साधु-कथा\' वह होती है जो दिया जलने पर दादी-नानी सुनाती हैं। उन्होंने कहानियों पर अपनी कोई होशियारी नहीं थोपी। उन्होंने बस दरवाज़ा खुला रखा और उन्हें वैसे ही भीतर आने दिया जैसी वे थीं।',
      text: 'He called the book Burhi Aair Sadhu — the Old Mother\'s Stories. Sadhu is the Assamese word for a folk tale; a sadhu-kotha is what a grandmother says when the lamp is lit. He did not put his own cleverness on top of the tales. He held the door open and let them walk in as they were.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'और यह बात काम कर गई। सौ से भी ज़्यादा साल बाद आज भी असम का हर बच्चा तेजिमोला से मिलता है — अगर किस्मत अच्छी हो तो घर पर, और अगर चूल्हे का अलाव दूर हो तो उस किताब में। शामों को बसने के लिए एक दूसरा ठिकाना मिल गया।',
      text: 'And it worked. A hundred years and more later, every Assamese child still meets Tejimola — at home if they are lucky, in that book if the fireside is far away. The evenings got a second place to live.' },
    { art: ['guard'], who: null,
      hi: 'असम उन्हें एक उपाधि से नवाज़ता है: साहित्यरथी, यानी साहित्य का रथी। लेकिन पूछिए कि उन्होंने असल में क्या किया, तो सच्चा जवाब कहीं छोटा और कहीं ज़्यादा खूबसूरत है। उन्होंने दादियों-नानियों को सुना, और उन्होंने माना कि उनकी कही बातें भी छपी हुई किसी भी किताब जितनी ही सँभाल कर रखने के क़ाबिल हैं।',
      text: 'Assam honours him with a title: Sahityarathi, the charioteer of literature. But ask what he actually did, and the honest answer is smaller and better. He listened to grandmothers, and he thought what they said was worth exactly as much care as anything ever printed.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'कहानियों को निगल जाने वाला कोहरा बड़ा ख़ामोश होता है, और उसकी शुरुआत होती है इस बात से कि "वे पुरानी कहानियाँ कोई इतनी ज़रूरी तो हैं नहीं।" कोई एक इंसान अपनी दादी-नानी की कही बातों को ठीक वैसे ही लिख ले जैसे वे कहती हैं — तो यह वह दिया बन जाता है जिसे वह कोहरा पार नहीं कर पाता। वह इंसान तुम भी हो सकते हो। ज़्यादातर परिवारों में आज भी एक दादी या नानी हैं, पर कोई कॉपी-पेंसिल नहीं।',
      text: 'The mist that eats stories is quiet, and it starts with "those old tales are not really important." One person writing down what their grandmother says, just as she says it — that is the lamp it cannot get past. You could be that person. Most families still have one grandmother and no notebook.' }
  ],
  moral: 'Write down what your grandmother tells you, the way she tells it. One notebook can carry a thousand evenings.',
  source: 'The book is real: Burhi Aair Sadhu, Lakshminath Bezbaroa\'s landmark collection of Assamese folk tales, first published a little over a hundred years ago, with Tejimola among its tales. The fireside frame here is a telling; the book, and the debt to the grandmothers, are the record.'
},

{
  id: 'fk.bihu-goru',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Morning the Cows Go First',
  hook: 'The Assamese new year begins with a bath — and not for the people.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_bull'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['गाय', 'gaay', 'cow'], ['त्योहार', 'tyohaar', 'festival'], ['आशीर्वाद', 'aashirvaad', 'blessing']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अप्रैल के बीच में, जब पहले तूफ़ानों ने दुनिया भर की धूल धो दी होती है, असम अपने नए साल का आगाज़ करता है — बोहाग बिहू, यानी रोंगाली बिहू, जो नाच-गाने से रचा-बसा है। और इसकी सबसे पहली सुबह इंसानों की बिल्कुल नहीं होती।',
      text: 'In the middle of April, when the first storms have washed the dust off the world, Assam begins its year — Bohag Bihu, the Rongali Bihu, the one made of dancing. And the very first morning of it does not belong to the people at all.' },
    { art: ['pt_bull', 'courtier'], who: null,
      hi: 'आज गोरु बिहू है — यानी मवेशियों का बिहू। किसी के भी नए कपड़े पहनने से पहले, हर एक गाय और बैल को नदी या तालाब पर ले जाया जाता है, और उन्हें साल का सबसे बढ़िया स्नान कराया जाता है।',
      text: 'It is Goru Bihu — the cattle\'s Bihu. Before anyone puts on anything new, the cows and bullocks are taken down to the river or the pond, every one of them, and given the best bath of their year.' },
    { art: ['guard', 'pt_bull'], who: 'guard',
      hi: 'एक दादाजी — यानी कोका — एक छोटे लड़के और एक बड़ी-सी गाय के साथ घुटनों तक पानी में खड़े हैं। "यहाँ मलो। कानों के पीछे। इसने पूरे साल इस परिवार को संभाला है, तो एक सुबह के लिए तुम्हारे दोनों हाथ इसे मिल ही सकते हैं।" गाय भी, अपनी तरफ से, इस सब के बीच बड़ी ही शान और गरिमा से खड़ी दिखती है।',
      text: 'A grandfather — a koka — stands knee-deep with a small boy and a large cow. "Rub here. Behind the ears. She has carried this family all year, she can have your two arms for one morning." The cow, for her part, looks extremely dignified about the whole thing.' },
    { art: ['pt_bull'], who: null, mood: 'wow',
      hi: 'उन्हें नहलाया जाता है, हल्दी और काली उड़द की दाल का लेप मला जाता है, और खास पत्तियों की टहनियाँ छुआई जाती हैं — हर परिवार जानता है कि कौन-सी पत्तियाँ — और फिर आता है वह गीत, आधा गाया हुआ और आधा बोला हुआ, जिसे पीढ़ियों से बच्चे इस सुबह गायों के आगे गाते आए हैं: "लाउ खा, बेंगेना खा, बसरे बसरे बाढ़ी जा।" लौकी खाओ, बैंगन खाओ, साल-दर-साल बढ़ते जाओ।',
      text: 'They are washed, and rubbed with a paste of turmeric and black gram, and touched with sprigs of the proper leaves — every family knows which — and then comes the song, half-sung and half-said, that children have shouted at cows on this morning for generations: "Lau kha, bengena kha, bosore bosore barhi ja." Eat gourd, eat brinjal, grow year upon year.' },
    { art: ['courtier', 'pt_bull'], who: null, mood: 'think',
      hi: 'लड़का वही सीधा-सा सवाल पूछता है: यह हमारा नया साल है — तो गायों की बारी सबसे पहले क्यों आती है?',
      text: 'The boy asks the obvious thing: it is our new year — why do the cows go first?',
      ask: {
        q: 'Well — why do the cows get the first morning of the year?',
        options: ['They are the dirtiest', 'The ones who worked all year are thanked first', 'It is practice for washing the children'],
        answer: 1,
        right: 'That is the whole of it. The year begins with a thank-you to the ones who pulled it.',
        wrong: 'The koka\'s answer is simpler: the ones who worked all year are thanked first. The year begins with a thank-you to the ones who pulled it.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'अगला दिन मानुह बिहू होता है — यानी लोगों का दिन। नए कपड़े, और गमोसा भेंट करना: असम का लाल-सफेद बुना हुआ कपड़ा, जिसे किसी के हाथों या कंधों पर रखा जाता है — मानो सम्मान को हाथों में थाम लिया गया हो। छोटे बड़ों के आगे सिर झुकाते हैं और पूरे साल के लिए उनका आशीर्वाद लेते हैं।',
      text: 'The next day is Manuh Bihu — the people\'s day. New clothes, and the giving of gamosas: the red-and-white woven cloth of Assam, laid over a person\'s hands or shoulders, which is how respect looks when you can hold it. The young bow to the elders and collect their blessings for the year.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और फिर गाना-बजाना शुरू होता है और रुकने का नाम ही नहीं लेता — ढोल और पेपा (भैंस के सींग की तुरही) लेकर हुसोरी की मंडलियाँ घर-घर जाती हैं और जिस भी आँगन में कदम रखती हैं, उसे आशीर्वाद देती हैं। खुले में होने वाला वह बिहू नाच ही तो है, जिसके लिए लोग समंदर पार से भी अपने घर खिंचे चले आते हैं।',
      text: 'And then the singing starts and does not really stop — husori parties going house to house with dhol and pepa, the drum and the buffalo-horn pipe, blessing each courtyard they land in. The dancing in the open — the bihu naach — is the thing people cross oceans to be home for.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"असम में साल में तीन बिहू मनाए जाते हैं, धान के हर मिज़ाज के लिए एक—अप्रैल में रोंगाली जब बीज बोए जाते हैं, पतझड़ में कंगाली जब खेत खाली होते हैं और उनके लिए दीये जलाए जाते हैं, और जनवरी में भोगाली जब फ़सल घर आ जाती है और बस खाने-खिलाने की धूम होती है। अपने परिवार से पूछिए कि वे कौन-सा बिहू सबसे बड़ा मानते हैं—इस जवाब से आपको पता चलेगा कि असम में आपके लोग कहाँ के रहने वाले हैं।"',
      text: 'Assam keeps three Bihus a year, one for each mood of the rice: Rongali in April when it is sown, Kongali in autumn when the fields are lean and lamps are lit for them, Bhogali in January when the harvest is in and the whole point is eating. Ask your family which one they keep biggest — the answer tells you where in Assam your people are from.' }
  ],
  moral: 'Begin the year by thanking whoever carried the last one.',
  source: 'Bohag (Rongali) Bihu as Assamese families keep it today — Goru Bihu for the cattle, Manuh Bihu for the people, husori for everybody. A living festival; the details differ village to village, so ask your family.'
},

{
  id: 'fk.ali-aye-ligang',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Day the Sowing Begins',
  hook: 'Before a single seed goes into the ground, the whole village has to dance about it. There is a reason.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['बीज', 'beej', 'seed'], ['खेत', 'khet', 'field'], ['नदी', 'nadi', 'river']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"ब्रह्मपुत्र के किनारे मिसिंग लोग रहते हैं—नदी के लोग, जिनके घर खंभों पर टिके होते हैं, जिन्हें चांग घर कहते हैं, और बाढ़ का पानी नीचे से ऐसे गुज़र जाता है मानो कोई मेहमान बरामदे से निकल रहा हो। वे अरुणाचल की पहाड़ियों के तानी लोगों के रिश्तेदार हैं, वही जो पहले इंसान आबो तानी की कहानियाँ सुनाते हैं; मिसिंग लोग बहुत पहले वे गीत नीचे मैदानों में लेकर आए थे।"',
      text: 'Along the Brahmaputra live the Mising people — river people, whose houses stand on stilts, the chang ghar, with the flood water allowed to pass underneath like a guest using the corridor. They are kin to the Tani peoples of the Arunachal hills, the ones who tell of Abo Tani, the first man; the Mising carried those songs down to the plains long ago.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और जब बसंत आता है, तो मिसिंग लोग आली-आये-लिगांग मनाते हैं। मिसिंग भाषा के तीन शब्दों में ही पूरे त्योहार का सार है—आली यानी जड़ें और बीज, आये यानी अनाज, और लिगांग यानी बुआई की शुरुआत। वही दिन जब साल भर का काम शुरू होता है।"',
      text: 'And when spring comes, the Mising keep Ali-Aye-Ligang. The name is the whole festival in three words of the Mising tongue: ali, the roots and seed; aye, the grain; ligang, the beginning of the sowing. The day the year\'s work starts.' },
    { art: ['guard'], who: null,
      hi: '"उसी सुबह, परिवार के कोई बड़े खेत में जाते हैं और आहू धान की पहली चुटकी बोते हैं—बस एक चुटकी, जिसे पूरी बुआई शुरू करने से पहले धन्यवाद कहकर धरती में डाला जाता है। मौसम की पहली मुट्ठी फ़सल बनने से पहले एक तोहफ़ा होती है; यह बात पहाड़ियों ने सबको सिखाई थी, और नदी के लोग इसे कभी नहीं भूले।"',
      text: 'On the morning itself, an elder of the family goes to the field and sows the first pinch of ahu rice — just a pinch, put into the earth with a word of thanks before anybody sows in earnest. The first handful of the season is a gift before it is a crop; the hills taught everyone that, and the river people did not forget it.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"फिर ढोल निकल आते हैं, और गुमराग नाचा जाता है—नाचने वालों की कतारें, जिनकी एड़ियों की थाप ज़मीन में उतरती है, खुले आसमान के नीचे गोल-गोल घूमते हुए। पत्तों में लपेटकर चावल पकाए जाते हैं, हर घर में दावत होती है, और पूरा गाँव एक-दूसरे के दरवाज़े आता-जाता रहता है।"',
      text: 'Then the drums come out, and the gumrag is danced — lines of dancers, the beat going down through their heels into the ground, round and round in the open air. Rice is cooked wrapped in leaves, there is food in every house, and the whole village is in and out of everybody\'s door.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: '"और उन कुछ दिनों के लिए, कई परिवार अपने औज़ारों को पूरी तरह से रख देते हैं। न हल चलाना, न कटाई, न पेड़ों को काटना। धरती पूरे साल आपके लिए काम करने वाली है; अपने त्योहार पर, वही मुख्य मेहमान होती है।"',
      text: 'And for those few days, many families put the tools down entirely. No ploughing, no cutting, no felling. The earth is about to work for you all year; on her festival, she is the guest of honour.',
      ask: {
        q: 'Sowing is plain work — a seed, a hole, done. Why make a festival of it at all?',
        options: ['Farmers like parties', 'Because beginning is the heaviest part, and beginning together makes it light', 'So the birds are scared off the seed'],
        answer: 1,
        right: 'That is it. Anyone can keep going. It is starting — with the whole year unknown in front of you — that needs the drums.',
        wrong: 'The real reason is older and kinder: beginning is the heaviest part of any work, and beginning together makes it light. That is what the drums are for.'
      } },
    { art: ['courtier'], who: null,
      hi: '"बीज ज़मीन में चला गया। बारिश आएगी ही — ब्रह्मपुत्र पर तो वह हमेशा आती है, कभी-कभी तो कुछ ज़्यादा ही — और बाँस के खंभों वाले घर अपनी ही परछाईं के ऊपर खड़े रहेंगे, और पतझड़ आते-आते बसंत में बोई गई वह चुटकी भर धान पूरी फ़सल बन चुकी होगी।"',
      text: 'The seed goes in. The rains will come — on the Brahmaputra they always come, sometimes far too well — and the stilt houses will stand over their own reflections, and by autumn the pinch of rice given away in spring will have become the harvest.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"और जब फ़सल सचमुच घर आ जाती है, तो यह साल अपना घेरा अपने एक दूसरे त्योहार के साथ पूरा करता है — क्योंकि जो लोग बुवाई पर नाचते हैं, वे कटाई को तो यूँ ही चुपचाप बीतने नहीं देंगे। शुरुआत और अंत दोनों को ढोल की थाप मिलती है; बस बीच के दिनों को ही काम से गुज़ारा करना पड़ता है।"',
      text: 'And when the harvest does come in, the year closes the circle with a second festival of its own — because a people who dance the sowing are certainly not going to let the reaping pass quietly. Beginnings and endings both get drums; it is only the middle that has to make do with work.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर आप कभी किसी मिसिंग परिवार से मिलें, तो आली-आये-लिगांग के बारे में ज़रूर पूछना — और चांग घर के बारे में भी पूछना, क्योंकि जिस घर ने पहले ही बाढ़ से दोस्ती कर ली हो, वह एक बेहद सीधे-सादे रूप में छिपा बहुत ही बढ़िया विचार है।"',
      text: 'If you ever meet a Mising family, ask about Ali-Aye-Ligang — and ask about the chang ghar too, because a house that has already made friends with the flood is a very good idea wearing a very simple shape.' }
  ],
  moral: 'Begin together, begin with thanks, and the year knows where to go.',
  source: 'Ali-Aye-Ligang, the spring sowing festival of the Mising community of Assam, kin of the Tani peoples of Arunachal Pradesh. A living festival; the ways of keeping it differ from village to village.'
},

{
  id: 'fk.bwisagu',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'Bwisagu and the Butterfly Dance',
  hook: 'Same April, same rivers, different drums — the Bodo new year has a dance that copies a butterfly.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_bull'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['नया', 'naya', 'new'], ['तितली', 'titli', 'butterfly'], ['बाँसुरी', 'baansuri', 'flute']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"असम किसी एक ही समाज का नाम नहीं है, और अप्रैल का मध्य यह बात बड़े सुंदर ढंग से साबित करता है। जब असमिया गाँवों में बिहू गाया जा रहा होता है, तब बोडो लोग — ब्रह्मपुत्र के मैदानों के सबसे पुराने समुदायों में से एक, जिनकी अपनी भाषा और अपने करघे हैं — सूरज के ठीक उसी मोड़ पर बैसागु मना रहे होते हैं, जो उनका अपना नया साल है।"',
      text: 'Assam is not one people, and mid-April proves it beautifully. While Assamese villages are singing Bihu, the Bodo people — one of the oldest communities of the Brahmaputra plains, with their own language and their own looms — are keeping Bwisagu, their own new year, at exactly the same turn of the sun.' },
    { art: ['pt_bull', 'courtier'], who: null,
      hi: '"और बैसागु की शुरुआत भी मवेशियों से होती है — उन्हें नहलाया जाता है, लाड़-दुलार किया जाता है, शुक्रिया कहा जाता है, और एक दिन के लिए किसी फुर्सत पा चुके बुज़ुर्ग की तरह आज़ाद घूमने को छोड़ दिया जाता है। पूरी घाटी में, घर की बोली चाहे जो भी हो, नया साल मेहनत करने वाले जानवरों के साथ नेकी करके ही शुरू होता है। यह बात ध्यान देने लायक है। एक ही दिशा में समझदारी दिखाने के लिए पड़ोसियों का एक जैसा होना ज़रूरी नहीं है।"',
      text: 'And Bwisagu also begins with the cattle — washed, fussed over, thanked, set loose to wander like retired elders for a day. Across the whole valley, whatever the language of the house, the new year starts by being kind to the animals who work. That is worth noticing. Neighbours do not need to be the same to be wise in the same direction.' },
    { art: ['guard'], who: null,
      hi: '"फिर लोगों के अपने दिन आते हैं: नए कपड़े, बड़ों के पाँव छूते छोटों के हाथ, मेल-मुलाक़ातें, पकवान और माफ़ कर देना — पुराने झगड़ों को पुराने साल में ही छोड़ देना होता है, जो कहना आसान है और करना मुश्किल, और इसीलिए तो मदद के लिए यह त्योहार बना है।"',
      text: 'Then the people\'s days: new clothes, the young touching the feet of the old, visits and food and forgiveness — old quarrels are supposed to be left in the old year, which is easier said than done, which is why there is a festival to help.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और फिर वह संगीत, जिसे जिसने भी सुन लिया वह कभी नहीं भूलता: खाम—यानी लंबा ढोल; सिफुंग—बाँस की बाँसुरी, जिसकी धीमी और गहरी धुन ऐसी लगती है जैसे हवा ने खुद गाने की ठान ली हो; और सेरजा—कमानी से बजने वाला छोटा सा साज़। दोखोना—यानी मौसम जैसी ही सुनहरी और नारंगी रंग की बोडो बुनी पोशाक—पहने लड़कियाँ कतारों में खड़ी हो जाती हैं।"',
      text: 'And then the music, which nobody who has heard it forgets: the kham, the long drum; the sifung, the bamboo flute, low and breathy like wind deciding to sing; and the serja, the little bowed fiddle. Girls in the dokhona — the Bodo woven dress, gold and orange like the season itself — form up in lines.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"यह बागुरुम्बा नाच है, और लोग इसे तितली-नाच कहते हैं—फैली हुई बाहें, घूमती कलाइयाँ, और पूरी कतार ऐसे झुकती और थिरकती है जैसे कोई तितली तय न कर पा रही हो कि किन दो फूलों में से किस पर बैठे।"',
      text: 'The dance is the Bagurumba, and people call it the butterfly dance — arms wide, wrists turning, the whole line tilting and settling the way a butterfly does when it cannot decide between two flowers.',
      ask: {
        q: 'Of everything in the world, the dance copies a butterfly. Why copy something so small?',
        options: ['Butterflies are easy to copy', 'Because dancing something is a way of saying it matters', 'Because there were no bigger animals around'],
        answer: 1,
        right: 'Yes. A dance is attention you do with your whole body. What a people dances, it has decided to love.',
        wrong: 'Think of it this way: a dance is attention you do with your whole body. What a people dances, it has decided to love — including a butterfly.'
      } },
    { art: ['guard'], who: null,
      hi: '"बाथौ—यानी बोडो लोगों की अपनी पुरानी आस्था—को मानने वाले परिवारों के आँगनों में सिजौ का पेड़ खड़ा होता है, जिसे घर के लोग ही लगाते और सहेजते हैं, और नया साल उसका भी अभिनंदन करता है। अब दूसरे बोडो परिवार दूसरे धर्मों को भी मानते हैं, और ढोलों को इससे कोई फर्क नहीं पड़ता; बैसागु का मतलब है साल का बदलना, और साल तो हर किसी के लिए बदलता है।"',
      text: 'In the courtyards of families who keep Bathou — the Bodo\'s own old faith — stands the sijou tree, planted and tended by the house, and the new year greets it too. Other Bodo families keep other faiths now, and the drums do not mind; Bwisagu is the year turning, and the year turns for everyone.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: '"शाम होते-होते नाचने वालों की कतारें गोल घेरों में बदल जाती हैं, और सिफुंग एक बजाने वाले से दूसरे के हाथ में थमा दी जाती है ताकि किसी के थकने जैसी छोटी सी बात के लिए धुन कभी रुके नहीं। नए साल का स्वागत तब तक होना चाहिए जब तक स्वागत करने वालों के पैर डगमगाने न लगें; इस बात पर बोडो गाँव और दुनिया का हर दूसरा गाँव पूरी तरह सहमत है।"',
      text: 'By evening the lines of dancers have joined into rings, and the sifung is handed from player to player so the tune never has to stop for anything as small as a person getting tired. A new year should be welcomed until the welcomers wobble; on this the Bodo villages and every other village on earth agree.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"असमिया लोगों के लिए बिहू, तो बोडो लोगों के लिए बैसागु—और ज़रा रुकिए, जब आप सुनेंगे कि और पूरब की पहाड़ियों में अप्रैल को क्या कहते हैं। बसंत वही एक, नाम अनेक, और हर नाम किसी न किसी का घर है।"',
      text: 'Bihu for the Assamese, Bwisagu for the Bodos — and wait till you hear what April is called in the hills further east. Same spring, many names, and every name is somebody\'s home.' }
  ],
  moral: 'Neighbours do not need to be the same to be wise in the same direction.',
  source: 'Bwisagu, the springtime new year of the Bodo people of Assam, with the Bagurumba dance and the kham, sifung and serja. A living festival; ask a Bodo friend how their family keeps it.'
},

/* ============================================================ MEGHALAYA ==== */
{
  id: 'fk.sohpetbneng',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Navel of the Sky',
  hook: 'There was once a ladder between heaven and earth, and it stood on a hill you can still climb.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['सीढ़ी', 'seedhi', 'ladder'], ['आकाश', 'aakash', 'sky'], ['सात', 'saat', 'seven']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"मेघालय की खासी पहाड़ियों में एक पहाड़ी है जिसे \'उ लुम सोहपेतब्नेन्ग\' कहते हैं। इस नाम के एक-एक टुकड़े को वैसे ही समझिए जैसे कोई खासी नानी या दादी समझाएँगी: लुम यानी पहाड़ी, सोहपेत यानी नाभि, ब्नेन्ग यानी आसमान। वह पहाड़ी जो स्वर्ग की नाभि है—वह जगह जहाँ कभी आसमान और धरती आपस में जुड़े हुए थे, बिल्कुल वैसे जैसे कोई नन्हा बच्चा अपनी माँ से जुड़ा होता है।"',
      text: 'In the Khasi hills of Meghalaya there is a hill called U Lum Sohpetbneng. Take the name apart the way a Khasi grandmother would: lum is hill, sohpet is navel, bneng is the sky. The hill that is the navel of heaven — the place where the sky and the earth were once joined, like a baby to its mother.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'कहानियाँ कहती हैं कि शुरुआत में, ऊपर आसमान के देश में सोलह परिवार रहते थे। और लुम सोहपेटब्नेन्ग की चोटी से एक सोने की सीढ़ी ऊपर जाती थी — कुछ कहानियों में एक बहुत बड़ा पेड़ — और वे सोलह परिवार उस पर इतनी आसानी से आते-जाते थे, जैसे तुम रसोई और बरामदे के बीच आते-जाते हो।',
      text: 'In the beginning, the telling goes, sixteen families lived above, in the sky country. And from the top of Lum Sohpetbneng rose a golden ladder — some tellings say a great tree — and the sixteen families went up and down it as freely as you go between the kitchen and the veranda.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'यहाँ नीचे वह बगीचा था: नदियों का ध्यान रखना, जंगलों की रखवाली, ढलानों पर झूमती घास, और धरती की सारी हरी-भरी देखभाल। वे परिवार सुबह-सुबह इसकी देखभाल करने नीचे आते और रात को वापस आसमान में अपने घर चले जाते। धरती दिन का काम थी। स्वर्ग रात का खाना था।',
      text: 'Down here was the garden: rivers to mind, forests to keep, broom-grass bending on the slopes, and the whole green work of the earth. The families would come down in the morning to tend it and climb home to the sky at night. Earth was the day\'s work. Heaven was supper.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लेकिन जिस बगीचे में सिर्फ़ आने-जाने वाले आते हों, उसे कभी पूरा प्यार नहीं मिल पाता। और फिर वह दिन आया जब यह तय होना था: धरती को सच में कौन अपनाएगा — इस पर रहेगा, इसका होकर रहेगा, और इसे हमेशा के लिए सँभालेगा?',
      text: 'But a garden tended by visitors is never quite loved. And the day came when it had to be settled: who would truly take the earth — live on it, belong to it, keep it always?',
      ask: {
        q: 'Stay in the sky country, or come down for good and keep the garden. Which would you choose?',
        options: ['Stay in the sky — it is home', 'Come down and keep the earth', 'Keep going up and down forever'],
        answer: 1,
        right: 'Seven of the sixteen families chose exactly that. They came down to stay.',
        wrong: 'Seven of the sixteen families made the other choice — they came down, for good, to keep the earth.'
      } },
    { art: ['courtier'], who: null,
      hi: 'सात परिवार यहीं बसने के लिए नीचे उतर आए। खासी लोग उन्हें \'हिन्यु त्रेप\' — यानी सात झोपड़ियों — के रूप में याद करते हैं, और जब कोई खासी बुज़ुर्ग कहते हैं, "हम सात झोपड़ियों की संतान हैं," तो उनका मतलब इसी सुबह से होता है। नौ परिवार ऊपर ही रहे। सात परिवारों ने धरती को धरोहर की तरह संभाल लिया।',
      text: 'Seven families came down to stay. The Khasi remember them as the Hynñiew Trep — the Seven Huts — and when a Khasi elder says "we are the children of the Seven Huts," this is the morning they mean. Nine families stayed above. Seven took the earth in trust.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'और फिर वह सीढ़ी खो गई। यह कैसे हुआ, इस बारे में कहानियाँ अलग-अलग हैं, और बुज़ुर्ग आपको अपने ढंग से और अपनी फ़ुरसत में यह बात बताएंगे। पर हर कहानी जिस बात पर सहमत है, वह है इसका मतलब: धरती और स्वर्ग के बीच का आसान रास्ता बंद हो गया, और उन सात परिवारों ने अपने हाथों से धरती को सँभाला और अपनी यादों में आसमान को बसाए रखा।',
      text: 'And then the ladder was lost. The tellings differ about how, and elders will tell you in their own way and their own time. What every telling agrees on is what it meant: the easy road between earth and heaven closed, and the seven families kept the earth with their hands and the sky with their memory.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'फिर भी, वह पहाड़ी उनसे दूर नहीं हुई। हर साल, जब ठंड ढलने लगती है, लोग साथ मिलकर लुम सोहपेटब्नेन्ग पर चढ़ते हैं — चीड़ के पेड़ों के बीच से होते हुए चोटी तक, ठीक वहीं खड़े होने जहाँ कभी सीढ़ी हुआ करती थी। धरती को छोड़ने के लिए नहीं। बल्कि यह याद रखने के लिए कि वे बहुत ऊँचाई से आए थे, और धरती उनके लिए कोई निर्वासन नहीं, बल्कि उनकी अपनी पसंद थी।',
      text: 'They did not lose the hill, though. Every year, when winter loosens, people climb Lum Sohpetbneng together — up through the pines to the top, to stand where the ladder stood. Not to leave the earth. To remember that they came from higher up, and that the earth was not an exile but a choosing.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अपने परिवार की कहानी में यह बात होना कितनी अच्छी है: हम यहाँ फँसे नहीं हैं। हमने इस बगीचे को खुद चुना था। और साल में एक बार हम पहाड़ी पर चढ़ते हैं और अपने घर की तरफ हाथ हिलाते हैं।"',
      text: 'It is a rather wonderful thing to have in your family story: we are not stranded here. We chose the garden. And once a year we climb the hill and wave home.' }
  ],
  moral: 'You can lose the ladder and keep the sky. That is what remembering is for.',
  source: 'Khasi oral tradition — U Lum Sohpetbneng, the navel of heaven, and the Hynñiew Trep, the seven families who chose the earth. The hill stands near Shillong and is climbed in pilgrimage each year. Many tellings.'
},

{
  id: 'fk.diengiei',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Tree That Shaded the Whole World',
  hook: 'They cut it all day, every day. Every morning the cut had healed. Somebody was mending it in the dark.',
  hero: 'courtier',
  cast: ['courtier', 'pt_lion', 'pt_crow'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['कुल्हाड़ी', 'kulhaadi', 'axe'], ['रोशनी', 'roshni', 'light'], ['बाघ', 'baagh', 'tiger']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"खासी कथा कहती है कि जब सातों परिवारों ने धरती पर बसेरा कर लिया, तब पश्चिम में एक पेड़ उगने लगा। उसे उ दिएंगिएई कहते थे। वह बढ़ता ही रहा। उसकी टहनियाँ फैलती ही गईं जब तक कि उसकी छाया पूरी दुनिया पर नहीं छा गई, और उस साए तले रोशनी ऐसे बुझने लगी जैसे दिए का तेल खत्म हो रहा हो।"',
      text: 'After the seven families had settled the earth, the Khasi telling says, a tree began to grow in the west. U Diengiei, it was called. It did not stop growing. Its crown spread and spread until its shadow lay over the whole world, and under that shadow the light died away like a lamp running out.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"अँधेरे में धान पक ही नहीं रहा था। बच्चे कुकुरमुत्तों जैसे पीले पड़ने लगे। वह कोई गुस्से वाला पेड़ नहीं था — वह तो बस एक पेड़ था, जो बहुत ही विशाल था — मगर उसके नीचे की दुनिया धीरे-धीरे बुझती जा रही थी।"',
      text: 'The rice would not ripen in the dark. The children went pale as mushrooms. It was not an angry tree — it was just a tree, being enormous — but the world underneath it was slowly going out.' },
    { art: ['courtier'], who: null,
      hi: '"तो लोगों ने सलाह-मशविरा किया, उसी तरह जैसे खासी लोग करते हैं — सबने सबकी सुनी, कोई चिल्लाया नहीं — और सब मान गए: दिएंगिएई को गिराना ही होगा। वे अपनी कुल्हाड़ियाँ लेकर पश्चिम की ओर गए, और सुबह से शाम तक उसे काटते रहे। रात होने तक घाव गहरा हो चुका था और वे थके-हारे मगर संतुष्ट होकर घर लौटे।"',
      text: 'So the people took counsel, the way Khasis take counsel — everybody heard, nobody shouted — and it was agreed: Diengiei must come down. They took their axes to the west, and they cut from morning to dusk, and by nightfall the cut was deep and they went home sore and satisfied.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"सुबह जब वे लौटे, तो पेड़ की छाल बिल्कुल चिकनी थी। कोई कट नहीं। एक निशान तक नहीं। उन्होंने फिर पूरे दिन कुल्हाड़ी चलाई — और अगली सुबह वह घाव फिर भर गया। दिन पर दिन यही चलता रहा। कुल्हाड़ियाँ तो झूठ नहीं बोलतीं, और पेड़ रातों-रात खुद-ब-खुद ठीक नहीं हो जाते।"',
      text: 'At dawn they came back to smooth bark. No cut. Not a mark. They cut again all day — and again the morning healed it. Day after day. Axes do not lie, and trees do not mend themselves overnight.',
      ask: {
        q: 'Every day\'s cutting is undone by morning. What is really going on?',
        options: ['The tree is magic and cannot be cut', 'Somebody is mending the cut in the night', 'Their axes are too dull'],
        answer: 1,
        right: 'That was the guess worth checking. And a very small bird knew exactly who it was.',
        wrong: 'A very small bird knew the truth: somebody was mending the cut in the night. The question was who.'
      } },
    { art: ['pt_crow'], who: 'pt_crow',
      hi: '"एक छोटी सी चिड़िया — जंगल की सबसे छोटी चिड़ियों में से एक, ऐसी जिससे कोई कुछ नहीं पूछता — फुदकती हुई आगे आई और बोली: \\"तुम्हें पता है, मैं रात का हाल देखती हूँ। तुम्हारे जाते ही बाघ उ ख्ला आता है। उसे यह घना अँधेरा बहुत भाता है, क्योंकि इस साए के नीचे का पूरा जंगल उसी का है। और वह अपनी खुरदरी जीभ से उस घाव को तब तक चाटता है जब तक कि वह भर न जाए।\\""',
      text: 'A little bird — one of the smallest in the forest, the kind nobody asks — hopped up and said: "I see the nights, you know. U Khla the tiger comes when you leave. He loves the great darkness, for the forest under this shadow is all his. And he licks the cut with his rough tongue until it closes."' },
    { art: ['pt_crow', 'courtier'], who: 'pt_crow',
      hi: 'चिड़िया बोली, "तो फिर ऐसा करो। आज रात, जब तुम काम रोको, तो अपनी कुल्हाड़ियाँ घर मत ले जाना। उन्हें चीरे में ही सीधा खड़ा छोड़ देना — धार बाहर की तरफ़ करके।"',
      text: '"So do this," said the bird. "Tonight, when you stop, do not carry your blades home. Leave them standing in the cut — edges outward."' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      hi: 'उस रात बाघ हमेशा की तरह पेड़ का घाव भरने के लिए अंधेरे में दबे पाँव आया — और कटी हुई मुलायम लकड़ी की जगह उसकी जीभ ठंडी, तेज़ धार से टकराई। अपनी मूँछों पर चोट खाए वह झटके से पीछे हटा, तय किया कि यह पेड़ अपनी देखभाल खुद कर सकता है, और अपनी खूबसूरत, गुस्सैल पूँछ फटकारता हुआ कहीं और चला गया।',
      text: 'That night the tiger came padding through the dark to mend the wound as usual — and his tongue met cold, sharp edges instead of soft cut wood. He pulled back with his whiskers offended, decided this tree could look after itself, and took his beautiful angry tail elsewhere.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'अगले दिन की कटाई पुराने घाव के गहरे अंदर तक उतर गई, और उसके अगले दिन डिएंगिए ऐसे गिरा जैसे कोई पहाड़ी ही उलट कर लेट गई हो। और रोशनी लौट आई — धान के खेतों पर, नदियों पर, हर चीज़ पर, जैसे पूरी दुनिया ने अपनी रोकी हुई साँस एक साथ छोड़ दी हो।',
      text: 'The next day\'s cutting went deep into old work, and the day after that Diengiei came down like a hillside lying over. And the light came back — over the paddy, over the rivers, over everything, the whole held breath of the world let out at once.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'शिलांग के पश्चिम में लुम डिएंगिए नाम की एक ऊँची पहाड़ी है, और लोग आपको बताएंगे कि यह वही ठूँठ है। किसी साफ़ दिन उस पर खड़े हों, तो आपको चारों तरफ़ बेहिसाब रोशनी दिखाई देगी। और अगर यह कहानी सच है, तो आपको ठीक यही दिखना भी चाहिए।',
      text: 'West of Shillong there is a high hill called Lum Diengiei, and people will tell you it is the stump. Stand on it on a clear day and you can see an enormous amount of light. Which, if the story is right, is exactly what you are supposed to see.' }
  ],
  moral: 'When your day\'s work keeps coming undone overnight, find out who is licking the cut.',
  source: 'Khasi oral tradition — U Diengiei, the tree that shaded the world, the tiger who healed it by night and the small bird who gave the counsel; Lum Diengiei peak west of Shillong is pointed to as the stump. Many tellings.'
},

{
  id: 'fk.klew-peacock',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Why the Peacock\'s Tail Is Full of Eyes',
  hook: 'He lived in the sky and was loved there. He went down to earth for one look — and the eyes on his tail are what happened next.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['मोर', 'mor', 'peacock'], ['सूरज', 'sooraj', 'sun'], ['पंख', 'pankh', 'feather']],
  scenes: [
    { art: ['pt_crow'], who: null,
      hi: 'खासी कहानियों में, सूरज \'का स्नगी\' हैं — \'का\' इसलिए, क्योंकि वह स्त्री हैं; खासी भाषा में हर नाम के आगे पुरुष के लिए \'उ\' या स्त्री के लिए \'का\' लगता है, ताकि आपको हमेशा पता रहे कि बात किसकी हो रही है। और बहुत पुराने ज़माने में, उ क्लेव नाम का मोर ऊपर आसमान के देश में रहता था, और सूरज की अपनी बेटी उससे प्यार करती थी, और वह वहाँ खुश था। ज़्यादातर।',
      text: 'In the Khasi telling, the sun is Ka Sngi — Ka, because she is a she; in Khasi, every name carries a U for a he or a Ka for a she, so you always know who you are talking about. And in the long-ago, U Klew the peacock lived up in the sky country, and the sun\'s own daughter loved him, and he was happy there. Mostly.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'आसमान में रहने की सबसे बड़ी परेशानी वहाँ का नज़ारा है। बहुत नीचे, उ क्लेव को धरती दिखाई देती थी — गिरे हुए आईनों की तरह चमकते पानी से भरे धान के खेत, तालाब और हरियाली। और उस तक एक फुसफुसाहट पहुँची, जिस तरह बेचैन दिलों तक फुसफुसाहटें पहुँचती हैं, कि नीचे की ज़िंदगी ऊपर की किसी भी चीज़ से कहीं ज़्यादा शानदार है।',
      text: 'The trouble with living in the sky is the view. Far below, U Klew could see the earth — the flooded paddy fields flashing like dropped mirrors, the ponds, the green. And a whisper reached him, the way whispers reach the restless, that life down there was finer than anything above.' },
    { art: ['pt_crow', 'courtier'], who: 'pt_crow',
      hi: '"बस एक नज़र," उसने सूरज की बेटी से कहा। "बस एक नज़र देख लूँ और मैं सीधे घर लौट आऊँगा।" उसने कोई बहस नहीं की। जो लोग आपसे प्यार करते हैं, वे आपकी \'बस एक नज़र\' वाली बात पर भला कहाँ बहस करते हैं। वह आसमान के छोर पर खड़ी रही और उसे किसी गिरे हुए रत्न की तरह नीचे जाते देखती रही।',
      text: '"One look," he told the sun\'s daughter. "One look and I will come straight home." She did not argue. People who love you rarely argue with your one looks. She stood at the edge of the sky and watched him go down like a dropped jewel.' },
    { art: ['pt_crow'], who: null,
      hi: 'और धरती बेहद प्यारी थी — यही तो इसका फंदा था। धान के खेत गुनगुने थे, दाना आसानी से मिल जाता था, और हर शांत तालाब में एक सुंदर मोर साफ़ तौर पर उसकी तारीफ़ करता हुआ ऊपर देख रहा था। वह एक दिन रुका। फिर एक मौसम। फिर उसने दिन गिनना ही छोड़ दिया, क्योंकि गिनना अब किसी इल्ज़ाम की तरह लगने लगा था।',
      text: 'And the earth was lovely — that is the trap of it. The paddy was warm, the grain was easy, and in every still pond there was a handsome peacock looking up at him with obvious admiration. He stayed a day. Then a season. Then he stopped counting, because counting had begun to feel like an accusation.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'ऊपर, सूरज की बेटी हर सुबह हवा के रास्ते पर आँखें गड़ाए रहती। वह नहीं आया। लौटने के लिए बहुत दूर निकल जाना, और देर से बेहाल होकर घर लौटते हुए देखे जाने का घमंड — यह एक ऐसी गाँठ है जो कई दिलों ने बाँधी है, और मोर का दिल भी कोई अलग नहीं है।',
      text: 'Up above, the sun\'s daughter watched the road of air every dawn. He did not come. Too far gone to return, too proud to be seen climbing home shabby and late — that is a knot many hearts have tied, and a peacock\'s heart is no different.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'तो उसने वही किया जिसके लिए यह कहानी याद की जाती है। वह उसे वापस ला नहीं सकती थी। वह उसे डाँटना भी नहीं चाहती थी। उसके पास बस एक ही चीज़ थी जो अब भी इतनी नीचे तक पहुँच सकती थी — उसकी रोशनी।',
      text: 'So she did the thing this story is remembered for. She could not fetch him. She would not scold him. She had one thing that could still reach all the way down — her light.',
      ask: {
        q: 'She cannot fetch him and will not scold him. What does she send instead?',
        options: ['A storm to drive him home', 'Her light, to fall on him where he is', 'Another bird with a message'],
        answer: 1,
        right: 'Her light. And where it touched his tail feathers, it stayed.',
        wrong: 'She sent the gentlest thing she had — her light, falling all the way down onto him where he was. And where it touched his tail, it stayed.'
      } },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'सुबह की धूप के साथ वह नीचे उतरी, और जहाँ-जहाँ वह उसकी पूँछ के लंबे पंखों पर पड़ी, वहीं टिककर रह गई: सुनहरे, हरे और नीले रंग के सौ छोटे गोल निशान। लोग उन्हें आँखें कहते हैं। आसमान के प्यार की सौ नन्ही तस्वीरें, जो उसके साथ ऐसे जड़ दी गईं कि वह उन्हें कभी खो नहीं सकता था और कभी पूरी तरह देख भी नहीं सकता था।',
      text: 'Down through the morning it came, and where it fell on his trailing tail feathers it settled and stayed: a hundred small round marks of gold and green and blue. Eyes, people call them. A hundred little pictures of the sky\'s love, pinned to him where he could never lose them and never quite see them.' },
    { art: ['pt_crow'], who: null,
      hi: 'और खासी बुज़ुर्ग कहते हैं कि यही वजह है कि मोर भोर के वक्त ऐसा करता है। वह पूरब की ओर मुड़ता है, जहाँ से सूरज निकलता है, और अपने पंखों का पूरा घेरा फैलाकर थरथराते हुए थामे रखता है — हर सुबह उसे यह दिखाते हुए, कि उसने वे निशान अब भी पहन रखे हैं।',
      text: 'And that, the Khasi elders say, is why the peacock does what he does at dawn. He turns to the east, where the sun comes up, and spreads the whole fan wide and holds it trembling — showing her, every single morning, that he still wears them.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'यह कोई डाँटने-डपटने वाली कहानी नहीं है, देखा आपने। किसी को कोई सज़ा नहीं मिली। वह भटक गया था, फिर भी उसने उससे प्यार किया, और इसका सबूत उसकी पूँछ पर है। खासी की पहाड़ियाँ भीगी और सौम्य हैं, और उनकी बहुत-सी कहानियाँ भी ऐसी ही हैं।',
      text: 'It is not a scolding story, you notice. Nobody is punished. He wandered, she loved him anyway, and the proof is on his tail. The Khasi hills are wet and gentle, and so are many of their tales.' }
  ],
  moral: 'Wander if you must. The ones who love you will pin their light to your feathers, and it will show.',
  source: 'Khasi oral tradition — U Klew the peacock and the daughter of Ka Sngi the sun; versions appear in early collections of Khasi folk tales. The tellings differ; this is one shape of it.'
},

{
  id: 'fk.ksew-market',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Why the Dog Sniffs Everybody',
  hook: 'Once the dog kept a market stall like all the other animals. What they did to his stall is why he lives with you now.',
  hero: 'pt_jackal',
  cast: ['pt_jackal', 'pt_lion', 'pt_bull', 'courtier'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['बाज़ार', 'bazaar', 'market'], ['दोस्त', 'dost', 'friend'], ['सूँघना', 'soonghna', 'to sniff'],],
  scenes: [
    { art: ['pt_lion', 'pt_bull'], who: null,
      hi: 'कहते हैं, बहुत पुरानी बात है, खासी की पहाड़ियों में जानवरों ने एक बड़ा \'ईव\' लगाया — यानी बाज़ार, क्योंकि बाज़ार के दिन ही इन पहाड़ियों की धड़कन होते हैं — और हर जानवर ने अपनी दुकान लगाई। हिरण ने हरी सब्ज़ियाँ बेचीं। बंदर ने फल बेचे। हर किसी ने कुछ न कुछ बेचा, और हर कोई वहाँ आया।',
      text: 'Long ago in the Khasi hills, the telling goes, the animals held a great iew — a market, for market days are the heartbeat of these hills — and every animal kept a stall. The deer sold greens. The monkey sold fruit. Everyone sold something, and everyone came.' },
    { art: ['pt_jackal'], who: null,
      hi: 'उ क्स्यू कुत्ता भी आया, वही एक चीज़ लेकर जो उसने खुद बनाई थी: खमीरे अचार का एक मर्तबान, गाढ़ा और तीखा — ऐसी महक जिससे या तो आप दिल से प्यार करने लगें, या फिर अपनी पूरी जान लगाकर भाग खड़े हों। उसने कतार के आखिर में उसे बड़े गर्व से रख दिया।',
      text: 'U Ksew the dog came too, with the one thing he had made himself: a jar of fermented pickle, dark and strong — the sort of smell you either love with your whole heart or run from with your whole legs. He set it down proudly at the end of the row.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion', mood: 'sad',
      hi: 'बड़े जानवर कतार से गुज़रते हुए उसकी दुकान तक पहुँचे और मुँह बनाने लगे। "यह क्या है?" हँसी तब अच्छी लगती है जब वह आपके साथ हो। यह उस तरह की हँसी नहीं थी। और धक्का-मुक्की व खिल्ली उड़ाने के बीच, किसी ने मर्तबान को लात मार दी, वह पत्थरों पर गिरकर फूट गया, और पूरा बाज़ार और भी ज़ोर से हँस पड़ा।',
      text: 'The big animals came down the row and reached his stall and made faces. "What is THAT?" Laughter is fine when it is with you. This was the other kind. And in the jostling and the mocking, somebody kicked the jar over, and it broke on the stones, and the whole market laughed harder.' },
    { art: ['pt_jackal', 'pt_bull'], who: 'pt_jackal',
      hi: 'कुत्ता इंसाफ़ माँगने बाज़ार के बुज़ुर्गों के पास गया। उन्होंने कंधे उचका दिए। "बस कुत्ते का ही तो मर्तबान है।" बस। इस एक शब्द ने उस लात से भी ज़्यादा चोट पहुँचाई।',
      text: 'The dog went to the elders of the market for justice. They shrugged. "It is only the dog\'s jar." Only. That word did more damage than the kick had.',
      ask: {
        q: 'His stall is ruined, the crowd is laughing, and the elders shrug. What should U Ksew do?',
        options: ['Laugh along and pretend it was nothing', 'Fight the biggest one who laughed', 'Leave, and go where he is treated like somebody'],
        answer: 2,
        right: 'That is what he did. He walked out of the animals\' market for good — and toward a lit doorway.',
        wrong: 'He did neither. He picked himself up and walked out of the animals\' market for good — toward a lit doorway.'
      } },
    { art: ['pt_jackal', 'courtier'], who: null,
      hi: 'वह अँधेरा होने तक चलता रहा और इंसानों की बस्ती में आ पहुँचा, और सहमे कानों के साथ अलाव की रोशनी के किनारे खड़ा हो गया। एक आदमी ने अपने खाने से सिर उठाया, उसे ठीक से देखा — दिन भर में वही पहला जीव था जिसने उसे सचमुच देखा था — और थोड़ा खिसक कर जगह बनाई। "बैठो। काफ़ी है।"',
      text: 'He walked until dark and came to the houses of people, and stood at the edge of the firelight with his ears uncertain. A man looked up from his supper, looked at him properly — the first creature all day to look at him properly — and moved over. "Sit. There is enough."' },
    { art: ['courtier', 'pt_jackal'], who: null, mood: 'wow',
      hi: 'और बस, हमेशा-हमेशा के लिए यही तय हो गया। कुत्ता वहीं रह गया। उसे चूल्हे की गरमाहट मिली, बचा-खुचा खाना मिला, रखवाली के लिए बच्चे मिले, और मिला एक नाम, जो खेत के उस पार से प्यार से पुकारा जाता। जानवरों का बाज़ार तो बचा रहा, पर उन्होंने वह सबसे वफ़ादार दिल खो दिया जो कभी वहाँ खड़ा हुआ था।',
      text: 'And that was that, for all time. The dog stayed. He got the fireside, the leftovers, the children to guard, a name called warmly across a field. The animals kept their market, and lost the most loyal heart that had ever stood in it.' },
    { art: ['pt_jackal'], who: null, mood: 'think',
      hi: 'मगर कहानी का वह अंत, जिसका इंतज़ार खासी बच्चे करते हैं, वह यह है। जब मर्तबान टूटा, तो अचार छलक पड़ा — हँसने के लिए भीड़ लगाकर खड़े हर जानवर के पैरों पर। और गंध न तो झूठ बोलती है और न ही मिटती है, कम से कम उसकी जैसी नाक के लिए तो बिल्कुल नहीं।',
      text: 'But here is the ending Khasi children wait for. When the jar broke, the pickle splashed — onto the feet of every animal who had crowded in to laugh. And smells do not lie and do not fade, not to a nose like his.' },
    { art: ['pt_jackal'], who: 'mithu',
      hi: 'इसलिए आज भी कुत्ता पास से गुज़रने वाले हर जीव को सूँघता है, और हर रास्ते पर पड़े हर पदचिह्न को — इतने बरसों बाद भी, उन्हीं पैरों की तलाश में जिन्होंने उसका मर्तबान तोड़ा था। और जब उसे कोई ऐसी गंध मिलती है जो उसे पसंद नहीं आती, तो तुम उसे ऐसा कहते सुनोगे। तुमने उसे ऐसा कहते सुना भी है। अब तुम जानते हो कि वह क्या कह रहा है: "वो तुम थे!"',
      text: 'So to this day the dog sniffs at every creature that passes, and every footprint on every path — still checking, after all these years, for the feet that broke his jar. And when he finds a smell he does not like, you will hear him say so. You have heard him say so. Now you know what he is saying: "It was YOU."' }
  ],
  moral: 'If the crowd laughs at what you made, take yourself where you will be welcomed — and let the crowd wonder where the loyalty went.',
  source: 'Khasi oral tradition — how U Ksew the dog left the animals\' market and came to live with people; a version is collected in K. U. Rafy\'s Folk-Tales of the Khasis. Many tellings.'
},

{
  id: 'fk.root-bridges',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Bridge That Is Alive',
  hook: 'Wood rots here in a season and iron rusts in two. So they build their bridges out of something that heals.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['जड़', 'jad', 'root'], ['पुल', 'pul', 'bridge'], ['सब्र', 'sabr', 'patience']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'सोहरा के आस-पास मेघालय की दक्षिणी ढलानें, धरती पर इंसानों के बसने वाली सबसे ज़्यादा बारिश वाली जगह हैं। वहाँ वैसी बारिश नहीं होती जैसी वहाँ होती है जहाँ तुम रहते हो। नदियाँ ऐसे उफ़नती हैं जैसे कोई जाग उठा हो, और वे किसी पुल को ऐसे बहा ले जा सकती हैं जैसे तुम कोई बिस्कुट उठा लेते हो।',
      text: 'The southern slopes of Meghalaya, around Sohra, are the rainiest inhabited place on earth. It does not rain there the way it rains where you live. The rivers rise like something waking up, and they can take a bridge the way you take a biscuit.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'जो कि एक बड़ी समस्या है, क्योंकि वार खासी और वार जयंतिया लोगों के गाँव उन गहरी घाटियों में बसे हैं, जहाँ बच्चे नदी पार करके स्कूल जाते हैं और किसान नदी पार करके बाज़ार। बाँस बह जाता है। लकड़ी एक ही मौसम में सड़ जाती है। लोहा जंग लगकर खुद ही खत्म हो जाता है। जिससे भी पुल बनाया जा सकता है, यह मौसम उस हर चीज़ को नष्ट कर देता है।',
      text: 'Which is a problem, because the villages of the War Khasi and War Jaintia people sit deep in those gorges, and children cross rivers to school and farmers cross rivers to market. Bamboo washes away. Timber rots in a season. Iron rusts and eats itself. Everything you can build a bridge from, this weather destroys.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'हर उस चीज़ को जिससे कुछ बनाया जा सके। इसलिए वे पुल बनाने के बजाय उन्हें उगाते हैं। नदी किनारे रबर-अंजीर का एक पेड़ लगाया जाता है — एक ऐसा पेड़ जो अपनी डालियों से लंबी, सब्र भरी जड़ें नीचे उतारता है। और गाँव उन जड़ों को सिखाने-सँवारने लगता है: सुपारी के खोखले तनों से सहेजकर निकाली जाती हैं, हर साल नदी के पार थोड़ी और आगे बढ़ाई जाती हैं, बाँधी जाती हैं, बुनी जाती हैं, और आपस में एक-दूसरे में लपेटी जाती हैं।',
      text: 'Everything you can build from. So they grow them instead. A rubber-fig tree is planted by the bank — a tree that throws down long, patient roots from its branches. And the village begins to train those roots: coaxed through hollowed-out betel palm trunks, guided across the river a little further each year, tied, woven, wound back into each other.',
      ask: {
        q: 'Wood rots, bamboo washes away, iron rusts. What do you build a bridge from here?',
        options: ['Stone, cut from the gorge', 'A living tree, trained across the river', 'You do not — you go around'],
        answer: 1,
        right: 'A living bridge. Because a living thing does not rot — it heals.',
        wrong: 'The answer had to be alive. A living tree, trained across the river — because a living thing does not rot, it heals.'
      } },
    { art: ['courtier'], who: null,
      hi: 'वे इसे जिंगकिएंग ज्री कहते हैं — यानी जड़ों से बना एक ज़िंदा पुल। और इसके लिए क्या कीमत चुकानी पड़ती है: पंद्रह साल, बीस साल, कभी-कभी उससे भी ज़्यादा, तब जाकर जड़ें इतनी मोटी होती हैं कि किसी इंसान का बोझ संभाल सकें। जो यह पेड़ लगाता है, हो सकता है वह कभी इस पुल से होकर न गुज़रे।',
      text: 'They call it a jingkieng jri — a living root bridge. And here is the price of it: fifteen years, twenty, sometimes more, before the roots are thick enough to carry a person. The one who plants the tree may never cross on it.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'एक दादी एक बच्चे के साथ खड़ी हैं, और एक नई जड़ को पुल के ताने-बाने में लपेट रही हैं। "तो फिर यह किसका पुल है?" बच्चा पूछता है। "तुम्हारा," वे कहती हैं। "और तुम इसे किसी ऐसे इंसान के लिए सँवार रहे हो जो अभी पैदा भी नहीं हुआ है। इसमें कुछ भी अजीब नहीं है। अगर सच में समझा जाए, तो पुल का असली मतलब यही होता है।"',
      text: 'A grandmother stands with a child, winding a young root onto the weave. "Whose bridge is this, then?" the child asks. "Yours," she says. "And you are working on it for someone who is not born yet. That is not strange. That is just what a bridge is, taken seriously."' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और एक बार जब यह बोझ सँभालने लायक हो जाता है, तो फिर कभी नहीं रुकता। जड़ों का पुल हर साल और मज़बूत होता जाता है — जिस भी बाढ़ का यह सामना करता है, इसकी पकड़ उतनी ही मज़बूत होती जाती है; हर मौसम के साथ यह और मोटा होता जाता है। उन घाटियों में नीचे ऐसे पुल हैं जो अनगिनत पीढ़ियों से लोगों का भार उठाते आ रहे हैं, और आज भी बढ़ रहे हैं। नोंगरियात में एक मशहूर दो मंजिला पुल है, एक के ऊपर एक, जैसे किसी घर ने पुल बनने की ठान ली हो।',
      text: 'And once it carries, it never stops. A root bridge gets stronger every year — every flood it survives, it grips harder; every season, it thickens. There are bridges down in those gorges that have carried people for generations beyond counting, still growing. At Nongriat there is a famous one with two decks, one above the other, like a house that decided to be a bridge.' },
    { art: ['courtier'], who: null,
      hi: 'जड़ों से बने किसी पुल पर इंजीनियर का नाम नहीं होता। उस पर पूरे गाँव की कई पीढ़ियों की छाप होती है — हर पीढ़ी नई जड़ों को बाँधती है, छाँटती है, मरम्मत करती है और आगे सौंप देती है। यह दुनिया की सबसे धैर्य से रची जाने वाली वास्तुकला है, और आज भी, बारिश में इसे वे लोग गढ़ रहे हैं जो बखूबी जानते हैं कि अच्छी चीज़ों के बनने में कितना वक्त लगता है।',
      text: 'No engineer signs a root bridge. A village does, over lifetimes — each generation tying in new roots, trimming, mending, handing it on. It is the patientest architecture on earth, and it is being practised right now, in the rain, by people who know exactly how long good things take.' },
    { art: ['guard'], who: 'mithu',
      hi: 'किसी ने आज कुछ ऐसा रोपा है जो पचास साल बाद किसी का सहारा बनेगा। मेघालय में यह बात बिल्कुल सीधे तौर पर सच है। और अगर तुम भी अपना पेड़ चुन लो, तो किसी न किसी रूप में यह तुम्हारे लिए भी सच हो सकती है।',
      text: 'Somebody planted something today that will carry somebody in fifty years. That is true in Meghalaya in the plainest possible way. It could be true of you in some other way, if you pick your tree.' }
  ],
  moral: 'Plant things your grandchildren will walk on.',
  source: 'The living root bridges — jingkieng jri — of the War Khasi and War Jaintia villages of southern Meghalaya. A real and living craft; the double-decker bridge at Nongriat still carries people today.'
},

{
  id: 'fk.wangala',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'A Hundred Drums Say Thank You',
  hook: 'Nobody in the Garo hills tastes the new rice until the thank-you has been said. The thank-you takes a hundred drums.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['ढोल', 'dhol', 'drum'], ['फ़सल', 'fasal', 'harvest'], ['धन्यवाद', 'dhanyavaad', 'thanks']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'मेघालय का पश्चिमी हिस्सा गारो लोगों का है — जो खुद को आचिक कहते हैं, यानी पहाड़ों के लोग। उनके पहाड़ सही मायने में उनकी माताओं के हैं: एक गारो बच्चे को अपनी माँ का वंश-नाम मिलता है, और परिवार का सिलसिला माँ से बेटी की ओर बढ़ता है, ठीक वैसे ही जैसे पूर्व में खासी लोगों के यहाँ होता है।',
      text: 'The western half of Meghalaya belongs to the Garo people — who call themselves A·chik, the people of the hills. Their hills are their mothers\' in the plainest sense: a Garo child takes the mother\'s clan, and the family line runs from mother to daughter, as it does among the Khasi to the east.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'साल भर पहाड़ी खेतों में मेहनत की जाती है, और पतझड़ खत्म होते-होते आखिरकार फ़सल घर आ जाती है — टोकरियों में अनाज भर जाता है, और तंगी के महीनों को एक बार फिर मात मिल जाती है। और अब एक ऐसा नियम आता है जो खुद खेतों जितना ही पुराना है: नई फ़सल में से कोई भी तब तक खुलकर नहीं खाता, जब तक उसे देने वाले का धन्यवाद न कर दिया जाए।',
      text: 'All year the hill fields are worked, and by late autumn the harvest is finally in — grain in the baskets, the lean months beaten one more time. And now comes a rule as old as the fields: nobody eats freely of the new crop until thanks have been given to the one who gave it.' },
    { art: ['courtier'], who: null,
      hi: 'यह धन्यवाद मिसी सालजोंग के लिए होता है, वे महान दाता, जो मौसम और बीज देते हैं। गाँव के मुखिया — यानी नोकमा — अपने घर में पहली भेंट चढ़वाते हैं: पहले फल, पहला अनाज, खुद कुछ भी लेने से पहले उन्हें वापस लौटाना। यह क्रम बहुत मायने रखता है। पहले भेंट, फिर दावत। उल्टा कभी नहीं।',
      text: 'The thanks go to Misi Saljong, the great giver, who lends the seasons and the seed. The headman — the nokma — sees the first offerings made in his house: first fruits, first grain, given back before anything is taken. The order matters. Gift, then feast. Never the other way.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और फिर वांगला शुरू होता है, और वांगला कोई शांत त्योहार नहीं है। लोग इसे सौ ढोलों का त्योहार कहते हैं, और वे कोई बढ़ा-चढ़ाकर नहीं कह रहे — दामा, यानी लंबे अंडाकार ढोल, दर्जनों और सैकड़ों की तादाद में बाहर निकल आते हैं, और पुरुष कतारों में खड़े होकर ढोल बजाते हैं, और आवाज़ पहाड़ियों से टकराकर ऐसे गूँजती है मानो पहाड़ खुद जवाब दे रहे हों।',
      text: 'And then Wangala begins, and Wangala is not quiet. They call it the festival of a hundred drums, and they are not exaggerating — the dama, the long oval drums, come out by the dozen and the dozen dozen, and the men drum standing in lines, and the sound rolls off the hills like the hills answering back.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'नाचने वाले पंखों वाली पगड़ियाँ पहनते हैं जो घास की तरह हिलती हैं, और कतारें एक साथ आगे बढ़ती हैं — कदम, झुकाव, मोड़ — बच्चे और बड़े, कतारों में पूरा गाँव, जहाँ ढोल की गड़गड़ाहट के ऊपर बाँसुरी और झाँझ की धुन गूँजती है। यह कई दिनों तक चलता है। धन्यवाद, अगर सही तरीके से किया जाए, तो उसमें थोड़ा वक्त लगता ही है।',
      text: 'The dancers wear feathered turbans that nod like grass, and the lines move together — step, dip, turn — young and old, the whole village in rows, with the flutes and gongs riding on top of the drum-thunder. It goes on for days. Thanks, done properly, takes a while.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'अपने पहले वांगला में एक बच्ची ने वही सवाल पूछा जो बच्चे हमेशा पूछते हैं: चावल तो हमारा है — हमने खेत साफ़ किया, हमने घास-फूस निकाली, हमने इसे काटा। तो इसका पहला हिस्सा भेंट के रूप में क्यों जाता है?',
      text: 'A child at her first Wangala asked the question children always ask: the rice is ours — we cleared the field, we weeded it, we cut it. Why does the first of it go away as a gift?',
      ask: {
        q: 'You did the work. Why does the giver get the first share?',
        options: ['In case the giver gets angry', 'Because the field, the rain and the seed were lent to you before you ever lifted a finger', 'To make the rice taste better'],
        answer: 1,
        right: 'That is the heart of it. Your work was real — and it was done inside a gift. The first share says you noticed.',
        wrong: 'The elders\' answer is bigger than fear: the field, the rain and the seed were lent to you before you lifted a finger. The first share says you noticed.'
      } },
    { art: ['courtier'], who: null,
      hi: 'आजकल हर साल नवंबर में गारो पहाड़ियों में एक बड़ा जमावड़ा होता है जहाँ कई गाँवों के ढोलियों की कतारें मिलती हैं — सचमुच एक ही जगह पर सौ ढोल, जो पूर्वोत्तर के सबसे शानदार नज़ारों और आवाज़ों में से एक है। लोग इसके लिए दूर-दूर से आते हैं, ढोलों के बिल्कुल करीब खड़े होते हैं, और उन्हें ज़रा भी पछतावा नहीं होता।',
      text: 'These days there is a great gathering in the Garo hills each November where lines of drummers from many villages meet — a hundred drums genuinely all in one place, one of the great sights and sounds of the Northeast. People travel a long way for it, and stand very close to the drums, and regret nothing.' },
    { art: ['guard'], who: 'mithu',
      hi: 'इस ऐप की हर परंपरा में पहला हिस्सा वापस लौटाने का कोई न कोई तरीका ज़रूर मिलता है — आपने अरुणाचल में अबो तानी की पहली मुट्ठी वाली कहानी में यह सुना ही है, और यहाँ वही रीत फिर से पंख सजाए और ढोल थामे नज़र आ रही है। जब इतने सारे अलग-अलग लोग किसी बात पर सहमत हों, तो उसे अपनी मेज़ पर भी अपनाना तो बनता है।',
      text: 'Every tradition in this app has some version of the first share given back — you have heard it in Arunachal with Abo Tani\'s first handful, and here it is again wearing feathers and carrying a drum. When that many different peoples agree on something, it is worth doing at your own table.' }
  ],
  moral: 'Say thank you before you taste — and say it loud enough for the hills to hear.',
  source: 'Wangala, the hundred-drums harvest festival of the Garo (A·chik) people of Meghalaya, kept in thanks to Misi Saljong the giver, with the dama drums and the nokma\'s offerings. A living festival.'
},

{
  id: 'fk.behdienkhlam',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'Chasing the Sickness Out of Town',
  hook: 'You cannot see sickness to chase it. The town of Jowai chases it anyway — with towers, drums, and a great deal of mud.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['बीमारी', 'beemari', 'sickness'], ['गेंद', 'gend', 'ball'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'खासी पहाड़ियों के पूरब में पनार लोग रहते हैं — यानी जयंतिया लोग, जिनकी अपनी बोली और अपने तौर-तरीके हैं। और यह साफ़-साफ़ कहना ज़रूरी है: खासी और पनार आपस में सगे हैं, एक-दूसरे की नकल नहीं। उनका यह बड़ा त्योहार जोवाई शहर का है, मानसून का है, और एक बहुत पुराने दुश्मन का है।',
      text: 'East of the Khasi hills live the Pnar — the Jaintia people, with their own speech and their own ways, and it is worth saying clearly: Khasi and Pnar are kin, not copies. Their great festival belongs to the town of Jowai, to the monsoon, and to a very old enemy.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      hi: 'वह दुश्मन है ख्लाम — यानी महामारी, बीमारी, और वह बुखार जो बरसात के मौसम में पहाड़ी शहरों में घुस आया करता था, जब रास्ते कीचड़ से भर जाते थे और बादल हफ़्तों तक छतों पर डेरा डाले रहते थे। बीमारी को आते हुए कोई नहीं देख सकता। पुराने ज़माने में, आप बस उसे पहुँचते हुए ही देख सकते थे।',
      text: 'The enemy is khlam — plague, sickness, the fevers that used to walk into hill towns in the wet season when the paths were mud and the clouds sat on the roofs for weeks. You cannot see sickness coming. In the old days you could only watch it arrive.' },
    { art: ['guard'], who: null,
      hi: 'पनार लोगों का जवाब है बेहदिएनख्लाम, और इसके नाम में ही पूरी योजना छिपी है: \'बेह दिएन ख्लाम\' — यानी महामारी को खदेड़ना, उसे पीट-पीटकर शहर से बाहर निकालना। इसे पनार लोगों के अपने धर्म, नियामत्रे को मानने वाले परिवार मनाते हैं, बुआई के कुछ हफ़्तों बाद, जब धान ज़मीन में पड़ चुका होता है और बारिश अपना काम कर रही होती है।',
      text: 'The Pnar answer is Behdienkhlam, and the name is the plan: beh dien khlam — to chase away the plague, to beat it out of town. It is kept by the families of the Niamtre, the Pnar\'s own faith, in the weeks after the sowing, when the rice is in the ground and the rain is doing its work.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'नौजवान घर-घर जाते हैं, और बाँस के लंबे-लंबे डंडों से छतों को पीटते हैं — जानबूझकर ज़ोरदार खट-खट का शोर मचाते हुए — हर एक घर पर बीमारी से कहते हुए: यहाँ नहीं, बाहर निकलो, इस छत पर पहरा है। किसी का भी घर छूटता नहीं है। खदेड़ने का काम या तो सबके लिए किया जाता है, या फिर बिल्कुल नहीं।',
      text: 'Young men go from house to house, and with long bamboo poles they beat on the rooftops — a tremendous knocking racket, on purpose — telling the sickness at every single house: not here, out you go, this roof is watched. Nobody\'s house is skipped. Chasing is a thing you do for everybody or not at all.' },
    { art: ['guard'], who: null,
      hi: 'इस बीच कई दिनों से \'रोत\' तैयार किए जा रहे होते हैं: बाँस और रंगीन कागज़ के ऊँचे-ऊँचे मीनार, हर मोहल्ला अपना मीनार खड़ा करता है, हर साल पिछले साल से भी ज़्यादा शानदार। उस बड़े दिन पर, उन्हें कंधों पर उठाकर पूरे शहर में ले जाया जाता है, और वे ऐसे झूमते हैं जैसे पेड़ों ने चलना सीख लिया हो।',
      text: 'Meanwhile the rots have been building for days: tall towers of bamboo and coloured paper, each neighbourhood raising its own, each year\'s finer than last year\'s. On the great day they are carried on shoulders through the town, swaying like trees that have learned to walk.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और उन्हें नीचे ऐतनार नाम के एक कीचड़ भरे ताल तक ले जाया जाता है, और वहाँ — बारिश में, भीड़ में, घुटनों तक कीचड़ में — उठाने वाले छपछपाते और ज़ोर लगाते हुए उन्हें नचाते हैं, जबकि पूरा कस्बा किनारों से जयकारे लगाता है। त्योहार का शांत हिस्सा घरों के अंदर बीतता है, जहाँ परिवार अपनी भेंट चढ़ाते हैं; पर शोर-शराबे वाला हिस्सा सचमुच बहुत ही ज़ोरदार होता है।',
      text: 'And they are carried down to a muddy pool called Aitnar, and there — in the rain, in the crowd, in mud to the knee — the carriers dance them, wading and heaving, while the whole town roars from the banks. The quiet half of the festival happens indoors, where families make their offerings; the loud half is very loud indeed.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'आखिरी दिन दातलाकॉर की बारी आती है: लकड़ी की एक गेंद, कस्बे की दो टीमें, और बिना किसी रेफ़री का एक ऐसा खेल जो आधा फ़ुटबॉल है और आधी ज़बरदस्त छीना-झपटी। कहते हैं कि जो भी तरफ़ जीतती है, फ़सल घाटी के उसी हिस्से में सबसे अच्छी होती है।',
      text: 'On the last day comes datlawakor: a wooden ball, two sides of the town, and a game with no referee that is half football and half glorious struggle. Whichever side wins, they say, the harvest will favour their end of the valley.',
      ask: {
        q: 'Sickness cannot be seen or caught. How do you chase something like that?',
        options: ['You cannot — you just hide from it', 'Together, loudly, at every house at once, until the whole town has stood up against it', 'You send the strongest man to fight it'],
        answer: 1,
        right: 'That is the wisdom under the racket. A town that stands up together — every roof, every lane — is the hardest place for trouble to settle.',
        wrong: 'The Pnar answer is the second one: together, loudly, at every house at once. A town that stands up together is the hardest place for trouble to settle.'
      } },
    { art: ['guard'], who: 'mithu',
      hi: 'डॉक्टर भी अपनी भाषा में आपको यही समझाएँगे कि पनार लोग सही बात पकड़ रहे हैं: बीमारी से या तो पूरे कस्बे को मिलकर लड़ना होता है, या फिर बिल्कुल नहीं। पुराने त्योहार अक्सर बातों को एक अलग ही समझदारी से जानते हैं। और फिर — अपने पूरे कस्बे के साथ मॉनसून के गुनगुने कीचड़ में खड़े होने से भला आज तक किसका नुकसान हुआ है?',
      text: 'Doctors will tell you, in their own words, that the Pnar are onto something: sickness really is fought town-wide or not at all. The old festivals often know things sideways. And besides — when did standing in warm monsoon mud with your whole town ever do anybody harm?' }
  ],
  moral: 'What threatens everybody is chased by everybody. No roof gets skipped.',
  source: 'Behdienkhlam, kept each monsoon at Jowai by the Pnar (Jaintia) people within their own Niamtre tradition — the rooftop beating, the rots danced in the Aitnar pool, and the datlawakor ball game. A living festival; the rites belong to their keepers.'
},

/* ============================================================= MIZORAM ==== */
{
  id: 'fk.chemtatrawta',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'It All Started With a Lobster',
  hook: 'A pinch on the hand, and by evening half the forest was in trouble. The court case took longer than the trouble did.',
  hero: 'courtier',
  cast: ['courtier', 'pt_elephant', 'pt_crow'],
  minutes: 5,
  place: ['IN-MZ'],
  words_hi: [['क्यों', 'kyon', 'why'], ['झींगा', 'jheenga', 'lobster / prawn'], ['बाँस', 'baans', 'bamboo']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मिज़ोरम में, जब सब कुछ एक साथ गड़बड़ हो जाता है और कोई नहीं बता पाता कि गलती किसकी है, तब कोई बुज़ुर्ग आह भरते हुए कहते हैं: यह तो फिर वही झींगे वाली बात हो गई। और उनका मतलब इसी कहानी से होता है। यह चेमतातरौता नाम के एक आदमी की कहानी है — जिसका कमोबेश मतलब है अपना दाओ तेज़ करने वाला आदमी, क्योंकि चेम पहाड़ों का वह बड़ा काम आने वाला चाकू होता है।',
      text: 'In Mizoram, when everything has gone wrong at once and nobody can say whose fault it is, somebody old will sigh and say: this is the lobster all over again. And this is the story they mean. It is about a man called Chemtatrawta — which means, more or less, the man sharpening his dao, for a chem is the big working knife of the hills.' },
    { art: ['courtier'], who: null,
      hi: 'एक सुबह चेमतातरौता झरने के किनारे बैठकर ठीक यही कर रहा था, अपने ही काम से काम रखते हुए एक गीले पत्थर पर अपनी चेम की धार तेज़ कर रहा था। और उथले पानी में से एक झींगे ने — जो इस किस्से को शायद अलग तरह से सुनाए, पर छोड़िए — आगे बढ़कर उसके हाथ पर ज़ोर से चिमटी काट ली।',
      text: 'Chemtatrawta sat by the stream one morning doing exactly that, sharpening his chem on a wet stone, minding absolutely nobody\'s business. And a lobster in the shallows — who tells this part differently, but never mind — reached out and pinched him, hard, on the hand.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'वह चीखते हुए उछल पड़ा और उसने हवा में अंधाधुंध वार किया, और बाँस का एक पूरा झुरमुट कटकर गिर पड़ा। बाँस जा गिरा एक जंगली मुर्गी की पीठ पर, जो पर फड़फड़ाते हुए गुस्से में अपनी ज़मीन से उड़ी — और सीधे चींटियों के टीले में जा घुसी, उसे किसी फटी हुई बोरी की तरह लात मारकर बिखेर दिया।',
      text: 'He leapt up with a shout and slashed out wildly, and down came a stand of bamboo. The bamboo fell on the back of a jungle fowl, who exploded off her scratching-ground in a fury of feathers — straight through an ants\' nest, kicking it open like a burst sack.' },
    { art: ['pt_crow'], who: null,
      hi: 'चींटियाँ, जो ऐसी बातों को दिल पर ले लेती हैं, कतार बनाकर बाहर निकलीं और जो भी पहली बड़ी चीज़ उन्हें दिखी, उसे काट खाया — और वह था एक सोता हुआ जंगली सूअर। सूअर किसी भूस्खलन की तरह धड़धड़ाता हुआ उठा और पास वाले केले के पेड़ को चीरता हुआ भागा — जहाँ एक चमगादड़ उल्टा लटका सो रहा था और अंजीरों के सपने देख रहा था।',
      text: 'The ants, who take these things personally, marched out and bit the first large thing they found, which was a sleeping wild boar. The boar came up like a landslide and charged through the nearest plantain tree — where a fruit bat was asleep, upside down, dreaming of figs.' },
    { art: ['pt_elephant'], who: null, mood: 'wow',
      hi: 'चमगादड़ नींद से अंधा होकर उड़ा और सीधे हाथी के कान में जा घुसा। हाथी — जो कान के अंदर होने वाली गड़बड़ के अलावा दुनिया की हर चीज़ में बड़ा बहादुर था — गाँव के किनारे से सरपट भागा, उसने एक बूढ़ी औरत की बाड़ गिरा दी, उसकी कपास को पैरों तले रौंद डाला और मचान पर सूख रहे पानी के तुम्बों को चकनाचूर कर दिया।',
      text: 'The bat flew off blind with sleep and went straight into the ear of the elephant. The elephant — who is enormously brave about everything except surprises inside his ear — bolted through the edge of the village, flattened an old woman\'s fence, trampled her cotton flat and smashed the water-gourds drying on her rack.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'तो अब क्या था: एक बूढ़ी औरत जिसके पास न बाड़ बची, न कपास और न पानी भरने का कोई बर्तन, एक गाँव जिसका रास्ता कीचड़ बन चुका था, एक सहमा हुआ चमगादड़, हज़ारों ग़ुस्सैल चींटियाँ, एक चोट खाई मुर्गी, बाँस का गिरा हुआ झुरमुट, और नदी किनारे बैठा एक आदमी जो अपनी कटी हुई उँगली चूस रहा था। और यह सब दोपहर के खाने से पहले ही हो गया।',
      text: 'So now: an old woman with no fence, no cotton and nothing to carry water in, a village with its path churned to mud, one shocked bat, several thousand furious ants, a bruised hen, a felled bamboo grove, and one man by the stream sucking his pinched hand. All before lunch.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'गाँव के मुखिया ने वही किया जो मिज़ो गाँव ऐसे बड़े बखेड़े में हमेशा से करते आए हैं: उन्होंने सबको बुलाया और सबके सामने, एक-एक करके पूरी पूछताछ की।',
      text: 'The village chief did what Mizo villages have always done with a proper mess: he called everyone in and held an inquiry, in order, out loud.',
      ask: {
        q: 'Before the inquiry starts — whose fault is all of it, do you think?',
        options: ['The elephant\'s — he did the most damage', 'The lobster\'s — he pinched first', 'Everyone\'s, a little — every one of them acted before looking'],
        answer: 2,
        right: 'Hold that thought. It is exactly where the chief ends up — but watch how he gets there.',
        wrong: 'The inquiry will surprise you. Watch how the chief walks it back, one "why" at a time.'
      } },
    { art: ['pt_elephant', 'courtier'], who: 'courtier',
      hi: '"हाथी, तुमने तुम्बे क्यों फोड़े?" "क्योंकि चमगादड़ मेरे कान में घुस गया था।" "चमगादड़, तुम उसके कान में क्यों घुसे?" "क्योंकि सूअर ने मेरा पेड़ गिरा दिया था।" "सूअर?" "चींटियों ने मुझे काटा था।" "चींटियाँ?" "मुर्गी ने हमारे बिल पर लात मारी थी।" "मुर्गी?" "बाँस मुझ पर आ गिरा था।" "बाँस—" और यहाँ सब मुड़कर चेमतातरावता को देखने लगे, जिसका चेहरा शर्म से लाल हो गया।',
      text: '"Elephant, why did you smash the gourds?" "Because the bat flew into my ear." "Bat, why did you fly into his ear?" "Because the boar knocked down my tree." "Boar?" "Ants bit me." "Ants?" "The fowl kicked our nest." "Fowl?" "The bamboo fell on me." "Bamboo—" and here everyone turned to Chemtatrawta, who turned rather red.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"झींगे ने मुझे चिमटी काट ली थी," उसने कहा। और एक बर्तन में नदी से लाए गए झींगे ने अपनी मूँछें हिलाईं और पूरे दिन की सबसे सच्ची बात कही: "मेरी नदी में एक बड़ा सा हाथ आया था। मैंने बिना देखे ही चिमटी काट ली।" थोड़ी देर सन्नाटा रहा, और फिर पूरा गाँव एक साथ ठहाका मारकर हँस पड़ा, क्योंकि इस कड़ी के हर एक जीव ने बिल्कुल वही काम किया था।',
      text: '"The lobster pinched me," he said. And the lobster, brought up from the stream in a pot, waved his whiskers and said the only honest thing said all day: "A great hand came into my stream. I pinched before I looked." There was a silence, and then the whole village laughed at once, because every single creature in the chain had done exactly the same thing.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'सरदार के फैसले में, उन कहानियों के मुताबिक जो मुझे सबसे अच्छी लगती हैं, हर किसी पर एक बराबर जुर्माना लगा: ज़िंदगी भर, कुछ भी करने से पहले, एक बार अच्छी तरह से देखना। झींगा फिर भी शर्मिंदा लग रहा था, और कहते हैं कि इसीलिए वह आज तक पत्थरों के नीचे छिपता है। जब तुम्हारा पूरा दिन एक के बाद एक गड़बड़ होता चला जाए, तो वही करो जो मीज़ो लोग करते हैं — सारे "क्यों" की कड़ी पकड़कर बिल्कुल शुरुआत तक जाओ। वहाँ लगभग हमेशा कोई न कोई झींगा ही निकलता है।',
      text: 'The chief\'s judgement, in the tellings I like best, fined every one of them the same amount: one good look, to be paid before acting, for the rest of their lives. The lobster still looked embarrassed, and they say that is why he hides under stones to this day. When your day goes wrong in a chain, do the Mizo thing — walk the "whys" all the way back. It is nearly always a lobster.' }
  ],
  moral: 'Trouble travels in a chain, and every link is somebody who acted before looking.',
  source: 'Chemtatrawta — a Mizo chain tale, beloved for its animal courtroom; the exact order of the chain differs between tellings, as it does in all good chain tales.'
},

{
  id: 'fk.chhura-door',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Chhura Minds the Door',
  hook: 'They told him to watch the door while they were out. He watched it very well. He watched it all the way to the feast.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MZ'],
  words_hi: [['दरवाज़ा', 'darwaza', 'door'], ['हँसी', 'hansi', 'laughter'], ['दावत', 'daawat', 'feast']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मिज़ोरम का सबसे प्यारा इंसान कभी था ही नहीं, या फिर हर जगह मौजूद था, बात तो एक ही है। उसका नाम है छूरा — पूरा नाम छूरबुरा — और वह एक बेवकूफ़ है। कोई दुष्ट बेवकूफ़ नहीं, कोई उदास बेवकूफ़ नहीं: एक लाजवाब बेवकूफ़! गाँव आपस में इस बात पर बहस करते हैं कि वह किस गाँव का था, और इससे ही सब समझ आ जाता है। कोई इस बात पर बहस नहीं करता कि किसी बेवकूफ़ को कौन झेले। वे तो इस बात पर लड़ते हैं कि वह किसे मिले।',
      text: 'Mizoram\'s best-loved man never existed, or existed everywhere, which comes to the same thing. His name is Chhura — Chhurbura, in full — and he is a fool. Not a wicked fool, not a sad one: a magnificent one. Villages argue about which village he came from, which tells you everything. Nobody argues over who has to keep a fool. They argue over who gets to.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक दिन छूरा के परिवार को पड़ोस के गाँव में एक दावत का न्योता मिला — एक बढ़िया वाली दावत, जिसमें सूअर का गोश्त भी था। किसी न किसी को तो पीछे रुकना ही था, क्योंकि पहाड़ों में घर खुला छोड़कर जाने का रिवाज़ नहीं था। "छूरा," उसकी पत्नी ने बहुत सोच-समझकर शब्द चुनते हुए कहा, जैसा कि उसने इतने समय में सीखा था, "यहीं रुको। दरवाज़े का ध्यान रखना। चाहे कुछ भी हो जाए, दरवाज़ा छोड़कर मत जाना।"',
      text: 'One day Chhura\'s family was invited to a feast in the next village — a proper one, with a pig in it. Somebody had to stay back, because in the hills you did not leave a house standing open. "Chhura," said his wife, choosing her words with the care his wife had learned to use, "stay here. Mind the door. Do not leave the door, whatever happens."' },
    { art: ['courtier'], who: null,
      hi: 'छूरा दरवाज़े के पास बैठ गया। उसने उसका ध्यान रखा। दरवाज़ा बहुत अच्छा था और उसने बड़े मन से उसका ध्यान रखा। एक घंटा बीत गया। दरवाज़े ने कुछ नहीं किया, जो कि दरवाज़ों का मुख्य काम होता है।',
      text: 'Chhura sat by the door. He minded it. It was a good door and he minded it thoroughly. An hour passed. The door did nothing, which is the main activity of doors.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और तभी हवा का रुख बदला, और घाटी के नीचे से दावत की हल्की मगर साफ़ खुशबू आने लगी। गोश्त, धुएँ और भुनी हुई चीज़ों की खुशबू। छूरा खड़ा हुआ। वह फिर बैठ गया। उसने दरवाज़े को देखा। उसे बस एक हिदायत दी गई थी, और वह ऐसा आदमी था जो बातों को बड़ी गंभीरता से लेता था — यह तो कभी उसकी परेशानी थी ही नहीं। उसकी परेशानी यह थी कि वह उस बात का मतलब क्या निकालता था।',
      text: 'And then the wind changed, and down the valley, faint but unmistakable, came the smell of the feast. Pork and smoke and roasting things. Chhura stood up. He sat down. He looked at the door. He had been given one instruction, and he was a man who took instructions seriously — that was never his problem. His problem was what he took them to mean.',
      ask: {
        q: '"Do not leave the door." The feast is one valley away. What does Chhura do?',
        options: ['Stays home hungry like anyone else', 'Decides the door can come too', 'Sends the door to the feast and stays behind'],
        answer: 1,
        right: 'Of course he does. He has been told not to leave the door — and he never, ever will.',
        wrong: 'This is Chhura. He looked at the instruction from an angle nobody else would find: the door can come too.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'उसने दरवाज़े को उसके कब्ज़ों से उतारा, उसे लकड़ी के एक विशाल बस्ते की तरह अपनी पीठ पर रस्सियों से बाँध लिया, और पहाड़ी की चोटी के रास्ते चल पड़ा, मोड़ों पर बड़ी सावधानी से चलते हुए ताकि दरवाज़े के कोने कहीं टकरा न जाएँ।',
      text: 'He lifted the door off its pegs, roped it flat onto his back like an enormous wooden rucksack, and set off over the ridge, taking the turns carefully on account of his corners.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'जैसे ही वह अंदर आया, दावत में सन्नाटा छा गया। उसकी पत्नी ने उसे देखा, फिर दरवाज़े को देखा, और बरसों के तजुर्बे वाले शांत भाव से बोली — "छुड़ा। यह दरवाज़ा दावत में क्यों आया है?" और छुड़ा ने, सचमुच हैरान होकर कि यह बात भी बतानी पड़ रही है, उससे कहा: "तुमने ही तो कहा था कि इसे छोड़ना मत। मैंने इसे एक पल के लिए भी नहीं छोड़ा। दरवाज़े से ही पूछ लो।"',
      text: 'The feast fell quiet as he came in. His wife looked at him, and looked at the door, and said — with the calm of long experience — "Chhura. Why is the door at the feast?" And Chhura, honestly baffled that it needed saying, told her: "You said not to leave it. I have not left it for one moment. Ask the door."' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'पूरा परिवार भागता हुआ घर पहुँचा, जहाँ उनका घर दिन भर पहाड़ों के हर जीव-जंतु के लिए खुला पड़ा रहा था। मुर्गियाँ चावल में घुसी थीं। बकरी अजीब सा मुँह बनाए बिस्तर पर बैठी थी। घर को ठीक-ठाक करने में रात हो गई, और छुड़ा ने भी दरवाज़ा उठाए-उठाए मदद की, जिसे उसने तब तक अलग करने से मना कर दिया जब तक वह वापस अपने कब्ज़ों पर नहीं चढ़ गया।',
      text: 'The family ran all the way home, where the house had stood open all day to every creature in the hills. The hens were in the rice. The goat was on the bed, wearing an expression. It took till nightfall to put the house right, and Chhura helped, carrying the door, which he refused to be parted from until it was back on its pegs.' },
    { art: ['courtier'], who: null,
      hi: 'और कोई भी उससे ज़्यादा देर नाराज़ नहीं रह पाता था — छुड़ा की यही तो ख़ास बात है, और यही वजह है कि पीढ़ियों से पूरा समाज उसे अपनी कहानियों में ज़िंदा रखे हुए है। उसकी गलतियाँ कभी आलस भरी या बदनीयत नहीं होती थीं। वह तो बस आपकी हर बात को पकड़कर ऐसी दिशा में निकल पड़ता था, जहाँ जाने का आपने कभी सोचा भी न हो।',
      text: 'And nobody could stay cross with him — that is the thing about Chhura, and the reason a whole people has kept him fed with stories for generations. His mistakes were never lazy and never mean. He simply took every word you said and walked off with it in a direction you had not imagined words could go.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'मिज़ो बुज़ुर्ग पूरी-पूरी शाम छुड़ा के किस्से सुनाते हुए बिता सकते हैं, और यह तो बस एक छोटा सा किस्सा है। समाज का भोला-भाला इंसान भी एक तरह का ख़ज़ाना होता है — वह आपकी गलतियाँ आपसे पहले, और बड़ी और मज़ेदार बनाकर कर देता है, ताकि जब आप गलती करें, तो पहले से ही हँसी तैयार रहे।',
      text: 'Mizo elders can go all evening telling Chhura tales, and this is only one of the small ones. A people\'s fool is a kind of treasure — he makes all your own mistakes first, bigger, and funnier, so that when you make yours there is already laughter ready.' }
  ],
  moral: 'Do what people mean, not only what they say — and if you must get it wrong, get it wrong so well that everyone laughs.',
  source: 'Chhurbura — Chhura — the beloved fool of the Mizo tale cycle, whose stories fill whole evenings. Many tellings; every village adds one of its own.'
},

{
  id: 'fk.chhura-nahaia',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Field That Hummed',
  hook: 'His clever brother tricked him into swapping fields. The catch in the bargain turned out to be made of honey.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MZ'],
  words_hi: [['भाई', 'bhai', 'brother'], ['शहद', 'shahad', 'honey'], ['मधुमक्खी', 'madhumakkhi', 'bee']],
  scenes: [
    { art: ['courtier', 'guard'], who: null,
      hi: 'छुड़ा का एक भाई था जिसका नाम नहाइया था, और नहाइया दूसरी तरह से मशहूर था: चालाक। लगभग दस प्रतिशत ज़रूरत से ज़्यादा चालाक, जो कि सबसे ख़तरनाक बात है। जहाँ छुड़ा आपकी बातों को किसी अजीब दिशा में ले जाता था, वहीं नहाइया आपकी चीज़ों को अपने घर की तरफ ले जाता था।',
      text: 'Chhura had a brother called Nahaia, and Nahaia was the other kind of famous: clever. Too clever, by about ten per cent, which is the most dangerous amount. Where Chhura took your words somewhere strange, Nahaia took your things somewhere his.' },
    { art: ['guard'], who: null,
      hi: 'उन दोनों ने उस साल नए खेत साफ़ किए — दोनों के लिए एक-एक \'लो\', यानी ढलान पर काटकर बनाया गया पहाड़ी खेत, जैसा कि इन पहाड़ों में खेती की जाती है। और जब साफ़-सफ़ाई पूरी हो गई, तो नहाइया अपनी ज़मीन पर टहला और अचानक ठिठक कर रुक गया। उसके खेत के बीचों-बीच पेड़ के एक बड़े से खोखले तने में, चावल की टोकरी जितना बड़ा जंगली मधुमक्खियों का छत्ता लटका था, जो अपनी ही धुन में धीमी गूँज से गूँज रहा था।',
      text: 'The two of them cleared new fields that year — a lo each, a hill field cut from the slope, which is how farming is done in these mountains. And when the clearing was finished, Nahaia walked his own land and stopped dead. In the great hollow stump in the middle of his field hung a wild bees\' nest the size of a rice basket, roaring quietly to itself.' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: '"नहाइया को डंक खाने का कोई शौक़ नहीं था। इसलिए वह बड़ा सीधा-सच्चा मुँह बनाकर अपने भाई के पास गया। \\"छुरा। मुझे बड़ा दुख हो रहा है, पर मैं तुमसे अपना खेत बदलने को तैयार हूँ। मेरी ज़मीन ज़्यादा अच्छी है — तुम ख़ुद सुन सकते हो। मेरा खेत ज़िंदगी की गुनगुनाहट से गूँजता है। मुझे उस गुनगुनाहट की बहुत याद आएगी।\\" और छुरा, जो लोगों का भरोसा कर लेता था, उसी वक़्त खेत बदलने को तैयार हो गया।"',
      text: 'Nahaia was not fond of stings. So he went to his brother wearing his sincerest face. "Chhura. It pains me, but I will swap fields with you. Mine is the better land — you can hear it. My field hums with life. I will miss that hum terribly." And Chhura, who believed people, swapped on the spot.' },
    { art: ['courtier'], who: null,
      hi: '"छुरा अपने नए खेत में घूमा और उसे गुनगुनाहट सुनाई दी, और वह आवाज़ के पीछे-पीछे पेड़ के एक ठूंठ तक पहुँचा, और ऊपर देखा तो सिर के ऊपर हज़ारों मधुमक्खियाँ — खुआइ, यानी पहाड़ों की जंगली मधुमक्खियाँ — अपने काम में लगी हुई थीं।"',
      text: 'Chhura walked his new field and heard the hum and followed it to the stump, and looked up at several thousand bees — khuai, the wild honeybees of the hills — going about their business over his head.',
      ask: {
        q: 'A bees\' nest the size of a basket, roaring away in his new field. What does Chhura do?',
        options: ['Run straight back and demand the swap be undone', 'Charge in at midday and grab the honey', 'Sit down, watch, and wait for the cold morning'],
        answer: 2,
        right: 'For once in his life, exactly the right thing. He sat down to watch — and anyone that busy, he reasoned, is making something.',
        wrong: 'Chhura surprised everybody, possibly including himself. He sat down and watched. Anyone that busy, he reasoned, is making something.'
      } },
    { art: ['courtier'], who: null,
      hi: '"वह पूरी दोपहर उन्हें देखता रहा, जो पैरों पर सुनहरी धूल लपेटे आ-जा रही थीं। उसने न तो उन पर चिल्लाया और न ही छत्ते को छेड़ा, क्योंकि किसी मूर्ख को भी यह बात साफ़ समझ आती — शायद किसी मूर्ख को तो और भी अच्छे से — कि वे कामगार अपने काम में जुटे थे।"',
      text: 'He watched them all afternoon, coming and going with their legs dusted gold. He did not shout at them or poke the nest, because it was obvious even to a fool — especially to a fool, perhaps — that they were workers at work.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"फिर, एक ठंडी और धुंध भरी सुबह, जब मधुमक्खियाँ अपने छत्ते में सुस्त और अलसाई थीं, वह हरी पत्तियों के धीमे धुएँ के साथ चुपके से आया, ज़ोर से उनका शुक्रिया अदा किया — जिसका मधुमक्खियों ने कोई जवाब दिया हो ऐसा कोई लिखित सबूत नहीं है — और उनके लिए उनका हिस्सा छोड़कर, छत्ते का एक बड़ा सा हिस्सा ले लिया। वह मटके भर-भरकर शहद घर लाया। घाटी का सबसे मीठा शहद, लोगों ने कहा, और लोग बिल्कुल सच कह रहे थे।"',
      text: 'Then, on a cold misty morning when the bees were slow and sleepy in their nest, he came quietly with a smudge of green-leaf smoke, thanked them out loud — which the bees are not recorded as acknowledging — and took a fat share of the comb, leaving them theirs. He carried home honey by the potful. The sweetest in the valley, people said, and people were right.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'sad',
      hi: '"ख़बर सुनते ही नहाइया दौड़ता हुआ पहुँचा। वह मटकों को देखते हुए अपनी ही चालाकी का हिसाब जोड़ने लगा, और हिसाब में पाया कि वह तो घाटे में रहा। \\"वह,\\" आख़िरकार उसने कहा, \\"मेरा खेत था।\\" \\"हाँ, था तो,\\" छुरा ने हँसते हुए हामी भरी। \\"किसी भाई का दिया सबसे ज़्यादा गुनगुनाने वाला खेत।\\""',
      text: 'Nahaia arrived at a run, having heard. He stood looking at the pots, doing the arithmetic of his own cleverness, and finding it came out owing. "That," he said at last, "was my field." "It was," agreed Chhura pleasantly. "The hummingest field a brother ever gave me."' },
    { art: ['courtier'], who: null,
      hi: '"और फिर — क्योंकि छुरा का दिल ही उसकी वह इकलौती चीज़ थी जिसे किसी ने कभी मूर्ख नहीं कहा — उसने छत्ते का एक टुकड़ा काटा और उसके हाथ में थमा दिया। भाई तो भाई होते हैं, और शहद बाँटकर खाने के लिए होता है, उनके साथ भी जो चाहते थे कि तुम्हें डंक लग जाएँ।"',
      text: 'And then — because Chhura\'s heart was the one thing about him nobody ever called foolish — he cut a piece of comb and handed it over. Brothers are brothers, and honey is for sharing, even with the ones who meant you to be stung.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'मिज़ो कहानियों में छूरा और नाहैया यूँ ही चक्कर काटते रहते हैं — चालाकी, दाँव उलटना, हँसी-ठिठोली, और आखिर में हर हाल में साथ मिलकर रात का खाना। यह अपने आप में एक शांत सा सबक है कि परिवार किसलिए होता है।',
      text: 'The Mizo tellings send Chhura and Nahaia round and round like this — trick, backfire, laughter, and supper together at the end all the same. Which is its own quiet lesson about what a family is for.' }
  ],
  moral: 'What the clever call a trap, the patient may find is a treasure — and the kind share the honey either way.',
  source: 'Chhura and his brother Nahaia, the fool and the trickster of the Mizo tale cycle; their swaps and contests fill many evenings. Tellings differ, and the honey is in most of them.'
},

{
  id: 'fk.ngaitei',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Ngaitei and the River',
  hook: 'The river rose through the village slowly, patiently, not angry — looking for something. Her grandmother knew what.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MZ'],
  words_hi: [['नदी', 'nadi', 'river'], ['कंघी', 'kanghi', 'comb'], ['वापस', 'wapas', 'given back']],
  scenes: [
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक गहरी हरी नदी के ऊपर बसे गाँव में न्गाइतेई नाम की एक लड़की अपनी दादी के साथ रहती थी — यानी अपनी \'पी\' के साथ, जैसा कि मिज़ो बच्चे कहते हैं। उसके पिता बहुत पहले उसी नदी में खो गए थे, इतना पहले कि उसे उनकी कोई याद भी नहीं थी। उसकी पी का एक ही सीधा सा नियम था: किनारे से अपना घड़ा भरो, और सीधे ऊपर आ जाओ। जहाँ पानी शांत हो, वहाँ कभी मत ठहरना।',
      text: 'In a village above a deep green river lived a girl called Ngaitei, with her grandmother — her pi, as Mizo children say. Her father had been lost to that river long before she could remember him. Her pi\'s one rule was simple: fill your pot at the edge, and come straight up. Never linger where the water is quiet.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'एक दोपहर न्गाइतेई के टखनों के इर्द-गिर्द पानी ने उसे थाम लिया। झटके से नहीं — बल्कि एक हाथ की तरह, जो बेरहम तो नहीं था, पर छोड़ भी नहीं रहा था। और वह उस हरे पानी में नीचे उतरती चली गई, वहाँ तक जहाँ रोशनी किसी खास जगह से नहीं आती, और उस सन्नाटे में उसके पिता की आवाज़ शामिल थी। उन्हें अपनी बेटी की बहुत याद आई थी। नदी का यह देश जिसे प्यार करता है, उसे अपने पास रख लेता है, और उसने न्गाइतेई को भी अपने पास रख लेने का फैसला कर लिया था।',
      text: 'One afternoon the water around Ngaitei\'s ankles held on. Not roughly — like a hand, not unkind, but not letting go. And she went down into the green, down to where the light comes from nowhere in particular, and the quiet had her father\'s voice in it. He had missed her. The river-country keeps what it loves, and it had decided to keep her too.' },
    { art: ['guard'], who: null,
      hi: 'अँधेरा होने से पहले उसकी दादी किनारे पर आईं, न तो वे चीखीं और न ही बल्लियाँ लिए आदमियों को बुलाने दौड़ीं। वे पानी के बिल्कुल किनारे खड़ी हो गईं और उसमें झाँकते हुए बोलीं, बिल्कुल वैसे जैसे कोई किसी ऐसे रिश्तेदार से बात करता है जिसका वह आदर तो करता है पर उससे सहमत नहीं होता। "वही मेरा सब कुछ है। तुम्हारे पास तो तुम्हारा अपना देश है और तुम्हारे साथी भी हैं। उसे ऊपर भेज दो।"',
      text: 'Her grandmother came to the bank before dark, and did not scream and did not run for the men with poles. She stood at the very lip of the water and spoke into it, the way you speak to a relative you respect and disagree with. "She is all I have. You have your country and your company. Send her up."' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'और नदी ने — यह एक मिज़ो नदी थी, पुराने खयालों वाली, लेन-देन के हिसाब में पक्की — उसे एक शर्त के साथ ऊपर भेज दिया, उस आवाज़ में जो गहरे पानी की होती है: वह मेरी कोई चीज़ अपने पास नहीं रखेगी। सतह के इस पार की कोई भी चीज़ उसके साथ किनारे के ऊपर नहीं जाएगी। दादी मान गईं, और न्गाइतेई को अपने ही कपड़े में लपेटकर घर ले आईं, और ज़िंदगी फिर चलने लगी।',
      text: 'And the river — this is a Mizo river, old-fashioned, correct about debts — sent her up, with one condition, spoken in the way deep water speaks: she keeps nothing of mine. Nothing that belongs to this side of the surface goes up the bank with her. The grandmother agreed, and carried Ngaitei home wrapped in her own cloth, and life went on.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'बारिशें आईं। और नदी चढ़ने लगी। वह अपने रोज़ के पत्थरों को पार कर ऊपर आई, फिर नहाने की जगह को पार किया, और फिर — धीरे-धीरे, सब्र के साथ, एक-एक गली नापते हुए, बिना किसी गुस्से के, जो गुस्से से भी कहीं ज़्यादा गंभीर था — सीधे गाँव के अंदर तक आ पहुँची। वह किसी चीज़ की तलाश में थी। जो पानी किसी चीज़ को ढूँढ रहा होता है, उसमें एक अजीब सी खामोशी होती है।',
      text: 'The rains came. And the river rose. It came up past its usual stones, then past the bathing place, then — slowly, patiently, street by street, not angry, which was somehow more serious than angry — into the village itself. It was looking for something. Water that is looking for something has a particular quiet.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'दादी अपने दरवाज़े पर खड़ी थीं, पानी सीढ़ी तक आ पहुँचा था, और उन्होंने नदी की तरह सोचना शुरू किया। हम दोनों में तय हुआ था। मैं अपनी बात निभाती हूँ। तो फिर इस घर में ऐसा क्या है, जो हमारा नहीं है?',
      text: 'The grandmother stood in her doorway with the water at the step, and made herself think like a river. We agreed. I keep my word. So what, in this house, is not ours?',
      ask: {
        q: 'The water is at the door, patient as a debt. What is it looking for?',
        options: ['Ngaitei herself — it has changed its mind', 'Something in the house that still belongs to the river', 'Nothing — rain is rain'],
        answer: 1,
        right: 'Yes. And Ngaitei knew what it was before her grandmother finished asking.',
        wrong: 'The river keeps bargains better than people do. Something in the house still belonged to it — and Ngaitei knew what.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      hi: 'न्गाइतेइ अपनी चटाई के पास गई और तकिए के नीचे से उसे निकाल लाई: लकड़ी की एक कंघी, पुरानी होकर काली पड़ चुकी। उसके पिता की कंघी, पहले के दिनों की। वह उसे अपनी चादर में लपेटकर किनारे से ऊपर लाई थी, क्योंकि उसके पास अपने पिता की बस वही एक निशानी बची थी, और उसने किसी को कुछ नहीं बताया था, क्योंकि जिन चीज़ों को हम छोड़ नहीं पाते, उनके साथ हम ऐसा ही करते हैं।',
      text: 'Ngaitei went to her sleeping mat and brought it out from under the pillow: a wooden comb, dark with age. Her father\'s comb, from before. She had carried it up the bank inside her wrap, because it was all of him she had, and she had told nobody, because that is what we do with the things we cannot give up.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'वे दोनों मिलकर उसे पानी के किनारे तक ले गईं, और दादी ने बड़े प्यार से, कोई मीठा बोल कहकर उसे पानी की सतह पर रख दिया, बिल्कुल वैसे जैसे कोई बाड़ के पार कोई कीमती चीज़ थमाता है। कंघी एक बार घूमी और डूब गई। और नदी थम गई। एक पल के लिए रुकी, जैसे कोई लंबा काम पूरा होने पर इंसान ठहर जाता है — और अपने घर लौट गई, नहाने के घाट को पार करती हुई, पत्थरों को पीछे छोड़ती हुई, वापस अपने पाट में।',
      text: 'They carried it to the water\'s edge together, and her grandmother put it on the surface gently, with a kind word, the way you hand something precious across a fence. The comb turned once and went under. And the river stopped. Stood a moment, the way a person stands when a long errand is finally done — and went home, past the bathing place, past the stones, back into its bed.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'मिज़ो की पुरानी कहानियों में नदी कंघी से भी कुछ ज़्यादा माँगती है, और उसे पा भी लेती है — पर वह अंत इस चूल्हे के पास सुनाने के लिए नहीं है, और मैं झूठ भी नहीं बोलूँगा। लेकिन जो बात हर कहानी में एक जैसी है, वही सहेज कर रखने लायक है: नदी का कुछ कर्ज़ था, कर्ज़ चुका दिया गया, और पानी अपनों को पहचानता है। वह हमेशा से पहचानता आया है।',
      text: 'In the old Mizo tellings the river asks for more than a comb, and gets it — and that ending is not for this hearth, and I will not pretend otherwise. But the part every telling shares is the part worth keeping: the river was owed, the debt was paid, and the water knows its own. It always did.' }
  ],
  moral: 'Give back what belongs to the river, and keep what belongs to you — and be honest about which is which.',
  source: 'Ngaitei — a Mizo tale of the girl claimed by the river; in the older tellings the river\'s claim is larger and the ending far darker. This telling settles the debt with the comb, and says so.'
},

{
  id: 'fk.mauruangi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'Mauruangi and the Silk-Cotton Tree',
  hook: 'They fed her scraps and water, and she grew bright as a festival. Somebody was feeding her that nobody could see.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_tortoise'],
  minutes: 5,
  place: ['IN-MZ'],
  words_hi: [['मछली', 'machhli', 'fish'], ['फूल', 'phool', 'flower'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मौरुआंगी की माँ अब नहीं रही थीं। कैसे गईं, मिज़ो की पुरानी कहानियाँ यह बात बड़े कड़वे ढंग से बताती हैं, और आज रात हम बस इतना ही कहेंगे कि वे चली गईं, और नदी ने उन्हें अपने पास रख लिया। उसके पिता ने दूसरा ब्याह कर लिया, और नई पत्नी की अपनी भी एक बेटी थी, और उसी दिन से उस घर में दो तरह के चावल बनने लगे: एक चावल, और दूसरा जो बचा-खुचा रह जाता था।',
      text: 'Mauruangi\'s mother was gone. How, the old Mizo tellings say harshly, and tonight we will say only that she was gone, and that the river had her. Her father married again, and the new wife had a daughter of her own, and from that day there were two kinds of rice in that house: rice, and what was left of it.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: 'सौतेली बहन हाँडी से खाती थी। मौरुआंगी के हिस्से आती खुरचन और चावल धोने का पानी, भारी-भरकम काम, और चूल्हे का वह कोना जहाँ आँच बुझ चुकी होती थी। यह एक पुराना अन्याय है; कई कहानियों में यह इसलिए दर्ज है क्योंकि कई बचपनों ने इसे झेला था।',
      text: 'The stepsister ate from the pot. Mauruangi got the scrapings and the water the rice was washed in, and the heavy work, and the cold end of the fire. It is an old unfairness; many tales carry it because many childhoods did.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'मगर सौतेली माँ की समझ में एक बात नहीं आ रही थी: मौरुआंगी बिल्कुल नहीं मुरझाई। उसकी आँखें चमकती थीं, गाल गोल-मटोल थे, और वह पानी भरने की पगडंडी पर गाती हुई जाती थी। जिसे सिर्फ़ जूठन खाने को मिलती थी, वह लड़की पूनम के चाँद-सी दमक रही थी। सौतेली माँ को लगा, यह तो एक तरह की ढिठाई थी।',
      text: 'But here is what the stepmother could not understand: Mauruangi did not fade. Her eyes were bright, her cheeks were round, she sang on the path to the water. A girl fed on scraps, glowing like the harvest moon. It was, the stepmother felt, somehow insolent.' },
    { art: ['pt_tortoise', 'courtier'], who: null,
      hi: 'यह राज़ नदी में छुपा था। हर रोज़, जब मौरुआंगी अपना घड़ा लेकर नीचे आती, गहरे पानी से एक बड़ी-सी मांगुर मछली ऊपर उठती और उसे खाना खिलाती — अपने मुँह से बढ़िया चावल, चूल्हे से उतरे हुए जैसे गर्म। "मुँह खोलो, नन्हीं बच्ची," वह कहती। और उसकी आवाज़ ऐसी थी जिसे मौरुआंगी पहचानती थी, उस ज़माने से भी पहले से जो उसे याद था। नदी के पास उसकी माँ थी; अब आप जान ही गए होंगे कि नदी ने उसकी माँ के साथ क्या किया था।',
      text: 'The secret lived in the river. Every day, when Mauruangi came down with her pot, a great catfish rose out of the deep water and fed her — good rice, from its own mouth, warm as if from a hearth. "Open your mouth, little one," it would say. And its voice was a voice she knew, from before remembering. The river had her mother; now you know what the river had done with her.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'सौतेली माँ ने जासूसी के लिए अपनी बेटी को भेजा, और राज़ घर पहुँच गया। फिर उस मछली का क्या हुआ, यह पुरानी कहानियों में तो साफ़-साफ़ बताया गया है, पर यह कहानी नहीं बताएगी। मछली जा चुकी थी। बस इतना ही। मौरुआंगी उसी किनारे पर बैठी रही जहाँ वह मछली उभरा करती थी, और पानी अब सिर्फ़ पानी था।',
      text: 'The stepmother sent her own daughter to spy, and the secret came home, and what was done about the fish the old tellings say plainly and this one will not. The fish was gone. That is all. Mauruangi sat on the bank where it used to rise, and the water was just water.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और तभी, ठीक उसी किनारे से एक पेड़ निकल आया। एक फुनचावंग — यानी सेमल का पेड़, वही जो एक भी पत्ता लाने से पहले लाल फूलों से पहाड़ियों को दहका देता है। वह उतनी ही तेज़ी से बढ़ा जितनी तेज़ी से दूर असम में तेजिमोला के लिए बेल बढ़ी थी, और उस पर बिना मौसम के फूल खिल उठे, ठीक उस जगह के ऊपर जहाँ एक लड़की छाँव की आस में बैठी थी।',
      text: 'And then, from that very bank, a tree came up. A phunchawng — the silk-cotton tree, the one that sets the hills on fire with red flowers before it bothers with a single leaf. It grew as fast as the vine had grown for Tejimola far away in Assam, and it flowered out of season, directly over the place where a girl sat needing shade.' },
    { art: ['courtier'], who: null,
      hi: 'जो कोई भी उस पेड़ के नीचे सुस्ताता, उसका पेट भर जाता — असल में पेट में नहीं, बल्कि उस जगह, जहाँ पेट की ख़बर पहुँचती है। मौरुआंगी वहीं बैठकर रोती और वहीं गाती, और वह पेड़ उस पर वैसे ही लाल फूल गिराता जैसे कोई माँ सिर थपथपाती है।',
      text: 'Whoever rested under that tree came away fed — not in the stomach, exactly, but in the place the stomach reports to. Mauruangi did her crying there and her singing there, and the tree dropped red flowers on her the way a mother pats a head.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      hi: 'एक दिन एक लाल — यानी सरदार, क्योंकि मिज़ो भाषा में यही शब्द है — वहाँ से घोड़े पर गुज़रे और उन्होंने फूलों से लदे पेड़ के नीचे एक लड़की को उसका नाम लेकर शुक्रिया गाते सुना। वे रुक गए। "तुम्हें कौन खिलाता है, बच्ची?" उन्होंने पूछा, क्योंकि वे वह घर देख सकते थे जहाँ से वह आई थी और उन्होंने अपना हिसाब लगा लिया था।',
      text: 'One day a lal — a chief, for that is the Mizo word — came riding past and heard a girl under a flowering tree, singing thanks to it by name. He stopped. "Who feeds you, child?" he asked, because he could see the house she came from and had done his own arithmetic.',
      ask: {
        q: 'A chief asks who feeds her. The true answer sounds impossible. What should Mauruangi say?',
        options: ['Say the stepmother feeds her, to keep the peace', 'Tell the truth, plainly, however it sounds', 'Say nothing at all'],
        answer: 1,
        right: 'She told it all, plainly, without asking for pity — the fish, the voice, the tree. And truth told plainly has a sound honest people recognise.',
        wrong: 'She chose the truth, told plainly, without asking for pity — the fish, the voice, the tree. Truth told plainly has a sound honest people recognise.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'लाल ने उसकी पूरी बात सुनी, और देर तक उस पेड़ को देखते रहे, फिर उन्होंने उसे अपने घर चलने को कहा — मालकिन बनकर, कोई नौकरानी बनकर नहीं; कहानियाँ मानती हैं कि वह खुशी-खुशी चली गई। और अपने नए दरवाज़े के पास, उसने सबसे पहले फुनचावंग का एक बीज बोया। शायद वह आज भी वहाँ खिलता होगा, बिन मौसम ही, जब भी किसी को उसकी ज़रूरत होती है।',
      text: 'The lal heard her out, and looked a long time at the tree, and asked her to come to his house — as its lady, not its servant; the tellings agree she went gladly. And by her new door, the first thing she planted was a phunchawng seed. It is probably flowering there still, out of season, whenever somebody needs it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'दादियों-नानियों द्वारा सुनाई जाने वाली मौरुआंगी की पूरी कहानी कहीं लंबी और कहीं ज़्यादा कठिन है, और वे सुनने वाले के हिसाब से उसे थोड़ा छोटा कर देती हैं — यह कोई बेईमानी नहीं है, ज़बानी कहानियाँ होती ही इसीलिए हैं। यह कहानी का उतना ही रूप है जो इस चूल्हे की चौखट में समा सके। छोटा करने से इसकी रूह नहीं बदलती: प्यार हर उस रूप से लंबा जीता है, जो उसे दिया जाता है।',
      text: 'The grandmothers\' full telling of Mauruangi is longer and much rougher, and they trim it to fit the listener — that is not cheating, that is what oral stories are for. This is the size of it that fits this hearth. The heart of it does not change with the trimming: love outlasts every shape it is given.' }
  ],
  moral: 'Love outlasts its shapes — fish, flower, tree, girl. Feed people; it comes back flowering.',
  source: 'Mauruangi — one of the best-loved Mizo tales: the catfish mother and the phunchawng tree appear in most tellings. The full telling is longer and much harsher; grandmothers trim it to the listener, and this telling stops at the good place, and says so.'
},

{
  id: 'fk.sichangneii',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Winged One',
  hook: 'He hid her wings in the thatch so she would stay. Years later, the children found something beautiful in the roof.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MZ'],
  words_hi: [['पंख', 'pankh', 'wings'], ['उड़ान', 'udaan', 'flight'], ['पिंजरा', 'pinjra', 'cage']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मिज़ो कहानियों में सिचांगनेई की बात आती है — पंखों वाली और चमकदार, आसमान के देश की बेटी। कोई उसे आसमान की परी कहता है, कोई पंछी-स्त्री; कहानियाँ इतनी पुरानी हैं कि उनमें अलग-अलग बातें होना लाज़मी है। पर इस बात पर सब एकमत हैं कि वह अपनी बहनों के साथ पहाड़ों के एक ताल पर उतरी थी, और इस आम दुनिया के आम पानी में नहाने के लिए उसने अपने पंख घास पर उतारकर रख दिए थे।',
      text: 'The Mizo tellings speak of Sichangneii — winged and shining, a daughter of the sky country. Some say sky-maiden, some say bird-woman; the tellings are old enough to disagree. What they agree on is that she came down, with her sisters, to a pool in the hills, and set her wings on the grass to bathe in the ordinary water of the ordinary world.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'पहाड़ों का एक नौजवान पेड़ों के पीछे से सांस साधे यह सब देख रहा था। और जब वे बहनें उठीं, उन्होंने अपने पंख पहने और आसमान में उड़ गईं, जैसे चिंगारियाँ लौटकर आग में जा रही हों — तब भी पंखों की एक जोड़ी घास पर ही पड़ी रह गई, क्योंकि वह दबे पाँव आगे बढ़ा और उन्हें उठा ले गया था।',
      text: 'A young man of the hills was watching from the trees with his breath held. And when the sisters rose and dressed in their wings and went up like sparks going home to a fire — one pair of wings still lay on the grass, because he had crept out and taken them.',
      ask: {
        q: 'He is holding her wings, and she cannot go home without them. What should he do?',
        options: ['Give them back, and ask her to stay of her own will', 'Hide them, so she has to stay', 'Keep one wing and return the other'],
        answer: 0,
        right: 'That is what he should have done. It is not what he did — and the story turns on exactly that.',
        wrong: 'That is what he did — he hid them in the thatch of his roof. And the story turns on exactly that.'
      } },
    { art: ['guard'], who: null,
      hi: 'उसने उन पंखों को अपनी छत के छप्पर में गहराई में छुपा दिया। और सिचांगनेई, जो उड़ नहीं सकती थी, वहीं रह गई। यहाँ कहानी को उसके साथ भी इंसाफ करना होगा, और वह करती भी है: बाकी हर बात में वह बहुत भला था। वह उसके लिए मेहनत करता, उसके साथ मिलकर गाता, उसने उसके लिए एक ऊँचा घर बनाया। उसने उससे ब्याह कर लिया। बच्चे हुए, हँसी-खुशी का माहौल रहा, और ज़्यादातर दिन आसमान उनके लिए सिर्फ मौसम भर था।',
      text: 'He hid the wings deep in the thatch of his roof. And Sichangneii, who could not fly, stayed. Here the telling must be fair to him, because it is: he was kind in every other thing. He worked for her, sang with her, built the house tall. She married him. There were children, and there was laughter, and most days the sky was just weather.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'लेकिन साफ़ शामों में वह दरवाज़े पर खड़ी होकर बाज़ों को ढलती रोशनी में ऊपर, और ऊपर उड़ते देखती, जब तक कि वे आँखों से ओझल न हो जाते। और उसका पति अपने हाथों को किसी न किसी काम में उलझाए रखता, क्योंकि जो सच वह जानता था सो जानता था, और वह छप्पर हर पल उन दोनों के ठीक सिर के ऊपर था।',
      text: 'But on clear evenings she would stand in the doorway and watch the hawks going up the last light, all the way up, until they were nothing. And her husband would find something to do with his hands, because he knew what he knew, and the thatch was directly over both of them the whole time.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"सालों बाद, बच्चे वहाँ खेल रहे थे जहाँ बच्चों को नहीं खेलना चाहिए था—ऊपर छत के नीचे। और उन्हें वह सुंदर चीज़ मिल गई। वे बड़े गर्व से उसे नीचे अपनी माँ के पास लाए: देखो हमारे घर में क्या छिपा हुआ था! और सिचांगनेई बिल्कुल शांत खड़ी रह गईं, अपने ही पंखों को थामे हुए, यह महसूस करते हुए कि पंख आज भी उन्हें याद रखे हुए थे।"',
      text: 'Years in, the children were playing where children should not, up under the roof — and they found the beautiful thing. They brought it down to their mother, proud as anything: look what was hidden in our house. And Sichangneii stood very still, holding her own wings, feeling them remember her.' },
    { art: ['courtier'], who: null,
      hi: '"न तो वे चिल्लाईं, और न ही रोईं, और किस्सों में यह भी नहीं कहा जाता कि वे ज़्यादा देर झिझकीं भी। आसमान उनकी माँ का देस था, और उन्हें उससे दूर रखा गया था—और किसी को बाँधकर रखना प्यार करना नहीं होता, चाहे यह कितने भी प्यार से क्यों न किया गया हो।"',
      text: 'She did not shout, and she did not weep, and the tellings do not say she even hesitated long. The sky was her mother\'s country, and she had been kept from it — and keeping is not the same as loving, however kindly it is done.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      hi: '"उन्होंने पंख पहन लिए। उन्होंने घर के तीन चक्कर लगाए—किस्सों में यह बात आज भी कही जाती है, छप्पर के ठीक ऊपर तीन धीमे चक्कर, बिना किसी चीज़ को छुए और बिना कुछ छोड़े—और फिर वे ऊपर उड़ गईं, ठीक वैसे ही जैसे उन बरसों पहले उनकी बहनें गई थीं, और नीला आसमान उन्हें अपने में समेट ले गया।"',
      text: 'She put the wings on. She circled the house three times — the tellings keep that detail, three slow circles, low over the thatch, touching nothing and leaving nothing out — and then she went up, the way her sisters had gone all those years before, and the blue took her in.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"यहाँ से किस्से अलग-अलग राह ले लेते हैं, और मिज़ो दादियाँ अक्सर बस यहीं रुक जाती हैं—दरवाज़े पर खड़ी, बच्चों के साथ ऊपर आसमान को तकती हुईं। वे इस कहानी को ज़रा भी कोमल नहीं बनातीं, और मैं भी नहीं बनाऊँगा। कुछ कहानियाँ आपके हाथों को सिखाती हैं। यह कहानी आपके दिल को सिखाती है कि या तो नर्मी से थामो, या फिर बिल्कुल मत थामो।"',
      text: 'The tellings go on differently from here, and Mizo grandmothers often simply stop — in the doorway, looking up, with the children. They do not soften this one much, and neither will I. Some stories teach your hands. This one teaches your heart to hold on gently or not at all.' }
  ],
  moral: 'Never hide someone\'s wings. What stays because it is free is the only staying worth having.',
  source: 'Sichangneii, the winged maiden of Mizo oral tradition, told in several shapes. The tellings continue past this point in different ways; grandmothers often stop in the doorway, and this telling stops there too.'
},

{
  id: 'fk.liandova',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Two Brothers and the Great Snake',
  hook: 'Two orphans the village barely fed. What they found inside the old python changed the village\'s mind — but not theirs.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-MZ'],
  words_hi: [['भाई', 'bhai', 'brother'], ['साँप', 'saanp', 'snake'], ['दावत', 'daawat', 'feast']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"लियानदोवा और उसका छोटा भाई तुआईसिआला अनाथ थे, और पुराने पहाड़ी गाँवों में एक अनाथ की ज़िंदगी किसी और के चूल्हे के पास की ठंडी ज़मीन जैसी होती थी। वे कटे हुए खेतों से गिरे दाने चुनते, उन्हें वही दिया जाता जो किसी को नहीं चाहिए होता था, और बाकी बच्चे उन्हें ऐसे नामों से चिढ़ाते थे जिन्हें यह कहानी दोहराएगी नहीं।"',
      text: 'Liandova and his little brother Tuaisiala were orphans, and in the old hill villages an orphan\'s life was a cold seat by somebody else\'s fire. They gleaned the cut fields, they were given what nobody wanted, and the other children had names for them that this story does not repeat.' },
    { art: ['courtier'], who: null,
      hi: '"मगर लियानदोवा के हाथ में जो कुछ भी आता, वह सबसे पहले उसके भाई के मुँह में जाता। हमेशा। कोई भुनी हुई जड़, सूखी मछली का एक टुकड़ा, किसी नन्हीं चिड़िया का एक पंख—हर बार लियानदोवा से पहले तुआईसिआला ही खाता, और अगर सिर्फ एक ही निवाला होता, तो लियानदोवा कह देता कि उसे भूख नहीं है। जिन भाइयों के पास और कुछ नहीं होता, उनके पास यह साथ होता है।"',
      text: 'But whatever came into Liandova\'s hands went first to his brother\'s mouth. Always. A roasted root, a scrap of dried fish, one wing of a small bird — Tuaisiala ate before Liandova did, every single time, and if there was one mouthful only, Liandova was not hungry, he said. Brothers who have nothing else have this.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'जब भी गाँव में कोई दावत होती, तो दोनों भाइयों को बचा-खुचा खाना और अलाव की रोशनी का सबसे दूर वाला कोना मिलता था। कोई इतना बेरहम नहीं था कि उन्हें वहाँ से भगा दे, और कोई इतना मेहरबान भी नहीं था कि उन्हें पास बुला ले—और यह अपने आप में एक अलग ही तरह की बेरुखी थी।',
      text: 'When the village held its feasts, the brothers got the leavings and the far edge of the firelight. Nobody was cruel enough to send them away and nobody was kind enough to call them close, which is its own particular kind of cold.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'फिर उस बड़े साँप वाला दिन आया। गाँव से बहुत दूर दाना-तिनका बीनते हुए, दोनों भाइयों को एक अजगर मिला—बूढ़ा, सुस्त, बहुत ही विशाल, छत की शहतीर जितना मोटा और अपने ख़तरनाक दिन बहुत पीछे छोड़ चुका। जहाँ पूरे मौसम में बड़े-बड़े शिकारियों को कुछ नहीं मिला था, वहाँ दो भूखे बच्चे एक ऐसा शिकार घसीटते हुए घर लाए, जिस पर यकीन करने के लिए आधा गाँव उमड़ पड़ा।',
      text: 'Then came the day of the great snake. Out gleaning far from the village, the brothers found a python — old, slow, enormous, thick as a roof-beam and long past its dangerous years. Where grown hunters had found nothing all season, two hungry boys came home dragging a catch it took half the village to believe.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और उसके अंदर—यह वह हिस्सा है जिसे सुनाते वक्त लोग ज़रा पास झुक जाते हैं—उन्हें वह सब मिला जो उस बूढ़े अजगर ने अपने सौ सालों के जीवन में निगला था: दार, यानी पीतल के वे घंटे जिनकी खनक इन पहाड़ियों में दौलत मानी जाती है, और पुराने ज़माने के वैसे मोती जैसे किसी सरदार की पत्नी पहनती है। गाँव के सबसे ग़रीब लड़के एक ख़ज़ाने के सामने खड़े थे।',
      text: 'And inside it — this is the part the tellings lean close to say — they found what the old python had swallowed in its hundred years of swallowing: dar, the brass gongs, whose voices are wealth in these hills, and beads of the old kind, the kind a chief\'s wife wears. The poorest boys in the village stood in front of a fortune.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'पहाड़ों पर बात बड़ी तेज़ी से ऊपर तक फैलती है। शाम होते-होते, वे लोग जिन्होंने कभी दोनों भाइयों को आग के पास नहीं बुलाया था, उनकी झोपड़ी के सामने टहलने लगे, मौसम की बातें करने लगे, और बड़े प्यार से याद करने लगे कि वे तो हमेशा से इन लड़कों का कितना भला चाहते थे। आपने भी लोगों को ऐसा करते देखा होगा। यह देखना बिल्कुल अच्छा नहीं लगता।',
      text: 'Word travels uphill fast. By evening, people who had never once called the brothers to a fire were strolling past their hut, remarking on the weather, remembering warmly that they had always thought well of the boys. You have seen this done. It is not beautiful.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लियानदोवा के पास घंटे थे, मोती थे, और एक ऐसी याददाश्त थी जो सब कुछ बहुत अच्छी तरह याद रखती थी। और अब उसे एक फ़ैसला लेना था, क्योंकि मिज़ो की पहाड़ियों में दौलत का एक ही सबसे बड़ा इस्तेमाल होता है: इज़्ज़त की दावत, जहाँ एक आदमी पूरे गाँव को खाना खिलाता है और इसके लिए उसे बड़ा माना जाता है।',
      text: 'Liandova had gongs, beads, and a memory that worked perfectly. And now he had a decision, because wealth in the Mizo hills has one great use: the feast of honour, where a man feeds the whole village and is counted great for it.',
      ask: {
        q: 'The whole village at his door — including everyone who let two orphans go hungry. What does Liandova do?',
        options: ['Feed only the few who were ever kind', 'Feed nobody — let them feel what it was like', 'Feed the whole village, every one, and seat his brother first'],
        answer: 2,
        right: 'That is what he did. Plenty becomes honour the moment it is shared — and shared widest by those who remember hunger best.',
        wrong: 'He chose the biggest thing instead: the whole village fed, every one, and Tuaisiala seated first. Those who remember hunger share widest.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'लियानदोवा ने जो दावत दी, वह ऐसी थी जिसे ये पहाड़ियाँ आज भी याद रखती हैं—घंटों की गूँज, गर्मागर्म भाप उड़ाते चावल, हर घर का भरा हुआ पेट, और वे लोग जिन्होंने कभी उसका मज़ाक उड़ाया था, वे नज़रें गड़ाए सिर्फ़ अपने खाने पर ध्यान देकर खा रहे थे। और इन सबमें सबसे आगे, जिसे सबसे पहले बिठाया गया और सबसे पहले परोसा गया, वह था नन्हा तुआईसिआला, जो अपनी मुस्कान रोक ही नहीं पा रहा था।',
      text: 'The feast Liandova gave is the kind the hills remember — the gongs sounding, the rice steaming, every household fed, the ones who had mocked him eating with their eyes carefully on their food. And at the head of it all, seated first, served first, little Tuaisiala, who could not quite stop grinning.' },
    { art: ['courtier'], who: null,
      hi: 'किसी को भी उसका नाम लेकर ताना नहीं दिया गया। यह लियानडोवा की दौलत का आख़िरी और सबसे बढ़िया हिस्सा था: वह उस दिन चाहता तो सौ अपमान ख़रीद सकता था, पर इसके बजाय उसने पूरा गाँव ख़रीद लिया।',
      text: 'Nobody\'s name was thrown back at them. That was the last of Liandova\'s wealth and the best of it: he could have bought a hundred humiliations that day, and he bought a village instead.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'मिज़ो लोगों में एक ऐसी बात है जो आप ज़िंदगी भर सुनेंगे, अगर आप इतने भाग्यशाली हैं कि उन्हें जान सकें: त्लावमंगाइहना — यानी वह इंसान बनना जो सबसे पहले सेवा करे, सबसे पहले सहे, और बिना माँगे सबसे छोटा हिस्सा ले। अपने किसी मिज़ो दोस्त से इसे ठीक से समझाने को कहें; इसे समझाने में पूरी ज़िंदगी लग जाती है और वे इसकी शुरुआत करते हुए ख़ुश होते हैं। कहानियों में यह कैसा दिखता है, लियानडोवा उसी की मिसाल है।',
      text: 'Mizos have a phrase you will hear all your life if you are lucky enough to know them: tlawmngaihna — being the one who serves first, endures first, takes the smallest share without being asked. Ask a Mizo friend to explain it properly; it takes a lifetime and they are glad to start. Liandova is what it looks like in a story.' }
  ],
  moral: 'Keep your brother first when you have nothing, and your table open when you have everything.',
  source: 'Liandova and Tuaisiala, the orphan brothers — a Mizo tale held dear across generations; the python\'s swallowed wealth and the great feast appear in most tellings. Many versions.'
},

{
  id: 'fk.chapchar-kut',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Festival of the Waiting',
  hook: 'The bamboo is cut, and now it must dry, and nobody can do anything but wait. So the Mizo hills dance the waiting.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MZ'],
  words_hi: [['ताल', 'taal', 'the beat'], ['बाँस', 'baans', 'bamboo'], ['मेहमान', 'mehmaan', 'guest']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मिज़ो पहाड़ियों में खेती का साल एक बहुत बड़ी मेहनत से शुरू होता है: उस साल के \'लो\' यानी पहाड़ी खेत के लिए बाँस के जंगल का एक हिस्सा काटा जाता है। और फिर — कुछ भी नहीं। साफ़ की गई ज़मीन को जलाने और बोने से पहले कटे हुए बाँसों का सूखना ज़रूरी होता है। सूखने के इसी ठहराव को चापचार कहते हैं। हाथ ख़ाली, काम नामुमकिन, और हर कोई बस मौसम के इंतज़ार में।',
      text: 'The farming year in the Mizo hills begins with an enormous effort: a patch of bamboo forest is cut for the year\'s lo, the hill field. And then — nothing. The cut bamboo must lie and dry before the clearing can be burned and sown. That drying pause is called chapchar. Hands empty, work impossible, everyone simply waiting on the weather.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और ठीक इसी ठहराव के बीच मिज़ो लोगों ने बहुत पहले अपने सबसे बड़े त्योहार को जगह दी: चापचार कुट, यानी इंतज़ार के वक़्त का \'कुट\' — त्योहार। इसकी शुरुआत की कहानी आमतौर पर यूँ बताई जाती है कि शिकारियों की एक टोली ख़ाली हाथ घर लौटी, और मुखिया ने बेकार बैठे दिनों में गाँव को उदास होने देने के बजाय दावत का ऐलान कर दिया — और वह दावत इतनी अच्छी रही कि उन्होंने इसे हमेशा के लिए अपना लिया।',
      text: 'And into exactly that pause the Mizo people long ago put their greatest festival: Chapchar Kut, the kut — the festival — of the waiting time. The story usually told about how it began is that a hunting party came home empty-handed, and the chief, rather than let the village sit glum in its idle days, called for a feast — and the feast was so good they kept it.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'चापचार कुट की जान चेराव है, और चेराव देखने के लिए तो पूरे देश का सफ़र किया जा सकता है। ज़मीन पर बाँस के लंबे-लंबे डंडे जोड़ों में बिछाए जाते हैं, और बजाने वाले उनके सिरों पर घुटनों के बल बैठकर उन्हें आपस में टकराते हैं — खुला, बंद, खुला, बंद — एक ऐसी लय में जो आती हुई बारिश की तरह तेज़ होती जाती है।',
      text: 'The heart of Chapchar Kut is the cheraw, and the cheraw is worth crossing the country for. Long bamboo poles are laid in pairs on the ground, and the clappers kneel at their ends and clap them — open, shut, open, shut — in a rhythm that quickens like rain arriving.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और टकराते हुए उन्हीं बाँसों के बीच नर्तक क़दम रखते हैं। बंद होते फ़ासलों के अंदर-बाहर, ताल पर, चटख बुने हुए पुआन पहने लड़कियाँ चिड़ियों की तरह नफ़ासत से क़दम बढ़ाती हैं, जबकि बाँस हर टखने के ठीक एक उँगली पीछे खटाक से बंद होते हैं।',
      text: 'And between those clapping bamboos, dancers step. In and out of the closing gaps, on the beat, girls in the bright woven puan stepping neat as birds, while the poles snap shut a finger\'s width behind each ankle.',
      ask: {
        q: 'The bamboos clap shut right where your foot just was. How do the dancers keep their feet?',
        options: ['They watch the bamboo very closely', 'They hear the beat and trust it more than their eyes', 'They are simply faster than the clappers'],
        answer: 1,
        right: 'The beat, not the bamboo. Eyes are too slow — the rhythm tells your feet where the gap will be, not where it was.',
        wrong: 'Watching fails — eyes are too slow. The dancers hear the beat and trust it more than their eyes; the rhythm says where the gap will be, not where it was.'
      } },
    { art: ['guard'], who: null,
      hi: 'यहाँ खुआल्लम भी है — मेहमानों का नाच, जिसे कंधों पर चादर ओढ़े झूमती हुई कतारों में नाचा जाता है, वो नाच जिसके ज़रिये बाहर से आए लोगों को भी इस घेरे में शामिल कर लिया जाता है। इन पहाड़ियों में किसी त्योहार को इस बात से परखा जाता है कि कोई अजनबी कितनी पूरी तरह से अपना बन जाता है।',
      text: 'There is khuallam too — the dance of the guests, danced in swaying lines with cloth draped over the shoulders, the dance with which visitors are drawn into the circle. A festival in these hills is judged by how completely a stranger stops being one.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'चापचार कुट कुछ दशकों के लिए धीमा पड़ गया था — इन पहाड़ियों के धर्म बदले और शासक भी बदले, और कुछ समय के लिए यह पुराना त्योहार सूखते बाँस की तरह शांत पड़ा रहा। फिर, हमारे बुज़ुर्गों के ही देखते-देखते, मिज़ो लोग इसे पूरे मन से वापस ले आए, क्योंकि हर समाज को अपनी बहार सँभाल कर रखने का पूरा हक़ है।',
      text: 'Chapchar Kut faded for some decades — the hills changed faiths and changed rulers, and for a while the old festival lay as quiet as the drying bamboo. Then, within living memory, Mizos brought it back, deliberately, because a people is allowed to keep its own springtime.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'इसलिए आज मिज़ोरम में ज़्यादातर ईसाई हैं, और फिर भी हर मार्च आइज़ोल में चापचार कुट उसी तरह धूमधाम से भर जाता है — एक दिन चर्च के गीत, तो अगले दिन चेराव, एक ही तस्वीर में इतवार के ख़ास कपड़े और पुरानी बुनाई, न किसी को कोई झिझक और न किसी से कोई एक चुनने को कहा जाता है। यह किसी के विश्वास का मुक़ाबला नहीं है। यह तो बस इन पहाड़ियों का अपने पूरे साल को याद करना है।',
      text: 'So today Mizoram is largely Christian, and Chapchar Kut fills Aizawl every March all the same — church choirs one day, cheraw the next, Sunday best and ancient weave in the same photograph, nobody embarrassed and nobody asked to choose. It is not a rival to anyone\'s faith. It is the hills remembering their year.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'इसमें बड़ों जैसी एक बड़ी गहरी समझ छिपी है। साल में ऐसे पल भी आएँगे जब बस इंतज़ार करना होगा — काम ख़त्म होने के बाद, नतीजा आने से पहले, जब चीज़ों को सूखने देने के सिवा करने को कुछ नहीं होता। आप चाहें तो मुँह लटकाकर बैठ सकते हैं, या फिर ठीक उसी वक़्त अपना त्योहार मना सकते हैं। मिज़ो पहाड़ियों ने यह फ़ैसला बहुत पहले कर लिया था, और वे बाँसों की थाप बजाकर इसे साबित भी करते हैं।',
      text: 'There is something very grown-up hiding in this one. The year will hand you waiting times — after the work, before the result, nothing to do but let things dry. You can sit glum in yours, or you can put your festival exactly there. The Mizo hills decided long ago, and they clap the bamboos to prove it.' }
  ],
  moral: 'When the work makes you wait, dance the waiting — and trust the rhythm more than your eyes.',
  source: 'Chapchar Kut, the Mizo spring festival kept in the pause while cut bamboo dries before sowing, with the cheraw bamboo dance and khuallam; it lapsed for some decades and was revived within living memory. A living festival.'
},

/* ============================================================= TRIPURA ==== */
{
  id: 'fk.unakoti',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'One Less Than a Crore',
  hook: 'A whole hillside in Tripura is covered with enormous stone faces. There are two stories about how they got there, and both are told.',
  hero: 'shiva',
  cast: ['shiva', 'courtier', 'guard'],
  minutes: 5,
  place: ['IN-TR'],
  words_hi: [['करोड़', 'karod', 'a crore — ten million'], ['मूर्ति', 'moorti', 'carved image'], ['रात', 'raat', 'night']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'त्रिपुरा के जंगलों से भरे उत्तर में एक ऐसी पहाड़ी ढलान है, जिसे देखकर लोग बात करते-करते रुक जाते हैं। खड़ी चट्टानों से उभरे चेहरे — इतने विशाल, घर से भी ऊँचे, जिनमें शिव का मुकुट पहने एक भव्य सिर भी है — और अनगिनत छोटी नक्काशीदार आकृतियाँ, जिनमें से कुछ पर से झरने ऐसे बहते हैं मानो पहाड़ खुद अपने देवताओं को नहला रहा हो।',
      text: 'In the forested north of Tripura there is a hillside that stops people mid-sentence. Out of the living rock, faces — enormous ones, taller than a house, a great crowned head of Shiva among them — and smaller carvings beyond counting, with waterfalls running over some of them as though the hill were washing its own gods.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'इस जगह का नाम उनाकोटी है, और यह नाम असल में एक गिनती है: एक कोटि यानी एक करोड़ से एक कम। निन्यानवे लाख, निन्यानवे हज़ार, नौ सौ निन्यानवे। नाम कहता है कि कोई था, जिसकी गिनती ठीक एक से एक करोड़ होने से रह गई। वह कौन था, इसके बारे में दो कहानियाँ कही जाती हैं, और आप दोनों सुन सकते हैं।',
      text: 'The place is called Unakoti, and the name is a number: one less than a koti — a crore, ten million. Ninety-nine lakh, ninety-nine thousand, nine hundred and ninety-nine. Somebody, the name says, fell exactly one short of a crore. Two stories are told about who, and you may have them both.' },
    { art: ['shiva'], who: null,
      hi: 'पहली कहानी: शिव जी काशी जा रहे थे, और उनके साथ एक करोड़ देवी-देवता भी चल रहे थे — मानो पूरा आसमान ही सफ़र पर निकल पड़ा हो। इन पहाड़ियों में रात हो गई, तो सबने वहीं डेरा डाल दिया। शिव जी ने कहा, "हम सुबह की पहली किरण के साथ निकलेंगे। सब के सब। एक साथ।" और वो एक करोड़ मुसाफ़िर मान गए, जम्हाई ली, और सो गए।',
      text: 'The first: Shiva was travelling to Kashi, and with him went a crore of gods and goddesses — a whole sky on the move. Night caught them in these hills, and they made camp. "We leave at first light," said Shiva. "All of us. Together." And the crore of travellers agreed, and yawned, and slept.' },
    { art: ['shiva', 'courtier'], who: null, mood: 'think',
      hi: 'सुबह की पहली किरण फूटते ही बस एक मुसाफ़िर जागा: शिव जी। एक करोड़ में से सिर्फ़ एक। बाकी सब उस मीठी पहाड़ी हवा में सोते ही रहे, बिल्कुल वैसे जैसे तुम अपने भाई-बहनों के घर सोते हो जब कोई तुम्हें जगाता नहीं। और शिव जी ने देर तक उन सबको देखा — और अकेले ही काशी के लिए आगे बढ़ गए।',
      text: 'At first light, one traveller woke: Shiva. One, out of a crore. The rest slept on in the sweet hill air, the way you sleep at your cousins\' house when nobody wakes you. And Shiva looked at them all for a long moment — and went on to Kashi alone.',
      ask: {
        q: 'A crore of travellers agreed to wake at dawn, and one did. What became of the sleepers?',
        options: ['They caught him up by evening', 'They turned to stone where they slept, and are there yet', 'They went home in disgrace'],
        answer: 1,
        right: 'So the telling goes — stone where they slept, a hillside of sleepers. One less than a crore.',
        wrong: 'The telling is stranger: they turned to stone where they slept, and are there yet — a hillside of sleepers, one less than a crore.'
      } },
    { art: ['courtier'], who: null,
      hi: 'लोग कहते हैं कि इसीलिए पहाड़ी पर बने इन चेहरों पर ऐसा गहरा, बेफ़िक्र सुकून है: वे मूर्तियाँ नहीं हैं, वे तो सोए हुए लोग हैं। और उनाकोटी में कोई भी आपसे यह वादा नहीं करेगा कि वे बस किसी और भी चमकदार सुबह का इंतज़ार नहीं कर रहे हैं।',
      text: 'That is why, people say, the faces on the hill have that deep, unbothered calm: they are not statues, they are sleepers. And nobody at Unakoti will promise you they are not simply waiting for a louder morning.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'दूसरी कहानी एक कारीगर की है: कल्लू, वहीं का एक मूर्तिकार, जिसका बहुत मन था कि वह शिव और पार्वती जी के साथ उनके पर्वत पर जाए। उसने विनती की, मुझे भी अपने साथ ले चलिए। और उसके सामने एक कारीगर की परीक्षा रखी गई: एक ही रात में पूरे एक करोड़ रूप तराशो। भोर होने से पहले काम पूरा करो, और साथ चलो।',
      text: 'The second story belongs to a craftsman: Kallu, a local sculptor, who longed to travel with Shiva and Parvati to their mountain. Take me with you, he begged. And he was set a maker\'s test: carve a full crore of images in a single night. Finish before the dawn, and come.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'कल्लू धुन के पक्के इंसान की तरह मूर्तियाँ तराशने लगा। रात भर चट्टानों से चेहरे खिलते रहे — बड़े-बड़े, छोटे-छोटे, हज़ारों देवता, उसके हाथों के नीचे पूरी पहाड़ी भरती चली गई। फिर पेड़ों के ऊपर से भोर की रोशनी छा गई, और गिनती एक करोड़ से एक कम रह गई। सिर्फ़ एक। कम।',
      text: 'Kallu carved like a man on fire. Faces bloomed out of the rock all night — great ones, small ones, gods by the thousand, the hill filling under his hands. And the dawn came up over the trees, and the count stood at one less than a crore. One. Less.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'तो वह नहीं जा सका। लेकिन ज़रा देखिए कि वह किस चीज़ को पीछे छोड़कर नहीं जा सका: एक ऐसी पहाड़ी जिसे उसने देवताओं से भर दिया था, किसी भी हाथ से किया गया एक रात का सबसे महान काम। कहानियों में इस बात पर सहमति नहीं है कि वह दुखी हुआ या उसने बस फिर से अपनी छेनी उठा ली — और इस बात का पक्का पता न होने में ही ज़िंदगी की एक पूरी सीख छुपी है।',
      text: 'So he could not go. But look what he could not go from: a hillside he had covered with gods, the greatest night\'s work any hands ever did. The tellings do not agree on whether he grieved or simply picked up his chisel again — and there is a whole life\'s lesson in not being sure which.' },
    { art: ['shiva'], who: 'mithu',
      hi: 'ये नक्काशी सचमुच मौजूद है — आज भी तुम उत्तरी त्रिपुरा में पत्थरों पर से बहते पानी के बीच इनके नीचे खड़े हो सकते हो। हर बसंत में वहाँ एक बड़ा मेला लगता है। कौन सी कहानी सच है? दोनों ही, जिस तरह से कहानियाँ सच होती हैं: एक कहानी है अपनी यात्रा के साथ ही जाग जाने की, और दूसरी है अपने काम से प्यार करने की, भले ही वह एक कदम कम रह जाए। बड़े होने से पहले तुम्हें इन दोनों की ज़रूरत पड़ेगी।',
      text: 'The carvings are real — you can stand under them today, in northern Tripura, with the water running over the stone. Each spring a great fair gathers there. Which story is true? Both, the way stories are true: one is about waking up when your journey wakes, and one is about loving your work even when it comes up one short. You will need both before you are grown.' }
  ],
  moral: 'Wake when the journey wakes — and if you fall one short of a crore, look at the hillside you filled anyway.',
  source: 'The legends of Unakoti in northern Tripura — the sleeping companions of Shiva, and Kallu the craftsman\'s single night — both told locally of the real rock-cut faces, which can be visited. Many tellings.'
},

{
  id: 'fk.twipra-name',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'katha',
  title: 'The Land Beside the Water',
  hook: 'She asked what "Tripura" means, and got two completely different answers — one from each grandparent. Both were right.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-TR'],
  words_hi: [['पानी', 'paani', 'water'], ['नाम', 'naam', 'name'], ['राजा', 'raja', 'king']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अगरतला की एक लड़की का भाई विदेश में रहता था, जिसने सरसराते फ़ोन पर उससे एक सीधा सा सवाल पूछा: त्रिपुरा का असल में मतलब क्या है? और उसे अहसास हुआ कि उसे तो पता ही नहीं। तो उसने वही सही काम किया जो करना चाहिए था — अपने दादा-दादी से पूछा। कमरे में दोनों ही मौजूद थे, और यहीं से यह कहानी शुरू होती है।',
      text: 'A girl in Agartala had a cousin abroad who asked her, over a crackling phone line, a simple question: what does Tripura actually mean? And she realised she did not know. So she did the correct thing, which was to ask a grandparent. She happened to have two in the room, which is where this story comes from.' },
    { art: ['guard'], who: 'guard',
      hi: 'उसकी दादी ने कोकबोरोक में जवाब दिया, क्योंकि कोकबोरोक उनकी भाषा है — बोरोक लोगों यानी त्रिपुरियों की बोली। "खुद इस नाम को ध्यान से सुनो, बच्ची। \'त्वी\' का मतलब है पानी। इन पहाड़ियों की हर नदी इसे अपने साथ बहाती है — नदियों के नाम लो तो तुम कह रही हो त्वी, त्वी, त्वी। त्विप्रा: यानी पानी के किनारे की ज़मीन। यह हम हैं। हमने तो अपने नाम भी बोली और लोगों के नाम पर रखे हैं: \'कोक\' का मतलब है बोली, और \'बोरोक\' का मतलब है लोग। कोकबोरोक — यानी लोगों की बोली।"',
      text: 'Her grandmother answered in Kokborok, because Kokborok is her language — the tongue of the Borok people, the Tripuris. "Listen to the name itself, child. Twi is water. Every river in these hills carries it — say the river names and you are saying twi, twi, twi. Twipra: the land beside the waters. That is us. We even named ourselves for speech and people: kok is speech, Borok are the people. Kokborok — the speech of the people."' },
    { art: ['courtier'], who: 'courtier',
      hi: 'उसके दादाजी ने अपना गला साफ़ किया, जिसका मतलब हर भाषा में यही होता है कि "एक दूसरा जवाब भी है।" "राजाओं का इतिहास कुछ और ही कहता है। राजमाला — यानी राजाओं की माला, वह पुरानी पद्य गाथा जिसे सदियों तक दरबारी पंडितों ने संजोया — शाही वंश को पीछे, बहुत पीछे तक ले जाती है, और उन कथाओं में यह नाम बहुत पुराने किसी राजा से आता है, या फिर खुद देवी से, त्रिपुरा सुंदरी से, जिनका स्थान दक्षिण में माताबाड़ी में है। एक शाही नाम, एक शाही घराने से।"',
      text: 'Her grandfather cleared his throat, which in every language means "there is another answer." "The kings\' chronicle says otherwise. The Rajmala — the garland of kings, the old verse chronicle the court pandits kept for centuries — traces the royal line back and back, and in those tellings the name comes from a king of long ago, or from the goddess herself, Tripura Sundari, whose seat is at Matabari in the south. A royal name, from a royal house."' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'लड़की ने एक बार इधर देखा, एक बार उधर। एक तरफ़ पानी और लोग; दूसरी तरफ़ राजा और एक देवी। और फ़ोन पर इंतज़ार करता उसका भाई।',
      text: 'The girl looked from one to the other. Water and people on one side; kings and a goddess on the other. And the phone line to her cousin waiting.',
      ask: {
        q: 'Two true-sounding answers, one question from abroad. What should she tell her cousin?',
        options: ['Pick the older-sounding one', 'Tell both, and who told her each', 'Make up a tidier one'],
        answer: 1,
        right: 'Both, with their tellers attached. A name that answers twice is rich, not broken.',
        wrong: 'The best answer is both — with their tellers attached. A name that answers twice is rich, not broken.'
      } },
    { art: ['courtier'], who: null,
      hi: 'तो उसने यही किया। "दादी कहती हैं: हमारी अपनी ज़ुबान में, पानी के किनारे की ज़मीन। दादाजी कहते हैं: राजाओं का इतिहास इसे पुराने शाही वंश और देवी से जोड़ता है। और वे दोनों यहीं बैठे सिर हिला रहे हैं, इसलिए मैं किसी एक को नहीं चुन रही।"',
      text: 'So that is what she did. "Grandmother says: the land beside the waters, in our own words. Grandfather says: the kings\' chronicle ties it to the old royal line and the goddess. And they are both sitting here nodding, so I am not choosing."' },
    { art: ['guard'], who: null,
      hi: '“और सच कहें तो बात यहीं पर आ ठहरती है, और विद्वान बड़े चाव से लंबे समय से इस पर बहस करते आ रहे हैं। जिन जगहों को कई लोगों ने प्यार किया हो, उनके नाम की भी अक्सर एक से ज़्यादा कहानियाँ बन जाती हैं—प्यार करने वाले हर रुख से एक अलग कहानी।”',
      text: 'And that is honestly where the matter stands, and scholars have argued it happily for a very long time. Places that many peoples have loved tend to end up with more than one name-story, one from each direction of loving.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '“वैसे बता दें कि परदेस वाले चचेरे भाई को पानी वाला जवाब सबसे ज़्यादा पसंद आया, और दादाजी ने ऐसा जताया जैसे उन्हें कोई फ़र्क़ नहीं पड़ा, और दादीजी ने तो कुछ भी जताने का नाटक नहीं किया, क्योंकि उन्होंने यह फ़ैसला साफ़-साफ़ सुन लिया था और उन्हें यह बिल्कुल सही लगा। त्वी, उन्होंने फिर से कहा, किसी से ख़ास तौर पर नहीं। पानी।”',
      text: 'The cousin abroad, for the record, liked the water answer best, and the grandfather pretended not to mind, and the grandmother did not pretend anything, because she had heard the verdict perfectly well and considered it correct. Twi, she said again, to nobody in particular. Water.' },
    { art: ['courtier'], who: 'mithu',
      hi: '“तुम्हारे अपने परिवार की जगहें भी ऐसी ही होंगी—कोई ऐसा गाँव जिसके दो नाम हों, कोई ऐसा घर जिसे सब कुछ और कहते हों जो नक्शे पर लिखा ही न हो। इन जवाबों को सहेज लो। इनमें कोई फ़ैसला मत सुनाओ। तुम्हारा घर जिस भी नाम को सुनकर जवाब देता है, वह एक दरवाज़ा है, और दरवाज़ों को सँभालकर रखा जाता है।”',
      text: 'Your own family\'s places will be like this too — a village with two names, a house everyone calls something the map does not. Collect the answers. Do not referee them. Every name your home answers to is a door, and doors are for keeping.' }
  ],
  moral: 'Learn every name your home answers to. Each one is a door.',
  source: 'Naming lore of Tripura — the Kokborok telling (twi, water: the land beside the waters) and the tellings tied to the royal line and the goddess in the Rajmala, the verse chronicle of Tripura\'s kings. All are told today, and the scholars are still happily at it.'
},

{
  id: 'fk.kharchi-fourteen',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Week of the Fourteen Gods',
  hook: 'Fourteen gods, each with two names — and once a year the whole state comes to their house.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TR'],
  words_hi: [['चौदह', 'chaudah', 'fourteen'], ['पूजा', 'puja', 'worship'], ['स्नान', 'snaan', 'a bathing']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '“त्रिपुरा की राजधानी से थोड़ी ही दूर, पुराने अगरतला में एक ऐसा मंदिर है जहाँ कुछ ऐसा है जो और कहीं नहीं मिलता: चतुर्दश देवता, यानी त्रिपुरा के चौदह भगवान, जिन्हें देवताओं के एक ही परिवार की तरह साथ रखा गया है—राजाओं के ज़माने से इस धरती के ख़ास रखवाले।”',
      text: 'In Old Agartala, a little way out of Tripura\'s capital, stands a temple that holds something found nowhere else: the Chaturdasha Devata, the Fourteen Gods of Tripura, kept together as one family of the divine — the special guardians of the land since the days of its kings.' },
    { art: ['guard'], who: null,
      hi: '“उनकी देखरेख करने वाले हैं चंताई—त्रिपुरी समुदाय के पुजारी, जिनकी यह सेवा पुराने राज-काज के दिनों से चली आ रही है, उस ज़माने से भी पहले जब मंदिर तक कोई सड़क भी नहीं जाती थी। माणिक्य वंश के राजाओं ने, जिन्होंने सदियों तक त्रिपुरा पर राज किया, इस पूजा को पूरे राज्य की अपनी पूजा बनाए रखा; अब वह राज-पाट एक राज्य बन चुका है, और पूजा बस वैसे ही चली आ रही है।”',
      text: 'Their keepers are the Chantai — priests from the Tripuri community, whose office has come down from the old royal days, long before the temple had a road to it. The kings of the Manikya line, who ruled Tripura for centuries, kept this puja as the kingdom\'s own; the kingdom has become a state, and the puja has simply carried on.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'think',
      hi: '“और याद रखने वाली बात यह है: इन चौदहों में से हर एक के दो-दो नाम हैं। एक कोकबोरोक नाम, जो पहाड़ियों से आया है—बुज़ुर्ग सबसे बड़े देवता को सुब्रई राजा कहते हैं—और एक संस्कृत नाम, जो मैदानी परंपरा से आया है। दो भाषाएँ, जो एक ही वेदी पर प्रार्थना कर रही हैं, इतने पुराने समय से जिसका कोई हिसाब भी नहीं।”',
      text: 'And here is the detail to keep: the fourteen have two names each. A Kokborok name, from the hills — the elders speak of the eldest as Subrai Raja — and a Sanskrit name from the plains tradition. Two languages, praying at one altar, for as long as anyone can measure.',
      ask: {
        q: 'A god with a Kokborok name and a Sanskrit name — which one does the god answer to?',
        options: ['The older one', 'The Sanskrit one, for ceremonies', 'Both — love is not confused by two languages'],
        answer: 2,
        right: 'Both, of course. Prayers in two languages reach the same ears. The fourteen have been answering to both for centuries.',
        wrong: 'Ask the Chantai and the answer is serene: both. Love is not confused by two languages, and the fourteen have answered to both for centuries.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"हर साल जुलाई में उनका हफ़्ता आता है: खारची पूजा। उन चौदहों को बाहर लाया जाता है और एक जुलूस में नदी तक ले जाया जाता है, और वहाँ उन्हें नहलाया जाता है — बड़े जतन और आदर के साथ, जैसे आप अपने किसी प्यारे दादा-दादी को नहलाएँ — और फिर वे चमकते हुए वापस घर लाए जाते हैं।"',
      text: 'Every July comes their week: Kharchi Puja. The fourteen are brought out and carried in procession to the river, and there they are bathed — carefully, with honour, the way you would bathe a beloved grandparent — and carried home again shining.' },
    { art: ['guard'], who: null,
      hi: '"कई बड़े-बुजुर्ग आपको बताएँगे कि यह हफ़्ता खुद धरती माँ के स्नान का भी होता है — कि बुवाई के मौसम के बाद ज़मीन थक जाती है और काम से मैली हो जाती है, और खारची उसे भी साफ़-सुथरा कर देती है। एक ऐसा त्योहार जहाँ उस ज़मीन की भी देखभाल की जाती है जिस पर आप खड़े हैं: यह बात सचमुच सोचने और महसूस करने लायक है।"',
      text: 'Many elders will tell you the week is also a washing for the earth herself — that after the sowing season the land is tired and stained with work, and Kharchi cleanses her too. A festival where the ground you stand on is one of the ones being cared for: that is worth sitting with.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और मंदिर के चारों ओर पूरे हफ़्ते भर एक मेला लगा रहता है — राज्य के सबसे बड़े मेलों में से एक। पहाड़ों के परिवार और मैदानों के परिवार, कोकबोरोक और बंगाली, दुकानें, झूले और चाशनी का धुआँ, हर कोई बड़े प्यार से एक-दूसरे के रास्ते में आ-जा रहा होता है। और वे चौदह इसके बीचों-बीच ऐसे बैठे होते हैं जैसे किसी शादी में घर के बड़े-बुजुर्ग।"',
      text: 'And around the temple, for the whole week, a mela — one of the great fairs of the state. Hill families and plains families, Kokborok and Bengali, stalls and wheels and sugar-smoke, everybody in everybody\'s way in the friendliest possible manner. The fourteen sit at the centre of it like grandparents at a wedding.' },
    { art: ['courtier'], who: null,
      hi: '"कभी यह राजा की अपनी पूजा हुआ करती थी, जिसका सारा ख़र्च राजमहल से आता था। आज पूरी सरकार खुद इस हफ़्ते का सम्मान करती है, और भीड़ इतनी होती है जितनी किसी राजा ने कभी नहीं देखी होगी। रक्षक, आख़िरकार, उन सिंहासनों से भी ज़्यादा समय तक टिके रहते हैं जिन्होंने पहली बार उनके आगे सिर झुकाया था।"',
      text: 'Once it was the king\'s own puja, paid from the palace. Today the state itself honours the week, and the crowds are larger than any king ever saw. Guardians, it turns out, outlast the thrones that first bowed to them.' },
    { art: ['guard'], who: 'mithu',
      hi: '"अगर आपके परिवार में भी घर पर देवता रखे जाते हैं, तो पूछिए कि उन्हें किन नामों से पुकारा जाता है — और क्या किसी को उनके पीछे के पुराने नाम याद हैं। हर पूजा-स्थान का इतिहास इतना गहरा होता है कि वह किसी एक भाषा में नहीं समा सकता, और त्रिपुरा बस इसी बात को ज़ोर से, पूरे चौदह बार दोहराता है।"',
      text: 'If your family keeps gods at home, ask what names they are called by — and whether anyone remembers older names underneath. Every altar has more history than one language can hold, and Tripura simply says so out loud, fourteen times over.' }
  ],
  moral: 'Prayers in two languages reach the same ears.',
  source: 'Kharchi Puja at Old Agartala — the week of the Fourteen Gods (Chaturdasha Devata) of Tripura, tended by the Chantai priests, once the royal puja of the Manikya kings and kept with honour today. A living festival; the rites belong to their keepers.'
},

{
  id: 'fk.garia-puja',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The God Who Comes Up Your Steps',
  hook: 'Some gods wait in temples. Garia comes dancing into your courtyard, and brings the drums with him.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TR'],
  words_hi: [['आँगन', 'aangan', 'courtyard'], ['फ़सल', 'fasal', 'harvest'], ['सात', 'saat', 'seven']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"जब त्रिपुरा की पहाड़ियों में नया साल आता है — अप्रैल के बीच में, वही बड़ा बदलाव जो पूरी घाटी और पहाड़ों की दुनिया एक साथ मनाती है — तब त्रिपुरी, जमातिया और रियांग समुदाय गरिया के दिन मनाते हैं, और गरिया ऐसे देवता नहीं हैं जिनके पास आप जाते हैं। गरिया खुद आपके पास आते हैं।"',
      text: 'When the new year turns in the hills of Tripura — mid-April, the same great turning the whole valley-and-hill world shares — the Tripuri, Jamatia and Reang communities keep the days of Garia, and Garia is not a god you go to. Garia comes to you.' },
    { art: ['guard'], who: null,
      hi: '"वे साल भर की हर ज़रूरी चीज़ देने वाले देवता हैं — फ़सल, मवेशी, बच्चे और घर की बरकत — और अपने दिनों में वे एक सीधा-सादा और सुंदर रूप धरते हैं: बाँस की एक छड़ी, जिसे सजाया-सँवारा और पूजा जाता है, और जिनकी अपनी शोभायात्रा निकलती है। इन पहाड़ों में बाँस से ही घर बनता है, खेत की बाड़ लगती है और पानी ढोया जाता है। तो ज़ाहिर है कि बरकत देने वाले देवता इसमें बड़े आराम से विराजते हैं।"',
      text: 'He is the giver of the year\'s essentials — the harvest, the herds, the children, the luck of the house — and for his days he takes a humble and beautiful form: a bamboo staff, dressed and honoured, carried by his own procession. In these hills bamboo builds the house, fences the field and carries the water. Of course the giver of plenty is at home in it.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"शोभायात्रा एक आँगन से दूसरे आँगन जाती है — एक बार में एक आँगन, कोई भी घर छोटा नहीं — ढोल, बाँसुरी और गरिया नर्तकों के साथ, जो जिस भी आँगन में कदम रखते हैं, वहीं नाचते हैं। आशीर्वाद नाचते हुए हर घर तक अलग से पहुँचाया जाता है। इस पावन अवसर का हिस्सा बनने के लिए किसी को कहीं जाने की ज़रूरत नहीं; यह अपनापन ख़ुद चलकर आता है।"',
      text: 'The procession goes from courtyard to courtyard — an aangan at a time, no house too small — with drums and flute and the Garia dancers, who dance in every yard they enter. The blessing is danced into each household separately. Nobody has to travel to be included; being included travels.' },
    { art: ['courtier'], who: null,
      hi: '"हर परिवार उनका स्वागत उन चीज़ों से करता है जो रसोई और खेत दे सकते हैं — चावल, फल, एक अंडा, कपास — सीधी-सादी चीज़ें, वही चीज़ें जो उनके दिए पूरे साल में मिलती हैं, और साल की शुरुआत में ही उन्हें वापस भेंट कर दी जाती हैं। यह चक्र इससे साफ़ और क्या हो सकता है: जो वे देते हैं, वही उन्हें लौटाया जाता है।"',
      text: 'Each family welcomes him with what the kitchen and the field can give — rice, fruit, an egg, cotton — simple things, the things his year actually provides, offered back to him at the start of it. The circle could not be drawn plainer: what he gives is what he is given.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"खासकर जमातिया लोगों में, गरिया के दिन बड़े आदर और नियम से मनाए जाते हैं — समाज के अपने पुरोहित, पारंपरिक गीत, और पुराने तौर-तरीक़े जिन्हें बड़े जतन से सँभाला गया है। जो नाच शायद आपने किसी मेले के मंच पर देखा हो, वह तो बस उसी बात की सजी-संवरी गूँज है जो परिवार अपने घरों में पूरे दिल से करते हैं।"',
      text: 'Among the Jamatia people especially, Garia\'s days are kept with great seriousness — the community\'s own priests, the proper songs, the old order of things held carefully. The dance you may have seen on a stage at a festival is the polished echo of something families do at home with their whole hearts.',
      ask: {
        q: 'Why would a god visit courtyards, instead of having everyone come to one temple?',
        options: ['Temples were not built yet', 'Because blessing that walks house to house leaves nobody out', 'Because the drums need the exercise'],
        answer: 1,
        right: 'That is the shape of it. A festival you must travel to can miss the busy, the old and the small. One that walks your lane cannot.',
        wrong: 'Look at who a walking blessing reaches: the busy, the old, the small — everyone a fixed temple might miss. House to house leaves nobody out.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"ढोल की थाप, एक बार सुन लो, तो मन में बस जाती है — यह शोभायात्रा के पहुँचने से पहले ही गली में गूँजने लगती है, मानो आशीर्वाद ने किसी धावक की तरह अपनी आवाज़ पहले ही आगे भेज दी हो, और बच्चे इंतज़ार में दरवाज़ों से बाहर उमड़ पड़ते हैं। हर एक घर में यूँ इंतज़ार किया जाना: देवता का हफ़्ता सचमुच सफल हो जाता है।"',
      text: 'The drumming, once heard, stays with you — it comes up the lane before the procession does, so that the blessing sends its sound ahead like a runner, and children spill out of doorways to wait. Being waited for at every single house: that is a god\'s week well spent.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"और जब नर्तक अगले आँगन की ओर बढ़ जाते हैं और ढोल की आवाज़ गली में दूर मद्धम पड़ जाती है, तो हर घर में वही शांत हिसाब-किताब रह जाता है: ज़रा-से चावल दिए, और बदले में पूरा साल माँग लिया। और गरिया ने कभी इस लेन-देन के भाव पर कोई ऐतराज़ किया हो, ऐसा तो कभी सुनने में नहीं आया।"',
      text: 'And when the dancers have gone on to the next courtyard and the drums have faded down the lane, each house is left with the same quiet arithmetic: a little rice given, a whole year asked for. Garia has never been reported to object to the exchange rate.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'और नीचे लिखी तारीख पर ध्यान दीजिए: गरिया के दिन अप्रैल के उसी मोड़ पर आते हैं जब असम में बिहू और बोडो लोगों में बैसागु मनाया जाता है। एक ही वसंत, जो इन पूरी पहाड़ियों में फैला हुआ है, और हर समुदाय अपनी ही भाषा में अपने नाम से उसका स्वागत करता है। इस बात को याद रखिए — इस सिलसिले का एक और त्योहार इस तस्वीर को पूरा कर देगा।',
      text: 'And notice the date underneath: Garia\'s days sit in the same April turning as Bihu in Assam and Bwisagu among the Bodos. One spring, running the whole length of these hills, and every people greeting it by name in their own tongue. Hold that thought — one more festival in this set will finish the pattern.' }
  ],
  moral: 'The best blessings do not wait to be visited. They come up your steps with drums.',
  source: 'Garia Puja, kept each April by Tripuri, Jamatia and Reang families in Tripura — the bamboo-staff god of harvest and herds, carried dancing from courtyard to courtyard. A living festival; the rites belong to their keepers.'
},

{
  id: 'fk.rignai-loom',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Loom Tied to the Weaver',
  hook: 'The loom has no frame and no legs. One end ties to the wall — and the other end is the weaver herself.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TR'],
  words_hi: [['कपड़ा', 'kapda', 'cloth'], ['बुनना', 'bunna', 'to weave'], ['रंग', 'rang', 'colour']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'त्रिपुरा की पहाड़ियों में जगह-जगह बरामदों में आपको एक ऐसा करघा दिखेगा जिसमें न कोई ढांचा है, न पाए, और न ही कहीं कोई मशीन। धागों का एक सिरा दीवार या किसी खंभे से बंधा होता है। दूसरा सिरा एक पट्टा होता है — और वह पट्टा बुनकर की अपनी पीठ के पीछे से निकलता है। वह पीछे की ओर झुकती है, और धागे तन जाते हैं। वह करघे पर सिर्फ बैठी नहीं है। वह खुद उसका हिस्सा है।',
      text: 'On verandas all over the hills of Tripura you will find a loom with no frame, no legs, and no machine anywhere in it. One end of the threads is tied to the wall or a post. The other end is a strap — and the strap goes around the weaver\'s own back. She leans away, and the threads come taut. She is not sitting at the loom. She is part of it.' },
    { art: ['guard'], who: null,
      hi: 'यह बैकस्ट्रैप लूम यानी कमर-करघा है, और पूरे पूर्वोत्तर के पहाड़ी लोग इसके माहिर हैं। त्रिपुरा में यह बोरोक समुदायों — त्रिपुरी, रियांग, जमातिया और उनके पड़ोसियों — की महिलाओं का हुनर है, जो माँ से बेटी तक तभी से चला आ रहा है जब से माँ और बेटियाँ हैं।',
      text: 'This is the loin-loom, the backstrap loom, and the hill peoples of the whole Northeast are its masters. In Tripura it is the women\'s art of the Borok communities — Tripuri, Reang, Jamatia and their neighbours — passed from mother to daughter for as long as there have been mothers and daughters.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'इससे धागा-दर-धागा जो बनकर निकलता है, वह है रिग्नाई — बुना हुआ परिधान जो इन पहाड़ियों की औरतें पहनती हैं — और रिशा, बुना हुआ दुपट्टा। ऐसी धारियाँ, चौकोर आकृतियाँ और बॉर्डर जिनके रंग पूरी घाटी के पार से चमक उठें: लाल, काले, नारंगी, और कभी-कभार दिखने वाला वह खास हरा रंग जो अपनी अलग ही धाक जमाता है।',
      text: 'What comes off it, thread by thread, is the rignai — the woven wrap the women of these hills wear — and the risha, the woven breast-cloth and stole. Stripes and diamonds and borders in colours that carry across a valley: reds, blacks, oranges, the occasional green that means business.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'और ये डिज़ाइन कोई महज़ सजावट नहीं हैं। ये अपनी पहचान हैं। हर समुदाय अपनी रिग्नाई खुद बुनता है — अपने रंग, अपनी सजावट — ताकि कपड़े की पहचान रखने वाली कोई भी औरत बाज़ार में खड़ी होकर पढ़ सके कि सामने वाली औरत कहाँ से है, बिल्कुल वैसे जैसे कोई नाम पढ़ा जाता है। यह डिज़ाइन धागों में लिखा हुआ एक पता है।',
      text: 'And the patterns are not decoration. They are belonging. Each community weaves its own rignai — its own colours, its own arrangements — so that a woman who knows cloth can stand in a market and read where every other woman is from, the way you read a name. The pattern is an address written in thread.' },
    { art: ['guard'], who: null,
      hi: 'लड़कियाँ छोटी उम्र में ही अपनी माँ के पास बैठकर सीखती हैं — पहले देख-देखकर, फिर धागा लपेटकर, और फिर वह दिन आता है जब पट्टा पहली बार उनकी अपनी पीठ पर बंधता है और अचानक पूरा करघा इस बात पर निर्भर हो जाता है कि वे कितनी स्थिरता से बैठती हैं। "कपड़ा तुम्हारे मिज़ाज को भाँप लेता है," माँ कहती है। "ज़रा भी हिली-डुलीं, तो यह उसे याद रखेगा।"',
      text: 'Girls learn young, beside their mothers — first watching, then winding thread, then the day the strap goes around their own back for the first time and the whole loom suddenly depends on how still they sit. "The cloth feels your mood," a mother will say. "Fidget, and it remembers."',
      ask: {
        q: 'The threads are only as taut as the weaver holding them. What does that make the first lesson of this loom?',
        options: ['Strong arms', 'Stillness and patience — the cloth is made of how you sit', 'Speed, to finish before dark'],
        answer: 1,
        right: 'Stillness first, always. The loom is tied to you; the cloth is made of how you sit. Everything else can be taught after.',
        wrong: 'Arms and speed come later. The loom is tied to the weaver, so the cloth is literally made of how she sits. Stillness and patience are lesson one.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"रिशा सिर्फ़ एक कपड़ा भर नहीं है—किसी मेहमान के कंधों पर डाला जाए तो यह एक सम्मान है, ज़िंदगी के बड़े पड़ावों पर दिया जाए तो यह एक ऐसा आशीर्वाद है जिसे आप हाथों में थाम सकते हैं। जब त्रिपुरा किसी का आदर-सत्कार करना चाहता है, तो वह अक्सर कपड़ों के ज़रिए ही करता है, और वह कपड़ा किसी न किसी माँ ने अपने शरीर से बाँधकर रखे करघे पर बुना होता है।"',
      text: 'A risha is more than clothing, too — laid across a guest\'s shoulders it is an honour, given at life\'s big doorways it is a blessing you can hold. When Tripura wants to honour somebody, it very often does it in cloth, and the cloth was woven by somebody\'s mother on a loom tied to her own body.' },
    { art: ['guard'], who: null,
      hi: '"और चूँकि यह करघा सिमटकर ना के बराबर रह जाता है—बस कुछ लकड़ियों और धागों की एक गठरी जिसे आप दीवार पर टाँग सकते हैं—तो जहाँ-जहाँ बुनकर गए, यह भी उनके साथ हर जगह पहुँचा। न किसी कारख़ाने की ज़रूरत, न किसी मशीन के खोने का डर। एक पट्टी और दीवार के सहारे कोई भी महिला दुनिया के किसी भी बरामदे में पाँच सौ साल पुरानी परंपरा सजा सकती है।"',
      text: 'And because the loom folds up into almost nothing — a bundle of sticks and thread you can hang on a wall — it has travelled everywhere the weavers have. No workshop required, no machine to lose. A woman with a strap and a wall can set up five hundred years of tradition on any veranda on earth.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर आपके परिवार की जड़ें इन पहाड़ियों से जुड़ी हैं, तो पूछिए कि आपकी रिगनाई कौन-सी है—इसके जवाब के साथ कई कहानियाँ जुड़ी मिलेंगी। और अगर नहीं भी हैं, तो अगली बार जब आप पूर्वोत्तर की बुनाई देखें, तो ज़रा ग़ौर से देखिएगा: किन्हीं भी दो समुदायों का कपड़ा एक जैसा नहीं होता, और न ही कोई कपड़ा गुमनाम होता है। हर डिज़ाइन के पीछे कहीं न कहीं एक बरामदा, एक पट्टी और अपनी पीठ सीधी रखकर काम में जुटी एक महिला ज़रूर होती है।"',
      text: 'If your family has roots in these hills, ask which rignai is yours — the answer comes with stories attached. And if not, next time you see Northeast weaving, look closely: no two communities\' cloth is the same, and none of it is anonymous. Somewhere behind every pattern is a veranda, a strap, and a straight-backed woman leaning into the work.' }
  ],
  moral: 'The pattern remembers the people. Wear it, and you carry them with you.',
  source: 'The loin-loom weaving of Tripura — rignai and risha, woven by Tripuri, Reang, Jamatia and other Borok women, each community with patterns of its own. A living craft; the patterns belong to their communities.'
},

{
  id: 'fk.matabari-turtles',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'The Mother\'s House by the Turtle Lake',
  hook: 'Beside the temple is a lake full of enormous old turtles, and nobody has ever fished it. Ask why, and you learn what the whole place means.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_tortoise'],
  minutes: 4,
  place: ['IN-TR'],
  words_hi: [['कछुआ', 'kachhua', 'turtle'], ['मंदिर', 'mandir', 'temple'], ['मिठाई', 'mithai', 'sweet']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"त्रिपुरा के हरे-भरे दक्षिणी हिस्से में बसे उदयपुर में राज्य का सबसे प्यारा मंदिर है: त्रिपुर सुंदरी, इस पावन धरती की सुंदर देवी का मंदिर। सब लोग इस जगह को माताबाड़ी कहते हैं—यानी माँ का घर—और इसे बिलकुल वैसे ही माना जाता है: किसी स्मारक की तरह नहीं, बल्कि एक घर की तरह, जिसमें माँ अपने घर पर ही मौजूद हों।"',
      text: 'In Udaipur, in the green south of Tripura, stands the state\'s most beloved temple: Tripura Sundari, the beautiful goddess of the land. Everyone calls the place Matabari — the Mother\'s house — and that is exactly how it is treated: not as a monument, as a house, with the Mother at home in it.' },
    { art: ['guard'], who: null,
      hi: '"इसकी गिनती शक्तिपीठों में होती है—देवी माँ के वे महान पावन धाम जो इस देश के पूरे नक़्शे पर फैले हुए हैं, जिनमें से हर जगह यह माना जाता है कि माँ विशेष रूप से विराजमान हैं। त्रिपुरा का यह धाम बेहद आदरणीय धामों में से एक है, और यहाँ राज्य के बाहर दूर-दूर से तीर्थयात्री आते हैं।"',
      text: 'It is counted among the Shakti Pithas — the great seats of the Goddess spread across the whole map of this land, each one a place where the Mother is held to be specially present. Tripura\'s seat is one of the honoured ones, and pilgrims come from far beyond the state.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"और जिस पहाड़ी पर यह मंदिर खड़ा है, उसकी बनावट ऐसी है जिसे लोग बड़े चाव से दिखाते हैं: नीची, गोल और धान के खेतों के बीच से ऊपर उठती हुई कछुए की पीठ जैसी। वे इसे कूर्म पीठ यानी कछुआ पीठ कहते हैं—इस बात को याद रखिएगा, क्योंकि कछुए वाली यह बात आगे चलकर बहुत सच साबित होने वाली है।"',
      text: 'And the hill it stands on has a shape people love to point out: low, rounded, humped like a tortoise\'s back rising from the paddy. Kurma Pitha, the tortoise seat, they call it — remember that, because the tortoise theme is about to become extremely real.' },
    { art: ['pt_tortoise'], who: null, mood: 'wow',
      hi: 'मंदिर के पास ही कल्याण सागर है — सुख और कल्याण की झील — और इसमें कछुए रहते हैं। बड़े-बड़े कछुए। खूब पुराने कछुए। ऐसे कछुए जो घाट की सीढ़ियों के पास बड़े इत्मीनान और बेफ़िक्री से सतह पर आ जाते हैं, जैसे उन्हें कभी किसी ने सताया ही न हो — और सच में कभी नहीं सताया: उस झील में कभी कोई जाल नहीं फेंका गया, कभी कोई काँटा नहीं डाला गया, कभी भी नहीं।',
      text: 'Beside the temple lies Kalyan Sagar — the lake of wellbeing — and in it live turtles. Big ones. Old ones. Turtles that surface beside the ghat steps with the unhurried confidence of creatures who have never once been troubled, because they never once have: no net has ever been cast in that lake, no hook, not ever.' },
    { art: ['pt_tortoise', 'courtier'], who: 'courtier',
      hi: 'तीर्थयात्री और बच्चे सीढ़ियों पर बैठकर उन्हें खाना खिलाते हैं — मुरमुरे और दरवाज़े से खरीदी आटे की गोलियाँ — और वे बड़े-बड़े खोल हरे पानी में तैरते हुए ऐसे ऊपर आते हैं, मानो कोई धीमा सा आशीर्वाद उभर रहा हो। घाट पर बैठी एक बच्ची ने अपने पिताजी से वही सीधा सा सवाल पूछा: "यहाँ कोई कभी मछली क्यों नहीं पकड़ता?"',
      text: 'Pilgrims and children crouch on the steps and feed them — puffed rice, flour balls bought at the gate — and the great shells come gliding up out of the green like slow blessings surfacing. A child at the ghat asked her father the obvious question: why does nobody ever fish here?',
      ask: {
        q: 'A lake full of fish and turtles, beside a busy temple, never fished in living memory. Why?',
        options: ['Fishing is bad luck', 'Everything in the Mother\'s yard is family — you do not eat family', 'The turtles are too quick to catch'],
        answer: 1,
        right: 'That is how her father put it, more or less. This is the Mother\'s house, and the lake is her yard, and everything in the yard is hers — which makes it family.',
        wrong: 'Her father\'s answer was gentler than luck: this is the Mother\'s house, the lake is her yard, and everything in the yard is family. You do not eat family.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'फिर यहाँ का पेड़ा भी तो है — दूध की वह मिठाई जो माताबाड़ी में बनाई और चढ़ाई जाती है, और पूरे राज्य में मशहूर है; यहाँ के प्रसाद का अपना ही अनोखा स्वाद होता है जिसे लोग पत्तों और कागज़ में लपेटकर घर ले जाते हैं, और हर पुड़िया के साथ माँ के घर का एक छोटा सा हिस्सा भी साथ चला जाता है।',
      text: 'Then there is the pera — the milk sweet made and offered at Matabari, famous across the state; prasad here has its own taste that people carry home wrapped in leaf and paper, and a little of the Mother\'s house travels with every parcel.' },
    { art: ['guard'], who: null,
      hi: 'दीवाली पर इस मंदिर में त्रिपुरा का एक बहुत बड़ा मेला लगता है — हर तरफ दीये ही दीये, खचाखच भरा आँगन, और झील हर लौ की परछाईं को दुगना करके लौटाती है। पहाड़ों के परिवार और मैदानों के परिवार एक ही चौखट पर साथ-साथ खड़े होते हैं, और माँ का घर आख़िर होता ही इसीलिए है।',
      text: 'At Diwali the temple holds one of the great fairs of Tripura — lamps everywhere, the courtyard full, the lake throwing every flame back double. Hill families and plains families side by side at the same threshold, which is what a mother\'s house is for.' },
    { art: ['pt_tortoise'], who: 'mithu',
      hi: 'अलग-अलग परिवार देवी माँ को अलग-अलग तरह से मानते हैं, और सबसे पहले अपने परिवार के तरीके के बारे में ही पूछना चाहिए। लेकिन इस झील को तो कोई भी समझ सकता है: सदियों पहले पूरे समाज ने मिलकर यह तय किया था कि पानी का यह हिस्सा हमेशा पूरी तरह सुरक्षित रहेगा। इसमें तैरता हर कछुआ इस बात की जीती-जागती मिसाल है कि चार सौ साल तक निभाया गया वादा कैसा दिखता है।',
      text: 'Different families understand the Goddess differently, and your own family\'s way is the one to ask about first. But anyone can understand the lake: a whole community agreed, centuries deep, that one piece of water would only ever be safe. Every turtle in it is what a promise looks like after four hundred years of being kept.' }
  ],
  moral: 'In the Mother\'s yard, even the slowest swimmer is safe.',
  source: 'The Tripura Sundari temple (Matabari) at Udaipur, Tripura — the tortoise-shaped hill counted among the Shakti Pithas, the never-fished Kalyan Sagar with its old turtles, and the pera offered there. A living place of worship, presented as its keepers hold it.'
},

{
  id: 'fk.bizhu',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-a',
  badge: 'aaj',
  title: 'Flowers on the Water at Dawn',
  hook: 'Before sunrise on new year\'s eve, Chakma children are down at the river with armfuls of flowers. The door of the house will not shut for two days.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TR'],
  words_hi: [['फूल', 'phool', 'flower'], ['सुबह', 'subah', 'morning'], ['बड़े', 'bade', 'the elders']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'त्रिपुरा के लोगों में चकमा समुदाय भी शामिल है — एक ऐसा समुदाय जो त्रिपुरा, मिज़ोरम और उससे भी आगे तक फैला हुआ है। उनकी अपनी भाषा है, अपनी लिपि है, और उनका बौद्ध धर्म है जिसे उन्होंने इतिहास की हर हलचल और विस्थापन के बीच भी सँभाल कर रखा। और जब अप्रैल का महीना आधा बीतता है, तो उसके साथ आता है चकमा नया साल: बिझु।',
      text: 'Among the peoples of Tripura are the Chakma — a community spread across Tripura, Mizoram and beyond, with their own language, their own script, and their Buddhist faith carried through every move their history forced on them. And when mid-April comes, the Chakma new year comes with it: Bizhu.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'इस त्योहार की शुरुआत पूरे साल के सबसे प्यारे काम से होती है, और यह काम बच्चों का होता है। फूल बिझू के दिन — यानी फूलों वाले दिन — भोर होने से पहले ही, हल्के अँधेरे में बच्चे उठ जाते हैं और झोलियाँ भर-भरकर फूल इकट्ठे करते हैं। फिर नदी या तालाब की ओर दौड़ते हैं, और दिन की पहली रोशनी के साथ ही फूलों को पानी में बहा देते हैं — एक प्यारी-सी बधाई की तरह, पुराने साल का शुक्रिया अदा करते हुए और उसे फूलों से सजाकर विदा करते हुए।',
      text: 'It opens with the loveliest job in the festival calendar, and it belongs to the children. Before dawn on Phool Bizhu — the flower day — they are up in the half-dark, gathering flowers by the armful. Down to the river or the pond, and the flowers go onto the water with the day\'s first light — set afloat as a greeting, the old year thanked and sent off garlanded.' },
    { art: ['guard'], who: null,
      hi: 'फूल दरवाज़ों पर भी सजते हैं, घर के मंदिर में भी, और जहाँ भी कान दिखें, कानों के पीछे भी। नाश्ते से पहले ही, जब अपने ही बच्चे पूरे घर को फूलों से सजा देते हैं—चकमा लोगों के नए साल की शुरुआत कुछ ऐसे ही होती है।',
      text: 'Flowers go on the doorways too, and on the house shrine, and behind ears wherever there are ears. A house dressed in flowers by its own children, before breakfast: that is how a Chakma year begins.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'सबसे बड़ा दिन होता है मूल बिझू, और इस दिन की सबसे खास चीज़ है एक पकवान, जिसे \'पाजोन\' कहते हैं — धीमी आँच पर पकने वाला एक ऐसा व्यंजन, जिसमें इस मौसम की मिलने वाली हर एक सब्ज़ी डाली जाती है। तीन तरह की नहीं, न ही पाँच तरह की। परिवार सब्ज़ियों की गिनती पर वैसे ही गर्व करते हैं जैसे बाकी रसोइये अपने गुप्त नुस्खों पर; साल ने जितना कुछ दिया है, उतना ही सब कुछ उस पतीले में जाता है।',
      text: 'The great day is Mul Bizhu, and its centrepiece is a dish called pajon — a slow pot into which goes every vegetable the season can offer. Not three kinds. Not five. Families take pride in the count the way other cooks take pride in secrecy; the more the year has given, the more goes in the pot.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'और यह रहा वह नियम जो बिझू को सचमुच बिझू बनाता है: उस दिन दरवाज़ा कभी बंद नहीं होता। कोई भी अंदर आ सकता है, और जो भी अंदर आए उसे पाजोन खिलाया जाता है — पड़ोसी, अजनबी, या तीन घर छोड़कर रहने वाला वह बच्चा भी जो आपको कभी पसंद नहीं आया, हर कोई। मूल बिझू के दिन किसी मेहमान को मना करना तो सोचा भी नहीं जा सकता।',
      text: 'And here is the rule that makes Bizhu Bizhu: on that day the door does not shut. Anyone may come in, and everyone who comes in is fed pajon — neighbour, stranger, the child from three houses down you have never liked, everyone. Refusing a guest on Mul Bizhu is simply not a thing that is done.',
      ask: {
        q: 'Open door, everyone fed, no exceptions. Why start a year like that?',
        options: ['To use up the vegetables', 'Because how you begin is a promise — and this begins the year open-handed', 'To find out who your friends are'],
        answer: 1,
        right: 'That is the heart of it. The first day is a promise about all the others. Begin open-handed, and the year knows what you mean it to be.',
        wrong: 'The elders would smile and say: the first day is a promise about all the others. Begin open-handed, and the year knows what you mean it to be.'
      } },
    { art: ['guard'], who: null,
      hi: 'बुज़ुर्ग इस पूरे जश्न के केंद्र में होते हैं — उनका आशीर्वाद लिया जाता है, उन्हें आदर-सम्मान दिया जाता है, और कई परिवारों में छोटे बड़े ही प्यार और आदर से बड़ों को नहलाते हैं। और इस बड़े दिन के बाद आता है एक शांत तीसरा दिन: आराम और आशीर्वाद का एक सुकून भरा दिन, जो त्योहार को झटके से ख़त्म करने के बजाय हौले से समेट लेता है।',
      text: 'The elders are at the centre of it all — blessings collected, respects paid, the old bathed in honour by the young in many families. And after the great day comes a quieter third: a gentle day, for rest and blessings, easing the festival closed instead of slamming it.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'अब उस पूरी लड़ी को पूरा कीजिए जिसे आप देखते आ रहे हैं: असम में बिहू, बोडो लोगों में बैसागु, त्रिपुरा की पहाड़ियों में गरिया पूजा के दिन — और चकमा लोगों में बिझू, सब अप्रैल के इसी मोड़ पर आते हैं, सब त्योहारों के एक ही बड़े परिवार के हिस्से हैं जो इन पहाड़ियों से लेकर सरहदों के पार तक फैला हुआ है। एक ही वसंत, कई सारे नाम, और हर नाम अपनी ही आवाज़ में नए साल का स्वागत करता एक पूरा समाज है।',
      text: 'Now finish the pattern you have been collecting: Bihu in Assam, Bwisagu among the Bodos, Garia\'s days in the Tripura hills — and Bizhu among the Chakma, all in the same April turning, all cousins of one great festival family that stretches from these hills across borders far beyond. One spring, many names, and every name is a people greeting the year in their own voice.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगर तुम अप्रैल के बीच में कभी किसी चकमा मोहल्ले के पास हो, तो दरवाज़े वाला नियम याद रखना — वह तुम पर भी लागू होता है। आराम से अंदर जाओ, फूलों की तारीफ़ करो, और अपने पाजोन में सब्ज़ियाँ गिनो। फिर अपने परिवार से पूछो: हम पानी में क्या बहाते हैं, और कब?"',
      text: 'If you are ever near a Chakma neighbourhood in mid-April, remember the rule about the door — it applies to you too. Go in politely, admire the flowers, and count the vegetables in your pajon. Then ask your own family: what do we float on the water, and when?' }
  ],
  moral: 'Begin the year with flowers on the water and a door that will not shut.',
  source: 'Bizhu, the springtime new year of the Chakma community, kept in Tripura, Mizoram and beyond — Phool Bizhu\'s flowers at dawn, the pajon pot and the open door of Mul Bizhu. A living festival; ask a Chakma friend how their family keeps it.'
}

];

window.IND_COLLECTIONS_NE_A = [
  { id: 'desh-ne-a', name: 'The Eastern Hills',
    note: 'Assam, Meghalaya, Mizoram and Tripura — Tejimola and the winged maiden, the navel of the sky, a lobster with a lot to answer for, and the festivals of one long spring.',
    avatar: 'pt_deer' }
];
