/* Bizzing India — southern story content (fourth tranche).

   Same shape as data-stories.js, data-stories-regional.js and data-stories-more.js,
   on its own global so all four sets can be loaded and merged independently.

   This file brings every southern state to at least eight stories: Kerala, Tamil
   Nadu, Karnataka, Andhra Pradesh, and Puducherry — whose four scattered pieces
   (Pondicherry and Karaikal on the Coromandel coast, Mahe on the Malabar coast,
   Yanam on the Godavari delta) are treated as the geography lesson they are.

   Every object carries badge 'katha' — a story as it is told. Sources name the
   tradition, the collection or the place honestly; where a tale is oral and has
   no single collector, the source says so rather than inventing one. Kerala's
   Aithihyamala tellings (Naranath, Kochunni, the Kathanar, the panthirukulam)
   name that collection because it is genuinely where most families' versions
   descend from.

   Softening notes (docs/05, and the age band): several of these tales end more
   harshly in their oldest tellings than they do here — Kannagi's ending is
   pointed to rather than told, the three devotees of Srikalahasti keep their
   lives, Onake Obavva's stand is told without the battlefield details, and the
   sea gives back the tittibha eggs without Garuda's harder threats. Each one
   says so in its own `source` line rather than quietly rewriting the tradition.

   Faiths (docs/05 §4): Kerala's Hindu, Christian and Muslim traditions all
   appear here, each told warmly from the inside — the Kathanar is a Christian
   priest and says so plainly; the Cheraman legend is told as Kerala's Muslims
   cherish it; the Manimekalai is told as the Buddhist Tamil epic it is.

   The panthirukulam and Naranath tales touch, in their old tellings, on the
   harsh old words for people and the ranking of families. Those words do not
   appear here; the stories are told around them, the way this app's
   Mahabharata is — and the internal diversity they celebrate IS the point.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_SOUTH = [

/* ============================================================== KERALA ====== */
{
  id: 'fk.panthirukulam',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'Twelve Houses, One Mother',
  hook: 'Twelve babies, one mother — and every one of them grew up in a different house, with a different trade, and a different way of praying.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-KL'],
  words_hi: [['परिवार', 'parivaar', 'family'], ['बारह', 'baarah', 'twelve'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह केरल की सबसे पुरानी कहानियों में से एक है, और एक बार जब आप इसे सुन लेंगे, तो वहाँ जहाँ भी नज़र डालेंगे, आपको यही कहानी दिखाई देगी। इसकी शुरुआत वररुचि नाम के एक विद्वान से होती है, जो सब कुछ जानने के लिए दूर-दूर तक मशहूर थे — और जिन्हें बस अभी-अभी यह शक होना शुरू हुआ था कि वे सब कुछ नहीं जानते।',
      text: 'This is one of the oldest stories Kerala tells about itself, and once you have heard it you will see it everywhere you look there. It begins with a scholar called Vararuchi, who was famous across the land for knowing everything — and who was just beginning to suspect that he did not.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक दिन नदी किनारे उनकी मुलाक़ात एक युवती से हुई, जिसने कपड़े धोना रोके बिना ही एक ऐसी पहेली का जवाब दे दिया जिसे उनका कोई भी जानने वाला विद्वान हल नहीं कर पाया था। वे अगले दिन उससे भी कठिन पहेली लेकर आए। उसने उसका भी जवाब दे दिया, और अपनी तरफ़ से उससे भी बढ़िया एक पहेली पूछ ली। उन्होंने उससे शादी कर ली, जो उनकी ज़िंदगी का पहला पूरी तरह समझदारी भरा काम था।',
      text: 'By a river one day he met a young woman who answered, without even putting down the washing, a riddle that had beaten every scholar he knew. He came back the next day with a harder one. She answered that too, and added a better one of her own. He married her, which was the first fully sensible thing he had ever done.' },
    { art: ['courtier'], who: null,
      hi: 'वे दोनों साथ-साथ सफ़र पर निकल पड़े, जैसा उस दौर में घुमक्कड़ विद्वान किया करते थे, और सालों के दौरान उनके बारह बच्चे हुए — हर एक रास्ते की अलग-अलग जगह पर।',
      text: 'They took to the road together, the way wandering scholars did, and over the years twelve children were born to them — each one in a different place along the way.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      hi: 'और यहाँ कहानी एक बड़ा कठोर मोड़ लेती है, और वह जानती है कि यह बहुत कठिन है। हर बार जब कोई बच्चा पैदा होता, वररुचि अपनी पत्नी से एक ही सवाल पूछते: "क्या बच्चे का मुँह है?" "हाँ, बिल्कुल," वह कहती। "तो जिसने मुँह दिया है, वही दाना-पानी भी देगा," वे कहते। "बच्चे को धीरे से नीचे लिटा दो, और आगे बढ़ो।" और टूटते दिल से, ख़ुद से भी बड़ी किसी शक्ति पर भरोसा करते हुए, उसने वैसा ही किया।',
      text: 'And here the story does a hard thing, and it knows it is hard. Each time a baby came, Vararuchi asked his wife one question: "Does the child have a mouth?" "Of course," she said. "Then the One who gave the mouth will send the food," he said. "Lay the child down gently, and walk on." And, trusting something bigger than her own breaking heart, she did.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'केरल की पगडंडी के किनारे कपड़े में लिपटा पड़ा एक नन्हा बच्चा, जहाँ हर कुछ मिनटों में कोई न कोई गुज़रता है। कहानी अच्छी तरह जानती है कि वह क्या कर रही है।',
      text: 'A baby, lying wrapped by the side of a path in Kerala, where somebody passes every few minutes. The story knows exactly what it is doing.',
      ask: {
        q: 'A baby is found by the path. Who picks it up?',
        options: ['Nobody — people walk past', 'Whichever family finds it first — and every family is different', 'Only a rich family could'],
        answer: 1,
        right: 'Exactly that. And that is the whole story. Twelve babies, twelve different families — and not one child was left lying there long.',
        wrong: 'Kerala answers that question the way Kerala would. Whichever family found the child took the child — and every family was a different kind of family.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'एक बच्चा बढ़ई के घर पला-बढ़ा और पेरुंथचन बना, इस धरती का सबसे महान शिल्पकार जिसकी चर्चा हमेशा हुई। एक ढोल बजाने वालों के परिवार में बड़ा हुआ और उनकी थाप को आगे ले गया। एक टोकरी बुनने वालों के यहाँ पला और पक्कनार बना, जिसकी सीधी-सादी बातें किसी भी घमंडी इंसान के बढ़ते क़दम रोक सकती थीं। एक विद्वान के घर में बड़ा हुआ और पवित्र अग्नि की सेवा करने लगा।',
      text: 'One was raised in a carpenter\'s house and became Perunthachan, the greatest builder the land ever talked about. One grew up with a family of drummers and carried their beat. One was raised by basket weavers and became Pakkanar, whose plain words could stop a proud man mid-stride. One grew up in a scholar\'s house tending the sacred fire.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक, जिसका नाम उप्पुकोट्टन था, नमक के एक व्यापारी के घर पला-बढ़ा, जहाँ परिवार वैसे ही नमाज़ पढ़ता था जैसे मुसलमान पढ़ते हैं, और वह उसी धरम-ईमान में बड़ा हुआ और देश की हर राह पर नमक ले गया। एक ऐसा भी था जो कभी किसी घर में नहीं टिका — तुम उससे अगली कहानी में मिलोगे, पहाड़ी पर एक भारी पत्थर ढकेलते हुए। बारह घर, बारह काम-धंधे, प्रार्थना करने का एक से ज़्यादा तरीका। माँ सिर्फ़ एक।',
      text: 'One, called Uppukottan, was raised in a salt trader\'s house where the family prayed as Muslims pray, and he grew up in that faith and carried salt down every road in the country. One never settled in any house at all — you will meet him in the next story, pushing a boulder up a hill. Twelve homes, twelve trades, more than one way of praying. One mother.' },
    { art: ['courtier'], who: null,
      hi: 'और कहानी कहती है कि साल में एक बार, अपनी माँ के दावत वाले दिन, वे बारहों एक ही छत के नीचे इकट्ठे होते थे — ढोल बजाने वाला और आग की रखवाली करने वाला, बढ़ई और नमक का व्यापारी, हर कोई वही लाता जो उसके अपने घर में बनता था, हर कोई अपने घर के तरीके से खाता था, एक ही समय पर, एक ही आँगन में।',
      text: 'And once a year, the story says, all twelve came together under one roof for their mother\'s feast day — the drummer and the fire keeper, the carpenter and the salt trader, each bringing what his own house made, each eating in the way of his own home, at the same time, in the same courtyard.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'पड़ोसी तो हैरान-परेशान हो गए, ज़ाहिर है। इतने अलग-अलग लोग, एक ही दावत में! और कहानी बस पड़ोसियों को देखती है, और इंतज़ार करती है, जब तक कि वे समझ न जाएँ: माँ तो एक ही है।',
      text: 'The neighbours were scandalised, of course. Such different people, at one feast! And the story just looks at the neighbours, and waits, until they work it out: same mother.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'केरल सदियों से अपने बारे में यह कहानी सुनाता आया है — बारह तरह के घरों वाली एक ऐसी ज़मीन, जो भीतर से जानती है कि वह एक ही परिवार है। अपने परिवार से पूछ कर देखो कि परिवार में कौन-कौन आता है। जवाब अक्सर घर की चारदीवारी से कहीं बड़ा होता है।',
      text: 'Kerala has told this story about itself for centuries — a land of twelve kinds of household that knows, underneath, it is one family. Ask your own family who counts as family. The answer is usually bigger than the house.' }
  ],
  moral: 'One mother can have twelve kinds of children, and a country can too. That is not a problem to fix — that is a family.',
  source: 'Parayi petta panthirukulam — the twelve families of one mother — from Kerala oral tradition and the Malayalam legend collection Aithihyamala. Told here without the harsh old words for people that some tellings carry.'
},

{
  id: 'fk.naranath-boulder',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Man Who Rolled the Boulder Up',
  hook: 'Every morning he pushed a huge rock up the hill. Every evening he let it roll back down — and laughed. Everyone said he was mad. Was he?',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'durga'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['पत्थर', 'patthar', 'boulder'], ['पहाड़ी', 'pahaadi', 'hill'], ['हँसी', 'hansi', 'laughter']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'तुम्हें एक ही माँ के वे बारह बच्चे याद हैं? यह वही है जो कभी कहीं नहीं टिका। उसका नाम था नारनाथ, और पूरा केरल उसे नारनाथ भ्रांथन कहता था — यानी पागल नारनाथ — और केरल सैकड़ों सालों से इस बात पर बहस कर रहा है कि क्या यह नाम सही था।',
      text: 'You remember the twelve children of one mother? This is the one who never settled anywhere. His name was Naranath, and all of Kerala called him Naranath Branthan — Naranath the mad one — and Kerala has been arguing for hundreds of years about whether that name was fair.' },
    { art: ['courtier'], who: null,
      hi: 'उसके दिन कुछ ऐसे गुज़रते थे। सुबह होते ही वह रायिरनेल्लूर की पहाड़ी की तलहटी में एक विशाल पत्थर पर अपना कंधा टिकाता, और धकेलता। पूरी सुबह। पूरी दोपहर। कराहते हुए, पसीने से तरबतर, इंच-दर-इंच, चोटी तक।',
      text: 'His days went like this. At dawn he put his shoulder to an enormous boulder at the bottom of the hill at Rayiranellur, and he pushed. All morning. All afternoon. Grunting, sweating, inch by inch, all the way up.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और चोटी पर, दिन की आखिरी रोशनी में, वह ज़रा पीछे हटा, अपने हाथ झाड़े — और उसे छोड़ दिया। वह भारी पत्थर गड़गड़ाता और उछलता हुआ वापस ठीक उसी जगह जा पहुँचा, जहाँ से शुरू हुआ था। और नारनथ ने अपना सिर पीछे किया और इतनी ज़ोर से हँसा कि हँसते-हँसते उसे बैठना ही पड़ गया।',
      text: 'And at the top, in the last light, he stood back, dusted his hands — and let it go. The boulder went thundering and bouncing all the way back down to exactly where it had started. And Naranath threw back his head and laughed until he had to sit down.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"पागल है," गाँव वालों ने बड़े आराम से कहा, और अपने-अपने रात के खाने में लग गए। लेकिन बच्चे बड़ों से ज़्यादा बहादुर थे, जैसे बच्चे होते ही हैं, और एक शाम उनमें से कुछ ऊपर चढ़ आए और सीधे उससे पूछ ही लिया: "जब आपकी पूरे दिन की मेहनत लुढ़क कर नीचे चली जाती है, तो आप हँसते क्यों हैं?"',
      text: '"Mad," said the villagers, comfortably, and went back to their dinners. But the children were braver than the grown-ups, the way children are, and one evening a few of them climbed up and asked him straight out: "Why do you laugh when your whole day\'s work rolls away?"',
      ask: {
        q: 'Well? Why WOULD a man laugh as his whole day\'s work rolls back down the hill?',
        options: ['Because he is silly and does not understand', 'Because the rolling down is part of the game — and he chose the game himself', 'Because he is really crying inside'],
        answer: 1,
        right: 'That is the answer Kerala has settled on, after a few hundred years of thinking about it. Nobody gave him that task. Nobody could take it from him. He was free.',
        wrong: 'The children thought that too, at first. But look again. Nobody gave him that task, nobody paid him for it, nobody could fire him from it or cheat him at it. He chose it. He was free.'
      } },
    { art: ['courtier'], who: 'courtier',
      hi: '"घाटी में हर कोई दिन भर किसी न किसी चीज़ को पहाड़ पर ऊपर धकेलता रहता है," उसने अपनी आँखें पोंछते हुए बच्चों से कहा। "पैसे को पहाड़ के ऊपर चढ़ाओ, और वह नीचे लुढ़क जाता है। शोहरत को ऊपर चढ़ाओ, और वह नीचे लुढ़क जाती है। वे हर शाम इसी बात पर रोते हैं। सिर्फ़ मैं ही अकेला था जो जानता था कि यह लुढ़केगा — इसलिए सिर्फ़ मैं ही हँस रहा हूँ।" और उसने उस भारी पत्थर को किसी बूढ़े बैल की तरह थपथपाया।',
      text: '"Everyone in the valley pushes something uphill all day," he told the children, wiping his eyes. "Money up the hill, and it rolls down. Fame up the hill, and it rolls down. They cry about it every evening. I am the only one who knew it would roll — so I am the only one laughing." And he patted the boulder like an old bullock.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'कहानी कहती है कि एक रात, वह एक ऐसी जगह सोने के लिए लेट गया जहाँ लोग अँधेरा होने के बाद जाने से बचते थे। आधी रात को, जैसा कि पुरानी कथाओं में होता है, देवी भद्रकाली अपने शोर मचाने वाले साथियों के साथ वहाँ से गुज़रीं, और उन्होंने देखा कि एक आदमी वहाँ बिल्कुल बेपरवाह, चैन से लेटा हुआ है। उन्हें बड़ा अचरज हुआ। आज तक कोई भी इतना बेपरवाह नहीं रहा था।',
      text: 'One night, the story says, he settled down to sleep in a place people avoided after dark. In the middle of the night the great goddess Bhadrakali came through with her noisy companions, as she does in the old tales, and found a man calmly lying there, entirely unbothered. She was intrigued. Nobody was ever unbothered.' },
    { art: ['durga', 'courtier'], who: null,
      hi: '"मुझसे कुछ माँगो," देवी ने कहा, जिन्हें वह काफ़ी पसंद आया था। नारनथ ने ज़रा सोचा। उसने पूछा कि उसका जीवन कब समाप्त होगा, और देवी ने बता दिया, क्योंकि उसने यह बात इतने शांत मन से पूछी थी। "क्या मुझे एक दिन और मिल सकता है?" नहीं, उन्होंने कहा — यह नहीं दिया जा सकता। "तो फिर एक दिन कम?" वह भी नहीं। "तो फिर, अम्मा," नारनथ ने कहा, "जो वरदान मुझे सचमुच चाहिए, वह कोई नहीं दे सकता।"',
      text: '"Ask me for something," said the goddess, who rather liked him. Naranath thought about it. He asked when his life would end, and she told him, because he asked so calmly. "Could I have one day more?" No, she said — that is not given. "One day less, then?" Not that either. "Then, Amma," said Naranath, "the boons I actually need, nobody can give."' },
    { art: ['durga', 'courtier'], who: 'courtier', mood: 'wow',
      hi: 'देवी ने ज़िद की — वरदान तो वरदान होता है। इसलिए नारनथ ने नीचे अपने पैरों की तरफ़ देखा। बचपन से ही उसका एक पैर सूजा हुआ था, और उसमें दर्द रहता था। "तो फिर यह सूजन," उसने कहा, "मेरे बाएँ पैर से हटाकर दाएँ पैर में कर दीजिए। ज़रा बदलाव के लिए।" और उन्होंने वैसा ही कर दिया। और नारनथ उस पत्थर को देखकर जितना हँसा था, उससे भी कहीं ज़्यादा ज़ोर से हँसा — और कहानी कसम खाकर कहती है कि देवी भी उसके साथ हँस पड़ीं।',
      text: 'The goddess insisted — a boon is a boon. So Naranath looked down at his legs. One had been swollen since he was young, and ached. "Then move the swelling," he said, "from my left leg to my right. For a change." And she did. And Naranath laughed harder than he had ever laughed at the boulder — and the goddess, the story swears, laughed with him.' },
    { art: ['courtier'], who: null,
      hi: 'वह ज़िंदगी भर इस धरती पर चलता रहा—न कुछ चाहा, न किसी की देनदारी रखी, और सही मौकों पर हँसता रहा। और जो लोग उसे पागल कहते थे, वे धीरे-धीरे समझ गए कि पूरे केरल में वही अकेला इंसान था जिसे कोई दुखी नहीं कर सकता था।',
      text: 'He walked on through the land all his life, wanting nothing, owing nothing, laughing at the right moments — and the ones who called him mad slowly noticed that he was the only person in Kerala nobody could make unhappy.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'लोग आज भी साल में एक बार रायिरनेल्लूर की उसकी पहाड़ी पर चढ़ते हैं, उस जगह खड़े होने के लिए जहाँ वह भारी पत्थर रखा था। तुम भी एक काम करके देखो: कोई ऐसा छोटा सा काम चुनो जो तुमसे किसी ने करने को न कहा हो, और उसे सिर्फ अपने लिए करो। देखो कैसा लगता है। इसी एहसास पर तो नारानथ हँस रहा था।',
      text: 'People still climb his hill at Rayiranellur, once a year, to stand where the boulder stood. Here is a thing to try: choose one small task nobody asked you to do, and do it just for you. See how it feels. That feeling is what Naranath was laughing about.' }
  ],
  moral: 'A person who chooses their own task and wants nothing else can never be made unhappy — and whether that is madness or wisdom, Kerala is still happily arguing.',
  source: 'Naranath Branthan, one of the panthirukulam, from Kerala oral tradition and the Aithihyamala; his hill at Rayiranellur near Pattambi is still climbed each year. Many tellings.'
},

{
  id: 'fk.kochunni',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Man the Poor Would Not Give Up',
  hook: 'Soldiers searched every house in Kayamkulam for one man. Every house had fed him the night before, and nobody said a word.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['इंसाफ़', 'insaaf', 'fairness'], ['ग़रीब', 'gareeb', 'poor'], ['दरवाज़ा', 'darwaaza', 'door']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पुराने त्रावणकोर के बैकवाटर वाले इलाके कायमकुलम में कभी कोचुन्नी नाम का एक लड़का रहता था, जो बेहद गरीब था—इतना गरीब कि मदद का कोई सहारा तक न था। वह खाने के बदले एक दुकानदार की दुकान में झाड़ू लगाता था, बड़ा फुर्तीला था, और हर चीज़ पर नज़र रखता था।',
      text: 'In Kayamkulam, in the backwater country of old Travancore, there was once a boy called Kochunni who was poor in the way that has no cushion under it at all. He swept a shopkeeper\'s floor for his food, and he was quick, and he watched everything.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'वह सबसे ज़्यादा कलरी को देखता था—वह अखाड़ा जहाँ लड़के केरल की पुरानी युद्ध-कला कलरीपायट्टु सीखते थे। वह जगह उसके जैसे लड़कों के लिए नहीं थी; वहाँ सीखने का खर्च उसके लिए कोई नहीं उठाने वाला था। इसलिए वह हर शाम बाड़ के पीछे से देखता, और जो देखता, चाँदनी रात में अकेले उसी का अभ्यास करता, जब तक कि वे सारे दाँव-पेंच उसके शरीर में बस नहीं गए।',
      text: 'What he watched most was the kalari — the training yard where boys learned kalaripayattu, the old exercise art of Kerala. It was not for boys like him; nobody would pay his way in. So he watched through the fence, every evening, and practised what he saw, alone, by moonlight, until the moves lived in his body.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'एक रात गुरुजी ने उसे ऐसा करते देख लिया। वे साये में खड़े रहे और दुकान के उस लड़के को पूरी शाम का सबक अकेले, बिल्कुल सही तरीके से दोहराते देखते रहे। आखिरकार गुरुजी ने कहा, "अंदर आ जाओ। जो लड़का बाड़ के पीछे से खुद सीख सकता है, उसे मैं बाहर नहीं रखूँगा।"',
      text: 'The teacher caught him at it one night. Stood in the shadows and watched a shop boy run through the whole evening\'s lesson, alone, correctly. "Come inside," said the teacher at last. "A boy who teaches himself through a fence will not be kept out by me."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'कोचुन्नी बड़ा होकर ताक़तवर और फुर्तीला बना, बिल्ली की तरह दीवार पर चढ़ने और बिना किसी आवाज़ के आँगन पार करने में माहिर। और यहाँ आकर कहानी की मुस्कान एक पल के लिए थम जाती है, क्योंकि उसने इन सब खूबियों से जो किया। उसने चीज़ें लीं। उन लोगों के बंद गोदामों से, जो भूखों को निचोड़कर अमीर बने थे—मगर उसने लिया, और लेना तो लेना ही होता है, और यह कहानी कोई और दिखावा नहीं करने वाली।',
      text: 'Kochunni grew up strong and quick, able to climb a wall like a cat and cross a courtyard without a sound. And here the story stops smiling for a moment, because of what he did with all that. He took things. From the locked storerooms of men who had grown rich squeezing the hungry — but he took, and taking is taking, and this story is not going to pretend otherwise.' },
    { art: ['courtier'], who: null,
      hi: '"मगर कायमकुलम को असल में क्या याद है, और वह उसे याद ही क्यों करता है, वह बात यह है। उसने कभी भी किसी गरीब के घर को हाथ तक नहीं लगाया। और उन गरीब घरों ने एक बात और देखी: तंगी के महीने के बाद, किसी विधवा की चौखट पर सिक्कों की एक छोटी-सी पोटली मिलती। जिस घर का चूल्हा ठंडा पड़ चुका होता, उसके दरवाज़े के अंदर चावल की एक बोरी रखी मिलती। किसी ने नहीं देखा कि किसने रखी। पर हर कोई जानता था कि कौन था।"',
      text: 'But here is what Kayamkulam actually remembers, and why it remembers him at all. He never, ever touched a poor house. And the poor houses noticed something else: after a hard month, a small bag of coins on the widow\'s doorstep. A sack of rice inside a door where the cooking fire had gone cold. Nobody saw who. Everybody knew who.' },
    { art: ['guard'], who: null,
      hi: '"और उसकी ज़बान पत्थर की लकीर थी। अगर कोचुन्नी ने कह दिया कि कोई बात होगी, तो वह होकर रहती थी; अगर उसने किसी को हिफ़ाज़त का भरोसा दे दिया, तो वह आदमी पूरी तरह सुरक्षित था। यहाँ तक कि जिन व्यापारियों को उसने लूटा था, वे भी दाँत पीसते हुए यही मानते थे: वह चोर पूरे इलाके का सबसे सच्चा और खरा इंसान था।"',
      text: 'And his word was iron. If Kochunni said a thing would happen, it happened; if he promised a man safety, that man was safe. Even the merchants he had robbed admitted it through their teeth: the thief was the fairest man in the district.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"इसलिए जब सिपाही घर-घर जाकर उसकी तलाशी लेने कायमकुलम पहुँचे, तो उन्हें कुछ ऐसा मिला जिसकी उन्होंने उम्मीद भी नहीं की थी। सन्नाटा। हर गली में, हर चौखट पर, हर मछुआरे, धोबन और धान के किसान की तरफ़ से: किसी ने उसे नहीं देखा था। किसी को कुछ भी नहीं पता था।"',
      text: 'So when the soldiers came to Kayamkulam to search for him, house by house, they found something they had not planned for. Silence. In every lane, in every doorway, from every fisherman and washerwoman and rice farmer: nobody had seen him. Nobody knew anything at all.',
      ask: {
        q: 'The soldiers offer a reward. The poor of Kayamkulam are very poor. Why does nobody talk?',
        options: ['They were too afraid of him', 'He had been fair to them when nobody else was — and people protect the one who protected them', 'They wanted a share of what he took'],
        answer: 1,
        right: 'That is it exactly. You cannot buy back a loyalty like that with a reward. It is only ever earned one fairness at a time.',
        wrong: 'The story is very clear that it was not that. He had been fair to them when nobody else in the world was — and people will protect, with their silence, the one who protected them.'
      } },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"आख़िरकार कानून के हाथ उस तक पहुँच ही गए, जैसा कि हमेशा होता है, और उसके आख़िरी साल सलाखों के पीछे बीते। और तब भी — पुरानी कहानियों में इसी बात को बड़े चाव से याद किया जाता है — लोग उसके लिए खाना ले जाते, ज़ोर-ज़ोर से उसके किस्से सुनाते, और सवालों के जवाब देते हुए उसका नाम छिपाते रहे।"',
      text: 'The law caught up with him in the end, because it does, and his last years were spent locked away. And even then — this is the part the old tellings linger on — people carried food to him, and told his stories out loud, and went on leaving his name out of their answers.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"केरल में आज भी कोचुन्नी को लेकर बहस होती है, और इसीलिए वह एक कहानी बन गया है: बड़ों को उलझी हुई बातों पर बिना किसी डर के बहस करने के लिए कोई सुरक्षित जगह चाहिए होती है। छीनना गलत था। खरा होना दुर्लभ था। ये दोनों बातें एक साथ सच हैं, और एक अच्छी कहानी इन दोनों को अपने भीतर समेट सकती है।"',
      text: 'Kerala still argues about Kochunni, and that is exactly why he is a story: grown-ups need somewhere safe to argue about hard things. Taking was wrong. Being fair was rare. Both of those are true at once, and a good story can hold them both.' }
  ],
  moral: 'Taking is taking, and the story knows it. What the people could not forget was the rarer thing — a strong man who was fair to the weak when nobody else was.',
  source: 'Kayamkulam Kochunni, from Travancore oral tradition and the Aithihyamala. The tradition remembers his fairness and his word; the law remembered the rest; this telling keeps both, which is what the tradition itself does.'
},

