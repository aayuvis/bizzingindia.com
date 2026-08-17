/* Bizzing India — story content, Northeast & Himalaya tranche B.

   Same shape as data-stories.js / data-stories-regional.js / data-stories-more.js,
   on its own globals so every set can be loaded and merged independently:
   window.IND_STORIES_NE_B, window.IND_COLLECTIONS_NE_B.

   Twenty-eight tales: Manipur, Nagaland, Arunachal Pradesh and Sikkim, seven each.
   Every story names the specific people and tradition it comes from — Meitei, Ao,
   Angami, Adi, Nyishi, Galo, Apatani, Monpa, Lepcha, Bhutia. These are distinct
   peoples with distinct languages; nothing here is "a Northeast tale."

   Indigenous faiths — Donyi-Polo of the Tani peoples, the Meitei tradition of the
   umang lai, the Lepcha reverence for Kangchenjunga — are presented from the
   inside, with the same dignity as every other faith in this app (docs/05 §4).

   Softening notes, declared per story in its own source line rather than quietly
   rewriting the tradition: Sandrembi's tale is far harsher in the old tellings;
   the Khamba-Thoibi epic runs past the wedding into sorrow and this telling stops
   at the feast; the parting of the sun-sisters Bomong and Bong is gentler here
   than in the old Adi tellings.

   Words in Meitei, Lepcha, Adi and other languages are glossed warmly in the
   story text itself; words_hi stays Hindi, as everywhere else in the app.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is said / told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_NE_B = [

/* ============================================================ MANIPUR ====== */
{
  id: 'fk.sandrembi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Sandrembi and the Grey Dove',
  hook: 'Two sisters, one pond, and a mother who was never quite gone.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_tortoise', 'pt_crow'],
  minutes: 5,
  place: ['IN-MN'],
  words_hi: [['बहन', 'behen', 'sister'], ['तालाब', 'taalaab', 'pond'], ['कबूतर', 'kabootar', 'dove']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मणिपुर के एक मैतेई गाँव में एक ही छत के नीचे दो लड़कियाँ रहती थीं: सांद्रेम्बी, और उसकी सौतेली बहन चैसरा। वह कुछ ऐसा घर था जहाँ एक लड़की को नया फानेक मिलता — वह पोशाक जो मैतेई औरतें पहनती हैं — और दूसरी लड़की को सिलाई-रफ़ू का काम। सांद्रेम्बी के हिस्से में सिलाई-रफ़ू ही आता था।',
      text: 'In a Meitei village in Manipur lived two girls under one roof: Sandrembi, and her stepsister Chaisra. It was the sort of house where one girl got the new phanek — the wrap that Meitei women wear — and the other girl got the mending. Sandrembi got the mending.' },
    { art: ['courtier', 'pt_tortoise'], who: null, mood: 'sad',
      hi: 'सांद्रेम्बी की अपनी माँ अब नहीं रही थीं। लेकिन घर के पीछे वाले तालाब में एक कछुआ था जो पहले कभी वहाँ नहीं दिखा था — और जिसे सांद्रेम्बी का नाम, उसकी माँ की आवाज़, और वह सब कुछ पता था जो एक माँ जानती है। सांद्रेम्बी हर शाम तालाब पर जाती और उसे अपने पूरे दिन का हाल सुनाती।',
      text: 'Sandrembi\'s own mother was gone. But in the pond behind the house there was a tortoise who had not been there before — and who knew Sandrembi\'s name, and her mother\'s voice, and everything a mother knows. Sandrembi went to the pond every evening and told her the whole day.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक सुबह उस देश के राजा पानी के किनारे से गुज़रे, जब दोनों लड़कियाँ मछलियाँ पकड़ने की टोकरियाँ लेकर बाहर निकली हुई थीं। चैसरा तुरंत धक्का देकर सबसे आगे आ गई। सांद्रेम्बी ने राजा पर बिल्कुल ध्यान नहीं दिया — वह अपनी पकड़ी हुई आधी मछलियाँ एक बूढ़ी औरत को देने में व्यस्त थी जिसे एक भी मछली नहीं मिली थी, और ऐसा करना उसके लिए बिल्कुल सहज बात थी।',
      text: 'One morning the king of that country came by the water while the girls were out with their fishing baskets. Chaisra pushed to the front at once. Sandrembi did not notice him at all — she was busy giving half her catch to an old woman who had caught nothing, which was a thing she simply did.' },
    { art: ['courtier', 'pt_tortoise'], who: 'pt_tortoise',
      hi: 'राजा ने यह देख लिया। राजा लोग जितना ज़ाहिर करते हैं, उससे कहीं ज़्यादा देख लेते हैं। और जब उन्होंने सांद्रेम्बी का हाथ माँगा, तो वह सबसे पहले तालाब के पास गई। "जाओ," पानी में से कछुए ने कहा। "और जब तुम रानी बन जाओ, तब भी वही लड़की बनी रहना जिसने मछलियाँ बाँटी थीं। मैंने तुमसे हमेशा बस यही चाहा है।"',
      text: 'The king noticed. Kings notice more than they let on. And when he asked for Sandrembi, she went first to the pond. "Go," said the tortoise from the water. "And when you are a queen, stay the girl who shared the fish. That is all I have ever wanted of you."' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'सांद्रेम्बी एक अच्छी रानी बनी, और चैसरा की माँ से यह देखा नहीं गया। जलन ने वही किया जो जलन करती है: उसने कोई रास्ता ढूँढ़ ही लिया। एक सुबह रानी अचानक गायब हो गई, और चैसरा उसके कपड़े पहनकर उसकी जगह बैठ गई — और महल के ऊपर एक सलेटी कबूतर गोल-गोल चक्कर लगाने लगा और वहाँ से जाने का नाम ही नहीं ले रहा था।',
      text: 'Sandrembi was a good queen, and Chaisra\'s mother could not bear it. Jealousy did what jealousy does: it found a way. One morning the queen was simply gone, and Chaisra sat in her place wearing her clothes — and over the palace a grey dove flew in circles and would not leave.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'राजा को कुछ गड़बड़ होने का एहसास पहले ही हो गया, इससे पहले कि वे समझ पाते कि बात क्या है। रानी के कपड़े पहने वह औरत तालाब वाला छोटा-सा गीत नहीं गुनगुनाती थी। वह बूढ़ी औरतों को मछलियाँ नहीं भिजवाती थी। वह रानी जैसी दिखती तो थी, पर बस वैसे ही जैसे कोई तस्वीर किसी इंसान जैसी दिखती है।',
      text: 'The king felt the wrongness before he could name it. The woman in the queen\'s clothes did not hum the little pond song. She did not send fish to old women. She looked like the queen the way a picture looks like a person.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'और हर रोज़ वह स्लेटी कबूतरी उनकी खिड़की पर आती, गाती, और भगाने पर भी न भागती।',
      text: 'And every day the grey dove came to his window, and sang, and would not be shooed.',
      ask: {
        q: 'A dove keeps coming to the king\'s window and it will not go away. What should he do?',
        options: ['Shoo it — it is only a bird', 'Listen to it properly', 'Send it to the kitchens'],
        answer: 1,
        right: 'He listened. And inside the song there were words — small, far-off words, like someone calling across water.',
        wrong: 'He did the wiser thing: he listened properly. And inside the song there were words — small and far-off, like someone calling across water.'
      } },
    { art: ['pt_crow', 'courtier'], who: null, mood: 'wow',
      hi: 'यह वही तालाब वाला गीत था। वही, जिसे उनकी रानी चावल साफ़ करते हुए गुनगुनाया करती थीं। उन्होंने अपनी कलाई आगे बढ़ाई और कबूतरी उस पर उतर आई, थमी हुई साँस जैसी हल्की, और उसने उन्हें अपनी उसी जानी-पहचानी नज़र से देखा।',
      text: 'It was the pond song. The one his queen used to hum with her hands in the rice. He held out his wrist and the dove came down onto it, light as a held breath, and looked at him with an eye he knew.' },
    { art: ['courtier', 'pt_tortoise'], who: null,
      hi: 'वे कबूतरी को उसके पुराने घर के पीछे वाले तालाब पर ले गए। गहरे पानी में कछुई ऊपर तैर आई और कबूतरी उससे मिलने नीचे उतरी, और पानी में माँ तथा किनारे पर प्यार के बीच, उसका असली रूप फिर लौट आया — और सुबह की धूप में सान्द्रेम्बी घास पर खड़ी थी।',
      text: 'He carried the dove to the pond behind her old house. The tortoise rose in the dark water and the dove came down to meet her, and between the mother in the water and the love on the bank, the shape came right again — and Sandrembi stood on the grass in the morning sun.' },
    { art: ['courtier'], who: null,
      hi: 'चैसरा और उसकी माँ घर चली गईं। पुरानी कहानियों में उनके साथ जो हुआ उसके बारे में और भी बहुत कुछ कहा गया है, और वह बड़ा कठोर है, इसलिए मैं उसे उस तरह नहीं सुनाता। वे घर चली गईं। बस इतना काफ़ी है।',
      text: 'Chaisra and her mother went home. The old tellings say much more about what happened to them, and it is harsh, and I do not tell it that way. They went home. That is enough.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'सान्द्रेम्बी वह लड़की है जिससे हर मैतेई दादी-नानी अच्छाई की मिसाल देती हैं। और रानी ने जैसा वादा किया था, वैसे ही अपनी मछलियाँ बाँटना जारी रखा — क्योंकि कबूतरी बनने और फिर वापस लौटने से किसी भी मायने रखने वाली बात में कोई फ़र्क़ नहीं आया था।',
      text: 'Sandrembi is the girl every Meitei grandmother measures kindness by. And the queen went on sharing her fish, exactly as promised — because being turned into a dove and back had not changed anything that mattered.' }
  ],
  moral: 'Kindness keeps its shape. Whatever shape the world puts you in, it shows through.',
  source: 'Sandrembi and Chaisra — a Meitei phunga wari (fireside tale) of Manipur, one of the best-loved of them. The old tellings are far harsher, to Sandrembi and to Chaisra both; this telling is softened, and says so.'
},

{
  id: 'fk.khamba-thoibi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Khamba, Thoibi and the Great Bull',
  hook: 'An orphan boy, a princess, a wrestling match and one enormous bull. Moirang still sings about it.',
  hero: 'guard',
  cast: ['guard', 'courtier', 'pt_bull'],
  minutes: 5,
  place: ['IN-MN'],
  words_hi: [['कुश्ती', 'kushti', 'wrestling'], ['साँड़', 'saand', 'bull'], ['वीर', 'veer', 'brave']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'विशाल लोकतक झील के किनारे मोइरांग बसा है, जो पुराने दिनों में अपने आप में एक अलग राज्य था, जिसके अपने देवता थे — थांगजिंग — और अपने गायक। ये गायक पेना बजाते हैं, एक छोटी सारंगी जिसकी आवाज़ मच्छर जैसी और याददाश्त हज़ार साल पुरानी है। यही वह कहानी है जिसे वे सबसे ज़्यादा गाते हैं।',
      text: 'On the shore of the great Loktak lake stands Moirang, which in the old days was a kingdom of its own, with its own god — Thangjing — and its own singers. The singers play the pena, a little fiddle with a voice like a mosquito and a memory a thousand years long. This is the story they sing most.' },
    { art: ['guard'], who: null,
      hi: 'खम्बा के न तो पिता थे और न माँ। उसकी बस एक बहन थी, खम्नू, जिसने न के बराबर साधनों में और बिना किसी ढील के उसे पाला-पोसा। वह बड़ा होकर गरीब ज़रूर रहा, पर नेक था, और इतना ताकतवर कि अपनी पीठ पर नाव उठा ले — और मोइरांग में लोगों की नज़र इस बात पर ज़रूर पड़ी।',
      text: 'Khamba had no father and no mother. He had one sister, Khamnu, who raised him on next to nothing and absolutely no nonsense, and he grew up poor, polite, and strong enough to carry a boat on his back — which in Moirang people noticed.' },
    { art: ['guard', 'courtier'], who: null,
      hi: 'थोइबी मोइरांग की राजकुमारी थी, और वह खम्बा से झील के किनारे मिली, बिल्कुल वैसे ही जैसे मणिपुर की आधी कहानियाँ शुरू होती हैं। पहले उन्होंने यूँ ही इधर-उधर की बातें कीं। फिर उन्होंने हर चीज़ पर बातें कीं। कहानी के इस हिस्से को सुनाने में पेना गाने वालों को पूरी एक शाम लग जाती है, और वे इसमें ज़रा भी जल्दबाज़ी नहीं करते।',
      text: 'Thoibi was the princess of Moirang, and she met Khamba at the lake, the way half the stories in Manipur begin. They talked about nothing much. Then they talked about everything. That part of the story takes the pena singers a whole evening, and they do not hurry it.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'लेकिन एक और आदमी थोइबी से ब्याह करना चाहता था — नोंगबान, जो अमीर था और जिसे जीतने की आदत थी। इसलिए बात मुकाबले पर आ पहुँची, क्योंकि मोइरांग में फैसले मुकाबलों से होते थे, और मोइरांग अपने खेलों को बड़ी संजीदगी से लेता था: आप जीते, आप हारे, आपने सिर झुकाया, और फिर बाद में सबने साथ बैठकर खाया।',
      text: 'But another man wanted to marry Thoibi — Nongban, who was rich, and used to winning. So it came to a contest, because Moirang settled things with contests, and Moirang took its sport seriously: you won, you lost, you bowed, and you ate together after.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'थांगजिंग के त्योहार पर दोनों के बीच कुश्ती हुई। ढोल-नगाड़े, उड़ती धूल, और पूरा शहर अपने पैरों पर खड़ा था। नोंगबान ताकतवर था और उसे यह बात अच्छी तरह पता थी। खम्बा भी ताकतवर था पर वह बिल्कुल शांत खड़ा रहा, इंतज़ार करता रहा, और जैसे ही सही पल आया, उसने पकड़ बनाई, अपनी कमर घुमाई, और नोंगबान को पानी से भरे घड़े की तरह घास पर टिका दिया — मज़बूती से, और बिना एक बूँद छलकाए।',
      text: 'At the festival of Thangjing they wrestled. Drums, dust, the whole town on its feet. Nongban was strong and knew it. Khamba was strong and stood very still, and waited, and when the moment came he took the grip, turned his hips, and set Nongban down on the grass like a full water pot — firmly, and spilling nothing.' },
    { art: ['courtier'], who: null,
      hi: 'नोंगबान उठा और उसने अपने कपड़े झाड़े। लेकिन अभी एक इम्तिहान बाकी था, और वह कोई खेल नहीं था। मोइरांग के ऊपर पहाड़ियों में काओ नाम का एक सांड रहता था — बहुत विशाल, सालों से जंगली, और हर उस रस्सी और शेखी बघारने वाले हर उस बहादुर आदमी के बस से बाहर, जो उसे पकड़ने ऊपर गया था।',
      text: 'Nongban got up and dusted himself off. But there was one test left, and it was not a game. In the hills above Moirang there was a bull called Kao — enormous, wild for years, and too much for every rope and every loud brave man who had gone up after him.' },
    { art: ['guard', 'pt_bull'], who: null, mood: 'think',
      hi: 'खम्बा पेड़ों के किनारे खड़ा हुआ और सांड को देखने लगा, और सांड ने मुड़कर उसे देखा। और खम्बा उस पहाड़ी पर अपने साथ कुछ ऐसा लेकर आया था, जो उससे पहले कोई और कभी नहीं लाया था।',
      text: 'Khamba stood at the edge of the trees and looked at the bull, and the bull turned and looked at him. And Khamba was carrying something up that hill that nobody else had ever brought.',
      ask: {
        q: 'Every man who has faced the bull has faced it with ropes and shouting. What has Khamba got that they had not?',
        options: ['Stronger ropes', 'His father\'s name', 'A faster horse'],
        answer: 1,
        right: 'Yes. Long ago, before it went wild, the bull had belonged to Khamba\'s father.',
        wrong: 'Something better than any of that. Long ago, before it went wild, the bull had belonged to Khamba\'s father.'
      } },
    { art: ['guard', 'pt_bull'], who: 'guard',
      hi: '"वह धीरे-धीरे बाहर आया, हाथ खुले हुए, कहीं कोई रस्सी नहीं दिख रही थी। और उसने अपने पिता का नाम पुकारा, और वो पुराने पुकारने वाले शब्द कहे जो उसकी बहन ने उसे सिखाए थे, वही शब्द जो उस बैल ने बछड़े के रूप में हर सुबह सुने थे। बड़े-बड़े कान घूमे। वह विशाल सिर नीचे झुक गया। काओ याद करते हुए चुपचाप खड़ा रहा।"',
      text: 'He walked out slow, hands open, no rope showing. And he spoke his father\'s name, and the old calling words his sister had taught him, the ones the bull had heard every morning as a calf. The great ears turned. The great head came down. Kao stood still, remembering.' },
    { art: ['pt_bull', 'guard'], who: null, mood: 'wow',
      hi: '"खम्बा ढीली रस्सी थामे उसे मोइरांग ले आया, किसी पुराने दोस्त की तरह उसके साथ-साथ चलते हुए। और पूरा नगर इतना शांत था कि झील की आवाज़ तक सुनाई दे रही थी — और फिर इतना शोर मच गया कि कुछ भी सुनाई नहीं दे रहा था।"',
      text: 'Khamba led him down into Moirang on a slack rope, walking beside him like an old friend, and the town was so quiet you could hear the lake — and then so loud you could not hear anything at all.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"पूरे मोइरांग के सामने खम्बा और थोइबी की शादी हुई। थोइबी ने अब तक का सबसे सुंदर फनेक पहना था, और ऐसी दावत हुई जिसमें नोंगबान सहित सभी को खाना खिलाया गया। चावल परोसे जाने से पहले ही पेना गायक नए गीत रचने लगे थे।"',
      text: 'Khamba and Thoibi were married in front of the whole of Moirang, with Thoibi in the finest phanek ever woven, and a feast that fed everybody including Nongban. The pena singers were composing before the rice was served.' },
    { art: ['guard'], who: 'mithu',
      hi: '"वे तब से इसे गाते आ रहे हैं, और मोइरांग में थांगजिंग के लिए खम्बा-थोइबी नृत्य आज भी किया जाता है। पूरा महाकाव्य बहुत लंबा है — यह शादी से आगे, दुख तक जाता है। लेकिन कहानी को दावत पर ही खत्म करने की छूट होती है, और यह कहानी यहीं रुकती है।"',
      text: 'They have been singing it ever since, and the Khamba-Thoibi dance is danced for Thangjing at Moirang to this day. The whole epic is long — it runs on past the wedding, into sorrow. But a telling is allowed to stop at the feast, and this one does.' }
  ],
  moral: 'Strength wins a wrestling match. Remembering who you are — and whose — brings the bull home.',
  source: 'Khamba and Thoibi, the great epic of Moirang, sung in Manipur by Meitei pena singers as part of the Moirang cycle. The full epic runs far past the wedding and ends in sorrow; this telling stops at the feast, and says so.'
},

{
  id: 'fk.loktak-ima',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Lake That Holds Everything Up',
  hook: 'A lake where the islands float, the huts float, and the deer dance on the water. Ask a grandmother why.',
  hero: 'pt_deer',
  cast: ['pt_deer', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['झील', 'jheel', 'lake'], ['हिरण', 'hiran', 'deer'], ['घास', 'ghaas', 'grass']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"पहाड़ियों से देखने पर लोकतक आसमान के उस टुकड़े जैसा लगता है जो घाटी में गिरा और वहीं ठहर गया। यह पूर्वोत्तर की सबसे बड़ी झील है, और इस पर हर तरफ हरे-भरे छल्ले और गद्दे बिखरे हैं — मैतेई भाषा में इन्हें फुमदी कहते हैं। तैरते हुए मैदान। घास, मिट्टी और जड़ें, जो आपस में मिलकर नाव की तरह बन गई हैं।"',
      text: 'From the hills, Loktak looks like a piece of sky that fell into the valley and decided to stay. It is the biggest lake in the Northeast, and it is scattered all over with rings and cushions of green — phumdi, the Meitei word for them. Floating meadows. Grass and soil and roots, woven into rafts.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"सना नाम की एक लड़की अपनी दादी के साथ रहने के लिए नाव से गई, जिनकी झोपड़ी इन्हीं में से एक पर बनी थी — तैरते हुए मैदान पर एक तैरती हुई झोपड़ी, जिसके दरवाज़े के पास सब्जियों की तैरती हुई क्यारी थी। हर सुबह उसकी दादी का पूरा घर ज़रा सी अलग जगह पर होता था।"',
      text: 'A girl called Sana went out by boat to stay with her grandmother, whose hut stood on one of them — a floating hut on a floating meadow, with a floating vegetable patch by the door. Her grandmother\'s whole house was somewhere slightly different every morning.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: '"अबोक," सना ने कहा — यानी दादी — "ये टापू तैरते क्यों हैं? टापुओं को तो नीचे टिके रहना चाहिए ना।" उसकी दादी अपना जाल बुनती रहीं। "क्योंकि यह झील ही ऐसी है," उन्होंने कहा। "हम इसे इमा लोकतक कहते हैं। इमा का मतलब होता है माँ। और एक माँ जिससे प्यार करती है, उसे हमेशा थामे रखती है।"',
      text: '"Abok," said Sana — grandmother — "why do the islands float? Islands are supposed to stay down." Her grandmother went on mending her net. "Because of who the lake is," she said. "We call her Ima Loktak. Ima means mother. A mother holds up what she loves."' },
    { art: ['guard'], who: null,
      hi: 'सना दिन भर इसी बारे में सोचती रही, जबकि मछुआरे चाय के रंग जैसे पानी से अपने जाल बाहर निकाल रहे थे, झोपड़ियों के बीच कोहरा घूम रहा था, और पूरा गाँव बड़ी नर्मी से ऊपर-नीचे हो रहा था, जैसे कोई धीरे-धीरे साँस ले रहा हो।',
      text: 'Sana thought about that all day, while the fishers lifted their nets out of water the colour of tea, and the mist walked about between the huts, and the whole village rose and fell very gently, like something breathing.' },
    { art: ['pt_deer'], who: null, mood: 'wow',
      hi: 'फिर उसकी दादी उसे दक्षिण की ओर ले गईं, झील के उस छोर पर जहाँ तैरता हुआ घास का मैदान इतना पुराना और इतना मोटा है कि अपनी पीठ पर पूरी की पूरी घासभूमि संभाले हुए है। इसे कीबुल लामजाओ कहते हैं — धरती का इकलौता तैरता हुआ राष्ट्रीय उद्यान। और इसी पर रहता है संगाई।',
      text: 'Then her grandmother took her south, to the end of the lake where the floating meadow is so old and so thick it carries a whole grassland on its back. Keibul Lamjao, it is called — the only floating national park on the earth. And on it lives the sangai.' },
    { art: ['pt_deer'], who: null,
      hi: 'संगाई एक ऐसा हिरण है जिसके सींग फैली हुई डालियों जैसे होते हैं, और वह दुनिया में यहाँ के सिवा कहीं और नहीं मिलता। वह दूसरे हिरणों की तरह नहीं चलता। वह अपने कदम ऊँचे, कोमल और सँभालकर रखता है, किसी नाचने वाले की तरह हर पैर को उठाते हुए — इसीलिए मणिपुर में इसे नाचने वाला हिरण कहा जाता है।',
      text: 'The sangai is a deer with antlers like swept branches, found nowhere else in the world but here. And it does not walk the way other deer walk. It steps high and soft and careful, lifting each foot like a dancer — which is why Manipur calls it the dancing deer.',
      ask: {
        q: 'The sangai walks on ground that gives underneath it. Why does it look like it is dancing?',
        options: ['It is showing off', 'It steps lightly so the floating ground will hold it', 'It is frightened of the water'],
        answer: 1,
        right: 'Just so. Light feet on a floating world. The Meitei say you could do worse than learn to live like that.',
        wrong: 'Nothing frightens it here. It steps lightly so the floating ground will hold — light feet on a floating world. You could do worse than learn to live like that.'
      } },
    { art: ['pt_deer', 'guard'], who: 'guard',
      hi: '"बुज़ुर्ग कहते हैं कि संगाई हमारे और इस धरती के बीच का नाता है," दादी ने कहा। "इस हिरण को नुकसान पहुँचाओ, तो समझो अपने ही किसी हिस्से को चोट पहुँचाई। एक ऐसा भी समय था जब ये इतने कम बचे थे कि इन्हें परिवार के लोगों की तरह उँगलियों पर गिना जा सकता था। मणिपुर ने एक-एक करके इनकी हिफ़ाज़त की और इन्हें वापस लौटाया।"',
      text: '"The old people say the sangai is the tie between us and the land," said her grandmother. "Harm the deer, and you have cut something in yourself. There was a time when so few were left you could count them like family members. Manipur guarded them back, one by one."' },
    { art: ['pt_deer'], who: null,
      hi: 'उन्होंने शाम ढलते एक नर हिरण को घास के मैदान पर सँभल-सँभलकर कदम बढ़ाते देखा। ज़मीन उसके नीचे बस उतनी ही डोल रही थी जितनी कोई नाव डोलती है, और उसके पैर हर पल उस ज़मीन की थाह ले रहे थे। उसने एक बार भी नीचे झुककर नहीं देखा।',
      text: 'They watched a stag pick his way across the meadow at dusk, the ground swaying under him no more than a boat sways, his feet reading it the whole time. He never once looked down.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"वैज्ञानिक आपसे कहेंगे कि फुमदी जड़ों और मिट्टी की एक ऐसी चादर है जो मौसमों के साथ सांस लेती है, कभी डूबती है तो कभी तैरती है। दादियाँ-नानियाँ आपसे कहेंगी कि इसे ईमा ने थाम रखा है। कभी भोर के समय इस पर खड़े होकर देखिए, मेरा वादा है कि आपको दोनों ही बातें सच लगेंगी।"',
      text: 'The scientists will tell you a phumdi is a mat of roots and soil that breathes with the seasons, sinking and rising. The grandmothers will tell you Ima holds it up. Stand on one at dawn, and I promise you both answers feel true.' }
  ],
  moral: 'Walk lightly on whatever is holding you up — it is holding you up.',
  source: 'Loktak lake and its phumdis, the floating huts of its fishers, and the sangai deer of Keibul Lamjao — from the Meitei fisher tradition of Manipur, where the lake is called Ima Loktak, Mother Loktak. Keibul Lamjao really is the only floating national park in the world.'
},

