/* Bizzing India — deva and asura stories, outside the two epics.

   Every object here carries badge 'katha' — a story as it is told (docs/05 §1).

   THE ONE THING TO UNDERSTAND BEFORE EDITING THIS FILE.

   "Asura" is not the Sanskrit word for demon, and this collection exists partly
   to stop a child growing up thinking it is. Devas and asuras are half-brothers
   in the telling — children of the same father, Kashyapa, by different mothers.
   They churn the same ocean together in the story that opens this file. They
   share teachers. They marry across. Prahlada is an asura and one of the most
   beloved devotees in the whole tradition. Mahabali is an asura and Kerala has
   welcomed him home every Onam for centuries. Shukracharya is an asura's guru
   and a revered sage. Banasura was a devotee of Shiva.

   So: NOBODY in this file is written as a monster, and nobody in the asura art
   is drawn as one (docs/05 §7, and the note at the top of avatars.js about the
   epic antagonists — same rule, same reason). Where an asura is on the wrong
   side of a story, he is on the wrong side of it as a person is: proud, or
   frightened, or unable to stop. Never because of what he was born as.

   TWO FLAGGED PAGES, and why:

   - 'ds.mahishasura' ships needs_review: true. Durga's victory over Mahishasura
     is one of the most loved stories in India and the whole of Durga Puja rests
     on it — and, separately and genuinely, several Adivasi communities
     (Asur, Santhal and others, chiefly in Jharkhand and West Bengal) hold
     Mahishasura as an ancestor-hero and mourn him. Both of those are real,
     living and held by real people. A children's app does not get to quietly
     pick one, and it does not get to publish that without a named reviewer.

   - 'ds.vritra' ships needs_review: true because it is the one page here
     resting on Rig Vedic material, where chronology and interpretation are
     genuinely contested among scholars, and docs/05 §6 puts contested
     chronology in front of a human every time.

   Nothing in this file is a Ramayana or a Mahabharata story; those have their
   own readers. Where a figure also appears in an epic it is noted, not retold.

   Scene shape is the house one (see data-stories.js).
*/