{
  id: 'fk.kathanar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Priest Who Talked to the Dark',
  hook: 'Things went bump in the night all over Kerala. One priest would put on his cloak, pick up his lamp, and go and have a word with them.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['दीया', 'diya', 'lamp'], ['रात', 'raat', 'night'], ['डर', 'dar', 'fear']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"ईसाई लोग केरल में बहुत-बहुत पुराने ज़माने से रहते आए हैं — ज़्यादातर यूरोप से भी पहले से, और वे यह बात बड़े गर्व से बताते हैं। हरी-भरी नीची पहाड़ियों के बीच कडामट्टम में उनका एक पुराना गिरजाघर खड़ा है, और यह कहानी उसी की है: उसके सबसे मशहूर पादरी की कहानी।"',
      text: 'Christians have lived in Kerala for a very, very long time — longer than in most of Europe, they will tell you, and proudly. At Kadamattom, among low green hills, stands one of their old churches, and this story belongs to it: the story of its most famous priest.' },
    { art: ['courtier'], who: null,
      hi: 'शुरुआत में वह पौलोस नाम का एक लड़का था, जो चर्च के मवेशियों की देखभाल करता था। एक दिन, एक भटकी हुई गाय के पीछे-पीछे वह घने ऊंचे जंगल में बहुत दूर निकल गया और रास्ता भटक गया। जिन लोगों को वह मिला, वे पहाड़ी लोग थे, जो किसी भी शहर से बहुत दूर रहते थे। वे जंगल और रात के बारे में ऐसी बातें जानते थे जिन्हें घाटी के लोग कब का भूल चुके थे। उन्होंने उसे सालों तक अपने पास रखा और बहुत कुछ सिखाया।',
      text: 'He began as a boy called Poulose who looked after the church\'s cattle, and one day, following a strayed cow, he went too far into the high forest and was lost. The people who found him were hill people who lived far from any town, and who knew things about the forest and the night that the valley folk had long forgotten. They took him in for years, and taught him.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'आखिरकार जब वह घर लौटा, तो उसने चर्च की सेवा की और समय के साथ वहां का पादरी बन गया — यानी \'कतनार\', जो केरल में पादरी के लिए एक पुराना शब्द है। कदमत्तथु कतनार: यानी कदमत्तम् का पादरी। और धीरे-धीरे यह बात चारों तरफ फैल गई कि इस पादरी को अंधेरे से बिल्कुल डर नहीं लगता था। ज़रा भी नहीं।',
      text: 'When he came home at last, he served his church and in time became its priest — its kathanar, which is simply the old Kerala word for a priest. Kadamattathu Kathanar: the priest of Kadamattom. And word slowly went round that this particular priest was not afraid of the dark. At all.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'क्योंकि उसने पहाड़ों में एक बात सीखी थी, और वह सीखने लायक बात है: अंधेरा ज़्यादातर अकेली चीज़ों से भरा होता है, बुरी चीज़ों से नहीं।',
      text: 'Because here is what he had learned in the hills, and it is worth learning: the dark is mostly full of lonely things, not wicked ones.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक बार एक परिवार उनके पास आया, बिल्कुल थका-हारा और उतरा हुआ चेहरा लिए। उनके घर में कुछ था। बर्तन अपने आप खिसकने लगते थे। बिना हवा वाली रातों में भी छत खड़खड़ाती थी। हफ़्तों से कोई सोया नहीं था। कतनार ने अपनी लालटेन उठाई और उनके साथ उनके घर चल दिए। वे सबसे ज़्यादा आवाज़ वाले कमरे के बीचो-बीच बैठ गए और घुप अंधेरा होने का इंतज़ार करने लगे।',
      text: 'A family came to him once, worn out and grey-faced. Something was in their house. Pots shifted by themselves. The roof rattled on windless nights. Nobody had slept in weeks. The Kathanar picked up his lamp and walked home with them, and sat down in the middle of the noisiest room, and waited for full dark.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'और फिर उन्होंने वह किया जो करने की कभी कोई सोचता भी नहीं। उन्होंने उस खाली कमरे से बात की, बड़े आदर से, जैसे किसी मेहमान से बात की जाती है। "हाँ," उन्होंने कहा, "अब सबका ध्यान तुम्हारी तरफ है। तुम क्या चाहते हो?"',
      text: 'And then he did the thing nobody ever thinks to do. He spoke to the empty room, politely, the way you speak to a guest. "Well," he said. "You have everyone\'s attention now. What is it you want?"',
      ask: {
        q: 'Nobody had ever asked it a question before. What does the thing in the dark actually want?',
        options: ['To frighten everyone away', 'It had been forgotten, and wanted somewhere to belong', 'The family\'s gold'],
        answer: 1,
        right: 'That was it. It was lonely and forgotten, and rattling the pots was the only way it knew to say so. Frightened things and frightening things are usually the same things.',
        wrong: 'The Kathanar listened for a long time, and it was nothing like that. It had been forgotten, and it wanted somewhere to belong. Frightened things and frightening things are usually the same things.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'तो उन्होंने उसे वही दिया जो वह चाहता था। उसकी अपनी एक जगह — ज़मीन के कोने पर खड़ा एक बड़ा पुराना पेड़ — और उससे भी बढ़िया, एक ज़िम्मेदारी: पहरेदारी करने की। "आत्माएं शादी में आए बच्चों की तरह होती हैं," कतनार कहा करते थे। "अगर उन्हें अनदेखा करो, तो आफत बन जाती हैं। और अगर कोई काम सौंप दो, तो कमाल कर दिखाती हैं।" बर्तन फिर कभी नहीं हिले, और परिवार चैन से सोया।',
      text: 'So he gave it what it wanted. A place of its own — a great old tree at the edge of the land — and, even better, a job: keeping watch. "Spirits are like children at a wedding," the Kathanar used to say. "Dreadful when ignored. Magnificent when given something to do." The pots never moved again, and the family slept.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक कहानी बताती है कि एक साया रात के रास्ते पर मीलों तक उनके पीछे लगा रहा, पूरे रास्ते शरारत की तरकीबें सोचता रहा — और कदमट्टम पहुँचते-पहुँचते, न जाने कैसे, उनका दोस्त बन गया और वहीं बस गया। उनके साथ यही दस्तूर था। जो कोई भी कथनार को डराने निकला, वह अंत में उन्हीं के काम में लग गया।',
      text: 'One story tells of a spirit who followed him for miles along a night road, planning mischief the whole way — and who arrived at Kadamattom, somehow, as his friend, and stayed. That was the pattern with him. Whatever set out to frighten the Kathanar ended up working for him.' },
    { art: ['guard'], who: null,
      hi: 'और हर धर्म के लोग उन्हें बुलावा भेजते थे — हिंदू परिवार, मुस्लिम परिवार, ईसाई परिवार — क्योंकि अंधेरे में जलता दीया दरवाज़े पर लिखा नाम नहीं देखता। वे अपने पादरी वाले चोगे में, अपना दीया लिए, बिना किसी फ़र्क के सबके पास जाते थे।',
      text: 'And people of every faith sent for him — Hindu households, Muslim households, Christian households — because a lamp in the dark does not check the name on the door. He went to all of them alike, in his priest\'s robes, with his lamp.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'कदमट्टम का वह पुराना गिरजाघर आज भी वहीं है, और केरल आज भी कथनार की कहानियाँ सुनाता है — हमेशा नरमी से, हमेशा एक मुस्कान के साथ, क्योंकि वे खुद हर काम ऐसे ही करते थे। अगली बार जब कोई अंधेरा कोना तुम्हें डराए, तो उनका तरीका आज़माकर देखना। एक रोशनी आगे करो, और उससे प्यार से एक सवाल पूछो।',
      text: 'The old church at Kadamattom is still there, and Kerala still tells the Kathanar\'s stories — always gently, always with a smile, because that is how he did everything. Next time a dark corner worries you, try his method. Hold up a light, and ask it a kind question.' }
  ],
  moral: 'Most fears shrink when somebody holds up a lamp and asks the dark a kind question.',
  source: 'Kadamattathu Kathanar, the priest of Kadamattom church, from Kerala Christian oral tradition and the Aithihyamala. His tales are told all over Kerala with great affection, which is exactly how this one is told.'
},

{
  id: 'fk.theyyam-mirror',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Night Grandfather Became a Goddess',
  hook: 'All night they painted his face. At dawn they held up a mirror — and the person who looked back was not grandfather.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'durga'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['आईना', 'aaina', 'mirror'], ['नाच', 'naach', 'dance'], ['भोर', 'bhor', 'dawn']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'केरल के सुदूर उत्तर में — कन्नूर, कासरगोड, जिसे लोग मालाबार का इलाक़ा कहते हैं — वहाँ देवता इस इंतज़ार में नहीं बैठते कि कोई उनसे मिलने आए। साल में एक बार, ठंड के मौसम में, वे खुद गाँव आते हैं, और नाचते हुए आते हैं। इसे थैय्यम कहते हैं, और दुनिया में कहीं भी इसके जैसा कुछ और नहीं है।',
      text: 'In the far north of Kerala — Kannur, Kasaragod, the country they call Malabar — the gods do not wait to be visited. Once a year, in the cool season, they come to the village themselves, and they come dancing. It is called theyyam, and there is nothing else quite like it anywhere.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'देवू नाम की एक लड़की एक रात यह देखने के लिए जागी रही कि उसके अपने दादाजी के साथ यह कैसे होता है। वे मंदिर के आँगन में चटाई पर बिल्कुल शांत बैठे रहे, जबकि कलाकार दीयों की रोशनी में घंटों उन पर काम करते रहे — नारंगी, लाल और काला रंग, नारियल की सींक से उनके चेहरे पर खींची जाती बारीक रेखाएँ, और पास ही तैयार होता एक मुकुट जो दरवाज़े से भी ऊँचा था।',
      text: 'A girl called Devu sat up one night to watch it happen to her own grandfather. He sat perfectly still on a mat in the temple yard while artists worked on him by lamplight, hour after hour — orange and red and black, fine lines drawn on his face with a slip of coconut leaf, a headdress being built nearby that stood taller than a door.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'उसका परिवार पीढ़ियों से इस थैय्यम को संजोता आ रहा था — रंग-रूप, गीत, नाच के कदम, जो ज़मीन की तरह पीढ़ी-दर-पीढ़ी सौंपे गए थे। और यह बात सचमुच ठहरकर सोचने वाली है। मालाबार में देवताओं का रूप धरने वाले ज़्यादातर परिवार वे हैं, जिन्हें दूसरों ने हमेशा सबसे पीछे रखा — उनके काम की वजह से, और जिन घरों में वे पैदा हुए उस वजह से। थैय्यम की रात, यह सब कुछ पूरी तरह पलट जाता है।',
      text: 'Her family had carried this theyyam for generations — the painting, the songs, the steps, handed down like land. And here is the part to sit with. The families who carry the gods in Malabar are, most of them, families whom others too often put last — for the work they did, and the houses they were born into. On theyyam night, that turns upside down.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'क्योंकि जब भोर से पहले ढोल बजने लगे, तो हर कोई आया, हर कोई खड़ा रहा, और सबने उसके दादाजी की प्रतीक्षा की। वह ज़मींदार जिसके खेतों में वे काम करते थे। दुकानदार। मास्टरजी। इस रात, इस आँगन में, जिस इंसान के पास से वे साल भर यूँ ही निकल जाते थे, आज उसी के आगे सिर झुकाने वे सब आए थे।',
      text: 'Because when the drums began before dawn, everyone came, and everyone stood, and everyone waited on her grandfather. The landowner whose fields he worked. The shopkeeper. The teacher. On this night, in this yard, the man they walked past all year was the one they had all come to bow to.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'उनके सिर पर मुकुट सजाया गया। ढोल की थाप तेज़ होती गई। और फिर वह पल आया जिसकी तैयारी में पूरी रात बीती थी: उनके रंगे हुए चेहरे के सामने एक छोटा-सा आईना लाया गया। उन्होंने उसमें देखा। और कहानियों में सब यही मानते हैं — उस आईने में से जो वापस देखता है, वह अब कोई कलाकार नहीं होता। देवू के दादाजी ने आईने में देखा, और उसमें से देवी बाहर देख रही थीं।',
      text: 'The headdress was lifted onto him. The drums climbed. And then came the moment the whole night had been building to: they held up a small mirror in front of his painted face. He looked into it. And the tellings all agree — the person who looks back out of that mirror is not the performer anymore. Devu\'s grandfather looked into the glass, and the goddess looked out.' },
    { art: ['durga'], who: null,
      hi: 'उस बची हुई पूरी रात, देवी उसी आँगन में रहीं — मशालों की रोशनी में घूमती हुईं, दमकती हुईं, विशाल रूप में — और गाँव वाले वह कर सके जो वे आम तौर पर कभी नहीं कर पाते: अपनी देवी के पास जाना और उनसे बातें करना।',
      text: 'For the rest of that night, the goddess was in the yard — turning, blazing, enormous under the torches — and the village could do what a village can never usually do: walk up to its goddess and talk to her.',
      ask: {
        q: 'The goddess is standing in your own courtyard, listening. What do people ask her?',
        options: ['For gold and treasure', 'About the crops, the children, and the quarrels that need settling', 'To see magic tricks'],
        answer: 1,
        right: 'That is what a village actually needs. Rain for the fields, health for the little ones — and two stubborn neighbours told, by someone they cannot argue with, to make it up.',
        wrong: 'Nobody wastes the goddess\'s time on that. They ask about the crops, the children — and the quarrels. Two stubborn neighbours, told by someone they cannot argue with to make it up, make it up.'
      } },
    { art: ['durga', 'courtier'], who: null,
      hi: 'देवी ने नाम ले-लेकर हर किसी को आशीर्वाद दिया — वे सबको जानती थीं। जहाँ ज़रूरत थी, वहाँ उन्होंने हलके से डाँटा भी। उन्होंने उन दो घरों का झगड़ा सुलझा दिया जो उस शादी के बाद से एक-दूसरे से बोले तक नहीं थे। और ढोल किसी ज़मीन की तरह इस सब को साधे रहे, जब तक कि आसमान धूसर नहीं हो गया।',
      text: 'The goddess blessed each person by name — she knew them all. She scolded gently where scolding was needed. She settled the quarrel between the two houses that had not spoken since the wedding. And the drums held it all up like a floor, till the sky went grey.' },
    { art: ['courtier'], who: null,
      hi: 'सुबह होते ही मुकुट उतार लिया गया, चेहरे का रंग पोंछ दिया गया, और वहाँ चटाई पर देवू के दादाजी बैठे थे — फिर से बिल्कुल सामान्य, बेहद थके हुए, काँपते हाथों से गरम चाय पीते हुए। देवू दबे पाँव उनके पास गई और उनसे पूछा: "देवी कहाँ चली गईं?"',
      text: 'At dawn the headdress was lifted off, and the paint was wiped away, and there on the mat sat Devu\'s grandfather — small again, tired to the bone, drinking hot tea with both hands wobbling. Devu crept up and asked him: "Where did the goddess go?"' },
    { art: ['courtier'], who: 'courtier',
      hi: '"अपने घर," सुबह की ओर देखते हुए दादाजी बोले। "अगले साल तक के लिए।" उन्होंने चाय की एक और घूँट भरी, और उसकी तरफ़ देखकर मुस्कुराए। "चिंता मत करो। अब उन्हें रास्ता पता है।"',
      text: '"Home," said her grandfather, looking out at the morning. "Until next year." He took another sip of tea, and smiled at her. "Don\'t worry. Now she knows the way."' },
    { art: ['courtier'], who: 'mithu',
      hi: '"तेय्यम सिर्फ उत्तरी मालाबार में होता है, दुनिया में कहीं और नहीं, और यह कोई तमाशा नहीं है — यह तो साक्षात आगमन है। अगर तुम कभी ठंड के मौसम में वहाँ जाओ, तो मंदिर के आँगन में रात भर बैठकर देख सकते हो, और मालाबार का हर परिवार तुम्हें बता सकता है कि उनका तेय्यम कौन-सा है।"',
      text: 'Theyyam happens only in north Malabar, nowhere else in the world, and it is not a show — it is a visit. If you are ever there in the cool season, you can sit up all night in a temple yard and watch, and every Malabar family can tell you which theyyam is theirs.' }
  ],
  moral: 'For one night, the person everyone overlooked stands where the goddess stands — and the whole village is reminded who has been carrying whom.',
  source: 'The theyyam traditions of North Malabar — Kannur and Kasaragod districts, Kerala — where hereditary artist families perform the gods each year in the temple yards. A living oral tradition; ask a Malabar family about theirs.'
},

{
  id: 'fk.aranmula-boat',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Race That Nobody Must Win',
  hook: 'Every year, long snake boats sweep down the river at Aranmula. And the oldest rule of the day says the point is not to come first.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'krishna'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['नाव', 'naav', 'boat'], ['नदी', 'nadi', 'river'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['krishna'], who: null,
      hi: '"पंपा नदी के किनारे आरनमुला का मंदिर है, जहाँ कृष्ण की पूजा पार्थसारथी के रूप में होती है — यानी अर्जुन के सारथी, वो सखा जो रथ हाँकते हैं। याद रखना कि यहाँ वही राह दिखाने वाले सखा बसते हैं। कहानी के अंत के लिए यह बात बहुत मायने रखती है।"',
      text: 'On the banks of the river Pampa stands the temple of Aranmula, where Krishna is worshipped as Parthasarathy — Arjuna\'s charioteer, the friend who steers. Remember that it is the steering-friend who lives here. It matters to how this story ends.' },
    { art: ['courtier'], who: null,
      hi: '"पुरानी कथा है कि नदी के ऊपरी छोर पर रहने वाले एक परिवार को एक बड़ा सम्मान मिला था: हर साल ओणम के समय, उनकी नाव पंपा नदी के रास्ते मंदिर के महाभोज की रसद ले जाती थी — चावल और नारियल, केले और गुड़, हर आने वाले इंसान का पेट भरने के लिए ज़रूरी हर एक चीज़, ताकि कोई भी भूखा न लौटे।"',
      text: 'Long ago, the legend says, one household upriver was given a great honour: every year at Onam time, their boat would carry the provisions for the temple feast down the Pampa — rice and coconuts, plantains and jaggery, everything needed to feed every single person who came, with nobody turned away.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      hi: '"और एक साल, नदी के एक वीरान और अंधेरे हिस्से में, किनारों की परछाइयों से चुपके से कुछ नावें बाहर निकलीं। वे ऐसे लोग थे जो महाभोज की सामग्री खुद हड़पना चाहते थे। रसद वाली नाव धीमी, भारी और अकेली थी, नदी बहुत लंबी थी, और रात बेहद अंधेरी।"',
      text: 'And one year, on a lonely dark stretch of the river, boats slid out from the shadows of the banks. Men who wanted the feast for themselves. The provision boat was slow and heavy and alone, and the river was long, and the night was very dark.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"लेकिन नदी का किनारा कभी उतना सूना नहीं होता जितना दिखता है। ख़बर पानी के ऊपर किसी भी नाव से भी तेज़ दौड़ी — एक पुकार, एक दिया, एक शंख — और एक के बाद एक गाँव ने अपनी नावें पानी में उतार दीं। और उन गाँवों के पास थीं चुंडन वल्लम: यानी सर्प नौकाएँ। दस घरों जितनी लंबी, पीछे से फन उठाए नाग की तरह मुड़ी हुई, और एक-एक नाव में सौ-सौ मल्लाह।"',
      text: 'But a river bank is never as empty as it looks. Word ran along the water faster than any boat — a shout, a lamp, a conch — and village after village pushed out what it had. And what those villages had were chundan vallams: snake boats. Long as ten houses, curled high at the stern like a cobra\'s raised hood, a hundred rowers to a boat.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: '"अब, चालीस तेज़ नावें एक धीमी नाव की पहरेदारी कर रही थीं। और ऐसा करने का एक सही तरीका होता है, और एक ग़लत तरीका।"',
      text: 'Now, forty fast boats guarding one slow one. There is a right way and a wrong way to do that.',
      ask: {
        q: 'How do the snake boats protect the slow, heavy feast boat?',
        options: ['Race ahead to the temple and wait for it there', 'Stay beside it the whole way, every boat matching the slow boat\'s pace', 'Tow it as fast as possible'],
        answer: 1,
        right: 'That is what they did. A moving fence of boats, all the way down the Pampa — every fast boat rowing exactly as slowly as the slowest one needed.',
        wrong: 'That would have left it alone on the dark water again. They stayed beside it — a moving fence of boats, every fast boat rowing exactly as slowly as the slowest one needed.'
      } },
    { art: ['courtier'], who: null,
      hi: 'दावत का सामान पहुँच गया। मंदिर ने सबको भोजन कराया, और किसी को भी वापस नहीं लौटाया गया। और कहानी मुस्कुराकर कहती है कि पार्थसारथी — जिन्होंने महायुद्ध में ख़ुद लड़ने के बजाय सिर्फ़ रथ हाँका, उस एक इंसान के ठीक साथ रहकर जिसे उनकी ज़रूरत थी — उस साल बहुत प्रसन्न हुए, और सिर्फ़ खाने की वजह से नहीं।',
      text: 'The feast arrived. The temple fed everyone, with nobody turned away. And the story smiles and says that Parthasarathy — who spent the great war not fighting but steering, right beside one man who needed him — was pleased that year, and not mainly by the food.' },
    { art: ['krishna', 'courtier'], who: null,
      hi: 'तो यह एक नियम बन गया, और फिर एक त्योहार। हर साल ओणम के मौसम में, पंपा नदी के गाँवों की सर्प नौकाएँ लौट आती हैं और दावत वाली नाव के साथ-साथ नदी में आगे बढ़ती हैं — ताल में चमकते हुए चप्पू, ताल मिलाते वंचिपाट्टु नाम के नाविक गीत, और किनारों पर गाते हज़ारों लोग।',
      text: 'So it became the rule, and then the festival. Every year in the Onam season, the snake boats of the Pampa villages come back and go down the river with the feast boat — oars flashing in time, the boat songs called vanchipattu keeping the stroke, thousands singing on the banks.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और आरनमुला में, बड़े-बुज़ुर्ग आपको बताएंगे कि यह दिखने में भले ही कैसी भी लगे, पर असल में यह कोई दौड़ नहीं है। सारी नावें एक साथ पहुँचती हैं, क्योंकि वे वही कर रही होती हैं जो उनके परदादाओं की नावें करती थीं: उस दावत की नाव का साथ निभाना, उसकी गति से चलना जिसे उनकी ज़रूरत है। दिन तो सिर्फ़ तभी बिगड़ता है जब कोई अकेला पहुँच जाए।',
      text: 'And at Aranmula, the elders will tell you, it is not truly a race at all, whatever it looks like. The boats arrive together, because they are doing what their great-great-grandfathers\' boats did: escorting the feast, at the pace of the one who needs them. The day is only ruined if somebody arrives alone.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'इसके बाद नाविकों को ख़ुद एक शानदार दावत खिलाई जाती है — वल्ला सद्या, जो पूरे केरल में परोसी जाने वाली सबसे बड़ी दावतों में से एक है। और यह सही भी है। जिन सौ लोगों ने जानबूझकर इतनी दूर तक धीरे-धीरे चप्पू चलाए हों, उन्होंने यह दावत कमाई है।',
      text: 'Afterwards the rowers themselves are fed a proper feast — the valla sadya, one of the biggest meals served anywhere in Kerala. Fair enough, too. A hundred people who rowed all that way slowly, on purpose, have earned it.' }
  ],
  moral: 'Fast is good fun, but the feast was saved by everyone agreeing to travel at the speed of the slowest boat.',
  source: 'The legend of the Aranmula vallamkali, held in the Onam season on the river Pampa around the Aranmula Parthasarathy temple, Kerala; the valla sadya for the oarsmen continues. Oral tradition, many tellings.'
},

{
  id: 'fk.cheraman-moon',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The King Who Followed the Moon',
  hook: 'One night the king of the Kerala coast dreamed the moon split in two. He could not rest until he knew what it meant — and the answer changed his whole life.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KL'],
  words_hi: [['चाँद', 'chaand', 'moon'], ['सपना', 'sapna', 'dream'], ['यात्रा', 'yaatra', 'journey']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह वह कहानी है जो केरल के मुसलमान सुनाते हैं कि कैसे उनका धर्म पहली बार भारत पहुँचा, और यह उन्हीं की कहानी है, और यहाँ इसे उसी तरह सुनाया गया है जैसे वे सुनाते हैं — प्यार के साथ। यह कहानी कोडुंगल्लूर से शुरू होती है, जो मसालों के तट का एक बड़ा बंदरगाह था, जहाँ अरब, चीन और हर जगह से जहाज़ आते थे, और जहाँ चेरामन पेरुमल नाम के राजा राज करते थे।',
      text: 'This is the story Kerala\'s Muslims tell about how their faith first came home to India, and it is theirs, and it is told here the way they tell it — with love. It begins in Kodungallur, the great port of the spice coast, where ships came in from Arabia and China and everywhere between, and a king called Cheraman Perumal ruled.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'एक रात राजा ने एक सपना देखा। उन्होंने देखा कि समंदर के ऊपर पूरा चाँद साफ़-साफ़ दो टुकड़ों में बँट गया — और फिर आपस में जुड़कर दोबारा पूरा हो गया। वे धड़कते दिल के साथ जागे, और यह सपना आम सपनों की तरह धुंधला नहीं पड़ा। यह उनके सीने में जूते में अटके किसी कंकड़ की तरह चुभता रहा।',
      text: 'One night the king dreamed. He saw the full moon over the sea split cleanly into two halves — and then draw together and become whole again. He woke with his heart pounding, and the dream would not fade the way dreams do. It sat in his chest like a stone in a shoe.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उनके अपने विद्वानों ने इस सपने को हर तरह से समझने की कोशिश की, पर वे इसका अर्थ न खोल पाए। तभी अरब से एक जहाज़ आया, और जब उस पर सवार व्यापारियों से उनके देश का हालचाल आदर से पूछा गया, तो उन्होंने ऐसी बात कही कि राजा अपने सिंहासन पर धीरे से आगे की ओर झुक आए। दूर मक्का नाम के शहर में, लोग एक मार्गदर्शक — पैगंबर मुहम्मद की चर्चा कर रहे थे, जिनका नाम केरल के मुसलमान उनके लिए दुआ भेजे बिना कभी नहीं लेते — और उनसे जुड़ी एक निशानी की चर्चा कर रहे थे: आसमान में दो टुकड़ों में बँटा हुआ चाँद।',
      text: 'His own wise men turned the dream over and could not open it. Then a ship came in from Arabia, and the merchants aboard, asked politely about news from their country, said something that made the king sit slowly forward on his throne. Far away, in a city called Mecca, people spoke of a teacher — the Prophet Muhammad, whose name Kerala\'s Muslims never say without adding a blessing after it — and of a sign connected with him: the moon, seen parted in the sky.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'राजा बिल्कुल शांत हो गए। उनका सपना, समुद्र के उस पार से, दूसरों की ज़ुबान पर चला आ रहा था।',
      text: 'The king went very quiet. His dream, walking around in other men\'s mouths, from the other side of the sea.',
      ask: {
        q: 'A king cannot just leave. He has a whole country to run. What does he do about the question burning in him?',
        options: ['Send a messenger to go and look for him', 'Go himself — some questions cannot be answered second-hand', 'Decide to forget the dream'],
        answer: 1,
        right: 'That is what he chose. Some questions you cannot send a servant to ask for you. The heart that carries the question has to make the journey.',
        wrong: 'He thought about that, the story says, and knew it would never be enough. Some questions you cannot send a servant to ask. The heart that carries the question has to make the journey.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'तो उन्होंने वही किया जो किसी कहानी में शायद ही कोई राजा करता है: उन्होंने अपने राज्य को इस तरह व्यवस्थित किया कि वह उनके बिना भी चल सके। उन्होंने अपने सूबेदारों में राज्य के काम बाँट दिए, सारे हिसाब-किताब निपटाए, जो ज़रूरी बातें कहनी थीं वे कहीं — और फिर अपने बंदरगाह की ओर चल पड़े और पश्चिम की ओर जाने वाले जहाज़ पर सवार हो गए, अपने पीछे हरे-भरे तट को धीरे-धीरे छूटते हुए देखते हुए।',
      text: 'So he did what almost no king in any story does: he set his kingdom in order to run without him. He divided the duties of the land among his governors, settled every account, said what needed saying — and then walked down to his own harbour and boarded a ship west, watching his green coast slide away behind him.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और परंपरा बताती है कि वे अरब पहुँचे, पैगंबर से मिले, और आखिरकार आमने-सामने बैठकर अपना सवाल पूछा। और उनका दिल, जो उस सपने वाली रात से बेचैन था, एकदम शांत और निश्चिंत हो गया — ठीक वैसे जैसे कोई नाव आख़िरकार बंदरगाह पहुँचकर ठहर जाती है। उन्होंने वहाँ दोनों हाथों से नए धर्म को अपना लिया।',
      text: 'And the tradition tells that he reached Arabia, and met the Prophet, and asked his question at last, face to face. And that his heart, which had been restless since the night of the dream, went still and certain — the way a boat goes still when it finally reaches harbour. He chose the new faith there, with both hands.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'वे अपने लोगों को यह बताने की चाह लिए घर लौटने को निकले कि उन्होंने क्या पाया था। कहानी कहती है कि रास्ते में ही, अरब के तट पर बसे एक बंदरगाह वाले शहर में, उनकी यात्रा ख़ामोशी से समाप्त हो गई। पर उनके पत्र उनके बिना ही आगे बढ़ते रहे, जिन्हें उनके साथी लेकर चले — पूरब की ओर, समुद्र पार, उस तट की तरफ जिसे वे आँखें मूँदते ही देख सकते थे।',
      text: 'He set out for home, longing to tell his own people what he had found. The story says his journey ended quietly on the way, in a harbour town on the Arabian shore. But his letters travelled on without him, carried by his companions — east, across the sea, to the coast he could see when he shut his eyes.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और कोडुंगल्लूर में, जहाँ वे राजा थे, उनके दोस्तों का स्वागत किया गया — यह बात ध्यान देने लायक है; उनका स्वागत किया गया — और एक मस्जिद बनाई गई। किसी दूर देश का कोई भव्य गुंबद नहीं: केरल की एक छोटी सी इमारत, जिसकी आस-पास के मंदिरों और घरों जैसी ढलवां खपरैल वाली छतें थीं, और अंदर एक पुराना पीतल का दीया जल रहा था। परंपरा इसे चेरामन जुमा मस्जिद कहती है, भारत की पहली मस्जिद, जिसका नाम उस राजा के नाम पर रखा गया जिसने अपने सवाल का पीछा किया था।',
      text: 'And at Kodungallur, where he had been king, his friends were welcomed — that is worth noticing; they were welcomed — and a mosque was built. Not a grand dome from a far country: a small Kerala building, with sloping tiled roofs like the temples and houses around it, and an old brass lamp burning inside. Tradition calls it the Cheraman Juma Masjid, the first mosque in India, named for the king who followed his question.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'वह मस्जिद आज भी कोडुंगल्लूर में खड़ी है, दोबारा बनाई गई और सबसे प्यार पाई हुई, और याद रखने वाली बात यह है: हर धर्म के पड़ोसी उस पुराने दीये के लिए तेल लाते हैं। मस्जिद, मंदिर और चर्च बहुत लंबे समय से केरल की गलियाँ आपस में बाँटते आए हैं — और यह वही कहानी है जो वहाँ का किनारा सुनाता है कि यह सब कैसे शुरू हुआ।',
      text: 'The mosque stands in Kodungallur to this day, rebuilt and loved, and here is the detail to keep: neighbours of every faith bring oil for that old lamp. Mosque, temple and church have shared Kerala\'s streets for a very long time — and this is the story the coast tells about how that began.' }
  ],
  moral: 'He had a whole kingdom, and he traded it for an answer his heart needed — and his country ended up keeping both the kingdom and the answer.',
  source: 'The Cheraman Perumal legend of the Cheraman Juma Masjid at Kodungallur, Kerala — a tradition cherished by Kerala\'s Muslims and told here as the tradition tells it. The mosque stands, and its lamp is kept burning with oil brought by neighbours of every faith.'
},

