/* Bizzing India — authored Baat-cheet exchanges for Hindi (Phase 4 of the
   Bhasha rebuild).

   WHAT THIS IS. Seventy-two hand-authored conversation turns replacing the
   exchanges the engine used to derive mechanically from adjacent HI_S5 lines
   (the audit found 59% of those structurally broken: children asked to reply
   as the shopkeeper, same-speaker lines posing as exchanges, random
   cross-scene distractors). Every entry here is a real exchange, read aloud
   in the head before it was kept.

   CONTRACT (the engine prefers these over anything derived):
     window.IND_BHASHA_DIALOGUES.hi = [ { scene, sceneEn, who, prompt, roman, en,
       reply: { hi, roman, en },
       distractors: [ { hi, roman, en, whyWrong } x3 ] } ]
   Scene ids match bhasha.js stageItems s5, plus 'mehmaan-aaye' (guests at
   home) as the eighth.

   CRAFT RULES, each one paid for by an audit finding:
   1. The PROMPT is always the other person (Nani, the vendor, the teacher);
      the REPLY is always the child's own natural line. The child is never
      asked to play the adult.
   2. The reply logically completes the exchange — answers the question,
      complies, or responds humanly. No pair ships unread-aloud.
   3. Distractors are DESIGNED: same scene, same register, plausible length,
      wrong on MEANING — a different question answered, flipped polarity,
      wrong addressee, a word misheard. Never absurd cross-scene lines,
      never a second right answer. Every whyWrong is one warm teaching line.
   4. Elders are आप with the right verb forms (आप कैसी हैं for Dadi); the
      vendor is भैया; a little cousin is तुम. Register errors appear only as
      distractors, and the whyWrong names them.
   5. Gendered agreement: replies use gender-neutral constructions wherever
      Hindi allows them — ने + object agreement (मैंने रोटी खाई), मुझे…है
      forms, first-person subjunctive (लाऊँ?), hum-futures (हम आएँगे),
      impersonal याद रहेगा. Where a prompt addresses the child with a
      tum-form, the neutral phrasing was chosen (तुम लोग…आ रहे हो, क्या चल
      रहा है). Remaining conventional defaults (हम…पढ़ रहे हैं; मेरा बच्चा
      said to any child) are flagged for the native-speaker pass below.
   6. Names in sample replies (Meera) are placeholders — the child says
      their own. No festival is invented; the register is 🧭 Aaj, the
      everyday world the app already lives in (Sunday's call, the sabzi
      mandi, the school gate, a cousin's shaadi). No Itihaas or Dharma
      claims are made, so no sources[] are owed (docs/05 §4).
   7. All Devanagari is NFC-normalized; no duplicate prompts or replies.

   REVIEW. As with data-nani.js and HI_PACK.reviewedBy: every Hindi line
   below is a draft until a named native-speaker pedagogue signs. The sign
   line lives at the bottom of this file (IND_BHASHA_DIALOGUES.hi.reviewedBy);
   docs/05 §4 and docs/09 §9 govern. Specific items queued for that pass are
   flagged inline with "review:". */

/* PHASE A: registered into the shared per-pack bank rather than a Hindi-only
   global, so all nine packs reach their dialogues by one route. */
