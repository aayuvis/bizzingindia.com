/* Bizzing India — modern India: the sports stories and the builder stories.

   Same shape as data-stories.js and its siblings, on its own global so the sets
   load and merge independently.

   Two collections:
     khel  — India at play. The century of Indian sport, from Berlin 1936 to a
             world chess title won at eighteen.
     naya  — Naya India, the builders. Milk, code, rockets, letters, QR codes.

   THE SPREAD IS THE MESSAGE. These heroes were picked so that a child anywhere
   in the room can find themselves: girls and boys; Manipur and Madras, Punjab
   and Rajasthan, Odisha and the Bombay suburbs; a farmer's son with a javelin
   and a banker who started over at fifty; a wheelchair and a hockey stick.
   Nobody here is from one India, because there is no one India to be from.

   Badges (docs/05): every story here is either itihaas — documented history,
   sources named — or aaj, how a thing works today. No katha in this file:
   these are real people, and real people get the evidence badge.

   LIVING-PEOPLE RULES observed throughout: no invented dialogue anywhere in
   this file — scenes are narrator-voice; nothing embarrassing; no inner
   thoughts asserted as fact (wondering is offered to the child as a question);
   no net-worth talk — the awe is in the making, not the money. For young
   companies whose later fortunes are mixed, the story stays on the documented
   founding moment and the moral is about starting.

   Sensitive-topic gate: Milkha Singh's childhood touches Partition, which
   docs/05 reserves for a human author with a named reviewer. That story keeps
   Partition to one oblique, gentle sentence and is flagged needs_review: true.

   Place codes: checked against app/data-geo.js. One deliberate exception —
   P. V. Sindhu carries IN-TG (Hyderabad, Telangana). TG is a known geometry
   gap (docs/07: the map set predates 2014, Telangana still sits inside AP), so
   the map will not light for it yet, but the Telugu family shelf already
   matches TG (data-tongue.js) and the code self-heals when the geometry lands.

   Avatar ids used here (dhyanchand, milkha, kapil, sachin, anand, marykom,
   sindhu, neeraj, avani, gukesh, kurien, n_murthy, sudha_murty, falguni,
   ritesh, rocket, unicorn) are in the current avatar-generation batch; kalam
   and mithu already exist. Until the PNGs land, art() degrades to blank
   gracefully. IND_AVATAR_NAMES entries for the new ids should land with them.

   Scene fields:
     art      avatar ids to stage (left, right)
     who      speaker id, 'mithu' for the teller, or null for narration
     text     what is told
     mood     think | wow | sad
     ask      { q, options[], answer, right, wrong }  a decision beat
*/