/* ========================================================== TAMIL NADU ====== */
{
  id: 'fk.avvaiyar-naaval',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Fruit That Needed Blowing On',
  hook: 'The wisest woman in the Tamil country sat down under a tree to rest — and a small boy in the branches asked her one question that undid her.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['फल', 'phal', 'fruit'], ['रेत', 'ret', 'sand'], ['सीखना', 'seekhna', 'to learn']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अव्वैयार के बारे में ज़्यादातर कहानियाँ शुरू होने से पहले ही वह बूढ़ी हो चुकी थीं — सफ़ेद बालों वाली एक कवयित्री, जो अपने पैरों पर चलकर पूरे तमिल देश में घूमीं, और जिनके पास अपनी कविताओं के सिवा कुछ नहीं था। जब वह अंदर आतीं, तो राजा तक खड़े हो जाते थे। तमिल बच्चे आज भी कुछ और सीखने से पहले उनकी कही बातें सीखते हैं। सब मानते थे कि वह उस पूरे देश की सबसे समझदार इंसान थीं — और अब तक, मन ही मन, वह खुद भी यही मानने लगी थीं।',
      text: 'Avvaiyar was old before most stories about her even begin — a white-haired poet who walked the whole Tamil country on her own two feet, owning nothing but her verses. Kings stood up when she came in. Tamil children still learn her sayings before they learn almost anything else. She was, everyone agreed, the wisest person in the land — and by now, quietly, she agreed too.' },
    { art: ['courtier'], who: null,
      hi: 'एक तपती दोपहर, एक लंबी सड़क पर थककर और प्यास से बेहाल, वह नावल के पेड़ की छाँव में बैठ गईं — वही जामुन, जिसका गहरा जामुनी फल जीभ को स्याही की तरह रंग देता है। डालियों पर ऊपर बैठा एक छोटा ग्वाला अपनी टाँगें झुला रहा था।',
      text: 'One blazing afternoon, tired and thirsty on a long road, she sat down in the shade of a naaval tree — the jamun, whose dark purple fruit stains your tongue like ink. High in the branches, a small cowherd boy sat swinging his legs.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"पाट्टी," लड़का ऊपर से पुकारा — यानी दादी — "क्या आपको कुछ फल चाहिए?" "हाँ, बहुत मन है," अव्वैयार ने कहा। और फिर लड़के ने अपना सवाल पूछा। "मैं आपको भुना हुआ फल दूँ, या बिना भुना फल?" उसकी तमिल में यह किसी गीत जैसा लगा: सुट्टा पज़्हम, सुदाद पज़्हम?',
      text: '"Paatti," the boy called down — grandmother — "would you like some fruit?" "Very much," said Avvaiyar. And then the boy asked his question. "Shall I give you roasted fruit, or unroasted fruit?" In his Tamil it sang: sutta pazham, sudatha pazham?' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अव्वैयार ने बच्चों के इस बचपने पर एक ठंडी सांस भरी। पेड़ों पर भी कहीं फल भुना करते हैं! लेकिन उन्हें गर्मी लग रही थी, वह थकी हुई थीं और फल भी बहुत बढ़िया दिख रहे थे, इसलिए वह भी उसकी बात में शामिल हो गईं। "तो फिर भुना हुआ ही सही," उन्होंने कहा। और लड़के ने अपनी डाल हिला दी।',
      text: 'Avvaiyar sighed at the silliness of children. Fruit does not roast on trees. But she was hot and tired and the fruit looked wonderful, so she played along. "Roasted, then," she said. And the boy shook his branch.' },
    { art: ['courtier'], who: null,
      hi: 'पके-पके जामुन उनके पैरों के पास रेत में झमाझम गिर पड़े। उन्होंने उन्हें बटोरा — और बिना सोचे-समझे, खाने से पहले रेत उड़ाने के लिए हर एक पर फूँक मारी, फूँ, फूँ।',
      text: 'The ripe jamuns rained down into the sand at her feet. She gathered them up — and, without thinking, blew on each one, phoo, phoo, to puff the sand off before eating it.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      hi: 'डालियों से नीचे एक नन्हीं सी आवाज़ तैरती हुई आई, सुबह जैसी मासूम। "संभल कर, पाट्टी। क्या वे बहुत गरम हैं? मैं देख रहा हूँ कि आप उन्हें ठंडा करने के लिए फूँक मार रही हैं।"',
      text: 'A small voice floated down from the branches, innocent as morning. "Careful, paatti. Are they too hot? I see you are blowing on them to cool them."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'जामुन मुँह तक ले जाते-जाते अव्वैयार ठिठक गईं। पूरे तमिल देश की सबसे ज्ञानी स्त्री। रेत में खड़ी, भुने हुए फल पर फूँक मारती हुई। मात खा गईं — पूरी तरह से, बड़ी ही साफ़ और मीठी मात — पेड़ पर बैठे एक चरवाहे बच्चे से।',
      text: 'Avvaiyar stopped with a jamun halfway to her mouth. The wisest woman in the Tamil country. Standing in the sand, blowing on a roasted fruit. Beaten — completely, sweetly, fairly beaten — by a cowherd child in a tree.',
      ask: {
        q: 'What does the wisest person in the country do when a child catches her out?',
        options: ['Pretend it was all a joke she was in on', 'Walk away quickly before anyone sees', 'Laugh at herself, and say out loud: I still have things to learn'],
        answer: 2,
        right: 'That is exactly what she did — and it is the reason she is in this story, and the reason she was truly wise. Only a big mind can enjoy being wrong.',
        wrong: 'Not Avvaiyar. She threw back her head and laughed at herself, and said it out loud: I still have things to learn. Only a big mind can enjoy being wrong.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'और जब उन्होंने उस बालक को आदर से नमन करने के लिए ऊपर देखा, तो डालियाँ रोशनी से जगमगा उठी थीं। तमिल देश कहता है कि वह बालक स्वयं मुरुगन थे — इन पहाड़ियों के प्यारे देवता, जिन्हें तमिल भाषा से गहरा प्रेम है और एक अच्छे खेल से तो और भी ज़्यादा — जो समय रहते अपनी बूढ़ी कवयित्री को एक आख़िरी बात याद दिलाने नीचे आए थे।',
      text: 'And when she looked up to salute the child properly, the branches were full of light. The Tamil country tells that the boy was Murugan himself — the beloved god of these hills, who loves the Tamil language and loves a good game even more — come down to remind his old poet of one last thing while there was time.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'अव्वैयार ने पेड़ के आगे सिर झुकाया, और उस दिन से जुड़ी उनकी यह बात आज भी तमिल लोगों की ज़बान पर है: "कत्रदु कै मण्णलवु; कल्लाददु उलगलवु।" जो मैंने सीखा है, वह मुट्ठी भर रेत है। जो मैंने नहीं सीखा, वह यह पूरी विशाल दुनिया है।',
      text: 'Avvaiyar bowed to the tree, and the saying tradition gives her from that day is still on Tamil tongues: "Katrathu kai mann alavu; kallathathu ulagalavu." What I have learned is a handful of sand. What I have not learned is the whole wide world.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'उन्होंने अपनी लाठी उठाई और आगे चल पड़ीं, और अपनी लंबी उम्र के आख़िरी दिनों तक चलती रहीं और सीखती रहीं। ज़रा सोचिए — मुट्ठी भर रेत, और वह भी उस स्त्री के मुख से जो सबसे अधिक जानती थी। कभी अपनी मुट्ठी को भी तौल कर देखिएगा।',
      text: 'She picked up her stick and walked on, and kept walking and kept learning to the end of her long days. A handful of sand, mind you — from the woman who knew more than anyone. Weigh your own handful sometime.' }
  ],
  moral: 'The day you are sure you have finished learning, there is a child in a tree waiting for you.',
  source: 'The Avvaiyar and the naaval tree story, from Tamil oral tradition — told of the beloved elder poet whose verses Tamil children still learn first. Many tellings.'
},

{
  id: 'fk.kannagi-anklet',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Anklet Full of Rubies',
  hook: 'They said her husband stole the queen\'s anklet. Kannagi walked into the palace holding its twin — and asked the king to look inside it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-TN'],
  words_hi: [['पायल', 'paayal', 'anklet'], ['सच', 'sach', 'truth'], ['न्याय', 'nyaay', 'justice']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पुहार के महान बंदरगाह शहर में, जहाँ कावेरी पूर्वी समुद्र से मिलती है, एक युवा जोड़ा रहता था: कण्णगी, जो दीये की लौ जैसी धीर और अडिग थी, और उसका पति कोवलन, जो मनमोहक और उदार तो था, पर बहुत लापरवाह था।',
      text: 'In the great port city of Puhar, where the Kaveri meets the eastern sea, there lived a young couple: Kannagi, patient and steady as a lamp flame, and her husband Kovalan, who was charming, and generous, and not very careful.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'सारा पैसा खत्म हो गया। इसमें कुछ हाथ कोवलन का अपना भी था, वह यह बात जानता था और इसका भारी बोझ उसके मन पर था। आखिरकार उनके पास बस एक ही खज़ाना बचा था: कण्णगी की सोने की पायलों की एक जोड़ी—जिन्हें तमिल में \'सिलंबु\' कहते हैं—खोखले सोने की पायलें, जिनमें माणिक भरे थे जो उसके चलते वक्त बारिश की फुहार की तरह छनछनाते थे।',
      text: 'The money ran out. Some of that was Kovalan\'s own doing, and he knew it, and it sat heavily on him. What was left to them, in the end, was one treasure: Kannagi\'s pair of golden anklets — silambu, the Tamil calls them — hollow gold, each one filled with rubies that whispered like rain when she walked.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"हम फिर से शुरुआत करेंगे," कण्णगी ने कहा, और उसका यही पक्का इरादा था। वे लंबा रास्ता तय करके पांड्य राजाओं के शहर मदुरै पहुँचे, और कोवलन उसकी एक पायल बेचने बाज़ार ले गया, ताकि वे एक छोटी सी दुकान खोल सकें और अपनी ज़िंदगी नए सिरे से शुरू कर सकें।',
      text: '"We will start again," said Kannagi, and meant it. They walked all the long way to Madurai, the city of the Pandyan kings, and Kovalan took one of her anklets to the market to sell, so they could open a small shop and begin their life over.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'लेकिन उस शहर में, हाल ही में रानी की अपनी पायल गायब हो गई थी—जिसे खुद शाही सुनार ने ही चुराया था, और अब उसे तुरंत किसी ऐसे की तलाश थी जिस पर वह सारा इल्ज़ाम मढ़ सके। और तभी धूल में सना यह परदेसी हाथ में सोने की पायल लिए वहाँ आ पहुँचा। सुनार राजा के पास गया। राजा व्यस्त थे और चोरी की बात से गुस्से में थे, और उन्होंने वह एक सवाल भी नहीं पूछा जो एक राजा को हमेशा पूछना चाहिए। उन्होंने कोई पड़ताल नहीं की। और कोवलन कभी घर नहीं लौटा।',
      text: 'But in that city, the queen\'s own anklet had lately gone missing — taken by the royal goldsmith himself, who now needed, urgently, somebody to blame. And here came a dusty stranger, holding out a golden anklet. The goldsmith went to the king. The king was busy, and angry about the theft, and he did not ask the one question a king must always ask. He did not check. And Kovalan did not come home.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'जब यह खबर कण्णगी तक पहुँची, तो वह रो पड़ी—एक बार, फूट-फूट कर, जैसे कोई बादल फट पड़ा हो। और फिर वह थम गई। वह उठ खड़ी हुई, उसने दूसरी पायल उठाई, और उसे अपनी मुट्ठी में ऊँचा थामे मदुरै की गलियों से होती हुई महल के दरवाज़ों की ओर बढ़ चली, और पूरा शहर अपने घरों की चौखटों से बाहर निकलकर उसके पीछे-पीछे चल पड़ा।',
      text: 'When the word reached Kannagi, she wept — once, hard, like a monsoon breaking. And then she stopped. She stood up, and picked up the second anklet, and walked through the streets of Madurai to the palace gates with it held high in her fist, and the whole city came out of its doorways and followed her.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'वह पांड्य राजा के सिंहासन के सामने जा खड़ी हुई—सफ़र की साड़ी पहने एक अकेली, साधारण सी औरत, और उसकी आवाज़ ज़रा भी नहीं काँपी। "आपके सुनार का कहना है कि मेरे पति ने रानी की पायल चुराई है। यह रही उसकी दूसरी जोड़ी, जो मेरे अपने पाँव की है। मुझे बताइए, महाराज—रानी की पायलों के अंदर क्या है?"',
      text: 'She stood before the throne of the Pandyan king, one small woman in a travelling sari, and her voice did not shake. "Your goldsmith says my husband stole the queen\'s anklet. Here is its twin, from my own ankle. Tell me, King — what is inside the queen\'s anklets?"',
      ask: {
        q: 'Two golden anklets that look exactly alike. How can anyone prove whose is whose?',
        options: ['Swear an oath before the gods', 'Open them — and see what is sealed inside', 'Ask the goldsmith to decide'],
        answer: 1,
        right: 'Exactly what Kannagi had come to do. The queen\'s anklets were filled with pearls. And Kannagi knew, better than anyone alive, what was inside her own.',
        wrong: 'Kannagi had come with something better than words. Anklets are hollow, and filled — and the queen\'s were filled with pearls. Kannagi knew what was inside her own.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"मोती," राजा ने कहा। "रानी की पायलों में मोती भरे हैं।" कण्णगी ने अपना हाथ उठाया और सिंहासन के आगे लगे पत्थरों पर पटक कर अपनी पायल तोड़ दी—और लाल बारिश की तरह माणिक पूरे फर्श पर बिखर गए, उछलते और लुढ़कते हुए दरबार के हर दरबारी के कदमों तक जा पहुँचे। इसके बाद जो सन्नाटा पसरा, वह मदुरै में गूँजने वाली अब तक की सबसे बुलंद आवाज़ थी।',
      text: '"Pearls," said the king. "The queen\'s anklets hold pearls." Kannagi raised her arm and broke her anklet open on the stones before the throne — and rubies burst across the floor like red rain, bouncing and rolling to the feet of every courtier in the hall. The silence after them was the loudest sound Madurai ever heard.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'एक ही पल में राजा सब कुछ समझ गए — सुनार का झूठ, अपनी जल्दबाज़ी, वह बेकसूर आदमी, और वह सवाल जो उन्होंने नहीं पूछा था। प्राचीन महाकाव्य कहता है कि उनका दिल यह बोझ सह नहीं पाया और वहीं सिंहासन पर ही रुक गया; और उनके पीछे-पीछे रानी की साँसें भी थम गईं। महाकाव्य यह याद दिलाना नहीं भूलता कि एक राजा की गलती ने राजा से भी उसका सब कुछ छीन लिया।',
      text: 'The king understood everything in a single heartbeat — the goldsmith\'s lie, his own haste, the innocent man, the question he had not asked. The old epic says his heart could not carry it, and stopped, there on the throne; and the queen\'s followed his. A king\'s mistake, the epic is careful to say, cost the king everything too.' },
    { art: ['courtier'], who: null,
      hi: 'और महाकाव्य बताता है कि कण्णगि का दुख इतनी तेज़ आग बनकर दहका कि वह प्राचीन शहर उसे कभी भूल नहीं पाया। कहानी का वह हिस्सा तब के लिए है जब तुम थोड़े और बड़े हो जाओगे — जब तैयार हो, तब पूछना कि मदुरै उस रात को कैसे याद रखता है। यहाँ जो बात मायने रखती है वह यह है कि इसके बाद क्या हुआ: तमिल धरती ने उन्हें कभी खोने नहीं दिया।',
      text: 'And Kannagi\'s grief, the epic tells, blazed so hot that the old city itself never forgot it. That part of the story is for when you are older — ask, when you are ready, how Madurai remembers that night. What matters here is what came after: the Tamil land did not let her go.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'लोगों ने उन्हें देवी बना दिया। पत्तिनी, पतिव्रता देवी — जिनकी पूजा तमिलनाडु में हुई, केरल में हुई, जहाँ पुरानी परंपरा उन्हें कोडुंगल्लूर के भव्य मंदिर से जोड़ती है, और समुद्र पार श्रीलंका में भी। एक ऐसी नारी, जो अपनी मुट्ठी में सच लेकर महल में दाखिल हुईं, और जीत गईं।',
      text: 'They made her a goddess. Pattini, the faithful one — honoured in Tamil Nadu, honoured in Kerala, where old tradition links her to the great temple at Kodungallur, honoured across the sea in Sri Lanka. A woman who walked into a palace with the truth in her fist, and won.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज चेन्नई के मरीना बीच पर, समुद्र की ओर मुँह किए उनकी मूर्ति खड़ी है, हाथ में पायल उठाए — आज भी वही सवाल पूछती हुई। यह याद रखने लायक एक अच्छा सवाल है: किसी पर भी कोई इल्ज़ाम लगाने से पहले, क्या किसी ने सच की पड़ताल की थी?',
      text: 'On Marina Beach in Chennai her statue stands today, facing the sea, the anklet raised in her hand — still asking her question. It is a good question to keep: before anyone is blamed for anything, did somebody check?' }
  ],
  moral: 'One person with the truth in her hand outweighs a palace — and a judge who does not check is not judging at all.',
  source: 'Silappadikaram, the Tamil epic of Ilango Adigal — the story of Kannagi and the anklet. The epic\'s fiery ending is pointed to here rather than told, and the source says so. She is honoured as Pattini in Tamil Nadu, in Kerala tradition at Kodungallur, and in Sri Lanka.'
},

{
  id: 'fk.karikala-kaveri',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Boy With the Fire-Marked Leg',
  hook: 'They shut the boy prince away so he could never be king. What happened next gave him his name — and gave a river its master.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['बाढ़', 'baadh', 'flood'], ['आग', 'aag', 'fire'], ['किनारा', 'kinaara', 'riverbank']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'बहुत, बहुत पुरानी बात है, चोल देश में — इतनी पुरानी कि जब बाकी पुरानी कहानियाँ नई थीं, तब भी यह पुरानी हो चुकी थी — एक राजा की कहानी तब खत्म हो गई जब उनका बेटा अभी छोटा बच्चा ही था। और जो लोग खुद गद्दी हथियाना चाहते थे, उन्होंने उस बच्चे को देखा, उसे दूर भिजवा दिया, एक घर में कैद कर दिया, और उसे हमेशा-हमेशा वहीं बंद रखने की सोची।',
      text: 'Long, long ago in the Chola country — so long ago that this was already an old story when most old stories were new — a king\'s story ended while his son was still a small boy. And the men who wanted the throne for themselves looked at the boy, and had him taken far away, and kept shut in a house, and meant to keep him there forever.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'एक रात, उस घर में आग लग गई। धुआँ, लपटों की दहाड़, गिरती हुई कड़ियाँ — ऐसी रात जो किसी बच्चे को कभी न देखनी पड़े। लेकिन इस बच्चे ने होश नहीं खोया। उसने एक कपड़ा भिगोया, जैसा उसे सिखाया गया था वैसे चेहरे पर लगाया, लपटों के बीच से निकलने का इकलौता रास्ता ढूँढा, और उस जलते हुए घर से ज़िंदा बाहर निकल आया। आग उसे सिर्फ एक बार छू पाई: एक पैर पर, एक ऐसा निशान छोड़ते हुए जो जीवन भर उसके साथ रहा।',
      text: 'One night, fire broke out in that house. Smoke, roaring, falling beams — a night no child should ever have. But this child kept his head. He wet a cloth, held it to his face the way he had been taught, found the one gap in the flames, and walked out of that burning house alive. The fire touched him only once: along one leg, leaving a mark he would carry all his life.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'और वही निशान उनका नाम बन गया। करि-काल: तमिल में, "झुलसे हुए पैर वाला।" अब — कई राजकुमार ऐसा निशान अच्छे कपड़ों के नीचे छिपा लेते। लेकिन करिकाल ने इस नाम को ज़िंदगी भर एक तमगे की तरह पहना। क्योंकि इसका मतलब "वह लड़का जो जल गया था" नहीं था। इसका मतलब था: "वह लड़का जो बचकर बाहर निकल आया।"',
      text: 'And that mark became his name. Kari-kala: in Tamil, "the one with the charred leg." Now — plenty of princes would have hidden a mark like that under fine cloth. Karikala wore his name like a medal, his whole life. Because it did not say "the boy who was burned." It said: "the boy who walked out."' },
    { art: ['courtier'], who: null,
      hi: 'समय के साथ, राज्य के बुज़ुर्ग असली वारिस को खोजते हुए आए, और उन्हें ढूँढ़ निकाला, पर वे झिझक गए — क्योंकि वे तब भी बस एक बालक ही थे। वे आपस में फुसफुसाए, "चोल देश पर कोई बच्चा राज नहीं कर सकता।" एक पुरानी कहानी कहती है कि करिकाल ने बिना कोई बहस किए इसका जवाब दिया था।',
      text: 'In time the elders of the land came looking for the true heir, and found him, and hesitated — for he was still barely more than a child. "The Chola country cannot be ruled by a boy," they murmured. One old telling says Karikala answered that without a single argument.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'दरबार में एक पेचीदा झगड़ा लाया गया — दो ज़िद्दी पक्ष, दावों का उलझा हुआ जाल, ऐसा मामला जो बड़े-बड़े अक्लमंदों के सिर में दर्द कर दे। और एक बूढ़े न्यायाधीश ने, जिन्हें कोई पहचान नहीं पा रहा था, जिनके बाल सफ़ेद थे और चाल धीमी, बड़े धैर्य से पूरी बात सुनी और उसे इतनी सफ़ाई से सुलझाया कि दोनों पक्ष ख़ुश होकर घर लौटे। फिर वह न्यायाधीश सीधे तनकर खड़े हुए, और सफ़ेद बाल उतार दिए — और मुस्कुराते हुए वही लड़का सामने था। बुज़ुर्गों ने सिर झुका लिया। सुनाते-सुनाते यह कहानी भले ही थोड़ी बढ़ गई हो, पर तमिल देश इसे हज़ार सालों से प्यार करता आया है, इसलिए यह आज भी ज़िंदा है।',
      text: 'A difficult dispute was brought to the court — two stubborn parties, a tangle of claims, the kind of case that makes wise heads ache. And an aged judge nobody quite recognised, grey-haired and slow-moving, heard it all patiently and untangled it so cleanly that both sides went home satisfied. Then the judge straightened up, and pulled off the grey — and it was the boy, smiling. The elders bowed. That telling may have grown in the telling, but Tamil country has loved it for a thousand years, so it stays.' },
    { art: ['guard'], who: null,
      hi: 'तो करिकाल राजा बन गए। और उनके राज्य का सबसे बड़ा मसला कोई दुश्मन या ख़ज़ाना नहीं था। वह तो एक नदी थी। कावेरी — माँ भी और आफ़त भी। वह राज्य के हर खेत को सींचती थी; और फिर, कुछ सालों में, ऐसी बाढ़ लाती कि खेत, घर और फ़सल सब एक साथ बहा ले जाती।',
      text: 'So Karikala was king. And the greatest matter in his kingdom was not an enemy or a treasury. It was the river. The Kaveri — mother and monster both. She watered every field in the land; and then, some years, she rose in flood and took the fields, the houses and the harvest all at once.',
      ask: {
        q: 'How do you fight a river that you also love and need?',
        options: ['Build a great dam and shut her off completely', 'Raise long banks to guide her, and lay a low stone wall across her — not to stop her, but to share her out', 'You cannot — just pray and rebuild every year'],
        answer: 1,
        right: 'That was Karikala\'s answer. Not a wall against the river — a handshake with her. Guide her, slow her, and share her water out among all the fields.',
        wrong: 'Karikala loved the river too much to shut her away — and respected her too much to only pray. He guided her with long banks, and shared her with a low stone wall. A handshake, not a fight.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'उन्होंने पूरे देश को नदी के किनारे-किनारे बड़े-बड़े तटबंध बनाने के काम में लगा दिया, ताकि बाढ़ का पानी किनारे लग सके। और पुरानी मान्यताएँ उन्हें सबसे साहसी काम का श्रेय देती हैं: कल्लाणै — कावेरी के आर-पार तराशे हुए पत्थरों से बना एक लंबा, नीचा बाँध, जो नदी को रोकता नहीं बल्कि उसे धीरे से बाँट देता है, और उसका पानी नहरों के ज़रिए एक के बाद एक, खेत-दर-खेत फैला देता है।',
      text: 'He set the whole country to work raising great embankments along her length, so the flood had somewhere to be. And tradition credits him with the boldest stroke of all: the Kallanai — a long, low weir of fitted stone laid right across the Kaveri, which does not stop the river but gently divides her, sending her water spreading out through channels to field after field after field.' },
    { art: ['courtier'], who: null,
      hi: 'आज भी उस जगह कावेरी के आर-पार पत्थरों का एक बाँध खड़ा है — इतना पुराना कि सदियों का हिसाब लगाना मुश्किल है, जिसकी बार-बार मरम्मत हुई, और वह आज भी अपना काम कर रहा है: डेल्टा के धान का पूरा इलाक़ा हर मौसम में इसी से पानी पाता है। पुरानी परंपराएँ उसकी ओर इशारा करके बस इतना कहती हैं: आग के निशान वाले पैर के उस लड़के ने इसे बनाया था।',
      text: 'A stone barrage stands across the Kaveri at that spot today — ancient beyond easy counting, repaired and repaired again, and still doing its work: the rice country of the delta drinks through it every single season. Tradition points at it and says, simply: the boy with the fire-marked leg built that.' },
    { art: ['guard'], who: 'mithu',
      hi: '"जब वह छोटा और अकेला था, तब आग ने उसे उसका नाम दिया। बाकी की पूरी ज़िंदगी उसने पानी से उसका जवाब देते हुए बिताई। बड़े होने का एक तरीका यह भी है, और यह कोई बुरा तरीका नहीं है।"',
      text: 'Fire gave him his name when he was small and alone. He spent the rest of his life answering it with water. That is one way to grow up, and not the worst one.' }
  ],
  moral: 'What hurts you can end up naming you — and what you build with it can outlast every palace in the story.',
  source: 'Traditions of Karikala Chola, from Sangam poetry and later Tamil legend — the fire, the name, and the Kallanai across the Kaveri that tradition credits to him. Old tellings differ; where this one leans on a single telling, it says so.'
},

