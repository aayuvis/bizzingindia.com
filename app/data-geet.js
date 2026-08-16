/* Bizzing India — Geet: the childhood soundtrack.

   WHY THIS PILLAR EXISTS (docs/11 §4.5): of everything on the inventory of what a parent had
   and their child structurally cannot have, the soundtrack is the cheapest to deliver and the
   fastest to land. A parent hearing their own nursery rhyme come out of a tablet in New
   Jersey is the moment they decide to pay. Nothing else in the product produces that reaction
   in four seconds flat.

   It is also the pillar most likely to embarrass us, for two separate reasons that must not
   be confused with each other.

   ====================== REASON ONE: COPYRIGHT ======================
   Most of what a diaspora parent thinks of as "the songs of my childhood" are FILM SONGS, and
   film songs are owned. Lakdi ki kathi, Nani teri morni, Nach re mora, Chanda mama door ke as
   most people sing it, Titli udi, Bannada tagadina tutturi — every one has a named lyricist,
   a named composer, a studio, and a rights holder who is still collecting.

   The rule in this file, and it is not negotiable:

     ONLY TRADITIONAL / FOLK / PUBLIC-DOMAIN MATERIAL CARRIES TEXT.

   Not "probably folk". Not "everyone knows it so it must be free". Where a song is genuinely
   traditional, `source` says so and says what kind of traditional. Where it is not, or where
   I cannot tell, the entry survives WITHOUT its lyrics so a human can clear it.

   Several film songs are deliberately included here as flagged entries with no text. That is
   on purpose: they are the ones most likely to be added later by someone who assumes they are
   folk. The entry is the warning label.

   ====================== REASON TWO: MEMORY ======================
   docs/10 §3 and docs/05 §3 forbid reconstructing a text from memory. That rule was written
   for scripture and it applies here with exactly the same force, for a sharper commercial
   reason: a parent knows these by heart. A wrong Gita verse takes a scholar to catch. A wrong
   second line of Machhli jal ki rani takes a mother about a second and a half, and it ends
   our credibility with the precise person we needed.

   So: where I could not recall a traditional text accurately, I did NOT write a plausible
   one. The entry keeps its description, its vocabulary, its actions and its parent-note —
   everything that is knowledge rather than quotation — and the lyric slot stays empty.

   ====================== THE FLAGS ======================
     (nothing)          text is given and I am confident of it.
     variant: true      text is given, AND the song is one that genuinely differs house to
                        house — because it is improvised by design (a game where children
                        call out body parts) or because only the opening is fixed. The card
                        must say so. This is NOT a doubt about our text; it is a fact about
                        the song, and pretending otherwise would flatten exactly the internal
                        diversity CLAUDE.md rule 5 exists to protect.
     text_pending: true script, roman and en are ALL null. `why` names the specific doubt and
                        `doubt` triages it:
                          doubt:'rights' — I am reasonably confident of the words but not
                                           confident they are free to print. A rights person
                                           clears this, not an editor.
                          doubt:'text'   — free and clear of rights, but I cannot recall it
                                           accurately. A speaker of the language collects it.
                          doubt:'both'   — both, usually a disputed attribution.
     needs_review: true the song touches history a human author must handle (docs/05 §6.5).

   FIELDS
     id, title, script, roman, en, lang, region, kind, age, kid, note, words[], actions[],
     sing, source — as specified. Plus: badge (docs/05 rule 1), audio (key only — NOTHING is
     recorded yet), and the flags above.

     `en` is a natural English rendering, not a gloss. These are songs; a stiff crib makes a
     parent close the app. Where a line is nonsense syllables it is left as nonsense syllables
     and said to be so, because that is the honest translation of "akkad bakkad".

     `words[]` is populated even on text_pending entries. A word is a dictionary item, not a
     quotation — knowing that `chanda` is the moon and `mama` is your mother's brother is
     teachable whether or not we have cleared the lyric. This is what keeps a flagged entry
     useful instead of a hole.

   EDITORIAL
   - CLAUDE.md rule 8. Hindi is 14 of 54 songs and is introduced as "Hindi and Hindustani,
     across the north", never as "Indian". Ten other languages carry the rest. The two gaps I
     could not fill honestly — Odia and Assamese — are marked as gaps rather than padded, and
     that absence is itself the brief for whoever collects next.
   - The moon is a maternal uncle in nine of these languages (chanda mama, chand mama,
     chandamama, chandoba, chanda mamu) and the rhymes teach that relationship before they
     teach anything else. Rishtey and Geet should cross-link on it.
   - Faiths from the inside, never ranked (CLAUDE.md rule 4). The bhajans below are ten pieces
     from four traditions, each introduced the way a family who sings it would introduce it,
     each with the same amount of room. No comparison, no ordering, no "and Sikhs also…".
   - Gurbani: the Mool Mantar is quoted because I am certain of both text and citation. No
     Sikh Guru is depicted anywhere in this file, no Gurbani is paraphrased as if quoted, and
     the entry carries handling notes because Gurbani is not background music.
   - No progress bars, no streaks, no completion anywhere in the copy (docs/10 §3.5). "Again"
     is a first-class button and re-listening is love, not repetition.
   - Nothing here is cleared to ship. See `review` at the foot of the file. */