{
  id: 'fk.sagol-kangjei',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Game That Rode Out of Manipur',
  hook: 'Seven riders, seven ponies, one ball — and the whole world learned it from here.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['घोड़ा', 'ghoda', 'horse'], ['गेंद', 'gend', 'ball'], ['खेल', 'khel', 'game']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"इंफाल के बीचों-बीच घास का एक ऐसा मैदान है जिसे लोग दुनिया का सबसे पुराना पोलो ग्राउंड कहते हैं। इसका नाम मापाल कांगजेईबुंग है। और इस पर खेला जाने वाला खेल इतना पुराना है कि कोई हिसाब ही नहीं लगा सकता: सागोल कांगजेई — सागोल यानी टट्टू, और कांगजेई यानी छड़ी।"',
      text: 'In the middle of Imphal there is a grass field that people call the oldest polo ground in the world. Mapal Kangjeibung, it is named. And the game played on it is older than anybody\'s counting: sagol kangjei — sagol for the pony, kangjei for the stick.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"मेइतेई लोगों का कहना है कि यह खेल इंसानों से शुरू ही नहीं हुआ। इसकी शुरुआत तो देवताओं से हुई थी। घोड़ों के देवता मारजिंग, जिनके पास समादोन आयांगबा नाम का एक पंखों वाला टट्टू था, वे इस खेल को लेकर आए — और पुरानी कहानियाँ बताती हैं कि धरती पर किसी के सोचने से भी पहले, खुद देवताओं ने सात-सात की टोलियों में इसका सबसे पहला मैच खेला था।"',
      text: 'The Meitei say the game did not begin with people at all. It began with the gods. Marjing, the god of horses, keeper of a winged pony called Samadon Ayangba, brought the game — and the old accounts say the very first match was played by gods, seven a side, before anyone on earth had thought of it.' },
    { art: ['guard'], who: null,
      hi: '"फिर लोगों ने इसे खेलना शुरू किया, मणिपुरी टट्टू की पीठ पर — एक छोटा, फुर्तीला और मजबूत जीव, जो एक पत्ते जितनी जगह में भी मुड़ सकता है। मणिपुर में इस टट्टू का बड़ा आदर है, और बोझ ढोने वाले जानवर की तरह तो बिल्कुल नहीं। यह न तो हल जोतने के लिए है और न ही गाड़ी खींचने के लिए। यह तो बस खेल के लिए है।"',
      text: 'Then people played it, on the Manipuri pony — a small, quick, sturdy creature that can turn on a leaf. The pony is honoured in Manipur, and not as a beast of burden. It is not for the plough and not for the cart. It is for the game.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"दोनों तरफ सात-सात खिलाड़ी। बांस की जड़ से तराशी गई गेंद। बेंत की छड़ियाँ, हवा से बातें करती सरपट दौड़, और इस बात पर कोई बहस नहीं कि यह खेल किसका था, क्योंकि यह सबका था — उस मैदान पर राजा भी आम लोगों के साथ खेलते थे, और टट्टू को इस बात से कोई फर्क नहीं पड़ता था कि कौन राजा है और कौन आम इंसान।"',
      text: 'Seven a side. A ball cut from bamboo root. Cane sticks, a flying gallop, and no argument about whose game it was, because it was everybody\'s — kings played commoners on that ground, and the pony did not care which was which.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"फिर, डेढ़ सौ से भी ज्यादा साल पहले, कुछ मेहमान आए — अठारह सौ पचास के दशक में अंग्रेज अफसर — और मैदान के किनारे मुँह बाए खड़े रह गए। उड़ते हुए टट्टुओं पर सवार बड़े-बड़े लोग, एक ऐसा खेल खेल रहे थे जिसमें उनके अपने देश के किसी भी खेल से कहीं ज्यादा रफ्तार थी।"',
      text: 'Then, more than a hundred and fifty years ago, visitors came — British officers, in the eighteen-fifties — and stood at the edge of the field with their mouths open. Grown men on flying ponies, playing a game with more speed in it than anything they had ever brought from home.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'बाहर से आए लोगों ने इसे सिखाने को कहा। और शहर के कुछ लोगों ने वही कहा जो लोग हमेशा कहते हैं: यह हमारा है। इसे अपने पास ही रखो।',
      text: 'The visitors asked to be taught. And some people in the town said what people always say: it is ours. Keep it.',
      ask: {
        q: 'Strangers want to learn the town\'s own game. What do the players do?',
        options: ['Keep it secret', 'Teach them properly', 'Let them watch but never play'],
        answer: 1,
        right: 'They taught them. A game gets bigger by being given away — and this one went around the entire world.',
        wrong: 'The players decided otherwise. They taught them properly — and the game went around the entire world.'
      } },
    { art: ['courtier'], who: null,
      hi: 'बाहर से आए लोग इसे अपने साथ ले गए और इसका नाम पोलो रख दिया। उन्होंने क्लब बनाए — पहले इन्हीं पहाड़ियों के पास, फिर कलकत्ता में, फिर इंग्लैंड में — और इंग्लैंड से यह दुनिया के हर महाद्वीप तक फैल गया। दुनिया का हर पोलो मैदान इम्फाल की उसी घास का नाती-पोता है।',
      text: 'The visitors carried it off and called it polo. They made clubs — first near these hills, then in Calcutta, then in England — and from England it spread to every continent there is. Every polo field on earth is a grandchild of that grass in Imphal.' },
    { art: ['guard'], who: null,
      hi: 'और मापल कांग्जेईबुंग में वे आज भी इसे पुराने तरीके से खेलते हैं, एक-एक तरफ सात खिलाड़ी, मणिपुरी टट्टुओं पर। इम्फाल के ऊपर, मार्जिंग की पहाड़ी पर, पंखों वाले टट्टू की एक विशाल मूर्ति खड़ी है, जो नीचे उस घाटी को देख रही है जहाँ से यह सब शुरू हुआ था।',
      text: 'And on Mapal Kangjeibung they still play it the old way, seven a side, on Manipuri ponies. Above Imphal, on Marjing\'s hill, stands a great statue of a winged pony, looking out over the valley where it all started.' },
    { art: ['guard'], who: 'mithu',
      hi: 'तो अगर तुम कभी पोलो देखो — स्क्रीन पर, किसी तस्वीर में, कहीं भी — तो तुम पास आकर कह सकते हो: यह मणिपुर से ही निकलकर आया था। क्योंकि सच में, यह वहीं से आया था।',
      text: 'So if you ever see polo — on a screen, in a picture, anywhere — you can lean over and say: that rode out of Manipur. Because it did.' }
  ],
  moral: 'A thing shared is not a thing lost. Manipur gave away a game, and now the whole world plays it.',
  source: 'Sagol kangjei, the Manipuri polo of the Meitei people, and the tradition of Marjing, god of horses, with his winged pony Samadon Ayangba. That modern polo spread worldwide from Manipur and Cachar through clubs founded in the 1850s–60s is history; Mapal Kangjeibung in Imphal is called the oldest polo ground in the world.'
},

{
  id: 'fk.tapta',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Tapta',
  hook: 'The tiger was not afraid of anything in the hills. Then he heard about Tapta.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['बाघ', 'baagh', 'tiger'], ['छत', 'chhat', 'roof'], ['टप-टप', 'tap-tap', 'drip-drip']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'एक मेइतेई गाँव के किनारे, फूस की छत वाली झोपड़ी में एक बूढ़ी औरत रहती थी, और वह फूस काफी पुरानी हो चुकी थी। एक रात ऐसी बारिश हुई जैसी मणिपुर में होती है — यानी यूँ समझो, मानो आसमान ने यहीं आ बसने का फैसला कर लिया हो।',
      text: 'On the edge of a Meitei village lived an old woman in a hut with a thatch roof, and the thatch had seen better years. One night it rained the way it rains in Manipur — which is to say, as though the sky had decided to move in.' },
    { art: ['pt_lion'], who: null,
      hi: 'उस रात एक बाघ कुछ ढूँढ़ने पहाड़ियों से नीचे आया, और भीगने से बचने के लिए झोपड़ी के छज्जे के नीचे रुक गया। दीवार के उस पार से उसे अंदर बूढ़ी औरत खुद से बातें करती सुनाई दी, बिल्कुल वैसे, जैसे अकेले रहने वाले लोग करते हैं।',
      text: 'A tiger came down out of the hills that night to see what he could find, and stopped under the eaves of the hut to get out of the wet. Through the wall he could hear the old woman inside, talking to herself, the way people who live alone do.' },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: '"बाघ?" वह कह रही थी। "मुझे बाघ से डर नहीं लगता। भालू? हुंह। हाथी? आ जाए वो भी। मुझे तो बस टपटा बर्दाश्त नहीं होता। टपटा हर जगह घुस आता है। तुम जहाँ भी बैठो, टपटा तुम्हें ढूँढ ही लेता है। खाट हटाओ तो टपटा पीछे-पीछे आ जाता है। अरे — लो फिर आ गया — टपटा!"',
      text: '"Tiger?" she was saying. "I am not afraid of tiger. Bear? Pff. Elephant? Let him come. It is TAPTA I cannot stand. Tapta gets in everywhere. Tapta finds you wherever you sit. Move the bed and Tapta follows you. Ah — here it comes again — TAPTA!"' },
    { art: ['pt_lion'], who: null, mood: 'think',
      hi: 'बाघ एकदम ठंडा पड़ गया, और यह ठंड बारिश की वजह से नहीं थी। कोई ऐसी चीज़ जो बाघ, भालू और हाथी, सबसे बढ़कर थी। कोई ऐसी चीज़ जो हर जगह घुस जाती थी और जहाँ बैठो वहीं ढूँढ लेती थी। और वह चीज़ अभी, इसी वक़्त बुढ़िया के साथ घर के अंदर मौजूद थी।',
      text: 'The tiger went very cold, and it was not the rain. Something that outranked tiger, bear AND elephant. Something that got in everywhere and found you wherever you sat. And it was in the house with her, right now.',
      ask: {
        q: 'The tiger has never heard of Tapta. What is Tapta, actually?',
        options: ['A monster bigger than a tiger', 'The drip coming through the roof', 'A spirit of the hills'],
        answer: 1,
        right: 'That is all it was. Tap… tap… tapta — rain coming through old thatch. The tiger did not know that.',
        wrong: 'Nothing of the kind. It was the drip coming through the thatch — tap, tap, tapta. The tiger did not know that.'
      } },
    { art: ['guard'], who: null,
      hi: 'अब, उसी घोर अंधेरी और भीगी रात में, एक चोर बुढ़िया की गाय चुराने के इरादे से दबे पाँव उसके छप्पर की तरफ़ आया। इतना अँधेरा था कि कुछ सूझ नहीं रहा था। उसने टटोला, तो उसे कोई बड़ी, गरम और रोएँदार चीज़ महसूस हुई, और — क्योंकि चोर जल्दी में था — वह उसे हाँक ले जाने के लिए सीधा उसकी पीठ पर चढ़ बैठा।',
      text: 'Now, that same black wet night, a thief came creeping to the old woman\'s lean-to, meaning to steal her cow. It was far too dark to see. He felt about, found something big and warm and furry, and — being a thief in a hurry — climbed straight up onto its back to ride it away.' },
    { art: ['pt_lion', 'guard'], who: 'pt_lion', mood: 'wow',
      hi: 'कोई चीज़ मेरी पीठ पर आ बैठी है, बाघ ने सोचा। अँधेरे में। बिना किसी आहट के। जहाँ भी बैठो यह ढूँढ ही लेती है। "टपटा ने मुझे पकड़ लिया!" — और पलक झपकते ही वह बुत बने खड़े रहने से सीधे सरपट भागने लगा।',
      text: 'Something has LANDED ON MY BACK, thought the tiger. In the dark. Without a sound. It finds you wherever you sit. "TAPTA HAS GOT ME!" — and he went from standing still to full gallop in one heartbeat.' },
    { art: ['guard', 'pt_lion'], who: null,
      hi: 'और इस तरह वे पूरी रात धुआँधार भागते रहे: चोर दोनों हाथों से जकड़े हुए सोच रहा था कि यह मणिपुर की सबसे तेज़ गाय है — और बाघ गड्ढों को लाँघता हुआ उड़ता जा रहा था और सोच रहा था, टपटा मुझ पर सवार है, टपटा मुझ पर सवार है, और अगर मैं रुका तो यह मुझे खा जाएगा। दोनों में से किसी की भी हिम्मत छोड़ने की नहीं हुई।',
      text: 'And so they went through the night, flat out: the thief hanging on with both hands thinking, this is the fastest cow in Manipur — and the tiger flying over ditches thinking, Tapta rides me, Tapta rides me, and if I stop it will eat me. Neither one of them dared let go.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'पौ फटते ही चोर ने नीचे देखा और उसे धारियाँ नज़र आईं। उसके मुँह से ऐसी आवाज़ निकली जिसे आज तक कोई सही-सही लिख नहीं पाया है, वह सीधा एक गूलर के पेड़ पर चढ़ गया और दोपहर तक वहीं दुबका रहा। बाघ ने जब महसूस किया कि वह भयानक बोझ उसकी पीठ से हट गया है, तो वह और भी तेज़ भागा — और कुछ लोग कहते हैं कि वह आज भी भाग ही रहा है।',
      text: 'At first light the thief looked down and saw stripes. He made a sound no one has spelled correctly to this day, went straight up into a fig tree, and stayed there until noon. The tiger, feeling the terrible weight leave his back, ran faster — and some say he is running still.' },
    { art: ['courtier'], who: null,
      hi: 'बूढ़ी अम्मा जब जागीं, तो सुबह बिल्कुल शांत और धुली-धुली सी थी। उनकी गाय ठीक वहीं थी जहाँ उसे होना चाहिए था। उन्हें कभी पता ही नहीं चला कि रात भर पहाड़ों के सबसे डरावने शब्द ने उनकी रखवाली की थी — और वह शब्द खुद उन्हीं का था।',
      text: 'The old woman woke to a quiet, rinsed morning. Her cow was exactly where it should be. She never knew she had been guarded all night by the most frightening word in the hills — which was hers.' },
    { art: ['pt_lion'], who: 'mithu',
      hi: 'मैतेई बच्चे बारिश की रातों में ख़ास तौर पर तप्ता की कहानी सुनने की ज़िद करते हैं, क्योंकि जब सचमुच बूँदें टपक रही हों, तब मज़ा और बढ़ जाता है। डर ज़्यादातर वही चीज़ है जिसे आपने अभी तक उजाले में देखा नहीं है।',
      text: 'Meitei children ask for Tapta on rainy nights especially, because it is better with the drip actually going. Fear is mostly a thing you have not looked at in the light yet.' }
  ],
  moral: 'The scariest thing in the dark is usually a small thing you have not seen in daylight yet.',
  source: 'Tapta — a Meitei phunga wari (fireside tale) of Manipur, beloved on rainy nights; kin tellings of the "terrible drip" are told across India. Many versions.'
},

{
  id: 'fk.phunga-wari',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Fire Where the Stories Live',
  hook: 'In a Meitei kitchen there is a hearth, and around the hearth there is a rule: this is where the stories happen.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 3,
  place: ['IN-MN'],
  words_hi: [['चूल्हा', 'chulha', 'hearth'], ['कहानी', 'kahani', 'story'], ['सर्दी', 'sardi', 'winter']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'मैतेई घर में रसोई के चूल्हे का अपना एक नाम होता है: फुंगा। और इसके इर्द-गिर्द सुनाई जाने वाली कहानियों का भी अपना एक नाम होता है — फुंगा वारी, जिसका सीधा सा मतलब है चूल्हे के पास की कहानियाँ। पेबेट ऐसी ही एक कहानी है। सांद्रेंबी भी एक है। तप्ता भी एक है। ये सब की सब आग के पास ही बसती हैं।',
      text: 'In a Meitei house the kitchen fire has a name of its own: the phunga. And the stories told around it have a name of their own too — phunga wari, which means, exactly, hearthside tales. Pebet is one. Sandrembi is one. Tapta is one. They all live at the fire.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'ठंड के जिस महीने को मैतेई कैलेंडर में वाकचिंग कहते हैं, उसमें शामें लंबी हो जाती हैं और घाटी में कोहरा उतर आता है, और वही मौसम होता है जब फुंगा अपने होने का पूरा मोल चुकाता है। रात का खाना खत्म होते ही बच्चे पास-पास सिमट कर बैठ जाते हैं, सबसे छोटा बच्चा आग की गरमाहट के सबसे क़रीब।',
      text: 'In the cold month the Meitei calendar calls Wakching, the evenings turn long and the valley fog comes down, and that is the season the phunga earns its keep. Dinner done, the children fold themselves in close, smallest nearest the warmth.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'दादी के कुछ नियम थे, और वे नियम बहुत पुराने थे। किसी को कुछ भी सुनाने से पहले आग को खिलाया जाता है। कहानियाँ रात के खाने के बाद शुरू होती हैं, "क्योंकि खाली पेट कहानी सुनने बैठो तो बीच में रुकावट आ ही जाती है।" और कोई यह नहीं पूछता कि कहानी कैसे ख़त्म होती है। जब ख़त्म होनी होती है, तभी ख़त्म होती है।',
      text: 'Grandmother had rules, and the rules were old. The fire is fed before anybody is told anything. Stories come after dinner, "because a story on an empty stomach gets interrupted." And nobody asks how a story ends. It ends when it ends.' },
    { art: ['courtier'], who: null,
      hi: 'और चूल्हा महज़ कोई सामान या फ़र्नीचर नहीं है। हर सर्दी में, इमोइनु ईरातपा के मौके पर, रसोई का सबसे बढ़िया खाना इमोइनु के आगे परोसा जाता है, जो चूल्हे और सुख-समृद्धि की दयालु देवी हैं — क्योंकि एक मैतेई घर में, आग के पास सचमुच कोई रहता है, उस तरह से जिससे फ़र्क पड़ता है।',
      text: 'And the hearth itself is not furniture. Every winter, at Emoinu Eratpa, the best of the kitchen is set out for Emoinu, the kindly goddess of the hearth and of plenty — because in a Meitei home, somebody lives at the fire, in the way that matters.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'एक रात सबसे छोटे लड़के को कहानी अभी के अभी सुननी थी, इससे पहले कि आग में लकड़ियाँ डाली जातीं।',
      text: 'One night the littlest boy wanted the story right now, before the wood was in.',
      ask: {
        q: 'Little brother wants the story to start before the fire is fed. What does grandmother say?',
        options: ['Story first, fire later', 'The fire eats first', 'No story tonight'],
        answer: 1,
        right: '"The fire eats first," she says. "It has been holding this family up since before your grandfather could walk. Feed it, then sit."',
        wrong: 'She says the old rule: "The fire eats first. It has held this family up since before your grandfather could walk. Feed it, then sit."'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'तो लकड़ियाँ आग में डाली गईं, लपटें ऊपर उठने लगीं, और दादी ने सुनाना शुरू किया — आज रात पेबेट की कहानी, क्योंकि सबसे छोटे वाले को कंटीली झाड़ी वाला हिस्सा बहुत पसंद था। आधी कहानी होते-होते वह अपनी बहन की बाँह से टिककर सो गया, और जब उसे उठाकर बिस्तर पर ले जाया गया, तब भी उसने उसकी आस्तीन को मुट्ठी में भींच रखा था।',
      text: 'So the wood went in, and the flames sat up, and grandmother began — Pebet tonight, because the littlest liked the part with the thorn bush. Halfway through, he was asleep against his sister\'s arm, and was carried to bed still holding a fistful of her sleeve.' },
    { art: ['guard'], who: 'guard',
      hi: '"कहानी इंतज़ार करती है," आग को सहेजते हुए दादी ने कहा। "कल तक यह बिल्कुल वहीं ठहरी रहेगी, जहाँ रुकी है।" उन्होंने खुद यह कहानी एक फुंगा के पास अपनी दादी से सीखी थी, जिन्होंने इसे किसी और फुंगा के पास सीखा था। कहानी एक ऐसी आग है, जो दूसरों को बाँटने से ही जलती रहती है।',
      text: '"The story waits," said grandmother, banking the fire. "It stops exactly where it stopped, until tomorrow." She had learned it at a phunga herself, from her own grandmother, who had learned it at another one. A story is a fire that is fed by being given away.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगर तुम्हारे परिवार में भी कोई ऐसी जगह है जहाँ कहानियाँ चलती हैं — कोई रसोई, कोई बालकनी, या किसी लंबे सफ़र में गाड़ी की पिछली सीट — तो वही तुम्हारा फुंगा है। आज रात वहाँ बैठकर किसी कहानी की माँग करो और देखो क्या निकलकर आता है।',
      text: 'If your family has a place where the stories happen — a kitchen, a balcony, the back seat on a long drive — that is your phunga. Ask for a story there tonight and see what comes out.' }
  ],
  moral: 'Feed the fire, feed the family, then feed the story. A house that keeps all three stays warm.',
  source: 'The phunga, the hearth of a Meitei kitchen in Manipur, and phunga wari, the hearthside tales told around it; Emoinu, goddess of hearth and plenty, is honoured at Emoinu Eratpa each winter. As lived in many Meitei families — homes differ, and that is as it should be.'
},

{
  id: 'fk.lai-haraoba',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Dance That Remembers the Making',
  hook: 'The dancers\' hands kept making small, careful shapes. Her grandfather could read every one.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['नाच', 'naach', 'dance'], ['हाथ', 'haath', 'hand'], ['याद', 'yaad', 'memory']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'हर साल, जब मौसम आता है, तो मैतेई बस्ती अपने पुराने देवता के थान पर लाई हराओबा मनाती है — जो उमंग लाई में से एक हैं, यानी पवित्र उपवनों के देवता। इस नाम का मतलब है देवताओं का आनंद-उत्सव। डरना नहीं। मौज-मस्ती और उत्सव मनाना।',
      text: 'Every year, when the season comes, a Meitei neighbourhood holds Lai Haraoba at the shrine of its own old god — one of the umang lai, the deities of the sacred groves. The name means the merrymaking of the gods. Not the fearing. The merrymaking.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'इबेम्मा नाम की एक बच्ची अपने दादाजी के साथ गई। पेना बजाने वाले पेना बजा रहे थे — वह छोटा-सा सारंगी-जैसा साज़ जिसकी यादें बहुत पुरानी हैं — और माइबी, यानी पुजारिनें, धीमी कतार में नाच रही थीं, और उनके हाथ बार-बार सधी हुई, नपी-तुली छोटी-छोटी मुद्राएँ बना रहे थे।',
      text: 'A girl called Ibemma went with her grandfather. The pena players were playing — the little fiddle with the long memory — and the maibis, the priestesses, were dancing in a slow line, and their hands were making small, careful, exact shapes, over and over.' },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: '"हाथों को देखो," दादाजी ने धीरे से फुसफुसाकर कहा। "अब वे शरीर बना रहे हैं — देखो, पहले सिर, फिर पसलियाँ, और फिर एक-एक करके जोड़। अब घर बन रहा है — खंभे खड़े हो रहे हैं, शहतीरें बिछ रही हैं, और उनके ऊपर छप्पर आ रहा है।"',
      text: '"Watch the hands," her grandfather whispered. "Now they are making the body — see, the head, then the ribs, then the joints, one by one. Now the house — the posts going up, the beams across, the thatch coming down over it."' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'हाथ चलते रहे। उन्होंने कपास बोई। उसे चुना। फिर कातकर सूत बनाया और सूत से कपड़ा, और वह कपड़ा — एक बेहद खूबसूरत आखिरी इशारे के साथ — किसी के कंधों पर लपेट दिया गया। बीज से लेकर शॉल तक, सजने-संवरने का पूरा सफ़र, बस एक ही नाच के भीतर।',
      text: 'The hands went on. They planted cotton. They picked it. They spun it into thread, and the thread into cloth, and the cloth went — in one lovely last gesture — around a person\'s shoulders. The whole of getting dressed, from seed to shawl, inside one dance.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'इबेम्मा ने देखा कि वे हाथ फिर से वही पूरा सिलसिला दोहराने लगे थे, बड़े धीरज और बारीकी से, ठीक वैसे जैसे कोई ऐसी बात कह रहा हो जिसे वह कभी भुलाना नहीं चाहता।',
      text: 'Ibemma watched the hands begin the whole sequence again, patient and exact, like somebody saying a thing they refuse to let be forgotten.',
      ask: {
        q: 'The dancers\' hands keep making the same small shapes in order. What are the hands doing?',
        options: ['Decorating the dance', 'Telling how the world and the everyday things were made', 'Keeping the beat for the drummers'],
        answer: 1,
        right: 'Yes. It is the making of everything, told with hands — the body, the house, the cloth. The dance is a memory.',
        wrong: 'They are doing something bigger: telling how the world and the everyday things were made. The dance is a memory.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"बातों को लिख लेना याद रखने का एक तरीका है," दादाजी ने कहा। "यह दूसरा तरीका है। उससे भी पुराना। इसे किसी को पढ़ना आने की ज़रूरत नहीं — बस इसे नाचते रहो, और कुछ भी नहीं खोएगा।"',
      text: '"Writing things down is one way of remembering," said her grandfather. "This is another. Older. Nobody has to be able to read it — you only have to keep dancing it, and nothing is lost."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'पूरा मोहल्ला वहाँ मौजूद था — चाय की थरमस लिए आंटियाँ, लड़के जो ऐसे दिखा रहे थे जैसे उन्हें कोई दिलचस्पी न हो पर देख फिर भी रहे थे, और देवता जिन्हें इस सबका आनंद लेने के लिए नीचे बुलाया गया था, क्योंकि त्योहार का मतलब ही यही है: अपने ही लोगों द्वारा देवताओं को खुशियों से सराबोर करना।',
      text: 'The whole neighbourhood was there — the aunties with flasks of tea, the boys pretending not to be interested and watching anyway, the god invited down to enjoy it all, because that is what the festival is: the gods, being given a good time by their own people.' },
    { art: ['guard'], who: 'guard',
      hi: 'घर लौटते हुए दादाजी ने कहा: "जब तुम कुछ बोती हो, या कुछ बुनती हो, या कोई छत बनाती हो — तो तुम उन्हीं पावन कामों को धीरे-धीरे कर रही होती हो। माइबियाँ साल में एक बार यही काम बड़ी खूबसूरती से करती हैं, ताकि सबको याद रहे कि यह रोज़मर्रा का काम असल में क्या है।"',
      text: 'On the walk home her grandfather said: "When you plant something, or weave something, or build a roof — you are doing the holy things slowly. The maibis do them beautifully, once a year, so that everyone remembers what the ordinary work is."' },
    { art: ['courtier'], who: 'mithu',
      hi: '"हर साल पूरे मणिपुर में लाई हराओबा मनाया जाता है, और माइबियाँ ही इस पूरे उत्सव को सँभालती हैं — इतना सब कुछ कि मेरी किसी भी कहानी में न समा सके। अगर तुम्हें कभी इसे देखने का मौका मिले, तो वही करना जो दादाजी ने कहा था। हाथों को देखना।"',
      text: 'Lai Haraoba is kept across Manipur every year, and the maibis carry the whole of it — far more than fits in any telling of mine. If you ever get to watch it, do what the grandfather said. Watch the hands.' }
  ],
  moral: 'Planting, weaving, building a roof — the everyday things are worth a dance. That is why there is one.',
  source: 'Lai Haraoba, the Meitei festival for the umang lai in Manipur, whose maibi dances retell the making of the world and the crafts of daily life. Presented from the inside, as its keepers hold it; the full meaning belongs to the maibis and the tradition, and this is only a window on it.'
},