/* =========================================================== KARNATAKA ====== */
{
  id: 'fk.obavva-onake',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'Obavva and the Crack in the Rocks',
  hook: 'An army found a secret way into the fort — a gap in the rocks just wide enough for one man at a time. It had not counted on the woman fetching water.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['किला', 'kila', 'fort'], ['दरार', 'daraar', 'crack'], ['हिम्मत', 'himmat', 'courage']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"चित्रदुर्ग पत्थर की एक लहर जैसा किला है — कर्नाटक के सूखे दिल में, ग्रेनाइट की विशाल गोल पहाड़ियों पर चढ़ती दीवारों के सात घेरे। जिस ज़माने की यह कहानी है, दुश्मनों की एक फ़ौज महीनों से बाहर डेरा डाले पड़ी थी, एक के बाद एक दरवाज़ा तोड़ने की कोशिश कर रही थी, और हाथ कुछ नहीं आ रहा था। चित्रदुर्ग जैसे किले यूँ नहीं खुला करते।"',
      text: 'Chitradurga is a fort like a stone wave — seven rings of wall climbing over enormous round granite hills, in the dry heart of Karnataka. In the days this story happened, an enemy army had camped outside it for months, trying gate after gate, and getting nowhere. Forts like Chitradurga do not open.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"दीवारों पर दिन-रात पहरेदार खड़े रहते थे, और उनमें से एक कहले मुद्द हनुमा नाम का आदमी था, जिसकी चौकी एक शांत कोने की रखवाली करती थी जहाँ से पत्थरों के बीच होकर एक छोटा-सा झरना बाहर निकलता था। दोपहर को उसकी पत्नी ओबव्वा ने कहला भेजा कि खाना तैयार है, और उसने अपनी पहरेदारी उस शांत कोने के ही भरोसे छोड़ दी — भला दोपहर के खाने के समय क्या हो सकता है? — और वह खाना खाने घर चला गया।"',
      text: 'On the walls stood watchmen, day and night, and one of them was a man named Kahale Mudda Hanuma, whose post guarded a quiet corner where a stream slipped out through the rocks. At midday his wife Obavva sent word that his meal was ready, and he handed his watch to the quiet corner itself — what could happen at lunchtime? — and went home to eat.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"जब वह खाना खा रहा था, ओबव्वा पानी लाने के लिए दीवारों के पास वाले तालाब पर गई। और जैसे ही वह अपने घड़े के साथ झुकी, उसे पक्षियों के चहकने के बीच एक ऐसी आवाज़ सुनाई दी जो वहाँ की नहीं थी: एक खनक। एक फुसफुसाहट। जो पत्थरों के अंदर से आ रही थी।"',
      text: 'Obavva walked down to the pond by the walls to fetch water while he ate. And as she bent with her pot, she heard something under the birdsong that did not belong: a clink. A whisper. Coming from inside the rocks.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"वह दबे पाँव और करीब पहुँची। वहाँ, पानी की नाली के पीछे, एक किंडी थी — बड़े-बड़े पत्थरों के बीच एक दरार, बस इतनी चौड़ी कि एक आदमी रेंगकर निकल सके — और उसके अंधेरे में कुछ हिल-डुल रहा था। दरवाज़ों पर महीनों के हमलों से जो रास्ता बाहर की फ़ौज को नहीं मिला था, वह अब मिल चुका था: अंदर आने का रास्ता। और वे एक-एक करके उसी रास्ते से अंदर आ रहे थे।"',
      text: 'She crept closer. There, behind the water channel, was a kindi — a crevice, a crack in the great stones, just wide enough for one crawling man — and in its darkness, things were moving. The army outside had found what months of attacking the gates had not: a way in. And they were coming through it, one man at a time.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"उसके अगले कुछ पलों के बारे में सोचिए, क्योंकि जो कुछ भी होना था उन्हीं पलों में समाया था। अपने पति को बुलाने दौड़े — तो चंद मिनट बर्बाद, दरार बिना पहरे के छूट जाएगी, दर्जनों आदमी अंदर आ जाएँगे और दरवाज़ा भीतर से खुल जाएगा। चिल्लाए — तो दरार के अंदर वाले झपट पड़ेंगे, और बाहर वाले हमला बोल देंगे। अपने दोनों हाथों में उसने बस वही एक चीज़ थाम रखी थी जो वह अपनी रसोई से लेकर निकली थी: ओनाके — वह लंबा, भारी लकड़ी का मूसल, जिससे कन्नड़ रसोइयों में धान कूटा जाता है।"',
      text: 'Think about her next few seconds, because everything lived inside them. Run for her husband — minutes lost, the crack unwatched, a dozen men through and the gate opened from inside. Scream — and the men in the crack rush, and the men outside charge. In her two hands she held the only thing she had carried from her kitchen: the onake — the long, heavy wooden pestle that Kannada kitchens pound rice with.',
      ask: {
        q: 'What can one woman with a rice pestle do about an army coming through a crack?',
        options: ['Run and fetch the guards, whatever it costs', 'Stand flat beside the gap, silent and still, and stop each man as he comes through', 'Hide and hope they pass by'],
        answer: 1,
        right: 'That is what Obavva chose, in the time it takes to set down a water pot. The crack let in only one man at a time. So only one man at a time would ever get in.',
        wrong: 'Obavva saw what the crack itself was telling her: it let in only one man at a time. So she stood flat against the rock beside it, silent and completely still — and only one man at a time would ever get in.'
      } },
    { art: ['courtier'], who: null,
      hi: '"वह उस दरार के पास गर्म पत्थर से सटकर खड़ी हो गईं और पहाड़ी की तरह बिलकुल स्थिर हो गईं। अँधेरे में से धीरे-धीरे एक लोहे का टोप बाहर निकला। ओणके एक बार घूमा। वह आदमी बिना किसी आवाज़ के गिर पड़ा, और उन्होंने चुपचाप उसे एक तरफ खींच लिया — ताकि अगला आदमी, कुछ भी न सुनते हुए, आगे बढ़ता रहे।"',
      text: 'She pressed herself against the warm stone beside the opening and went as still as the hill itself. A helmet came slowly out of the dark. The onake swung once. The man dropped without a sound, and she drew him quietly aside — so that the next man, hearing nothing, kept coming.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और फिर अगला। और फिर अगला। ख़ामोशी ही उनका इकलौता हथियार थी। दीवार के बाहर, फ़ौज एक-एक करके सिपाहियों को दरार में भेजती रही और बाहर सिर्फ़ सन्नाटा सुनती रही, जिसे उन्होंने अपनी कामयाबी समझ लिया। अंदर, तालाब के पास, हाथ में मूसल लिए धूप में खड़ी एक अकेली औरत पूरे क़िले की पहरेदारी करती रहीं, न एक बार चीखीं, और न एक कदम पीछे हटीं।"',
      text: 'And the next. And the next. Her whole weapon was stillness. Outside the walls, the army kept feeding men into the crack and hearing only silence, which they took for success. Inside, by the pond, one woman stood in the sun with a rice pestle, guarding an entire fort alone, and did not once cry out, and did not once step back.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"जब उनके पति खाना खाकर लौटे, तो उन्होंने देखा कि उनका मोर्चा सँभाला हुआ था — हाथ में मूसल लिए, तेज़ साँसें लेती ओबव्वा द्वारा, और उनके पीछे दीवार के सहारे दुश्मन सिपाहियों की एक कतार चुपचाप पड़ी थी। उनके शंख की गूँज ने पूरे क़िले को जगा दिया। सिपाही दौड़ते हुए आए, पत्थरों से दरार को बंद कर दिया गया, और उस दिन चित्रदुर्ग हारने से बच गया।"',
      text: 'When her husband came back from his meal he found his post held — by Obavva, pestle in hand, breathing hard, with a line of enemy soldiers lying quiet along the wall behind her. His conch blast raised the whole fort. Soldiers came running, the crack was sealed with stone, and Chitradurga did not fall that day.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"पुरानी कहानियों में कहा जाता है कि ओबव्वा की अपनी कहानी उसी शाम चुपचाप पूरी हो गई, मानो उस दिन ने उनसे वह सब कुछ माँग लिया था जो उनके पास था और उन्होंने अपना सब कुछ दे दिया था। कर्नाटक ने उनका नाम लेना कभी नहीं छोड़ा।"',
      text: 'The old tellings say Obavva\'s own story ended that same evening, quietly, as if the day had asked everything she had and she had given all of it. Karnataka has never stopped saying her name.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"आज आप चित्रदुर्ग जाएँगे, तो लोग आपको ठीक उसी जगह ले जाएँगे — उसे अब \'ओणके ओबव्वन किंडी\' कहा जाता है, यानी मूसल वाली ओबव्वा की दरार — और आप ठीक वहीं खड़े हो सकते हैं जहाँ वे खड़ी थीं। यह चट्टान में बनी एक बेहद साधारण-सी दिखने वाली दरार है। और असल बात यही तो है।"',
      text: 'Go to Chitradurga today and they will walk you to the very spot — it is called Onake Obavvana Kindi now, the crack of Obavva of the pestle — and you can stand where she stood. It is a very ordinary-looking crack in a rock. That is rather the point.' }
  ],
  moral: 'Courage is not always loud. Sometimes it is one person deciding to stand completely still in exactly the right place.',
  source: 'The legend of Onake Obavva at Chitradurga fort, from Karnataka oral tradition; the cleft in the rocks, Onake Obavvana Kindi, is shown to visitors today. Told here without the battlefield details of some tellings.'
},

{
  id: 'fk.gullakayajji',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Grandmother\'s Little Cup of Milk',
  hook: 'Rivers of milk were poured over the tallest statue in the land — and every drop stopped halfway down, until an old woman climbed the hill with a cup.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['दूध', 'doodh', 'milk'], ['घमंड', 'ghamand', 'pride'], ['छोटा', 'chhota', 'small']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"कर्नाटक के श्रवणबेलगोला में, ग्रेनाइट की एक सूनी पहाड़ी के ऊपर, दुनिया के अजूबों में से एक खड़ा है: बाहुबली — गोमटेश्वर — एक ही पत्थर से तराशे गए, इतने ऊँचे कि लगता है बादल उनके कंधों को छू रहे हों, इतने अडिग खड़े कि मूर्तिकारों ने उनके पैरों पर लिपटी हुई बेलें भी तराश दीं। आपने शायद उनकी कहानी पहले ही सुन रखी होगी: वे वही हैं जिनकी उठी हुई मुट्ठी रुक गई थी।"',
      text: 'At Shravanabelagola in Karnataka, on top of a bare granite hill, stands one of the wonders of the world: Bahubali — Gommateshwara — carved from a single stone, so tall that clouds seem to brush his shoulders, standing so perfectly still that the sculptors carved vines twining up his legs. You may have heard his story already: he is the one whose raised fist stopped.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"यह मूर्ति एक महान मंत्री चावुंडराय के आदेश पर बनाई गई थी। इसे बनने में कई साल लग गए थे, और यह इतनी भव्य थी कि चावुंडराय को भी अपनी इस कृति का पूरा एहसास था। अब पहले महामस्तकाभिषेक का दिन आ पहुँचा था — जब ऊँचे मचान से मूर्ति के सिर पर दूध डाला जाना था, ताकि वह चमकता हुआ सिर से लेकर पाँव तक पूरी विशाल मूरत पर बह निकले।"',
      text: 'The statue was made at the order of Chavundaraya, a great minister, and it had taken years, and it was magnificent, and he knew it. Now came the day of the first anointing — when milk would be poured over the statue\'s head from scaffolding high above, to run shining down the whole great figure from crown to feet.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"बड़े-बड़े मटके ऊपर ले जाए गए — सैकड़ों मटके, जिनमें एक पूरी नदी जितना दूध था। दूध पत्थर के सिर से नीचे गिरा, कंधों के पार बहा — और रुक गया। बीच में ही। वह आगे बहने का नाम ही नहीं ले रहा था, मानो खुद पत्थर ने ही कोई दरवाज़ा बंद कर लिया हो। उन्होंने फिर से दूध डाला। वह फिर उसी जगह आकर रुक गया और अगल-बगल से रिसकर बेकार बह गया।"',
      text: 'Up went the pots — huge ones, hundreds of them, milk enough for a river. Down came the milk over the stone head, down over the shoulders — and stopped. Halfway. It simply would not flow further, as if the stone itself had closed a door. They poured again. It stopped again, at the same line, and trickled away sideways into nothing.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"चावुंडराय ने हर उस बात की जाँच की जो एक बारीक़ी से सोचने वाला इंसान करता है। और ज़्यादा दूध। और भी शुद्ध दूध। और ऊँचे स्वर में मंत्रोच्चार, और भी पहुँचे हुए पंडित, और भी कीमती बर्तन। पहाड़ी की चोटी पर खड़ी भीड़ चुपचाप देखती रही, और दूध हर बार बीच में ही रुक जाता था, और कोई नहीं बता पा रहा था कि ऐसा क्यों हो रहा था।"',
      text: 'Chavundaraya checked everything a thorough man checks. More milk. Purer milk. Louder chanting, holier priests, costlier pots. The crowd stood hushed on the hilltop and the milk stopped halfway every single time, and nobody could say why.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"भीड़ के एक कोने में एक छोटी-सी बूढ़ी औरत खड़ी थीं, जिन्हें पहरेदारों ने दो बार पीछे हटा दिया था। एक अज्जि — यानी कन्नड़ में दादी माँ — जो इतनी गरीब और सीधी-सादी थीं कि किसी ने उनका नाम तक नहीं पूछा था। उन्होंने अपने दोनों हाथों में अपनी भेंट थाम रखी थी: दूध, जिसे वे एक गुल्लाकाई में पूरी लंबी पहाड़ी पर चढ़ाकर लाई थीं। गुल्लाकाई, यानी सूखी लौकी को खोखला करके बनाई गई एक छोटी-सी कटोरी। उसमें बस इतना ही दूध था, जितना शायद किसी बिल्ली के बच्चे के लिए काफी हो।"',
      text: 'At the edge of the crowd stood a small old woman the guards had twice waved back. An ajji — a grandmother, in Kannada — so poor and so ordinary that nobody had asked her name. In her two hands she held her offering: milk, carried up the whole long hill in a gullakayi, a little cup made from a hollowed gourd shell. Enough milk, perhaps, for a kitten.',
      ask: {
        q: 'The minister\'s thousand pots have failed. Whose offering should be tried next?',
        options: ['Even bigger pots, from an even richer donor', 'The grandmother\'s little gourd cup', 'None — the anointing should be abandoned'],
        answer: 1,
        right: 'A wise elder in the crowd said exactly that: let the ajji pour. And the guards stood aside, and the small old woman began to climb.',
        wrong: 'It was the opposite that was needed, and a wise elder in the crowd saw it: let the ajji pour. And the guards stood aside, and the small old woman began to climb.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"वे ऊपर पहुँचीं, अपनी साँस संभाली, और अपनी छोटी-सी लौकी की कटोरी को मूर्ति के सिर पर उलट दिया — और दूध बह निकला। कंधों के ऊपर से। बाहों से नीचे, तराशी गई लताओं को पार करता हुआ, पाँवों के ऊपर से, जब तक कि वह पूरी विशालकाय मूरत सिर से लेकर पाँव तक चमकने न लगी। आखिरकार अभिषेक पूरा हुआ — वो भी सिर्फ करीब आधी कटोरी दूध से।"',
      text: 'She reached the top, caught her breath, tipped her little gourd cup over the statue\'s head — and the milk flowed. Over the shoulders. Down the arms, down past the carved vines, over the feet, until the whole colossal figure stood gleaming from crown to toe, anointed at last — by about half a cup of milk.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"चावुंडराय भीड़ में खड़े थे और एक ही पल में समझ गए कि वह पत्थर उनसे क्या कह रहा था। जिस महापुरुष ने अपना सब कुछ त्याग दिया था, उनकी मूरत एक अमीर आदमी के घमंड की बस एक और चीज़ बनने जा रही थी। उनके दूध में अहंकार भरा था। जबकि अज्जि के दूध में सिर्फ और सिर्फ प्यार — और प्यार, सचमुच, सबसे आगे तक बहता है।"',
      text: 'Chavundaraya stood in the crowd and understood, all at once, what the stone had been telling him. The statue of the man who gave up everything had been about to become one more thing for a rich man to be proud of. His milk was full of pride. Hers was full of nothing but love — and love, it turns out, flows further.' },
    { art: ['courtier'], who: null,
      hi: 'महामंत्री उस छोटी-सी दादी अम्मा के पास चलकर गए और सबके सामने पूरी तरह झुककर उन्हें प्रणाम किया। यह उनके जीवन का दूसरा सबसे समझदारी भरा काम था। और सबसे बड़ी समझदारी तो इसके बाद हुई: उन्होंने यह पक्का किया कि कोई उन्हें कभी न भूले।',
      text: 'The great minister walked over to the small grandmother and bowed to her, all the way down, in front of everyone. It was the second wisest thing he ever did. The wisest was what came next: he made sure nobody ever forgot her.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज श्रवणबेलगोला में वे आपको खुद गुल्लाकायज्जी की एक छोटी-सी मूर्ति दिखाएँगे, जो उस विशाल मूर्ति के पास खड़ी हैं, और उनके हाथों में लौकी का वही छोटा-सा प्याला है। और हर बारह साल में, महामस्तकाभिषेक के बड़े उत्सव पर, दूध की धार फिर से बहती है — और सबसे पहले यही कहानी फिर से सुनाई जाती है।',
      text: 'At Shravanabelagola today they will show you a small statue of Gullakayajji herself, standing near the great one, her little gourd cup in her hands. And every twelve years, at the great head-anointing festival, the milk pours again — and this story gets told again, first.' }
  ],
  moral: 'It is not the size of the cup. It is what the heart carries up the hill in it.',
  source: 'The Gullakayajji legend of Shravanabelagola, Karnataka, told of the anointing of the Gommateshwara statue; her small statue stands on the hill, and the story is retold at each Mahamastakabhisheka. Jain and Kannada oral tradition.'
},

{
  id: 'fk.kaveri-pot',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The River in the Sage\'s Pot',
  hook: 'The whole south was thirsty, and the water it needed was inside one small brass pot — until a crow tipped it over.',
  hero: 'courtier',
  cast: ['courtier', 'ganesha', 'pt_crow'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['घड़ा', 'ghada', 'pot'], ['कौआ', 'kauwa', 'crow'], ['प्यास', 'pyaas', 'thirst']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'कोडगु की धुंध से घिरी ऊँची पहाड़ियों में — यानी कर्नाटक के कॉफ़ी वाले इलाके कूर्ग में — पहाड़ की ढलान पर एक छोटा-सा जलस्रोत है जिसे तलकावेरी कहते हैं: "कावेरी का सिर।" इतनी बड़ी पूरी नदी वहीं से शुरू होती है, एक ऐसे छोटे-से कुंड से जिसे आप बस एक कदम में पार कर सकते हैं। और यह कहानी है कि वह वहाँ से बाहर कैसे निकलीं।',
      text: 'High in the misty hills of Kodagu — Coorg, the coffee country of Karnataka — there is a small spring on a mountainside called Talakaveri: "the head of the Kaveri." A whole great river starts there, in a pool you could step across. And this is the story of how she got out.' },
    { art: ['courtier'], who: null,
      hi: 'ऋषि अगस्त्य — दक्षिण के वे छोटे-से मगर पराक्रमी ऋषि, जिनसे आप इन कहानियों में फिर मिलेंगे — अपने साथ कमंडल रखते थे, वही छोटा-सा जलपात्र जो घूमते-फिरते ऋषि अपने पास रखते हैं। और कथा कहती है कि उस पात्र में कोई साधारण जल नहीं था। वह खुद कावेरी थीं: एक ऐसी देवी जिन्होंने अपने मन से नदी बनना चुना था, ताकि दक्षिण कभी भूखा न रहे।',
      text: 'The sage Agastya — the small, mighty sage of the south, whom you will meet again in these stories — carried a kamandalu, the little water-pot that wandering sages carry. And in that pot, the legend says, was no ordinary water. It was Kaveri herself: a goddess who had chosen, of her own free heart, to become a river, so that the south would never go hungry.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'मगर नदी तो बस एक ही बार बहाई जा सकती है, इसलिए यह काम बिल्कुल ठीक होना चाहिए था — और अगस्त्य इसे एकदम सही ढंग से करना चाहते थे। बिल्कुल सही पहाड़ी। बिल्कुल सही घड़ी। वे हाथ में कमंडल लिए पहाड़ियों में घूमते रहे — कभी कुछ चुनते और कभी छोड़ देते, फिर सोचते और फिर मना कर देते — जबकि कमंडल के अंदर, बहने के इंतज़ार में देवी बस राह देखती रहीं, देखती रहीं, और देखती रहीं।',
      text: 'But a river can only be poured out once, so it must be done right — and Agastya meant to do it perfectly. The perfect hillside. The perfect hour. He walked the hills with the pot in his hand, considering and rejecting, considering and rejecting, while inside the pot a goddess waited, and waited, and waited to run.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'और नीचे ज़मीन में दरारें पड़ रही थीं। बारिश बार-बार दगा दे रही थी। किसान उन धूल भरे मैदानों में खड़े आसमान को ताक रहे थे, जो कभी खेत हुआ करते थे। दक्षिण अब प्यासा था — और सब कुछ एकदम सही होने में तो बरसों बीत रहे थे।',
      text: 'And down below, the land was cracking. The rains had failed and failed again. Farmers stood in dust that had been fields, looking at the sky. The south was thirsty now — and perfect was taking years.' },
    { art: ['ganesha'], who: null,
      hi: '"गणेश यह सब देख रहे थे — वह कमंडल, इंतज़ार करती देवी, और सूखी फटी ज़मीन — और गणेश, जिन्हें टेढ़े-मेढ़े तरीक़े से काम बनाना पसंद है, उन्होंने तय किया कि इंतज़ार अब बहुत हो चुका। उन्होंने खुद को छोटा, पंखों वाला और काला बना लिया: एक नन्हा-सा कौआ।"',
      text: 'Ganesha had been watching all of this — the pot, the waiting goddess, the cracked fields — and Ganesha, who loves solving things sideways, decided the waiting had gone on exactly long enough. He made himself small, and feathered, and black: a little crow.' },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'wow',
      hi: '"जब ऋषि प्रार्थना में मग्न खड़े थे, कौआ फड़फड़ाता हुआ नीचे उतरा, एक डाल पर फुदका, कमंडल के किनारे पर आराम से बैठा — और उसे उलट ही दिया। पानी छलककर पहाड़ी पर बह निकला।"',
      text: 'The crow flapped down while the sage stood in prayer, hopped along a branch, perched neatly on the rim of the kamandalu — and tipped it right over. The water leapt out onto the hillside.',
      ask: {
        q: 'Was the crow just being naughty?',
        options: ['Yes — crows love mischief', 'No — the wait was over. Thirsty fields cannot drink "perfect"', 'It only wanted the shiny pot'],
        answer: 1,
        right: 'That is the heart of it. Somewhere below, children were hungry. Perfect had had its chance. The crow chose now.',
        wrong: 'It looked like mischief — good tricks always do. But somewhere below, children were hungry, and perfect had had its chance. The crow chose now.'
      } },
    { art: ['courtier', 'ganesha'], who: null,
      hi: '"उस मनहूस पक्षी को उड़ाने के लिए अगस्त्य हाथ उठाए तेज़ी से घूमे — तभी वह कौआ एक गोल-मटोल, मुस्कुराता हुआ बालक बन गया, और ऋषि का हाथ हवा में ही थम गया। गणेश! वे लगभग गणेश पर ही हाथ चला बैठे थे। शर्मिंदा होकर, ऋषि ने माफ़ी माँगते हुए अपनी ही उँगलियों के पोरों से अपनी कनपटी पर धीरे-धीरे ठोका — और गणेश खिलखिलाकर हँस पड़े। आज भी लोग गणेश जी के आगे सिर पर अपनी उँगलियों से धीरे से ठक-ठक करते हैं, और यह कहानी कहती है कि इसकी शुरुआत यहीं से हुई थी।"',
      text: 'Agastya spun round with his hand raised to shoo the wretched bird — and the crow became a round, grinning boy, and the sage froze mid-swing. Ganesha. He had very nearly swatted Ganesha. Mortified, the sage rapped his own knuckles against his own temples in apology — and Ganesha laughed with delight. To this day, people knock their knuckles gently on their heads before Ganesha, and this story claims that is where it began.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और वह छलका हुआ पानी? वह घास से ऊपर उठा, हँसा, एक कन्या बना, एक धारा बना, और नाचता हुआ पहाड़ी से नीचे उतर गया — कावेरी, आखिरकार आज़ाद, समंदर की ओर दौड़ती हुई। कोडगु की पहाड़ियों से होते हुए, कर्नाटक के फैले हुए खेतों के पार, आगे तमिल देश में — वही नदी, जिस पर आग से झुलसे पैर वाला एक बालक राजा एक दिन पत्थर की दीवार बाँधेगा, ताकि उसका पानी सबको बाँट सके।"',
      text: 'And the spilled water? It rose from the grass, and laughed, and became a girl, and became a stream, and went dancing away downhill — Kaveri, free at last, running for the sea. Through the hills of Kodagu, out across the wide fields of Karnataka, on into Tamil country — the very river a boy king with a fire-marked leg would one day lay a stone wall across, to share her out.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"तलकावेरी में एक छोटा-सा कुंड इस स्रोत की पहचान है, और साल में एक बार, कावेरी संक्रमण के दिन, परिवार पानी को ऊपर उठते देखने के लिए इकट्ठा होते हैं। उन पहाड़ियों के कोडव लोग उन्हें सिर्फ़ नदी भी नहीं कहते। वे उन्हें कावेरम्मे पुकारते हैं — यानी माँ कावेरी। उन्होंने अपनी मर्ज़ी से हर किसी का पेट भरा। कौए ने तो बस दरवाज़ा खोला था।"',
      text: 'At Talakaveri a small tank marks the spring, and once a year, at the Kaveri Sankramana, families gather to watch the water rise. The Kodava people of those hills do not merely call her a river, either. They call her Kaveramme — Mother Kaveri. She fed everyone, exactly as she chose to. The crow just opened the door.' }
  ],
  moral: 'Perfect is a fine thing to wait for, but thirsty fields cannot drink perfect. Sometimes the kindest thing in the story is the one who tips the pot.',
  source: 'The origin legend of the Kaveri told at Talakaveri in Kodagu, Karnataka, where the Kaveri Sankramana is kept each year — joined, as the tradition joins it, to Agastya\'s kamandalu and Ganesha\'s crow. Many tellings.'
},

