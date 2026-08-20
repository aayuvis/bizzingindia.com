/* Bizzing India — regional story content.

   The same shape as data-stories.js, on a separate global so the two sets can be
   loaded and merged independently.

   Told scene by scene, the way a storyteller tells it: a hook, named characters with
   actual dialogue, one turn where the child has to decide something, then the moral —
   spoken plainly, never printed as a lecture.

   Every object here carries badge 'katha' — a story as it is told. Sources name the
   tradition or the collection honestly; where a tale is oral and has no single
   collector, the source says so rather than inventing one.

   Depiction note (docs/05): the Sikh Gurus are never depicted. The Sikh stories here
   are told through events, through the people around the Guru, and through the Khanda
   and Harmandir Sahib — never through a picture of a Guru.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_REGIONAL = [

/* =========================================================== BENGAL ======= */
{
  id: 'fk.kiranmala',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'Kiranmala and the Mountain of Voices',
  hook: 'Two brothers went up the mountain and never came down. Their little sister packed a bag.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 6,
  place: ['IN-WB'],
  words_hi: [['पहाड़', 'pahaad', 'mountain'], ['बहन', 'behen', 'sister'], ['पक्षी', 'pakshi', 'bird']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'यह एक ऐसी कहानी है जो बंगाली दादियाँ-नानियाँ बहुत पुराने समय से सोते वक़्त सुनाती आई हैं। शहर के बाहर एक गाँव में, एक बूढ़े कुम्हार को नदी में लकड़ी के बक्से में बहते हुए तीन बच्चे मिले। वह उन्हें घर ले आया, उनके नाम अरुण, बरुण और किरणमाला रखे, और उन्हें अपने बच्चों की तरह पाला।',
      text: 'This is a story Bengali grandmothers have been telling at bedtime for a very long time. In a village outside the city, an old potter once found three babies floating down the river in a wooden box. He brought them home and named them Arun, Barun and Kiranmala, and raised them as his own.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'वे बड़े हो गए। और एक शाम एक मुसाफ़िर उनके दरवाज़े पर रुका, उनका पानी पिया, और उन्हें उस पहाड़ के बारे में बताया — जो उत्तर की सड़क के छोर पर है, जहाँ तीन नामुमकिन चीज़ें रखी हैं: एक बोलने वाली चिड़िया, एक गाने वाला पेड़, और ऐसा पानी जो सोए हुओं को जगा देता है।',
      text: 'They grew up. And one evening a traveller stopped at their door, drank their water, and told them about the mountain — the one at the end of the north road, where three impossible things are kept: a bird that talks, a tree that sings, and water that wakes the sleeping.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      hi: '"तो फिर मैं जाकर उन्हें लेकर आऊँगा," सबसे बड़े भाई, अरुण ने कहा। मुसाफ़िर ने अपना प्याला नीचे रखा। "हर कोई यही कहता है। सुनो। ऊपर के रास्ते पर, पीछे से आवाज़ें तुम्हारा नाम पुकारती हैं — तुम्हारी माँ, तुम्हारा भाई, तुम्हारा अपना कुत्ता। एक बार भी पीछे मुड़े, तो तुम पहाड़ी की ढलान पर एक पत्थर बन जाओगे।"',
      text: '"Then I shall go and get them," said Arun, the eldest. The traveller put down his cup. "Everyone says that. Listen. On the path up, voices call your name from behind you — your mother, your brother, your own dog. Turn round even once and you become a stone on the hillside."' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'अरुण गया। आधे रास्ते पर, पीछे से किसी ने रोते-बिलखते हुए, उसकी छोटी बहन की आवाज़ में उसका नाम पुकारा। वह मुड़ा। वह घर नहीं लौटा। फिर बरुण गया, अपने कानों में कपड़ा ठूँसकर — पर कपड़ा गिर पड़ा, और वह भी मुड़ गया।',
      text: 'Arun went. Halfway up, somebody behind him called his name in his little sister\'s voice, sobbing. He turned. He did not come home. Barun went next, with his ears stopped up with cloth — and the cloth fell out, and he turned too.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"मुझे मशक दे दीजिए," किरणमाला ने बूढ़े कुम्हार से कहा। उन्होंने उसे कसकर पकड़े रखा। "अब मेरे पास बस तुम ही बची हो।" "तो फिर जब मैं वापस आऊँ तब मुझे थाम लीजिएगा," उसने कहा, "जब वे तीनों मेरे पीछे होंगे।"',
      text: '"Give me the water skin," said Kiranmala to the old potter. He held on to it. "You are the last one I have." "Then hold on to me when I get back," she said, "with all three of them behind me."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'रास्ता सफ़ेद पत्थरों वाला और बहुत खड़ी चढ़ाई का था, और उस पर ऐसे भारी पत्थर बिखरे थे जो हूबहू नौजवानों के आकार और कद के थे। और फिर आवाज़ें शुरू हुईं। अरुण की आवाज़। बरुण की आवाज़। उसका नाम पुकारती हुईं, इतनी पास से कि मानो छू ही लें।',
      text: 'The path was white stone and very steep, and it was covered in boulders that were exactly the size and shape of young men. And then the voices started. Arun\'s voice. Barun\'s voice. Calling her name, close enough to touch.',
      ask: {
        q: 'The voices behind her sound exactly like her brothers. What does she do?',
        options: ['Look back — it might really be them', 'Keep climbing and never turn round', 'Shout back without turning'],
        answer: 1,
        right: 'That is what she did. She sang instead — loudly, all the way up, so that her own voice was the only one she could hear.',
        wrong: 'Kiranmala did the harder thing. She started singing, loudly, and climbed with her own voice filling her ears.'
      } },
    { art: ['pt_crow', 'courtier'], who: 'pt_crow', mood: 'wow',
      hi: 'सबसे ऊपर, सोने के एक पिंजरे में बोलने वाली चिड़िया बैठी थी। उसने उसे ऊपर से नीचे तक देखा। "सौ साल हो गए," उसने कहा, "और तुम पहली हो जो पीछे नहीं मुड़ी। गाने वाली डाली ले लो। पानी ले लो। और जल्दी करो — पहाड़ी इंतज़ार कर रही है।"',
      text: 'At the top, in a cage of gold, sat the bird that talks. It looked her up and down. "A hundred years," it said, "and you are the first one who did not turn round. Take the singing branch. Take the water. And be quick — the hillside is waiting."' },
    { art: ['courtier'], who: null,
      hi: 'वह रास्ते की चट्टानों पर पानी छिड़कती हुई नीचे उतरने लगी, और उसके पीछे-पीछे पूरी पहाड़ी उठ खड़ी हुई: नौजवान और बूढ़े, एक चरवाहा, एक व्यापारी, और दो ऐसे भाई जो इतने लंबे समय से पत्थर बने हुए थे कि बोलना ही भूल चुके थे। सब एक साथ घर की ओर चल पड़े, और पूरा गाँव बाहर निकल आया।',
      text: 'She went down sprinkling water on the boulders as she passed, and the hillside stood up behind her: young men and old men, a shepherd, a merchant, and two brothers who had been stone so long they had forgotten how to talk. They walked home in a crowd, and the whole village came out.' },
    { art: ['courtier', 'guard'], who: 'mithu',
      hi: 'अगर तुम्हारी दीदा या ठकुमा हैं, तो उनसे यह कहानी ज़रूर पूछना। हर बंगाली दादी-नानी इसे ज़रा अलग तरह से सुनाती हैं, और उन सभी को पूरा भरोसा होता है कि उन्हीं की सुनाई बात बिल्कुल सही है।',
      text: 'Ask your dida or your thakuma for this one if you have one. Every Bengali grandmother tells it slightly differently, and every one of them is sure her version is right.' }
  ],
  moral: 'The voices behind you are not always your people. Sometimes the bravest thing is simply to keep climbing.',
  source: 'Thakurmar Jhuli, collected by Dakshinaranjan Mitra Majumdar, 1907 — the great book of Bengali grandmother-tales.'
},

{
  id: 'wt.gopal-smell',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'Paying for the Smell',
  hook: 'A shopkeeper charged a poor man for smelling his food. So the king sent for Gopal.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-WB'],
  words_hi: [['खुशबू', 'khushboo', 'smell'], ['आवाज़', 'aawaaz', 'sound'], ['सिक्का', 'sikka', 'coin']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'शहर में मिठाई की एक दुकान थी, जिसके दरवाज़े से इतनी बढ़िया ख़ुशबू आती थी कि वहाँ से गुज़रने वाले लोग अपने कदम धीमे कर लेते थे। एक ग़रीब आदमी बाहर सीढ़ी पर बैठकर अपनी सूखी रोटी खाया करता था, क्योंकि उस दरवाज़े पर बैठकर सूखी रोटी खाने से भी गरमा-गरम जलेबी जैसा स्वाद आता था।',
      text: 'There was a sweet-shop in the town with a doorway that smelled so good that people slowed down as they passed it. A poor man used to eat his dry roti sitting on the step outside, because dry roti eaten in that doorway tasted of hot jalebi.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      hi: 'एक दिन दुकानदार अपना बही-खाता लेकर बाहर आया। "छह महीने से तुम यहाँ बैठे हो। छह महीने से मेरी ख़ुशबू ले रहे हो। तुम्हें मुझे आठ रुपये देने होंगे।"',
      text: 'One day the shopkeeper came out with his account book. "Six months you have been sitting there. Six months of my smell. You owe me eight rupees."' },
    { art: ['courtier'], who: null,
      hi: 'उस ग़रीब आदमी के पास आठ रुपये वैसे ही थे जैसे किसी मछली के पास जेबें होती हैं। बहस इतनी बढ़ गई कि दोनों को पकड़कर राजा कृष्णचंद्र के दरबार में ले जाया गया — जिन्होंने दोनों को देखा, एक ठंडी साँस भरी, और गोपाल भार को बुलवाया।',
      text: 'The poor man had eight rupees the way a fish has pockets. The argument got loud enough that they were both marched off to the court of Raja Krishnachandra — who looked at both of them, sighed, and sent for Gopal Bhar.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: '"ज़रा मैं भी अच्छी तरह समझ लूँ," गोपाल ने कहा। "इसने आपकी कोई चीज़ नहीं खाई।" "कुछ नहीं।" "इसने आपकी किसी चीज़ को हाथ नहीं लगाया।" "कुछ नहीं।" "मगर इसने सूँघा।" "पूरे छह महीने तक!" दुकानदार ने कहा। "तब तो यह बड़ा आसान है," गोपाल ने कहा, और सिक्कों की एक थैली मँगवाई।',
      text: '"Let me be sure I understand," said Gopal. "He ate nothing of yours." "Nothing." "He touched nothing of yours." "Nothing." "But he smelled." "For six months!" said the shopkeeper. "Then this is easy," said Gopal, and asked for a bag of coins.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'पूरा दरबार आगे झुक आया। गोपाल ने थैली उठाई और दुकानदार के कान के ठीक पास ले जाकर पकड़ी।',
      text: 'The whole court leaned in. Gopal took the bag and held it up beside the shopkeeper\'s ear.',
      ask: {
        q: 'The man ate nothing. How on earth do you pay for a smell?',
        options: ['Hand over eight real rupees', 'Let him listen to the coins', 'Tell the shopkeeper he is being silly'],
        answer: 1,
        right: 'Exactly. Gopal shook the bag beside his ear until it jingled, and stopped.',
        wrong: 'Gopal did something better than an argument. He shook the bag beside the shopkeeper\'s ear until it jingled.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      hi: 'छन-छन-छन सिक्के खनखनाए। गोपाल रुका, और उसने थैली का मुँह बाँध दिया। "हिसाब चुकता," उसने कहा। "इसने आपकी मिठाइयों की ख़ुशबू ली। आपने इसके पैसों की खनक सुन ली। अब किसी का किसी पर कुछ बाकी नहीं रहा।"',
      text: 'Chhan-chhan-chhan went the coins. Gopal stopped, and tied the bag shut. "Paid," he said. "He had the smell of your sweets. You have had the sound of his money. Nobody is owed anything."' },
    { art: ['guard'], who: null,
      hi: 'दुकानदार ने अपना मुँह खोला, समझा कि कहने को तो कुछ बचा ही नहीं, और उसे फिर बंद कर लिया। राजा इतनी ज़ोर से हँसे कि उन्हें पानी देना पड़ा।',
      text: 'The shopkeeper opened his mouth, worked out that there was nothing at all to say, and closed it again. The Raja laughed so hard he had to be handed water.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगली सुबह वह गरीब आदमी वापस अपनी सीढ़ी पर लौट आया। फिर कभी किसी ने उससे कोई पैसा नहीं माँगा।',
      text: 'The poor man went back to his step the next morning. Nobody charged him anything ever again.' }
  ],
  moral: 'Take exactly what you gave. A smell is worth a sound.',
  source: 'Gopal Bhar tales — the jester of Raja Krishnachandra of Krishnanagar in Bengal, told in Bengali for generations. Tricksters all over the world are given this same case to solve.'
},

/* ======================================================= TAMIL NADU ======= */
{
  id: 'wt.tenali-thieves',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'The Thieves Who Watered the Garden',
  hook: 'Tenali Raman heard thieves in his garden at midnight. So he told his wife a secret, very loudly.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['चोर', 'chor', 'thief'], ['बगीचा', 'bageecha', 'garden'], ['कुआँ', 'kuan', 'well']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'तेनाली रामन राजा कृष्णदेवराय के दरबार के सबसे मज़ाकिया आदमी थे, जिसका मतलब था कि वे चुपके से सबसे चतुर भी थे। एक गर्म रात वे जागे हुए लेटे थे कि उन्हें बगीचे में कुछ सुनाई दिया जो हवा बिलकुल नहीं थी: चार आदमी, फुसफुसाते हुए, केले के पेड़ों के बीच से दबे पाँव जा रहे थे।',
      text: 'Tenali Raman was the funniest man at the court of King Krishnadevaraya, which meant he was also, quietly, the cleverest. One hot night he was lying awake when he heard something in the garden that was not the wind: four men, whispering, going carefully through the plantains.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'उन्होंने उनकी आवाज़ों से गिना। चार। एक वे खुद थे, दूसरी उनकी पत्नी, और पहरेदार सड़क पर इतनी दूर थे कि आवाज़ भी न पहुँचे।',
      text: 'He counted them by their voices. Four. He was one, his wife was two, and the guards were a long shout away down the road.',
      ask: {
        q: 'He cannot fight four thieves. But they can hear every single word he says. So what should he say?',
        options: ['Shout for the guards and hope', 'Tell his wife, very loudly, that the treasure is going into the well', 'Lie still and pretend to be asleep'],
        answer: 1,
        right: 'That is the move. He did not talk to the thieves at all — he let them overhear him.',
        wrong: 'Raman did something sneakier. He woke his wife up and talked to her far more loudly than anybody talks at midnight.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: '"सुनती हो!" रामन ऐसी फुसफुसाहट में बोले जो अगली गली तक सुनाई दे सकती थी। "शहर में चोर आ गए हैं! जल्दी करो — हर सिक्का, हर ज़ंजीर, चाँदी की हर थाली — उनके आने से पहले सब कुएँ में डाल दो!"',
      text: '"WIFE!" said Raman, in a whisper you could have heard in the next street. "There are thieves in the town! Quick — every coin, every chain, every silver plate — into the well with it, before they come!"' },
    { art: ['courtier'], who: null,
      hi: 'उनकी पत्नी, जिनका विवाह उनसे हुए कई साल हो चुके थे और जो उनकी बातें तुरंत समझ जाती थीं, उतनी ही धीमी आवाज़ में बोलीं, "हाँ जी!" फिर वे दोनों एक के बाद एक बक्सा कुएँ तक ले गए और अंदर पलट दिया। छपाक। छपाक। छपाक।',
      text: 'His wife, who had been married to him for years and had learned to keep up, said "YES, HUSBAND!" just as quietly. Then the two of them carried box after box out to the well and tipped them in. Sploosh. Sploosh. Sploosh.' },
    { art: ['guard'], who: 'guard',
      hi: 'केले के पेड़ों के पीछे, चार चोरों ने एक-दूसरे को देखा। "एक-एक सिक्का," एक ने फुसफुसाते हुए कहा। "कुएँ के अंदर," दूसरे ने धीरे से कहा। "हमें बस बाल्टियाँ चाहिए," तीसरे ने बुदबुदाया। चौथे चोर को कुछ गड़बड़ लग रही थी, पर बाकी तीनों के आगे उसकी एक न चली।',
      text: 'Behind the plantains, four thieves looked at one another. "Every coin," breathed one. "In a well," breathed another. "We only need buckets," breathed the third. The fourth one, who had a bad feeling, was outvoted.' },
    { art: ['guard'], who: null,
      hi: 'वे पूरी रात उस कुएँ को खाली करते रहे। बाल्टी पर बाल्टी, एक के बाद एक बाल्टी, और हर बाल्टी का पानी छलकते हुए रामन की सब्ज़ियों की क्यारियों में गिरता गया क्योंकि उसे डालने के लिए उनके पास कोई और जगह ही नहीं थी। सुबह होते-होते, जब वे कुएँ की तली तक पहुँचे, तो उन्हें मिले: पत्थर। ढेर सारे पत्थर।',
      text: 'They emptied that well all night. Bucket after bucket after bucket, and every bucket went sloshing out over Raman\'s vegetable beds because they had nowhere else to put it. At the bottom, at dawn, they found: stones. A great many stones.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'रामन ने खिड़की के पट खोले, अंगड़ाई ली, और बाहर खड़े उन चार थके-हारे आदमियों को देखा जो एक ऐसे बगीचे में खड़े थे जिसे पहले कभी इतने शानदार ढंग से पानी नहीं मिला था। "कमाल का काम किया," उन्होंने कहा। "अगले मंगलवार भी इसी समय?"',
      text: 'Raman opened his shutters, stretched, and looked out at four exhausted men standing in a garden that had never been so beautifully watered. "Marvellous work," he said. "Same time next Tuesday?"' },
    { art: ['courtier'], who: 'mithu',
      hi: 'वे फिर कभी वापस नहीं आए। लेकिन उस साल पूरी गली में सबसे बढ़िया बैंगन रामन के ही हुए।',
      text: 'They did not come back. But the aubergines that year were the best in the street.' }
  ],
  moral: 'If someone is listening in, that is not a problem. That is a tool.',
  source: 'Tenali Raman tales — told in Tamil as Tenali Raman and in Telugu as Tenali Ramakrishna, of the poet at the court of Krishnadevaraya of Vijayanagara (reigned 1509–1529). Many versions.'
},