window.IND_GEET = {

  intro: 'These are the songs somebody sang over you before you could talk. Some are ' +
         'lullabies, some are for the rain, some are shouted in a playground with your ' +
         'hands in somebody else’s. Nobody wrote them — they were passed along until they ' +
         'reached you. Ask at home which ones your family had. You will probably get a ' +
         'different version, and the different version is the right one.',

  /* The kinds, in the words a parent would use, not a taxonomy. */
  kinds: [
    { id:'lori',       label:'For going to sleep', note:'Lullabies. Lori in Hindi, thalattu in Tamil, ghum-parani in Bengali, halardu in Gujarati, nisukani in Assamese — every language has its own word for the form.' },
    { id:'rhyme',      label:'Little songs',       note:'Four lines about a fish, an elephant, a parrot. The first things a child is taught after the alphabet.' },
    { id:'counting',   label:'For choosing who’s it', note:'Counting-out chants. Every country has them; India’s start with nonsense syllables just like everybody else’s.' },
    { id:'game-song',  label:'With your hands in it', note:'You cannot sing these sitting still. They need a partner, a ring of children, or a knee.' },
    { id:'bhajan',     label:'Sung at the lamp',   note:'Short devotional pieces children pick up by standing next to somebody who is singing them.' },
    { id:'seasonal',   label:'For a day in the year', note:'The rain arriving, the Onam flowers, the Lohri fire. They only get sung once a year, which is why they stick.' }
  ],

  /* Languages present, in the order they appear. Hindi first because it is the largest single
     diaspora set — NOT because it stands for India. Every card names its language. */
  languages: [
    { id:'hi', name:'Hindi / Hindustani', region:'Across the north',            songs:14 },
    { id:'mr', name:'Marathi',            region:'Maharashtra',                 songs:5  },
    { id:'bn', name:'Bengali',            region:'Bengal',                      songs:5  },
    { id:'ta', name:'Tamil',              region:'Tamil Nadu',                  songs:6  },
    { id:'te', name:'Telugu',             region:'Andhra Pradesh & Telangana',  songs:4  },
    { id:'kn', name:'Kannada',            region:'Karnataka',                   songs:3  },
    { id:'ml', name:'Malayalam',          region:'Kerala',                      songs:3  },
    { id:'gu', name:'Gujarati',           region:'Gujarat',                     songs:4  },
    { id:'pa', name:'Punjabi',            region:'Punjab',                      songs:4  },
    { id:'or', name:'Odia',               region:'Odisha',                      songs:3  },
    { id:'as', name:'Assamese',           region:'Assam',                       songs:3  }
  ],

  /* The rights position, written down so nobody has to reconstruct it later. */
  rights: {
    policy: 'Traditional, folk and public-domain material only. No film lyric appears in this ' +
            'file in any form, in any language, however famous, however certain someone is ' +
            'that “it’s basically a nursery rhyme now”.',
    why_it_bites: 'Indian film music is the single largest body of recorded children’s ' +
                  'listening in the world and its rights are actively enforced. Several of ' +
                  'the songs a diaspora parent would name first are film songs written in ' +
                  'the 1950s–1980s and comfortably inside copyright.',
    the_trap: 'A folk couplet that a film later extended is the hard case — the couplet may ' +
              'be free and the film’s continuation is not, and no editor can tell which lines ' +
              'are which. Those entries are flagged doubt:"rights" with the text withheld.',
    public_domain_used: 'Where a named poet is used, they are long out of copyright and the ' +
                        'entry says who and when: Irayimman Thampi (d. 1856), Subramania ' +
                        'Bharati (d. 1921, works nationalised by the Government of Madras in ' +
                        '1949), Narsinh Mehta (15th c.), Tukaram (17th c.), Purandara Dasa ' +
                        '(d. 1564), Annamacharya (d. 1503).',
    still_required: 'Public domain in the text does NOT give us a recording. Every audio ' +
                    'asset must be newly recorded by a human singer, per docs/09 — never a ' +
                    'commercial recording, never TTS. A synthesiser cannot sing a thalattu.'
  },

  songs: [

    /* ============================================ HINDI / HINDUSTANI (14) ============================================
       Across the north, and the largest single diaspora set — which is why it is first, and
       is not a claim that it is the Indian one. Five carry text. Nine do not, and the reasons
       differ: two are film songs (included as warning labels), one is the folk-couplet-inside-
       a-film-song trap, and six are genuinely folk rhymes I know several versions of. */

    {
      id:'machhli-jal-ki-rani', title:'Machhli jal ki rani hai',
      script:'मछली जल की रानी है\nजीवन उसका पानी है\nहाथ लगाओ डर जाएगी\nबाहर निकालो मर जाएगी',
      roman:'machhli jal ki rani hai\njeevan uska paani hai\nhaath lagao dar jayegi\nbaahar nikalo mar jayegi',
      en:'The fish is the queen of the water.\nWater is her whole life.\nPut a hand near her and she takes fright.\nLift her out of it and she dies.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'4-6',
      kid:'Four lines about a fish, and the last two are the reason grown-ups still quote it: leave her where she lives.',
      note:'Usually the first rhyme a child gets after the alphabet, and the one almost every Hindi-speaking parent can still say without thinking about it.',
      words:[
        { term:'मछली', roman:'machhli', en:'fish' },
        { term:'जल',   roman:'jal',     en:'water — the older, more formal word' },
        { term:'रानी', roman:'rani',    en:'queen' },
        { term:'जीवन', roman:'jeevan',  en:'life' },
        { term:'पानी', roman:'paani',   en:'water — the everyday word' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/machhli-jal-ki-rani',
      source:'Traditional Hindi nursery rhyme. No known author; in oral circulation long enough that no first printing can be pointed to.'
    },
    {
      id:'akkad-bakkad', title:'Akkad bakkad bambe bo',
      script:'अक्कड़ बक्कड़ बम्बे बो\nअस्सी नब्बे पूरे सौ\nसौ में लगा धागा\nचोर निकल कर भागा',
      roman:'akkad bakkad bambe bo\nassi nabbe pure sau\nsau mein laga dhaga\nchor nikal kar bhaga',
      en:'Akkad bakkad bambe bo —\neighty, ninety, a full hundred.\nA thread went through the hundred,\nand out ran the thief.',
      lang:'Hindi', region:'Across the north', kind:'counting', age:'4-6',
      kid:'How you decide who is “it”. You point at one child per word, going round the ring, and whoever the last word lands on is out.',
      note:'The first line does not mean anything. It is nonsense on purpose, the same way “eeny meeny miny mo” is nonsense — the sound is the whole job.',
      words:[
        { term:'अस्सी', roman:'assi',  en:'eighty' },
        { term:'नब्बे', roman:'nabbe', en:'ninety' },
        { term:'सौ',    roman:'sau',   en:'a hundred' },
        { term:'धागा',  roman:'dhaga', en:'thread' },
        { term:'चोर',   roman:'chor',  en:'thief' }
      ],
      actions:[
        'Everyone stands in a ring with one fist out.',
        'The counter taps one fist per word, going round.',
        'Whoever “bhaga” lands on pulls their hand back. Start again with the rest.'
      ],
      sing:'solo', badge:'aaj', audio:'geet/akkad-bakkad',
      source:'Traditional Hindi counting-out chant. Anonymous; the numbers are the only part anybody agrees on.'
    },
    {
      id:'gol-gol-rani', title:'Gol gol rani',
      script:'गोल गोल रानी\nकित्ता कित्ता पानी\nघुटने घुटने पानी\nकमर कमर पानी\nगले गले पानी\nसर सर पानी!',
      roman:'gol gol rani\nkitta kitta paani\nghutne ghutne paani\nkamar kamar paani\ngale gale paani\nsar sar paani!',
      en:'Round and round, queen —\nhow deep is the water?\nKnee deep.\nWaist deep.\nNeck deep.\nOver your head!',
      lang:'Hindi', region:'Across the north', kind:'game-song', age:'4-6',
      kid:'The water climbs one body part at a time and you stand up a little more on each line, until it goes over your head and everybody shrieks.',
      note:'Played squatting in a ring, holding hands. Nobody is ever told the rules — you learn them by being the smallest child in the ring.',
      words:[
        { term:'गोल',   roman:'gol',    en:'round' },
        { term:'घुटना', roman:'ghutna', en:'knee' },
        { term:'कमर',   roman:'kamar',  en:'waist' },
        { term:'गला',   roman:'gala',   en:'throat, neck' },
        { term:'सर',    roman:'sar',    en:'head' }
      ],
      actions:[
        'Squat in a ring, everyone holding hands.',
        'Rise a little on each line as the water gets deeper.',
        'On the last line jump up, throw your arms over your head, and shriek.'
      ],
      sing:'call-response', variant:true, badge:'aaj', audio:'geet/gol-gol-rani',
      source:'Traditional Hindi children’s game song. The body parts are improvised — the sequence here is one common one and the card must say so, not present it as the words.'
    },
    {
      id:'poshampa', title:'Poshampa bhai poshampa',
      script:'पोशम्पा भाई पोशम्पा\nडाकुओं ने क्या किया?\nसौ रुपये की घड़ी चुराई\nअब तो जेल में जाना पड़ेगा\nजेल की रोटी खानी पड़ेगी\nजेल का पानी पीना पड़ेगा',
      roman:'poshampa bhai poshampa\ndakuon ne kya kiya?\nsau rupaye ki ghadi churai\nab to jail mein jaana padega\njail ki roti khani padegi\njail ka paani peena padega',
      en:'Poshampa, brother, poshampa —\nand what did the robbers do?\nStole a hundred-rupee watch.\nNow it’s off to jail with you,\njail bread to eat,\njail water to drink.',
      lang:'Hindi', region:'Across the north', kind:'game-song', age:'6-9',
      kid:'Two children make an arch with their arms and everyone files under it. Whoever is caught when the song stops is in jail — and the jail is very funny and lasts about nine seconds.',
      note:'The school-corridor game at break, all over north India. “Poshampa” means nothing and grown-ups have been arguing about where it came from for as long as children have been ignoring them.',
      words:[
        { term:'भाई',  roman:'bhai',    en:'brother' },
        { term:'घड़ी', roman:'ghadi',   en:'watch, clock' },
        { term:'चुराना', roman:'churana', en:'to steal' },
        { term:'रोटी', roman:'roti',    en:'flatbread' },
        { term:'पानी', roman:'paani',   en:'water' }
      ],
      actions:[
        'Two children face each other, join hands overhead to make an arch.',
        'Everyone else files under it in a line while the song runs.',
        'On the last word the arms come down. Whoever is inside is caught.'
      ],
      sing:'call-response', variant:true, badge:'aaj', audio:'geet/poshampa',
      source:'Traditional Hindi children’s game song. Anonymous. Later lines about what happens in jail vary from school to school.'
    },
    {
      id:'lalla-lalla-lori', title:'Lalla lalla lori',
      script:'लल्ला लल्ला लोरी\nदूध की कटोरी\nदूध में बताशा\nमुन्ना करे तमाशा',
      roman:'lalla lalla lori\ndoodh ki katori\ndoodh mein batasha\nmunna kare tamasha',
      en:'Lalla lalla lullaby,\na little bowl of milk,\na sugar-drop melting in the milk —\nand the baby putting on a show instead of sleeping.',
      lang:'Hindi', region:'Across the north', kind:'lori', age:'4-6',
      kid:'A cot song. The baby is meant to be going to sleep and is very much not going to sleep.',
      note:'The opening line is so ordinary in Hindi-speaking homes that “lalla lalla lori” is used as shorthand for the word lullaby itself.',
      words:[
        { term:'लोरी',   roman:'lori',    en:'lullaby' },
        { term:'दूध',    roman:'doodh',   en:'milk' },
        { term:'कटोरी',  roman:'katori',  en:'a small round bowl' },
        { term:'बताशा',  roman:'batasha', en:'a hollow sugar drop that dissolves instantly' },
        { term:'मुन्ना', roman:'munna',   en:'little one — what you call a small boy' }
      ],
      sing:'solo', variant:true, badge:'aaj', audio:'geet/lalla-lalla-lori',
      source:'Traditional Hindi lullaby couplet, anonymous. Films have quoted the opening line repeatedly; the couplet itself long predates them and carries no author. Verses after the fourth line differ from house to house and are not set down here.'
    },
    {
      id:'chanda-mama-door-ke', title:'Chanda mama door ke',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'The four-line folk quatrain — chanda mama up there frying sweets, eating his off a plate and sending the baby’s down in a little cup — is universally described as a traditional lullaby. It is ALSO the opening of a 1955 Hindi film song whose extended lyric has a named lyricist and a live rights holder. Separating the free couplet from the owned continuation is a rights-clearance job, not an editorial one, and it is exactly the trap described in `rights.the_trap`. Text withheld until someone with the file says which lines are ours.',
      lang:'Hindi', region:'Across the north', kind:'lori', age:'4-6',
      kid:'The moon is not a man in the moon. He is your mother’s brother, he is up there cooking, and he is sending some down for you.',
      note:'Sung at cots across north India, usually at a window, usually pointing at the actual moon. The relationship is the point: an uncle, not a stranger.',
      words:[
        { term:'चंदा', roman:'chanda', en:'moon' },
        { term:'मामा', roman:'mama',   en:'your mother’s brother — never a generic uncle' },
        { term:'दूर',  roman:'door',   en:'far away' },
        { term:'थाली', roman:'thali',  en:'a metal plate you eat off' },
        { term:'प्याली', roman:'pyali', en:'a little cup' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Believed traditional; contested by a film adaptation. Do not print until cleared.'
    },
    {
      id:'aloo-kachaloo', title:'Aloo kachaloo beta kahan gaye the',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Genuinely folk and no rights problem at all. But I know at least three mutually inconsistent versions of the middle — where the boy was sleeping, and who or what hit him — and I am not confident which is the widespread one. Printing one as canonical is precisely the error a parent catches in a second. Collect it from one household, name the region on the card, and let the other versions be other versions.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'4-6',
      kid:'A boy called Potato-Yam gets asked where he has been, and the answer is a small disaster involving vegetables.',
      note:'Ends with a call-and-response about how loudly he cried — “how loud?” “THIS loud!” — which is the bit children wait for and the bit that varies most.',
      words:[
        { term:'आलू',  roman:'aloo',   en:'potato' },
        { term:'बेटा', roman:'beta',   en:'son — also just how you address any small child' },
        { term:'कहाँ', roman:'kahan',  en:'where' },
        { term:'रोना', roman:'rona',   en:'to cry' },
        { term:'ज़ोर', roman:'zor',    en:'force, loudness' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Hindi children’s rhyme; anonymous. Needs one clean transcription with a named region.'
    },
    {
      id:'ek-kauwa-pyaasa', title:'Ek kauwa pyaasa tha',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'The story — thirsty crow, half-empty pot, pebbles, rising water — is ancient and free. The rhymed Hindi school version is also free, but it exists in a dozen slightly different classroom settings and I cannot say which lines are the common ones. The story can be told in Katha today; the rhyme needs collecting.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'6-9',
      kid:'A crow cannot reach the water at the bottom of a pot, so he drops in pebbles one by one until it comes up to him.',
      note:'Every Indian child meets this crow. It is usually the first story a child is asked to retell in their own words at school.',
      words:[
        { term:'कौआ',  roman:'kauwa',  en:'crow' },
        { term:'प्यासा', roman:'pyaasa', en:'thirsty' },
        { term:'घड़ा',  roman:'ghada',  en:'a round clay water pot' },
        { term:'कंकड़', roman:'kankad', en:'pebble' },
        { term:'ऊपर',  roman:'oopar',  en:'up, upwards' }
      ],
      sing:'solo', badge:'katha', audio:null,
      source:'Traditional; the rhymed setting is anonymous school material. Free of rights, short of an accurate text.'
    },
    {
      id:'hathi-raja-kahan-chale', title:'Hathi raja kahan chale',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Free and folk. I can recall the shape — the child stops an elephant, asks where he is going, and invites him home to eat — but not the wording with the confidence this file requires, and the food in the last line differs everywhere. Not reconstructed.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'4-6',
      kid:'You stop an elephant in the street and ask him where he thinks he is going, then invite him home for lunch.',
      note:'Said with a swinging arm for the trunk. Toddlers do the trunk long before they can do the words.',
      words:[
        { term:'हाथी', roman:'hathi', en:'elephant' },
        { term:'राजा', roman:'raja',  en:'king — used here as a friendly title, the way you’d say “sir”' },
        { term:'सूँड़', roman:'soondh', en:'trunk' },
        { term:'बड़ा', roman:'bada',  en:'big' },
        { term:'घर',  roman:'ghar',   en:'house, home' }
      ],
      actions:['Hang one arm down in front of your face and swing it for the trunk.'],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Hindi children’s rhyme; anonymous. Needs collecting.'
    },
    {
      id:'chal-mere-ghode', title:'Chal mere ghode tik tik tik',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'A knee-bouncing rhyme, certainly folk, certainly free. The first line is stable and everything after it is not — I have heard it continue four different ways. One line is not a song, so the slot stays empty rather than half-filled.',
      lang:'Hindi', region:'Across the north', kind:'game-song', age:'4-6',
      kid:'You are the horse and somebody bigger is riding you, or the other way round, and the tik-tik-tik is the hooves.',
      note:'Done on a knee, at speed, ending with the child dropped an inch between the grown-up’s legs. That drop is the whole reason children ask for it again.',
      words:[
        { term:'घोड़ा', roman:'ghoda', en:'horse' },
        { term:'चलना', roman:'chalna', en:'to go, to move' },
        { term:'मेरा',  roman:'mera',  en:'my' },
        { term:'राजा', roman:'raja',   en:'king' }
      ],
      actions:['Sit the child on your knee facing you.', 'Bounce on every “tik”.', 'Open your knees an inch at the end so they drop, and catch them.'],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Hindi knee rhyme; anonymous. Needs collecting.'
    },
    {
      id:'bandar-mama-pajama', title:'Bandar mama pahan pajama',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Folk and free, and I am confident only of the first line. The rest — where the monkey goes and what happens to the pyjamas — I have heard too many ways to pick one. Withheld.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'4-6',
      kid:'A monkey puts on a pair of pyjamas and goes out, which is already the funniest thing a four-year-old has heard that day.',
      note:'One of the small handful of Hindi rhymes that survive purely because the first line is impossible to say without laughing.',
      words:[
        { term:'बंदर',   roman:'bandar',  en:'monkey' },
        { term:'मामा',   roman:'mama',    en:'mother’s brother — here just an affectionate way to address him' },
        { term:'पहनना', roman:'pahanna', en:'to wear, to put on' },
        { term:'पजामा', roman:'pajama',  en:'loose drawstring trousers — the English word came from this one' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Hindi children’s rhyme; anonymous. Needs collecting.'
    },
    {
      id:'atkan-chatkan', title:'Atkan chatkan',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'A counting-out chant made almost entirely of nonsense syllables, which is exactly the material that mutates fastest and that I have least ability to verify. Free of rights; short of a text. Collect two versions and print both, because for this kind of chant two versions is more honest than one.',
      lang:'Hindi', region:'Across the north', kind:'counting', age:'6-9',
      kid:'Another way of deciding who is “it”. Almost none of the words mean anything, which is the point — you are counting, not talking.',
      note:'Where akkad bakkad is the standard, this is the regional alternative, and which one a parent knows is a decent clue to where they grew up.',
      words:[
        { term:'दही', roman:'dahi', en:'yoghurt, curd' },
        { term:'बाहर', roman:'baahar', en:'outside' },
        { term:'अंदर', roman:'andar', en:'inside' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Hindi counting-out chant; anonymous. Needs collecting, ideally twice.'
    },
    {
      id:'nani-teri-morni', title:'Nani teri morni ko mor le gaye',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'NOT TRADITIONAL, and this entry exists to say so. It is a Hindi film song from 1960 with a named lyricist and a live rights holder, and it is one of the two or three most likely things for someone to add to this file later assuming it is folk. It is not. Either license it properly or leave it out; do not let it drift in as “everyone knows it”.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'6-9',
      kid:null,
      note:'Kept in the file with no lyric as a warning label, not as content. If it ever ships it ships with a licence attached.',
      words:[
        { term:'नानी', roman:'nani', en:'your mother’s mother' },
        { term:'मोरनी', roman:'morni', en:'peahen' },
        { term:'मोर',  roman:'mor',  en:'peacock' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Hindi film song, 1960. In copyright. Do not treat as folk.'
    },
    {
      id:'lakdi-ki-kathi', title:'Lakdi ki kathi',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'NOT TRADITIONAL either, and the single most likely mistake anyone will make with this file. Written for a Hindi film released in 1983, with a named lyricist and a named composer, both of whose estates are collecting. Two generations of Indian children learned it off a cassette, which is exactly why it FEELS folk and exactly why it is not. Flagged here so nobody has to discover it in a takedown notice.',
      lang:'Hindi', region:'Across the north', kind:'rhyme', age:'4-6',
      kid:null,
      note:'Named in docs/11 §4.5 as an example of the childhood soundtrack, which is fair as a description of the feeling and wrong as a description of the rights. Both things are true and only one of them can go in the app.',
      words:[
        { term:'लकड़ी', roman:'lakdi', en:'wood' },
        { term:'घोड़ा', roman:'ghoda', en:'horse' },
        { term:'दौड़ना', roman:'daudna', en:'to run' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Hindi film song, 1983. In copyright. Do not treat as folk.'
    },

    /* ============================================ MARATHI (5) ============================================ */

    {
      id:'ye-re-ye-re-pausa', title:'Ye re ye re pausa',
      script:'ये रे ये रे पावसा\nतुला देतो पैसा\nपैसा झाला खोटा\nपाऊस आला मोठा',
      roman:'ye re ye re pausa\ntula deto paisa\npaisa jhala khota\npaus aala motha',
      en:'Come along, rain, come along —\nI’ll give you a coin.\nThe coin turned out to be a dud,\nand the rain came down harder than ever.',
      lang:'Marathi', region:'Maharashtra', kind:'seasonal', age:'4-6',
      kid:'A child tries to bribe the rain with a coin. The coin is fake. The rain comes anyway, and bigger.',
      note:'Shouted at the window on the first proper day of the monsoon. Every Marathi-speaking adult has this one, and most learned it before they could read.',
      words:[
        { term:'पाऊस', roman:'paus',  en:'rain' },
        { term:'पैसा', roman:'paisa', en:'a coin, money' },
        { term:'खोटा', roman:'khota', en:'false, counterfeit' },
        { term:'मोठा', roman:'motha', en:'big' },
        { term:'ये',   roman:'ye',    en:'come' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/ye-re-ye-re-pausa',
      source:'Traditional Marathi children’s rhyme; no known author.'
    },
    {
      id:'chandoba-chandoba', title:'Chandoba chandoba bhaglas ka',
      script:'चांदोबा चांदोबा भागलास का?\nनिंबोणीच्या झाडामागे लपलास का?',
      roman:'chandoba chandoba bhaglas ka?\nnimbonichya jhadamage laplas ka?',
      en:'Moon, moon, did you run off?\nAre you hiding behind the neem tree?',
      lang:'Marathi', region:'Maharashtra', kind:'lori', age:'4-6',
      kid:'The moon goes behind a tree and the child wants to know whether he is hiding on purpose.',
      note:'A Marathi bedtime standard. There are further verses about an uncle’s stone-built house, and how many of them a family sings is a family thing.',
      words:[
        { term:'चांदोबा', roman:'chandoba', en:'the moon, said fondly — the -oba is affection' },
        { term:'झाड',    roman:'jhaad',    en:'tree' },
        { term:'निंब',   roman:'nimb',     en:'neem — the bitter-leaved tree in every Indian courtyard' },
        { term:'लपणे',   roman:'lapane',   en:'to hide' },
        { term:'पळणे',   roman:'palane',   en:'to run away' }
      ],
      sing:'call-response', variant:true, badge:'aaj', audio:'geet/chandoba-chandoba',
      source:'Traditional Marathi children’s rhyme; anonymous. Opening couplet only — the later verses vary between families and are deliberately not set down here.'
    },
    {
      id:'adgulam-madgulam', title:'Adgulam madgulam',
      script:'अडगुलं मडगुलं\nसोन्याचं कडगुलं\nरुप्याचा वाळा\nतान्ह्या बाळा\nतीट लावू',
      roman:'adgulam madgulam\nsonyacham kadgulam\nrupyacha vala\ntanhya bala\ntit lavu',
      en:'Adgulam madgulam —\na little bangle of gold,\na little anklet of silver,\nand for the tiny baby,\na dot of kohl.',
      lang:'Marathi', region:'Maharashtra', kind:'game-song', age:'4-6',
      kid:'Sung while touching a baby’s wrist, then ankle, then cheek. It ends with the small black dot that is supposed to keep the evil eye off.',
      note:'Marathi grandmothers do this with babies who cannot talk yet, on a knee, at speed. The tit — a smudge of kajal behind the ear or on the cheek — is the last move and the whole reason for the rhyme.',
      words:[
        { term:'सोनं', roman:'sona',  en:'gold' },
        { term:'रुपं', roman:'rupa',  en:'silver' },
        { term:'वाळा', roman:'vala',  en:'anklet' },
        { term:'बाळ',  roman:'bal',   en:'baby' },
        { term:'तीट',  roman:'tit',   en:'the black kohl dot put on a baby against the evil eye' }
      ],
      actions:[
        'Bounce the baby on your knee through the first two lines.',
        'Touch the wrist on the bangle line, the ankle on the anklet line.',
        'On the last word, a dot of kajal on the cheek or behind the ear.'
      ],
      sing:'solo', variant:true, badge:'aaj', audio:'geet/adgulam-madgulam',
      source:'Traditional Marathi baby rhyme; anonymous. Word order and the number of ornaments differ between households.'
    },
    {
      id:'zuk-zuk-agin-gaadi', title:'Zuk zuk agin gaadi',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'both',
      why:'A Marathi children’s train song that is sung as though it were folk, but is frequently credited to a named twentieth-century Marathi poet — and if that credit is right it is squarely in copyright. I cannot settle the attribution and I cannot recall the text reliably either. Both doubts, both need a Marathi editor with a printed balgeet collection.',
      lang:'Marathi', region:'Maharashtra', kind:'rhyme', age:'4-6',
      kid:'A steam train, with the chuffing noise built into the words.',
      note:'Sung in a line of children holding each other’s shoulders, going round the room.',
      words:[
        { term:'आगगाडी', roman:'aaggadi', en:'train — literally “fire-carriage”' },
        { term:'धूर',    roman:'dhoor',   en:'smoke' },
        { term:'डबा',    roman:'daba',    en:'carriage, coach' }
      ],
      actions:['Line up holding the shoulders of the child in front.', 'Shuffle forward on the zuk-zuk.'],
      sing:'solo', badge:'aaj', audio:null,
      source:'Attribution disputed between folk and a named modern poet. Do not print until settled.'
    },
    {
      id:'nach-re-mora', title:'Nach re mora',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'NOT TRADITIONAL. Written for a Marathi film released in 1953, with a named lyricist and a named composer. It is beloved enough in Maharashtra to pass as folk, which is why it is flagged here rather than quietly omitted. In copyright.',
      lang:'Marathi', region:'Maharashtra', kind:'rhyme', age:'4-6',
      kid:null,
      note:'Kept as a warning label. Licence it or leave it.',
      words:[
        { term:'मोर',  roman:'mor',  en:'peacock' },
        { term:'नाच',  roman:'nach', en:'dance' },
        { term:'आंबा', roman:'amba', en:'mango' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Marathi film song, 1953. In copyright. Do not treat as folk.'
    },

    /* ============================================ BENGALI (5) ============================================
       Bengali has the deepest surviving body of printed chhora of any Indian language, which is
       why five of five carry text here. All five still need collating against a printed
       collection before they ship — see `review`. */

    {
      id:'aay-aay-chand-mama', title:'Aay aay chand mama',
      script:'আয় আয় চাঁদ মামা\nটিপ দিয়ে যা\nচাঁদের কপালে চাঁদ\nটিপ দিয়ে যা',
      roman:'aay aay chand mama\ntip diye ja\nchander kopale chand\ntip diye ja',
      en:'Come along, come along, moon uncle,\ncome and press a dot on her forehead —\nmy own little moon, with a moon-mark\non her brow.',
      lang:'Bengali', region:'Bengal', kind:'lori', age:'4-6',
      kid:'The mother calls the moon down to put a mark on the baby’s forehead. The baby is the second moon in the song.',
      note:'Sung at a window with the baby in your arms, pointing at the actual moon. In Bengali too the moon is an uncle — chand mama — never a man in the moon.',
      words:[
        { term:'চাঁদ',  roman:'chand',  en:'moon' },
        { term:'মামা',  roman:'mama',   en:'mother’s brother' },
        { term:'টিপ',   roman:'tip',    en:'the dot worn on the forehead' },
        { term:'কপাল', roman:'kopal',  en:'forehead' },
        { term:'আয়',   roman:'aay',    en:'come' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/aay-aay-chand-mama',
      source:'Traditional Bengali chhora (children’s rhyme); no known author.'
    },
    {
      id:'khoka-ghumalo', title:'Khoka ghumalo para juralo',
      script:'খোকা ঘুমালো, পাড়া জুড়ালো\nবর্গী এল দেশে\nবুলবুলিতে ধান খেয়েছে\nখাজনা দেব কিসে?',
      roman:'khoka ghumalo, para juralo\nborgi elo deshe\nbulbulite dhan kheyechhe\nkhajna debo kise?',
      en:'The little one’s asleep and the whole lane has gone quiet —\nand the raiders have come to the country.\nThe bulbuls have eaten the paddy;\nwhat am I going to pay the tax with?',
      lang:'Bengali', region:'Bengal', kind:'lori', age:'6-9',
      kid:'A lullaby with a worry inside it. The baby sleeps; the grown-up singing is working out how the family will pay what it owes.',
      note:'One of the oldest Bengali lullabies still in use, and one of the very few children’s songs anywhere that is openly about being broke. Some grandmothers sing the second line and some skip it.',
      words:[
        { term:'খোকা',  roman:'khoka', en:'little boy' },
        { term:'ঘুম',   roman:'ghum',  en:'sleep' },
        { term:'ধান',   roman:'dhan',  en:'paddy, unhusked rice' },
        { term:'খাজনা', roman:'khajna', en:'the tax or rent owed on land' },
        { term:'দেশ',   roman:'desh',  en:'country, homeland' }
      ],
      sing:'solo', needs_review:true, badge:'itihaas', audio:'geet/khoka-ghumalo',
      source:'Traditional Bengali lullaby; anonymous. The second line refers to eighteenth-century raiding parties, and any explanatory copy about who they were is for a human author with a named historian reviewer (docs/05 §6.5). The song ships; the history note does not, until reviewed.'
    },
    {
      id:'tai-tai-tai', title:'Tai tai tai, mamar bari jai',
      script:'তাই তাই তাই\nমামার বাড়ি যাই\nমামার বাড়ি ভারি মজা\nকিল চড় চাপড় নাই',
      roman:'tai tai tai\nmamar bari jai\nmamar bari bhari moja\nkil chor chapor nai',
      en:'Tai tai tai —\noff to my uncle’s house!\nMy uncle’s house is tremendous fun:\nnobody there smacks you at all.',
      lang:'Bengali', region:'Bengal', kind:'game-song', age:'4-6',
      kid:'Why your mother’s brother’s house is the best place on earth: nobody tells you off there.',
      note:'Clapped, with the baby’s hands held in yours. The joke is extremely old and every Bengali child gets it instantly.',
      words:[
        { term:'মামা', roman:'mama',  en:'mother’s brother' },
        { term:'বাড়ি', roman:'bari',  en:'house, home' },
        { term:'মজা',  roman:'moja',  en:'fun' },
        { term:'ভারি', roman:'bhari', en:'very, hugely' },
        { term:'যাই',  roman:'jai',   en:'I go' }
      ],
      actions:[
        'Hold the baby’s hands, one in each of yours.',
        'Clap their palms together on every beat.',
        'On the last line, throw both arms wide.'
      ],
      sing:'clap', badge:'aaj', audio:'geet/tai-tai-tai',
      source:'Traditional Bengali chhora; anonymous.'
    },
    {
      id:'aata-gachhe-tota-pakhi', title:'Aata gachhe tota pakhi',
      script:'আতা গাছে তোতা পাখি\nডালিম গাছে মৌ\nএত ডাকি তবু কথা\nকও না কেন বউ?',
      roman:'ata gachhe tota pakhi\ndalim gachhe mou\neto daki tobu katha\nkoo na keno bou?',
      en:'A parrot in the custard-apple tree,\nbees in the pomegranate tree —\nI’ve called and called and called;\nwhy won’t you say anything back?',
      lang:'Bengali', region:'Bengal', kind:'rhyme', age:'6-9',
      kid:'A garden, painted in two lines — and then a small complaint at the end that has nothing to do with the garden.',
      note:'A very old Bengali chhora. Half of it is scenery and half of it is sulking, which is a fair description of most Bengali poetry a child meets first.',
      words:[
        { term:'আতা',   roman:'ata',   en:'custard apple' },
        { term:'গাছ',   roman:'gachh', en:'tree' },
        { term:'তোতা',  roman:'tota',  en:'parrot' },
        { term:'পাখি',  roman:'pakhi', en:'bird' },
        { term:'ডালিম', roman:'dalim', en:'pomegranate' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/aata-gachhe-tota-pakhi',
      source:'Traditional Bengali chhora; anonymous. Must be collated against a printed chhora collection before shipping — we do not name one here because we have not checked one.'
    },
    {
      id:'ghum-parani-masi-pisi', title:'Ghum-parani mashi pishi',
      script:'ঘুমপাড়ানি মাসি পিসি\nমোদের বাড়ি এসো\nখাট নাই পালং নাই\nচোখ পেতে বোসো',
      roman:'ghum-parani mashi pishi\nmoder bari esho\nkhat nai palong nai\nchokh pete bosho',
      en:'Sleep-bringing aunties, both of you,\ncome round to our house.\nWe’ve no cot and no bed to offer —\nso sit down on her eyes.',
      lang:'Bengali', region:'Bengal', kind:'lori', age:'4-6',
      kid:'Two aunties whose only job in the world is bringing sleep are invited over, and then told to sit right on the child’s eyelids.',
      note:'Bengal’s most-sung lullaby. Note who is invited: mashi is your mother’s sister and pishi your father’s sister — the rhyme is teaching the difference while it puts you to sleep.',
      words:[
        { term:'ঘুম',  roman:'ghum',  en:'sleep' },
        { term:'মাসি', roman:'mashi', en:'mother’s sister' },
        { term:'পিসি', roman:'pishi', en:'father’s sister' },
        { term:'বাড়ি', roman:'bari',  en:'house' },
        { term:'চোখ',  roman:'chokh', en:'eye' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/ghum-parani-masi-pisi',
      source:'Traditional Bengali lullaby; anonymous.'
    },

    /* ============================================ TAMIL (6) ============================================
       Two are Subramania Bharati, whose works were nationalised by the Government of Madras in
       1949 and are unambiguously free. Both are given as opening lines only — the full poems
       are long and belong to a printed edition, not to my memory. */

    {
      id:'nila-nila-odi-va', title:'Nila nila odi va',
      script:'நிலா நிலா ஓடி வா\nநில்லாமல் ஓடி வா\nமலை மேலே ஏறி வா\nமல்லிகைப் பூ கொண்டு வா',
      roman:'nila nila odi va\nnillamal odi va\nmalai mele eri va\nmalligai poo kondu va',
      en:'Moon, moon, come running.\nCome running and don’t stop.\nClimb over the hill and come,\nand bring jasmine with you.',
      lang:'Tamil', region:'Tamil Nadu', kind:'rhyme', age:'4-6',
      kid:'The moon is called down off the hill, and told to bring flowers when it comes.',
      note:'Sung on a terrace at night while a child is being fed — one line, one mouthful. Tamil families in Chennai and in New Jersey both still do this, which is the entire argument for this pillar.',
      words:[
        { term:'நிலா',    roman:'nila',     en:'moon' },
        { term:'ஓடு',     roman:'odu',      en:'run' },
        { term:'மலை',     roman:'malai',    en:'hill, mountain' },
        { term:'பூ',      roman:'poo',      en:'flower' },
        { term:'மல்லிகை', roman:'malligai', en:'jasmine' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/nila-nila-odi-va',
      source:'Traditional Tamil children’s rhyme; no known author.'
    },
    {
      id:'aararo-aariraro', title:'Aararo aariraro',
      script:'ஆராரோ ஆரிரரோ\nஆராரோ ஆரிரரோ',
      roman:'aararo aariraro\naararo aariraro',
      en:'Aararo, aariraro. It doesn’t mean anything. It is what sleep sounds like in Tamil.',
      lang:'Tamil', region:'Tamil Nadu', kind:'lori', age:'4-6',
      kid:'The refrain that every Tamil lullaby is built on. The bits in between are different in every single house.',
      note:'Only the refrain is written down here, on purpose. The verses of a thalattu are made up on the spot about the actual baby — her name, her hair, who is coming to see her on Sunday — which is exactly why no two families sing the same one and why nobody should print one as the version.',
      words:[
        { term:'தாலாட்டு', roman:'thalattu', en:'lullaby — literally “tongue-rocking”' },
        { term:'கண்ணே',   roman:'kanne',    en:'“my eye” — what you call someone you love' },
        { term:'தங்கம்',  roman:'thangam',  en:'gold — also used straight to a child’s face' },
        { term:'பாப்பா',  roman:'paappa',   en:'little child' },
        { term:'தூங்கு',  roman:'thoongu',  en:'sleep' }
      ],
      sing:'solo', variant:true, badge:'aaj', audio:'geet/aararo-aariraro',
      source:'The refrain of the Tamil thalattu. Traditional and anonymous. The verses are improvised by design and are deliberately not set down.'
    },
    {
      id:'odi-vilayadu-pappa', title:'Odi vilaiyadu paappa',
      script:'ஓடி விளையாடு பாப்பா — நீ\nஓய்ந்திருக்கலாகாது பாப்பா',
      roman:'odi vilaiyadu paappa — nee\noyndhirukkalaagaadhu paappa',
      en:'Run and play, little one —\nsitting still is not for you.',
      lang:'Tamil', region:'Tamil Nadu', kind:'rhyme', age:'4-6',
      kid:'A poet wrote a whole song of instructions for small children. This is the first one, and it is: go outside and run about.',
      note:'Tamil children have learned this in school for a century, and most Tamil parents can still start it even if they cannot finish it. Starting it is enough.',
      words:[
        { term:'ஓடு',      roman:'odu',      en:'run' },
        { term:'விளையாடு', roman:'vilaiyadu', en:'play' },
        { term:'பாப்பா',   roman:'paappa',   en:'little child' },
        { term:'நீ',       roman:'nee',      en:'you' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/odi-vilayadu-pappa',
      source:'Subramania Bharati (1882–1921), “Paappa Paattu”. Bharati’s works were nationalised by the Government of Madras in 1949 and are in the public domain. Opening two lines only; the full song is long and must be set from a printed edition.'
    },
    {
      id:'chinnanchiru-kiliye', title:'Chinnanchiru kiliye',
      script:'சின்னஞ்சிறு கிளியே — கண்ணம்மா\nசெல்வக் களஞ்சியமே',
      roman:'chinnanchiru kiliye — kannamma\nselvak kalanjiyame',
      en:'My tiny little parrot, Kannamma —\nmy whole storehouse of treasure.',
      lang:'Tamil', region:'Tamil Nadu', kind:'lori', age:'4-6',
      kid:'A poet calls a small child his little parrot and then his treasure house, and runs out of words about there. It gets sung at bedtime.',
      note:'Sung over cots and at every school function in Tamil Nadu. If a Tamil parent knows one poem by heart, there is a good chance it is this one.',
      words:[
        { term:'சின்ன',    roman:'chinna',     en:'small' },
        { term:'கிளி',     roman:'kili',       en:'parrot' },
        { term:'செல்வம்', roman:'selvam',     en:'wealth' },
        { term:'களஞ்சியம்', roman:'kalanjiyam', en:'storehouse, granary' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/chinnanchiru-kiliye',
      source:'Subramania Bharati (1882–1921), the Kannamma songs. Public domain in India. Opening two lines only; collate the rest from a printed edition.'
    },
    {
      id:'kaakka-kaakka', title:'Kaakka kaakka',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'A crow rhyme sung to Tamil toddlers, free of any rights question, and I cannot recall it accurately. The opening call is stable and nothing after it is. Needs a Tamil-speaking collector, not a reconstruction.',
      lang:'Tamil', region:'Tamil Nadu', kind:'rhyme', age:'4-6',
      kid:'You call a crow and ask it where its nest is, and it is expected to answer.',
      note:'Done at a window with a real crow in view, of which Tamil Nadu has never had a shortage.',
      words:[
        { term:'காக்கா', roman:'kaakka', en:'crow' },
        { term:'கூடு',   roman:'koodu',  en:'nest' },
        { term:'எங்கே',  roman:'enge',   en:'where' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Tamil children’s rhyme; anonymous. Needs collecting.'
    },
    {
      id:'thiruppavai-margazhi', title:'The Margazhi song (Thiruppavai)',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'No rights question whatsoever — Andal’s Thiruppavai is roughly twelve hundred years old. The problem is entirely mine: a pasuram is dense Tamil and I can recall the opening phrase reliably and no more. Reconstructing a devotional text from a half-memory is the exact failure docs/10 §3 was written about, and it would be worse here than anywhere because families recite this one daily for a month. A Tamil reader must set pasuram 1 from a printed edition.',
      lang:'Tamil', region:'Tamil Nadu', kind:'seasonal', age:'9-12',
      kid:'Thirty verses, one for each morning of the Tamil month of Margazhi. Children get up before dawn in the cold and sing one a day until the month runs out.',
      note:'If a Tamil family keeps one thing across an ocean it is often this — a month of early mornings in December and January, kolam on the doorstep, one verse a day.',
      words:[
        { term:'மார்கழி',  roman:'margazhi',  en:'the Tamil month around mid-December to mid-January' },
        { term:'பாசுரம்',  roman:'pasuram',   en:'one verse of the Thiruppavai' },
        { term:'கோலம்',   roman:'kolam',     en:'the rice-flour pattern drawn on the doorstep at dawn' },
        { term:'விடியல்', roman:'vidiyal',   en:'daybreak' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Andal, Thiruppavai — 30 pasurams, Tamil, roughly 8th century. Long in the public domain. Text withheld for accuracy, not for rights.'
    },

    /* ============================================ TELUGU (4) ============================================ */

    {
      id:'chandamama-raave', title:'Chandamama raave',
      script:'చందమామ రావే\nజాబిల్లి రావే\nకొండెక్కి రావే\nగోగుపూలు తేవే',
      roman:'chandamama raave\njabilli raave\nkondekki raave\ngogu poolu teve',
      en:'Come along, moon uncle.\nCome along, bright one.\nClimb the hill and come,\nand bring gogu flowers with you.',
      lang:'Telugu', region:'Andhra Pradesh & Telangana', kind:'rhyme', age:'4-6',
      kid:'The moon is called over the hill to bring flowers. Sung one line at a time while a child is being fed.',
      note:'The feeding song in Telugu homes — a line, a mouthful, a line, a mouthful. Note the moon gets called twice by two different names, because chandamama and jabilli are both the moon and the song wants both.',
      words:[
        { term:'చందమామ', roman:'chandamama', en:'the moon — literally moon-uncle' },
        { term:'జాబిల్లి', roman:'jabilli',    en:'the moon, a second Telugu word for it' },
        { term:'కొండ',    roman:'konda',      en:'hill' },
        { term:'పూవు',    roman:'poovu',      en:'flower' },
        { term:'రా',      roman:'raa',        en:'come' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/chandamama-raave',
      source:'Traditional Telugu children’s rhyme; no known author. Later songs have quoted it often, but the rhyme itself is folk and predates all of them.'
    },
    {
      id:'chitti-chilakamma', title:'Chitti chilakamma',
      script:'చిట్టి చిలకమ్మా\nఅమ్మ కొట్టిందా?\nతోటకు పోయావా?\nపండు తెచ్చావా?',
      roman:'chitti chilakamma\namma kottinda?\nthotaku poyava?\npandu techchava?',
      en:'Little parrot, little one —\ndid your mother smack you?\nDid you go down to the garden?\nDid you bring back a fruit?',
      lang:'Telugu', region:'Andhra Pradesh & Telangana', kind:'game-song', age:'4-6',
      kid:'A run of questions asked of a very small parrot, one per finger, and the child answers for it.',
      note:'Done on the hand — you take one of the child’s fingers per question and finish at the thumb. Telugu grandmothers do this with toddlers who cannot answer yet, which does not slow anyone down.',
      words:[
        { term:'చిట్టి',  roman:'chitti',  en:'tiny' },
        { term:'చిలుక',  roman:'chiluka', en:'parrot' },
        { term:'అమ్మ',   roman:'amma',    en:'mother' },
        { term:'తోట',    roman:'thota',   en:'garden, orchard' },
        { term:'పండు',   roman:'pandu',   en:'fruit' }
      ],
      actions:[
        'Take the child’s hand palm up.',
        'One finger per question, starting at the little finger.',
        'Finish on the thumb and give it a shake.'
      ],
      sing:'call-response', badge:'aaj', audio:'geet/chitti-chilakamma',
      source:'Traditional Telugu children’s finger rhyme; anonymous.'
    },
    {
      id:'enugamma-enugu', title:'Enugamma enugu',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Free and folk. I can describe the shape — an elephant arrives, the child asks whose elephant and where it came from — but not the wording, and Telugu spelling I am unsure of is worse than no Telugu at all. Needs a Telugu-speaking collector.',
      lang:'Telugu', region:'Andhra Pradesh & Telangana', kind:'rhyme', age:'4-6',
      kid:'An elephant turns up at the house and gets thoroughly interrogated about it.',
      note:'Done with a swinging arm for the trunk, like its Hindi and Kannada cousins. Half of India has an elephant rhyme and they are all the same joke.',
      words:[
        { term:'ఏనుగు', roman:'enugu', en:'elephant' },
        { term:'ఇల్లు',  roman:'illu',  en:'house' },
        { term:'వచ్చిన', roman:'vachchina', en:'that came' }
      ],
      actions:['Swing one arm in front of your face for the trunk.'],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Telugu children’s rhyme; anonymous. Needs collecting.'
    },
    {
      id:'telugu-counting-rhyme', title:'The Telugu counting rhyme',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'There is a standard Telugu counting-out chant used for choosing who is “it”, and I do not know it well enough to write a line of it. Recorded here as a gap so that a collector knows to go and get one, rather than leaving Telugu with no counting song at all and implying there isn’t one.',
      lang:'Telugu', region:'Andhra Pradesh & Telangana', kind:'counting', age:'6-9',
      kid:'How Telugu children decide who is going to be the chaser.',
      note:'Every playground has one and it is never the same as the next district’s.',
      words:[
        { term:'ఒకటి', roman:'okati',  en:'one' },
        { term:'రెండు', roman:'rendu',  en:'two' },
        { term:'మూడు', roman:'moodu',  en:'three' },
        { term:'నాలుగు', roman:'naalugu', en:'four' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional; not yet collected. This entry is a brief, not content.'
    },

    /* ============================================ KANNADA (3) ============================================ */

    {
      id:'aane-bantondaane', title:'Aane bantondaane',
      script:'ಆನೆ ಬಂತೊಂದಾನೆ\nಯಾವೂರಾನೆ?\nಬಿಜಾಪುರದಾನೆ',
      roman:'aane bantondaane\nyaavooraane?\nbijapuradaane',
      en:'An elephant came — one elephant.\nFrom which town, this elephant?\nAn elephant from Bijapur.',
      lang:'Kannada', region:'Karnataka', kind:'rhyme', age:'4-6',
      kid:'Call and answer about an elephant, and where in Karnataka it walked in from.',
      note:'The grown-up asks and the child shouts the answer. Toddlers who cannot manage the rest of it can usually manage “aane”.',
      words:[
        { term:'ಆನೆ',  roman:'aane',  en:'elephant' },
        { term:'ಬಂತು', roman:'bantu', en:'came' },
        { term:'ಊರು',  roman:'ooru',  en:'town, village — also “where you are from”' },
        { term:'ಒಂದು', roman:'ondu',  en:'one' }
      ],
      sing:'call-response', variant:true, badge:'aaj', audio:'geet/aane-bantondaane',
      source:'Traditional Kannada children’s rhyme; anonymous. Opening exchange only — the town changes depending on where the child is, which is the fun of it, and the later lines vary.'
    },
    {
      id:'bannada-tagadina-tutturi', title:'Bannada tagadina tutturi',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'NOT TRADITIONAL. A Kannada children’s poem by a named twentieth-century poet who died in 1979, which puts it comfortably inside copyright in India for decades yet. It is taught in Karnataka schools so widely that it reads as folk. It is not, and this entry exists so nobody adds it.',
      lang:'Kannada', region:'Karnataka', kind:'rhyme', age:'4-6',
      kid:null,
      note:'Warning label, not content. Licence it from the estate or leave it out.',
      words:[
        { term:'ಬಣ್ಣ',    roman:'banna',   en:'colour' },
        { term:'ತುತ್ತೂರಿ', roman:'tutturi', en:'trumpet' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Named Kannada poet, d. 1979. In copyright. Do not treat as folk.'
    },
    {
      id:'kannada-laali', title:'The Kannada laali',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Kannada has its own lullaby form, the laali, with a refrain as fixed as the Tamil aararo and verses as improvised. I can describe it and I cannot quote it. Withheld rather than approximated. A Kannada-speaking collector should record one grandmother singing one, refrain and all.',
      lang:'Kannada', region:'Karnataka', kind:'lori', age:'4-6',
      kid:'The sound a Kannada lullaby is built on, with a made-up verse about the actual baby laid over the top.',
      note:'Like the Tamil thalattu, the verses are about the specific child — her name, her curls, who is visiting. That is why no printed version is the real one.',
      words:[
        { term:'ಲಾಲಿ',  roman:'laali', en:'lullaby' },
        { term:'ಮಗು',   roman:'magu',  en:'baby, child' },
        { term:'ನಿದ್ದೆ', roman:'nidde', en:'sleep' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Kannada lullaby form; anonymous. Needs recording, not transcribing.'
    },

    /* ============================================ MALAYALAM (3) ============================================ */

    {
      id:'omanathinkal-kidavo', title:'Omanathinkal kidavo',
      script:'ഓമനത്തിങ്കൾ കിടാവോ\nനല്ല കോമള താമരപ്പൂവോ',
      roman:'omanathinkal kidavo\nnalla komala thamarappoovo',
      en:'Are you a darling little crescent moon?\nOr a soft and lovely lotus flower?',
      lang:'Malayalam', region:'Kerala', kind:'lori', age:'4-6',
      kid:'The whole song is one grown-up looking at a baby, trying to say what it is like, and running out of things in the world to compare it to.',
      note:'Malayalam’s best-known lullaby. It was written for a baby prince in Travancore about two hundred years ago and has been sung over completely ordinary babies ever since.',
      words:[
        { term:'ഓമന',   roman:'omana',   en:'darling' },
        { term:'തിങ്കൾ', roman:'thinkal', en:'moon' },
        { term:'കിടാവ്', roman:'kidavu',  en:'baby, young one' },
        { term:'താമര',   roman:'thamara', en:'lotus' },
        { term:'പൂവ്',   roman:'poovu',   en:'flower' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/omanathinkal-kidavo',
      source:'Irayimman Thampi (1782–1856), “Omanathinkal Kidavo”. Long in the public domain. Opening couplet only — the full song runs to many verses and must be set from a printed edition.'
    },
    {
      id:'maveli-nadu-vaneedum-kalam', title:'Maveli naadu vaaneedum kaalam',
      script:'മാവേലി നാടു വാണീടും കാലം\nമാനുഷരെല്ലാരുമൊന്നുപോലെ',
      roman:'maveli naadu vaaneedum kaalam\nmaanusharellaarum onnu pole',
      en:'When Maveli ruled the land,\nevery person was the same as every other.',
      lang:'Malayalam', region:'Kerala', kind:'seasonal', age:'6-9',
      kid:'The Onam song. It describes what it was like when King Mahabali ruled — nobody above anybody, nobody going without.',
      note:'Sung around the pookkalam, the flower carpet on the doorstep, during Onam. Kerala families abroad still lay the flowers, and they still start here.',
      words:[
        { term:'നാട്',    roman:'naadu',    en:'land, country' },
        { term:'കാലം',   roman:'kaalam',   en:'time, era' },
        { term:'മനുഷ്യർ', roman:'manushyar', en:'people, human beings' },
        { term:'ഒന്ന്',   roman:'onnu',     en:'one' },
        { term:'പൂക്കളം', roman:'pookkalam', en:'the flower carpet laid at Onam' }
      ],
      sing:'call-response', variant:true, badge:'aaj', audio:'geet/maveli-nadu',
      source:'Traditional Malayalam Onam song; anonymous. Opening couplet only — the later verses differ between printed versions and between families, and both differences are real.'
    },
    {
      id:'kakke-kakke-koodevide', title:'Kakke kakke koodevide',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'both',
      why:'A Malayalam crow rhyme that circulates as folk but is also attributed to a named twentieth-century poet, which would put it in copyright. I can settle neither the attribution nor the text. Both doubts. Needs a Malayalam editor with a printed collection in hand.',
      lang:'Malayalam', region:'Kerala', kind:'rhyme', age:'4-6',
      kid:'A crow is asked where its nest is and what it has been eating.',
      note:'Learned at nursery all over Kerala, which is exactly why nobody remembers where it came from.',
      words:[
        { term:'കാക്ക', roman:'kakka',  en:'crow' },
        { term:'കൂട്',  roman:'koodu',  en:'nest' },
        { term:'എവിടെ', roman:'evide',  en:'where' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Attribution disputed. Do not print until settled.'
    },

    /* ============================================ GUJARATI (4) ============================================ */

    {
      id:'aav-re-varsad', title:'Aav re varsad',
      script:'આવ રે વરસાદ\nઢેબરિયો પરસાદ\nઊની ઊની રોટલી ને\nકારેલાનું શાક',
      roman:'aav re varsad\ndhebariyo prasad\nuni uni rotli ne\nkarela nu shaak',
      en:'Come along, rain —\nthere’s dhebra for you as an offering,\nhot rotli straight off the pan,\nand bitter gourd.',
      lang:'Gujarati', region:'Gujarat', kind:'seasonal', age:'4-6',
      kid:'The rain gets invited to lunch, and the menu is exactly what is in a Gujarati kitchen that afternoon.',
      note:'Shouted at the window when the monsoon finally breaks. The bitter gourd at the end is the joke — nobody wants it, so it is what you offer the rain.',
      words:[
        { term:'વરસાદ', roman:'varsad', en:'rain' },
        { term:'પરસાદ', roman:'prasad', en:'food offered, then shared' },
        { term:'રોટલી', roman:'rotli',  en:'thin flatbread' },
        { term:'શાક',   roman:'shaak',  en:'a cooked vegetable dish' },
        { term:'કારેલું', roman:'karelu', en:'bitter gourd — the vegetable children are made to eat' }
      ],
      sing:'solo', variant:true, badge:'aaj', audio:'geet/aav-re-varsad',
      source:'Traditional Gujarati rain rhyme; anonymous. Households swap the food in the last line, and the swap is half the fun.'
    },
    {
      id:'mamanu-ghar-ketle', title:'Mamanu ghar ketle',
      script:'મામાનું ઘર કેટલે?\nદીવો બળે એટલે\nદીવો મેં તો દીઠો\nમામો લાગે મીઠો',
      roman:'mamanu ghar ketle?\ndivo bale etle\ndivo main to ditho\nmamo lage mitho',
      en:'How far is my uncle’s house?\nAs far as you can see his lamp burning.\nI’ve seen the lamp —\nand my uncle is the sweetest thing in it.',
      lang:'Gujarati', region:'Gujarat', kind:'game-song', age:'4-6',
      kid:'A child asks how far the uncle’s house is and gets told: as far as the light of his lamp reaches.',
      note:'Done while walking a toddler along standing on your feet, or bouncing them on a knee. The mamo here is the mother’s brother — the good uncle in every Indian rhyme there is.',
      words:[
        { term:'મામા', roman:'mama',   en:'mother’s brother' },
        { term:'ઘર',   roman:'ghar',   en:'house' },
        { term:'કેટલે', roman:'ketle',  en:'how far' },
        { term:'દીવો', roman:'divo',   en:'oil lamp' },
        { term:'મીઠો', roman:'mitho',  en:'sweet' }
      ],
      actions:[
        'Stand the child on your feet, holding both hands.',
        'Walk them along, one step per line.',
        'On “mitho”, swing them up.'
      ],
      sing:'call-response', badge:'aaj', audio:'geet/mamanu-ghar-ketle',
      source:'Traditional Gujarati children’s rhyme; anonymous.'
    },
    {
      id:'ek-biladi-jadi', title:'Ek biladi jadi',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'rights',
      why:'NOT TRADITIONAL. A Gujarati children’s poem attributed to a named author who died in 2006, which puts it firmly in copyright. It is in every Gujarati nursery, which is precisely why it needs flagging rather than omitting.',
      lang:'Gujarati', region:'Gujarat', kind:'rhyme', age:'4-6',
      kid:null,
      note:'Warning label. Licence from the estate or leave it out.',
      words:[
        { term:'બિલાડી', roman:'biladi', en:'cat' },
        { term:'જાડી',  roman:'jadi',   en:'fat' },
        { term:'ઉંદર',  roman:'undar',  en:'mouse' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Named Gujarati author, d. 2006. In copyright. Do not treat as folk.'
    },
    {
      id:'gujarati-halardu', title:'The Gujarati halardu',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Halardu is the Gujarati lullaby form and I cannot quote one accurately. Free of rights, absent from my memory. Recorded as a gap so Gujarati is not left with two daytime rhymes and no cot song, which would misrepresent the language.',
      lang:'Gujarati', region:'Gujarat', kind:'lori', age:'4-6',
      kid:'What gets sung over a Gujarati cot.',
      note:'Often sung by a group rather than one person — at a baby’s naming, several women singing halarda together.',
      words:[
        { term:'હાલરડું', roman:'halardu', en:'lullaby' },
        { term:'બાળક',   roman:'balak',   en:'child' },
        { term:'ઊંઘ',    roman:'ungh',    en:'sleep' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Gujarati lullaby form; anonymous. Needs recording.'
    },

    /* ============================================ PUNJABI (4) ============================================ */

    {
      id:'kikli-kaleer-di', title:'Kikli kaleer di',
      script:'ਕਿੱਕਲੀ ਕਲੀਰ ਦੀ\nਪੱਗ ਮੇਰੇ ਵੀਰ ਦੀ\nਦੁਪੱਟਾ ਮੇਰੇ ਭਾਈ ਦਾ\nਫਿੱਟੇ ਮੂੰਹ ਜਵਾਈ ਦਾ',
      roman:'kikli kaleer di\npagg mere veer di\ndupatta mere bhai da\nphitte moonh jawai da',
      en:'Kikli, kaleer —\nthis turban is my brother’s,\nthis long scarf is my brother’s,\nand shame on my brother-in-law’s face!',
      lang:'Punjabi', region:'Punjab', kind:'game-song', age:'6-9',
      kid:'Two children hold hands crossed over, lean back as far as they dare and spin without letting go. The song is what you shout while spinning.',
      note:'Punjab’s courtyard spinning game, played by girls at weddings and in the yard. The last line is a cheeky insult aimed at the brother-in-law and children think it is the best part, which it is.',
      words:[
        { term:'ਕਿੱਕਲੀ',  roman:'kikli',   en:'the spinning game itself' },
        { term:'ਪੱਗ',    roman:'pagg',    en:'turban' },
        { term:'ਵੀਰ',    roman:'veer',    en:'brother' },
        { term:'ਦੁਪੱਟਾ',  roman:'dupatta', en:'a long scarf worn over the shoulders' },
        { term:'ਜਵਾਈ',   roman:'jawai',   en:'sister’s husband' }
      ],
      actions:[
        'Two children face each other and cross hands — right to right, left to left.',
        'Lean back, arms straight, and spin.',
        'Do not let go. Everyone lets go.'
      ],
      sing:'clap', variant:true, badge:'aaj', audio:'geet/kikli-kaleer-di',
      source:'Traditional Punjabi girls’ game song; anonymous. Verses beyond the first four vary a great deal and are not printed here.'
    },
    {
      id:'sunder-mundriye', title:'Sunder mundriye — ho!',
      script:'ਸੁੰਦਰ ਮੁੰਦਰੀਏ — ਹੋ!\nਤੇਰਾ ਕੌਣ ਵਿਚਾਰਾ — ਹੋ!\nਦੁੱਲਾ ਭੱਟੀ ਵਾਲਾ — ਹੋ!',
      roman:'sunder mundriye — ho!\ntera kaun vichara — ho!\ndulla bhatti wala — ho!',
      en:'Sunder Mundri — ho!\nAnd who is there for you — ho!\nDulla, of the Bhattis — ho!',
      lang:'Punjabi', region:'Punjab', kind:'seasonal', age:'6-9',
      kid:'The Lohri song. One person sings a line and everybody else shouts “ho!” at the end of it, round a bonfire in January.',
      note:'Children go door to door in the days before Lohri singing this, and get sent away with sesame brittle, peanuts and jaggery. For a five-year-old the entire song is the “ho!”.',
      words:[
        { term:'ਲੋਹੜੀ', roman:'Lohri',  en:'the January bonfire festival' },
        { term:'ਸੁੰਦਰ', roman:'sunder', en:'beautiful' },
        { term:'ਕੌਣ',   roman:'kaun',   en:'who' },
        { term:'ਤਿਲ',   roman:'til',    en:'sesame — thrown on the Lohri fire and eaten as brittle' },
        { term:'ਅੱਗ',   roman:'agg',    en:'fire' }
      ],
      actions:[
        'One person calls the line; everyone else shouts “ho!”',
        'Round a fire if you have one, round a candle if you don’t.'
      ],
      sing:'call-response', needs_review:true, badge:'aaj', audio:'geet/sunder-mundriye',
      source:'Traditional Punjabi Lohri song; anonymous. Only the opening call-and-response is given. The rest of the song tells the story of Dulla Bhatti, which sits in Mughal-period Punjab, is told several ways, and is for a human author with a named reviewer (docs/05 §6.5) — not for this file.'
    },
    {
      id:'punjabi-lori', title:'The Punjabi lori',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Punjabi has its own cot songs and I cannot quote one accurately enough to print. Free of rights, missing from my memory. Left as a gap so Punjabi is represented by a spinning game and a bonfire song and not, misleadingly, by nothing quiet.',
      lang:'Punjabi', region:'Punjab', kind:'lori', age:'4-6',
      kid:'What gets sung over a Punjabi cot when the house finally goes quiet.',
      note:'Ask a Punjabi grandmother directly. This is the kind of thing that only exists in somebody’s voice.',
      words:[
        { term:'ਲੋਰੀ',  roman:'lori',  en:'lullaby' },
        { term:'ਸੌਂ',   roman:'saun',  en:'sleep' },
        { term:'ਬੱਚਾ',  roman:'bacha', en:'child' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Punjabi lullaby form; anonymous. Needs recording.'
    },
    {
      id:'punjabi-kokko', title:'The Punjabi feeding rhyme',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'The rhyme Punjabi grown-ups use to get a mouthful into a child who has decided against food — there is a standard one and I do not have it right. Not reconstructed.',
      lang:'Punjabi', region:'Punjab', kind:'rhyme', age:'4-6',
      kid:'The song for getting one more bite in, which every language on this list has a version of.',
      note:'Sung at the door with a plate, following a child around the courtyard. Universal.',
      words:[
        { term:'ਰੋਟੀ', roman:'roti',  en:'flatbread, and by extension a meal' },
        { term:'ਖਾ',   roman:'kha',   en:'eat' },
        { term:'ਦੁੱਧ', roman:'dudh',  en:'milk' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional; not yet collected.'
    },

    /* ============================================ ODIA (3) ============================================
       All three are empty, and that is the honest state of things rather than an oversight.
       Odia has a full children’s repertoire — I do not know it. Padding it with approximations
       would be worse than the gap, and the gap is a brief for whoever collects next. */

    {
      id:'odia-nani-baya', title:'The Odia lullaby',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Odia has its own lullaby tradition and I cannot recall a single text accurately. This is not a rights question and not a doubt about whether the songs exist — it is a straightforward gap in what I know, and I am not filling it with something plausible. Needs an Odia-speaking collector.',
      lang:'Odia', region:'Odisha', kind:'lori', age:'4-6',
      kid:'What gets sung over a cot in Odisha.',
      note:'Odia is spoken by more people than several European national languages and is routinely left out of “Indian” collections. Leaving the slot visibly empty is better than leaving it out.',
      words:[
        { term:'ପିଲା', roman:'pila',  en:'child' },
        { term:'ଶୋଇ',  roman:'shoi',  en:'sleep' },
        { term:'ମା',   roman:'maa',   en:'mother' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Odia lullaby; not yet collected.'
    },
    {
      id:'odia-chanda-mamu', title:'Chanda mamu — the Odia moon rhyme',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'The moon is chanda mamu in Odia — an uncle again, like everywhere else on this list — and there is a rhyme that calls him down. I know that much and not the words. Withheld.',
      lang:'Odia', region:'Odisha', kind:'rhyme', age:'4-6',
      kid:'The moon, called down out of the sky, in one more language.',
      note:'Worth collecting for the cross-language moment alone: nine of the songs in this file call the moon a maternal uncle, and a child who notices that has learned something real about India without being taught it.',
      words:[
        { term:'ଚନ୍ଦା', roman:'chanda', en:'moon' },
        { term:'ମାମୁ',  roman:'mamu',   en:'mother’s brother' },
        { term:'ଆସ',   roman:'aasa',   en:'come' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Odia children’s rhyme; not yet collected.'
    },
    {
      id:'odia-raja-doli', title:'The Raja swing songs',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Raja is Odisha’s three-day festival in June when girls do no work, wear new clothes and spend the days on decorated swings, singing. The songs are folk and free. I do not have one. Recorded so that a collector knows there is a whole seasonal form here worth going after.',
      lang:'Odia', region:'Odisha', kind:'seasonal', age:'9-12',
      kid:'Three days in June when the swings go up under the trees, and the songs are what you sing while somebody pushes you.',
      note:'A festival built entirely around girls having a rest, which is rarer in the world’s festival calendars than it ought to be.',
      words:[
        { term:'ରଜ',    roman:'Raja',  en:'the June festival' },
        { term:'ଦୋଳି',  roman:'doli',  en:'swing' },
        { term:'ଝିଅ',   roman:'jhia',  en:'girl' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Odia seasonal songs; not yet collected.'
    },

    /* ============================================ ASSAMESE (3) ============================================
       Same position as Odia, and stated the same way. */

    {
      id:'assamese-nisukani-git', title:'Nisukani geet — the Assamese lullaby',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Nisukani geet is the Assamese lullaby form. I cannot quote one and will not approximate one. A gap in my knowledge, not in the tradition.',
      lang:'Assamese', region:'Assam', kind:'lori', age:'4-6',
      kid:'What gets sung over a cot in Assam.',
      note:'Assamese is the eastern end of the Indo-Aryan family and sounds unlike anything else on this list. A child who hears it next to Bengali will hear both the family resemblance and the difference.',
      words:[
        { term:'ল‌ৰা', roman:'lora',  en:'boy' },
        { term:'টোপনি',    roman:'topani', en:'sleep' },
        { term:'আই',       roman:'aai',    en:'mother' }
      ],
      sing:'solo', badge:'aaj', audio:null,
      source:'Traditional Assamese lullaby; not yet collected.'
    },
    {
      id:'assamese-bihu-naam', title:'The children’s Bihu song',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'Bihu songs are folk, free, and enormous in number. The problem is choosing and quoting one accurately, which I cannot do. Also worth a note for whoever does: much of the adult Bihu repertoire is courtship material and is not children’s content, so this needs curating and not just collecting.',
      lang:'Assamese', region:'Assam', kind:'seasonal', age:'6-9',
      kid:'Assam’s spring festival, in April, when the year turns over — drums, a pipe made from a buffalo horn, and dancing in the field.',
      note:'Bihu is when everybody comes home. For an Assamese family abroad it is the date in the calendar that hurts most to miss.',
      words:[
        { term:'বিহু',   roman:'Bihu',    en:'the Assamese festival, three times a year' },
        { term:'ঢোল',   roman:'dhol',    en:'the drum played at Bihu' },
        { term:'পেঁপা',  roman:'pepa',    en:'a pipe made from a buffalo horn' },
        { term:'গমোচা', roman:'gamosa',  en:'the white-and-red woven cloth given as a greeting' }
      ],
      sing:'call-response', badge:'aaj', audio:null,
      source:'Traditional Assamese Bihu songs; not yet collected, and needing curation as well as collection.'
    },
    {
      id:'assamese-dhemali', title:'Assamese play rhymes',
      script:null, roman:null, en:null,
      text_pending:true, doubt:'text',
      why:'The Assamese equivalent of the clapping and counting rhymes that fill the Hindi and Bengali sections here. They exist; I do not have them. Left visibly empty.',
      lang:'Assamese', region:'Assam', kind:'game-song', age:'4-6',
      kid:'The hand games Assamese children play, which nobody outside Assam has ever put in a collection like this one.',
      note:'If this pillar ships with eleven languages and two of them are empty, at least the empties are named. Most collections simply stop after five.',
      words:[
        { term:'হাত',  roman:'haat',  en:'hand' },
        { term:'খেল',  roman:'khel',  en:'game, play' },
        { term:'গান',  roman:'gaan',  en:'song' }
      ],
      sing:'clap', badge:'aaj', audio:null,
      source:'Traditional Assamese children’s rhymes; not yet collected.'
    }

  ],

  /* ==================================================================================================
     BHAJANS — ten short devotional pieces children pick up by standing next to somebody singing them.

     Four traditions. Each is introduced the way a family who keeps it would introduce it, each gets
     the same amount of room, none is compared to another and none is ranked (CLAUDE.md rule 4).
     "Hindu" is not one thing here either — a Varkari abhang in Marathi, a Haridasa kirtan in
     Kannada, an Annamacharya keertana in Telugu and a Gujarati bhakti pad are four different
     practices, in four languages, and the file treats them as four.

     All ten carry text and all ten are public domain by a wide margin. Every one is an OPENING —
     these are long pieces and only the first lines are set down. The card must say so; a child
     must never be shown two lines and left thinking that is the whole thing.
     ================================================================================================== */

  bhajans: [

    {
      id:'raghupati-raghav', title:'Raghupati Raghav Raja Ram',
      script:'रघुपति राघव राजा राम\nपतित पावन सीता राम',
      roman:'raghupati raghav raja ram\npatit pavan sita ram',
      en:'Lord of the Raghus, king Ram —\nyou lift up whoever has fallen; Sita and Ram.',
      lang:'Hindi', region:'Across the north', kind:'bhajan', age:'6-9',
      faith:'Hindu — Ram bhakti',
      kid:'A dhun: two lines sung over and over, faster and faster, until everybody is singing and nobody is reading anything.',
      note:'The one that gets sung walking, in a group, keeping time. If a parent knows one bhajan by heart this is statistically the one.',
      words:[
        { term:'रघुपति', roman:'raghupati', en:'lord of the Raghu line — a name for Ram' },
        { term:'राजा',   roman:'raja',      en:'king' },
        { term:'पतित',   roman:'patit',     en:'fallen, brought low' },
        { term:'पावन',   roman:'pavan',     en:'one who makes pure, who lifts up' },
        { term:'धुन',    roman:'dhun',      en:'a short line sung on repeat, gathering speed' }
      ],
      sing:'call-response', needs_review:true, badge:'aaj', audio:'geet/raghupati-raghav',
      source:'Traditional Ram dhun; the couplet is old and anonymous. A widely-sung twentieth-century version adds two further lines naming God in more than one tradition’s words — those lines have a contested attribution (variously to the singer who set the tune, d. 1931, and to the prayer meetings it was sung at, d. 1948). Both candidates are public domain in India, but the attribution itself must be settled by a reviewer before any card claims it. The added lines are NOT printed here.'
    },
    {
      id:'om-jai-jagdish-hare', title:'Om jai Jagdish hare',
      script:'ॐ जय जगदीश हरे\nस्वामी जय जगदीश हरे\nभक्त जनों के संकट\nक्षण में दूर करे',
      roman:'om jai jagdish hare\nswami jay jagdish hare\nbhakt janon ke sankat\nkshan mein door kare',
      en:'Praise to the lord of the world.\nPraise to the lord of the world.\nThe trouble his people are carrying,\nhe takes away in a moment.',
      lang:'Hindi', region:'Across the north', kind:'bhajan', age:'6-9',
      faith:'Hindu — the household aarti',
      kid:'The song sung standing up at the end of a puja, while a small lamp is moved in circles and everybody claps.',
      note:'Sung at Diwali, at housewarmings, at any puja at all. Children learn it by being handed the bell and told to keep time.',
      words:[
        { term:'जगदीश', roman:'jagdish', en:'lord of the world' },
        { term:'स्वामी', roman:'swami',   en:'lord, master' },
        { term:'भक्त',  roman:'bhakt',   en:'a devotee, one who loves' },
        { term:'संकट',  roman:'sankat',  en:'trouble, difficulty' },
        { term:'क्षण',  roman:'kshan',   en:'a moment' },
        { term:'आरती', roman:'aarti',    en:'the lamp circled before an image, and the song sung while it is' }
      ],
      sing:'call-response', badge:'aaj', audio:'geet/om-jai-jagdish-hare',
      source:'Composed in the nineteenth century by a Punjabi writer and preacher (d. 1881); long in the public domain. Opening four lines only — the full aarti runs to many verses and must be set from a printed edition.'
    },
    {
      id:'hanuman-chalisa-open', title:'Jai Hanuman gyan gun sagar',
      script:'जय हनुमान ज्ञान गुन सागर\nजय कपीस तिहुँ लोक उजागर',
      roman:'jai hanuman gyan gun sagar\njai kapis tihun lok ujagar',
      en:'Hail Hanuman, an ocean of knowing and of good qualities.\nHail the chief of the monkeys, who lights up all three worlds.',
      lang:'Awadhi', region:'North India', kind:'bhajan', age:'6-9',
      faith:'Hindu — Hanuman bhakti',
      kid:'The first of forty short verses about Hanuman. Children usually learn this one and verse two, and get the rest over several years.',
      note:'Recited on Tuesdays in a lot of houses, and by a lot of adults in aeroplanes during turbulence. Almost nobody learns it from a book; they learn it standing next to somebody who is already saying it.',
      words:[
        { term:'ज्ञान', roman:'gyan',   en:'knowledge, knowing' },
        { term:'गुन',  roman:'gun',    en:'good qualities' },
        { term:'सागर', roman:'sagar',  en:'ocean' },
        { term:'कपीस', roman:'kapis',  en:'chief of the monkeys' },
        { term:'लोक',  roman:'lok',    en:'a world, a realm' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/hanuman-chalisa-open',
      source:'Tulsidas (16th century), Hanuman Chalisa, first chaupai. Public domain. The chalisa is forty verses; only the first is given and the card must say so. Language is Awadhi, not modern Hindi — a distinction worth naming rather than smoothing over.'
    },
    {
      id:'vaishnav-jan-to', title:'Vaishnav jan to',
      script:'વૈષ્ણવ જન તો તેને રે કહીએ\nજે પીડ પરાઈ જાણે રે',
      roman:'vaishnav jan to tene re kahiye\nje peed parai jaane re',
      en:'Call this one a person of God:\nthe one who knows what somebody else’s pain feels like.',
      lang:'Gujarati', region:'Gujarat', kind:'bhajan', age:'9-12',
      faith:'Hindu — Gujarati bhakti',
      kid:'A five-hundred-year-old song that answers one question: what makes somebody actually good? The answer in the very first line is that they can feel other people’s trouble.',
      note:'Sung in Gujarati homes and, for a century, at gatherings far outside Gujarat. The tune is slow and low and children usually learn it by humming underneath the adults.',
      words:[
        { term:'વૈષ્ણવ', roman:'vaishnav', en:'a devotee of Vishnu — here, simply “a person of God”' },
        { term:'જન',    roman:'jan',      en:'person' },
        { term:'પીડ',   roman:'peed',     en:'pain' },
        { term:'પરાઈ',  roman:'parai',    en:'belonging to another' },
        { term:'જાણે',  roman:'jaane',    en:'knows, understands' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/vaishnav-jan-to',
      source:'Narsinh Mehta (15th century), Gujarati. Long in the public domain. Opening couplet only; the pad continues for several verses and must be set from a printed edition.'
    },
    {
      id:'sundar-te-dhyan', title:'Sundar te dhyan',
      script:'सुंदर ते ध्यान उभे विटेवरी\nकर कटावरी ठेवुनियां',
      roman:'sundar te dhyan ubhe vitevari\nkar katavari thevuniya',
      en:'That lovely figure, standing on a brick,\nboth hands resting on his hips.',
      lang:'Marathi', region:'Maharashtra', kind:'bhajan', age:'9-12',
      faith:'Hindu — the Varkari tradition of Maharashtra',
      kid:'A poet describes exactly what he can see: a figure standing on a brick with his hands on his hips. That is the whole first verse, and it is why people have kept it for four hundred years.',
      note:'Sung on the walk to Pandharpur, in a moving crowd, with cymbals. Marathi families abroad still sing abhangs at home and most children meet this one first.',
      words:[
        { term:'सुंदर',  roman:'sundar',  en:'beautiful' },
        { term:'ध्यान',  roman:'dhyan',   en:'the form you hold in your mind' },
        { term:'वीट',   roman:'vit',     en:'brick' },
        { term:'कर',    roman:'kar',     en:'hand' },
        { term:'अभंग',  roman:'abhang',  en:'the Marathi devotional song form — literally “unbroken”' }
      ],
      sing:'call-response', badge:'aaj', audio:'geet/sundar-te-dhyan',
      source:'Tukaram (17th century), abhang, Marathi. Long in the public domain. Opening couplet only.'
    },
    {
      id:'jagadoddharana', title:'Jagadoddharana',
      script:'ಜಗದೋದ್ಧಾರನ ಆಡಿಸಿದಳೆ ಯಶೋದೆ\nಜಗದೋದ್ಧಾರನ ಮಗನೆಂದು ತಿಳಿಯುತ',
      roman:'jagadoddharana aadisidale yashode\njagadoddharana maganendu tiliyuta',
      en:'Yashoda rocked the one who holds up the world —\nrocked him thinking he was just her son.',
      lang:'Kannada', region:'Karnataka', kind:'bhajan', age:'9-12',
      faith:'Hindu — the Haridasa tradition of Karnataka',
      kid:'A mother rocks her baby to sleep. The song points out, gently, that the baby happens to be holding up the entire world, and she has no idea.',
      note:'Sung as a lullaby as often as it is sung as a bhajan. In Kannada homes it does both jobs at once and nobody minds.',
      words:[
        { term:'ಜಗ',    roman:'jaga',     en:'the world' },
        { term:'ಮಗ',    roman:'maga',     en:'son' },
        { term:'ಯಶೋದೆ', roman:'Yashoda',  en:'the woman who raised Krishna' },
        { term:'ತಿಳಿ',  roman:'tili',     en:'to know, to understand' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/jagadoddharana',
      source:'Purandara Dasa (c. 1484–1564), Kannada. Long in the public domain. Opening couplet only; the kirtan continues and must be set from a printed edition.'
    },
    {
      id:'jo-achyutananda', title:'Jo Achyutananda',
      script:'జో అచ్యుతానంద జోజో ముకుందా\nరావె పరమానంద రామ గోవిందా',
      roman:'jo achyutananda jojo mukunda\nraave paramananda rama govinda',
      en:'Hush now, Achyuta, hush — sleep, Mukunda.\nCome along, joy itself; Rama, Govinda.',
      lang:'Telugu', region:'Andhra Pradesh & Telangana', kind:'lori', age:'6-9',
      faith:'Hindu — the Annamacharya tradition',
      kid:'A lullaby sung to a god who is, in the song, a baby being put to bed. The “jo jo” is the Telugu equivalent of “hush”.',
      note:'Sung over actual sleeping Telugu babies for five hundred years. The words are devotional and the job it does is bedtime, and both things are true at once.',
      words:[
        { term:'జో',       roman:'jo',        en:'hush — the sound of a Telugu lullaby' },
        { term:'రావె',     roman:'raave',     en:'come' },
        { term:'ఆనంద',    roman:'ananda',    en:'joy, bliss' },
        { term:'కీర్తన',   roman:'keertana',  en:'the Telugu devotional song form' }
      ],
      sing:'solo', badge:'aaj', audio:'geet/jo-achyutananda',
      source:'Annamacharya (1408–1503), Telugu keertana. Long in the public domain. Opening couplet only.'
    },
    {
      id:'mool-mantar', title:'The Mool Mantar',
      script:'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
      roman:'ik oankaar sat naam kartaa purakh nirbhau nirvair akaal moorat ajoonee saibhan gur prasaad',
      en:'One being. Truth is its name. It makes everything. Without fear, without hatred. Outside time. Never born. Existing by itself. Known by the Guru’s grace.',
      lang:'Gurmukhi', region:'Punjab', kind:'bhajan', age:'9-12',
      faith:'Sikh',
      kid:'The very first line of the Guru Granth Sahib, and the first thing a Sikh child learns to say. It is a description of one being, made of ten short pieces.',
      note:'Sikh children learn this before they can read it, the way children everywhere learn the first thing their family says out loud. It opens the Japji Sahib, recited in the morning.',
      words:[
        { term:'ੴ',      roman:'ik oankaar', en:'one being — written as a single character' },
        { term:'ਸਤਿ',    roman:'sat',        en:'true, truth' },
        { term:'ਨਿਰਭਉ',  roman:'nirbhau',    en:'without fear' },
        { term:'ਨਿਰਵੈਰੁ', roman:'nirvair',    en:'without hatred toward anyone' },
        { term:'ਅਕਾਲ',   roman:'akaal',      en:'beyond time, deathless' }
      ],
      sing:'solo', needs_review:true, badge:'aaj', audio:'geet/mool-mantar',
      source:'Guru Granth Sahib, Ang 1 — the opening of Japji Sahib. Text and citation both certain.',
      handling:'Gurbani is not background music and must never be treated as a sing-along track, looped, remixed, shortened, or played under artwork or animation. No Sikh Guru is depicted anywhere in this product — not in art, not in an avatar, not in a silhouette, not "tastefully". The English above is a plain-sense rendering for a child, is labelled as such on the card, and is never to be presented as a translation of record. A Sikh reviewer must clear the presentation, the audio and the artwork before this ships. If no reviewer is available, this entry does not ship.'
    },
    {
      id:'buddham-saranam', title:'Buddham saranam gacchami',
      script:'बुद्धं सरणं गच्छामि\nधम्मं सरणं गच्छामि\nसंघं सरणं गच्छामि',
      roman:'buddhaṃ saraṇaṃ gacchāmi\ndhammaṃ saraṇaṃ gacchāmi\nsaṅghaṃ saraṇaṃ gacchāmi',
      en:'I go to the Buddha for shelter.\nI go to the teaching for shelter.\nI go to the community for shelter.',
      lang:'Pali', region:'Across India, and across Asia', kind:'bhajan', age:'6-9',
      faith:'Buddhist',
      kid:'Three lines, each one naming somewhere to take shelter. Buddhist children say them at the start of almost everything.',
      note:'Said in Sri Lanka, Thailand, Myanmar, Ladakh, Sikkim, Maharashtra and Bihar, in the same Pali, by people who share no other language. A child who learns the three lines can join in anywhere.',
      words:[
        { term:'बुद्ध',   roman:'buddha',  en:'the one who woke up' },
        { term:'धम्म',   roman:'dhamma',  en:'the teaching, the way things are' },
        { term:'संघ',    roman:'sangha',  en:'the community that keeps it going' },
        { term:'सरण',    roman:'sarana',  en:'shelter, refuge' }
      ],
      sing:'call-response', badge:'aaj', audio:'geet/buddham-saranam',
      source:'The Three Refuges, Pali. Traditional and far older than any copyright. Note the Pali form is saraṇaṃ, not the Sanskrit śaraṇaṃ — the Devanagari above follows Pali, and Pali is printed in six different scripts with none of them being the original, so the card must not imply Devanagari is the proper one.'
    },
    {
      id:'namokar-mantra', title:'The Namokar Mantra',
      script:'णमो अरिहंताणं\nणमो सिद्धाणं\nणमो आयरियाणं\nणमो उवज्झायाणं\nणमो लोए सव्वसाहूणं',
      roman:'ṇamo arihantāṇaṃ\nṇamo siddhāṇaṃ\nṇamo āyariyāṇaṃ\nṇamo uvajjhāyāṇaṃ\nṇamo loe savvasāhūṇaṃ',
      en:'I bow to those who have conquered themselves.\nI bow to those who are free.\nI bow to the teachers.\nI bow to those who study.\nI bow to everyone anywhere who is trying to live rightly.',
      lang:'Prakrit', region:'Across India', kind:'bhajan', age:'6-9',
      faith:'Jain',
      kid:'Five lines of bowing, and the last one is the striking part: it bows to good people everywhere, without naming a single one.',
      note:'The first thing a Jain child learns and the last thing many Jain adults say at night. It names no god and no person — only qualities — and that is deliberate.',
      words:[
        { term:'णमो',     roman:'namo',      en:'I bow' },
        { term:'अरिहंत',  roman:'arihant',   en:'one who has conquered their own enemies within' },
        { term:'सिद्ध',    roman:'siddha',    en:'one who is free' },
        { term:'आयरिय',   roman:'ayariya',   en:'teacher' },
        { term:'लोए',     roman:'loe',       en:'in the world' }
      ],
      sing:'call-response', badge:'aaj', audio:'geet/namokar-mantra',
      source:'The Namokar (Navkar) Mantra, Prakrit. Traditional, and among the oldest continuously recited texts in India. The five lines above are the mantra proper; a further passage (the chulika) usually follows and is not given here — the card must say the recitation continues.'
    }

  ],

  /* ==================================================================================================
     SINGALONG — the copy for the mode.
     Rules it lives under: no progress bar, no percentage, no streak, no "completed", no score, no
     "you got 3 of 4 words". Again is a first-class button and re-listening is love (docs/10 §3.5).
     ================================================================================================== */

  singalong: {

    /* How a song is offered. The verb is "sing me one" — the grandparent verb, not the app verb. */
    offer: {
      title: 'Sing me one',
      sub: 'Pick one, or let us pick — the way somebody at home would.',
      pick_for_me: 'You choose',
      shelves: [
        { id:'sleep',   label:'One for going to sleep' },
        { id:'rain',    label:'One for the rain' },
        { id:'hands',   label:'One with your hands in it' },
        { id:'mother',  label:'One your mother probably knows' },
        { id:'nobody',  label:'One in a language nobody at school speaks' },
        { id:'today',   label:'One for today' }
      ],
      shelves_note: 'The shelves are moods and occasions, not levels. Nothing here unlocks anything.'
    },

    /* How a song is played. Three ways in, all optional, none of them a test. */
    modes: [
      { id:'listen',  label:'Just listen',       sub:'Words on screen if you want them. Nobody has to do anything.' },
      { id:'along',   label:'Sing along',        sub:'The line you are on lights up. It waits for you; you never have to keep up.' },
      { id:'slow',    label:'Slowly',            sub:'Same voice, half the speed, for when the words are new.' },
      { id:'hands',   label:'Show me the hands', sub:'For the ones that need a partner, a knee or a ring of children.' }
    ],

    /* The Again affordance. This is the whole design position, in a button. */
    again: {
      label: 'Again',
      sub: 'The same one? Good.',
      lines: [
        'Again is the point. Nobody has ever sung a lullaby once.',
        'A child who asks for the same song eight nights running is not stuck on it. That is what loving a song looks like from the outside.',
        'We do not count how many times you have played anything, and we are never going to. We just play it again.'
      ],
      never: 'No counter, no "you have heard this 12 times", no suggestion to try a different one.'
    },

    /* The invitation to disagree with us. CLAUDE.md rule 5 — internal diversity is the point. */
    variants: {
      prompt: 'Sung differently at your house?',
      body: 'Very likely. These songs travelled by ear for a few hundred years, and they picked ' +
            'things up on the way. If your version has different words, different food in the ' +
            'last line, or a whole verse we have never heard — yours is not the wrong one. ' +
            'Say it out loud to your child and tell them it is your family’s.',
      cta: 'Tell us yours'
    },

    /* Six lines for the parent. Not instructions — permission. */
    parent: {
      title: 'For the grown-up holding the tablet',
      lines: [
        'You will not remember all of it. Almost nobody does — most adults have a first line, a tune, and a hole in the middle where the second verse used to be.',
        'Sing the part you have got. A half-remembered rhyme in your voice beats a perfect one in ours, every single time, and it is not close.',
        'Your accent is the right accent. If your grandmother sang it differently from the words on this screen, she wins and the screen is wrong.',
        'This is not a test. Not of your child, and — this is the one that matters — not of you. There is no score anywhere in here and there never will be.',
        'You do not have to explain what the words mean. Meaning arrives years later, on its own, the way it did for you.',
        'And if you get to the end of one and find that you are the one who has gone quiet, that is normal, it happens to almost everyone, and it is the reason this exists.'
      ]
    },

    /* Copy for the words panel. Learning words from a song is a side-effect, never the errand. */
    words_panel: {
      title: 'Words from this one',
      sub: 'Three or four worth keeping. No quiz — they will stick because the tune carries them.',
      no_test: 'Nothing here is marked, checked or remembered against your child.'
    },

    /* What the app says when a song has no text yet. Honesty as a feature, not an apology. */
    pending: {
      title: 'We have not got the words right yet',
      body: 'We know this song and we do not know it well enough to print it. Rather than put ' +
            'up a version that is nearly right, we have left it blank — because if it were ' +
            'nearly right, you would spot it in about a second, and you would be correct to ' +
            'trust us less afterwards.',
      cta: 'Know this one? Sing it to us.',
      rights_variant: 'This one may belong to somebody. Until we are sure it is free to pass ' +
                      'on, we are not passing it on.'
    }
  },

  /* ---------------------------------------------------------------- REVIEW GATE
     Nothing in this file is cleared to ship. Two separate sign-offs are needed and they are
     not interchangeable:

     1. RIGHTS. Every entry carrying text needs a rights review confirming it is traditional,
        folk or public domain. The four flagged doubt:'rights' entries are already known to be
        film or named-author material and must be either licensed or dropped — they are in the
        file as warning labels, not as a shipping queue. `chanda-mama-door-ke` is the one worth
        actually clearing: the folk quatrain probably is free, and it is the single most
        recognisable item in the whole Hindi set.

     2. LANGUAGE. Every entry carrying text needs a native reader against a printed source,
        exactly as docs/10 §3 requires for Shlok. Devanagari, Bengali, Tamil, Telugu, Kannada,
        Malayalam, Gujarati and Gurmukhi are eight scripts and eight separate readers. Nothing
        in this file has had one.

     3. Then, and only then, HUMAN VOICE RECORDINGS. No TTS, ever, per docs/09 — a synthesiser
        cannot sing a thalattu, and a child imitates what they hear. Ideally these are recorded
        by grandparents rather than by session singers, which also feeds the Nani-Nana pipeline
        in docs/11 §4.2.

     4. Odia and Assamese are empty on purpose and are a collection brief, not a bug. So are
        the twenty-odd doubt:'text' entries in the other languages. Whoever collects should
        record a person singing rather than transcribe from the internet, because the internet
        is where the half-remembered versions live. */
  review: {
    status: 'draft',
    reviewed_by: [],
    reviewed_on: null,
    blocking: [
      'rights-review-all-texted-entries',
      'hindi-reader', 'marathi-reader', 'bengali-reader', 'tamil-reader', 'telugu-reader',
      'kannada-reader', 'malayalam-reader', 'gujarati-reader', 'punjabi-reader',
      'sikh-reviewer', 'jain-reviewer', 'buddhist-reviewer', 'practitioner-scholar-hindu',
      'historian-for-khoka-ghumalo', 'historian-for-sunder-mundriye',
      'odia-collector', 'assamese-collector',
      'human-voice-recording'
    ]
  }
};
