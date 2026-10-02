/* Bizzing India — Nani-Nana Stories, and Ask Nani.

   WHY THIS EXISTS (docs/11 §1, §4.2, §4.3):
   The honest inventory of what a diaspora child structurally cannot have opens with one
   line — "a grandmother telling stories at night, in the language, in the family's own
   version" — and the column marked "can an app give it?" says: yes, in her actual voice.
   Not a narrator. Not a cartoon. Hers. Everything else in this product is content we wrote;
   this is the one pillar where the content is the family's own and we only carry it.

   docs/01 §4 calls this Loop 1, the strongest growth loop we have — a link goes to a
   grandparent, she installs nothing, records once, and now has a stake. But the loop is a
   side effect. The reason to build it is docs/11 §3: the outcome a parent actually wants is
   "she can talk to my mother", and it is the only outcome in the whole product with a
   deadline on it.

   THREE PIECES, and they feed each other:
     invite    — the grandparent's whole path: a message, a page, a big button, done.
     prompts   — what we offer when she says "I don't know what to tell." She always does.
     questions — Ask Nani. One question a week the child takes to a grandparent. docs/11
                 §4.3 calls this "the method the parent lacks", and it is: it converts
                 passive learning into a real conversation and gives the grandparent a role
                 beyond being looked at. Answers can be recorded back, which is how the
                 archive fills without anyone deciding to build an archive.

   DECISIONS MADE HERE, so nobody has to re-derive them:

   1. LANGUAGE. Every item carries `lang`. The strings below are the `hi` pack because it is
      the largest single diaspora set, exactly as data-rishtey.js does — and for exactly the
      same reason it is NOT the only one. Per CLAUDE.md, never imply Hindi = Indian. The
      grandparent on the other end of this link is as likely to be a Tamil, Telugu, Bengali,
      Gujarati, Punjabi, Marathi, Malayalam or Odia speaker, and a pack for each is a
      straight sibling array with the same ids, same weeks, same `to`, and `lang` swapped.
      Nothing in the shape has to change to add one. Every Hindi line below wants a native
      reader's pass before launch; treat them as drafts in the way data-rishtey.js treats
      its `also` variants.

   2. GENDERED AGREEMENT IS BAKED IN, DELIBERATELY. Hindi agrees its verbs with the person
      addressed — a grandmother is "करती थीं", a grandfather "करते थे". So each question
      carries `to` ('nani' | 'nana' | 'dadi' | 'dada' | 'any') and the Hindi is written
      correct for that addressee. DO NOT string-swap the name in `hi`: swapping Nani for
      Dada leaves the sentence wrong in a way the grandparent will hear immediately. The 52
      are spread across all four grandparents on purpose. Items marked `to:'any'` are built
      on noun subjects so no verb has to agree, and those are safe to re-address freely.

   3. NO FESTIVAL IS NAMED IN THE 52. docs/11 gives "ask Nani what her street sounded like
      at Diwali" as the exemplar, and the question is here — phrased as "the biggest festival
      night of the year". Naming Diwali would tell a Malayali, Tamil or Christian Indian
      family that the app thinks their year has the wrong shape in it (docs/05 §2, internal
      diversity). The follow-up asks which festival it was, so the child learns the name from
      their own grandmother rather than from us. Prompts do the same.

   4. PROMPTS AND QUESTIONS ARE DIFFERENT OBJECTS. A prompt is offered to the GRANDPARENT
      when she is looking at a record button with nothing in her head. A question is handed
      to the CHILD to carry to her. They overlap in subject and never in voice.

   5. NOTHING HERE IS A LADDER. docs/10 §3.5 — the stories are a library, not a ladder. So
      no copy in this file counts, ranks, scores, congratulates or measures. "Again" is a
      first-class word; re-listening is love, not repetition. `ritual.empty` exists so that a
      night with no new recording reads as an ordinary night, never as a failure.

   6. WHAT IS NOT ASKED. The 52 never go near money, illness, death, Partition, caste, or
      politics. docs/05 §3 puts every one of those behind a named human reviewer, and none of
      them belong in a question a seven-year-old asks a seventy-year-old for fun. The test
      each question had to pass: does the grandparent smile, or does she feel interviewed?

   7. THE PRIVACY LINE IS A PROMISE, NOT COPY. `archive.where` and `archive.promises` say
      recordings belong to the family and are used for nothing else. docs/01 §7 commits to
      that ("family voice notes are private to the household"). If the backend cannot hold
      that line, change the backend, not the sentence.

   TOKENS the view layer substitutes:
     {child}    the child's first name (the only child datum we hold — CLAUDE.md)
     {relation} what THIS child calls THIS grandparent, from data-rishtey.js — nani, dada,
                thatha, thakuma, whatever is right in that house
     {n}        a count of listens, used only in ritual.again.count

   FIELD SHAPES:
     prompts[]   { id, lang, tag, en, hi, roman, why }
                 tag: memory | folk | song | place | food
                 why: one line to the PARENT, who is deciding whether to send the link
     questions[] { id, week, lang, to, en, hi, roman, follow, tag }
                 tag: childhood | food | place | festival | work | language | story | music |
                      game | family
                 week: an index 1..52, not a calendar week. The app may reorder — a festival
                       question near a festival, a rain question in monsoon — the way the
                       story shelves surface by occasion (docs/10 §3.5). */