{
  id: 'ep.squirrel-bridge',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'epics',
  badge: 'katha',
  title: 'The Squirrel Who Built the Bridge',
  hook: 'An army of monkeys carrying mountains. And one squirrel carrying sand.',
  hero: 'pt_mouse',
  cast: ['rama', 'pt_mouse', 'pt_monkey'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['गिलहरी', 'gilhari', 'squirrel'], ['पुल', 'pul', 'bridge'], ['रेत', 'ret', 'sand']],
  scenes: [
    { art: ['rama', 'pt_monkey'], who: null,
      hi: 'दक्षिण के बिल्कुल आखिरी छोर पर, जहाँ ज़मीन खत्म होती है, राम की सेना समुद्र के पार लंका तक एक पुल बना रही थी। वानर घर जितने बड़े-बड़े पत्थर उठा रहे थे। उनमें से कुछ तो सचमुच के पहाड़ ही उठाए चले आ रहे थे।',
      text: 'At the very tip of the south, where the land runs out, Rama\'s army was building a bridge across the sea to Lanka. The vanaras were carrying boulders the size of houses. Some of them were carrying actual hills.' },
    { art: ['pt_mouse'], who: null,
      hi: 'एक चट्टान पर बैठी एक छोटी धारीदार गिलहरी करीब चार मिनट तक उन्हें देखती रही। फिर वह दौड़कर पानी के पास गई, गीली रेत में तब तक लोट-पोट हुई जब तक कि वह पूरी तरह रेत से सन न गई, फिर दौड़कर पुल पर पहुँची और खुद को ज़ोर से झटक दिया।',
      text: 'A small striped squirrel watched them from a rock for about four minutes. Then she ran down to the water, rolled in the wet sand until she was completely coated in it, ran out onto the bridge, and shook herself.' },
    { art: ['pt_monkey', 'pt_mouse'], who: 'pt_monkey', mood: 'wow',
      hi: 'एक वानर का पैर उस पर पड़ते-पड़ते बचा। "रास्ते से हटो, नन्ही सी जान! हम यहाँ पहाड़ उठा रहे हैं और तुम यहाँ धूल झाड़ रही हो!"',
      text: 'A vanara nearly stepped on her. "Out of the way, little thing! We are carrying mountains here and you are shaking dust about!"' },
    { art: ['pt_mouse'], who: 'pt_mouse',
      hi: '"तुम्हारे पहाड़ों के बीच की खाली जगहें मेरे शरीर जितनी बड़ी हैं," गिलहरी ने कहा, और और रेत लाने वापस चली गई। वह कोई बात साबित नहीं कर रही थी। वह तो काम कर रही थी।',
      text: '"The gaps between your mountains are the size of my body," said the squirrel, and went back for more sand. She was not making a point. She was working.' },
    { art: ['pt_monkey', 'pt_mouse'], who: null, mood: 'think',
      hi: 'दोपहर होते-होते वानर उस पर हँसने लगे, और उनमें से एक ने उसे पूँछ से उठाया और घुमाकर पुल से दूर फेंक दिया।',
      text: 'By afternoon the monkeys had started laughing at her, and one of them picked her up by the tail and swung her away off the bridge.',
      ask: {
        q: 'She is soaked, sandy, laughed at and thrown off. What should the squirrel do?',
        options: ['Stop — she is far too small to help', 'Try to carry a stone instead', 'Get up and go back for more sand'],
        answer: 2,
        right: 'She went back. Nobody had ever asked her permission to help, and she was not asking theirs.',
        wrong: 'The squirrel did the stubborn thing. She got up, shook herself off, and went back for more sand.'
      } },
    { art: ['rama', 'pt_mouse'], who: 'rama',
      hi: 'वह सीधे एक हाथ में जा गिरी। राम ने उसे थाम लिया था। उन्होंने उसे अपनी हथेली पर बिठाया और पुल की तरफ देखा, जहाँ हर पत्थर के बीच की हर खाली जगह गीली रेत से कसकर भर दी गई थी। "इसके बिना," उन्होंने कहा, "यह पूरा ढाँचा हिल जाता। तुम्हें यह किसने बताया?" "किसी ने नहीं," गिलहरी बोली। "मैंने तो बस देखा।"',
      text: 'She landed in a hand. Rama had caught her. He set her on his palm and looked at the bridge, where every gap between every boulder had been packed tight with wet sand. "Without this," he said, "the whole thing shifts. Who told you?" "Nobody," said the squirrel. "I just looked."' },
    { art: ['rama', 'pt_mouse'], who: null, mood: 'wow',
      hi: '"उसे नीचे रखने से पहले, उन्होंने तीन उँगलियों से उसकी पीठ सहलाई। और पूरे दक्षिण में लोग तुम्हें यही बताएंगे कि तुम्हारी दीवार पर दौड़ने वाली नन्ही गिलहरी की पीठ पर आज भी तीन हल्की धारियाँ क्यों हैं।"',
      text: 'He stroked her back with three fingers before he put her down. And that, they will tell you all over the south, is why the little palm squirrel who runs up your wall has three pale stripes down her back to this day.' },
    { art: ['pt_mouse'], who: 'mithu',
      hi: '"अगली बार जब कोई बरामदे में दौड़े, तो ज़रा देखना। तीन धारियाँ। जाकर देखो।"',
      text: 'Next time one runs across the veranda, have a look. Three stripes. Go on.' }
  ],
  moral: 'Nobody else gets to decide whether your help counts. That was never their job.',
  source: 'The squirrel appears in Tamil and other regional tellings of the Ramayana rather than in Valmiki\'s Sanskrit poem. The stripes on the Indian palm squirrel are explained this way across the south. Many versions.'
},

/* =========================================================== KERALA ======= */
{
  id: 'fk.mahabali',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The King Who Comes Home Every Year',
  hook: 'Once a year all of Kerala lays flowers on the doorstep. Somebody is coming.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-KL'],
  words_hi: [['फूल', 'phool', 'flower'], ['वादा', 'vaada', 'promise'], ['राजा', 'raja', 'king']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हर साल ओणम पर, पूरे केरल के घरों में पूकलम सजाया जाता है — मुख्य दरवाज़े के पास ज़मीन पर फूलों की पंखुड़ियों का कालीन, दस दिनों तक हर सुबह रंगों का एक नया घेरा। बैकवाटर्स में लंबी-लंबी स्नेक बोट्स दौड़ लगाती हैं। केले के पत्ते पर सद्या परोसा जाता है, जिसमें तुम्हारी उंगलियों की गिनती से भी ज़्यादा पकवान होते हैं। किसी के आने का इंतज़ार है।',
      text: 'Every year at Onam, houses all over Kerala lay out a pookalam — a carpet of flower petals on the ground by the front door, a new ring of colour each morning for ten days. Long snake boats race down the backwaters. There is a sadya on a banana leaf with more dishes on it than you have fingers. Somebody is expected.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'उनका नाम महाबली है, और मलयाली बच्चे उन्हें मावेली कहते हैं। बहुत पहले वे यहाँ के राजा थे, और केरल आज तक उन्हें भूला नहीं है।',
      text: 'His name is Mahabali, and Malayali children call him Maveli. He was a king here, long ago, and Kerala has never got over him.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'कहते हैं कि उनके दौर में कोई झूठ नहीं बोलता था और कोई भूखा नहीं रहता था; दरवाज़ों पर ताले जैसी कोई चीज़ ही नहीं थी, क्योंकि किसी को भी कुछ छीनने या चुराने की ज़रूरत नहीं पड़ती थी। मावेली अपने देश में घूम-घूमकर लोगों से पूछते थे कि क्या उनके पास सब कुछ काफ़ी है। और उनके पास हमेशा सब कुछ काफ़ी होता था।',
      text: 'They say that in his time nobody lied and nobody went hungry; that there was no such thing as a lock on a door, because there was nothing anyone needed to take. Maveli walked about his country asking people whether they had enough. They always had.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'मावेली सबसे बढ़कर एक बात के लिए मशहूर थे: उन्होंने अपनी ज़िंदगी में कभी किसी माँगने वाले को ना नहीं कहा था। इसलिए जब एक छोटा-सा लड़का — लकड़ी की छतरी लिए, नंगे पाँव चलता हुआ एक नन्हा-सा ब्राह्मण बालक — उनके महायज्ञ में आया और उसने एक उपहार माँगा, तो पूरा दरबार मुस्कुरा उठा।',
      text: 'Maveli was famous for one thing above all: he had never in his life said no to anyone who asked him for something. So when a small boy — a very small brahmin boy, walking barefoot with a wooden umbrella — came to his great sacrifice and asked for a gift, the whole court smiled.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'think',
      hi: '"कुछ भी माँग लो," मावेली ने कहा। "तीन डग ज़मीन," बालक बोला। "बस उतनी ही, जितनी मैं तीन क़दमों में नाप सकूँ।" राजा के बूढ़े गुरु का चेहरा सफ़ेद पड़ गया और उन्होंने उनका हाथ पकड़ लिया। "इसे कोई वचन मत दीजिए। मैं आपसे कह रहा हूँ। मत दीजिए।"',
      text: '"Ask for anything," said Maveli. "Three paces of land," said the boy. "Just as much as I can cover in three steps." The king\'s old teacher went white and caught his arm. "Do not promise this one anything. I am asking you. Do not."',
      ask: {
        q: 'His teacher says stop. The boy is asking for three steps of dust. What does Maveli do?',
        options: ['Refuse — something here is strange', 'Offer a whole province instead', 'Promise, because he has never once broken his word'],
        answer: 2,
        right: 'Yes. He poured the water over the boy\'s hand, which is how a promise was sealed, and said: take your three steps.',
        wrong: 'Maveli promised. He poured the water over the boy\'s hand, the way a promise was sealed, and said: take your three steps.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और वह छोटा-सा बालक बड़ा होने लगा। वह बढ़ता ही गया, यहाँ तक कि उसकी छतरी बादलों को छूने लगी। एक ही क़दम में समंदर से लेकर पहाड़ों तक पूरी धरती समा गई। दूसरे क़दम ने पूरे आकाश को नाप लिया। फिर वह एक पैर हवा में उठाए रुका और बोला: "आपका वचन तो तीन का था। मैं तीसरा क़दम कहाँ रखूँ?"',
      text: 'And the small boy began to grow. He grew until the umbrella brushed the clouds. One step covered the whole earth, from the sea to the mountains. The second step covered the sky. Then he stopped, with one foot in the air, and said: "Your promise was three. Where shall I put the third?"' },
    { art: ['courtier'], who: 'courtier',
      hi: 'मावेली ने उस पैर के नीचे अपने राज्य को देखा। फिर वे घुटनों के बल बैठ गए और अपना सिर झुका लिया। "यहाँ," उन्होंने कहा। "अब ऐसा कुछ नहीं बचा जो मेरा हो। वचन को टिकने के लिए भी तो कोई जगह चाहिए।"',
      text: 'Maveli looked at his kingdom under that foot. Then he knelt down and bowed his head. "Here," he said. "There is nothing else left that is mine. A promise has to have somewhere to stand."' },
    { art: ['courtier'], who: null,
      hi: 'तीसरा क़दम हौले से उनके सिर पर पड़ा, और मावेली केरल से विदा हो गए। लेकिन उनके माँगने पर उन्हें एक बात की छूट ज़रूर मिली: हर साल एक दिन लौटकर यह देखने की, कि उनकी प्रजा कुशल-मंगल से है या नहीं।',
      text: 'The third step came down softly, on the crown of his head, and Maveli went away from Kerala. But he had been given one thing back for the asking: one day every year to return and see whether his people are well.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'फूल इसी के लिए तो सजाए जाते हैं। और इसी वजह से ओणम पर परिवार ढेर सारा खाना पकाते हैं और हर कोई यही बात कहता है: वे आएँ तो हमें ख़ुश देखें। ऐसा न हो कि वे इतनी दूर से आएँ और हमें उदास पाएँ।',
      text: 'That is what the flowers are for. And it is why, at Onam, families cook far too much and everybody says the same thing: he should find us happy. He should not come all this way and find us sad.' }
  ],
  moral: 'A promise is the last thing a good king owns — and the one thing nobody can take from him.',
  source: 'Kerala\'s Onam tradition. The story of Mahabali and Vamana is told across India and appears in the Puranas; in Kerala the festival is about Maveli\'s homecoming.'
},

/* ======================================================== RAJASTHAN ======= */
{
  id: 'fk.pabuji',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'Pabuji Leaves His Own Wedding',
  hook: 'A wedding half finished, a promise made months before, and a painted scroll seven metres long that only opens after dark.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_bull'],
  minutes: 5,
  place: ['IN-RJ'],
  words_hi: [['ऊँट', 'oont', 'camel'], ['वादा', 'vaada', 'promise'], ['रेगिस्तान', 'registan', 'desert']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'थार के रेगिस्तान के एक गाँव में, जब सारा काम निबट जाता है और रात ठंडी हो जाती है, तो भोपा नाम का एक गायक दो खंभों के बीच एक लंबा चित्रित कपड़ा फैलाता है। इसे फड़ कहते हैं। यह शुरू से आखिर तक छोटे-छोटे नारंगी और हरे चित्रों से भरा होता है, और चारों तरफ बिल्कुल अंधेरा रहता है जब तक कि उसकी पत्नी दीया उठाकर एक बार में उसका एक छोटा सा हिस्सा रोशन न कर दे।',
      text: 'In a village in the Thar desert, when the work is done and the night is cold, a singer called a bhopa unrolls a long painted cloth between two poles. It is called a phad. It is covered end to end with tiny orange and green figures, and it is completely dark until his wife holds up a lamp and lights one small patch of it at a time.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"यहाँ," भोपा एक छड़ी से कपड़े को छूते हुए कहता है, "अपनी काली घोड़ी केसर कालमी पर सवार, कोलू के पाबूजी हैं।" और फिर वह गाने लगता है, और तब तक नहीं रुकता जब तक सूरज नहीं निकल आता।',
      text: '"Here," says the bhopa, touching the cloth with a stick, "is Pabuji of Kolu, on his black mare, Kesar Kalmi." And then he sings, and does not stop until the sun comes up.' },
    { art: ['guard', 'pt_bull'], who: null,
      hi: 'पाबूजी रेगिस्तान के एक सरदार थे, और यही वह हिस्सा है जिसका सबको इंतज़ार रहता है। देवल नाम की एक औरत के पास मवेशियों का एक झुंड था, और एक सूखे के मौसम में वह पाबूजी के पास अपनी रक्षा की गुहार लेकर आई। उन्होंने उसे वचन दिया। उन्होंने कहा कि वह जब भी पुकारेगी, वह तुरंत आ जाएँगे — चाहे बुलावा आने के वक्त वह कुछ भी क्यों न कर रहे हों।',
      text: 'Pabuji was a chief of the desert, and this is the part everyone waits for. A woman called Deval kept a herd of cattle, and one dry season she came to him and asked for his protection. He gave her his word. Whenever she called, he said, he would come — whatever he was doing when the call came.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'महीनों बाद पाबूजी के अपने ब्याह का मौका था। उनकी कलाई पर रक्षा-सूत्र बँध चुका था, पवित्र अग्नि जल रही थी, और उन्होंने चार में से तीन फेरे पूरे कर लिए थे। वह अपनी दुल्हन के लिए एक ऐसा तोहफ़ा लाए थे जो उस रेगिस्तान में किसी दुल्हन को कभी नहीं मिला था: ऊँटनियों का एक झुंड, जो वहाँ किसी ने पहली बार देखा था।',
      text: 'Months later Pabuji was at his own wedding. The knot was tied at his wrist, the fire was lit, and he had walked three of the four rounds around it. He had brought his bride a gift no bride in that desert had ever been given: a herd of she-camels, the first anyone there had seen.' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'sad',
      hi: 'चौथे फेरे के वक्त, देवल पैरों में धूल लपेटे दरवाज़े से भीतर आई। "वे मेरे एक-एक मवेशी को हाँक कर ले गए हैं," उसने कहा। "आपने मुझे सर्दियों में वचन दिया था। अब तो गर्मियाँ आ गई हैं।"',
      text: 'On the fourth round, Deval came through the doorway with dust on her feet. "They have driven off every one of my cattle," she said. "You gave me your word in the winter. It is summer now."',
      ask: {
        q: 'Three rounds done, one to go, and his word is standing in the doorway. What does Pabuji do?',
        options: ['Finish the wedding first, then ride', 'Send his men and stay', 'Go now, with the wedding knot still tied to his wrist'],
        answer: 2,
        right: 'He went. The singers say he never finished the fourth round — and that is the line the whole night has been building to.',
        wrong: 'Pabuji did the harder thing. He stood up at the fourth round and went, with the wedding knot still tied to his wrist.'
      } },
    { art: ['guard', 'pt_bull'], who: 'guard',
      hi: '"मुझे माफ़ करना," उन्होंने अपनी दुल्हन से कहा। "सर्दियों में दिया गया वचन गर्मियों में भी वचन ही रहता है।" उन्होंने केसर कालमी के लिए सीटी बजाई, और घोड़ी सरपट दौड़ती हुई आ पहुँची, और उस यात्रा की उड़ती धूल फड़ के ठीक बीचों-बीच चित्रित है।',
      text: '"Forgive me," he said to his bride. "A promise made in winter is still a promise in summer." He whistled for Kesar Kalmi, and the mare came at a run, and the dust of that ride is painted right across the middle of the phad.' },
    { art: ['courtier'], who: null,
      hi: 'वह मवेशियों को वापस ले आया। उसके बाद क्या हुआ, यह भोपा भोर से ठीक पहले के आखिरी पहर में गाता है, जब सबसे छोटे बच्चे अपनी माँओं की शॉल पर पहले ही सो चुके होते हैं।',
      text: 'He brought the cattle back. What happened after that, the bhopa sings in the last hours before dawn, when the smallest children are already asleep on their mothers\' shawls.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'सूरज उगने पर फड़ को लपेट दिया जाता है। राजस्थान के ऊँट पालने वाले आज भी अपने ऊँटों के बीमार होने पर पाबूजी के गीत गाते हैं — क्योंकि वही ऊँटों को लेकर आए थे, और क्योंकि उन्होंने अपना वचन निभाया था।',
      text: 'At sunrise the phad is rolled up. Camel herders in Rajasthan still sing to Pabuji when their camels are sick — because he was the one who brought the camels, and because he kept his word.' }
  ],
  moral: 'A promise made in the morning is still a promise at midnight.',
  source: 'Pabuji ki Phad — the Rajasthani epic of Pabuji, sung through the night by bhopa singers in front of a painted cloth scroll. The phads are painted by the Joshi families of Shahpura, Rajasthan. Many versions.'
},

/* =========================================================== PUNJAB ======= */
{
  id: 'fk.lambikin',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'Lambikin and the Drumikin',
  hook: 'Everybody in the forest wanted to eat him. He asked them all to wait until Thursday.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'pt_jackal', 'pt_lion'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['जंगल', 'jangal', 'forest'], ['ढोल', 'dhol', 'drum'], ['नानी', 'nani', 'grandmother']],
  scenes: [
    { art: ['pt_deer'], who: null,
      hi: 'एक बार लम्बिकिन नाम का एक नन्हा मेमना था, जो दुनिया से इतना खुश रहता था कि चलने के बजाय हर जगह फुदक-फुदक कर ही जाता था। एक सुबह वह गाते-बजाते जंगल के रास्ते अपनी नानी के घर निकला, क्योंकि नानी उसे हमेशा ज़रूरत से ज़्यादा ही खिलाती थीं।',
      text: 'Once there was a Lambikin who was so pleased with the world that he skipped everywhere instead of walking. One morning he set off through the forest to his Granny\'s house, singing, because Granny always fed him far too much.' },
    { art: ['pt_jackal', 'pt_deer'], who: 'pt_jackal', mood: 'wow',
      hi: 'पहले ही मोड़ पर एक सियार खड़ा था, जिसने अपने होंठ चाटे। "लम्बिकिन! मैं तुम्हें खा जाऊँगा!"',
      text: 'Round the first bend stood a Jackal, who licked his lips. "Lambikin! I am going to EAT you!"' },
    { art: ['pt_deer'], who: 'pt_deer', mood: 'think',
      hi: '"अरे, मत खाओ," लम्बिकिन वहीं अपनी जगह पर फुदकते हुए बोला। "मुझमें तो बस हड्डियाँ ही हड्डियाँ हैं। ज़रा नानी के यहाँ से मेरे लौटने का इंतज़ार करो — मैं मक्खन जैसा मोटा-ताज़ा हो जाऊँगा। तुम मुझे गुरुवार को खा लेना।" सियार ने मक्खन के बारे में सोचा, और एक तरफ हट गया।',
      text: '"Oh, don\'t," said Lambikin, skipping on the spot. "I am all bones. Wait till I come back from Granny\'s — I shall be fat as butter. You can eat me on Thursday." The Jackal thought about butter, and stood aside.' },
    { art: ['pt_lion', 'pt_deer'], who: null,
      hi: 'रास्ते में एक गिद्ध के साथ भी यही हुआ, फिर एक बूढ़े भालू के साथ, और आखिर में एक बाघ के साथ, जो उन सब में सबसे बड़ा और सबसे भूखा था। उन सब ने गुरुवार वाली बात सुनी। उन में से हर कोई एक तरफ हट गया।',
      text: 'It happened again with a vulture on the path, and again with an old bear, and finally with a Tiger, who was the largest and hungriest of the lot. Every one of them heard about Thursday. Every one of them stood aside.' },
    { art: ['pt_deer'], who: null, mood: 'wow',
      hi: 'नानी के घर लैम्बिकिन ने हफ़्ते भर खूब छककर खाया, और हफ़्ते के अंत तक तो उससे ठीक से खड़ा भी नहीं हुआ जा रहा था। फिर उसने खिड़की से जंगल के रास्ते की तरफ देखा, जहाँ चार बड़े-बड़े साए चुपचाप एक कतार में बैठे गुरुवार का इंतज़ार कर रहे थे।',
      text: 'At Granny\'s house Lambikin ate for a week, and by the end of it he could hardly stand up. Then he looked out of the window at the forest path, where four large shapes were sitting patiently in a row, waiting for Thursday.',
      ask: {
        q: 'He is now extremely fat and they are all still out there. What can he possibly do?',
        options: ['Run for it and hope he is fast', 'Get inside a drum and roll home', 'Stay at Granny\'s house forever'],
        answer: 1,
        right: 'That is exactly it. Granny made him a little drum — a drumikin — and he climbed inside and rolled.',
        wrong: 'Lambikin did something far stranger. He had Granny make him a little drum, and he climbed inside it and rolled.'
      } },
    { art: ['pt_deer'], who: 'pt_deer',
      hi: 'रास्ते पर एक छोटा, गोल ढोल लुढ़कता हुआ और खुद ही गुनगुनाता हुआ आया: "जंगल में खोया, तुम भी खोए! लिकटी, लिकटी, लिकटी टम!"',
      text: 'Down the path came a small round drum, rolling and singing to itself: "Lost in the forest, and so are you! On a lickety, lickety, lickety tum!"' },
    { art: ['pt_jackal'], who: 'pt_jackal', mood: 'think',
      hi: '"ड्रमकिन!" सियार ने आवाज़ दी। "क्या तुमने लैम्बिकिन को देखा है?" "जंगल में खोया, तुम भी खोए!" ढोल ने गाया, और उसकी नाक के ठीक सामने से लुढ़क कर आगे निकल गया। गिद्ध ने पूछा। भालू ने पूछा। बाघ ने पूछा। ढोल ने उन सभी के सामने वही गाया।',
      text: '"Drumikin!" called the Jackal. "Have you seen Lambikin?" "Lost in the forest, and so are you!" sang the drum, and rolled straight past his nose. The vulture asked. The bear asked. The Tiger asked. The drum sang the same thing to all of them.' },
    { art: ['pt_deer'], who: null,
      hi: 'और ढोल लुढ़कते-लुढ़कते पूरे रास्ते घर पहुँचा, चौखट से टकराया, और एक बहुत मोटा और बेहद खुश लैम्बिकिन बाहर निकला और उसने दरवाज़ा बंद कर लिया।',
      text: 'And the drum rolled all the way home, and bumped over the doorstep, and a very fat and very pleased Lambikin climbed out and shut the door.' }
  ],
  moral: 'When you cannot be stronger than them, be somewhere they are not looking.',
  source: 'Tales of the Punjab, collected by Flora Annie Steel, 1894.'
},