{
  id: 'fk.story-song',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Story That Wanted Out',
  hook: 'A woman knew one story and one song, and never told them to anybody. So one night, while she slept, they escaped.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'hanuman'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['कहानी', 'kahaani', 'story'], ['गाना', 'gaana', 'song'], ['बताना', 'bataana', 'to tell']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"कन्नड़ देश के एक गाँव में एक औरत रहती थी जिसे बस एक ही कहानी और एक ही गीत याद था — उसकी अपनी नानी ने कान में फुसफुसाकर उसे ये ऐसे सौंपे थे, जैसे कोई गहने सौंपता है। और जाने कैसे, उसने कभी किसी को वे नहीं सुनाए। कभी खाना पकाना था। कभी भैंस को देखना था। और कल का दिन तो हमेशा ही था। वह कहानी और वह गीत बरसों तक उसके भीतर ही बंद रहे।"',
      text: 'In a village in the Kannada country there lived a woman who knew exactly one story and one song — her own grandmother had given them to her, mouth to ear, the way you hand over jewellery. And somehow, she had never once told them. There was cooking. There was the buffalo. There was always tomorrow. The story and the song stayed shut inside her for years.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अब सुनो, यह एक ऐसी बात है जो हर कोई नहीं जानता। कहानियों और गानों में जान होती है, और अनकही कहानी का तो दम घुटने लगता है। उसकी कहानी और गाना उसके अंदर ऐसे बैठे थे जैसे किसी बहुत छोटे पिंजरे में दो चिड़ियाँ — पंख समेटे, छटपटाते हुए, सालों-साल — जब तक कि एक रात उनका सब्र बिल्कुल टूट नहीं गया।',
      text: 'Now, here is a thing not everybody knows. Stories and songs are alive, and an untold story gets cramped. Hers sat inside her like two birds in a cage gone too small — wings folded, fidgeting, year after year — until one night they had simply had enough.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'उस रात वह मुँह खोलकर सोई। और वे दोनों साँस की तरह चुपके से, एक के बाद एक, बाहर फिसल आए। मगर दुनिया में बाहर निकली कहानी को कुछ न कुछ तो बनना ही था — सो वह कहानी दरवाज़े के पास खूँटी पर टंग गई और किसी आदमी का कोट बन गई। और गाना नीचे कूदकर एक जोड़ी जूते बन गया।',
      text: 'That night she slept with her mouth open. And out they slipped, one after the other, quiet as breath. But a story that is out in the world must be something — so the story hung itself up on the peg by the door and became a man\'s coat. And the song hopped down below it and became a pair of shoes.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'उसका पति खेतों से देर से घर लौटा, उसने दीया उठाया — और ठिठक कर खड़ा रह गया। "यह किसका कोट है?" उसकी खूँटी पर एक अजनबी कोट! उसके नीचे अजनबी जूते! इतनी रात गए कोई मेहमान, और वह था कहाँ? "ये सब आख़िर हैं किसके?" और उसकी पत्नी ने, आँखें मलते हुए जागकर, सबसे बुरा सच कह दिया: "मुझे ज़रा भी नहीं पता।" और आप भी मानेंगे कि इससे बात सुलझने के बजाय और उलझ गई।',
      text: 'Her husband came home late from the fields, lifted the lamp — and stopped dead. "Whose coat is this?" A strange coat on his peg. Strange shoes beneath it. A visitor, at this hour, and where was he? "Whose ARE these?" And his wife, blinking awake, gave the worst possible true answer: "I have no idea." Which, you will agree, did not help.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'वह इतना आहत था कि चिल्ला भी न सका। उसने अपना कंबल उठाया और अंधेरे में पैर पटकते हुए गली के नुक्कड़ पर बने हनुमान जी के मंदिर में सोने चला गया — उस गाँव के मर्द जब सचमुच नाराज़ होते थे, तो ऐसे ही रूठते थे। उसकी पत्नी रात भर जागी रही, उस कोट को एकटक देखती रही जो उसने पहले कभी नहीं देखा था, उस घर में जो अचानक बिल्कुल ठंडा पड़ गया था।',
      text: 'He was too hurt to shout. He took his blanket and stalked off through the dark to sleep in the Monkey God\'s temple at the end of the street, the way men in that village sulked when sulking was serious. His wife lay awake, staring at a coat she had never seen, in a house gone suddenly cold.' },
    { art: ['hanuman'], who: null, mood: 'wow',
      hi: 'मगर गली के नुक्कड़ वाला मंदिर रात में खाली नहीं था। अरे नहीं! उसी मंदिर में तो सारी लौ इकट्ठी होती थीं। गाँव का हर दीया जब रात को बुझाया जाता है, तो उसकी लौ मरती नहीं है — वह चुपके से मंदिर चली जाती है ताकि दूसरी लौ के साथ देर रात तक बैठकर अपने-अपने घरों की गपशप कर सके। और अब वे एक के बाद एक नन्हीं लौ बनकर अंदर आने लगीं, और गौरैयों की तरह कतारों में बैठ गईं।',
      text: 'But the temple at the end of the street was not empty at night. Oh no. That temple was where the flames went. When every lamp in the village is blown out for the night, its flame does not die — it slips off to the temple to sit up late with the other flames, gossiping about their households. And in they came now, flame after little flame, settling in rows like sparrows.' },
    { art: ['hanuman', 'courtier'], who: null,
      hi: 'उसके अपने घर की लौ सबसे आख़िर में आई, और बाक़ी सब उस पर टूट पड़ीं। "फिर से देर कर दी! कहाँ रह गई थी?" "हमारे यहाँ तो आज रात क्या ही गज़ब हो गया," नन्हीं लौ ने ठंडी आह भरते हुए कहा। "तुम तो जानती ही हो कि मेरी मालकिन ने एक कहानी और एक गाने को अंदर बंद कर रखा था और कभी किसी को नहीं सुनाती थी? आज रात जब वह सो रही थी, तो वे दोनों भाग निकले — एक खूँटी पर टंगकर कोट बन गया है, दूसरा जूते बन गया है — और अब मालिक को लग रहा है कि कोई अजनबी आया है, और वे यहीं इसी मंदिर में आकर रूठे बैठे हैं, और उन दो भगोड़ों की वजह से सब दुखी हैं।" सारी लौ चाचियों-मौसियों की तरह \'च-च-च\' करने लगीं।',
      text: 'His own house\'s flame came in last, and the others pounced. "Late again! What kept you?" "What a night at ours," sighed the little flame. "You know my mistress keeps a story and a song locked up and never tells them? Tonight they escaped while she slept — one is hanging on the peg being a coat, the other is being shoes — and now the master thinks a stranger has come, and he is sulking right here in this temple, and everyone is miserable over two runaways." The flames all clucked like aunties.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'और एक खंभे के पीछे, ठोड़ी तक कंबल ताने पूरी तरह जागा हुआ एक पति बिल्कुल चुपचाप लेटा था, और अपने ही दीये को अपनी शादी की बातें करते सुन रहा था।',
      text: 'And behind a pillar, one wide-awake husband lay very still with his blanket to his chin, listening to his own lamp discuss his marriage.',
      ask: {
        q: 'What should he do with what he just overheard?',
        options: ['March home and scold his wife for keeping secrets', 'Go home gently, and ask her to tell the story and sing the song at last', 'Say nothing, ever, to anyone'],
        answer: 1,
        right: 'That is what he did, first thing in the morning — and it is the only ending where everybody, including the story, gets to go home.',
        wrong: 'None of it was a secret she had kept — it was a story she had starved. He went home gently in the morning and asked her to tell it at last.'
      } },
    { art: ['courtier'], who: null,
      hi: 'सुबह उसने पूछा, और वह शुरू हुई — पहले धीरे-धीरे, बात टटोलते हुए, फिर तेज़ी से, और फिर चेहरे पर चमक लिए — और जब उसने कहानी सुनाई और आख़िरकार वह गीत गाया, तो उसे याद आया कि उसकी दादी की आवाज़ ठीक एक ही जगह पर हमेशा धीमी क्यों पड़ जाती थी। जब उसने बात ख़त्म की, तो दरवाज़े के पास वाली खूंटी खाली थी। कोट और जूते दोनों ग़ायब — घर, उसी कहानी में, जहाँ वे रहते थे।',
      text: 'In the morning he asked, and she began — slowly at first, finding it, then faster, then glowing — and as she told the story and sang the song at last, she remembered why her grandmother\'s voice had always gone soft in exactly one place. When she finished, the peg by the door was empty. Coat and shoes both gone — home, into the telling, where they lived.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'यह कहानियों के बारे में एक कहानी है, इसलिए ज़रा संभलकर। अगर तुम्हें कोई कहानी आती है — और आती ही है, अब तुम्हें यह वाली आती है — तो किसी को सुना दो। मुँह में बंद कहानियाँ वैसे ही बासी हो जाती हैं जैसे हाँडी में बंद चावल। और वे बाहर तो निकल ही आएँगी। वे हमेशा बाहर निकल ही आती हैं।',
      text: 'This is a story about stories, so mind how you treat it. If you know one — and you do, you know this one now — tell it to somebody. Stories shut in a mouth go stale like rice shut in a pot. And they will get out anyway. They always get out.' }
  ],
  moral: 'A story kept shut away goes stale, and then it escapes on its own. Tell it — telling is what a story is for.',
  source: 'A Kannada folktale — "A Story and a Song" — collected and retold by A. K. Ramanujan. Many household tellings across Karnataka.'
},

/* ====================================================== ANDHRA PRADESH ====== */
{
  id: 'wt.tenali-vikatakavi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'The Boy Who Made the Goddess Laugh',
  hook: 'The goddess appeared to a boy at midnight with two bowls — one of riches, one of learning — and told him to choose one. He did something nobody had ever dared.',
  hero: 'courtier',
  cast: ['courtier', 'durga'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['हँसना', 'hansna', 'to laugh'], ['विद्या', 'vidya', 'learning'], ['धन', 'dhan', 'wealth']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'आंध्र के हरे-भरे डेल्टा वाले इलाके के तेनाली शहर में, राम नाम का एक लड़का रहता था — गरीब, बिना पिता का, और ज़बान इतनी तेज़ कि दिन में कम से कम एक बार तो उसकी माँ उससे तंग आ ही जाती थी। आगे चलकर दुनिया उसे दक्षिण भारत के सबसे मज़ाकिया इंसान, तेनाली रामन के नाम से जानने वाली थी। लेकिन उससे पहले, यह होना बाकी था।',
      text: 'In the town of Tenali, in the green delta country of Andhra, there lived a boy called Rama — poor, fatherless, and with a tongue so quick that his mother despaired of him at least once a day. The world would come to know him as Tenali Raman, the funniest man in the south. But first, this had to happen.' },
    { art: ['courtier'], who: null,
      hi: 'लड़के की हाज़िरजवाबी से खुश होकर एक घूमते-फिरते साधु ने उसे एक पावन मंत्र सिखाया, और उससे कहा: आधी रात को अकेले महान देवी काली के मंदिर जाना, और इसका जाप करना, और चाहे कुछ भी हो जाए, रुकना मत। ज़्यादातर लोग तो इसकी कोशिश भी नहीं करते। पर वह लड़का उसी रात चला गया।',
      text: 'A wandering holy man, amused by the boy\'s wit, taught him a sacred chant, and told him: go alone to the temple of the great goddess Kali at midnight, and recite it, and do not stop, whatever happens. Most people would not even try. The boy went that same night.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अंधेरे मंदिर में अकेला, थोड़ा डरा हुआ — और सच तो यह है कि उस घड़ी डर लगना लाज़िमी ही था — वह बैठ गया और मंत्र जपने लगा, और रुका नहीं। दीपक फड़फड़ाए। अंधेरा और गहरा हो गया। वह जपता रहा। और ठीक आधी रात को, पूरा मंदिर भर गया।',
      text: 'Alone in the dark temple, a little afraid — which is the only honest way to be — he sat down and chanted, and did not stop. The lamps guttered. The dark got thick. He chanted. And at midnight, the temple filled.' },
    { art: ['durga'], who: null, mood: 'wow',
      hi: 'साक्षात माँ प्रकट हुईं — विशाल और तेजोमय, उनके इतने सारे चेहरे थे कि मंदिर के हर दीये को रोशन करने के लिए एक चेहरा मिल गया था। यह ऐसा नज़ारा था जिसे देखकर बड़े-बड़े शूरवीर ज़मीन पर लोट-पोट हो जाएँ। लड़के ने ऊपर उनकी ओर देखा, उन सारे भव्य चेहरों को देखा — और खिलखिला पड़ा। फिर उसने झट से अपने मुँह पर हाथ रख लिया। और फिर से हँस पड़ा। वह अपनी हँसी रोक ही नहीं पा रहा था।',
      text: 'The great Mother came — vast and shining, with so many faces that every lamp in the temple found one to light. It is the kind of sight that flattens grown heroes to the floor. The boy looked up at her, all those magnificent faces — and giggled. And clapped his hand over his mouth. And giggled again. He could not stop.' },
    { art: ['durga', 'courtier'], who: null,
      hi: 'देवी सचमुच हैरान रह गईं। ऋषि-मुनि उनके आगे कांपते हैं। राजा बेहोश हो जाते हैं। कोई भी — युगों-युगों में कभी कोई भी — यूँ नहीं हँसता। "बच्चे," वे बोलीं, और उनकी आवाज़ में जैसे पूरा मंदिर गूँज उठा, "आखिर ऐसी कौन-सी हँसी की बात है?"',
      text: 'The goddess was genuinely astonished. Sages tremble before her. Kings faint. Nobody — nobody in all the ages — giggles. "Child," she said, and her voice was the temple itself, "what, exactly, is funny?"' },
    { art: ['courtier', 'durga'], who: 'courtier', mood: 'wow',
      hi: 'लड़के ने जैसे-तैसे खुद को संभाला। "अम्मा," उसने कहा, "मुझे माफ़ कर दीजिए। लेकिन जब हम लोगों को ज़ुकाम होता है, तो संभालने के लिए सिर्फ एक नाक होती है, और वही हमें रात भर जगाए रखती है। और मैं आपके इन सारे सुंदर चेहरों को देखकर सोच रहा था — अम्मा, जब आपको ज़ुकाम होता होगा, तो आप कैसे संभालती होंगी?" वहाँ एक गहरा सन्नाटा छा गया। और फिर पूरा मंदिर किसी घंटी की तरह गूँज उठा, क्योंकि देवी हँस रही थीं।',
      text: 'The boy pulled himself together, mostly. "Amma," he said, "forgive me. But when we people catch a cold, we have just one nose to manage, and it keeps us up all night. And I was looking at all your beautiful faces and thinking — Amma, when YOU catch a cold, however do you cope?" There was a terrible silence. And then the temple rang like a bell, because the goddess was laughing.' },
    { art: ['durga', 'courtier'], who: null, mood: 'think',
      hi: 'अपनी आँखें पोंछते हुए उन्होंने दो कटोरे आगे बढ़ाए। "तुमने एक उपहार कमाया है। यह ज्ञान का दूध है — इसे पियो और सबसे बड़े विद्वान बन जाओ। यह दौलत का दही है — इसे पियो और तुम्हें कभी किसी चीज़ की कमी नहीं होगी। एक को चुनो, बच्चे। सिर्फ एक को।"',
      text: 'Wiping her eyes, she held out two bowls. "You have earned a gift. This is the milk of learning — drink it and be the wisest of scholars. This is the curd of riches — drink it and want for nothing. Choose one, child. Only one."',
      ask: {
        q: 'Learning in one bowl, riches in the other, and you may have only one. What does the boy do?',
        options: ['Take the milk of learning', 'Take the curd of riches', 'Find a way to have both'],
        answer: 2,
        right: 'Of course he did. "May I hold them a moment, Amma, to help me decide?" And the moment they were in his hands, he drank both, straight down, one after the other.',
        wrong: 'This is Tenali Raman we are talking about. "May I hold them a moment, Amma, to help me decide?" And the instant they were in his hands he drank both, straight down.'
      } },
    { art: ['durga', 'courtier'], who: null,
      hi: 'वह नाराज़ हो सकती थीं। कोई और होता तो शायद हो भी जाता। लेकिन उन्होंने इस अनोखे बच्चे को देखा — जो एक कटोरे के हिसाब से कुछ ज़्यादा ही होशियार था, और इतना सच्चा था कि दिखावा भी न कर सका — और उसे इसके बदले एक निराला और कहीं बेहतर वरदान दिया। "तुम न तो किसी विद्वान जितने गंभीर हो पाओगे, न किसी अमीर जितने लालची। तुम इन दोनों से भी कुछ अलग बनोगे: एक विकटकवि। एक विदूषक-कवि।"',
      text: 'She could have been angry. Anyone else, she might have been. But she looked at this impossible child — too clever for one bowl, too honest to pretend he wasn\'t — and gave him instead a stranger and better blessing. "You will never be solemn enough for a scholar nor greedy enough for a rich man. You will be rarer than either: a vikatakavi. A jester-poet."' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और इस शब्द पर ध्यान देना, बच्चे," दीये की रोशनी में ओझल होते हुए उन्होंने कहा। "वि-क-ट-क-वि। इसे आगे से पढ़ो या पीछे से, यह एक जैसा ही पढ़ा जाता है — बिल्कुल तुम्हारी तरह। किसी को कभी ठीक-ठीक पता नहीं चलेगा कि तुम्हारा रुख़ किस तरफ़ है।" और आगे चलकर वह बिल्कुल वही बना।',
      text: '"And note the word, child," she said, already fading into the lamplight. "Vi-ka-ta-ka-vi. It reads the same forwards and backwards — like you. Nobody will ever be quite sure which way you are facing." And that is precisely what he became.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'तेनाली का वह लड़का बड़ा हुआ और उस ज़माने के सबसे महान दरबार में पहुँचा — विजयनगर में कृष्णदेवराय के दरबार में — और ज़िंदगी भर अपने चुटकुलों से राजाओं को सच्चा बनाए रखा। तुम उससे फिर मिलोगे। उसका रुख़ आम तौर पर दोनों तरफ़ होता है।',
      text: 'The boy from Tenali grew up and walked into the greatest court of the age — Krishnadevaraya\'s, at Vijayanagara — and kept kings honest with jokes for the rest of his life. You will meet him again. He is usually facing both ways.' }
  ],
  moral: 'He was not fearless because nothing frightened him. He was fearless because he could find the funny thing standing right next to the frightening one.',
  source: 'The origin tale of the Tenali Ramakrishna cycle, from Telugu oral tradition. Tenali is in Andhra Pradesh; the court he later joined, Krishnadevaraya\'s Vijayanagara, lies in today\'s Karnataka. Told with Andhra, whose language the tradition speaks.'
},

{
  id: 'wt.tenali-book',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'The Book That Did Not Exist',
  hook: 'A famous scholar challenged the whole court to debate him on any book ever written. Tenali Raman chose one the scholar had never read. Nobody had.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['किताब', 'kitaab', 'book'], ['बहस', 'bahas', 'debate'], ['डींग', 'deeng', 'boast']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'कृष्णदेवराय के महान दरबार में एक बाहरी विद्वान आया, जिसके पीछे नौकरों और प्रमाणपत्रों का ताँता लगा था। उसने ऐलान किया कि उसने पहाड़ों से लेकर समुद्र तक, हर राज्य के सबसे बड़े बुद्धिमानों को हराया है, और वह वहाँ मौजूद किसी भी इंसान से आज तक लिखी गई किसी भी किताब पर शास्त्रार्थ करने को तैयार है। किसी भी किताब पर। उसने पूरे दरबार पर एक मुस्कान बिखेरी और इंतज़ार करने लगा।',
      text: 'A visiting scholar arrived at the great court of Krishnadevaraya, trailing servants and certificates. He had, he announced, defeated the best minds of every kingdom from the mountains to the sea, and he would debate anyone present on any book ever written. Any book at all. He smiled around the hall and waited.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: 'दरबार के अपने विद्वान ज़मीन की तरफ़ देखने लगे। हर कोई कुछ किताबों का तो उस्ताद था — पर सारी किताबों का ज्ञाता कोई नहीं होता, और इस आदमी के सामने एक छोटी-सी चूक का मतलब था ज़िंदगी भर के लिए हँसी का पात्र बन जाना। सन्नाटा खिंचता चला गया। राजा के कान धीरे-धीरे लाल पड़ने लगे। और तभी एक जानी-पहचानी आवाज़ बड़े इत्मीनान से बोली, "अरे, मैं करूँगा इनसे शास्त्रार्थ।"',
      text: 'The court\'s own scholars looked at their feet. Each was master of some books — nobody is master of every book, and one slip against this man meant being laughed out of the profession. The silence stretched. The king\'s ears slowly went red. And then a familiar voice said, comfortably: "Oh, I\'ll debate him."' },
    { art: ['courtier'], who: null,
      hi: 'तेनाली रामन ने पूरी विनम्रता के साथ शर्तें रखीं: कल सुबह-सवेरे, भरे दरबार के सामने, किसी एक महान ग्रंथ पर चर्चा होगी — और उस किताब का नाम वे शास्त्रार्थ के समय ही बताएँगे। उस विद्वान ने, जिसने सब कुछ पढ़ रखा था, ज़रा झुककर और चेहरे पर एक घमंडी मुस्कान लाकर चुनौती स्वीकार कर ली।',
      text: 'Tenali Raman proposed the terms, all courtesy: tomorrow at dawn, before the full court, on a single great classic — a book he would name at the debate itself. The scholar, who had read everything, accepted with a small bow and a large smirk.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'उस रात तेनाली घर गए और बड़े जतन से तैयारी की। पढ़ाई करके नहीं। उन्होंने तिल के सूखे डंठलों का एक गट्ठर लिया और भैंस बाँधने वाली रस्सी का एक टुकड़ा, फिर उस पूरे पुलिंदे को बड़ी शान से कढ़ाईदार रेशम में लपेटा, और अपने आप से बेहद खुश होकर जल्दी सो गए।',
      text: 'That night Tenali went home and prepared with enormous care. Not by reading. He took a bundle of dried sesame stalks and a length of the rope used for tying up buffaloes, wrapped the whole thing grandly in embroidered silk, and went to bed early, extremely pleased with himself.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'सुबह होते ही वे रेशम की पोटली को बड़े आदर के साथ थामे दरबार में पहुँचे और उसे शास्त्रार्थ की मेज़ पर रख दिया। "आज के शास्त्रार्थ का ग्रंथ," उन्होंने ऐलान किया, "वह महान कालजयी रचना — तिलकाष्ठ महिष बंधन।" विद्वान के चेहरे की मुस्कान तो वैसी ही रही, मगर उनकी आँखें एकदम ठहर गईं। उन्होंने यह नाम कभी सुना ही नहीं था। और वे यह बात कह भी नहीं सकते थे।',
      text: 'At dawn he swept into court bearing the silk bundle with tremendous reverence and laid it on the debating table. "The text for today\'s debate," he announced, "that towering classic — Tilakashta Mahisha Bandhana." The scholar\'s smile stayed put while his eyes went completely still. He had never heard of it. And he could not say so.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'ज़रा देखिए उन्हें सोचते हुए, क्योंकि उनकी पूरी ज़िंदगी उन्हें इसी कोने में ला पटकी थी। इतनी डींगें हाँकने के बाद, सबके सामने अपनी अज्ञानता स्वीकार करें? सोचा भी नहीं जा सकता था। और जिस किताब को कभी देखा तक न हो, उस पर बहस करें? नामुमकिन।',
      text: 'Watch him think, because his whole life had led him into this corner. Admit ignorance, in public, after that boast? Unthinkable. Debate a book he had never seen? Impossible.',
      ask: {
        q: 'What should the great scholar do?',
        options: ['Say the honest thing: "I do not know this book"', 'Bluff his way through the debate', 'Grab the bundle and open it'],
        answer: 0,
        right: 'That was the one move that would have saved him — and the one move his boasting had made impossible. Instead he bowed and asked for a night to "refresh his memory."',
        wrong: 'Either of those would have ended him faster. The only safe move was the honest one — "I do not know it" — and his boasting had made exactly that impossible. He bowed, and asked for a night to "refresh his memory."'
      } },
    { art: ['guard'], who: null,
      hi: 'पूरी रात वह विद्वान अपनी किताबों के संदूक और अपनी याददाश्त का कोना-कोना खंगालता रहा। कुछ नहीं। साहित्य की पूरी दुनिया में कहीं कोई तिलकाष्ठ महिष बंधन नहीं था। और जब सुबह दरबार लगा, तो उस महापंडित का कमरा खाली था और उनका घोड़ा गायब — वे पहली किरण फूटने से पहले ही अपनी सनदें समेटकर रफ़ूचक्कर हो चुके थे।',
      text: 'All night the scholar ransacked his trunks of books and his palace of a memory. Nothing. No Tilakashta Mahisha Bandhana anywhere in the world of letters. And when the court gathered at dawn, the great man\'s rooms were empty and his horse was gone — he had ridden out before first light, certificates and all.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'राजा ने कहा कि कम से कम उन्हें यह मशहूर किताब देखनी तो है। तेनाली ने बड़े ठाठ से रेशमी कपड़ा खोला: तिल के डंठल और भैंस बाँधने वाली रस्सी। "महाराज — सीधे-सादे शब्दों में: तिल यानी तिल के डंठल। काष्ठ यानी सूखी लकड़ी। महिष बंधन यानी भैंस बाँधने की रस्सी। यह नाम तो बस सबको यह बता रहा था कि इस पोटली में क्या है। किसी ने पूछने की सोची ही नहीं।" पूरा दरबार हफ़्ते भर ठहाके लगाता रहा।',
      text: 'The king demanded to at least see this legendary book. Tenali untied the silk with great ceremony: sesame stalks and a buffalo rope. "Maharaja — in plain words: tila, sesame stalks. Kashta, dry wood. Mahisha bandhana, a rope for tying a buffalo. The title was simply telling everyone what was in the parcel. Nobody thought to ask." The court roared for a week.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"लेकिन अगर उसने इसे खोल लिया होता तो?" राजा ने अपनी आँखों से आँसू पोंछते हुए पूछा। "महाराज," तेनाली बोले, "जो इंसान यह नहीं कह सकता कि \'मुझे नहीं पता\', वह कभी कुछ नहीं खोलेगा। मेरी बहस तो इसी बात पर थी। और मैं जीत गया।"',
      text: '"But what if he had opened it?" asked the king, wiping his eyes. "Maharaja," said Tenali, "a man who cannot say I don\'t know will never open anything. That is what I was debating. I won."' },
    { art: ['courtier'], who: 'mithu',
      hi: '"मुझे नहीं पता" — तीन छोटे शब्द, और हर विद्वान की असली पहचान। जिन्हें सच में ज्ञान होता है, वे इन्हें बड़ी आसानी से, बार-बार और सबसे पहले कहते हैं।',
      text: '"I don\'t know" — three small words, and the measure of every scholar. The ones who really know things say them easily, and often, and first.' }
  ],
  moral: 'The truly learned say "I do not know" easily. It is only the boasters who cannot afford those three words.',
  source: 'From the Tenali Ramakrishna cycle, Telugu oral tradition — the tale of Tilakashta Mahisha Bandhana at Krishnadevaraya\'s court. Tenali is in Andhra; the court is Vijayanagara. Many tellings.'
},