/* =========================================================== NAGALAND ===== */
{
  id: 'fk.ao-six-stones',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Six Stones and the River',
  hook: 'The Ao say their whole people came out of the earth at six stones — and then, one day, crossed a river and became themselves.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पत्थर', 'patthar', 'stone'], ['नदी', 'nadi', 'river'], ['पुल', 'pul', 'bridge']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"नागालैंड में किसी आओ बुज़ुर्ग से पूछो कि आओ लोगों की शुरुआत कहाँ से हुई, तो तुम्हें कोई गोल-मोल जवाब नहीं मिलेगा। तुम्हें एक जगह का नाम मिलेगा। दिखू नदी के ऊपर पहाड़ी कगार पर बसा चुंगलीयिमती — और चुंगलीयिमती में, छह पत्थर। आओ लोग उन्हें लोंगतेरोक कहते हैं: यानी छह पत्थर।"',
      text: 'Ask an Ao elder in Nagaland where the Ao people began, and you will not get a vague answer. You will get a place. Chungliyimti, on its ridge above the Dikhu river — and at Chungliyimti, six stones. Longterok, the Ao call them: the six stones.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"कहानियों के अनुसार, इन्हीं पत्थरों के पास धरती से निकलकर सबसे पहले पूर्वज आए — तीन पुरुष और तीन औरतें, ऊपर पहाड़ों की धूप भरी रोशनी में। कहीं और से नहीं। यहीं से। आओ ऐसे लोग हैं जिनकी शुरुआत का बाक़ायदा एक पता है।"',
      text: 'Out of the earth at those stones, the telling goes, came the first ancestors — three men and three women, up into the daylight of the hills. Not from somewhere else. From here. The Ao are a people whose beginning has an address.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"चुंगलीयिमती में उन्होंने जीने का पूरा सलीका सीखा: कौन-सा बीज कब बोना है, गाँव की चौपाल कैसे बैठती है, कौन-से मौसम का कौन-सा गीत है। उनकी आबादी बढ़ती गई। और पहाड़ की एक धार, चाहे कितनी भी अच्छी हो, उस पर गिने-चुने ही घर और सीमित ही खेत समा सकते हैं।"',
      text: 'At Chungliyimti they learned the whole of living: which seed goes in when, how a village council sits, which songs belong to which season. They grew many. And a ridge, however good, only holds so many houses and so many fields.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"दिखू नदी के उस पार ऐसी पहाड़ियाँ फैली थीं जहाँ कोई नहीं रहता था — हरी-भरी, तह-दर-तह मुड़ी हुईं, और थमी हुई साँस की तरह सूनी। पर दिखू नदी बड़ी तेज़ और ठंडी है, और पार जाने का कोई रास्ता न था। सो उन्होंने एक रास्ता बनाया: बेंत को गूँथकर बना एक पुल, जो इस किनारे से उस किनारे तक झूलता था, बिल्कुल वैसा जैसा इन पहाड़ों में आज भी बनाना जानते हैं।"',
      text: 'Across the Dikhu river lay hills nobody had taken — green, folded, empty as a held breath. But the Dikhu is quick and cold, and there was no way over. So they made one: a bridge of woven cane, hung from bank to bank, the kind these hills still know how to build.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: '"नदी पार करने से पहली शाम, सारे परिवार देर रात तक आग के गिर्द बैठे यह तय करते रहे कि कोई इंसान ऐसी जगह अपने साथ क्या ले जाए जहाँ कुछ भी पहले से तैयार न हो।"',
      text: 'The evening before the crossing, the families sat late around the fires deciding what a person carries into a country where nothing is ready.',
      ask: {
        q: 'You can only carry so much across a swinging cane bridge. What do you take into a brand-new country?',
        options: ['Everything you can lift', 'The seed and the stories', 'Nothing — start completely fresh'],
        answer: 1,
        right: 'That is what they took. Seed for the first field, and the stories that told them who they were. Everything else can be built.',
        wrong: 'The elders chose differently: seed for the first field, and the stories that told them who they were. Everything else can be built.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"वे पार निकल गए — पीठ पर बच्चे, कसकर बँधी बीजों की टोकरियाँ, और पूरे कुनबे के भार से धीमी ढोलक की तरह झूलता हुआ पुल। और जो उस पार पहुँचे, उन्हें इस पार जाने से ही अपना नाम मिला। उनकी अपनी बोली में \'आओ\' का अर्थ ही है "वे जो पार चले गए।""',
      text: 'They crossed — children on backs, seed baskets tied tight, the bridge swaying like a slow drum under a whole people. And those who went over took a name from the going. Ao, in their tongue, carries the sense of "those who went across."' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"हर कोई पार नहीं गया। कुछ लोग पानी के उसी पुराने किनारे पर रह गए, और उनके बच्चों के बच्चे आज भी वहीं बसते हैं — अपने अलग नामों और अपनी अलग कहानियों वाले दूसरे समुदाय। नदी ने अपनों को परायों से अलग नहीं किया। उसने तो बस यह दर्ज कर लिया कि उस सुबह कौन सा परिवार कहाँ खड़ा था।"',
      text: 'Not everyone crossed. Some stayed on the old side of the water, and their children\'s children live there still, other peoples with their own names and their own tellings. The river did not divide family from stranger. It only wrote down where each family stood that morning.' },
    { art: ['guard'], who: null,
      hi: '"नए किनारे पर, आओ लोग पहाड़ियों की धार पर फैल गए और उन्होंने अपने गाँव ऊँचाई पर बनाए, जहाँ हवा साफ़ होती है और दूर से ही दिख जाता है कि कौन आ रहा है। और हर गाँव ने उन पत्थरों की कहानी सँभाले रखी — क्योंकि जो लोग यह जानते हैं कि उनकी शुरुआत कहाँ से हुई थी, उन्हें बिखेरना बहुत मुश्किल होता है।"',
      text: 'On the new side, the Ao spread along the ridges and built their villages high, where the air is clean and you can see who is coming, and every village kept the story of the stones — because a people who know where they began are very hard to scatter.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"लोंगतेरोक आज भी वहीं है, चुंगलीयिमती में, और आओ लोग आज भी उसे अपनी शुरुआत की जगह बताते हैं। छह पत्थर, एक नदी, एक बार का पार जाना। कुछ लोगों को विरासत में राजपाट मिलता है। आओ लोगों को विरासत में एक दिशा मिली।"',
      text: 'Longterok is still there, at Chungliyimti, and the Ao still name it as the place of beginning. Six stones, one river, one crossing. Some peoples inherit a kingdom. The Ao inherited a direction.' }
  ],
  moral: 'Carry the seed and the story, and you can start again anywhere.',
  source: 'Ao Naga oral tradition of Nagaland — the emergence of the first ancestors at Longterok, the six stones of Chungliyimti, and the crossing of the Dikhu river. Many tellings; details differ between villages and clans.'
},

{
  id: 'fk.makhel-pear',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Tree Where Everyone Said Goodbye',
  hook: 'Before they parted, they planted a tree — so that no matter how far the families walked, there would be one place that remembered they were one.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पेड़', 'ped', 'tree'], ['वादा', 'vaada', 'promise'], ['रिश्ता', 'rishta', 'kinship']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"नागालैंड के अंगामी — और उनके अपने चखेसांग, माओ, पोउमई और दूसरे लोग, जो मिलकर खुद को तेन्यिमिया कहते हैं — एक ऐसे गाँव की बात बताते हैं जहाँ बहुत पहले वे सब एक ही परिवार की तरह रहते थे। उसे माखेल कहते हैं। वह आज के राज्य की सीमा के बस ज़रा उस पार है, मगर नक्शों की लकीरें तो अभी कल की हैं, और यह कहानी बहुत पुरानी है।"',
      text: 'The Angami of Nagaland — and their kin, the Chakhesang, the Mao, the Poumai and others, who together call themselves Tenyimia — tell of a village where, long ago, all of them lived as one people. Makhel, it is called. It sits just over today\'s state line, but lines on maps are young, and this story is old.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"माखेल में वे सब एक ही चूल्हे के लोग थे: एक जैसी बोली, खेती का एक ही ढंग, और ऐसी शादियाँ जो सबकी दादी की आवाज़ पहुँचने जितनी दूरी पर ही हो जाती थीं। और वे खूब फले-फूले — इतने कि बच्चे बढ़ते ही गए और खेत कम पड़ गए।"',
      text: 'At Makhel they were one hearth-people: one language, one way of planting, weddings within shouting distance of everybody\'s grandmother. And they did well — so well that the fields ran out before the children did.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'सारे बड़े-बुज़ुर्ग बैठ गए, बिल्कुल वैसे ही जैसे कोई बहुत बड़ी बात होने पर बड़े बैठते हैं। आस-पास की पहाड़ियाँ फैली हुई और खाली थीं, और वे सबका पेट भर सकती थीं — लेकिन तभी, जब लोग एक ही गाँव में न रहकर कई गाँवों में बँट जाएँ। जिसका मतलब था वह बात, जिसे कोई सोच भी नहीं सकता था: एक-दूसरे से बिछड़ना।',
      text: 'The elders sat, the way elders sit when the news is big. The hills around were wide and empty and could feed everyone — but only if the people stopped being one village and became many. Which meant the unthinkable: parting.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'और बिछड़ने का डर उन्हें भूख से भी ज़्यादा डराता था। दूर चलने का डर नहीं — भूल जाने का डर। किसी ने कहा, तीन पीढ़ियाँ बीतने दो, और हमारे बच्चों के बच्चे रास्ते में एक-दूसरे के पास से गुज़र जाएँगे और पहचान भी नहीं पाएँगे कि वे अपने ही लोग हैं।',
      text: 'And parting frightened them more than hunger did. Not the walking — the forgetting. Give it three generations, somebody said, and our children\'s children will pass each other on a path and not know they are kin.',
      ask: {
        q: 'The families must scatter into the hills. How do you part without losing each other?',
        options: ['Promise to never part at all', 'Plant a living witness and swear before it', 'Draw a map of who went where'],
        answer: 1,
        right: 'That is what they did. A wild pear tree, set in the earth at Makhel — a witness with roots.',
        wrong: 'There were no maps then, and never-parting was not possible. They planted a living witness — a wild pear tree, set in the earth at Makhel — and swore before it.'
      } },
    { art: ['courtier'], who: 'courtier', mood: 'wow',
      hi: 'उस पेड़ के सामने उन्होंने एक-दूसरे को वचन दिया: हम चाहे जितनी भी दूर चले जाएँ, हम एक ही रहेंगे। यह पेड़ यहाँ खड़ा रहेगा और इस बात को याद रखेगा। और कुछ कहानियों में एक शांत सा वादा और जोड़ा जाता है — कि एक दिन, जब सही वक़्त आएगा, तो ये सारे बिछड़े हुए परिवार फिर से इसी जगह इकट्ठा होंगे।',
      text: 'Before the tree they made their word: we are one, however far we walk. The tree will stand here and know it. And some tellings add a quiet promise on top — that one day, when the time is right, the scattered families will gather again at this spot.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'फिर वे चल पड़े — एक-एक करके सारे कुनबे, अलग-अलग घाटियों की तरफ़, अलग-अलग दर्रों के पार। वक़्त के साथ उनकी बोलियाँ बदलती चली गईं, उनके बुने कपड़ों के तौर-तरीके बदल गए, और एक ही चाँद के उनके गाँवों में अलग-अलग नाम पड़ गए। वे वैसे ही कई अलग-अलग लोग बन गए, जैसे वे आज हैं।',
      text: 'Then they went — clan by clan, up different valleys, over different passes. In time their speech drifted apart, their weaves took different patterns, their villages got different names for the same moon. They became the many peoples they are today.' },
    { art: ['guard'], who: null,
      hi: 'मगर वह नाशपाती का पेड़ वहीं खड़ा रहा। और अब वह बात आती है जिससे आपके रोंगटे खड़े हो जाएँ: वह पेड़ आज भी खड़ा है। और जब उस पुराने पेड़ की कोई डाली गिरती है, तो वे सारे गाँव जो अपनी जड़ें माखेल से जोड़ते हैं — उन सभी पहाड़ियों पर, अपनी-अपनी अलग भाषाओं में — उस दिन आराम करते हैं, बिल्कुल वैसे जैसे कोई परिवार अपने किसी अपने की खबर पर रुक जाता है।',
      text: 'But the pear tree stood. And here is the part that should raise the hair on your arms: it stands now. And when a branch of that old tree falls, villages that trace themselves to Makhel — across all those hills, in all those languages — keep a day of rest for it, like family marking family news.' },
    { art: ['courtier'], who: null,
      hi: 'ज़रा सोचिए। एक ऐसा संदेश जिसे न तार की ज़रूरत है और न चिट्ठी की: माखेल के पेड़ की एक डाली टूट गई है, और हफ़्ते भर की पैदल दूरी पर बसी पहाड़ियाँ उसी एक दिन शांत हो जाती हैं, क्योंकि किसी की परदादी की परदादी के ज़माने से भी पहले किया गया एक वादा आज भी निभाया जा रहा है।',
      text: 'Think of that. A message that needs no wire and no letter: the tree at Makhel has lost a branch, and hillsides a week\'s walk apart go quiet on the same day, because a promise made before anyone\'s great-great-grandmother is still being kept.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'लोग अलग हो जाते हैं। भाषाएँ बदल जाती हैं। यह कोई दुख की बात नहीं है — ऐसे ही तो एक गाँव पहाड़ों के दर्जनों देश बन जाता है। तेन्यिमिया लोग यह तरकीब जानते थे कि पीछे एक ऐसी जीती-जागती चीज़ खड़ी छोड़ दो, जिसे याद रहे कि कभी तुम सब एक थे।',
      text: 'Peoples part. Languages drift. That is not a tragedy — it is how one village becomes a dozen nations of the hills. The trick the Tenyimia knew is to leave one living thing standing that remembers you were one.' }
  ],
  moral: 'If you must scatter, plant something first that remembers you together.',
  source: 'Angami and wider Tenyimia oral tradition — the dispersal of the peoples from Makhel and the wild pear tree planted there as witness; villages tracing descent from Makhel still observe a day of rest when a branch falls. Many tellings across the Tenyimia communities of Nagaland and beyond.'
},

{
  id: 'fk.naga-rooster-sun',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Rooster Who Keeps the Sun\'s Appointment',
  hook: 'The sun stopped rising on time. The animals sent their loudest. They should have sent their politest.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'pt_lion', 'pt_elephant'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['सुबह', 'subah', 'morning'], ['मुर्गा', 'murga', 'rooster']],
  scenes: [
    { art: ['pt_elephant'], who: null,
      hi: 'कोहिमा के आस-पास अंगामी इलाके में लोग सुनाते हैं कि बहुत समय पहले, सूरज अपने समय का हिसाब भूल गई थी। किसी ने उसे कभी बताया ही नहीं था कि सुबह कब होती है — वह तो बस अंदाज़ा लगाती थी। और एक मौसम, किसी ऐसी बात पर रूठकर और थककर—जिसके बारे में कहानियों में अलग-अलग बातें मिलती हैं—उसने अंदाज़ा लगाना भी छोड़ दिया। वह देर से उगी। फिर और भी देर से। और फिर मानो उगना ही बंद कर दिया।',
      text: 'In the Angami country around Kohima they tell that once, long ago, the sun lost her timekeeping. Nobody had ever told her when morning was — she had always guessed. And one season, tired and huffy after some slight the tellings disagree about, she stopped guessing. She rose late. Then later. Then hardly at all.' },
    { art: ['pt_elephant'], who: null, mood: 'sad',
      hi: 'पहाड़ धुंधले पड़ गए और धुंधले ही रहे। खेतों में धान मुँह फुलाए पड़ा रहा। लोग अँधेरे में उठते, अँधेरे में काम करते, और यह भी भूलने लगे कि कौन-सा खाना किस वक़्त का था। कुछ-न-कुछ तो करना ही था, और जानवरों ने — हमेशा की तरह — इस बात पर एक सभा बुलाई।',
      text: 'The hills went grey and stayed grey. The rice sulked in the fields. People got up in the dark, worked in the dark, and started forgetting which meal was which. Something had to be done, and the animals — as usual — held a meeting about it.' },
    { art: ['pt_lion'], who: 'pt_lion', mood: 'wow',
      hi: '"वह सोती ही रह गई है," बाघ ने कहा। "मैं उसे जगाता हूँ।" और वह सबसे ऊँची पहाड़ी पर चढ़ गया और आसमान की तरफ देखकर तब तक दहाड़ा जब तक बाँस थरथराने न लगे। सूरज ने बादलों की चादर अपने सिर पर खींच ली और ज़रा-सी भी नहीं हिली।',
      text: '"She has overslept," said the tiger. "I will wake her." And he climbed the highest ridge and roared at the sky until the bamboo rattled. The sun pulled the clouds over her head like a blanket and did not so much as stir.' },
    { art: ['pt_elephant'], who: 'pt_elephant',
      hi: 'घाटी के नीचे से हाथी चिंघाड़ा। भालू फुफकारा। बड़े हॉर्नबिल पक्षी ने अपने पंख ऐसे फड़फड़ाए जैसे पेड़ गिर रहे हों। यह उन पहाड़ों के इतिहास की सबसे शोर भरी सुबह थी, मगर सुबह का कहीं नामोनिशान नहीं हुआ।',
      text: 'The elephant trumpeted from the valley floor. The bear huffed. The great hornbill clapped his wings like falling trees. It was the loudest morning in the history of the hills, and it produced no morning whatsoever.' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'सभा में सबसे पीछे मुर्गा खड़ा था, जो छोटा-सा था, और चिल्लाने के बजाय चुपचाप सबकी बातें सुन रहा था।',
      text: 'At the back of the meeting stood the rooster, who was small, and had been listening instead of shouting.',
      ask: {
        q: 'All the loud ones have failed. Who can wake the sun without making her crosser?',
        options: ['Somebody even louder', 'Somebody polite, who asks instead of demands', 'Nobody — light more fires'],
        answer: 1,
        right: 'Yes. The rooster went up alone — and he did not shout at her. He asked.',
        wrong: 'Louder had been tried. The rooster went up alone — and he did not shout at her. He asked.'
      } },
    { art: ['pt_crow'], who: 'pt_crow',
      hi: 'मुर्गा पहाड़ी की चोटी पर चढ़ा, पूरब की तरफ़ मुँह किया, और सधी हुई आवाज़ में बोला: "सूरज दादी। किसी ने कभी वक़्त का हिसाब रखने में आपकी मदद नहीं की, और यह हमारी ग़लती थी, आपकी नहीं। अगर मैं आपको आवाज़ दूँ तो कैसा रहेगा? हर सुबह, बिना चूके। आपको फिर कभी अंदाज़ा लगाने की ज़रूरत नहीं पड़ेगी।"',
      text: 'The rooster climbed to the ridge, faced east, and said, at a reasonable volume: "Grandmother Sun. Nobody has ever helped you keep the time, and that was our fault, not yours. Suppose I call you? Every morning, without fail. You would never have to guess again."' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'काफ़ी देर ख़ामोशी छाई रही। फिर बादल ज़रा से छँटे, बिल्कुल वैसे जैसे कंबल के अंदर लेटा कोई सुनने के लिए उसे हल्का सा उठाता है। "हर सुबह?" सूरज ने पूछा। "बिना चूके?" "बिना चूके," मुर्गा बोला। "बस यही मेरा एकमात्र काम होगा, और मैं इसे पूरे गर्व के साथ करूँगा।"',
      text: 'There was a long pause. Then the clouds thinned, just a little, the way a blanket lifts when someone under it is listening. "Every morning?" said the sun. "Without fail?" "Without fail," said the rooster. "It will be the whole of my job, and I will do it proudly."' },
    { art: ['pt_crow', 'pt_elephant'], who: null,
      hi: 'और यही तय हुआ। वह आवाज़ देता है; सूरज दादी चली आती हैं। यही वजह है कि मुर्गा एकदम तनकर खड़ा रहता है और अपनी कलगी को एक छोटे लाल झंडे की तरह फहराए रखता है — वह कोई दिखावा नहीं कर रहा, वह तो अपनी ड्यूटी पर तैनात है। और इसीलिए, अंगामी गाँव में, मुर्गे की पहली बाँग ही दिन की असली शुरुआत मानी जाती है, चाहे घड़ियाँ कुछ भी कहें।',
      text: 'And that was the bargain. He calls; she comes. It is why the rooster stands so straight and wears his comb like a little red flag — he is not showing off, he is on duty. And it is why, in an Angami village, the first crow of the rooster is the real start of the day, whatever any clock says.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: 'मेघालय के पहाड़ी दर्रों के उस पार, खासी लोग भी मुर्गे और छिपे हुए सूरज की ऐसी ही एक मिलती-जुलती कहानी सुनाते हैं — यह ऐप वह कहानी भी लेकर आया है। पहाड़ आपस में मौसम साझा करते हैं, और कहानियाँ भी उन्हीं दर्रों से होकर सफ़र करती हैं जहाँ से लोग गुज़रते हैं। हर समुदाय इसे अपने तरीक़े से सुनाता है, और हर तरीक़ा अपने आप में अनोखा है।',
      text: 'Across the passes in Meghalaya, the Khasi tell their own kin story of a rooster and a hidden sun — this app carries that one too. Hills share weather, and stories travel the same passes people do. Each people tells it its own way, and each way is its own.' }
  ],
  moral: 'What loudness cannot do, a polite offer of help often can.',
  source: 'Told in the Naga hills; this telling follows versions from the Angami country around Kohima, Nagaland. The Khasi of Meghalaya tell a kin tale of their own, carried elsewhere in this app. Many versions.'
},