{
  id: 'sk.sacha-sauda',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'sikh',
  badge: 'katha',
  title: 'The Truest Bargain',
  hook: 'His father gave him twenty rupees and one instruction: come back with a profit.',
  hero: 'khanda',
  cast: ['khanda', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['सच्चा', 'sachcha', 'true'], ['सौदा', 'sauda', 'bargain'], ['भूख', 'bhookh', 'hunger']],
  scenes: [
    { art: ['khanda'], who: 'mithu',
      hi: 'शुरू करने से पहले: इस कहानी में आप गुरु नानक के बारे में सुनेंगे, लेकिन उन्हें देखेंगे नहीं। सिख अपने गुरुओं के चित्र नहीं बनाते, इसलिए हम भी नहीं बनाएंगे। उनकी जगह आपको खंडा दिखेगा — और कहानी के बाकी सब लोग।',
      text: 'Before we start: in this story you will hear about Guru Nanak, but you will not see him. Sikhs do not make pictures of the Gurus, so we do not either. You will see the Khanda instead — and everyone else in the story.' },
    { art: ['guard'], who: 'guard',
      hi: 'नानक पंजाब के एक गाँव के नौजवान थे, और उनके पिता मेहता कालू को उनकी चिंता रहती थी, जैसे आम तौर पर पिताओं को होती है। "तुम बस ख्यालों में अपनी ज़िंदगी बिता रहे हो। ये बीस रुपये लो और पास के शहर जाओ। कुछ सस्ता खरीदो, उसे महंगे में बेचो और मुनाफा कमाकर घर लौटो। एक अच्छा सौदा — खरा सौदा। बाकी सब तो कर ही लेते हैं।"',
      text: 'Nanak was a young man in a village in Punjab, and his father Mehta Kalu was worried about him, in the ordinary way that fathers worry. "You are dreaming your life away. Take these twenty rupees to the next town. Buy something cheap, sell it dear, come home with a profit. A good bargain — a khara sauda. Everybody manages it."' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'उन्होंने नानक पर नज़र रखने के लिए घर के एक सेवक को साथ भेज दिया। सूरज निकलते ही दोनों एक कपड़े में बीस रुपये बांधकर निकल पड़े — उस ज़माने में यह बहुत बड़ी रकम थी, जिससे ढेर सारा नमक, कपड़ा या अनाज खरीदा जा सकता था।',
      text: 'He sent a family servant along to keep an eye on him. The two of them walked out at sunrise with twenty rupees knotted into a cloth — a serious amount of money then, enough to buy a great deal of salt or cloth or grain.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      hi: 'आधे रास्ते में उन्हें सड़क किनारे पेड़ों के नीचे बैठे कुछ साधु मिले। वे बहुत दुबले-पतले थे। उन्होंने कई दिनों से कुछ नहीं खाया था, और वे कुछ मांग भी नहीं रहे थे, क्योंकि मांगना उनका तरीका नहीं था। नानक उनके साथ बैठ गए और पूछा कि कितने दिन हो गए हैं। उन्होंने कहा, तीन दिन। शायद चार।',
      text: 'Halfway there they came on a group of travelling holy men sitting under trees off the road. They were thin. They had eaten nothing for days, and they asked for nothing, because asking was not their way. Nanak sat down with them and asked how long it had been. Three days, they said. Perhaps four.' },
    { art: ['khanda', 'courtier'], who: null, mood: 'think',
      hi: 'सेवक ने उस बंधी हुई पोटली पर हाथ रखा। "यह आपके पिताजी के पैसे हैं," उसने कहा। "उन्होंने तो खरा सौदा करने को कहा था।"',
      text: 'The servant put his hand on the knotted cloth. "That is your father\'s money," he said. "He asked for a bargain."',
      ask: {
        q: 'Twenty rupees to trade with, and twenty hungry people sitting in front of him. What is the bargain?',
        options: ['Buy grain, sell it, feed them from the profit', 'Spend all twenty rupees on food and watch them eat', 'Give them one rupee and get on with the trip'],
        answer: 1,
        right: 'That is what he did — and Punjab has called it the true bargain ever since.',
        wrong: 'He did something bolder than that. He spent every last rupee on food, and sat down while they ate it.'
      } },
    { art: ['courtier'], who: null,
      hi: 'उन्होंने आटा, दाल और घी खरीदा, सड़क किनारे ही सब पकाया, और सबको तब तक खिलाया जब तक सबका पेट पूरी तरह भर नहीं गया। फिर नानक ने उस खाली कपड़े को झाड़ा और उसे हाथ में तह करके घर की ओर चल पड़े।',
      text: 'They bought flour and lentils and ghee, cooked it all at the roadside, and fed everybody until nobody wanted any more. Then Nanak wiped out the empty cloth and turned for home with it folded flat in his hand.' },
    { art: ['guard', 'khanda'], who: 'guard', mood: 'wow',
      hi: 'गाँव की सीमा पर उनके पिता उनसे मिले। "कहाँ है मेरा मुनाफ़ा?" "मैंने वही सौदा किया जो आपने कहा था," नानक ने कहा। "सबसे सच्चा सौदा जो हो सकता है।" मेहता कालू को यह जवाब ज़रा भी पसंद नहीं आया, और उन्होंने देर तक खूब खरी-खोटी सुनाई।',
      text: 'His father met him at the edge of the village. "Where is my profit?" "I made the bargain you asked for," said Nanak. "The truest one there is." Mehta Kalu did not think much of that answer at all, and said so at length.' },
    { art: ['khanda'], who: 'mithu',
      hi: 'जहाँ यह सब हुआ, उस जगह को तब से \'सच्चा सौदा\' कहा जाने लगा — यानी सबसे सच्चा सौदा। और आज भी दुनिया का हर गुरुद्वारा वहाँ आने वाले हर इंसान के लिए खाना बनाता है, मानो वही बीस रुपये आज भी खर्च किए जा रहे हों।',
      text: 'The place where it happened has been called Sacha Sauda ever since — the true bargain. And every gurdwara in the world still cooks for anyone who walks in, which is that same twenty rupees, still being spent.' }
  ],
  moral: 'The best trade you will ever make is the one where you keep nothing.',
  source: 'Sikh tradition — the Sacha Sauda, the "true bargain", from the janamsakhi accounts of Guru Nanak\'s early life. Many versions. Following Sikh practice, the Guru is not depicted.'
},

{
  id: 'sk.langar-akbar',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'sikh',
  badge: 'katha',
  title: 'The Emperor Sits on the Floor',
  hook: 'The Emperor of India came to visit. He was told he would have to join the queue.',
  hero: 'khanda',
  cast: ['khanda', 'akbar', 'courtier'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['लंगर', 'langar', 'free kitchen'], ['रोटी', 'roti', 'bread'], ['बराबर', 'baraabar', 'equal']],
  scenes: [
    { art: ['khanda'], who: null,
      hi: 'पंजाब में ब्यास नदी के किनारे गोइंदवाल में, गुरु अमर दास जी ने एक नियम बनाया था और वे किसी के लिए भी इसमें ढील नहीं देते थे: मुझसे मिलने से पहले, खाना खाइए। लंगर में। ज़मीन पर पंगत में बैठकर, जो भी वहाँ मौजूद हो उसके साथ, बाकी सब की तरह एक ही थाली में।',
      text: 'At Goindval, on the river Beas in Punjab, Guru Amar Das had made a rule and would not bend it for anybody: before you meet me, you eat. In the langar. Sitting on the floor in a row, with whoever else is there, off the same plate as everyone else.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"हर कोई?" लोग पूछते। "हर कोई," रसोई में दाल परोसते हुए सेवादार कहते। "अमीर, गरीब, चाहे कोई पहली बार आया हो या सौवीं बार। बैठ जाइए, हाथ आगे बढ़ाइए।"',
      text: '"Everybody?" people would ask. "Everybody," said the sevadars in the kitchen, ladling out dal. "Rich, poor, first time, hundredth time. Sit down, hold out your hands."' },
    { art: ['akbar'], who: null, mood: 'wow',
      hi: 'फिर एक दिन सड़क पर उड़ती धूल के बीच शहंशाह अकबर आते दिखे, अपने घोड़ों, शाही छतरियों और ढेरों ऐसे लोगों के साथ जिनका काम ही यह देखना था कि शहंशाह को कभी किसी चीज़ का इंतज़ार न करना पड़े।',
      text: 'Then one day the dust on the road turned out to be the Emperor Akbar, with horses, and umbrellas, and a great many people whose whole job was to make sure that nobody ever asked him to wait for anything.' },
    { art: ['akbar', 'courtier'], who: 'courtier',
      hi: 'एक सेवादार हाथ पोंछते हुए बाहर आई। "गुरु जी आपसे मिलेंगे," उसने कहा, "जब आप भोजन कर लेंगे।" वहाँ इतना गहरा सन्नाटा छा गया कि चम्मच भी खड़ी रह जाए। शहंशाह के एक आदमी ने कहा: "जानती हो ये कौन हैं?" "हाँ," उसने कहा। "उन्हें भूख लगी होगी।"',
      text: 'A sevadar came out, wiping her hands. "The Guru will see you," she said, "after you have eaten." There was a silence you could have stood a spoon up in. One of the Emperor\'s men said: "Do you know who this is?" "Yes," she said. "He must be hungry."' },
    { art: ['akbar'], who: null, mood: 'think',
      hi: 'अकबर ने लंगर के छोटे दरवाज़े की तरफ़ देखा, और अंदर ज़मीन पर पालथी मारकर कतारों में पहले से बैठे लोगों को देखा — किसान, मुसाफ़िर, बच्चे, और मिट्टी से सना एक कुम्हार।',
      text: 'Akbar looked at the low doorway of the langar hall, and the rows of people already sitting cross-legged on the floor inside — farmers, travellers, children, a potter still covered in clay.',
      ask: {
        q: 'The Emperor of India is being asked to sit on the floor with everybody else. What does he do?',
        options: ['Insist on a chair — he is the Emperor', 'Send a minister in to eat on his behalf', 'Sit down in the row'],
        answer: 2,
        right: 'He sat down. Tradition says he ate every bit of it, and asked for more.',
        wrong: 'Akbar surprised everyone. He took off his shoes, went in, and sat down in the row.'
      } },
    { art: ['akbar', 'courtier'], who: 'akbar',
      hi: 'उन्होंने एक पत्तल पर मोटी रोटी और दाल खाई, एक तरफ़ किसान बैठा था और दूसरी तरफ़ एक बच्चा। खाना खत्म करने के बाद, वे थोड़ी देर और वहीं बैठे रहे। "मैंने हिंदुस्तान की हर मेज़ पर खाना खाया है," उन्होंने कहा। "मुझे कभी किसी ने ज़मीन पर नहीं बिठाया। मुझे लगता है, मैं समझ गया हूँ कि आप ऐसा क्यों करते हैं।"',
      text: 'He ate coarse roti and dal off a leaf plate, with a farmer on one side of him and a child on the other. When he had finished he sat there a moment longer than he needed to. "I have eaten at every table in India," he said. "Nobody has ever made me sit on the floor. I think I see why you do it."' },
    { art: ['akbar'], who: null,
      hi: 'उन्होंने रसोई के लिए ज़मीन दान करने की पेशकश की। गुरु जी ने इसे लेने से मना कर दिया: लंगर आम लोगों से ही चलता है, नहीं तो वह लंगर ही नहीं।',
      text: 'He offered a grant of revenue land for the kitchen. The Guru would not take it: a langar is fed by ordinary people or it is not a langar.' },
    { art: ['khanda'], who: 'mithu',
      hi: 'आज भी अमृतसर के स्वर्ण मंदिर जाइए, तो वहाँ हर रोज़ हज़ारों लोग ज़मीन पर कतारों में बैठकर मुफ़्त में खाना खाते हैं। कोई भी। किसी भी दिन। कुर्सियाँ आज भी नहीं हैं।',
      text: 'Go to the Golden Temple at Amritsar today and tens of thousands of people eat there every single day, for nothing, sitting in rows on the floor. Anyone. Any day. Still no chairs.' }
  ],
  moral: 'A meal where everybody sits in the same row is worth more than any throne in the room.',
  source: 'Sikh tradition — the account of Emperor Akbar eating in the langar at Goindval before meeting Guru Amar Das. Many tellings. Following Sikh practice, the Guru is not depicted.'
},

/* ====================================================== MAHARASHTRA ======= */
{
  id: 'fk.shivaji-baskets',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The Baskets of Sweets',
  hook: 'Enormous baskets of sweets left the house every single day. The guards got very, very bored of checking them.',
  hero: 'shivaji',
  cast: ['shivaji', 'guard', 'courtier'],
  minutes: 5,
  place: ['IN-MH', 'IN-UP'],
  words_hi: [['टोकरी', 'tokri', 'basket'], ['मिठाई', 'mithai', 'sweets'], ['चुपचाप', 'chupchaap', 'quietly']],
  scenes: [
    { art: ['shivaji'], who: null,
      hi: '1666 में, शिवाजी अपने नन्हे बेटे संभाजी के साथ बादशाह से मिलने उत्तर में आगरा गए। मुलाकात अच्छी नहीं रही। जब उन्होंने वहाँ से निकलना चाहा, तो पाया कि वे जा नहीं सकते: दरवाज़े पर सिपाही, रास्ते पर सिपाही—ऐसे सिपाही जो बेहद अदब से बात कर रहे थे, मगर अपनी जगह से टस से मस नहीं हो रहे थे।',
      text: 'In 1666 Shivaji rode north to Agra to meet the Emperor, with his young son Sambhaji beside him. The meeting went badly. When he tried to leave, he found that he could not: soldiers on the gate, soldiers on the road, soldiers who were extremely polite and would not move.' },
    { art: ['guard', 'shivaji'], who: 'guard',
      hi: '"आप बादशाह के मेहमान हैं," उन्होंने कहा—और यह एक ऐसा जुमला है जिसके दो बिल्कुल अलग मायने निकल सकते हैं, इस बात पर कि चौखट पर कौन खड़ा है।',
      text: '"You are the Emperor\'s guest," they said, which is a sentence that can mean two completely different things depending on who is standing in the doorway.' },
    { art: ['shivaji'], who: null, mood: 'think',
      hi: 'शिवाजी अपने घर से हज़ारों मील दूर थे, एक अनजान शहर में, जहाँ दिन-रात उन पर पहरा रहता था। मुट्ठी भर आदमियों के साथ लड़कर बाहर निकलना कोई योजना नहीं थी। इससे तो बस सबकी जान ही जाती।',
      text: 'Shivaji was a thousand miles from home, in a city he did not know, watched day and night. Fighting his way out with a handful of men was not a plan. It was a way of getting everybody killed.',
      ask: {
        q: 'Every basket, box and bundle leaving the house is searched. How do you get out?',
        options: ['Send baskets out every day until the guards stop bothering', 'Offer the guards money', 'Wait for a dark night and run'],
        answer: 0,
        right: 'Exactly. He did not beat the guards. He bored them.',
        wrong: 'He did something much slower and much cleverer. He started sending presents out — every day, for weeks.'
      } },
    { art: ['shivaji', 'courtier'], who: 'shivaji',
      hi: '“मेरी तबीयत खराब है,” शिवाजी ने ऐलान किया, “और मैं ईश्वर का धन्यवाद कर रहा हूँ।” और फिर हर सुबह घर से साधु-संतों और आगरा के गरीबों के लिए मिठाइयों और फलों से भरे बड़े-बड़े चपटे टोकरे बाहर जाने लगे — इतने भारी कि दो-दो आदमी उन्हें डंडों के सहारे उठाते थे।',
      text: '"I am ill," Shivaji announced, "and I am giving thanks." And out of the house each morning went great flat baskets of sweets and fruit for holy men and for the poor of Agra — carried on poles by two men each, because they were heavy.' },
    { art: ['guard'], who: null,
      hi: 'पहरेदार ढक्कन हटाते। वे पेड़ों के बीच अपने हाथ डालकर टटोलते। कुछ नहीं। अगले दिन भी वही। और उसके अगले दिन भी। हर सुबह ठीक उसी समय टोकरे बाहर जाते, और पहरेदारों की उँगलियाँ चिपचिपी हो जातीं, कमर दुखने लगती और वे पेड़े देख-देखकर बुरी तरह ऊब जाते।',
      text: 'The guards took the lids off. They dug about in the pedas with their hands. Nothing. The next day, the same. And the next. The baskets went out at the same hour every morning, and the guards got sticky fingers and sore backs and extremely tired of pedas.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'think',
      hi: 'दूसरे हफ्ते तक वे तीन में से बस एक ही ढक्कन उठाकर देखते। तीसरे हफ्ते तक तो वे पूरे काफिले को हाथ हिलाकर जाने का इशारा कर देते और वापस अपनी छाँव में चले जाते। जो चीज़ बीस दिनों से उबाऊ लग रही हो, उस पर लगातार ध्यान टिकाए रखना वाकई बहुत मुश्किल होता है।',
      text: 'By the second week they were lifting one lid in three. By the third they were waving the whole procession through and going back to their shade. It is very hard to keep looking hard at something that has been boring for twenty days.' },
    { art: ['shivaji'], who: null, mood: 'wow',
      hi: 'एक शाम दो टोकरे रोज़ से ज़्यादा भारी होकर बाहर निकले। किसी ने ढक्कन नहीं उठाया। एक के अंदर शिवाजी दुबक कर बैठे थे। दूसरे के अंदर संभाजी थे, जो नौ साल के थे और जिन्हें सख्त हिदायत थी कि उन्हें छींकना बिल्कुल नहीं है।',
      text: 'One evening two of the baskets went out heavier than usual. Nobody lifted a lid. Inside one was Shivaji, folded up small. Inside the other was Sambhaji, who was nine years old and had been told he must not sneeze.' },
    { art: ['shivaji'], who: null,
      hi: 'उन्हें शहर से बाहर ले जाया गया, अंधेरे में नीचे उतारा गया, और वे गायब! वे ऐसे रास्तों से दक्कन अपने घर पहुँचे जिनका किसी ने अंदाज़ा भी नहीं लगाया था, और कहानी कहती है कि वे एक घूमंतू गायक के भेष में पहुँचे — जो कि बिल्कुल वैसा ही अंत है जिसकी यह कहानी हक़दार थी।',
      text: 'They were carried out of the city, set down in the dark, and gone. He rode home to the Deccan by roads nobody expected, and the story says he arrived dressed as a wandering singer, which is exactly the sort of ending this story deserves.' },
    { art: ['shivaji'], who: 'mithu',
      hi: '"महाराष्ट्र का हर बच्चा यह जानता है, और महाराष्ट्र का हर बच्चा टोकरी वाला हिस्सा अपने हाथों से करके बताता है।"',
      text: 'Every child in Maharashtra knows this one, and every child in Maharashtra tells the basket bit with their hands.' }
  ],
  moral: 'Patience is a kind of key. Being boring, on purpose, for long enough, is a kind of escape.',
  source: 'Told all over Maharashtra. Shivaji was held at Agra in 1666 and got away; the escape is recorded in both Maratha and Mughal accounts, and they differ about the details — the baskets are how it is remembered.'
},