window.IND_STORIES_DEVASURA = [

/* ================================================== THE TWO FAMILIES ====== */
{
  id: 'ds.who-are-the-asuras',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Word That Does Not Mean Demon',
  hook: 'Devas on one side, asuras on the other — and they are brothers. Start here or nothing else in this shelf makes sense.',
  hero: 'shukracharya',
  cast: ['indra', 'bali', 'shukracharya', 'prahlada', 'mithu'],
  minutes: 3,
  words_hi: [['देव', 'dev', 'a shining one'], ['असुर', 'asur', 'an asura'], ['भाई', 'bhai', 'brother']],
  scenes: [
    { art: ['indra', 'bali'], who: 'mithu',
      hi: '"तुम कहानियों का एक ऐसा पूरा पिटारा पढ़ने जा रहे हो जहाँ देव और असुर आमने-सामने हैं। तो सबसे पहले, एक बात साफ़ कर लेते हैं — क्योंकि अगर तुमने इसे गलत समझ लिया, तो उसके बाद की हर कहानी गलत समझ में आएगी।"',
      text: 'You are about to read a shelf of stories where devas and asuras are on opposite sides. So before anything else, one correction — because if you get this wrong, every story afterwards goes wrong with it.' },
    { art: ['bali'], who: 'mithu', mood: 'think',
      hi: '"असुर का मतलब राक्षस नहीं होता। कभी था भी नहीं। इन कहानियों में देव और असुर सौतेले भाई हैं — पिता एक ही हैं, कश्यप, बस माताएँ अलग-अलग हैं। एक ही परिवार। वे ऐसे भाई हैं जो एक ही घर के लिए आपस में झगड़ रहे हैं।"',
      text: 'Asura does not mean demon. It never did. In the stories the devas and the asuras are HALF-BROTHERS — the same father, Kashyapa, different mothers. Same family. They are cousins arguing over the same house.' },
    { art: ['kurma'], who: null,
      hi: '"जब जीवन के अमृत के लिए समुद्र को मथना था, तो कोई भी पक्ष इसे अकेले नहीं कर सकता था। इसलिए उन्होंने मिलकर यह काम किया — असुरों ने साँप का फन पकड़ा, देवों ने पूँछ पकड़ी, और बहुत देर तक उसी एक रस्सी को खींचा। उस समुद्र से जो भी अच्छी चीज़ें निकलीं, वे सिर्फ़ इसलिए निकलीं क्योंकि दोनों ने मिलकर काम किया था।"',
      text: 'When the ocean had to be churned for the nectar of life, neither side could do it alone. So they did it together — asuras holding the serpent’s head, devas holding the tail, pulling the same rope for a very long time. Everything good that came out of that ocean came out because they worked together.' },
    { art: ['prahlada'], who: null,
      hi: '"और ज़रा देखो कि और कौन-कौन असुर है। एक असुर सम्राट के घर जन्मे प्रह्लाद, पूरी परंपरा में सबसे प्यारे भक्तों में से एक हैं। असुर राजा महाबली का हर ओणम पर केरल में फूलों के साथ घर वापसी पर स्वागत किया जाता है। और खुद असुरों के गुरु शुक्राचार्य एक महान और पूजनीय ऋषि हैं।"',
      text: 'And look who else is an asura. Prahlada, born to an asura emperor, is one of the best-loved devotees in the entire tradition. Mahabali, an asura king, is welcomed home to Kerala with flowers every single Onam. Shukracharya, the asuras’ own guru, is a great and revered sage.',
      ask: {
        q: 'So what actually separates a deva from an asura in these stories?',
        options: ['One kind is good and one kind is evil', 'Which family they were born into — and, story by story, which way they are facing', 'Devas are stronger'],
        answer: 1,
        right: 'That is it. It is a family name and a direction, not a verdict on what someone is made of.',
        wrong: 'It is a family name — and, in any given story, which way someone happens to be facing. It is never a verdict on what they are made of.'
      } },
    { art: ['indra'], who: 'mithu',
      hi: '"देव भी कोई सीधे-सादे भले लोग नहीं हैं, और कहानियाँ यह बात साफ़-साफ़ बताने से ज़रा भी नहीं कतरातीं। देवों के राजा इंद्र को घमंड हो जाता है, जलन होती है, अपनी आहत शान में वे एक गाँव पर तूफ़ान भेज देते हैं, और फिर उन्हें डाँट खानी पड़ती है। ऐसी कई कहानियों में वे ग़लत होते हैं।"',
      text: 'The devas are not simply the good ones either, and the stories are quite happy to say so. Indra, king of the devas, gets proud, gets jealous, sends a storm at a village out of wounded pride, and has to be told off. He is in several of these stories being wrong.' },
    { art: ['shukracharya'], who: 'mithu', mood: 'think',
      hi: '"इन्हें इस नज़रिए से पढ़ो, तो ये कहानियाँ एकदम खुलकर समझ आएँगी। ये अच्छाई बनाम बुराई की कहानियाँ नहीं हैं। ये एक ही परिवार के दो हिस्सों की कहानियाँ हैं — दोनों ताक़तवर, दोनों से बड़ी ग़लतियाँ होने का डर, और दोनों इस बात पर बहुत लंबे समय से लड़ रहे हैं कि किसे क्या मिलेगा।"',
      text: 'Read them that way and they open up. These are not good-versus-evil stories. They are stories about two halves of one family, both powerful, both capable of getting it badly wrong, arguing for a very long time about who gets what.' }
  ],
  moral: 'Asura is a family, not a verdict. Nobody in these stories is evil by birth.',
  source: 'The common descent of devas and daityas/danavas from Kashyapa is given in the Bhagavata Purana, the Vishnu Purana and the Mahabharata’s Adi Parva. Prahlada, Bali, Shukracharya and Banasura are honoured figures within the tradition itself.'
},

/* ================================================== SAMUDRA MANTHAN ======= */
{
  id: 'ds.samudra-manthan',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Day Both Sides Pulled the Same Rope',
  hook: 'A mountain for a stick, a serpent for a rope, and two sides who could not stand each other doing it together.',
  hero: 'kurma',
  cast: ['kurma', 'indra', 'bali', 'lakshmi', 'shiva', 'mithu'],
  minutes: 5,
  words_hi: [['मंथन', 'manthan', 'churning'], ['अमृत', 'amrit', 'the nectar of life'], ['विष', 'vish', 'poison']],
  scenes: [
    { art: ['indra'], who: null,
      hi: '"देवताओं की शक्ति चली गई थी — कहानियों में इसके अलग-अलग कारण मिलते हैं, और हर सुनाने वाले की अपनी एक पसंदीदा कहानी होती है। पर सभी एक ही उपाय पर सहमत हैं: क्षीरसागर की तलहटी में अमृत छिपा था, ऐसा रस जो मौत को मिटा दे। और सागर सिर्फ़ माँगने भर से तो कुछ देता नहीं।"',
      text: 'The devas had lost their strength — the stories give different reasons, and every teller has a favourite. What they agree on is the fix: at the bottom of the ocean of milk lay amrita, the nectar that ends dying. And an ocean does not give things up for the asking.' },
    { art: ['indra', 'bali'], who: null, mood: 'think',
      hi: '"उसे मथना ही पड़ता, बिल्कुल वैसे ही जैसे मक्खन के लिए दूध की मटकी मथी जाती है — पर यहाँ मटकी पूरा सागर था, और अकेले किसी एक के पास इतने हाथ नहीं थे। इसलिए देवता असुरों के पास गए और उनसे पूछा। और असुर भी कोई मूर्ख तो थे नहीं, उन्हें इसमें अपना फ़ायदा दिख रहा था, सो वे मान गए।"',
      text: 'It would have to be churned, the way a pot of milk is churned for butter — but the pot was an ocean, and no one side had the arms for it. So the devas went to the asuras and asked. And the asuras, who were not fools and could see a share in it, said yes.' },
    { art: ['kurma'], who: null,
      hi: '"मथानी बना मंदार पर्वत। और रस्सी की तरह उसके चारों ओर लिपटे महानाग वासुकि। असुरों ने फन की तरफ़ से पकड़ा, देवताओं ने पूँछ थामी, और वे खींचने लगे — पहले एक तरफ़, फिर दूसरी तरफ़, फिर से पहली तरफ़, और समुद्र में पर्वत घूमने लगा।"',
      text: 'Mount Mandara for the churning stick. Vasuki the great serpent wound round it for the rope. Asuras took the head, devas took the tail, and they hauled — one side, then the other, then the first again, and the mountain turned in the sea.' },
    { art: ['kurma'], who: null, mood: 'wow',
      hi: '"ज़ाहिर है, वह सीधा समुद्र की नरम तलहटी में धँसने लगा, तब भगवान विष्णु कूर्म यानी कछुआ बनकर नीचे आए और पर्वत को अपनी पीठ पर सँभाल लिया ताकि काम चलता रहे। वह अपने आप में एक अलग कहानी है और \'द टेन अवतार्ज़\' में आती है।"',
      text: 'It sank, of course, straight into the soft floor of the ocean, and Vishnu came down as Kurma the tortoise and held it up on his shell so the work could go on. That is a story of its own and it is in The Ten Avatars.' },
    { art: ['shiva'], who: null, mood: 'sad',
      hi: '"और फिर, किसी भी ख़ज़ाने के निकलने से पहले, समुद्र से कुछ ऐसा निकला जो किसी को नहीं चाहिए था। हलाहल — ऐसा भयानक विष कि वह हर चीज़ में फैलने लगा। और यह पूरा भारी-भरकम काम, जो दुनिया को बचाने के लिए था, उसी दुनिया को ख़त्म करने की कगार पर पहुँच गया।"',
      text: 'And then, before any treasure at all, the ocean gave up something nobody wanted. Halahala — a poison so terrible it began to spread through everything. And the whole enormous project was about to kill the world it was meant to save.',
      ask: {
        q: 'A poison is spreading and it will kill everyone. Somebody has to deal with it. What can anyone actually do?',
        options: ['Pour it back into the sea', 'Someone has to take it into themselves', 'Run'],
        answer: 1,
        right: 'Shiva drank it. Parvati held his throat so it went no further, and it stayed there — which is why he is called Neelkanth, the blue-throated one.',
        wrong: 'Someone had to take it into themselves. Shiva drank it, and Parvati held his throat so it went no further — and it stayed there. Neelkanth: the blue-throated one.'
      } },
    { art: ['shiva'], who: 'mithu', mood: 'think',
      hi: '"ध्यान दीजिए कि भगवान शिव इस पूरे मामले में किसी भी तरफ़ नहीं हैं। वे अपने किसी हिस्से के लिए मंथन नहीं कर रहे। वे बस आते हैं, पूरी कहानी की सबसे ख़तरनाक चीज़ को निगल जाते हैं, और बाद में इस बारे में कुछ नहीं कहते।"',
      text: 'Notice that Shiva is not on either side of this argument. He is not churning for a share. He simply arrives, swallows the worst thing in the story, and says nothing about it afterwards.' },
    { art: ['lakshmi'], who: null, mood: 'wow',
      hi: '"इसके बाद, समुद्र ने देना शुरू किया। मनचाहा वरदान देने वाली गाय कामधेनु। सफ़ेद घोड़ा उच्चैःश्रवा। सफ़ेद हाथी ऐरावत। पारिजात का पेड़, जिस पर फूल खिलना कभी बंद नहीं होते। चंद्रमा। धन्वंतरि, जो दुनिया में दवाइयाँ लेकर आए। और स्वयं लक्ष्मी, कमल पर प्रकट होती हुईं।"',
      text: 'After that, the ocean began to give. Kamadhenu the wish-granting cow. Uchaishravas the white horse. Airavata the white elephant. The parijata tree that never stops flowering. The moon. Dhanvantari, who brought medicine into the world. And Lakshmi herself, rising on a lotus.' },
    { art: ['bali', 'indra'], who: null,
      hi: '"और सबसे अंत में, अमृत। और दोनों पक्ष, जिन्होंने युगों तक एक ही रस्सी को खींचा था, तुरंत उसके लिए आपस में लड़ने लगे — जो किसी और पन्ने की कहानी है, और इसमें किसी की भी कोई ख़ास तारीफ़ नहीं बनती।"',
      text: 'And at the very end, the amrita. And both sides, who had pulled the same rope for an age, immediately began to fight over it — which is a story for another page, and not a flattering one for anybody.' },
    { art: ['kurma'], who: 'mithu',
      hi: '"उस समुद्र की हर अच्छी चीज़ — दवाइयाँ, चंद्रमा, गाय, लक्ष्मी, सब कुछ — इसलिए बाहर आई क्योंकि एक-दूसरे को नापसंद करने वाले दोनों पक्षों ने एक ही रस्सी के दोनों सिरे थाम रखे थे। कहानी में कोई भी यह बात बोलकर नहीं कहता। कहानी बस यह पक्का करती है कि आपने इसे देख लिया हो।"',
      text: 'Every good thing in that ocean — the medicine, the moon, the cow, Lakshmi, all of it — came up because two sides who disliked each other held on to opposite ends of the same rope. Nobody in the story ever says that out loud. The story just makes sure you saw it.' }
  ],
  moral: 'They could not do it apart. The trouble started the moment there was something to divide.',
  source: 'The Samudra Manthan as told in the Bhagavata Purana (Canto 8), the Vishnu Purana, the Mahabharata (Adi Parva) and the Ramayana (Bala Kanda). The list of ratnas raised from the ocean differs between tellings; the halahala and Shiva as Neelkanth are as given in the Puranic accounts.'
},

/* ==================================================== PRAHLADA =========== */
{
  id: 'ds.prahlada',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Boy Who Would Not Change His Mind',
  hook: 'His father ruled everything. All he wanted was for his son to stop saying one name. The son would not.',
  hero: 'prahlada',
  cast: ['prahlada', 'hiranyakashipu', 'shukracharya', 'mithu'],
  minutes: 4,
  words_hi: [['भक्ति', 'bhakti', 'loving devotion'], ['डर', 'dar', 'fear'], ['सच', 'sach', 'truth']],
  scenes: [
    { art: ['hiranyakashipu'], who: null,
      hi: '"हिरण्यकशिपु ने खुद को ऐसा बना लिया था कि उसे नुकसान पहुँचाना लगभग नामुमकिन था, और उसने राज भी उसी हिसाब से किया। उसके साम्राज्य में बाकी सब नियमों से ऊपर एक नियम था: विष्णु का नाम नहीं लिया जाएगा।"',
      text: 'Hiranyakashipu had made himself very nearly impossible to harm, and he ruled accordingly. There was one rule above all others in his empire: the name of Vishnu was not to be spoken.' },
    { art: ['prahlada'], who: null,
      hi: '"और उसके अपने ही बेटे ने वह नाम लिया। परेशान करने के लिए नहीं। प्रह्लाद को तो बस बचपन से ही विष्णु से प्रेम था, ठीक वैसे ही जैसे कुछ बच्चों को बिना किसी के सिखाए ही किसी चीज़ से प्यार हो जाता है — और जब उससे इस बारे में पूछा गया, तो उसने सच बता दिया, क्योंकि उसने अभी यह नहीं सीखा था कि सच कभी-कभी ख़तरनाक भी हो सकता है।"',
      text: 'And his own son said it. Not to be difficult. Prahlada simply loved Vishnu, from very small, the way some children love something before anybody teaches them to — and when he was asked about it he told the truth, because he had not yet learned that truth is sometimes dangerous.' },
    { art: ['shukracharya', 'prahlada'], who: null,
      hi: '"उसके पिता ने उसे दुनिया के सबसे अच्छे गुरुओं — खुद शुक्राचार्य के बेटों — के पास भेजा, ताकि वे उसकी यह आदत छुड़ा सकें। प्रह्लाद ने बड़ी विनम्रता से हर पाठ सुना, सब कुछ सीखा, और फिर भी वही नाम लेता रहा।"',
      text: 'His father sent him to the best teachers in the world — Shukracharya’s own sons — to have it schooled out of him. Prahlada listened politely to every lesson, learned it all, and went on saying the name.' },
    { art: ['prahlada', 'hiranyakashipu'], who: 'hiranyakashipu', mood: 'sad',
      hi: '"इस दुनिया में सबसे ताक़तवर मैं ही हूँ," उसके पिता ने कहा। "मैंने सबको हरा दिया है। तुम बस मेरा नाम क्यों नहीं ले लेते?"',
      text: '"I am the strongest being alive," his father said. "I have beaten everyone. Why will you not simply say MY name?"' },
    { art: ['prahlada'], who: 'prahlada',
      hi: '"क्योंकि आप मेरे पिता हैं और मैं आपसे प्यार करता हूँ," प्रह्लाद ने कहा। "और इसलिए भी कि वे हर जगह हैं, और आप सिर्फ़ यहाँ हैं।"',
      text: '"Because you are my father and I love you," said Prahlada. "And because he is everywhere, and you are only here."',
      ask: {
        q: 'His father has power over absolutely everything. What has Prahlada got?',
        options: ['A secret weapon', 'Nothing at all except that he will not say something he does not believe', 'Powerful friends'],
        answer: 1,
        right: 'That is the entire story. He has no army and no plan. He just does not move.',
        wrong: 'Nothing at all — except that he will not say a thing he does not believe. No army, no plan, no rescue arranged. He simply does not move.'
      } },
    { art: ['prahlada'], who: null, mood: 'think',
      hi: 'कहानियाँ कहती हैं कि उसके पिता ने बार-बार उसे डराकर रोकने की कोशिश की, और हर बार वह बालक बिल्कुल शांत रहा, और हर बार उसकी यह शांति बात न मानने से भी ज़्यादा गुस्सा दिलाती थी। कोई भी तरकीब काम नहीं कर रही थी, और कुछ काम न आना ही सबसे बुरी बात थी।',
      text: 'The stories say his father tried, over and over, to frighten him out of it, and every time the boy came through calm, and every time the calm was more infuriating than the disobedience. Nothing was working, and the not-working was the worst part.' },
    { art: ['narasimha', 'prahlada'], who: null, mood: 'wow',
      hi: 'यह सब कैसे ख़त्म हुआ — एक खंभा, और एक ऐसा रूप जो न इंसान था न जानवर, और ऐसा समय जो न दिन था न रात — यह सब \'दस अवतार\' में नरसिंह के प्रसंग में बताया गया है। यहाँ जो बात मायने रखती है, वह यह है कि उसके बाद क्या हुआ।',
      text: 'How that ends — with a pillar, and a form that is neither man nor animal, at an hour that is neither day nor night — is told in The Ten Avatars, under Narasimha. What matters here is what happened afterwards.' },
    { art: ['narasimha', 'prahlada'], who: null,
      hi: 'जब उस भयानक सिंह-रूप ने वह काम कर दिया जिसके लिए वह आया था और कोई भी उसके पास नहीं जा पा रहा था, तब वह बालक ही था जो उनके पास चलकर गया। बिना किसी डर के। और कहानियाँ कहती हैं कि वह प्रह्लाद की शांति ही थी, और सिर्फ़ वही, जिसने उन्हें शांत किया।',
      text: 'When the terrible lion-form had done what it came for and nobody could go near it, it was the boy who walked up to it. Not afraid. And the stories say it was Prahlada’s calm, and only that, which settled it.' },
    { art: ['prahlada'], who: 'mithu', mood: 'think',
      hi: 'अपने पिता के बाद वह राजा बना, और सब मानते हैं कि वह एक बहुत अच्छा राजा था — और उसका पोता महाबली था, जिसका केरल आज भी हर ओणम पर घर में स्वागत करता है। असुरों की तीन पीढ़ियाँ, और जिन दो को सब प्यार से याद करते हैं, वे हैं वह बालक जिसने कभी झूठ नहीं बोला और वह राजा जिसने कभी अपना वचन नहीं तोड़ा।',
      text: 'He became king after his father, and by every account he was a good one — and his grandson was Mahabali, whom Kerala still welcomes home each Onam. Three generations of asuras, and the two everyone remembers with love are the boy who would not lie and the king who would not break his word.' }
  ],
  moral: 'You do not need to be strong to be immovable. Prahlada had nothing but a thing he would not say.',
  source: 'The Prahlada narrative as told in the Bhagavata Purana (Canto 7) and the Vishnu Purana. Prahlada is the grandfather of Bali in these accounts. Holika, and the fire from which the Holi bonfire takes its name, belongs to this narrative and is told in this app under Utsav.'
},

/* ==================================================== MAHISHASURA ======== */
{
  id: 'ds.mahishasura',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  needs_review: true,
  title: 'The One No God Could Beat',
  hook: 'He had asked to be safe from every god there was. He had not thought to say goddess.',
  hero: 'durga',
  cast: ['durga', 'mahishasura', 'indra', 'mithu'],
  minutes: 5,
  place: ['IN-WB'],
  words_hi: [['शक्ति', 'shakti', 'power'], ['देवी', 'devi', 'goddess'], ['वरदान', 'vardaan', 'a boon']],
  scenes: [
    { art: ['mahishasura'], who: null,
      hi: 'महिषासुर एक असुर राजा था जो भैंसे का रूप ले सकता था, और भारी तपस्या के बाद उसे एक वरदान मिला: कि कोई भी पुरुष और कोई भी देवता उसे हरा नहीं सकता। उसने इस पर खूब सोच-विचार किया था, और वह पूरी तरह संतुष्ट था। उसने हर बात सोच रखी थी।',
      text: 'Mahishasura was an asura king who could take the form of a buffalo, and after enormous effort he was granted a boon: that no man and no god could defeat him. He had thought about it, and he was satisfied. He had covered everything.' },
    { art: ['indra'], who: null, mood: 'sad',
      hi: 'और काफी समय तक वह सही भी साबित हुआ। उसने एक के बाद एक देवताओं को उन्हीं के स्वर्ग से खदेड़ दिया, और देवताओं के पास न तो कहीं जाने की जगह बची और न ही कोई जवाब—क्योंकि उन्होंने वरदान के शब्दों को परखा था, और वह बिल्कुल पक्का था।',
      text: 'And he was right for a long while. He beat the devas out of their own heavens, one after another, and they had nowhere left to go and no answer at all — because they had checked the wording, and it held.' },
    { art: ['durga'], who: 'mithu', mood: 'think',
      hi: 'ज़रा एक पल के लिए इस बात को समझकर देखिए। हर देवता का नाम पहले ही बाहर हो चुका था। इसलिए उनमें से कोई भी इसका हल नहीं हो सकता था। जवाब कुछ ऐसा होना था, जिसके बारे में उस वरदान में कभी सोचा ही नहीं गया था।',
      text: 'Sit with the shape of that for a second. Every god had been ruled out by name. So the answer could not be any of them. It had to be something the wording had simply never considered.' },
    { art: ['durga'], who: null, mood: 'wow',
      hi: 'इसलिए देवताओं ने अपनी-अपनी शक्ति समर्पित कर दी—सबने एक साथ, एक ही पल में अपनी शक्ति उड़ेल दी—और उस मिले-जुले प्रकाश से प्रकट हुईं दुर्गा। न उन्हें भेजा गया था। न उन्हें बुलाया गया था। देवताओं के पास जो कुछ भी था, वे उसी से रची गई थीं, सिंह पर सवार, हर हाथ में एक अस्त्र: शिव जी का त्रिशूल, विष्णु जी का चक्र, इंद्र का वज्र, हर अस्त्र उसी का दिया हुआ जिसका वह था।',
      text: 'So the devas gave up their own power — all of them, together, poured out at once — and out of that combined light rose Durga. Not sent. Not summoned. Made, out of everything they had, riding a lion, with a weapon in every hand: Shiva’s trident, Vishnu’s discus, Indra’s thunderbolt, each of them given by the one it belonged to.',
      ask: {
        q: 'His boon named men and gods. Why does it not stop her?',
        options: ['She is stronger than all of them', 'Because he never thought to say it about a goddess', 'Because boons stop working eventually'],
        answer: 1,
        right: 'Exactly. It is a story about the gap in a careful sentence — and about who gets left out of one.',
        wrong: 'Because he never thought to include her. It is a story about the gap in a very careful sentence, and about who tends to get left out of those.'
      } },
    { art: ['durga', 'mahishasura'], who: null,
      hi: 'उनमें नौ रातों तक युद्ध चला। उसने बार-बार रूप बदला—भैंसा, सिंह, पुरुष, हाथी—और उन्होंने उसके हर रूप का डटकर मुकाबला किया। कहानियाँ उसे कमज़ोर या मामूली नहीं बतातीं। वह एक बड़ा और पराक्रमी राजा था और उन्हें नौ रातें लगीं।',
      text: 'They fought for nine nights. He changed shape and changed again — buffalo, lion, man, elephant — and she matched every one of them. The stories do not make him ridiculous. He is a great and formidable king and it takes her nine nights.' },
    { art: ['durga'], who: null,
      hi: 'दसवें दिन इसका अंत हुआ, और वह दिन है विजयादशमी—दसवाँ दिन, विजय का दिन। उससे पहले की नौ रातें नवरात्रि हैं, और हर साल पूरे देश के घरों में इन्हें गिना और मनाया जाता है।',
      text: 'On the tenth day it ended, and that day is Vijayadashami — the tenth, the day of victory. The nine nights before it are Navratri, and they are counted in houses across the whole country every year.' },
    { art: ['durga'], who: 'mithu',
      hi: 'और बंगाल में तो यह बात कुछ और ही रूप ले लेती है। दुर्गा पूजो: देवी अपने बच्चों के साथ कुछ दिनों के लिए अपने मायके आती हैं, उनका स्वागत करने के लिए पूरे-पूरे मोहल्ले पंडाल सजाते हैं, और आखिरी दिन हज़ारों लोग उन्हें विदा करने नदी तक साथ जाते हैं। यह जितनी एक जीत है, उतना ही अपने घर लौटने का उत्सव भी।',
      text: 'And in Bengal it becomes something else again. Durga Pujo: the goddess comes home to her parents for a few days with her children, whole neighbourhoods build pandals to receive her, and on the last day thousands walk her to the river to see her off. It is a homecoming as much as a victory.' },
    { art: ['mahishasura'], who: 'mithu', mood: 'think',
      hi: 'एक बात और, जो सच है और यहाँ कही जानी चाहिए। कुछ आदिवासी समुदाय—जिनमें झारखंड के असुर लोग और पश्चिम बंगाल के कुछ अन्य समुदाय शामिल हैं—महिषासुर को अपना पूर्वज और नायक मानते हैं, और ठीक उसी समय उनका शोक मनाते हैं जब बाकी लोग उत्सव मना रहे होते हैं। ये दोनों ही बातें सच हैं, और दोनों ही आज के जीते-जागते लोगों की भावनाएँ हैं। यहाँ कोई आपसे यह नहीं कहने वाला कि कौन सा परिवार अपने पूर्वज के बारे में गलत है।',
      text: 'One more thing, and it is true and it belongs here. Some Adivasi communities — among them the Asur people of Jharkhand, and others in West Bengal — hold Mahishasura as an ancestor and a hero, and mourn him at the very time others are celebrating. Both of those are real, and both are held by real people living now. Nobody here is going to tell you which family is wrong about their own ancestor.' }
  ],
  moral: 'He listed every enemy he could imagine. The answer came from the one he had not bothered to imagine.',
  source: 'The Mahishasura Mardini narrative as told in the Devi Mahatmya (Durgasaptashati), part of the Markandeya Purana, and in the Devi Bhagavata Purana. Navratri and Vijayadashami are observed nationally; Durga Puja in Kolkata was inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2021. The veneration of Mahishasura as an ancestor-hero by the Asur and some other Adivasi communities is documented in contemporary anthropological and press accounts. needs_review: this page describes a living disagreement between communities about the same figure and requires named human review before publish (docs/05 §6).'
},

/* ==================================================== TARAKASURA ========= */
{
  id: 'ds.tarakasura',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'Only a Child Not Yet Born',
  hook: 'He made himself safe from everyone alive. So the answer had to be somebody who was not.',
  hero: 'kartikeya',
  cast: ['kartikeya', 'tarakasura', 'shiva', 'parvati', 'mithu'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['बालक', 'baalak', 'a child'], ['भाला', 'bhaala', 'a spear'], ['मोर', 'mor', 'a peacock']],
  scenes: [
    { art: ['tarakasura'], who: null,
      hi: 'तारकासुर ने बड़ी चतुराई से नाप-तौलकर एक वरदान माँगा: कि उसे सिर्फ़ शिवजी का पुत्र ही हरा सके। और जिस समय उसने यह माँगा, शिवजी का कोई पुत्र नहीं था, न ही होने वाला था, और वे पहाड़ों में आँखें मूँदे, दुनिया-जहान की परवाह से कोसों दूर बैठे थे।',
      text: 'Tarakasura asked for a boon with a very neat shape to it: that he could be defeated only by a son of Shiva. And at the time he asked, Shiva had no son, was not going to have one, and was sitting in the mountains with his eyes shut, some way past caring.' },
    { art: ['tarakasura'], who: 'mithu', mood: 'think',
      hi: 'यह बड़ी होशियारी भरी इच्छा थी। इसमें यह नहीं कहा गया कि "मुझे कोई नहीं हरा सकता"—ऐसी इच्छा तो फौरन खारिज कर दी जाती है। इसमें एक ऐसे व्यक्ति का नाम लिया गया जो मौजूद ही नहीं है और न कभी होने वाला है।',
      text: 'That is a clever wish. It does not say "nobody can beat me" — a wish like that gets refused. It names one person who does not exist and is not going to.' },
    { art: ['shiva'], who: null,
      hi: 'तो तारकासुर ने तीनों लोकों पर कब्ज़ा कर लिया, और देवता मदद के इकलौते दरवाज़े की तरफ दौड़े, पर वह बंद मिला। शिवजी गहरे ध्यान में लीन थे और युगों से ऐसे ही समाधि में थे।',
      text: 'So Tarakasura took the three worlds, and the devas went to look for the only door there was, and found it shut. Shiva was deep in meditation and had been for an age.' },
    { art: ['parvati', 'shiva'], who: null,
      hi: 'यह पार्वती थीं जिन्होंने इस सब को बदला, और वह भी किसी के भेजने पर नहीं। उन्होंने खुद शिवजी को चुना, वे खुद पहाड़ों पर गईं, और उन्होंने इंतज़ार किया—कड़कड़ाती ठंड, तपती धूप और बरसों के बीतने तक—एक ऐसे धैर्य के साथ जिसकी मिसाल ये कहानियाँ इस पूरी किताब में किसी के भी बल-पौरुष से कहीं ज़्यादा देती हैं।',
      text: 'It was Parvati who changed that, and not by being sent. She chose him, and she went to the mountains herself, and she waited — through cold and heat and years of it — with a patience the stories admire more than they admire anybody’s strength in this whole shelf.' },
    { art: ['kartikeya'], who: null, mood: 'wow',
      hi: '"और उनके बेटे थे कार्तिकेय। स्वयं शिव की अग्नि से जन्मे, जिन्हें अग्निदेव ले गए, जो गंगा में शीतल हुए, और कुछ समय के लिए छह माताओं ने जिन्हें पाला — वे छह तारे जिन्हें लोग कृत्तिका कहते हैं — जहाँ से उनका नाम आया, और इसीलिए उन्हें छह चेहरों के साथ दिखाया जाता है।"',
      text: 'And their son was Kartikeya. Born from Shiva’s own fire, carried by Agni, cooled in the Ganga, raised for a while by six mothers — the six stars people call the Krittika — which is where his name comes from, and why he is shown with six faces.',
      ask: {
        q: 'The devas need a general. He is a small boy. What do they do?',
        options: ['Wait twenty years', 'Make him commander straight away', 'Find somebody older'],
        answer: 1,
        right: 'They hand the whole army to a child, and he takes it. In this story youth is not a problem to be got past.',
        wrong: 'They give the whole army to a child. In this story being young is not a thing to be got past first — it is the point.'
      } },
    { art: ['kartikeya', 'tarakasura'], who: null,
      hi: '"देवताओं ने उन्हें अपनी सेनाओं का सेनापति बनाया, और उन्हें वेल दिया — यानी एक भाला — और वे मोर पर सवार होकर निकले और उस संकट को खत्म कर दिया जिसे उनसे बड़ा कोई छू भी नहीं पाया था।"',
      text: 'They made him commander of the armies of the devas, and gave him the vel — a spear — and he rode out on a peacock and ended what nobody older had been able to touch.' },
    { art: ['kartikeya'], who: 'mithu',
      hi: '"दक्षिण में वे मुरुगन हैं, और वहाँ वे कोई साधारण रूप नहीं हैं — वे सबके सबसे प्रिय हैं। तमिलनाडु के छह बड़े मंदिर, यानी \'आरुपदै वीडु\', उनके धाम हैं, और लोग कावड़ी लेकर पैदल उन तक जाते हैं। स्कंद, सुब्रह्मण्य, षण्मुख, कार्तिकेय, मुरुगन: ये सब वही एक युवा सेनापति हैं।"',
      text: 'In the south he is Murugan, and he is not a minor figure there at all — he is one of the most loved of all. Six great temples in Tamil Nadu, the Arupadai Veedu, are his houses, and people walk to them carrying kavadi. Skanda, Subramanya, Shanmukha, Kartikeya, Murugan: all the same young commander.' },
    { art: ['kartikeya'], who: 'mithu', mood: 'think',
      hi: '"तारकासुर ने उस हर किसी से अपनी सुरक्षा तय कर ली थी जिसका अस्तित्व था। कहानियों ने उसे एक ऐसे बालक से जवाब दिया जो उस समय अस्तित्व में था ही नहीं — जो कि एक बड़ा ही मजेदार मोड़ है, और अगर आप सोचें, तो बड़ी उम्मीद जगाने वाली बात भी।"',
      text: 'Tarakasura ruled out every single person who existed. The stories answered him with somebody who did not exist yet — which is a rather good joke, and also, if you think about it, quite a hopeful one.' }
  ],
  moral: 'He made himself safe from everyone alive. Nobody is safe from who comes next.',
  source: 'The Tarakasura narrative and the birth of Kartikeya as told in the Shiva Purana, the Skanda Purana and Kalidasa’s Kumarasambhava. The Arupadai Veedu, the six abodes of Murugan in Tamil Nadu, are Palani, Swamimalai, Thiruchendur, Thiruthani, Pazhamudircholai and Thirupparamkunram.'
},

/* ==================================================== SHUKRACHARYA ======= */
{
  id: 'ds.shukracharya',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Teacher Who Could Bring Anyone Back',
  hook: 'The asuras had one advantage the devas could not match: a guru who could raise the fallen. So the devas sent a student.',
  hero: 'shukracharya',
  cast: ['shukracharya', 'indra', 'mithu'],
  minutes: 4,
  words_hi: [['गुरु', 'guru', 'a teacher'], ['विद्या', 'vidya', 'knowledge'], ['शिष्य', 'shishya', 'a student']],
  scenes: [
    { art: ['shukracharya'], who: null,
      hi: '"शुक्राचार्य असुरों के गुरु थे, और वे किसी भी युग के महानतम विद्वानों में से एक थे। उन्होंने घोर परिश्रम से संजीवनी विद्या भी पा ली थी — वह ज्ञान जो मरे हुए को फिर से जीवित कर देता है।"',
      text: 'Shukracharya was the guru of the asuras, and he was one of the great scholars of any age. He had also, through immense effort, come to know the Sanjivani vidya — the knowledge that brings the dead back to life.' },
    { art: ['indra'], who: null, mood: 'think',
      hi: '"जिसने इस युद्ध को जीत पाना असंभव बना दिया। देवता गिरते तो गिरे ही रह जाते। असुर गिरते और अगली सुबह फिर उठ खड़े होते। देवता हर एक दिन जीत सकते थे, पर फिर भी एक कदम आगे नहीं बढ़ पाते थे।"',
      text: 'Which made a war unwinnable. Devas fell and stayed fallen. Asuras fell and got up in the morning. The devas could win every single day and be no further forward.' },
    { art: ['shukracharya'], who: 'mithu',
      hi: 'तो देवताओं ने एक बड़ा दिलचस्प काम किया। उन्होंने न तो उसे चुराया और न ही उन पर हमला किया। उन्होंने उनके पास एक शिष्य भेजा — अपने ही गुरु के बेटे कच को — ताकि वह उनसे विद्या सीखने की विनती करे।',
      text: 'So the devas did something interesting. They did not steal it and they did not attack him. They sent him a student — Kacha, the son of their own guru — to ask to be taught.' },
    { art: ['shukracharya'], who: null,
      hi: 'और शुक्राचार्य ने, यह भली-भाँति जानते हुए भी कि उनके दरवाज़े पर किसका बेटा आया है, उसे अपना लिया और उसे सिखाया। क्योंकि वे एक गुरु थे, और एक शिष्य ने उनसे सीखने की विनती की थी। कहानियों में यह बात बिल्कुल साफ़ है कि वे सब जानते थे।',
      text: 'And Shukracharya, knowing perfectly well whose son had turned up at his door, took him in and taught him. Because he was a teacher, and a student had asked. The stories are quite clear that he knew.',
      ask: {
        q: 'He knows exactly who this boy is and who sent him. Why teach him?',
        options: ['He was fooled', 'Because a teacher who turns away a student because of whose son he is has stopped being a teacher', 'He wanted something in return'],
        answer: 1,
        right: 'That is how the tradition reads him. It is the reason an asura’s guru is a revered sage.',
        wrong: 'Because he was a teacher first. Turn a student away over whose son he is and you have stopped being one — which is exactly why the asuras’ guru is remembered as a great sage.'
      } },
    { art: ['shukracharya'], who: null, mood: 'sad',
      hi: 'असुर समझ गए कि क्या हो रहा है और उन्होंने कच को मार डाला, एक बार नहीं, कई बार। और हर बार शुक्राचार्य उसे वापस ज़िंदा कर लाए — क्योंकि उनकी अपनी बेटी देवयानी ने उनसे ऐसा करने को कहा था, और क्योंकि उन्होंने उसे सिखाने का वचन दिया था।',
      text: 'The asuras worked out what was happening and killed Kacha, more than once. And more than once Shukracharya brought him back — because his own daughter Devayani asked him to, and because he had said he would teach him.' },
    { art: ['shukracharya'], who: null, mood: 'wow',
      hi: 'आखिरी बार, उन्होंने कच को जला दिया और उसकी राख शुक्राचार्य के ही पीने के रस में मिला दी। इसलिए जब गुरु ने कच को वापस पुकारा, तो जवाब उनके अपने ही अंदर से आया — और अपने शिष्य को ज़िंदा रखने के लिए, उन्हें उसी समय उसे वह विद्या सिखानी पड़ी, ताकि बाद में वह लड़का उन्हें वापस ज़िंदा कर सके।',
      text: 'The last time, they burned him and mixed the ashes into Shukracharya’s own drink. So when the guru called Kacha back, the answer came from inside him — and to let his student live, he had to teach him the vidya then and there, and let the boy bring HIM back afterwards.' },
    { art: ['shukracharya'], who: 'mithu', mood: 'think',
      hi: 'और यही वह पल था जब वह विद्या हमेशा के लिए असुरों के पास से चली गई। चुराई नहीं गई। एक गुरु द्वारा दी गई, और वह भी केवल उसी एक तरीके से जिससे उनका शिष्य ज़िंदा बचकर बाहर निकल सके।',
      text: 'Which is the moment the knowledge left the asuras for good. Not stolen. Given away, by a teacher, in the only order that would let his student walk out alive.' },
    { art: ['shukracharya'], who: 'mithu',
      hi: 'यह वही हैं जिन्होंने महाबली को चेतावनी दी थी कि एक छोटे बालक को तीन पग ज़मीन का वचन मत देना — और किसी ने उनकी बात नहीं सुनी। वे इन सारी कहानियों में हर जगह दिख जाते हैं, आमतौर पर सबसे ज़्यादा समझदार होते हुए, और अक्सर अनसुने कर दिए जाते हुए।',
      text: 'This is also the man who warned Mahabali not to promise three steps to a small boy — and was not listened to. He turns up all over these stories, usually being the cleverest person in the room and usually being ignored.' }
  ],
  moral: 'He taught the boy who had come to take everything from him, because a student had asked. That is what the word guru is for.',
  source: 'The Kacha and Devayani narrative as told in the Mahabharata, Adi Parva (the Sambhava Parva section), and retold in the Puranas. Shukracharya is identified with the planet Venus in Indian astronomy.'
},

/* ==================================================== BHASMASURA ========= */
{
  id: 'ds.bhasmasura',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Gift He Wanted to Try Out',
  hook: 'He asked for a power he could use on anyone he touched. Then he looked around for someone to try it on.',
  hero: 'bhasmasura',
  cast: ['bhasmasura', 'shiva', 'vishnu', 'mithu'],
  minutes: 4,
  words_hi: [['हाथ', 'haath', 'a hand'], ['नाच', 'naach', 'a dance'], ['लालच', 'laalach', 'greed']],
  scenes: [
    { art: ['bhasmasura'], who: null,
      hi: 'भस्मासुर ने बहुत भारी तपस्या की — सालों-साल की — और शिवजी ने, जो बड़ी आसानी से मान जाने और आगे सवाल न पूछने के लिए जाने जाते हैं, उसे एक वरदान दे दिया।',
      text: 'Bhasmasura did an enormous amount of hard work — years of it — and Shiva, who is famously easy to please and famously bad at asking follow-up questions, offered him a boon.' },
    { art: ['bhasmasura', 'shiva'], who: 'bhasmasura', mood: 'think',
      hi: '“मैं जिस पर भी हाथ रख दूँ, वह भस्म होकर राख हो जाए।”',
      text: '"Let anything I put my hand on turn to ash."' },
    { art: ['shiva'], who: null,
      hi: 'और शिवजी ने \'हाँ\' कह दिया। उन्होंने वचन दिया था, और वे अपनी बात से पीछे नहीं हटते। कहानियों में इसे उनकी एक सच्ची कमज़ोरी की तरह ही दिखाया जाता है, इसे छिपाया नहीं जाता — वे दे तो देते हैं, और फिर जो दिया है, उसके साथ उन्हें निबाहना पड़ता है।',
      text: 'And Shiva said yes. He had said he would, and he does not go back on it. The stories treat this as a real weakness of his and do not tidy it away — he gives, and then has to live with what he has given.' },
    { art: ['bhasmasura', 'shiva'], who: null, mood: 'wow',
      hi: 'और भस्मासुर के मन में सबसे पहला ख्याल — बिल्कुल पहला — यही आया कि इसे शिवजी पर ही आज़माकर देखा जाए। उसी पर, जिसने अभी-अभी उसे यह वरदान दिया था। तो शिवजी भागे, जो कि ऐसा वाक्य है जो आपको रोज़-रोज़ पढ़ने को नहीं मिलता, और भस्मासुर उनके पीछे पड़ गया।',
      text: 'And the very first thought Bhasmasura had — the very first — was to try it on Shiva. On the person who had just given it to him. So Shiva ran, which is not a sentence you often get to read, and Bhasmasura came after him.' },
    { art: ['vishnu'], who: 'mithu', mood: 'think',
      hi: 'अब स्थिति यह थी। कोई उसे छू नहीं सकता, कोई उससे लड़ नहीं सकता, और वह रुकने वाला नहीं है। ऐसे व्यक्ति पर बस एक ही चीज़ असर कर सकती है, और वह ताक़त तो बिल्कुल नहीं है।',
      text: 'Now. Nobody can touch him, nobody can fight him, and he is not going to stop. There is exactly one thing left that works on a man like this, and it is not strength.',
      ask: {
        q: 'What is the one thing that will work on someone this pleased with himself?',
        options: ['A bigger weapon', 'His own vanity', 'A very fast horse'],
        answer: 1,
        right: 'Vanity. Vishnu came as Mohini, the most graceful dancer anyone had ever seen — and simply invited him to dance.',
        wrong: 'His own vanity. Vishnu came as Mohini, a dancer of extraordinary grace, and invited him to dance along.'
      } },
    { art: ['vishnu', 'bhasmasura'], who: null,
      hi: 'मोहिनी नाचीं, और भस्मासुर ने — जो किसी से भी उन्नीस दिखना बर्दाश्त नहीं कर सकता था — उनकी हर एक मुद्रा की हूबहू नकल की। हर ताल पर ताल। हर कदम पर कदम। और मोहिनी ने, नाचते-नाचते, बड़े सहज भाव से, अपना एक हाथ अपने ही सिर पर रख लिया।',
      text: 'Mohini danced, and Bhasmasura — who could not bear to be less impressive than anybody — copied every movement exactly. Turn for turn. Step for step. And Mohini, mid-dance, quite naturally, placed a hand on top of her own head.' },
    { art: ['bhasmasura'], who: null, mood: 'wow',
      hi: 'और उसने भी वैसा ही किया। और इस तरह भस्मासुर का अंत हुआ — किसी और वजह से नहीं, बस इसलिए कि वह किसी और को खुद से बेहतर दिखने ही नहीं दे सकता था।',
      text: 'And so did he. And that was the end of Bhasmasura, undone by nothing whatsoever except being unable to let someone else look better than him.' },
    { art: ['bhasmasura'], who: 'mithu',
      hi: 'यह एक मज़ेदार कहानी है और इसे ऐसा ही होना चाहिए। पर ध्यान दीजिए कि वह वरदान असल में क्या था। उसने किसी की रक्षा करने, कुछ बनाने या किसी को ठीक करने के लिए नहीं माँगा। उसने एक ऐसी शक्ति माँगी जो सिर्फ बर्बाद करके ही काम करती थी। और ऐसी इच्छा का अंत में कहीं और जाने का रास्ता नहीं होता, सिवाय उसी इंसान पर वापस लौटने के जिसने इसे माँगा था।',
      text: 'It is a funny story and it is meant to be. But notice what the boon actually was. He did not ask to protect anything, or build anything, or heal anyone. He asked for a power that only worked by ruining. And a wish like that has nowhere to go in the end but back at the person who made it.' }
  ],
  moral: 'He asked for a power that could only destroy. It did exactly what he asked.',
  source: 'The Bhasmasura and Mohini narrative as told in the Bhagavata Purana and the Shiva Purana, with regional variations in the details of the dance.'
},

/* ==================================================== BANASURA =========== */
{
  id: 'ds.banasura',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Asura Who Guarded His Daughter Too Well',
  hook: 'A thousand arms, a fortress nobody could enter, and a daughter who fell in love anyway.',
  hero: 'banasura',
  cast: ['banasura', 'shiva', 'krishna', 'mithu'],
  minutes: 4,
  place: ['IN-AS'],
  words_hi: [['बेटी', 'beti', 'daughter'], ['सपना', 'sapna', 'a dream'], ['किला', 'kila', 'a fort']],
  scenes: [
    { art: ['banasura'], who: null,
      hi: 'बाणासुर महाबली का बेटा था, और अपने पिता की तरह वह एक राजा था, और अपने दादा प्रह्लाद की तरह वह भी परम भक्त था — शिव जी का भक्त। कहानियाँ कहती हैं कि उसकी हज़ार भुजाएँ थीं, और जब शिव जी नृत्य करते थे, तब वह उनसे ढोल बजाया करता था — और यही बात सबको याद रहती है।',
      text: 'Banasura was Mahabali’s son, and like his father he was a king, and like his grandfather Prahlada he was devoted — in his case to Shiva. The stories say he had a thousand arms, and that he used them to play the drums while Shiva danced, which is the detail everybody remembers.' },
    { art: ['banasura', 'shiva'], who: null,
      hi: 'शिव जी इतने प्रसन्न हुए कि वे खुद आकर बाणासुर के दरवाज़े पर पहरा देने लगे। इसका मतलब था कि बाणासुर के किले में कोई भी कदम नहीं रख सकता था, और बाणासुर — जो ढोल बजाने में तो बहुत अच्छा था पर सुनने में ज़रा कच्चा था — इससे ऊबने लगा, और शिकायत करने लगा कि अब उसके पास लड़ने के लिए कोई बचा ही नहीं है।',
      text: 'Shiva was so pleased that he came and stood guard at Banasura’s own gate. Which meant Banasura’s fortress could not be entered by anybody at all, and Banasura — who was a very good drummer and a less good listener — began to find this boring, and complained that he had nobody left to fight.' },
    { art: ['banasura'], who: null, mood: 'think',
      hi: 'उसकी एक बेटी भी थी, उषा। और उसने उसे इन सब चीज़ों के पीछे बंद रखा — वे हज़ार भुजाएँ, वह किला, और दरवाज़े पर खड़े भगवान — क्योंकि उसे उषा के भविष्य के बारे में चेतावनी दी गई थी और उसने तय कर लिया था कि इसका हल सिर्फ दीवारें हैं।',
      text: 'He also had a daughter, Usha. And he kept her behind all of it — the thousand arms, the fortress, the god at the gate — because he had been warned about her future and had decided the answer was walls.' },
    { art: ['banasura'], who: null,
      hi: 'उषा ने एक ऐसे नौजवान का सपना देखा जिससे वह कभी नहीं मिली थी। उसकी सहेली चित्रलेखा, जो किसी का भी चित्र बना सकती थी, तब तक तस्वीरें बनाती रही जब तक कि उषा ने एक पर उँगली नहीं रख दी: अनिरुद्ध, खुद कृष्ण जी के पोते। और चित्रलेखा, जिसमें और भी कई हुनर थे, गई और उन्हें ले आई।',
      text: 'Usha dreamed of a young man she had never met. Her friend Chitralekha, who could draw anybody, drew portraits until Usha pointed at one: Aniruddha, Krishna’s own grandson. And Chitralekha, who had other talents too, went and fetched him.',
      ask: {
        q: 'His daughter is in love, inside the safest fortress ever built. What has all that guarding actually achieved?',
        options: ['It kept her safe', 'Nothing at all — it only meant nobody told him', 'It stopped the dream'],
        answer: 1,
        right: 'Just so. He built walls high enough that the news could not get out either.',
        wrong: 'Nothing at all. The walls were high enough to keep the news in, so the first he knew of any of it was when it was far too late.'
      } },
    { art: ['banasura', 'krishna'], who: null,
      hi: 'बाणासुर ने अनिरुद्ध को अपने किले के अंदर पाकर बंदी बना लिया। और इस वजह से कृष्ण उसके दरवाज़े पर आ पहुँचे — और शिव उस दरवाज़े की रक्षा का वचन निभाते हुए वहीं खड़े थे।',
      text: 'Banasura found Aniruddha inside his fortress and took him prisoner. And that brought Krishna to his gate — and Shiva was standing at that gate, having promised to defend it.' },
    { art: ['krishna', 'banasura'], who: 'mithu', mood: 'wow',
      hi: 'तो कहानी सचमुच एक असहज मोड़ पर आ पहुँचती है: एक तरफ कृष्ण, दूसरी तरफ शिव, दोनों अपना वचन निभा रहे हैं, और दोनों में से कोई भी ग़लत नहीं है। यह अच्छाई और बुराई की लड़ाई नहीं है। यह तो दो वचनों का आमना-सामना है।',
      text: 'So the story arrives somewhere genuinely uncomfortable: Krishna on one side, Shiva on the other, both keeping their word, and neither of them wrong. It is not a good-against-evil fight. It is two promises meeting.' },
    { art: ['banasura'], who: null,
      hi: 'यह सब बाणासुर के नाश के बिना ही सुलझ गया। शिव ने अपने भक्त के प्राण माँगे और उन्हें बख़्श दिया गया; बाणासुर के पास उसकी हज़ार भुजाओं में से कुछ बची रह गईं और वह वापस ढोल बजाने लगा; और उषा तथा अनिरुद्ध का विवाह हो गया, आख़िरकार ऐसे मामले अंत में इसी तरह तो सुलझते हैं।',
      text: 'It ended without Banasura being destroyed. Shiva asked for his devotee’s life and it was granted; Banasura kept a few of his thousand arms and went back to drumming; and Usha and Aniruddha were married, which is how these things are settled in the end anyway.' },
    { art: ['banasura'], who: 'mithu',
      hi: 'असम में लोग आपको बताएंगे कि यह घटना कहाँ हुई थी — ब्रह्मपुत्र नदी के किनारे बसा तेज़पुर ही बाणासुर का नगर शोणितपुर माना जाता है, और वहाँ दा-पर्बतिया के नक्काशीदार पत्थर के दरवाज़े लगभग छठी सदी से सीना ताने खड़े हैं।',
      text: 'In Assam they will tell you where this happened — Tezpur, on the Brahmaputra, is held to be Banasura’s city Sonitpur, and the sculpted stone gateways at Da-Parbatia there have been standing since about the sixth century.' }
  ],
  moral: 'You cannot build a wall high enough to keep someone from growing up. He got a very good drummer and a very late surprise.',
  source: 'The Usha–Aniruddha and Banasura narrative as told in the Bhagavata Purana (Canto 10) and the Harivamsha. Tezpur in Assam is traditionally identified with Banasura’s Sonitpur; the Da-Parbatia doorframe there is dated by the Archaeological Survey of India to the Gupta period, around the sixth century CE.'
},

/* ==================================================== VRITRA ============= */
{
  id: 'ds.vritra',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  needs_review: true,
  title: 'The One Who Held the Rivers',
  hook: 'The oldest story in this shelf by a long way. Somebody was keeping all the water, and the rivers were not running.',
  hero: 'vritra',
  cast: ['vritra', 'indra', 'mithu'],
  minutes: 4,
  words_hi: [['नदी', 'nadi', 'a river'], ['वज्र', 'vajra', 'the thunderbolt'], ['बादल', 'baadal', 'a cloud']],
  scenes: [
    { art: ['vritra'], who: 'mithu',
      hi: 'यह कहानी बहुत पुरानी है। इस ताक की हर दूसरी कहानी से भी पुरानी — इसे ऋग्वेद में गाया गया है, जो दुनिया की सबसे प्राचीन बची हुई रचनाओं में से एक है, और किसी के इसे लिखने से बहुत पहले से इसे बोल-बोलकर सुनाया जा रहा था।',
      text: 'This one is old. Older than every other story on this shelf — it is sung in the Rig Veda, which is among the oldest surviving compositions anywhere, and it was being recited out loud long before anybody wrote it down.' },
    { art: ['vritra'], who: null,
      hi: 'वृत्र को एक विशालकाय सर्प के रूप में बताया गया है, जो पानी के चारों तरफ कुंडली मारे उसे रोककर बैठा था। उसका नाम एक ऐसे शब्द से बना है जिसका अर्थ होता है ढकना, या घेर लेना। और जब तक उसने पानी को रोके रखा, नदियाँ नहीं बहीं और धरती पर कुछ भी नहीं उगा।',
      text: 'Vritra is spoken of as an enormous serpent lying coiled around the waters, holding them. His name is built from a word that means to cover, or to enclose. And while he held them, the rivers did not run and nothing grew.' },
    { art: ['indra'], who: null, mood: 'think',
      hi: 'इंद्र ने वज्र—यानी बिजली का अस्त्र—उठाया और उसका सामना करने निकल पड़े। और यह कोई आसान काम नहीं था; प्राचीन सूक्त भी यही कहते हैं। वृत्र कोई छोटा-मोटा नहीं था और कोई मज़ाक भी नहीं था। वह सबसे पुराने गीतों की सबसे विशाल हस्ती है।',
      text: 'Indra took the vajra — the thunderbolt — and went out to meet him. And it was not an easy thing; the hymns say so. Vritra is not small and he is not a joke. He is the biggest thing in the oldest songs.' },
    { art: ['indra', 'vritra'], who: null, mood: 'wow',
      hi: 'और जब इंद्र ने प्रहार किया, तो सारा जल आज़ाद हो गया। सूक्त बताते हैं कि पानी कैसे बाहर निकला—"रंभाती हुई गायों की तरह"—सब एक साथ ढलान से उतरते हुए समुद्र की ओर दौड़ पड़े। यही वह पल है जिसके लिए यह पूरा गीत गाया जाता है।',
      text: 'And when Indra struck, the waters went free. The hymns describe them going out "like lowing cattle" — running downhill, all together, to the sea. That is the moment the whole thing is sung for.' },
    { art: ['vritra'], who: 'mithu', mood: 'think',
      hi: 'अब, यह गीत असल में किस बात का वर्णन कर रहा है, इस पर लोग सौ से भी ज़्यादा सालों से बहस कर रहे हैं, और बहस आज भी जारी है। कुछ लोग इसे मानसून के रूप में देखते हैं: बादल पानी को रोके रखते हैं, तूफ़ान उन्हें फोड़ देता है, और नदियाँ भर जाती हैं। कुछ इसे बर्फ़ से या चट्टानों के गिरने से आज़ाद हुई नदियों के रूप में देखते हैं। तो कुछ इसे किसी भी सांसारिक या भौतिक चीज़ से परे मानते हैं।',
      text: 'Now, people have argued about what this song is describing for well over a century, and they are still arguing. Some read it as the monsoon: the clouds hold the water, the storm breaks them, the rivers fill. Some read it as rivers freed from ice, or from a rockfall. Some read it as being about nothing physical at all.',
      ask: {
        q: 'Scholars genuinely disagree about what this describes. What should a book say?',
        options: ['Pick the best one and state it', 'Say that people disagree, and say what the main readings are', 'Not mention the song'],
        answer: 1,
        right: 'Yes. "Grown-ups are still arguing about this one" is an honest sentence, and usually a thrilling one.',
        wrong: 'Say that people disagree and lay out the main readings. Picking one and stating it flatly would be pretending to a certainty nobody actually has.'
      } },
    { art: ['vritra'], who: null,
      hi: 'बाद की कथाओं में, जैसे पुराणों और महाभारत में, वृत्र को एक बिल्कुल ही अलग रूप में दिखाया गया है—कुछ में वह एक ज्ञानी और परम भक्त जीव है, और जिस तरह यह लड़ाई जीती गई, उससे इंद्र की छवि कुछ ख़ास अच्छी नहीं दिखती। कहानी एक जगह थमी नहीं रही। बहुत पुरानी कहानियाँ शायद ही कभी एक जैसी रहती हैं।',
      text: 'Later tellings, in the Puranas and the Mahabharata, give Vritra a whole different life — in some he is a learned and devout being, and Indra comes off rather badly for how the fight was won. The story did not stay still. Very old stories rarely do.' },
    { art: ['indra'], who: 'mithu',
      hi: 'इन सब में जो बात टिकी रही, वह है इसका मूल ढाँचा: पानी को रोककर रखा गया था, और किसी ने उसे बहा दिया। एक ऐसे देश में, जो हर साल उस बारिश का इंतज़ार करता है जिसका बरसना बेहद ज़रूरी है, तीन हज़ार सालों से इस बारे में गाते रहना कोई छोटी बात नहीं है।',
      text: 'What stayed, across all of it, is the shape: the water was being held, and somebody let it go. In a country that waits every year for a rain that has to arrive, that is not a small thing to have been singing about for three thousand years.' }
  ],
  moral: 'The water was held, and someone let it go. That is the oldest thing this shelf remembers.',
  source: 'The Vritra hymns of the Rig Veda, chiefly Mandala I; the later Vritra narratives in the Mahabharata (Udyoga Parva) and the Bhagavata Purana, which differ substantially from the Vedic account. The competing interpretations of the Vedic hymn — monsoon, ice-melt, and non-physical readings — are set out in the scholarly literature and are not settled. needs_review: Vedic chronology and interpretation are contested and require named human review before publish (docs/05 §6).'
},

/* ==================================================== GAJASURA / SHIVA === */
{
  id: 'ds.andhaka-gift',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'devasura',
  badge: 'katha',
  title: 'The Asura Who Asked to Be Remembered',
  hook: 'He lost. Then he asked for something no one expected — and got it.',
  hero: 'shiva',
  cast: ['shiva', 'bhasmasura', 'mithu'],
  minutes: 3,
  words_hi: [['याद', 'yaad', 'memory'], ['माला', 'maala', 'a garland'], ['अंत', 'ant', 'an ending']],
  scenes: [
    { art: ['shiva'], who: 'mithu',
      hi: 'यहाँ एक छोटी-सी बात है जिस पर अक्सर लोगों का ध्यान नहीं जाता, और यह इन कहानियों के असर को किसी भी बड़े युद्ध के मुक़ाबले कहीं बेहतर ढंग से समझाती है।',
      text: 'Here is a small one that people often miss, and it says more about how these stories work than any of the big battles do.' },
    { art: ['shiva'], who: null,
      hi: 'शिव की कहानियों में एक ख़ास बात बार-बार देखने को मिलती है। कोई असुर उनसे लड़ता है—अंधक, गजासुर, जालंधर, या आप कौन-सी कहानी सुन रहे हैं उसके हिसाब से कोई और—और हार जाता है। और फिर, आख़िर में, हारने वाले की एक आख़िरी इच्छा पूरी की जाती है। जान बख़्शी नहीं जाती। पर कुछ दिया ज़रूर जाता है।',
      text: 'There is a pattern in the Shiva stories. An asura fights him — Andhaka, Gajasura, Jalandhara, and others depending on which telling you have — and loses. And then, at the end, the losing one is granted a last request. Not spared. Granted something.' },
    { art: ['shiva'], who: null, mood: 'think',
      hi: 'और हर बार वह इच्छा लगभग एक जैसी ही होती है। मुझे अपने पास रहने दीजिए। जब लोग आपको याद करें, तो मुझे भी याद रखें। आपकी पूजा में मेरी भी कोई चीज़ शामिल हो।',
      text: 'And over and over the request is the same sort of thing. Let me be near you. Let people remember me when they remember you. Let something of mine be part of how you are worshipped.',
      ask: {
        q: 'He has just lost everything. Why ask for that, of all things?',
        options: ['To get his kingdom back', 'Because being remembered is what he actually wanted the whole time', 'To trick Shiva'],
        answer: 1,
        right: 'That is how the tradition reads it. The fight was never really about territory.',
        wrong: 'Because being remembered was what he was after all along. Read the requests back and you can see the fight was never quite about territory.'
      } },
    { art: ['shiva'], who: null,
      hi: 'और शिव वह वरदान दे देते हैं। हर बार। कुछ कहानियों में तो हारा हुआ असुर उनका ही एक सेवक—एक गण—बन जाता है और हमेशा के लिए अपने ही विजेता के घर के दरवाज़े पर खड़ा रहता है, जो किसी भी कहानी के दिए जा सकने वाले अंत से कहीं ज़्यादा अनोखा और दयालु अंत है।',
      text: 'And Shiva gives it. Every time. In some tellings the defeated asura becomes one of his own attendants — a gana — and stands at the door of his own conqueror’s house forever, which is a stranger and kinder ending than any story needed to give.' },
    { art: ['shiva'], who: 'mithu', mood: 'think',
      hi: 'ज़रा इसकी तुलना दुनिया की बाकी कहानियों से कीजिए कि वहाँ हारने वाले के साथ क्या होता है। यहाँ हारने वाले से पूछा जाता है कि वह क्या चाहता है। यह कोई नरमी या ढील नहीं है। यह तो इस बात का एक पूरा नज़रिया है कि असल में दुश्मन होता क्या है।',
      text: 'Compare that with how most stories in the world end for the one who lost. Here the loser gets asked what he wants. That is not softness. It is a whole opinion about what an enemy is.' },
    { art: ['bali'], who: 'mithu',
      hi: 'आपने बिना ध्यान दिए इसी अलमारी में इसे कहीं और भी देखा होगा। महाबली सब कुछ हार जाते हैं—और उन्हें साल में एक दिन घर लौटने की इजाज़त मिलती है, जिसे तब से आज तक एक पूरा राज्य त्योहार की तरह मनाता आ रहा है। इन कहानियों में हारना, शायद ही कभी किसी के साथ होने वाली आख़िरी बात होती है।',
      text: 'You have already seen it elsewhere on this shelf without noticing. Mahabali loses everything — and is given one day a year to come home, which an entire state has been celebrating ever since. Losing, in these stories, is very rarely the last thing that happens to you.' }
  ],
  moral: 'In these stories the one who loses is asked what he wants. That tells you what the fight was really about.',
  source: 'The pattern of a defeated asura receiving a boon, and of asuras becoming Shiva’s ganas, recurs across the Shiva Purana, Linga Purana and Kurma Purana in the Andhaka, Gajasura and Jalandhara narratives; details differ substantially between tellings, and this page describes the pattern rather than fixing on one version.'
}

];

window.IND_COLLECTIONS_DEVASURA = [
  { id: 'devasura', name: 'Devas & Asuras', avatar: 'bali',
    note: 'Two halves of one family, arguing for an age. Asura has never meant evil — and this shelf starts by saying so.' }
];