{
  id: 'fk.hornbill-honour',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Why the Hornbill Feather Is Earned',
  hook: 'Of all the birds in the forest, why does the greatest honour in the Naga hills belong to this one?',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['पंख', 'pankh', 'feather'], ['सम्मान', 'sammaan', 'honour'], ['वचन', 'vachan', 'word / promise']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'नागा पहाड़ियों के पुराने पहनावे में, पंख सिर्फ़ सजावट नहीं था। हॉर्नबिल का पंख, जो काले-सफ़ेद धारियों के साथ किसी दस्तख़त जैसा दिखता था, सिर के साफ़े में लगाया जाता था — और वह भी सिर्फ़ उसकी मर्ज़ी से नहीं जो इसे पहनना चाहे। इसे कमाना पड़ता था, और गाँव में हर किसी को ठीक-ठीक पता होता था कि इसे किसने और कैसे कमाया है।',
      text: 'In the old dress of the Naga hills, a feather was not decoration. A hornbill feather, black and white and banded like a signature, was worn in the headdress — and not by whoever wanted one. It was earned, and everyone in the village knew exactly who had earned it and how.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'एक लड़के ने अपने दादाजी से इस बारे में पूछा, क्योंकि दादाजी होते ही इसीलिए हैं। "मोर ज़्यादा चमकदार होते हैं," उसने कहा। "चील ज़्यादा ख़ूँख़ार होती हैं। फिर सम्मान का पंख हॉर्नबिल का ही क्यों है?" उसके दादाजी ने कहा: "क्योंकि हॉर्नबिल वो काम करता है जिसे कोई नहीं देखता। आओ। मैं तुम्हें एक घोंसला दिखाता हूँ।"',
      text: 'A boy asked his grandfather about it, because grandfathers are for that. "Peacocks are brighter," he said. "Eagles are fiercer. Why is the honour feather a hornbill\'s?" His grandfather said: "Because of what the hornbill does that nobody watches. Come. I will show you a nest."' },
    { art: ['pt_crow'], who: null,
      hi: 'एक बड़े, पुराने पेड़ पर काफ़ी ऊपर एक छेद था, और उस छेद को कीचड़ से इस तरह बंद कर दिया गया था कि बस एक पतली-सी झिरी बची थी। "माँ अंदर है," दादाजी ने कहा। "उसने अंडों के साथ खुद को अंदर बंद कर लिया है। वह महीनों तक बाहर नहीं आएगी। वह बाहर आ भी नहीं सकती। उसने जान-बूझकर पूरा आसमान छोड़ दिया है।"',
      text: 'High in a great old tree there was a hole, and the hole was walled up with mud until only a slit was left. "The mother is inside," said his grandfather. "She sealed herself in, with the eggs. She will not come out for months. She cannot come out. She has given up the whole sky on purpose."' },
    { art: ['pt_crow', 'guard'], who: null, mood: 'wow',
      hi: 'और जब वे देख ही रहे थे, वह विशाल नर घाटी से पंख फड़फड़ाता हुआ ऊपर आया — काले और सफ़ेद रंगों वाला एक मीटर लंबा परिंदा, जिसके पंखों की आवाज़ उसे देखने से पहले ही सुनाई दे जाती है — और वह उस झिरी पर आ बैठा, और अपने गले से निकाल-निकालकर एक-एक फल अंदर पहुँचाने लगा। फिर वह और फल ढूँढने उड़ गया।',
      text: 'And as they watched, the great male came beating up the valley — a metre of black and white with a wingbeat you can hear before you see him — and landed at the slit, and passed in fruit, one piece at a time, from his own throat. Then he flew off to find more.' },
    { art: ['guard'], who: 'guard',
      hi: '"वह दिन भर यही करता है," दादाजी ने कहा। "हर दिन। महीनों तक। अगर वह रुक जाए, तो वे भूखे मर जाएँगे — न कोई दूसरा मौका मिलेगा और न कोई दूसरा आएगा। बारिश हो, तेज़ हवा हो, या वे मुश्किल हफ़्ते जब फल बहुत कम मिलते हैं: वह फिर भी आता है। कोई ताली नहीं बजाता। जंगल इस पर ध्यान तक नहीं देता।"',
      text: '"He does that all day," said the grandfather. "Every day. For months. If he stops, they starve — there is no second chance and no one else coming. Rain, wind, lean weeks when fruit is scarce: he comes anyway. Nobody applauds. The forest does not even notice."' },
    { art: ['pt_crow'], who: null, mood: 'think',
      hi: 'लड़का देर तक पेड़ की उस झिरी को देखता रहा।',
      text: 'The boy looked at the slit in the tree for a long time.',
      ask: {
        q: 'So why is the hornbill\'s the honour feather — of all the birds?',
        options: ['Because it is the biggest bird', 'Because it keeps faith when nobody is watching', 'Because its feathers are the prettiest'],
        answer: 1,
        right: 'That is the answer his grandfather wanted. The feather stands for a promise kept in private, every day, for as long as it takes.',
        wrong: 'Bigger and prettier birds exist. The feather stands for what the hornbill keeps: a promise, in private, every day, for as long as it takes.'
      } },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"इसलिए जब कोई आदमी वह पंख लगाता था," दादाजी ने कहा, "तो गाँव का कहना होता था: इस इंसान की ज़ुबान हॉर्नबिल जैसी पक्की है। वह फल लेकर ज़रूर लौटेगा। इन पहाड़ियों में यह बात सोने से भी ज़्यादा कीमती थी, क्योंकि इन पहाड़ियों में हम एक-दूसरे के वादे के भरोसे जीते थे।"',
      text: '"So when a man wore that feather," said his grandfather, "the village was saying: this one\'s word holds like the hornbill\'s. He will come back with the fruit. In these hills that was worth more than gold, because in these hills we lived by each other\'s word."' },
    { art: ['pt_crow'], who: null,
      hi: 'महीनों बाद लड़के ने देखा कि कीचड़ की दीवार टूट चुकी थी और पूरा परिवार डाली पर बाहर आ गया था — माँ दुबली लेकिन शानदार लग रही थी, बच्चे खूब शोर मचा रहे थे, और सच कहें तो, पिता पूरी तरह थका हुआ दिख रहा था। किसी ने उसे कोई पंख नहीं दिया। वह खुद ही वह पंख था।',
      text: 'Months later the boy saw the mud wall broken open and the whole family out on the branch — the mother thin and glorious, the young ones loud, the father looking, frankly, exhausted. Nobody gave him a feather. He was the feather.' },
    { art: ['pt_crow'], who: 'mithu',
      hi: '"घोंसले के बारे में यह सारी बातें प्रकृति का बिल्कुल सच हैं — तुम खुद भी ढूँढकर देख सकते हो, और तुम्हें देखना भी चाहिए, क्योंकि बारीकियों में यह और भी मज़ेदार है। किसी भी किताब में लिखे जाने से सदियों पहले नागा लोगों ने इसे देखा था, और तय किया कि यह सबसे ऊँचे दर्जे का हक़दार है। और वे बिल्कुल सही थे।"',
      text: 'All of that about the nest is true natural history — you can look it up, and you should, because it is even better in the details. The Naga peoples watched it first, centuries before any book did, and decided it deserved the highest shelf. They were right.' }
  ],
  moral: 'The highest honours are for promises kept when nobody is watching.',
  source: 'The great hornbill is honoured across the Naga communities of Nagaland, and its feathers marked earned honour in the old dress. The bird\'s faithfulness at the sealed nest is real natural history. Told here the way elders explain it; tellings and customs differ between communities.'
},

{
  id: 'fk.hornbill-kisama',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Festival of Festivals',
  hook: 'Every December, on one hillside, all the peoples of Nagaland build their houses side by side — on purpose.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_crow'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['त्योहार', 'tyohaar', 'festival'], ['ढोल', 'dhol', 'drum'], ['पड़ोसी', 'padosi', 'neighbour']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"नागालैंड किसी एक समुदाय का नहीं है। यहाँ कई समुदाय हैं — आओ, अंगामी, सूमी, लोथा, कोन्याक, चाखेसांग, रेंगमा, और भी बहुत से — हर एक की अपनी भाषा, अपनी बुनाई, अपने त्योहार, और घर बनाने का अपना अनोखा तरीका। एक कोन्याक और एक अंगामी उतने ही अलग हैं जितने एक तमिल और एक पंजाबी, और उन्हें इस बात का पूरा भरोसा भी है।"',
      text: 'Nagaland is not one people. It is many — Ao, Angami, Sumi, Lotha, Konyak, Chakhesang, Rengma, and more — each with its own language, its own weave, its own festivals, its own way of building a house. A Konyak and an Angami are as different as a Tamil and a Punjabi, and just as sure about it.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"साल के ज़्यादातर दिनों में, हर समुदाय अपनी-अपनी पहाड़ियों पर अपने त्योहार मनाता है। लेकिन दिसंबर में कुछ अलग ही होता है। कोहिमा के पास किसामा नाम की एक पहाड़ी ढलान पर एक ऐसा गाँव बसता है जो किसी एक समुदाय का नहीं है — क्योंकि वह उन सबका है। हर समुदाय के लिए एक \'मोरुंग\' यानी एक बड़ा घर, एक ही कतार में अगल-बगल बना हुआ।"',
      text: 'For most of the year, each people keeps its own feasts in its own hills. But in December, something else happens. On a hillside called Kisama, near Kohima, a village stands that belongs to no one people — because it belongs to all of them. A morung, a great house, for each community, side by side in one row.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"यह है हॉर्नबिल उत्सव। दस दिनों के लिए पूरा राज्य किसामा में उमड़ पड़ता है: ढलानों के आर-पार एक-दूसरे की थाप पर गूँजते लकड़ी के नगाड़े, लाल और काले रंगों की दर्जनों छटाओं में थिरकते नर्तक, पहलवान, गायक, आग जलाने वाले करतबबाज़, और पहाड़ियों की हर रसोई की परंपरा का खाना, जो सब एक साथ पक रहा होता है।"',
      text: 'This is the Hornbill Festival. For ten days the whole state comes to Kisama: log drums answering each other across the slope, dancers in a dozen different reds and blacks, wrestlers, singers, fire-makers, and food from every kitchen tradition in the hills, all cooking at once.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"एक बच्ची अपने पिताजी के साथ आई, और इस सब के बीचों-बीच खड़े होकर धीरे-धीरे गोल घूमी। \\"मुझे ठीक इसी जगह खड़े होकर पाँच भाषाएँ सुनाई दे रही हैं,\\" उसने कहा। \\"छह,\\" पिताजी बोले। \\"तुम्हारे पीछे वाली आंटियों ने अभी-अभी दूसरी भाषा शुरू कर दी।\\""',
      text: 'A girl came with her father, and stood in the middle of it, turning slowly. "I can hear five languages from this exact spot," she said. "Six," said her father. "The aunties behind you switched."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"और फिर उसने वह बढ़िया सवाल पूछा, जिस पर एक कहानी बनती है।"',
      text: 'And she asked the good question, the one worth a story.',
      ask: {
        q: 'How can one festival belong to so many different peoples at once?',
        options: ['Because they are all really the same underneath', 'Because it is named for something every one of them honours', 'Because somebody makes them attend'],
        answer: 1,
        right: 'Yes — the hornbill. Every community here is distinct, and every one of them honours that bird. The festival stands on the one thing all the different houses share.',
        wrong: 'Not sameness — these are genuinely different peoples, and nobody is made to come. It is named for the hornbill, the bird every one of them honours. The festival stands on the one thing all the different houses share.'
      } },
    { art: ['pt_crow'], who: null,
      hi: '"हॉर्नबिल हर नागा समुदाय के गीतों और कहानियों में उड़ता नज़र आता है — हर किसी के यहाँ अलग तरह से, और यही तो ख़ास बात है। इस त्योहार ने किसी से भी एक जैसा बनने को नहीं कहा। इसने तो बस सबसे यही कहा कि वे जैसे हैं, वैसे ही चले आएँ, और अपनी पहचान को एक कतार में सजाएँ ताकि बाकी सब उसकी तारीफ़ कर सकें।"',
      text: 'The hornbill flies through the songs and stories of every Naga people — each one differently, and that is the point. The festival did not ask anyone to become alike. It asked everyone to bring what they already were, and put it in a row where the others could admire it.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"इसलिए उस लड़की ने आओ मोरुंग के बाहर बैठकर कोन्याक खाना खाया, जबकि चखेसांग ढोल वादक ढोल बजा रहे थे, और किसी को भी यह अजीब नहीं लगा, क्योंकि दिसंबर के दस दिनों में किसामा बना ही इसी के लिए है।"',
      text: 'So the girl ate Konyak food outside an Ao morung while Chakhesang drummers played, and nobody thought that was strange, because for ten days in December that is exactly what Kisama is for.' },
    { art: ['courtier'], who: null,
      hi: '"जब वे वहाँ से निकले, तो उसके पिता ने उसके लिए एक शॉल खरीदी — किसी दूसरे समुदाय के एक बुनकर से, जिन्होंने उस डिज़ाइन और उसके मायने समझाए, यह बताया कि उनके यहाँ घर पर इसे पहनने की इजाज़त किसे थी, और एक मेहमान के लिए यह सादी वाली शॉल ही क्यों सही थी। उसने उसे बरसों सँभालकर रखा। वह आज भी उसके पास है।"',
      text: 'When they left, her father bought her a shawl — from a weaver of a community not their own, who explained the pattern, and what it meant, and who was allowed to wear it at home, and why this plainer one was the right one for a guest. She kept it for years. She keeps it still.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"हॉर्नबिल महोत्सव अभी नया है — इसकी शुरुआत साल 2000 में हुई थी — लेकिन इसके पीछे की सोच बहुत पुरानी है: अलग होने का मतलब बँटना नहीं होता। अगर तुम कभी दिसंबर में नागालैंड जाओ, तो ज़रूर जाना। बीच में खड़े होना। और भाषाओं को गिनना।"',
      text: 'The Hornbill Festival is young — it began in the year 2000 — but the idea inside it is old: different is not divided. If you are ever in Nagaland in December, go. Stand in the middle. Count the languages.' }
  ],
  moral: 'You do not have to become alike to stand side by side.',
  source: 'The Hornbill Festival, held each December since 2000 at Kisama heritage village near Kohima, Nagaland, where the state\'s many distinct communities — Ao, Angami, Sumi, Lotha, Konyak, Chakhesang and others — each keep a morung on one hillside. The bird it is named for is honoured by all of them, each in their own tradition.'
},

{
  id: 'fk.cat-tiger-lesson',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Lesson the Cat Kept Back',
  hook: 'The cat taught the tiger everything he knows. Not everything she knows.',
  hero: 'pt_lion',
  cast: ['pt_lion', 'pt_jackal'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['बिल्ली', 'billi', 'cat'], ['गुरु', 'guru', 'teacher'], ['सबक', 'sabak', 'lesson']],
  scenes: [
    { art: ['pt_jackal'], who: null,
      hi: '"नागा पहाड़ियों में लोग कहते हैं कि बाघ पैदा होते ही बाघ बनना नहीं जान गया था। बहुत समय पहले, वह बस बड़ा था — बड़ा और अनाड़ी, जहाँ जाता धड़ाम-धूम मचाता, और शिकार से भरे जंगल में भी भूखा ही घूमता रहता। और उन पहाड़ियों की सबसे बेहतरीन शिकारी तुम्हारे दोनों हाथों जितनी बड़ी एक जीव थी: बिल्ली।"',
      text: 'In the Naga hills they tell that the tiger was not born knowing how to be a tiger. Once, long ago, he was just big — big and clumsy, all thump and crash, going hungry in a forest full of dinner. And the finest hunter in those hills was somebody the size of your two hands: the cat.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion',
      hi: '"बाघ बहुत झेंपता हुआ, अपने भारी-भरकम शरीर के साथ उसके पास आया। उसने कहा, \\"मुझे सिखाओ। मेरे पास पंजे हैं, मज़बूत कंधे हैं, फिर भी मेरे हाथ कुछ नहीं लगता।\\" और बिल्ली ने, जो सिखाने की बात को बड़े ध्यान से लेती थी, उसे ऊपर से नीचे तक देखा और कहा: \\"बहुत खूब। पहला सबक: पहाड़ दरकने की तरह धड़धड़ाते हुए चलना बंद करो।\\""',
      text: 'The tiger came to her, enormous and embarrassed. "Teach me," he said. "I have the claws and I have the shoulders and I catch nothing at all." And the cat, who took teaching seriously, looked him over and said: "Very well. Lesson one: stop walking like a landslide."' },
    { art: ['pt_jackal', 'pt_lion'], who: null,
      hi: 'उसने उसे बहुत अच्छे से सिखाया, ठीक वैसे ही जैसे एक अच्छा गुरु सिखाता है। दबे पाँव चलना, एक-एक पंजा जमाकर। अचानक बिल्कुल थम जाना, और उस ठहराव के अंदर धीरज रखना। घास के बीच झुककर चुपचाप सरकना। पिछले पैरों को समेटना, और फिर छलांग लगाना। वह एक अच्छा शिष्य था, और उसने उसे यह बात बताई भी—जैसा कि हर गुरु को बताना चाहिए।',
      text: 'She taught him properly, the way a good teacher does. The soft walk, paw by paw. The freeze, and the patience inside the freeze. The low flow through the grass. The gathering of the back legs, and the spring. He was a good student, and she told him so, which teachers should.' },
    { art: ['pt_lion'], who: null, mood: 'wow',
      hi: 'मौसम बीतने के साथ-साथ बाघ और बेहतर होता गया, और फिर वह सचमुच बेहद शानदार बन गया। वह धुएँ की तरह सरकता था। पत्थर की तरह चुपचाप इंतज़ार करता था। पूरा जंगल उसकी मौजूदगी के हिसाब से ढलने लगा। और इसी दौरान कहीं, वह अपनी छोटी-सी गुरु को एक अलग ही नज़र से देखने लगा।',
      text: 'Season by season the tiger got better, and then he got magnificent. He moved like smoke. He waited like a stone. The whole forest reorganised itself around the fact of him. And somewhere in there, he began to look at his small teacher differently.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion', mood: 'think',
      hi: '"यह बड़ी अजीब बात है," एक दिन अपने शरीर को तानते हुए बाघ ने कहा, "कि मुझे इतने छोटे से जीव का इतना आभारी होना पड़े।" और उसने तय कर लिया—जैसे बहुत ज़्यादा ताकतवर लोग कभी-कभी कर बैठते हैं—कि अब उसके साथ तमीज़ से पेश आने की कोई ज़रूरत नहीं है। "ये पहाड़ियाँ अब मेरी हैं," उसने कहा, और छलांग लगा दी, उसे ठीक-ठीक यह दिखाने के लिए कि उसने उसे कितना बढ़िया सिखाया था।',
      text: '"It is odd," said the tiger one day, flexing, "that I should owe so much to somebody so small." And he decided — the way the too-strong sometimes do — that he no longer needed to be polite to her. "These hills are mine now," he said, and sprang, to show her exactly how well she had taught him.',
      ask: {
        q: 'The tiger knows every lesson the cat taught. Is she out of tricks?',
        options: ['Yes — he learned everything', 'No — a wise teacher keeps one lesson back', 'She will have to outrun him'],
        answer: 1,
        right: 'Just so. Straight up the nearest tree she went — the one thing she had never taught him.',
        wrong: 'She was not out of tricks, and no one outruns a tiger. Straight up the nearest tree she went — the one thing she had never taught him.'
      } },
    { art: ['pt_jackal'], who: null, mood: 'wow',
      hi: 'उसके पंजे खाली घास पर जा गिरे। उसने बाएँ देखा, दाएँ देखा—और फिर ऊपर। और वहाँ उसकी गुरु, पेड़ की एक डाल पर आराम से बैठी, अपना कान साफ़ कर रही थी, उसकी पहुँच से कोसों दूर।',
      text: 'His paws hit the empty grass. He looked left, right — then up. And there was his teacher, settled comfortably on a branch, washing an ear, entirely out of reach.' },
    { art: ['pt_lion', 'pt_jackal'], who: 'pt_lion',
      hi: '"आपने मुझे पेड़ पर चढ़ना तो कभी नहीं सिखाया," बाघ ने नीचे से कहा। "हाँ," बिल्ली ने सहमति जताई। "यह दाँव मैंने अपने पास ही रखा था। और इसे मैंने ठीक आज ही की दोपहर के लिए बचाकर रखा था।" और उसने बड़े इत्मीनान से अपना कान साफ़ करना पूरा किया, जबकि उसका सबसे बड़ा शिष्य पेड़ के नीचे बैठा अपनी तमीज़ के बारे में सोचता रहा।',
      text: '"You never taught me the climb," said the tiger, from below. "No," agreed the cat. "I kept that one. I have been keeping it for exactly this afternoon." And she finished her ear at leisure while the biggest of all her students sat at the bottom of the tree and thought about his manners.' },
    { art: ['pt_jackal'], who: null,
      hi: 'यही वजह है कि आज तक बिल्ली पेड़ पर चढ़ जाती है और बाघ नहीं चढ़ पाता—और इसीलिए, कुछ बुज़ुर्ग मुस्कुराते हुए कहते हैं, बिल्ली हमेशा खुद से इतनी संतुष्ट दिखाई देती है। वह दुनिया की इकलौती ऐसी गुरु है जिसका सबसे बुरा शिष्य भी उसे कभी पकड़ नहीं पाया।',
      text: 'That is why, to this day, the cat climbs and the tiger cannot — and why, some elders add with a smile, a cat always looks so pleased with herself. She is the only teacher whose worst student never caught her.' },
    { art: ['pt_jackal'], who: 'mithu',
      hi: '"बुज़ुर्ग यह बात एक साथ दो लोगों को बताते हैं, जानते हो: चेले से — जिसने तुम्हें सिखाया, कभी उसके ख़िलाफ़ मत जाना — और गुरु से: दिल खोलकर दो, पर एक टहनी अपने लिए बचाकर रखो।"',
      text: 'The elders tell it to two people at once, you know: to the student — do not turn on the one who taught you — and to the teacher: give generously, but keep one branch for yourself.' }
  ],
  moral: 'Honour your teacher — she knows one thing more than she taught you.',
  source: 'Told among several Naga communities of Nagaland, with kin tellings across the hills of the Northeast and beyond. Many versions; in all of them, the cat keeps the climb.'
},

{
  id: 'fk.sungkong-drum',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Drum the Whole Village Pulled',
  hook: 'A drum the size of a house, carved from one tree, with a voice the next valley can hear — and no one person can move it an inch.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-NL'],
  words_hi: [['ढोल', 'dhol', 'drum'], ['आवाज़', 'awaaz', 'voice'], ['रस्सी', 'rassi', 'rope']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"नागालैंड के एक आओ गाँव में सबसे बुलंद आवाज़ किसी इंसान की नहीं होती। वह आवाज़ सुंगकोंग यानी लट्ठे से बने ढोल की होती है। एक पूरा का पूरा विशाल पेड़, जिसे काटकर, अंदर से खोखला कर, नाव के आकार का ढोल बनाया जाता है — इतना लंबा कि कई लोग सिर से पैर मिलाकर लेट जाएँ — जो पूरी घाटी में गाँव की आवाज़ बनकर गूँजता है।"',
      text: 'In an Ao village in Nagaland, the biggest voice does not belong to any person. It belongs to the sungkong — the log drum. A whole great tree, felled, hollowed and carved into a boat-shaped drum longer than several men lying head to foot, that speaks for the village across the valleys.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"इसे बनाने की शुरुआत आदर-सम्मान से होती है। पेड़ को ध्यान से चुना जाता है और बाक़ायदा उससे अनुमति माँगी जाती है — कुल्हाड़ी का पहला वार करने से पहले पुरानी रस्में निभाई जाती हैं — क्योंकि आप किसी विशालकाय पेड़ को यूँ ही छीनकर नहीं लाते। आप उसे न्योता देकर लाते हैं।"',
      text: 'Making one begins with respect. The tree is chosen carefully and asked properly — the old rites are said over it before an axe ever touches it — because you do not just take a giant. You invite one.' },
    { art: ['guard'], who: null,
      hi: '"कारीगर जंगल में वहीं काम करते हैं जहाँ पेड़ गिरा था: उसके पेट को खोखला करते हैं, सिर को आकार देते हैं, और वह लंबी दरार तराशते हैं जो उसका मुँह बनेगी। और फिर आती है वह मुश्किल, जिससे यह कहानी कहानी बनती है। बनकर तैयार हुआ ढोल एक पूरे घर जितना भारी होता है। और उसे खींचकर गाँव तक ले जाने में पूरा एक दिन लगता है।"',
      text: 'The carvers work where the tree fell, up in the forest: hollowing the belly, shaping the head, cutting the long slit that will be its mouth. And then comes the problem that makes this story a story. The finished drum weighs as much as a house. And it is a day\'s haul from home.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: '"पहली बार ढोल खींचने की इस मुहिम में शामिल हुए एक लड़के ने पत्तों पर पड़ी उस भारी-भरकम चीज़ को देखा, फिर बेंत की रस्सियों के घेरों को देखा, और एक समझदार बच्चे की तरह अपना हिसाब लगाया।"',
      text: 'A boy on his first drum-hauling looked at the great thing lying in the leaves, and at the coils of cane rope, and did the arithmetic of a sensible child.',
      ask: {
        q: 'No ten men can move it. No twenty. How does a drum the size of a house get home?',
        options: ['Elephants', 'Everybody — every hand in the village, pulling to one song', 'Roll it down the river'],
        answer: 1,
        right: 'Everybody. On rollers, on rattan ropes as thick as your arm, to a hauling song that keeps five hundred backs pulling in the same half-second.',
        wrong: 'There are no elephants up here and the river goes the wrong way. It comes home because everybody pulls — every hand in the village, on rattan ropes, to one song.'
      } },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"और वह ऐसा दिन था जिसे वह लड़का कभी नहीं भूल पाया। रस्सियों पर पूरा का पूरा गाँव — आदमी, औरतें, हर कोई जिसने रस्सी थाम रखी थी — और उनके आगे गूँजता ढोल खींचने का गीत, और हर अंतरे पर पाँच सौ लोग मिलकर एक जान होकर ज़ोर लगाते, और गोल लट्ठों पर वह महाकाय ढोल एक-एक हाथ आगे खिसकता जाता।"',
      text: 'And that is the day the boy never forgot. The whole village on the ropes — men, women, everyone with a grip — and the drum-hauling song rolling out ahead of them, and on each chorus five hundred people pulling as one person, and the giant sliding forward another arm\'s length on its rollers.' },
    { art: ['courtier'], who: null,
      hi: 'पूरा दिन लग गया, और यह साल का सबसे बढ़िया दिन था। क्योंकि जो गाँव मिलकर ढोल खींचता है, वह उसके बाद अपने बारे में एक बात जान जाता है: अगर हम एक बोल पर साथ मिलकर ज़ोर लगाएँ, तो इस पहाड़ी पर ऐसी कोई चीज़ नहीं जिसे हम हिला न सकें।',
      text: 'It took all day, and it was the best day of the year. Because a village that has hauled a drum together knows something about itself afterwards: there is nothing on this ridge we cannot move, if we pull on the same word.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: 'घर पहुँचकर, अपनी आदर की जगह पर सजने के बाद, ढोल का असली काम शुरू हुआ। अलग-अलग ख़बरों के लिए अलग-अलग थाप: ख़तरे के लिए एक ताल, दावत के लिए दूसरी, जीत के लिए तीसरी, और गाँव वालों को इकट्ठा बुलाने के लिए एक और। "यह एक आवाज़ है," लड़के के दादाजी ने उससे कहा। "इसके शब्दों को भी वैसे ही सीखो जैसे किसी और की बोली सीखते हैं।"',
      text: 'Home, and set in its place of honour, the drum began its real work. Different beats for different news: one rhythm for danger, one for a feast, one for triumph, one for calling the village in. "It is a voice," the boy\'s grandfather told him. "Learn its words like anybody\'s words."' },
    { art: ['guard'], who: null,
      hi: 'और इस तरह उस गाँव का बच्चा बिना मुँह वाली एक भाषा सीखकर बड़ा हुआ — बिस्तर में लेटे-लेटे, ढोल की थाप से पूरी घाटी का हाल जान लेता: वह तो बस अभ्यास है; वह दूर वाले गाँव में दावत है; वह, ज़रा उठकर बैठो, कोई ज़रूरी ख़बर है।',
      text: 'And so a child of that village grew up bilingual in a language with no mouth — lying in bed, reading the valley by drumbeat: that is only practice; that is a feast at the far village; that, sit up, is news.' },
    { art: ['guard'], who: 'mithu',
      hi: 'आओ लोग अपने ढोल को सुंगकोंग कहते हैं; कोन्याक और दूसरे समुदायों के पास लकड़ी के अपने बड़े-बड़े ढोल होते हैं, हर किसी की अपनी परंपरा। आप आज भी उन्हें पहाड़ियों में देख सकते हैं — और त्योहारों पर, उन्हें बजते सुन भी सकते हैं। जब यह बोलता है, तो आप तुरंत समझ जाएँगे कि कोई बीच में क्यों नहीं बोलता।',
      text: 'The Ao call theirs the sungkong; the Konyak and other peoples keep great log drums of their own, each tradition its own. You can still see them in the hills — and at festivals, still hear one. When it speaks, you will understand immediately why nobody interrupts.' }
  ],
  moral: 'A village that pulls on one rope, to one song, can move anything it needs to.',
  source: 'The sungkong, the great log drum of Ao Naga villages in Nagaland — carved from a single tree with rites of respect, hauled home by the whole village with hauling songs, its distinct beats carrying distinct messages. The Konyak and other Naga communities keep their own log-drum traditions. Many tellings.'
},