/* =========================================================== ODISHA ======= */
{
  id: 'fk.unfinished-hands',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The Carpenter Who Asked for a Closed Door',
  hook: 'Shut the door, said the old carpenter, and do not open it for twenty-one days. On day fourteen, somebody opened it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-OR'],
  words_hi: [['लकड़ी', 'lakdi', 'wood'], ['दरवाज़ा', 'darwaza', 'door'], ['इंतज़ार', 'intezaar', 'waiting']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"ओडिशा के तट पर, पुरी में, राजा इंद्रद्युम्न उस किनारे पर सबसे बड़ा मंदिर बनाना चाहते थे। उनके पास दीवारें थीं। उनके पास शिखर थे। जो उनके पास नहीं था, वह यह था कि उनके भीतर क्या स्थापित किया जाए, और उनके सामने लाया गया कोई भी पत्थर सही नहीं बैठ रहा था।"',
      text: 'At Puri, on the coast of Odisha, King Indradyumna wanted to build the greatest temple on that shore. He had the walls. He had the towers. What he did not have was what should stand inside them, and no stone he was offered was the right stone.' },
    { art: ['courtier', 'guard'], who: 'guard', mood: 'wow',
      hi: '"फिर एक सुबह मछुआरे दौड़ते हुए आए। लहरों के साथ बहकर लकड़ी का एक लट्ठा किनारे आ गया था — गहरे रंग की लकड़ी का एक विशाल कुंदा, जो पानी पर सीधा तैर रहा था, मानो कोई उसे चला रहा हो। बीस आदमी भी उसे उठा नहीं पाए। फिर एक बच्चे ने उसे धक्का दिया, और वह हिल गया।"',
      text: 'Then one morning the fishermen came running. A log had come in on the tide — a huge piece of dark wood, floating upright, riding the surf as though somebody were steering it. Twenty men could not lift it. Then a child pushed it, and it moved.' },
    { art: ['courtier'], who: null,
      hi: '"ओडिशा का हर मूर्तिकार हाथ आजमाने आया। राज्य की सबसे बेहतरीन छेनियाँ मुड़ गईं, टूट गईं, या फिसल गईं। वह लकड़ी किसी से भी कटने का नाम नहीं ले रही थी।"',
      text: 'Every carver in Odisha came to try. The best chisels in the kingdom bent, snapped, or slid off. The wood would not be cut by anyone at all.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"महल के फाटक पर एक बूढ़ा बढ़ई दिखाई दिया — न किसी ने उसे पहले देखा था, और न किसी ने उसे आते देखा। \\"मैं इसे बनाऊँगा,\\" उसने कहा। \\"एक शर्त है। मैं बंद दरवाज़े के पीछे काम करूँगा, और इक्कीस दिनों तक कोई उसे नहीं खोलेगा। न आप, महाराज। न कोई और।\\""',
      text: 'An old carpenter appeared at the palace gate — nobody had seen him before, and nobody saw him arrive. "I will do it," he said. "One condition. I work behind a shut door, and nobody opens it for twenty-one days. Not you, Maharaj. Not anybody."' },
    { art: ['courtier'], who: null,
      hi: '"दरवाज़ा बंद कर दिया गया। अंदर से दिन-रात छेनी की आवाज़ आती रही, ठक, ठक, ठक — और पूरा शहर बाहर बैठा सुनता रहा और अंदाज़ा लगाता रहा। चौदहवें दिन आवाज़ आनी बंद हो गई।"',
      text: 'The door was shut. From inside came chisel-sounds, day and night, thock, thock, thock — and the whole city sat outside listening to it and guessing. On the fourteenth day the sound stopped.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      hi: 'रानी गुंडिचा पूरे दिन उस दरवाज़े के पास बैठी रहीं। कोई आवाज़ नहीं। पूरी रात। कोई आवाज़ नहीं। "वे बंद कमरे में अकेले एक बूढ़े आदमी हैं," उन्होंने कहा, "बिना पानी के। क्या पता वे अंदर फ़र्श पर पड़े हों?"',
      text: 'The queen, Gundicha, sat by that door all day. No sound. All night. No sound. "He is an old man alone in a shut room," she said, "with no water. What if he is lying on the floor in there?"',
      ask: {
        q: 'Fourteen days, and now a whole day of silence. What do you do?',
        options: ['Open the door', 'Wait the full twenty-one days as promised', 'Knock and listen for an answer'],
        answer: 1,
        right: 'That is the sensible answer, and not one person in this story managed it.',
        wrong: 'Nobody managed to wait. The queen loved whoever was behind that door too much, and she opened it.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'कमरा खाली था। न कोई बढ़ई, न लकड़ी का कोई बुरादा, और न ही ऐसा कोई दरवाज़ा जिससे वे बाहर निकल पाते। और फ़र्श के बीचों-बीच खड़ी थीं तीन मूरतें — बड़ी-बड़ी गोल आँखें, फैली हुई रंगी मुस्कानें, और आधे-अधूरे छूटे हाथ। बिल्कुल अधूरी।',
      text: 'The room was empty. No carpenter, no shavings, no door he could have gone out of. And standing there in the middle of the floor were three figures — huge round eyes, wide painted smiles, and arms that stopped short. Unfinished.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'राजा भागते हुए आए। सब इंतज़ार करने लगे कि वे कहेंगे: फिर से शुरू करो, किसी मूर्तिकार को बुलाओ, इन्हें ठीक से पूरा करो। वे बहुत देर तक वहीं खड़े रहे। फिर उन्होंने कहा: "नहीं। ये हमारे पास जिस रूप में आए हैं, वैसे ही रहेंगे।"',
      text: 'The king came running. Everyone waited for him to say: start again, get a sculptor, finish them properly. He stood there a long time. Then he said: "No. This is how they came to us. This is how they stay."' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज भी पुरी जाइए तो आपको बिल्कुल यही देखने को मिलेगा — जगन्नाथ, बलभद्र और सुभद्रा, वही बड़ी-बड़ी आँखें और वही अधूरे हाथ। और हर गर्मी में उन्हें सड़कों पर इतने बड़े रथों पर खींचा जाता है कि रस्सियाँ खींचने में हज़ारों लोग लग जाते हैं।',
      text: 'Go to Puri today and that is exactly what you will see — Jagannath, Balabhadra and Subhadra, with those enormous eyes and those unfinished arms, and every summer they are pulled through the streets on chariots so big it takes thousands of people on the ropes.' }
  ],
  moral: 'Some things are loved exactly as they are, unfinished — and Puri has proved it for centuries.',
  source: 'Odia temple tradition, told at Puri about the making of the images of Jagannath, Balabhadra and Subhadra. Many versions.'
},

/* ======================================================== NORTHEAST ======= */
{
  id: 'fk.naga-brothers',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The Man, the Tiger and the Spirit',
  hook: 'Three brothers, one mother, and one house that was never going to be big enough.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['भाई', 'bhai', 'brother'], ['बाघ', 'baagh', 'tiger'], ['पहाड़', 'pahaad', 'hill']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'नागा पहाड़ियों में बहुत ऊँचे, जहाँ गाँव चोटियों पर बसे हैं और बादल दरवाज़ों से सीधे भीतर चले आते हैं, हर बात की शुरुआत में यह किस्सा सुनाया जाता है। पहली माँ के तीन बेटे थे। एक आत्मा था। एक बाघ था। और एक इंसान था।',
      text: 'High in the Naga hills, where the villages sit on the tops of the ridges and the clouds come in through the doorways, they tell this at the start of everything. The first mother had three sons. One was the Spirit. One was the Tiger. One was the Man.' },
    { art: ['pt_lion', 'courtier'], who: null,
      hi: 'वे सब एक ही घर में बड़े हुए, और कुछ समय तक सब ठीक-ठाक चलता रहा, जैसा कि आमतौर पर होता है। आत्मा रात भर जागता रहता। बाघ ढेर सारा खाना चट कर जाता और हड्डियाँ छोड़ देता। इंसान लकड़ी से तरह-तरह की चीज़ें बनाता और उनके बारे में अपनी बातें बंद ही नहीं करता था।',
      text: 'They grew up in one house, and it worked for a while, the way it does. The Spirit was up all night. The Tiger ate an enormous amount and left the bones. The Man made things out of wood and would not stop talking about them.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      hi: '"यह घर मेरा है," बाघ ने कहा, "मैं सबसे ताक़तवर हूँ।" "यह मेरा है," आदमी ने कहा, "दरवाज़ा मैंने बनाया है।" आत्मा ने कुछ भी नहीं कहा, और किसी बहस में ऐसा करना सामने वाले को सबसे ज़्यादा चिढ़ाने वाली बात होती है।',
      text: '"This house is mine," said the Tiger, "I am the strongest." "It is mine," said the Man, "I built the door." The Spirit said nothing at all, which is somehow the most annoying thing anybody can do in an argument.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'उनकी माँ बाहर बैठकर देर तक यह सब सुनती रहीं। वे बूढ़ी थीं और थकी हुई थीं, और वे जानती थीं कि वे तीनों ही अपनी जगह सही थे।',
      text: 'Their mother sat outside and listened to it for a long time, and she was old and she was tired, and she knew that all three of them were right.',
      ask: {
        q: 'Three grown brothers, one house, and none of them will move out. What does their mother do?',
        options: ['Set them a race for it', 'Make them share and take turns', 'Send all three of them away'],
        answer: 0,
        right: 'She set a race. There is a post at the edge of the field, she said. First one to touch it keeps the house.',
        wrong: 'She did something quicker. "There is a post at the edge of the field," she said. "First one to touch it keeps the house."'
      } },
    { art: ['pt_lion', 'courtier'], who: null,
      hi: 'वे दौड़े। और यहीं से कहानियों के रास्ते अलग हो जाते हैं — कुछ गाँवों में आदमी ईमानदारी से जीतता है, तो कुछ में चालाकी से, और बड़े-बुज़ुर्ग आज भी आग के पास बैठकर इस बात पर बहस करते हैं। लेकिन इसके बाद क्या हुआ, इस बात को सब मानते हैं।',
      text: 'They ran. And here the tellings pull apart — in some villages the Man wins fairly, in others he wins by being cunning about it, and elders will still argue about that around a fire. But everyone agrees on what happened afterwards.' },
    { art: ['pt_lion'], who: null, mood: 'sad',
      hi: 'बाघ जंगल की तरफ़ चला गया। उसने कुछ ख़ास नहीं कहा। आत्मा पूरी तरह आँखों से ओझल हो गई, चट्टानों, पानी और ऊँचे पेड़ों के बीच, जहाँ आप उसे महसूस तो कर सकते हैं पर देख नहीं सकते। और आदमी के पास रह गया वह घर, वह आग और वह दरवाज़ा।',
      text: 'The Tiger went to the forest. He did not say much. The Spirit went out of sight altogether, into the rocks and the water and the tall trees where you can feel him but not see him. And the Man kept the house, and the fire, and the door.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"कभी-कभार आकर खा लिया करना," पेड़ों के किनारे उनकी माँ ने बाघ से कहा। उसने एक बार मुड़कर उनकी तरफ़ देखा, और बस।',
      text: '"Come and eat sometimes," their mother said to the Tiger at the edge of the trees. He looked back at her once, and that was all.' },
    { art: ['pt_lion'], who: 'mithu',
      hi: 'यही वजह है कि नागा पहाड़ियों में, बाघ के बारे में बताने वाले कोई बुज़ुर्ग आम तौर पर उसे "जानवर" नहीं कहेंगे। वे उसे भाई कहेंगे — और उनका मतलब बिल्कुल वही होगा, जैसे आपका उस भाई के लिए होता है जो कहीं बहुत दूर चला गया हो।',
      text: 'Which is why, in the Naga hills, an old man telling you about a tiger will not usually call him "it". He will call him brother — and mean it exactly the way you mean it about the brother who moved far away.' }
  ],
  moral: 'Families who live apart are still families. The hills have said so about the tiger for a very long time.',
  source: 'Naga oral tradition — the tale of the first three brothers, told among several Naga communities in Nagaland. Many versions.'
},

{
  id: 'fk.khasi-sun',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The Sun Who Would Not Come Out',
  hook: 'The sun went into a cave and pulled the dark in after her. Somebody was going to have to go and ask nicely.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_lion', 'pt_elephant'],
  minutes: 4,
  place: ['IN-ML'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['गुफा', 'gufa', 'cave'], ['मुर्गा', 'murga', 'rooster']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      hi: 'मेघालय की खासी पहाड़ियों में — जो धरती की सबसे नम जगह है, जहाँ बादल गाँवों के बीच से होकर गुज़रते हैं — सूरज एक औरत हैं। लोग उन्हें \'का स्नगी\' कहते हैं। चाँद उनका भाई है। और एक बार, बहुत समय पहले, कुछ ऐसा हुआ जिससे वे इतनी उदास हो गईं कि एक गुफ़ा में चली गईं और फिर बाहर ही नहीं निकलीं।',
      text: 'In the Khasi hills of Meghalaya — the wettest place on earth, where the clouds walk through the villages — the sun is a woman. Ka Sngi, they call her. The moon is her brother. And once, long ago, something happened that upset her so badly that she walked into a cave and would not come out.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      hi: 'पूरी दुनिया में अंधेरा छा गया। रात जैसा अंधेरा नहीं, जो सुबह ढल जाता है। दूसरे वाला अंधेरा। धान का बढ़ना रुक गया। बच्चों का बाहर खेलना बंद हो गया। लोग भरी दोपहर में चीड़ की मशालें जलाने लगे और एक-दूसरे का चेहरा न देखने के आदी हो गए।',
      text: 'The world went dark. Not night-dark, which ends. The other kind. The rice stopped growing. The children stopped going outside. People burned pine torches in the middle of the afternoon and got used to not seeing each other\'s faces.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      hi: 'जानवरों ने एक सभा बुलाई। "मैं उन्हें वापस लाऊँगा," बाघ ने कहा, और गुफ़ा के मुहाने पर जाकर ज़ोर से दहाड़ा। पहाड़ हिल उठा। चमगादड़ छत से गिर पड़े। पर इसके सिवा कुछ भी नहीं हुआ।',
      text: 'The animals held a meeting. "I will fetch her," said the tiger, and went to the cave mouth and roared into it. The mountain shook. The bats fell off the roof. Nothing else happened at all.' },
    { art: ['pt_elephant'], who: 'pt_elephant',
      hi: '"मुझे कोशिश करने दीजिए," हाथी ने कहा, और वह इतनी ज़ोर से चिंघाड़ा कि पेड़ पीछे झुक गए। फिर भालू ने कोशिश की। फिर हिरण ने, साँप ने, और बहुत सारे बेहद पक्के इरादे वाले पक्षियों ने। पर गुफ़ा में अंधेरा ही रहा और सूरज अंदर ही रहीं।',
      text: '"Allow me," said the elephant, and trumpeted until the trees leaned back. Then the bear tried. Then the deer, and the snake, and a great many extremely determined birds. The cave stayed dark and the sun stayed in it.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'भीड़ के बिल्कुल पीछे एक मुर्गा खड़ा था। वह न तो बड़ा था। न ही डरावना था। वह ऐसा जीव था जिसकी तरफ कोई दोबारा मुड़कर भी न देखे।',
      text: 'At the back of the crowd stood a rooster. He was not large. He was not frightening. He was the sort of creature nobody looks at twice.',
      ask: {
        q: 'Roaring did not work. Trumpeting did not work. What might?',
        options: ['Something even louder', 'Somebody small, going in politely', 'Give up and light more fires'],
        answer: 1,
        right: 'Yes. The rooster went in alone, and the first thing he did was say good morning.',
        wrong: 'It was the smallest one who managed it. The rooster went in alone, and the first thing he did was say good morning.'
      } },
    { art: ['pt_crow'], who: 'pt_crow',
      hi: '"सुप्रभात," मुर्गे ने अंधेरे की ओर कहा, जो ऐसे हालात में कहना थोड़ा अजीब था। "मैंने आपको बहुत दिनों से नहीं देखा है। बाहर हर कोई आपका हाल-चाल पूछ रहा है। कोई भी नाराज़ नहीं है। बस सबको ठंड लग रही है।"',
      text: '"Good morning," said the rooster into the dark, which was a slightly odd thing to say in the circumstances. "I have not seen you for a while. Everyone outside is asking after you. Nobody is angry. They are just cold."' },
    { art: ['pt_crow'], who: null,
      hi: 'काफ़ी देर तक सन्नाटा छाया रहा। फिर सूरज ने धीरे से कहा कि वह आएगी। लेकिन वह तभी आएगी जब वह उसे बुलाएगा — और उसे हर बार बुलाना पड़ेगा।',
      text: 'There was a long silence. Then the sun said, quietly, that she would come. But she would come only when he called for her — and she would want calling every single time.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'यही तय हुआ था, और तब से यह बात बँधी हुई है। मुर्गा बाँग देता है और खासी की पहाड़ियों पर रोशनी फैल जाती है। उसने अब तक एक भी सुबह नहीं चूकी है।',
      text: 'That is the arrangement, and it has held ever since. The rooster crows and the light comes up over the Khasi hills. He has not missed a morning yet.' }
  ],
  moral: 'Some doors only ever open for good manners.',
  source: 'Khasi oral tradition from the hills of Meghalaya, where the sun is spoken of as a woman and the rooster calls her out at dawn. Many versions.'
},

/* ========================================================== GUJARAT ======= */
{
  id: 'fk.chakli-kagdo',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The House of Wax and the House of Dung',
  hook: 'Two birds, two houses, and the monsoon coming.',
  hero: 'pt_heron',
  cast: ['pt_heron', 'pt_crow'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['चिड़िया', 'chidiya', 'sparrow'], ['बारिश', 'baarish', 'rain'], ['मोम', 'mom', 'wax']],
  scenes: [
    { art: ['pt_heron', 'pt_crow'], who: null,
      hi: 'सौराष्ट्र के एक गाँव में एक नन्हीं चिड़िया और एक कौआ रहते थे, नीम के एक ही पेड़ पर, ऐसी डालियों पर जो लगभग छू रही थीं। मई की एक तपती सुबह चिड़िया ने वही बात कही जो गुजरात में मई के महीने में सब कहते हैं: "बारिश आने वाली है। हमें घर चाहिए।"',
      text: 'In a village in Saurashtra there lived a little sparrow and a crow, in the same neem tree, on branches that nearly touched. One hot morning in May the sparrow said the thing everybody in Gujarat says in May: "The rains are coming. We need houses."' },
    { art: ['pt_heron'], who: 'pt_heron',
      hi: 'चिड़िया ने मोम जुटाना शुरू किया। जब वज़न ही एक चम्मच जितना हो, तो यह बड़ा धीमा काम होता है — मोमबत्ती बनाने वाले के फ़र्श से एक कतरा, मधुमक्खी के छत्ते से एक टुकड़ा, उन तपते हफ़्तों में एक बार में बस एक-एक कण, जबकि बाकी सब छाँव में बैठे थे।',
      text: 'The sparrow gathered wax. That is slow work when you weigh as much as a spoon — a bead of it from a candle-maker\'s floor, a scrap from a beehive, one crumb at a time, all through the hot weeks, while everyone else sat in the shade.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'wow',
      hi: 'कौआ अपनी डाल से उसे देखता रहा। "तुम धूल से घर बना रही हो," उसने कहा। "मेरा वाला देखो।" उसने एक ही दोपहर में गोबर और कीचड़ से जैसे-तैसे अपना घर खड़ा कर लिया था, वह आकार में तीन गुना बड़ा था, और वह अपने घर से बेहद खुश था।',
      text: 'The crow watched her from his branch. "You are building a house out of DUST," he said. "Look at mine." He had slapped his together out of dung and mud in an afternoon, and it was three times the size, and he was extremely pleased with it.' },
    { art: ['pt_heron'], who: null,
      hi: 'चिड़िया अपना काम करती रही। जून के आखिरी हफ़्ते तक उसका घर छोटा, चिकना और कसकर बंद हो चुका था, और कौआ उस पर इतनी बार हँस चुका था कि अब वह अपने वही मज़ाक दोहराने लगा था।',
      text: 'The sparrow kept going. By the last week of June her house was small and smooth and shut tight, and the crow had laughed at it so many times that he had begun repeating his jokes.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'फिर अरब सागर से मानसून वैसे ही उमड़कर आया जैसे आता है — कोई हल्की फुहार नहीं, बल्कि पानी की एक दीवार। मोम का घर वहीं टिका रहा और उस पर से बारिश का पानी बहता रहा। गोबर का घर पहले नरम पड़ा, फिर उदास सा हुआ, और फिर अंत में बस एक कीचड़ का पोखर बनकर रह गया जिसमें एक डंडी फंसी थी।',
      text: 'Then the monsoon came in off the Arabian Sea the way it does — not a drizzle, a wall of water. The wax house sat there with the rain running off it. The dung house went soft, and then sad, and then it was a puddle with a stick in it.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'sad',
      hi: 'आधी रात को दरवाज़े पर खटखटाहट हुई। बाहर पूरी तरह भीगा हुआ एक कौआ खड़ा था, जिसके पंख सिर से बिल्कुल चिपके हुए थे। "चिड़िया," उसने कहा। "प्लीज़।"',
      text: 'At midnight there was a knock. A very wet crow stood outside with his feathers plastered flat to his head. "Sparrow," he said. "Please."',
      ask: {
        q: 'He laughed at her all summer, and now he is at the door in the rain. Does she open it?',
        options: ['No — he laughed at her for weeks', 'Yes, and say nothing at all about it', 'Yes, but he helps gather wax next year'],
        answer: 2,
        right: 'That is what she did. She opened the door and named one small price, and he paid it.',
        wrong: 'She opened the door — and then named one small price, which he was in no position to argue with.'
      } },
    { art: ['pt_heron', 'pt_crow'], who: 'pt_heron',
      hi: '"अंदर आ जाओ," चिड़िया ने कहा। "अपने पैर पोंछ लो। और अगले अप्रैल तुम हर सुबह मेरे साथ मोम इकट्ठा करोगे, जब तक कि हमारे दो घर न बन जाएँ।" "हर सुबह," कौए ने कहा, जो उसके फ़र्श पर पानी टपका रहा था और उस समय किसी भी बात पर राज़ी हो जाता।',
      text: '"Come in," said the sparrow. "Wipe your feet. And next April you are gathering wax with me, every morning, until we have two houses." "Every morning," said the crow, who was dripping on her floor and would have agreed to anything.' },
    { art: ['pt_heron'], who: 'mithu',
      hi: 'पूरे गुजरात में यह कहानी \'चकली अने कागड़ो\' के नाम से सुनाई जाती है — यानी चिड़िया और कौआ। और कुछ कहानियों में वह दरवाज़ा नहीं खोलती। घर पर पूछना कि तुम्हारे परिवार में इसे कैसे सुनाते हैं।',
      text: 'They tell this one all over Gujarat as *Chakli ane Kagdo* — the sparrow and the crow. And in some versions she does not open the door. Ask at home which way your family tells it.' }
  ],
  moral: 'Do the slow work while the sun is out; and open the door anyway when somebody knocks in the rain.',
  source: 'Widely-told folk tale from Gujarat and western India — "Chakli ane Kagdo". Many versions.'
},