window.IND_STORIES_MODERN = [

/* ========================================================== KHEL ========== */
{
  id: 'kh.dhyanchand',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Wizard With the Stick',
  hook: 'He scored so many goals that people decided his hockey stick must be magic. So they checked.',
  hero: 'dhyanchand',
  cast: ['dhyanchand'],
  minutes: 4,
  place: ['IN-UP'],
  words_hi: [['जादू', 'jaadu', 'magic'], ['अभ्यास', 'abhyaas', 'practice'], ['खेल', 'khel', 'game']],
  scenes: [
    { art: ['dhyanchand'], who: null,
      hi: '"यह एक सच्ची कहानी है — इतिहास, जो रिकॉर्ड की किताबें बताती हैं। क़रीब सौ साल पहले, ध्यानचंद नाम के एक नौजवान सिपाही भारतीय सेना के लिए हॉकी खेलते थे। वे सोलह साल की उम्र में झाँसी में फ़ौज में शामिल हुए थे, और अपनी ड्यूटी पूरी करने के बाद चाँदनी रात में अकेले अभ्यास किया करते थे, क्योंकि परेड ग्राउंड में कोई रोशनी नहीं थी और उनका मन रुकने को करता ही नहीं था।"',
      text: 'This is a true story — itihaas, what the record books show. Around a hundred years ago, a young soldier named Dhyan Chand played hockey for the Indian army. He had joined at sixteen, in Jhansi, and after his duties were done he would practise alone, in the moonlight, because the parade ground had no lights and he could not bear to stop.' },
    { art: ['dhyanchand'], who: null, mood: 'wow',
      hi: '"जब भारत ओलंपिक खेलों में गया — 1928 में एम्सटर्डम, 1932 में लॉस एंजेलिस, 1936 में बर्लिन — तब दुनिया को पता चला कि उस सारी चाँदनी ने क्या कमाल रच दिया था। भारत ने हर एक बार स्वर्ण पदक जीता। तीन ओलंपिक, तीन स्वर्ण। 1932 के एक मैच में भारत ने मेज़बान देश अमेरिका को चौबीस के मुक़ाबले एक गोल से हराया। यह स्कोर पीढ़ियों तक रिकॉर्ड की किताबों में दर्ज रहा।"',
      text: 'When India went to the Olympic Games — Amsterdam in 1928, Los Angeles in 1932, Berlin in 1936 — the world found out what all that moonlight had built. India won the gold medal every single time. Three Olympics, three golds. In one match in 1932, India beat the home team of the United States by twenty-four goals to one. That scoreline sat in the record books for generations.' },
    { art: ['dhyanchand'], who: null,
      hi: '"इस सब के केंद्र में ध्यानचंद थे, जो विपक्षी खिलाड़ियों के बीच से ऐसे फिसलते हुए निकल जाते थे मानो वे बस खड़े के खड़े रह गए हों, और गेंद उनकी स्टिक से चिपकी सी रहती थी। वे गोल ऐसे करते थे जैसे लोग बातों-बातों में नमस्ते कह देते हैं — अपने पूरे करियर में सैकड़ों गोल।"',
      text: 'At the centre of it all was Dhyan Chand, gliding through defenders as if they were standing still, the ball stitched to his stick. He scored goals the way other people say hello — by the hundreds, across his career.' },
    { art: ['dhyanchand'], who: null, mood: 'think',
      hi: '"और यहीं पर रिकॉर्ड ख़त्म होते हैं और कहानियाँ शुरू होती हैं — और इतिहास की एक कहानी ईमानदारी से बताती है कि सच क्या है और क़िस्सा क्या। लोग जो देख रहे थे उस पर उन्हें यक़ीन नहीं हो रहा था, इसलिए कहानियाँ बनने लगीं। कहा जाता है कि हॉलैंड में अधिकारियों ने उनकी स्टिक की जाँच की, यह देखने के लिए कि कहीं उसमें कोई चुंबक या गोंद तो नहीं छुपा है। कोई भी ऐसा दस्तावेज़ नहीं दिखा सकता जो यह साबित करे कि ऐसा हुआ था। लेकिन यह बात कि लोगों के लिए किसी जादुई स्टिक पर यक़ीन करना ज़्यादा आसान था बजाय इसके कि कोई इंसान इतना लाजवाब खेल सकता है — यह अपने आप में ही एक बड़ा सच बयाँ करती है।"',
      text: 'And here is where the record ends and the stories begin — and an itihaas story tells you honestly which is which. People could not believe what they were seeing, so tales grew. In Holland, it is said, officials examined his stick to see if there was a magnet or glue hidden inside it. Nobody can show you a document proving that happened. But the fact that people found it easier to believe in a magic stick than in one man being that good — that tells you something true all by itself.' },
    { art: ['dhyanchand'], who: null, mood: 'wow',
      hi: '"1936 में बर्लिन में, जर्मनी के ख़िलाफ़ फ़ाइनल में, जहाँ पूरा स्टेडियम उनके ख़िलाफ़ खचाखच भरा था, भारत आठ के मुक़ाबले एक गोल से जीत गया। यह कोई मनगढ़ंत क़िस्सा नहीं है — यह किताबों में दर्ज है। यह तीसरा स्वर्ण पदक था, और इसने ध्यानचंद को कुछ ऐसा बना दिया जो विरले ही देखने को मिलता है: एक ऐसा खिलाड़ी जिसकी कहानियाँ दूसरे देश भी सुनाया करते थे।"',
      text: 'In Berlin in 1936, in the final against Germany with the stands packed against them, India won eight goals to one. That one is no legend — it is in the books. It was the third gold, and it made Dhyan Chand something rare: an athlete other countries told stories about.' },
    { art: ['dhyanchand'], who: 'mithu',
      hi: '"भारत हर साल उनतीस अगस्त को राष्ट्रीय खेल दिवस मनाता है — ध्यानचंद का जन्मदिन। जादू, सच तो यह है, कभी स्टिक में था ही नहीं। जादू तो उस लड़के में था, जो सबके सो जाने के बहुत देर बाद तक, चाँदनी रात में अकेले अभ्यास करता रहता था।"',
      text: 'India celebrates National Sports Day every year on the twenty-ninth of August — Dhyan Chand’s birthday. The magic, of course, was never in the stick. It was in a boy practising alone by moonlight, long after everyone else had gone to bed.' }
  ],
  moral: 'When someone is astonishingly good, look past the magic story. Underneath it there is almost always an empty field, late at night, and one person still practising.',
  source: 'Olympic records (hockey golds 1928, 1932, 1936; the 24–1 and 8–1 scorelines); Dhyan Chand’s autobiography "Goal!" (1952) for the Jhansi and night-practice years. The stick-checking tale is folklore and is labelled as such. National Sports Day falls on his birthday, 29 August.'
},

{
  id: 'kh.milkha',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  needs_review: true,
  title: 'The Flying Sikh Comes Fourth',
  hook: 'The most famous race of his life is one he lost. This story is about why it is still the one everybody tells.',
  hero: 'milkha',
  cast: ['milkha'],
  minutes: 4,
  place: ['IN-PB'],
  words_hi: [['दौड़', 'daud', 'race'], ['हिम्मत', 'himmat', 'courage'], ['उड़ान', 'udaan', 'flight']],
  scenes: [
    { art: ['milkha'], who: null, mood: 'sad',
      hi: 'मिल्खा सिंह के दौड़ने की शुरुआत बिल्कुल शून्य से हुई थी। उनका बचपन 1947 के उन भयानक दिनों में बिखर गया, जब देश का बँटवारा हुआ और उनके परिवार ने लगभग सब कुछ खो दिया — उनकी कहानी का वह हिस्सा बड़ा दर्दभरा है, और वह तब के लिए रखा गया है जब तुम थोड़े बड़े हो जाओगे और तुमसे प्यार करने वाला कोई बड़ा तुम्हें वह सुनाएगा। यहाँ तुम्हें बस इतना जानने की ज़रूरत है कि अपना घर खो चुका एक लड़का, अकेले ही, भारतीय सेना तक पहुँच गया।',
      text: 'Milkha Singh’s running began with nothing. His childhood was broken by the terrible days of 1947, when the land was divided and his family lost almost everything — that part of his story is hard, and it is kept for when you are older, told by a grown-up who loves you. What you need to know here is that a boy who had lost his home found his way, alone, to the Indian army.' },
    { art: ['milkha'], who: null,
      hi: 'सेना में नए रंगरूटों के लिए एक क्रॉस-कंट्री दौड़ रखी गई थी। सैकड़ों जवानों में मिल्खा छठे नंबर पर आए — और सबसे आगे रहने वाले धावकों को खाने के साथ अलग से दूध मिलता था। वे लंबे समय से भूखे रहे थे। उन्होंने वैसे अभ्यास करना शुरू किया जैसे लोग साँस लेते हैं: लगातार, जी-जान से, जब तक कि वे सिर्फ अपनी यूनिट के ही नहीं, बल्कि पूरे देश के सबसे तेज़ धावक नहीं बन गए।',
      text: 'In the army they held a cross-country race for the new recruits. Milkha came sixth out of hundreds — and the top runners got extra milk with their meals. He had been hungry for a long time. He started training the way other people breathe: constantly, furiously, until he was not just the fastest man in his unit but the fastest in the country.' },
    { art: ['milkha'], who: null, mood: 'wow',
      hi: '1958 में, कार्डिफ़ के कॉमनवेल्थ खेलों में, उन्होंने 440 गज़ की दौड़ में स्वर्ण पदक जीता — उन खेलों के एथलेटिक्स में आज़ाद भारत का यह पहला गोल्ड था। और 1960 में, लाहौर की एक दौड़ में वे इतनी खूबसूरती से दौड़े कि जिस देश के ख़िलाफ़ वे दौड़े थे, उसी ने उन्हें वह नाम दिया जो हमेशा के लिए उनके साथ जुड़ गया। वे यह बात बड़े चाव से बताते थे: उनका सबसे मशहूर नाम, \'द फ़्लाइंग सिख\', सरहद पार से मिला एक तोहफ़ा था।',
      text: 'In 1958, at the Commonwealth Games in Cardiff, he won gold in the 440 yards — independent India’s first athletics gold at those Games. And in 1960, at a race in Lahore, he ran so beautifully that the country he ran against gave him the name he carried forever after. He loved telling this: his most famous name, the Flying Sikh, was a gift from across the border.' },
    { art: ['milkha'], who: null, mood: 'think',
      hi: 'फिर रोम की बारी आई। 1960 का ओलंपिक 400 मीटर फ़ाइनल। मिल्खा तूफ़ान की तरह निकले और आधी दौड़ तक वे दुनिया के सबसे तेज़ धावकों के बीच सबसे आगे चल रहे थे। और फिर, पिछले सीधे रास्ते पर कहीं उनकी रफ़्तार ज़रा धीमी पड़ गई — एक पल का शक, दूसरों पर एक नज़र। उन्होंने बाद में खुद कहा कि वह उनकी ज़िंदगी की इकलौती भूल थी।',
      text: 'Then came Rome. The Olympic 400 metres final, 1960. Milkha went off like a storm and for half the race he was among the leaders of the fastest field ever assembled. And then, somewhere down the back straight, he eased off — a moment of doubt, a glance at the others. He said himself, ever afterwards, that it was the one mistake of his life.',
      ask: {
        q: 'He crossed the line fourth. Fourth at the Olympics — and no medal. What do you think that is worth?',
        options: ['Nothing — only medals count', 'More than most medals — he ran with the best on Earth and missed bronze by a tenth of a second', 'It is worth exactly fourth place'],
        answer: 1,
        right: 'That is how India came to see it too. His Rome time stood as the national record for almost forty years. Nobody remembers who came sixth in most finals. Everybody remembers Milkha.',
        wrong: 'India decided otherwise, and so did the clock: his Rome time stood as the national record for almost forty years. Some fourth places outlast gold medals.'
      } },
    { art: ['milkha'], who: null,
      hi: 'चार धावक आधे सेकंड के फ़ासले के भीतर ही फ़िनिश लाइन पार कर गए। कांस्य पदक उनके हाथ से सेकंड के लगभग दसवें हिस्से से छूट गया — बस एक धड़कन जितना फ़ासला। वे रोम के ट्रैक से ऐसी हार लेकर निकले जिसके बारे में वे ज़िंदगी भर बात करते रहे, खुलकर, बिना कुछ छिपाए। यह भी अपने आप में एक अलग तरह की ताकत है।',
      text: 'Four runners came home within half a second of each other. The bronze escaped him by about one tenth of a second — the length of a heartbeat. He walked off the track in Rome carrying a loss he would talk about for the rest of his life, openly, without hiding it. That is its own kind of strength.' },
    { art: ['milkha'], who: 'mithu',
      hi: 'एक लड़का जिसने सब कुछ खो दिया था, जो अपनी पहली दौड़ एक गिलास दूध के लिए दौड़ा था, वह दुनिया के सबसे तेज़ इंसानों के साथ ओलंपिक के फ़ाइनल में खड़ा हुआ — और जिस दिन उससे चूक हुई, उसका सच उसने अगले साठ सालों तक सबको बताया। यही वजह है कि जो दौड़ वे हार गए, उसी दौड़ की कहानी आज हर कोई सुनाता है।',
      text: 'A boy who lost everything, who ran his first race for a glass of milk, stood in an Olympic final with the fastest men alive — and told the truth about the day it went wrong for sixty years afterwards. That is why the race he lost is the race everybody tells.' }
  ],
  moral: 'Losing honestly, at the very top, in front of everyone — and owning it forever — can make you more loved than winning ever could.',
  source: 'Milkha Singh’s autobiography "The Race of My Life" (with Sonia Sanwalka) for the army race, the Lahore naming and his own account of the Rome error; Olympic and Commonwealth Games records for Cardiff 1958 and the Rome 1960 final. needs_review: his childhood touches Partition, kept here to one oblique sentence per docs/05 — a named human reviewer must sign off before publish.'
},

{
  id: 'kh.kapil83',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Cup Nobody Expected',
  hook: 'The bookmakers said sixty-six to one against India. Then a catch went up over Lord’s.',
  hero: 'kapil',
  cast: ['kapil'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['भरोसा', 'bharosa', 'belief'], ['गेंद', 'gend', 'ball'], ['जीत', 'jeet', 'victory']],
  scenes: [
    { art: ['kapil'], who: null,
      hi: '1983 की गर्मियों में, भारत क्रिकेट विश्व कप खेलने इंग्लैंड गया, और किसी ने भी इस बात पर खास ध्यान नहीं दिया। इससे पहले हुए दो विश्व कप में भारत ने सिर्फ एक ही मैच जीता था। सट्टा लगाने वाले भारत के ख़िलाफ़ छाछठ पर एक का दांव लगा रहे थे। ताकतवर वेस्ट इंडीज़ ने अब तक के दोनों विश्व कप जीते थे, और हर किसी को यकीन था कि इस बार भी वही जीतेंगे।',
      text: 'In the summer of 1983, India went to England for the cricket World Cup, and almost nobody noticed. India had won one single match in the two World Cups before. The bookmakers offered sixty-six to one against them. The mighty West Indies had won both cups ever played, and everyone knew they would win this one too.' },
    { art: ['kapil'], who: null,
      hi: 'भारत के कप्तान थे चौबीस साल के कपिल देव, एक ऐसे परिवार से जो कई मुश्किल भरे सफ़र तय करके उत्तर भारत में आ बसा था—एक ऐसे तेज़ गेंदबाज़ जो कड़कती बिजली की तरह गेंद को मारते थे और जिन्होंने हार के सारे अनुमानों को मानने से साफ़ इनकार कर दिया था। पूरी टीम उन्हें \'हरियाणा हरिकेन\' कहती थी।',
      text: 'India’s captain was Kapil Dev, twenty-four years old, from a family that had settled in the north after hard journeys of its own — a fast bowler who hit the ball like a thunderclap and refused, completely, to believe the odds. The team called him the Haryana Hurricane.' },
    { art: ['kapil'], who: null, mood: 'wow',
      hi: 'ज़िम्बाब्वे के ख़िलाफ़ भारत की पारी लड़खड़ा गई और सत्रह रन पर पाँच विकेट गिर गए—एक बहुत बड़ा संकट! कपिल मैदान पर उतरे और उन्होंने इतिहास की सबसे महान पारियों में से एक खेली: नाबाद 175 रन, सोलह चौके और छह छक्के। और इस रिकॉर्ड की एक अजीब और अनोखी बात यह भी है: उस दिन टेलीविज़न के कैमरामैन हड़ताल पर थे। उस पारी की एक भी गेंद कैमरे में रिकॉर्ड नहीं हुई। विश्व कप को बचाने वाली वह पारी अब सिर्फ स्कोरबुक में और उस छोटे से मैदान पर मौजूद लोगों की यादों में ही ज़िंदा है।',
      text: 'Against Zimbabwe, India collapsed to seventeen runs for five wickets — a disaster. Kapil walked in and played one of the greatest innings ever: 175 not out, sixteen fours, six sixes. And here is the strange, wonderful footnote the record keeps: the television cameras were on strike that day. Not one ball of it was filmed. The innings that saved the World Cup exists only in the scorebook and in the memories of the people on that small ground.' },
    { art: ['kapil'], who: null, mood: 'think',
      hi: 'पच्चीस जून, लॉर्ड्स का मैदान और फाइनल मैच। भारत ने पहले बल्लेबाज़ी की और पूरी टीम 183 रनों पर सिमट गई—सबका यही मानना था कि यह बहुत छोटा, बेहद छोटा स्कोर था। वेस्ट इंडीज़ ने लक्ष्य का पीछा करना शुरू किया, और दुनिया के सबसे ख़ौफ़नाक बल्लेबाज़, विव रिचर्ड्स, ऐसे चौके जड़ने लगे मानो यह खेल उन्हें उबाऊ लग रहा हो।',
      text: 'The final, at Lord’s, June the twenty-fifth. India batted first and were bowled out for 183 — a small total, far too small, everyone agreed. The West Indies began their chase, and the most feared batsman on Earth, Viv Richards, started hitting boundaries as if the game bored him.',
      ask: {
        q: 'Your team has too few runs. The best batsman in the world is destroying the bowling. What is the one thing that can change everything?',
        options: ['Wait and hope he gets tired', 'One catch — get the great man out, and doubt walks in', 'Ask to start the game again'],
        answer: 1,
        right: 'Exactly what happened next. Richards skied one high over the infield — and Kapil ran twenty yards backwards, eyes up the whole way, and held it.',
        wrong: 'Cricket gave its own answer that afternoon. Richards skied a pull high over the infield — and Kapil ran twenty yards backwards, eyes up the whole way, and held the catch.'
      } },
    { art: ['kapil'], who: null, mood: 'wow',
      hi: 'उस कैच के बाद, अजेय मानी जाने वाली वेस्ट इंडीज़ की टीम ताश के पत्तों की तरह बिखर गई—पूरी टीम 140 रन पर आउट हो गई। भारत तैंतालीस रनों से विश्व कप जीत चुका था, और नीचे खड़ी हैरान तथा ख़ुशी से झूमती भारतीयों की भीड़ के नारों के बीच, कपिल ने लॉर्ड्स की बालकनी में सोने की ट्रॉफी हवा में उठा दी।',
      text: 'After that catch, the invincible West Indies crumbled — all out for 140. India had won the World Cup by forty-three runs, and Kapil lifted the golden trophy on the Lord’s balcony while a crowd of disbelieving, delighted Indians roared below.' },
    { art: ['kapil'], who: 'mithu',
      hi: 'उस शाम से पहले, क्रिकेट भारत में खेले जाने वाले कई खेलों में से बस एक खेल था। उसके बाद, क्रिकेट वह खेल बन गया जिसे जीतने का भरोसा एक अरब लोगों के दिल में जाग उठा। तब से लेकर आज तक, भारतीय क्रिकेट की हर कहानी—हर एक कहानी—उसी बालकनी से शुरू होती है।',
      text: 'Before that evening, cricket was one of the games India played. After it, cricket became the game a billion people believed they could win. Every Indian cricket story since — every one — begins on that balcony.' }
  ],
  moral: 'Sixty-six to one is somebody else’s opinion of you. It is not a fact about you until you agree to it.',
  source: 'Wisden and ICC match records for the 1983 World Cup — the 66–1 odds, the 175* at Tunbridge Wells (unfilmed, BBC strike), and the Lord’s final scorecard (India 183, West Indies 140, Richards c Kapil Dev b Madan Lal).'
},

{
  id: 'kh.sachin',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Boy With the Ball in a Sock',
  hook: 'He hung a cricket ball in a sock and hit it for hours, alone. Then he did the same thing, more or less, for twenty-four years.',
  hero: 'sachin',
  cast: ['sachin'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['बल्ला', 'balla', 'bat'], ['शतक', 'shatak', 'century'], ['लगन', 'lagan', 'dedication']],
  scenes: [
    { art: ['sachin'], who: null,
      hi: '1980 के दशक में, बंबई के बांद्रा की एक कॉलोनी में, घुंघराले बालों वाला एक छोटा लड़का रस्सी से मोज़े में लटकी क्रिकेट की गेंद पर बैटिंग की प्रैक्टिस करता था — क्योंकि मोज़े वाली गेंद बार-बार झूलकर वापस आती है, और उसे किसी बॉलर की ज़रूरत नहीं पड़ती। उसका नाम सचिन तेंदुलकर था, और वह घंटों तक ऐसा करता रहता था। उसके घरवाले कभी-कभी सोचते थे कि क्या यह कभी रुकेगा भी।',
      text: 'In a colony in Bandra, Bombay, in the 1980s, a small boy with curly hair practised batting against a cricket ball hung inside a sock from a rope — because a ball in a sock swings back at you, again and again, and never needs a bowler. His name was Sachin Tendulkar, and he could do this for hours. His family sometimes wondered if he would ever stop.' },
    { art: ['sachin'], who: null, mood: 'think',
      hi: 'उनके कोच, रमाकांत आचरेकर का एक मशहूर तरीका था। प्रैक्टिस के आखिर में वे स्टंप्स के ऊपर एक रुपये का सिक्का टिका देते थे। जो भी बॉलर सचिन को आउट करता, सिक्का उसका हो जाता। और अगर कोई आउट न कर पाता, तो सिक्का सचिन का हो जाता। सचिन ने वे तेरह सिक्के ज़िंदगी भर संभाल कर रखे, और कहा कि वे उनके सबसे अनमोल इनामों में से थे।',
      text: 'His coach, Ramakant Achrekar, had a famous trick. At the end of practice he would balance a one-rupee coin on the stumps. Any bowler who got Sachin out won the coin. If nobody could, Sachin kept it. He kept thirteen of those coins all his life, and said they were among his most precious prizes.',
      ask: {
        q: 'Why would a coach pay a boy in one-rupee coins instead of just saying well done?',
        options: ['Because coins are cheaper than trophies', 'Because now every single ball mattered — a whole team was trying to take something of his', 'Because the coach had spare coins'],
        answer: 1,
        right: 'That is the trick exactly. The coin turned practice into a battle. Sachin learned to treat the last ball of a tired evening like the first ball of a final.',
        wrong: 'Look at what the coin did: it turned practice into a battle. Every bowler wanted it, so every ball mattered, and Sachin learned to treat the last ball of a tired evening like the first ball of a final.'
      } },
    { art: ['sachin'], who: null,
      hi: 'सोलह साल की उम्र में — सिर्फ़ सोलह! — वह पाकिस्तान के ख़तरनाक तेज़ गेंदबाज़ों के सामने भारत के लिए खेला, चोट खाई, ख़ून बहा, पर मैदान छोड़ने से साफ़ इनकार कर दिया। पूरे भारत ने देखा कि बड़ों के खेल में एक लड़का बच्चा बनकर पीछे हटने को तैयार नहीं था, और उस दिन एक ऐसा सिलसिला शुरू हुआ जो चौबीस साल तक नहीं थमा।',
      text: 'At sixteen — sixteen! — he played for India against the fierce fast bowlers of Pakistan, took a blow, bled, and refused to leave the field. India watched a boy in a man’s game refuse to be a boy about it, and something began that day that did not stop for twenty-four years.' },
    { art: ['sachin'], who: null, mood: 'wow',
      hi: 'उन्होंने जो रिकॉर्ड बनाए, वे किसी छपाई की भूल जैसे लगते हैं। सौ अंतरराष्ट्रीय शतक — वहाँ तक कोई दूसरा कभी नहीं पहुँच पाया। चौंतीस हज़ार से भी ज़्यादा अंतरराष्ट्रीय रन। दो सौ टेस्ट मैच। 1990 के दशक में, जब भारतीय क्रिकेट के मुश्किल दिन चल रहे थे, तब पूरे देश का मिज़ाज इस बात से तय होता था कि क्या सचिन अभी क्रीज़ पर खेल रहे हैं।',
      text: 'The numbers he left behind read like misprints. One hundred international centuries — no one else has reached that. More than thirty-four thousand international runs. Two hundred Test matches. Through the 1990s, when Indian cricket had hard days, a whole country planned its mood around whether Sachin was still batting.' },
    { art: ['sachin'], who: null, mood: 'wow',
      hi: 'बस एक ही इनाम था जो हाथ से छूटता जा रहा था — वर्ल्ड कप। आखिरकार 2011 में, अपनी छठी कोशिश में, भारत ने अपनी ही ज़मीन पर, यानी सचिन की अपनी बंबई में उसे जीत लिया। उनकी टीम के युवा खिलाड़ियों ने उन्हें अपने कंधों पर उठा लिया और पूरे मैदान में घुमाया। उनमें से एक, विराट कोहली ने उस रात कहा था कि सचिन ने इक्कीस साल तक पूरे देश का बोझ उठाया है, इसलिए अब उन्हें उठाने की बारी हमारी थी। भारत तब से उस बात को दोहराता आ रहा है।',
      text: 'The one prize that kept escaping was the World Cup — until 2011, his sixth try, when India finally won it at home, in his own Bombay. His young teammates lifted him onto their shoulders and carried him around the ground. One of them, Virat Kohli, said that night that Sachin had carried the burden of the nation for twenty-one years, so it was time to carry him. India has been repeating that sentence ever since.' },
    { art: ['sachin'], who: 'mithu',
      hi: 'एक गेंद, एक मोज़ा, एक रस्सी, और एक लड़का जो रुकना नहीं चाहता था। बाकी सब कुछ — वे पूरे के पूरे सौ शतक — इसी एक शुरुआत से निकलकर आए।',
      text: 'A ball, a sock, a rope, and a boy who did not want to stop. Everything else — all hundred centuries of it — grew out of that.' }
  ],
  moral: 'Greatness rarely looks like a lightning bolt. Mostly it looks like the same small practice, chosen again every single day, for years.',
  source: 'Sachin Tendulkar’s autobiography "Playing It My Way" for the sock-ball and the Achrekar coin sessions (he kept 13 coins); ICC records for the 100 international centuries, 200 Tests and the 1989 debut at sixteen; the 2011 World Cup lap and Kohli’s much-quoted remark were reported worldwide that night and are given here indirectly.'
},

{
  id: 'kh.anand',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Lightning Kid',
  hook: 'He played chess so fast that grown masters felt slow — and he came from a country that had one grandmaster: him.',
  hero: 'anand',
  cast: ['anand'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['शतरंज', 'shatranj', 'chess'], ['बिजली', 'bijli', 'lightning'], ['चाल', 'chaal', 'move']],
  scenes: [
    { art: ['anand'], who: null,
      hi: 'शतरंज का जन्म भारत में हुआ था — इसका पुराना रूप, चतुरंग, करीब चौदह सौ साल पहले यहीं खेला जाता था, इससे पहले कि वह पूरी दुनिया का चक्कर लगाकर एक बदले हुए रूप में घर लौटे। लेकिन 1980 के दशक तक, शतरंज के बड़े-बड़े महारथी बहुत दूर थे, और भारत के पास एक भी ग्रैंडमास्टर नहीं था। मद्रास में — जिसे आज चेन्नई कहा जाता है — छह साल का एक लड़का, विश्वनाथन आनंद, अपनी माँ से शतरंज की चालें सीख रहा था।',
      text: 'Chess was born in India — its ancestor, chaturanga, was played here some fourteen centuries ago before travelling the whole world and coming home changed. But by the 1980s, the world’s great chess powers were far away, and India did not have one single grandmaster. In Madras — the city now called Chennai — a boy named Viswanathan Anand was learning the moves from his mother, at six.' },
    { art: ['anand'], who: null, mood: 'wow',
      hi: 'शतरंज क्लब में सबने उसे एक नाम दिया: लाइटनिंग किड। वह इतनी तेज़ी से खेलता था कि बड़े-बड़े उस्ताद भी चकरा जाते थे — एक नज़र डाली, मोहरा चला, और खेल ख़त्म — लापरवाही से नहीं, बल्कि इसलिए क्योंकि उसे चालें दूसरों से पहले ही दिख जाती थीं। 1987 में वह वर्ल्ड जूनियर चैंपियन बना, और 1988 में, अठारह साल की उम्र में, वह भारत के इतिहास का पहला ग्रैंडमास्टर बन गया।',
      text: 'At the chess club they gave him a nickname: the Lightning Kid. He played at a speed that unsettled grown masters — glance, move, done — not out of carelessness but because he simply saw it faster. In 1987 he became world junior champion, and in 1988, at eighteen, he became the first grandmaster in the history of India.' },
    { art: ['anand'], who: null, mood: 'think',
      hi: 'पहला होना एक अजीब काम होता है। उससे पहले कोई भी भारतीय इस रास्ते पर नहीं चला था, न कोई नक्शा था, और सबसे तगड़े खिलाड़ी और स्कूल सात समंदर पार थे। हर टूर्नामेंट का मतलब था अकेले दुनिया के दूसरे कोने तक जाना, और उन लोगों से मुक़ाबला करना जो शतरंज के बड़े-बड़े गढ़ों में पले-बढ़े थे। फिर भी वह आगे बढ़ता रहा, साल-दर-साल, एक के बाद एक मैच।',
      text: 'Being first is a strange job. There was no Indian who had walked this road ahead of him, no map, and the strongest players and schools were continents away. Every tournament meant travelling alone to the other side of the world to play people raised in the game’s great capitals. He kept going anyway, year after year, match after match.' },
    { art: ['anand'], who: null, mood: 'wow',
      hi: 'और वह चढ़ते-चढ़ते शिखर तक पहुँच गया। साल 2000 में वर्ल्ड चैंपियन बना। फिर, इस खेल के सबसे कठिन रूप में, 2007 में वह दोबारा चैंपियन बना — और 2008, 2010 और 2012 के मुक़ाबलों में उसने दुनिया के सबसे बेहतरीन खिलाड़ियों के ख़िलाफ़ अपना ख़िताब बचाए रखा। हर मैच हफ़्तों लंबा, हर एक किसी घेराबंदी जैसा। पाँच विश्व ख़िताब, जो एक दशक से भी ज़्यादा समय तक उसके नाम रहे।',
      text: 'And he climbed all the way. World champion in 2000. Then, in the toughest form of the game, champion again in 2007 — and he defended the title in matches in 2008, 2010 and 2012, against the best players alive, each match weeks long, each one a siege. Five world titles, held across more than a decade.' },
    { art: ['anand'], who: null,
      hi: 'मगर इस कहानी का असली अंत कोई ट्रॉफी नहीं है। जब आनंद भारत के पहले ग्रैंडमास्टर बने, तब वे अकेले थे। आज भारत में अस्सी से भी ज़्यादा ग्रैंडमास्टर हैं, जिनमें से कई चेन्नई से हैं, और कई ऐसे बच्चे हैं जिन्होंने खेलना इसलिए शुरू किया क्योंकि उनके अपने शहर के एक शांत, फुर्तीले और मुस्कुराते हुए इंसान ने यह कर दिखाया था। उन्हीं में से एक, सालों बाद, अठारह की उम्र में ख़ुद वर्ल्ड चैंपियन बनेगा — लेकिन वह इस ताक पर रखी सबसे आख़िरी कहानी है।',
      text: 'But the real ending of this story is not a trophy. When Anand became India’s first grandmaster, he was the only one. Today India has more than eighty, many of them from Chennai, many of them children who started because a calm, fast, smiling man from their own city had shown it could be done. One of them, years later, would take the world title himself at eighteen — but that is the last story on this shelf.' },
    { art: ['anand'], who: 'mithu',
      hi: 'यह खेल चतुरंग बनकर भारत से निकला, पूरी दुनिया को जीता, और इंतज़ार करता रहा। फिर मद्रास का एक लड़का गया और यह ताज वापस अपने घर ले आया।',
      text: 'The game left India as chaturanga, conquered the world, and waited. Then one boy from Madras went and brought the crown home.' }
  ],
  moral: 'The first person through a door does two jobs at once: their own, and holding the door for everyone who follows.',
  source: 'FIDE records: world junior title 1987, India’s first grandmaster 1988, world championship titles 2000, 2007, 2008, 2010, 2012; Anand’s memoir "Mind Master" for the Madras beginnings and the Lightning Kid years; India’s grandmaster count (80+) from FIDE’s title lists. Chaturanga’s Indian origin is standard chess history.'
},

{
  id: 'kh.marykom',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'Six Crowns from Kangathei',
  hook: 'A farmer’s daughter from a Manipur village boxed in secret. Her father found out from a newspaper.',
  hero: 'marykom',
  cast: ['marykom'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['मुक्का', 'mukka', 'punch'], ['माँ', 'maa', 'mother'], ['वापसी', 'vaapsi', 'comeback']],
  scenes: [
    { art: ['marykom'], who: null,
      hi: '"कांगथई भारत के उत्तर-पूर्व के ख़ूबसूरत पहाड़ी इलाके मणिपुर का एक छोटा सा गाँव है, और मैरी कॉम वहीं धान के खेतों में अपने माता-पिता का हाथ बँटाते हुए बड़ी हुईं। 1998 में मणिपुर के एक मुक्केबाज़ डिंगको सिंह ने एशियाई खेलों में स्वर्ण पदक जीता, और पूरा राज्य ख़ुशी से झूम उठा। यह देखकर खेतों में काम करने वाली एक किशोरी ने मन ही मन तय कर लिया कि बॉक्सिंग ही उसकी मंज़िल है।"',
      text: 'Kangathei is a small village in Manipur, in the beautiful hill country of India’s northeast, and Mary Kom grew up there helping her parents in the rice fields. In 1998, a boxer from Manipur named Dingko Singh won gold at the Asian Games, and the whole state lit up. Watching that, a teenage girl from the fields decided, privately, that boxing was hers.' },
    { art: ['marykom'], who: null, mood: 'think',
      hi: '"मन ही मन इसलिए, क्योंकि उनके गाँव की लड़कियों से मुक्केबाज़ी की उम्मीद नहीं की जाती थी, और उनके पिता को डर लगता था—चोटों का, पड़ोसियों का, हर बात का। इसलिए वे उन्हें बताए बिना अभ्यास करती रहीं, पैदल चलकर जिम जातीं, पैंतरे सीखतीं, मुक्के बरसाना सीखतीं। फिर उन्होंने राज्य स्तरीय चैंपियनशिप जीती, और अख़बार में उनकी तस्वीर छपी, और तब जाकर उनके पिता को पता चला कि उनकी बेटी एक मुक्केबाज़ है।"',
      text: 'Privately, because girls from her village were not supposed to box, and her father feared it — the injuries, the neighbours, all of it. So she trained without telling him, walking to the gym, learning to move, learning to hit. Then she won a state championship, and her photograph appeared in the newspaper, and that is how her father found out his daughter was a boxer.',
      ask: {
        q: 'Her secret is out, in print, on the breakfast table. What happens in a family at a moment like that?',
        options: ['It ends the boxing, of course', 'A hard conversation — and then, slowly, a family learning to stand behind a daughter’s strange dream', 'Nothing at all'],
        answer: 1,
        right: 'That is close to how she has told it. It was not easy or quick. But her family came to stand behind her, and family is half of every athlete’s story.',
        wrong: 'It very nearly did end there. But hard conversations sometimes go the other way: slowly, her family came to stand behind her, and family is half of every athlete’s story.'
      } },
    { art: ['marykom'], who: null, mood: 'wow',
      hi: '"फिर जो जीत का सिलसिला शुरू हुआ, वह रुका ही नहीं। 2002 में विश्व चैंपियनशिप का स्वर्ण पदक। फिर 2005 में। फिर 2006 में। हर महाद्वीप से मुक्केबाज़ आए, और बार-बार कांगथई की वही दुबली-पतली, फुर्तीली महिला अपने मुक्कों की बिजली से जीतती रही।"',
      text: 'Then the winning started and would not stop. World championship gold in 2002. Again in 2005. Again in 2006. Boxers from every continent, and again and again the small, fast woman from Kangathei with the thunder in her hands.' },
    { art: ['marykom'], who: null,
      hi: '"2007 में वे माँ बनीं—दो जुड़वाँ बेटों की—और दुनिया भर के लोगों ने मान लिया कि अब उनकी बॉक्सिंग ख़त्म हो गई, क्योंकि उन दिनों दुनिया यही सोचती थी। एक साल बाद उन्होंने वापसी की और फिर से विश्व चैंपियनशिप जीत ली। लोग उन्हें \'शानदार मैरी\' यानी \'मैग्निफ़िसेंट मैरी\' पुकारने लगे। 2010 में वे फिर जीतीं। और 2018 में, अपने पहले ख़िताब के सोलह साल बाद, उन्होंने अपना छठा ख़िताब जीता—इस खेल के इतिहास में किसी भी महिला से ज़्यादा विश्व ख़िताब।"',
      text: 'In 2007 she became a mother — of twin boys — and much of the world assumed her boxing was finished, because that is what the world assumed in those days. One year later she came back and won the world championship again. They started calling her Magnificent Mary. She won again in 2010. And in 2018, sixteen years after her first crown, she won her sixth — more world titles than any woman in the history of the sport.' },
    { art: ['marykom'], who: null, mood: 'wow',
      hi: '"2012 में, जब आख़िरकार महिला बॉक्सिंग को ओलंपिक में जगह मिली, तो वे लंदन में मौजूद थीं, उस मुक़ाबले में भारत की इकलौती महिला मुक्केबाज़, और उन्होंने लड़कर भारत के लिए कांस्य पदक जीता। जो लड़की कभी छुप-छुपकर अभ्यास करती थी, अब पूरा देश उसके लिए तालियाँ पीट रहा था और नारे लगा रहा था।"',
      text: 'In 2012, when women’s boxing entered the Olympics at last, she was there in London, the only Indian woman in the draw, and fought her way to a bronze medal for India. A girl who had trained in secret now had a whole country making noise for her.' },
    { art: ['marykom'], who: 'mithu',
      hi: '"छह विश्व ख़िताब, दो बेटे, और मणिपुर की पहाड़ियों में धान की खेती करने वाला एक गाँव। जब कोई तुमसे कहे कि चैंपियन कहाँ से आते हैं, तो याद रखना कि वे कहीं से भी आ सकते हैं—और उनमें से कुछ की शुरुआत तो बिल्कुल छुपकर होती है।"',
      text: 'Six world titles, two sons, one rice-farming village in the hills of Manipur. When somebody tells you where champions come from, remember that they come from everywhere — and that some of them start out in secret.' }
  ],
  moral: 'A comeback is just a dream that refuses to accept the ending other people wrote for it.',
  source: 'World amateur boxing records (world titles 2002, 2005, 2006, 2008, 2010, 2018 — six, the record for women); London 2012 Olympic bronze; her autobiography "Unbreakable" for the secret training, the newspaper photograph, the Dingko Singh inspiration and the return after the twins.'
},

{
  id: 'kh.sindhu',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Girl Who Woke Before the Birds',
  hook: 'Fifty kilometres a day to practice, from the age of eight. It adds up — to a world championship.',
  hero: 'sindhu',
  cast: ['sindhu'],
  minutes: 4,
  /* IN-TG: deliberate — see file header. Hyderabad is Telangana; the map
     geometry gap (docs/07) means no state lights yet, but the Telugu family
     shelf matches TG today and the code is correct the day the map is fixed. */
  place: ['IN-TG'],
  words_hi: [['सुबह', 'subah', 'morning'], ['मेहनत', 'mehnat', 'hard work'], ['सपना', 'sapna', 'dream']],
  scenes: [
    { art: ['sindhu'], who: null,
      hi: 'पी. वी. सिंधु का जन्म हैदराबाद में खेल-कूद से भरे एक घर में हुआ था — उनके माता-पिता दोनों भारत के लिए वॉलीबॉल खेलते थे। लेकिन 2001 में, जब वह छह साल की थीं, पुलेला गोपीचंद नाम के एक भारतीय ने ऑल इंग्लैंड बैडमिंटन ख़िताब जीता, जो इस खेल के सबसे बड़े सम्मानों में से एक है, और उस नन्हीं बच्ची ने वॉलीबॉल की जगह रैकेट को चुन लिया।',
      text: 'P. V. Sindhu was born in Hyderabad into a house full of sport — both her parents played volleyball for India. But in 2001, when she was six, an Indian named Pullela Gopichand won the All England badminton title, one of the sport’s great crowns, and the little girl chose the racquet over the volleyball.' },
    { art: ['sindhu'], who: null, mood: 'think',
      hi: 'गोपीचंद ने आगे चलकर एक ट्रेनिंग अकादमी खोली — शहर के दूसरे कोने पर। आठ साल की उम्र से ही सिंधु सूरज निकलने से पहले उठ जाती थीं, आने-जाने में दर्जनों किलोमीटर का सफ़र करती थीं, स्कूल से पहले सुबह का अभ्यास और स्कूल के बाद शाम का अभ्यास। कभी हिसाब लगाकर देखिए: सालों-साल की ऐसी सुबहें, जिनमें से हर एक सुबह को उन्होंने तब चुना जब बाकी पूरा शहर सो रहा था।',
      text: 'Gopichand went on to open a training academy — on the far side of the city. From the age of eight, Sindhu was up before dawn, travelling tens of kilometres there and back, morning practice before school, evening practice after. Do the sums sometime: years of mornings, every one of them chosen while the rest of the city slept.',
      ask: {
        q: 'What must it feel like, waking in the dark at eight years old, morning after morning, for a game?',
        options: ['Terrible, every single time', 'Nobody can know but her — but a dream you choose yourself weighs less than one chosen for you', 'Easy, if you are talented'],
        answer: 1,
        right: 'That is the honest answer — her mornings belong to her. What the record shows is that she kept choosing them, for years, and that nobody was forcing her.',
        wrong: 'Only she could tell you — and that is the honest answer. What the record shows is that she kept choosing those mornings, for years, and that nobody was forcing her.'
      } },
    { art: ['sindhu'], who: null, mood: 'wow',
      hi: '2016 के रियो ओलंपिक में, इक्कीस साल की उम्र में, वह संघर्ष करते हुए फ़ाइनल तक पहुँचीं — ओलंपिक रजत पदक जीतने वाली पहली भारतीय महिला। पूरा देश उन्हें देखने के लिए रात भर जागा रहा। लेकिन रजत भी एक अजीब पदक है: यह चमकता तो है, पर उस एक मैच की फुसफुसाहट भी सुनाता रहता है जिसे आप जीत नहीं पाए।',
      text: 'At the Rio Olympics in 2016, at twenty-one, she fought her way to the final — the first Indian woman ever to win an Olympic silver. The whole country stayed up to watch. But silver is a strange medal: it glitters, and it whispers about the one match you did not win.' },
    { art: ['sindhu'], who: null, mood: 'wow',
      hi: 'उन्होंने 2019 में बासेल में इसका जवाब दिया। विश्व चैंपियनशिप के फ़ाइनल में उन्होंने अपनी ज़िंदगी का सबसे यादगार मैच खेला, इतनी तेज़ और इतनी ज़ोरदार कि दुनिया की सबसे बेहतरीन खिलाड़ियों में से एक भी उनके सामने बमुश्किल अंक बना सकी। विश्व चैंपियन — बैडमिंटन में भारत की पहली, अब तक की सबसे पहली। और फिर टोक्यो में उन्होंने दोबारा ओलंपिक पदक जीता, और दो पदक जीतने वाली पहली भारतीय महिला बन गईं।',
      text: 'She answered in Basel, in 2019. In the final of the world championships she played the match of her life, so fast and so fierce that one of the best players on Earth could barely score against her. World champion — the first from India in badminton, ever. And in Tokyo she won an Olympic medal again, becoming the first Indian woman with two.' },
    { art: ['sindhu'], who: null,
      hi: 'उन्हें खेलते देखिए और आपको दिखाई देगा: उनकी पहुँच, उनकी छलांग, और दरवाज़ा ज़ोर से बंद होने जैसी आवाज़ वाला स्मैश। लेकिन जो भी उनकी कहानी जानता है, उसे इसके पीछे कुछ और दिखता है — हैदराबाद के अंधेरे में कार में बैठी एक छोटी बच्ची, जो अभ्यास के रास्ते पर आधी दूर पहुँच चुकी है जबकि परिंदे अभी सो ही रहे हैं।',
      text: 'Watch her play and you see it: the reach, the leap, the smash that sounds like a door slamming. But everyone who knows her story sees something else behind it — a small girl in a car in the Hyderabad dark, halfway to practice while the birds are still asleep.' },
    { art: ['sindhu'], who: 'mithu',
      hi: 'हुनर यह तय करता है कि आपका सबसे बेहतरीन दिन कितना अच्छा हो सकता है। सुबहें तय करती हैं कि वह बेहतरीन दिन कितनी बार लौटकर आता है।',
      text: 'Talent decides how good your best day can be. Mornings decide how often your best day shows up.' }
  ],
  moral: 'Big dreams are mostly built at hours when nobody is watching and nobody is clapping.',
  source: 'BWF and Olympic records: Rio 2016 silver, world championship gold at Basel 2019 (the first for India in badminton), Tokyo bronze — two Olympic medals; her volleyball-international parents and the long childhood commute to the Gopichand academy are documented across her BWF and Olympic profiles.'
},

{
  id: 'kh.neeraj',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Spear From Khandra',
  hook: 'A farm boy from Haryana picked up a javelin to get fit. Ninety seconds of throwing in Tokyo changed Indian sport forever.',
  hero: 'neeraj',
  cast: ['neeraj'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['भाला', 'bhaala', 'javelin'], ['खेत', 'khet', 'field'], ['सोना', 'sona', 'gold']],
  scenes: [
    { art: ['neeraj'], who: null,
      hi: 'हरियाणा में पानीपत के पास खांद्रा नाम का एक किसान गाँव है—गेहूँ के खेत, भैंसें, और एक ही घर में रहता एक बड़ा संयुक्त परिवार। नीरज चोपड़ा उसी परिवार का एक हँसमुख और गोल-मटोल सा बच्चा था। जब वह लगभग तेरह साल का था, तो थोड़ी कसरत कराने के लिए उसके चाचाजी उसे शहर के स्टेडियम ले गए। बस, यही पूरी शुरुआत थी: न कोई भविष्यवाणी, न कोई प्रतिभा तलाशने वाला। एक चाचाजी, और एक लड़का जिसे दौड़-भाग की ज़रूरत थी।',
      text: 'Khandra is a farming village near Panipat, in Haryana — wheat fields, buffaloes, a big joint family in one house. Neeraj Chopra was the cheerful, roundish kid of that family, and when he was about thirteen his uncle marched him to the stadium in town to get some exercise. That is the whole beginning: no prophecy, no talent scout. An uncle, and a boy who needed a run.' },
    { art: ['neeraj'], who: null, mood: 'wow',
      hi: 'स्टेडियम में उसने भाला फेंकने वालों को देखा—और बस, बात बन गई। एक ऐसा पल होता है जब भाला फेंकने वाले के हाथ से छूटकर हवा में ऐसे ठहर सा जाता है मानो कभी नीचे आएगा ही नहीं, और नीरज वह पल अपने लिए चाहता था। वह इसमें कमाल का निकला! साल 2016 की वर्ल्ड जूनियर चैंपियनशिप में उसने 86.48 मीटर भाला फेंका—अपनी उम्र के खिलाड़ियों के लिए एक नया विश्व रिकॉर्ड। खांद्रा के उस लड़के के नाम अब एक विश्व रिकॉर्ड था।',
      text: 'At the stadium he saw the javelin throwers — and that was that. There is a moment when a spear leaves a thrower’s hand and hangs in the air as if it may never come down, and Neeraj wanted that moment for himself. He turned out to be astonishing at it. At the world junior championships in 2016 he threw 86.48 metres — a world record for his age group. The boy from Khandra held a world record.' },
    { art: ['neeraj'], who: null,
      hi: 'भाला फेंक के साथ एक ख़ास बात यह थी: एथलेटिक्स में भारत ने कभी कोई ओलंपिक स्वर्ण पदक नहीं जीता था। सौ से भी ज़्यादा सालों के खेलों के इतिहास में एक भी नहीं—दौड़ने, कूदने और फेंकने के जिन खेलों को दुनिया का हर बच्चा खेलता है, उनमें पदक तालिका पर भारत के नाम के आगे शून्य लिखा था। बेहतरीन भारतीय खिलाड़ियों की पूरी-की-पूरी पीढ़ियाँ चौथे नंबर पर रहीं, या पदक के बेहद क़रीब पहुँचकर घर लौट गईं।',
      text: 'Here is the thing about the javelin: India had never won an Olympic gold medal in athletics. Not one, in more than a century of Games — in the sports of running, jumping and throwing that every child on Earth plays, the medal table by India’s name said zero. Whole generations of brilliant Indian athletes had come fourth, or close, and gone home.' },
    { art: ['neeraj'], who: null, mood: 'think',
      hi: 'टोक्यो, 7 अगस्त 2021—टले हुए ओलंपिक, जो एक साल की देरी से हो रहे थे। तेईस साल का नीरज दुनिया के सबसे बेहतरीन खिलाड़ियों के ख़िलाफ़ फ़ाइनल में उतरा। उसका पहला थ्रो 87.03 मीटर गया और वह सबसे आगे निकल गया। उसका दूसरा थ्रो 87.58 मीटर पहुँचा। फिर बाक़ी पूरी शाम उसे बस खड़े होकर देखना था, जबकि दुनिया के ग्यारह सबसे ताक़तवर खिलाड़ी बारी-बारी से उससे आगे निकलने की कोशिश कर रहे थे।',
      text: 'Tokyo, the seventh of August, 2021 — the postponed Olympics, held a year late. Neeraj, twenty-three, walked into the final against the best throwers alive. His first throw went 87.03 metres and led the field. His second went 87.58. Then he had to stand and watch, for the rest of the evening, while eleven of the world’s strongest men took turns trying to pass it.' },
    { art: ['neeraj'], who: null, mood: 'wow',
      hi: 'कोई भी उससे आगे नहीं निकल सका। खांद्रा का वह भाला पूरी दुनिया से आगे निकल चुका था। नीरज चोपड़ा पोडियम की सबसे ऊँची सीढ़ी पर खड़े हुए, राष्ट्रगान बजा, और एक सौ बीस साल का इंतज़ार ख़त्म हो गया। आने वाले सालों में वे विश्व चैंपियन भी बने—और एक और प्यारी बात हुई: उनका सबसे बड़ा प्रतिद्वंद्वी, पाकिस्तान का एक भाला फेंक खिलाड़ी, उनका बहुत अच्छा दोस्त बन गया; दोनों परिवार सरहद के दोनों तरफ़ से दोनों लड़कों का हौसला बढ़ाते। रिकॉर्ड की किताबों में पदक दर्ज हैं; तस्वीरों में दोस्ती सँभली हुई है।',
      text: 'Nobody could. The spear from Khandra had flown further than the whole world. Neeraj Chopra stood on the top step, the anthem played, and a hundred-and-twenty-year wait ended. In the years after, he became world champion too — and one more lovely thing: his warmest rival, a thrower from Pakistan, became one of his good friends, their two families cheering both boys across the border. The record books hold the medals; the photographs hold the friendship.' },
    { art: ['neeraj'], who: 'mithu',
      hi: 'एक चाचाजी जिनकी ज़िद थी, पास ही मौजूद एक स्टेडियम, और वहीं पड़ा हुआ एक भाला। अपनी आँखें खुली रखो—जिस काम के लिए तुम बने हो, कभी-कभी वह बस दीवार के सहारे टिका हुआ तुम्हारे वहाँ से गुज़रने का इंतज़ार कर रहा होता है।',
      text: 'An uncle who insisted, a stadium that happened to be near, a spear that happened to be lying there. Keep your eyes open — the thing you are meant to do sometimes just leans against a wall, waiting for you to walk past.' }
  ],
  moral: 'History can wait a hundred years and then change in ninety seconds — thrown by someone who started by accident.',
  source: 'World Athletics and Olympic records: world U20 record 86.48m (2016), Tokyo gold 7 August 2021 at 87.58m — India’s first Olympic athletics gold — and the 2023 world title; the Khandra beginnings and the friendship with Pakistan’s Arshad Nadeem are documented across World Athletics profiles and their own public accounts.'
},

{
  id: 'kh.avani',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Stillest Person in the Room',
  hook: 'Her sport is won by the breath and the heartbeat. She rules it from a wheelchair, with two Paralympic golds.',
  hero: 'avani',
  cast: ['avani'],
  minutes: 4,
  place: ['IN-RJ'],
  words_hi: [['निशाना', 'nishana', 'aim'], ['शांत', 'shaant', 'calm'], ['हौसला', 'hausla', 'spirit']],
  scenes: [
    { art: ['avani'], who: null,
      hi: 'अवनी लेखरा राजस्थान के जयपुर में पली-बढ़ीं। जब वह ग्यारह साल की थीं, एक कार दुर्घटना में उनकी रीढ़ की हड्डी में चोट लग गई, और तब से वह व्हीलचेयर का इस्तेमाल करती हैं। यह उनकी ज़िंदगी की एक सच्चाई है, और यह कहानी इसे बिल्कुल वैसे ही बताती है जैसे वह इसे अपनाती हैं — साफ़-साफ़, और फिर सीधे उस दिलचस्प हिस्से पर आती है, कि इसके बाद उन्होंने क्या किया।',
      text: 'Avani Lekhara grew up in Jaipur, in Rajasthan. When she was eleven, a car accident injured her spine, and from then on she has used a wheelchair. That is a fact of her life, and this story tells it the way she carries it — plainly, and then straight on to the interesting part, which is what she did next.' },
    { art: ['avani'], who: null, mood: 'think',
      hi: 'उनके पिता ने उन्हें कोई खेल आज़माने के लिए बढ़ावा दिया। उन्होंने तीरंदाज़ी की कोशिश की। फिर उन्होंने निशानेबाज़ी — दस मीटर एयर राइफ़ल — आज़माई, और बात बन गई। उसी दौरान उन्होंने अभिनव बिंद्रा की आत्मकथा पढ़ी, वह निशानेबाज़ जिन्होंने 2008 में भारत का पहला व्यक्तिगत ओलंपिक स्वर्ण पदक जीता था, और अवनी ने तय कर लिया कि उनका असली निशाना क्या है।',
      text: 'Her father encouraged her to try sport. She tried archery. Then she tried shooting — the ten-metre air rifle — and something clicked. Around then she read the autobiography of Abhinav Bindra, the shooter who in 2008 had won India’s first-ever individual Olympic gold, and she decided precisely what she was aiming at.',
      ask: {
        q: 'Target shooting is won by stillness — the calmest breath, the quietest heartbeat. Who might that sport suit?',
        options: ['Only the biggest and strongest athletes', 'Anyone who can master their own mind — the target does not know or care who is aiming', 'Only grown-ups'],
        answer: 1,
        right: 'Exactly. The target is ten metres of honest air. It cannot see a wheelchair, an age, or a name. It only knows where the shot went.',
        wrong: 'Look at what the sport measures: breath, focus, nerve. The target is ten metres of honest air — it cannot see a wheelchair, an age, or a name. It only knows where the shot went.'
      } },
    { art: ['avani'], who: null, mood: 'wow',
      hi: 'टोक्यो, 2021, पैरालंपिक खेल। उन्नीस साल की उम्र, दस मीटर एयर राइफ़ल का फ़ाइनल, और सामने दुनिया के सबसे सधे हुए हाथ। एक के बाद एक शॉट, अवनी का निशाना बिल्कुल केंद्र से चूका ही नहीं। उन्होंने पैरालंपिक रिकॉर्ड स्कोर के साथ स्वर्ण पदक जीता — पैरालंपिक में स्वर्ण जीतने वाली पहली भारतीय महिला — और फिर, कुछ ही दिनों बाद, एक और मुक़ाबले में कांस्य पदक भी जीत लिया।',
      text: 'Tokyo, 2021, the Paralympic Games. Nineteen years old, in the final of the ten-metre air rifle, against the steadiest hands on the planet. Shot after shot, Avani simply did not miss the middle. She won gold with a Paralympic record score — the first Indian woman ever to win Paralympic gold — and then, days later, won a bronze in a second event for good measure.' },
    { art: ['avani'], who: null, mood: 'wow',
      hi: 'चैंपियनों से सबसे ज़्यादा एक ही सवाल पूछा जाता है: क्या आप यह दोबारा कर सकते हैं? पेरिस में, 2024 में, जब बाकी सभी का निशाना उन्हीं पर था, वह लौटीं और फिर से स्वर्ण पदक जीता — अपने ही रिकॉर्ड स्कोर को तोड़ते हुए। इन दोनों खेलों के बीच, उन्होंने चुपचाप वकालत की पढ़ाई भी जारी रखी। लगता है, एकदम सटीक होना एक ऐसी आदत है जो हर जगह साथ चलती है।',
      text: 'Champions are asked one question above all: can you do it again? In Paris, in 2024, with the whole field aiming at her, she came back and won the gold again — beating her own record score. Between the two Games she also quietly got on with studying law. Precision, it seems, is a habit that travels.' },
    { art: ['avani'], who: 'mithu',
      hi: 'लोग कभी-कभी \'प्रेरणादायक\' शब्द का इस्तेमाल सिर थपथपाने की तरह करते हैं। अवनी को किसी की थपकी की ज़रूरत नहीं है। वह महज़ कोई अच्छी कहानी नहीं हैं — वह दुनिया के सबसे कठिन कामों में से एक में सबसे बेहतरीन हैं, वह भी दो-दो बार, और स्कोरबोर्ड अंकों में यही बात साफ़ कहता है।',
      text: 'People sometimes use the word inspiring like a pat on the head. Avani does not need the pat. She is not a nice story — she is the best in the world at one of the hardest things there is, twice over, and the scoreboard says so in numbers.' }
  ],
  moral: 'The target cannot see who is shooting. Find the arena that measures only what you can control, and rule it.',
  source: 'International Paralympic Committee records: Tokyo 2020 gold, 10m air rifle standing SH1 (249.6, Paralympic record — first Paralympic gold by an Indian woman) plus 50m rifle bronze; Paris 2024 gold (249.7). Her accident, the archery-to-shooting path, the Bindra autobiography and the law studies are from her documented IPC and Paralympic-committee profiles.'
},

{
  id: 'kh.gukesh',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'Eighteen, and King of the World',
  hook: 'The oldest game’s biggest crown, and the youngest head it has ever rested on — a boy from Chennai.',
  hero: 'gukesh',
  cast: ['gukesh', 'anand'],
  minutes: 4,
  place: ['IN-TN'],
  words_hi: [['राजा', 'raja', 'king'], ['धैर्य', 'dhairya', 'patience'], ['इतिहास', 'itihaas', 'history']],
  scenes: [
    { art: ['gukesh'], who: null,
      hi: 'याद है वह \'लाइटनिंग किड\', जो शतरंज का ताज चेन्नई लेकर आए थे? यह कहानी उसी से आगे निकली है। गुकेश दोम्माराजू का जन्म 2006 में चेन्नई में हुआ था — एक ऐसे शहर में जो तब तक शतरंज का दीवाना हो चुका था, जहाँ ढेरों क्लब, कोच और स्कूल टूर्नामेंट थे, और इन सबका रास्ता आनंद तक जाता था। गुकेश ने सात साल की उम्र में शतरंज की चालें सीख ली थीं।',
      text: 'Remember the Lightning Kid, who brought the chess crown home to Chennai? This story is what grew from that one. Gukesh Dommaraju was born in Chennai in 2006 — into a city that was by then mad about chess, full of clubs and coaches and school tournaments, all of it tracing back to Anand. Gukesh learned the moves at seven.' },
    { art: ['gukesh'], who: null,
      hi: 'वह बड़ी तेज़ी से आगे बढ़ा। उसके डॉक्टर पिता ने अपना काम-काज छोड़कर एक से दूसरे टूर्नामेंट में उसके साथ घूमना शुरू किया; पूरे परिवार ने एक लड़के के अनोखे शतरंज के लिए अपनी आम ज़िंदगी के कई साल दांव पर लगा दिए थे। बारह साल की उम्र में गुकेश ग्रैंडमास्टर बन गया — उस समय इस खेल के इतिहास में दूसरा सबसे कम उम्र का खिलाड़ी। जिस अकादमी ने उसे तराशने में मदद की, उसे खुद आनंद चलाते थे: पहला बादशाह, जो अगले बादशाह को सिखा रहा था।',
      text: 'He rose absurdly fast. His father, a doctor, set aside his own work to travel with him from tournament to tournament, the family betting years of ordinary life on a boy’s extraordinary chess. At twelve, Gukesh became a grandmaster — at the time, the second-youngest in the history of the game. The academy that helped train him was run by Anand himself: the first king, coaching the next one.' },
    { art: ['gukesh'], who: null, mood: 'wow',
      hi: 'साल 2024 में उसने चैंपियनों का वह टूर्नामेंट जीत लिया जिससे तय होता है कि विश्व खिताब के लिए कौन चुनौती देगा — सत्रह साल की उम्र में यह कमाल करने वाला वह अब तक का सबसे कम उम्र का खिलाड़ी था। इस जीत से उसे चीन के मौजूदा विश्व चैंपियन डिंग लिरेन के खिलाफ मुकाबला खेलने का मौका मिला: सिंगापुर में चौदह बाजियों का मुकाबला, जो करीब एक महीने तक चला।',
      text: 'In 2024 he won the tournament of champions that decides who challenges for the world title — at seventeen, the youngest ever to do it. That earned him a match against the reigning world champion, Ding Liren of China: fourteen games, in Singapore, stretched across almost a month.' },
    { art: ['gukesh'], who: null, mood: 'think',
      hi: 'मुकाबला बेहद कड़ा और बराबरी का रहा, बिल्कुल आखिरी बाजी तक — जो घंटों-घंटों खिंचती हुई ड्रॉ की तरफ बढ़ रही थी। और फिर, ऐसी स्थिति में जहां लगभग हर कोई उम्मीद छोड़ चुका था, थके हुए चैंपियन ने अपने हाथी से एक नन्हीं सी चूक कर दी। गुकेश, जिसने पूरी दोपहर मौकों की तलाश बंद करने से इनकार कर दिया था, उसने इसे तुरंत देख लिया।',
      text: 'The match was brutal and level, all the way to the very last game — which drifted, hour after hour, towards a draw. And then, in a position almost everyone had given up on, the champion made one tired, tiny mistake with his rook. Gukesh, who had refused all afternoon to stop looking for chances, saw it instantly.',
      ask: {
        q: 'Endless patience in a dead-even position, still searching when a draw would be easy — what is that, really?',
        options: ['Stubbornness, and a bit of luck', 'A choice: hope kept deliberately alive until the other person’s hope runs out', 'Just talent'],
        answer: 1,
        right: 'That is the champion’s answer. The mistake only mattered because someone was still there, still looking, still believing the game held one more chance.',
        wrong: 'Luck was offered to both players that day. The mistake only mattered because one of them was still there, still looking, still believing the game held one more chance.'
      } },
    { art: ['gukesh', 'anand'], who: null, mood: 'wow',
      hi: 'कुछ नपी-तुली चालों के बाद, विश्व चैंपियन ने हार मान ली — और चेन्नई के एक अठारह साल के लड़के ने विश्व शतरंज चैंपियनशिप जीत ली, क्लासिकल खेल के लंबे इतिहास का सबसे कम उम्र का चैंपियन, जिसने वह रिकॉर्ड तोड़ा जो उसके माता-पिता के मिलने से भी पहले से बना हुआ था। कैमरों ने उसे दोनों हाथों में सिर थामे रोते हुए कैद किया, एक लड़का और साथ ही साथ एक बादशाह।',
      text: 'A few precise moves later, the world champion resigned — and an eighteen-year-old from Chennai had won the world chess championship, the youngest champion in the long history of the classical game, breaking a record that had stood since before his parents met. The cameras caught him with his head in his hands, crying, a boy and a king at the same time.' },
    { art: ['gukesh'], who: 'mithu',
      hi: 'चतुरंग का जन्म यहीं हुआ था, वह पूरी दुनिया घूमा और दो बार अपने घर लौटा — एक बार आनंद के साथ, और एक बार उस किशोर के साथ जिसने कभी एक और मौके की तलाश बंद नहीं की थी। अभी इसी वक्त, कहीं न कहीं कोई अगला खिलाड़ी मोहरे सजा रहा है।',
      text: 'Chaturanga was born here, went round the world, and came home twice — once with Anand, once with a teenager who never stopped looking for one more chance. Somewhere right now the next one is setting up the pieces.' }
  ],
  moral: 'Talent opens the game, but patience wins the last hour of it — hope, kept deliberately alive, is a skill you can practise.',
  source: 'FIDE records: grandmaster at 12 (2019), Candidates winner at 17 (2024), world championship victory over Ding Liren in game 14 at Singapore, December 2024 — world champion at 18, the youngest in classical chess history; his training at the WestBridge Anand Chess Academy and his father’s travels are documented in FIDE and championship coverage.'
},

/* ---- Khel, the second bench (2026-08): six more real athletes, most of them
   women — written as athletes first, "first woman" stated as the fact it is,
   never the whole personality. Living-people rules from the file header hold.
   kh.mithali carries IN-TG deliberately, exactly like kh.sindhu — same known
   geometry gap, same graceful degradation, same self-heal when the map lands. */

{
  id: 'kh.dhoni',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Ticket Collector Who Finished It',
  hook: 'For two years he checked tickets on a railway platform. Then one night in Mumbai he hit the most famous six India has ever seen.',
  hero: 'dhoni',
  cast: ['dhoni'],
  minutes: 4,
  place: ['IN-JH'],
  words_hi: [['छक्का', 'chhakka', 'six'], ['रेलगाड़ी', 'relgaadi', 'train'], ['धीरज', 'dheeraj', 'patience']],
  scenes: [
    { art: ['dhoni'], who: null,
      hi: 'महेंद्र सिंह धोनी रांची में बड़े हुए — जंगलों और लोहे की धरती का एक शहर, जो अब झारखंड में है, क्रिकेट के मशहूर शहरों से उतना ही दूर जितना कोई हिंदुस्तानी लड़का हो सकता था। वह अपने स्कूल की फुटबॉल टीम के गोलकीपर थे, और एक खेल शिक्षक ने ही उस गोलकीपर से विकेटकीपिंग के दस्ताने आज़माने को कहा। बाद में पता चला कि ये हाथ दोनों ही जगह कमाल करते थे।',
      text: 'Mahendra Singh Dhoni grew up in Ranchi — a town of forests and iron country, in what is now Jharkhand, about as far from cricket’s famous cities as an Indian boy could be. He was his school’s football goalkeeper, and it was a games teacher who asked the goalkeeper to try the wicketkeeping gloves instead. The hands, it turned out, worked either way.' },
    { art: ['dhoni'], who: null, mood: 'think',
      hi: 'बीस साल की उम्र में उन्हें वैसी नौकरी मिल गई जिसकी हर परिवार दुआ करता है: भारतीय रेल में एक पद, बंगाल के खड़गपुर स्टेशन पर टिकट चेक करने का काम। दो साल तक वे रेलवे क्वार्टर में रहे, प्लेटफ़ॉर्मों पर काम किया, और जब भी नौकरी से फुर्सत मिली, क्रिकेट खेला। सरकारी नौकरी एक गरम कोट जैसी होती है — उनका परिवार इसकी क़ीमत जानता था। और हर रोज़, दूसरे लोगों के सफ़र से भरी रेलगाड़ियाँ उनके सामने से गुज़रती रहीं।',
      text: 'At twenty he got the kind of job families pray for: a post with Indian Railways, checking tickets at Kharagpur station in Bengal. For two years he lived in the railway quarters, worked the platforms, and played cricket whenever the job allowed. A government job is a warm coat — his family knew what it was worth. And every day, trains full of other people’s journeys pulled out in front of him.',
      ask: {
        q: 'A safe job for life on one hand. On the other, a game that has promised you nothing at all. What do you do?',
        options: ['Keep the job — a promise beats a maybe', 'Leave — some maybes have to be answered before they expire', 'Wait for someone to decide for you'],
        answer: 1,
        right: 'That is what he did, in 2003: he left the platform for the game. Not recklessly — he had given cricket a deadline, and cricket had shown just enough. But the leaving was still a leap.',
        wrong: 'A fair answer — it is what almost everyone chooses, and there is no shame in a warm coat. But in 2003 Dhoni left the platform for the game, and the rest of this story is what came through the door he risked.'
      } },
    { art: ['dhoni'], who: null, mood: 'wow',
      hi: 'दो ही साल के भीतर, राँची का यह लंबे बालों वाला विकेटकीपर भारत के लिए पाकिस्तान के ख़िलाफ़ 148 रन कूट रहा था। और 2007 में, जब पहले-पहल ट्वेंटी-20 वर्ल्ड कप के लिए एक युवा टीम की कप्तानी उन्हें सौंपी गई, तो उन्होंने कुछ ऐसा किया जो कोच आज भी सिखाते हैं: जब फ़ाइनल मैच आख़िरी ओवर पर टिका था, उन्होंने गेंद किसी बड़े स्टार को नहीं, बल्कि एक ऐसे गेंदबाज़ को थमाई जिसका नाम लगभग किसी ने नहीं सुना था — और शांत मन से चला गया यह दाँव भारत को कप जिता गया।',
      text: 'Within two years the long-haired wicketkeeper from Ranchi was smashing 148 against Pakistan for India. And in 2007, handed the captaincy of a young squad for the very first Twenty20 World Cup, he did something coaches still teach: with the final match hanging on its last over, he gave the ball not to a star but to a bowler almost nobody had heard of — and the gamble, calmly made, won India the cup.' },
    { art: ['dhoni'], who: null, mood: 'wow',
      hi: 'फिर आई मुंबई में 2 अप्रैल 2011 की रात — वर्ल्ड कप का फ़ाइनल, श्रीलंका के ख़िलाफ़ भारत 275 रनों का पीछा कर रहा था, और सौ करोड़ लोग साँस थामे बैठे थे। पूरे टूर्नामेंट में ख़राब फ़ॉर्म से जूझ रहे धोनी, बल्लेबाज़ी क्रम में ख़ुद ऊपर आ गए — कप्तान ने सबसे कठिन ज़िम्मेदारी अपने कंधों पर ले ली। वे 91 रन बनाकर नाबाद रहे, और लॉन्ग-ऑन के ऊपर से एक ऊँचा छक्का जड़कर मैच ख़त्म किया। वह शॉट भारतीय क्रिकेट के किसी भी शॉट से ज़्यादा बार देखा गया है। उसने अट्ठाईस साल का इंतज़ार ख़त्म कर दिया — वही कप जो 1983 में कपिल की टीम ने जीता था, आख़िरकार घर लौट आया, ख़ुद सचिन के अपने शहर में।',
      text: 'Then Mumbai, the night of 2 April 2011 — the World Cup final, India chasing 275 against Sri Lanka, a billion people holding their breath. Dhoni, out of form all tournament, promoted himself up the batting order — the captain taking the hardest job in the house for himself. He finished on 91 not out, and ended the match with a six lifted high over long-on. That shot has been replayed more than any stroke in Indian cricket. It ended a twenty-eight-year wait — the cup Kapil’s team had won in 1983, home at last, in Sachin’s own city.' },
    { art: ['dhoni'], who: null,
      hi: 'अख़बारों ने उन्हें \'कैप्टन कूल\' कहा, और यह नाम इसलिए जम गया क्योंकि यह सच बयाँ करता था: क्रिकेट के सबसे हंगामेदार पलों में भी, वे ऐसे सोचते और चलते थे मानो कोई टाइम-टेबल पढ़ रहा हो। 2013 में उनकी टीम ने चैंपियंस ट्रॉफ़ी भी जीत ली — जिससे वे क्रिकेट के तीनों विश्व ख़िताब जीतने वाले इकलौते कप्तान बन गए। शांत रहना कोई ऐसी चीज़ नहीं जो आपके पास बस यूँ ही होती है। यह तो वह हुनर है जिसे आप रोज़-रोज़ साधते हैं।',
      text: 'The newspapers called him Captain Cool, and the name stuck because it named something real: in the loudest moments cricket can produce, he moved and thought like a man reading a timetable. In 2013 his team added the Champions Trophy — making him the only captain ever to win all three of cricket’s world titles. Calm, it turns out, is not something you have. It is something you practise.' },
    { art: ['dhoni'], who: 'mithu',
      hi: 'खड़गपुर की टिकट खिड़की से वानखेड़े की बालकनी तक की दूरी ऐसी नहीं जिसे ट्रेनें तय कर सकें। उन्होंने यह फ़ासला धीमे रास्ते से नापा — हर एक दिन ख़ुद को तैयार रखकर, उस दिन के लिए जब खेल ने आख़िरकार उन्हें आवाज़ दी।',
      text: 'From a ticket window at Kharagpur to the balcony at Wankhede is not a distance trains can cover. He crossed it the slow way — by being ready, every single day, for the day the game finally asked.' }
  ],
  moral: 'The loudest moments belong to the people who have practised staying quiet inside them.',
  source: 'BCCI and ICC match records — the 2007 World Twenty20 final and the 2011 World Cup final at Mumbai (India 277/4 chasing 275; Dhoni 91 not out, the winning six), and the 2013 Champions Trophy that completed the set of ICC titles; his 2001–03 years as a travelling ticket examiner at Kharagpur railway station are on Indian Railways’ own record and in contemporary reporting.'
},

{
  id: 'kh.kohli',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Boy Who Batted That Morning',
  hook: 'Delhi cricket still talks about one innings by an eighteen-year-old — not for the runs, but for the morning on which he made them.',
  hero: 'kohli',
  cast: ['kohli'],
  minutes: 4,
  place: ['IN-DL'],
  words_hi: [['पिता', 'pita', 'father'], ['जज़्बा', 'jazba', 'fighting spirit'], ['अनुशासन', 'anushasan', 'discipline']],
  scenes: [
    { art: ['kohli'], who: null,
      hi: '1998 की गर्मियों में, पश्चिमी दिल्ली के एक नौ साल के लड़के ने अपने पड़ोस की एक नई-नवेली क्रिकेट अकादमी में दाख़िला लिया, और उसके पिता का एक ऐसा नियम शुरू हुआ जो सालों चला: दिल्ली के ट्रैफ़िक और दिल्ली के मौसम से जूझते हुए, दिन-ब-दिन अपने स्कूटर पर बच्चे को प्रैक्टिस के लिए ले जाना और वापस लाना। विराट कोहली का क्रिकेट, शुरू से ही, एक ऐसी चीज़ थी जिसे वे और उनके पिता मिलकर जीते थे।',
      text: 'In the summer of 1998, a nine-year-old from West Delhi joined a brand-new cricket academy in his neighbourhood, and his father began a routine that lasted years: driving the boy to practice and back on his scooter, day after day, through Delhi’s traffic and Delhi’s weather. Virat Kohli’s cricket was, from the very start, a thing he and his father did together.' },
    { art: ['kohli'], who: null, mood: 'sad',
      hi: 'दिसंबर 2006। अठारह साल के विराट दिल्ली के लिए एक बड़ा मैच खेल रहे थे, टीम मुश्किल में थी और वह क्रीज़ पर टिके हुए थे। उसी रात, तड़के घर पर उनके पिता का अचानक निधन हो गया। इसके बाद जो हुआ, उसकी चर्चा दिल्ली के ड्रेसिंग रूम में आज भी दबी ज़ुबान में की जाती है: सुबह होते ही उस लड़के ने अपने कोच को फ़ोन किया और कहा कि वह बल्लेबाज़ी करना चाहता है। वह मैदान पर आए, सुबह भर अपनी टीम के लिए बल्लेबाज़ी की, 90 रन बनाए — और मैदान से सीधे अपने पिता को अंतिम विदाई देने चले गए। वहाँ मौजूद किसी भी इंसान ने उस पारी को कभी सिर्फ़ रनों की पारी नहीं कहा।',
      text: 'December 2006. Virat, eighteen, was playing for Delhi in a big match, not out overnight with his team in trouble. In the small hours of that night, at home, his father died suddenly. What happened next is told quietly in Delhi dressing rooms to this day: at dawn the boy telephoned his coach and said he wanted to bat. He came to the ground, batted through the morning for his team, made 90 — and went from the field to say goodbye to his father. Nobody who was there has ever described that innings as just runs.' },
    { art: ['kohli'], who: null,
      hi: 'क्रिकेट उनके और उनके पिता के बीच की भाषा थी, और वह वही भाषा बोलते रहे। 2008 में उन्होंने भारत की अंडर-19 टीम की कप्तानी करके विश्व कप जिताया। 2011 में, बाईस साल की उम्र में, वह उस टीम में थे जिसने ख़ुद विश्व कप जीता — वह इसी शेल्फ़ पर रखी सचिन की कहानी वाले वही नौजवान हैं, उन साथियों में से एक जिन्होंने उस रात उस महान खिलाड़ी को अपने कंधों पर उठाकर पूरे मैदान का चक्कर लगाया था।',
      text: 'Cricket had been the language between him and his father, and he kept speaking it. In 2008 he captained India’s under-19s to a World Cup. In 2011, at twenty-two, he was in the team that won the World Cup itself — he is the young man in Sachin’s story on this shelf, one of the teammates who carried the great man around the ground on their shoulders that night.' },
    { art: ['kohli'], who: null, mood: 'think',
      hi: 'फिर कहानी का वह हिस्सा आया जिसने भारतीय क्रिकेट की रोज़मर्रा की आदतों को ही बदल दिया। 2012 में, जैसा कि वह ख़ुद बताते हैं, उन्होंने ईमानदारी से अपने अंदर झाँका और तय किया कि उनके हुनर को एक बेहतर रखवाले की ज़रूरत है। उन्होंने सब कुछ नए सिरे से ढाला — क्या खाना है, कैसे कसरत करनी है, कैसे सोना है — जब तक कि वह दुनिया के सबसे फ़िट खिलाड़ियों में शामिल नहीं हो गए, और यह फ़िटनेस रनों में बदल गई: एक के बाद एक नामुमकिन लक्ष्य का पीछा किया गया, इतनी बार कि लोग उन्हें चेज़ मास्टर कहने लगे। और कप्तान ने जहाँ अपने पैमाने तय किए, पूरी टीम भी उसी राह पर चल पड़ी। आज भारतीय क्रिकेट का अभ्यास का तरीका अलग है, क्योंकि पहले एक खिलाड़ी ने ख़ुद के लिए स्तर ऊँचा उठाया था।',
      text: 'Then came the part of the story that changed Indian cricket’s daily habits. In 2012, by his own telling, he took an honest look at himself and decided his talent deserved a better keeper. He rebuilt everything — what he ate, how he trained, how he slept — until he was among the fittest athletes in world sport, and the fitness became runs: chase after impossible chase hunted down, so often that people simply started calling him the chase master. And where the captain’s standards went, a whole team’s followed. Indian cricket trains differently today because one player raised the bar on himself first.' },
    { art: ['kohli'], who: null, mood: 'wow',
      hi: 'शतक पर शतक बनते रहे। नवंबर 2023 में, मुंबई में, उन्होंने अपना पचासवाँ एकदिवसीय अंतर्राष्ट्रीय शतक बनाया — और सचिन तेंदुलकर का रिकॉर्ड तोड़ दिया, वही इंसान जिन्हें कभी उन्होंने कंधों पर उठाया था, और जो आज अपने ही घरेलू मैदान के स्टैंड में खड़े होकर तालियाँ बजा रहे थे। रिकॉर्ड की किताबों में तो बस आँकड़े दर्ज हैं। लेकिन तस्वीरों में एक हाथ से दूसरे हाथ में किसी विरासत को सौंपे जाने की झलक क़ैद है।',
      text: 'The hundreds kept coming. In November 2023, in Mumbai, he scored his fiftieth one-day international century — passing the record of Sachin Tendulkar, the man he had helped carry, who stood applauding in the stands of his own home ground. The record books hold the number. The photographs hold the passing of something from one pair of hands to another.' },
    { art: ['kohli'], who: 'mithu',
      hi: 'एक स्कूटर, एक पिता, एक दर्दनाक सुबह, और बीस सालों से निभाया जा रहा एक वादा जो आज भी जारी है। जब लोग मैदान पर उनके जज़्बे और आग की बात करें, तो याद रखना कि वह आग कहाँ सुलगी थी — और यह भी कि उनकी ज़िंदगी की सबसे मुश्किल पारी किसी स्कोरबोर्ड के लिए नहीं, बल्कि प्यार के लिए खेली गई थी।',
      text: 'A scooter, a father, a terrible morning, and a promise kept for twenty years and counting. When people talk about his fire on the field, remember where it was lit — and that the hardest innings of his life was played for love, not for a scoreboard.' }
  ],
  moral: 'Grief and love sometimes ask the same thing of us: keep faith with what the person who is gone helped you build.',
  source: 'BCCI Ranji Trophy records for the Delhi–Karnataka match of December 2006 (Kohli, resuming the morning after his father’s death, scored 90 — an episode his Delhi coach and senior teammates have recounted on the record many times); ICC records for the 2008 under-19 World Cup, the 2011 World Cup, and the fiftieth ODI century at Mumbai, November 2023; the fitness transformation of 2012 onwards is his own public telling. He is a living, playing athlete — the story keeps strictly to the documented record.'
},

{
  id: 'kh.mithali',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Dancer at the Crease',
  hook: 'She trained for years to be a bharatanatyam dancer. The stage she filled instead was Lord’s.',
  hero: 'mithali',
  cast: ['mithali'],
  minutes: 4,
  /* IN-TG: deliberate, same as kh.sindhu — Hyderabad is Telangana; the map
     geometry gap (docs/07) means no state lights yet, but the Telugu family
     shelf matches TG today and the code is correct the day the map is fixed. */
  place: ['IN-TG'],
  words_hi: [['नृत्य', 'nritya', 'dance'], ['कप्तान', 'kaptaan', 'captain'], ['धुन', 'dhun', 'absorption']],
  scenes: [
    { art: ['mithali'], who: null,
      hi: 'मिताली राज हैदराबाद में एक वायु सेना परिवार में पली-बढ़ीं, और आठ सालों तक उनकी हर सुबह भरतनाट्यम के नाम रही — घुँघरू, थकने तक साधी जाने वाली मुद्राएँ, और शास्त्रीय नृत्य का कड़ा अनुशासन। क्रिकेट तो ज़िंदगी में यूँ ही अचानक आ गया: उन्हें उनके बड़े भाई के कोचिंग कैंप में साथ ले जाया गया, इंतज़ार करते-करते उन्होंने बल्ला उठा लिया, और कोच लड़कों को देखना भूलकर उन्हें ही देखने लगे।',
      text: 'Mithali Raj grew up in Hyderabad, in an Air Force family, and for eight years her mornings belonged to bharatanatyam — the anklets, the postures held until they burned, the discipline of classical dance. Cricket arrived sideways: she was taken along to her elder brother’s coaching camp, picked up a bat while she waited, and the coaches stopped watching the boys.' },
    { art: ['mithali'], who: null, mood: 'think',
      hi: 'जब वह बारह-तेरह साल की हुईं, तो डांस और क्रिकेट दोनों ही उनकी हर सुबह माँगने लगे, और उन्होंने इस चुनाव का किस्सा कई बार सुनाया है: दोनों एक साथ नहीं चल सकते थे।',
      text: 'By her early teens, both dance and cricket wanted every morning she had, and she has told the story of the choice many times: it could not be both.',
      ask: {
        q: 'Eight years of dance in your feet, a new game in your hands, and one pair of mornings. How do you even choose?',
        options: ['Keep the older love — eight years must not be wasted', 'Choose one — and trust that nothing truly practised is ever wasted', 'Do both badly'],
        answer: 1,
        right: 'She chose cricket — and always said the dance never really left her: the balance, the footwork, the stillness before movement all walked to the crease with her.',
        wrong: 'She chose the game — and here is the lovely part: the dance never really left her. The balance, the footwork, the stillness before movement all walked to the crease with her. Eight years of practice simply changed costumes.'
      } },
    { art: ['mithali'], who: null, mood: 'wow',
      hi: 'सोलह साल की उम्र में, 1999 में, उन्होंने भारत के लिए अपना पहला मैच खेला और शतक बनाया — 114 रन, नाबाद। उन्नीस साल की उम्र में उन्होंने इंग्लैंड के ख़िलाफ़ कई दिनों तक बल्लेबाज़ी की और 214 रन बनाए, जो उस समय महिला टेस्ट क्रिकेट के इतिहास का सबसे बड़ा स्कोर था। गेंदबाज़ बदले, दशक बदले; लेकिन पिच के दूसरे छोर पर बना वह शांत ठहराव कभी नहीं बदला।',
      text: 'At sixteen, in 1999, she played her first match for India and scored a century — 114 not out. At nineteen she batted for days against England and made 214, then the highest score in the history of women’s Test cricket. Bowlers changed, decades changed; the calm at the other end of the pitch did not.' },
    { art: ['mithali'], who: null,
      hi: 'उन्होंने दो अलग-अलग दशकों में भारत की कप्तानी की — 2005 में टीम को वर्ल्ड कप फ़ाइनल तक पहुँचाया, और फिर 2017 में भी। उसी 2017 वर्ल्ड कप में, एक तस्वीर पूरी दुनिया में फैल गई: पैड पहने मिताली, वर्ल्ड कप मैच में बल्लेबाज़ी की अपनी बारी का इंतज़ार करते हुए — चुपचाप एक किताब पढ़ रही थीं। दुनिया को यह बात हैरान कर देने वाली लगी। पर जो उन्हें जानते थे, उनके लिए यह बिल्कुल सटीक था: एक ऐसा मन जिसे बचपन से ही पूरी तरह वहीं टिके रहने की आदत थी, जहाँ वह रहना चाहे।',
      text: 'She captained India across two different decades — leading the team to a World Cup final in 2005, and again in 2017. At that 2017 World Cup, a photograph went around the world: Mithali, padded up, waiting to bat in a World Cup match — quietly reading a book. The world found it astonishing. Anyone who knew her found it exact: a mind trained since childhood to be perfectly where it chooses to be.' },
    { art: ['mithali'], who: null, mood: 'wow',
      hi: '2017 के फ़ाइनल ने लॉर्ड्स के पूरे मैदान को भर दिया — क्रिकेट का मक्का, सारे टिकट बिक चुके थे, वह भी एक महिला मैच के लिए, और पूरे भारत में लाखों लोग इसे देख रहे थे। इंग्लैंड नौ रनों से जीता, पर इसके बाद जो हुआ, उसके आगे इस बात का कोई फ़र्क नहीं पड़ा: लड़कियों की अकादमियाँ भरने लगीं, खिलाड़ियों को कॉन्ट्रैक्ट मिले, और भारत में महिला क्रिकेट को अब किसी से तवज्जो माँगने की ज़रूरत नहीं रही, क्योंकि वह उसे मिल चुकी थी। जब मिताली 2022 में रिटायर हुईं, तो उनके 10,868 अंतरराष्ट्रीय रन महिला क्रिकेट में किसी भी देश के, किसी भी खिलाड़ी द्वारा बनाए गए सबसे ज़्यादा रन थे।',
      text: 'The 2017 final filled Lord’s — the home of cricket, sold out, for a women’s match, with millions more watching across India. England won by nine runs, and it barely mattered to what happened next: girls’ academies filled, the players won contracts, and women’s cricket in India stopped asking for attention because it finally had it. When Mithali retired in 2022, her 10,868 international runs were the most ever scored in women’s cricket, by anyone, from any country.' },
    { art: ['mithali'], who: 'mithu',
      hi: 'दो दशकों तक कप्तानी, दुनिया में सबसे ज़्यादा रनों का रिकॉर्ड, और गोद में खुली एक किताब जबकि बाहर वर्ल्ड कप इंतज़ार कर रहा था। डांस टीचर ने एक डांसर ज़रूर खोई, पर डांस ने कुछ नहीं खोया — वह बस एक नए मंच पर पहुँच गया था।',
      text: 'Two decades a captain, the world’s runs record, and a book open on her lap while a World Cup waited. The dance teacher lost a dancer and the dance lost nothing — it just moved to a different stage.' }
  ],
  moral: 'What you practise first is never wasted — discipline changes costumes and walks with you wherever you go next.',
  source: 'ICC and BCCI records: her debut century at sixteen (114 not out, 1999), the Test 214 against England in 2002, the World Cup finals of 2005 and 2017 (the sold-out Lord’s final), and 10,868 international runs — the most in women’s cricket at her retirement in 2022; the bharatanatyam years and the choice between dance and cricket are her own oft-recorded telling, and the 2017 book-reading photograph is a matter of record.'
},

{
  id: 'kh.saina',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The First Shuttle Through the Door',
  hook: 'Before her, no Indian had ever won an Olympic badminton medal — not one, in the whole history of the Games. She was eight when her family bet everything on changing that.',
  hero: 'saina',
  cast: ['saina'],
  minutes: 4,
  place: ['IN-HR'],
  words_hi: [['पदक', 'padak', 'medal'], ['सवेरा', 'savera', 'daybreak'], ['जुनून', 'junoon', 'passion']],
  scenes: [
    { art: ['saina'], who: null,
      hi: 'साइना नेहवाल का जन्म 1990 में हरियाणा के हिसार में हुआ था — कुश्ती का इलाक़ा, गेहूँ का इलाक़ा, बैडमिंटन का इलाक़ा तो बिल्कुल नहीं। लेकिन उनकी माँ राज्य स्तर की बैडमिंटन खिलाड़ी रह चुकी थीं, जिनका अपना खेल जल्दी ही छूट गया था, जैसा उन दिनों ज़्यादातर महिलाओं के खेलों के साथ होता था। और उस घर ने उस अधूरे सपने को वैसे ही सँभाल कर रखा जैसे घर रखा करते हैं: चुपचाप, और पूरी तरह से।',
      text: 'Saina Nehwal was born in 1990 in Hisar, in Haryana — wrestling country, wheat country, not badminton country. But her mother had been a state-level badminton player whose own game had stopped early, the way women’s games mostly did in those days, and the house held that unfinished dream the way houses do: quietly, and completely.' },
    { art: ['saina'], who: null,
      hi: '"जब साइना आठ साल की थीं, तब उनके वैज्ञानिक पिता के काम की वजह से उनका परिवार हैदराबाद आ गया — और हैदराबाद में तो असली बैडमिंटन था। एकेडमी शहर के दूसरे छोर पर थी, इसलिए उनके पिताजी उन्हें भोर होने से पहले ही जगा देते और रोज़ सुबह अपने स्कूटर पर बैठाकर मीलों दूर ले जाते, फिर प्रैक्टिस ख़त्म होने तक इंतज़ार करके वापस ले आते। अगर भोर की ये सवारियाँ जानी-पहचानी लग रही हैं, तो लगनी भी चाहिए: सालों बाद हैदराबाद की ही एक और लड़की, पी. वी. सिंधु, बैडमिंटन की इसी दुनिया तक पहुँचने के लिए ऐसी ही सुबहें जीने वाली थीं — उनकी कहानी अलमारी में ठीक इसी कहानी के ऊपर रखी है।"',
      text: 'When Saina was eight, her scientist father’s work moved the family to Hyderabad — and Hyderabad had real badminton. The academy was on the far side of the city, so her father woke her before daybreak and rode her there on his scooter, tens of kilometres, morning after morning, then waited through practice to ride her back. If those dawn rides sound familiar, they should: years later another Hyderabad girl, P. V. Sindhu, would live the same mornings on the way to the same badminton world — her story sits just above this one on the shelf.' },
    { art: ['saina'], who: null, mood: 'wow',
      hi: '"सुबह-सुबह की यह मेहनत रंग लाने लगी। 2008 में वह जूनियर वर्ल्ड चैंपियन बनीं — ऐसा करने वाली पहली भारतीय खिलाड़ी। 2009 में उन्होंने इंडोनेशिया ओपन जीता, जो इस खेल के सबसे बड़े ख़िताबों में से एक था, और वह भी दुनिया में बैडमिंटन की सबसे ज़ोरदार भीड़ के सामने — एक बार फिर, इतना बड़ा ख़िताब जीतने वाली पहली भारतीय महिला। हिसार की वह लड़की अब सिर्फ़ उभरती हुई खिलाड़ी नहीं थी। वह अपनी मंज़िल पर पहुँच चुकी थीं।"',
      text: 'The mornings compounded. In 2008 she became junior world champion — the first Indian ever. In 2009 she won the Indonesia Open, one of the sport’s biggest crowns, in front of the loudest badminton crowd on Earth — again the first Indian woman to take a title that size. The girl from Hisar was no longer coming up. She had arrived.' },
    { art: ['saina'], who: null, mood: 'wow',
      hi: '"लंदन, 2012। ओलिंपिक खेलों के सौ से भी ज़्यादा सालों के इतिहास में भारत ने बैडमिंटन में कुछ नहीं जीता था। साइना लड़ते हुए कांस्य पदक तक पहुँचीं — भारतीय इतिहास में बैडमिंटन का पहला ओलिंपिक पदक। यह पहला पदक एक अजीब ही तरह का पदक होता है: इसका वज़न बाकी सभी कांस्य पदकों जितना ही होता है, पर इसके साथ वह सब कुछ भी जुड़ा होता है जिसे पहले नामुमकिन कहा जाता था।"',
      text: 'London, 2012. In more than a century of Olympic Games, India had won badminton nothing. Saina fought her way to the bronze medal — the first Olympic badminton medal in Indian history. It is a strange kind of medal, a first: it weighs what every other bronze weighs, and also carries everything that was previously called impossible.' },
    { art: ['saina'], who: null,
      hi: '"अप्रैल 2015 में वह दुनिया की नंबर एक खिलाड़ी बनीं — बैडमिंटन की विश्व रैंकिंग में पहले पायदान पर पहुँचने वाली पहली भारतीय महिला। और अब ज़रा देखिए कि उनके पीछे-पीछे क्या कुछ हुआ: सिंधु का रजत पदक और वर्ल्ड टाइटल उसी दरवाज़े से होकर आए, जिसे देश ने साइना को धक्का देकर खोलते देखा था। चैंपियन नतीजे देते हैं; मगर पहले चैंपियन भरोसा देते हैं।"',
      text: 'In April 2015 she reached the top of the world rankings — the first Indian woman ever ranked world number one in badminton. And look at what stands behind her now: Sindhu’s silver and world title came through a door the country had watched Saina hit open. Champions make results; first champions make belief.' },
    { art: ['saina'], who: 'mithu',
      hi: '"माँ का अधूरा खेल, अंधेरे में पिता का स्कूटर, और कुश्ती के इलाके से आई एक लड़की जिसने ठान लिया था कि बैडमिंटन उसी का है। पहली बार कुछ करना भारी होता है — किसी न किसी को यह साबित करने का भार उठाना ही पड़ता है कि कोई काम मुमकिन है, और उन्होंने यह भार अपने बाद आने वाले हर इंसान के लिए उठा लिया।"',
      text: 'A mother’s unfinished game, a father’s scooter in the dark, and a girl from wrestling country who decided badminton belonged to her. Firsts are heavy — someone has to lift the proof that a thing can be done, and she lifted it for everyone after her.' }
  ],
  moral: 'The first one through pays for the door — and everyone who walks through afterwards walks through her win.',
  source: 'BWF and Olympic records: world junior gold 2008, the Indonesia Open title of 2009, the London 2012 bronze — the first Olympic badminton medal for India — and the world No. 1 ranking of April 2015; her autobiography "Playing to Win" and documented profiles for the Hisar beginnings, her mother’s state-level badminton years, and the dawn scooter rides to the Hyderabad academy.'
},

{
  id: 'kh.malleswari',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'Iron in the Village',
  hook: 'The gym had a mud floor and a thatched roof. Its student became the first Indian woman ever to stand on an Olympic podium.',
  hero: 'malleswari',
  cast: ['malleswari'],
  minutes: 4,
  place: ['IN-AP'],
  words_hi: [['लोहा', 'loha', 'iron'], ['ताक़त', 'taaqat', 'strength'], ['पहली', 'pahli', 'first']],
  scenes: [
    { art: ['malleswari'], who: null,
      hi: '"वूसावानीपेटा, आंध्र के समुद्र तट पर श्रीकाकुलम ज़िले का एक गाँव है, और 1980 के दशक में वहाँ कुछ अनोखा था: मिट्टी के फ़र्श वाला एक छोटा-सा जिम जहाँ एक स्थानीय कोच लोहे का खेल सिखाते थे — यानी वेटलिफ़्टिंग। कर्णम मल्लेश्वरी अपनी बहनों के पीछे-पीछे बारह साल की उम्र में वहाँ आईं; उनका घर वज़न उठाने वाली लड़कियों का घर बन गया, एक ऐसे देश में जहाँ ऐसे किसी घर की कल्पना भी शायद ही किसी ने की थी।"',
      text: 'Voosavanipeta is a village in Srikakulam district, on the Andhra coast, and in the 1980s it held something unusual: a little gymnasium with a mud floor where a local coach taught the iron game — weightlifting. Karnam Malleswari came to it at twelve, following her sisters; theirs became a household of girls who lifted, in a country that had barely imagined such a household.' },
    { art: ['malleswari'], who: null, mood: 'think',
      hi: '"लोग वेटलिफ़्टिंग को सिर्फ़ ताक़त का खेल समझते हैं। पर यह तो सौ किलो वज़न के साथ घड़ीसाज़ी करने जैसा बारीक काम है। दोनों लिफ़्ट — स्नैच, यानी ज़मीन से आसमान तक एक सधा हुआ झटका, और क्लीन एंड जर्क, ज़मीन से कंधों तक और फिर आसमान तक — बारीकी, सही समय और हिम्मत की परीक्षा हैं, जहाँ एक सेंटीमीटर की चूक भी पूरी दुनिया को आप पर गिरा सकती है। ताक़त आपको कमरे के अंदर लाती है। हुनर आपको जिताता है।"',
      text: 'People picture weightlifting as brute force. It is closer to watchmaking done with a hundred kilograms. The two lifts — the snatch, one clean movement from floor to sky, and the clean and jerk, floor to shoulders to sky — are exercises in precision, timing and nerve, where a centimetre of error drops the world on you. Strength gets you into the room. Craft wins.' },
    { art: ['malleswari'], who: null, mood: 'wow',
      hi: '"मल्लेश्वरी का हुनर उन्हें गाँव के जिम से निकालकर दुनिया के मंच पर ले गया — और 1994 में, इस्तांबुल में, वे विश्व चैंपियन बनीं। 1995 में उन्होंने यह कारनामा फिर कर दिखाया। श्रीकाकुलम ज़िले की एक महिला, लोहे के इस खेल में दो बार विश्व चैंपियन बनीं, वह भी तब जब भारत के ज़्यादातर लोगों ने कभी महिलाओं की वेटलिफ़्टिंग प्रतियोगिता देखी तक नहीं थी।"',
      text: 'Malleswari’s craft took her out of the village gym and onto the world stage — and in 1994, in Istanbul, she became champion of the world. In 1995 she did it again. A woman from Srikakulam district, twice world champion in the iron game, years before most of India had ever watched a women’s weightlifting competition.' },
    { art: ['malleswari'], who: null, mood: 'wow',
      hi: '"सिडनी, सितंबर 2000: वे पहले ओलंपिक खेल जिनमें महिलाओं की वेटलिफ़्टिंग को शामिल किया गया था। मल्लेश्वरी ने स्नैच में 110 किलोग्राम और क्लीन एंड जर्क में 130 किलोग्राम — कुल 240 किलोग्राम — वज़न उठाया और कांस्य पदक जीता। अगला वाक्य ज़रा ठहरकर पढ़िए, क्योंकि पूरी-पूरी पीढ़ियों ने इसका इंतज़ार किया था: आधुनिक ओलंपिक के सौ से भी ज़्यादा सालों में, किसी भी भारतीय महिला ने किसी भी खेल में, किसी भी रंग का पदक नहीं जीता था। वे पहली थीं।"',
      text: 'Sydney, September 2000: the first Olympic Games ever to include women’s weightlifting. Malleswari lifted 110 kilograms in the snatch and 130 in the clean and jerk — 240 in all — and won bronze. Read the next sentence slowly, because whole generations waited for it: in more than a hundred years of the modern Olympics, no Indian woman had ever won a medal of any colour, in any sport. She was the first.' },
    { art: ['malleswari'], who: null,
      hi: '"अब इस ताक़ पर नज़र डालकर देखिए कि उनके बाद कौन-कौन आया: मैरी कॉम का कांस्य, साइना का कांस्य, सिंधु का रजत, मीराबाई का रजत, अवनि के स्वर्ण पदक। इनमें से हर एक चैंपियन उस मंच पर पहुँची, जहाँ भारतीय महिलाओं के लिए सबसे पहले मल्लेश्वरी पहुँची थीं। पहला पदक सचमुच यही सौग़ात लाता है — रिकॉर्ड की किताबों में सिर्फ़ एक जगह नहीं, बल्कि पूरे देश की बेटियों के लिए मंज़ूरी की एक पर्ची।"',
      text: 'Now look around this shelf at who came after: Mary Kom’s bronze, Saina’s bronze, Sindhu’s silver, Mirabai’s silver, Avani’s golds. Every one of those champions stepped onto a podium that, for Indian women, Malleswari reached first. That is what a first medal actually buys — not one place in the record books, but a permission slip for a whole country’s daughters.' },
    { art: ['malleswari'], who: 'mithu',
      hi: '"मिट्टी के फ़र्श वाला एक जिम, वज़न उठाने वाली बहनों का परिवार, और सिडनी में 240 किलोग्राम। रॉड का वज़न तो हर किसी के लिए एक जैसा ही होता है — उनके वज़न पर इतिहास का अतिरिक्त भार था, और उन्होंने उसे भी उठा लिया।"',
      text: 'A mud-floored gym, a household of lifting sisters, and 240 kilograms in Sydney. The barbell weighs the same for everyone — history was the extra weight on hers, and she lifted that too.' }
  ],
  moral: 'The barbell weighs the same for everyone. Being first is the extra weight — and someone has to lift it before anyone else can.',
  source: 'IWF and Olympic records: world championship golds in 1994 (Istanbul) and 1995, and the Sydney 2000 bronze (110 kg snatch, 130 kg clean and jerk, 240 kg total) — the first Olympic medal won by an Indian woman, at the first Games to include women’s weightlifting; her documented beginnings, from age twelve, in a village gymnasium in Srikakulam district, Andhra Pradesh.'
},

{
  id: 'kh.mirabai',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'khel',
  badge: 'itihaas',
  title: 'The Girl Who Carried the Firewood',
  hook: 'Her elder brother could not lift the bundle, so his little sister carried it home. The village noticed. Eventually, the whole world did.',
  hero: 'mirabai',
  cast: ['mirabai'],
  minutes: 4,
  place: ['IN-MN'],
  words_hi: [['लकड़ी', 'lakdi', 'firewood'], ['बोझ', 'bojh', 'load'], ['चाँदी', 'chaandi', 'silver']],
  scenes: [
    { art: ['mirabai'], who: null,
      hi: '"नोंगपोक काकचिंग मणिपुर की पहाड़ियों में बसा एक गाँव है, इंफ़ाल से उबड़-खाबड़ रास्तों का एक घंटे का सफ़र, और गाँव के ज़्यादातर बच्चों की तरह सैखोम मीराबाई चानू भी घर के काम करते हुए बड़ी हुईं — जिनमें से एक काम था, पहाड़ी ढलानों से जलाने की लकड़ियाँ लाना। उनके परिवार को यह बताना बहुत पसंद है कि जब वे क़रीब बारह साल की थीं तब क्या हुआ था: उनके बड़े भाई से लकड़ियों का भारी गट्ठर नहीं संभल रहा था, और मीराबाई ने उसे आसानी से उठा लिया और घर ले आईं, मानो पहाड़ से ही यह समझने में भूल हो गई हो कि ताक़तवर कौन था।"',
      text: 'Nongpok Kakching is a village in the hills of Manipur, a bumpy hour from Imphal, and like most village children Saikhom Mirabai Chanu grew up doing chores — among them, fetching firewood from the hillsides. Her family loves telling what happened when she was about twelve: her elder brother could not manage a heavy bundle, and Mirabai picked it up and carried it home, easily, as if the hill had made a mistake about who was strong.' },
    { art: ['mirabai'], who: null,
      hi: '"वह तीरंदाज़ बनना चाहती थी। लेकिन मणिपुर एक ऐसा राज्य है जहाँ चैंपियन वैसे पैदा होते हैं जैसे दूसरी जगहों पर चावल — इस शेल्फ़ पर रखी मैरी कॉम की कहानी भी इन्हीं पहाड़ियों से शुरू होती है — और वहाँ की सबसे महान वेटलिफ़्टर, कुंजारानी देवी, हर मणिपुरी घर में एक मिसाल थीं। मीराबाई ने बारबेल को चुना, और जैसे भी मुमकिन हुआ इम्फाल ट्रेनिंग के लिए पहुँचती रहीं — अक्सर अपने गाँव के पास से गुज़रने वाले रेत के ट्रकों को हाथ देकर रुकवातीं, और ड्राइवरों के साथ केबिन में बैठकर प्रैक्टिस के लिए जातीं।"',
      text: 'She had wanted to be an archer. But Manipur is a state that produces champions the way other places produce rice — Mary Kom’s story on this shelf begins in these same hills — and its greatest weightlifter, Kunjarani Devi, was a legend in every Manipuri household. Mirabai chose the barbell, and got herself to training in Imphal however she could — often by waving down the sand trucks that ran past her village, riding to practice in the cab with the drivers.' },
    { art: ['mirabai'], who: null, mood: 'sad',
      hi: '"रियो, 2016: उसका पहला ओलंपिक, इक्कीस साल की उम्र, पहली बार उसे देखता हुआ पूरा देश — और फिर भारी तबाही। क्लीन एंड जर्क में वह तीनों कोशिशों में नाकाम रही। कोई कुल स्कोर नहीं, कोई नतीजा नहीं; उसके नाम के आगे रिकॉर्ड में वही अक्षर लिखे थे जिनसे हर लिफ़्टर डरता है। वह कैमरों के सामने रो पड़ी, और कैमरों ने अपनी नज़र नहीं हटाई।"',
      text: 'Rio, 2016: her first Olympics, twenty-one years old, a nation newly watching — and disaster. In the clean and jerk she failed all three attempts. No total, no result; beside her name the record shows the letters that lifters dread. She wept in front of the cameras, and the cameras did not look away.',
      ask: {
        q: 'The worst day of your life has just happened in front of the whole world. What does the next morning look like?',
        options: ['You quit — the message could not be clearer', 'You go back to training, and let the worst day become information instead of an ending', 'You pretend it never happened'],
        answer: 1,
        right: 'That is the morning she chose. She and her coaches took the failure apart like engineers — what broke, when, why — and rebuilt her lifting around the answers.',
        wrong: 'Plenty of athletes have chosen exactly that, and nobody could blame them. Mirabai went back to training — and let the worst day become information: she and her coaches took the failure apart like engineers and rebuilt her lifting around the answers.'
      } },
    { art: ['mirabai'], who: null, mood: 'wow',
      hi: '"रियो के एक साल बाद, अमेरिका में 2017 की वर्ल्ड चैंपियनशिप में, मीराबाई चानू दुनिया की चैंपियन बनीं। और टोक्यो में, 24 जुलाई 2021 को — देर से हुए ओलंपिक की पहली ही सुबह — उन्होंने स्नैच में 87 किलोग्राम और क्लीन एंड जर्क में 115 किलोग्राम उठाया, कुल 202 किलोग्राम, और सिल्वर मेडल जीता: उन खेलों में भारत का पहला मेडल, पहले ही दिन, उस लड़की की तरफ़ से जिसके खेल पाँच साल पहले आँसुओं में खत्म हुए थे।"',
      text: 'One year after Rio, at the 2017 world championships in America, Mirabai Chanu was champion of the world. And in Tokyo, on 24 July 2021 — the first morning of the delayed Olympics — she lifted 87 kilograms in the snatch and 115 in the clean and jerk, 202 in all, and won silver: India’s first medal of those Games, on their first day, from the girl whose Games five years earlier had ended in tears.' },
    { art: ['mirabai'], who: null,
      hi: '"मणिपुर वापस लौटकर उन्होंने कुछ ऐसा किया जिसकी परवाह आम तौर पर रिकॉर्ड की किताबें नहीं करतीं, लेकिन यह शेल्फ़ करता है: उन्होंने रेत के ट्रक चलाने वाले उन ड्राइवरों को ढूँढ निकाला जो इतने सालों तक गाँव की एक लड़की को प्रैक्टिस के लिए ले जाते रहे थे, और अपने गाँव में तोहफ़ों और दावत के साथ उनका शुक्रिया अदा किया। चैंपियन ट्रेनिंग से बनते हैं। वे उन सभी लोगों से भी बनते हैं जिन्होंने उन्हें आगे बढ़ने का सहारा दिया।"',
      text: 'Back home in Manipur she did something the record books do not usually bother with, but this shelf does: she tracked down the sand-truck drivers who had carried a village girl to practice all those years, and thanked them with gifts and a feast in her village. Champions are made of training. They are also made of everyone who gave them a lift.' },
    { art: ['mirabai'], who: 'mithu',
      hi: '"जलाऊ लकड़ियों का एक गट्ठर, ट्रक का केबिन, ज़िंदगी का सबसे बुरा दिन, और फिर टोक्यो में सिल्वर। ताक़त वह है जो आप उठा सकते हैं। किरदार वह है जो आप अपने सबसे बुरे दिन से सीखकर साथ लेकर निकलते हैं — और वह अपने किरदार के दम पर फिर से सबसे ऊपर तक पहुँचीं।"',
      text: 'A firewood bundle, a truck cab, the worst day of her life, and then silver in Tokyo. Strength is what you can lift. Character is what you carry away from your worst day — and she carried hers all the way back up.' }
  ],
  moral: 'Strength is what you can lift; character is what you carry away from your worst day and back into training.',
  source: 'IWF and Olympic records: the Rio 2016 did-not-finish, the 2017 world championship gold at Anaheim, and the Tokyo silver of 24 July 2021 (87 kg snatch, 115 kg clean and jerk, 202 kg total — India’s first medal of those Games); the firewood story of Nongpok Kakching, the sand-truck rides to Imphal and the thank-you feast for the drivers are her own and her family’s documented tellings, widely reported.'
},

/* ========================================================== NAYA ========== */
{
  id: 'ny.kurien',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'The Milkman of India',
  hook: 'He did not want the job, the town was dusty, and he counted the days until he could leave. He stayed fifty years and changed breakfast for a billion people.',
  hero: 'kurien',
  cast: ['kurien'],
  minutes: 5,
  place: ['IN-GJ'],
  words_hi: [['दूध', 'doodh', 'milk'], ['किसान', 'kisaan', 'farmer'], ['साथ', 'saath', 'together']],
  scenes: [
    { art: ['kurien'], who: null,
      hi: '1949 की बात है, केरल के कोझिकोड के रहने वाले वर्गीज़ कुरियन नाम के एक युवा इंजीनियर को सरकार ने गुजरात के आणंद नाम के एक छोटे, धूल भरे शहर में एक डेयरी में काम करने का आदेश दिया। उन्होंने धातु विज्ञान की पढ़ाई की थी — यानी धातुओं की, दूध की नहीं। वे वहाँ जाना नहीं चाहते थे, वहाँ पहुँचे तो उन्हें बिल्कुल अच्छा नहीं लगा, और उन्होंने तय कर लिया था कि जैसे ही उनका बॉन्ड पूरा होगा, वे उसी पल वहाँ से निकल जाएँगे। यह बात याद रखिएगा, क्योंकि इसी वजह से आगे जो हुआ, वह और भी मज़ेदार लगता है।',
      text: 'In 1949 a young engineer named Verghese Kurien, from Kozhikode in Kerala, was ordered by the government to a small dusty town in Gujarat called Anand, to work at a creamery. He had studied metallurgy — metals, not milk. He did not want to go, he did not like it when he got there, and he planned to leave the moment his bond was done. Remember that, because it makes what happened next funnier.' },
    { art: ['kurien'], who: null, mood: 'sad',
      hi: 'आणंद में उन्होंने देखा कि किसानों का भारी शोषण हो रहा था। किसान तड़के सूरज निकलने से पहले उठते, अपनी भैंसों का दूध दुहते, और बिचौलियों को औने-पौने दामों पर दूध बेचने के लिए मजबूर थे — अक्सर ना के बराबर पैसे मिलते, जबकि वही दूध बॉम्बे में कई गुना ज़्यादा दाम पर बेचा जाता था। त्रिभुवनदास पटेल नाम के एक शांत स्थानीय नेता की अगुआई में किसानों ने एक सहकारी संस्था (कोऑपरेटिव) शुरू की थी: एक ऐसी डेयरी, जिसके मालिक किसान ख़ुद थे।',
      text: 'In Anand he found farmers who were being squeezed. They rose before dawn, milked their buffaloes, and had no choice but to sell to middlemen for whatever was offered — often next to nothing, while the milk was sold on in Bombay for many times more. The farmers, led by a quiet local organiser named Tribhuvandas Patel, had started a cooperative: a dairy owned by the farmers themselves.',
      ask: {
        q: 'A cooperative means the farmers own the dairy together — every member, however small. Why would that change everything?',
        options: ['It would not — owners are owners', 'Because the profit from the milk now goes back to the people who milked at dawn, not to a middleman', 'Because cooperatives get better buffaloes'],
        answer: 1,
        right: 'That is the whole engine. Same buffaloes, same dawn, same milk — but now the money flows back to the village. Everything Amul became is that one idea, scaled up.',
        wrong: 'The buffaloes and the dawn stayed exactly the same. What changed is where the money went: back to the people who milked, not to a middleman. Everything Amul became is that one idea, scaled up.'
      } },
    { art: ['kurien'], who: null,
      hi: 'जो इंजीनियर वहाँ से भागना चाहता था, उसने पाया कि वह किसानों की मदद किए बिना रह ही नहीं पा रहा है। मशीनों को मरम्मत की ज़रूरत थी; उन्होंने ठीक कर दीं। डेयरी बनानी थी; उन्होंने बना दी। उनका बॉन्ड ख़त्म हो गया, और — जैसा कि उन्होंने ख़ुद अपनी आत्मकथा में हँसते हुए माना था, उन्हें ख़ुद भी ताज्जुब हुआ — वे वहीं रुक गए। किसानों की इस डेयरी को एक नया नाम मिला: अमूल, एक ऐसे शब्द से निकला जिसका मतलब होता है अनमोल।',
      text: 'The engineer who wanted to leave found he could not stop helping. The machines needed fixing; he fixed them. The dairy needed building; he built it. His bond ended, and — to his own lasting surprise, as he cheerfully admitted in his memoir — he stayed. The farmers’ dairy took a brand name: Amul, from a word meaning priceless.' },
    { art: ['kurien'], who: null, mood: 'wow',
      hi: 'फिर सामने आई एक ऐसी मुश्किल, जिसे जानकारों ने नामुमकिन कह दिया था। तब तक दूध का पाउडर सिर्फ़ गाय के दूध से ही बनता था, और आणंद में दूध भैंसों का होता था। दुनिया भर के डेयरी विशेषज्ञों का कहना था कि भैंस के दूध से पाउडर बन ही नहीं सकता। कुरियन और उनके साथी एच. एम. दलाया ने इसे फिर भी कर दिखाया — दुनिया में पहली बार भैंस के दूध का पाउडर बना — और देखते ही देखते दूध की वह बाढ़, जो कभी गर्मी में ख़राब हो जाती थी, अब सँभाली जा सकती थी, एक जगह से दूसरी जगह भेजी जा सकती थी और बेची जा सकती थी। जो नामुमकिन लग रहा था, वह बस पहले कभी किया नहीं गया था।',
      text: 'Then came a problem the experts called impossible. Milk powder had only ever been made from cow’s milk, and Anand’s milk came from buffaloes. The world’s dairy authorities said it could not be done. Kurien and his colleague H. M. Dalaya did it anyway — the first buffalo-milk powder anywhere — and suddenly the flood of milk that once spoiled in the heat could be stored, moved and sold. The impossible turned out to be merely undone.' },
    { art: ['kurien'], who: null, mood: 'wow',
      hi: 'सरकार ने उनसे आणंद के इस विचार को पूरे देश में ले जाने को कहा, और यह कार्यक्रम — \'ऑपरेशन फ़्लड\' — दुनिया का सबसे बड़ा डेयरी विकास अभियान बन गया। गाँव-गाँव, राज्य-राज्य, लाखों किसान परिवार अपनी ख़ुद की मिल्क कोऑपरेटिव से जुड़ते चले गए। और 1998 में आँकड़ों में एक लगभग अविश्वसनीय बात सामने आई: भारत, जो कभी बाहर से दूध मँगवाता था, अब धरती के किसी भी देश से ज़्यादा दूध पैदा कर रहा था।',
      text: 'The government asked him to take the Anand idea to the whole country, and the programme — Operation Flood — became the largest dairy development the world had ever seen. Village by village, state by state, millions of farming families joined cooperatives they owned themselves. And in 1998 the almost unbelievable line appeared in the statistics: India, which had once imported milk, now produced more of it than any country on Earth.' },
    { art: ['kurien'], who: 'mithu',
      hi: 'भारत छब्बीस नवंबर को राष्ट्रीय दुग्ध दिवस मनाता है — जो कुरियन जी का जन्मदिन है। अगली बार जब आपके सामने किसी गरमा-गरम चीज़ पर मक्खन पिघले, तो याद कीजिएगा: वह इंजीनियर जो चले जाना चाहता था, वह किसान जिसने सबको एकजुट किया, और वे लाखों परिवार जो मिलकर डेयरी के मालिक बने। अमूल के पैकेट पर आँख मारती वह नन्हीं बच्ची किसी असली और सच्ची बात पर ही मुस्कुरा रही है।',
      text: 'India keeps National Milk Day on the twenty-sixth of November — Kurien’s birthday. Next time butter melts on something hot in front of you, remember: an engineer who wanted to leave, a farmer who organised, and millions of families who owned the dairy together. The girl on the Amul wrapper is winking about something real.' }
  ],
  moral: 'He came for eight months and stayed fifty years — because the best work is rarely the job you planned, and owning something together can lift a million families at once.',
  source: 'Verghese Kurien’s memoir "I Too Had a Dream" — the reluctant posting to Anand, Tribhuvandas Patel and the Kaira cooperative, Dalaya’s buffalo-milk powder, Operation Flood; Amul/GCMMF and National Dairy Development Board histories; India’s rise to world’s largest milk producer (1998) from FAO figures. National Milk Day, 26 November, is his birth anniversary.'
},

{
  id: 'ny.infosys',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'Ten Thousand Rupees and Seven Engineers',
  hook: 'The company that showed the world Indian software began with a wife’s savings and no computer at all.',
  hero: 'n_murthy',
  cast: ['n_murthy', 'sudha_murty'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['बचत', 'bachat', 'savings'], ['विश्वास', 'vishvaas', 'trust'], ['काम', 'kaam', 'work']],
  scenes: [
    { art: ['n_murthy', 'sudha_murty'], who: null,
      hi: '1981 की बात है, एन. आर. नारायण मूर्ति नाम के एक शांत स्वभाव वाले इंजीनियर एक सॉफ़्टवेयर कंपनी शुरू करना चाहते थे — और वो भी उस भारत में, जहाँ इस बात का कोई मतलब ही नहीं बनता था। तब कंप्यूटर बहुत कम हुआ करते थे, बाहर से मँगवाने में सालों लग जाते थे, और सॉफ़्टवेयर तो बस दूर-दराज के देशों का काम माना जाता था। उनके साथ इस सफ़र में कूदने के लिए छह साथी तैयार थे, और पैसे लगभग न के बराबर थे। शुरुआत के दस हज़ार रुपये ज़्यादातर उनकी पत्नी सुधा मूर्ति की बचत से आए — जो ख़ुद भी एक इंजीनियर थीं, और जिन्होंने अपने पति के इस नामुमकिन से सपने पर अपनी गाढ़ी कमाई लगा दी।',
      text: 'In 1981, a soft-spoken engineer named N. R. Narayana Murthy wanted to start a software company — in an India where that sentence barely made sense. Computers were rare, imports took forever, and software was something faraway countries did. He had six colleagues willing to jump with him, and almost no money. The starting capital, ten thousand rupees, came mostly from the savings of his wife, Sudha Murty — an engineer herself, who bet her rainy-day fund on her husband’s improbable idea.' },
    { art: ['n_murthy'], who: null, mood: 'think',
      hi: 'कंपनी का नाम रखा गया इंफ़ोसिस। उसका पहला दफ़्तर था एक घर का सामने वाला कमरा। और सोचने वाली बात तो यह है: एक ऐसी सॉफ़्टवेयर कंपनी, जिसके पास काफ़ी समय तक अपना एक कंप्यूटर तक नहीं था — क्योंकि उन दिनों बाहर से कंप्यूटर मँगवाने के काग़ज़ी काम में ही बरसों बीत जाते थे। वे दूसरों के कंप्यूटरों पर ग्राहकों का काम करते, इंतज़ार करते, और आगे बढ़ते रहते। लगभग दो साल बाद जब उनका अपना पहला कंप्यूटर आया, तो उसका स्वागत ठीक वैसे ही किया गया जैसे घर में किसी नए बच्चे के आने पर होता है।',
      text: 'The company was called Infosys. Its first office was the front room of a house. And here is a detail to sit with: a software company that could not, for a long time, even get a computer — the paperwork to import one took years in those days. They wrote work for clients on other people’s machines, and waited, and kept going. The first computer of their own arrived about two years in, and was received roughly the way families receive a new baby.' },
    { art: ['n_murthy'], who: null,
      hi: 'वे असल में मशीनें नहीं बेच रहे थे। वे बेच रहे थे एक वादा: कि भारत में बैठी एक टीम दुनिया की सबसे बड़ी कंपनियों के लिए सॉफ़्टवेयर बना सकती है, उसे सही समय पर पहुँचा सकती है, और उस पर आँख मूँदकर भरोसा किया जा सकता है। भरोसा बनने में वक्त लगता है और टूटने में एक पल, और उन्होंने एक-एक काम और सब्र भरे एक-एक साल के साथ उस भरोसे को बनाया।',
      text: 'What they were selling, in the end, was not machines. It was a promise: that a team in India could write software for the biggest companies in the world, deliver it on time, and be trusted absolutely. Trust is slow to build and quick to lose, and they built it order by order, year after patient year.' },
    { art: ['n_murthy'], who: null, mood: 'wow',
      hi: 'यह काम किसी की भी उम्मीद से कहीं बेहतर साबित हुआ। सात इंजीनियरों से शुरू होकर इंफ़ोसिस दुनिया की सबसे बड़ी सॉफ़्टवेयर कंपनियों में से एक बन गई। बेंगलुरु में उसका हरा-भरा परिसर — घास के मैदान, शीशे की इमारतें, हज़ारों युवा इंजीनियर — एक ऐसी जगह बन गया जिसे बाहर के देशों से आने वाले नेता ख़ास तौर पर देखने की माँग करते थे, क्योंकि वह उस भविष्य जैसा दिखता था जो भारत ने अपने हाथों से बनाया था।',
      text: 'It worked beyond anybody’s sensible guess. Infosys grew from seven engineers into one of the great software companies of the world. Its green campus in Bengaluru — lawns, glass, thousands of young engineers — became a place visiting leaders from other countries actually asked to see, because it looked like a future India had built for itself.' },
    { art: ['n_murthy', 'sudha_murty'], who: null,
      hi: 'और एक बात और, जो अपने आप में एक शांत क्रांति थी: संस्थापकों ने कंपनी की हिस्सेदारी अपने कर्मचारियों के साथ बाँटी, यहाँ तक कि ड्राइवरों और दफ़्तर के कर्मचारियों के साथ भी, और वह भी तब जब ऐसा करने का कोई चलन नहीं था। जब इंफ़ोसिस को कामयाबी मिली, तो वह कामयाबी हज़ारों आम घरों तक पहुँची — और मूर्ति जी हमेशा यही मानते थे कि कुछ भी बड़ा बनाने का असली मक़सद यही होता है।',
      text: 'And one more thing, quietly revolutionary: the founders shared ownership of the company with its employees, down to drivers and office staff, long before that was fashionable. When Infosys succeeded, the success spread through thousands of ordinary households — which was, Murthy always argued, the whole point of building anything.' },
    { art: ['n_murthy'], who: 'mithu',
      hi: 'दस हज़ार रुपये, जो बचत के एक डिब्बे से लिए गए थे। कुछ निवेश पैसों से नापे जाते हैं, और कुछ इस बात से कि एक इंसान दूसरे से कहे: मुझे विश्वास है कि इस सपने को आज़माना सही है — ये रही मेरी सारी जमा-पूँजी।',
      text: 'Ten thousand rupees, borrowed from a savings tin. Some investments are measured in money, and some in one person saying to another: I believe this is worth trying — here is everything I have saved.' }
  ],
  moral: 'Great companies are built the way trust is built: slowly, promise by kept promise — and they are worth most when the winnings are shared.',
  source: 'Infosys’s own published history (founded 1981, seven founders, seed capital ₹10,000, first computer c. 1983, listed 1993) and the founders’ accounts — both Narayana Murthy and Sudha Murty have told the story of her savings funding the start; the employee stock-ownership programme and the visited Bengaluru campus are matters of company record.'
},

{
  id: 'ny.sudha-letter',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'The Postcard to Mr Tata',
  hook: 'The notice said lady candidates need not apply. One engineering student decided the head of the company should hear about it.',
  hero: 'sudha_murty',
  cast: ['sudha_murty'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['चिट्ठी', 'chitthi', 'letter'], ['बराबरी', 'baraabari', 'equality'], ['रास्ता', 'raasta', 'path']],
  scenes: [
    { art: ['sudha_murty'], who: null,
      hi: '1974 में, सुधा कुलकर्णी — जो बाद में सुधा मूर्ति बनीं — बैंगलोर में इंजीनियरिंग की एक होनहार छात्रा थीं। वे अक्सर कक्षा में अकेली महिला होती थीं और हमेशा अपनी क्लास में सबसे आगे रहती थीं। एक दिन नोटिस बोर्ड पर उन्हें टेल्को का एक विज्ञापन दिखा, जो ट्रक बनाने वाली मशहूर टाटा कंपनी थी। बढ़िया नौकरी, अच्छी तनख्वाह और दिलचस्प काम। और सबसे नीचे एक लाइन लिखी थी: महिला उम्मीदवार आवेदन न करें।',
      text: 'In 1974, Sudha Kulkarni — later Sudha Murty — was a star engineering student in Bangalore, usually the only woman in the room and usually at the top of the class. One day on a notice board she saw an advertisement from TELCO, the great Tata company that built trucks. Good job, good pay, interesting work. And at the bottom, one line: lady candidates need not apply.' },
    { art: ['sudha_murty'], who: null, mood: 'think',
      hi: 'इसके बाद जो हुआ, वह उन्होंने कई बार बताया है, और अपनी उस उम्र के गुस्से पर वे हमेशा हँस पड़ती हैं। उनके पास महँगे कागज़-कलम के पैसे नहीं थे, इसलिए उन्होंने एक पोस्टकार्ड उठाया — एक सादा सरकारी पोस्टकार्ड — और सीधे पूरे टाटा समूह के मुखिया, जे. आर. डी. टाटा को लिख भेजा कि टाटा जैसे सम्मानित घराने का सिर्फ़ महिला होने की वजह से उम्मीदवारों के लिए दरवाज़ा बंद करना सरासर नाइंसाफ़ी है।',
      text: 'She has described what happened next many times, always with a laugh at her own young indignation. She did not have money for fancy stationery, so she took a postcard — a plain government postcard — and wrote to the head of the whole Tata group, J. R. D. Tata himself, saying that it was unfair for a house as respected as Tata to shut a door on candidates simply for being women.',
      ask: {
        q: 'A student, a postcard, and the most powerful industrialist in India. What are the chances anything happens?',
        options: ['None — great men do not read postcards', 'It only takes one fair-minded person actually reading it', 'It depends on the handwriting'],
        answer: 1,
        right: 'And that is what the postcard found. A telegram came back, inviting her to an interview — at the company’s expense.',
        wrong: 'Here is what actually came back: a telegram, inviting her to an interview at the company’s expense. Somebody fair-minded had read the postcard.'
      } },
    { art: ['sudha_murty'], who: null, mood: 'wow',
      hi: 'पुणे में इंटरव्यू के दौरान उन्होंने पूछे गए हर सवाल का जवाब दिया, और अपनी बात पूरी ईमानदारी से रखी। उन्होंने उन्हें नौकरी पर रख लिया। सुधा मूर्ति टेल्को के कारख़ाने में काम करने वाली पहली महिला इंजीनियर बनीं — रोज़ हज़ारों पुरुषों और सौ साल पुरानी आदतों वाली फ़ैक्टरी में जाना, और बस तब तक बेहतरीन काम करते रहना, जब तक कि सबको इसकी आदत न हो गई।',
      text: 'At the interview in Pune she answered everything they asked, and told them honestly what she thought. They hired her. Sudha Murty became the first woman engineer on the shop floor at TELCO — walking each day into a factory of thousands of men and a hundred years of habit, and simply doing excellent work until the strangeness wore off.' },
    { art: ['sudha_murty'], who: null,
      hi: 'जो दरवाज़ा उन्होंने खोला था, वह उनके पीछे बंद नहीं हुआ। जहाँ कभी एक महिला इंजीनियर की कल्पना भी नहीं की जा सकती थी, वहाँ जल्द ही और भी महिलाएँ आ गईं — उस फ़ैक्टरी में और धीरे-धीरे हर जगह। सालों बाद उन्होंने अपनी कमाई और अपने जीवन के कई साल हज़ारों पुस्तकालय और स्कूल बनाने में लगाए, और यह कहानी सुनने वाले हर नौजवान को सुनाई।',
      text: 'The door she pushed open did not close behind her. Where one woman engineer had been unthinkable, there were soon more — at that factory and, slowly, everywhere. Years later she would use her own money and years of her life to build libraries and schools by the thousand, and to tell this story to every young audience that would listen.' },
    { art: ['sudha_murty'], who: 'mithu',
      hi: 'वे उस नोटिस को देखकर एक ठंडी आह भरकर आगे भी बढ़ सकती थीं — बाक़ी सबने तो यही किया था। पूरी कहानी बस इस बात पर टिकी है कि एक छात्रा ने फ़ैसला किया कि नाइंसाफ़ी का जवाब दिया जाना चाहिए, और यह बात कहने के लिए एक पोस्टकार्ड ही काफ़ी था।',
      text: 'She could have sighed at that notice and walked on — everyone else had. The whole story turns on one student deciding that unfair deserved a reply, and that a postcard was enough paper to say so.' }
  ],
  moral: 'Never let the smallness of your paper stop you. Unfairness counts on nobody bothering to write.',
  source: 'Sudha Murty’s own oft-published telling of the 1974 episode — the TELCO notice, the postcard to J. R. D. Tata, the telegram, and her hiring as the first woman engineer on the TELCO shop floor — recounted in her books, talks and interviews over many years.'
},

{
  id: 'ny.isro',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'From a Church Yard to Mars',
  hook: 'India’s space programme began with rocket parts carried on bicycles. It ended up teaching the world how to reach Mars on a small purse.',
  hero: 'rocket',
  cast: ['rocket', 'kalam'],
  minutes: 5,
  place: ['IN-KL', 'IN-AP'],
  words_hi: [['चाँद', 'chaand', 'moon'], ['मंगल', 'mangal', 'Mars'], ['आकाश', 'aakash', 'sky']],
  scenes: [
    { art: ['rocket', 'kalam'], who: null,
      hi: '1963 में, भारत का अंतरिक्ष कार्यक्रम मछुआरों के एक छोटे से गाँव में समाया हुआ था। केरल के तट पर थुम्बा नाम की जगह पर, स्थानीय चर्च समुदाय ने वैज्ञानिकों को काम करने के लिए अपने चर्च की इमारत और बिशप का घर दे दिया — वेदी वाला हिस्सा दफ़्तर बन गया, आँगन उपकरणों से भर गया, और ए. पी. जे. अब्दुल कलाम नाम के एक युवा इंजीनियर उस टीम में शामिल थे जो वहाँ भारत के पहले रॉकेट जोड़ रही थी।',
      text: 'In 1963, India’s space programme fitted inside a fishing village. At Thumba, on the Kerala coast, the local church community lent the scientists their church building and the bishop’s house to work in — the altar end became an office, the yard filled with equipment, and a young engineer named A. P. J. Abdul Kalam was among the team assembling India’s first rockets there.' },
    { art: ['rocket'], who: null, mood: 'wow',
      hi: 'उस ज़माने की एक ऐसी तस्वीर है जिसे देखकर भारतीयों का दिल कभी नहीं भरता: साइकिल के पीछे रॉकेट का नोज़ कोन ले जाया जा रहा है। पुर्जे साइकिल और बैलगाड़ी से ढोए गए, क्योंकि उस वक़्त जो साधन था, वही था। और उसी माँगे हुए चर्च के अहाते से, नवंबर 1963 में, भारत का पहला रॉकेट समंदर के किनारे से उठकर आसमान में उड़ गया।',
      text: 'There is a photograph from those days that Indians never tire of: a rocket nose cone being carried on the back of a bicycle. Parts went by bicycle and bullock cart because that is what there was. And from that borrowed church yard, in November 1963, India’s first rocket rose off the beach and into the sky.' },
    { art: ['rocket'], who: null,
      hi: 'उस समंदर किनारे से जो संस्था पनपी, उसका नाम है इसरो, और उसने साइकिल वाले दिनों की एक आदत हमेशा-हमेशा के लिए बनाए रखी: काम सादगी से करो, कम ख़र्च में करो, और ज़रा भी बर्बादी मत होने दो। दुनिया की दूसरी अंतरिक्ष एजेंसियों के पास पैसों के पहाड़ थे। इसरो के पास थी समझदारी, सब्र, और ऐसे इंजीनियर जो एक-एक रुपये का ख़याल किसी मुसाफ़िर की तरह रखते थे।',
      text: 'The organisation that grew from that beach is called ISRO, and it kept one habit from the bicycle days forever: do it simply, do it cheaply, waste nothing. Other space agencies had mountains of money. ISRO had cleverness, patience, and engineers who treated every rupee like a passenger.' },
    { art: ['rocket'], who: null, mood: 'wow',
      hi: '2013 में इसरो ने मंगल की ओर जाने वाला अंतरिक्ष यान \'मंगलयान\' छोड़ा — और सितंबर 2014 में वह पहली ही कोशिश में उस लाल ग्रह की कक्षा में पहुँच गया, जो आज तक कोई भी देश पहली बार में नहीं कर पाया था। इस पूरे मिशन का कुल ख़र्च हॉलीवुड की अंतरिक्ष वाली किसी एक फ़िल्म के बजट से भी कम था। दुनियाभर के वैज्ञानिकों ने उस आँकड़े को दो-दो बार जाँचकर देखा।',
      text: 'In 2013 ISRO launched Mangalyaan, a spacecraft to Mars — and in September 2014 it slipped into orbit around the red planet on the very first attempt, something no nation had ever managed first time. The bill for the whole mission was famously smaller than the budget of a single Hollywood space film. Scientists around the world checked that number twice.' },
    { art: ['rocket'], who: null, mood: 'think',
      hi: 'फिर बारी आई चाँद की। इससे पहले वाला लैंडर पूरे देश की आँखों के सामने क्रैश हो गया था — अंतरिक्ष ग़लती माफ़ नहीं करता, और इसरो ने यह बात साफ़-साफ़ मानी, जो ख़राबी थी उसे सुधारा, और दोबारा पहुँचा। 23 अगस्त 2023 को, चंद्रयान-3 ने चाँद के दक्षिणी ध्रुव के पास अपना लैंडर हौले से उतार दिया — उस इलाक़े में उतरने वाला दुनिया का यह पहला अंतरिक्ष यान था — और एक नन्हा-सा रोवर बाहर निकलकर उस मिट्टी पर भारत के पहियों के निशान छोड़ आया, जहाँ पहले कभी कोई गाड़ी नहीं चली थी।',
      text: 'Then the Moon. An earlier lander had crashed, in full view of a watching country — space is unforgiving, and ISRO said so plainly, fixed what failed, and went back. On the twenty-third of August 2023, Chandrayaan-3 set its lander down gently near the Moon’s south pole — the first spacecraft from any nation to land in that region — and a little rover rolled out and left India’s wheel-marks in soil where nothing had ever driven.' },
    { art: ['rocket'], who: 'mithu',
      hi: 'चर्च का एक अहाता, एक साइकिल, एक बैलगाड़ी — और फिर पहली ही बार में मंगल की सैर और चाँद का अनछुआ दक्षिणी कोना। थुम्बा में किसी ने यह इंतज़ार नहीं किया कि जब ज़रूरत की हर चीज़ मिल जाएगी तब काम शुरू करेंगे। जो था उसी से शुरुआत की, और आसमान ने भी उनके लिए अपने दरवाज़े खोल दिए।',
      text: 'A church yard, a bicycle, a bullock cart — then Mars on the first try and the Moon’s untouched south. Nobody at Thumba waited until they had everything they needed. They started with what there was, and the sky let them in anyway.' }
  ],
  moral: 'Start with the bicycle you have, not the budget you wish for. Frugality is not the opposite of ambition — sometimes it is the engine of it.',
  source: 'ISRO’s published history and mission records: the Thumba church-and-bishop’s-house beginnings and first sounding rocket (21 November 1963), the Mars Orbiter Mission (launched 2013, Mars orbit 24 September 2014, first-attempt success, cost about ₹450 crore — widely noted as below a Hollywood film budget), and Chandrayaan-3’s landing near the lunar south pole, 23 August 2023. The Thumba years are also told in A. P. J. Abdul Kalam’s memoir "Wings of Fire".'
},

{
  id: 'ny.upi',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'aaj',
  title: 'The Square That Ate the Wallet',
  hook: 'A little black-and-white square hangs at the chai stall. Point a phone at it, and money moves in a heartbeat. Here is the quiet machine behind it.',
  hero: 'mithu',
  cast: ['courtier', 'guard'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['पैसा', 'paisa', 'money'], ['बटुआ', 'batua', 'wallet'], ['आसान', 'aasaan', 'easy']],
  scenes: [
    { art: ['courtier'], who: null,
      hi: 'आज भारत की किसी भी गली में चाय की दुकान को देखिए। कप में चाय डलती है, जेब से फ़ोन निकलता है, धागे से लटके एक छोटे-से छपे हुए चौकोर कोड की तरफ़ एक सेकंड के लिए टिकता है — और पैसे पहुँच जाते हैं। दस रुपये, एक इंसान के बैंक खाते से निकलकर दूसरे के खाते में चले गए, उतनी ही देर में जितनी देर में आपने यह वाक्य पढ़ा। न कोई सिक्के, न कार्ड वाली मशीन, न छुट्टे गिनने का झंझट।',
      text: 'Watch a chai stall in any Indian street today. A cup is poured, a phone comes out, it points for a second at a small printed square hanging on a string — and the payment is done. Ten rupees, gone from one person’s bank account into the other’s, in about the time it took you to read this sentence. No coins, no card machine, no counting change.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"इस कहानी का कोई एक अकेला हीरो नहीं है, और यही इसकी असली बात है। इसके पीछे काम करने वाली मशीन को यूपीआई कहते हैं, और इसे एनपीसीआई ने बनाया था — एक ऐसी संस्था जिसे भारत के बैंकों ने मिलकर बनाया था, मुनाफ़ा कमाने के लिए नहीं, बल्कि पैसों के लेन-देन के लिए एक साझी पाइपलाइन बिछाने के लिए, ठीक वैसे ही जैसे कोई शहर ऐसी सड़कें बनाता है जिनका इस्तेमाल हर गाड़ी कर सके। यूपीआई की शुरुआत 2016 में हुई थी।"',
      text: 'This story has no single hero, and that is the point of it. The machine underneath is called UPI, and it was built by NPCI — an organisation India’s banks set up together, not to make a profit but to build shared plumbing for money, the way a city builds roads that every car may use. UPI switched on in 2016.' },
    { art: ['guard'], who: null, mood: 'think',
      hi: '"इसकी सबसे समझदारी भरी बात यह है कि यूपीआई क्या नहीं है। यह किसी एक कंपनी का ऐप नहीं है। कोई भी बैंक इससे जुड़ सकता है, कोई भी ऐप इसमें शामिल हो सकता है, और एक ऐप वाला व्यक्ति किसी बिल्कुल अलग ऐप वाले व्यक्ति को पैसे भेज सकता है — ठीक वैसे ही जैसे किन्हीं भी दो फ़ोन के बीच फ़ोन कॉल काम करती है। और आम लोगों के लिए पैसे भेजने का कोई ख़र्च नहीं लगता।"',
      text: 'The clever part is what UPI is not. It is not one company’s app. Any bank can join, any app can plug in, and a person on one app can pay a person on a completely different one — the way a phone call works between any two phones. And for ordinary people, sending money costs nothing.',
      ask: {
        q: 'Why did it matter so much that the system was free and open to every bank and app, instead of owned by one company?',
        options: ['It did not matter much', 'Because a payment system is only useful if the OTHER person is on it too — open to everyone means it works with everyone', 'Because apps are hard to build'],
        answer: 1,
        right: 'That is the secret. Money-moving is like language — useful only if the other person shares it. Open to all meant everyone could join, so everyone did.',
        wrong: 'Think about who you pay: rickshaws, shops, your aunt. A payment system is only useful if the other person is on it too. Open to every bank and app meant everyone could join — so everyone did.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      hi: '"और सबने यही किया। सब्ज़ी के ठेले, मंदिर की दान-पेटियाँ, ऑटो-रिक्शा, शादियों के तोहफ़ों वाले काउंटर — वह छोटा-सा चौकोर कोड हर जगह पहुँच गया, क्योंकि उसे छापने में लगभग कुछ भी ख़र्च नहीं होता। कई देशों को नक़दी से चेक और फिर कार्ड तक पहुँचने में सौ साल लग गए। पर ज़्यादातर भारत कुछ ही सालों में सीधे नक़द से फ़ोन पर आ गया, और आज यूपीआई हर महीने अरबों पेमेंट्स संभालता है — यह धरती के सबसे व्यस्त तुरंत-भुगतान सिस्टम्स में से एक है।"',
      text: 'And everyone did. Vegetable carts, temple donation boxes, auto-rickshaws, wedding gift counters — the little square went everywhere, because printing one costs almost nothing. Many countries had leapt from cash to cheques to cards over a century. Much of India jumped straight from cash to the phone in a handful of years, and today UPI carries billions of payments every single month — among the busiest instant-payment systems on Earth.' },
    { art: ['courtier', 'guard'], who: null,
      hi: '"इसकी सबसे शांत बात ही इसकी सबसे निष्पक्ष बात है। कार्ड की मशीन पर इतना ख़र्च आता था जो कोई छोटा दुकानदार कभी नहीं कर सकता था, इसलिए कार्ड बड़ी दुकानों की चीज़ थे। कागज़ के एक चौकोर टुकड़े को छापने में बस एक रुपया लगता है — इसलिए सबसे छोटी गली के सबसे छोटे चायवाले को भी वही पेमेंट सिस्टम मिल गया जो मॉल की सबसे बड़ी दुकान को मिला था। वही चौकोर डिब्बा, वही एक सेकंड, वही पटरी।"',
      text: 'The quietest part is the fairest part. A card machine cost more than a small vendor could ever spend, so cards belonged to big shops. A paper square costs a rupee to print — so the smallest chaiwala in the smallest lane got the same payment system as the grandest store in the mall. The same square, the same second, the same rails.' },
    { art: ['courtier'], who: 'mithu',
      hi: '"अगली बार जब तुम किसी दुकान पर किसी को फ़ोन से पैसे देते देखो, तो तुम्हें इसका नुस्ख़ा पता होगा: असल में कोई नुस्ख़ा है ही नहीं। बस एक ऐसी साझी व्यवस्था जिस पर सबका बराबर हक़ है, जिसे इसलिए बनाया गया ताकि सबसे छोटा ठेला और सबसे बड़ी दुकान एक ही काउंटर पर खड़े हो सकें। किसी बड़े से कहना कि वे तुम्हें अपना सबसे ज़्यादा इस्तेमाल होने वाला चौकोर कोड दिखाएँ।"',
      text: 'Next time you see someone pay with a phone at a stall, you will know the trick: there is no trick. Just plumbing that everyone owns, built so the smallest stall and the biggest shop stand at the same counter. Ask a grown-up to show you their most-used square.' }
  ],
  moral: 'The best inventions are sometimes the ones nobody owns — built like roads, open to all, so that the smallest cart travels as fast as the biggest truck.',
  source: 'NPCI’s published material on UPI — launched 2016, an interoperable instant-payment system built by the National Payments Corporation of India, a not-for-profit umbrella set up by India’s banking system — and NPCI’s monthly transaction statistics (billions of payments per month, among the world’s largest instant-payment volumes).'
},

{
  id: 'ny.flipkart',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'Two Bansals and a Bookshop in the Air',
  hook: 'Two engineers with the same surname — not related — started an online bookshop from a flat, and delivered the orders themselves by scooter.',
  hero: 'unicorn',
  cast: ['unicorn'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['किताब', 'kitaab', 'book'], ['दुकान', 'dukaan', 'shop'], ['शुरुआत', 'shuruaat', 'beginning']],
  scenes: [
    { art: ['unicorn'], who: null,
      hi: '"2007 में, बेंगलुरु के दो युवा इंजीनियरों ने — सचिन बंसल और बिन्नी बंसल, एक जैसा सरनेम, कोई रिश्तेदारी नहीं, एक ऐसा इत्तेफ़ाक जिसे वे ज़िंदगी भर समझाते रहे — अपनी आरामदेह नौकरियाँ छोड़ दीं ताकि कुछ ऐसा कर सकें जो उस समय भारत के ज़्यादातर लोगों को मज़ाकिया लगता था: बिना दुकान की एक दुकान। किताबें बेचने वाली एक वेबसाइट, जो कोरमंगला के एक फ़्लैट के दो कमरों से और अपनी बचत के कुछ लाख रुपयों के सहारे चलती थी।"',
      text: 'In 2007, two young engineers in Bengaluru — Sachin Bansal and Binny Bansal, same surname, no relation, a coincidence they explained for the rest of their lives — quit comfortable jobs to try something most of India found funny at the time: a shop with no shop. A website that sold books, run from a couple of rooms in a Koramangala flat, on a few lakh rupees of their own savings.' },
    { art: ['unicorn'], who: null, mood: 'think',
      hi: '"शक करने वालों की बात में दम तो था। 2007 के भारत में, शायद ही कोई चीज़ों के लिए ऑनलाइन पैसे चुकाता था। पार्सल तो रास्ते में ही ग़ायब हो जाते थे। भला कोई किसी वेबसाइट पर पैसे भेजकर यह भरोसा क्यों करता कि पार्सल घर आ ही जाएगा? ऐसा भरोसा तब था ही नहीं। उसे धीरे-धीरे बनाना पड़ा — एक बार में एक पार्सल पहुँचाकर।"',
      text: 'The doubters had a real point. In the India of 2007, hardly anyone paid for things online. Deliveries went missing. Why would anyone send money into a website and trust that a parcel would come? That trust did not exist. It had to be manufactured — one parcel at a time.',
      ask: {
        q: 'How do two people with no money and no famous name manufacture trust?',
        options: ['Advertise everywhere', 'Make each early order arrive perfectly — even if the founders must carry it themselves', 'Lower the prices until people risk it'],
        answer: 1,
        right: 'That was the founding move. In the early days the two of them delivered orders themselves, by scooter, through Bengaluru traffic — because a promise kept in person is how trust starts.',
        wrong: 'Advertising buys attention, not trust. What they actually did: in the early days they delivered orders themselves, by scooter, through Bengaluru traffic — a promise kept in person, over and over.'
      } },
    { art: ['unicorn'], who: null, mood: 'wow',
      hi: '"कंपनी का सबसे पहला ऑर्डर तो एक ऐसी दास्तान है जिसके पक्के सबूत आज भी मौजूद हैं: एक किताब, जिसे किसी बड़े शहर की किताबों की दुकान से बहुत दूर रहने वाले एक ग्राहक ने ऑर्डर किया था — एक ऐसी वेबसाइट पर दांव लगाकर, जिसका नाम तब किसी ने सुना भी नहीं था। यहाँ से पार्सल निकला, वहाँ किताब पहुँची, और उस ग्राहक ने यह बात औरों को बताई। निभाया गया वही एक अकेला वादा, जब करोड़ों बार दोहराया गया, तो बस वही भारतीय ऑनलाइन शॉपिंग की पूरी कहानी बन गया।"',
      text: 'The very first order is company legend with the receipts to prove it: one book, ordered by a customer far from any big city bookshop, who took the gamble on a website nobody had heard of. The parcel went out, the book arrived, the customer told people. That single kept promise, multiplied by millions, is essentially the whole story of Indian online shopping.' },
    { art: ['unicorn'], who: null,
      hi: '"किताबों से शुरुआत होकर यह शेल्फ़ बढ़ता गया — और फ्लिपकार्ट भारतीय इंटरनेट की सबसे अहम कंपनियों में शुमार हो गई, वही कंपनी जिसने पूरे देश को \'खरीदें\' वाले बटन पर भरोसा करना सिखाया। निवेशकों ने इतनी बड़ी बनने वाली नई कंपनियों को कहानियों की किताब वाले एक ख़ास शब्द से पुकारना शुरू किया: यूनिकॉर्न। जब भारत ने अपने यूनिकॉर्न गिनने शुरू किए, तो एक फ़्लैट से चलने वाली किताबों की यह दुकान उस झुंड की पहली सदस्य थी।"',
      text: 'From books, the shelf grew — and Flipkart grew into one of the defining companies of the Indian internet, the one that taught a country it could trust the buy button. Investors came to describe young companies that grow that large with a storybook word: a unicorn. When India began counting its unicorns, this bookshop-from-a-flat was the herd’s first.' },
    { art: ['unicorn'], who: 'mithu',
      hi: '"दिलचस्प बात कभी यूनिकॉर्न नहीं होती — दिलचस्प तो वह फ़्लैट, वह स्कूटर, और वह पहली अनजान महिला ग्राहक थी जिसने दो ऐसे इंजीनियरों पर भरोसा करने का फ़ैसला किया जिनसे वह कभी मिली तक नहीं थी। हर बड़ी चीज़ की शुरुआत कभी सिर्फ़ दो लोगों और एक पार्सल से ही हुई थी।"',
      text: 'The interesting part is never the unicorn — it is the flat, the scooter, and the first stranger who decided to trust two engineers she had never met. Every big thing was once two people and a parcel.' }
  ],
  moral: 'Trust is built the slow way, one kept promise at a time — and it is the realest thing a new company owns.',
  source: 'The widely documented founding of Flipkart: Bengaluru, October 2007, by Sachin and Binny Bansal (unrelated), begun with their own savings as an online bookshop with founder-delivered early orders; its first book order is recorded company history, and its later status as India’s first startup unicorn was widely reported. The story deliberately stays on the founding years.'
},

{
  id: 'ny.nykaa',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'The Bell She Rang at Fifty',
  hook: 'She had a big job, a corner office and grown-up twins. At an age when people are told to slow down, she started from zero.',
  hero: 'falguni',
  cast: ['falguni'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['घंटी', 'ghanti', 'bell'], ['साहस', 'saahas', 'daring'], ['उम्र', 'umra', 'age']],
  scenes: [
    { art: ['falguni'], who: null,
      hi: '"फाल्गुनी नायर ने, अगर समझदारी से देखा जाए, तो ज़िंदगी की सबसे ऊँची चढ़ाई पूरी कर ली थी। वह मुंबई की सबसे वरिष्ठ बैंकरों में से एक थीं, हर जगह उनका बहुत सम्मान था, और उनके दोनों जुड़वाँ बच्चे भी बड़े हो चुके थे। और फिर 2012 में, लगभग पचास की उम्र में, वह यह सब कुछ छोड़कर बिल्कुल नए सिरे से एक कंपनी शुरू करने निकल पड़ीं — वह भी ब्यूटी प्रोडक्ट्स के क्षेत्र में, जिसमें उन्होंने पहले कभी काम नहीं किया था।"',
      text: 'Falguni Nayar had, by any sensible measure, finished the climbing part of life. She was one of the most senior bankers in Mumbai, respected everywhere, her twin children grown. And in 2012, at nearly fifty, she walked away from all of it to start a brand-new company from scratch — in beauty products, an industry she had never worked in.' },
    { art: ['falguni'], who: null, mood: 'think',
      hi: '"उनका विचार बिल्कुल साफ़ और अडिग था: भारतीय महिलाओं के पास मेकअप और त्वचा की देखभाल का सामान खरीदने के लिए एक भरोसेमंद जगह होनी ही चाहिए, जहाँ ईमानदार सलाह, असली रिव्यू और असली सामान मिले — चाहे वे दक्षिण मुंबई में रहती हों या किसी ब्यूटी स्टोर से दिन भर के सफ़र जितनी दूर किसी छोटे से कस्बे में। उन्होंने इसका नाम रखा नायका, जो निकला था \'नायिका\' से: यानी कहानी की हीरोइन। ज़रा ध्यान दीजिए, हीरोइन — हीरोइन की कोई सहेली या मददगार नहीं।"',
      text: 'Her idea was plain and stubborn: Indian women deserved a trustworthy place to buy makeup and skincare, with honest advice, real reviews and genuine products — whether they lived in south Mumbai or in a small town a day’s journey from any beauty counter. She named it Nykaa, from nayika: the heroine of a story. The heroine, note — not the sidekick.' },
    { art: ['falguni'], who: null,
      hi: 'शुरुआती साल उस बिना चमक-दमक वाली कठिन मेहनत के दिन थे, जो कभी मुख्य सुर्खियों में नहीं दिखती — गोदाम, डिलीवरी, किसी नए चेहरे पर भरोसा करने के लिए मशहूर ब्रांड्स को मनाना, और अपने चेहरों के लिए एक वेबसाइट पर यकीन करने के लिए ग्राहकों को राज़ी करना। स्टार्टअप की दुनिया के नौजवान लड़कों से वह उम्र में दशकों बड़ी थीं, और उन्होंने इस बात को तूल देने लायक समझा ही नहीं।',
      text: 'The early years were the unglamorous kind of hard that never makes the highlight reel — warehouses, deliveries, convincing famous brands to trust a newcomer, convincing customers to trust a website with their faces. She was decades older than the boys of the startup world, and she simply declined to find that interesting.' },
    { art: ['falguni'], who: null, mood: 'wow',
      hi: 'नौ साल तक कंपनी को खड़ा करने के बाद, नवंबर 2021 में नायका को स्टॉक एक्सचेंज में लिस्ट किया गया — और अपने परिवार के साथ और अपनी टीम के बीच, फाल्गुनी नायर ने मुंबई के मंच पर खड़े होकर बाज़ार की शुरुआत की घंटी बजाई। पचास साल की उम्र में जो कंपनी उन्होंने शुरू की थी, वह अब भारत की सबसे चर्चित लिस्टिंग में से एक थी, और पहले ही दिन से एक महिला द्वारा बनाई और चलाई गई भारत की पहली बड़ी इंटरनेट कंपनियों में से एक थी।',
      text: 'Nine years of building later, in November 2021, Nykaa was listed on the stock exchange — and Falguni Nayar stood on the platform in Mumbai and rang the opening bell, with her family beside her and her team around her. The company she had started at fifty was now one of the most talked-about listings in India, and one of the first big Indian internet companies built and led by a woman from day one.' },
    { art: ['falguni'], who: null,
      hi: 'उस घंटी की गूंज बहुत दूर तक सुनाई देती है। जब भी यह कहानी सुनाई जाती है, कहीं न कहीं कोई ऐसा इंसान, जिसने चुपचाप यह मान लिया था कि वह अपने आइडिया के लिए बहुत बूढ़ा हो चुका है, अपनी सोच का हिसाब फिर से लगाता है।',
      text: 'Rings of that bell are heard a long way. Somewhere, every time this story is told, someone who had quietly decided they were too old for their own idea does a small recalculation.' },
    { art: ['falguni'], who: 'mithu',
      hi: 'पचास की उम्र कोई आखिरी तारीख नहीं है; यह तो किसी भी दूसरी उम्र की तरह है, जिसमें नई सुबहें होती हैं। घंटी यह नहीं पूछती कि बजाने वाला हाथ कितने साल पुराना है। वह तो बस यह पूछती है कि क्या तुमने कुछ बनाया है।',
      text: 'Fifty is not a deadline; it turns out it is an age like any other, with mornings in it. The bell does not ask how old the hand is. It only asks whether you built something.' }
  ],
  moral: 'Too late is mostly a rumour. The years you have already lived are not spent — they are capital.',
  source: 'Nykaa’s own company history and stock-exchange listing records: founded 2012 by Falguni Nayar after leaving a senior investment-banking career at nearly fifty; the name from nayika; the bell-ringing listing in Mumbai on 10 November 2021 — all matters of public record and her own public tellings.'
},

{
  id: 'ny.oyo',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'naya',
  badge: 'itihaas',
  title: 'The Teenager Who Slept in a Hundred Guest Houses',
  hook: 'While other teenagers collected stickers, a boy from Odisha collected bad hotel rooms — on purpose — and wrote down everything wrong with them.',
  hero: 'ritesh',
  cast: ['ritesh'],
  minutes: 4,
  place: ['IN-OR'],
  words_hi: [['मेहमान', 'mehmaan', 'guest'], ['सफ़र', 'safar', 'journey'], ['कोशिश', 'koshish', 'attempt']],
  scenes: [
    { art: ['ritesh'], who: null,
      hi: 'रितेश अग्रवाल ओडिशा के एक छोटे से कस्बे बिसम कटक में दुकानदारों के एक परिवार में पले-बढ़े। जब वे किशोर थे, उन्हें घूमने-फिरने का शौक लग गया — और जेब में बहुत कम पैसे होने की वजह से, वे वहीं ठहरते जहाँ बहुत कम पैसे वाले ठहरते हैं: सस्ते गेस्ट हाउस। टूटे हुए नल, न जाने कैसी चादरें, और इधर-उधर गायब रहने वाले रिसेप्शनिस्ट। ज़्यादातर यात्री बड़बड़ाते और भूल जाते। उन्होंने बड़बड़ाया भी और अपनी डायरी में नोट भी किया।',
      text: 'Ritesh Agarwal grew up in Bissam Cuttack, a small town in Odisha, in a family of shopkeepers. As a teenager he fell in love with travelling — and, having very little money, he stayed where very little money stays: cheap guest houses. Broken taps, mystery bedsheets, receptionists who had wandered off. Most travellers grumbled and forgot. He grumbled and took notes.' },
    { art: ['ritesh'], who: null, mood: 'think',
      hi: 'जब तक वे ऐसे लगभग सौ गेस्ट हाउसों में ठहरे, उनकी नोटबुक में एक बात साफ़ हो गई थी: परेशानी यह नहीं थी कि सस्ते कमरे मौजूद थे, बल्कि यह थी कि मुसाफिर को कभी पता ही नहीं होता था कि उसे क्या मिलने वाला है। एक गेस्ट हाउस बहुत बढ़िया निकलता, तो अगला एकदम बेकार, और बाहर से देखकर यह जानने का कोई तरीका नहीं था कि कौन-सा कैसा है।',
      text: 'By the time he had stayed in about a hundred of them, his notebook held a pattern: the problem was not that cheap rooms existed, but that a traveller could never know what they were getting. One guest house was a gem, the next a disaster, and nothing on the outside told you which.',
      ask: {
        q: 'Everybody who ever stayed in a bad guest house knew this problem. What made a teenager from Odisha different?',
        options: ['He was luckier than the others', 'Everyone else saw an annoyance; he treated it as a problem that could actually be worked on', 'He had money to fix it'],
        answer: 1,
        right: 'That is the whole difference. A problem noticed by millions belongs to whoever takes it seriously first — and he was taking notes while everyone else was checking out.',
        wrong: 'He had no money and no luck to spare. The difference was smaller and bigger than that: everyone else saw an annoyance, and he treated it as a problem someone could actually work on.'
      } },
    { art: ['ritesh'], who: null, mood: 'wow',
      hi: 'अठारह साल की उम्र में वह दिल्ली आ गया और अपना काम शुरू किया — पहले ठहरने की जगहों की लिस्ट बनाने वाली एक वेबसाइट, जिसने उसे सिखाया कि उसका अंदाज़ा आधा गलत था, और फिर 2013 में सुधरा हुआ विचार: ओयो, जिसने बुनियादी चीज़ों को ठीक करने के लिए गेस्ट हाउसों के साथ मिलकर काम किया — साफ़ चादरें, चालू शावर, सच्ची तस्वीरें — ताकि ओयो का कमरा बुक करने वाले किसी भी मुसाफ़िर को पता रहे कि उसे क्या मिलेगा। उसी साल, नौजवान संस्थापकों के लिए बनी एक ग्लोबल फ़ेलोशिप ने दुनिया भर के आवेदकों में से उसे चुना, और कॉलेज जाने के बजाय अपनी कंपनी खड़ी करने के लिए उसे पैसे दिए।',
      text: 'At eighteen he moved to Delhi and started up — first a site for listing stays, which taught him his idea was half-wrong, and then, in 2013, the corrected idea: OYO, which worked with guest houses to fix the basics — clean sheets, working shower, honest photos — so a traveller booking an OYO room knew what they would get. That same year, a global fellowship for young founders picked him from applicants around the world, and paid him to build his company instead of going to college.' },
    { art: ['ritesh'], who: null,
      hi: 'उस शुरुआत के बाद, ओयो पूरे भारत और उससे भी कहीं आगे हज़ारों छोटे होटलों तक फैल गया, और आगे की राह में नई कंपनियों वाला हर मौसम देखने को मिला — अच्छे साल भी और मुश्किल साल भी। लेकिन शुरुआत की वह बात अपनी जगह कायम है: ओडिशा के एक छोटे से शहर के एक दुकानदार के बेटे ने भारत में सफ़र की सबसे आम परेशानी को देखा और तय किया कि इसे वही सुलझाएगा।',
      text: 'From that start, OYO spread to thousands of small hotels across India and far beyond, with the road ahead holding the usual weather of young companies — good years and hard ones alike. But the founding itself stands: a shopkeeper’s son from a small Odisha town looked at the most ordinary annoyance in Indian travel and decided it was his to solve.' },
    { art: ['ritesh'], who: 'mithu',
      hi: 'एक नोटबुक रखो। जिन परेशानियों पर तुम्हारे आस-पास के सब लोग कंधे उचका देते हैं, वे लावारिस सामान की तरह वहीं पड़ी रहती हैं — और सच तो यह है कि चीज़ों पर ठीक से गौर करना एक ऐसा हुनर है, जिसका अभ्यास तुम किसी भी उम्र में, किसी भी शहर में, यहाँ तक कि अपने शहर में भी शुरू कर सकते हो।',
      text: 'Keep a notebook. The problems everyone around you shrugs at are lying there like unclaimed luggage — and noticing properly, it turns out, is a skill you can start practising at any age, in any town, including yours.' }
  ],
  moral: 'Opportunities rarely look like opportunities. Mostly they look like problems everyone else has decided to live with.',
  source: 'The widely documented founding of OYO: Ritesh Agarwal, born 1993 in Bissam Cuttack, Odisha; his budget-guest-house travels; the 2012 first venture and 2013 pivot to OYO Rooms; and his selection for the international Thiel Fellowship in 2013 — from the company’s own accounts and contemporary reporting. The story deliberately stays on the founding moment.'
},

/* =========================================================== RAH ========== */
/* Rah Banane Wale — the pathbreakers (2026-08). Four people who found a door
   shut and opened it so it never quite shut again. All itihaas, all sourced.
   Sensitive-topic gate: rah.savitribai borders caste history, which docs/05 §6
   reserves for a human author with a named reviewer. That story stays at a
   child's level — the door she opened, the courage of the walk — with the
   cruelty acknowledged in one honest sentence, without caste vocabulary, and
   is flagged needs_review: true. It does not publish without sign-off. */

{
  id: 'rah.kiran',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'rah',
  badge: 'itihaas',
  title: 'The Brewmaster Nobody Would Hire',
  hook: 'She trained to run a brewery and finished top of her class. India’s breweries would not give a woman the job. So she used the same science to build something bigger.',
  hero: 'kiran_shaw',
  cast: ['kiran_shaw'],
  minutes: 4,
  place: ['IN-KA'],
  words_hi: [['दरवाज़ा', 'darwaza', 'door'], ['ख़मीर', 'khameer', 'yeast'], ['दवा', 'dawa', 'medicine']],
  scenes: [
    { art: ['kiran_shaw'], who: null,
      hi: 'किरण मजूमदार 1950 और 60 के दशक में बैंगलोर में पली-बढ़ीं। वे एक मुख्य ब्रूमास्टर की बेटी थीं — और उन्हें बीयर से नहीं, बल्कि उसके पीछे के विज्ञान से प्यार हो गया: किण्वन यानी फर्मेंटेशन, वह पुराना हुनर जिसके ज़रिए खमीर और एंज़ाइम जैसे न दिखने वाले सूक्ष्म जीव चुपचाप एक चीज़ को दूसरी चीज़ में बदल देते हैं। वे अच्छी तरह ब्रूइंग की पढ़ाई करने ऑस्ट्रेलिया गईं और अपनी कक्षा में सबसे आगे रहीं।',
      text: 'Kiran Mazumdar grew up in Bangalore in the 1950s and 60s, the daughter of a head brewmaster — and she fell in love not with beer but with the science underneath it: fermentation, the ancient trick by which invisible living things, yeasts and enzymes, quietly turn one substance into another. She went to Australia to study brewing properly, and finished at the top of her class.' },
    { art: ['kiran_shaw'], who: null, mood: 'sad',
      hi: 'फिर वे अपनी डिग्री लेकर घर लौटीं — और देखा कि उनके काम के सारे दरवाज़े बंद थे। 1970 के दशक के भारत में एक के बाद एक हर ब्रूअरी ने उनसे वही कहा जो वे आज भी याद करती हैं: ब्रूहौस किसी औरत के संभालने की जगह नहीं है। न उनके नंबरों की कोई कद्र थी, न उनकी ट्रेनिंग की। जवाब बस एक ही था — \'ना\'।',
      text: 'Then she came home with her qualification — and found every door in her field closed. Brewery after brewery told her, in the India of the 1970s, what she has retold ever since: the brewhouse was no place to put a woman in charge. Her marks did not matter. Her training did not matter. The answer was simply no.',
      ask: {
        q: 'Your training is real, your marks are the best, and every door in your field is shut. What is your training actually worth now?',
        options: ['Nothing — the doors decide', 'Everything — fermentation science works in more places than breweries', 'Only what someone else can be persuaded to say it is worth'],
        answer: 1,
        right: 'That is the turn her life took. Brewing science is enzyme science — and enzymes have a thousand uses beyond beer. The skill was a key, and keys open more than one lock.',
        wrong: 'It felt like nothing, she has said — for a while. But brewing science is enzyme science, and enzymes have a thousand uses beyond beer. The skill was a key, and keys open more than one lock.'
      } },
    { art: ['kiran_shaw'], who: null,
      hi: '1978 में इंडस्ट्रियल एंज़ाइम बनाने वाली एक आयरिश कंपनी को भारत में एक साझीदार की तलाश थी, और उन्हें वह ब्रूमास्टर मिल गईं जिन्हें कोई नौकरी नहीं दे रहा था। पच्चीस साल की किरण ने बैंगलोर में अपने किराए के मकान के गैराज में लगभग दस हज़ार रुपयों से \'बायोकॉन इंडिया\' की शुरुआत की। शुरुआती दिन लगातार इनकार से भरे थे: बैंक किसी ऐसी युवा महिला को कर्ज़ देने को तैयार नहीं थे, जो एक ऐसे शब्द पर कंपनी चला रही थी — बायोटेक्नोलॉजी — जो किसी बैंक मैनेजर ने कभी सुना ही नहीं था।',
      text: 'In 1978 an Irish company that made industrial enzymes went looking for an Indian partner, and found the brewmaster nobody would hire. Kiran, twenty-five, started Biocon India in the garage of her rented house in Bangalore, with about ten thousand rupees. The early days were a museum of refusals: banks would not lend to a young woman running a company built on a word — biotechnology — that no bank manager had ever heard.' },
    { art: ['kiran_shaw'], who: null, mood: 'wow',
      hi: 'फिर भी उस गैराज में काम शुरू हुआ, पपीते के फल से एंज़ाइम निकाले गए — और एक ही साल के भीतर, यह नन्हीं कंपनी यूरोप और अमेरिका को एंज़ाइम भेजने लगी, ऐसा करने वाली यह पहली भारतीय कंपनी थी। जिस विज्ञान को भारत की ब्रूअरियों ने ठुकरा दिया था, अब उसे पीपों में भरकर पूरी दुनिया में भेजा जा रहा था।',
      text: 'The garage got to work anyway, coaxing enzymes out of papaya fruit — and within a year, this tiny company was exporting enzymes to Europe and America, the first Indian company ever to do so. The science India’s breweries had turned away was now being shipped, in barrels, to the world.' },
    { art: ['kiran_shaw'], who: null, mood: 'wow',
      hi: 'फिर एक और बड़ा विचार आया: अगर एंज़ाइम बन सकते हैं, तो दवाइयाँ क्यों नहीं? बायोकॉन ने अपने फरमेंटर्स का रुख़ दवाइयों की तरफ़ मोड़ दिया — ख़ास तौर पर इंसुलिन, वह रोज़ की दवा जिसके बिना डायबिटीज़ से जूझ रहे लाखों भारतीय जी नहीं सकते, जिसे भारतीय स्तर पर और भारतीय दामों में बनाया गया। गैराज से शुरू हुई वह कंपनी भारत की सबसे बड़ी बायोटेक्नोलॉजी कंपनी बन गई। यह गैराज ही तो इस कहानी की असली जान है; और मिले हुए इनकार उसका ईंधन।',
      text: 'Then came the bigger idea: if enzymes, why not medicines? Biocon turned its fermenters toward pharmaceuticals — above all insulin, the daily medicine millions of Indians with diabetes cannot live without, made at Indian scale and Indian prices. The company from the garage grew into the biggest biotechnology company in India. The garage is the point of the story; the refusals are its fuel.' },
    { art: ['kiran_shaw'], who: 'mithu',
      hi: 'लोगों ने उन्हें बीयर नहीं बनाने दी, तो उन्होंने दवाइयाँ बना दीं। जब आपके सामने कोई दरवाज़ा बंद हो जाए, तो देखिए कि आपकी चाबी से असल में क्या खुलता है — अक्सर वह उस एक ताले से कहीं ज़्यादा बड़ा होता है जो आपके दिमाग में था।',
      text: 'They would not let her make beer, so she made medicine. When a door closes on you, check what your key really opens — it is usually more than the one lock you had in mind.' }
  ],
  moral: 'A closed door tells you about the door, not about you. Skills are keys — and most keys open more than one lock.',
  source: 'Biocon’s own company history: founded 1978 in the garage of her rented Bangalore house, in partnership with Biocon Biochemicals of Ireland, on seed capital of about ₹10,000; the papain exports within the first year — the first Indian enzyme exports — and the later move into biopharmaceuticals and affordable insulin. Her brewmaster training in Australia and the refusals at Indian breweries and banks are her own oft-recorded telling, paraphrased here, never quoted.'
},

{
  id: 'rah.hansa',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'rah',
  badge: 'itihaas',
  title: 'All Human Beings',
  hook: 'After a terrible war, the world sat down to write its promises to every person. The first line began: all men are born free and equal. A teacher from Gujarat read it — and asked the question that fixed it.',
  hero: 'hansa_mehta',
  cast: ['hansa_mehta'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['शब्द', 'shabd', 'word'], ['इंसान', 'insaan', 'human being'], ['हक़', 'haq', 'right']],
  scenes: [
    { art: ['hansa_mehta'], who: null,
      hi: 'हंसा मेहता 1897 में गुजरात के बड़ौदा के एक विद्वान परिवार में जन्मी थीं, और उन्होंने अपनी पूरी ज़िंदगी शिक्षा के नाम कर दी — उन्होंने गुजराती बच्चों के लिए किताबें लिखीं और अनुवाद कीं, जिनमें \'गुलिवर की यात्राएं\' भी शामिल थीं, और स्कूल-कॉलेज बनवाए। वह भारत का संविधान लिखने वाली सभा की महज़ पंद्रह महिलाओं में से एक थीं; और आज़ादी की आधी रात को, 14 अगस्त 1947 के दिन, हंसा मेहता ने ही भारत की महिलाओं की ओर से सभा को राष्ट्रीय ध्वज सौंपा था। यह बात सभा के अपने रिकॉर्ड में दर्ज है।',
      text: 'Hansa Mehta was born in 1897 into a scholarly family of Baroda, in Gujarat, and spent her life on education — she wrote and translated books for Gujarati children, Gulliver’s adventures among them, and built schools and colleges. She was one of just fifteen women in the assembly that wrote India’s Constitution; and at the midnight hour of independence, 14 August 1947, it was Hansa Mehta who presented the national flag to the assembly on behalf of the women of India. That is in the assembly’s own record.' },
    { art: ['hansa_mehta'], who: null,
      hi: '1947 में उन्हें संयुक्त राष्ट्र भेजा गया, उस आयोग में जो दुनिया के लिए एक ऐसी चीज़ का मसौदा तैयार कर रहा था जो पहले कभी नहीं बनी थी: मानवाधिकारों का सार्वभौम घोषणापत्र — धरती के हर इंसान के हक़ के वादों की एक ऐसी सूची, जो उस युद्ध के साए में लिखी जा रही थी जिसने दिखाया था कि जब ऐसे वादे न हों तो क्या होता है। इसकी अध्यक्ष अमेरिका की एलिनॉर रूज़वेल्ट थीं। और इसके सबसे पहले अनुच्छेद के मसौदे की शुरुआत ऐसे हुई थी: “सभी पुरुष स्वतंत्र और समान पैदा होते हैं।”',
      text: 'In 1947 she was sent to the United Nations, to the commission drafting something the world had never had: the Universal Declaration of Human Rights — a promise-list belonging to every person on Earth, written in the shadow of a war that had shown what happens when such promises do not exist. The chair was Eleanor Roosevelt of America. And the draft of the very first article began: “All men are born free and equal.”' },
    { art: ['hansa_mehta'], who: null, mood: 'think',
      hi: 'कमरे में मौजूद ज़्यादातर लोगों को ये शब्द बिल्कुल ठीक लगे। सबका यही मानना था कि “सभी पुरुषों” का मतलब ज़ाहिर तौर पर हर किसी से है।',
      text: 'To most of the room, that wording seemed fine. “All men”, everyone agreed, obviously meant everyone.',
      ask: {
        q: '“All men” means everyone — everybody knows that. Does the wording matter?',
        options: ['No — everyone knows what is meant', 'Yes — words written for the whole world, for all time, should say exactly what they mean', 'Only lawyers care about such things'],
        answer: 1,
        right: 'That was Hansa Mehta’s argument, made patiently, meeting after meeting: somewhere, someday, someone would read “men” and use it to mean men only. A promise to everyone had to name everyone.',
        wrong: 'Hansa Mehta thought otherwise, and said so, patiently, meeting after meeting: somewhere, someday, someone would read “men” and use it to mean men only. A promise to everyone had to name everyone.'
      } },
    { art: ['hansa_mehta'], who: null, mood: 'wow',
      hi: 'उनकी जीत हुई। जब दिसंबर 1948 में सार्वभौम घोषणापत्र को अपनाया गया, तो उसका पहला अनुच्छेद इस तरह पढ़ा गया — और आज भी पांच सौ से ज़्यादा भाषाओं में पढ़ा जाता है: “सभी मनुष्य गरिमा और अधिकारों के मामले में स्वतंत्र और बराबर पैदा होते हैं।” खुद संयुक्त राष्ट्र यह कहानी सुनाता है कि इन शब्दों पर किसने ज़ोर दिया था: भारत की हंसा मेहता ने। एक सजग पाठक द्वारा बदले गए महज़ दो शब्द, उस वाक्य में जिससे आज पूरी दुनिया शुरुआत करती है।',
      text: 'She won. When the Universal Declaration was adopted in December 1948, its first article read — and reads today, in over five hundred languages: “All human beings are born free and equal in dignity and rights.” The United Nations itself tells the story of who insisted on those words: Hansa Mehta of India. Two words, changed by one careful reader, in the sentence the whole world now begins with.' },
    { art: ['hansa_mehta'], who: null,
      hi: 'फिर वह वतन लौटीं और निर्माण के काम में जुटी रहीं। जब 1949 में बड़ौदा की नई यूनिवर्सिटी खुली, तो हंसा मेहता उसकी पहली उप-कुलपति बनीं — एक विदुषी जो उस दौर में एक यूनिवर्सिटी चला रही थीं जब महिलाओं के लिए यह दरवाज़ा भी नहीं खुला था। उन्होंने अपनी ज़िंदगी सिर्फ़ एक पक्के विश्वास के साथ जी, जिसे उन्होंने हर जगह लागू किया: कि हर इंसान को, और उनका मतलब सचमुच \'हर\' इंसान से था, सीखने और पढ़ने का सम्मान मिलना ही चाहिए।',
      text: 'Then she went home and kept building. When Baroda’s new university opened in 1949, Hansa Mehta led it as its first Vice-Chancellor — a scholar running a university at a time when that too was a door not yet open. She spent her life on exactly one conviction, applied everywhere: that every human being, and she did mean every, deserves the dignity of learning.' },
    { art: ['hansa_mehta'], who: 'mithu',
      hi: 'ज़्यादातर लोग बस सरसरी नज़र डालते हैं। उन्होंने गहराई से पढ़ा। अगली बार जब तुम्हारा सामना किसी नियम, किसी फ़ॉर्म या किसी वादे से हो — तो छोटे-छोटे शब्दों को ध्यान से पढ़ना। एक बार पूरी दुनिया ऐसे ही दो शब्दों पर टिकी थी, और बड़ौदा से कोई था जो पूरा ध्यान दे रहा था।',
      text: 'Most people skim. She read. Next time you meet a rule, a form, a promise — read the small words. The whole world once hung on two of them, and somebody from Baroda was paying attention.' }
  ],
  moral: 'Check the small words. The whole world can hang on them — and somebody has to be the one reading carefully.',
  source: 'United Nations records: the UN’s own published histories of the Universal Declaration of Human Rights credit Hansa Mehta of India with changing Article 1 from “all men” to “all human beings” (adopted 10 December 1948) — the Article 1 text is quoted from the document itself; the Constituent Assembly of India’s records for the flag presentation of 14–15 August 1947; the Maharaja Sayajirao University of Baroda, of which she was the first Vice-Chancellor from 1949.'
},

{
  id: 'rah.savitribai',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'rah',
  badge: 'itihaas',
  needs_review: true,
  title: 'The Teacher Who Carried a Spare Sari',
  hook: 'In 1848, a seventeen-year-old opened a school door in Pune that had been shut to girls for centuries. Walking to that door each morning took more courage than opening it.',
  hero: 'savitribai',
  cast: ['savitribai'],
  minutes: 4,
  place: ['IN-MH'],
  words_hi: [['पाठशाला', 'paathshala', 'school'], ['क़लम', 'qalam', 'pen'], ['राह', 'raah', 'path']],
  scenes: [
    { art: ['savitribai'], who: null,
      hi: '"सावित्रीबाई का जन्म 1831 में महाराष्ट्र के एक गाँव, नायगांव में हुआ था। उस ज़माने के रिवाज़ के मुताबिक बहुत छोटी उम्र में ही उनका विवाह पुणे के ज्योतिराव फुले से हो गया। ज्योतिराव उस बात पर विश्वास करते थे जो उस समय बहुत अजीब मानी जाती थी: कि उनकी पत्नी को पढ़ना-लिखना चाहिए। उन्होंने घर पर ही सावित्रीबाई को अक्षर सिखाए — और सावित्रीबाई ने पढ़ाई को ऐसे अपना लिया जैसे सूखी ज़मीन बारिश की बूँदों को समेट लेती है। उनकी ज़िंदगी का पहला दरवाज़ा अपनी ही रसोई के फ़र्श पर रखी एक स्लेट से खुला।"',
      text: 'Savitribai was born in 1831 in Naigaon, a village in Maharashtra, and married very young, as was the custom of the time, to Jyotirao Phule of Pune. Jyotirao believed something then considered strange: that his wife should read. He taught her letters at home — and Savitribai took to learning the way dry ground takes to rain. The first door of her life opened over a slate at her own kitchen floor.' },
    { art: ['savitribai'], who: null, mood: 'wow',
      hi: '"वह सिर्फ़ पढ़ने तक ही नहीं रुकीं। उन्होंने शिक्षिका बनने का पूरा प्रशिक्षण लिया — अहमदनगर और पुणे के संस्थानों से बाक़ायदा ट्रेनिंग ली — और जनवरी 1848 में, उन्होंने और ज्योतिराव ने पुणे के भिड़े वाड़ा में लड़कियों के लिए एक स्कूल खोला। सावित्रीबाई कक्षा में सबसे आगे खड़ी हुईं और पढ़ाने लगीं: ऐसा करने वाली भारत की पहली महिलाओं में से एक, भारतीयों द्वारा ही चलाए जाने वाले लड़कियों के पहले स्कूलों में से एक में, उन बच्चों को पढ़ाते हुए जिन्हें किसी भी स्कूल ने कभी नहीं चाहा था।"',
      text: 'She did not stop at reading. She trained as a teacher — proper training, at institutions in Ahmednagar and Pune — and in January 1848, she and Jyotirao opened a school for girls at Bhide Wada in Pune. Savitribai stood at the front of the class and taught: one of the first Indian women ever to do so, in one of the first schools for girls that Indians had ever run, teaching children whom no school had wanted.' },
    { art: ['savitribai'], who: null, mood: 'sad',
      hi: '"हर कोई इस बात से ख़ुश नहीं था। बहुत से लोग इस बात पर बुरी तरह भड़क उठे कि ये बच्चे पढ़ाई क्यों कर रहे हैं, और कुछ लोगों ने तो बड़ी बेरहमी से अपना गुस्सा दिखाया — स्कूल जाते समय सावित्रीबाई पर ताने कसे, और उनके कपड़ों पर कीचड़ और गोबर फेंका। उनका जवाब आज भी एक सौ सत्तर सालों से याद किया जाता है: वह अपने थैले में एक दूसरी साड़ी लेकर चलती थीं, स्कूल पहुँचकर कपड़े बदलतीं, और दिन की पढ़ाई शुरू कर देतीं। फिर अगली सुबह वह वापस आ जातीं। बस यही उनका पूरा जवाब था, और जीत उसी की हुई।"',
      text: 'Not everyone rejoiced. Many people were furious that these children should learn at all, and some showed their anger cruelly — jeering at Savitribai on her walk to school, and throwing mud and dung at her clothes. Her answer has been remembered for a hundred and seventy years: she carried a second sari in her bag, changed when she arrived, and began the day’s lessons. Then she came back the next morning. That was the whole of her argument, and it won.' },
    { art: ['savitribai'], who: null,
      hi: '"तीन ही सालों के भीतर तीन स्कूल खुल गए और उनमें लगभग डेढ़ सौ लड़कियाँ पढ़ने लगीं। सावित्रीबाई और ज्योतिराव ज़िंदगी भर नए दरवाज़े खोलते रहे — उन बड़ों के लिए कक्षाएँ जिन्हें कभी पढ़ने की इजाज़त नहीं मिली थी, और उन बच्चों के लिए एक घर जिन्हें कोई अपनाने को तैयार नहीं था। तेईस साल की उम्र में उन्होंने अपनी कविताओं की एक किताब छापी; उन कविताओं का संदेश बार-बार वही था जो उन्होंने खुद जीकर दिखाया था: जाओ, शिक्षा पाओ।"',
      text: 'Within three years there were three schools and about a hundred and fifty girls learning in them. Savitribai and Jyotirao kept opening doors all their lives — classes for grown-ups who had never been allowed to learn, a home for children no one else would take. At twenty-three she published a book of her own poems; their message, over and over, was the one she had lived: go, get education.' },
    { art: ['savitribai'], who: null,
      hi: '"1897 में, जब पुणे में प्लेग फैला, तब तक साठ से ऊपर की हो चुकी सावित्रीबाई ने बीमारों की सेवा की, और खुद भी उस बीमारी की चपेट में आ गईं। उन्होंने उसी तरह दुनिया को अलविदा कहा जैसे वह जीती थीं — उन लोगों की मदद के लिए आगे बढ़कर जिनसे बाकी सब दूर भागते थे। आज पुणे का मशहूर विश्वविद्यालय उनके नाम से जाना जाता है, और महाराष्ट्र में उनका जन्मदिन, तीन जनवरी, लड़कियों और उन्हें पढ़ाने वाले शिक्षकों के सम्मान में मनाया जाता है।"',
      text: 'In 1897, when plague came to Pune, Savitribai — by then in her sixties — worked caring for the sick, and caught the illness herself. She died as she had lived, walking toward people everyone else avoided. Today the great university of Pune carries her name, and in Maharashtra her birthday, the third of January, is kept in honour of girls and the people who teach them.' },
    { art: ['savitribai'], who: 'mithu',
      hi: '"रसोई के फ़र्श पर रखी एक स्लेट, थैले में रखी एक अतिरिक्त साड़ी, डेढ़ सौ लड़कियों के लिए खुला रखा गया एक दरवाज़ा — और अब इसे पढ़ने वाली हर लड़की के लिए। कुछ दरवाज़े बस एक बार खुलते हैं, उस एक इंसान के ज़रिए जो उनकी तरफ़ कदम बढ़ाने से कभी रुकने को तैयार नहीं होता।"',
      text: 'A slate at a kitchen floor, a spare sari in a bag, a door held open for a hundred and fifty girls — and now for every girl reading this. Some doors are opened once, by one person who simply refuses to stop walking to them.' }
  ],
  moral: 'Courage is not always loud. Sometimes it is a teacher, walking the same hard road to school every morning, until the world gives way.',
  source: 'Documented histories and biographies of Savitribai and Jyotirao Phule: the girls’ school at Bhide Wada, Pune, January 1848; her teacher training at Ahmednagar and Pune; the spare sari carried against the mud and dung flung at her, as recorded in standard accounts of her life; her poems (Kavya Phule, 1854); her death in the Pune plague of 1897; Savitribai Phule Pune University (renamed in her honour, 2014) and Maharashtra’s observance of 3 January. needs_review: this story borders caste history, kept here at a child’s level without caste vocabulary per docs/05 §6 — a named human reviewer must sign off before publish.'
},

{
  id: 'rah.ela',
  /* Hindi telling below is a DRAFT — needs a named Hindi pedagogue
     per line before launch (docs/05 §6). The audio is synthesised from
     these lines, so a correction means re-running tools/tts.py for it. */
  needs_native_speaker: true,
  collection: 'rah',
  badge: 'itihaas',
  title: 'A Bank of Four Thousand Sisters',
  hook: 'The banks said: these women cannot even sign their names. The women said: then we will build our own bank. And they did.',
  hero: 'ela_bhatt',
  cast: ['ela_bhatt'],
  minutes: 4,
  place: ['IN-GJ'],
  words_hi: [['बहन', 'bahan', 'sister'], ['टोकरी', 'tokri', 'basket'], ['हुनर', 'hunar', 'skill']],
  scenes: [
    { art: ['ela_bhatt'], who: null,
      hi: 'इला भट्ट अहमदाबाद में एक युवा वकील थीं — धीमी आवाज़ में बोलने वाली, खादी पहनने वाली और अक्सर किसी भी कमरे में सबसे शांत और सौम्य इंसान। वह उस शहर में कपड़ा मिल मज़दूरों की यूनियन के लिए काम कर रही थीं, जिसे गांधी जी ने ठीक इसी तरह के काम के लिए मशहूर किया था। लेकिन मिल के भीतर काम करने वाले मज़दूरों की तो यूनियन थी। इला की नज़र बार-बार मिल के बाहर काम करने वालों पर पड़ जाती: सिर पर कपड़ों के गट्ठर उठाए, हाथगाड़ियाँ खींचती, भोर होने से पहले घर पर पापड़ बेलती और टोकरियों में सब्ज़ियाँ बेचती औरतें। वे दिन भर कड़ी मेहनत करती थीं। और सरकारी तौर पर, उनका कोई वजूद ही नहीं था — न किसी रजिस्टर में उनका नाम था, न कोई कानून उनकी रक्षा करता था, क्योंकि वे किसी फ़ैक्ट्री की मुलाज़िम नहीं थीं।',
      text: 'Ela Bhatt was a young lawyer in Ahmedabad — soft-spoken, khadi-wearing, the gentlest person in most rooms — working for the textile workers’ union in the city Gandhi had made famous for exactly that kind of work. But the workers inside the mills had a union. Her eye kept catching the workers outside them: women carrying cloth bales on their heads, pulling handcarts, rolling papads at home before dawn, selling vegetables from baskets. They worked every daylight hour. And officially, they did not exist — no register counted them, no law protected them, because no factory owned them.' },
    { art: ['ela_bhatt'], who: null, mood: 'think',
      hi: '"नियमों की किताबों में ऐसी औरतों के लिए एक शब्द था — स्वरोज़गार — और इसे कुछ न करने का बहाना बना लिया जाता था। इला भट्ट ने इसे दूसरी नज़र से देखा: अगर वे स्वरोज़गार करती हैं, तो वे मज़दूर हैं, और मज़दूरों की अपनी यूनियन हो सकती है। 1972 में उन्होंने \'सेवा\' (सेल्फ़-एम्प्लॉयड विमेंस एसोसिएशन) की नींव रखी — एक ऐसी ट्रेड यूनियन, जिसकी नियमों की किताबों ने कभी कल्पना भी नहीं की थी। सदस्यता कार्ड की अहमियत उतनी ही बड़ी थी जितनी यूनियन की जीती हुई किसी भी चीज़ की: काग़ज़ का एक टुकड़ा, जिसने इन औरतों की ज़िंदगी में पहली बार कहा, मैं एक मज़दूर हूँ।"',
      text: 'The rulebooks had a phrase for such women — self-employed — and treated it as a reason to do nothing. Ela Bhatt read it the other way: if they are self-employed, they are workers, and workers can have a union. In 1972 she founded SEWA, the Self-Employed Women’s Association — a trade union for women the rulebooks had never imagined. The membership card mattered as much as anything the union ever won: a piece of paper that said, for the first time in these women’s lives, I am a worker.' },
    { art: ['ela_bhatt'], who: null, mood: 'sad',
      hi: 'फिर पैसों की समस्या सामने आई। यूनियन की सदस्य रोज़ाना सिक्का-सिक्का जोड़कर कमाती थीं, पर एक पैसा भी सुरक्षित रखने की कोई जगह नहीं थी — और बैंक उन्हें अपने यहाँ फटकने नहीं देते थे। कुछ औरतें अपने दस्तख़त तक नहीं कर सकती थीं; किसी के पास भी बैंक की माँगी हुई ज़मीन-जायदाद या कागज़ात नहीं थे; वे कतारें और काउंटर किसी सब्ज़ी बेचने वाली के लिए नहीं बने थे, जो लाइन में खड़े होने भर से अपनी दिन भर की कमाई गँवा देती। और बैंक बदलने वाले नहीं थे।',
      text: 'Then came the money problem. The members earned coin by coin, daily, with no safe place to keep a paisa of it — and the banks would not have them. Some of the women could not sign their names; none had the papers and property a bank wanted; the queues and the counters were not built for a vegetable seller who loses a day’s income by standing in one. The banks were not going to change.' },
    { art: ['ela_bhatt'], who: null, mood: 'wow',
      hi: 'इसलिए 1974 में, \'सेवा\' की लगभग चार हज़ार सदस्यों ने कुछ ऐसा किया जो अपनी सादगी में बेहद अनोखा था: सबने दस-दस रुपये जमा किए — दस रुपये, उन औरतों से जिन्हें बैंक लायक भी नहीं समझा जाता था — और अपना खुद का बैंक शुरू कर दिया। एक सहकारी बैंक, जिसकी मालिक खुद खाताधारक थीं, जो बोझा ढोने वाली, पापड़ बेलने वाली और ठेला खींचने वाली औरतों के लिए चलाया जाता था; और जो सदस्य दस्तख़त नहीं कर पाती थीं, बैंक ने उनके दस्तख़त की जगह उनकी तस्वीरें इस्तेमाल कीं। समस्या कभी यह थी ही नहीं कि औरतें बैंकिंग के लायक नहीं थीं। समस्या यह थी कि बैंकिंग को कभी उनके लायक बनाया ही नहीं गया था।',
      text: 'So in 1974, about four thousand SEWA members did something almost cheeky in its simplicity: they put in ten rupees each — ten rupees, from women counted as too poor to bank — and founded their own bank. A cooperative, owned by its account holders, run for headloaders and papad rollers and cart pullers; and for members who could not sign, the bank used photographs instead of signatures. The problem was never that the women did not fit banking. It was that banking had not yet been built to fit them.' },
    { art: ['ela_bhatt'], who: null,
      hi: 'बैंक टिका रहा और यूनियन बढ़ती गई — काम दर काम, शहर दर शहर, यहाँ तक कि \'सेवा\' की सदस्यों की गिनती लाखों में पहुँच गई, और यह पूरी दुनिया में कामकाजी औरतों के सबसे बड़े संगठनों में से एक बन गया। जब इला भट्ट ने आखिरकार उनकी कहानी लिखी, तो उन्होंने किताब को एक ऐसा नाम दिया जो इस पूरी अलमारी की सारी किताबों का निचोड़ कह देता है: \'वी आर पुअर बट सो मेनी\' (हम गरीब हैं पर हमारी गिनती बहुत है)।',
      text: 'The bank held, and the union grew — trade by trade, town by town, until SEWA counted its members in the millions, one of the largest organisations of working women anywhere on Earth. When Ela Bhatt finally wrote their story down, she gave the book a title that says everything this shelf could hope to: We Are Poor but So Many.' },
    { art: ['ela_bhatt'], who: 'mithu',
      hi: 'दस रुपये बहुत छोटी रकम होती है। चार हज़ार बार दस मिलकर एक बैंक बन जाता है। टोकरी उठाए एक औरत किसी को नज़र नहीं आती; पर हाथ में सदस्यता कार्ड थामे दस लाख औरतें अनदेखी नहीं की जा सकतीं। \'एक साथ\' सिर्फ़ एक अच्छा शब्द नहीं है — यह तो सीधा-सा गणित है।',
      text: 'Ten rupees is small. Four thousand tens is a bank. One woman with a basket is invisible; a million of them, holding membership cards, are impossible to un-see. Together is not just a nice word — it is arithmetic.' }
  ],
  moral: 'Alone, ten rupees is small; four thousand tens is a bank. Dignity is built the same way — together.',
  source: 'SEWA’s own institutional history: founded by Ela Bhatt in Ahmedabad in 1972 as a trade union of self-employed women; the SEWA Cooperative Bank of 1974, capitalised by about four thousand members at ₹10 each, using photo identification for members who could not sign; Ela Bhatt’s memoir "We Are Poor but So Many" (2006).'
}
];

window.IND_COLLECTIONS_MODERN = [
  { id: 'khel', name: 'Khel — India at Play',
    note: 'Real athletes, real records — a wizard with a hockey stick, a boxer from the hills, a spear from a wheat field. Girls and boys, north and south: champions come from everywhere.',
    avatar: 'dhyanchand' },
  { id: 'naya', name: 'Naya India — The Builders',
    note: 'The people who built modern India’s everyday magic — the milk, the software, the rockets, the little payment square at the chai stall. The awe is in the making.',
    avatar: 'rocket' },
  { id: 'rah', name: 'Rah Banane Wale — The Pathbreakers',
    note: 'Four people who found a door shut — a brewery, a bank, a school, a line in the world’s rulebook — and opened it so it never quite shut again.',
    avatar: 'kiran_shaw' }
];