/* ================================================== ARUNACHAL PRADESH ===== */
{
  id: 'fk.bomong-bong',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Two Sun Sisters',
  hook: 'Once there were two suns in the sky — sisters — and the world was far too bright.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_mouse'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['सूरज', 'sooraj', 'sun'], ['चाँद', 'chaand', 'moon'], ['बहनें', 'behnein', 'sisters']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अरुणाचल प्रदेश के आदि लोग बताते हैं कि शुरुआत में आसमान को दो बहनों ने थाम रखा था, जो खुद धरती और आकाश की बेटियाँ थीं: बोमोंग और बोंग। दोनों ही चमकती थीं। दोनों ही सूरज थीं। और वे एक-दूसरे से बिल्कुल वैसे ही प्यार करती थीं जैसे बहनें करती हैं — पूरे दिल से, और बारी-बारी से कमान सँभालते हुए।',
      text: 'The Adi people of Arunachal Pradesh tell that in the beginning the sky was held up by two sisters, daughters of the Earth and the Sky themselves: Bomong and Bong. Both of them shone. Both of them were suns. And they loved each other the way sisters do — completely, and taking turns being in charge.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'लेकिन दो सूरज, ज़रूरत से एक ज़्यादा थे। जब बोमोंग पश्चिम में ढलती, तो बोंग पूरब में निकल आती, और रात नाम की तो कोई चीज़ ही नहीं थी — न कोई आराम, न कोई ठंडक, और न कोई ओस। आधी रात को भी चट्टानें गरम रहती थीं। नदियाँ उथली पड़ गईं। दुनिया दिन भर आँखें सिकोड़े रहती और फिर रात भर भी आँखें सिकोड़े रहती।',
      text: 'But two suns is one sun too many. When Bomong went down in the west, Bong came up in the east, and there was no night at all — and no rest, and no cool, and no dew. The rocks were warm at midnight. The rivers ran shallow. The world squinted all day and then squinted all night.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'इस नई-नई दुनिया के सारे जीव-जंतु जितनी भी छाँव मिली, वहीं इकट्ठे हो गए और आपस में बात करने लगे। बहनों से कोई नाराज़ नहीं था — भला चमकने के लिए भी कोई किसी से नाराज़ होता है क्या? लेकिन सब भीतर तक थक चुके थे, अपनी हड्डियों तक, वैसे ही जैसे कोई तब थकता है जब कभी एक बार भी रात न हुई हो।',
      text: 'The creatures of the young world gathered in whatever shade there was and talked it over. Nobody was angry with the sisters — how can you be angry at somebody for shining? But everybody was tired, down in their bones, the way you are tired when there has never once been a night.' },
    { art: ['pt_mouse'], who: null, mood: 'think',
      hi: 'इसलिए उन्होंने ऊपर एक संदेशवाहक भेजा — इस कहानी के मुताबिक, एक छोटा और समझदार जीव — ताकि वह बहनों के सामने सच्चाई से अपनी परेशानी रख सके।',
      text: 'So they sent a messenger up — in this telling, a small and sensible one — to put the problem to the sisters honestly.',
      ask: {
        q: 'The world cannot live under two suns. What should the messenger ask the sisters?',
        options: ['One of you must go away forever', 'Could one of you shine gently, and take the night?', 'Take turns by year — one each'],
        answer: 1,
        right: 'That was the asking. Not "go away" — "shine differently." There is a whole world of kindness between those two.',
        wrong: 'Nobody wanted a sister sent away, and a year of dark would kill the fields. The asking was gentler: could one of you shine softly, and take the night?'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: 'बहनों ने उसकी बात सुनी। और पुरानी कहानियाँ कहती हैं कि यह जुदाई बहुत कठिन थी — उसमें एक तीर की बात है, एक गहरे दुख की, और लंबे समय तक छिपने की, और वह हिस्सा मैं बड़ों को ही सुनाने दूँगा, क्योंकि वह कहानी उन्हीं की है। मगर हर कहानी जिस बात पर सहमत है, वह यह है कि इसका अंत कैसे हुआ।',
      text: 'The sisters heard it. And the old tellings say this parting was hard — there is an arrow in them, and a grief, and a long hiding, and I will let the elders tell that part, because it is theirs. What every telling agrees on is how it ended.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'बोंग ने अपनी आग को ठंडा होने दिया। उसने उसे धीमा किया, और धीमा करती गई — सफ़ेद से सुनहरा और फिर एक कोमल, शांत चाँदी सा — यहाँ तक कि उसकी तरफ़ देखा जा सके, और फिर यहाँ तक कि वह देखने में बेहद प्यारी लगने लगी। और उसने रात का पहरा संभाल लिया, ताकि उसकी बहन दिन को संभाल सके।',
      text: 'Bong let her fire cool. Down and down she turned it, from white to gold to a soft, patient silver — until she could be looked at, and then until she was lovely to look at. And she took the night watch, so her sister could keep the day.' },
    { art: ['guard'], who: null,
      hi: 'वह पहली रात, दुनिया की सबसे पहली रात थी। ओस न जाने कहाँ से आ गई और हर चीज़ पर एक आशीर्वाद की तरह बैठ गई। सारे जीव सोए — सचमुच गहरी नींद सोए — और नदियाँ उमड़ पड़ीं, और दुनिया ने वह तरीका सीख लिया जो उसने आज तक संभाला हुआ है: पहले उजाला, फिर नर्मी, और फिर से उजाला।',
      text: 'That first night was the first night there had ever been. The dew came out of nowhere and sat on everything like a blessing. The creatures slept — really slept — and the rivers rose, and the world learned the trick it has kept ever since: bright, then gentle, then bright again.' },
    { art: ['courtier'], who: null,
      hi: 'और बहनें आज भी इसे निभाती हैं। बोमोंग दिन में अपनी आग लेकर निकलती है, और बोंग रात में अपनी चाँदी लेकर, और दोनों के होते हुए धरती की कोई भी चीज़ कभी किसी बहन की नज़र से दूर नहीं होती।',
      text: 'And the sisters still keep it. Bomong crosses by day with the fire, and Bong crosses by night with the silver, and between them nothing on earth is ever out of a sister\'s sight.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'पहाड़ों के ऊपर एक बार पूरे चाँद को उगते हुए देखो, तो तुम्हें दिख जाएगा: वह कोई दीया नहीं है, वह तो सूरज ही है जो जान-बूझकर इतना शांत और प्यारा बन गया है। यह बात सबसे पहले आदि लोगों ने ही जानी थी।',
      text: 'Watch the full moon rise over the mountains once and you will see it: that is not a lamp, that is a sun being gentle on purpose. The Adi knew it first.' }
  ],
  moral: 'Sometimes the kindest thing a bright person can do is turn gentle — and take the night watch.',
  source: 'Adi oral tradition of Arunachal Pradesh — Bomong and Bong, the sun sisters, from the tellings collected in the old NEFA years and still told. The old tellings of their parting are harsher — an arrow and a grief; this telling is gentler, and says so. Many versions across the Adi valleys.'
},

{
  id: 'fk.donyi-polo',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Eye of the Day, the Eye of the Night',
  hook: 'When his grandfather made a promise, he pointed at the sun. The boy finally asked why.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['सच', 'sach', 'truth'], ['आँख', 'aankh', 'eye'], ['रोशनी', 'roshni', 'light']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अरुणाचल प्रदेश के एक गालो गाँव में, एक लड़के ने अपने दादाजी की एक बात पर ध्यान दिया। जब भी दादाजी किसी ज़रूरी बात पर अपनी ज़बान देते — खेत की मेड़ हो या किसी पड़ोसी से किया कोई वादा — वे अपनी ठुड्डी ज़रा-सी सूरज की तरफ़ उठा लेते। सब लोग इसे समझते दिखते थे। किसी ने कभी इसे समझाया नहीं था।',
      text: 'In a Galo village in Arunachal Pradesh, a boy noticed a thing his grandfather did. Whenever the old man gave his word on something that mattered — a field boundary, a promise to a neighbour — he would lift his chin, just slightly, toward the sun. Everyone seemed to understand it. Nobody explained it.' },
    { art: ['courtier', 'guard'], who: 'courtier',
      hi: 'तो एक शाम लड़के ने पूछ ही लिया। और दादाजी वैसे मुस्कुराए जैसे कोई इंसान सालों से किसी ख़ास सवाल का इंतज़ार कर रहा हो। उन्होंने कहा, "दोन्यी। यानी सूरज। और पोलो, यानी चाँद। बैठो। यह कोई छोटा-सा जवाब नहीं है।"',
      text: 'So one evening the boy asked. And his grandfather smiled the smile of a man who has been waiting years for a particular question. "Donyi," he said. "The sun. And Polo, the moon. Sit down. This is not a small answer."' },
    { art: ['guard'], who: 'guard',
      hi: '"हम तानी लोग हैं — गालो, और आदि, न्यिशी, आपातानी, तागिन, सब के सब अबो तानी की संतान हैं। और हम दुनिया को इसी तरह देखते हैं: दोन्यी और पोलो, सूरज और चाँद, उस परम सत्य की दो आँखें हैं। उसका देखना हैं। दिन में, तुम्हारा किया कुछ भी अनदेखा नहीं रहता। और रात में भी कुछ नहीं।"',
      text: '"We are Tani people — Galo, and the Adi, the Nyishi, the Apatani, the Tagin, all the children of Abo Tani. And this is how we hold the world: Donyi and Polo, the sun and the moon, are the two eyes of the great truth. The seeing of it. By day, nothing you do is unseen. By night, nothing either."' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"जासूसी नहीं," उन्होंने बात आगे बढ़ाई, क्योंकि लड़के के चेहरे ने यह सवाल पूछ लिया था। "आँगन में नज़र रखती माँ कोई जासूसी नहीं कर रही होती। दोन्यी वैसे ही देखती हैं जैसे एक माँ देखती है — सब कुछ, ममता से, और झूठ को ज़रा भी बर्दाश्त न करते हुए। इसीलिए जब हम कोई वादा करते हैं, तो उनकी तरफ़ रुख़ करते हैं। हम कह रहे होते हैं: उन्होंने भी मेरी बात सुन ली है।"',
      text: '"Not spying," he added, because the boy\'s face had asked. "A mother watching the courtyard is not spying. Donyi sees the way a mother sees — everything, and kindly, and with very little patience for lying. That is why we point to her when we promise. We are saying: she heard me too."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'लड़के ने उस सबसे बड़े वादे के बारे में सोचा जिसे वह जानता था — एक खेत को लेकर किसी पड़ोसी को दी गई उसके दादाजी की ज़बान, जिसे उन्होंने तीस सालों तक निभाया था।',
      text: 'The boy thought about the biggest promise he knew of — his grandfather\'s word to a neighbour, kept for thirty years, about a field.',
      ask: {
        q: 'What makes a promise strong enough to last thirty years?',
        options: ['Writing it on paper', 'Making it where the sun is witness — so it is never only between two people', 'Repeating it every year'],
        answer: 1,
        right: 'That is the Tani answer. A promise made under Donyi has three parties, and one of them never forgets and never dies.',
        wrong: 'There was no paper in the old hills, and repeating fades. The Tani answer: make it where Donyi is witness, so it is never only between two people — and one of the three never forgets.'
      } },
    { art: ['guard'], who: 'guard',
      hi: '"और क्योंकि वह सब कुछ बिल्कुल साफ़-साफ़ देखती हैं," उसके दादाजी आगे बोले, "हम इस तरह जीने की कोशिश करते हैं कि उनकी नज़र में रहने से हमें कोई झिझक न हो। बस, सच कहें तो यही पूरी बात है। सच बोलो। साफ़ बर्ताव करो। और ऐसे चलो जैसे हर घड़ी दोपहर की धूप खिली हो।"',
      text: '"And because she sees truly," his grandfather went on, "we try to live so that being seen is no trouble to us. That is the whole of it, really. Speak straight. Deal straight. Walk as if it is always noon."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'उस लड़के ने बाकी बातें वैसे ही सीखीं जैसे बच्चे सीखते हैं: त्योहारों में, प्रार्थनाओं में, और गांगगिं में — यानी वो प्रार्थना-घर जहाँ आज दोन्यी-पोलो परिवार एक साथ भजन गाने जुटते हैं। उसने जाना कि उसके लोग इस आस्था को तब से निभा रहे हैं जब से किसी ने गिनती भी नहीं शुरू की थी, इसका एक झंडा है जिस पर सूरज बना है, और ऐसे गीत हैं जिन्हें वह पहले से आधा-अधूरा जानता था।',
      text: 'The boy learned the rest the way children learn: at festivals, at prayers, in the gangging — the prayer halls where Donyi-Polo families now gather to sing. He learned that his people had held this faith since before anyone counted, and that it had a flag with a sun on it, and songs he already half knew.' },
    { art: ['courtier'], who: null,
      hi: 'और वह खुद भी ऐसा करने लगा — जब भी किसी दोस्त को कोई वचन देता, तो अपनी ठुड्डी ज़रा-सी सूरज की तरफ़ उठा लेता। इससे वादों का मोल ही बदल गया। यह जानना कि कोई तुम्हें देख रहा है, फिर भी प्यार करता है, और तुमसे सच्चे रहने की उम्मीद रखता है: सच तो यह है कि बड़े होने का यह बहुत ही प्यारा तरीका है।',
      text: 'And he began doing the thing himself — the small lift of the chin, sunward, when he gave his word to a friend. It changed the promises. Knowing you are seen, and loved anyway, and expected to be honest: it turns out that is a very good way to grow up.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'आज अरुणाचल में दोन्यी-पोलो कई तानी परिवारों की जीती-जागती आस्था है, जिसे वे उतनी ही निष्ठा से मानते हैं जितनी निष्ठा से तुम्हारा परिवार अपनी आस्था को मानता है। अगर तुम्हारा कोई तानी दोस्त हो, तो उससे पूछना कि उनके घर में दोन्यी का क्या मतलब है — और उसे वैसे ही ध्यान से सुनना जैसे तुम चाहते हो कि तुम्हारी अपनी आस्था को सुना जाए।',
      text: 'Donyi-Polo is the living faith of many Tani families in Arunachal today, held with the same seriousness your family holds its own. If you have a Tani friend, ask what Donyi means in their house — and listen the way you would want your own faith listened to.' }
  ],
  moral: 'Live so that being seen is no trouble to you.',
  source: 'Donyi-Polo, the faith of the Tani peoples of Arunachal Pradesh — Adi, Galo, Nyishi, Apatani, Tagin and others — presented from the inside, as its followers hold it. The gangging prayer halls and the sun emblem belong to the faith\'s living present. Practice differs between communities and families.'
},

{
  id: 'fk.kine-nane',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Mother of the Grain',
  hook: 'Before rice, the hills fed people some days and not others. Then Kine Nane opened her hand.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['चावल', 'chaawal', 'rice'], ['बीज', 'beej', 'seed'], ['फ़सल', 'fasal', 'harvest']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अरुणाचल प्रदेश के आदि लोग चावल से पहले का वह ज़माना याद करते हैं। लोग वही खाते थे जो जंगल देता था — जंगली रतालू, नई कोपलें, या दिन भर में जो हाथ लग जाए — और जंगल दिलदार तो है, पर उसका कोई पक्का भरोसा नहीं। कुछ हफ़्ते पेट भरा रहता। कुछ हफ़्ते भूख की टीस में बीतते। और कोई किसी बच्चे से यह वादा नहीं कर सकता था कि आने वाला हफ़्ता कैसा होगा।',
      text: 'The Adi of Arunachal Pradesh remember a time before rice. People ate what the forest offered — wild yams, shoots, whatever the day turned up — and the forest is generous, but not reliable. Some weeks were full. Some weeks were an ache. And nobody could promise a child which kind of week was coming.' },
    { art: ['courtier'], who: null,
      hi: 'अनाज था तो ज़रूर। लेकिन वह इंसानों के पास नहीं था। आदि कहानियों में, अनाज फ़सलों की माँ, किने नाने के पास था, जिनकी हिफ़ाज़त में उसका एक-एक दाना रहता था — और उनके भंडार-घर से एक भूखे गाँव के बीच की दूरी ही दुनिया की सबसे बड़ी मुश्किल थी।',
      text: 'The grain existed. But it was not with people. In the Adi tellings the grain belonged with Kine Nane, the mother of crops, the one in whose keeping every seed of it lay — and the distance between her storehouse and a hungry village was the whole problem of the world.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'चावल उस दूरी को पार करके कैसे पहुँचा, इसकी कहानियाँ हर घाटी में अलग-अलग हैं — किसी में इसे माँग कर लाया गया, किसी में कोई जीव इसे लेकर आया, तो किसी में इसे पाने के लिए किने नाने को भारी क़ीमत चुकानी पड़ी, और बुज़ुर्ग उस हिस्से को जल्दी में नहीं छोड़ते। हर कहानी में जो बात एक जैसी रहती है, वह यह है: चावल लोगों तक एक गहरे और अनमोल तोहफ़े की तरह पहुँचा। यह यूँ ही कहीं मिला नहीं था। यह दिया गया था।',
      text: 'The tellings of how the rice crossed that distance differ from valley to valley — in some it is begged for, in some it is carried by a creature, in some the getting of it costs Kine Nane dearly, and the elders do not hurry past that part. What every telling keeps is this: the rice came to people as a gift with a weight to it. Not a finding. A giving.' },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: 'और इस तरह, एक बसंत में, पहली बार किसी इंसान के हाथ में बीज आया। एक छोटा सा ढेर। शायद इतना कि गाँव के हर पेट को एक शानदार शाम के लिए भरा जा सके।',
      text: 'And so, one spring, there was seed in a human hand for the first time. A small heap of it. Enough, maybe, to fill every belly in the village for one single glorious evening.',
      ask: {
        q: 'One heap of the first seed ever. Eat it tonight, or put it in the ground and wait months?',
        options: ['Eat it — hunger is now', 'Plant it — one hungry season buys every season after', 'Split it half and half'],
        answer: 1,
        right: 'They planted it. All of it. It is the hardest arithmetic there is, and every farmer since has lived by it: seed is not food. Seed is all the food to come.',
        wrong: 'They were hungry, and they planted it anyway — all of it. Seed is not food. Seed is all the food to come, and eating it eats every harvest after.'
      } },
    { art: ['courtier'], who: null,
      hi: 'वह पहला इंतज़ार बहुत लंबा था। लेकिन कतारों में कोंपलें फूट पड़ीं, और बालियाँ दानों से भरकर झुक गईं, और पतझड़ में पूरा गाँव अपने पहले खेत के किनारे खड़ा हुआ और समझ गया कि ज़िंदगी का ढंग बदल चुका था: अब कोई भी इंसान किसी बच्चे से अगले महीने का वादा कर सकता था।',
      text: 'That first waiting was long. But the shoots came up in their rows, and the heads filled and bowed, and in the autumn the village stood at the edge of its own first field and understood that the shape of life had changed: a person could now promise a child next month.' },
    { art: ['guard'], who: 'guard',
      hi: 'और वे यह नहीं भूले कि यह कहाँ से आया था। हर फ़सल का पहला हिस्सा वापस लौटाया गया — किसी के भी खाने से पहले उसे किने नाने के लिए निकाला गया, और पूरे आदर से धन्यवाद दिया गया। "खेत हमारा है मेहनत करने के लिए," बुज़ुर्गों ने कहा। "अनाज उनका है देने के लिए। इस बात का क्रम सीधा रखो, तो हर चीज़ का क्रम सीधा रहेगा।"',
      text: 'And they did not forget where it had come from. The first of every harvest went back — set out for Kine Nane before anyone ate, with thanks said properly. "The field is ours to work," the elders said. "The grain is hers to give. Keep the order of that straight and the order of everything stays straight."' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'वही धन्यवाद एक त्योहार बन गया। सोलुंग के मौक़े पर, आदि गाँवों में, फ़सल का यह आभार निभाया जाता है — रीति-रिवाज़ पूरे किए जाते हैं, खाना बाँटकर खाया जाता है, किने नाने को नाम से याद किया जाता है — एक पूरा त्योहार जो अपने दिल में एक शुक्रिया का पत्र है, जिसे सदियों से हर साल भेजा जा रहा है।',
      text: 'That thanks grew into a festival. At Solung, in the Adi villages, the harvest\'s gratitude is kept — the rites said, the food shared out, Kine Nane remembered by name — a whole festival that is, at its heart, a thank-you letter that has been sent every year for centuries.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'अगली बार जब आपके सामने चावल हो, तो उसे आम तौर से एक पल ज़्यादा देखना। भारत की हर परंपरा में, इसके होने के लिए किसी न किसी को याद किया जाता है। आदि की पहाड़ियों में, उनका नाम किने नाने है।',
      text: 'Next time there is rice in front of you, look at it for one second longer than usual. Somebody, in every tradition in India, is remembered for the fact that it exists. In the Adi hills, her name is Kine Nane.' }
  ],
  moral: 'Eat gratefully, plant faithfully, and give the first handful back.',
  source: 'Adi oral tradition of Arunachal Pradesh — Kine Nane, the mother of crops, honoured at the Solung festival with the first of the harvest. Tellings of how the grain came to people differ between valleys, and some are costlier than this gentle one; the elders keep the full versions.'
},

{
  id: 'fk.nyokum',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Festival Where Everyone Is Invited',
  hook: 'Not just every person. Every spirit, every hill, every river — the Nyishi invite everything.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['निमंत्रण', 'nimantran', 'invitation'], ['धरती', 'dharti', 'earth'], ['मेहमान', 'mehmaan', 'guest']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'निशी अरुणाचल प्रदेश का सबसे बड़ा समुदाय हैं, और हर साल, जैसे ही सर्दियाँ ढलने लगती हैं, वे न्योकुम मनाते हैं। इस नाम का अर्थ ही सब कुछ बता देता है: \'न्योक\' का मतलब है धरती, और \'न्योकुम\' धरती और उसकी सुख-समृद्धि की देवी हैं — जिनका यह त्योहार है।',
      text: 'The Nyishi are the largest of the peoples of Arunachal Pradesh, and every year, as winter loosens, they keep Nyokum. The name says what it is: nyok is the land, and Nyokum is the goddess of the land and its plenty — the one whose festival this is.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक बच्ची अपने पहले न्योकुम की तैयारियाँ देख रही थी: ज़मीन बुहारी जा रही थी, ताज़े कटे हल्के सुनहरे बाँस से एक सुंदर और बारीक़ वेदी बनाई जा रही थी — और दादी मेहमानों की एक ऐसी सूची समझा रही थीं, जैसी उसने पहले कभी नहीं सुनी थी।',
      text: 'A girl watched her first Nyokum being prepared: the ground swept, the altar of bamboo raised — a beautiful, intricate thing, fresh-cut and pale gold — and her grandmother explaining the guest list, which was unlike any guest list she had ever heard.' },
    { art: ['guard'], who: 'guard', mood: 'wow',
      hi: '"सबको न्योता है," दादी ने कहा। "और सचमुच हर किसी को। सारे परिवारों को तो है ही — पर साथ ही नदियों की आत्माओं को भी। पहाड़ों की आत्माओं को। जंगल वालों को। घर वालों को। उन्हें भी जिनके नाम हम जानते हैं, और उन्हें भी जिनके नाम हम नहीं जानते। न्योकुम ऐसा त्योहार नहीं है जिसमें कोई दरवाज़ा हो।"',
      text: '"Everyone is invited," said her grandmother. "And I mean everyone. Every family, of course — but also the spirits of the rivers. The spirits of the hills. The forest ones. The house ones. The ones we have names for and the ones we do not. Nyokum is not a festival with a door."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'बच्ची ने उन दावतों के बारे में सोचा जिन्हें वह जानती थी, जो ज़्यादातर उल्टे ढंग से चलती थीं — कौन अंदर आ सकता है इसकी सूची, जिसका मतलब यह भी था कि कौन बाहर रहेगा इसकी सूची।',
      text: 'The girl thought about parties she knew of, which mostly worked the other way — lists of who was in, which meant lists of who was out.',
      ask: {
        q: 'Why would you invite everything — even the spirits you cannot see and the hills that cannot walk in?',
        options: ['To show off the feast', 'Because good years come when people, nature and spirits are on good terms — so you keep the whole neighbourhood friendly', 'Because it is unlucky not to'],
        answer: 1,
        right: 'That is the heart of Nyokum. A harvest is a joint effort of the seen and the unseen — so the thanks, and the asking, go to everybody at once.',
        wrong: 'It is warmer than luck or showing off. A good year is a joint effort — people, land, water, and the unseen — so the thanks and the asking go to the whole neighbourhood at once, seen and unseen.'
      } },
    { art: ['guard', 'courtier'], who: null,
      hi: 'न्युब — यानी पुजारी — ने पूरे विधि-विधान से, पुरानी प्रार्थना की भाषा में गा-गाकर विस्तार से न्योता दिया। दावत में आइए। हमारे साथ शांति से रहिए। बारिश समय पर और मेहरबान होकर बरसे, खेत भर जाएँ, बच्चे फलें-फूलें, और इस साल किसी का रास्ता किसी और के रास्ते से न उलझे।',
      text: 'The nyub — the priest — sang the invitations properly, the long way, in the old language of asking. Come to the feast. Be at peace with us. Let the rain be on time and kindly, let the fields fill, let the children grow, let nobody\'s path and nobody else\'s path quarrel this year.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और फिर शुरू हुआ त्योहार, अपने हर सही अर्थ के साथ: एक बड़े घेरे में नाचना जिसमें कोई भी शामिल हो सकता था और हर कोई हुआ भी, गाँवों के बीच गीतों का आदान-प्रदान, कई दिनों से पक रहा स्वादिष्ट खाना, और उस जगह की वह ख़ास ख़ुशी जहाँ आया हुआ कोई भी व्यक्ति अनचाहा नहीं था।',
      text: 'And then it was a festival, with everything that word should mean: dancing in a great circle that anyone could join and everyone did, songs traded between villages, food that had been days in the making, and the particular happiness of a place where nobody present was unwelcome.' },
    { art: ['guard'], who: 'guard',
      hi: '"हम दुनिया को इसी तरह सँभालकर रखते हैं," नाच के किनारे सुस्ताते हुए उनकी दादी ने कहा। "इंसान ज़मीन के मालिक नहीं हैं, और न ही इसके हाकिम। हम तो बस इसमें रहने वाले पड़ोसियों का एक हिस्सा हैं। न्योकुम वह दिन है जब सारा पड़ोस — देखा भी और अनदेखा भी — एक साथ बैठकर खाना खाता है।"',
      text: '"This is how we hold the world," her grandmother said, resting at the edge of the dance. "People are not the owners of the land, and not its masters. We are one set of neighbours in it. Nyokum is the day the whole neighbourhood — seen and unseen — sits down to eat together."' },
    { art: ['courtier'], who: 'mithu',
      hi: 'न्योकुम हर साल मनाया जाता है, गाँवों में भी और शहरों में भी, पूजा की वेदी, गीतों और बड़े घेरे वाले नाच के साथ। अगर तुम कभी फ़रवरी में इसके आस-पास हो, तो तुम्हें यह पूछने की ज़रूरत नहीं पड़ेगी कि क्या तुम्हें न्योता मिला है। यही तो इसकी सबसे ख़ास बात है।',
      text: 'Nyokum is kept every year, in the villages and in the towns, with the altar and the songs and the great circle dance. If you are ever near it in February, you will not need to ask whether you are invited. That is the entire point of it.' }
  ],
  moral: 'Keep the whole neighbourhood friendly — including the parts of it you cannot see.',
  source: 'Nyokum Yullo, the festival of the Nyishi people of Arunachal Pradesh, honouring Nyokum, goddess of the land and prosperity, with invitations sung to people and spirits alike. Presented from the inside, as its keepers hold it; observance differs between villages.'
},