/* ======================================================== KARNATAKA ======= */
{
  id: 'fk.punyakoti',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'The Cow Who Came Back',
  hook: 'A tiger let a cow go home to feed her calf. Everybody told him he was a fool.',
  hero: 'pt_bull',
  cast: ['pt_bull', 'pt_lion'],
  minutes: 5,
  place: ['IN-KA'],
  words_hi: [['गाय', 'gaay', 'cow'], ['बाघ', 'baagh', 'tiger'], ['वचन', 'vachan', 'word given']],
  scenes: [
    { art: ['pt_bull'], who: null,
      hi: 'यह कहानी बनने से पहले एक गीत है। कर्नाटक में बच्चे इसे ज़बानी याद करते हैं — \'धरणी मंडल मध्यदोलगे\' — और जब यह गाया जाता है, तो बड़े-बड़े लोग भी खामोश हो जाते हैं। यह पुण्यकोटि नाम की एक गाय के बारे में है।',
      text: 'This one is a song before it is a story. Children in Karnataka learn it by heart — *Dharani mandala madhyadolage* — and grown men have been known to go quiet when it is sung. It is about a cow called Punyakoti.' },
    { art: ['pt_bull'], who: null,
      hi: 'ग्वाले के साथ पूरा झुंड भोर होते ही चरने निकल जाता और सांझ ढले घर लौटता था। पुण्यकोटि सबसे अंत में घर लौटती थी, क्योंकि वही देखती थी कि कोई पीछे तो नहीं छूट गया। वह ऐसी ही थी। आगे के हिस्से के लिए यह बात याद रखना।',
      text: 'The herd went out to graze at dawn with the cowherd, and came home at dusk, and Punyakoti came home last because she was the one who checked that nobody had been left behind. That is who she was. Remember it for the next bit.' },
    { art: ['pt_lion', 'pt_bull'], who: 'pt_lion', mood: 'wow',
      hi: 'एक शाम चट्टानों के पास वह गलत रास्ते पर मुड़ गई, और उनकी छाया से निकलकर एक बाघ रास्ते के बीच आकर खड़ा हो गया। उसने कहा, "मैं तीन दिनों से भूखा हूँ, और तुम सीधे मेरे मुँह में चली आई हो।"',
      text: 'One evening she took a wrong turn near the rocks, and a tiger came out of the shadow of them and stood across the path. "I have been hungry for three days," he said, "and you have walked straight into my mouth."' },
    { art: ['pt_bull', 'pt_lion'], who: 'pt_bull',
      hi: '"मुझे पता है," पुण्यकोटी ने कहा। वह भागी नहीं। "मैं आपसे बहस नहीं करूँगी। बस — मेरे बछड़े ने अभी दूध नहीं पिया है। मुझे उसके पास जाने दीजिए, उसे दूध पिलाने दीजिए, और सब बता देने दीजिए। फिर मैं वापस आकर ठीक यहीं खड़ी हो जाऊँगी।"',
      text: '"I know," said Punyakoti. She did not run. "I will not argue with you. Only — my calf has not been fed. Let me go to him, and feed him, and tell him. Then I will come back and stand exactly here."' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'think',
      hi: 'यह सुनकर बाघ इतना हँसा कि उसे बैठना पड़ गया। उसने कहा, "तो जाओ। जाकर अपने बछड़े को दूध पिलाओ।" उसे पूरा यकीन था कि वह उसे दोबारा कभी नहीं देख पाएगा, और उसे इस तरह दरियादिली दिखाने में बड़ा मज़ा आ रहा था।',
      text: 'The tiger laughed at that until he had to sit down. "Go on then," he said. "Go and feed your calf." He was quite certain he would never see her again, and he was rather enjoying being generous about it.' },
    { art: ['pt_bull'], who: null, mood: 'sad',
      hi: 'उसने अपने बछड़े को दूध पिलाया। उसने झुंड को सब बताया। और पूरा झुंड बाड़े के फाटक पर आकर खड़ा हो गया ताकि वह बाहर न जा सके, बछड़ा उससे लिपट गया, और सब एक साथ बोलने लगे कि बाघ से किया गया वादा कोई असली वादा नहीं होता।',
      text: 'She fed her calf. She told the herd. And the whole herd stood in the gateway of the shed so she could not get out, and the calf held on to her, and everybody talked at once about how a promise made to a tiger is not a real promise.',
      ask: {
        q: 'Her calf is fed. The gate is blocked. Nobody in the world would blame her. Does she go back?',
        options: ['Stay — the calf needs his mother', 'Go back, because she said she would', 'Send an older cow instead'],
        answer: 1,
        right: 'She went. She walked out through the herd at dusk and took the same path back to the rocks.',
        wrong: 'Punyakoti went back. She walked out through the whole herd at dusk and took the same path to the rocks.'
      } },
    { art: ['pt_lion', 'pt_bull'], who: 'pt_lion', mood: 'wow',
      hi: 'बाघ ने उसके आने की आवाज़ सुनी तो उसे अपने कानों पर यकीन नहीं हुआ। वह उसके सामने आकर रुक गई। उसने कहा, "मैं आ गई हूँ। मैं तैयार हूँ।" और बाघ बहुत, बहुत देर तक उसे देखता रहा।',
      text: 'The tiger heard her coming and did not believe his ears. She stopped in front of him. "I have come," she said. "I am ready." And the tiger looked at her for a long, long time.' },
    { art: ['pt_lion'], who: 'pt_lion',
      hi: 'आखिरकार उसने कहा, "मैंने अपनी पूरी ज़िंदगी इस जंगल में शिकार किया है, और यहाँ कभी किसी से हारा नहीं। आज रात मैं हार गया। घर जाओ।" और वह रास्ते से हट गया और उसे अपने पास से गुज़र जाने दिया।',
      text: '"I have hunted this forest my whole life," he said at last, "and I have never once been beaten in it. Tonight I have. Go home." And he moved out of the path and let her walk past him.' },
    { art: ['pt_bull'], who: 'mithu',
      hi: 'कर्नाटक जो गीत गाता है, उसमें इसके आगे बाघ जो करता है वह और भी अजीब और दुख भरा है, और यही वह हिस्सा है जिसे सुनकर सब चुप हो जाते हैं। किसी ऐसे से कहो जो यह गीत जानता हो, कि वह तुम्हें इसका अंत गाकर सुनाए।',
      text: 'In the song that Karnataka sings, what the tiger does next is stranger and sadder than that, and it is the part that makes people go quiet. Ask somebody who knows the song to sing you the end of it.' }
  ],
  moral: 'A promise you keep when absolutely nobody could make you is the only kind that really counts.',
  source: 'Punyakoti — the Kannada folk ballad "Dharani mandala madhyadolage", sung in Karnataka for generations and learned in schools. Many versions.'
},

{
  id: 'jn.bahubali',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'jain',
  badge: 'katha',
  title: 'The Fist That Stopped',
  hook: 'He had already won. His arm was up in the air. And then he thought of something.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-KA'],
  words_hi: [['मुट्ठी', 'mutthi', 'fist'], ['बेल', 'bel', 'creeper'], ['रुकना', 'rukna', 'to stop']],
  scenes: [
    { art: ['courtier', 'guard'], who: null,
      hi: 'भरत और बाहुबली भाई थे। उनके पिता राजा थे और उन्होंने राजपाट छोड़ दिया था, और अपने बेटों के बीच सब कुछ बाँट दिया था, और कुछ समय तक तो सब ठीक चला। फिर भरत ने फैसला किया कि धरती के हर राज्य को उनके आगे झुकना चाहिए — उनके छोटे भाई के राज्य को भी।',
      text: 'Bharata and Bahubali were brothers. Their father had been a king and had given up being a king, and had divided everything between his sons, and for a while that worked. Then Bharata decided that every kingdom in the land ought to bow to him — including his little brother\'s.' },
    { art: ['guard'], who: 'guard',
      hi: '"बाकी सब झुक चुके हैं," दूतों ने बाहुबली से कहा। "बाकी सब उनके भाई नहीं हैं," बाहुबली बोले। "मैं नहीं झुकूँगा।" और दोनों ने अपनी-अपनी सेनाएँ बुला लीं, और दोनों सेनाएँ मैदान के आमने-सामने एक-दूसरे को देखती खड़ी रहीं।',
      text: '"Everyone else has bowed," the messengers told Bahubali. "Everyone else is not his brother," said Bahubali. "I will not." And both of them called up their armies, and the two armies stood looking at each other across a plain.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'फिर बूढ़े मंत्री दोनों के बीच में आगे आए। "बात जो भी हो," उन्होंने कहा, "यह आप दोनों के बीच की है। हज़ारों लोग, जो आप दोनों से कभी मिले तक नहीं, उन्हें इसके लिए क्यों चोट पहुँचे? इसे आप खुद ही सुलझा लें। तीन मुकाबले। जो जीता, वही जीता।"',
      text: 'Then the old ministers walked out into the space between them. "Whatever this is," they said, "it is between the two of you. Why should thousands of people who have never met either of you be hurt over it? Settle it yourselves. Three contests. Whoever wins, wins."' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'तो सेनाएँ बैठ गईं और देखने लगीं। पहले दोनों ने बिना पलक झपकाए एक-दूसरे को घूरा, और भरत ने पलक झपका दी। फिर वे पानी में लड़े, पानी की बड़ी-बड़ी बौछारें उड़ाते हुए, और भरत पानी में नीचे चले गए। फिर उन्होंने कुश्ती की, और बाहुबली ने अपने बड़े भाई को ज़मीन से पूरा ऊपर उठा लिया।',
      text: 'So the armies sat down and watched. First they stared at each other without blinking, and Bharata blinked. Then they fought in the water, throwing it in great sheets, and Bharata went under. Then they wrestled, and Bahubali lifted his elder brother clean off the ground.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'और बस बात खत्म — जीत हो गई, तीन में से तीन। बाहुबली ने उन्हें नीचे उतारा, और उनका मुक्का लगभग अपने-आप ही ऊपर उठ गया, क्योंकि लड़ाई के अंत में मुक्का यही तो करता है।',
      text: 'And that was it — over, won, three out of three. Bahubali set him down, and his fist came up almost by itself, because that is what a fist does at the end of a fight.',
      ask: {
        q: 'His fist is in the air and his brother is under it. What does Bahubali do?',
        options: ['Open his hand', 'Finish it — he won fairly', 'Take the kingdom and never speak to him again'],
        answer: 0,
        right: 'He opened it. He looked at his own hand and he could not think of one single thing worth doing with it.',
        wrong: 'He opened his hand instead. He looked at it and could not think of one single thing worth doing with it.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"मैं यह क्या कर रहा हूँ?" बाहुबली दोनों सेनाओं के सामने ज़ोर से बोले। "मैंने अपने ही भाई से पूरी दुनिया जीत ली। और मुझे मिला क्या? दुनिया। यह तो हमेशा दुनिया ही रहने वाली थी।"',
      text: '"What am I doing?" said Bahubali, out loud, in front of two armies. "I have won the whole world off my own brother. And what have I got? The world. It was always going to be the world."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उन्होंने भरत को राज्य सौंप दिया। फिर वे मैदान छोड़कर जंगल में चले गए, और वहाँ बिल्कुल शांत खड़े हो गए, और बहुत लंबे समय तक वैसे ही खड़े रहे — कहते हैं कि पूरे एक साल तक बिना हिले-डुले, यहाँ तक कि उनके पैरों के पास बांबियाँ बन गईं, पैरों पर लताएँ चढ़ गईं और उनके बालों में पक्षियों ने घोंसले बना लिए।',
      text: 'He gave the kingdom to Bharata. Then he walked off the field and into the forest, and stood still there, and went on standing still for a very long time — a year, they say, without moving, until anthills rose at his feet and creepers grew up his legs and birds nested in his hair.' },
    { art: ['guard'], who: 'mithu',
      hi: 'कर्नाटक के श्रवणबेलगोला जाइए और आप उन्हें देख सकते हैं: एक ही विशाल चट्टान को तराशकर बनाई गई बाहुबली की मूर्ति, जो पाँच मंज़िला इमारत से भी ऊँची है, सन् 981 में बनकर तैयार हुई, और पैरों पर लिपटी पत्थर की लताओं के साथ बिल्कुल स्थिर खड़ी है।',
      text: 'Go to Shravanabelagola in Karnataka and you can see him: a statue of Bahubali cut out of one enormous rock, taller than a five-storey building, finished in the year 981, standing perfectly still with stone creepers curling up around his legs.' }
  ],
  moral: 'The strongest thing an arm can do is stop.',
  source: 'Jain tradition — the story of Bharata and Bahubali, told in the Jain Puranas. The colossal statue at Shravanabelagola in Karnataka was completed in 981 CE and shows the creepers climbing his legs.'
},

/* ========================================== ANDHRA PRADESH · TELANGANA === */
{
  id: 'wt.tenali-dolls',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'Three Dolls and a Piece of Thread',
  hook: 'Three dolls, exactly the same. One is priceless, one is ordinary, one is worth nothing. Prove it.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['गुड़िया', 'gudiya', 'doll'], ['धागा', 'dhaaga', 'thread'], ['राज़', 'raaz', 'secret']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'दूर देश से एक विद्वान राजा कृष्णदेवराय के दरबार में आया। उसके पास एक मखमली कपड़ा था, एक छोटा डिब्बा था, और अंदाज़ ऐसा था जैसे वह पहले ही मान चुका हो कि इस पूरे कमरे में सबसे अक्लमंद वही है।',
      text: 'A scholar came to the court of Krishnadevaraya from a long way off, with a velvet cloth and a small box, and the manner of a man who has already decided he is the cleverest person in the room.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      hi: 'उसने तीन गुड़ियों से कपड़ा हटाया। एक जैसा नाप, एक जैसी लकड़ी, एक जैसा रंग, एक जैसा चेहरा। "इनमें से एक," उसने कहा, "लाख रुपये की है। एक हज़ार की है। और एक कौड़ी की भी नहीं है। मुझे बताइए कौन-सी कौन-सी है। आपका दरबार बहुत मशहूर है। चलिए, देखते हैं।"',
      text: 'He unwrapped three dolls. Same size, same wood, same paint, same face. "One of these," he said, "is worth a lakh. One is worth a thousand. One is worth nothing whatever. Tell me which is which. Your court is famous. Let us see."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'मंत्रियों ने उन्हें तौला: बिल्कुल बराबर। ठोक-बजाकर देखा: बिल्कुल एक जैसी। दीये की रोशनी में ऊपर उठाया, उलट-पुलट कर देखा और दो दिन तक बहस करते रहे। विद्वान हाथ बाँधे बैठे रहे और खूब मज़ा लेते रहे।',
      text: 'The ministers weighed them: identical. Tapped them: identical. Held them up to the lamp, turned them over, argued for two days. The scholar sat with his hands folded and enjoyed himself enormously.' },
    { art: ['courtier'], who: 'courtier',
      hi: 'तीसरे दिन तेनाली रामकृष्ण देर से टहलते हुए आए, गुड़ियों को बस उतनी ही देर देखा जितनी देर छींक आने में लगती है, और एक पतला सा धागा माँगा।',
      text: 'On the third day Tenali Ramakrishna wandered in late, looked at the dolls for about as long as it takes to sneeze, and asked for a piece of thin thread.',
      ask: {
        q: 'Three identical dolls, and all you have is a piece of thread. Where do you put it?',
        options: ['In the ear', 'Round them, to weigh them against each other', 'In the eye'],
        answer: 0,
        right: 'The ear. Each doll had a tiny hole in it, and the thread found out where each one went.',
        wrong: 'He went for the ear. Each doll had a tiny hole in it, and the thread found out where each one went.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उन्होंने पहली गुड़िया के कान में धागा डाला। वह सीधे दूसरे कान से बाहर निकल आया और वहीं लटक गया। "यह वाली," तेनाली बोले, "आपकी कही हर बात सुनती है और वह सीधे आर-पार निकल जाती है। अंदर कुछ नहीं ठहरता। इसकी कोई कीमत नहीं।"',
      text: 'He fed the thread into the first doll\'s ear. It came straight out of the other ear and hung there. "This one," said Tenali, "hears everything you say and it goes clean through. Nothing stays. Worth nothing."' },
    { art: ['courtier'], who: 'courtier',
      hi: 'उन्होंने दूसरी में धागा डाला। वह मुँह से बाहर निकल आया। "यह आपकी बात सुनती है और तुरंत पूरे मोहल्ले को बता देती है। कीमत एक हज़ार — आप इसका इस्तेमाल कर सकते हैं, पर किसी ऐसी बात के लिए कभी नहीं जो आपके लिए मायने रखती हो।"',
      text: 'He threaded the second. It came out of the mouth. "This one hears what you tell it and immediately tells the whole street. Worth a thousand — you can use it, but never for anything you mind about."' },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      hi: 'उन्होंने तीसरी में धागा डाला। धागा अंदर गया, रुका और वहीं टिक गया। उन्होंने धीरे से खींचा। वह कहीं से बाहर नहीं निकला। "और यह वाली," तेनाली बोले, "जो आप इसे देते हैं, उसे संभालकर रखती है। कीमत एक लाख, और इस दाम पर भी बहुत सस्ती है।"',
      text: 'He threaded the third. The thread went in, and stopped, and stayed. He pulled gently. It did not come out anywhere. "And this one," said Tenali, "keeps what you give it. A lakh, and cheap at the price."' },
    { art: ['guard'], who: null,
      hi: 'विद्वान ने बिना एक शब्द बोले अपना मखमली कपड़ा समेट लिया — और जब किसी चतुर मेहमान को कोई अपनी अक्ल से मात दे देता है, तो वह ऐसी ही आवाज़ करता है।',
      text: 'The scholar folded up his velvet cloth without a word, which is the sound a clever visitor makes when he has been out-thought.' }
  ],
  moral: 'What a person is worth is mostly what they do with the things you tell them.',
  source: 'Tenali Ramakrishna tales, Telugu tradition — Tenali served at the court of Krishnadevaraya of Vijayanagara (reigned 1509–1529). The same puzzle is told of Birbal in the north; good stories travel.'
},

