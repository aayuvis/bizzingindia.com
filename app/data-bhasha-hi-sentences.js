/* Bizzing India — example sentences for the Hindi lexicon (Phase 3 of the
   Bhasha rebuild).

   Contract: window.IND_BHASHA_SENTENCES.hi = { '<word>': { s, roman, en } } — the
   engine attaches them to pack 'hi' at load and masks the word when speaking.
   One entry per HI_LEX row (507). KEYS ARE BYTE-FOR-BYTE the lexicon's own
   spellings — nukta stays decomposed exactly as bhasha.js writes it — and
   every sentence contains its word verbatim, uninflected, exactly once,
   because the engine masks by plain string match. Inflect the sentence
   around the word, never the word. Everything is NFC (for Devanagari nukta,
   NFC *is* the decomposed form, so the two rules agree).

   Craft (docs/09 §4 — no invented context): a child of 6-10 says or hears
   each of these at home. 3-10 words, present-day, warm; the furniture is the
   culture pillars' own — nani and dadi, the mela, the diya, rangoli, gully
   cricket, the monsoon, chai, kahani. Elders take aap/honorific plural.
   Named festivals are deliberately rare (rakhi, Holi, 15 August — that's the
   whole list) per the internal-diversity rule; mandir, gurdwara, masjid and
   girjaghar each get the same warm treatment.

   NEEDS A NATIVE CHECK PER LINE BEFORE LAUNCH (same flag as data-nani.js):
   a Hindi-language pedagogue must sign off every sentence. Specific flags
   for that review are listed at the bottom of this file. */
/* PHASE A: registered into the shared per-pack bank rather than a Hindi-only
   global, so all nine packs reach their sentences by one route. */