{
  id: 'fk.abotani-taki',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'Abo Tani and the Roasted Seed',
  hook: 'The spirit offered Abo Tani a very generous trade. That should have been the first clue.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['चालाकी', 'chalaki', 'trickery'], ['खेत', 'khet', 'field'], ['अंकुर', 'ankur', 'sprout']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'अबो तानी, पहले इंसान और अरुणाचल के तानी लोगों के पूर्वज, अपनी आधी ज़िंदगी आत्माओं के साथ अक़्ल की होड़ लगाने में बिताते रहे — कभी जीते, कभी हारे, और अपनी हार को भी ऐसे सबक़ में बदल दिया जिसे उनके बच्चे आज भी काम में लाते हैं। निशी और गालो लोग शाम-शाम भर बैठकर ये क़िस्से सुनाते हैं। यह उन्हीं में से एक हल्की-फुल्की कहानी है।',
      text: 'Abo Tani, the first man, the ancestor of the Tani peoples of Arunachal, spent half his life in contests of wits with the spirits — winning some, losing some, and turning even the losses into lessons his children still use. The Nyishi and Galo tell whole evenings of these. Here is one of the gentler ones.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: 'बुआई के समय एक आत्मा बाँह पर टोकरी लटकाए, बड़े दोस्ताना अंदाज़ में अबो तानी के पास आई। "पड़ोसी! इस साल तुम्हारा बीज छोटा और धूल भरा दिख रहा है। मेरा बीज मोटा और चमकदार है। मुझसे अदला-बदली कर लो, टोकरी के बदले टोकरी — तुम मुझे अच्छे लगते हो, और आज मेरा दिल भी बड़ा हो रहा है।"',
      text: 'A spirit came to Abo Tani at planting time, friendly as anything, with a basket on his arm. "Neighbour! Your seed looks small and dusty this year. Mine is fat and shining. Trade with me, basket for basket — I like you, and I am feeling generous."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'और उस आत्मा का बीज सचमुच बहुत सुंदर था — मोटा, चमकदार, और उसमें से भुने हुए अनाज की हल्की और प्यारी-सी ख़ुशबू आ रही थी। अबो तानी, जिनकी नाश्ते से पहले ही इतनी तारीफ़ हो गई थी कि वह फूले नहीं समा रहे थे, उन्होंने उसी वक़्त सौदा कर लिया। टोकरी के बदले टोकरी। वह आत्मा सीटी बजाते हुए चल दी, जो — एक बार फिर — समझ जाने के लिए काफ़ी होना चाहिए था।',
      text: 'And the spirit\'s seed WAS beautiful — plump, glossy, smelling faintly and pleasantly of toasted grain. Abo Tani, who had been flattered before breakfast and never quite got over it, traded on the spot. Basket for basket. The spirit went off whistling, which — again — should have been a clue.' },
    { art: ['courtier'], who: null,
      hi: 'अबो तानी ने अपने खेत की झाड़ियाँ काटीं, जलाकर ज़मीन साफ़ की, और हर चमकदार बीज को बड़े जतन से बो दिया। उधर टीले के पार, आत्मा ने वे छोटे और धूल भरे बीज बोए। और फिर बारिश आई, मौसम बदला, और अबो तानी अपना खेत देखने निकले।',
      text: 'Abo Tani cut his field, burned it clean, and planted every shining seed with care. The spirit, over the ridge, planted the small dusty ones. And then the rains came, and the season turned, and Abo Tani went out to see his field.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: 'कुछ भी नहीं। एक भी कोंपल नहीं। कोने से कोने तक सिर्फ़ सूखी ज़मीन, जबकि पहाड़ी के उस पार उस आत्मा का खेत तोते के पर जैसा हरा-भरा लहलहा रहा था। ऐसा इसलिए, क्योंकि उन ख़ूबसूरत बीजों को भून दिया गया था — बस इतना ही सेंका गया था कि वे चमकें और उनमें से मीठी ख़ुशबू आए, पर वे कभी, कभी भी न अंकुरित हों।',
      text: 'Nothing. Not one shoot. Bare earth from edge to edge, while over the ridge the spirit\'s field came up green as a parrot\'s wing. Because the beautiful seed had been roasted — toasted just enough to shine and smell sweet, and to never, ever sprout.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: 'अबो तानी अपने ख़ाली खेत की मेड़ पर बैठ गए। थोड़ी देर तो उन्हें ग़ुस्सा आया, और फिर — क्योंकि अबो तानी ऐसे ही थे — उनके मन में उत्सुकता जागी। आख़िर किसी बीज पर अपना पूरा मौसम दांव पर लगाने से पहले, यह कैसे पहचाना जाए कि वह ज़िंदा है या मरा हुआ?',
      text: 'Abo Tani sat down at the edge of his empty field. He was angry for a while, and then — because this is what makes him Abo Tani — he got interested. How do you tell living seed from dead, before you bet a season on it?',
      ask: {
        q: 'Shiny seed fooled him once. How can Abo Tani make sure seed is alive before planting a whole field of it?',
        options: ['Only trade with people he trusts', 'Plant a small handful first and watch for sprouts', 'Choose the shiniest seed next time'],
        answer: 1,
        right: 'That is the trick he worked out: test a pinch in wet moss first. If it sprouts, plant the field. If not, you have lost a handful, not a year.',
        wrong: 'Trust is good and shine means nothing. His trick was better: test a pinch in wet moss first. If it sprouts, plant the field. If not, you have lost a handful, not a year.'
      } },
    { art: ['guard', 'courtier'], who: null, mood: 'wow',
      hi: 'अगली बार जब बोआई का मौसम आया, तो वह आत्मा एक और चमकती हुई टोकरी लेकर वापस आई। अबो तानी ने बड़े प्यार से उसका धन्यवाद किया, एक चुटकी बीज लिए, उन्हें चूल्हे के पास गीली काई में लपेट कर रख दिया, और आत्मा को न्योता दिया कि जब तक वे इंतज़ार कर रहे हैं, वह रात का खाना खाकर ही जाए। आत्मा को अचानक कहीं और बहुत ज़रूरी काम याद आ गया।',
      text: 'Next planting time, the spirit came back with another gleaming basket. Abo Tani thanked him warmly, took a pinch, folded it into wet moss by the fire, and invited the spirit to stay for dinner while they waited. The spirit developed an urgent appointment elsewhere.' },
    { art: ['courtier'], who: null,
      hi: 'और ज़ाहिर है, वह चुटकी भर बीज कभी नहीं अंकुरित हुआ, और वह सौदा कभी नहीं हुआ, और अबो तानी ने अपने वही छोटे, धूल भरे और वफ़ादार बीज बोए और उस साल भरपेट खाया। इसके बाद वे त्योहारों पर ज़ोर-ज़ोर से सबको यह क़िस्सा सुनाते रहे — क्योंकि जिस सबक़ की क़ीमत आपने पूरे एक मौसम से चुकाई हो, उसे कम से कम मुफ़्त में तो बांट ही देना चाहिए।',
      text: 'And the pinch, of course, never sprouted, and the trade never happened, and Abo Tani planted his own small dusty faithful seed and ate well that year. He told the story on himself forever after, loudly, at festivals — because a lesson you paid a whole season for should at least be given away free.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'इन पहाड़ियों के किसान आज भी बोने से पहले अपने बीजों के अंकुरण की जांच करते हैं — खेत में डालने से कुछ दिन पहले, ज़रा सी नमी में एक चुटकी बीज रखकर। कहीं भी किसी किसान परिवार से पूछिए, वे आपको दिखा देंगे। तानी लोग आपको बताएंगे कि इस आदत के पीछे कहीं न कहीं उस इंसान का हाथ है, जिसने चमकदार बीजों का सौदा ज़िंदगी में सिर्फ़ एक ही बार किया था।',
      text: 'Farmers across these hills still sprout-test their seed before sowing — a pinch in the damp, days before the field. Ask a farming family anywhere and they will show you. Somewhere behind that habit, the Tani peoples would tell you, is a man who traded for shiny seed exactly once.' }
  ],
  moral: 'Shine is not life. Test the small handful before you bet the whole field.',
  source: 'An episode of Abo Tani and a trickster spirit, as such contests are told among the Nyishi and Galo of Arunachal Pradesh; Abo Tani\'s duels of wit with the spirits fill many firesides, and the episodes and their order differ from valley to valley. This is one of the gentler ones.'
},

{
  id: 'fk.abotani-sky-bride',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'How Abo Tani Married the Sky',
  hook: 'The first man asked to marry a daughter of the sky\'s own house. The sky set three tasks, each one impossible.',
  hero: 'courtier',
  cast: ['courtier', 'guard', 'pt_mouse'],
  minutes: 5,
  place: ['IN-AR'],
  words_hi: [['आकाश', 'aakash', 'sky'], ['काम', 'kaam', 'task'], ['मदद', 'madad', 'help']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'तानी लोगों की कई कहानियों में, अबो तानी — जो पहले इंसान थे — ने यूं ही किसी से शादी नहीं की। उनका दिल तो ख़ुद आसमान के घराने की बेटी पर आ गया था, यानी सूर्य, दोनी के घर की बेटी पर। जिसका मतलब था, हाथ मांगना। और आसमान का घराना धरती के पहले इंसान को यूं ही \'हां\' नहीं कह देता, बिना यह परखे कि वह किस मिट्टी का बना है।',
      text: 'In many tellings of the Tani peoples, Abo Tani — the first man — did not marry just anyone. He set his heart on a daughter of the sky\'s own household, of the house of Donyi, the sun. Which meant asking. And the sky\'s house does not say yes to the first man on earth without checking what he is made of.' },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"तीन काम," आकाश के घर ने कहा। "इस बड़े पहाड़ की ढलान को साफ़ करो — एक ही दिन में। इस टोकरी को छाँटो, जिसमें तीन तरह के बीज आपस में मिले हुए हैं — सुबह होने तक। और नदी से पानी लेकर आओ — जालीदार बुनी हुई टोकरी में। ये सब कर लो, फिर हम बात करेंगे।"',
      text: '"Three tasks," said the house of the sky. "Clear the great hillside — in one day. Sort this basket, where three kinds of seed have been mixed together — by morning. And bring water up from the river — in a carrying-basket of open weave. Do those, and we will talk."' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अब, अबो तानी चतुर तो था, लेकिन उसे अपनी चतुराई पर कोई घमंड नहीं था। वह जानता था कि पहाड़ की ढलान इंसान से बड़ी होती है, रात बीजों से भरी टोकरी से छोटी होती है, और टोकरियों को लेकर पानी की अपनी ही पक्की राय होती है। इसलिए उसने वही किया जो घमंडी लोग कभी सोच भी नहीं पाते: वह गया और उसने मदद माँगी।',
      text: 'Now, Abo Tani was clever, but he was not foolish about his own cleverness. He knew a hillside is bigger than a man, a night is shorter than a mixed basket, and water has firm opinions about baskets. So he did the thing that the proud never think of: he went and asked for help.' },
    { art: ['courtier'], who: null,
      hi: 'और यहाँ कहानियाँ मुस्कुरा उठती हैं, क्योंकि अबो तानी ने अपनी पूरी ज़िंदगी छोटे-छोटे जीवों के साथ भलाई करते हुए बिताई थी — चींटियों के साथ अपने चावल बाँटना, जंगली मधुमक्खियों के लिए उनका वाजिब आधा हिस्सा छोड़ देना, यहाँ किसी का पंख ठीक करना तो वहाँ किसी के बिल की मरम्मत कर देना — और कभी एक बार भी इसे किसी फ़ायदे की तरह नहीं सोचा था।',
      text: 'And here the tellings smile, because Abo Tani had spent his whole life being decent to small things — sharing his rice with the ants, leaving the wild bees their fair half, mending a wing here and a burrow there — never once thinking of it as an investment.' },
    { art: ['pt_mouse'], who: null, mood: 'wow',
      hi: 'हवा ने, जिस पर उसकी एक भलाई का उधार था, उस बड़े पहाड़ की ढलान पर लेटकर लोट लगाई, और जो साफ़-सफ़ाई पूरे एक दिन में होनी थी, वह एक ही दोपहर में हो गई। और रात में, हज़ारों चींटियाँ उस मिली-जुली टोकरी के पास आ पहुँचीं — और चींटियाँ, जैसा कि हर वह व्यक्ति जानता है जिसने कभी कोई मिठाई गिराई हो, किसी भी चीज़ को किसी भी चीज़ से अलग छाँट सकती हैं।',
      text: 'The wind, who owed him a kindness, lay down on the great hillside and rolled, and the clearing of one day was done in an afternoon. And in the night, the ants came to the mixed basket in their thousands — and ants, as anyone who has dropped a sweet knows, can sort anything from anything.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: 'अब बस वह खुली टोकरी बची थी, और नदी, और छलनी में पानी भरकर लाने की साफ़ नामुमकिन बात।',
      text: 'That left the open basket, and the river, and the flat impossibility of carrying water in a sieve.',
      ask: {
        q: 'How do you carry water in a basket full of holes?',
        options: ['Run very fast before it leaks', 'Line the basket — moss and broad leaves, packed tight', 'Ask the river to hold still'],
        answer: 1,
        right: 'That was his answer. Moss in the gaps, big smooth leaves overlapping like fish scales — and the basket came up the hill full and shining.',
        wrong: 'Running loses a race with a leak every time. He lined the basket — moss in the gaps, broad leaves overlapping like fish scales — and carried it up full and shining.'
      } },
    { art: ['guard', 'courtier'], who: 'guard',
      hi: 'आकाश के घर ने साफ़ पहाड़, छाँटी हुई टोकरी, और उस नामुमकिन पानी को देखा। "तुमने यह सब अकेले नहीं किया," आकाश ने कहा। "नहीं," अबो तानी ने हँसमुख होकर कहा। "कोई भी काम कोई अकेले नहीं करता। मुझे लगा परीक्षा ही यही थी।" और कहानियाँ कहती हैं कि आकाश का घर हँस पड़ा — क्योंकि परीक्षा सचमुच यही थी।',
      text: 'The house of the sky looked at the cleared hill, the sorted basket, the impossible water. "You did not do these alone," said the sky. "No," said Abo Tani cheerfully. "Nobody does anything alone. I thought that was the test." And the sky\'s house, the tellings say, laughed — because it was.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"तो अबो तानी ने अपनी आसमानी दुल्हन से शादी कर ली, शादी में हवा और चींटियाँ भी थीं और काई भी, शायद पानी के घड़ों के पास कहीं। और उनके बच्चे, और उनके बच्चों के बच्चे, आगे चलकर तानी लोग बने — आदि, न्यीशी, आपातानी, गालो, तागिन।"',
      text: 'So Abo Tani married his sky bride, with the wind and the ants at the wedding and the moss, presumably, somewhere near the water pots. And their children, and their children\'s children, became the Tani peoples — the Adi, the Nyishi, the Apatani, the Galo, the Tagin.' },
    { art: ['courtier'], who: null,
      hi: '"और यह बात ज़रा ठहरकर कहने लायक है: इन कहानियों में, आज का हर तानी इंसान एक तरफ से धरती का और दूसरी तरफ से खुद आसमान के घर का वंशज है। आधी पहाड़ी, आधी रोशनी। उनके बड़े-बुजुर्ग कहते हैं कि इससे बहुत सी बातें समझ में आती हैं।"',
      text: 'Which is a thing worth saying slowly: in these tellings, every Tani person alive is descended from the earth on one side and the sky\'s own house on the other. Half hill, half light. It explains a lot, their elders say.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अलग-अलग घाटियों में अबो तानी के काम और मददगार भी अलग-अलग हो जाते हैं — दो गाँवों से पूछिए और दो अलग कहानियों का मज़ा लीजिए। जो बात कभी नहीं बदलती, वह है इसका सार: नामुमकिन को मुमकिन एक ऐसे इंसान ने किया जो पहले दयालु था, और होशियार बाद में।"',
      text: 'Different valleys give Abo Tani different tasks and different helpers — ask two villages and enjoy two versions. What never changes is the shape: the impossible got done by a man who had been kind first and clever second.' }
  ],
  moral: 'Be kind before you need anything. Cleverness finishes what kindness starts.',
  source: 'Abo Tani\'s winning of his bride from the sky\'s household, a motif told across the Tani peoples of Arunachal Pradesh — Adi, Nyishi, Apatani, Galo, Tagin; the tasks and helpers differ from valley to valley, and this is one way it is told. Many versions.'
},

{
  id: 'fk.tawang-horse',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Horse Who Chose the Monastery',
  hook: 'The lama searched the mountains for the right place and could not find it. His horse could.',
  hero: 'courtier',
  cast: ['courtier', 'buddha'],
  minutes: 4,
  place: ['IN-AR'],
  words_hi: [['घोड़ा', 'ghoda', 'horse'], ['मठ', 'math', 'monastery'], ['खोज', 'khoj', 'search']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"अरुणाचल प्रदेश के सुदूर पश्चिम में, ऊँचाई पर जहाँ हवा पतली है और प्रार्थना के झंडे कभी ठहरते नहीं, वहाँ मोनपा लोग रहते हैं, जो बुद्ध के रास्ते पर चलते हैं। और उनकी घाटियों के ऊपर पूरे हिमालय के सबसे बड़े मठों में से एक खड़ा है — तवांग। मोनपा लोग बताते हैं कि इस मठ को अपनी यह जगह कैसे मिली।"',
      text: 'In the far west of Arunachal Pradesh, up where the air is thin and the prayer flags never stop moving, live the Monpa people, who follow the Buddha\'s path. And above their valleys stands one of the largest monasteries in all the Himalaya — Tawang. The Monpa tell this about how it found its place.' },
    { art: ['courtier', 'buddha'], who: null,
      hi: '"तीन सौ से भी ज़्यादा साल पहले, मेरा लामा नाम के एक लामा को इन पहाड़ों में एक विशाल मठ बनाने का काम सौंपा गया था। कोई मठ यूँ ही कहीं भी नहीं खड़ा कर दिया जाता। वहाँ पानी होना चाहिए, तेज़ हवाओं से ओट होनी चाहिए, ज़मीन ऐसी जो उसे संभाल सके, और एक ऐसी चीज़ जिसका नाम लेना मुश्किल है — एक सही जगह होने का अहसास।"',
      text: 'More than three hundred years ago, a lama called Mera Lama was charged with building a great monastery in these mountains. A monastery is not put just anywhere. It must have water, and shelter from the worst winds, and ground that can hold it, and something harder to name — a rightness.' },
    { art: ['courtier'], who: null, mood: 'think',
      hi: '"मेरा लामा खोजते रहे। एक के बाद दूसरी पहाड़ी, एक के बाद दूसरी घाटी, उन्होंने हर जगह को परखा और हर जगह बस लगभग सही थी, जो ग़लत होने का सबसे थका देने वाला रूप है। और एक शाम, खोज में गहरे डूबे हुए, वे प्रार्थना करने रुके — और जब वे प्रार्थना से उठे, तो उनका घोड़ा गायब था।"',
      text: 'Mera Lama searched. Ridge after ridge, valley after valley, he weighed each place and each place was almost right, which is the most tiring kind of wrong. And one evening, deep in the search, he stopped to pray — and when he rose from his prayers, his horse was gone.' },
    { art: ['courtier'], who: null, mood: 'sad',
      hi: '"ऊँचे पहाड़ों में आप भले ही बहुत-सी चीज़ें आसानी से खो बैठें, पर घोड़ा उनमें से नहीं है। वे पैदल ही उसके पीछे निकल पड़े — बुरांश के पेड़ों के बीच से ऊपर चढ़ते हुए, पहाड़ी की ढलान पार करते हुए, खुरों के निशानों के पीछे-पीछे, और उधर दिन का उजाला लगातार ढलता जा रहा था।"',
      text: 'You may lose many things lightly in the high mountains. A horse is not one of them. He went after it on foot — up through the rhododendrons, over a shoulder of hill, following the prints, and the light going all the while.',
      ask: {
        q: 'The lama has searched with all his learning and found nothing. Now he is just following a wandering horse. Is the search ruined?',
        options: ['Yes — a lost horse is a lost day', 'No — sometimes the answer is found by the one who is not searching', 'He should get a new horse'],
        answer: 1,
        right: 'Hold that thought and watch where the horse stops.',
        wrong: 'It was the opposite of ruined. Sometimes the answer is found by the one who is not searching. Watch where the horse stops.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"उन्हें वह घोड़ा पहाड़ के एक ऊँचे और खुले ढलान पर शांत खड़ा मिला, आराम से चरता हुआ, मानो वह अपनी मंज़िल पर पहुँच गया हो। और मेरा लामा पीछा करना छोड़कर ठहर गए, और खड़े होकर अपने चारों तरफ देखा — सचमुच आँखें खोलकर देखा — उस जगह को, जिसे उनके घोड़े ने चुना था।"',
      text: 'He found the horse standing still on a high open shoulder of mountain, grazing peacefully, as though it had arrived somewhere. And Mera Lama stopped chasing and stood, and looked around him — really looked — at the place his horse had picked.' },
    { art: ['courtier', 'buddha'], who: null,
      hi: '"पास ही पानी। पीछे की पहाड़ी हवा को रोकती हुई। नीचे खुली किताब की तरह फैली घाटियाँ, और पीछे गवाह बनकर खड़ी ऊँची चोटियाँ। उन सभी महीनों में उन्होंने जितनी भी \'लगभग सही\' जगहें परखी थीं — और उनका घोड़ा बिना किसी सोच-विचार के चुपचाप चल पड़ा था, और पहाड़ों की सबसे सही जगह के बीचों-बीच जाकर खड़ा हो गया था।"',
      text: 'Water near. The wind broken by the ridge at its back. The valleys spread below like an open book, and the high peaks standing witness behind. Every almost-right place he had weighed all those months — and his horse had walked off, without a single opinion in its head, and stood down in the middle of the rightest place in the mountains.' },
    { art: ['courtier'], who: null,
      hi: '"वहीं वह मठ बना, और आज भी वहीं खड़ा है — और उसका नाम पूरी कहानी को सँभाले हुए है। तवांग: घोड़े द्वारा चुना गया। \'ता\' यानी घोड़ा, और \'वांग\' यानी चुनना। किसी मोनपा से पूछिए कि उनके इस महान मठ के नाम का क्या मतलब है, और वे आपको एक ऐसे लामा की बात बताएँगे जो इतने समझदार थे कि उन्होंने एक घोड़े की सलाह मान ली।"',
      text: 'There the monastery was built, and there it stands — and its name remembers the whole story. Tawang: chosen by horse. Ta for the horse, wang for the choosing. Ask a Monpa what the name of their great monastery means and they will tell you about a lama who was wise enough to take a horse\'s advice.' },
    { art: ['buddha'], who: null,
      hi: '"आज तवांग में सैकड़ों भिक्षु रहते और पढ़ते हैं, मक्खन के दीये जलते हैं, और विशाल प्रार्थना कक्ष में घर से भी ऊँची बुद्ध की प्रतिमा है। और इस सब की कहानी के पीछे कहीं एक शाम है, एक प्रार्थना है, और चुपचाप दूर जाता हुआ एक घोड़ा।"',
      text: 'Today hundreds of monks live and study at Tawang, and the butter lamps burn, and the great prayer hall holds a Buddha figure taller than a house. And somewhere in the story of all of it is an evening, a prayer, and a horse quietly walking away.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"मोनपा लोग एक ऐसी सीख हैं जिसे याद रखना चाहिए: अरुणाचल कई तरह के लोगों और कई राहों का संगम है — दोनी-पोलो को मानने वाले तानी लोग, बुद्ध के रास्ते पर चलने वाले मोनपा, और इनके अलावा भी कई और, हर कोई अपने आप में पूरा। एक ऐसा राज्य, जिसे गुलदस्ते की तरह सहेज कर रखा गया हो।"',
      text: 'The Monpa are a reminder worth keeping: Arunachal is many peoples and many paths — the Tani peoples with Donyi-Polo, the Monpa with the Buddha\'s way, and others besides, each holding their own whole. One state, held like a bouquet.' }
  ],
  moral: 'Search with all your might — and stay humble enough to notice when the answer wanders off and finds itself.',
  source: 'The Monpa tradition of the founding of Tawang monastery in Arunachal Pradesh by Mera Lama in the seventeenth century, and the name\'s meaning — "chosen by horse" — as the Monpa tell it. The monastery stands and is among the largest in the Himalaya. Many tellings.'
},