/* ============================================================ BIHAR ======= */
{
  id: 'wt.gonu-brinjal',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'Gonu Jha and the Brinjal',
  hook: 'On Monday the king loved brinjal. On Tuesday he hated it. Gonu Jha agreed with him both times.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['बैंगन', 'baingan', 'brinjal'], ['सवाल', 'sawaal', 'question'], ['हँसी', 'hansi', 'laughter']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'उत्तर बिहार के मिथिला में लोग गोनू झा के किस्से वैसे ही सुनाते हैं जैसे दूसरी जगहों पर बीरबल के — राजा के दरबार का एक ऐसा आदमी, जो देखने में जितना सीधा-सादा लगता था, असल में उतना था नहीं।',
      text: 'In Mithila, in north Bihar, they tell stories about Gonu Jha the way other places tell them about Birbal — a man at the Raja\'s court who was never quite as harmless as he looked.' },
    { art: ['guard', 'courtier'], who: 'guard', mood: 'wow',
      hi: 'एक शाम राजा ने बैंगन की सब्ज़ी खाई और खुशी से चहक उठे। “सब्ज़ियों का राजा!” उन्होंने कहा। “राजाओं जैसा ही बैंगनी! मीठा! मुलायम! हम इसके सिवा कुछ और खाते ही क्यों हैं?”',
      text: 'One evening the Raja ate a dish of brinjal and went off like a firework. "The KING of vegetables!" he said. "Purple as a king should be! Sweet! Soft! Why do we eat anything else?"' },
    { art: ['courtier'], who: 'courtier',
      hi: '“महाराज, यह बात तो आपने किसी भी कवि से बेहतर कही है,” गोनू झा तुरंत बोले। “बैंगन के सिर पर तो ताज होता है। सब्ज़ी तक को पता है कि वह शाही है।”',
      text: '"Maharaj, you have said it better than any poet," said Gonu Jha at once. "The brinjal wears a crown on its head. Even the vegetable knows it is royal."' },
    { art: ['guard'], who: 'guard', mood: 'sad',
      hi: 'अगले मंगलवार राजा ने कुछ ज़्यादा ही बैंगन खा लिया और पूरी रात पेट के हाल पर पछताते रहे। “इसे यहाँ से हटाओ,” वे कराहते हुए बोले। “कड़वी, तेलिया, बेकार चीज़। इसे दोबारा रसोई में कभी मत आने देना।”',
      text: 'The following Tuesday the Raja had eaten rather too much brinjal and had spent the night regretting it in some detail. "Take it away," he groaned. "Bitter, oily, useless thing. Never let it in the kitchen again."' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: '“बिल्कुल सही बात, महाराज,” गोनू झा बोले। “निहायत ही रद्दी सब्ज़ी है। सिर पर जो ताज है, वह भी तो बस काँटे ही हैं।”',
      text: '"Quite right, Maharaj," said Gonu Jha. "A miserable vegetable. Even the crown on its head is only thorns."' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'पूरा दरबार चौकन्ना होकर बैठ गया। एक मंत्री ने सीधे उनकी ओर उँगली उठाई। “पिछले हफ़्ते आपने इसे शाही कहा था! इस हफ़्ते आप इसे काँटे बता रहे हैं! दोनों बातें एक साथ कैसे हो सकती हैं!”',
      text: 'The whole court sat up. A minister pointed straight at him. "Last week you called it royal! This week you call it thorns! You cannot have both!"',
      ask: {
        q: 'The entire court has caught him saying the opposite of what he said. What can Gonu Jha possibly say now?',
        options: ['Admit he got it wrong last week', 'Say he serves the Raja, not the vegetable', 'Blame the cook'],
        answer: 1,
        right: 'That is exactly what he said — and then he said one more thing, which was the part that mattered.',
        wrong: 'He said something quicker: "I am the Raja\'s servant, not the brinjal\'s." And then he said one more thing.'
      } },
    { art: ['courtier', 'guard'], who: 'courtier', mood: 'wow',
      hi: '"महाराज," गोनू झा ने कहा, "मैं आपका सेवक हूँ। मैं बैंगन का सेवक नहीं हूँ। वह मुझे कुछ नहीं देता।" पूरा दरबार ठहाकों से गूँज उठा। राजा इतना हँसे कि आँखों में आँसू आ गए — और फिर अचानक रुक गए, क्योंकि बात कुछ उल्टी पड़ गई थी।',
      text: '"Maharaj," said Gonu Jha, "I am your servant. I am not the brinjal\'s servant. It does not pay me anything." The court roared. The Raja laughed until his eyes watered — and then stopped, because something had gone in sideways.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"लेकिन फिर," राजा ने धीरे से कहा, "मुझे कभी कैसे पता चलेगा कि तुम सच में क्या सोचते हो?" "बड़ी आसानी से, महाराज," गोनू झा ने कहा। "मुझे जवाब बताने से पहले मुझसे पूछिए।"',
      text: '"But then," said the Raja slowly, "how will I ever find out what you actually think?" "Easily, Maharaj," said Gonu Jha. "Ask me before you tell me the answer."' }
  ],
  moral: 'If you announce your answer first, you will spend your whole life hearing it come back.',
  source: 'Gonu Jha tales — the trickster of Mithila, told in Maithili across north Bihar. Many versions.'
},

{
  id: 'jt.quails-net',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'jataka',
  badge: 'katha',
  title: 'The Quails Who Flew Off With the Net',
  hook: 'A hunter, a net, and a hundred small birds who had one thing the hunter did not.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_heron', 'courtier'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['जाल', 'jaal', 'net'], ['मिलकर', 'milkar', 'together'], ['झगड़ा', 'jhagda', 'quarrel']],
  scenes: [
    { art: ['pt_crow'], who: null,
      hi: 'एक खेत में सौ बटेरें रहती थीं। एक बहेलिया रोज़ भोर में आता, बटेर की तरह तब तक सीटी बजाता जब तक कि वे उसके पास न आ जाएँ, और उन सब पर अपना जाल फेंक देता। इससे उसका तो बड़ा फ़ायदा होता था। बटेरों का नहीं।',
      text: 'A hundred quails lived in a field, and a fowler used to come at dawn, whistle like a quail until they came to him, and throw his net over the lot of them. He did very well out of it. The quails did not.' },
    { art: ['pt_crow', 'pt_heron'], who: 'pt_crow', mood: 'think',
      hi: 'उनके सरदार ने लंबी घास में एक सभा बुलाई। "वह अकेला आदमी है," उसने कहा। "हम सौ पंछी हैं। उस जाल में सौ छेद हैं और तुम सबके पास एक-एक सिर है।"',
      text: 'Their leader called a meeting in the long grass. "He is one man," he said. "We are a hundred birds. There are a hundred holes in that net and each of you has a head."',
      ask: {
        q: 'The net is falling and every bird can see it coming. What is the plan?',
        options: ['Everybody scatter in a different direction', 'Everybody put their head through a hole and lift together', 'Sit absolutely still and hope'],
        answer: 1,
        right: 'That was the plan. One hundred heads, one hundred holes, and everybody flapping at once.',
        wrong: 'The plan was better than that. Every head through a hole, and every wing beating at the same moment.'
      } },
    { art: ['pt_crow', 'pt_heron'], who: null, mood: 'wow',
      hi: 'अगली सुबह जाल नीचे गिरा — और सीधे वापस ऊपर उठ गया। सौ बटेरें उसे बाड़ के ऊपर से, तालाब के ऊपर से उड़ा ले गईं, और सलीके से एक काँटेदार झाड़ी पर गिरा दिया, और नीचे से फिसलकर नाश्ते के लिए अपने घर चली गईं।',
      text: 'The next morning the net came down — and went straight back up again. A hundred quails carried it over the hedge, over the pond, and dropped it neatly onto a thorn bush, and slipped out from underneath and went home to breakfast.' },
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      hi: 'अगले दिन भी ऐसा ही हुआ। और उसके अगले दिन भी। बहेलिए की सुबहें काँटेदार झाड़ियों तक जाने और अपना जाल सुलझाने में बीतने लगीं, और इस बारे में उसकी पत्नी की भी अपनी राय थी, जो उसने उसे अच्छी-खासी तफ़सील से सुनाई।',
      text: 'It happened again the next day. And the next. The fowler spent his mornings walking to thorn bushes and untangling his own net, and his wife had opinions about it that she shared at some length.' },
    { art: ['pt_heron', 'pt_crow'], who: 'pt_heron', mood: 'wow',
      hi: 'फिर एक सुबह, खेत में उतरते समय, एक बटेर का पंख दूसरी के सिर से टकरा गया। "तुमने यह जानबूझकर किया।" "मैंने नहीं किया।" "तुम हमेशा बहुत ज़ोर से पंख फड़फड़ाते हो।" "तुम हमेशा बहुत देर से फड़फड़ाते हो।" और पूरा खेत ज़ोर-शोर से किसी न किसी की तरफ़ हो गया।',
      text: 'Then one morning, landing in the field, one quail\'s wing clipped another\'s head. "You did that on purpose." "I did not." "You always flap too hard." "You always flap too LATE." And the whole field took a side, loudly.' },
    { art: ['courtier'], who: null,
      hi: 'बहेलिया भोर में आया और उसने सीटी बजाई, और जाल नीचे गिरा। "उठाओ!" सरदार चिल्लाया। और आधा खेत चिल्लाया "तुम उठाओ!" और बाकी आधा चिल्लाया "नहीं, तुम उठाओ!" — और जाल एक इंच भी नहीं हिला।',
      text: 'The fowler came at dawn and whistled, and the net came down. "LIFT!" shouted the leader. And half the field shouted "You lift!" and the other half shouted "No, YOU lift!" — and the net did not move so much as an inch.' },
    { art: ['pt_crow'], who: null, mood: 'sad',
      hi: 'मुखिया ने यह खतरा तीन दिन पहले ही भाँप लिया था, और जो पक्षी अब भी उनकी बात सुनते थे, उन्हें वे पहले ही किसी दूसरे खेत में ले गए थे। बाद में वे हमेशा यही कहते थे कि उन्हें जाल ने नहीं हराया था।',
      text: 'The leader had seen it coming three days earlier, and had already taken the birds who would still listen to him to a different field. He always said afterwards that it was not the net that beat them.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'कहा जाता है कि बुद्ध ने यह बात अपने ही उन शिष्यों को बताई थी, जो पूरी सुबह आपस में बहस करते रहे थे। उन्होंने उन्हें डाँटा नहीं। उन्होंने बस उन्हें बटेरों की बात बताई, और फिर टहलने चले गए।',
      text: 'The Buddha is said to have told this one to a group of his own students who had been arguing all morning. He did not tell them off. He just told them about the quails, and then he went for a walk.' }
  ],
  moral: 'A hundred birds together can carry a net. Two birds arguing cannot lift a feather.',
  source: 'Sammodamana Jataka — from the Jataka collection in Pali, the stories of the Buddha\'s earlier lives.'
},

{
  id: 'jn.chandkaushik',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'jain',
  badge: 'katha',
  title: 'The Snake Everybody Ran From',
  hook: 'There was a short path through the forest that nobody had walked for years. A man in no hurry walked straight down it.',
  hero: 'mahavira',
  cast: ['mahavira', 'courtier'],
  minutes: 4,
  place: ['IN-BR'],
  words_hi: [['साँप', 'saanp', 'snake'], ['गुस्सा', 'gussa', 'anger'], ['दूध', 'doodh', 'milk']],
  scenes: [
    { art: ['courtier'], who: 'courtier', mood: 'sad',
      hi: 'पेड़ों के किनारे गाँव वालों ने उन्हें जा पकड़ा, सब एक साथ बोलने लगे, "उस रास्ते से नहीं। उस रास्ते पर एक विषैला साँप रहता है — चंडकौशिक। उसके पेड़ के चारों तरफ़ की घास देखिए, वह जली हुई है। घूमकर चले जाइए। बस एक दिन ज़्यादा लगेगा।"',
      text: 'The villagers caught up with him at the edge of the trees, all talking at once. "Not that way. There is a serpent on that path — Chandkaushik. Look at the grass round his tree, it is burnt. Go round. It is only one day longer."' },
    { art: ['mahavira'], who: 'mahavira',
      hi: '"धन्यवाद," महावीर ने कहा। "जो ग़ुस्से में हो, उसके लिए एक दिन भी बहुत लंबा समय होता है।" और वे अंदर चले गए।',
      text: '"Thank you," said Mahavira. "One day is a long time to somebody who is angry." And he walked in.' },
    { art: ['mahavira'], who: null,
      hi: 'रास्ता सुनसान और बहुत शांत था। न कोई पक्षी। न कोई कीड़ा-मकोड़ा। वे तब तक चलते रहे जब तक उस पेड़ तक नहीं पहुँच गए जिसके बारे में गाँव वालों ने बताया था, और फिर वे रुक गए, सीधे खड़े हो गए, अपनी आँखें मूँद लीं, और बिल्कुल भी नहीं हिले।',
      text: 'The path was empty and very quiet. No birds. No insects. He walked until he came to the tree the villagers had described, and then he stopped, and stood, and closed his eyes, and did not move at all.' },
    { art: ['mahavira'], who: null, mood: 'wow',
      hi: 'चंडकौशिक तेज़ी से बाहर निकला। उसने अपनी पूरी ज़िंदगी लोगों की चीखें सुनते, डंडों की मार खाते और लोगों को खुद से भागते देखकर बिताई थी — और हर बार इससे उसका ग़ुस्सा और बढ़ता गया, यहाँ तक कि उसके भीतर ग़ुस्से के सिवा लगभग कुछ बचा ही नहीं था। उसने उस पुरुष के पैर पर डंक मारा।',
      text: 'Chandkaushik came out fast. He had spent his whole life being screamed at, hit with sticks, run from — and every single time it had made him angrier, until anger was more or less all there was left of him. He struck at the man\'s foot.',
      ask: {
        q: 'The snake has bitten him and is waiting for him to fall over and scream. What does Mahavira do?',
        options: ['Step back out of range', 'Nothing at all — stay exactly where he is', 'Speak sternly to him'],
        answer: 1,
        right: 'Nothing. He stood there. And that was the one thing that had never happened to Chandkaushik before.',
        wrong: 'He did nothing whatsoever. He stood there — and that was the one thing that had never happened to Chandkaushik before.'
      } },
    { art: ['mahavira'], who: null, mood: 'wow',
      hi: 'सांप ने फिर डसा। और फिर वह रुक गया, क्योंकि कुछ गड़बड़ थी। वह आदमी गिरा नहीं था। वह आदमी चीखा नहीं था। और उसके पैर के निशान से जो बह रहा था, वह लाल नहीं था। वह दूध जैसा सफ़ेद था।',
      text: 'The snake struck again. And then he stopped, because something was wrong. The man had not fallen. The man had not shouted. And what was running from the mark on his foot was not red. It was white as milk.' },
    { art: ['mahavira'], who: 'mahavira',
      hi: 'महावीर ने अपनी आँखें खोलीं और नीचे उसकी तरफ़ देखा, और बड़ी शांति से बस इतना कहा: "समझो, चंडकौशिक। समझो।"',
      text: 'Mahavira opened his eyes and looked down at him, and said only this, quite quietly: "Understand, Chandkaushik. Understand."' },
    { art: ['mahavira', 'courtier'], who: null,
      hi: 'कहानी कहती है कि सांप बड़ी देर तक एकदम शांत पड़ा रहा, फिर वापस अपने पेड़ के नीचे चला गया, और उसने फिर कभी किसी पर हमला नहीं किया। गाँव वाले देखने बाहर निकले, पहले डरते-डरते, फिर बिना किसी डर के, और कुछ ही समय बाद बच्चे स्कूल जाने के लिए उसी छोटे रास्ते का इस्तेमाल करने लगे।',
      text: 'The story says the snake lay very still for a long time, and then went back under his tree, and never struck at anything again. The villagers came out to look, cautiously, then less cautiously, and after a while children were using the short path to school.' },
    { art: ['mahavira'], who: 'mithu',
      hi: 'यह उन कहानियों में से एक है जो जैन परिवार तब सुनाते हैं जब वे अहिंसा की बात करते हैं — यानी किसी को चोट न पहुँचाना। यह असल में उस सांप के बारे में नहीं है। यह इस बारे में है कि बस शांत खड़े रहने से क्या हो सकता है।',
      text: 'This is one of the stories Jain families tell when they talk about ahimsa — not hurting. It is not really about the snake. It is about what standing still can do.' }
  ],
  moral: 'Anger has been shouted at all its life. It has almost never been stood still in front of.',
  source: 'Jain tradition — the story of Chandkaushik, from Shvetambara accounts of Mahavira\'s years of wandering. Many versions.'
},

/* ========================================================== KASHMIR ======= */
{
  id: 'wt.kashmir-carry',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'Shall I Carry You, or Will You Carry Me?',
  hook: 'A farmer asked the king three questions on the road home. The king could not answer one of them. A girl answered all three.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 5,
  place: ['IN-JK'],
  words_hi: [['रास्ता', 'raasta', 'road'], ['कहानी', 'kahani', 'story'], ['पहेली', 'paheli', 'riddle']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'कश्मीर के एक राजा को साधारण कपड़ों में अपने राज्य में घूमना पसंद था, क्योंकि साधारण कपड़ों में राजा को वे बातें पता चल जाती हैं जो मुकुट पहने राजा को कभी नहीं पता चलतीं। एक लंबी दोपहर, वे नगर की ओर जा रही उसी सड़क पर एक किसान के साथ-साथ चलने लगे।',
      text: 'A king of Kashmir liked to walk about his country in ordinary clothes, because a king in ordinary clothes finds out things a king in a crown never will. One long afternoon he fell into step with a farmer going the same way along the road to the town.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: 'वे लगभग एक मील चुपचाप चल चुके थे, तभी किसान ने कहा: "मैं आपको उठाऊँ, या आप मुझे उठाएँगे?"',
      text: 'They had walked about a mile in silence when the farmer said: "Shall I carry you, or will you carry me?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: 'राजा ने उसे देखा। किसान एक छोटा-सा आदमी था जिसके पास एक गठरी थी। राजा एक भारी-भरकम आदमी थे और उनके हाथ में कुछ नहीं था। "मुझे उठाओगे?" उन्होंने कहा। "हम दोनों भले-चंगे हैं। हम दोनों चल रहे हैं। यह कैसा सवाल है?" किसान कुछ नहीं बोला और आगे चलता रहा।',
      text: 'The king looked at him. The farmer was a small man carrying a bundle. The king was a large man carrying nothing. "Carry me?" he said. "We are both perfectly well. We are both walking. What sort of a question is that?" The farmer said nothing and walked on.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'आगे चलकर वे पके हुए गेहूँ के एक खेत के पास से गुज़रे, जो ऊँचा और सुनहरा खड़ा था और उसमें कोई नहीं था। "क्या वह खेत खाया जा चुका है," किसान ने पूछा, "या नहीं?" "खाया हुआ?" राजा ने कहा। "वह तो तुम्हारे ठीक सामने खड़ा है। उसे किसी ने छुआ तक नहीं है।" किसान कुछ नहीं बोला और आगे चलता रहा।',
      text: 'Further along they passed a field of ripe wheat, standing tall and gold with nobody in it. "Is that field eaten," asked the farmer, "or not?" "Eaten?" said the king. "It is standing right there in front of you. Nothing has touched it." The farmer said nothing and walked on.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'शहर के छोर पर वे एक शवयात्रा के पास से गुज़रे। "वह आदमी ज़िंदा है," किसान ने पूछा, "या मर चुका है?" राजा तंग आ चुके थे। "साफ़ दिख तो रहा है कि वह मर चुका है।" चौराहे पर किसान रुका और बड़े प्यार से बोला, "आप ज्ञानी तो हैं, पर आपको कुछ भी नहीं पता," और अपने घर की ओर मुड़ गया।',
      text: 'At the edge of the town they passed a funeral. "Is that man alive," asked the farmer, "or dead?" The king had had enough. "You can see he is dead." At the crossroads the farmer stopped and said, quite kindly, "You are a learned man. But you do not know anything," and turned for home.',
      ask: {
        q: '"Shall I carry you, or will you carry me?" They were both walking. What could he possibly have meant?',
        options: ['He wanted a piggyback', 'He meant: tell me a story, and the road carries us both', 'He was testing how strong the king was'],
        answer: 1,
        right: 'That is it exactly. Whoever tells the story does the carrying — and the miles go by underneath.',
        wrong: 'He meant something better. Whoever tells the story does the carrying — the road goes by underneath and neither of you notices.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'घर पहुँचकर किसान ने अपनी बेटी को रास्ते में मिले उस अजीब, अच्छे कपड़े पहने आदमी के बारे में बताया, तो उसने अपना काम एक तरफ़ रख दिया और हँस पड़ी। "अब्बा! उन्हें तो कुछ भी समझ नहीं आया, है ना?"',
      text: 'At home the farmer told his daughter about the odd, well-dressed man on the road, and she put down what she was doing and laughed. "Abba. He did not understand any of it, did he?"' },
    { art: ['courtier'], who: 'courtier',
      hi: 'वह बोली, ""मुझे उठाकर चलो" का मतलब है कि कोई कहानी सुनाओ ताकि रास्ता छोटा लगे। "क्या खेत खाया जा चुका है?" का मतलब है: क्या किसान ने उस फ़सल के बदले पहले ही कर्ज़ ले लिया है — क्योंकि अगर ले लिया है, तो फ़सल खेत में खड़ी हो या न हो, वह तो खाई जा चुकी। "क्या आदमी ज़िंदा है?" का मतलब है: क्या वह अपने पीछे ऐसे बच्चे छोड़ गया है जो उसे याद रखेंगे — क्योंकि अगर छोड़ गया है, तो वह पूरी तरह से गया नहीं है।"',
      text: '"Carry me" means tell me a story to shorten the road, she said. "Is the field eaten?" means: has the farmer already borrowed money against that crop — because if he has, then it is eaten, standing there or not. "Is the man alive?" means: has he left children who will remember him — because if he has, then he is not entirely gone.' },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'राजा, जो सच जाने बिना रह नहीं पा रहे थे और दूर-दूर पीछे चले आए थे, तब तक दरवाज़े पर आकर खड़े हो चुके थे। वे उन तीनों बातों के बारे में सोचते हुए घर लौटे, और इस बात पर भी कि उस दिन जिस सबसे होशियार इंसान से वे मिले थे, वह किसान के घर में बैठी कपड़े धो रही थी।',
      text: 'The king, who had followed at a distance because he could not bear not knowing, was standing in the doorway by then. He went home thinking about all three of them, and about the fact that the cleverest person he had met that day had been sitting in a farmhouse doing the washing.' }
  ],
  moral: 'A long road and a hard question are the same thing: somebody has to start talking.',
  source: 'Folk Tales of Kashmir, collected by J. Hinton Knowles, 1888 — from the tale "Why the Fish Laughed".'
},