window.IND_BHASHA_SENTENCES = window.IND_BHASHA_SENTENCES || {};
window.IND_BHASHA_SENTENCES.hi = {

  /* ---- greetings ---- */
  'नमस्ते':
    { s: 'नमस्ते, आप कैसे हैं?',
      roman: 'Namaste, aap kaise hain?',
      en: 'Hello, how are you?' },
  'हाँ':
    { s: 'हाँ, मुझे आम चाहिए।',
      roman: 'Haan, mujhe aam chaahiye.',
      en: 'Yes, I want a mango.' },
  'नहीं':
    { s: 'नहीं, आज छुट्टी है।',
      roman: 'Nahin, aaj chhutti hai.',
      en: 'No, today is a holiday.' },
  'अच्छा':
    { s: 'अच्छा, अब सो जाओ।',
      roman: 'Achchha, ab so jao.',
      en: 'Okay, now go to sleep.' },
  'धन्यवाद':
    { s: 'खाना बहुत अच्छा था, धन्यवाद!',
      roman: 'Khaana bahut achchha tha, dhanyavaad!',
      en: 'The food was very good, thank you!' },
  'शुक्रिया':
    { s: 'मदद के लिए शुक्रिया, भैया!',
      roman: 'Madad ke liye shukriya, bhaiya!',
      en: 'Thanks for the help, bhaiya!' },
  'नमस्कार':
    { s: 'दादा जी ने कहा, नमस्कार!',
      roman: 'Dada ji ne kaha, namaskaar!',
      en: 'Dada ji said, "Namaskaar!"' },
  'अलविदा':
    { s: 'अलविदा कहकर मामा चले गए।',
      roman: 'Alvida kahkar mama chale gaye.',
      en: 'Mama said goodbye and left.' },
  'जी':
    { s: 'जी, मैं अभी आती हूँ।',
      roman: 'Ji, main abhi aati hoon.',
      en: 'Yes, I am coming right now.' },
  'कृपया':
    { s: 'कृपया दरवाज़ा बंद करो।',
      roman: 'Kripya darwaaza band karo.',
      en: 'Please close the door.' },

  /* ---- family ---- */
  'माँ':
    { s: 'माँ रसोई में हैं।',
      roman: 'Maa rasoi mein hain.',
      en: 'Mother is in the kitchen.' },
  'पापा':
    { s: 'पापा हमें रोज़ स्कूल छोड़ते हैं।',
      roman: 'Papa hamein roz skool chhodte hain.',
      en: 'Papa drops us at school every day.' },
  'भाई':
    { s: 'मेरा भाई क्रिकेट खेलता है।',
      roman: 'Mera bhai cricket khelta hai.',
      en: 'My brother plays cricket.' },
  'बहन':
    { s: 'मेरी बहन को रंगोली पसंद है।',
      roman: 'Meri bahan ko rangoli pasand hai.',
      en: 'My sister likes rangoli.' },
  'दादा':
    { s: 'दादा जी अख़बार पढ़ते हैं।',
      roman: 'Dada ji akhbaar padhte hain.',
      en: 'Dada ji reads the newspaper.' },
  'दादी':
    { s: 'दादी रात को कहानी सुनाती हैं।',
      roman: 'Dadi raat ko kahaani sunaati hain.',
      en: 'Dadi tells a story at night.' },
  'नाना':
    { s: 'नाना जी हमें मेले ले गए।',
      roman: 'Nana ji hamein mele le gaye.',
      en: 'Nana ji took us to the fair.' },
  'नानी':
    { s: 'नानी हर साल हमसे मिलने आती हैं।',
      roman: 'Nani har saal hamse milne aati hain.',
      en: 'Nani comes to see us every year.' },
  'बच्चा':
    { s: 'हर बच्चा कहानी सुनना चाहता है।',
      roman: 'Har bachcha kahaani sunna chaahta hai.',
      en: 'Every child wants to hear a story.' },
  'परिवार':
    { s: 'पूरा परिवार साथ खाना खाता है।',
      roman: 'Poora parivaar saath khaana khaata hai.',
      en: 'The whole family eats together.' },
  'बेटा':
    { s: 'दादी बोलीं, बेटा, पानी लाओ।',
      roman: 'Dadi boleen, beta, paani lao.',
      en: 'Dadi said, "Beta, bring some water."' },
  'बेटी':
    { s: 'मौसी की बेटी मेरी दोस्त है।',
      roman: 'Mausi ki beti meri dost hai.',
      en: 'Mausi\'s daughter is my friend.' },
  'दोस्त':
    { s: 'स्कूल में मेरे तीन दोस्त हैं।',
      roman: 'Skool mein mere teen dost hain.',
      en: 'I have three friends at school.' },

  /* ---- food ---- */
  'पानी':
    { s: 'मुझे ठंडा पानी चाहिए।',
      roman: 'Mujhe thanda paani chaahiye.',
      en: 'I want cold water.' },
  'रोटी':
    { s: 'माँ गरम रोटी बना रही हैं।',
      roman: 'Maa garam roti bana rahi hain.',
      en: 'Mother is making hot rotis.' },
  'दूध':
    { s: 'रात को एक गिलास दूध पियो।',
      roman: 'Raat ko ek gilaas doodh piyo.',
      en: 'Drink a glass of milk at night.' },
  'चावल':
    { s: 'खीर चावल और दूध से बनती है।',
      roman: 'Kheer chaawal aur doodh se banti hai.',
      en: 'Kheer is made from rice and milk.' },
  'दाल':
    { s: 'गरम दाल में घी डालो।',
      roman: 'Garam daal mein ghee daalo.',
      en: 'Put some ghee in the hot daal.' },
  'खाना':
    { s: 'खाना तैयार है, आ जाओ!',
      roman: 'Khaana taiyaar hai, aa jao!',
      en: 'The food is ready, come!' },
  'आम':
    { s: 'गर्मी में आम सबसे अच्छे लगते हैं।',
      roman: 'Garmi mein aam sabse achchhe lagte hain.',
      en: 'Mangoes taste best in summer.' },
  'केला':
    { s: 'बंदर ने केला छीन लिया!',
      roman: 'Bandar ne kela chheen liya!',
      en: 'The monkey snatched the banana!' },
  'चाय':
    { s: 'दादा जी सुबह चाय पीते हैं।',
      roman: 'Dada ji subah chai peete hain.',
      en: 'Dada ji drinks tea in the morning.' },
  'मिठाई':
    { s: 'त्योहार पर घर में मिठाई बनती है।',
      roman: 'Tyohaar par ghar mein mithai banti hai.',
      en: 'Sweets are made at home on a festival.' },
  'नमक':
    { s: 'दाल में थोड़ा नमक डालो।',
      roman: 'Daal mein thoda namak daalo.',
      en: 'Add a little salt to the daal.' },
  'फल':
    { s: 'रोज़ एक फल ज़रूर खाओ।',
      roman: 'Roz ek phal zaroor khao.',
      en: 'Do eat one fruit every day.' },
  'सब्ज़ी':
    { s: 'पापा बाज़ार से सब्ज़ी लाए।',
      roman: 'Papa baazaar se sabzi laaye.',
      en: 'Papa brought vegetables from the market.' },

  /* ---- body ---- */
  'सिर':
    { s: 'सिर पर टोपी पहनो।',
      roman: 'Sir par topi pahno.',
      en: 'Wear a cap on your head.' },
  'आँख':
    { s: 'एक आँख बंद करके देखो।',
      roman: 'Ek aankh band karke dekho.',
      en: 'Look with one eye closed.' },
  'नाक':
    { s: 'ठंड में मेरी नाक लाल हो गई।',
      roman: 'Thand mein meri naak laal ho gayi.',
      en: 'My nose turned red in the cold.' },
  'कान':
    { s: 'हाथी के कान बड़े होते हैं।',
      roman: 'Haathi ke kaan bade hote hain.',
      en: 'An elephant\'s ears are big.' },
  'मुँह':
    { s: 'सुबह उठकर मुँह धोते हैं।',
      roman: 'Subah uthkar munh dhote hain.',
      en: 'We wash our face when we get up in the morning.' },
  'हाथ':
    { s: 'खाने से पहले हाथ धोओ।',
      roman: 'Khaane se pahle haath dhoo.',
      en: 'Wash your hands before eating.' },
  'पैर':
    { s: 'नाचते समय पैर थक गए।',
      roman: 'Naachte samay pair thak gaye.',
      en: 'My feet got tired while dancing.' },
  'पेट':
    { s: 'समोसे खाकर पेट भर गया।',
      roman: 'Samose khaakar pet bhar gaya.',
      en: 'My tummy is full from eating samosas.' },
  'बाल':
    { s: 'नानी मेरे बाल बनाती हैं।',
      roman: 'Nani mere baal banaati hain.',
      en: 'Nani does my hair.' },
  'दाँत':
    { s: 'रात को दाँत साफ़ करो।',
      roman: 'Raat ko daant saaf karo.',
      en: 'Clean your teeth at night.' },

  /* ---- home ---- */
  'घर':
    { s: 'दादी का घर गाँव में है।',
      roman: 'Dadi ka ghar gaanv mein hai.',
      en: 'Dadi\'s house is in the village.' },
  'दरवाज़ा':
    { s: 'हवा से दरवाज़ा खुल गया।',
      roman: 'Hava se darwaaza khul gaya.',
      en: 'The door blew open in the wind.' },
  'खिड़की':
    { s: 'खिड़की से बारिश देखो।',
      roman: 'Khidki se baarish dekho.',
      en: 'Watch the rain from the window.' },
  'कुर्सी':
    { s: 'दादा जी की कुर्सी आँगन में है।',
      roman: 'Dada ji ki kursi aangan mein hai.',
      en: 'Dada ji\'s chair is in the courtyard.' },
  'मेज़':
    { s: 'मेज़ पर किताबें रखी हैं।',
      roman: 'Mez par kitaaben rakhi hain.',
      en: 'Books are kept on the table.' },
  'चाबी':
    { s: 'अलमारी की चाबी खो गई!',
      roman: 'Almaari ki chaabi kho gayi!',
      en: 'The cupboard key is lost!' },
  'बिस्तर':
    { s: 'सोने से पहले बिस्तर ठीक करो।',
      roman: 'Sone se pahle bistar theek karo.',
      en: 'Straighten your bed before sleeping.' },
  'छत':
    { s: 'छत पर पतंग उड़ाते हैं।',
      roman: 'Chhat par patang udaate hain.',
      en: 'We fly kites on the roof.' },
  'रसोई':
    { s: 'रसोई से खीर की खुशबू आई।',
      roman: 'Rasoi se kheer ki khushboo aayi.',
      en: 'The smell of kheer came from the kitchen.' },
  'कमरा':
    { s: 'मेरा कमरा छोटा पर सुंदर है।',
      roman: 'Mera kamra chhota par sundar hai.',
      en: 'My room is small but beautiful.' },

  /* ---- basics ---- */
  'मैं':
    { s: 'मैं और दीदी साथ खेलते हैं।',
      roman: 'Main aur didi saath khelte hain.',
      en: 'Didi and I play together.' },
  'तुम':
    { s: 'तुम मेरे अच्छे दोस्त हो।',
      roman: 'Tum mere achchhe dost ho.',
      en: 'You are my good friend.' },
  'आप':
    { s: 'आप बैठिए, मैं पानी लाती हूँ।',
      roman: 'Aap baithiye, main paani laati hoon.',
      en: 'Please sit, I will bring water.' },
  'यह':
    { s: 'यह मेरी नानी का घर है।',
      roman: 'Yah meri nani ka ghar hai.',
      en: 'This is my nani\'s house.' },
  'वह':
    { s: 'वह पतंग कितनी ऊँची है!',
      roman: 'Vah patang kitni oonchi hai!',
      en: 'That kite is so high!' },
  'हम':
    { s: 'हम शाम को पार्क जाते हैं।',
      roman: 'Ham shaam ko paark jaate hain.',
      en: 'We go to the park in the evening.' },
  'मेरा':
    { s: 'मेरा बस्ता नीला है।',
      roman: 'Mera basta neela hai.',
      en: 'My school bag is blue.' },
  'क्या':
    { s: 'क्या तुम्हें कहानी सुननी है?',
      roman: 'Kya tumhein kahaani sunni hai?',
      en: 'Do you want to hear a story?' },
  'कौन':
    { s: 'दरवाज़े पर कौन है?',
      roman: 'Darwaaze par kaun hai?',
      en: 'Who is at the door?' },
  'कहाँ':
    { s: 'मेरी चप्पल कहाँ है?',
      roman: 'Meri chappal kahaan hai?',
      en: 'Where are my slippers?' },
  'बड़ा':
    { s: 'हाथी कितना बड़ा होता है!',
      roman: 'Haathi kitna bada hota hai!',
      en: 'How big an elephant is!' },
  'छोटा':
    { s: 'मेरा भाई मुझसे छोटा है।',
      roman: 'Mera bhai mujhse chhota hai.',
      en: 'My brother is younger than me.' },
  'बहुत':
    { s: 'मुझे यह कहानी बहुत पसंद है।',
      roman: 'Mujhe yah kahaani bahut pasand hai.',
      en: 'I like this story very much.' },
  'ठीक':
    { s: 'सब ठीक है, चिंता मत करो।',
      roman: 'Sab theek hai, chinta mat karo.',
      en: 'Everything is fine, don\'t worry.' },

  /* ---- actions ---- */
  'है':
    { s: 'यह मेरा घर है।',
      roman: 'Yah mera ghar hai.',
      en: 'This is my house.' },
  'हूँ':
    { s: 'मैं ठीक हूँ।',
      roman: 'Main theek hoon.',
      en: 'I am fine.' },
  'हैं':
    { s: 'दादी घर पर हैं।',
      roman: 'Dadi ghar par hain.',
      en: 'Dadi is at home.' },
  'हो':
    { s: 'तुम कैसे हो?',
      roman: 'Tum kaise ho?',
      en: 'How are you?' },
  'खेलना':
    { s: 'मुझे बाहर खेलना है।',
      roman: 'Mujhe baahar khelna hai.',
      en: 'I want to play outside.' },
  'पीना':
    { s: 'खेल के बाद पानी पीना ज़रूरी है।',
      roman: 'Khel ke baad paani peena zaroori hai.',
      en: 'Drinking water after playing is important.' },
  'सोना':
    { s: 'अब मुझे सोना है।',
      roman: 'Ab mujhe sona hai.',
      en: 'Now I want to sleep.' },
  'जाना':
    { s: 'हमें नानी के घर जाना है।',
      roman: 'Hamein nani ke ghar jaana hai.',
      en: 'We have to go to Nani\'s house.' },
  'आना':
    { s: 'कल मेरे घर ज़रूर आना।',
      roman: 'Kal mere ghar zaroor aana.',
      en: 'Do come to my house tomorrow.' },
  'देखना':
    { s: 'छत से तारे देखना अच्छा लगता है।',
      roman: 'Chhat se taare dekhna achchha lagta hai.',
      en: 'Watching stars from the roof feels good.' },
  'करना':
    { s: 'सबकी मदद करना अच्छी बात है।',
      roman: 'Sabki madad karna achchhi baat hai.',
      en: 'Helping everyone is a good thing.' },
  'देना':
    { s: 'पौधों को पानी देना मत भूलो।',
      roman: 'Paudhon ko paani dena mat bhoolo.',
      en: 'Don\'t forget to give water to the plants.' },
  'कहना':
    { s: 'कुछ कहना हो तो हाथ उठाओ।',
      roman: 'Kuchh kahna ho to haath uthao.',
      en: 'Raise your hand if you want to say something.' },

  /* ---- numbers ---- */
  'एक':
    { s: 'मेरे पास सिर्फ़ एक रुपया है।',
      roman: 'Mere paas sirf ek rupaya hai.',
      en: 'I have only one rupee.' },
  'दो':
    { s: 'मेरे पास दो आम हैं।',
      roman: 'Mere paas do aam hain.',
      en: 'I have two mangoes.' },
  'तीन':
    { s: 'पेड़ पर तीन तोते बैठे हैं।',
      roman: 'Ped par teen tote baithe hain.',
      en: 'Three parrots are sitting on the tree.' },
  'चार':
    { s: 'गाड़ी के चार पहिये होते हैं।',
      roman: 'Gaadi ke chaar pahiye hote hain.',
      en: 'A car has four wheels.' },
  'पाँच':
    { s: 'मेरे हाथ में पाँच उँगलियाँ हैं।',
      roman: 'Mere haath mein paanch ungliyaan hain.',
      en: 'There are five fingers on my hand.' },
  'छह':
    { s: 'मैं छह साल की हूँ।',
      roman: 'Main chhah saal ki hoon.',
      en: 'I am six years old.' },
  'सात':
    { s: 'इंद्रधनुष में सात रंग होते हैं।',
      roman: 'Indradhanush mein saat rang hote hain.',
      en: 'A rainbow has seven colours.' },
  'आठ':
    { s: 'हम रोज़ आठ बजे सोते हैं।',
      roman: 'Ham roz aath baje sote hain.',
      en: 'We sleep at eight every day.' },
  'नौ':
    { s: 'मेरा भाई नौ साल का है।',
      roman: 'Mera bhai nau saal ka hai.',
      en: 'My brother is nine years old.' },
  'दस':
    { s: 'यह पतंग दस रुपये की है।',
      roman: 'Yah patang das rupaye ki hai.',
      en: 'This kite costs ten rupees.' },

  /* ---- colours ---- */
  'लाल':
    { s: 'मेरे पास एक लाल गुब्बारा है।',
      roman: 'Mere paas ek laal gubbaara hai.',
      en: 'I have a red balloon.' },
  'नीला':
    { s: 'समुद्र दूर से नीला दिखता है।',
      roman: 'Samudra door se neela dikhta hai.',
      en: 'The sea looks blue from far away.' },
  'पीला':
    { s: 'पका आम पीला होता है।',
      roman: 'Paka aam peela hota hai.',
      en: 'A ripe mango is yellow.' },
  'हरा':
    { s: 'बारिश के बाद खेत हरा हो गया।',
      roman: 'Baarish ke baad khet hara ho gaya.',
      en: 'The field turned green after the rain.' },
  'काला':
    { s: 'काला बादल बारिश लाता है।',
      roman: 'Kaala baadal baarish laata hai.',
      en: 'A black cloud brings rain.' },
  'सफ़ेद':
    { s: 'बर्फ़ का रंग सफ़ेद होता है।',
      roman: 'Barf ka rang safed hota hai.',
      en: 'Snow is white.' },

  /* ---- animals ---- */
  'कुत्ता':
    { s: 'पड़ोसी का कुत्ता बहुत प्यारा है।',
      roman: 'Padosi ka kutta bahut pyaara hai.',
      en: 'The neighbour\'s dog is very sweet.' },
  'बिल्ली':
    { s: 'बिल्ली ने दूध पी लिया!',
      roman: 'Billi ne doodh pee liya!',
      en: 'The cat drank the milk!' },
  'गाय':
    { s: 'गाँव में नानी की गाय है।',
      roman: 'Gaanv mein nani ki gaay hai.',
      en: 'Nani has a cow in the village.' },
  'हाथी':
    { s: 'हमने मेले में हाथी देखा।',
      roman: 'Hamne mele mein haathi dekha.',
      en: 'We saw an elephant at the fair.' },
  'चिड़िया':
    { s: 'चिड़िया छत पर दाना चुगती है।',
      roman: 'Chidiya chhat par daana chugti hai.',
      en: 'The bird pecks at grain on the roof.' },
  'मछली':
    { s: 'मछली पानी में तैरती है।',
      roman: 'Machhli paani mein tairti hai.',
      en: 'The fish swims in water.' },

  /* ---- time ---- */
  'आज':
    { s: 'आज मौसम बहुत अच्छा है।',
      roman: 'Aaj mausam bahut achchha hai.',
      en: 'The weather is very nice today.' },
  'कल':
    { s: 'कल हम नानी के घर जाएँगे।',
      roman: 'Kal ham nani ke ghar jaayenge.',
      en: 'Tomorrow we will go to Nani\'s house.' },
  'सुबह':
    { s: 'सुबह सूरज पूरब से निकलता है।',
      roman: 'Subah sooraj poorab se nikalta hai.',
      en: 'The sun rises in the east in the morning.' },
  'रात':
    { s: 'रात में तारे चमकते हैं।',
      roman: 'Raat mein taare chamakte hain.',
      en: 'Stars shine at night.' },

  /* ---- feelings ---- */
  'खुश':
    { s: 'मिठाई देखकर सब खुश हो गए।',
      roman: 'Mithai dekhkar sab khush ho gaye.',
      en: 'Everyone got happy on seeing the sweets.' },
  'भूखा':
    { s: 'खेलकर भाई भूखा हो गया।',
      roman: 'Khelkar bhai bhookha ho gaya.',
      en: 'Brother got hungry after playing.' },
  'प्यार':
    { s: 'नानी हमें बहुत प्यार करती हैं।',
      roman: 'Nani hamein bahut pyaar karti hain.',
      en: 'Nani loves us very much.' },

  /* ---- greetings ---- */
  'प्रणाम':
    { s: 'दादा जी को प्रणाम करो।',
      roman: 'Dada ji ko pranaam karo.',
      en: 'Do pranaam to Dada ji.' },
  'सुप्रभात':
    { s: 'सुप्रभात! उठो, सुबह हो गई।',
      roman: 'Suprabhaat! Utho, subah ho gayi.',
      en: 'Good morning! Get up, it\'s morning.' },
  'शुभ रात्रि':
    { s: 'सोने से पहले बोलो, शुभ रात्रि!',
      roman: 'Sone se pahle bolo, shubh raatri!',
      en: 'Before sleeping, say good night!' },
  'माफ़ करना':
    { s: 'मुझसे ग़लती हुई, माफ़ करना।',
      roman: 'Mujhse galti hui, maaf karna.',
      en: 'I made a mistake, sorry.' },
  'स्वागत':
    { s: 'घर आए मेहमान का स्वागत करो।',
      roman: 'Ghar aaye mehmaan ka svaagat karo.',
      en: 'Welcome the guest who comes home.' },
  'बधाई':
    { s: 'जन्मदिन की बधाई, भैया!',
      roman: 'Janmadin ki badhaai, bhaiya!',
      en: 'Happy birthday, bhaiya!' },
  'फिर मिलेंगे':
    { s: 'अलविदा नहीं, हम फिर मिलेंगे।',
      roman: 'Alvida nahin, ham phir milenge.',
      en: 'Not goodbye — we will meet again.' },

  /* ---- family ---- */
  'चाचा':
    { s: 'चाचा हमारे साथ क्रिकेट खेलते हैं।',
      roman: 'Chacha hamaare saath cricket khelte hain.',
      en: 'Chacha plays cricket with us.' },
  'चाची':
    { s: 'चाची ने मुझे नई चूड़ियाँ दीं।',
      roman: 'Chachi ne mujhe nayi choodiyaan deen.',
      en: 'Chachi gave me new bangles.' },
  'मामा':
    { s: 'छुट्टी में हम मामा के घर गए।',
      roman: 'Chhutti mein ham mama ke ghar gaye.',
      en: 'In the holidays we went to Mama\'s house.' },
  'मामी':
    { s: 'मामी ने आँगन में रंगोली बनाई।',
      roman: 'Mami ne aangan mein rangoli banaai.',
      en: 'Mami made a rangoli in the courtyard.' },
  'मौसी':
    { s: 'मौसी माँ की बहन होती हैं।',
      roman: 'Mausi maa ki bahan hoti hain.',
      en: 'Mausi is mother\'s sister.' },
  'बुआ':
    { s: 'बुआ पापा को राखी भेजती हैं।',
      roman: 'Bua papa ko raakhi bhejti hain.',
      en: 'Bua sends Papa a rakhi.' },
  'भैया':
    { s: 'भैया मुझे साइकिल सिखाते हैं।',
      roman: 'Bhaiya mujhe saaikil sikhaate hain.',
      en: 'Bhaiya teaches me to ride a bicycle.' },
  'दीदी':
    { s: 'दीदी मुझे पढ़ाई में मदद करती हैं।',
      roman: 'Didi mujhe padhaai mein madad karti hain.',
      en: 'Didi helps me with my studies.' },
  'लड़का':
    { s: 'वह लड़का मेरी कक्षा में है।',
      roman: 'Vah ladka meri kaksha mein hai.',
      en: 'That boy is in my class.' },
  'लड़की':
    { s: 'वह लड़की बहुत तेज़ दौड़ती है।',
      roman: 'Vah ladki bahut tez daudti hai.',
      en: 'That girl runs very fast.' },
  'आदमी':
    { s: 'वह आदमी सब्ज़ी बेचता है।',
      roman: 'Vah aadmi sabzi bechta hai.',
      en: 'That man sells vegetables.' },
  'औरत':
    { s: 'वह औरत मिट्टी के दीये बनाती है।',
      roman: 'Vah aurat mitti ke diye banaati hai.',
      en: 'That woman makes clay lamps.' },
  'पति':
    { s: 'नानी के पति मेरे नाना हैं।',
      roman: 'Nani ke pati mere nana hain.',
      en: 'Nani\'s husband is my nana.' },
  'पत्नी':
    { s: 'मामा की पत्नी मामी होती हैं।',
      roman: 'Mama ki patni mami hoti hain.',
      en: 'Mama\'s wife is mami.' },
  'पड़ोसी':
    { s: 'हमारे पड़ोसी बहुत अच्छे हैं।',
      roman: 'Hamaare padosi bahut achchhe hain.',
      en: 'Our neighbours are very nice.' },
  'मेहमान':
    { s: 'आज घर में मेहमान आए हैं।',
      roman: 'Aaj ghar mein mehmaan aaye hain.',
      en: 'Guests have come to our house today.' },

  /* ---- food ---- */
  'सेब':
    { s: 'लाल सेब मीठा होता है।',
      roman: 'Laal seb meetha hota hai.',
      en: 'A red apple is sweet.' },
  'संतरा':
    { s: 'सर्दी में संतरा खूब मिलता है।',
      roman: 'Sardi mein santara khoob milta hai.',
      en: 'Oranges are everywhere in winter.' },
  'अंगूर':
    { s: 'अंगूर छोटे और मीठे होते हैं।',
      roman: 'Angoor chhote aur meethe hote hain.',
      en: 'Grapes are small and sweet.' },
  'अनार':
    { s: 'अनार के दाने लाल होते हैं।',
      roman: 'Anaar ke daane laal hote hain.',
      en: 'Pomegranate seeds are red.' },
  'तरबूज़':
    { s: 'गर्मी में तरबूज़ ठंडक देता है।',
      roman: 'Garmi mein tarbooz thandak deta hai.',
      en: 'Watermelon cools you down in summer.' },
  'आलू':
    { s: 'मुझे आलू का पराठा पसंद है।',
      roman: 'Mujhe aaloo ka paraatha pasand hai.',
      en: 'I like potato paratha.' },
  'प्याज़':
    { s: 'प्याज़ काटते समय आँसू आते हैं।',
      roman: 'Pyaaz kaatte samay aansoo aate hain.',
      en: 'Cutting onions brings tears.' },
  'टमाटर':
    { s: 'टमाटर लाल और गोल होता है।',
      roman: 'Tamaatar laal aur gol hota hai.',
      en: 'A tomato is red and round.' },
  'गाजर':
    { s: 'सर्दी में गाजर का हलवा बनता है।',
      roman: 'Sardi mein gaajar ka halva banta hai.',
      en: 'Carrot halwa is made in winter.' },
  'मटर':
    { s: 'हम साथ बैठकर मटर छीलते हैं।',
      roman: 'Ham saath baithkar matar chheelte hain.',
      en: 'We sit together and shell peas.' },
  'भिंडी':
    { s: 'आज खाने में भिंडी बनी है।',
      roman: 'Aaj khaane mein bhindi bani hai.',
      en: 'Okra has been cooked for today\'s meal.' },
  'पालक':
    { s: 'पालक खाने से ताक़त मिलती है।',
      roman: 'Paalak khaane se taaqat milti hai.',
      en: 'Eating spinach makes you strong.' },
  'अंडा':
    { s: 'चिड़िया का अंडा घोंसले में है।',
      roman: 'Chidiya ka anda ghonsle mein hai.',
      en: 'The bird\'s egg is in the nest.' },
  'घी':
    { s: 'गरम रोटी पर घी लगाओ।',
      roman: 'Garam roti par ghee lagao.',
      en: 'Spread ghee on the hot roti.' },
  'मक्खन':
    { s: 'पराठे पर मक्खन अच्छा लगता है।',
      roman: 'Paraathe par makkhan achchha lagta hai.',
      en: 'Butter tastes good on a paratha.' },
  'दही':
    { s: 'माँ रात को दही जमाती हैं।',
      roman: 'Maa raat ko dahi jamaati hain.',
      en: 'Mother sets the yoghurt at night.' },
  'पनीर':
    { s: 'मुझे मटर पनीर पसंद है।',
      roman: 'Mujhe matar paneer pasand hai.',
      en: 'I like matar paneer.' },
  'चीनी':
    { s: 'चाय में थोड़ी चीनी डालो।',
      roman: 'Chai mein thodi cheeni daalo.',
      en: 'Put a little sugar in the tea.' },
  'मिर्च':
    { s: 'हरी मिर्च बहुत तेज़ होती है।',
      roman: 'Hari mirch bahut tez hoti hai.',
      en: 'A green chilli is very hot.' },
  'मसाला':
    { s: 'मसाला डालते ही खुशबू उठी।',
      roman: 'Masaala daalte hi khushboo uthi.',
      en: 'The spices went in and the aroma rose.' },
  'हल्दी':
    { s: 'हल्दी दूध में डालकर पियो।',
      roman: 'Haldi doodh mein daalkar piyo.',
      en: 'Drink your milk with turmeric in it.' },
  'अचार':
    { s: 'नानी आम का अचार बनाती हैं।',
      roman: 'Nani aam ka achaar banaati hain.',
      en: 'Nani makes mango pickle.' },
  'चटनी':
    { s: 'समोसे के साथ चटनी अच्छी लगती है।',
      roman: 'Samose ke saath chatni achchhi lagti hai.',
      en: 'Chutney goes well with a samosa.' },
  'पराठा':
    { s: 'रविवार को नाश्ते में पराठा बना।',
      roman: 'Ravivaar ko naashte mein paraatha bana.',
      en: 'Paratha was made for breakfast on Sunday.' },
  'पूरी':
    { s: 'गरम पूरी फूलकर गोल हो गई!',
      roman: 'Garam poori phoolkar gol ho gayi!',
      en: 'The hot poori puffed up round!' },
  'समोसा':
    { s: 'शाम की चाय के साथ समोसा मिला।',
      roman: 'Shaam ki chai ke saath samosa mila.',
      en: 'We got a samosa with the evening tea.' },
  'लड्डू':
    { s: 'डिब्बे में लड्डू रखे हैं।',
      roman: 'Dibbe mein laddoo rakhe hain.',
      en: 'Laddoos are kept in the box.' },
  'खीर':
    { s: 'जन्मदिन पर दादी खीर बनाती हैं।',
      roman: 'Janmadin par dadi kheer banaati hain.',
      en: 'Dadi makes kheer on birthdays.' },
  'हलवा':
    { s: 'सूजी का हलवा जल्दी बनता है।',
      roman: 'Sooji ka halva jaldi banta hai.',
      en: 'Semolina halwa cooks quickly.' },
  'बिस्कुट':
    { s: 'चाय में बिस्कुट डुबाकर खाओ।',
      roman: 'Chai mein biskut dubaakar khao.',
      en: 'Dunk the biscuit in the tea and eat it.' },
  'नाश्ता':
    { s: 'सुबह का नाश्ता ज़रूर करो।',
      roman: 'Subah ka naashta zaroor karo.',
      en: 'Always eat your breakfast in the morning.' },
  'तेल':
    { s: 'कड़ाही में तेल गरम हो रहा है।',
      roman: 'Kadaahi mein tel garam ho raha hai.',
      en: 'The oil is heating in the pan.' },
  'आटा':
    { s: 'माँ आटा गूँध रही हैं।',
      roman: 'Maa aata goondh rahi hain.',
      en: 'Mother is kneading the dough.' },
  'शहद':
    { s: 'भालू को शहद बहुत पसंद है।',
      roman: 'Bhaaloo ko shahad bahut pasand hai.',
      en: 'Bears love honey.' },

  /* ---- body ---- */
  'चेहरा':
    { s: 'हँसता चेहरा सबको अच्छा लगता है।',
      roman: 'Hansta chehra sabko achchha lagta hai.',
      en: 'Everyone likes a smiling face.' },
  'माथा':
    { s: 'माँ माथा चूमकर सुलाती हैं।',
      roman: 'Maa maatha choomkar sulaati hain.',
      en: 'Mother kisses my forehead and puts me to sleep.' },
  'गाल':
    { s: 'ठंड से गाल लाल हो गए।',
      roman: 'Thand se gaal laal ho gaye.',
      en: 'My cheeks turned red in the cold.' },
  'होंठ':
    { s: 'सर्दी में होंठ सूख जाते हैं।',
      roman: 'Sardi mein honth sookh jaate hain.',
      en: 'Lips get dry in winter.' },
  'जीभ':
    { s: 'जीभ से हम स्वाद चखते हैं।',
      roman: 'Jeebh se ham svaad chakhte hain.',
      en: 'We taste with our tongue.' },
  'गला':
    { s: 'गला ख़राब है, गरम पानी पियो।',
      roman: 'Gala kharaab hai, garam paani piyo.',
      en: 'Your throat is sore — drink warm water.' },
  'गर्दन':
    { s: 'जिराफ़ की गर्दन लंबी होती है।',
      roman: 'Jiraaf ki gardan lambi hoti hai.',
      en: 'A giraffe\'s neck is long.' },
  'कंधा':
    { s: 'पापा का कंधा मेरा झूला है।',
      roman: 'Papa ka kandha mera jhoola hai.',
      en: 'Papa\'s shoulder is my swing.' },
  'बाँह':
    { s: 'माँ की बाँह सबसे नरम तकिया है।',
      roman: 'Maa ki baanh sabse naram takiya hai.',
      en: 'Mother\'s arm is the softest pillow.' },
  'उँगली':
    { s: 'दादी उँगली पकड़कर मेला घुमाती हैं।',
      roman: 'Dadi ungli pakadkar mela ghumaati hain.',
      en: 'Dadi holds my finger and shows me the fair.' },
  'अंगूठा':
    { s: 'छोटा बच्चा अंगूठा चूसता है।',
      roman: 'Chhota bachcha angootha choosta hai.',
      en: 'The little baby sucks its thumb.' },
  'नाखून':
    { s: 'हर हफ़्ते नाखून काटो।',
      roman: 'Har hafte naakhoon kaato.',
      en: 'Cut your nails every week.' },
  'घुटना':
    { s: 'गिरने से घुटना छिल गया।',
      roman: 'Girne se ghutna chhil gaya.',
      en: 'I scraped my knee when I fell.' },
  'टाँग':
    { s: 'क्रिकेट में गेंद टाँग पर लगी।',
      roman: 'Cricket mein gend taang par lagi.',
      en: 'In cricket the ball hit my leg.' },
  'पीठ':
    { s: 'पापा पीठ पर बिठाकर घुमाते हैं।',
      roman: 'Papa peeth par bithaakar ghumaate hain.',
      en: 'Papa carries me around on his back.' },
  'दिल':
    { s: 'दादी का दिल बहुत बड़ा है।',
      roman: 'Dadi ka dil bahut bada hai.',
      en: 'Dadi has a very big heart.' },
  'शरीर':
    { s: 'खेलने से शरीर मज़बूत होता है।',
      roman: 'Khelne se shareer mazboot hota hai.',
      en: 'Playing makes the body strong.' },
  'हड्डी':
    { s: 'कुत्ते को हड्डी अच्छी लगती है।',
      roman: 'Kutte ko haddi achchhi lagti hai.',
      en: 'The dog likes a bone.' },
  'साँस':
    { s: 'दौड़ने के बाद साँस फूलती है।',
      roman: 'Daudne ke baad saans phoolti hai.',
      en: 'After running you get out of breath.' },
  'आवाज़':
    { s: 'कोयल की आवाज़ मीठी होती है।',
      roman: 'Koyal ki aavaaz meethi hoti hai.',
      en: 'The koel\'s voice is sweet.' },
  'बुखार':
    { s: 'बुखार में आराम करना चाहिए।',
      roman: 'Bukhaar mein aaraam karna chaahiye.',
      en: 'You should rest when you have a fever.' },

  /* ---- home ---- */
  'दीवार':
    { s: 'दीवार पर नानी की तस्वीर है।',
      roman: 'Deewaar par nani ki tasveer hai.',
      en: 'Nani\'s photo is on the wall.' },
  'फ़र्श':
    { s: 'हम फ़र्श पर बैठकर खाते हैं।',
      roman: 'Ham farsh par baithkar khaate hain.',
      en: 'We sit on the floor and eat.' },
  'सीढ़ी':
    { s: 'सीढ़ी से धीरे धीरे उतरो।',
      roman: 'Seedhi se dheere dheere utro.',
      en: 'Come down the stairs slowly.' },
  'अलमारी':
    { s: 'साफ़ कपड़े अलमारी में रखो।',
      roman: 'Saaf kapde almaari mein rakho.',
      en: 'Put the clean clothes in the cupboard.' },
  'पंखा':
    { s: 'गर्मी में पंखा चलता रहता है।',
      roman: 'Garmi mein pankha chalta rahta hai.',
      en: 'The fan keeps running in summer.' },
  'बत्ती':
    { s: 'सोते समय बत्ती बंद करो।',
      roman: 'Sote samay batti band karo.',
      en: 'Turn off the light when you sleep.' },
  'दीया':
    { s: 'शाम को दादी दीया जलाती हैं।',
      roman: 'Shaam ko dadi diya jalaati hain.',
      en: 'Dadi lights the oil lamp in the evening.' },
  'चूल्हा':
    { s: 'गाँव में मिट्टी का चूल्हा होता है।',
      roman: 'Gaanv mein mitti ka choolha hota hai.',
      en: 'In the village there is a clay stove.' },
  'बर्तन':
    { s: 'खाने के बाद बर्तन धोते हैं।',
      roman: 'Khaane ke baad bartan dhote hain.',
      en: 'We wash the dishes after eating.' },
  'थाली':
    { s: 'थाली में रोटी और सब्ज़ी है।',
      roman: 'Thaali mein roti aur sabzi hai.',
      en: 'There is roti and sabzi on the plate.' },
  'गिलास':
    { s: 'गिलास में ठंडा पानी भरो।',
      roman: 'Gilaas mein thanda paani bharo.',
      en: 'Fill the glass with cold water.' },
  'कटोरी':
    { s: 'कटोरी में दही डालो।',
      roman: 'Katori mein dahi daalo.',
      en: 'Put some yoghurt in the small bowl.' },
  'चम्मच':
    { s: 'छोटा भाई चम्मच से खाता है।',
      roman: 'Chhota bhai chammach se khaata hai.',
      en: 'Little brother eats with a spoon.' },
  'झाड़ू':
    { s: 'सुबह आँगन में झाड़ू लगती है।',
      roman: 'Subah aangan mein jhaadu lagti hai.',
      en: 'The courtyard is swept every morning.' },
  'साबुन':
    { s: 'साबुन से हाथ धोकर खाओ।',
      roman: 'Saabun se haath dhokar khao.',
      en: 'Wash your hands with soap before eating.' },
  'तौलिया':
    { s: 'नहाकर तौलिया से सिर पोंछो।',
      roman: 'Nahaakar tauliya se sir poncho.',
      en: 'After your bath, dry your head with the towel.' },
  'कंघी':
    { s: 'बाल बनाने के लिए कंघी लो।',
      roman: 'Baal banaane ke liye kanghi lo.',
      en: 'Take the comb to do your hair.' },
  'तकिया':
    { s: 'बिना तकिया नींद नहीं आती।',
      roman: 'Bina takiya neend nahin aati.',
      en: 'I can\'t sleep without a pillow.' },
  'चादर':
    { s: 'माँ ने साफ़ चादर बिछाई।',
      roman: 'Maa ne saaf chaadar bichhaai.',
      en: 'Mother spread a clean bedsheet.' },
  'कंबल':
    { s: 'सर्दी में कंबल ओढ़कर सोते हैं।',
      roman: 'Sardi mein kambal odhkar sote hain.',
      en: 'In winter we sleep under a blanket.' },
  'बाल्टी':
    { s: 'नहाने के लिए बाल्टी भरो।',
      roman: 'Nahaane ke liye baalti bharo.',
      en: 'Fill the bucket for your bath.' },
  'बगीचा':
    { s: 'बगीचा फूलों से भर गया।',
      roman: 'Bageecha phoolon se bhar gaya.',
      en: 'The garden filled up with flowers.' },
  'आँगन':
    { s: 'बच्चे आँगन में खेल रहे हैं।',
      roman: 'Bachche aangan mein khel rahe hain.',
      en: 'The children are playing in the courtyard.' },
  'फ़ोन':
    { s: 'नानी का फ़ोन आया है!',
      roman: 'Nani ka fon aaya hai!',
      en: 'Nani is calling!' },

  /* ---- basics ---- */
  'वे':
    { s: 'वे हर शाम सैर करते हैं।',
      roman: 'Ve har shaam sair karte hain.',
      en: 'They go for a walk every evening.' },
  'तुम्हारा':
    { s: 'तुम्हारा मनपसंद रंग कौन सा है?',
      roman: 'Tumhaara manpasand rang kaun sa hai?',
      en: 'Which is your favourite colour?' },
  'आपका':
    { s: 'दादी, आपका बचपन कैसा था?',
      roman: 'Dadi, aapka bachpan kaisa tha?',
      en: 'Dadi, what was your childhood like?' },
  'हमारा':
    { s: 'हमारा स्कूल घर के पास है।',
      roman: 'Hamaara skool ghar ke paas hai.',
      en: 'Our school is near the house.' },
  'कब':
    { s: 'मेला कब शुरू होगा?',
      roman: 'Mela kab shuru hoga?',
      en: 'When will the fair begin?' },
  'क्यों':
    { s: 'आसमान नीला क्यों होता है?',
      roman: 'Aasmaan neela kyon hota hai?',
      en: 'Why is the sky blue?' },
  'कैसे':
    { s: 'पतंग कैसे उड़ती है?',
      roman: 'Patang kaise udti hai?',
      en: 'How does a kite fly?' },
  'कितना':
    { s: 'बताओ, यह तरबूज़ कितना भारी है?',
      roman: 'Batao, yah tarbooz kitna bhaari hai?',
      en: 'Tell me, how heavy is this watermelon?' },
  'यहाँ':
    { s: 'यहाँ बैठो, कहानी सुनो।',
      roman: 'Yahaan baitho, kahaani suno.',
      en: 'Sit here and listen to the story.' },
  'वहाँ':
    { s: 'वहाँ देखो, मोर नाच रहा है!',
      roman: 'Vahaan dekho, mor naach raha hai!',
      en: 'Look there, the peacock is dancing!' },
  'और':
    { s: 'भाई और बहन साथ पढ़ते हैं।',
      roman: 'Bhai aur bahan saath padhte hain.',
      en: 'Brother and sister study together.' },
  'या':
    { s: 'तुम्हें दूध चाहिए या पानी?',
      roman: 'Tumhein doodh chaahiye ya paani?',
      en: 'Do you want milk or water?' },
  'लेकिन':
    { s: 'बारिश आई, लेकिन मेला नहीं रुका।',
      roman: 'Baarish aayi, lekin mela nahin ruka.',
      en: 'The rain came, but the fair didn\'t stop.' },
  'भी':
    { s: 'छोटी बहन भी खेलेगी।',
      roman: 'Chhoti bahan bhi khelegi.',
      en: 'Little sister will play too.' },
  'का':
    { s: 'यह मेरे दोस्त का बस्ता है।',
      roman: 'Yah mere dost ka basta hai.',
      en: 'This is my friend\'s school bag.' },
  'को':
    { s: 'शाम को हम सैर करते हैं।',
      roman: 'Shaam ko ham sair karte hain.',
      en: 'We go for a walk in the evening.' },
  'में':
    { s: 'थाली में गरम रोटी है।',
      roman: 'Thaali mein garam roti hai.',
      en: 'There is a hot roti on the plate.' },
  'पर':
    { s: 'मेज़ पर थाली रखो।',
      roman: 'Mez par thaali rakho.',
      en: 'Put the plate on the table.' },
  'से':
    { s: 'हम बस से स्कूल जाते हैं।',
      roman: 'Ham bas se skool jaate hain.',
      en: 'We go to school by bus.' },
  'तक':
    { s: 'हम नदी तक दौड़ लगाते हैं।',
      roman: 'Ham nadi tak daud lagaate hain.',
      en: 'We race up to the river.' },
  'पास':
    { s: 'मेरे पास नई किताब है।',
      roman: 'Mere paas nayi kitaab hai.',
      en: 'I have a new book.' },
  'थोड़ा':
    { s: 'मुझे थोड़ा दूध और दो।',
      roman: 'Mujhe thoda doodh aur do.',
      en: 'Give me a little more milk.' },
  'सब':
    { s: 'सब मिलकर कहानी सुनते हैं।',
      roman: 'Sab milkar kahaani sunte hain.',
      en: 'Everyone listens to the story together.' },
  'कुछ':
    { s: 'मुझे कुछ कहना है।',
      roman: 'Mujhe kuchh kahna hai.',
      en: 'I have something to say.' },
  'अब':
    { s: 'अब सोने का समय है।',
      roman: 'Ab sone ka samay hai.',
      en: 'Now it is time to sleep.' },
  'फिर':
    { s: 'फिर कब आओगे, मामा जी?',
      roman: 'Phir kab aaoge, mama ji?',
      en: 'When will you come again, Mama ji?' },
  'जल्दी':
    { s: 'जल्दी चलो, बस आ गई!',
      roman: 'Jaldi chalo, bas aa gayi!',
      en: 'Come quickly, the bus is here!' },
  'धीरे':
    { s: 'धीरे बोलो, भाई सो रहा है।',
      roman: 'Dheere bolo, bhai so raha hai.',
      en: 'Speak softly, brother is sleeping.' },
  'नया':
    { s: 'पापा ने नया कुरता पहना।',
      roman: 'Papa ne naya kurta pahna.',
      en: 'Papa wore a new kurta.' },
  'पुराना':
    { s: 'यह किला बहुत पुराना है।',
      roman: 'Yah kila bahut puraana hai.',
      en: 'This fort is very old.' },
  'बुरा':
    { s: 'किसी को बुरा मत कहो।',
      roman: 'Kisi ko bura mat kaho.',
      en: 'Don\'t say anything mean to anyone.' },
  'गरम':
    { s: 'सर्दी में गरम दूध अच्छा लगता है।',
      roman: 'Sardi mein garam doodh achchha lagta hai.',
      en: 'Warm milk feels good in winter.' },
  'ठंडा':
    { s: 'मटके का पानी ठंडा रहता है।',
      roman: 'Matke ka paani thanda rahta hai.',
      en: 'Water in the clay pot stays cool.' },
  'साफ़':
    { s: 'अपना कमरा साफ़ रखो।',
      roman: 'Apna kamra saaf rakho.',
      en: 'Keep your room clean.' },
  'गंदा':
    { s: 'बारिश में जूता गंदा हो गया।',
      roman: 'Baarish mein joota ganda ho gaya.',
      en: 'My shoe got dirty in the rain.' },
  'मीठा':
    { s: 'पका केला मीठा होता है।',
      roman: 'Paka kela meetha hota hai.',
      en: 'A ripe banana is sweet.' },
  'लंबा':
    { s: 'यह रास्ता बहुत लंबा है।',
      roman: 'Yah raasta bahut lamba hai.',
      en: 'This road is very long.' },
  'भारी':
    { s: 'मेरा बस्ता आज भारी है।',
      roman: 'Mera basta aaj bhaari hai.',
      en: 'My school bag is heavy today.' },
  'हल्का':
    { s: 'गुब्बारा हल्का है, ऊपर उड़ गया!',
      roman: 'Gubbaara halka hai, oopar ud gaya!',
      en: 'The balloon is light — it flew up!' },
  'सुंदर':
    { s: 'रंगोली कितनी सुंदर बनी है!',
      roman: 'Rangoli kitni sundar bani hai!',
      en: 'How beautiful the rangoli has turned out!' },
  'ज़्यादा':
    { s: 'मीठा ज़्यादा मत खाओ।',
      roman: 'Meetha zyaada mat khao.',
      en: 'Don\'t eat too many sweets.' },
  'कम':
    { s: 'आज गर्मी कल से कम है।',
      roman: 'Aaj garmi kal se kam hai.',
      en: 'Today is less hot than yesterday.' },
  'ऊपर':
    { s: 'गेंद छत के ऊपर चली गई!',
      roman: 'Gend chhat ke oopar chali gayi!',
      en: 'The ball went over the roof!' },
  'नीचे':
    { s: 'पेड़ के नीचे ठंडी छाँव है।',
      roman: 'Ped ke neeche thandi chhaanv hai.',
      en: 'There is cool shade under the tree.' },
  'अंदर':
    { s: 'बारिश आई, सब अंदर आ जाओ!',
      roman: 'Baarish aayi, sab andar aa jao!',
      en: 'It\'s raining — everyone come inside!' },
  'बाहर':
    { s: 'धूप निकली, चलो बाहर खेलें!',
      roman: 'Dhoop nikli, chalo baahar khelen!',
      en: 'The sun is out — let\'s play outside!' },
  'आगे':
    { s: 'कहानी में आगे क्या हुआ?',
      roman: 'Kahaani mein aage kya hua?',
      en: 'What happened next in the story?' },
  'पीछे':
    { s: 'घर के पीछे बगीचा है।',
      roman: 'Ghar ke peechhe bageecha hai.',
      en: 'There is a garden behind the house.' },
  'दाएँ':
    { s: 'चौराहे से दाएँ मुड़ो।',
      roman: 'Chauraahe se daaen mudo.',
      en: 'Turn right at the crossing.' },
  'बाएँ':
    { s: 'मेरे बाएँ हाथ में चूड़ी है।',
      roman: 'Mere baaen haath mein choodi hai.',
      en: 'There is a bangle on my left hand.' },
  'दूर':
    { s: 'नानी का घर बहुत दूर है।',
      roman: 'Nani ka ghar bahut door hai.',
      en: 'Nani\'s house is very far away.' },
  'बंद':
    { s: 'दुकान आज बंद है।',
      roman: 'Dukaan aaj band hai.',
      en: 'The shop is closed today.' },
  'तैयार':
    { s: 'मैं स्कूल के लिए तैयार हूँ।',
      roman: 'Main skool ke liye taiyaar hoon.',
      en: 'I am ready for school.' },
  'याद':
    { s: 'मुझे नानी की याद आती है।',
      roman: 'Mujhe nani ki yaad aati hai.',
      en: 'I miss my nani.' },
  'पसंद':
    { s: 'मुझे बारिश बहुत पसंद है।',
      roman: 'Mujhe baarish bahut pasand hai.',
      en: 'I like the rain very much.' },
  'मदद':
    { s: 'हम सब घर में मदद करते हैं।',
      roman: 'Ham sab ghar mein madad karte hain.',
      en: 'We all help at home.' },
  'उम्र':
    { s: 'तुम्हारी उम्र कितनी है?',
      roman: 'Tumhaari umr kitni hai?',
      en: 'How old are you?' },
  'बारी':
    { s: 'अब झूले पर मेरी बारी है!',
      roman: 'Ab jhoole par meri baari hai!',
      en: 'Now it\'s my turn on the swing!' },
  'बात':
    { s: 'नानी से फ़ोन पर बात हुई।',
      roman: 'Nani se fon par baat hui.',
      en: 'We talked to Nani on the phone.' },
  'साथ':
    { s: 'हम सब साथ पतंग उड़ाते हैं।',
      roman: 'Ham sab saath patang udaate hain.',
      en: 'We all fly kites together.' },
  'हर':
    { s: 'हर शाम हम खेलने जाते हैं।',
      roman: 'Har shaam ham khelne jaate hain.',
      en: 'Every evening we go out to play.' },

  /* ---- actions ---- */
  'सुनना':
    { s: 'मुझे गाने सुनना अच्छा लगता है।',
      roman: 'Mujhe gaane sunna achchha lagta hai.',
      en: 'I like listening to songs.' },
  'बोलना':
    { s: 'सच बोलना अच्छी आदत है।',
      roman: 'Sach bolna achchhi aadat hai.',
      en: 'Speaking the truth is a good habit.' },
  'पढ़ना':
    { s: 'मुझे किताबें पढ़ना पसंद है।',
      roman: 'Mujhe kitaaben padhna pasand hai.',
      en: 'I like reading books.' },
  'लिखना':
    { s: 'आज हमने अपना नाम लिखना सीखा।',
      roman: 'Aaj hamne apna naam likhna seekha.',
      en: 'Today we learned to write our name.' },
  'बैठना':
    { s: 'दादा जी के पास बैठना अच्छा लगता है।',
      roman: 'Dada ji ke paas baithna achchha lagta hai.',
      en: 'Sitting beside Dada ji feels good.' },
  'उठना':
    { s: 'सुबह जल्दी उठना अच्छी आदत है।',
      roman: 'Subah jaldi uthna achchhi aadat hai.',
      en: 'Getting up early is a good habit.' },
  'चलना':
    { s: 'नंगे पैर घास पर चलना अच्छा लगता है।',
      roman: 'Nange pair ghaas par chalna achchha lagta hai.',
      en: 'Walking barefoot on grass feels good.' },
  'दौड़ना':
    { s: 'मुझे मैदान में दौड़ना पसंद है।',
      roman: 'Mujhe maidaan mein daudna pasand hai.',
      en: 'I like running on the field.' },
  'हँसना':
    { s: 'हँसना सेहत के लिए अच्छा है।',
      roman: 'Hansna sehat ke liye achchha hai.',
      en: 'Laughing is good for your health.' },
  'रोना':
    { s: 'रोना बंद करो, मैं हूँ ना।',
      roman: 'Rona band karo, main hoon na.',
      en: 'Stop crying — I\'m here.' },
  'गाना':
    { s: 'दीदी को गाना बहुत पसंद है।',
      roman: 'Didi ko gaana bahut pasand hai.',
      en: 'Didi loves singing.' },
  'नाचना':
    { s: 'मुझे गाने पर नाचना अच्छा लगता है।',
      roman: 'Mujhe gaane par naachna achchha lagta hai.',
      en: 'I like dancing to a song.' },
  'बनाना':
    { s: 'दादी से रंगोली बनाना सीखा।',
      roman: 'Dadi se rangoli banaana seekha.',
      en: 'I learned to make rangoli from Dadi.' },
  'लेना':
    { s: 'दुकान से दूध लेना मत भूलना।',
      roman: 'Dukaan se doodh lena mat bhoolna.',
      en: 'Don\'t forget to get milk from the shop.' },
  'धोना':
    { s: 'हाथ धोना कभी मत भूलो।',
      roman: 'Haath dhona kabhi mat bhoolo.',
      en: 'Never forget to wash your hands.' },
  'पहनना':
    { s: 'सर्दी में स्वेटर पहनना ज़रूरी है।',
      roman: 'Sardi mein sveter pahanna zaroori hai.',
      en: 'Wearing a jumper in winter is a must.' },
  'खोलना':
    { s: 'मेहमान आएँ तो दरवाज़ा खोलना।',
      roman: 'Mehmaan aayen to darwaaza kholna.',
      en: 'Open the door if guests come.' },
  'रखना':
    { s: 'अपनी किताबें सँभालकर रखना।',
      roman: 'Apni kitaaben sambhaalkar rakhna.',
      en: 'Keep your books carefully.' },
  'समझना':
    { s: 'पहले सवाल समझना, फिर जवाब देना।',
      roman: 'Pahle savaal samajhna, phir javaab dena.',
      en: 'First understand the question, then answer.' },
  'सीखना':
    { s: 'नई भाषा सीखना मज़ेदार है।',
      roman: 'Nayi bhaasha seekhna mazedaar hai.',
      en: 'Learning a new language is fun.' },
  'मिलना':
    { s: 'दोस्तों से मिलना अच्छा लगता है।',
      roman: 'Doston se milna achchha lagta hai.',
      en: 'Meeting friends feels good.' },
  'रुकना':
    { s: 'लाल बत्ती पर रुकना ज़रूरी है।',
      roman: 'Laal batti par rukna zaroori hai.',
      en: 'You must stop at the red light.' },
  'बुलाना':
    { s: 'खेलने के लिए दोस्तों को बुलाना।',
      roman: 'Khelne ke liye doston ko bulaana.',
      en: 'Call your friends over to play.' },
  'पकाना':
    { s: 'चाचा को खाना पकाना आता है।',
      roman: 'Chacha ko khaana pakaana aata hai.',
      en: 'Chacha knows how to cook.' },
  'ढूँढना':
    { s: 'छुपन-छुपाई में सबको ढूँढना पड़ता है।',
      roman: 'Chhupan-chhupaai mein sabko dhoondhna padta hai.',
      en: 'In hide-and-seek you have to find everyone.' },
  'जलाना':
    { s: 'शाम को दीया जलाना है।',
      roman: 'Shaam ko diya jalaana hai.',
      en: 'We have to light the lamp in the evening.' },
  'रहना':
    { s: 'मुझे नानी के साथ रहना है।',
      roman: 'Mujhe nani ke saath rahna hai.',
      en: 'I want to stay with Nani.' },
  'सकना':
    { s: 'पंछी की तरह उड़ सकना कैसा होगा?',
      roman: 'Panchhi ki tarah ud sakna kaisa hoga?',
      en: 'What would it be like, to be able to fly like a bird?' },
  'चाहिए':
    { s: 'मुझे पानी चाहिए।',
      roman: 'Mujhe paani chaahiye.',
      en: 'I want water.' },
  'था':
    { s: 'कल मेला बहुत अच्छा था।',
      roman: 'Kal mela bahut achchha tha.',
      en: 'The fair was very good yesterday.' },
  'थी':
    { s: 'कल रात की कहानी लंबी थी।',
      roman: 'Kal raat ki kahaani lambi thi.',
      en: 'Last night\'s story was long.' },

  /* ---- animals ---- */
  'बंदर':
    { s: 'बंदर पेड़ पर उछल रहा है।',
      roman: 'Bandar ped par uchhal raha hai.',
      en: 'The monkey is jumping about on the tree.' },
  'शेर':
    { s: 'शेर जंगल का राजा कहलाता है।',
      roman: 'Sher jangal ka raja kahlaata hai.',
      en: 'The lion is called the king of the forest.' },
  'घोड़ा':
    { s: 'घोड़ा बहुत तेज़ दौड़ता है।',
      roman: 'Ghoda bahut tez daudta hai.',
      en: 'A horse runs very fast.' },
  'तितली':
    { s: 'तितली फूल पर बैठी है।',
      roman: 'Titli phool par baithi hai.',
      en: 'The butterfly is sitting on the flower.' },
  'बकरी':
    { s: 'बकरी हरी घास खाती है।',
      roman: 'Bakri hari ghaas khaati hai.',
      en: 'The goat eats green grass.' },
  'भैंस':
    { s: 'भैंस को पानी में बैठना पसंद है।',
      roman: 'Bhains ko paani mein baithna pasand hai.',
      en: 'The buffalo likes sitting in water.' },
  'बैल':
    { s: 'बैल खेत में काम करता है।',
      roman: 'Bail khet mein kaam karta hai.',
      en: 'The ox works in the field.' },
  'ऊँट':
    { s: 'रेगिस्तान में ऊँट काम आता है।',
      roman: 'Registaan mein oont kaam aata hai.',
      en: 'In the desert, the camel is a great help.' },
  'भालू':
    { s: 'भालू का बच्चा पेड़ पर चढ़ा।',
      roman: 'Bhaaloo ka bachcha ped par chadha.',
      en: 'The bear cub climbed the tree.' },
  'हिरण':
    { s: 'हिरण की आँखें सुंदर होती हैं।',
      roman: 'Hiran ki aankhen sundar hoti hain.',
      en: 'A deer\'s eyes are beautiful.' },
  'साँप':
    { s: 'साँप ज़मीन पर रेंगता है।',
      roman: 'Saanp zameen par rengta hai.',
      en: 'The snake slithers on the ground.' },
  'चूहा':
    { s: 'चूहा बिल में छिप गया।',
      roman: 'Chooha bil mein chhip gaya.',
      en: 'The mouse hid in its hole.' },
  'मोर':
    { s: 'मोर हमारा राष्ट्रीय पक्षी है।',
      roman: 'Mor hamaara raashtriya pakshi hai.',
      en: 'The peacock is our national bird.' },
  'कौआ':
    { s: 'कौआ काँव काँव करता है।',
      roman: 'Kauaa kaanv kaanv karta hai.',
      en: 'The crow goes caw, caw.' },
  'तोता':
    { s: 'तोता मिर्च खाता है।',
      roman: 'Tota mirch khaata hai.',
      en: 'The parrot eats chillies.' },
  'कबूतर':
    { s: 'छत पर कबूतर बैठे हैं।',
      roman: 'Chhat par kabootar baithe hain.',
      en: 'Pigeons are sitting on the roof.' },
  'मुर्गा':
    { s: 'मुर्गा सुबह सबको जगाता है।',
      roman: 'Murga subah sabko jagaata hai.',
      en: 'The rooster wakes everyone in the morning.' },
  'मुर्गी':
    { s: 'मुर्गी ने अंडा दिया।',
      roman: 'Murgi ne anda diya.',
      en: 'The hen laid an egg.' },
  'खरगोश':
    { s: 'खरगोश गाजर कुतरता है।',
      roman: 'Khargosh gaajar kutarta hai.',
      en: 'The rabbit nibbles a carrot.' },
  'गिलहरी':
    { s: 'गिलहरी पेड़ पर दौड़ती है।',
      roman: 'Gilahri ped par daudti hai.',
      en: 'The squirrel runs up and down the tree.' },
  'मेंढक':
    { s: 'बारिश में मेंढक टर्र टर्र करता है।',
      roman: 'Baarish mein mendhak tarr tarr karta hai.',
      en: 'In the rain the frog goes croak, croak.' },
  'मक्खी':
    { s: 'मिठाई को मक्खी से ढककर रखो।',
      roman: 'Mithai ko makkhi se dhak-kar rakho.',
      en: 'Keep the sweets covered from flies.' },
  'मच्छर':
    { s: 'मच्छर के काटने से खुजली होती है।',
      roman: 'Machchhar ke kaatne se khujli hoti hai.',
      en: 'A mosquito bite makes you itch.' },
  'चींटी':
    { s: 'चींटी लाइन बनाकर चलती है।',
      roman: 'Cheenti line banaakar chalti hai.',
      en: 'Ants walk in a line.' },
  'कछुआ':
    { s: 'कछुआ धीरे चलता है, पर जीतता है।',
      roman: 'Kachhua dheere chalta hai, par jeetta hai.',
      en: 'The tortoise walks slowly, but wins.' },
  'बाघ':
    { s: 'बाघ जंगल में अकेला रहता है।',
      roman: 'Baagh jangal mein akela rahta hai.',
      en: 'The tiger lives alone in the forest.' },
  'गधा':
    { s: 'गधा बोझ उठाकर चलता है।',
      roman: 'Gadha bojh uthaakar chalta hai.',
      en: 'The donkey carries loads.' },
  'भेड़':
    { s: 'भेड़ के बाल से ऊन बनती है।',
      roman: 'Bhed ke baal se oon banti hai.',
      en: 'Wool comes from a sheep\'s hair.' },

  /* ---- colours ---- */
  'नारंगी':
    { s: 'संतरे का रंग नारंगी होता है।',
      roman: 'Santare ka rang naarangi hota hai.',
      en: 'An orange\'s colour is orange!' },
  'गुलाबी':
    { s: 'जयपुर गुलाबी शहर कहलाता है।',
      roman: 'Jaipur gulaabi shahar kahlaata hai.',
      en: 'Jaipur is called the pink city.' },
  'भूरा':
    { s: 'भालू का रंग भूरा होता है।',
      roman: 'Bhaaloo ka rang bhoora hota hai.',
      en: 'A bear\'s colour is brown.' },
  'बैंगनी':
    { s: 'जामुन खाकर जीभ बैंगनी हो गई!',
      roman: 'Jaamun khaakar jeebh baingani ho gayi!',
      en: 'Eating jamuns turned my tongue purple!' },
  'सुनहरा':
    { s: 'शाम को आसमान सुनहरा हो गया।',
      roman: 'Shaam ko aasmaan sunahra ho gaya.',
      en: 'In the evening the sky turned golden.' },
  'रंग':
    { s: 'होली पर हर रंग उड़ता है।',
      roman: 'Holi par har rang udta hai.',
      en: 'On Holi every colour flies.' },

  /* ---- numbers ---- */
  'ग्यारह':
    { s: 'क्रिकेट टीम में ग्यारह खिलाड़ी होते हैं।',
      roman: 'Cricket team mein gyaarah khilaadi hote hain.',
      en: 'A cricket team has eleven players.' },
  'बारह':
    { s: 'घड़ी में बारह बजे हैं।',
      roman: 'Ghadi mein baarah baje hain.',
      en: 'The clock says twelve o\'clock.' },
  'तेरह':
    { s: 'मेरी दीदी तेरह साल की है।',
      roman: 'Meri didi terah saal ki hai.',
      en: 'My didi is thirteen years old.' },
  'चौदह':
    { s: 'किताब में पन्ना चौदह खोलो।',
      roman: 'Kitaab mein panna chaudah kholo.',
      en: 'Open page fourteen in the book.' },
  'पंद्रह':
    { s: 'पंद्रह अगस्त को झंडा फहराते हैं।',
      roman: 'Pandrah agast ko jhanda fahraate hain.',
      en: 'On the fifteenth of August we hoist the flag.' },
  'सोलह':
    { s: 'दस और छह मिलकर सोलह होते हैं।',
      roman: 'Das aur chhah milkar solah hote hain.',
      en: 'Ten and six together make sixteen.' },
  'सत्रह':
    { s: 'मौसी के घर सत्रह सीढ़ियाँ हैं।',
      roman: 'Mausi ke ghar satrah seedhiyaan hain.',
      en: 'Mausi\'s house has seventeen stairs.' },
  'अठारह':
    { s: 'अठारह साल की उम्र में वोट डालते हैं।',
      roman: 'Athaarah saal ki umr mein vote daalte hain.',
      en: 'People vote at eighteen years of age.' },
  'उन्नीस':
    { s: 'उन्नीस के बाद बीस आता है।',
      roman: 'Unnees ke baad bees aata hai.',
      en: 'After nineteen comes twenty.' },
  'बीस':
    { s: 'मैंने बीस तक गिनती सीख ली!',
      roman: 'Mainne bees tak ginti seekh li!',
      en: 'I have learned to count up to twenty!' },
  'तीस':
    { s: 'इस महीने में तीस दिन हैं।',
      roman: 'Is maheene mein tees din hain.',
      en: 'This month has thirty days.' },
  'चालीस':
    { s: 'अली बाबा और चालीस चोरों की कहानी सुनो।',
      roman: 'Ali Baba aur chaalees choron ki kahaani suno.',
      en: 'Listen to the story of Ali Baba and the forty thieves.' },
  'पचास':
    { s: 'यह पेड़ पचास साल पुराना है।',
      roman: 'Yah ped pachaas saal puraana hai.',
      en: 'This tree is fifty years old.' },
  'सौ':
    { s: 'मैं सौ तक गिन सकता हूँ!',
      roman: 'Main sau tak gin sakta hoon!',
      en: 'I can count up to a hundred!' },
  'हज़ार':
    { s: 'आसमान में हज़ार तारे चमकते हैं।',
      roman: 'Aasmaan mein hazaar taare chamakte hain.',
      en: 'A thousand stars shine in the sky.' },
  'शून्य':
    { s: 'दस में एक और शून्य होता है।',
      roman: 'Das mein ek aur shoonya hota hai.',
      en: 'Ten has a one and a zero.' },
  'आधा':
    { s: 'मैंने आधा सेब भाई को दिया।',
      roman: 'Mainne aadha seb bhai ko diya.',
      en: 'I gave half the apple to my brother.' },
  'पहला':
    { s: 'दौड़ में मेरा पहला नंबर आया!',
      roman: 'Daud mein mera pehla nambar aaya!',
      en: 'I came first in the race!' },
  'दूसरा':
    { s: 'मुझे दूसरा लड्डू भी चाहिए!',
      roman: 'Mujhe doosra laddoo bhi chaahiye!',
      en: 'I want a second laddoo too!' },
  'तीसरा':
    { s: 'बाएँ से तीसरा घर हमारा है।',
      roman: 'Baaen se teesra ghar hamaara hai.',
      en: 'The third house from the left is ours.' },
  'रुपया':
    { s: 'गुल्लक में रुपया डालो।',
      roman: 'Gullak mein rupaya daalo.',
      en: 'Put the rupee in the piggy bank.' },

  /* ---- school ---- */
  'स्कूल':
    { s: 'मुझे स्कूल जाना अच्छा लगता है।',
      roman: 'Mujhe skool jaana achchha lagta hai.',
      en: 'I like going to school.' },
  'किताब':
    { s: 'यह किताब कहानियों से भरी है।',
      roman: 'Yah kitaab kahaaniyon se bhari hai.',
      en: 'This book is full of stories.' },
  'कलम':
    { s: 'मेरी कलम नीली लिखती है।',
      roman: 'Meri kalam neeli likhti hai.',
      en: 'My pen writes in blue.' },
  'पेंसिल':
    { s: 'पेंसिल से चित्र बनाओ।',
      roman: 'Pensil se chitra banao.',
      en: 'Draw a picture with the pencil.' },
  'बस्ता':
    { s: 'स्कूल का बस्ता तैयार रखो।',
      roman: 'Skool ka basta taiyaar rakho.',
      en: 'Keep your school bag ready.' },
  'कक्षा':
    { s: 'हमारी कक्षा में बीस बच्चे हैं।',
      roman: 'Hamaari kaksha mein bees bachche hain.',
      en: 'There are twenty children in our class.' },
  'शिक्षक':
    { s: 'शिक्षक हमें गिनती सिखाते हैं।',
      roman: 'Shikshak hamein ginti sikhaate hain.',
      en: 'The teacher teaches us counting.' },
  'पाठ':
    { s: 'आज का पाठ बहुत आसान था।',
      roman: 'Aaj ka paath bahut aasaan tha.',
      en: 'Today\'s lesson was very easy.' },
  'सवाल':
    { s: 'सवाल पूछना अच्छी बात है।',
      roman: 'Savaal poochhna achchhi baat hai.',
      en: 'Asking questions is a good thing.' },
  'जवाब':
    { s: 'मुझे इस सवाल का जवाब आता है!',
      roman: 'Mujhe is savaal ka javaab aata hai!',
      en: 'I know the answer to this question!' },
  'नाम':
    { s: 'मेरा नाम हिंदी में लिखो।',
      roman: 'Mera naam hindi mein likho.',
      en: 'Write my name in Hindi.' },
  'अक्षर':
    { s: 'हर अक्षर की अपनी आवाज़ होती है।',
      roman: 'Har akshar ki apni aavaaz hoti hai.',
      en: 'Every letter has its own sound.' },
  'शब्द':
    { s: 'आज मैंने नया शब्द सीखा।',
      roman: 'Aaj mainne naya shabd seekha.',
      en: 'Today I learned a new word.' },
  'वाक्य':
    { s: 'छोटे शब्दों से वाक्य बनता है।',
      roman: 'Chhote shabdon se vaakya banta hai.',
      en: 'Small words make a sentence.' },
  'कहानी':
    { s: 'नानी की कहानी सबसे अच्छी होती है।',
      roman: 'Nani ki kahaani sabse achchhi hoti hai.',
      en: 'Nani\'s story is the best.' },
  'कविता':
    { s: 'हमने कक्षा में कविता याद की।',
      roman: 'Hamne kaksha mein kavita yaad ki.',
      en: 'We memorised a poem in class.' },
  'चित्र':
    { s: 'मैंने गाँव का चित्र बनाया।',
      roman: 'Mainne gaanv ka chitra banaaya.',
      en: 'I drew a picture of the village.' },
  'खेल':
    { s: 'मुझे यह नया खेल आता है।',
      roman: 'Mujhe yah naya khel aata hai.',
      en: 'I know this new game.' },
  'छुट्टी':
    { s: 'कल स्कूल की छुट्टी है!',
      roman: 'Kal skool ki chhutti hai!',
      en: 'Tomorrow is a school holiday!' },
  'गिनती':
    { s: 'दादी के साथ गिनती सीखते हैं।',
      roman: 'Dadi ke saath ginti seekhte hain.',
      en: 'We learn counting with Dadi.' },
  'कागज़':
    { s: 'कागज़ की नाव पानी में तैरी।',
      roman: 'Kaagaz ki naav paani mein tairi.',
      en: 'The paper boat floated on the water.' },
  'पढ़ाई':
    { s: 'खेल के बाद पढ़ाई भी ज़रूरी है।',
      roman: 'Khel ke baad padhaai bhi zaroori hai.',
      en: 'After play, studying matters too.' },
  'भाषा':
    { s: 'हिंदी मेरी नानी की भाषा है।',
      roman: 'Hindi meri nani ki bhaasha hai.',
      en: 'Hindi is my nani\'s language.' },

  /* ---- clothes ---- */
  'कपड़े':
    { s: 'बारिश में कपड़े जल्दी नहीं सूखते।',
      roman: 'Baarish mein kapde jaldi nahin sookhte.',
      en: 'Clothes don\'t dry quickly in the rains.' },
  'कुरता':
    { s: 'पापा का कुरता सफ़ेद है।',
      roman: 'Papa ka kurta safed hai.',
      en: 'Papa\'s kurta is white.' },
  'साड़ी':
    { s: 'माँ की साड़ी बहुत सुंदर है।',
      roman: 'Maa ki saari bahut sundar hai.',
      en: 'Mother\'s sari is very beautiful.' },
  'सलवार':
    { s: 'दीदी ने नीली सलवार पहनी।',
      roman: 'Didi ne neeli salvaar pahni.',
      en: 'Didi wore a blue salwar.' },
  'कमीज़':
    { s: 'मेरी कमीज़ पर बटन टूट गया।',
      roman: 'Meri kameez par batan toot gaya.',
      en: 'A button broke off my shirt.' },
  'पतलून':
    { s: 'नई पतलून थोड़ी लंबी है।',
      roman: 'Nayi patloon thodi lambi hai.',
      en: 'The new trousers are a bit long.' },
  'जूता':
    { s: 'मेरा एक जूता खो गया!',
      roman: 'Mera ek joota kho gaya!',
      en: 'One of my shoes is lost!' },
  'चप्पल':
    { s: 'चप्पल दरवाज़े के बाहर उतारो।',
      roman: 'Chappal darwaaze ke baahar utaaro.',
      en: 'Take off your slippers outside the door.' },
  'मोज़ा':
    { s: 'दूसरा मोज़ा पलंग के नीचे मिला।',
      roman: 'Doosra moza palang ke neeche mila.',
      en: 'The other sock was under the bed.' },
  'टोपी':
    { s: 'धूप में टोपी पहनकर निकलो।',
      roman: 'Dhoop mein topi pahankar niklo.',
      en: 'Wear a cap when you go out in the sun.' },
  'दुपट्टा':
    { s: 'माँ का दुपट्टा हवा में उड़ा।',
      roman: 'Maa ka dupatta hava mein uda.',
      en: 'Mother\'s dupatta flew in the wind.' },
  'चूड़ी':
    { s: 'चूड़ी की खनक अच्छी लगती है।',
      roman: 'Choodi ki khanak achchhi lagti hai.',
      en: 'The tinkle of a bangle sounds lovely.' },
  'अंगूठी':
    { s: 'नानी की अंगूठी सोने की है।',
      roman: 'Nani ki angoothi sone ki hai.',
      en: 'Nani\'s ring is made of gold.' },
  'बटन':
    { s: 'कोट का बटन ऊपर तक बंद करो।',
      roman: 'Kot ka batan oopar tak band karo.',
      en: 'Button your coat right up to the top.' },
  'जेब':
    { s: 'मेरी जेब में दो टॉफ़ियाँ हैं।',
      roman: 'Meri jeb mein do tofiyaan hain.',
      en: 'I have two toffees in my pocket.' },
  'स्वेटर':
    { s: 'दादी ने मेरे लिए स्वेटर बुना।',
      roman: 'Dadi ne mere liye sveter buna.',
      en: 'Dadi knitted a jumper for me.' },
  'कोट':
    { s: 'बारिश में कोट भीग गया।',
      roman: 'Baarish mein kot bheeg gaya.',
      en: 'The coat got wet in the rain.' },
  'धोती':
    { s: 'दादा जी धोती पहनते हैं।',
      roman: 'Dada ji dhoti pahante hain.',
      en: 'Dada ji wears a dhoti.' },
  'पगड़ी':
    { s: 'पापा की पगड़ी गहरे नीले रंग की है।',
      roman: 'Papa ki pagdi gahre neele rang ki hai.',
      en: 'Papa\'s turban is deep blue.' },
  'लहँगा':
    { s: 'शादी में दीदी ने लहँगा पहना।',
      roman: 'Shaadi mein didi ne lahanga pahna.',
      en: 'Didi wore a lehenga at the wedding.' },
  'चश्मा':
    { s: 'नाना जी का चश्मा कहाँ है?',
      roman: 'Nana ji ka chashma kahaan hai?',
      en: 'Where are Nana ji\'s glasses?' },

  /* ---- weather ---- */
  'मौसम':
    { s: 'बारिश में मौसम ठंडा हो जाता है।',
      roman: 'Baarish mein mausam thanda ho jaata hai.',
      en: 'The weather turns cool in the rain.' },
  'धूप':
    { s: 'सर्दी की धूप अच्छी लगती है।',
      roman: 'Sardi ki dhoop achchhi lagti hai.',
      en: 'Winter sunshine feels lovely.' },
  'बारिश':
    { s: 'पहली बारिश में मिट्टी महकती है।',
      roman: 'Pahli baarish mein mitti mahakti hai.',
      en: 'The earth smells sweet in the first rain.' },
  'बादल':
    { s: 'काले बादल घिर आए हैं।',
      roman: 'Kaale baadal ghir aaye hain.',
      en: 'Dark clouds have gathered.' },
  'हवा':
    { s: 'शाम की हवा ठंडी होती है।',
      roman: 'Shaam ki hava thandi hoti hai.',
      en: 'The evening breeze is cool.' },
  'सर्दी':
    { s: 'सर्दी में हम मूँगफली खाते हैं।',
      roman: 'Sardi mein ham moongphali khaate hain.',
      en: 'In winter we eat peanuts.' },
  'गर्मी':
    { s: 'गर्मी में आइसक्रीम अच्छी लगती है।',
      roman: 'Garmi mein ice cream achchhi lagti hai.',
      en: 'Ice cream is lovely in summer.' },
  'बरसात':
    { s: 'बरसात में हर तरफ़ हरियाली होती है।',
      roman: 'Barsaat mein har taraf hariyaali hoti hai.',
      en: 'In the rainy season everything turns green.' },
  'तूफ़ान':
    { s: 'तूफ़ान में पेड़ ज़ोर से हिले।',
      roman: 'Toofaan mein ped zor se hile.',
      en: 'The trees shook hard in the storm.' },
  'बिजली':
    { s: 'बिजली चमकी और बादल गरजे।',
      roman: 'Bijli chamki aur baadal garje.',
      en: 'Lightning flashed and the clouds rumbled.' },
  'सूरज':
    { s: 'सूरज बादल के पीछे छिप गया।',
      roman: 'Sooraj baadal ke peechhe chhip gaya.',
      en: 'The sun hid behind a cloud.' },
  'चाँद':
    { s: 'आज चाँद पूरा गोल है।',
      roman: 'Aaj chaand poora gol hai.',
      en: 'The moon is perfectly round tonight.' },
  'तारा':
    { s: 'वह तारा सबसे तेज़ चमकता है।',
      roman: 'Vah taara sabse tez chamakta hai.',
      en: 'That star shines the brightest.' },
  'आसमान':
    { s: 'नीले आसमान में चील उड़ रही है।',
      roman: 'Neele aasmaan mein cheel ud rahi hai.',
      en: 'A kite-bird is flying in the blue sky.' },
  'बर्फ़':
    { s: 'पहाड़ों पर बर्फ़ गिरती है।',
      roman: 'Pahaadon par barf girti hai.',
      en: 'Snow falls on the mountains.' },
  'कोहरा':
    { s: 'सर्दी की सुबह कोहरा छा जाता है।',
      roman: 'Sardi ki subah kohra chha jaata hai.',
      en: 'Fog settles on winter mornings.' },
  'इंद्रधनुष':
    { s: 'बारिश के बाद इंद्रधनुष निकला!',
      roman: 'Baarish ke baad indradhanush nikla!',
      en: 'A rainbow came out after the rain!' },
  'छाता':
    { s: 'बारिश में छाता साथ ले जाओ।',
      roman: 'Baarish mein chhaata saath le jao.',
      en: 'Take an umbrella along in the rain.' },
  'आग':
    { s: 'रसोई की आग से दूर रहो।',
      roman: 'Rasoi ki aag se door raho.',
      en: 'Stay away from the kitchen fire.' },

  /* ---- time ---- */
  'परसों':
    { s: 'परसों हम चिड़ियाघर जाएँगे।',
      roman: 'Parson ham chidiyaaghar jaayenge.',
      en: 'The day after tomorrow we will go to the zoo.' },
  'दोपहर':
    { s: 'दोपहर में धूप तेज़ होती है।',
      roman: 'Dopahar mein dhoop tez hoti hai.',
      en: 'The sun is strong in the afternoon.' },
  'शाम':
    { s: 'शाम को सब बच्चे बाहर खेलते हैं।',
      roman: 'Shaam ko sab bachche baahar khelte hain.',
      en: 'All the children play outside in the evening.' },
  'दिन':
    { s: 'रविवार मेरा मनपसंद दिन है।',
      roman: 'Ravivaar mera manpasand din hai.',
      en: 'Sunday is my favourite day.' },
  'हफ़्ता':
    { s: 'एक हफ़्ता सात दिन का होता है।',
      roman: 'Ek hafta saat din ka hota hai.',
      en: 'A week has seven days.' },
  'महीना':
    { s: 'अगला महीना मेरे जन्मदिन का है।',
      roman: 'Agla maheena mere janmadin ka hai.',
      en: 'Next month is my birthday month.' },
  'साल':
    { s: 'इस साल हम भारत जाएँगे।',
      roman: 'Is saal ham bhaarat jaayenge.',
      en: 'This year we will go to India.' },
  'घंटा':
    { s: 'एक घंटा साठ मिनट का होता है।',
      roman: 'Ek ghanta saath minat ka hota hai.',
      en: 'An hour has sixty minutes.' },
  'मिनट':
    { s: 'माँ ने कहा, बस दो मिनट!',
      roman: 'Maa ne kaha, bas do minat!',
      en: 'Mother said, "Just two minutes!"' },
  'समय':
    { s: 'खेलने का समय हो गया!',
      roman: 'Khelne ka samay ho gaya!',
      en: 'It\'s time to play!' },
  'घड़ी':
    { s: 'घड़ी में समय देखना सीखो।',
      roman: 'Ghadi mein samay dekhna seekho.',
      en: 'Learn to read the time on a clock.' },
  'देर':
    { s: 'मेला देखने में देर हो गई।',
      roman: 'Mela dekhne mein der ho gayi.',
      en: 'Watching the fair made us late.' },
  'जन्मदिन':
    { s: 'जन्मदिन पर सब गुब्बारे लगाते हैं।',
      roman: 'Janmadin par sab gubbaare lagaate hain.',
      en: 'Everyone puts up balloons on a birthday.' },
  'त्योहार':
    { s: 'त्योहार पर घर सज जाता है।',
      roman: 'Tyohaar par ghar saj jaata hai.',
      en: 'The house gets decorated for a festival.' },
  'सोमवार':
    { s: 'सोमवार से स्कूल फिर शुरू होगा।',
      roman: 'Somvaar se skool phir shuru hoga.',
      en: 'School starts again on Monday.' },
  'मंगलवार':
    { s: 'मंगलवार को कला की कक्षा लगती है।',
      roman: 'Mangalvaar ko kala ki kaksha lagti hai.',
      en: 'Art class is on Tuesday.' },
  'बुधवार':
    { s: 'बुधवार हफ़्ते के बीच में आता है।',
      roman: 'Budhvaar hafte ke beech mein aata hai.',
      en: 'Wednesday comes in the middle of the week.' },
  'गुरुवार':
    { s: 'गुरुवार को हम पुस्तकालय जाते हैं।',
      roman: 'Guruvaar ko ham pustakaalay jaate hain.',
      en: 'On Thursday we go to the library.' },
  'शुक्रवार':
    { s: 'शुक्रवार को पापा जल्दी घर आते हैं।',
      roman: 'Shukravaar ko papa jaldi ghar aate hain.',
      en: 'Papa comes home early on Friday.' },
  'शनिवार':
    { s: 'शनिवार को आधा दिन स्कूल लगता है।',
      roman: 'Shanivaar ko aadha din skool lagta hai.',
      en: 'On Saturday there is half a day of school.' },
  'रविवार':
    { s: 'रविवार को हम सब देर तक सोते हैं।',
      roman: 'Ravivaar ko ham sab der tak sote hain.',
      en: 'On Sunday we all sleep in.' },

  /* ---- places ---- */
  'बाज़ार':
    { s: 'शाम को बाज़ार में रौनक होती है।',
      roman: 'Shaam ko baazaar mein raunak hoti hai.',
      en: 'The market comes alive in the evening.' },
  'दुकान':
    { s: 'कोने की दुकान से दही लाओ।',
      roman: 'Kone ki dukaan se dahi lao.',
      en: 'Get some yoghurt from the corner shop.' },
  'मंदिर':
    { s: 'मंदिर में घंटी की आवाज़ आई।',
      roman: 'Mandir mein ghanti ki aavaaz aayi.',
      en: 'The sound of the bell came from the temple.' },
  'गुरुद्वारा':
    { s: 'गुरुद्वारा सबके लिए खुला रहता है।',
      roman: 'Gurudwaara sabke liye khula rahta hai.',
      en: 'The gurdwara stays open for everyone.' },
  'मस्जिद':
    { s: 'मस्जिद से अज़ान की आवाज़ आती है।',
      roman: 'Masjid se azaan ki aavaaz aati hai.',
      en: 'The call to prayer comes from the mosque.' },
  'गिरजाघर':
    { s: 'गिरजाघर में रविवार को प्रार्थना होती है।',
      roman: 'Girjaaghar mein ravivaar ko praarthana hoti hai.',
      en: 'There are prayers at the church on Sunday.' },
  'अस्पताल':
    { s: 'अस्पताल में डॉक्टर मदद करते हैं।',
      roman: 'Aspataal mein doctor madad karte hain.',
      en: 'Doctors help people at the hospital.' },
  'पार्क':
    { s: 'पार्क में झूले और फिसलपट्टी है।',
      roman: 'Paark mein jhoole aur phisalpatti hai.',
      en: 'The park has swings and a slide.' },
  'सड़क':
    { s: 'सड़क हमेशा देखकर पार करो।',
      roman: 'Sadak hamesha dekhkar paar karo.',
      en: 'Always look before crossing the road.' },
  'गली':
    { s: 'हमारी गली में बच्चे क्रिकेट खेलते हैं।',
      roman: 'Hamaari gali mein bachche cricket khelte hain.',
      en: 'Children play cricket in our lane.' },
  'शहर':
    { s: 'मुंबई समुद्र के किनारे बसा शहर है।',
      roman: 'Mumbai samudra ke kinaare basa shahar hai.',
      en: 'Mumbai is a city by the sea.' },
  'गाँव':
    { s: 'गर्मी की छुट्टियों में गाँव जाते हैं।',
      roman: 'Garmi ki chhuttiyon mein gaanv jaate hain.',
      en: 'In the summer holidays we go to the village.' },
  'देश':
    { s: 'भारत बहुत बड़ा देश है।',
      roman: 'Bhaarat bahut bada desh hai.',
      en: 'India is a very big country.' },
  'खेत':
    { s: 'मामा के खेत में गेहूँ उगता है।',
      roman: 'Mama ke khet mein gehoon ugta hai.',
      en: 'Wheat grows in Mama\'s field.' },
  'कुआँ':
    { s: 'गाँव का कुआँ बहुत गहरा है।',
      roman: 'Gaanv ka kuaan bahut gahra hai.',
      en: 'The village well is very deep.' },
  'स्टेशन':
    { s: 'स्टेशन पर रेलगाड़ी खड़ी है।',
      roman: 'Steshan par relgaadi khadi hai.',
      en: 'The train is standing at the station.' },
  'नदी':
    { s: 'गंगा भारत की बड़ी नदी है।',
      roman: 'Ganga bhaarat ki badi nadi hai.',
      en: 'The Ganga is a great river of India.' },
  'पहाड़':
    { s: 'दूर से पहाड़ नीले दिखते हैं।',
      roman: 'Door se pahaad neele dikhte hain.',
      en: 'From far away the mountains look blue.' },
  'समुद्र':
    { s: 'समुद्र का पानी खारा होता है।',
      roman: 'Samudra ka paani khaara hota hai.',
      en: 'Sea water is salty.' },
  'जंगल':
    { s: 'जंगल में कई जानवर रहते हैं।',
      roman: 'Jangal mein kai jaanvar rahte hain.',
      en: 'Many animals live in the forest.' },
  'झील':
    { s: 'झील का पानी शांत है।',
      roman: 'Jheel ka paani shaant hai.',
      en: 'The lake\'s water is calm.' },
  'पुल':
    { s: 'नदी के ऊपर लंबा पुल है।',
      roman: 'Nadi ke oopar lamba pul hai.',
      en: 'There is a long bridge over the river.' },
  'किला':
    { s: 'हमने लाल किला देखा।',
      roman: 'Hamne laal kila dekha.',
      en: 'We saw the Red Fort.' },
  'मेला':
    { s: 'गाँव का मेला कल से लगेगा।',
      roman: 'Gaanv ka mela kal se lagega.',
      en: 'The village fair starts tomorrow.' },
  'पेड़':
    { s: 'आम का पेड़ छाया देता है।',
      roman: 'Aam ka ped chhaaya deta hai.',
      en: 'The mango tree gives shade.' },
  'फूल':
    { s: 'गेंदे का फूल पीला होता है।',
      roman: 'Gende ka phool peela hota hai.',
      en: 'The marigold flower is yellow.' },
  'पत्ता':
    { s: 'पीपल का पत्ता दिल जैसा होता है।',
      roman: 'Peepal ka patta dil jaisa hota hai.',
      en: 'A peepal leaf is shaped like a heart.' },
  'घास':
    { s: 'सुबह घास पर ओस चमकती है।',
      roman: 'Subah ghaas par os chamakti hai.',
      en: 'Dew sparkles on the grass in the morning.' },
  'मिट्टी':
    { s: 'कुम्हार मिट्टी से दीये बनाता है।',
      roman: 'Kumhaar mitti se diye banaata hai.',
      en: 'The potter makes lamps from clay.' },

  /* ---- transport ---- */
  'गाड़ी':
    { s: 'हमारी गाड़ी लाल रंग की है।',
      roman: 'Hamaari gaadi laal rang ki hai.',
      en: 'Our car is red.' },
  'बस':
    { s: 'स्कूल की बस पीली होती है।',
      roman: 'Skool ki bas peeli hoti hai.',
      en: 'The school bus is yellow.' },
  'ट्रेन':
    { s: 'ट्रेन की खिड़की से खेत दिखे।',
      roman: 'Tren ki khidki se khet dikhe.',
      en: 'We saw fields from the train window.' },
  'रेलगाड़ी':
    { s: 'रेलगाड़ी छुक छुक करती चलती है।',
      roman: 'Relgaadi chhuk chhuk karti chalti hai.',
      en: 'The train goes chhuk-chhuk as it runs.' },
  'साइकिल':
    { s: 'मैंने साइकिल चलाना सीख लिया!',
      roman: 'Mainne saaikil chalaana seekh liya!',
      en: 'I have learned to ride a bicycle!' },
  'रिक्शा':
    { s: 'हम रिक्शा से बाज़ार गए।',
      roman: 'Ham riksha se baazaar gaye.',
      en: 'We went to the market by rickshaw.' },
  'नाव':
    { s: 'नाव नदी में धीरे चलती है।',
      roman: 'Naav nadi mein dheere chalti hai.',
      en: 'The boat moves slowly on the river.' },
  'स्कूटर':
    { s: 'पापा स्कूटर से दफ़्तर जाते हैं।',
      roman: 'Papa skootar se daftar jaate hain.',
      en: 'Papa goes to the office on his scooter.' },
  'जहाज़':
    { s: 'बड़ा जहाज़ समुद्र में चलता है।',
      roman: 'Bada jahaaz samudra mein chalta hai.',
      en: 'A big ship sails on the sea.' },
  'हवाई जहाज़':
    { s: 'हम हवाई जहाज़ से भारत गए।',
      roman: 'Ham havaai jahaaz se bhaarat gaye.',
      en: 'We went to India by aeroplane.' },
  'टिकट':
    { s: 'बस में टिकट लेना ज़रूरी है।',
      roman: 'Bas mein tikat lena zaroori hai.',
      en: 'You must buy a ticket on the bus.' },
  'पहिया':
    { s: 'साइकिल का पहिया गोल घूमता है।',
      roman: 'Saaikil ka pahiya gol ghoomta hai.',
      en: 'The bicycle wheel spins round.' },
  'सफ़र':
    { s: 'नानी के घर का सफ़र लंबा है।',
      roman: 'Nani ke ghar ka safar lamba hai.',
      en: 'The journey to Nani\'s house is long.' },
  'रास्ता':
    { s: 'स्कूल का रास्ता पार्क से जाता है।',
      roman: 'Skool ka raasta paark se jaata hai.',
      en: 'The way to school goes past the park.' },
  'ट्रक':
    { s: 'ट्रक पर रंगीन चित्र बने हैं।',
      roman: 'Trak par rangeen chitra bane hain.',
      en: 'The lorry is painted with colourful pictures.' },

  /* ---- feelings ---- */
  'उदास':
    { s: 'दोस्त के जाने से मैं उदास हूँ।',
      roman: 'Dost ke jaane se main udaas hoon.',
      en: 'I am sad because my friend left.' },
  'गुस्सा':
    { s: 'गुस्सा आए तो गहरी साँस लो।',
      roman: 'Gussa aaye to gahri saans lo.',
      en: 'If you feel angry, take a deep breath.' },
  'डर':
    { s: 'अँधेरे से डर लगना ठीक है।',
      roman: 'Andhere se dar lagna theek hai.',
      en: 'It\'s okay to be afraid of the dark.' },
  'हँसी':
    { s: 'भाई की बात पर हँसी आ गई।',
      roman: 'Bhai ki baat par hansi aa gayi.',
      en: 'What brother said made me laugh.' },
  'आँसू':
    { s: 'खुशी में भी आँसू आते हैं।',
      roman: 'Khushi mein bhi aansoo aate hain.',
      en: 'Tears come with happiness too.' },
  'थका':
    { s: 'मैं आज बहुत थका हूँ।',
      roman: 'Main aaj bahut thaka hoon.',
      en: 'I am very tired today.' },
  'प्यासा':
    { s: 'प्यासा कौआ पानी ढूँढ रहा था।',
      roman: 'Pyaasa kauaa paani dhoondh raha tha.',
      en: 'The thirsty crow was looking for water.' },
  'बीमार':
    { s: 'बीमार दोस्त से मिलने गए।',
      roman: 'Beemaar dost se milne gaye.',
      en: 'We went to see our sick friend.' },
  'मज़ा':
    { s: 'मेले में बहुत मज़ा आया!',
      roman: 'Mele mein bahut maza aaya!',
      en: 'The fair was such fun!' },
  'शर्म':
    { s: 'पहले दिन थोड़ी शर्म आती है।',
      roman: 'Pahle din thodi sharm aati hai.',
      en: 'On the first day you feel a little shy.' },
  'अकेला':
    { s: 'कोई अकेला न रहे, सबको बुलाओ।',
      roman: 'Koi akela na rahe, sabko bulao.',
      en: 'No one should be left alone — call everyone.' },
  'दर्द':
    { s: 'पेट में दर्द हो तो बताओ।',
      roman: 'Pet mein dard ho to batao.',
      en: 'Tell someone if your tummy hurts.' },
  'नींद':
    { s: 'कहानी सुनते सुनते नींद आ गई।',
      roman: 'Kahaani sunte sunte neend aa gayi.',
      en: 'I fell asleep listening to the story.' },
  'खुशी':
    { s: 'नानी से मिलकर बहुत खुशी हुई।',
      roman: 'Nani se milkar bahut khushi hui.',
      en: 'Meeting Nani brought such happiness.' },
  'हिम्मत':
    { s: 'हिम्मत से हर काम आसान लगता है।',
      roman: 'Himmat se har kaam aasaan lagta hai.',
      en: 'With courage every task feels easier.' },
  'शांत':
    { s: 'रात में गाँव शांत हो जाता है।',
      roman: 'Raat mein gaanv shaant ho jaata hai.',
      en: 'The village turns quiet at night.' },
  'दया':
    { s: 'जानवरों पर दया करनी चाहिए।',
      roman: 'Jaanvaron par daya karni chaahiye.',
      en: 'We should be kind to animals.' },
  'आराम':
    { s: 'खेल के बाद थोड़ा आराम करो।',
      roman: 'Khel ke baad thoda aaraam karo.',
      en: 'Rest a little after playing.' },
};
/* Flagged for the native-speaker queue:
   - 'सकना': bare infinitive is rare in child speech; the sentence uses
     "उड़ सकना कैसा होगा?" — confirm it reads naturally or re-craft.
   - First-person lines mix masculine and feminine speakers (आती हूँ / सकता
     हूँ / थका हूँ / छह साल की हूँ) — confirm the mix and each agreement.
   - Third-person unnamed adults use descriptive singular (बेचता है,
     बनाती है) while all elders take honorific plural — confirm register.
   - 'करना': gerund frame "मदद करना अच्छी बात है" chosen so the headword
     stays uninflected; same pattern for several infinitive verbs. */