{
  id: 'fk.paramananda-count',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Disciple Who Was Always Missing',
  hook: 'Ten disciples crossed the river. On the far bank they counted only nine — and the missing one was standing right there, counting.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-AP'],
  words_hi: [['गिनती', 'ginti', 'counting'], ['नौ', 'nau', 'nine'], ['दस', 'das', 'ten']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'तेलुगु देश में कभी परमानंदय्या नाम के एक गुरु रहते थे, बड़े ही असीम धैर्य वाले इंसान — और यह अच्छा ही था, क्योंकि उनके दस शिष्य बड़े आज्ञाकारी, मेहनती और गज़ब के बेवकूफ़ थे। तेलुगु दादियाँ सैकड़ों सालों से उन पर हँसती आ रही हैं, और अभी तक उनकी हँसी थमी नहीं है।',
      text: 'In the Telugu country there once lived a guru called Paramanandayya, a man of truly bottomless patience — which was fortunate, because his ten disciples were devoted, hardworking, and magnificently, dazzlingly foolish. Telugu grandmothers have been laughing about them for hundreds of years, and are not finished yet.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'एक दिन गुरुजी ने उन्हें नदी पार अगले गाँव किसी काम से भेजा। "तुम दसों एक साथ जाना," उन्होंने धीरे-धीरे और साफ़ शब्दों में कहा, "और तुम दसों एक साथ ही वापस आना। खुद को गिन लेना। दस।" शिष्य नदी तक पूरे रास्ते यही दोहराते रहे: दस, दस, दस।',
      text: 'One day the guru sent them on an errand to the next village, across the river. "All ten of you go together," he said slowly and clearly, "and all ten of you come back together. Count yourselves. Ten." The disciples repeated it all the way to the water: ten, ten, ten.' },
    { art: ['guard'], who: null,
      hi: 'वे एक-दूसरे का हाथ थामे, किलकारियाँ मारते हुए पानी में से होकर नदी पार कर गए, और भीगते-टपकते उस पार किनारे पर पहुँचे। और सबसे बड़े शिष्य ने, ज़िम्मेदार होने के नाते, सबको एक कतार में खड़ा किया और सिर गिने: एक, दो, तीन, चार, पाँच, छह, सात, आठ — नौ। उसके हाथ-पाँव ठंडे पड़ गए। उसने फिर गिना। नौ!',
      text: 'They waded across the river, holding hands and squealing, and climbed out dripping on the far bank. And the eldest, being responsible, lined everyone up and counted heads: one, two, three, four, five, six, seven, eight — nine. He went cold. He counted again. Nine!' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: 'बारी-बारी से हर चेले ने गिनती की, और बड़े ध्यान से हर किसी का सिर गिना—सिवाय अपने खुद के सिर के, जिस पर उसकी आँखें थीं। नौ। नौ। दसों बार गिनती नौ ही आई। अब इसका एक ही मतलब हो सकता था: नदी उनके दसवें भाई को बहा ले गई थी। और वे दसों के दस किनारे पर एक कतार में बैठकर उसके लिए रोने लगे—जिसके लिए, ध्यान दीजिए, पूरे दस लोगों की ज़रूरत पड़ी।',
      text: 'Each disciple took a turn counting, and each, with perfect care, counted every head except the one his own eyes lived in. Nine. Nine. Nine, ten times over. There was only one possible explanation: the river had taken their tenth brother. And all ten of them sat down in a row on the bank and wept for him — which, you will notice, took ten people.',
      ask: {
        q: 'Ten disciples keep counting nine. What has actually gone wrong?',
        options: ['The river really has taken one of them', 'Every counter is forgetting to count himself', 'None of them can count past nine'],
        answer: 1,
        right: 'That is it exactly. Each one counted all his brothers perfectly — and left out the one head he could not see. His own.',
        wrong: 'Count with them and you will catch it. Each one counted his brothers perfectly — and left out the one head he could not see. His own.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'रास्ते से गुज़रते एक मुसाफ़िर ने देखा कि दस हट्टे-कट्टे आदमी कतार में बैठकर रो रहे हैं। "कौन चल बसा?" "हमारा भाई! हम दस थे, और अब नौ ही बचे हैं—आप खुद गिन लीजिए!" मुसाफ़िर ने धीरे-धीरे पूरी कतार पर नज़र घुमाई, उसके होंठ हिले, और उसके मुँह के कोने में हल्की-सी मुस्कुराहट थिरकने लगी। "मान लो," उसने गंभीर होकर कहा, "अगर मैं तुम्हारा दसवाँ आदमी ढूँढ़ दूँ, तो तुम मुझे क्या दोगे?" "हमारी पोटलियों में जो कुछ भी है, सब कुछ!"',
      text: 'A traveller came down the road and found ten grown men weeping in a row. "Who has died?" "Our brother! We were ten, and now we are nine — count for yourself!" The traveller looked slowly along the line, and his lips moved, and something began to twitch at the corner of his mouth. "Suppose," he said gravely, "I find your tenth man. What will you give me?" "Everything in our bundles!"' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'मेरी जानी-पहचानी कहानी में, उसने हर आदमी से नदी की गीली मिट्टी में अपने अँगूठे का निशान लगाने को कहा, और फिर पीछे हट गया। "अब इन अँगूठों के निशानों को गिनो।" एक, दो, तीन... आठ, नौ—दस। दस निशान! चेले खुशी से चिल्लाते हुए उछल पड़े, मुसाफ़िर के गले लगे, एक-दूसरे को गले लगाया, और नदी से अपने भाई को वापस लौटाने के लिए भगवान का शुक्रिया अदा किया।',
      text: 'In the telling I know best, he had each man press one thumbprint into the wet river clay, then stood back. "Now count the thumbprints." One, two, three... eight, nine — TEN. Ten thumbprints! The disciples leapt up whooping, embraced the traveller, embraced each other, and thanked the heavens for returning their brother from the river.' },
    { art: ['guard'], who: null,
      hi: 'उन्होंने अपनी पोटलियाँ मुसाफ़िर को थमानी चाहीं, लेकिन उसने सिर्फ घूँट भर पानी पिया और आगे चल पड़ा, और बाकी पूरा दिन अपनी हँसी दबाते हुए हल्के-हल्के हिलता रहा। उधर चेले अपने गुरुजी को इस हादसे और चमत्कार की बात बताने के लिए जल्दी-जल्दी घर की तरफ दौड़े।',
      text: 'They pressed their bundles on the traveller, who took only a drink of water and walked on, shaking gently for the rest of the day. And the disciples hurried home to tell their guru of the tragedy and the miracle.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'परमानंदय्या ने आँखें मूँदकर सारी बात सुनी—डूबने की, रोने-धोने की, उस भले अजनबी की, और उन दस अँगूठों के निशानों की। उन्होंने एक लंबी, धीमी साँस ली, वैसी साँस जो हँसी को अंदर ही दबा देती है ताकि वह छूट न जाए। "और वह दसवाँ आदमी," उन्होंने पूछा, "था कौन?" "यही तो चमत्कार है, गुरुजी! वह कभी सामने ही नहीं आया—और फिर भी मिट्टी में उसके अँगूठे का निशान था!"',
      text: 'Paramanandayya heard it all with his eyes closed — the drowning, the weeping, the wonderful stranger, the ten thumbprints. He took one long, slow breath, the kind that holds a laugh down where it cannot escape. "And who," he asked, "was the tenth man?" "That is the miracle, guruji! He never appeared — and yet his thumbprint was in the clay!"' },
    { art: ['courtier'], who: 'mithu',
      hi: 'फिर भी गुरुजी ने उन सबको अपने पास ही रखा, दसों को—या ग्यारहों को, जैसा कि वे मिट्टी वाले निशान को भी जोड़कर कहना पसंद करते थे। और यह रही मुफ्त की एक काम की बात: जब लगे कि कोई चीज़ गायब है, तो सबसे पहले खुद को गिनो। अक्सर हम खुद को ही गिनना भूल जाते हैं।',
      text: 'The guru kept them anyway, all ten — eleven, he liked to say, counting the one in the clay. And here is the trick, free of charge: when something seems to be missing, count yourself first. You are usually the one you forgot.' }
  ],
  moral: 'When something is missing, count yourself before you cry. You are usually the one you forgot.',
  source: 'From the Paramanandayya Sishyula kathalu — the Telugu comic cycle of the guru and his devoted, muddle-headed disciples. Oral, many versions; the counting mishap is one of the oldest of them.'
},

{
  id: 'fk.srikalahasti',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Spider, the Snake and the Elephant',
  hook: 'A spider, a snake and an elephant loved the same forest shrine. The trouble was, none of them knew about the other two.',
  hero: 'pt_elephant',
  cast: ['pt_elephant', 'shiva', 'courtier'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['मकड़ी', 'makdi', 'spider'], ['साँप', 'saanp', 'snake'], ['हाथी', 'haathi', 'elephant']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"बहुत पुरानी बात है, शहर बसने से भी बहुत पहले, आंध्र की नदी स्वर्णमुखी—\\"सुनहरे मुख वाली नदी\\"—के किनारे जंगल में, पेड़ों के नीचे एक शिवलिंग था। न कोई पुजारी, न कोई घंटी, और न कोई छत। बस पत्थर, और एक गहरा सन्नाटा। और जंगल के तीन जीव, तीनों बिल्कुल अकेले, उससे सच्चा प्रेम करने लगे।"',
      text: 'Long before there was a town, in the forest by the river Swarnamukhi — "the golden-faced river" of Andhra — there stood a shivalinga under the trees, with no priest, no bell, and no roof. Just stone, and quiet. And three creatures of the forest, each entirely alone, fell in love with it.' },
    { art: ['courtier'], who: null,
      hi: '"सबसे पहले मकड़ी आई। और एक मकड़ी के पास देने को क्या होता है? रेशम। तो उसने वही दिया। शिवलिंग के ठीक ऊपर, उसने धागे पर धागा बुनकर एक शामियाना तैयार किया—चांदी की जाली जैसी एक छत, ताकि गिरते पत्तों और तपती धूप से बचाव हो सके। हर रोज़ कोई न कोई उसे फाड़ देता। और हर रोज़ वह उसे फिर से पूरा बुन देती।"',
      text: 'The spider came first. And what does a spider have to give? Silk. So she gave it. High over the linga she wove a canopy, thread by thread by thread — a ceiling of silver lace to keep off the falling leaves and the beating sun. Every day something tore it. Every day she wove it whole again.' },
    { art: ['pt_elephant'], who: null,
      hi: '"भोर होते ही नदी की ओर से हाथी आया, अपनी सूंड में साफ़ पानी भरकर। उसने शिवलिंग को बड़े लाड़ से ऊपर से नीचे तक नहलाया—और अनजाने में ही, चांदी की जाली वाली उस छत को बहा दिया—फिर उस साफ़, भीगे पत्थर पर जंगली पत्ते और फूल सजाए, कुछ देर वहीं खड़ा रहा, और फिर चला गया।"',
      text: 'The elephant came at dawn, up from the river, with his trunk full of clean water. He washed the linga tenderly from top to bottom — sweeping away, though he never once noticed, a certain silver lace canopy — and then laid wild leaves and flowers on the clean wet stone, and stood a while, and went.' },
    { art: ['courtier'], who: null,
      hi: '"और रात के अंधेरे में सांप सरकते हुए आया, अपने पास का इकलौता खज़ाना लिए: एक चमकती हुई मणि। उसने उसे शिवलिंग के चरणों में रख दिया, ताकि वह अंधेरे में एक छोटे से चांद की तरह चमकती रहे। सुबह हाथी के नहलाने से वह मणि बहकर सूखे पत्तों में जा गिरी। उस रात सांप ने देखा कि उसकी भेंट एक तरफ फेंकी पड़ी है—और ऊपर मकड़ी ने देखा कि उसका शामियाना फिर से फटा हुआ है।"',
      text: 'And in the night came the snake, gliding, carrying the one treasure a serpent owns: a shining jewel, which he laid at the foot of the linga so it would gleam there in the dark like a small moon. In the morning the elephant\'s washing swept the jewel into the leaves. That night the snake found his gift flung aside — and the spider, above, found her canopy torn again.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      hi: '"दिन-ब-दिन यही चलता रहा। तीनों में से हर कोई जब भी आता, अपनी भेंट को उजड़ा हुआ पाता, और तीनों के दिल में वही एक दुख भरी बात कौंधती: कोई मेरी पूजा बिगाड़ रहा है। जानबूझकर। मकड़ी ने गुस्से में और तेज़ी से जाला बुना। सांप अपनी मणि के चारों ओर और कसकर कुंडली मारकर बैठ गया। हाथी ने शिवलिंग को और भी ज़ोर-शोर से नहलाया।"',
      text: 'Day after day it went on. Each of the three arrived to find their offering ruined, and each thought the same hurt thought: somebody is spoiling my worship. On purpose. The spider spun grimly. The snake coiled tighter round his jewel. The elephant washed harder.',
      ask: {
        q: 'Each one finds their gift swept away every single day. What is actually happening?',
        options: ['A thief comes in the night', 'Three kinds of love keep tidying each other away', 'The forest wind does it'],
        answer: 1,
        right: 'That is the whole heartbreak of it — and nobody in the story can see it, because each one is certain that worship looks like theirs.',
        wrong: 'No thief, no wind. Three kinds of love, each certain that worship looks like its own, each tidying the other two away without ever knowing they existed.'
      } },
    { art: ['pt_elephant', 'courtier'], who: null, mood: 'think',
      hi: '"और फिर एक धुंधली सुबह, तीनों एक साथ आ पहुंचे—हाथी अपने पानी के साथ, सांप अपनी मणि के पास कुंडली मारे, और मकड़ी अपने धागे पर लटकी हुई—और आख़िरकार इतने दिनों की ग़लतफ़हमी फुफकारती और चिंघाड़ती हुई अपने पैरों पर आ खड़ी हुई। पुरानी कथाओं में इसके बाद जो हुआ, वह सचमुच बहुत बुरा था। पर यह कहानी उसे सही वक़्त पर रोक लेती है—और आपको यह बात साफ़-साफ़ बता भी देती है।"',
      text: 'And so one grey dawn, all three arrived at once — the elephant with his water, the snake still coiled by his jewel, the spider on her thread — and the long misunderstanding stood up on its feet at last, hissing and trumpeting. The oldest tellings let what happened next go very badly indeed. This telling stops it in time — and tells you so.' },
    { art: ['shiva'], who: null, mood: 'wow',
      hi: '"क्योंकि अब खुद उस पत्थर से भी और नहीं रहा गया। एक शांत, दिव्य रोशनी के साथ शिवजी शिवलिंग में से प्रकट हुए और उनके बीच आ खड़े हुए — वही भगवान, जिन्हें वे तीनों अकेले-अकेले, इतने समय से पूजते आ रहे थे। और उन्होंने तीनों को समझाया: वह रेशम उनके लिए छांव था। वह जल उनके स्नान के लिए था। वह मणि उनके लिए रोशनी थी। तीन भेंट। एक ही प्रेम। झगड़ा वहीं का वहीं ढेर हो गया, और उन तीनों ने पहली बार एक-दूसरे को ठीक से देखा।"',
      text: 'Because the stone itself had had enough. Shiva rose out of the linga in a blaze of gentle light and stood between them — the god all three had been loving, all along, alone. And he showed them, each to each: the silk was shade for him. The water was washing for him. The jewel was light for him. Three gifts. One love. The quarrel fell down dead where it stood, and the three of them looked at one another properly for the first time.' },
    { art: ['shiva', 'courtier'], who: null,
      hi: '"और ताकि कोई भी, कभी भी उन तीनों को न भूले, उस जगह का नाम ही उनके नाम पर पड़ गया। श्री, यानी मकड़ी। काल, यानी सांप। हस्ती, यानी हाथी। इन्हें एक साथ बोलकर देखो — श्री-काल-हस्ती।"',
      text: 'And so that no one, ever, would forget the three of them, the place itself took their names. Sri, the spider. Kala, the snake. Hasti, the elephant. Say them together — Sri-kala-hasti.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"आज आंध्र प्रदेश में श्रीकालहस्ती एक असली शहर है, जहाँ उसी स्वर्णमुखी नदी के किनारे एक भव्य मंदिर है, और दरवाज़े से अंदर आने वाले हर तीर्थयात्री को ठीक यही कहानी सुनाई जाती है। मकड़ी, सांप और हाथी का नाम यहाँ इतने पुराने समय से जुड़ा है, जितने पुराने समय का कोई अंदाज़ा भी नहीं लगा सकता।"',
      text: 'Srikalahasti is a real town in Andhra Pradesh today, with a great temple by that same golden-faced river, and every pilgrim who walks in through the gate gets told exactly this story. The spider, the snake and the elephant have been in its name for as long as anyone can measure.' }
  ],
  moral: 'The one who undoes your offering may simply be making their own. Love comes in more shapes than yours.',
  source: 'The temple legend of Srikalahasti, Andhra Pradesh — the spider, snake and elephant held in the town\'s own name. In the oldest tellings the three give their lives in their devotion; this telling ends before that, and says so.'
},

{
  id: 'fk.lepakshi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'Rise, Bird',
  hook: 'Rama found the great old bird lying among the rocks, too hurt to stand. What he said to him became the name of a village.',
  hero: 'rama',
  cast: ['rama', 'pt_heron', 'courtier'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['पक्षी', 'pakshi', 'bird'], ['उठो', 'utho', 'rise'], ['नाम', 'naam', 'name']],
  scenes: [
    { art: ['pt_heron'], who: null,
      hi: '"रामायण का वह दुखद मोड़ तो आप जानते ही हैं: सीता जी को आकाश के रास्ते दक्षिण की ओर हर कर ले जाया जा रहा था। पर शायद आप यह न जानते हों कि एक जीव ने इसे रोकने की कोशिश की थी। जटायु — पक्षियों के महान राजा, विशाल और वृद्ध, जो कभी बहुत बलवान थे और राम जी के पिता के मित्र थे। उन्होंने ऊपर आकाश से सीता जी की पुकार सुनी, अपने बूढ़े पंखों पर उड़ान भरी, और वे लड़े। वे बूढ़े थे, और हार गए।"',
      text: 'You know the terrible turn of the Ramayana: Sita, carried away south through the sky. What you may not know is that one creature tried to stop it. Jatayu — the great eagle-king, huge and old, who had been mighty once and had been Rama\'s father\'s friend. He heard Sita cry out overhead, and he rose on his old wings, and he fought. He was old, and he lost.' },
    { art: ['courtier'], who: null,
      hi: '"अब महाकाव्य से निकलकर ज़रा आंध्र की सूखी, पथरीली पहाड़ियों में आइए — शहद के रंग जैसी विशाल, बिखरी हुई चट्टानों की उस धरती पर। क्योंकि वहाँ के गाँव आपको बताएंगे कि यहीं, इन्हीं चट्टानों के बीच, वह महान पक्षी आकर गिरा था।"',
      text: 'Now come down out of the epic for a moment, into the dry, boulder-strewn hills of Andhra — the country of huge tumbled rocks the colour of honey. Because the villages there will tell you it was here, among these very boulders, that the great bird came down.' },
    { art: ['rama'], who: null, mood: 'sad',
      hi: '"राम और लक्ष्मण खोजते हुए दक्षिण की ओर आए, उस वीराने में सीता जी का नाम पुकारते हुए। और एक गर्म चट्टान पर उन्हें वे मिले — वह विशाल, वृद्ध पक्षी, जिसके पर दूर-दूर तक बिखरे पड़े थे, एक पंख कट चुका था, और जिनकी कहानी बस ख़त्म होने को थी। लेकिन उनकी आँखों में अब भी चमक थी, और वे अपनी साँसें थामे हुए थे। उन्हें कोई संदेश जो पहुँचाना था।"',
      text: 'Rama and Lakshmana came searching south, calling Sita\'s name into the empty country. And spread on a warm rock they found him — the enormous old bird, feathers scattered wide, one wing gone, his story nearly over. But his eyes were still bright, and he had been holding on. He had something to deliver.' },
    { art: ['pt_heron', 'rama'], who: null, mood: 'wow',
      hi: 'जितनी बची-खुची ताक़त थी, उससे जटायु ने उन्हें सब कुछ बता दिया: सीता को कौन ले गया था, और उसका रथ किस तरफ़ गया था—दक्षिण की ओर, समुद्र की तरफ़। उस भयानक खोजबीन में यह पहली बार था जब किसी ने उन्हें सीता का कोई पक्का सुराग दिया था—उम्मीद की पहली किरण। वह बूढ़ा पक्षी अपनी लड़ाई हार चुका था, फिर भी उसने अपना संदेश पहुँचा ही दिया।',
      text: 'With the strength he had saved, Jatayu told them everything: who it was that had taken her, and the way the chariot had gone, south, toward the sea. It was the first real news of Sita anyone had given them — the first thread of hope in all that terrible searching. The old bird had lost his fight, and delivered his message anyway.' },
    { art: ['rama', 'pt_heron'], who: null,
      hi: 'राम चट्टान पर घुटनों के बल बैठ गए और उस बड़े, ज़ख़्मी सिर को अपनी गोद में रख लिया, और उनके लिए वैसे ही शोक मनाया जैसे एक बेटा मनाता है—क्योंकि जटायु राम के परिवार के लिए अपनों की तरह लड़े थे। और यहीं पर तेलुगु की धरती इस महाकाव्य में अपने दो शब्द जोड़ती है। राम ने नीचे गिरे पक्षी को देखा और कहा: "ले, पक्षी।" उठो, पक्षी।',
      text: 'Rama knelt on the rock and took the great scarred head into his lap, and grieved for him as a son grieves — for Jatayu had fought for Rama\'s family as family. And here the Telugu country adds its own two words to the epic. Rama looked at the fallen bird and said: "Le, pakshi." Rise, bird.',
      ask: {
        q: 'What can "rise" mean, said gently to somebody who cannot get up?',
        options: ['It is an order he must somehow obey', 'It is a blessing — rise beyond this tired old body; you are finished, and you finished well', 'Rama was simply mistaken about how hurt he was'],
        answer: 1,
        right: 'That is how the tradition hears it. Not a command to the body — a blessing to the one inside it. You did the bravest deed in the whole story. Now rise, and rest.',
        wrong: 'Rama could see exactly how things stood. The tradition hears it as a blessing — rise beyond this tired old body. You did the bravest deed in the whole story. Now rest.'
      } },
    { art: ['rama'], who: null, mood: 'sad',
      hi: 'और महाकाव्य बताता है कि राम ने उस बूढ़े पक्षी को वही दिया जो एक बेटा अपने पिता को देता है—सम्मान, धन्यवाद और एक शांत विदाई। और जटायु ने अपनी लंबी ज़िंदगी का सफ़र वहीं शांति से, स्वयं ईश्वर की गोद में पूरा किया, अपनी सबसे बड़ी वीरता दिखाकर। फिर दोनों भाई उठे और दक्षिण की ओर बढ़ चले, उनके संदेश को युद्ध के अंत तक अपने साथ लिए हुए।',
      text: 'And the epic tells that Rama gave the old bird what a son gives a father — honour, and thanks, and a gentle letting-go — and that Jatayu finished his long story there in peace, in the god\'s own lap, having done the bravest thing in it. Then the brothers rose and walked on south, carrying his message all the way to the end of the war.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'लेकिन वे दो तेलुगु शब्द वहीं रह गए, उसी जगह पर जहाँ वे बोले गए थे। ले, पक्षी। इन्हें जल्दी से बोलिए—लेपाक्षी। आज तक उस गाँव का यही नाम है।',
      text: 'But the two Telugu words stayed behind, on the spot where they were spoken. Le, pakshi. Say them quickly — Lepakshi. That is the village\'s name to this day.' },
    { art: ['courtier'], who: null,
      hi: 'सदियों बाद, बनाने वालों ने लेपाक्षी में एक मंदिर खड़ा किया, मानो वह जगह शुरू से ही पवित्र रही हो—एक ही चट्टान से तराशा हुआ इतना विशाल नंदी बैल, जिसे आप सड़क से ही देख सकते हैं, और अंदर एक मशहूर खंभा जिसे लोग बड़े चाव से आपको दिखाएँगे कि वह ज़मीन को छूता ही नहीं है। लेकिन वहाँ किसी से भी इस नाम का मतलब पूछिए, तो हर बार आपको उसी बूढ़े पक्षी की बात सुनने को मिलेगी।',
      text: 'Centuries later, builders raised a temple at Lepakshi, as if the place had been holy all along — with a Nandi bull carved from a single rock so enormous you can see it from the road, and a famous pillar inside that people will delightedly show you does not quite rest on the ground. But ask anyone there what the name means, and you get the old bird, every time.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'जटायु अपनी लड़ाई हार गए। पूरी तरह से। और एक गाँव हज़ारों सालों से अपने नाम में उनकी याद को सँभाले हुए है। जगहों के नाम सिर्फ़ जीतने वालों के नाम पर ही नहीं रखे जाते—वे उनके नाम पर भी रखे जाते हैं, जिन्होंने अपनी पूरी जी-जान लगा दी।',
      text: 'Jatayu lost his fight. Completely. And a village has carried his memory in its name for thousands of years. Places do not name themselves only after the ones who win — they name themselves after the ones who tried with everything.' }
  ],
  moral: 'Trying with everything you have, and failing, can still be the deed a place keeps your name for.',
  source: 'The local legend of Lepakshi, Andhra Pradesh — "le, pakshi", rise, bird — joining the village to the Ramayana\'s Jatayu; the Veerabhadra temple with its hanging pillar and great stone Nandi stands there. Oral tradition, many tellings.'
},