/* ===================================================== CHHATTISGARH ======= */
{
  id: 'fk.lingo-song',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh',
  badge: 'katha',
  title: 'Lingo and the First Song',
  hook: 'The forest had every sound in it except one. Somebody had to go and invent music.',
  hero: 'courtier',
  cast: ['courtier', 'pt_deer', 'pt_crow'],
  minutes: 4,
  place: ['IN-CT'],
  words_hi: [['संगीत', 'sangeet', 'music'], ['गीत', 'geet', 'song'], ['जंगल', 'jangal', 'forest']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मध्य भारत के गोंड लोग — यानी छत्तीसगढ़ और मध्य प्रदेश के जंगलों और पहाड़ियों के लोग — लिंगो की कहानी सुनाते हैं, जो सबसे पहले आए और उन्होंने बाकी सबके लिए रास्ते निकाले। गाने वाले कहते हैं कि गोंडों के पास आज जो ज़्यादातर चीज़ें हैं, लिंगो ही जाकर उन्हें लाए थे।',
      text: 'The Gond people of central India — the forests and hills of Chhattisgarh and Madhya Pradesh — tell of Lingo, who came first and worked things out for everybody else. Most of what the Gonds have, the singers say, Lingo went and fetched.' },
    { art: ['courtier'], who: 'courtier', mood: 'think',
      hi: 'एक शाम लिंगो बैठकर जंगल को सुनने लगे, और उन्हें उसमें होने वाली हर चीज़ सुनाई दे रही थी। पत्थरों के ऊपर से बहता पानी। आपस में टकराते बाँस। मधुमक्खियाँ। घाटी के दूर वाले छोर से शुरू होकर उनकी तरफ़ आती बारिश। "यह सब तो बस आवाज़ें हैं," उन्होंने कहा। "इनमें से कोई भी गीत नहीं है। गीत तो ऐसा होना चाहिए जो लौटकर वापस आ सके।"',
      text: 'One evening Lingo sat and listened to the forest, and he could hear everything in it. Water over stones. Bamboo knocking. Bees. Rain starting at the far end of the valley and coming towards him. "All of that is sound," he said. "None of it is a song. A song has to be able to come back."' },
    { art: ['pt_crow', 'courtier'], who: null,
      hi: 'उन्होंने सीटी बजाने की कोशिश की, पर वह हवा में उड़ गई। उन्होंने दो लकड़ियों को आपस में बजाकर देखा, आवाज़ तो अच्छी थी पर वह गीत नहीं था। उन्होंने चिड़ियों से वही दोबारा गाने को कहा, और चिड़ियों ने बड़ी समझदारी से समझाया कि वे कभी भी कोई चीज़ दो बार एक ही तरह से नहीं करतीं।',
      text: 'He tried whistling and it blew away. He tried banging two sticks, which is a good noise but not a song. He tried getting the birds to do it again, and the birds pointed out, reasonably, that they never do anything the same way twice.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'इसलिए उनके पास जो कुछ था, वे वही लेकर बैठ गए: एक सूखी खाली लौकी, लकड़ी का एक टुकड़ा, और डोरी की तरह बटे हुए कुछ रेशे।',
      text: 'So he sat with what he had: a dry gourd with nothing in it, a length of wood, and some fibre twisted into cord.',
      ask: {
        q: 'A dry gourd, a stick and some cord. How do you make a sound that stays?',
        options: ['Bang the gourd like a drum', 'Stretch the cord across it and pull', 'Blow into the end of the gourd'],
        answer: 1,
        right: 'Yes. Cut a hole in the gourd, tie the cord tight across it, and pull — and the gourd gives you back a note.',
        wrong: 'He found something better. He cut a hole in the gourd, tied the cord tight across it, pulled — and the gourd gave the note back to him.'
      } },
    { art: ['courtier', 'pt_deer'], who: null, mood: 'wow',
      hi: 'वह सुर घाटी के पार गया और दूर पहाड़ी से टकराकर वापस लौट आया। लिंगो ने तार को दूसरी बार छेड़ा यह देखने के लिए कि क्या वह दोबारा ऐसा करेगा। उसने वैसा ही किया। वे आधी रात तक वहीं बैठे यह पता लगाते रहे कि वह और क्या-क्या कर सकता है।',
      text: 'The note went out across the valley and came home again off the far hill. Lingo pulled the string a second time to see whether it would do it twice. It did. He sat there half the night finding out what else it would do.' },
    { art: ['pt_deer', 'courtier'], who: null,
      hi: 'सुबह होते-होते मैदान के किनारे हिरन आकर खड़े हो गए थे — जो हिरन कभी नहीं करते — और पूरा गाँव सुनने के लिए बाहर निकल आया था, और किसी ने बिना ध्यान दिए पैर थिरकाना शुरू कर दिया था — और बहुत-सी कहानियों में तो नाचने की शुरुआत ऐसे ही हुई थी।',
      text: 'By morning there were deer standing at the edge of the clearing, which deer do not do, and the whole village had come out to listen, and somebody had started tapping their foot without noticing they were doing it — which is how dancing got started, in a fair number of stories.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"अब इसे पकड़ो," लिंगो ने कहा, और उसे किसी और को थमा दिया। यही सबसे ज़रूरी बात है। उन्होंने उसे अपने पास नहीं रखा।',
      text: '"Now hold this," said Lingo, and gave it to somebody else. That is the important part. He did not keep it.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'परधान गोंड गायक आज भी \'बाना\' नाम का तीन तारों वाला बाजा लेकर चलते हैं, और आज भी उसके साथ पुराने गीत गाते हैं। गोंड चित्रकार इन गीतों को दीवारों पर भी उतारते हैं — वही गोंड कला, जिसमें हर जानवर के अंदर बारीक लकीरें और बिंदियाँ होती हैं, जो शायद आपने कभी देखी हो।',
      text: 'The Pardhan Gond singers still carry a three-stringed fiddle called the bana, and they still sing the old songs with it. Gond painters put the songs on the wall too — that is the Gond art with the tiny lines and dots inside every animal, which you may have seen.' }
  ],
  moral: 'Music was not found lying about the place. Somebody sat down and made it, and then handed it on.',
  source: 'The Gond tradition of Lingo, culture hero of the Gonds of central India, sung by Pardhan Gond singers with the bana fiddle. Many versions.'
},

/* =================================================== MADHYA PRADESH ======= */
{
  id: 'wt.vetala-tree',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'chatur',
  badge: 'katha',
  title: 'The Thing in the Tree',
  hook: 'Carry me to the far end of the wood without saying one single word. Easy, said the king. It was not.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-MP'],
  words_hi: [['पेड़', 'ped', 'tree'], ['चुप', 'chup', 'quiet'], ['सवाल', 'sawaal', 'question']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'उज्जैन के राजा विक्रमादित्य ने एक साधु को एक वचन दिया था, और वे जैसे राजा थे, उन्होंने पहले ज़्यादा सवाल नहीं पूछे थे। वचन यह था: अमावस्या की रात जंगल के छोर पर खड़े पुराने पेड़ के पास जाना, और उस पर लटके वेताल को लेकर लौटना।',
      text: 'King Vikramaditya of Ujjain had promised something to a monk, and being the sort of king he was, he had not asked enough questions first. The promise was this: go to the old tree at the edge of the wood on a night with no moon, and bring back the vetala that hangs in it.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'वेताल एक ऐसा प्रेत होता है जो किसी चीज़ में घुस जाए तो बाहर निकलने का नाम नहीं लेता, और यह वाला किसी विशाल सिमटे हुए चमगादड़ की तरह डालियों से उल्टा लटका हुआ था, और सालों से वहाँ मजे से रह रहा था।',
      text: 'A vetala is a spirit that gets into things and will not get out of them, and this one hung upside down in the branches like an enormous folded bat, and had been enjoying itself there for years.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"तो फिर उतार लीजिए मुझे नीचे," बेताल ने चहकते हुए कहा। "मैं तो खुद आपकी पीठ पर चढ़ जाऊँगा। बस एक नियम है। आप कुछ बोलेंगे नहीं। रास्ते में एक शब्द भी मुँह से निकाला, और मैं फुर्र से उड़कर अपने पेड़ पर वापस जा बैठूँगा, और आपको फिर से शुरुआत करनी पड़ेगी।" विक्रम, जो कम बोलने वाले इंसान थे, उन्हें लगा कि यह तो बेहद आसान काम है।',
      text: '"Take me down then," said the vetala cheerfully. "I shall even climb on your back. One rule. You may not speak. Say one word on the way and I fly straight back to my tree and you can start again." Vikram, who was a man of few words, thought this sounded extremely easy.' },
    { art: ['guard'], who: null,
      hi: 'पर यह काम बेहद आसान नहीं था। क्योंकि बेताल पूरे रास्ते बोलता ही रहा, और उसकी बातों में कहानियाँ थीं — और हर एक कहानी के अंत में एक फँसाने वाला सवाल आ खड़ा होता था। गलती किसकी थी? सबसे बहादुर कौन था? इनाम का असली हकदार कौन था?',
      text: 'It was not extremely easy. Because the vetala talked all the way, and what it talked about were stories — and every single story stopped at the end with a question that had a hook in it. Whose fault was it? Who was the bravest? Who had really earned the reward?' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'और विक्रम को जवाब मालूम होता था। वे राजा होने के साथ-साथ न्याय करने वाले भी थे, और उन्होंने अपनी पूरी ज़िंदगी दो लोगों को एक ही बात दो अलग-अलग तरीकों से कहते हुए सुना था। वे अपने सामने किसी गलत बात को यूँ ही अनसुना नहीं छोड़ सकते थे।',
      text: 'And Vikram knew. He was a judge as well as a king, and he had spent his whole life listening to two people tell him the same story two different ways, and he could not hear an unfair thing said out loud and let it stand.',
      ask: {
        q: 'He knows the answer. Saying it costs him the entire night\'s walk. What does the king do?',
        options: ['Keep his mouth shut and win', 'Answer, because he knows', 'Whisper it too quietly to be heard'],
        answer: 1,
        right: 'He answered. And whoosh — off went the vetala, back up the tree, laughing all the way. Twenty-four times.',
        wrong: 'He could not do it. He answered — and off went the vetala, back up into the tree, laughing. Twenty-four times.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'चौबीस बार विक्रम वापस पेड़ तक चलकर गए। चौबीस बार वे उस पर चढ़े, उस बला को नीचे उतारा, उसे अपनी पीठ पर लादा और चल पड़े। उन्होंने एक बार भी नहीं कहा: यह नामुमकिन है। उन्होंने एक बार भी नहीं कहा: अपनी कहानियाँ अपने पास ही रखो।',
      text: 'Twenty-four times Vikram walked back to the tree. Twenty-four times he climbed it, took the thing down, put it on his back and set off. He never once said: this is impossible. He never once said: keep your stories to yourself.' },
    { art: ['guard'], who: null,
      hi: 'पचीसवीं रात को बेताल ने आखिरी कहानी सुनाई, और आखिरी सवाल पूछा — और विक्रम ने अपना मुँह खोला, फिर बंद कर लिया, और आगे चलते रहे। उन्हें सचमुच इसका जवाब नहीं पता था। यही एकमात्र खामोशी थी जो बेताल उनसे हासिल कर पाया था, और वह एकदम सच्ची थी।',
      text: 'On the twenty-fifth night the vetala told the last story, and asked the last question — and Vikram opened his mouth, and shut it again, and walked on. He genuinely did not know the answer. It was the only silence the vetala had ever got out of him, and it was an honest one.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: '"अरे वाह," जैसे-जैसे पेड़ छँटने लगे, बेताल ने उनकी पीठ पर आराम से लटकते हुए कहा। "आप पहले इंसान हैं जिसे मैं न तो थका पाया, न चिढ़ा पाया, और न ही चकमा दे पाया। अब चूँकि हम पहुँचने ही वाले हैं — तो मैं आपको एक और बात बताता हूँ, और यह कोई पहेली नहीं है। यह आपके उस साधु के बारे में है।"',
      text: '"Well," said the vetala, hanging comfortably on his back as the trees thinned out. "You are the first person I have not been able to bore, annoy or trick. Since we are nearly there — let me tell you one more thing, and this one is not a riddle. It is about that monk of yours."' },
    { art: ['guard'], who: 'mithu',
      hi: 'ऐसी कुल पच्चीस कहानियाँ हैं, और हर एक, कहानी के अंदर एक कहानी है। बड़े लोग हज़ार सालों से इनके जवाबों पर बहस करते आ रहे हैं, और बेताल भी तो ठीक यही चाहता था।',
      text: 'There are twenty-five of these, and each one is a story inside the story. Grown-ups have been arguing about the answers for a thousand years, which is exactly what the vetala wanted.' }
  ],
  moral: 'Not being able to keep quiet about what is right is a fault. It is also the best thing about him.',
  source: 'Vetala Panchavimshati — the twenty-five tales of the vetala, told of King Vikramaditya of Ujjain. The frame and the tales are included in Somadeva\'s Kathasaritsagara, written in Kashmir in the 11th century.'
},

/* ==================================================== UTTAR PRADESH ======= */
{
  id: 'jt.banyan-deer',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'jataka',
  badge: 'katha',
  title: 'The Deer Who Would Not Send Anyone Else',
  hook: 'The king hunted every morning, so the deer made an arrangement. Then one day the lot fell on a mother.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'courtier', 'guard'],
  minutes: 5,
  place: ['IN-UP'],
  words_hi: [['हिरण', 'hiran', 'deer'], ['राजा', 'raja', 'king'], ['जान', 'jaan', 'life']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'बनारस के राजा रोज़ सुबह अपने बाग़ में घोड़ों, नगाड़ों और सौ आदमियों के साथ हिरणों का शिकार करते थे। हिरणों के झुंड तब तक भागते जब तक गिर न पड़ते। रसोई की ज़रूरत से कहीं ज़्यादा हिरण तो भागमभाग में घायल हो जाते थे, और वह बाग़ रहने के लिए एक दुखभरी जगह बनता जा रहा था।',
      text: 'The king of Benares hunted deer in his park every single morning, with horses and drums and a hundred men. The herds ran until they dropped. Far more deer were hurt in the running than were ever needed in the kitchen, and the park was becoming a miserable place to live.' },
    { art: ['pt_deer'], who: 'pt_deer',
      hi: 'वहाँ दो झुंड थे और दो मुखिया थे। एक था निग्रोध, बरगदी हिरण, जिसका रंग सोने जैसा था। "यह सब ऐसे नहीं चल सकता," उसने कहा। "चलो राजा के पास चलते हैं और उनके सामने एक सौदा रखते हैं।"',
      text: 'There were two herds and two leaders. One was Nigrodha, the Banyan Deer, whose coat was the colour of gold. "This cannot go on," he said. "Let us go to the king and offer him a bargain."' },
    { art: ['pt_deer', 'guard'], who: null,
      hi: 'सौदा यह था: न कोई शिकार, न कोई भागमभाग, न टाँगों का टूटना। हर सुबह एक हिरण के नाम की पर्ची निकलेगी और वह खुद चलकर रसोई तक जाएगा। राजा को यह इंतज़ाम बहुत समझदारी भरा लगा और वे तुरंत मान गए।',
      text: 'The bargain was this: no more hunts, no more running, no more broken legs. Each morning one deer would draw the short lot and walk to the kitchen on its own. The king thought it a very sensible arrangement and agreed at once.' },
    { art: ['pt_deer'], who: null, mood: 'sad',
      hi: 'और लंबे समय तक रोज़ एक-एक करके ऐसा ही चलता रहा। फिर एक सुबह दूसरे झुंड की एक ऐसी हिरणी के नाम की पर्ची निकली, जो उसी हफ़्ते बच्चे को जन्म देने वाली थी। वह अपने मुखिया के पास गई और पूछा कि क्या उसकी बारी बच्चे के जन्म के बाद आ सकती है। उसने कहा कि पर्ची तो पर्ची होती है, और अपना मुँह फेर लिया।',
      text: 'And so it went, one a day, for a long time. Until one morning the lot fell on a doe of the other herd, who was going to have her fawn within the week. She went to her own leader and asked whether her turn might come after the birth. He said the lot was the lot, and turned away.' },
    { art: ['pt_deer'], who: 'pt_deer', mood: 'think',
      hi: 'इसलिए वह दूसरे झुंड के सुनहरे हिरण के पास गई, उसके सामने जाकर खड़ी हो गई, और उससे कहा कि वह उसकी जगह किसी और को भेज दे।',
      text: 'So she went and found the golden deer of the other herd, and stood in front of him, and asked him to send somebody in her place.',
      ask: {
        q: 'She is asking him to order some other deer to go instead of her. What does the Banyan Deer do?',
        options: ['Draw a new lot — that is fair', 'Refuse: a rule is a rule', 'Go himself'],
        answer: 2,
        right: 'He went himself. He could not think of one animal in that park he had the right to send.',
        wrong: 'He did the one thing nobody expected. He walked to the kitchen himself.'
      } },
    { art: ['guard', 'pt_deer'], who: 'guard', mood: 'wow',
      hi: 'रसोइया अपनी छुरी लेकर बाहर आया और उसके हाथ से छुरी छूट गई, और वह राजा को बुलाने के लिए दौड़ा। राजा खुद भी भागता हुआ आया और उसने देखा कि सुनहरा हिरण वध-शिला पर सिर रखे चुपचाप खड़ा था। "इस बाग में तुम अकेले ऐसे हिरण हो जिसे मैंने कभी न छूने का वचन दिया था। तुम यहाँ क्यों आए हो?"',
      text: 'The cook came out with his knife and dropped it, and ran for the king. The king came at a run himself and found the golden deer standing quietly with his head on the block. "You are the one deer in this park I promised never to touch. Why are you here?"' },
    { art: ['pt_deer', 'guard'], who: 'pt_deer',
      hi: '"क्योंकि पर्ची एक माँ के नाम निकली थी," निग्रोध ने कहा। "और मुझे लगा कि मैं उसकी जगह किसी और को जाने का हुक्म नहीं दे सकता। अगर मैं उन्हें भेज दूँ, तो वे मेरे अपने नहीं हैं। वे तो बस सामान हैं।"',
      text: '"Because a mother drew the lot," said Nigrodha. "And I found that I could not order anybody else to take her place. If I can send them, they are not mine. They are just supplies."' },
    { art: ['guard'], who: 'guard',
      hi: 'राजा थोड़ी देर चुप रहा। "उठ जाओ," उसने कहा। "तुम्हारा जीवन तुम्हारा ही है।" "और उसका?" "उसका भी।" "और बाकी झुंड का?" "हाँ।" "और बाग के बाहर के हिरणों का? और पक्षियों का? और नदी की मछलियों का?" राजा हँस पड़ा, और मान गया, और मान गया, और मान गया।',
      text: 'The king was quiet for a while. "Get up," he said. "Your life is yours." "And hers?" "Hers too." "And the rest of the herd?" "Yes." "And the deer outside the park? And the birds? And the fish in the river?" The king laughed, and gave in, and gave in, and gave in.' },
    { art: ['pt_deer'], who: 'mithu',
      hi: 'बुद्ध ने यह कहानी अपने बारे में सुनाई थी, अपने पिछले जन्म की, जब वे हिरण थे। अगर तुम कभी वाराणसी के पास सारनाथ जाओ, तो सुनोगे कि उस जगह को डियर पार्क कहते हैं — यह नाम बहुत पुराने समय से चला आ रहा है।',
      text: 'The Buddha told this one about himself, in an earlier life, when he was the deer. If you ever go to Sarnath near Varanasi, you will hear the place called the Deer Park — that name has been going a long time.' }
  ],
  moral: 'A leader is simply the one who finds they cannot send somebody else.',
  source: 'Nigrodhamiga Jataka — the Banyan Deer, from the Pali Jataka collection. The story is set at Benares.'
},