window.IND_NANI = {

  lang: 'hi',

  /* ------------------------------------------------------------------ *
   * 1. THE INVITE                                                       *
   * A seventy-year-old, holding a phone, outdoors, in bright sun.       *
   * Short lines. No jargon. No "upload", no "account", no "sign in".    *
   * Nothing in this flow may fail in a way she blames herself for.      *
   * ------------------------------------------------------------------ */
  invite: {

    /* What the parent sends. One paste into WhatsApp — docs/01 §5 says WhatsApp is THE
       diaspora medium, so this is written to survive being forwarded. */
    share: {
      greeting: 'नमस्ते',
      body: "{child} has a place in her app for your voice.\n\n" +
            "Tap the link, press the big button, and tell her one story. Any story, in " +
            "whichever language you like. Two minutes is plenty.\n\n" +
            "Nothing to download. No password. She will hear it at bedtime.",
      footer: 'The link is only for our family.',
      button: 'Send to a grandparent',
      copied: 'Copied. Paste it into WhatsApp.'
    },

    /* The greeting at the top of the share message and the landing page. The parent picks
       the one their own mother would actually say. This list is the point of the `lang`
       field — it is the first place a non-Hindi household must not be made to feel like a
       special case. Needs a native check per line before launch. */
    greetings: [
      { lang:'hi', text:'नमस्ते',              roman:'Namaste'      },
      { lang:'mr', text:'नमस्कार',             roman:'Namaskar'     },
      { lang:'pa', text:'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',        roman:'Sat Sri Akal', note:'Sikh greeting' },
      { lang:'bn', text:'নমস্কার',              roman:'Nomoshkar'    },
      { lang:'gu', text:'કેમ છો',               roman:'Kem cho',      note:'Literally "how are you" — the everyday greeting' },
      { lang:'ta', text:'வணக்கம்',              roman:'Vanakkam'     },
      { lang:'te', text:'నమస్కారం',             roman:'Namaskaram'   },
      { lang:'kn', text:'ನಮಸ್ಕಾರ',              roman:'Namaskara'    },
      { lang:'ml', text:'നമസ്കാരം',             roman:'Namaskaram'   },
      { lang:'or', text:'ନମସ୍କାର',              roman:'Namaskar'     }
    ],

    /* The page she lands on. One idea per screen. */
    landing: {
      headline: '{child} would like to hear your voice.',
      sub: 'Tell her one story. Any story, in any language.',
      what: 'Press the big button, talk for as long as you like, and press it again when ' +
            'you have finished. That is the whole thing.',
      reassure: [
        'Nothing to install.',
        'No password and no account.',
        'Only your own family will hear it.',
        'If you do not like how it came out, record it again. Nobody hears the first one.'
      ],
      start: 'Start',
      trouble: 'If the button does not work, turn the phone sound on and try once more.'
    },

    /* The record screen. */
    record: {
      prompt: 'Tell {child} a story.',
      helper: 'Speak in whichever language comes easiest. She will understand more than ' +
              'you think, and the words she does not know are the ones she will ask about.',
      button: { idle: 'Press to start', live: 'Recording. Press to stop' },
      listening: 'I am listening.',
      hints: [
        'There is no time limit.',
        'Pauses are fine. Nobody is timing you.',
        'You do not have to start at the beginning.',
        'Say her name at the start. She will play that bit twice.'
      ],
      noIdea: 'I do not know what to tell',
      noIdeaHelp: 'Then pick one of these. Any one of them is a story she does not have.',
      review: { play: 'Listen to it', redo: 'Record it again', send: 'Send to {child}' },
      sending: 'Sending, one moment.'
    },

    /* After she presses send. */
    thanks: {
      headline: 'It has gone to her.',
      body: '{child} will hear this tonight.',
      extra: 'She will very likely ask for it again tomorrow. That is what happens with ' +
             'these, and it is a good sign.',
      more: 'Tell another one',
      keep: 'Keep this link. You can use it again whenever you like.',
      close: 'Thank you. This is the part of the app we cannot make ourselves.'
    },

    /* What the child sees when a recording lands. Never a badge, never a count. */
    child: {
      toast: '{relation} sent you a story.',
      line: '{relation} recorded her voice for you.',
      lineM: '{relation} recorded his voice for you.',
      open: 'Listen',
      later: 'Keep it for tonight',
      kept: 'It will be waiting at bedtime.',
      thank: 'Say thank you on the next call. She will pretend it was nothing.'
    },

    /* Small print, for the parent, in the parent's part of the app. */
    parentNote: 'The grandparent needs no account and installs nothing. The link opens a ' +
                'page, records, and sends the recording to your family only.'
  },

  /* ------------------------------------------------------------------ *
   * 2. PROMPTS — for the grandparent staring at a record button         *
   * The stories she actually has, not the ones a content team wishes    *
   * she had. Family memory, a folk tale she knows, a song, a place,     *
   * a food. `why` speaks to the parent, who is deciding whether this    *
   * is worth asking their mother to do.                                 *
   * ------------------------------------------------------------------ */
  prompts: [

    { id:'p.mother-told', lang:'hi', tag:'memory',
      en:'The story your own mother told you at night.',
      hi:'वो कहानी जो रात को आपकी माँ आपको सुनाती थीं।',
      roman:'Wo kahani jo raat ko aapki maa aapko sunati thin.',
      why:'Three generations in one recording. Your child hears the story your grandmother told.' },

    { id:'p.clever-daughter', lang:'hi', tag:'folk',
      en:'The one about the clever daughter who out-thinks everybody.',
      hi:'वो कहानी जिसमें अक्लमंद बेटी सबको मात दे देती है।',
      roman:'Wo kahani jismein aklmand beti sabko maat de deti hai.',
      why:'Every region has a version of her. Your child should get yours, not a generic one.' },

    { id:'p.animal', lang:'hi', tag:'folk',
      en:'A story with an animal in it — a crow, a tiger, a monkey, a bullock that talks.',
      hi:'कोई कहानी जिसमें कोई जानवर हो — कौआ, बाघ, बंदर, या बोलता हुआ बैल।',
      roman:'Koi kahani jismein koi janwar ho — kauwa, bagh, bandar, ya bolta hua bail.',
      why:'Animals are how a four-year-old holds on to the point of a story.' },

    { id:'p.first-sea', lang:'hi', tag:'memory',
      en:'The first time you saw the sea.',
      hi:'जब आपने पहली बार समुद्र देखा था।',
      roman:'Jab aapne pehli baar samudra dekha tha.',
      why:'A first time is a story even when nothing much happens in it.' },

    { id:'p.first-train', lang:'hi', tag:'memory',
      en:'Your first train journey — where it went, and who took you.',
      hi:'आपकी पहली रेल यात्रा — कहाँ गए और कौन साथ ले गया था।',
      roman:'Aapki pehli rail yatra — kahan gaye aur kaun saath le gaya tha.',
      why:'Platforms, tea in a clay cup, the window seat. Free sensory India.' },

    { id:'p.walk-to-school', lang:'hi', tag:'place',
      en:'The walk to school. What you passed on the way.',
      hi:'स्कूल का रास्ता — रास्ते में क्या-क्या पड़ता था।',
      roman:'School ka rasta — raste mein kya-kya padta tha.',
      why:'Your child is driven everywhere. This is the closest they get to that street.' },

    { id:'p.first-rain', lang:'hi', tag:'place',
      en:'The first rain of the year, and what everybody did.',
      hi:'साल की पहली बारिश, और उस दिन सब क्या करते थे।',
      roman:'Saal ki pehli barish, aur us din sab kya karte the.',
      why:'Monsoon cannot be explained to a child who has never stood in one. It can be described.' },

    { id:'p.lullaby', lang:'hi', tag:'song',
      en:'The song you were sung to sleep with. Sing it — do not explain it.',
      hi:'वो लोरी जो आपको सुलाने के लिए गाई जाती थी। गाकर सुनाइए, समझाइए मत।',
      roman:'Wo lori jo aapko sulane ke liye gayi jati thi. Gaakar sunaiye, samjhaiye mat.',
      why:'A tune goes in deeper than a lesson and stays longer.' },

    { id:'p.hand-rhyme', lang:'hi', tag:'song',
      en:'A rhyme with hand actions — the kind said to a small child.',
      hi:'कोई तुकबंदी जो हाथों के इशारों के साथ छोटे बच्चों को सुनाई जाती है।',
      roman:'Koi tukbandi jo haathon ke isharon ke saath chhote bachchon ko sunayi jati hai.',
      why:'They will do the actions back at you on the next video call.' },

    { id:'p.kitchen-smell', lang:'hi', tag:'food',
      en:'The dish your mother made that you can still smell.',
      hi:'वो पकवान जो आपकी माँ बनाती थीं और जिसकी ख़ुशबू आज भी याद है।',
      roman:'Wo pakwan jo aapki maa banati thin aur jiski khushbu aaj bhi yaad hai.',
      why:'Food is the easiest door into a memory, and the warmest one.' },

    { id:'p.once-a-year-sweet', lang:'hi', tag:'food',
      en:'The sweet that appeared only once a year, and who made it best.',
      hi:'वो मिठाई जो साल में सिर्फ़ एक बार बनती थी, और सबसे अच्छी कौन बनाता था।',
      roman:'Wo mithai jo saal mein sirf ek baar banti thi, aur sabse achhi kaun banata tha.',
      why:'Ties one taste to one season and one person. That is culture in a minute.' },

    { id:'p.festival-night', lang:'hi', tag:'memory',
      en:'The biggest festival night where you grew up. Tell it as a story, morning to bed.',
      hi:'जहाँ आप बड़े हुए, वहाँ साल के सबसे बड़े त्योहार की रात — सुबह से रात तक, कहानी की तरह सुनाइए।',
      roman:'Jahan aap bade hue, wahan saal ke sabse bade tyohaar ki raat — subah se raat tak, kahani ki tarah sunaiye.',
      why:'There, the whole town did it together. Here it is a Tuesday. Your voice is the crowd.' },

    { id:'p.your-street', lang:'hi', tag:'place',
      en:'Walk us down your street. What was on each corner?',
      hi:'अपनी गली की सैर कराइए — हर मोड़ पर क्या था?',
      roman:'Apni gali ki sair karaiye — har mod par kya tha?',
      why:'Corner shops stay in a child far longer than monuments do.' },

    { id:'p.tree', lang:'hi', tag:'place',
      en:'A tree you remember, and what happened under it.',
      hi:'कोई पेड़ जो आपको याद है, और उसके नीचे क्या-क्या होता था।',
      roman:'Koi ped jo aapko yaad hai, aur uske neeche kya-kya hota tha.',
      why:'Gives your child one fixed, real place in India to picture.' },

    { id:'p.animal-near-house', lang:'hi', tag:'memory',
      en:'An animal that lived near your house — a buffalo, a parrot, a street dog with a name.',
      hi:'कोई जानवर जो आपके घर के पास रहता था — भैंस, तोता, या गली का कोई कुत्ता जिसका नाम था।',
      roman:'Koi janwar jo aapke ghar ke paas rehta tha — bhains, tota, ya gali ka koi kutta jiska naam tha.',
      why:'An animal with a name makes a whole place real.' },

    { id:'p.naughtiest', lang:'hi', tag:'memory',
      en:'The naughtiest thing you did, and what happened afterwards.',
      hi:'आपने सबसे बड़ी शरारत कौन सी की, और उसके बाद क्या हुआ।',
      roman:'Aapne sabse badi sharaarat kaun si ki, aur uske baad kya hua.',
      why:'A grandparent who was once in trouble becomes a person instead of a portrait.' },

    { id:'p.best-friend', lang:'hi', tag:'memory',
      en:'Your best friend at seven years old.',
      hi:'सात साल की उम्र में आपका सबसे अच्छा दोस्त कौन था।',
      roman:'Saat saal ki umar mein aapka sabse achha dost kaun tha.',
      why:'Your child is that age right now. Nothing lands harder than this one.' },

    { id:'p.your-grandmother', lang:'hi', tag:'memory',
      en:'Your own grandmother. How she looked, what she said, what she smelled of.',
      hi:'आपकी अपनी दादी या नानी — वो कैसी दिखती थीं, क्या कहती थीं, उनके पास कैसी ख़ुशबू आती थी।',
      roman:'Aapki apni dadi ya nani — wo kaisi dikhti thin, kya kehti thin, unke paas kaisi khushbu aati thi.',
      why:'Reaches back one more generation. Nobody else alive can record this.' },

    { id:'p.how-you-met', lang:'hi', tag:'memory',
      en:'How you first met the person you married.',
      hi:'जिनसे आपकी शादी हुई, उनसे पहली मुलाक़ात कैसे हुई।',
      roman:'Jinse aapki shaadi hui, unse pehli mulaqat kaise hui.',
      why:'Family history the child will otherwise simply never be told.' },

    { id:'p.hands', lang:'hi', tag:'memory',
      en:'Something you learned to do with your hands, and who taught you.',
      hi:'हाथ से कोई ऐसा काम जो आपने सीखा, और वो किसने सिखाया।',
      roman:'Haath se koi aisa kaam jo aapne seekha, aur wo kisne sikhaya.',
      why:'Skills came down by watching. Naming the teacher passes on the whole chain.' },

    { id:'p.wedding-song', lang:'hi', tag:'song',
      en:'A song sung at weddings in your family.',
      hi:'आपके परिवार में शादी में गाया जाने वाला कोई गीत।',
      roman:'Aapke parivar mein shaadi mein gaya jane wala koi geet.',
      why:'Wedding songs are regional in a way film songs are not. This one is only yours.' },

    { id:'p.evening-words', lang:'hi', tag:'song',
      en:'The words said or sung at home in the evening.',
      hi:'शाम को घर में जो कहा या गाया जाता था।',
      roman:'Shaam ko ghar mein jo kaha ya gaya jata tha.',
      why:'Your family’s faith as your family actually practised it, in your voice, not ours.' },

    { id:'p.gentle-fright', lang:'hi', tag:'folk',
      en:'The story the older children told to frighten the younger ones. Keep it gentle.',
      hi:'वो कहानी जो बड़े बच्चे छोटों को डराने के लिए सुनाते थे। ज़्यादा डरावनी नहीं।',
      roman:'Wo kahani jo bade bachche chhoton ko darane ke liye sunate the. Zyada daraavni nahin.',
      why:'A small safe fright is a childhood staple. Mild, though — they hear this at bedtime.' },

    { id:'p.long-journey', lang:'hi', tag:'place',
      en:'The longest journey you took as a child, and how you travelled.',
      hi:'बचपन में आपका सबसे लंबा सफ़र, और आप कैसे गए थे।',
      roman:'Bachpan mein aapka sabse lamba safar, aur aap kaise gaye the.',
      why:'Distance, vehicles, food on the way. A whole world in one story.' },

    { id:'p.water', lang:'hi', tag:'place',
      en:'The water nearest your house — a river, a pond, a well, the sea.',
      hi:'आपके घर के सबसे पास का पानी — नदी, तालाब, कुआँ या समुद्र।',
      roman:'Aapke ghar ke sabse paas ka paani — nadi, talab, kuan ya samudra.',
      why:'The rivers are on the map in the app. Yours turns one of them into a real place.' },

    { id:'p.market', lang:'hi', tag:'place',
      en:'The market on its busiest day. What were people shouting?',
      hi:'सबसे ज़्यादा भीड़ वाले दिन का बाज़ार — वहाँ क्या-क्या आवाज़ें लगती थीं?',
      roman:'Sabse zyada bheed wale din ka bazaar — wahan kya-kya aawazein lagti thin?',
      why:'Ambient noise is exactly the thing a childhood outside India has none of.' },

    { id:'p.parent-as-child', lang:'hi', tag:'memory',
      en:'A story about {child}’s mother or father, when they were small.',
      hi:'जब {child} के माता-पिता छोटे थे, तब की कोई कहानी।',
      roman:'Jab {child} ke mata-pita chhote the, tab ki koi kahani.',
      why:'The most requested story in any house. Guaranteed to be asked for again.' },

    { id:'p.name', lang:'hi', tag:'memory',
      en:'How {child}’s name was chosen, or what it means.',
      hi:'{child} का नाम कैसे चुना गया, या उसका मतलब क्या है।',
      roman:'{child} ka naam kaise chuna gaya, ya uska matlab kya hai.',
      why:'A child hearing where their own name came from, in a grandparent’s voice.' },

    { id:'p.street-game', lang:'hi', tag:'memory',
      en:'A game you played in the street, and exactly how it was played.',
      hi:'गली का कोई खेल, और वो कैसे खेला जाता था।',
      roman:'Gali ka koi khel, aur wo kaise khela jata tha.',
      why:'They can take the rules to a park on Saturday. That is the rare kind of screen time.' },

    { id:'p.saying', lang:'hi', tag:'folk',
      en:'A saying your mother used constantly, and the day she used it on you.',
      hi:'कोई कहावत जो आपकी माँ हमेशा बोलती थीं, और वो दिन जब उन्होंने आपसे कही।',
      roman:'Koi kahavat jo aapki maa hamesha bolti thin, aur wo din jab unhone aapse kahi.',
      why:'A proverb plus the moment it was used is how a value actually transfers.' },

    { id:'p.first-film', lang:'hi', tag:'memory',
      en:'The first film you ever saw, and where you saw it.',
      hi:'पहली फ़िल्म जो आपने देखी, और कहाँ देखी।',
      roman:'Pehli film jo aapne dekhi, aur kahan dekhi.',
      why:'Cinema is family history in this part of the world.' },

    { id:'p.fruit-season', lang:'hi', tag:'food',
      en:'Mango season — or whichever fruit you waited all year for.',
      hi:'आम का मौसम, या वो फल जिसका पूरे साल इंतज़ार रहता था।',
      roman:'Aam ka mausam, ya wo phal jiska poore saal intezaar rehta tha.',
      why:'Seasons are how a place gets remembered. Ours here have no fruit in them.' }
  ],

  /* ------------------------------------------------------------------ *
   * 3. ASK NANI — 52 questions, one a week                              *
   * docs/11 §4.3. The child carries the question; the grandparent gets  *
   * a role beyond being looked at; the answer can be recorded back.     *
   * Every one had to be answerable in a sentence AND enjoyable to       *
   * answer. Nothing about money, illness, death, Partition, caste or    *
   * politics — docs/05 puts all of those behind a human reviewer.       *
   * `to` fixes the Hindi verb agreement. See header note 2.             *
   * ------------------------------------------------------------------ */
  questions: [

    { id:'q.morning-first', week:1, lang:'hi', to:'nani', tag:'childhood',
      en:'Nani, when you were my age, what was the first thing you did in the morning?',
      hi:'नानी, जब आप मेरी उम्र की थीं, तब सुबह उठकर सबसे पहले क्या करती थीं?',
      roman:'Nani, jab aap meri umar ki thin, tab subah uthkar sabse pehle kya karti thin?',
      follow:'And who woke you up?' },

    { id:'q.breakfast', week:2, lang:'hi', to:'dadi', tag:'food',
      en:'Dadi, what did you eat for breakfast almost every single day?',
      hi:'दादी, आप लगभग हर रोज़ नाश्ते में क्या खाती थीं?',
      roman:'Dadi, aap lagbhag har roz naashte mein kya khaati thin?',
      follow:'Did you ever get bored of it?' },

    { id:'q.window', week:3, lang:'hi', to:'nana', tag:'place',
      en:'Nana, what could you see out of the window of the house you grew up in?',
      hi:'नाना, जिस घर में आप बड़े हुए, उसकी खिड़की से क्या दिखता था?',
      roman:'Nana, jis ghar mein aap bade hue, uski khidki se kya dikhta tha?',
      follow:'Was it noisy out there, or quiet?' },

    { id:'q.song-you-know', week:4, lang:'hi', to:'dada', tag:'music',
      en:'Dada, which song do you still know all the words to?',
      hi:'दादा, ऐसा कौन सा गाना है जो आपको आज भी पूरा याद है?',
      roman:'Dada, aisa kaun sa gaana hai jo aapko aaj bhi pura yaad hai?',
      follow:'Will you sing me just the first line?' },

    { id:'q.outside-game', week:5, lang:'hi', to:'any', tag:'game',
      en:'What was your favourite game to play outside, and how did you win it?',
      hi:'बाहर खेलने वाला आपका सबसे पसंदीदा खेल कौन सा था, और उसमें जीत कैसे होती थी?',
      roman:'Bahar khelne wala aapka sabse pasandida khel kaun sa tha, aur usmein jeet kaise hoti thi?',
      follow:'Can you teach me the rules?' },

    { id:'q.festival-sound', week:6, lang:'hi', to:'nani', tag:'festival',
      en:'Nani, on the biggest festival night of the year, what did your street sound like?',
      hi:'नानी, साल के सबसे बड़े त्योहार की रात आपकी गली में कैसी आवाज़ें आती थीं?',
      roman:'Nani, saal ke sabse bade tyohaar ki raat aapki gali mein kaisi aawazein aati thin?',
      follow:'Which festival was it? And who was the loudest person there?' },

    { id:'q.word-moon', week:7, lang:'hi', to:'dada', tag:'language',
      en:'Dada, what is the word for "moon" in your language? Say it slowly so I can copy you.',
      hi:'दादा, आपकी भाषा में चाँद को क्या कहते हैं? धीरे से बोलिए ताकि मैं भी बोल सकूँ।',
      roman:'Dada, aapki bhasha mein chaand ko kya kehte hain? Dheere se boliye taaki main bhi bol sakoon.',
      follow:'Now teach me one more word — any one you like.' },

    { id:'q.mothers-story', week:8, lang:'hi', to:'nani', tag:'story',
      en:'Nani, which story did YOUR mother tell you at night?',
      hi:'नानी, रात को आपकी माँ आपको कौन सी कहानी सुनाती थीं?',
      roman:'Nani, raat ko aapki maa aapko kaun si kahani sunati thin?',
      follow:'Can you tell it to me exactly the way she told it?' },

    { id:'q.hands-skill', week:9, lang:'hi', to:'dada', tag:'work',
      en:'Dada, what can you do with your hands that I cannot do at all?',
      hi:'दादा, हाथ से ऐसा क्या काम है जो आप कर लेते हैं और मुझे बिल्कुल नहीं आता?',
      roman:'Dada, haath se aisa kya kaam hai jo aap kar lete hain aur mujhe bilkul nahin aata?',
      follow:'Will you show me on the next call?' },

    { id:'q.who-i-look-like', week:10, lang:'hi', to:'any', tag:'family',
      en:'Who in our family do I look like?',
      hi:'हमारे परिवार में मेरी शक्ल किससे मिलती है?',
      roman:'Hamare parivar mein meri shakl kisse milti hai?',
      follow:'And who did you look like, when you were small?' },

    { id:'q.once-a-year-sweet', week:11, lang:'hi', to:'nani', tag:'food',
      en:'Nani, which sweet only appeared once a year?',
      hi:'नानी, ऐसी कौन सी मिठाई थी जो साल में सिर्फ़ एक बार बनती थी?',
      roman:'Nani, aisi kaun si mithai thi jo saal mein sirf ek baar banti thi?',
      follow:'Who made it best of everybody?' },

    { id:'q.nearest-water', week:12, lang:'hi', to:'any', tag:'place',
      en:'What was the nearest water to your house — a river, a pond, a well, the sea?',
      hi:'आपके घर के सबसे पास पानी कहाँ था — नदी, तालाब, कुआँ या समुद्र?',
      roman:'Aapke ghar ke sabse paas paani kahan tha — nadi, talab, kuan ya samudra?',
      follow:'Did you ever go in it?' },

    { id:'q.afraid-of', week:13, lang:'hi', to:'dadi', tag:'childhood',
      en:'Dadi, what were you scared of when you were small?',
      hi:'दादी, जब आप छोटी थीं तो आपको किस चीज़ से डर लगता था?',
      roman:'Dadi, jab aap chhoti thin to aapko kis cheez se dar lagta tha?',
      follow:'Are you still a tiny bit scared of it?' },

    { id:'q.lullaby', week:14, lang:'hi', to:'nani', tag:'music',
      en:'Nani, which song was sung to you to make you fall asleep?',
      hi:'नानी, आपको सुलाने के लिए कौन सा गाना गाया जाता था?',
      roman:'Nani, aapko sulane ke liye kaun sa gaana gaya jata tha?',
      follow:'Will you sing it to me tonight?' },

    { id:'q.animal-story', week:15, lang:'hi', to:'any', tag:'story',
      en:'Tell me a story with an animal in it.',
      hi:'कोई ऐसी कहानी सुनाइए जिसमें कोई जानवर हो।',
      roman:'Koi aisi kahani sunaiye jismein koi janwar ho.',
      follow:'Was the animal the clever one or the silly one?' },

    { id:'q.festival-job', week:16, lang:'hi', to:'dada', tag:'festival',
      en:'Dada, when the family got ready for a festival, which job was yours?',
      hi:'दादा, त्योहार की तैयारी में आपका काम क्या होता था?',
      roman:'Dada, tyohaar ki taiyari mein aapka kaam kya hota tha?',
      follow:'Did you like that job, or did you try to get out of it?' },

    { id:'q.saying-love', week:17, lang:'hi', to:'any', tag:'language',
      en:'In your language, how do people show love without saying it?',
      hi:'आपकी भाषा में प्यार जताने के लिए क्या कहते हैं?',
      roman:'Aapki bhasha mein pyaar jatane ke liye kya kehte hain?',
      follow:'Who used to say it to you?' },

    { id:'q.wanted-to-be', week:18, lang:'hi', to:'nana', tag:'childhood',
      en:'Nana, what did you want to be when you grew up?',
      hi:'नाना, बचपन में आप क्या बनना चाहते थे?',
      roman:'Nana, bachpan mein aap kya banna chahte the?',
      follow:'What made you want that?' },

    { id:'q.kitchen-smell', week:19, lang:'hi', to:'any', tag:'food',
      en:'Which smell reminds you of your mother’s kitchen?',
      hi:'ऐसी कौन सी ख़ुशबू है जिससे आपको अपनी माँ की रसोई याद आ जाती है?',
      roman:'Aisi kaun si khushbu hai jisse aapko apni maa ki rasoi yaad aa jati hai?',
      follow:'Do you know how she made it?' },

    { id:'q.school-name', week:20, lang:'hi', to:'dadi', tag:'place',
      en:'Dadi, what was your school called, and how did you get there?',
      hi:'दादी, आपके स्कूल का नाम क्या था, और आप वहाँ कैसे पहुँचती थीं?',
      roman:'Dadi, aapke school ka naam kya tha, aur aap wahan kaise pahunchti thin?',
      follow:'Who walked with you?' },

    { id:'q.rainy-day-game', week:21, lang:'hi', to:'any', tag:'game',
      en:'When it rained and nobody could go outside, what did you play indoors?',
      hi:'बारिश में जब बाहर जाना नहीं होता था, तब घर में कौन सा खेल चलता था?',
      roman:'Barish mein jab bahar jana nahin hota tha, tab ghar mein kaun sa khel chalta tha?',
      follow:'Who always won?' },

    { id:'q.learned-before-ten', week:22, lang:'hi', to:'nani', tag:'work',
      en:'Nani, what had you already learned to do before you were ten?',
      hi:'नानी, दस साल की उम्र से पहले आपने ऐसा क्या करना सीख लिया था?',
      roman:'Nani, das saal ki umar se pehle aapne aisa kya karna seekh liya tha?',
      follow:'Who taught you that?' },

    { id:'q.clever-story', week:23, lang:'hi', to:'dada', tag:'story',
      en:'Dada, tell me the one where somebody clever wins without fighting.',
      hi:'दादा, वो कहानी सुनाइए जिसमें कोई अक्लमंद बिना लड़े जीत जाता है।',
      roman:'Dada, wo kahani sunaiye jismein koi aklmand bina lade jeet jata hai.',
      follow:'What would you have done, in that story?' },

    { id:'q.mothers-name', week:24, lang:'hi', to:'nani', tag:'family',
      en:'Nani, who chose my mother’s name, and why that one?',
      hi:'नानी, मेरी माँ का नाम किसने रखा था, और वही नाम क्यों?',
      roman:'Nani, meri maa ka naam kisne rakha tha, aur wahi naam kyon?',
      follow:'And who chose yours?' },

    { id:'q.festival-morning-smell', week:25, lang:'hi', to:'any', tag:'festival',
      en:'On a festival morning, what did the house smell of?',
      hi:'त्योहार की सुबह घर में कैसी ख़ुशबू आती थी?',
      roman:'Tyohaar ki subah ghar mein kaisi khushbu aati thi?',
      follow:'Who in the house was awake first?' },

    { id:'q.naughtiest', week:26, lang:'hi', to:'dada', tag:'childhood',
      en:'Dada, what was the naughtiest thing you ever did — and did you get caught?',
      hi:'दादा, आपने सबसे बड़ी शरारत कौन सी की थी — और क्या आप पकड़े गए?',
      roman:'Dada, aapne sabse badi sharaarat kaun si ki thi — aur kya aap pakde gaye?',
      follow:'What did they say to you afterwards?' },

    { id:'q.wedding-song', week:27, lang:'hi', to:'any', tag:'music',
      en:'What song do people sing at weddings in our family?',
      hi:'हमारे परिवार में शादी में कौन सा गीत गाया जाता है?',
      roman:'Hamare parivar mein shaadi mein kaun sa geet gaya jata hai?',
      follow:'Who sings it the loudest?' },

    { id:'q.first-sea', week:28, lang:'hi', to:'nana', tag:'place',
      en:'Nana, do you remember the first time you saw the sea — or a mountain?',
      hi:'नाना, क्या आपको याद है जब आपने पहली बार समुद्र देखा था — या पहाड़?',
      roman:'Nana, kya aapko yaad hai jab aapne pehli baar samudra dekha tha — ya pahaad?',
      follow:'How old were you then?' },

    { id:'q.mothers-saying', week:29, lang:'hi', to:'nani', tag:'language',
      en:'Nani, teach me a saying your mother used all the time.',
      hi:'नानी, कोई ऐसी कहावत सिखाइए जो आपकी माँ हमेशा बोलती थीं।',
      roman:'Nani, koi aisi kahavat sikhaiye jo aapki maa hamesha bolti thin.',
      follow:'When did she say it to you?' },

    { id:'q.street-food', week:30, lang:'hi', to:'dada', tag:'food',
      en:'Dada, what was the best thing sold on the street near your house?',
      hi:'दादा, आपके घर के पास सड़क पर सबसे मज़ेदार चीज़ क्या मिलती थी?',
      roman:'Dada, aapke ghar ke paas sadak par sabse mazedaar cheez kya milti thi?',
      follow:'Do you still eat it now?' },

    { id:'q.family-story', week:31, lang:'hi', to:'nani', tag:'story',
      en:'Nani, is there a story about someone in our own family?',
      hi:'नानी, क्या हमारे अपने परिवार के किसी इंसान की कोई कहानी है?',
      roman:'Nani, kya hamare apne parivar ke kisi insaan ki koi kahani hai?',
      follow:'Did you ever meet them?' },

    { id:'q.ball-and-bat', week:32, lang:'hi', to:'dada', tag:'game',
      en:'Dada, what did you use for a ball, a bat and a wicket?',
      hi:'दादा, गेंद, बल्ला और विकेट के लिए आप क्या इस्तेमाल करते थे?',
      roman:'Dada, gend, balla aur wicket ke liye aap kya istemaal karte the?',
      follow:'Who decided the rules?' },

    { id:'q.best-friend', week:33, lang:'hi', to:'nani', tag:'childhood',
      en:'Nani, who was your best friend when you were seven? What was her name?',
      hi:'नानी, जब आप सात साल की थीं तो आपकी सबसे अच्छी सहेली कौन थी? उनका नाम क्या था?',
      roman:'Nani, jab aap saat saal ki thin to aapki sabse achhi saheli kaun thi? Unka naam kya tha?',
      follow:'What did the two of you do together?' },

    { id:'q.father-work', week:34, lang:'hi', to:'dada', tag:'work',
      en:'Dada, what did your father do all day?',
      hi:'दादा, आपके पिताजी दिन भर क्या काम करते थे?',
      roman:'Dada, aapke pitaji din bhar kya kaam karte the?',
      follow:'Did you ever go along with him?' },

    { id:'q.tree', week:35, lang:'hi', to:'any', tag:'place',
      en:'Which tree do you remember best, and what happened under it?',
      hi:'आपको सबसे ज़्यादा कौन सा पेड़ याद है, और उसके नीचे क्या होता था?',
      roman:'Aapko sabse zyada kaun sa ped yaad hai, aur uske neeche kya hota tha?',
      follow:'Did you climb it?' },

    { id:'q.festival-clothes', week:36, lang:'hi', to:'dadi', tag:'festival',
      en:'Dadi, what did you wear on the biggest day of the year?',
      hi:'दादी, साल के सबसे बड़े दिन आप क्या पहनती थीं?',
      roman:'Dadi, saal ke sabse bade din aap kya pehanti thin?',
      follow:'Who chose it for you?' },

    { id:'q.first-film-song', week:37, lang:'hi', to:'dada', tag:'music',
      en:'Dada, what was the first film song you truly loved?',
      hi:'दादा, फ़िल्म का पहला गाना कौन सा था जो आपको बहुत पसंद आया था?',
      roman:'Dada, film ka pehla gaana kaun sa tha jo aapko bahut pasand aaya tha?',
      follow:'Where did you hear it — radio, cinema, somebody’s house?' },

    { id:'q.father-as-child', week:38, lang:'hi', to:'dadi', tag:'family',
      en:'Dadi, what was my father like when he was my age?',
      hi:'दादी, जब मेरे पापा मेरी उम्र के थे, तब वो कैसे थे?',
      roman:'Dadi, jab mere papa meri umar ke the, tab wo kaise the?',
      follow:'Tell me one thing about him he has definitely not told me.' },

    { id:'q.fruit-wait', week:39, lang:'hi', to:'nani', tag:'food',
      en:'Nani, which fruit did you wait for all year?',
      hi:'नानी, ऐसा कौन सा फल था जिसका आप पूरे साल इंतज़ार करती थीं?',
      roman:'Nani, aisa kaun sa phal tha jiska aap poore saal intezaar karti thin?',
      follow:'Where did it come from — a tree you knew, or the market?' },

    { id:'q.count-to-ten', week:40, lang:'hi', to:'dadi', tag:'language',
      en:'Dadi, will you count to ten in your language? Slowly.',
      hi:'दादी, अपनी भाषा में एक से दस तक गिनकर सुनाइए, धीरे-धीरे।',
      roman:'Dadi, apni bhasha mein ek se das tak ginkar sunaiye, dheere-dheere.',
      follow:'Now let me try, and tell me which one I said wrong.' },

    { id:'q.after-school', week:41, lang:'hi', to:'nana', tag:'childhood',
      en:'Nana, after school, before anyone called you home, what did you do?',
      hi:'नाना, स्कूल के बाद, घर बुलाए जाने से पहले, आप क्या करते थे?',
      roman:'Nana, school ke baad, ghar bulaye jane se pehle, aap kya karte the?',
      follow:'Who was with you?' },

    { id:'q.story-again', week:42, lang:'hi', to:'dadi', tag:'story',
      en:'Dadi, which story did you ask for again and again?',
      hi:'दादी, कौन सी कहानी आप बार-बार सुनना चाहती थीं?',
      roman:'Dadi, kaun si kahani aap baar-baar sunna chahti thin?',
      follow:'Do you still remember the whole of it?' },

    { id:'q.longest-journey', week:43, lang:'hi', to:'dada', tag:'place',
      en:'Dada, what was the longest journey you took as a child?',
      hi:'दादा, बचपन में आपने सबसे लंबा सफ़र कौन सा किया था?',
      roman:'Dada, bachpan mein aapne sabse lamba safar kaun sa kiya tha?',
      follow:'How did you travel — bus, train, bullock cart, on foot?' },

    { id:'q.whole-town', week:44, lang:'hi', to:'nana', tag:'festival',
      en:'Nana, what did the whole town do together that we do not do here?',
      hi:'नाना, ऐसा क्या था जो पूरा शहर मिलकर करता था, और यहाँ हम नहीं करते?',
      roman:'Nana, aisa kya tha jo poora shehar milkar karta tha, aur yahan hum nahin karte?',
      follow:'What was the best part of it?' },

    { id:'q.first-cooked', week:45, lang:'hi', to:'nani', tag:'work',
      en:'Nani, what was the first thing you cooked all by yourself?',
      hi:'नानी, सबसे पहले आपने अकेले क्या पकाया था?',
      roman:'Nani, sabse pehle aapne akele kya pakaya tha?',
      follow:'Did it come out well?' },

    { id:'q.evening-singing', week:46, lang:'hi', to:'dadi', tag:'music',
      en:'Dadi, what was sung in your house in the evenings?',
      hi:'दादी, शाम को आपके घर में क्या गाया जाता था?',
      roman:'Dadi, shaam ko aapke ghar mein kya gaya jata tha?',
      follow:'Will you say the first line for me?' },

    { id:'q.hand-game', week:47, lang:'hi', to:'nani', tag:'game',
      en:'Nani, what game did you play with your hands, sitting down?',
      hi:'नानी, बैठे-बैठे हाथों से कौन सा खेल खेलती थीं?',
      roman:'Nani, baithe-baithe haathon se kaun sa khel khelti thin?',
      follow:'Teach me the actions.' },

    { id:'q.school-bag', week:48, lang:'hi', to:'dadi', tag:'childhood',
      en:'Dadi, what did you carry to school, and what did you carry it in?',
      hi:'दादी, आप स्कूल क्या-क्या ले जाती थीं, और किसमें ले जाती थीं?',
      roman:'Dadi, aap school kya-kya le jaati thin, aur kismein le jaati thin?',
      follow:'What was in your tiffin?' },

    { id:'q.how-you-met', week:49, lang:'hi', to:'nana', tag:'family',
      en:'Nana, how did you and Nani meet for the first time?',
      hi:'नाना, आप और नानी पहली बार कैसे मिले थे?',
      roman:'Nana, aap aur Nani pehli baar kaise mile the?',
      follow:'What do you remember about that day?' },

    { id:'q.ordinary-plate', week:50, lang:'hi', to:'dadi', tag:'food',
      en:'Dadi, on an ordinary day, what was on your plate?',
      hi:'दादी, आम दिनों में आपकी थाली में क्या-क्या होता था?',
      roman:'Dadi, aam dinon mein aapki thali mein kya-kya hota tha?',
      follow:'Who sat next to you while you ate?' },

    { id:'q.untranslatable', week:51, lang:'hi', to:'nana', tag:'language',
      en:'Nana, tell me a word in your language that English has no word for.',
      hi:'नाना, आपकी भाषा में ऐसा कोई शब्द बताइए जिसका अंग्रेज़ी में कोई शब्द ही नहीं है।',
      roman:'Nana, aapki bhasha mein aisa koi shabd bataiye jiska angrezi mein koi shabd hi nahin hai.',
      follow:'What does it mean? Say it once more, slowly.' },

    { id:'q.remember-forever', week:52, lang:'hi', to:'any', tag:'story',
      en:'Tell me the story you want me to still remember when I am old.',
      hi:'वो कहानी सुनाइए जो मुझे बड़े होकर भी हमेशा याद रहनी चाहिए।',
      roman:'Wo kahani sunaiye jo mujhe bade hokar bhi hamesha yaad rehni chahiye.',
      follow:'Why that one?' }
  ],

  /* ------------------------------------------------------------------ *
   * 4. THE ARCHIVE                                                      *
   * Nobody sets out to build a family archive. It is what is left after *
   * a year of Sunday recordings, and that is the honest way to name it. *
   * The name is deliberately plain English: a Hindi name here would     *
   * quietly tell the Tamil or Bengali household that this shelf is not  *
   * theirs (CLAUDE.md, never imply Hindi = Indian).                     *
   * `where` and `promises` are commitments the backend must keep —      *
   * docs/01 §7, family voice notes are private to the household.        *
   * ------------------------------------------------------------------ */
  archive: {
    title: 'The Family Shelf',
    tagline: 'Every voice anybody in your family has recorded, kept in one place.',

    child: {
      headline: 'Voices that are yours',
      blurb: 'Everything anyone has recorded for you lives here. You can play any of them ' +
             'any night, as many times as you like.',
      empty: 'Nothing on the shelf yet. It starts the day somebody records the first one.',
      shelfBy: ['By who told it', 'By what it is about', 'The ones you ask for most',
                'Songs', 'The short ones']
    },

    parent: {
      headline: 'What your family has recorded',
      blurb: 'These recordings are the only thing in this app we did not write. They are ' +
             'yours, and they get more valuable every year — which is the plainest reason ' +
             'to send the link today rather than next month.',
      empty: 'No recordings yet. One link, one story, and this page stops being empty.',
      invite: 'Invite a grandparent',
      download: 'Download everything',
      remove: 'Delete a recording'
    },

    where: 'Recordings live in your family’s account and nowhere else. They belong to ' +
           'your family, not to us.',

    promises: [
      'Nobody outside your family can hear them.',
      'They are never posted, shared or made public by us.',
      'They are not used to train anything and never will be.',
      'There are no ads in this app, so nothing here is sold to anyone.',
      'You can download all of them, or delete any of them, whenever you want.'
    ]
  },

  /* ------------------------------------------------------------------ *
   * 5. THE BEDTIME RITUAL                                               *
   * docs/10 §3.5 — the stories are a library, not a ladder. "Again" is  *
   * a first-class button here. A child asking for the same recording    *
   * four nights running is the product working, not a stall.            *
   * `empty` has eight lines because an empty shelf is the ordinary case *
   * most nights, and it must never once read as a failure.              *
   * ------------------------------------------------------------------ */
  ritual: {
    open: 'Bedtime',

    offer: [
      '{relation} left you a story.',
      'There is a voice waiting for you tonight.',
      '{relation} recorded this one for you.',
      'Lights off. {relation} will do the rest.',
      'A new one came from {relation} today.'
    ],

    play: 'Listen',
    pause: 'Pause',

    again: {
      label: 'Again',
      lines: [
        'Again it is.',
        'This one again. Good choice.',
        'Same story, same voice. Starting over.',
        'She would tell it again too.'
      ],
      /* {n} is a count of listens. Shown warmly or not at all — never as a score. */
      count: 'You have asked for this one {n} times. That is exactly what it is for.'
    },

    /* No new recording tonight. Eight ways to say so that leave the night intact. */
    empty: [
      'No new voice tonight. The old ones do not mind being played again.',
      'It is much later where {relation} is. She is probably asleep.',
      'Pick one you have heard before. That is allowed, and it is the point.',
      'Nothing new today. Shall we have the one you like?',
      'Voices arrive when they arrive. Tonight we have the ones we have.',
      'There is a question waiting to be asked. Maybe it comes back as a story.',
      'An empty night is a fine night. The shelf keeps everything.',
      'Some stories are better the fourth time. Try one.'
    ],

    ask: {
      nudge: 'There is a question to take to {relation} this week.',
      after: 'If she answers, ask her to say it into the app so you can keep it.'
    },

    close: [
      'Goodnight.',
      'That is enough for tonight.',
      'Sleep well. It will still be here tomorrow.'
    ]
  }
};