/* ========================================================== PUDUCHERRY ====== */
/* Puducherry is four far-flung pieces on two coasts — Pondicherry and Karaikal on
   the Coromandel, Mahe on the Malabar coast, Yanam on the Godavari delta — and
   these seven stories deliberately use all four, because the geography IS the
   lesson. Where a legend belongs to a longer coast (Puhar, the Godavari, the
   Malabar fisher lore), the source line says so plainly. */
{
  id: 'fk.poompuhar-sea',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The City Under the Sea',
  hook: 'Fishermen on this coast will tell you: on very quiet nights, out past the surf, you can hear bells. There was a city out there once.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['शहर', 'shehar', 'city'], ['लहर', 'lehar', 'wave'], ['घंटी', 'ghanti', 'bell']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"दक्षिण के लंबे पूर्वी तट को कोरोमंडल कहा जाता है, और पुदुच्चेरी का समंदर किनारे बसा हिस्सा—कराईकल—इस तट का अपना एक कोना सँभाले हुए है: मछुआरों की नावें, झाऊ के पेड़, और समंदर की लहरों की ऐसी गूँज जो बिस्तर में लेटे-लेटे भी सुनाई दे जाए। इस तट की मछुआरी दादियाँ उन लहरों के उस पार की एक कहानी सुनाती हैं, और वह कहानी शुरू होती है इस तट पर बसे अब तक के सबसे भव्य शहर से।"',
      text: 'The long east coast of the south is called the Coromandel, and Karaikal — the sea-side piece of Puducherry — keeps its own stretch of it: fishing boats, casuarina trees, surf you can hear from your bed. The fisher grandmothers of this coast tell a story about what lies out past the breakers, and it begins with the grandest city the coast ever had.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"लोग उसे पुहार कहते थे—कावेरीपूमपट्टिनम, यानी कावेरी का फूल—जो वहाँ बसा था जहाँ यह महान नदी समंदर से मिलती थी। पुरानी तमिल कविताएँ उसकी जगमगाहट को याद करती हैं: ऐसे-ऐसे देशों से आए जहाज़ जिनके नाम भी कोई ठीक से न बोल पाए, रेशम, काली मिर्च और मोतियों से भरे गोदाम, सुनारों की गलियाँ, रात भर जलने वाला प्रकाश-स्तंभ, और खिड़कियों से छनकर आती संगीत की तानें।"',
      text: 'Puhar, they called it — Kaveripoompattinam, the flower of the Kaveri — built where the great river met the sea. The old Tamil poems remember it glittering: ships from countries nobody could pronounce, warehouses of silk and pepper and pearls, streets of goldsmiths, a lighthouse burning all night, and music coming out of the windows.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और कहानी कहती है कि उस शहर और समंदर के बीच एक समझौता था। हर साल पुहार में शुक्रिया अदा करने का एक बड़ा त्यौहार मनाया जाता था—झंडे लहराए जाते, लहरों पर दीये तैराए जाते, आकाश के देवता इंद्र के लिए गीत गाए जाते, और पूरा शहर किनारे पर उतरकर ऊँचे सुर में याद करता कि वह इस पानी का कितना कर्ज़दार है। और जब तक यह त्यौहार मनाया जाता रहा, समंदर भी एक अच्छे पड़ोसी की तरह अपनी हद में रहा।"',
      text: 'And the city had, the story says, an understanding with the sea. Every year Puhar kept a great festival of thanks — flags up, lamps floated on the waves, songs to the sky god Indra, the whole city down on the shore remembering out loud what it owed the water. And as long as the festival was kept, the sea kept its distance, like a good neighbour.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"फिर एक ऐसा साल आया जब राजा अपने ही दुखों में डूबे हुए थे, किसी की उन्हें याद दिलाने की हिम्मत न हुई, और त्यौहार का दिन चुपचाप बीत गया। न कोई झंडे। न कोई दीये। न कोई गीत। किसी की भी याद में यह पहला ऐसा साल था जब पुहार शुक्रिया कहना भूल गया।"',
      text: 'Then came a year when the king\'s heart was buried in his own sorrows, and nobody dared remind him, and the calendar turned quietly past the festival day. No flags. No lamps. No songs. The first year anyone could remember that Puhar forgot to say thank you.',
      ask: {
        q: 'The promise-day has passed with no lamps and no songs. What does the sea do?',
        options: ['Nothing — seas do not count days', 'It rises. Slowly. And comes up the streets', 'It dries up and goes away'],
        answer: 1,
        right: 'That is what the old epics say. Not a crash — a rising. The sea came up the streets of Puhar the way a tide comes in, and it did not turn around.',
        wrong: 'The fisher grandmothers will tell you: the sea counts everything. It rose — not with a crash, but slowly, up the streets, the way a tide comes in. And it did not turn around.'
      } },
    { art: ['guard'], who: null,
      hi: '"पानी बड़ी नर्मी से ऊपर चढ़ा, इस कहानी में यही तो एक अजीब सी दया है—हर दिन थोड़ा-सा और ऊँचा, चौखटों को छूता हुआ, आँगनों में आ बैठता हुआ, शहर को संभलने की मोहलत देता हुआ। और लोग समझ गए, उन्होंने अपने बच्चों, अपने बर्तनों और पिंजरों में अपनी चिड़ियों को समेटा, और ज़मीन के अंदरूनी हिस्से की ओर चल पड़े, जबकि पानी बड़े धीरज से उनके पीछे-पीछे चल रहा था।"',
      text: 'It rose gently, that is the strange mercy in the telling — a little higher each day, lapping at doorsteps, sitting down in courtyards, giving the city time. And the people understood, and gathered their children and their pots and their birds in cages, and walked inland with the water walking patiently behind them.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"और फिर समंदर उस खाली शहर में आकर पसर गया, सुनारों की गलियों, गोदामों और प्रकाश-स्तंभ की सीढ़ियों के ऊपर, और वहीं ठहर गया। इस तट का सबसे बड़ा बंदरगाह पानी के नीचे एक गहरी ख़ामोशी बनकर रह गया। पुराने तमिल महाकाव्य—वही जो कण्णगि और मणिमेकलै की गाथा सुनाते हैं—आज भी उस दिन को याद करते हैं जब यह हुआ था।"',
      text: 'And then the sea lay down in the empty city, over the goldsmith streets and the warehouses and the lighthouse stair, and stayed. The greatest port of the coast became a quietness under the water. The old Tamil epics — the very ones that tell of Kannagi and of Manimekalai — remember the day it happened.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'लेकिन मछुआरों के परिवार आज भी यह कहानी क्यों सुनाते हैं, उसकी वजह यह है। वे कहते हैं कि वह शहर कभी टूटा ही नहीं था — बस समूचा का समूचा, वापस ले लिया गया था। वह सब आज भी वहीं नीचे है, गलियों समेत, धुंधला, हरा और शांत। और बेहद शांत रातों में, झागदार लहरों के पार, कभी-कभी एक पुरानी घंटी को अपना काम याद आ जाता है।',
      text: 'But here is why the fisher families tell it still. The city, they say, was never wrecked — only taken back, whole. It is all still down there, streets and all, dim and green and quiet. And on very still nights, out past the surf, an old bell sometimes remembers its job.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'और यह बात शायद तुम्हें चौंककर सीधा बिठा दे: गोताखोरी के सामान और अनोखे औज़ारों के साथ बड़े लोग सचमुच वहाँ खोज करने गए हैं, उस छोटे से कस्बे के पास जिसे आज पूमपुहार कहा जाता है — और उन्हें पानी के बहुत नीचे दूर पुराने तराशे हुए पत्थर मिले हैं, ठीक वहीं जहाँ कहानी हमेशा से शहर का होना बताती थी। समुद्र थोड़ा-सा दिखाता है, और बाकी सब अपने पास रख लेता है।',
      text: 'And this may make you sit up: grown-ups with diving gear and clever instruments have actually gone looking, off the little town that carries the name Poompuhar today — and have found old worked stones far out under the water, where the story always said the city was. The sea shows a little, and keeps the rest.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'समुद्र तट की दादियाँ इससे एक सीख लेती हैं, और वह याद रखने लायक है: त्योहार खेल-कूद जैसे लगते हैं, पर वे असल में वादे होते हैं — ऐसे दिन जब कोई बस्ती बोलकर याद करती है कि उस पर क्या देनदारी है। अपने वादे के दिन निभाओ। समुद्र तो कम से कम पूरा हिसाब रख ही रहा है।',
      text: 'The grandmothers of the coast draw one lesson from it, and it is worth having: festivals look like play, but they are promises — the days a place remembers out loud what it owes. Keep your promise-days. The sea, at least, is keeping count.' }
  ],
  moral: 'What is forgotten sinks. What is remembered keeps a bell ringing, even under the sea.',
  source: 'The drowned city of Puhar (Kaveripoompattinam), remembered in the Tamil epics Silappadikaram and Manimekalai and in fisher lore along the Coromandel coast — of which Karaikal, in Puducherry, keeps its own stretch. Old worked stones have indeed been found offshore near today\'s Poompuhar.'
},

{
  id: 'fk.amudha-surabhi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Bowl That Was Never Empty',
  hook: 'It looked like an ordinary begging bowl. It had one rule: it could never run dry — as long as the hungriest person was fed first.',
  hero: 'courtier',
  cast: ['courtier', 'buddha', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['कटोरा', 'katora', 'bowl'], ['भरना', 'bharna', 'to fill'], ['भूखा', 'bhookha', 'hungry']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'इससे पहले कि समुद्र पुहार को वापस ले लेता — वह कहानी तो तुमने सुनी ही है — उस शहर के पास तट को देने के लिए एक और कहानी थी, और वह यह है। यह मणिमेकलै नाम की एक लड़की के बारे में है, जो एक मशहूर नृत्यांगना की बेटी थी, और जिसे बड़े होकर खुद भी एक मशहूर नृत्यांगना बनना था। पूरे शहर ने उसके लिए उसकी ज़िंदगी तय कर रखी थी। पर मणिमेकलै की सोच कुछ और ही थी।',
      text: 'Before the sea took Puhar back — you have heard that story — the city had one more tale to give the coast, and it is this one. It is about a girl called Manimekalai, a famous dancer\'s daughter, who was supposed to grow up to be a famous dancer herself. The whole city had planned her life for her. Manimekalai had other ideas.' },
    { art: ['buddha', 'courtier'], who: null,
      hi: 'शहर के बाग-बगीचों में उसने बौद्ध आचार्यों को सुना था — क्योंकि उन दिनों इस तमिल तट पर बुद्ध का मार्ग खूब फल-फूल रहा था, उनके भिक्षु और उनके उपवन मंदिरों और बाज़ारों के बीच ही मौजूद थे। वहाँ उसने जो कुछ सुना, वह उसके दिल में उतर गया और वहीं बस गया: कला दिखाने में बिताई ज़िंदगी, दूसरों को देने में बिताई ज़िंदगी के आगे बहुत छोटी लगने लगी।',
      text: 'In the city\'s garden groves she had listened to the Buddhist teachers — for in those days the Buddha\'s way flourished all along this Tamil coast, its monks and its gardens right there among the temples and the markets. What she heard there sat down in her heart and stayed: a life spent performing seemed a small thing next to a life spent giving.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'जिस महाकाव्य का नाम उसके नाम पर है, वह बताता है कि एक द्वीप पर, एक झील के किनारे, त्योहार के दिन, उसके हाथों में एक चमत्कार आया: एक भिक्षापात्र जिसका नाम अमुद सुरभि था — "वह अमृत जो कभी ख़त्म नहीं होता।" यह बिल्कुल वैसा ही कटोरा दिखता था जैसा कोई घुमक्कड़ भिक्षुणी लेकर चलती है। पर वह वैसा बिल्कुल नहीं था।',
      text: 'The epic that carries her name tells that on an island, beside a lake, on a festival day, a wonder came into her hands: a begging bowl called Amudha Surabhi — "the nectar that never fails." It looked like any bowl a wandering nun might carry. It was not.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"सच्चे दिल से दिए गए एक मुट्ठी चावल से एक बार भर जाने के बाद, वह कटोरा देता ही जाता, देता ही जाता और कभी खाली नहीं होता था। लेकिन इस्तेमाल करते-करते उसका एक नियम समझ आया: वह तभी भर-भरकर देता था जब सबसे भूखे इंसान को पहले परोसा जाए। अगर कतार के गलत छोर से शुरुआत कर दी, तो वह बस एक मामूली कटोरा बनकर रह जाता था।"',
      text: 'Filled once, with a handful of rice given by a good heart, the bowl would pour and pour and not run dry. But it had one rule, learned by using it: it poured only when the hungriest were served first. Start at the wrong end of the queue, and it was just a bowl.',
      ask: {
        q: 'A queue forms in front of the wonderful bowl: a king\'s messenger, a rich merchant, and a thin old woman standing at the very back. Who must be served first?',
        options: ['The king\'s messenger — kings come first', 'The rich merchant — he will pay', 'The thin old woman at the back'],
        answer: 2,
        right: 'Always. Manimekalai walked straight past the messenger and the merchant, and the bowl poured. Hunger is the only rank it recognised.',
        wrong: 'The bowl would have sat in her hands like a stone. Manimekalai walked to the thin old woman at the back — and the bowl poured. Hunger is the only rank it recognised.'
      } },
    { art: ['courtier'], who: null,
      hi: '"तो वह उसे लेकर दिन-ब-दिन शहर में घूमती रही — और जहाँ भूख सबसे ज़्यादा होती, कटोरा भी वहीं सबसे गहरा हो जाता। जब तक सामने फैला हुआ आखिरी हाथ न भर जाता, कटोरा कभी खाली नहीं हुआ। अमीर लोगों ने उसे खरीदने की पेशकश की। पर वह उस तरह का कटोरा नहीं था।"',
      text: 'So she walked the city with it, day after day — and wherever the hunger was worst, the bowl was deepest. It never once ran dry before the last outstretched hand. Rich men offered to buy it. It was not that kind of bowl.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"फिर उसने कुछ ऐसा माँगा जिससे पूरा शहर हैरान रह गया: उसे जेल के अंदर जाने दिया जाए, ताकि वह कैदियों को खाना खिला सके — वे भूले-बिसरे लोग, जो सबसे भूखे थे, जिन्हें कभी कोई पहले खाना नहीं खिलाता था। और राजा, उस लड़की को उन लोगों को चावल परोसते देख जिन्हें बाकी सब भूल चुके थे, इतने भावुक हुए कि महाकाव्य कहता है, उन्होंने जेल का रूप ही बदल दिया: सज़ा की जगह से बदलकर उसे देखभाल का घर बना दिया।"',
      text: 'Then she asked for something that startled the whole city: to be let into the prison, to feed the prisoners — the forgotten ones, the hungriest of all, whom nobody fed first. And the king, watching this girl serve rice to the people everyone else had crossed off, was so moved that the epic says he changed what the prison was: from a place of punishment into a house of care.' },
    { art: ['buddha'], who: null,
      hi: '"मणिमेकलै की कहानी तमिल भाषा के पाँच महान महाकाव्यों में से एक बन गई — एक बौद्ध महाकाव्य, जो इसी तट पर रचा गया था जब यहाँ बुद्ध का मार्ग फल-फूल रहा था, और जो एक ऐसी लड़की को याद करता है जिसने पूरे शहर से बढ़कर दान दिया था। जिस विश्वास ने इसे रचा, उसे यहाँ उसी तरह बताया गया है जैसे वह खुद को बताता है: भीतर से, बड़े प्यार के साथ।"',
      text: 'Manimekalai\'s story became one of the five great epics of the Tamil language — a Buddhist epic, made on this coast when the Buddha\'s way flowered here, remembering a girl who out-gave a city. The faith that made it is told here the way it tells itself: from the inside, with love.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"और उस कटोरे का जादू, सीधे शब्दों में कहें तो? आपकी रसोई का कोई भी बर्तन यही करामात कर सकता है, बस थोड़ी धीमी गति से। सबसे भूखे को पहले परोसिए, और किसी न किसी तरह सबके लिए हमेशा खाना पूरा पड़ जाता है। इसे बाँटना कहते हैं, और यह कभी खत्म नहीं होता।"',
      text: 'And the bowl\'s magic, told plainly? Any pot in your kitchen can do the same trick, only slower. Serve the hungriest first, and somehow there is always enough to go round. It is called sharing, and it has never once run dry.' }
  ],
  moral: 'Plenty is not how much the bowl holds. Plenty is which end of the queue you serve first.',
  source: 'Manimekalai, the Tamil Buddhist epic of Sattanar, set largely in Puhar on the Coromandel coast — the bowl Amudha Surabhi. The coast that remembers it includes Karaikal, in Puducherry. Told from inside the tradition, as every faith in this app is.'
},

{
  id: 'fk.thirunallar-nala',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The King Who Waited Out the Storm',
  hook: 'Everything King Nala touched began to go wrong — his luck, his kingdom, even his beloved dice. The place where his hard years finally ended is a small town you can still visit.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'shiva'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['सब्र', 'sabr', 'patience'], ['मुश्किल', 'mushkil', 'hard times'], ['स्नान', 'snaan', 'holy bath']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"राजा नल सचमुच बहुत अच्छे इंसानों में से एक थे — बहादुर, न्यायप्रिय, समझदार और दृढ़-निश्चयी दमयंती के पति, और तो और, अपने दौर के सभी राजाओं में सबसे बेहतरीन रसोइये। उनकी कहानी इतनी पुरानी है कि वह खुद महाभारत के भीतर सुनाई गई है। और यह एक भले इंसान के बुरे दिनों की कहानी है — जो इसे दुनिया की सबसे काम की कहानियों में से एक बनाती है।"',
      text: 'King Nala was one of the genuinely good ones — brave, fair, married to the wise and steadfast Damayanti, and, of all things, the finest cook among the kings of his age. His story is old enough to be told inside the Mahabharata itself. And it is the story of a good man\'s bad years — which makes it one of the most useful stories there is.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'क्योंकि परंपरा यही कहती है: आकाश की नौ महान ज्योतियों के बीच शनि चलते हैं — धीमे, सांवले और धीरज वाले। डरे हुए लोग चाहे कुछ भी कहें, वे क्रूर नहीं हैं। वे एक सख्त शिक्षक हैं, और उनका विषय है सब्र, और राजाओं सहित हर किसी के जीवन की बारी उनकी कक्षा में आती ही है। फिर नल की बारी आई।',
      text: 'For the tradition says this: among the nine great lights of the sky walks Shani — the slow, dark, patient one. He is not cruel, whatever frightened people say. He is the strict teacher, and his subject is patience, and every life, kings included, gets a turn in his classroom. Nala\'s turn came.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'और सब कुछ हाथ से फिसल गया। वे चौपड़ का ऐसा खेल खेलने बैठ गए, जिसमें उन्हें कभी नहीं बैठना चाहिए था, और वह सब हार गए जो अकेले उनका खोने के लिए नहीं था — अपना राजपाट, अपना सुख-चैन और अपने परिवार के सिर की छत। वह भला राजा रास्तों पर भटकने वाला एक मुसाफ़िर बन गया, तन पर बस एक फटा-पुराना कपड़ा और अपना ही नाम ऐसा लगने लगा जैसे किसी और का हो।',
      text: 'And everything slid. He sat down to a game of dice he should never have sat down to, and lost what was never his alone to lose — his kingdom, his comforts, the roof over his family. The good king became a wanderer on the roads, in one worn cloth, with his own name feeling like someone else\'s.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'आखिरकार उन्होंने एक दूसरे राजा की रसोई में काम संभाल लिया — क्योंकि राजा भले ही सब कुछ खो दे, पर एक अच्छा रसोइया कभी भूखा नहीं रहता। और बहुत दूर दमयंती ने, जो अपने सामने आए हर राजदरबार से कहीं अधिक समझदार थीं, उन्हें भूल जाने की हर सलाह ठुकरा दी। पुरानी कथाएँ कहती हैं कि उन्होंने स्वाद के सहारे अपने पति को ढूँढ निकाला: दूर की किसी रसोई से एक पकवान आया, और वे पहचान गईं कि यह किन हाथों का बनाया हुआ है। नल जैसा खाना कोई और बना ही नहीं सकता था।',
      text: 'He took work, in the end, in another king\'s kitchen — for a king can lose everything and a good cook still eats. And far away Damayanti, who was cleverer than any court she ever stood in, refused every suggestion that she forget him. The tellings say she tracked her husband down by taste: one dish arrived from a distant kitchen, and she knew the hand that had made it. No one else cooked like Nala.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'लेकिन वे कहाँ हैं, यह जान लेने भर से कठिन दिन खत्म नहीं हो सकते थे — कठिन दिन सिर्फ हमारे चाहने से खत्म नहीं होते। तो यही वह सवाल है, जिस पर यह पूरी कहानी घूमती है।',
      text: 'But knowing where he was could not end the hard years — hard years do not end because you want them to. So here is the question the whole story turns on.',
      ask: {
        q: 'What do you do inside years where nothing works, no matter how hard you try?',
        options: ['Stop trying — what is the use?', 'Keep doing small things well, and wait it out the way a farmer waits out a bad monsoon', 'Find somebody to blame'],
        answer: 1,
        right: 'That is what Nala did — cooked well, kept his word, stayed kind — and it is the whole of what the tradition teaches about hard seasons. They are weather. Farmers do not argue with weather; they outlast it.',
        wrong: 'Nala was tempted by both, the story admits. What he actually did was keep doing small things well — cook well, keep his word, stay kind — and wait, the way a farmer waits out a bad monsoon.'
      } },
    { art: ['courtier'], who: null,
      hi: 'और भटकते-भटकते, जैसा कि दक्षिण के मंदिरों की परंपरा बताती है, वे आखिरकार कोरोमंडल तट के पास हरे-भरे धान के खेतों वाले एक छोटे से स्थान पर पहुँचे — तिरुनल्लार — जहाँ शिव जी का एक प्राचीन मंदिर है, और उसी के भीतर स्वयं शनि का एक पावन देवालय भी। नल अंदर गए, अपने कठिन बरसों का सारा बोझ उसके आगे उतार कर रख दिया, और मंदिर के सरोवर में स्नान किया।',
      text: 'And in his wanderings, the temple tradition of the south tells, he came at last to a small place in the green paddy country near the Coromandel coast — Thirunallar — where there is an old temple of Shiva, and within it a shrine of Shani himself. Nala went in, and laid the whole weight of his years down in front of it, and bathed in the temple tank.' },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      hi: 'और वहीं, परंपरा कहती है, शनि ने उन्हें मुक्त कर दिया। हारे हुए नहीं — बल्कि पाठ पूरा करके। "इन्होंने वह सब कुछ सीख लिया है जो कठिन बरस इन्हें सिखा सकते थे। पाठ पूरा हुआ।" नल के ऊपर से बोझ ऐसे उतर गया जैसे कंधों से कोई भीगा लबादा उतार दिया गया हो, और कहानी का रुख पलट गया: उनका राज्य उनके पास लौट आया, और दमयंती भी, और वह उजियारा भी।',
      text: 'And there, the tradition says, Shani let him go. Not beaten — finished. "He has learned everything the hard years had to teach him. The lesson is over." The weight lifted off Nala like a wet cloak taken from his shoulders, and the story turns: his kingdom found its way back to him, and Damayanti, and the light.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"तिरुनल्लार के कुंड को आज भी नल तीर्थम कहा जाता है — यानी नल का जल — और अपने कठिन वर्षों का बोझ उठाए तीर्थयात्री आज भी यहाँ आते हैं, स्नान करते हैं, और राहत की सांस लेते हैं। और तिरुनल्लार कराईकल ज़िले में पड़ता है, जो पुदुच्चेरी का एक टुकड़ा है — जैसे किसी एक बटुए का सिक्का तमिल देश की जेब में गहराई में रखा हो।"',
      text: 'The tank at Thirunallar is called Nala theertham to this day — Nala\'s waters — and pilgrims carrying their own hard years still come, and bathe, and breathe out. And Thirunallar sits in Karaikal district, which is a piece of Puducherry — a coin from one purse sitting deep in Tamil country\'s pocket.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"एक और बात, और यह इस परंपरा की सबसे भली बात है। तमिल परिवार सबसे मुश्किल दौर को एक गिनती भी देते हैं — वे इसे साढ़े सात साल कहते हैं। भला किसी गिनती से क्या मदद मिलती है? क्योंकि जिस चीज़ की गिनती होती है, उसका एक अंत भी होता है। कठिन मौसम भी मौसम ही होते हैं। और मौसम बीत जाते हैं।"',
      text: 'One more thing, and it is the kindest thing the tradition does. Tamil families even put a number on the hardest stretch — they call it the seven-and-a-half years. Why does a number help? Because a thing with a number has an end. Hard seasons are seasons. Seasons end.' }
  ],
  moral: 'A hard season is a season, not a life. It teaches what it came to teach — and then, hold on to this part, it ends.',
  source: 'The temple legend of the Saniswaran shrine at Thirunallar, in Karaikal district, Puducherry — where King Nala of the Nala–Damayanti tale was released from his hard years; the tank there is called Nala theertham. Told with respect for Shani, as the tradition itself tells it.'
},

{
  id: 'fk.agastya-south',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Small Sage Who Balanced the World',
  hook: 'So many gods and sages crowded north for the great wedding that the world began to tip over. Somebody had to go and sit on the other end.',
  hero: 'courtier',
  cast: ['courtier', 'shiva', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['तराज़ू', 'taraazu', 'balance scales'], ['दक्षिण', 'dakshin', 'south'], ['उत्तर', 'uttar', 'north']],
  scenes: [
    { art: ['shiva'], who: null, mood: 'wow',
      hi: '"ऊँचे हिमालय में जब शिवजी ने पार्वतीजी से विवाह किया, तो सचमुच हर कोई वहाँ गया। देवता, ऋषि-मुनि, गण, और अपने चलने-फिरते रूपों में नदियाँ — युग के इस सबसे बड़े विवाह के लिए पूरी की पूरी सृष्टि उत्तर के पहाड़ों में सिमट आई। जिससे एक ऐसी समस्या खड़ी हो गई जिसके बारे में किसी ने सोचा ही नहीं था। वज़न।"',
      text: 'When Shiva married Parvati in the high Himalaya, absolutely everyone went. Gods, sages, spirits, rivers in their travelling shapes — all of creation packed itself into the mountains of the north for the wedding of the age. Which created a problem nobody had thought of. Weight.' },
    { art: ['guard'], who: null,
      hi: '"कथा कहती है कि दुनिया एक तरफ झुक गई। हर ख़ास चीज़ के उत्तरी छोर पर जमा हो जाने से, धरती ज़रूरत से ज़्यादा भरी नाव की तरह डोलने लगी — उत्तर भारी होकर नीचे धंसने लगा, और दक्षिण हल्का होकर ऊपर उठने लगा। किसी बहुत भारी चीज़ को, या किसी बहुत भारी व्यक्ति को, दूसरी तरफ जाकर बैठना था। विवाह के ही दौरान। फ़ौरन।"',
      text: 'The world, the story says, tilted. With everything of importance crowded onto its northern end, the earth began to lean like an overloaded boat — the north groaning downward, the south rising light and empty. Something, or someone, of very great weight had to go and sit on the other side. During the wedding. Immediately.' },
    { art: ['shiva', 'courtier'], who: null, mood: 'think',
      hi: '"शिवजी ने सभा पर नज़र दौड़ाई कि किसे भेजा जाए। और उन्होंने न तो सबसे बलवान देवता को चुना, न सबसे लंबे को। उन्होंने अगस्त्य को बुलाया — जो सभी ऋषियों में सबसे छोटे कद के थे, इतने छोटे कि बच्चों की भीड़ में भी खो जाएँ। क्योंकि शिवजी जानते थे कि दुनिया का तराज़ू ताक़त नहीं तौलता। वह तो ज्ञान तौलता है। और इस छोटे से कद वाले ऋषि का ज्ञान, उस पूरी बारात के कुल वज़न जितना भारी था।"',
      text: 'Shiva looked out over the gathering for the one to send. And he did not choose the strongest god or the tallest. He called Agastya — the smallest of all the sages, a man you could lose in a crowd of children. Because the scales of the world, Shiva knew, do not weigh muscle. They weigh wisdom. And this small man\'s learning weighed as much as the whole wedding party put together.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"अगस्त्य का चेहरा उतर गया, और कथा भी इसे छिपाती नहीं — उनसे युग के उस सबसे बड़े विवाह को छोड़ने के लिए कहा जा रहा था, जिसकी चर्चा दुनिया हमेशा-हमेशा करने वाली थी।"',
      text: 'Agastya\'s face fell, and the story lets it fall — he was being asked to miss the wedding of the age, the one everyone would talk about for the rest of time.',
      ask: {
        q: 'Miss the greatest celebration ever held — to go and hold the world level. What does the small sage do?',
        options: ['Refuse — he has waited ages for this day', 'Go. The earth matters more than the party', 'Send a student in his place'],
        answer: 1,
        right: 'He picked up his water-pot and his stick and turned south, that same hour. That is why the south calls him its own to this day.',
        wrong: 'Not Agastya. He picked up his water-pot and his stick and turned south that same hour — because the earth mattered more than the party. That is why the south calls him its own.'
      } },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      hi: 'और शिव ने, उन्हें जाते हुए देखकर, एक ऐसा वचन दिया जो पहली पंक्ति में बैठने से भी कहीं बढ़कर था: "आप जहाँ भी खड़े होंगे, जब भी अपने मन को इस ओर मोड़ेंगे — आपको यह विवाह बिल्कुल वैसे ही साफ दिखाई देगा, जैसे आप मेरे पास ही खड़े हों।" इसलिए वे नन्हे ऋषि दक्षिण की ओर चल पड़े, और पूरे रास्ते उनके मन की आँखों के सामने यह उत्सव चलता रहा, और आखिरकार उनका कुछ भी नहीं छूटा।',
      text: 'And Shiva, watching him go, gave him a promise worth more than a front-row seat: "Wherever you stand, whenever you turn your heart this way — you will see the wedding, clear as if you stood beside me." So the small sage walked south with the celebration playing before his inner eye the whole way, missing nothing after all.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'विंध्य पर्वत पर, जो हाल ही में और ऊँचा और अभिमानी होता जा रहा था और आसमान को छूने लगा था, उस पर्वतमाला ने महान ऋषि को रास्ता देने के लिए झुककर सिर नवाया। अगस्त्य ने मुस्कुराते हुए कहा, "जब तक मैं लौटकर न आऊँ, तुम ऐसे ही रहना।" वे कभी उत्तर वापस नहीं लौटे। विंध्य आज भी झुका हुआ है — और बुज़ुर्ग आँख मटकाते हुए कहते हैं कि यही वजह है कि आज कोई भी दक्षिण की ओर जा पाता है।',
      text: 'At the Vindhya mountains, which had lately been growing taller and prouder and were shouldering into the very sky, the range bowed low to let the great sage pass. "Stay just so until I return," said Agastya pleasantly. He never returned north. The Vindhyas are bowing still — which, the old ones say with a wink, is why anyone can cross into the south at all.' },
    { art: ['courtier'], who: null,
      hi: 'और जैसे ही उन्होंने दक्षिणी धरती पर कदम रखा, दुनिया बिल्कुल सीधी-सपाट हो गई — और तब से वैसी ही बनी हुई है। अगस्त्य हमेशा के लिए दक्षिण में बस गए और सबके दादाजी जैसे बन गए: परंपरा उन्हें तमिल व्याकरण का पहला शिक्षक मानती है, और आप इन कहानियों में उनसे पहले ही मिल चुके हैं, जब वे अपने छोटे से कमंडल में एक खास नदी को लिए घूम रहे थे, जब तक कि बीच में एक कौआ नहीं आ गया।',
      text: 'And the moment he crossed into the southern lands, the world came level — and level it has stayed. Agastya settled in the south for good and became its grandfather: tradition makes him the first teacher of Tamil grammar, and you have already met him in these stories, carrying a certain river in his little pot until a crow got involved.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'कोरोमंडल के तट पर, पुरानी परंपरा कहती है कि ऋषि का आश्रम वहाँ था जहाँ आज पांडिचेरी बसा है — उस शहर को कभी वेदपुरी कहा जाता था, और पुडुचेरी का वेदपुरीश्वरर मंदिर आज भी उस पुराने नाम को जीवित रखे हुए है। बाद में उन्हीं गलियों को अपने तमिल नामों के साथ-साथ फ्रांसीसी नाम भी मिल गए। यह हमेशा से एक ऐसा शहर रहा है जो एक साथ एक से ज़्यादा नाम सँभाल सकता है।',
      text: 'On the Coromandel shore, old tradition says the sage kept a hermitage where Pondicherry stands today — the town was once called Vedapuri, and the Vedapureeswarar temple in Puducherry keeps that old name alive right now. Later the same streets grew French names alongside their Tamil ones. It has always been a town that can hold more than one name at a time.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'और इस कहानी ने जो तस्वीर बनाई है, उसे याद रखिएगा: दुनिया तभी संतुलित रहती है जब दक्षिण को भी उत्तर जितना ही मान-सम्मान मिले। यह केवल भूगोल की बात नहीं है। भारत भी बिल्कुल इसी तरह चलता है।',
      text: 'And keep the picture the story painted: the world only stands level when the south is honoured with the same weight as the north. That is not just geography. India works exactly the same way.' }
  ],
  moral: 'When everyone crowds one way, the person who walks the other way may be holding the whole world level.',
  source: 'The pan-southern legend of Agastya sent south to balance the earth, with the bowing of the Vindhyas, from Puranic and Tamil tradition; Puducherry\'s own tradition of the sage\'s hermitage at Vedapuri survives in the name of the Vedapureeswarar temple in Pondicherry.'
},