window.IND_BHASHA_DIALOGUES = window.IND_BHASHA_DIALOGUES || {};
window.IND_BHASHA_DIALOGUES.hi = [

  /* ============ Scene: phone-to-nani — Sunday's video call ============== */

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'नमस्ते बेटा! कैसे हो?', roman: 'namaste beta! kaise ho?', en: 'Hello, love! How are you?',
    reply: { hi: 'नमस्ते नानी! मैं ठीक हूँ।', roman: 'namaste nani! main theek hoon.', en: 'Hello Nani! I am fine.' },
    distractors: [
      { hi: 'शुभ रात्रि, नानी।', roman: 'shubh raatri, nani.', en: 'Good night, Nani.',
        whyWrong: 'That’s the bedtime goodbye — Nani just said hello, so hello comes back first.' },
      { hi: 'नानी ठीक हैं।', roman: 'nani theek hain.', en: 'Nani is fine.',
        whyWrong: 'Nani asked about YOU — this answers about her instead. मैं ठीक हूँ puts you back in the sentence.' },
      { hi: 'आप कैसे हैं?', roman: 'aap kaise hain?', en: 'How are you?',
        whyWrong: 'Asking back is sweet — but answer her first (मैं ठीक हूँ), then ask.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'आज स्कूल में क्या किया?', roman: 'aaj skool mein kya kiya?', en: 'What did you do at school today?',
    reply: { hi: 'हमने नई कविता पढ़ी।', roman: 'hamne nai kavita padhi.', en: 'We read a new poem.' },
    distractors: [
      { hi: 'स्कूल आठ बजे शुरू होता है।', roman: 'skool aath baje shuroo hota hai.', en: 'School starts at eight o’clock.',
        whyWrong: 'That answers “when does school start” — Nani asked what you DID there.' },
      { hi: 'हम बस से स्कूल जाते हैं।', roman: 'ham bas se skool jaate hain.', en: 'We go to school by bus.',
        whyWrong: 'That answers “how do you get there” — क्या किया asks what happened once you arrived.' },
      { hi: 'स्कूल बहुत बड़ा है।', roman: 'skool bahut bada hai.', en: 'School is very big.',
        whyWrong: 'That describes the building — Nani wants your day, not the architecture.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'आज क्या खाया?', roman: 'aaj kya khaaya?', en: 'What did you eat today?',
    reply: { hi: 'मैंने रोटी और दाल खाई।', roman: 'maine roti aur daal khaai.', en: 'I ate roti and daal.' },
    distractors: [
      { hi: 'हम रसोई में खाते हैं।', roman: 'ham rasoi mein khaate hain.', en: 'We eat in the kitchen.',
        whyWrong: 'That answers “where” — but Nani asked “what”.' },
      { hi: 'माँ खाना बना रही हैं।', roman: 'maa khaana bana rahi hain.', en: 'Mum is cooking food.',
        whyWrong: 'That says who is cooking now — Nani asked what YOU already ate.' },
      { hi: 'मुझे आम पसंद है।', roman: 'mujhe aam pasand hai.', en: 'I like mangoes.',
        whyWrong: 'That’s what you like in general — क्या खाया asks about today’s plate.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'तुम्हारी बहुत याद आती है।', roman: 'tumhaari bahut yaad aati hai.', en: 'I miss you very much.',
    reply: { hi: 'मुझे भी आपकी याद आती है।', roman: 'mujhe bhi aapki yaad aati hai.', en: 'I miss you too.' },
    distractors: [
      { hi: 'मुझे भी भूख लगी है।', roman: 'mujhe bhi bhookh lagi hai.', en: 'I am hungry too.',
        whyWrong: 'भी copies the feeling back — but the feeling here is missing someone (याद), not hunger.' },
      { hi: 'मुझे आपकी याद नहीं आती।', roman: 'mujhe aapki yaad nahin aati.', en: 'I don’t miss you.',
        whyWrong: 'One little नहीं flips it to “I don’t miss you” — the exact opposite of what you mean.' },
      { hi: 'नानी घर पर हैं।', roman: 'nani ghar par hain.', en: 'Nani is at home.',
        whyWrong: 'That reports where Nani is — she told you a feeling, and feelings want an answer, not a location.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'तुम लोग इंडिया कब आ रहे हो?', roman: 'tum log india kab aa rahe ho?', en: 'When are you all coming to India?',
    reply: { hi: 'हम गर्मी की छुट्टियों में आएँगे।', roman: 'ham garmi ki chhuttiyon mein aaenge.', en: 'We will come in the summer holidays.' },
    distractors: [
      { hi: 'हम गर्मी में आए थे।', roman: 'ham garmi mein aae the.', en: 'We came in the summer.',
        whyWrong: 'आए थे looks backwards — Nani asked कब आ रहे हो, about the visit still to come.' },
      { hi: 'इंडिया बहुत दूर है।', roman: 'india bahut door hai.', en: 'India is very far away.',
        whyWrong: 'True — but दूर answers “how far”, and Nani asked “when”.' },
      { hi: 'नानी, आप कब आएँगी?', roman: 'nani, aap kab aaengi?', en: 'Nani, when will you come?',
        whyWrong: 'A question back isn’t an answer — tell Nani your कब first, then ask hers.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nana',
    prompt: 'बेटा, वहाँ बारिश हो रही है क्या?', roman: 'beta, vahaan baarish ho rahi hai kya?', en: 'Is it raining there, love?',
    reply: { hi: 'नहीं नाना, आज तो धूप है।', roman: 'nahin nana, aaj to dhoop hai.', en: 'No Nana, it’s sunny today.' },
    distractors: [
      { hi: 'मुझे बारिश पसंद है।', roman: 'mujhe baarish pasand hai.', en: 'I like rain.',
        whyWrong: 'Nana asked about today’s sky, not your favourites — first the weather, then the opinions.' },
      { hi: 'यहाँ रात हो गई है।', roman: 'yahaan raat ho gai hai.', en: 'It’s night-time here.',
        whyWrong: 'That tells Nana the time — his question was about बारिश, the rain.' },
      { hi: 'हाँ, वहाँ गर्मी है।', roman: 'haan, vahaan garmi hai.', en: 'Yes, it’s hot over there.',
        whyWrong: 'वहाँ points back at Nana’s side of the call — your weather lives at यहाँ.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'नाना को भी नमस्ते कहो।', roman: 'nana ko bhi namaste kaho.', en: 'Say hello to Nana too.',
    reply: { hi: 'नाना, नमस्ते! आप कैसे हैं?', roman: 'nana, namaste! aap kaise hain?', en: 'Nana, hello! How are you?' },
    distractors: [
      { hi: 'नानी, नमस्ते!', roman: 'nani, namaste!', en: 'Nani, hello!',
        whyWrong: 'That greets Nani all over again — she asked you to turn to NANA.' },
      { hi: 'नाना ठीक हैं।', roman: 'nana theek hain.', en: 'Nana is fine.',
        whyWrong: 'That talks ABOUT Nana — Nani asked you to talk TO him.' },
      { hi: 'अच्छा, फिर मिलेंगे।', roman: 'achchha, phir milenge.', en: 'Okay, see you later.',
        whyWrong: 'That’s a goodbye — nobody is hanging up yet; Nana is waiting for his नमस्ते.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'बहुत रात हो गई वहाँ — अब सो जाओ, बेटा।', roman: 'bahut raat ho gai vahaan — ab so jaao, beta.', en: 'It’s very late there — go to sleep now, love.',
    reply: { hi: 'जी नानी। शुभ रात्रि!', roman: 'ji nani. shubh raatri!', en: 'Yes, Nani. Good night!' },
    distractors: [
      { hi: 'सुप्रभात, नानी!', roman: 'suprabhaat, nani!', en: 'Good morning, Nani!',
        whyWrong: 'सुप्रभात opens a morning — at bedtime the word is शुभ रात्रि.' },
      { hi: 'आप सो जाइए।', roman: 'aap so jaaiye.', en: 'You go to sleep.',
        whyWrong: 'Nani asked YOU to sleep — this sends the instruction back across the ocean to her.' },
      { hi: 'जी, मैं ठीक हूँ।', roman: 'ji, main theek hoon.', en: 'Yes, I am fine.',
        whyWrong: 'That answers “how are you?” — but Nani said it’s time to sleep.' }
    ] },

  { scene: 'phone-to-nani', sceneEn: 'On Sunday’s video call with Nani',
    who: 'nani',
    prompt: 'कुछ सुनाओ बेटा — कोई कविता आती है?', roman: 'kuchh sunaao beta — koi kavita aati hai?', en: 'Recite something, love — do you know a poem?',
    reply: { hi: 'जी हाँ! सुनिए — मछली जल की रानी है!', roman: 'ji haan! suniye — machhli jal ki raani hai!', en: 'Yes! Listen — “the fish is the queen of the water”!' },
    distractors: [
      { hi: 'मुझे कविता चाहिए।', roman: 'mujhe kavita chaahiye.', en: 'I want a poem.',
        whyWrong: 'चाहिए asks Nani to give you one — she asked to hear YOURS.' },
      { hi: 'आवाज़ नहीं आ रही।', roman: 'aavaaz nahin aa rahi.', en: 'I can’t hear you.',
        whyWrong: 'That’s the line for when the call breaks up — Nani came through loud and clear; she wants your poem.' },
      { hi: 'कविता किताब में है।', roman: 'kavita kitaab mein hai.', en: 'The poem is in the book.',
        whyWrong: 'Nani wants to hear you SAY it, not to know where it lives.' }
    ] },

  /* ============ Scene: greeting-elders — the grown-ups at home ========== */

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dadi',
    prompt: 'अरे, मेरा बच्चा आ गया! आओ, आओ!', roman: 'are, mera bachcha aa gaya! aao, aao!', en: 'Oh, my child is here! Come, come!',
    reply: { hi: 'प्रणाम दादी! आप कैसी हैं?', roman: 'pranaam dadi! aap kaisi hain?', en: 'Pranaam, Dadi! How are you?' },
    distractors: [
      { hi: 'तुम कैसी हो, दादी?', roman: 'tum kaisi ho, dadi?', en: 'How are you (tum), Dadi?',
        whyWrong: 'For Dadi it is always आप, never तुम — आप कैसी हैं?' },
      { hi: 'फिर मिलेंगे, दादी।', roman: 'phir milenge, dadi.', en: 'See you later, Dadi.',
        whyWrong: 'That’s for going away — you have only just arrived!' },
      { hi: 'दादी, पानी लाइए।', roman: 'dadi, paani laaiye.', en: 'Dadi, bring me water.',
        whyWrong: 'First the greeting — and in this house it’s you who fetches for elders, not the other way round.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dada',
    prompt: 'बेटा, ज़रा मेरा चश्मा तो ला देना।', roman: 'beta, zara mera chashma to la dena.', en: 'Love, fetch my glasses, will you?',
    reply: { hi: 'जी दादा जी, अभी!', roman: 'ji dada ji, abhi!', en: 'Yes Dada ji, right away!' },
    distractors: [
      { hi: 'चश्मा मेज़ पर है।', roman: 'chashma mez par hai.', en: 'The glasses are on the table.',
        whyWrong: 'Dada ji asked you to BRING them — telling him where they are leaves him squinting.' },
      { hi: 'मुझे चश्मा चाहिए।', roman: 'mujhe chashma chaahiye.', en: 'I want the glasses.',
        whyWrong: 'चाहिए makes them yours — Dada ji is the one asking for them.' },
      { hi: 'आप ख़ुद ले लीजिए।', roman: 'aap khud le leejiye.', en: 'Take them yourself.',
        whyWrong: 'That sends the errand back to Dada ji — and to an elder, it lands quite boldly!' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'mausi',
    prompt: 'अरे! कितना बड़ा हो गया मेरा बच्चा!', roman: 'are! kitna bada ho gaya mera bachcha!', en: 'My, how big my child has grown!',
    reply: { hi: 'नमस्ते मौसी! आप कब आईं?', roman: 'namaste mausi! aap kab aaeen?', en: 'Hello, Mausi! When did you arrive?' },
    distractors: [
      { hi: 'आप भी बड़ी हो गईं।', roman: 'aap bhi badi ho gaeen.', en: 'You have grown big too.',
        whyWrong: 'Grown-ups stopped growing long ago — the warm move is a hello: नमस्ते मौसी!' },
      { hi: 'नमस्ते चाचा जी!', roman: 'namaste chacha ji!', en: 'Hello, Chacha ji!',
        whyWrong: 'चाचा is Papa’s brother — Mummy’s sister is मौसी.' },
      { hi: 'मुझे मिठाई चाहिए।', roman: 'mujhe mithai chaahiye.', en: 'I want sweets.',
        whyWrong: 'Mausi just walked in — greet her first; the sweets can wait a minute.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dadi',
    prompt: 'कल सुबह हमारे साथ मंदिर चलना है?', roman: 'kal subah hamaare saath mandir chalna hai?', en: 'Will you come to the temple with us tomorrow morning?',
    reply: { hi: 'जी दादी, मुझे भी चलना है।', roman: 'ji dadi, mujhe bhi chalna hai.', en: 'Yes Dadi, I want to come too.' },
    distractors: [
      { hi: 'मंदिर कहाँ है?', roman: 'mandir kahaan hai?', en: 'Where is the temple?',
        whyWrong: 'Dadi asked whether you’ll come, not where it is — the हाँ or नहीं comes first.' },
      { hi: 'हम कल गए थे।', roman: 'ham kal gae the.', en: 'We went yesterday.',
        whyWrong: 'This कल looks backwards — Dadi’s कल is tomorrow morning.' },
      { hi: 'आप जाइए।', roman: 'aap jaaiye.', en: 'You go.',
        whyWrong: 'That sends Dadi off without you — जी, मुझे भी चलना है brings you along.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'neighbour',
    prompt: 'बेटा, मम्मी-पापा घर पर हैं?', roman: 'beta, mummy-papa ghar par hain?', en: 'Love, are your mum and dad at home?',
    reply: { hi: 'जी हाँ, अंदर हैं। आइए।', roman: 'ji haan, andar hain. aaiye.', en: 'Yes, they’re inside. Please come in.' },
    distractors: [
      { hi: 'जी हाँ, मैं घर पर हूँ।', roman: 'ji haan, main ghar par hoon.', en: 'Yes, I am at home.',
        whyWrong: 'He can see you’re home — the question was about मम्मी-पापा.' },
      { hi: 'मम्मी-पापा ठीक हैं।', roman: 'mummy-papa theek hain.', en: 'Mum and dad are fine.',
        whyWrong: 'That answers “how are they” — he asked whether they’re घर पर, at home.' },
      { hi: 'आप घर पर हैं?', roman: 'aap ghar par hain?', en: 'Are you at home?',
        whyWrong: 'He’s standing at your door — the question only makes sense pointed the other way.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dada',
    prompt: 'यह लो बेटा, मंदिर का प्रसाद।', roman: 'yah lo beta, mandir ka prasaad.', en: 'Here, love — prasad from the temple.',
    reply: { hi: 'धन्यवाद, दादा जी।', roman: 'dhanyavaad, dada ji.', en: 'Thank you, Dada ji.' },
    distractors: [
      { hi: 'नहीं चाहिए।', roman: 'nahin chaahiye.', en: 'Don’t want it.',
        whyWrong: 'You may always say no politely — but a bare नहीं चाहिए lands gruff; it wants a जी and a धन्यवाद.' },
      { hi: 'मुझे और दीजिए।', roman: 'mujhe aur deejiye.', en: 'Give me more.',
        whyWrong: 'First a thank-you for what’s in your hand — और comes later, and gently.' },
      { hi: 'आप खा लीजिए।', roman: 'aap kha leejiye.', en: 'You eat it.',
        whyWrong: 'Dada ji brought it FOR you — this hands it straight back.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'aunty',
    prompt: 'क्या नाम है तुम्हारा, बेटा?', roman: 'kya naam hai tumhaara, beta?', en: 'What’s your name, love?',
    reply: { hi: 'जी, मेरा नाम मीरा है।', roman: 'ji, mera naam Meera hai.', en: 'My name is Meera. (You’d say your own!)' },
    distractors: [
      { hi: 'मेरी उम्र सात साल है।', roman: 'meri umr saat saal hai.', en: 'I am seven years old.',
        whyWrong: 'That answers “how old are you?” — she asked your नाम.' },
      { hi: 'आपका नाम क्या है?', roman: 'aapka naam kya hai?', en: 'What is your name?',
        whyWrong: 'Answer first, then ask hers back — that’s the friendly order.' },
      { hi: 'मेरा नाम अच्छा है।', roman: 'mera naam achchha hai.', en: 'My name is nice.',
        whyWrong: 'It surely is — but she still hasn’t heard it!' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dada',
    prompt: 'आजकल स्कूल में क्या चल रहा है?', roman: 'aajkal skool mein kya chal raha hai?', en: 'What’s going on at school these days?',
    reply: { hi: 'हम गिनती और कहानियाँ पढ़ रहे हैं।', roman: 'ham ginti aur kahaaniyaan padh rahe hain.', en: 'We’re learning counting and stories.' },
    distractors: [
      { hi: 'स्कूल नौ बजे लगता है।', roman: 'skool nau baje lagta hai.', en: 'School starts at nine.',
        whyWrong: 'That’s the timetable — Dada ji asked what you’re LEARNING there.' },
      { hi: 'मुझे स्कूल पसंद है।', roman: 'mujhe skool pasand hai.', en: 'I like school.',
        whyWrong: 'Lovely to hear — but it doesn’t say what’s चल रहा, what’s going on.' },
      { hi: 'टीचर पढ़ा रही हैं।', roman: 'teacher padha rahi hain.', en: 'The teacher is teaching.',
        whyWrong: 'That says who teaches — the question was what YOU are learning.' }
    ] },

  { scene: 'greeting-elders', sceneEn: 'Greeting the grown-ups at home',
    who: 'dadi',
    prompt: 'स्कूल के लिए देर हो रही है — टिफ़िन लिया?', roman: 'skool ke liye der ho rahi hai — tiffin liya?', en: 'You’re getting late for school — did you take your tiffin?',
    reply: { hi: 'जी हाँ, बैग में रख लिया।', roman: 'ji haan, bag mein rakh liya.', en: 'Yes, I’ve put it in my bag.' },
    distractors: [
      { hi: 'टिफ़िन में रोटी है।', roman: 'tiffin mein roti hai.', en: 'There’s roti in the tiffin.',
        whyWrong: 'Lovely detail — but Dadi asked DID you take it: a हाँ-or-नहीं question.' },
      { hi: 'जी हाँ, कल लिया था।', roman: 'ji haan, kal liya tha.', en: 'Yes, I took it yesterday.',
        whyWrong: 'Yesterday’s tiffin fed yesterday — Dadi means today’s.' },
      { hi: 'आपने टिफ़िन लिया?', roman: 'aapne tiffin liya?', en: 'Did YOU take a tiffin?',
        whyWrong: 'Dadi isn’t off to school — the tiffin question belongs to your bag, not hers.' }
    ] },

  /* ============ Scene: the-market — the sabzi mandi ===================== */

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'आओ बेटा, क्या चाहिए?', roman: 'aao beta, kya chaahiye?', en: 'Come, child — what would you like?',
    reply: { hi: 'दो किलो आलू दीजिए।', roman: 'do kilo aaloo deejiye.', en: 'Two kilos of potatoes, please.' },
    distractors: [
      { hi: 'मुझे कुछ नहीं बेचना।', roman: 'mujhe kuchh nahin bechna.', en: 'I don’t want to sell anything.',
        whyWrong: 'बेचना is the shopkeeper’s job — you’re here to buy; just name what you’d like.' },
      { hi: 'आपको क्या चाहिए?', roman: 'aapko kya chaahiye?', en: 'What would YOU like?',
        whyWrong: 'It’s his shop — turning the question around leaves the scales empty.' },
      { hi: 'आलू अच्छे हैं।', roman: 'aaloo achchhe hain.', en: 'The potatoes are nice.',
        whyWrong: 'Kind words — but he still doesn’t know what to weigh for you.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'आम ले लो बेटा, बहुत मीठे हैं!', roman: 'aam le lo beta, bahut meethe hain!', en: 'Take some mangoes, child — they’re very sweet!',
    reply: { hi: 'एक किलो आम कितने के हैं?', roman: 'ek kilo aam kitne ke hain?', en: 'How much is a kilo of mangoes?' },
    distractors: [
      { hi: 'आम पीले होते हैं।', roman: 'aam peele hote hain.', en: 'Mangoes are yellow.',
        whyWrong: 'A fact for the classroom — at the mandi, the next move is the price.' },
      { hi: 'हाँ, बहुत मीठे हैं।', roman: 'haan, bahut meethe hain.', en: 'Yes, they’re very sweet.',
        whyWrong: 'You haven’t tasted one yet — that’s the seller’s line; yours is to ask कितने के.' },
      { hi: 'ये केले कितने के हैं?', roman: 'ye kele kitne ke hain?', en: 'How much are these bananas?',
        whyWrong: 'Right question, wrong fruit — he’s offering आम.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'पचास रुपये किलो।', roman: 'pachaas rupaye kilo.', en: 'Fifty rupees a kilo.',
    reply: { hi: 'ठीक है, एक किलो दे दीजिए।', roman: 'theek hai, ek kilo de deejiye.', en: 'All right, give me one kilo.' },
    distractors: [
      { hi: 'पचास बहुत कम है।', roman: 'pachaas bahut kam hai.', en: 'Fifty is very little.',
        whyWrong: 'Careful bargainer — बहुत ज़्यादा argues the price down; कम would talk it UP!' },
      { hi: 'कितने के हैं?', roman: 'kitne ke hain?', en: 'How much are they?',
        whyWrong: 'He just told you — पचास रुपये. Listening is half the conversation.' },
      { hi: 'आपके पास पचास रुपये हैं?', roman: 'aapke paas pachaas rupaye hain?', en: 'Do you have fifty rupees?',
        whyWrong: 'He’s the one being paid — the fifty rupees travel from your side to his.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'और कुछ, बेटा?', roman: 'aur kuchh, beta?', en: 'Anything else, child?',
    reply: { hi: 'बस, और कुछ नहीं। धन्यवाद।', roman: 'bas, aur kuchh nahin. dhanyavaad.', en: 'That’s all, nothing else. Thank you.' },
    distractors: [
      { hi: 'हाँ, बस।', roman: 'haan, bas.', en: 'Yes, enough.',
        whyWrong: 'हाँ and बस pull opposite ways — हाँ if you want more, बस if you’re done. Pick one.' },
      { hi: 'और कुछ?', roman: 'aur kuchh?', en: 'Anything else?',
        whyWrong: 'That echoes his own question back at him — the answer lives on your side.' },
      { hi: 'मुझे कुछ नहीं आता।', roman: 'mujhe kuchh nahin aata.', en: 'I don’t know anything.',
        whyWrong: 'That कुछ नहीं is about knowing things — here you only need “nothing more, thanks”.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'यह लो — और यह धनिया मुफ़्त!', roman: 'yah lo — aur yah dhaniya muft!', en: 'Here you are — and this coriander is free!',
    reply: { hi: 'धन्यवाद! माँ ख़ुश होंगी।', roman: 'dhanyavaad! maa khush hongi.', en: 'Thank you! Mummy will be pleased.' },
    distractors: [
      { hi: 'धनिया कितने का है?', roman: 'dhaniya kitne ka hai?', en: 'How much is the coriander?',
        whyWrong: 'मुफ़्त means free — there’s no price left to ask!' },
      { hi: 'यह मुफ़्त नहीं है।', roman: 'yah muft nahin hai.', en: 'This isn’t free.',
        whyWrong: 'He just said it is — नहीं argues with a gift.' },
      { hi: 'धनिया हरा है।', roman: 'dhaniya hara hai.', en: 'The coriander is green.',
        whyWrong: 'True — but the kind thing here is a thank-you, not a colour report.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'mother',
    prompt: 'जाओ, उस दुकान से एक दर्जन केले ले आओ।', roman: 'jaao, us dukaan se ek darjan kele le aao.', en: 'Go and get a dozen bananas from that shop.',
    reply: { hi: 'जी माँ! पैसे दीजिए।', roman: 'ji maa! paise deejiye.', en: 'Yes, Mummy! Give me the money.' },
    distractors: [
      { hi: 'माँ, आप ले आइए।', roman: 'maa, aap le aaiye.', en: 'Mummy, you get them.',
        whyWrong: 'That hands the errand straight back — Mummy asked because your legs are faster!' },
      { hi: 'एक केला ले आऊँ?', roman: 'ek kela le aaoon?', en: 'Shall I get one banana?',
        whyWrong: 'दर्जन is a dozen — twelve bananas, not one lonely one.' },
      { hi: 'मुझे केले पसंद हैं।', roman: 'mujhe kele pasand hain.', en: 'I like bananas.',
        whyWrong: 'Good to know — but Mummy asked you to fetch, not to review.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'पैसे किसके पास हैं?', roman: 'paise kiske paas hain?', en: 'Who has the money?',
    reply: { hi: 'पैसे माँ के पास हैं।', roman: 'paise maa ke paas hain.', en: 'Mummy has the money.' },
    distractors: [
      { hi: 'पैसे मेरे लिए हैं।', roman: 'paise mere liye hain.', en: 'The money is for me.',
        whyWrong: 'के पास says who is holding it — के लिए would make the money a present for you.' },
      { hi: 'माँ दुकान में हैं।', roman: 'maa dukaan mein hain.', en: 'Mummy is in the shop.',
        whyWrong: 'That answers “where is Mummy” — he asked किसके पास, who has the paise.' },
      { hi: 'दस रुपये हैं।', roman: 'das rupaye hain.', en: 'There are ten rupees.',
        whyWrong: 'That answers “कितने पैसे” — how much; he asked WHO has them.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'तरबूज़ कैसा दूँ — बड़ा या छोटा?', roman: 'tarbooz kaisa doon — bada ya chhota?', en: 'Which watermelon shall I give — big or small?',
    reply: { hi: 'छोटा वाला दीजिए।', roman: 'chhota vaala deejiye.', en: 'Give me the small one.' },
    distractors: [
      { hi: 'हाँ।', roman: 'haan.', en: 'Yes.',
        whyWrong: 'बड़ा या छोटा is a pick-one question — हाँ doesn’t pick.' },
      { hi: 'तरबूज़ अंदर से लाल होता है।', roman: 'tarbooz andar se laal hota hai.', en: 'A watermelon is red inside.',
        whyWrong: 'True and delicious — but he’s waiting to hear which one to weigh.' },
      { hi: 'मुझे आम चाहिए।', roman: 'mujhe aam chaahiye.', en: 'I want mangoes.',
        whyWrong: 'That swaps the fruit instead of answering — the question was about the तरबूज़.' }
    ] },

  { scene: 'the-market', sceneEn: 'At the sabzi mandi with Mummy',
    who: 'vendor',
    prompt: 'यह लो बाकी के दस रुपये।', roman: 'yah lo baaki ke das rupaye.', en: 'Here are your ten rupees change.',
    reply: { hi: 'धन्यवाद, भैया!', roman: 'dhanyavaad, bhaiya!', en: 'Thank you, bhaiya!' },
    distractors: [
      { hi: 'दस रुपये और दीजिए।', roman: 'das rupaye aur deejiye.', en: 'Give me ten rupees more.',
        whyWrong: 'बाकी is your change, already counted — और asks him to pay you twice.' },
      { hi: 'मेरे पास पैसे नहीं हैं।', roman: 'mere paas paise nahin hain.', en: 'I have no money.',
        whyWrong: 'You’re holding the change he just gave you — the coins disagree!' },
      { hi: 'यह लो दस रुपये।', roman: 'yah lo das rupaye.', en: 'Here, take ten rupees.',
        whyWrong: 'That hands the money straight back — and लो is for friends; for the bhaiya it’s लीजिए.' }
    ] },

  /* ============ Scene: at-a-wedding — a cousin's shaadi ================= */

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'bua',
    prompt: 'अरे वाह, कितने सुंदर कपड़े! किसने दिलाए?', roman: 'are vaah, kitne sundar kapde! kisne dilaae?', en: 'Oh my, what lovely clothes! Who got them for you?',
    reply: { hi: 'माँ ने दिलाए।', roman: 'maa ne dilaae.', en: 'Mummy got them for me.' },
    distractors: [
      { hi: 'मैंने कपड़े पहने हैं।', roman: 'maine kapde pahne hain.', en: 'I am wearing clothes.',
        whyWrong: 'Bua can see that! किसने asks WHO got them for you.' },
      { hi: 'कपड़े नए हैं।', roman: 'kapde nae hain.', en: 'The clothes are new.',
        whyWrong: 'That answers “are they new” — she asked किसने दिलाए, who bought them.' },
      { hi: 'बुआ, आपके कपड़े सुंदर हैं।', roman: 'bua, aapke kapde sundar hain.', en: 'Bua, your clothes are lovely.',
        whyWrong: 'Sweet — but answer her question first, then return the compliment.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'uncle',
    prompt: 'बेटा, खाना खाया कि नहीं?', roman: 'beta, khaana khaaya ki nahin?', en: 'Child, have you eaten or not?',
    reply: { hi: 'जी हाँ, अभी खाया।', roman: 'ji haan, abhi khaaya.', en: 'Yes, I just ate.' },
    distractors: [
      { hi: 'खाना वहाँ मिल रहा है।', roman: 'khaana vahaan mil raha hai.', en: 'The food is being served over there.',
        whyWrong: 'That answers “where is the food” — he asked whether YOU have eaten.' },
      { hi: 'आपने खाया कि नहीं?', roman: 'aapne khaaya ki nahin?', en: 'Have YOU eaten or not?',
        whyWrong: 'Kind of you to check — but answer first, then ask him back.' },
      { hi: 'खाना गरम है।', roman: 'khaana garam hai.', en: 'The food is hot.',
        whyWrong: 'A food report, not an answer — खाया कि नहीं wants a हाँ or नहीं.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'cousin',
    prompt: 'चल, नाचने चलें?', roman: 'chal, naachne chalen?', en: 'Come on, shall we go dance?',
    reply: { hi: 'हाँ, चलो! मुझे नाचना है!', roman: 'haan, chalo! mujhe naachna hai!', en: 'Yes, come on! I want to dance!' },
    distractors: [
      { hi: 'हाँ, तुम नाचो।', roman: 'haan, tum naacho.', en: 'Yes — you dance.',
        whyWrong: 'That sends your cousin off alone — चलें means together.' },
      { hi: 'तुम्हें नाचना नहीं आता।', roman: 'tumhen naachna nahin aata.', en: 'You can’t dance.',
        whyWrong: 'That teases instead of answering — they asked you to join, not to judge!' },
      { hi: 'आप नाचिए।', roman: 'aap naachiye.', en: 'You dance (formal).',
        whyWrong: 'आप is for elders — for your cousin it’s तुम. Better still: चलो, and dance together.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'aunty',
    prompt: 'पहचाना मुझे? मैं तुम्हारी नानी की बहन हूँ।', roman: 'pahchaana mujhe? main tumhaari nani ki bahan hoon.', en: 'Do you recognise me? I’m your Nani’s sister.',
    reply: { hi: 'जी, प्रणाम! अब पहचान लिया!', roman: 'ji, pranaam! ab pahchaan liya!', en: 'Oh, pranaam! Now I recognise you!' },
    distractors: [
      { hi: 'नहीं, आप कौन?', roman: 'nahin, aap kaun?', en: 'No — who are you?',
        whyWrong: 'She has just told you who she is — कौन asks it all over again.' },
      { hi: 'नानी घर पर हैं।', roman: 'nani ghar par hain.', en: 'Nani is at home.',
        whyWrong: 'Nobody asked where Nani is — her sister is right here, waiting for a hello!' },
      { hi: 'तुम कौन हो?', roman: 'tum kaun ho?', en: 'Who are you (tum)?',
        whyWrong: 'तुम to an elder stings twice — and she’s already introduced herself.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'mother',
    prompt: 'इतनी भीड़ में हाथ मत छोड़ना।', roman: 'itni bheed mein haath mat chhodna.', en: 'Don’t let go of my hand in this crowd.',
    reply: { hi: 'जी माँ, पकड़ लिया।', roman: 'ji maa, pakad liya.', en: 'Yes Mummy — got it tight.' },
    distractors: [
      { hi: 'भीड़ बहुत है।', roman: 'bheed bahut hai.', en: 'It’s very crowded.',
        whyWrong: 'That’s exactly why Mummy asked — she needs your promise, not the headcount.' },
      { hi: 'हाथ छोड़ दिया।', roman: 'haath chhod diya.', en: 'I let go.',
        whyWrong: 'मत छोड़ना means DON’T — this announces you already did!' },
      { hi: 'मुझे भीड़ पसंद है।', roman: 'mujhe bheed pasand hai.', en: 'I like crowds.',
        whyWrong: 'Maybe so — but it dodges the one thing Mummy asked you to do.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'uncle',
    prompt: 'सब लोग, फ़ोटो होगी! बेटा, तुम आगे खड़े हो जाओ।', roman: 'sab log, photo hogi! beta, tum aage khade ho jaao.', en: 'Everyone, photo time! Child, you stand in front.',
    reply: { hi: 'जी, यहाँ ठीक है?', roman: 'ji, yahaan theek hai?', en: 'Okay — is here all right?' },
    distractors: [
      { hi: 'आप आगे खड़े हो जाइए।', roman: 'aap aage khade ho jaaiye.', en: 'You stand in front.',
        whyWrong: 'He’s the one taking the photo — the front spot was offered to you.' },
      { hi: 'फ़ोटो सुंदर है।', roman: 'photo sundar hai.', en: 'The photo is beautiful.',
        whyWrong: 'The photo doesn’t exist yet — first stand in front, then admire it!' },
      { hi: 'मुझे फ़ोटो नहीं देखनी।', roman: 'mujhe photo nahin dekhni.', en: 'I don’t want to see the photo.',
        whyWrong: 'He’s TAKING a photo, not showing one — देखना isn’t the ask.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'bua',
    prompt: 'मीठे में क्या दूँ — लड्डू या बर्फ़ी?', roman: 'meethe mein kya doon — laddoo ya barfi?', en: 'What sweet shall I give you — laddoo or barfi?',
    reply: { hi: 'मुझे लड्डू दीजिए, बुआ।', roman: 'mujhe laddoo deejiye, bua.', en: 'Give me a laddoo, Bua.' },
    distractors: [
      { hi: 'हाँ, दीजिए।', roman: 'haan, deejiye.', en: 'Yes, give me.',
        whyWrong: 'लड्डू या बर्फ़ी is a pick-one question — हाँ leaves Bua holding both.' },
      { hi: 'मुझे मिठाई नहीं बनानी।', roman: 'mujhe mithai nahin banaani.', en: 'I don’t want to make sweets.',
        whyWrong: 'बनाना is cooking — nobody asked you to cook; just choose one to eat.' },
      { hi: 'लड्डू गोल होता है।', roman: 'laddoo gol hota hai.', en: 'A laddoo is round.',
        whyWrong: 'Roundly true — but Bua needs your pick, not its shape.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'cousin',
    prompt: 'देखो, बारात आ गई!', roman: 'dekho, baaraat aa gai!', en: 'Look, the baraat has arrived!',
    reply: { hi: 'चलो, देखने चलते हैं!', roman: 'chalo, dekhne chalte hain!', en: 'Come on, let’s go and watch!' },
    distractors: [
      { hi: 'बारात कल आएगी।', roman: 'baaraat kal aaegi.', en: 'The baraat will come tomorrow.',
        whyWrong: 'आ गई means it’s here NOW — कल argues with the dhol you can already hear.' },
      { hi: 'कौन आ गया?', roman: 'kaun aa gaya?', en: 'Who has come?',
        whyWrong: 'They just told you — बारात! कौन asks as if you didn’t hear.' },
      { hi: 'बारात जा रही है।', roman: 'baaraat ja rahi hai.', en: 'The baraat is leaving.',
        whyWrong: 'आ गई means arriving — जा रही turns the whole procession around.' }
    ] },

  { scene: 'at-a-wedding', sceneEn: 'At a cousin’s wedding',
    who: 'mother',
    prompt: 'बहुत रात हो गई — अब घर चलें?', roman: 'bahut raat ho gai — ab ghar chalen?', en: 'It’s very late — shall we head home now?',
    reply: { hi: 'थोड़ी देर और, माँ! अभी नाच बाकी है।', roman: 'thodi der aur, maa! abhi naach baaki hai.', en: 'A little longer, Mummy! The dancing isn’t over yet.' },
    distractors: [
      { hi: 'हाँ, स्कूल चलते हैं।', roman: 'haan, skool chalte hain.', en: 'Yes, let’s go to school.',
        whyWrong: 'At midnight after a shaadi, घर is the ride — स्कूल can wait for morning.' },
      { hi: 'माँ, आप चलिए।', roman: 'maa, aap chaliye.', en: 'Mummy, you go.',
        whyWrong: 'That sends Mummy home without you — ask for थोड़ी देर और instead.' },
      { hi: 'हम घर आ गए।', roman: 'ham ghar aa gae.', en: 'We have reached home.',
        whyWrong: 'You’re still at the shaadi — आ गए jumps to the end of the ride.' }
    ] },

  /* ============ Scene: ordering-food — at the dhaba ===================== */

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'जी, क्या लेंगे आप?', roman: 'ji, kya lenge aap?', en: 'What will you have?',
    reply: { hi: 'एक प्लेट छोले-भटूरे दीजिए।', roman: 'ek plate chhole-bhatoore deejiye.', en: 'One plate of chhole bhature, please.' },
    distractors: [
      { hi: 'आप क्या लेंगे?', roman: 'aap kya lenge?', en: 'What will YOU have?',
        whyWrong: 'He’s taking the order, not eating — turning it around leaves everyone hungry.' },
      { hi: 'खाना अच्छा है।', roman: 'khaana achchha hai.', en: 'The food is good.',
        whyWrong: 'You haven’t tasted anything yet — first comes the order, then the review.' },
      { hi: 'मुझे भूख लगी है।', roman: 'mujhe bhookh lagi hai.', en: 'I am hungry.',
        whyWrong: 'He believes you! But क्या लेंगे asks WHICH dish — name one.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'खाने में मिर्च कैसी रखें — तेज़ या कम?', roman: 'khaane mein mirch kaisi rakhen — tez ya kam?', en: 'How spicy shall we make it — hot or mild?',
    reply: { hi: 'कम मिर्च, कृपया।', roman: 'kam mirch, kripya.', en: 'Mild, please.' },
    distractors: [
      { hi: 'मिर्च मत खाइए।', roman: 'mirch mat khaaiye.', en: 'Don’t eat chillies.',
        whyWrong: 'He’s cooking, not eating — कम मिर्च tells him how to make YOURS.' },
      { hi: 'कम बोलिए।', roman: 'kam boliye.', en: 'Speak less.',
        whyWrong: 'The कम belongs to the मिर्च, not to his talking!' },
      { hi: 'तेज़ चलिए।', roman: 'tez chaliye.', en: 'Walk fast.',
        whyWrong: 'This तेज़ is about spice, not speed — nobody needs to run anywhere.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'पीने के लिए क्या लाऊँ?', roman: 'peene ke liye kya laaoon?', en: 'What shall I bring to drink?',
    reply: { hi: 'एक लस्सी और एक पानी लाइए।', roman: 'ek lassi aur ek paani laaiye.', en: 'One lassi and one water, please.' },
    distractors: [
      { hi: 'कुछ खाने के लिए लाइए।', roman: 'kuchh khaane ke liye laaiye.', en: 'Bring something to eat.',
        whyWrong: 'He asked about drinks — पीने के लिए; the खाना list is a different question.' },
      { hi: 'मैंने पानी पिया।', roman: 'maine paani piya.', en: 'I drank water.',
        whyWrong: 'That reports the past — लाऊँ asks what to bring NOW.' },
      { hi: 'आप लस्सी पीजिए।', roman: 'aap lassi peejiye.', en: 'You drink a lassi.',
        whyWrong: 'That orders the waiter a drink — the lassi was meant for your table.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'गरम है, ध्यान से।', roman: 'garam hai, dhyaan se.', en: 'It’s hot — careful.',
    reply: { hi: 'जी, ठंडा होने देते हैं।', roman: 'ji, thanda hone dete hain.', en: 'Okay — we’ll let it cool a little.' },
    distractors: [
      { hi: 'गरम नहीं, ठंडा है।', roman: 'garam nahin, thanda hai.', en: 'It’s not hot, it’s cold.',
        whyWrong: 'He carried it from the tawa — नहीं argues before you’ve even touched the plate.' },
      { hi: 'मुझे ठंड लग रही है।', roman: 'mujhe thand lag rahi hai.', en: 'I’m feeling cold.',
        whyWrong: 'ठंड लगना is feeling chilly — the PLATE is hot; you’re fine.' },
      { hi: 'ध्यान कहाँ है?', roman: 'dhyaan kahaan hai?', en: 'Where is the dhyaan?',
        whyWrong: 'ध्यान से means “carefully” — it isn’t a thing on the table.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'और रोटी लाऊँ?', roman: 'aur roti laaoon?', en: 'Shall I bring more roti?',
    reply: { hi: 'जी नहीं, बस — पेट भर गया।', roman: 'ji nahin, bas — pet bhar gaya.', en: 'No thanks, that’s enough — I’m full.' },
    distractors: [
      { hi: 'हाँ, पेट भर गया।', roman: 'haan, pet bhar gaya.', en: 'Yes — I’m full.',
        whyWrong: 'हाँ asks for more, पेट भर गया says you’re done — they can’t both drive.' },
      { hi: 'रोटी गरम है।', roman: 'roti garam hai.', en: 'The roti is hot.',
        whyWrong: 'That reviews the roti — he asked whether to bring ANOTHER.' },
      { hi: 'मैंने रोटी बनाई।', roman: 'maine roti banaai.', en: 'I made the roti.',
        whyWrong: 'The dhaba’s cook might disagree — बनाई claims his kitchen!' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'खाना कैसा लगा?', roman: 'khaana kaisa laga?', en: 'How was the food?',
    reply: { hi: 'बहुत अच्छा लगा! दाल सबसे अच्छी थी।', roman: 'bahut achchha laga! daal sabse achchhi thi.', en: 'Very good! The daal was the best.' },
    distractors: [
      { hi: 'खाना मेज़ पर है।', roman: 'khaana mez par hai.', en: 'The food is on the table.',
        whyWrong: 'That answers “where” — कैसा लगा asks how you LIKED it.' },
      { hi: 'अच्छा, फिर मिलेंगे।', roman: 'achchha, phir milenge.', en: 'Okay, see you later.',
        whyWrong: 'That treats his question as a goodbye — he’s hoping for a verdict first.' },
      { hi: 'खीर मीठी होती है।', roman: 'kheer meethi hoti hai.', en: 'Kheer is sweet.',
        whyWrong: 'True of kheer everywhere — he asked about TODAY’s khana, on your plate.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'मीठे में क्या लेंगे — खीर है, जलेबी है।', roman: 'meethe mein kya lenge — kheer hai, jalebi hai.', en: 'What will you have for dessert — there’s kheer, there’s jalebi.',
    reply: { hi: 'मेरे लिए एक जलेबी, कृपया।', roman: 'mere liye ek jalebi, kripya.', en: 'One jalebi for me, please.' },
    distractors: [
      { hi: 'जलेबी कौन है?', roman: 'jalebi kaun hai?', en: 'Who is jalebi?',
        whyWrong: 'कौन asks about people — for sweets it’s क्या. (Though jalebi does feel like family.)' },
      { hi: 'जी हाँ।', roman: 'ji haan.', en: 'Yes.',
        whyWrong: 'जी हाँ accepts… which one? Name your मीठा — खीर or जलेबी.' },
      { hi: 'जलेबी में क्या डालते हैं?', roman: 'jalebi mein kya daalte hain?', en: 'What goes into a jalebi?',
        whyWrong: 'A cook’s question — save it for after; right now he needs your pick.' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'यह रहा बिल — दो सौ रुपये।', roman: 'yah raha bill — do sau rupaye.', en: 'Here’s the bill — two hundred rupees.',
    reply: { hi: 'पापा, बिल आ गया!', roman: 'papa, bill aa gaya!', en: 'Papa, the bill is here!' },
    distractors: [
      { hi: 'और बिल लाइए।', roman: 'aur bill laaiye.', en: 'Bring more bills.',
        whyWrong: 'One is plenty — बिल isn’t a dish to reorder!' },
      { hi: 'यह रहा बिल।', roman: 'yah raha bill.', en: 'Here’s the bill.',
        whyWrong: 'That’s the waiter’s line — echoing it back hands the bill to nobody.' },
      { hi: 'पैसे आपके पास हैं।', roman: 'paise aapke paas hain.', en: 'YOU have the money.',
        whyWrong: 'He’s collecting, not paying — the paise come from your side. (पापा को बुलाओ!)' }
    ] },

  { scene: 'ordering-food', sceneEn: 'Ordering at the dhaba with the family',
    who: 'waiter',
    prompt: 'फिर आइएगा!', roman: 'phir aaiyega!', en: 'Do come again!',
    reply: { hi: 'ज़रूर आएँगे! खाना बहुत अच्छा था।', roman: 'zaroor aaenge! khaana bahut achchha tha.', en: 'We’ll definitely come again! The food was very good.' },
    distractors: [
      { hi: 'कभी नहीं आएँगे।', roman: 'kabhi nahin aaenge.', en: 'We’ll never come again.',
        whyWrong: 'He’s inviting you back — कभी नहीं slams that door; ज़रूर keeps it warm.' },
      { hi: 'आप फिर आइएगा।', roman: 'aap phir aaiyega.', en: 'YOU come again.',
        whyWrong: 'He’s already here every day — फिर आइएगा is for the guests, and that’s you.' },
      { hi: 'अभी और खाएँगे।', roman: 'abhi aur khaaenge.', en: 'We’ll eat more now.',
        whyWrong: 'The meal is done and the bill is paid — this is “see you next time”, not seconds.' }
    ] },

  /* ============ Scene: at-school — Hindi class and the gate ============= */

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'सुप्रभात, बच्चो!', roman: 'suprabhaat, bachcho!', en: 'Good morning, children!',
    reply: { hi: 'सुप्रभात, मैडम जी!', roman: 'suprabhaat, madam ji!', en: 'Good morning, Madam!' },
    distractors: [
      { hi: 'शुभ रात्रि, मैडम जी!', roman: 'shubh raatri, madam ji!', en: 'Good night, Madam!',
        whyWrong: 'शुभ रात्रि is for bedtime — mornings open with सुप्रभात.' },
      { hi: 'सुप्रभात, बच्चो!', roman: 'suprabhaat, bachcho!', en: 'Good morning, children!',
        whyWrong: 'बच्चो is what SHE calls the class — you’re one of the bachche; greet her back as मैडम.' },
      { hi: 'मैं ठीक हूँ।', roman: 'main theek hoon.', en: 'I am fine.',
        whyWrong: 'That answers “how are you?” — nobody asked yet; a greeting wants a greeting.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'आज कौन-सा दिन है?', roman: 'aaj kaun-sa din hai?', en: 'What day is it today?',
    reply: { hi: 'आज सोमवार है।', roman: 'aaj somvaar hai.', en: 'Today is Monday.' },
    distractors: [
      { hi: 'आज बारिश है।', roman: 'aaj baarish hai.', en: 'It’s raining today.',
        whyWrong: 'That answers “how’s the weather” — she asked which DAY it is.' },
      { hi: 'कल रविवार था।', roman: 'kal ravivaar tha.', en: 'Yesterday was Sunday.',
        whyWrong: 'Right family, wrong day — कल looks backwards; आज asks about today.' },
      { hi: 'सात दिन होते हैं।', roman: 'saat din hote hain.', en: 'There are seven days.',
        whyWrong: 'That answers “कितने दिन” — how many; she asked कौन-सा, which one.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'यह शब्द कौन पढ़ेगा?', roman: 'yah shabd kaun padhega?', en: 'Who will read this word?',
    reply: { hi: 'मैडम, मैं! मुझे आता है।', roman: 'madam, main! mujhe aata hai.', en: 'Madam, me! I know it.' },
    distractors: [
      { hi: 'मैडम, आप पढ़िए।', roman: 'madam, aap padhiye.', en: 'Madam, you read it.',
        whyWrong: 'She reads it every year — कौन पढ़ेगा is her invitation to YOU.' },
      { hi: 'शब्द छोटा है।', roman: 'shabd chhota hai.', en: 'The word is small.',
        whyWrong: 'Then all the easier to read it — size wasn’t the question!' },
      { hi: 'मुझे शब्द चाहिए।', roman: 'mujhe shabd chaahiye.', en: 'I want the word.',
        whyWrong: 'चाहिए asks to be GIVEN the word — she asked who will read it aloud.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, at tiffin time',
    who: 'friend',
    prompt: 'आज टिफ़िन में क्या है?', roman: 'aaj tiffin mein kya hai?', en: 'What’s in your tiffin today?',
    reply: { hi: 'पराठा है — थोड़ा लो!', roman: 'paraatha hai — thoda lo!', en: 'Paratha — have some!' },
    distractors: [
      { hi: 'टिफ़िन बैग में है।', roman: 'tiffin bag mein hai.', en: 'The tiffin is in my bag.',
        whyWrong: 'That answers where the BOX is — your friend asked what’s inside it.' },
      { hi: 'कल पराठा था।', roman: 'kal paraatha tha.', en: 'Yesterday it was paratha.',
        whyWrong: 'Yesterday’s menu is history — आज asks about today’s box.' },
      { hi: 'तुम्हारे टिफ़िन में क्या है?', roman: 'tumhaare tiffin mein kya hai?', en: 'What’s in YOUR tiffin?',
        whyWrong: 'Fair trade! But show yours first — then ask theirs.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'होमवर्क किया?', roman: 'homework kiya?', en: 'Did you do your homework?',
    reply: { hi: 'जी मैडम, कर लिया — यह रहा।', roman: 'ji madam, kar liya — yah raha.', en: 'Yes Madam, all done — here it is.' },
    distractors: [
      { hi: 'होमवर्क मुश्किल है।', roman: 'homework mushkil hai.', en: 'The homework is hard.',
        whyWrong: 'Maybe true — but किया wants a हाँ or नहीं before the reasons.' },
      { hi: 'आपने होमवर्क दिया।', roman: 'aapne homework diya.', en: 'You gave the homework.',
        whyWrong: 'She knows — she gave it! किया asks what YOU did with it.' },
      { hi: 'जी, आपने किया।', roman: 'ji, aapne kiya.', en: 'Yes, YOU did it.',
        whyWrong: 'किया needs the right doer — मैंने, not आपने; it’s your copybook she’s asking about.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'शाबाश! बहुत अच्छा पढ़ा।', roman: 'shaabaash! bahut achchha padha.', en: 'Well done! You read very well.',
    reply: { hi: 'धन्यवाद, मैडम जी।', roman: 'dhanyavaad, madam ji.', en: 'Thank you, Madam.' },
    distractors: [
      { hi: 'शाबाश, मैडम जी।', roman: 'shaabaash, madam ji.', en: 'Well done, Madam.',
        whyWrong: 'शाबाश is a well-done from big to small — going up, the word is धन्यवाद.' },
      { hi: 'मैंने नहीं पढ़ा।', roman: 'maine nahin padha.', en: 'I didn’t read.',
        whyWrong: 'The whole class heard you! नहीं erases your own good work.' },
      { hi: 'कोई बात नहीं।', roman: 'koi baat nahin.', en: 'No problem.',
        whyWrong: 'कोई बात नहीं pairs with a sorry — praise pairs with धन्यवाद.' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, at the gate after the bell',
    who: 'friend',
    prompt: 'छुट्टी के बाद खेलने चलें?', roman: 'chhutti ke baad khelne chalen?', en: 'Shall we go play after school?',
    reply: { hi: 'हाँ, चलो — मैदान में मिलते हैं।', roman: 'haan, chalo — maidaan mein milte hain.', en: 'Yes, come on — see you on the field.' },
    distractors: [
      { hi: 'हाँ, कल मिलेंगे।', roman: 'haan, kal milenge.', en: 'Yes — see you tomorrow.',
        whyWrong: 'छुट्टी के बाद is TODAY — कल pushes your friend a whole day away.' },
      { hi: 'छुट्टी हो गई।', roman: 'chhutti ho gai.', en: 'School’s out.',
        whyWrong: 'They know — the bell rang! The question was whether you’ll come play.' },
      { hi: 'मैडम खेलेंगी।', roman: 'madam khelengi.', en: 'Madam will play.',
        whyWrong: 'Madam has copies to check — the invitation was for you!' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, in Hindi class',
    who: 'teacher',
    prompt: 'किताब का पन्ना बीस खोलो।', roman: 'kitaab ka panna bees kholo.', en: 'Open your book to page twenty.',
    reply: { hi: 'जी मैडम, खोल लिया।', roman: 'ji madam, khol liya.', en: 'Yes Madam, done.' },
    distractors: [
      { hi: 'किताब बीस रुपये की है।', roman: 'kitaab bees rupaye ki hai.', en: 'The book costs twenty rupees.',
        whyWrong: 'This बीस counts pages, not rupees — no shopping in Hindi class!' },
      { hi: 'मेरे पास बीस किताबें हैं।', roman: 'mere paas bees kitaaben hain.', en: 'I have twenty books.',
        whyWrong: 'One book, page twenty — the बीस belongs to the पन्ना.' },
      { hi: 'किताब बंद कर ली।', roman: 'kitaab band kar li.', en: 'I’ve closed the book.',
        whyWrong: 'बंद is the opposite of खोलो — the lesson is inside!' }
    ] },

  { scene: 'at-school', sceneEn: 'At school, at home time',
    who: 'teacher',
    prompt: 'कल हिंदी की कॉपी लाना मत भूलना।', roman: 'kal hindi ki copy laana mat bhoolna.', en: 'Don’t forget to bring your Hindi copybook tomorrow.',
    reply: { hi: 'जी मैडम, पक्का याद रहेगा।', roman: 'ji madam, pakka yaad rahega.', en: 'Yes Madam, I’ll remember for sure.' },
    distractors: [
      { hi: 'जी, कॉपी भूल गए।', roman: 'ji, copy bhool gae.', en: 'Yes — already forgot the copybook.',
        whyWrong: 'She’s asking about TOMORROW — भूल गए gives up before even trying!' },
      { hi: 'कॉपी नीली है।', roman: 'copy neeli hai.', en: 'The copybook is blue.',
        whyWrong: 'A colour, not a promise — she asked you to remember, not describe.' },
      { hi: 'कल छुट्टी है।', roman: 'kal chhutti hai.', en: 'Tomorrow is a holiday.',
        whyWrong: 'If Madam is assigning for कल, there’s school — this argues with the calendar instead of answering.' }
    ] },

  /* ============ Scene: asking-the-way — Nani's neighbourhood ============ */

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'shopkeeper',
    prompt: 'मंदिर? सीधे जाओ, फिर बाएँ।', roman: 'mandir? seedhe jaao, phir baaen.', en: 'The temple? Go straight, then left.',
    reply: { hi: 'सीधे, फिर बाएँ — धन्यवाद अंकल!', roman: 'seedhe, phir baaen — dhanyavaad uncle!', en: 'Straight, then left — thank you, Uncle!' },
    distractors: [
      { hi: 'सीधे, फिर दाएँ — धन्यवाद!', roman: 'seedhe, phir daaen — dhanyavaad!', en: 'Straight, then right — thank you!',
        whyWrong: 'Almost — he said बाएँ (left); दाएँ repeats it back with the wrong turn.' },
      { hi: 'मंदिर कहाँ है?', roman: 'mandir kahaan hai?', en: 'Where is the temple?',
        whyWrong: 'He just told you the way — asking again means the directions flew past.' },
      { hi: 'आप सीधे जाइए।', roman: 'aap seedhe jaaiye.', en: 'YOU go straight.',
        whyWrong: 'He’s minding his shop — the directions were for your feet, not his.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'aunty',
    prompt: 'कहाँ जाना है, बेटा?', roman: 'kahaan jaana hai, beta?', en: 'Where are you off to, love?',
    reply: { hi: 'जी, पार्क जाना है। किधर है?', roman: 'ji, park jaana hai. kidhar hai?', en: 'To the park. Which way is it?' },
    distractors: [
      { hi: 'जी, घर से आए हैं।', roman: 'ji, ghar se aae hain.', en: 'We’ve come from home.',
        whyWrong: 'That answers “कहाँ से” — where FROM; she asked कहाँ जाना है, where TO.' },
      { hi: 'आपको कहाँ जाना है?', roman: 'aapko kahaan jaana hai?', en: 'Where are YOU off to?',
        whyWrong: 'She asked to help you — bounce the question back and nobody gets anywhere.' },
      { hi: 'पार्क में झूले हैं।', roman: 'park mein jhoole hain.', en: 'There are swings in the park.',
        whyWrong: 'True and tempting! But first tell her that’s where you’re headed.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'uncle',
    prompt: 'वह देखो, पीला घर — नानी का घर वही है।', roman: 'vah dekho, peela ghar — nani ka ghar vahi hai.', en: 'See there, the yellow house — that’s Nani’s house.',
    reply: { hi: 'जी, वह पीला वाला! धन्यवाद।', roman: 'ji, vah peela vaala! dhanyavaad.', en: 'Yes, that yellow one! Thank you.' },
    distractors: [
      { hi: 'वह नीला वाला?', roman: 'vah neela vaala?', en: 'That blue one?',
        whyWrong: 'He said पीला — yellow; नीला paints it blue and knocks on a stranger’s door.' },
      { hi: 'पीला घर किसका है?', roman: 'peela ghar kiska hai?', en: 'Whose is the yellow house?',
        whyWrong: 'He just said whose — नानी का! The answer arrived with the pointing finger.' },
      { hi: 'मेरा घर बड़ा है।', roman: 'mera ghar bada hai.', en: 'My house is big.',
        whyWrong: 'Your house is an ocean away — he’s pointing at Nani’s, right there.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'rickshaw-wala',
    prompt: 'कहाँ चलना है?', roman: 'kahaan chalna hai?', en: 'Where to?',
    reply: { hi: 'स्टेशन चलिए, भैया।', roman: 'station chaliye, bhaiya.', en: 'To the station, bhaiya.' },
    distractors: [
      { hi: 'जल्दी चलिए।', roman: 'jaldi chaliye.', en: 'Go fast.',
        whyWrong: 'That answers “कैसे” — how; he asked कहाँ, where.' },
      { hi: 'हाँ, चलना है।', roman: 'haan, chalna hai.', en: 'Yes, we want to go.',
        whyWrong: 'He knows that — you climbed in! कहाँ wants a place-name.' },
      { hi: 'पैदल चलेंगे।', roman: 'paidal chalenge.', en: 'We’ll walk.',
        whyWrong: 'Then why hop into the rickshaw? In the seat, कहाँ needs a destination.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'aunty',
    prompt: 'पास ही है — बस दो मिनट पैदल।', roman: 'paas hi hai — bas do minute paidal.', en: 'It’s close by — just two minutes on foot.',
    reply: { hi: 'बहुत अच्छा! चलो माँ, पास ही है।', roman: 'bahut achchha! chalo maa, paas hi hai.', en: 'Great! Come on Mummy, it’s close by.' },
    distractors: [
      { hi: 'बहुत दूर है।', roman: 'bahut door hai.', en: 'It’s very far.',
        whyWrong: 'She just said पास — near; दूर argues with the person who lives here.' },
      { hi: 'बस कहाँ मिलेगी?', roman: 'bas kahaan milegi?', en: 'Where do we get the bus?',
        whyWrong: 'That बस means “just two minutes”, not the bus — no ticket needed, sirf do minute!' },
      { hi: 'पैदल कौन है?', roman: 'paidal kaun hai?', en: 'Who is Paidal?',
        whyWrong: 'पैदल isn’t a person — it means “on foot”.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'shopkeeper',
    prompt: 'यह गली सीधी बाज़ार जाती है।', roman: 'yah gali seedhi baazaar jaati hai.', en: 'This lane goes straight to the bazaar.',
    reply: { hi: 'धन्यवाद! चलो माँ, इसी गली से चलते हैं।', roman: 'dhanyavaad! chalo maa, isi gali se chalte hain.', en: 'Thank you! Come on Mummy, let’s take this lane.' },
    distractors: [
      { hi: 'नहीं, यह गली बाज़ार नहीं जाती।', roman: 'nahin, yah gali baazaar nahin jaati.', en: 'No, this lane doesn’t go to the bazaar.',
        whyWrong: 'He walks this गली every day — trust the local over a guess!' },
      { hi: 'बाज़ार गली जाता है।', roman: 'baazaar gali jaata hai.', en: 'The bazaar goes to the lane.',
        whyWrong: 'Flipped! The गली leads to the बाज़ार — the bazaar stays put.' },
      { hi: 'हम बाज़ार से आए हैं।', roman: 'ham baazaar se aae hain.', en: 'We’ve come from the bazaar.',
        whyWrong: 'से is “from” — but you’re going TO the bazaar; that’s the other direction.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'aunty',
    prompt: 'अकेले हो? मम्मी कहाँ हैं?', roman: 'akele ho? mummy kahaan hain?', en: 'Are you alone? Where’s your mum?',
    reply: { hi: 'वह रहीं मम्मी — सामने दुकान पर।', roman: 'vah raheen mummy — saamne dukaan par.', en: 'There’s Mummy — at the shop just across.' },
    distractors: [
      { hi: 'मम्मी ठीक हैं।', roman: 'mummy theek hain.', en: 'Mummy is fine.',
        whyWrong: 'That answers “how is she” — Aunty asked कहाँ, where.' },
      { hi: 'मम्मी बाज़ार जाएँगी।', roman: 'mummy baazaar jaaengi.', en: 'Mummy will go to the bazaar.',
        whyWrong: 'That’s a plan for later — कहाँ हैं asks where she is right NOW.' },
      { hi: 'आप कहाँ हैं?', roman: 'aap kahaan hain?', en: 'Where are YOU?',
        whyWrong: 'She’s standing right in front of you — that question answers itself!' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'uncle',
    prompt: 'आगे रास्ता बंद है — उधर से घूमकर जाओ।', roman: 'aage raasta band hai — udhar se ghoomkar jaao.', en: 'The road ahead is closed — go around that way.',
    reply: { hi: 'अच्छा, उधर से। धन्यवाद अंकल!', roman: 'achchha, udhar se. dhanyavaad uncle!', en: 'Okay, around that way. Thank you, Uncle!' },
    distractors: [
      { hi: 'हम आगे ही जाएँगे।', roman: 'ham aage hi jaaenge.', en: 'We’ll go straight ahead anyway.',
        whyWrong: 'बंद means closed — आगे walks you straight into the barrier.' },
      { hi: 'रास्ता कब खुलेगा?', roman: 'raasta kab khulega?', en: 'When will the road open?',
        whyWrong: 'A fair question for the municipality! But right now, the way home is उधर से.' },
      { hi: 'उधर रास्ता बंद है।', roman: 'udhar raasta band hai.', en: 'The road THAT way is closed.',
        whyWrong: 'He said आगे is closed and उधर is open — this swaps the two.' }
    ] },

  { scene: 'asking-the-way', sceneEn: 'Finding the way in Nani’s neighbourhood, with Mummy',
    who: 'nani',
    prompt: 'आ गए! रास्ते में कोई परेशानी तो नहीं हुई?', roman: 'aa gae! raaste mein koi pareshaani to nahin hui?', en: 'You made it! No trouble on the way, I hope?',
    reply: { hi: 'नहीं नानी, हम पूछते-पूछते आ गए।', roman: 'nahin nani, ham poochhte-poochhte aa gae.', en: 'No Nani — we asked our way here.' },
    distractors: [
      { hi: 'जी, रास्ता बंद था इसलिए हम घर चले गए।', roman: 'ji, raasta band tha isliye ham ghar chale gae.', en: 'Yes — the road was closed, so we went home.',
        whyWrong: 'But you’re standing at her gate! चले गए tells a story your own feet disprove.' },
      { hi: 'नानी, आप कहाँ जा रही हैं?', roman: 'nani, aap kahaan ja rahi hain?', en: 'Nani, where are you going?',
        whyWrong: 'Nobody’s leaving — you’ve just arrived! She asked how the journey went.' },
      { hi: 'हम कल आएँगे।', roman: 'ham kal aaenge.', en: 'We’ll come tomorrow.',
        whyWrong: 'You’ve already arrived — आ गए! कल would un-ring the doorbell.' }
    ] },

  /* ============ Scene: mehmaan-aaye — guests at home ==================== */

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'mother',
    prompt: 'देखो तो, दरवाज़े पर कौन आया है।', roman: 'dekho to, darvaaze par kaun aaya hai.', en: 'Go see who’s at the door.',
    reply: { hi: 'अंकल-आंटी आए हैं, माँ!', roman: 'uncle-aunty aae hain, maa!', en: 'It’s Uncle and Aunty, Mummy!' },
    distractors: [
      { hi: 'दरवाज़ा बंद है।', roman: 'darvaaza band hai.', en: 'The door is closed.',
        whyWrong: 'That’s exactly why Mummy asked — देखो means go and SEE!' },
      { hi: 'कोई नहीं आएगा।', roman: 'koi nahin aaega.', en: 'Nobody will come.',
        whyWrong: 'Somebody already HAS — the doorbell says so; आएगा looks the wrong way in time.' },
      { hi: 'घंटी बज रही है।', roman: 'ghanti baj rahi hai.', en: 'The bell is ringing.',
        whyWrong: 'Mummy heard it too — कौन asks for the who, not the sound.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'uncle',
    prompt: 'और बेटा, पढ़ाई कैसी चल रही है?', roman: 'aur beta, padhaai kaisi chal rahi hai?', en: 'So, child — how are the studies going?',
    reply: { hi: 'अच्छी चल रही है, अंकल।', roman: 'achchhi chal rahi hai, uncle.', en: 'Going well, Uncle.' },
    distractors: [
      { hi: 'पढ़ाई मेज़ पर है।', roman: 'padhaai mez par hai.', en: 'The studies are on the table.',
        whyWrong: 'पढ़ाई isn’t a thing on the table — कैसी चल रही asks how it’s going: अच्छी!' },
      { hi: 'जी, चलिए।', roman: 'ji, chaliye.', en: 'Yes, let’s go.',
        whyWrong: 'This चल isn’t going anywhere — चल रही means “coming along”; no shoes needed.' },
      { hi: 'आपकी पढ़ाई कैसी है?', roman: 'aapki padhaai kaisi hai?', en: 'How are YOUR studies?',
        whyWrong: 'Uncle’s exams are decades behind him — the question was for you!' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'mother',
    prompt: 'मेहमानों के लिए पानी ले आओ।', roman: 'mehmaanon ke liye paani le aao.', en: 'Bring water for the guests.',
    reply: { hi: 'जी माँ। ठंडा लाऊँ?', roman: 'ji maa. thanda laaoon?', en: 'Yes, Mummy. Shall I bring cold?' },
    distractors: [
      { hi: 'मुझे प्यास लगी है।', roman: 'mujhe pyaas lagi hai.', en: 'I am thirsty.',
        whyWrong: 'The पानी is for the मेहमान — के लिए points at them, not you.' },
      { hi: 'मेहमान पानी लाएँगे।', roman: 'mehmaan paani laaenge.', en: 'The guests will bring water.',
        whyWrong: 'That turns the guests into waiters — hospitality flows the other way!' },
      { hi: 'आप ले आइए।', roman: 'aap le aaiye.', en: 'You bring it.',
        whyWrong: 'Mummy’s making the chai — this one’s your job, and it earns a hero’s smile.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'aunty',
    prompt: 'यह लो बेटा, तुम्हारे लिए चॉकलेट।', roman: 'yah lo beta, tumhaare liye chocolate.', en: 'Here, love — a chocolate for you.',
    reply: { hi: 'धन्यवाद, आंटी जी!', roman: 'dhanyavaad, aunty ji!', en: 'Thank you, Aunty!' },
    distractors: [
      { hi: 'कितने की है?', roman: 'kitne ki hai?', en: 'How much did it cost?',
        whyWrong: 'Gifts don’t come with price-checks — just a warm धन्यवाद.' },
      { hi: 'यह लो, आंटी।', roman: 'yah lo, aunty.', en: 'Here, take it, Aunty.',
        whyWrong: 'That hands it straight back — and to elders it’s लीजिए anyway. Keep the chocolate; give the thanks.' },
      { hi: 'चॉकलेट मेरी है।', roman: 'chocolate meri hai.', en: 'The chocolate is mine.',
        whyWrong: 'True now! But the missing word is धन्यवाद — grab-and-go is for squirrels.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'aunty',
    prompt: 'वाह, समोसे किसने बनाए?', roman: 'vaah, samose kisne banaae?', en: 'Mmm — who made these samosas?',
    reply: { hi: 'माँ ने बनाए, आंटी।', roman: 'maa ne banaae, aunty.', en: 'Mummy made them, Aunty.' },
    distractors: [
      { hi: 'समोसे गरम हैं।', roman: 'samose garam hain.', en: 'The samosas are hot.',
        whyWrong: 'That answers “कैसे हैं” — she asked किसने बनाए, who made them.' },
      { hi: 'मैंने खाए।', roman: 'maine khaae.', en: 'I ate them.',
        whyWrong: 'बनाए asks who COOKED — खाए confesses who’s been eating!' },
      { hi: 'समोसे में आलू है।', roman: 'samose mein aaloo hai.', en: 'There’s potato in the samosas.',
        whyWrong: 'That’s the recipe — she asked for the cook, not the filling.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'guest-child',
    prompt: 'मुझे तुम्हारे खिलौने देखने हैं!', roman: 'mujhe tumhaare khilaune dekhne hain!', en: 'I want to see your toys!',
    reply: { hi: 'चलो, मेरे कमरे में हैं!', roman: 'chalo, mere kamre mein hain!', en: 'Come on — they’re in my room!' },
    distractors: [
      { hi: 'खिलौने मेरे हैं।', roman: 'khilaune mere hain.', en: 'The toys are mine.',
        whyWrong: 'They know! Sharing the देखना is the host’s job — चलो opens the door.' },
      { hi: 'तुम्हारे खिलौने कहाँ हैं?', roman: 'tumhaare khilaune kahaan hain?', en: 'Where are YOUR toys?',
        whyWrong: 'They asked about yours — तुम्हारे flips it onto the guest, who came empty-handed.' },
      { hi: 'मैंने खिलौने देखे।', roman: 'maine khilaune dekhe.', en: 'I have seen the toys.',
        whyWrong: 'You see them every day! The guest is asking to see them — say चलो.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'father',
    prompt: 'मेहमान आते ही होंगे — अपना कमरा ठीक कर लो।', roman: 'mehmaan aate hi honge — apna kamra theek kar lo.', en: 'The guests will be here any minute — tidy your room.',
    reply: { hi: 'जी पापा, बस पाँच मिनट!', roman: 'ji papa, bas paanch minute!', en: 'Yes Papa — just five minutes!' },
    distractors: [
      { hi: 'कमरा ठीक है।', roman: 'kamra theek hai.', en: 'The room is fine.',
        whyWrong: 'Papa has seen the floor — ठीक कर लो is a doing, not a describing.' },
      { hi: 'मेहमान कमरा ठीक करेंगे।', roman: 'mehmaan kamra theek karenge.', en: 'The guests will tidy the room.',
        whyWrong: 'Guests bring mithai, not brooms — the कमरा is yours.' },
      { hi: 'आप कर दीजिए, पापा।', roman: 'aap kar deejiye, papa.', en: 'You do it, Papa.',
        whyWrong: 'The room is yours, so the tidying is too — Papa is asking, not offering.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'uncle',
    prompt: 'अच्छा बेटा, अब हम चलते हैं।', roman: 'achchha beta, ab ham chalte hain.', en: 'Well, child — we’ll be off now.',
    reply: { hi: 'फिर आइएगा, अंकल!', roman: 'phir aaiyega, uncle!', en: 'Do come again, Uncle!' },
    distractors: [
      { hi: 'हाँ, जल्दी जाइए।', roman: 'haan, jaldi jaaiye.', en: 'Yes, leave quickly.',
        whyWrong: 'जल्दी जाइए shoos them out the door — the warm goodbye invites them back: फिर आइएगा.' },
      { hi: 'कहाँ चलते हैं?', roman: 'kahaan chalte hain?', en: 'Where are we going?',
        whyWrong: 'हम चलते हैं is their goodbye, not an invitation — they’re heading home.' },
      { hi: 'सुप्रभात, अंकल।', roman: 'suprabhaat, uncle.', en: 'Good morning, Uncle.',
        whyWrong: 'सुप्रभात opens a morning — partings take नमस्ते or फिर मिलिएगा.' }
    ] },

  { scene: 'mehmaan-aaye', sceneEn: 'Guests at home',
    who: 'mother',
    prompt: 'आज तुमने मेहमानों का बहुत ध्यान रखा — शाबाश!', roman: 'aaj tumne mehmaanon ka bahut dhyaan rakha — shaabaash!', en: 'You looked after the guests so well today — well done!',
    reply: { hi: 'सच में, माँ? मुझे बहुत अच्छा लगा!', roman: 'sach mein, maa? mujhe bahut achchha laga!', en: 'Really, Mummy? I loved doing it!' },
    distractors: [
      { hi: 'मैंने ध्यान नहीं रखा।', roman: 'maine dhyaan nahin rakha.', en: 'I didn’t look after them.',
        whyWrong: 'Modesty overload — नहीं erases what you really did. A smile will do!' },
      { hi: 'मेहमानों ने ध्यान रखा।', roman: 'mehmaanon ne dhyaan rakha.', en: 'The guests looked after things.',
        whyWrong: 'Flipped! The guests were the ones cared FOR — तुमने रखा, says Mummy.' },
      { hi: 'जी, पानी ठंडा था।', roman: 'ji, paani thanda tha.', en: 'Yes, the water was cold.',
        whyWrong: 'A stray detail from the visit — Mummy is praising YOU; answer her, not the water.' }
    ] },
];

/* Native-speaker sign-off, per docs/05 §4 and the HI_PACK.reviewedBy pattern:
   a named Hindi pedagogue reviews every line above (Devanagari, register,
   agreement, the flagged conventional defaults in header rule 5) and signs
   here before ship. Until this array is non-empty, everything above is a
   draft. */
window.IND_BHASHA_DIALOGUES.hi.reviewedBy = [];