{
  id: 'jt.hare-moon',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'jataka',
  badge: 'katha',
  title: 'The Hare in the Moon',
  hook: 'Look at the moon tonight. There is somebody up there, and this is how he got there.',
  hero: 'pt_rabbit',
  cast: ['pt_rabbit', 'pt_monkey', 'pt_jackal', 'courtier'],
  minutes: 4,
  place: ['IN-UP'],
  words_hi: [['चाँद', 'chaand', 'moon'], ['आग', 'aag', 'fire'], ['खरगोश', 'khargosh', 'hare']],
  scenes: [
    { art: ['pt_rabbit', 'pt_monkey'], who: null,
      hi: 'एक नदी के किनारे चार दोस्त रहते थे: एक बंदर, एक सियार, एक ऊदबिलाव और एक ख़रगोश। ख़रगोश वह था जो सोच-विचार करता रहता था। एक शाम, जब पूर्णिमा आने वाली थी, उसने कहा: "कल दान देने का दिन है। अगर कोई भूखा इधर से गुज़रे, तो हम उसे खाना खिलाएँगे। मंज़ूर?" सब मान गए, उतनी ही आसानी से जितनी आसानी से लोग एक रात पहले किसी भी बात पर राज़ी हो जाते हैं।',
      text: 'Four friends lived by a river: a monkey, a jackal, an otter, and a hare. The hare was the one who thought about things. One evening, with the full moon coming, he said: "Tomorrow is a day for giving. If anybody comes past hungry, we feed them. Agreed?" Everybody agreed, in the easy way you agree to things the night before.' },
    { art: ['pt_monkey'], who: null,
      hi: 'सुबह बंदर बाहर गया और आम लेकर लौटा, जो उसके लिए बहुत आसान था। सियार को खेत के किनारे किसी की छोड़ी हुई दही की एक मटकी मिल गई। उदबिलाव को उथले पानी में मछलियाँ मिल गईं। तीनों बड़े खुश होकर बैठ गए।',
      text: 'In the morning the monkey went out and came back with mangoes, which was easy for him. The jackal found a pot of curds somebody had left at the edge of a field. The otter found fish in the shallows. All three of them sat down feeling extremely pleased.' },
    { art: ['pt_rabbit'], who: 'pt_rabbit', mood: 'think',
      hi: 'खरगोश खाना ढूँढ़ने निकला और घास लेकर लौटा। वह काफी देर तक घास के अपने छोटे से ढेर को देखता रहा। उसने कहा, "कभी किसी ने किसी अजनबी के पास जाकर उसे मुँह भर घास तो नहीं दी होगी।"',
      text: 'The hare went out to gather food and came back with grass. He looked at his little heap of grass for a long time. "Nobody," he said, "has ever walked up to a stranger and offered them a mouthful of grass."' },
    { art: ['courtier', 'pt_rabbit'], who: 'courtier',
      hi: 'तभी सड़क पर एक बूढ़े यात्री आए, दुबले-पतले और धूल से सने हुए, और एक पत्थर पर बैठ गए। उन्होंने कहा, "मैंने कुछ नहीं खाया है। क्या तुम्हारे पास कुछ है?" बंदर अपने आम ले आया। उदबिलाव मछलियाँ ले आया। सियार दही ले आया। और खरगोश अपनी घास लिए वहीं खड़ा रहा।',
      text: 'And then an old traveller came up the road, thin and dusty, and sat down on a stone. "I have not eaten," he said. "Have you anything?" The monkey brought his mangoes. The otter brought the fish. The jackal brought the curds. And the hare stood there with his grass.',
      ask: {
        q: 'The others have mangoes, fish and curds. The hare has grass, and the traveller cannot eat grass. What has he actually got?',
        options: ['The grass — he should offer it anyway', 'Nothing at all', 'Himself'],
        answer: 2,
        right: 'Himself. "Build a fire," said the hare, "and I will jump into it, and then you will have supper."',
        wrong: 'He had himself. "Build a fire," said the hare, "and I shall jump into it, and then you will have supper."'
      } },
    { art: ['pt_rabbit', 'courtier'], who: null, mood: 'wow',
      hi: 'यात्री ने लकड़ियाँ इकट्ठी कीं और आग सुलगा दी। और खरगोश ने कूदने से पहले खुद को तीन बार झाड़ा — बहुत संभालकर — ताकि उसके रोएँ में छुपा कोई भी छोटा कीड़ा नीचे गिर जाए और उसे कोई चोट न पहुँचे। फिर वह सीधे आग में कूद पड़ा।',
      text: 'The traveller gathered sticks and lit them. And the hare, before he jumped, shook himself three times — very carefully — so that any small insect hiding in his fur would fall out and not be hurt. Then he jumped straight in.' },
    { art: ['pt_rabbit'], who: null, mood: 'wow',
      hi: 'और आग तो ठंडी थी। नदी के पानी जैसी ठंडी। खरगोश लपटों के बीच बिल्कुल आराम से और पूरी तरह हैरान होकर बैठा रहा, और उसने ऊपर देखा — तो वह बूढ़ा यात्री कोई बूढ़ा यात्री था ही नहीं, और मुस्कुरा रहा था।',
      text: 'And the fire was cold. Cold as river water. The hare sat in the middle of the flames feeling perfectly comfortable and extremely confused, and looked up — and the old traveller was not an old traveller at all, and was smiling.' },
    { art: ['courtier', 'pt_rabbit'], who: 'courtier',
      hi: 'उन्होंने कहा, "मैं यह देखने आया था कि तुम्हारा इरादा सच्चा है या नहीं। तुम्हारा इरादा सच्चा था। अब यह बात सबको पता चलेगी।" और उन्होंने हाथ बढ़ाकर चाँद के चेहरे पर खरगोश की आकृति बना दी, ताकि वह आज रात भी वहीं दिखाई दे।',
      text: '"I came to find out whether you meant it," he said. "You meant it. Now everybody is going to know." And he reached up and drew the shape of the hare on the face of the moon, so that it would still be there tonight.' },
    { art: ['pt_rabbit'], who: 'mithu',
      hi: '"जब पूरा चाँद निकला हो, तो बाहर जाओ और उस पर बने सलेटी निशानों को देखो। आधे एशिया को उनमें एक ख़रगोश दिखाई देता है। एक बार किसी ने तुम्हें दिखा दिया, तो फिर वह दिखना बंद ही नहीं होता।"',
      text: 'Go outside when the moon is full and look at the grey marks on it. Half of Asia sees a hare in them. Once somebody shows you, you cannot stop seeing it.' }
  ],
  moral: 'The one with nothing to give is very often the one who finds the biggest thing to give.',
  source: 'Sasa Jataka — from the Pali Jataka collection. The markings on the full moon are read as a hare across much of Asia.'
},

/* ========================================================== HARYANA ======= */
{
  id: 'ep.yaksha-lake',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'epics',
  badge: 'katha',
  title: 'The Questions at the Lake',
  hook: 'Four brothers drank from the lake and fell down asleep. The fifth one was asked some questions first.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 5,
  place: ['IN-HR'],
  words_hi: [['पानी', 'paani', 'water'], ['सवाल', 'sawaal', 'question'], ['माँ', 'maa', 'mother']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"पाँचों पांडव भाई किसी भी राज्य से बहुत दूर, जंगल में रह रहे थे। एक बहुत गर्म दिन ढल रहा था और उनका पानी खत्म हो चुका था। नकुल, जो सबसे तेज़ थे, पानी ढूँढने निकले और उन्हें एक ऐसी शांत झील मिली जो बिल्कुल फ़र्श जैसी लग रही थी।"',
      text: 'The five Pandava brothers were living in the forest, a long way from any kingdom, and it was the end of a very hot day and they had run out of water. Nakula, the quickest, went off to look and found a lake so still it looked like a floor.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"जैसे ही वे घुटनों के बल झुके, पानी से एक आवाज़ आई। "यह झील मेरी है। मेरे सवालों के जवाब दो, फिर पानी पीना।" नकुल बहुत प्यासे थे और उन्होंने बोलने वाली झील की बात पर कोई ध्यान नहीं दिया। उन्होंने पानी पिया — और किनारे पर ऐसे गिर पड़े जैसे किसी ने उनका स्विच ही बंद कर दिया हो।"',
      text: 'As he knelt down a voice came out of the water. "This lake is mine. Answer my questions, then drink." Nakula was extremely thirsty and thought very little of talking lakes. He drank — and fell down beside it as though he had been switched off.' },
    { art: ['guard', 'courtier'], who: null, mood: 'sad',
      hi: '"सहदेव उन्हें ढूँढने गए, और उनके साथ भी वही हुआ। फिर दुनिया के सबसे बड़े धनुर्धर अर्जुन गए, जिन्होंने पहले पानी में एक तीर चलाया और फिर भी पानी पी लिया, और वे भी गिर पड़े। फिर भीम गए, जो दुनिया के सबसे ताक़तवर इंसान थे, पर इससे भी कोई मदद नहीं मिली।"',
      text: 'Sahadeva went to look for him, and the same. Then Arjuna, the greatest archer alive, who shot an arrow into the water first and then drank anyway, and fell. Then Bhima, who was the strongest man in the world, which turned out not to help either.' },
    { art: ['guard'], who: 'guard',
      hi: '"युधिष्ठिर सबसे आखिर में आए और उन्होंने अपने चारों भाइयों को बिना किसी चोट के, गिरे हुए पेड़ों की तरह पानी के किनारे पड़ा पाया। वे सीधे खड़े रहे, और उन्होंने पानी नहीं पिया। "पूछिए," उन्होंने कहा।"',
      text: 'Yudhishthira came last and found his four brothers lying by the water like fallen trees, with no mark on them. He stood up, and he did not drink. "Ask," he said.' },
    { art: ['courtier'], who: null,
      hi: '"धरती से भी भारी क्या है?" — "माँ।" "आसमान से भी ऊँचा क्या है?" — "पिता।" "हवा से भी तेज़ क्या है?" — "मन।" "और पूरी दुनिया में सबसे अनोखी बात क्या है?"',
      text: '"What is heavier than the earth?" — "A mother." "What is higher than the sky?" — "A father." "What is faster than the wind?" — "The mind." "And what is the most amazing thing in the whole world?"' },
    { art: ['guard'], who: 'guard', mood: 'think',
      hi: '"यही कि हर रोज़," युधिष्ठिर ने कहा, "लोग दूसरों को मरते देखते हैं। और फिर भी हर कोई ऐसे जीता चला जाता है मानो उसके साथ ऐसा कभी होगा ही नहीं। इससे अनोखी बात दुनिया में कहीं नहीं है।"',
      text: '"That every day," said Yudhishthira, "people see others die. And every single one of them goes on living as though it will never happen to them. There is nothing stranger than that anywhere."' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'वह आवाज़ पल भर के लिए शांत हो गई। "तुमने हर सवाल का जवाब दे दिया है। तो यह रहा तुम्हारा इनाम: मैं तुम्हारे भाइयों में से किसी एक को जगा दूँगा। सिर्फ़ एक को। तुम चुनो।"',
      text: 'The voice was quiet for a moment. "You have answered everything. So here is your prize: I will wake up one of your brothers. Only one. You choose."',
      ask: {
        q: 'Bhima is the strongest man alive. Arjuna is the greatest archer alive. Who does Yudhishthira ask for?',
        options: ['Bhima, the strongest', 'Arjuna, the best archer', 'Nakula — so that each of his father\'s two wives keeps a son'],
        answer: 2,
        right: 'Nakula. Not the most useful brother. The one that made the family come out even.',
        wrong: 'He asked for Nakula — not the most useful brother, but the one that made the family come out even.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"नकुल," युधिष्ठिर ने कहा। "मेरे पिता की दो पत्नियाँ थीं। मेरी माँ के तीन बेटे यहाँ पड़े हैं। उनकी माँ के दो हैं। अगर सिर्फ़ एक ही को उठना है, तो वह उनकी माँ का बेटा हो, ताकि दोनों में से किसी भी माँ की झोली खाली न रहे।"',
      text: '"Nakula," said Yudhishthira. "My father had two wives. My mother has three sons lying here. His mother has two. If only one may get up, let it be one of hers, so that neither mother is left with nothing."' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और वे चारों तुरंत उठकर बैठ गए, अपनी आँखें मलते हुए पूछने लगे कि क्या हुआ था। झील से आ रही आवाज़ में एक और अचरज बाक़ी था, लेकिन वह कहानी का दूसरा हिस्सा है।',
      text: 'And all four of them sat up at once, rubbing their eyes and asking what had happened. The voice in the lake had one more surprise in it, but that is a different part of the story.' }
  ],
  moral: 'When you are the one who gets to choose, choose so that nobody is left with nothing.',
  source: 'Mahabharata, Vana Parva — the Yaksha Prashna, the questions at the lake. Retold in plain English; the questions and the answers are given in the epic.'
},

/* ===================================================== UTTARAKHAND ======== */
{
  id: 'ep.bhima-hanuman',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'epics',
  badge: 'katha',
  title: 'The Old Monkey on the Path',
  hook: '"Move your tail, grandfather, I am in a hurry." — "I am old, son. You move it."',
  hero: 'hanuman',
  cast: ['hanuman', 'guard'],
  minutes: 4,
  place: ['IN-UK'],
  words_hi: [['पूँछ', 'poonchh', 'tail'], ['ताकत', 'taakat', 'strength'], ['फूल', 'phool', 'flower']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'हिमालय की ऊँचाइयों में, पांडवों के पड़ाव के पास से बहती धारा में तैरता हुआ एक फूल आया — सौगंधिका, बहुत बड़ा और हलके रंग का, और उसकी महक जैसी महक दुनिया में किसी चीज़ की नहीं थी। द्रौपदी ने उसे पानी से निकाला और कहा कि उन्हें ऐसे कुछ और फूल चाहिए। इससे पहले कि कोई कह पाता कि इसकी कोई जल्दी नहीं है, भीम रास्ते पर निकल भी पड़े थे।',
      text: 'High in the Himalaya, a flower came floating down a stream past the Pandavas\' camp — a saugandhika, huge and pale, and it smelled like nothing else in the world. Draupadi picked it out of the water and said she would like some more. Bhima was up the path before anybody could suggest that this was not urgent.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'भीम दुनिया के सबसे ताकतवर इंसान थे और यह बात वह बखूबी जानते थे। वह पहाड़ पर सीधे रास्ते से चढ़ने लगे—जंगल के चक्कर लगाने के बजाय सीधे उसके बीच से, रास्ते में आने वाले पेड़ों को तोड़ते-मरोड़ते और ऐसी दहाड़ मारते हुए कि हिरण और हाथी दूर भाग जाएं। सच कहें तो, एक फूल के लिए यह बहुत ज़्यादा ही शोर-शराबा था।',
      text: 'Bhima was the strongest man alive and knew it. He went up the mountain in a straight line, through the forest rather than round it, snapping trees out of his way and roaring so that the deer and the elephants got well clear. It was, frankly, a lot of noise for a flower.' },
    { art: ['hanuman', 'guard'], who: null,
      hi: 'फिर दो चट्टानों के बीच रास्ता संकरा हो गया, और धूप में ठीक रास्ते के आर-पार एक बेहद बूढ़ा बंदर लेटा हुआ था—दुबला-पतला, मुंह के चारों तरफ सफेद बाल, और देखने में ऐसा जैसे सो रहा हो। उसकी पूंछ रास्ते पर किसी गिरी हुई रस्सी की तरह पड़ी थी।',
      text: 'Then the path narrowed between two rocks, and lying right across it in the sun was an extremely old monkey, thin, grey round the muzzle, apparently asleep. His tail lay across the path like a fallen rope.' },
    { art: ['guard', 'hanuman'], who: 'guard',
      hi: '"रास्ते से हटिए, बाबा," भीम ने कहा। "अपनी पूंछ हटाइए।" बूढ़े बंदर ने एक आंख खोली। "हटा तो देता, बेटा, लेकिन मैं बहुत बूढ़ा हूं और यह बहुत भारी है। तुम खुद ही इसे हटा लो। बस उठाकर एक तरफ रख दो—जरा आराम से, ठीक है।"',
      text: '"Out of the way, grandfather," said Bhima. "Move your tail." The old monkey opened one eye. "I would, son, but I am very old and it is very heavy. Move it yourself. Just lift it aside — gently, mind."' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'भीम ने एक हाथ नीचे बढ़ाया—वही हाथ जिससे वह पेड़ों को उठा लिया करते थे—और पूंछ को झटककर रास्ते से हटाने के लिए पकड़ा। वह टस से मस नहीं हुई। उन्होंने दोनों हाथों का इस्तेमाल किया। कुछ नहीं हुआ। उन्होंने चट्टानों पर अपने पैर जमाए और अपनी पूरी जान लगाकर खींचा, यहां तक कि वह कांपने लगे और उनकी ठुड्डी से पसीना बहने लगा—पर पूंछ बिल्कुल वहीं की वहीं पड़ी रही।',
      text: 'Bhima reached down with one hand, the hand that lifted trees, and took hold of the tail to flick it out of the way. It did not move. He used both hands. Nothing. He braced his feet on the rocks and pulled with everything he had, until he was shaking and the sweat ran off his chin — and the tail lay exactly where it had been lying.',
      ask: {
        q: 'He has pulled with everything he has, and it has not shifted by a hair. What now?',
        options: ['Pull harder — he is the strongest man alive', 'Climb over it and get on', 'Stop, and ask who this is'],
        answer: 2,
        right: 'He stopped. He let go, and stepped back, and asked — and that question is the whole point of the story.',
        wrong: 'He did the harder thing. He let go, stepped back, and asked who he was talking to.'
      } },
    { art: ['guard', 'hanuman'], who: 'guard', mood: 'wow',
      hi: '"मुझे क्षमा करें," भीम ने कहा, और इस बार उनकी आवाज़ वैसी नहीं थी जैसी आमतौर पर हुआ करती थी। "दुनिया में ऐसा कोई बंदर नहीं जिसकी पूंछ मैं न उठा सकूं। आप कौन हैं?"',
      text: '"Forgive me," said Bhima, and he did not say it the way he usually said things. "No monkey alive has a tail I cannot lift. Who are you?"' },
    { art: ['hanuman'], who: 'hanuman',
      hi: '"वह, जिसने कभी एक समुद्र पार किया था," बूढ़े बंदर ने उठकर बैठते हुए कहा। "और जिसे बताया गया है कि वह तुम्हारा भाई है—हम दोनों के पिता एक ही हैं, पवन देव। मैंने तुम्हें कोई चार मील दूर से आते हुए सुन लिया था, और मैंने सोचा कि इससे पहले तुम इस पहाड़ के हर जानवर को डरा दो, तुम्हारी रफ्तार थोड़ी धीमी कर दूं।"',
      text: '"Somebody who crossed a sea once," said the old monkey, sitting up. "And who is, I am told, your brother — we have the same father, the wind. I heard you coming from about four miles away, and I thought I would slow you down before you frightened every animal on this mountain."' },
    { art: ['hanuman', 'guard'], who: null,
      hi: 'हनुमान जी ने उन्हें बताया कि सौगंधिक फूल कहाँ खिलते हैं, और उस सरोवर के पहरेदारों पर चिल्लाने के बजाय उनसे प्यार से कैसे मांगना है। और फिर उन्होंने कहा: "जब तुम्हारे परिवार को सच में मेरी ज़रूरत होगी, एक दिन, मैं वहाँ ज़रूर आऊँगा।" और वे आए भी।',
      text: 'Hanuman told him where the saugandhika flowers grew, and how to ask the guardians of that pool politely instead of shouting at them. And then he said: when your family really needs me, one day, I shall be there. And he was.' },
    { art: ['hanuman'], who: 'mithu',
      hi: 'भीम बाक़ी का पहाड़ पहले आधे पहाड़ की तुलना में कहीं ज़्यादा चुपचाप चढ़े।',
      text: 'Bhima went up the rest of that mountain quite a lot more quietly than he came up the first half of it.' }
  ],
  moral: 'The moment you stop pulling and start asking is the moment you find out who you are talking to.',
  source: 'Mahabharata, Vana Parva — Bhima and Hanuman on the mountain, from the episode of the saugandhika flower.'
}

];

window.IND_COLLECTIONS_REGIONAL = [
  { id: 'desh',   name: 'Tales from Every Corner', note: 'One story from each part of India, told in its own colours.', avatar: 'pt_bull' },
  { id: 'chatur', name: 'The Clever Ones',         note: 'Tenali Raman, Gopal Bhar, Gonu Jha — and a king who could not keep quiet.', avatar: 'courtier' },
  { id: 'jataka', name: 'Jataka Tales',            note: 'Stories the Buddha told, mostly about animals behaving better than people.', avatar: 'pt_deer' },
  { id: 'jain',   name: 'Jain Stories',            note: 'Ahimsa told as story — the ones about stopping.', avatar: 'mahavira' },
  { id: 'sikh',   name: "The Guru's Way",          note: 'From the Sikh tradition, told through what happened. Sikhs do not picture the Gurus, so nor do we.', avatar: 'khanda' },
  { id: 'epics',  name: 'More from the Epics',     note: 'Corners of the Ramayana and Mahabharata you may not have been told yet.', avatar: 'rama' }
];