{
  id: 'fk.gautami-yanam',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The River That Washed a Sorrow',
  hook: 'The kind sage\'s field fed the whole country through the famine. So why did he beg the gods for a river to wash him clean?',
  hero: 'courtier',
  cast: ['courtier', 'shiva', 'guard'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['खेत', 'khet', 'field'], ['दुख', 'dukh', 'sorrow'], ['धारा', 'dhaara', 'stream']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'बहुत समय पहले, अकाल के उन सालों में, जब बारिश बार-बार दगा दे जाती थी, उस सूखी-झुलसी धरती पर बस एक ही हरा-भरा खेत बचा था — पश्चिमी पहाड़ों में ब्रह्मगिरि की पहाड़ी पर, ऋषि गौतम के आश्रम में। कहानी कहती है कि उनकी प्रार्थना के नियम और शक्ति से, वह अकेला खेत हर एक दिन चावल देता था। और हर एक दिन, गौतम आने वाले हर व्यक्ति को भोजन कराते थे। हर किसी को। उन लोगों को भी, जो उन्हें पसंद नहीं करते थे।',
      text: 'In famine years, long ago, when the rains failed and failed again, there was exactly one green field left in the burnt country — on Brahmagiri hill in the western mountains, at the hermitage of the sage Gautama. By the steadiness of his prayer, the story says, that one field gave rice every single day. And every single day, Gautama fed everyone who came. Everyone. Including people who did not like him.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'और यहीं से सारी मुसीबत शुरू हुई। जिन लोगों की जान कभी उनके दिए चावल से बची थी, अकाल खत्म होते ही उनमें से कुछ लोग इस बात को पचा नहीं पाए। कुछ दिलों में अहसान का भाव खट्टा होकर जलन बन जाता है। वे सब मिलकर उस भले ऋषि को नीचा दिखाने की तरकीबें सोचने लगे।',
      text: 'And that last part is where the trouble grew. Some of the very people his rice had kept alive found, as the famine ended, that they could not forgive him for it. Gratitude curdles in some hearts, and turns to jealousy. They put their heads together to make the good sage small again.' },
    { art: ['courtier'], who: null,
      hi: 'उनकी चाल बड़ी बेरहम और शातिर थी। उन्होंने एक माया रची — परछाई जैसी दुबली-पतली, एक कमज़ोर बूढ़ी गाय — और बुआई के समय उसे गौतम के प्यारे खेत में छोड़ दिया। गौतम, जो हमेशा बहुत दयालु थे, उन्होंने घास का एक मुलायम तिनका उठाया — हाथ से छूने लायक सबसे कोमल चीज़ — और उसे हिलाकर गाय को वहां से हटाने लगे।',
      text: 'Their trick was cruel and clever. They shaped an illusion — a frail old cow, thin as a shadow — and sent her wandering into Gautama\'s precious field at seed time. Gautama, ever gentle, picked a soft blade of grass, the mildest thing a hand can hold, and waved her away with it.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'और गाय गिरी, फिर उठी ही नहीं — और फिर धुंध बनकर गायब हो गई, क्योंकि वह कभी असली गाय थी ही नहीं। लेकिन गौतम को यह बात पता नहीं थी। उन्हें तो बस वही मालूम था जो उनकी आँखों ने देखा था: उनका हाथ, और नीचे गिरी हुई गाय। एक ऐसे ऋषि के लिए, जो कभी किसी पत्ते को भी चोट न पहुँचाते, इससे भारी दुख का बोझ उन पर और कोई नहीं हो सकता था। और वे ईर्ष्यालु लोग बाड़ के पास खड़े होकर ज़ोर-ज़ोर से कहने लगे कि यह सब उन्हीं की गलती है।',
      text: 'And the cow fell, and did not get up — and then thinned into mist and was gone, for she had never been a real cow at all. But Gautama did not know that. All he knew was what his eyes had shown him: his hand, and a fallen cow. For a sage who would not bruise a leaf, there was no heavier stone the world could have laid on him. And the jealous ones stood at the fence, loudly agreeing that it was all his fault.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'तो वे वहीं खड़े रह गए, यही मानते हुए कि उनसे अनजाने में ऐसा अनर्थ हो गया है जो वे कभी करना नहीं चाहते थे।',
      text: 'So there he stood, believing he had done a harm he never meant.',
      ask: {
        q: 'What does a good person do with a harm they believe they have caused?',
        options: ['Hide it and hope nobody finds out', 'Carry it alone forever', 'Ask for help to make it right — help bigger than they could ever make alone'],
        answer: 2,
        right: 'That is what Gautama did — and asking honestly for help that big is not weakness. It is the strongest move in the whole story.',
        wrong: 'Hiding and carrying are what guilt whispers. Gautama did the strong thing instead: he asked for help bigger than he could make alone.'
      } },
    { art: ['shiva', 'courtier'], who: null, mood: 'wow',
      hi: 'वे ब्रह्मगिरि की चोटी पर चढ़े और उन्होंने शिव से प्रार्थना की — जो हो चुका था उसे मिटाने के लिए नहीं, बल्कि उसे धोने के लिए: “मुझे यहाँ, दक्षिण में, गंगा का जल दीजिए, ताकि यह दुख और इसके बाद का हर दुख धुलकर साफ़ हो सके।” और शिव — उनके सच्चे दुख से द्रवित होकर, और यह अच्छी तरह जानते हुए कि यह किसकी चाल थी — उन्होंने अपनी जटाओं से एक चमकती हुई जलधारा उस पहाड़ी की चोटी पर बहा दी।',
      text: 'He climbed to the top of Brahmagiri and prayed to Shiva — not to undo what could not be undone, but to wash it: "Send me Ganga\'s water, here, in the south, so that this sorrow and every sorrow after it can be washed clean." And Shiva — moved by the honest grief, and knowing perfectly well whose trick it had been — released from his own bound-up hair a shining stream onto the hilltop.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'वह धारा उमड़ी, फैली, और पूरे भूभाग को पार करती हुई पूरब की ओर बह निकली — गोदावरी, दक्षिण की महान नदी, जिसे परंपरा में गौतमी भी कहा जाता है: यानी ऋषि की नदी। और वह छल सामने आ ही गया, जैसे हर छल खुल जाता है; और वे चालबाज़ उथले पानी में शर्मिंदा खड़े रह गए; और नदी ने बिना माँगे उन्हें भी धो दिया। नदियाँ पहले नाम नहीं पूछतीं।',
      text: 'The stream rose, and gathered, and set off east across the whole width of the land — the Godavari, the great river of the south, whom the tradition also calls Gautami: the sage\'s river. And the trick came out, as tricks do; and the tricksters stood ashamed in the shallows; and the river washed them too, without being asked. Rivers do not check names first.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'नक्शे पर उसकी राह देखो, तो वह पूरे प्रायद्वीप से होकर बहती है, आगे बढ़ते-बढ़ते और चौड़ी होती जाती है, यहाँ तक कि नारियल के पेड़ों, नहरों और धान के हरे-भरे डेल्टा में बँटकर कई मुहानों से समंदर में जा मिलती है। और उन्हीं मुहानों में से एक पर छुपा है एक अचंभा: यानम, एक तेलुगु नदी पर बसा पुदुच्चेरी का एक छोटा-सा टुकड़ा, जहाँ कभी घाटों पर फ्रेंच बोली जाती थी — खुद पॉन्डिचेरी से दो घंटे की दूरी और पूरे एक तट के पार।',
      text: 'Follow her on a map and she runs right across the peninsula, widening as she goes, until she splits into a great green delta of coconut and canal and rice, and meets the sea through many mouths. And at one of those mouths sits a surprise: Yanam, a little piece of Puducherry on a Telugu river, where French was once spoken on the ghats — a two-hour drive and a whole coast away from Pondicherry itself.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'हर बारहवें साल नदी का बड़ा स्नान-पर्व, पुष्करम, पहाड़ों से लेकर समंदर तक उसके किनारों को भर देता है — यानम के घाट भी इसमें शामिल हैं। याद रहे, यह नदी इसलिए जन्मी थी क्योंकि किसी नुकसान के बाद एक भले आदमी का पहला ख्याल यह नहीं था कि "किसने देखा?" बल्कि यह था कि "मैं इसे ठीक कैसे करूँ?"',
      text: 'Every twelfth year the river\'s great bathing festival, the Pushkaram, fills her banks from the hills to the sea — Yanam\'s ghats included. A river born, remember, because one good man\'s first thought after a harm was not "who saw?" but "how do I make it right?"' }
  ],
  moral: 'A good person\'s first thought after a harm is not "who saw me?" but "how do I make it right?" — and help, asked for honestly, comes bigger than the harm.',
  source: 'The origin legend of the Godavari as Gautami — the sage Gautama, the illusion cow and the stream from Shiva\'s hair — from Puranic tradition, told the river\'s whole length to its mouths; Yanam, in Puducherry, sits at one of them. The Godavari Pushkaram is still kept.'
},

{
  id: 'fk.kadalamma',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Sea Mother\'s Storeroom',
  hook: 'Some mornings, without any warning, the sea by Mahe goes still and brown and fills to the brim with fish. The coast has an old explanation.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_heron'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['मछली', 'machhli', 'fish'], ['बरसात', 'barsaat', 'the rains'], ['टोकरी', 'tokri', 'basket']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'माहे पुदुच्चेरी का सबसे छोटा और सबसे हरा-भरा हिस्सा है — मालाबार तट पर नदी के मुहाने पर बसा एक कस्बा, जहाँ मलयालम बोली जाती है, जहाँ कभी फ्रांसीसी झंडा लहराता था, और अगर आप इसे इसके पुराने नाम, मय्यषी से पुकारेंगे, तो पूरा कस्बा समझ जाएगा कि आपका मतलब अपने घर से है। यहाँ के लोग हमेशा समंदर में पाँव उतारे जीए हैं। यह उनके तट की सुनाई एक कहानी है।',
      text: 'Mahe is the smallest and greenest piece of Puducherry — one river-mouth town tucked into the Malabar coast, speaking Malayalam, once flying a French flag, and if you ask for it by its older name, Mayyazhi, the whole town will know you mean home. Its people have always lived with their feet in the sea. This is a story their coast tells.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'मालाबार तट के मछुआरा परिवार समंदर को बेजान चीज़ नहीं समझते। वे उसे \'कदलम्मा\' कहते हैं — कदल यानी समंदर, अम्मा यानी माँ। अम्मा से आप सिर्फ माँगते ही नहीं रहते। नाव समंदर में उतारने से पहले आप उन्हें प्रणाम करते हैं। उनके मिज़ाज का ध्यान रखते हैं। और तंगी के दिनों में भी यह भरोसा रखते हैं कि वे आपको भूली नहीं हैं।',
      text: 'The fisher families of the Malabar shore do not call the sea "it." They call her Kadalamma — kadal, the sea; amma, mother. You do not simply take from an amma. You greet her before you push the boat out. You mind her moods. And you trust, even in the thin times, that she has not forgotten you.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'और तंगी के दिन आते हैं, हर एक साल। जब मानसून आता है, तो हफ़्तों तक समंदर इतना उफनता है कि नावें बिल्कुल बाहर नहीं जा सकतीं। ये वो महीने होते हैं जब रात का खाना कम होने लगता है, माँएँ एक ही मछली से तरह-तरह के जतन करने लगती हैं, और मछुआरों के घरों के बच्चे बचपन में ही समझ जाते हैं कि सूनी रसोई की खामोशी कैसी होती है।',
      text: 'And there are thin times, every single year. When the monsoon arrives, the sea turns wild for weeks on end and the boats cannot go out at all. Those are the months when dinners grow small, and mothers get very clever with one fish, and the children of fisher houses learn early what a quiet kitchen sounds like.' },
    { art: ['pt_heron', 'courtier'], who: null, mood: 'wow',
      hi: 'और फिर — कुछ सालों में, जैसे ही बारिश थमती है — तट एक चमत्कार के साथ जाग उठता है। समंदर का एक हिस्सा मंदिर के कुंड जैसा चपटा और शांत हो जाता है, उथली हुई मिट्टी से मटमैला, जबकि दोनों तरफ लहरें हमेशा की तरह सफ़ेद फेन बनकर टकराती रहती हैं। और उस थमे हुए मटमैले पानी में ज़िंदगी छलकने लगती है: झींगे, सारडीन और इतनी मछलियाँ जितनी पिछली बार के बाद किसी ने नहीं देखीं — किनारे के इतने पास झुंड बनाए हुए कि रेत पर खड़ा बच्चा भी उन्हें चमकते हुए देख सकता है। इस तट के पास इसके लिए एक शब्द है: चाकरा।',
      text: 'And then — some years, as the rains ease — the coast wakes up to a miracle. A stretch of sea gone flat as a temple tank, calm and brown with stirred-up mud, while the waves crash on white as ever to either side. And that still brown water is boiling with life: prawns, sardines, more fish than anyone has seen since last time — swarming so close in that a child on the sand can watch them flicker. The coast has a word for it: chakara.' },
    { art: ['courtier'], who: null,
      hi: 'और समुद्र तट की एक पुरानी बात यह भी है, वही जो दादियाँ-नानियां सुनाती हैं। हर अम्मा की तरह कदलम्मा का भी एक भंडार-घर है। बारिश के उन भूखे हफ़्तों में, वे किनारे पर बसे अपने बच्चों की शांत रसोइयों की आहट सुनती हैं। और जब आख़िरकार तूफ़ान थम जाता है, तो उन्हें अपने बच्चों की याद आती है — और वे अपने भंडार-घर के दरवाज़े खोल देती हैं, ठीक उनकी चौखट के पास, जहाँ सबसे छोटी नाव और सबसे बूढ़े काका भी पहुँच सकें।',
      text: 'And here is the coast\'s old explanation, the one the grandmothers give. Kadalamma keeps a storeroom, the way every amma does. All through the hungry weeks of the rains she hears the quiet kitchens of her children on the shore. And when the storm finally spends itself, she remembers them — and opens the storeroom doors wide, right at their doorstep, where even the smallest boat and the oldest uncle can reach.',
      ask: {
        q: 'The sea is suddenly full of fish, right at your feet. What do you do?',
        options: ['Take absolutely everything you can — it may never come again', 'Take what your household and your neighbours need, thank Amma, and leave plenty in the water', 'Fence off the beach and charge the other boats'],
        answer: 1,
        right: 'That is the rule of the coast, old as the boats. A mother\'s storeroom is opened for all her children — grabbing it all is exactly the thing you do not do to a gift.',
        wrong: 'The elders of the shore would stop you gently. A mother\'s storeroom is opened for all her children — you take what is needed, thank Amma, and leave the sea her seed for next year.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'इसलिए जब चाकारा आता है, तो बड़े-बुज़ुर्ग पुराने नियमों का पालन करते हैं। समंदर में हर परिवार की नाव की बारी आती है। बाज़ार में एक भी टोकरी जाने से पहले, उन घरों को मछलियाँ दी जाती हैं जिनके पास कोई नाव नहीं है। और कोई भी, कभी भी इस तोहफ़े को बर्बाद करके इसका मज़ाक नहीं उड़ाता — क्योंकि अपनी अम्मा के हाथ के खाने का कोई अपमान नहीं करता, और उनके भंडार-घर का तो बिल्कुल भी नहीं।',
      text: 'So the elders keep the old rules when the chakara comes. Every family\'s boat gets its turn at the water. The houses with no boat at all are given fish before one basket goes to market. And nobody, ever, mocks the gift by wasting it — because you do not insult your amma\'s cooking, and you certainly do not insult her storeroom.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'अब, समंदर की पढ़ाई करने वाले बड़ों का अपना ही कहना है: मानसून की बाढ़ किनारे पर कीचड़ की एक नरम परत बहा लाती है, और वह कीचड़ तेल की तरह लहरों को शांत कर देता है, फिर उस शांत और समृद्ध पानी में ढेर सारी मछलियाँ जमा हो जाती हैं। मछुआरों के परिवार बड़े आदर से उनकी बात सुनते हैं और सिर हिलाते हैं। दोनों ही बातें एक साथ सच हो सकती हैं। आख़िर एक अच्छी कहानी का काम ही यही होता है।',
      text: 'Now, the grown-ups who study the sea have their own telling: the floods of the monsoon wash a soft bank of mud down along the shore, and the mud calms the waves like oil, and the fish gather in that calm, rich water. The fisher families listen politely and nod. Both tellings can be true at once. That is what a good story is for.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगर तुम कभी बारिश के ख़त्म होने पर उस हरे-भरे तट पर जाओ — माहे में, या मालाबार तट पर कहीं भी — तो तुम वही सवाल पूछ सकते हो जो हर साल पूरा किनारा पूछता है, जैसे रसोई के बाहर खड़े बच्चे पूछते हैं: "क्या चाकारा आ गया?" और अगर वह आ गया हो, तो रेत पर उतरकर देखो कि कैसे एक माँ अपना वादा निभाती है।',
      text: 'If you are ever on that green coast at the end of the rains — Mahe, or anywhere along the Malabar shore — you can ask the question the whole coast asks each year, like children outside a kitchen: "Has the chakara come?" And if it has, go down to the sand and watch a mother keep her promise.' }
  ],
  moral: 'A gift that arrives at everyone\'s feet is meant for everyone\'s baskets — and taking gently is how you say thank you to the sea.',
  source: 'Fisher lore of the Malabar coast — Kadalamma the Sea Mother and the chakara, the calm, teeming sea after the rains; Mahe, in Puducherry, keeps its own stretch of that coast. Oral and living; the mudbank chakara itself appears most years somewhere along the shore.'
},

{
  id: 'fk.tittibha-sea',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-south',
  badge: 'katha',
  title: 'The Birds Who Argued With the Sea',
  hook: 'The sea took two small eggs from the beach. So two small birds decided they would empty the sea. Beakful by beakful.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'pt_crow', 'courtier'],
  minutes: 4,
  place: ['IN-PY'],
  words_hi: [['अंडा', 'anda', 'egg'], ['घोंसला', 'ghonsla', 'nest'], ['बूँद', 'boond', 'drop']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'पॉन्डिचेरी में शाम के समय पूरा शहर समंदर किनारे टहलता है, काले पत्थरों के ऊपर बनी सड़क पर, और नीचे समंदर किसी ऐसे बड़े नगाड़े की तरह गूँजता रहता है जो कभी थकता ही नहीं। और उस किनारे पर वे आज भी उस समंदर के बारे में एक ऐसी कहानी सुनाते हैं जो पंचतंत्र जितनी ही पुरानी है — क्योंकि वह सचमुच पंचतंत्र से ही है। वह कहानी कुछ ऐसी है।',
      text: 'In Pondicherry the whole town walks by the sea in the evening, along the promenade above the black rocks, and the sea booms away below like a big drum that never gets tired. And on that shore they still tell a story about that sea which is as old as the Panchatantra — because it IS from the Panchatantra. It goes like this.' },
    { art: ['pt_heron', 'pt_crow'], who: null,
      hi: 'टिट्टिभ पक्षियों के एक जोड़े ने — छोटे, फुर्तीले समुद्री पक्षी जिनकी टाँगें घास के तिनकों जैसी पतली थीं — लहरों की पहुँच से ज़रा ऊपर, ठीक रेत पर घोंसला बनाने की सोची। समंदर उन्हें घोंसला बनाते देखता रहा, और उस वक़्त समंदर बड़े घमंड में था। "नन्हे पक्षियो," वह फुसफुसाया, "तुम इतने विशाल समंदर के चरणों में घोंसला बना रहे हो।" "हमें पता है," अपने काम में जुटे पक्षियों ने कहा। "ज़रा कायदे से रहना!"',
      text: 'A pair of tittibha birds — small, quick shore birds with legs like grass stalks — decided to nest right on the sand, above the tide line. The sea watched them build, and the sea was in one of its proud moods. "Little birds," it murmured, "you are nesting at the feet of the enormous sea." "We know," said the birds, busy. "Mind you behave yourself."' },
    { art: ['pt_heron'], who: null, mood: 'sad',
      hi: 'समुद्र को अपनी पूरी ज़िंदगी में किसी ने तमीज़ से रहना नहीं सिखाया था। इसलिए एक रात, बस यह दिखाने के लिए कि \'विशाल\' होना क्या होता है, वह चुपचाप उमड़ा, अपनी एक लंबी लहर रेत पर आगे बढ़ाई, और घोंसले में से दोनों अंडे उठा ले गया — नीचे अपने हरे अंधेरे में, यह देखने के लिए कि वे नन्हे पक्षी अब क्या कर लेंगे।',
      text: 'The sea had never in its life been told to behave. So one night, just to show what enormous meant, it swelled up quietly, reached one long wave up the sand, and took the two eggs out of the nest — down into its green dark, to see what the little birds would do about it.' },
    { art: ['pt_heron', 'pt_crow'], who: null, mood: 'think',
      hi: 'दुख से भरी एक भयानक सुबह के बाद उन्होंने जो किया, वह था गुस्सा होना — ऐसा गुस्सा जो काम आए। उन दोनों ने पूरे क्षितिज की ओर देखा, दूर-दूर तक, और पूरे महासागर से ऐलान कर दिया: "हमारे अंडे वापस कर दो। वरना हम तुम्हें खाली कर देंगे। एक-एक चोंच भर-भरकर, तुम्हारे आखिरी भीगे पत्थर तक।"',
      text: 'What they did, after one terrible morning of grief, was get angry — the useful kind. The two of them looked out at the horizon, all of it, and made an announcement to the entire ocean: "Give back our eggs. Or we will empty you. Beakful by beakful, down to your last wet stone."',
      ask: {
        q: 'Two birds the size of your fist against every ocean on earth. Can they possibly empty the sea?',
        options: ['No — so why even try?', 'No — but that was never the real plan. A promise kept loudly, without stopping, gathers help', 'Yes, in about a thousand years'],
        answer: 1,
        right: 'Watch what happens next. It is not about the water level. It is about who is watching somebody small refuse to give up.',
        wrong: 'Of course they cannot — and it does not matter. Watch what happens. It is not about the water level. It is about who is watching somebody small refuse to give up.'
      } },
    { art: ['pt_heron'], who: null,
      hi: 'और वे लग गए। चोंच डुबोई, उड़कर चट्टानों तक गए, बूंद गिरा दी। फिर दूसरी बूंद के लिए वापस। पूरी सुबह। पूरा दिन। बूंद, दर बूंद, दर बूंद, उस पूरे हिंद महासागर के सामने — जो पूरे पंचतंत्र का सबसे मजेदार मज़ाक लगता है, जब तक कि आपको यह एहसास न हो कि आपकी हंसी रुक चुकी है।',
      text: 'And they began. Dip the beak, fly to the rocks, spit out the drop. Back for another. All morning. All day. Drop, by drop, by drop, against the entire Indian Ocean, which is the best joke in the whole Panchatantra until you notice you have stopped laughing.' },
    { art: ['pt_crow', 'pt_heron'], who: null, mood: 'wow',
      hi: 'बाकी पक्षी पहले तो हँसे, ज़ाहिर है। फिर उन्होंने थोड़ी देर देखा। फिर, एक-एक करके, उनकी हँसी बंद हो गई और वे भी चोंच डुबोने लगे — गौरैया, बगुले, गंगा-चिल्ली, कौवे, चोंचों से भरा पूरा तट, बूंद-दर-बूंद-दर-बूंद। जब कोई छोटा सा जीव रुकने से इनकार कर देता है, तो उसमें कोई ऐसी बात होती है जिसे देखकर बाकी लोगों के लिए आगे बढ़ जाना नामुमकिन हो जाता है।',
      text: 'The other birds laughed first, of course. Then they watched a while. Then, one by one, they stopped laughing and started dipping — sparrows, herons, gulls, crows, a whole coastline of beaks, drop by drop by drop. There is something about somebody small who will not stop that other somebodies find impossible to walk past.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'और यह खबर एक-एक पक्षी से होते हुए, खुद गरुड़ तक जा पहुँची — उड़ने वाले हर पक्षी के राजा, जिनके परिवार की वह नन्ही टिटहरी भी एक सदस्य थी। वे नीचे उतरे, अपने ऐसे पंखों के साथ जिन्होंने सूरज को भी धुंधला कर दिया — और ध्यान रहे, वे नन्हे पक्षियों की तरफ़ थे, वह सारी विशालता उन दो तटवर्ती पक्षियों के साथ थी — और उन्होंने समुद्र की तरफ़ देखा, और उससे बस एक बार कहा कि जो उसने लिया है, वह लौटा दे।',
      text: 'And the news of it rose, bird by bird, all the way up to Garuda himself — the king of every bird that flies, whose family the smallest sandpiper belongs to. Down he came, with wings that dimmed the sun — on their side, mind, all that hugeness on the side of two shore birds — and he looked at the sea, and asked it, once, to give back what it had taken.' },
    { art: ['pt_heron', 'pt_crow'], who: null,
      hi: 'और समुद्र ने — जिसमें सिर्फ़ घमंड था, जो दिल से बुरा नहीं था — उन दो नन्हे पक्षियों को देखा, उनके पीछे चोंचों से भरे पूरे तट को देखा, और ऊपर गरुड़ से घिरे पूरे आसमान को देखा, और समझ गया कि अकेले घमंड का बोझ उठाना बहुत भारी होता है। वह एक कोमल लहर पर अंडों को वापस ऊपर ले आया और उन्हें सही-सलामत घोंसले में रख दिया, उनके चारों ओर सफ़ेद झाग की एक माफ़ी के साथ।',
      text: 'And the sea — which had only ever been proud, not truly wicked — looked at the two little birds, and the coastline of beaks behind them, and the sky full of Garuda above, and understood that pride is a very heavy thing to carry alone. It brought the eggs back up on a soft wave and laid them in the nest, unbroken, with an apology of white foam around them.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: '"अंडे उसी समंदर के किनारे फूटे, और चूज़े उसके उथले पानी में छपछपाते हुए बड़े हुए, और समंदर ने उन्हें किसी की भी अम्मा की तरह झुलाया। शाम के वक्त पॉन्डिचेरी की चट्टानों पर वो आज भी थोड़ी डींगें हाँकता है। और टिट्टिभ भी। सच कहें तो, दोनों ने ही यह हक़ कमाया है।"',
      text: 'The eggs hatched by that same sea, and the chicks grew up paddling in its shallows, and the sea rocked them like anybody\'s amma. It still boasts a little, evenings, on the Pondicherry rocks. So do the tittibhas. Honestly, both sides have earned it.' }
  ],
  moral: 'Too small to win is not too small to start — and nothing on earth gathers help faster than somebody small who refuses to stop.',
  source: 'Panchatantra — the tittibha birds and the sea, told here the way it gets told on the Coromandel shore at Puducherry. In older tellings Garuda\'s help arrives with harder threats behind it; softened here, and the source says so.'
}

];

window.IND_COLLECTIONS_SOUTH = [
  { id: 'desh-south', name: 'The Deep South', note: 'Kerala, Tamil Nadu, Karnataka, Andhra — and the four scattered pieces of Puducherry, on two coasts.', avatar: 'pt_crocodile' }
];