/* ============================================================= SIKKIM ===== */
{
  id: 'fk.teesta-rangeet',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Race of the Two Rivers',
  hook: 'Two rivers set out from the high snows to meet in the valley. One followed a snake. One followed a bird.',
  hero: 'pt_crow',
  cast: ['pt_crow', 'courtier', 'guard'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['नदी', 'nadi', 'river'], ['साँप', 'saanp', 'snake'], ['तितली', 'titli', 'butterfly']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'सिक्किम के लेप्चा लोग बताते हैं कि उनकी दो महान नदियाँ कभी एक-दूसरे से प्यार करने वाले दो साथी थीं: रोंगन्यू, जिसे अब नक्शों में तीस्ता कहा जाता है, और रोंगीत, जिसका नाम आज भी वही है। वे ऊँची बर्फ़ में एक-दूसरे से बहुत दूर शुरू हुईं, और उन्होंने तय किया कि पहाड़ों से नीचे उतरकर नीचे घाटी में मिलेंगी।',
      text: 'The Lepcha of Sikkim tell that their two great rivers were once two who loved each other: Rongnyu, whom the maps now call the Teesta, and Rongeet, who keeps his name. They rose far apart in the high snows, and they agreed to come down through the mountains and meet in the valley below.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'लेकिन पहली बार बहने वाली नदी को नीचे जाने का रास्ता नहीं पता होता—क्योंकि उससे पहले कोई कभी नीचे गया ही नहीं था। इसलिए दोनों ने एक-एक राह दिखाने वाला चुन लिया। रोंगन्यू ने परिल बू यानी साँप को चुना। रोंगीत ने तुत फ़ो यानी एक पहाड़ी चिड़िया को चुना। और आपको अभी से अंदाज़ा होने लगा होगा कि कहानी किस तरफ़ मुड़ रही है, है न?',
      text: 'But a river setting out for the first time does not know the way down — nobody had ever gone down before. So each took a guide. Rongnyu chose Paril bu, the snake. Rongeet chose Tut fo, a mountain bird. And you can already feel the story leaning, can\'t you.' },
    { art: ['courtier'], who: null,
      hi: 'साँप वैसे ही चला जैसे साँप चलते हैं: चुपचाप, धीरज से, ज़मीन से सटकर, ढलान का रास्ता चुनते हुए और उसी पर टिके रहते हुए। और रोंगन्यू लंबे, सहज घुमावों में उसके पीछे-पीछे नीचे बहती रही, रास्ते में छोटी धाराओं को समेटती हुई, और शांत, भरपूर और समय से पहले घाटी में पहुँच गई।',
      text: 'The snake went as snakes go: smooth, patient, low, choosing the fall of the land and keeping to it. And Rongnyu followed him down in long easy curves, gathering streams as she went, arriving in the valley calm and full and early.' },
    { art: ['pt_crow'], who: null, mood: 'wow',
      hi: 'चिड़िया वैसे ही उड़ी जैसे चिड़ियाँ उड़ती हैं। उसे कोई देखने लायक चोटी दिखी तो वह उसे देखने लगी। उसका मन किसी बेर पर आ गया तो वह रास्ता बदलकर उधर उड़ गई। पूरी-पूरी दोपहर वह भूल ही जाती कि कोई उसके पीछे भी आ रहा है। और उसके पीछे रोंगीत तंग घाटियों में टकराता और मुड़ता हुआ, हर उस गलत घाटी में भटकता चला गया जहाँ चिड़िया की मौज उसे ले गई।',
      text: 'The bird went as birds go. He saw a ridge worth looking at and looked at it. He fancied a berry and detoured for it. He forgot, for whole afternoons, that anyone was following him at all. And behind him Rongeet went crashing and doubling through the gorges, taking every wrong valley the bird\'s fancy took.' },
    { art: ['guard'], who: null, mood: 'sad',
      hi: 'इसलिए जब रोंगीत आखिरकार मिलने की जगह पर पहुँचा—थका-हारा, झाग छोड़ता हुआ, कई दिन देर से—तो रोंगन्यू पहले से ही वहाँ उसका इंतज़ार कर रही थी। और खुशी होने के बजाय, उसे सबसे पहले हार जाने की तीखी जलन महसूस हुई। "थी सा था?" वह चिल्लाया—"तुम कब पहुँचीं?" लेप्चा लोग आपको बताएंगे कि तीस्ता नाम उसी पुकार की याद दिलाता है।',
      text: 'So when Rongeet came down at last into the meeting place — tired, foaming, days behind — Rongnyu was already there, waiting. And instead of gladness, the first thing he felt was the hot rush of having been beaten. "Thee sa tha?" he cried — "When did YOU arrive?" The Lepcha will tell you the name Teesta remembers that very cry.' },
    { art: ['guard', 'courtier'], who: null, mood: 'think',
      hi: 'और अपने आहत स्वाभिमान में, रोंगीत पीछे हट गया और मुड़ने लगा—उलटा, ऊपर पहाड़ की तरफ़, दूर बहने लगा—और उसका पानी पूरी घाटी में ऊपर चढ़कर काँपने लगा।',
      text: 'And in his hurt pride, Rongeet reared back and began to turn — to flow backwards, uphill, away — and the waters rose and trembled through the whole valley.',
      ask: {
        q: 'Rongeet has lost the race and is about to turn away in shame. What can Rongnyu say?',
        options: ['\"I won and you lost\"', '\"It was never a race — I was not ahead of you, I was waiting for you\"', 'Nothing — let him go'],
        answer: 1,
        right: 'That is what she said. There is all the difference in the world between someone ahead of you and someone waiting for you.',
        wrong: 'She said the one thing that mattered: "It was never a race. I was not ahead of you — I was waiting for you." There is all the difference in the world between those two.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'पानी शांत हो गया। रोंगीत आखिरी मील हौले-हौले बहती हुई आई, और दोनों नदियाँ आपस में मिल गईं — और तब से वे कभी अलग नहीं हुईं। आज भी तुम मेल्ली के नीचे उस संगम पर खड़े होकर उन्हें मिलते देख सकते हो: पानी के दो अलग-अलग रंग, जो फिसलकर एक हो जाते हैं।',
      text: 'The waters settled. Rongeet came the last mile gently, and the two rivers met — and they have never parted since. You can stand today at the meeting place below Melli and watch them join: two colours of water, sliding into one.' },
    { art: ['pt_crow'], who: null,
      hi: 'और लेपचा लोग कहते हैं कि खुद घाटी भी खुश हो गई थी। नदियों के उस मिलन पर, आज भी हवा तितलियों से भर जाती है — बादलों जैसे झुंड, जो उस पानी के ऊपर मँडराते रहते हैं जहाँ रोंगन्यू और रोंगीत मिली थीं। जाकर देखो। वे वहीं हैं।',
      text: 'And the Lepcha say the valley itself was glad. At the joining of the rivers, to this day, the air fills with butterflies — clouds of them, drifting over the water where Rongnyu and Rongeet met. Go and see. They are there.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'कोई लेपचा बुज़ुर्ग तुम्हें बताएंगे कि यह संगम शादियों के लिए और झगड़े सुलझाने की जगह है, और साँप और चिड़िया दोनों ही बड़े अच्छे राह दिखाने वाले थे — एक मंज़िल तक पहुँचाने के लिए, और एक रास्ते में पहाड़ों को अच्छी तरह देखने के लिए। सब इस बात पर निर्भर करता है कि सफ़र किस लिए है।',
      text: 'A Lepcha elder will tell you the confluence is a place for weddings and for making up quarrels, and that the snake and the bird were both good guides — one for arriving, one for seeing the mountains properly on the way. It depends what a journey is for.' }
  ],
  moral: 'Losing a race hurts less the moment you learn nobody was racing — someone was waiting for you.',
  source: 'Lepcha oral tradition of Sikkim — the rivers Rongnyu (Teesta) and Rongeet, their guides Paril bu the snake and Tut fo the bird, and their meeting; the butterflies at the confluence are part of the telling and of the place. Many versions.'
},

{
  id: 'fk.tendong-hill',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Hill That Held Its People Up',
  hook: 'The waters rose and rose over the valleys. One hill rose with them.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['पहाड़ी', 'pahaadi', 'hill'], ['बाढ़', 'baadh', 'flood'], ['शरण', 'sharan', 'refuge']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'सिक्किम के लेपचा लोग बहुत पुराने ज़माने की एक बात बताते हैं, जब बारिश रुकने का नाम ही नहीं ले रही थी। कुछ कहानियाँ कहती हैं कि यह सब दोनों नदियों के झगड़े से शुरू हुआ; कुछ में कोई वजह नहीं बताई जाती, क्योंकि बारिश हमेशा वजह बताकर नहीं आती। घाटियाँ भर गईं। नदियाँ अपने किनारे भूल गईं। पानी बढ़ता ही चला गया।',
      text: 'The Lepcha of Sikkim tell of a time, deep in the long-ago, when the rains would not stop. Some tellings say it began with the quarrel of the two rivers; some do not say why at all, because rain does not always give reasons. The valleys filled. The rivers forgot their banks. The water rose.' },
    { art: ['courtier', 'guard'], who: null, mood: 'sad',
      hi: 'लोग ऊपर चढ़ते गए, क्योंकि इसके सिवा कोई चारा भी नहीं था। उनके पीछे एक के बाद एक पहाड़ी डूबती चली गई। और कहानियाँ सच-सच बताती हैं कि उस वक़्त कैसा लग रहा था: उनकी जानी-पहचानी दुनिया उस मटमैले पानी के नीचे सिमटती जा रही थी, और कोई नहीं बता सकता था कि यह सिमटना कहाँ जाकर रुकेगा।',
      text: 'The people climbed, because that is all you can do. Hill after hill went under behind them. And the tellings are honest about how that felt: the world they knew was being folded away under grey water, and nobody could say where the folding would stop.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'तभी, डूबी हुई घाटियों के ऊपर, एक पहाड़ी ने वह कर दिखाया जो कोई पहाड़ी नहीं करती। दक्षिणी सिक्किम में तेंदोंग पहाड़ी ऊपर उठने लगी। जैसे-जैसे पानी चढ़ा, पहाड़ी भी ऊपर उठती गई — उसने खुद को और अपने ऊपर मौजूद हर इंसान को बाढ़ से ऊपर उठा लिया, ठीक वैसे ही धीरज के साथ जैसे कोई दादाजी किसी बच्चे को पानी भरे गड्ढे के ऊपर उठा लेते हैं।',
      text: 'Then, above the drowned valleys, one hill did what no hill does. Tendong, in the south of Sikkim, rose. As the water climbed, the hill climbed — lifting itself, and everyone on it, above the flood, patient as a grandfather raising a child over a puddle.',
      ask: {
        q: 'The people on Tendong watch the water climb and the hill climb with it. What do they do up there?',
        options: ['Fight over the highest spot', 'Stay together, share what they carried, and ask the hill\'s help properly', 'Each family fend for itself'],
        answer: 1,
        right: 'That is how the Lepcha tell it: together, sharing, and asking properly — with prayer and with respect. The hill was helping; the people helped each other.',
        wrong: 'The tellings remember it differently: they stayed together, shared what little they had carried up, and asked the hill\'s help properly, with prayer. The hill was helping; the people helped each other.'
      } },
    { art: ['courtier'], who: null,
      hi: 'कई दिनों तक वह पहाड़ी चोटी ही पूरा देश बनी रही — सबका एक गाँव, जो धूसर पानी और धूसर आसमान के बीच टिका था। सब एक-दूसरे को गर्माहट दे रहे थे और नन्हे-मुन्नों को किनारे से दूर रख रहे थे, जबकि उनके नीचे तेंडोंग डटा रहा, और डटा रहा, और डटा रहा।',
      text: 'For days the hilltop was the whole country — a village of everyone, perched between grey water and grey sky, keeping each other warm and keeping the little ones from the edge, while below them Tendong held, and held, and held.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: 'और फिर एक सुबह बारिश बस थम गई। पानी बिना किसी हड़बड़ी के घटने लगा, बिल्कुल वैसे ही जैसे वह आया था। एक-एक कगार के साथ दुनिया लौट आई — धुली हुई, बदली हुई, पर वहीं मौजूद। और लोग तेंडोंग से उतरकर उसमें आए, और फिर से नई शुरुआत की।',
      text: 'And then one morning the rain simply finished. The water began to go down, unhurried, the way it had come. Ridge by ridge the world came back — rinsed, changed, but there. And the people came down off Tendong into it, and began again.' },
    { art: ['guard'], who: 'guard',
      hi: 'वे भूले नहीं। तुम उस ज़मीन को नहीं भूलते जिसने तुम्हें थामे रखा। तब से हर साल — पीढ़ियों-दर-पीढ़ियों से, हर एक साल — लेपचा लोग उस पहाड़ का धन्यवाद करने ऊपर चढ़ते हैं। इस त्योहार को तेंडोंग ल्हो रम फ़ात कहा जाता है: तेंडोंग पहाड़ की पूजा। यह आज भी, हर अगस्त में मनाया जाता है।',
      text: 'They did not forget. You do not forget the ground that held you up. Every year since — every single year, down all the generations — the Lepcha have climbed to thank the hill. The festival is called Tendong Lho Rum Faat: the worship of the Tendong hill. It is kept still, each August.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'परिवार मिलकर ऊपर जाते हैं, पुरानी रस्में निभाई जाती हैं, और बच्चों को यह कहानी उसी पहाड़ पर सुनाई जाती है जहाँ यह घटी थी — जो किसी भी कहानी के लिए सबसे अच्छी पाठशाला है।',
      text: 'Families go up together, the old rites are said, and the children are told this story on the hill it happened on — which is the best classroom any story ever had.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'पूरी धरती के लोग एक महाप्रलय को याद करते हैं, और हर कोई इसे अपने ढंग से याद रखता है। लेपचा लोगों की इस कहानी में मुझे जो बात सबसे अच्छी लगती है, वह यह है कि धन्यवाद किसे दिया जाता है: उसे नहीं जिसने पानी को दूर भगाया, बल्कि उस ज़मीन को जिसने चुपचाप सबको संभाले रखा। ध्यान दो कि तुम्हें कौन संभाले रखता है। हर साल उनका धन्यवाद करो।',
      text: 'Peoples all over the earth remember a great flood, and each remembers it their own way. What I love in the Lepcha telling is where the thanks goes: not to the one who sent the water away, but to the ground that quietly held everybody up. Notice who holds you up. Thank them yearly.' }
  ],
  moral: 'When the flood is over, go back and thank whatever held you up.',
  source: 'Lepcha oral tradition of Sikkim — the great flood and the rising of Tendong hill, remembered every August at the festival of Tendong Lho Rum Faat, which is still kept. Many tellings.'
},

{
  id: 'fk.khangchendzonga-five',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Five Treasures of the Great Snow',
  hook: 'The third-highest mountain on earth has five summits — and the people of Sikkim will tell you each one is a treasury.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['ख़ज़ाना', 'khazana', 'treasure'], ['बर्फ़', 'barf', 'snow'], ['रक्षक', 'rakshak', 'guardian']],
  scenes: [
    { art: ['guard'], who: null,
      hi: 'सिक्किम के ऊपर खांगचेंदजोंगा खड़ा है, जो दुनिया का तीसरा सबसे ऊँचा पर्वत है — और भूटिया तथा लेपचा लोगों के लिए, यह उससे कहीं बढ़कर है। इसका नाम धीरे-धीरे बोलो, वैसे ही जैसे भूटिया लोगों ने इसे नाम दिया था: खांग-चेन-द्ज़ों-गा। पाँच खज़ानों की महान बर्फ़। यह नाम महज़ एक विवरण नहीं है। यह तो खज़ानों की पूरी सूची है।',
      text: 'Over Sikkim stands Khangchendzonga, the third-highest mountain in the world — and to the Bhutia and the Lepcha, far more than that. Say its name slowly, the way the Bhutia gave it: Khang-chen-dzö-nga. The great snow of the five treasuries. The name is not a description. It is an inventory.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"पाँच चोटियाँ, पाँच ख़ज़ाने। कहानियों में इन्हें आमतौर पर ऐसे गिनाया जाता है: सोना, चाँदी और कीमती रत्न; अनाज; और पवित्र ग्रंथ — पावन ज्ञान। कुछ लोग इसमें नमक जोड़ते हैं, तो कुछ दवाइयाँ। यह सब कुछ पहाड़ के भीतर बंद है, दुनिया की सबसे गहरी बर्फ़ के नीचे।"',
      text: 'Five summits, five treasuries. The tellings usually count them so: gold, and silver, and precious stones; grain; and sacred books — the holy knowledge. Some add salt, some add medicines. Locked in the mountain, all of it, under the deepest snow on earth.' },
    { art: ['courtier'], who: null,
      hi: '"और इन ख़ज़ानों के एक रखवाले भी हैं। ज़ोंगा, सिक्किम के रक्षक देवता, ऊँची बर्फ़ पर सवार होकर धरती की निगरानी करते हैं — पांग ल्हाबसोल के त्योहार पर आप उन्हें नृत्य के रूप में देख सकते हैं, लाल मुखौटा पहने हुए, भव्य, मानो पहाड़ को ही एक दिन के लिए एक चेहरा मिल गया हो।"',
      text: 'And the treasuries have a keeper. Dzönga, the guardian god of Sikkim, rides the high snows and watches over the land — you can see him danced at the festival of Pang Lhabsol, masked in red, magnificent, the mountain itself given a face for a day.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"अब यहाँ वह सवाल आता है जो सिक्किम का कोई भी बच्चा कभी न कभी ज़रूर पूछता है, और यह सवाल बिल्कुल सही है: अगर पहाड़ सोने और अनाज से भरा है, तो कोई वहाँ जाकर उसे ले क्यों नहीं आता?"',
      text: 'Now here is the question a child in Sikkim eventually asks, and it is the right question: if the mountain is full of gold and grain, why does nobody go and get it?',
      ask: {
        q: 'Five treasuries, sitting in the snow. When are they for?',
        options: ['For whoever climbs up first', 'For the day the world is truly in need — and not before', 'They are just a story about rocks'],
        answer: 1,
        right: 'That is the tradition: the treasures wait for the time of great need. They are not a prize. They are a promise.',
        wrong: 'Not for climbing after, and not just rocks. The tradition says they wait for the day the world is truly in need — and not before. Not a prize. A promise.'
      } },
    { art: ['courtier'], who: 'courtier',
      hi: '"सोचिए कि इससे ख़ज़ाने का क्या मतलब हो जाता है। जो सोना आप ख़र्च कर देते हैं, वह ख़त्म हो जाता है। पर जो सोना पहरे में इंतज़ार करता है, उस दिन के लिए जब सबको उसकी ज़रूरत होगी — वह सिर्फ़ दौलत नहीं रह जाता। वह उम्मीद की एक ऐसी जमा-पूँजी बन जाता है, जिसे साढ़े आठ हज़ार मीटर की ऊँचाई पर सहेज कर रखा गया है, जहाँ किसी का लालच नहीं पहुँच सकता।"',
      text: 'Think what that does to a treasure. Gold you spend is gone. Gold that waits, guarded, for the day everyone needs it — that is not wealth any more. That is a reserve of hope, parked where nobody\'s greed can reach it, at eight and a half thousand metres.' },
    { art: ['guard'], who: null,
      hi: '"इससे पहाड़ को देखने का नज़रिया ही बदल जाता है। किसी साफ़ सुबह पूरा सिक्किम इसे देख सकता है — और पुरानी परंपरा कहती है कि वे जो देख रहे हैं, वह दुनिया का आपातकालीन भंडार है, जिसे इसके रक्षक ने पूरी निष्ठा से संभाल कर रखा है और जिसकी अभी तक किसी को ज़रूरत नहीं पड़ी। उन पाँच चोटियों पर हर सूर्योदय यह अच्छी ख़बर है कि सबसे बुरा दिन अभी नहीं आया है।"',
      text: 'It changes how you look at the mountain. On a clear morning the whole of Sikkim can see it — and what they are seeing, the old tradition says, is the world\'s emergency store, kept faithfully by its guardian, needed by nobody yet. Every sunrise on those five summits is the good news that the worst day has still not come.' },
    { art: ['guard', 'courtier'], who: null,
      hi: '"यही वजह है कि चोटी पर पाँव नहीं रखा जाता। 1955 में जब पर्वतारोही पहली बार ऊपर पहुँचे थे, तो वे आदर के कारण मुख्य चोटी से ज़रा पहले ही रुक गए थे, और तब से ज़्यादातर लोगों ने ऐसा ही किया है। आप ख़ज़ाने की चौखट तक जा सकते हैं। पर आप तहख़ाने की छत पर खड़े नहीं होते।"',
      text: 'It is why the summit is not stood upon. When climbers first reached the top in 1955, they stopped short of the very summit out of respect, and most have done the same since. You may visit the treasury\'s doorstep. You do not stand on the roof of the vault.' },
    { art: ['guard'], who: 'mithu',
      hi: '"लेपचा, जो यहाँ सबसे पहले बसे थे, इस पहाड़ को अपने कुल का सबसे बड़ा बुज़ुर्ग मानते हैं — उनकी अपनी कहानी भी इस ऐप में मौजूद है। दो अलग-अलग लोग, एक ही पहाड़ का आदर करने के दो तरीके, और पहाड़ के पास दोनों के लिए जगह है। ख़ज़ाने ऐसे ही तो होते हैं।"',
      text: 'The Lepcha, who were here first, hold the mountain as eldest kin — their own telling is in this app too. Two peoples, two ways of honouring one mountain, and the mountain has room for both. Treasuries are like that.' }
  ],
  moral: 'The best treasure is the kind kept safe for the day everyone needs it — not spent on the day one person wants it.',
  source: 'Bhutia and Lepcha tradition of Sikkim — Khangchendzonga, "the great snow of the five treasuries," its guarded treasures and its guardian Dzönga, honoured at Pang Lhabsol; the lists of the five differ between tellings. The 1955 climbers\' stop short of the summit is history. Many versions.'
},

{
  id: 'fk.kabi-lungchok',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Brothers of the Standing Stones',
  hook: 'Two peoples, two chiefs, one oath — with a mountain called in as witness. The stones they raised are still standing.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['क़सम', 'qasam', 'oath'], ['भाईचारा', 'bhaichara', 'brotherhood'], ['गवाह', 'gawah', 'witness']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"बहुत समय पहले सिक्किम में, दो समुदाय एक छोटे, ढलानों से भरे और खूबसूरत देश को आपस में साझा करने लगे। लेपचा लोग तो यादों से भी पुराने वक्त से वहाँ रह रहे थे — बर्फ़ीली चोटी की संतान। भूटिया लोग उत्तर के ऊँचे दर्रों को पार करके अपने याकों और प्रार्थना के झंडों के साथ आए थे। घाटियाँ वही थीं। भाषाएँ अलग। सब कुछ अलग।"',
      text: 'Long ago in Sikkim, two peoples found themselves sharing one small, steep, beautiful country. The Lepcha had been there since before memory — the children of the snowy peak. The Bhutia had come over the high passes from the north with their yaks and their prayer flags. Same valleys. Different languages. Different everything.' },
    { art: ['courtier', 'guard'], who: null, mood: 'think',
      hi: '"और हर कोई जानता है कि ऐसी कहानी का अगला हिस्सा क्या होता है, क्योंकि दुनिया इसे हज़ारों बार देख चुकी है: पहले शक, फिर झगड़े, और फिर उससे भी बुरा। दोनों समुदायों के मुखिया — लेपचा लोगों के महान बुज़ुर्ग थेकॉन्ग टेक, और भूटिया सरदार ख्ये बुमसा — दोनों ही इस आने वाले मोड़ को देख सकते थे।"',
      text: 'And everyone knows the usual next chapter of that story, because the world has told it a thousand times: suspicion, then quarrels, then worse. The leaders of the two peoples — Thekong Tek, the great Lepcha elder, and Khye Bumsa, the Bhutia chief — could each see that chapter coming.' },
    { art: ['guard'], who: 'guard',
      hi: '"इसलिए उन्होंने एक अलग कहानी रचने का फैसला किया। वे उत्तर में काबी लुंगचोक नाम की जगह पर, पेड़ों के बीच एक खुले मैदान में मिले — व्यापार करने नहीं, घाटियों को आपस में बाँटने नहीं, बल्कि कुछ इससे भी बड़ा करने: भाई बनने के लिए। दोस्त नहीं। भाई। बाक़ायदा, हमेशा-हमेशा के लिए, दोनों समुदाय एक साथ।"',
      text: 'So they chose to write a different one. They met at a place called Kabi Lungchok, in the north, in a clearing among the trees — not to trade, not to divide the valleys up, but to do something bigger: to become brothers. Not friends. Brothers. Formally, permanently, both peoples at once.',
      ask: {
        q: 'Two peoples want to bind themselves as family forever. What does an oath that big need?',
        options: ['A written contract', 'A witness that will outlive everyone who swears', 'A feast'],
        answer: 1,
        right: 'That is why they swore before Khangchendzonga itself — a witness that would still be standing when every person at the oath was generations gone.',
        wrong: 'Paper rots and feasts end by morning. They needed a witness that would outlive everyone who swore — so they swore before Khangchendzonga itself.'
      } },
    { art: ['courtier', 'guard'], who: null, mood: 'wow',
      hi: '"पेड़ों के पार खड़े पहाड़ को गवाह मानकर, दोनों सरदारों ने लेपचा और भूटिया के बीच भाईचारे की कसम खाई — और उन्होंने काबी लुंगचोक में बड़े-बड़े पत्थर खड़े किए ताकि यह कसम अपनी जगह टिकी रहे, ठीक वैसे जैसे आप किसी ज़रूरी कागज़ पर कोई वज़न रख देते हैं, बस यहाँ वज़न ग्रेनाइट का था और वह कागज़ हमेशा के लिए था।"',
      text: 'With the mountain standing witness over the trees, the two chiefs swore the bond of brothers between Lepcha and Bhutia — and they raised standing stones at Kabi Lungchok to hold the oath in place, the way you would set a weight on an important paper, except the weight was granite and the paper was forever.' },
    { art: ['courtier'], who: null,
      hi: '"और वह कसम क़ायम रही। पूरी तरह से बिना किसी कमी के तो नहीं — दो समुदायों की कोई भी लंबी कहानी एकदम परिपूर्ण नहीं होती — लेकिन वह वैसे ही टिकी रही जैसे वे पत्थर टिके रहे: हर मौसम में, सदियों के पार, और उन तमाम बातों के बीच जो आम तौर पर ऐसे वादों को मिटा देती हैं। लेपचा और भूटिया ने आपस में रिश्ते जोड़े, मिलकर दावतें उड़ाईं, खेती की और साथ मिलकर दुख बाँटे — अपनी पसंद से बने हुए भाई।"',
      text: 'And the oath held. Not perfectly — no long story of two peoples is perfect — but it held the way the stones held: through weathers, through centuries, through everything that usually wears such promises away. Lepcha and Bhutia married, feasted, farmed and mourned together, brothers by their own choosing.' },
    { art: ['guard'], who: null,
      hi: '"हर साल पांग ल्हाबसोल पर, जब सिक्किम अपने रक्षक पर्वत का आदर करता है, तब उस कसम को भी याद किया जाता है — यह त्योहार दोनों को एक साथ मनाता है, रक्षक को भी और भाईचारे को भी, क्योंकि सिक्किम में ये दोनों एक ही याद हैं: वह दिन जब पर्वत से दो समुदायों को उनके वादे पर कायम रखने को कहा गया था।"',
      text: 'Every year at Pang Lhabsol, when Sikkim honours its guardian mountain, the oath is remembered too — the festival carries both at once, the guardian and the brotherhood, because in Sikkim the two are the same memory: the day the mountain was asked to hold two peoples to their word.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और वे पत्थर आज भी वहीं हैं। आप आज भी गंगटोक से उत्तर की सड़क पर काबी लुंगचोक जा सकते हैं, और उनके सामने खड़े हो सकते हैं: जिन पर कुछ लिखा नहीं है, जिन्हें पढ़ा नहीं जा सकता, पर जिनका मतलब बिल्कुल साफ है। दो समुदायों ने एक परिवार बनने का फैसला किया, और अपनी सबसे बड़ी जानी-पहचानी चीज़ से कहा कि वह उन्हें इस वादे पर बाँधे रखे।"',
      text: 'And the stones are still there. You can visit Kabi Lungchok today, on the road north from Gangtok, and stand in front of them: unwritten, unreadable, and perfectly clear. Two peoples decided to be family, and told the biggest thing they knew to hold them to it.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अच्छे दिनों में तो कोई भी वादा कर सकता है। काबी लुंगचोक की समझदारी यह जानने में है कि आने वाली पीढ़ियाँ शायद अलग तरह से सोचें — और उनके लिए एक ऐसा गवाह तय कर देना जिसकी उम्र से ज़्यादा कोई जी न सके और जिससे कोई बहस न कर सके। अगर कोई बड़ा वादा करो, तो उसे किसी ऐसी चीज़ के सामने कहो जो हमेशा टिकी रहे।"',
      text: 'Anyone can promise in fair weather. The wisdom of Kabi Lungchok is knowing your descendants might feel differently — and setting a witness over them that none of them can outlive or argue with. If you make a big promise, tell it to something that lasts.' }
  ],
  moral: 'A promise meant to outlive you should be witnessed by something that will.',
  source: 'Sikkimese tradition, held by Bhutia and Lepcha alike — the oath of blood-brotherhood sworn between Khye Bumsa and Thekong Tek at Kabi Lungchok with Khangchendzonga as witness; the standing stones remain at the site, and the bond is remembered at Pang Lhabsol. Many tellings.'
},

{
  id: 'fk.mutanchi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Children of the Snowy Peak',
  hook: 'Where do the Lepcha come from? From the mountain itself — from its own fresh snow.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['बर्फ़', 'barf', 'snow'], ['पुरखे', 'purkhe', 'ancestors'], ['नाम', 'naam', 'name']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: '"हर समुदाय के पास इस सबसे पुराने सवाल का एक जवाब होता है — हम कहाँ से आए हैं? — और सिक्किम के लेप्चा लोगों का जवाब शायद इन पहाड़ों में सबसे खूबसूरत है। उनकी कहानियों के मुताबिक, वे खुद उसी पर्वत से आए हैं।"',
      text: 'Every people carries an answer to the oldest question — where do we come from? — and the Lepcha answer of Sikkim may be the most beautiful one in these mountains. They come, their telling says, from the mountain itself.' },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"शुरुआत में, इतबु-मू — सृष्टि रचने वाली माँ — ने बच्चों की चाह की। और उन्होंने उन्हें न तो मिट्टी से गढ़ा, न लकड़ी से, और न ही निचली गर्म घाटियों की किसी चीज़ से। उन्होंने खांगचेंदजोंगा के शिखर तक हाथ बढ़ाया और उसकी सबसे ऊँची चोटियों की सबसे पवित्र और ताज़ा बर्फ ली, और उसी से पहले पुरुष और पहली स्त्री को गढ़ा।"',
      text: 'In the beginning, Itbu-mu — the Mother Creator — wished for children. And she did not shape them from clay, or from wood, or from anything of the low warm valleys. She reached to the crown of Khangchendzonga and took the purest, freshest snow of its highest peaks, and from it she shaped the first man and the first woman.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"कहानियों में उनके नाम फुदोंगथिंग और नाज़ोंग-न्यु बताए गए हैं। और उन्हीं दोनों से लेप्चा समुदाय की शुरुआत हुई — इसीलिए, जब आप किसी लेप्चा से पूछेंगे कि वे कौन हैं, तो शायद आपको वह पुराना नाम सुनने को मिले जो उन्होंने अपने लिए रखा है: मुतांची रोंगकुप। यानी बर्फीली चोटी की संतान।"',
      text: 'Fudongthing and Nazong-nyu, the tellings name them. And from those two came the Lepcha people — which is why, when you ask a Lepcha who they are, you may hear the old name they keep for themselves: Mutanchi Rongkup. The children of the snowy peak.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"जरा एक पल के लिए इस बात पर रुकिए, क्योंकि यह जिस भी चीज़ को छूती है, सब बदल देती है। अगर आपके सबसे पहले पूर्वज पहाड़ की ही बर्फ से गढ़े गए थे, तो पहाड़ कोई देखने का नज़ारा नहीं है, न ही कोई जायदाद है, और न ही चढ़ाई करने की कोई चुनौती।"',
      text: 'Stop on that for a moment, because it changes everything it touches. If your first ancestors were shaped from the mountain\'s own snow, then the mountain is not scenery, and not property, and not a challenge to be climbed.',
      ask: {
        q: 'If your people were made from the mountain\'s own snow, what is the mountain to you?',
        options: ['A landmark', 'Your eldest kin — family that was here first', 'An obstacle on the way north'],
        answer: 1,
        right: 'Kin. The eldest of all kin. And you treat it precisely the way you treat an elder: with love, and without climbing on top of them.',
        wrong: 'Neither landmark nor obstacle. Kin — the eldest of all kin. And you treat it the way you treat an elder: with love, and without climbing on top of them.'
      } },
    { art: ['courtier', 'guard'], who: null,
      hi: '"और इसी बात ने लेप्चा लोगों को एक खास तरह का बना दिया: ऐसे लोग जो अपने रिश्तेदारों का ख्याल रखते हैं। अपने सबसे बड़े बुजुर्ग की गोद में रहते हुए, उन्होंने उसके पूरे घर-संसार को अच्छी तरह समझ लिया — लेप्चा लोगों के पास अपनी पहाड़ियों की लगभग हर चिड़िया, हर तितली, हर पौधे और हर झरने के लिए अपने नाम हैं, जीती-जागती दुनिया का पूरा का पूरा पारिवारिक बहीखाता।"',
      text: 'And it made the Lepcha a particular kind of people: the kind that pays attention to relatives. Living in the lap of their eldest kin, they learned its household completely — the Lepcha have their own names for nearly every bird, every butterfly, every plant and stream of their hills, a whole family register of the living world.' },
    { art: ['guard'], who: 'guard',
      hi: '"अपने पोते-पोतियों को यह बात सुनाते हुए एक लेप्चा दादी इसे सीधे-सादे ढंग से कहेंगी: \\"पहाड़ हमारे आने से पहले यहाँ था, और हम उसी चीज़ से बने हैं जिससे वह बना है। इसलिए नदियाँ तुम्हारी रिश्तेदार हैं, और जंगल तुम्हारे रिश्तेदार हैं, और रिश्तेदारों से कोई चोरी नहीं करता, और न ही कोई उन्हें भूलता है।\\""',
      text: 'A Lepcha grandmother, telling this to her grandchildren, will put it simply: "The mountain was here before us, and we are made of what it is made of. So the rivers are your relatives, and the forests are your relatives, and you do not steal from relatives, and you do not forget them."' },
    { art: ['courtier'], who: null,
      hi: '"जब पहले पर्वतारोही खांगचेंदजोंगा पर कदम रखने आए, तो सिक्किम ने उनसे बिल्कुल चोटी से थोड़ा पहले ही रुक जाने को कहा — और वे रुक गए, और तब से ज़्यादातर लोग ऐसा ही करते आए हैं। दुनिया इसे स्थानीय मान्यताओं का सम्मान करना कहती है। लेप्चा लोग इसे और अपनेपन से कहेंगे: मेहमान समझ गए थे कि वे किसी के दादा-दादी के घर में हैं।"',
      text: 'When the first climbers came to stand on Khangchendzonga, Sikkim asked them to stop short of the very top — and they did, and most have since. The world calls that respecting local belief. The Lepcha would say it more warmly: guests understood they were in somebody\'s grandparent\'s house.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"सिक्किम की घाटियों में लेप्चा लोग आज भी अपनी लेप्चा भाषा में यह कहानी सुनाते हैं — और मटकों की मीनार तथा दो नदियों की उनकी कहानियाँ भी इस ऐप में मौजूद हैं। एक छोटा-सा समुदाय जिसका पता बहुत ही बड़ा है: धरती के तीसरे सबसे ऊँचे पहाड़ की पहली संतान।"',
      text: 'The Lepcha still tell this, in Lepcha, in the valleys of Sikkim — and their telling of the tower of pots, and of the two rivers, are in this app too. A small people with a very great address: firstborn of the third-highest mountain on earth.' }
  ],
  moral: 'Know what you are made of, and you will know what to take care of.',
  source: 'Lepcha oral tradition of Sikkim — Itbu-mu the Mother Creator shaping the first pair, Fudongthing and Nazong-nyu, from the fresh snows of Khangchendzonga, and the Lepcha name Mutanchi Rongkup, children of the snowy peak. Presented from the inside, as the tradition holds it. Many tellings.'
},

{
  id: 'fk.snow-keeper',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Shy Keeper of the High Snows',
  hook: 'Nobody has ever properly seen him. That, say the herders, is exactly how he likes it.',
  hero: 'guard',
  cast: ['guard', 'courtier'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['निशान', 'nishaan', 'footprint'], ['शर्मीला', 'sharmila', 'shy'], ['चुप्पी', 'chuppi', 'silence']],
  scenes: [
    { art: ['guard'], who: null,
      hi: '"सिक्किम के आखिरी गाँवों के ऊपर, याक के चरागाहों के ऊपर, यहाँ तक कि प्रार्थना वाले झंडों के भी ऊपर, एक ऐसा इलाका है जो किसी का नहीं है — ऊँची बर्फ का इलाका। सिवाय इसके कि जो चरवाहे उसके पास गर्मियाँ बिताते हैं, भूटिया और लेप्चा दोनों, वे आपसे धीरे से कहेंगे कि वह सचमुच किसी का तो है। बस वे आपको ठीक-ठीक यह नहीं बता पाएँगे कि वह दिखता कैसा है।"',
      text: 'Above the last villages of Sikkim, above the yak pastures, above even the prayer flags, there is a country that belongs to nobody — the high snows. Except that the herders who summer up near it, Bhutia and Lepcha both, will quietly tell you it does belong to somebody. They just could not tell you exactly what he looks like.' },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: '"अलग-अलग घाटियों में लोग उसे अलग-अलग नामों से पुकारते हैं — बर्फ़ का जंगली आदमी, ग्लेशियर वाला; और बाहर की दुनिया उसे यति कहती है। लेपचा लोग, जो अपनी पहाड़ियों की हर चीज़ का नाम रखते हैं, ग्लेशियर की इस रूह को उन जीवों में गिनते हैं जिन्हें समझदार इंसान दूर ही से नमस्कार करता है। पर जिस बात पर सब सहमत हैं, वह सबसे ज़रूरी है: वह बहुत शर्मीला है।"',
      text: 'He goes by different names in different valleys — the wild man of the snows, the glacier one; the world outside calls him the yeti. The Lepcha, who name everything in their hills, count the spirit of the glaciers among the beings a sensible person greets from a distance. What everyone agrees on is the important part: he is shy.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: '"ख़ूंख़ार नहीं। शर्मीला। उससे जुड़ी सारी कहानियाँ इशारों की कहानियाँ हैं: भोर के वक़्त बर्फ़ के मैदान को पार करते बड़े-बड़े पैरों के निशान, जो किसी ख़ास मक़सद से कहीं जा रहे हों। कोहरे में किसी पहाड़ी कगार से आती सीटी की आवाज़, जिसका जवाब कोई नहीं देता। नीली भेड़ों का एक झुंड जो किसी चट्टान के पास से यूँ मुड़कर निकल जाए जैसे वहाँ कोई खड़ा हो। वह रखवाला खुद कभी नहीं दिखता। बस वही जगह दिखती है जहाँ वह अभी-अभी मौजूद था।"',
      text: 'Not fierce. Shy. The stories are all sideways stories: a line of great prints crossing a snowfield at dawn, going somewhere with a purpose. A whistle off a ridge in the mist, answered by nothing. A herd of blue sheep flowing round a rock as though someone stood there. Never the keeper himself. Always the space where he just was.' },
    { art: ['courtier'], who: 'courtier',
      hi: '"गर्मियों के एक ऊँचे चरागाह में, एक लड़के ने अपने दादाजी से इस बारे में पूछा — ठीक वैसे ही जैसे आग धीमी पड़ने पर बात छेड़ी जाती है। \\"क्या वह सचमुच होता है?\\" दादाजी ने कुछ देर चाय का कटोरा घुमाया। उन्होंने कहा, \\"ऊँचे पहाड़ों की बर्फ़ शांत और साफ़-सुथरी है और कोई उन्हें परेशान नहीं करता। कोई तो यह काम कर रहा है। और यह बात उतनी ही सच है जितनी बाकी चीज़ें।\\""',
      text: 'A boy at a high summer pasture asked his grandfather about it, the way you do when the fire is low. "Is he real?" His grandfather turned his tea bowl a while. "The high snows are quiet and clean and nobody troubles them," he said. "Somebody is doing that job. That is as real as most things."' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"लड़के का बहुत मन था कि वह ऊपर जाकर उसे ढूँढ़े।"',
      text: 'The boy wanted, badly, to go up and look for him.',
      ask: {
        q: 'What is the right way to deal with a neighbour who is famously shy?',
        options: ['Track him down and get a look', 'Respect the shyness — keep his country quiet and tidy, and let him be', 'Leave food out to tempt him'],
        answer: 1,
        right: 'That is the herders\' way. You do not repay a quiet neighbour by hunting him. You keep his country the way he keeps it: quiet, clean, unbothered.',
        wrong: 'His grandfather said no to both. You do not repay a quiet neighbour by hunting or baiting him. You keep his country the way he keeps it: quiet, clean, unbothered.'
      } },
    { art: ['guard', 'courtier'], who: 'courtier',
      hi: '"दादाजी ने कहा, \\"जब हम वहाँ ऊपर जाते हैं, तो संभलकर और हौले से चलते हैं। अपना कचरा घर वापस लाते हैं। पहाड़ियों की चोटियों पर चिल्लाते नहीं हैं। इसलिए नहीं कि हम डरते हैं — बल्कि इसलिए कि वह इलाक़ा उसका है, ठीक वैसे ही जैसे यह चरागाह हमारा है, और वह कभी हमारे लिए बुरा पड़ोसी नहीं बना।\\""',
      text: '"When we walk up there," his grandfather said, "we walk gently. We take our rubbish home. We do not shout on the ridges. Not because we are afraid — because it is his, the way our pasture is ours, and he has never once been a bad neighbour to us."' },
    { art: ['guard'], who: null,
      hi: '"और बर्फ़ के उस रखवाले की सबसे प्यारी बात यही है: एक ऐसा जीव जिसकी पूरी कहानी चीज़ों को उनके हाल पर छोड़ देने की सीख देती है। पहाड़ उसे कुछ ऐसे सँभालकर रखते हैं जैसे जेब में कोई क़ीमती चीज़ रखी हो — नज़रों से ओझल, और इसी में उसकी भलाई है।"',
      text: 'And that is the loveliest thing about the keeper of the snows: a being whose whole story is a lesson in leaving things be. The mountains hold him the way a pocket holds something precious — unseen, and better for it.' },
    { art: ['guard'], who: 'mithu',
      hi: 'क्या कभी किसी ने उसे साबित किया है? नहीं — और चरवाहों को इससे कोई फ़र्क नहीं पड़ता। कुछ पड़ोसियों को तो आप सिर्फ़ उनके पैरों के निशानों और उनके साफ़-सुथरे तौर-तरीकों से ही जान लेते हैं। ऊँची बर्फ़ कुछ हद तक इसलिए भी इतनी जादुई बनी रहती है, क्योंकि हमारे भीतर कहीं यह बात बैठी है कि वह किसी का घर है। वहाँ ऊपर संभलकर, आहिस्ता चलिए। यही सलीका है।',
      text: 'Has anyone proved him? No — and the herders are entirely untroubled by that. Some neighbours you know by their footprints and their good housekeeping. The high snows stay wonderful partly because something in us agrees they are somebody\'s home. Walk gently up there. It is polite.' }
  ],
  moral: 'Some wonders are not for finding. Keep their country quiet, and be glad they are there.',
  source: 'Herders\' and village lore of the high snows of Sikkim, told among Bhutia and Lepcha families — the shy keeper the wider world calls the yeti, and the Lepcha regard for the spirits of the glaciers. Told for wonder, as the herders tell it. Many tellings, none of them loud.'
},

{
  id: 'fk.losoong',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'desh-ne-b',
  badge: 'katha',
  title: 'The Year Is Swept Out Dancing',
  hook: 'In Sikkim the old year does not just end. It is danced out, shot out with arrows, and sent off properly.',
  hero: 'courtier',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-SK'],
  words_hi: [['नया साल', 'naya saal', 'new year'], ['तीर', 'teer', 'arrow'], ['झाड़ू', 'jhaadu', 'broom']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'जब फ़सलें समेट ली जाती हैं और ऊँचे दर्रे बर्फ़ से सफ़ेद हो जाते हैं, तब सिक्किम में नया साल करवट लेता है। भूटिया लोग इस त्योहार को लोसूंग कहते हैं; और लेपचा लोग इसी बदलते मौसम में अपना त्योहार नामसूंग मनाते हैं — दो समुदाय, दो नाम, और दिसंबर की एक ही साझी ख़ुशी: कोठार भरे हुए हैं, सारा काम पूरा हो चुका है, अब पुराना साल विदा ले सकता है।',
      text: 'When the harvest is in and the high passes have gone white, Sikkim turns the year. The Bhutia call the festival Losoong; the Lepcha keep their own, Namsoong, in the same turning season — two peoples, two names, one shared December gladness: the granaries are full, the work is done, the year may now leave.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'एक बच्ची ने यह त्योहार अपनी दादी के गाँव में बिताया, और उसने जाना कि साल को विदा करना अपने आप में एक पूरा हुनर है। घर के एक कोने से दूसरे कोने तक झाड़ू लगाई गई — बिल्कुल ठीक से, हर कोने-अतरे तक, "क्योंकि जितनी धूल तुम बचा लोगे, वह तुम्हारे पास ही रह जाएगी।" जो कुछ ठीक किया जा सकता था, उसकी मरम्मत की गई। जो कुछ उधार लिया गया था, वह सब लौटा दिया गया।',
      text: 'A girl spent it at her grandmother\'s village, and found that seeing out a year is a whole craft. The house swept end to end — properly, into the corners, "because whatever dust you keep, you keep." Everything mended that could be mended. Everything returned that had been borrowed.' },
    { art: ['guard'], who: null, mood: 'wow',
      hi: 'त्योहार से पहले के दिनों में, मठ के आँगन में मुखौटों वाला छम नृत्य घूम-घूमकर होता है — ढोल की धड़कन और लंबे बिगुलों की गूँज पर थिरकते धीमे, भव्य रूप। गाँव वालों ने समझाया कि ये नृत्य पुराने साल की मुश्किलों का डटकर सामना करते हैं, ताकि उनमें से कोई भी दबे पाँव नए साल में न घुस आए।',
      text: 'At the monastery, in the days before, the masked cham dances turn in the courtyard — slow, magnificent figures to a heartbeat of drums and long horns. The dances face down the troubles of the old year, the villagers explained, so that none of them slink along into the new one.' },
    { art: ['courtier', 'guard'], who: null,
      hi: 'और फिर वह हिस्सा जिसका हर बच्चा इंतज़ार करता है: तीरंदाज़ी। तीरंदाज़ी के बिना लोसूंग भला कैसा लोसूंग! गाँव के आदमी दिन भर होड़ लगाते हैं — असली धनुष, गज़ब का ध्यान, और ज़ोरदार शेखी — और जब निशाने पर तीर धप से लगते हैं, तो ऐसी ललकार गूँजती है जो पूरी घाटी के पार तक सुनाई देती है।',
      text: 'And then the part every child waits for: archery. Losoong without archery is not Losoong. The men of the villages compete all day — real bows, tremendous concentration, spectacular boasting — and the arrows thud home to roars you can hear across the valley.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: 'आख़िरी शाम, बच्ची ने अपनी दादी से वही सवाल पूछा, जो पूरे त्योहार भर उसके भीतर धीरे-धीरे आकार ले रहा था।',
      text: 'On the last evening, the girl asked her grandmother the question the whole festival had been assembling in her.',
      ask: {
        q: 'Sweeping, mending, returning, dancing the troubles down — what is all of it actually for?',
        options: ['Making the house look nice for guests', 'Ending the year completely, so nothing sour is carried into the new one', 'Using up the harvest food'],
        answer: 1,
        right: 'That is Losoong\'s heart. Quarrels settled, debts returned, troubles danced down — the new year starts owing nothing to the old one.',
        wrong: 'Guests and feasting come with it, but the heart is bigger: ending the year completely — quarrels settled, debts returned, troubles danced down — so the new year starts owing nothing to the old one.'
      } },
    { art: ['courtier', 'guard'], who: 'guard',
      hi: '"लोग पुराने सालों का बोझ अपने साथ ढोते फिरते हैं," सिलाई-रफ़ू का आखिरी कपड़ा तह करते हुए उसकी दादी ने कहा। "पुराने झगड़े, पुरानी नाराज़गियाँ, पुरानी धूल। साल में एक बार, हम जान-बूझकर यह सब उतार कर रख देते हैं। इसमें पूरा एक त्योहार लग जाता है, क्योंकि चीज़ों को छोड़ना, उन्हें उठाने से कहीं ज़्यादा मुश्किल होता है।"',
      text: '"People carry old years around with them," her grandmother said, folding the last of the mending. "Old quarrels, old sulks, old dust. Once a year, we put it all down on purpose. It takes a whole festival, because putting things down is harder than picking things up."' },
    { art: ['courtier'], who: null,
      hi: 'नए साल की सुबह पूरा गाँव घर-घर जाकर आपस में मिला, और हर किसी ने हर किसी को बधाई दी। यहाँ तक कि वे दो पुराने पड़ोसी भी मिले, जिनके बारे में बच्ची जानती थी कि वसंत में उनका झगड़ा हुआ था — साफ़-सुथरी चौखट पर, नए साल में, पिछले साल को अपने पीछे झाड़-पोंछ कर, वे एक-दूसरे को नमस्कार कर रहे थे।',
      text: 'On new year\'s morning the village visited itself house to house, and everyone greeted everyone, including two old neighbours the girl happened to know had quarrelled in the spring — greeting each other on a clean doorstep, in a new year, with last year swept out behind them both.' },
    { art: ['courtier'], who: 'mithu',
      hi: 'लोसूंग और नामसूंग हर दिसंबर पूरे सिक्किम में मनाए जाते हैं, और कई मिले-जुले गाँवों में ये दोनों त्योहार एक साथ घुल-मिल जाते हैं, जो इस जगह पर खूब जँचता है। इस सीख को अपनाने के लिए तुम्हें किसी अन्न-भंडार की ज़रूरत नहीं है: कोई एक दिन चुनो, अच्छी तरह झाड़ू लगाओ, जो उधार लिया था उसे लौटा दो, और कोई एक झगड़ा सुलझा लो। तारीख चाहे जो भी कहे, नया साल वही है।',
      text: 'Losoong and Namsoong are kept across Sikkim each December, and in many mixed villages the two flow together, which suits the place. You do not need a granary to borrow the idea: pick a day, sweep properly, give back what you borrowed, and make up one quarrel. That is a new year, whatever the date says.' }
  ],
  moral: 'Put the old year down on purpose. A new beginning should not have to carry old dust.',
  source: 'Losoong, the Sikkimese new year of the Bhutia, and Namsoong of the Lepcha, kept in the harvest-end season with cham dances and archery; observance differs between villages and monasteries, and the two festivals keep their own identities. As lived in Sikkim today.'
}


];

window.IND_COLLECTIONS_NE_B = [
  { id: 'desh-ne-b', name: 'Hills of the Dawn', note: 'Manipur, Nagaland, Arunachal and Sikkim — twenty-eight tales from the peoples of the eastern hills, each credited by name.', avatar: 'pt_deer' }
];
