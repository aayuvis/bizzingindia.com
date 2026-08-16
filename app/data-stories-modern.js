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
      text: 'This is a true story — itihaas, what the record books show. Around a hundred years ago, a young soldier named Dhyan Chand played hockey for the Indian army. He had joined at sixteen, in Jhansi, and after his duties were done he would practise alone, in the moonlight, because the parade ground had no lights and he could not bear to stop.' },
    { art: ['dhyanchand'], who: null, mood: 'wow',
      text: 'When India went to the Olympic Games — Amsterdam in 1928, Los Angeles in 1932, Berlin in 1936 — the world found out what all that moonlight had built. India won the gold medal every single time. Three Olympics, three golds. In one match in 1932, India beat the home team of the United States by twenty-four goals to one. That scoreline sat in the record books for generations.' },
    { art: ['dhyanchand'], who: null,
      text: 'At the centre of it all was Dhyan Chand, gliding through defenders as if they were standing still, the ball stitched to his stick. He scored goals the way other people say hello — by the hundreds, across his career.' },
    { art: ['dhyanchand'], who: null, mood: 'think',
      text: 'And here is where the record ends and the stories begin — and an itihaas story tells you honestly which is which. People could not believe what they were seeing, so tales grew. In Holland, it is said, officials examined his stick to see if there was a magnet or glue hidden inside it. Nobody can show you a document proving that happened. But the fact that people found it easier to believe in a magic stick than in one man being that good — that tells you something true all by itself.' },
    { art: ['dhyanchand'], who: null, mood: 'wow',
      text: 'In Berlin in 1936, in the final against Germany with the stands packed against them, India won eight goals to one. That one is no legend — it is in the books. It was the third gold, and it made Dhyan Chand something rare: an athlete other countries told stories about.' },
    { art: ['dhyanchand'], who: 'mithu',
      text: 'India celebrates National Sports Day every year on the twenty-ninth of August — Dhyan Chand’s birthday. The magic, of course, was never in the stick. It was in a boy practising alone by moonlight, long after everyone else had gone to bed.' }
  ],
  moral: 'When someone is astonishingly good, look past the magic story. Underneath it there is almost always an empty field, late at night, and one person still practising.',
  source: 'Olympic records (hockey golds 1928, 1932, 1936; the 24–1 and 8–1 scorelines); Dhyan Chand’s autobiography "Goal!" (1952) for the Jhansi and night-practice years. The stick-checking tale is folklore and is labelled as such. National Sports Day falls on his birthday, 29 August.'
},

{
  id: 'kh.milkha',
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
      text: 'Milkha Singh’s running began with nothing. His childhood was broken by the terrible days of 1947, when the land was divided and his family lost almost everything — that part of his story is hard, and it is kept for when you are older, told by a grown-up who loves you. What you need to know here is that a boy who had lost his home found his way, alone, to the Indian army.' },
    { art: ['milkha'], who: null,
      text: 'In the army they held a cross-country race for the new recruits. Milkha came sixth out of hundreds — and the top runners got extra milk with their meals. He had been hungry for a long time. He started training the way other people breathe: constantly, furiously, until he was not just the fastest man in his unit but the fastest in the country.' },
    { art: ['milkha'], who: null, mood: 'wow',
      text: 'In 1958, at the Commonwealth Games in Cardiff, he won gold in the 440 yards — independent India’s first athletics gold at those Games. And in 1960, at a race in Lahore, he ran so beautifully that the country he ran against gave him the name he carried forever after. He loved telling this: his most famous name, the Flying Sikh, was a gift from across the border.' },
    { art: ['milkha'], who: null, mood: 'think',
      text: 'Then came Rome. The Olympic 400 metres final, 1960. Milkha went off like a storm and for half the race he was among the leaders of the fastest field ever assembled. And then, somewhere down the back straight, he eased off — a moment of doubt, a glance at the others. He said himself, ever afterwards, that it was the one mistake of his life.',
      ask: {
        q: 'He crossed the line fourth. Fourth at the Olympics — and no medal. What do you think that is worth?',
        options: ['Nothing — only medals count', 'More than most medals — he ran with the best on Earth and missed bronze by a tenth of a second', 'It is worth exactly fourth place'],
        answer: 1,
        right: 'That is how India came to see it too. His Rome time stood as the national record for almost forty years. Nobody remembers who came sixth in most finals. Everybody remembers Milkha.',
        wrong: 'India decided otherwise, and so did the clock: his Rome time stood as the national record for almost forty years. Some fourth places outlast gold medals.'
      } },
    { art: ['milkha'], who: null,
      text: 'Four runners came home within half a second of each other. The bronze escaped him by about one tenth of a second — the length of a heartbeat. He walked off the track in Rome carrying a loss he would talk about for the rest of his life, openly, without hiding it. That is its own kind of strength.' },
    { art: ['milkha'], who: 'mithu',
      text: 'A boy who lost everything, who ran his first race for a glass of milk, stood in an Olympic final with the fastest men alive — and told the truth about the day it went wrong for sixty years afterwards. That is why the race he lost is the race everybody tells.' }
  ],
  moral: 'Losing honestly, at the very top, in front of everyone — and owning it forever — can make you more loved than winning ever could.',
  source: 'Milkha Singh’s autobiography "The Race of My Life" (with Sonia Sanwalka) for the army race, the Lahore naming and his own account of the Rome error; Olympic and Commonwealth Games records for Cardiff 1958 and the Rome 1960 final. needs_review: his childhood touches Partition, kept here to one oblique sentence per docs/05 — a named human reviewer must sign off before publish.'
},

{
  id: 'kh.kapil83',
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
      text: 'In the summer of 1983, India went to England for the cricket World Cup, and almost nobody noticed. India had won one single match in the two World Cups before. The bookmakers offered sixty-six to one against them. The mighty West Indies had won both cups ever played, and everyone knew they would win this one too.' },
    { art: ['kapil'], who: null,
      text: 'India’s captain was Kapil Dev, twenty-four years old, from a family that had settled in the north after hard journeys of its own — a fast bowler who hit the ball like a thunderclap and refused, completely, to believe the odds. The team called him the Haryana Hurricane.' },
    { art: ['kapil'], who: null, mood: 'wow',
      text: 'Against Zimbabwe, India collapsed to seventeen runs for five wickets — a disaster. Kapil walked in and played one of the greatest innings ever: 175 not out, sixteen fours, six sixes. And here is the strange, wonderful footnote the record keeps: the television cameras were on strike that day. Not one ball of it was filmed. The innings that saved the World Cup exists only in the scorebook and in the memories of the people on that small ground.' },
    { art: ['kapil'], who: null, mood: 'think',
      text: 'The final, at Lord’s, June the twenty-fifth. India batted first and were bowled out for 183 — a small total, far too small, everyone agreed. The West Indies began their chase, and the most feared batsman on Earth, Viv Richards, started hitting boundaries as if the game bored him.',
      ask: {
        q: 'Your team has too few runs. The best batsman in the world is destroying the bowling. What is the one thing that can change everything?',
        options: ['Wait and hope he gets tired', 'One catch — get the great man out, and doubt walks in', 'Ask to start the game again'],
        answer: 1,
        right: 'Exactly what happened next. Richards skied one high over the infield — and Kapil ran twenty yards backwards, eyes up the whole way, and held it.',
        wrong: 'Cricket gave its own answer that afternoon. Richards skied a pull high over the infield — and Kapil ran twenty yards backwards, eyes up the whole way, and held the catch.'
      } },
    { art: ['kapil'], who: null, mood: 'wow',
      text: 'After that catch, the invincible West Indies crumbled — all out for 140. India had won the World Cup by forty-three runs, and Kapil lifted the golden trophy on the Lord’s balcony while a crowd of disbelieving, delighted Indians roared below.' },
    { art: ['kapil'], who: 'mithu',
      text: 'Before that evening, cricket was one of the games India played. After it, cricket became the game a billion people believed they could win. Every Indian cricket story since — every one — begins on that balcony.' }
  ],
  moral: 'Sixty-six to one is somebody else’s opinion of you. It is not a fact about you until you agree to it.',
  source: 'Wisden and ICC match records for the 1983 World Cup — the 66–1 odds, the 175* at Tunbridge Wells (unfilmed, BBC strike), and the Lord’s final scorecard (India 183, West Indies 140, Richards c Kapil Dev b Madan Lal).'
},

{
  id: 'kh.sachin',
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
      text: 'In a colony in Bandra, Bombay, in the 1980s, a small boy with curly hair practised batting against a cricket ball hung inside a sock from a rope — because a ball in a sock swings back at you, again and again, and never needs a bowler. His name was Sachin Tendulkar, and he could do this for hours. His family sometimes wondered if he would ever stop.' },
    { art: ['sachin'], who: null, mood: 'think',
      text: 'His coach, Ramakant Achrekar, had a famous trick. At the end of practice he would balance a one-rupee coin on the stumps. Any bowler who got Sachin out won the coin. If nobody could, Sachin kept it. He kept thirteen of those coins all his life, and said they were among his most precious prizes.',
      ask: {
        q: 'Why would a coach pay a boy in one-rupee coins instead of just saying well done?',
        options: ['Because coins are cheaper than trophies', 'Because now every single ball mattered — a whole team was trying to take something of his', 'Because the coach had spare coins'],
        answer: 1,
        right: 'That is the trick exactly. The coin turned practice into a battle. Sachin learned to treat the last ball of a tired evening like the first ball of a final.',
        wrong: 'Look at what the coin did: it turned practice into a battle. Every bowler wanted it, so every ball mattered, and Sachin learned to treat the last ball of a tired evening like the first ball of a final.'
      } },
    { art: ['sachin'], who: null,
      text: 'At sixteen — sixteen! — he played for India against the fierce fast bowlers of Pakistan, took a blow, bled, and refused to leave the field. India watched a boy in a man’s game refuse to be a boy about it, and something began that day that did not stop for twenty-four years.' },
    { art: ['sachin'], who: null, mood: 'wow',
      text: 'The numbers he left behind read like misprints. One hundred international centuries — no one else has reached that. More than thirty-four thousand international runs. Two hundred Test matches. Through the 1990s, when Indian cricket had hard days, a whole country planned its mood around whether Sachin was still batting.' },
    { art: ['sachin'], who: null, mood: 'wow',
      text: 'The one prize that kept escaping was the World Cup — until 2011, his sixth try, when India finally won it at home, in his own Bombay. His young teammates lifted him onto their shoulders and carried him around the ground. One of them, Virat Kohli, said that night that Sachin had carried the burden of the nation for twenty-one years, so it was time to carry him. India has been repeating that sentence ever since.' },
    { art: ['sachin'], who: 'mithu',
      text: 'A ball, a sock, a rope, and a boy who did not want to stop. Everything else — all hundred centuries of it — grew out of that.' }
  ],
  moral: 'Greatness rarely looks like a lightning bolt. Mostly it looks like the same small practice, chosen again every single day, for years.',
  source: 'Sachin Tendulkar’s autobiography "Playing It My Way" for the sock-ball and the Achrekar coin sessions (he kept 13 coins); ICC records for the 100 international centuries, 200 Tests and the 1989 debut at sixteen; the 2011 World Cup lap and Kohli’s much-quoted remark were reported worldwide that night and are given here indirectly.'
},

{
  id: 'kh.anand',
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
      text: 'Chess was born in India — its ancestor, chaturanga, was played here some fourteen centuries ago before travelling the whole world and coming home changed. But by the 1980s, the world’s great chess powers were far away, and India did not have one single grandmaster. In Madras — the city now called Chennai — a boy named Viswanathan Anand was learning the moves from his mother, at six.' },
    { art: ['anand'], who: null, mood: 'wow',
      text: 'At the chess club they gave him a nickname: the Lightning Kid. He played at a speed that unsettled grown masters — glance, move, done — not out of carelessness but because he simply saw it faster. In 1987 he became world junior champion, and in 1988, at eighteen, he became the first grandmaster in the history of India.' },
    { art: ['anand'], who: null, mood: 'think',
      text: 'Being first is a strange job. There was no Indian who had walked this road ahead of him, no map, and the strongest players and schools were continents away. Every tournament meant travelling alone to the other side of the world to play people raised in the game’s great capitals. He kept going anyway, year after year, match after match.' },
    { art: ['anand'], who: null, mood: 'wow',
      text: 'And he climbed all the way. World champion in 2000. Then, in the toughest form of the game, champion again in 2007 — and he defended the title in matches in 2008, 2010 and 2012, against the best players alive, each match weeks long, each one a siege. Five world titles, held across more than a decade.' },
    { art: ['anand'], who: null,
      text: 'But the real ending of this story is not a trophy. When Anand became India’s first grandmaster, he was the only one. Today India has more than eighty, many of them from Chennai, many of them children who started because a calm, fast, smiling man from their own city had shown it could be done. One of them, years later, would take the world title himself at eighteen — but that is the last story on this shelf.' },
    { art: ['anand'], who: 'mithu',
      text: 'The game left India as chaturanga, conquered the world, and waited. Then one boy from Madras went and brought the crown home.' }
  ],
  moral: 'The first person through a door does two jobs at once: their own, and holding the door for everyone who follows.',
  source: 'FIDE records: world junior title 1987, India’s first grandmaster 1988, world championship titles 2000, 2007, 2008, 2010, 2012; Anand’s memoir "Mind Master" for the Madras beginnings and the Lightning Kid years; India’s grandmaster count (80+) from FIDE’s title lists. Chaturanga’s Indian origin is standard chess history.'
},

{
  id: 'kh.marykom',
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
      text: 'Kangathei is a small village in Manipur, in the beautiful hill country of India’s northeast, and Mary Kom grew up there helping her parents in the rice fields. In 1998, a boxer from Manipur named Dingko Singh won gold at the Asian Games, and the whole state lit up. Watching that, a teenage girl from the fields decided, privately, that boxing was hers.' },
    { art: ['marykom'], who: null, mood: 'think',
      text: 'Privately, because girls from her village were not supposed to box, and her father feared it — the injuries, the neighbours, all of it. So she trained without telling him, walking to the gym, learning to move, learning to hit. Then she won a state championship, and her photograph appeared in the newspaper, and that is how her father found out his daughter was a boxer.',
      ask: {
        q: 'Her secret is out, in print, on the breakfast table. What happens in a family at a moment like that?',
        options: ['It ends the boxing, of course', 'A hard conversation — and then, slowly, a family learning to stand behind a daughter’s strange dream', 'Nothing at all'],
        answer: 1,
        right: 'That is close to how she has told it. It was not easy or quick. But her family came to stand behind her, and family is half of every athlete’s story.',
        wrong: 'It very nearly did end there. But hard conversations sometimes go the other way: slowly, her family came to stand behind her, and family is half of every athlete’s story.'
      } },
    { art: ['marykom'], who: null, mood: 'wow',
      text: 'Then the winning started and would not stop. World championship gold in 2002. Again in 2005. Again in 2006. Boxers from every continent, and again and again the small, fast woman from Kangathei with the thunder in her hands.' },
    { art: ['marykom'], who: null,
      text: 'In 2007 she became a mother — of twin boys — and much of the world assumed her boxing was finished, because that is what the world assumed in those days. One year later she came back and won the world championship again. They started calling her Magnificent Mary. She won again in 2010. And in 2018, sixteen years after her first crown, she won her sixth — more world titles than any woman in the history of the sport.' },
    { art: ['marykom'], who: null, mood: 'wow',
      text: 'In 2012, when women’s boxing entered the Olympics at last, she was there in London, the only Indian woman in the draw, and fought her way to a bronze medal for India. A girl who had trained in secret now had a whole country making noise for her.' },
    { art: ['marykom'], who: 'mithu',
      text: 'Six world titles, two sons, one rice-farming village in the hills of Manipur. When somebody tells you where champions come from, remember that they come from everywhere — and that some of them start out in secret.' }
  ],
  moral: 'A comeback is just a dream that refuses to accept the ending other people wrote for it.',
  source: 'World amateur boxing records (world titles 2002, 2005, 2006, 2008, 2010, 2018 — six, the record for women); London 2012 Olympic bronze; her autobiography "Unbreakable" for the secret training, the newspaper photograph, the Dingko Singh inspiration and the return after the twins.'
},

{
  id: 'kh.sindhu',
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
      text: 'P. V. Sindhu was born in Hyderabad into a house full of sport — both her parents played volleyball for India. But in 2001, when she was six, an Indian named Pullela Gopichand won the All England badminton title, one of the sport’s great crowns, and the little girl chose the racquet over the volleyball.' },
    { art: ['sindhu'], who: null, mood: 'think',
      text: 'Gopichand went on to open a training academy — on the far side of the city. From the age of eight, Sindhu was up before dawn, travelling tens of kilometres there and back, morning practice before school, evening practice after. Do the sums sometime: years of mornings, every one of them chosen while the rest of the city slept.',
      ask: {
        q: 'What must it feel like, waking in the dark at eight years old, morning after morning, for a game?',
        options: ['Terrible, every single time', 'Nobody can know but her — but a dream you choose yourself weighs less than one chosen for you', 'Easy, if you are talented'],
        answer: 1,
        right: 'That is the honest answer — her mornings belong to her. What the record shows is that she kept choosing them, for years, and that nobody was forcing her.',
        wrong: 'Only she could tell you — and that is the honest answer. What the record shows is that she kept choosing those mornings, for years, and that nobody was forcing her.'
      } },
    { art: ['sindhu'], who: null, mood: 'wow',
      text: 'At the Rio Olympics in 2016, at twenty-one, she fought her way to the final — the first Indian woman ever to win an Olympic silver. The whole country stayed up to watch. But silver is a strange medal: it glitters, and it whispers about the one match you did not win.' },
    { art: ['sindhu'], who: null, mood: 'wow',
      text: 'She answered in Basel, in 2019. In the final of the world championships she played the match of her life, so fast and so fierce that one of the best players on Earth could barely score against her. World champion — the first from India in badminton, ever. And in Tokyo she won an Olympic medal again, becoming the first Indian woman with two.' },
    { art: ['sindhu'], who: null,
      text: 'Watch her play and you see it: the reach, the leap, the smash that sounds like a door slamming. But everyone who knows her story sees something else behind it — a small girl in a car in the Hyderabad dark, halfway to practice while the birds are still asleep.' },
    { art: ['sindhu'], who: 'mithu',
      text: 'Talent decides how good your best day can be. Mornings decide how often your best day shows up.' }
  ],
  moral: 'Big dreams are mostly built at hours when nobody is watching and nobody is clapping.',
  source: 'BWF and Olympic records: Rio 2016 silver, world championship gold at Basel 2019 (the first for India in badminton), Tokyo bronze — two Olympic medals; her volleyball-international parents and the long childhood commute to the Gopichand academy are documented across her BWF and Olympic profiles.'
},

{
  id: 'kh.neeraj',
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
      text: 'Khandra is a farming village near Panipat, in Haryana — wheat fields, buffaloes, a big joint family in one house. Neeraj Chopra was the cheerful, roundish kid of that family, and when he was about thirteen his uncle marched him to the stadium in town to get some exercise. That is the whole beginning: no prophecy, no talent scout. An uncle, and a boy who needed a run.' },
    { art: ['neeraj'], who: null, mood: 'wow',
      text: 'At the stadium he saw the javelin throwers — and that was that. There is a moment when a spear leaves a thrower’s hand and hangs in the air as if it may never come down, and Neeraj wanted that moment for himself. He turned out to be astonishing at it. At the world junior championships in 2016 he threw 86.48 metres — a world record for his age group. The boy from Khandra held a world record.' },
    { art: ['neeraj'], who: null,
      text: 'Here is the thing about the javelin: India had never won an Olympic gold medal in athletics. Not one, in more than a century of Games — in the sports of running, jumping and throwing that every child on Earth plays, the medal table by India’s name said zero. Whole generations of brilliant Indian athletes had come fourth, or close, and gone home.' },
    { art: ['neeraj'], who: null, mood: 'think',
      text: 'Tokyo, the seventh of August, 2021 — the postponed Olympics, held a year late. Neeraj, twenty-three, walked into the final against the best throwers alive. His first throw went 87.03 metres and led the field. His second went 87.58. Then he had to stand and watch, for the rest of the evening, while eleven of the world’s strongest men took turns trying to pass it.' },
    { art: ['neeraj'], who: null, mood: 'wow',
      text: 'Nobody could. The spear from Khandra had flown further than the whole world. Neeraj Chopra stood on the top step, the anthem played, and a hundred-and-twenty-year wait ended. In the years after, he became world champion too — and one more lovely thing: his warmest rival, a thrower from Pakistan, became one of his good friends, their two families cheering both boys across the border. The record books hold the medals; the photographs hold the friendship.' },
    { art: ['neeraj'], who: 'mithu',
      text: 'An uncle who insisted, a stadium that happened to be near, a spear that happened to be lying there. Keep your eyes open — the thing you are meant to do sometimes just leans against a wall, waiting for you to walk past.' }
  ],
  moral: 'History can wait a hundred years and then change in ninety seconds — thrown by someone who started by accident.',
  source: 'World Athletics and Olympic records: world U20 record 86.48m (2016), Tokyo gold 7 August 2021 at 87.58m — India’s first Olympic athletics gold — and the 2023 world title; the Khandra beginnings and the friendship with Pakistan’s Arshad Nadeem are documented across World Athletics profiles and their own public accounts.'
},

{
  id: 'kh.avani',
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
      text: 'Avani Lekhara grew up in Jaipur, in Rajasthan. When she was eleven, a car accident injured her spine, and from then on she has used a wheelchair. That is a fact of her life, and this story tells it the way she carries it — plainly, and then straight on to the interesting part, which is what she did next.' },
    { art: ['avani'], who: null, mood: 'think',
      text: 'Her father encouraged her to try sport. She tried archery. Then she tried shooting — the ten-metre air rifle — and something clicked. Around then she read the autobiography of Abhinav Bindra, the shooter who in 2008 had won India’s first-ever individual Olympic gold, and she decided precisely what she was aiming at.',
      ask: {
        q: 'Target shooting is won by stillness — the calmest breath, the quietest heartbeat. Who might that sport suit?',
        options: ['Only the biggest and strongest athletes', 'Anyone who can master their own mind — the target does not know or care who is aiming', 'Only grown-ups'],
        answer: 1,
        right: 'Exactly. The target is ten metres of honest air. It cannot see a wheelchair, an age, or a name. It only knows where the shot went.',
        wrong: 'Look at what the sport measures: breath, focus, nerve. The target is ten metres of honest air — it cannot see a wheelchair, an age, or a name. It only knows where the shot went.'
      } },
    { art: ['avani'], who: null, mood: 'wow',
      text: 'Tokyo, 2021, the Paralympic Games. Nineteen years old, in the final of the ten-metre air rifle, against the steadiest hands on the planet. Shot after shot, Avani simply did not miss the middle. She won gold with a Paralympic record score — the first Indian woman ever to win Paralympic gold — and then, days later, won a bronze in a second event for good measure.' },
    { art: ['avani'], who: null, mood: 'wow',
      text: 'Champions are asked one question above all: can you do it again? In Paris, in 2024, with the whole field aiming at her, she came back and won the gold again — beating her own record score. Between the two Games she also quietly got on with studying law. Precision, it seems, is a habit that travels.' },
    { art: ['avani'], who: 'mithu',
      text: 'People sometimes use the word inspiring like a pat on the head. Avani does not need the pat. She is not a nice story — she is the best in the world at one of the hardest things there is, twice over, and the scoreboard says so in numbers.' }
  ],
  moral: 'The target cannot see who is shooting. Find the arena that measures only what you can control, and rule it.',
  source: 'International Paralympic Committee records: Tokyo 2020 gold, 10m air rifle standing SH1 (249.6, Paralympic record — first Paralympic gold by an Indian woman) plus 50m rifle bronze; Paris 2024 gold (249.7). Her accident, the archery-to-shooting path, the Bindra autobiography and the law studies are from her documented IPC and Paralympic-committee profiles.'
},

{
  id: 'kh.gukesh',
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
      text: 'Remember the Lightning Kid, who brought the chess crown home to Chennai? This story is what grew from that one. Gukesh Dommaraju was born in Chennai in 2006 — into a city that was by then mad about chess, full of clubs and coaches and school tournaments, all of it tracing back to Anand. Gukesh learned the moves at seven.' },
    { art: ['gukesh'], who: null,
      text: 'He rose absurdly fast. His father, a doctor, set aside his own work to travel with him from tournament to tournament, the family betting years of ordinary life on a boy’s extraordinary chess. At twelve, Gukesh became a grandmaster — at the time, the second-youngest in the history of the game. The academy that helped train him was run by Anand himself: the first king, coaching the next one.' },
    { art: ['gukesh'], who: null, mood: 'wow',
      text: 'In 2024 he won the tournament of champions that decides who challenges for the world title — at seventeen, the youngest ever to do it. That earned him a match against the reigning world champion, Ding Liren of China: fourteen games, in Singapore, stretched across almost a month.' },
    { art: ['gukesh'], who: null, mood: 'think',
      text: 'The match was brutal and level, all the way to the very last game — which drifted, hour after hour, towards a draw. And then, in a position almost everyone had given up on, the champion made one tired, tiny mistake with his rook. Gukesh, who had refused all afternoon to stop looking for chances, saw it instantly.',
      ask: {
        q: 'Endless patience in a dead-even position, still searching when a draw would be easy — what is that, really?',
        options: ['Stubbornness, and a bit of luck', 'A choice: hope kept deliberately alive until the other person’s hope runs out', 'Just talent'],
        answer: 1,
        right: 'That is the champion’s answer. The mistake only mattered because someone was still there, still looking, still believing the game held one more chance.',
        wrong: 'Luck was offered to both players that day. The mistake only mattered because one of them was still there, still looking, still believing the game held one more chance.'
      } },
    { art: ['gukesh', 'anand'], who: null, mood: 'wow',
      text: 'A few precise moves later, the world champion resigned — and an eighteen-year-old from Chennai had won the world chess championship, the youngest champion in the long history of the classical game, breaking a record that had stood since before his parents met. The cameras caught him with his head in his hands, crying, a boy and a king at the same time.' },
    { art: ['gukesh'], who: 'mithu',
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
      text: 'Mahendra Singh Dhoni grew up in Ranchi — a town of forests and iron country, in what is now Jharkhand, about as far from cricket’s famous cities as an Indian boy could be. He was his school’s football goalkeeper, and it was a games teacher who asked the goalkeeper to try the wicketkeeping gloves instead. The hands, it turned out, worked either way.' },
    { art: ['dhoni'], who: null, mood: 'think',
      text: 'At twenty he got the kind of job families pray for: a post with Indian Railways, checking tickets at Kharagpur station in Bengal. For two years he lived in the railway quarters, worked the platforms, and played cricket whenever the job allowed. A government job is a warm coat — his family knew what it was worth. And every day, trains full of other people’s journeys pulled out in front of him.',
      ask: {
        q: 'A safe job for life on one hand. On the other, a game that has promised you nothing at all. What do you do?',
        options: ['Keep the job — a promise beats a maybe', 'Leave — some maybes have to be answered before they expire', 'Wait for someone to decide for you'],
        answer: 1,
        right: 'That is what he did, in 2003: he left the platform for the game. Not recklessly — he had given cricket a deadline, and cricket had shown just enough. But the leaving was still a leap.',
        wrong: 'A fair answer — it is what almost everyone chooses, and there is no shame in a warm coat. But in 2003 Dhoni left the platform for the game, and the rest of this story is what came through the door he risked.'
      } },
    { art: ['dhoni'], who: null, mood: 'wow',
      text: 'Within two years the long-haired wicketkeeper from Ranchi was smashing 148 against Pakistan for India. And in 2007, handed the captaincy of a young squad for the very first Twenty20 World Cup, he did something coaches still teach: with the final match hanging on its last over, he gave the ball not to a star but to a bowler almost nobody had heard of — and the gamble, calmly made, won India the cup.' },
    { art: ['dhoni'], who: null, mood: 'wow',
      text: 'Then Mumbai, the night of 2 April 2011 — the World Cup final, India chasing 275 against Sri Lanka, a billion people holding their breath. Dhoni, out of form all tournament, promoted himself up the batting order — the captain taking the hardest job in the house for himself. He finished on 91 not out, and ended the match with a six lifted high over long-on. That shot has been replayed more than any stroke in Indian cricket. It ended a twenty-eight-year wait — the cup Kapil’s team had won in 1983, home at last, in Sachin’s own city.' },
    { art: ['dhoni'], who: null,
      text: 'The newspapers called him Captain Cool, and the name stuck because it named something real: in the loudest moments cricket can produce, he moved and thought like a man reading a timetable. In 2013 his team added the Champions Trophy — making him the only captain ever to win all three of cricket’s world titles. Calm, it turns out, is not something you have. It is something you practise.' },
    { art: ['dhoni'], who: 'mithu',
      text: 'From a ticket window at Kharagpur to the balcony at Wankhede is not a distance trains can cover. He crossed it the slow way — by being ready, every single day, for the day the game finally asked.' }
  ],
  moral: 'The loudest moments belong to the people who have practised staying quiet inside them.',
  source: 'BCCI and ICC match records — the 2007 World Twenty20 final and the 2011 World Cup final at Mumbai (India 277/4 chasing 275; Dhoni 91 not out, the winning six), and the 2013 Champions Trophy that completed the set of ICC titles; his 2001–03 years as a travelling ticket examiner at Kharagpur railway station are on Indian Railways’ own record and in contemporary reporting.'
},

{
  id: 'kh.kohli',
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
      text: 'In the summer of 1998, a nine-year-old from West Delhi joined a brand-new cricket academy in his neighbourhood, and his father began a routine that lasted years: driving the boy to practice and back on his scooter, day after day, through Delhi’s traffic and Delhi’s weather. Virat Kohli’s cricket was, from the very start, a thing he and his father did together.' },
    { art: ['kohli'], who: null, mood: 'sad',
      text: 'December 2006. Virat, eighteen, was playing for Delhi in a big match, not out overnight with his team in trouble. In the small hours of that night, at home, his father died suddenly. What happened next is told quietly in Delhi dressing rooms to this day: at dawn the boy telephoned his coach and said he wanted to bat. He came to the ground, batted through the morning for his team, made 90 — and went from the field to say goodbye to his father. Nobody who was there has ever described that innings as just runs.' },
    { art: ['kohli'], who: null,
      text: 'Cricket had been the language between him and his father, and he kept speaking it. In 2008 he captained India’s under-19s to a World Cup. In 2011, at twenty-two, he was in the team that won the World Cup itself — he is the young man in Sachin’s story on this shelf, one of the teammates who carried the great man around the ground on their shoulders that night.' },
    { art: ['kohli'], who: null, mood: 'think',
      text: 'Then came the part of the story that changed Indian cricket’s daily habits. In 2012, by his own telling, he took an honest look at himself and decided his talent deserved a better keeper. He rebuilt everything — what he ate, how he trained, how he slept — until he was among the fittest athletes in world sport, and the fitness became runs: chase after impossible chase hunted down, so often that people simply started calling him the chase master. And where the captain’s standards went, a whole team’s followed. Indian cricket trains differently today because one player raised the bar on himself first.' },
    { art: ['kohli'], who: null, mood: 'wow',
      text: 'The hundreds kept coming. In November 2023, in Mumbai, he scored his fiftieth one-day international century — passing the record of Sachin Tendulkar, the man he had helped carry, who stood applauding in the stands of his own home ground. The record books hold the number. The photographs hold the passing of something from one pair of hands to another.' },
    { art: ['kohli'], who: 'mithu',
      text: 'A scooter, a father, a terrible morning, and a promise kept for twenty years and counting. When people talk about his fire on the field, remember where it was lit — and that the hardest innings of his life was played for love, not for a scoreboard.' }
  ],
  moral: 'Grief and love sometimes ask the same thing of us: keep faith with what the person who is gone helped you build.',
  source: 'BCCI Ranji Trophy records for the Delhi–Karnataka match of December 2006 (Kohli, resuming the morning after his father’s death, scored 90 — an episode his Delhi coach and senior teammates have recounted on the record many times); ICC records for the 2008 under-19 World Cup, the 2011 World Cup, and the fiftieth ODI century at Mumbai, November 2023; the fitness transformation of 2012 onwards is his own public telling. He is a living, playing athlete — the story keeps strictly to the documented record.'
},

{
  id: 'kh.mithali',
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
      text: 'Mithali Raj grew up in Hyderabad, in an Air Force family, and for eight years her mornings belonged to bharatanatyam — the anklets, the postures held until they burned, the discipline of classical dance. Cricket arrived sideways: she was taken along to her elder brother’s coaching camp, picked up a bat while she waited, and the coaches stopped watching the boys.' },
    { art: ['mithali'], who: null, mood: 'think',
      text: 'By her early teens, both dance and cricket wanted every morning she had, and she has told the story of the choice many times: it could not be both.',
      ask: {
        q: 'Eight years of dance in your feet, a new game in your hands, and one pair of mornings. How do you even choose?',
        options: ['Keep the older love — eight years must not be wasted', 'Choose one — and trust that nothing truly practised is ever wasted', 'Do both badly'],
        answer: 1,
        right: 'She chose cricket — and always said the dance never really left her: the balance, the footwork, the stillness before movement all walked to the crease with her.',
        wrong: 'She chose the game — and here is the lovely part: the dance never really left her. The balance, the footwork, the stillness before movement all walked to the crease with her. Eight years of practice simply changed costumes.'
      } },
    { art: ['mithali'], who: null, mood: 'wow',
      text: 'At sixteen, in 1999, she played her first match for India and scored a century — 114 not out. At nineteen she batted for days against England and made 214, then the highest score in the history of women’s Test cricket. Bowlers changed, decades changed; the calm at the other end of the pitch did not.' },
    { art: ['mithali'], who: null,
      text: 'She captained India across two different decades — leading the team to a World Cup final in 2005, and again in 2017. At that 2017 World Cup, a photograph went around the world: Mithali, padded up, waiting to bat in a World Cup match — quietly reading a book. The world found it astonishing. Anyone who knew her found it exact: a mind trained since childhood to be perfectly where it chooses to be.' },
    { art: ['mithali'], who: null, mood: 'wow',
      text: 'The 2017 final filled Lord’s — the home of cricket, sold out, for a women’s match, with millions more watching across India. England won by nine runs, and it barely mattered to what happened next: girls’ academies filled, the players won contracts, and women’s cricket in India stopped asking for attention because it finally had it. When Mithali retired in 2022, her 10,868 international runs were the most ever scored in women’s cricket, by anyone, from any country.' },
    { art: ['mithali'], who: 'mithu',
      text: 'Two decades a captain, the world’s runs record, and a book open on her lap while a World Cup waited. The dance teacher lost a dancer and the dance lost nothing — it just moved to a different stage.' }
  ],
  moral: 'What you practise first is never wasted — discipline changes costumes and walks with you wherever you go next.',
  source: 'ICC and BCCI records: her debut century at sixteen (114 not out, 1999), the Test 214 against England in 2002, the World Cup finals of 2005 and 2017 (the sold-out Lord’s final), and 10,868 international runs — the most in women’s cricket at her retirement in 2022; the bharatanatyam years and the choice between dance and cricket are her own oft-recorded telling, and the 2017 book-reading photograph is a matter of record.'
},

{
  id: 'kh.saina',
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
      text: 'Saina Nehwal was born in 1990 in Hisar, in Haryana — wrestling country, wheat country, not badminton country. But her mother had been a state-level badminton player whose own game had stopped early, the way women’s games mostly did in those days, and the house held that unfinished dream the way houses do: quietly, and completely.' },
    { art: ['saina'], who: null,
      text: 'When Saina was eight, her scientist father’s work moved the family to Hyderabad — and Hyderabad had real badminton. The academy was on the far side of the city, so her father woke her before daybreak and rode her there on his scooter, tens of kilometres, morning after morning, then waited through practice to ride her back. If those dawn rides sound familiar, they should: years later another Hyderabad girl, P. V. Sindhu, would live the same mornings on the way to the same badminton world — her story sits just above this one on the shelf.' },
    { art: ['saina'], who: null, mood: 'wow',
      text: 'The mornings compounded. In 2008 she became junior world champion — the first Indian ever. In 2009 she won the Indonesia Open, one of the sport’s biggest crowns, in front of the loudest badminton crowd on Earth — again the first Indian woman to take a title that size. The girl from Hisar was no longer coming up. She had arrived.' },
    { art: ['saina'], who: null, mood: 'wow',
      text: 'London, 2012. In more than a century of Olympic Games, India had won badminton nothing. Saina fought her way to the bronze medal — the first Olympic badminton medal in Indian history. It is a strange kind of medal, a first: it weighs what every other bronze weighs, and also carries everything that was previously called impossible.' },
    { art: ['saina'], who: null,
      text: 'In April 2015 she reached the top of the world rankings — the first Indian woman ever ranked world number one in badminton. And look at what stands behind her now: Sindhu’s silver and world title came through a door the country had watched Saina hit open. Champions make results; first champions make belief.' },
    { art: ['saina'], who: 'mithu',
      text: 'A mother’s unfinished game, a father’s scooter in the dark, and a girl from wrestling country who decided badminton belonged to her. Firsts are heavy — someone has to lift the proof that a thing can be done, and she lifted it for everyone after her.' }
  ],
  moral: 'The first one through pays for the door — and everyone who walks through afterwards walks through her win.',
  source: 'BWF and Olympic records: world junior gold 2008, the Indonesia Open title of 2009, the London 2012 bronze — the first Olympic badminton medal for India — and the world No. 1 ranking of April 2015; her autobiography "Playing to Win" and documented profiles for the Hisar beginnings, her mother’s state-level badminton years, and the dawn scooter rides to the Hyderabad academy.'
},

{
  id: 'kh.malleswari',
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
      text: 'Voosavanipeta is a village in Srikakulam district, on the Andhra coast, and in the 1980s it held something unusual: a little gymnasium with a mud floor where a local coach taught the iron game — weightlifting. Karnam Malleswari came to it at twelve, following her sisters; theirs became a household of girls who lifted, in a country that had barely imagined such a household.' },
    { art: ['malleswari'], who: null, mood: 'think',
      text: 'People picture weightlifting as brute force. It is closer to watchmaking done with a hundred kilograms. The two lifts — the snatch, one clean movement from floor to sky, and the clean and jerk, floor to shoulders to sky — are exercises in precision, timing and nerve, where a centimetre of error drops the world on you. Strength gets you into the room. Craft wins.' },
    { art: ['malleswari'], who: null, mood: 'wow',
      text: 'Malleswari’s craft took her out of the village gym and onto the world stage — and in 1994, in Istanbul, she became champion of the world. In 1995 she did it again. A woman from Srikakulam district, twice world champion in the iron game, years before most of India had ever watched a women’s weightlifting competition.' },
    { art: ['malleswari'], who: null, mood: 'wow',
      text: 'Sydney, September 2000: the first Olympic Games ever to include women’s weightlifting. Malleswari lifted 110 kilograms in the snatch and 130 in the clean and jerk — 240 in all — and won bronze. Read the next sentence slowly, because whole generations waited for it: in more than a hundred years of the modern Olympics, no Indian woman had ever won a medal of any colour, in any sport. She was the first.' },
    { art: ['malleswari'], who: null,
      text: 'Now look around this shelf at who came after: Mary Kom’s bronze, Saina’s bronze, Sindhu’s silver, Mirabai’s silver, Avani’s golds. Every one of those champions stepped onto a podium that, for Indian women, Malleswari reached first. That is what a first medal actually buys — not one place in the record books, but a permission slip for a whole country’s daughters.' },
    { art: ['malleswari'], who: 'mithu',
      text: 'A mud-floored gym, a household of lifting sisters, and 240 kilograms in Sydney. The barbell weighs the same for everyone — history was the extra weight on hers, and she lifted that too.' }
  ],
  moral: 'The barbell weighs the same for everyone. Being first is the extra weight — and someone has to lift it before anyone else can.',
  source: 'IWF and Olympic records: world championship golds in 1994 (Istanbul) and 1995, and the Sydney 2000 bronze (110 kg snatch, 130 kg clean and jerk, 240 kg total) — the first Olympic medal won by an Indian woman, at the first Games to include women’s weightlifting; her documented beginnings, from age twelve, in a village gymnasium in Srikakulam district, Andhra Pradesh.'
},

{
  id: 'kh.mirabai',
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
      text: 'Nongpok Kakching is a village in the hills of Manipur, a bumpy hour from Imphal, and like most village children Saikhom Mirabai Chanu grew up doing chores — among them, fetching firewood from the hillsides. Her family loves telling what happened when she was about twelve: her elder brother could not manage a heavy bundle, and Mirabai picked it up and carried it home, easily, as if the hill had made a mistake about who was strong.' },
    { art: ['mirabai'], who: null,
      text: 'She had wanted to be an archer. But Manipur is a state that produces champions the way other places produce rice — Mary Kom’s story on this shelf begins in these same hills — and its greatest weightlifter, Kunjarani Devi, was a legend in every Manipuri household. Mirabai chose the barbell, and got herself to training in Imphal however she could — often by waving down the sand trucks that ran past her village, riding to practice in the cab with the drivers.' },
    { art: ['mirabai'], who: null, mood: 'sad',
      text: 'Rio, 2016: her first Olympics, twenty-one years old, a nation newly watching — and disaster. In the clean and jerk she failed all three attempts. No total, no result; beside her name the record shows the letters that lifters dread. She wept in front of the cameras, and the cameras did not look away.',
      ask: {
        q: 'The worst day of your life has just happened in front of the whole world. What does the next morning look like?',
        options: ['You quit — the message could not be clearer', 'You go back to training, and let the worst day become information instead of an ending', 'You pretend it never happened'],
        answer: 1,
        right: 'That is the morning she chose. She and her coaches took the failure apart like engineers — what broke, when, why — and rebuilt her lifting around the answers.',
        wrong: 'Plenty of athletes have chosen exactly that, and nobody could blame them. Mirabai went back to training — and let the worst day become information: she and her coaches took the failure apart like engineers and rebuilt her lifting around the answers.'
      } },
    { art: ['mirabai'], who: null, mood: 'wow',
      text: 'One year after Rio, at the 2017 world championships in America, Mirabai Chanu was champion of the world. And in Tokyo, on 24 July 2021 — the first morning of the delayed Olympics — she lifted 87 kilograms in the snatch and 115 in the clean and jerk, 202 in all, and won silver: India’s first medal of those Games, on their first day, from the girl whose Games five years earlier had ended in tears.' },
    { art: ['mirabai'], who: null,
      text: 'Back home in Manipur she did something the record books do not usually bother with, but this shelf does: she tracked down the sand-truck drivers who had carried a village girl to practice all those years, and thanked them with gifts and a feast in her village. Champions are made of training. They are also made of everyone who gave them a lift.' },
    { art: ['mirabai'], who: 'mithu',
      text: 'A firewood bundle, a truck cab, the worst day of her life, and then silver in Tokyo. Strength is what you can lift. Character is what you carry away from your worst day — and she carried hers all the way back up.' }
  ],
  moral: 'Strength is what you can lift; character is what you carry away from your worst day and back into training.',
  source: 'IWF and Olympic records: the Rio 2016 did-not-finish, the 2017 world championship gold at Anaheim, and the Tokyo silver of 24 July 2021 (87 kg snatch, 115 kg clean and jerk, 202 kg total — India’s first medal of those Games); the firewood story of Nongpok Kakching, the sand-truck rides to Imphal and the thank-you feast for the drivers are her own and her family’s documented tellings, widely reported.'
},

/* ========================================================== NAYA ========== */
{
  id: 'ny.kurien',
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
      text: 'In 1949 a young engineer named Verghese Kurien, from Kozhikode in Kerala, was ordered by the government to a small dusty town in Gujarat called Anand, to work at a creamery. He had studied metallurgy — metals, not milk. He did not want to go, he did not like it when he got there, and he planned to leave the moment his bond was done. Remember that, because it makes what happened next funnier.' },
    { art: ['kurien'], who: null, mood: 'sad',
      text: 'In Anand he found farmers who were being squeezed. They rose before dawn, milked their buffaloes, and had no choice but to sell to middlemen for whatever was offered — often next to nothing, while the milk was sold on in Bombay for many times more. The farmers, led by a quiet local organiser named Tribhuvandas Patel, had started a cooperative: a dairy owned by the farmers themselves.',
      ask: {
        q: 'A cooperative means the farmers own the dairy together — every member, however small. Why would that change everything?',
        options: ['It would not — owners are owners', 'Because the profit from the milk now goes back to the people who milked at dawn, not to a middleman', 'Because cooperatives get better buffaloes'],
        answer: 1,
        right: 'That is the whole engine. Same buffaloes, same dawn, same milk — but now the money flows back to the village. Everything Amul became is that one idea, scaled up.',
        wrong: 'The buffaloes and the dawn stayed exactly the same. What changed is where the money went: back to the people who milked, not to a middleman. Everything Amul became is that one idea, scaled up.'
      } },
    { art: ['kurien'], who: null,
      text: 'The engineer who wanted to leave found he could not stop helping. The machines needed fixing; he fixed them. The dairy needed building; he built it. His bond ended, and — to his own lasting surprise, as he cheerfully admitted in his memoir — he stayed. The farmers’ dairy took a brand name: Amul, from a word meaning priceless.' },
    { art: ['kurien'], who: null, mood: 'wow',
      text: 'Then came a problem the experts called impossible. Milk powder had only ever been made from cow’s milk, and Anand’s milk came from buffaloes. The world’s dairy authorities said it could not be done. Kurien and his colleague H. M. Dalaya did it anyway — the first buffalo-milk powder anywhere — and suddenly the flood of milk that once spoiled in the heat could be stored, moved and sold. The impossible turned out to be merely undone.' },
    { art: ['kurien'], who: null, mood: 'wow',
      text: 'The government asked him to take the Anand idea to the whole country, and the programme — Operation Flood — became the largest dairy development the world had ever seen. Village by village, state by state, millions of farming families joined cooperatives they owned themselves. And in 1998 the almost unbelievable line appeared in the statistics: India, which had once imported milk, now produced more of it than any country on Earth.' },
    { art: ['kurien'], who: 'mithu',
      text: 'India keeps National Milk Day on the twenty-sixth of November — Kurien’s birthday. Next time butter melts on something hot in front of you, remember: an engineer who wanted to leave, a farmer who organised, and millions of families who owned the dairy together. The girl on the Amul wrapper is winking about something real.' }
  ],
  moral: 'He came for eight months and stayed fifty years — because the best work is rarely the job you planned, and owning something together can lift a million families at once.',
  source: 'Verghese Kurien’s memoir "I Too Had a Dream" — the reluctant posting to Anand, Tribhuvandas Patel and the Kaira cooperative, Dalaya’s buffalo-milk powder, Operation Flood; Amul/GCMMF and National Dairy Development Board histories; India’s rise to world’s largest milk producer (1998) from FAO figures. National Milk Day, 26 November, is his birth anniversary.'
},

{
  id: 'ny.infosys',
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
      text: 'In 1981, a soft-spoken engineer named N. R. Narayana Murthy wanted to start a software company — in an India where that sentence barely made sense. Computers were rare, imports took forever, and software was something faraway countries did. He had six colleagues willing to jump with him, and almost no money. The starting capital, ten thousand rupees, came mostly from the savings of his wife, Sudha Murty — an engineer herself, who bet her rainy-day fund on her husband’s improbable idea.' },
    { art: ['n_murthy'], who: null, mood: 'think',
      text: 'The company was called Infosys. Its first office was the front room of a house. And here is a detail to sit with: a software company that could not, for a long time, even get a computer — the paperwork to import one took years in those days. They wrote work for clients on other people’s machines, and waited, and kept going. The first computer of their own arrived about two years in, and was received roughly the way families receive a new baby.' },
    { art: ['n_murthy'], who: null,
      text: 'What they were selling, in the end, was not machines. It was a promise: that a team in India could write software for the biggest companies in the world, deliver it on time, and be trusted absolutely. Trust is slow to build and quick to lose, and they built it order by order, year after patient year.' },
    { art: ['n_murthy'], who: null, mood: 'wow',
      text: 'It worked beyond anybody’s sensible guess. Infosys grew from seven engineers into one of the great software companies of the world. Its green campus in Bengaluru — lawns, glass, thousands of young engineers — became a place visiting leaders from other countries actually asked to see, because it looked like a future India had built for itself.' },
    { art: ['n_murthy', 'sudha_murty'], who: null,
      text: 'And one more thing, quietly revolutionary: the founders shared ownership of the company with its employees, down to drivers and office staff, long before that was fashionable. When Infosys succeeded, the success spread through thousands of ordinary households — which was, Murthy always argued, the whole point of building anything.' },
    { art: ['n_murthy'], who: 'mithu',
      text: 'Ten thousand rupees, borrowed from a savings tin. Some investments are measured in money, and some in one person saying to another: I believe this is worth trying — here is everything I have saved.' }
  ],
  moral: 'Great companies are built the way trust is built: slowly, promise by kept promise — and they are worth most when the winnings are shared.',
  source: 'Infosys’s own published history (founded 1981, seven founders, seed capital ₹10,000, first computer c. 1983, listed 1993) and the founders’ accounts — both Narayana Murthy and Sudha Murty have told the story of her savings funding the start; the employee stock-ownership programme and the visited Bengaluru campus are matters of company record.'
},

{
  id: 'ny.sudha-letter',
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
      text: 'In 1974, Sudha Kulkarni — later Sudha Murty — was a star engineering student in Bangalore, usually the only woman in the room and usually at the top of the class. One day on a notice board she saw an advertisement from TELCO, the great Tata company that built trucks. Good job, good pay, interesting work. And at the bottom, one line: lady candidates need not apply.' },
    { art: ['sudha_murty'], who: null, mood: 'think',
      text: 'She has described what happened next many times, always with a laugh at her own young indignation. She did not have money for fancy stationery, so she took a postcard — a plain government postcard — and wrote to the head of the whole Tata group, J. R. D. Tata himself, saying that it was unfair for a house as respected as Tata to shut a door on candidates simply for being women.',
      ask: {
        q: 'A student, a postcard, and the most powerful industrialist in India. What are the chances anything happens?',
        options: ['None — great men do not read postcards', 'It only takes one fair-minded person actually reading it', 'It depends on the handwriting'],
        answer: 1,
        right: 'And that is what the postcard found. A telegram came back, inviting her to an interview — at the company’s expense.',
        wrong: 'Here is what actually came back: a telegram, inviting her to an interview at the company’s expense. Somebody fair-minded had read the postcard.'
      } },
    { art: ['sudha_murty'], who: null, mood: 'wow',
      text: 'At the interview in Pune she answered everything they asked, and told them honestly what she thought. They hired her. Sudha Murty became the first woman engineer on the shop floor at TELCO — walking each day into a factory of thousands of men and a hundred years of habit, and simply doing excellent work until the strangeness wore off.' },
    { art: ['sudha_murty'], who: null,
      text: 'The door she pushed open did not close behind her. Where one woman engineer had been unthinkable, there were soon more — at that factory and, slowly, everywhere. Years later she would use her own money and years of her life to build libraries and schools by the thousand, and to tell this story to every young audience that would listen.' },
    { art: ['sudha_murty'], who: 'mithu',
      text: 'She could have sighed at that notice and walked on — everyone else had. The whole story turns on one student deciding that unfair deserved a reply, and that a postcard was enough paper to say so.' }
  ],
  moral: 'Never let the smallness of your paper stop you. Unfairness counts on nobody bothering to write.',
  source: 'Sudha Murty’s own oft-published telling of the 1974 episode — the TELCO notice, the postcard to J. R. D. Tata, the telegram, and her hiring as the first woman engineer on the TELCO shop floor — recounted in her books, talks and interviews over many years.'
},

{
  id: 'ny.isro',
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
      text: 'In 1963, India’s space programme fitted inside a fishing village. At Thumba, on the Kerala coast, the local church community lent the scientists their church building and the bishop’s house to work in — the altar end became an office, the yard filled with equipment, and a young engineer named A. P. J. Abdul Kalam was among the team assembling India’s first rockets there.' },
    { art: ['rocket'], who: null, mood: 'wow',
      text: 'There is a photograph from those days that Indians never tire of: a rocket nose cone being carried on the back of a bicycle. Parts went by bicycle and bullock cart because that is what there was. And from that borrowed church yard, in November 1963, India’s first rocket rose off the beach and into the sky.' },
    { art: ['rocket'], who: null,
      text: 'The organisation that grew from that beach is called ISRO, and it kept one habit from the bicycle days forever: do it simply, do it cheaply, waste nothing. Other space agencies had mountains of money. ISRO had cleverness, patience, and engineers who treated every rupee like a passenger.' },
    { art: ['rocket'], who: null, mood: 'wow',
      text: 'In 2013 ISRO launched Mangalyaan, a spacecraft to Mars — and in September 2014 it slipped into orbit around the red planet on the very first attempt, something no nation had ever managed first time. The bill for the whole mission was famously smaller than the budget of a single Hollywood space film. Scientists around the world checked that number twice.' },
    { art: ['rocket'], who: null, mood: 'think',
      text: 'Then the Moon. An earlier lander had crashed, in full view of a watching country — space is unforgiving, and ISRO said so plainly, fixed what failed, and went back. On the twenty-third of August 2023, Chandrayaan-3 set its lander down gently near the Moon’s south pole — the first spacecraft from any nation to land in that region — and a little rover rolled out and left India’s wheel-marks in soil where nothing had ever driven.' },
    { art: ['rocket'], who: 'mithu',
      text: 'A church yard, a bicycle, a bullock cart — then Mars on the first try and the Moon’s untouched south. Nobody at Thumba waited until they had everything they needed. They started with what there was, and the sky let them in anyway.' }
  ],
  moral: 'Start with the bicycle you have, not the budget you wish for. Frugality is not the opposite of ambition — sometimes it is the engine of it.',
  source: 'ISRO’s published history and mission records: the Thumba church-and-bishop’s-house beginnings and first sounding rocket (21 November 1963), the Mars Orbiter Mission (launched 2013, Mars orbit 24 September 2014, first-attempt success, cost about ₹450 crore — widely noted as below a Hollywood film budget), and Chandrayaan-3’s landing near the lunar south pole, 23 August 2023. The Thumba years are also told in A. P. J. Abdul Kalam’s memoir "Wings of Fire".'
},

{
  id: 'ny.upi',
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
      text: 'Watch a chai stall in any Indian street today. A cup is poured, a phone comes out, it points for a second at a small printed square hanging on a string — and the payment is done. Ten rupees, gone from one person’s bank account into the other’s, in about the time it took you to read this sentence. No coins, no card machine, no counting change.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'This story has no single hero, and that is the point of it. The machine underneath is called UPI, and it was built by NPCI — an organisation India’s banks set up together, not to make a profit but to build shared plumbing for money, the way a city builds roads that every car may use. UPI switched on in 2016.' },
    { art: ['guard'], who: null, mood: 'think',
      text: 'The clever part is what UPI is not. It is not one company’s app. Any bank can join, any app can plug in, and a person on one app can pay a person on a completely different one — the way a phone call works between any two phones. And for ordinary people, sending money costs nothing.',
      ask: {
        q: 'Why did it matter so much that the system was free and open to every bank and app, instead of owned by one company?',
        options: ['It did not matter much', 'Because a payment system is only useful if the OTHER person is on it too — open to everyone means it works with everyone', 'Because apps are hard to build'],
        answer: 1,
        right: 'That is the secret. Money-moving is like language — useful only if the other person shares it. Open to all meant everyone could join, so everyone did.',
        wrong: 'Think about who you pay: rickshaws, shops, your aunt. A payment system is only useful if the other person is on it too. Open to every bank and app meant everyone could join — so everyone did.'
      } },
    { art: ['courtier'], who: null, mood: 'wow',
      text: 'And everyone did. Vegetable carts, temple donation boxes, auto-rickshaws, wedding gift counters — the little square went everywhere, because printing one costs almost nothing. Many countries had leapt from cash to cheques to cards over a century. Much of India jumped straight from cash to the phone in a handful of years, and today UPI carries billions of payments every single month — among the busiest instant-payment systems on Earth.' },
    { art: ['courtier', 'guard'], who: null,
      text: 'The quietest part is the fairest part. A card machine cost more than a small vendor could ever spend, so cards belonged to big shops. A paper square costs a rupee to print — so the smallest chaiwala in the smallest lane got the same payment system as the grandest store in the mall. The same square, the same second, the same rails.' },
    { art: ['courtier'], who: 'mithu',
      text: 'Next time you see someone pay with a phone at a stall, you will know the trick: there is no trick. Just plumbing that everyone owns, built so the smallest stall and the biggest shop stand at the same counter. Ask a grown-up to show you their most-used square.' }
  ],
  moral: 'The best inventions are sometimes the ones nobody owns — built like roads, open to all, so that the smallest cart travels as fast as the biggest truck.',
  source: 'NPCI’s published material on UPI — launched 2016, an interoperable instant-payment system built by the National Payments Corporation of India, a not-for-profit umbrella set up by India’s banking system — and NPCI’s monthly transaction statistics (billions of payments per month, among the world’s largest instant-payment volumes).'
},

{
  id: 'ny.flipkart',
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
      text: 'In 2007, two young engineers in Bengaluru — Sachin Bansal and Binny Bansal, same surname, no relation, a coincidence they explained for the rest of their lives — quit comfortable jobs to try something most of India found funny at the time: a shop with no shop. A website that sold books, run from a couple of rooms in a Koramangala flat, on a few lakh rupees of their own savings.' },
    { art: ['unicorn'], who: null, mood: 'think',
      text: 'The doubters had a real point. In the India of 2007, hardly anyone paid for things online. Deliveries went missing. Why would anyone send money into a website and trust that a parcel would come? That trust did not exist. It had to be manufactured — one parcel at a time.',
      ask: {
        q: 'How do two people with no money and no famous name manufacture trust?',
        options: ['Advertise everywhere', 'Make each early order arrive perfectly — even if the founders must carry it themselves', 'Lower the prices until people risk it'],
        answer: 1,
        right: 'That was the founding move. In the early days the two of them delivered orders themselves, by scooter, through Bengaluru traffic — because a promise kept in person is how trust starts.',
        wrong: 'Advertising buys attention, not trust. What they actually did: in the early days they delivered orders themselves, by scooter, through Bengaluru traffic — a promise kept in person, over and over.'
      } },
    { art: ['unicorn'], who: null, mood: 'wow',
      text: 'The very first order is company legend with the receipts to prove it: one book, ordered by a customer far from any big city bookshop, who took the gamble on a website nobody had heard of. The parcel went out, the book arrived, the customer told people. That single kept promise, multiplied by millions, is essentially the whole story of Indian online shopping.' },
    { art: ['unicorn'], who: null,
      text: 'From books, the shelf grew — and Flipkart grew into one of the defining companies of the Indian internet, the one that taught a country it could trust the buy button. Investors came to describe young companies that grow that large with a storybook word: a unicorn. When India began counting its unicorns, this bookshop-from-a-flat was the herd’s first.' },
    { art: ['unicorn'], who: 'mithu',
      text: 'The interesting part is never the unicorn — it is the flat, the scooter, and the first stranger who decided to trust two engineers she had never met. Every big thing was once two people and a parcel.' }
  ],
  moral: 'Trust is built the slow way, one kept promise at a time — and it is the realest thing a new company owns.',
  source: 'The widely documented founding of Flipkart: Bengaluru, October 2007, by Sachin and Binny Bansal (unrelated), begun with their own savings as an online bookshop with founder-delivered early orders; its first book order is recorded company history, and its later status as India’s first startup unicorn was widely reported. The story deliberately stays on the founding years.'
},

{
  id: 'ny.nykaa',
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
      text: 'Falguni Nayar had, by any sensible measure, finished the climbing part of life. She was one of the most senior bankers in Mumbai, respected everywhere, her twin children grown. And in 2012, at nearly fifty, she walked away from all of it to start a brand-new company from scratch — in beauty products, an industry she had never worked in.' },
    { art: ['falguni'], who: null, mood: 'think',
      text: 'Her idea was plain and stubborn: Indian women deserved a trustworthy place to buy makeup and skincare, with honest advice, real reviews and genuine products — whether they lived in south Mumbai or in a small town a day’s journey from any beauty counter. She named it Nykaa, from nayika: the heroine of a story. The heroine, note — not the sidekick.' },
    { art: ['falguni'], who: null,
      text: 'The early years were the unglamorous kind of hard that never makes the highlight reel — warehouses, deliveries, convincing famous brands to trust a newcomer, convincing customers to trust a website with their faces. She was decades older than the boys of the startup world, and she simply declined to find that interesting.' },
    { art: ['falguni'], who: null, mood: 'wow',
      text: 'Nine years of building later, in November 2021, Nykaa was listed on the stock exchange — and Falguni Nayar stood on the platform in Mumbai and rang the opening bell, with her family beside her and her team around her. The company she had started at fifty was now one of the most talked-about listings in India, and one of the first big Indian internet companies built and led by a woman from day one.' },
    { art: ['falguni'], who: null,
      text: 'Rings of that bell are heard a long way. Somewhere, every time this story is told, someone who had quietly decided they were too old for their own idea does a small recalculation.' },
    { art: ['falguni'], who: 'mithu',
      text: 'Fifty is not a deadline; it turns out it is an age like any other, with mornings in it. The bell does not ask how old the hand is. It only asks whether you built something.' }
  ],
  moral: 'Too late is mostly a rumour. The years you have already lived are not spent — they are capital.',
  source: 'Nykaa’s own company history and stock-exchange listing records: founded 2012 by Falguni Nayar after leaving a senior investment-banking career at nearly fifty; the name from nayika; the bell-ringing listing in Mumbai on 10 November 2021 — all matters of public record and her own public tellings.'
},

{
  id: 'ny.oyo',
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
      text: 'Ritesh Agarwal grew up in Bissam Cuttack, a small town in Odisha, in a family of shopkeepers. As a teenager he fell in love with travelling — and, having very little money, he stayed where very little money stays: cheap guest houses. Broken taps, mystery bedsheets, receptionists who had wandered off. Most travellers grumbled and forgot. He grumbled and took notes.' },
    { art: ['ritesh'], who: null, mood: 'think',
      text: 'By the time he had stayed in about a hundred of them, his notebook held a pattern: the problem was not that cheap rooms existed, but that a traveller could never know what they were getting. One guest house was a gem, the next a disaster, and nothing on the outside told you which.',
      ask: {
        q: 'Everybody who ever stayed in a bad guest house knew this problem. What made a teenager from Odisha different?',
        options: ['He was luckier than the others', 'Everyone else saw an annoyance; he treated it as a problem that could actually be worked on', 'He had money to fix it'],
        answer: 1,
        right: 'That is the whole difference. A problem noticed by millions belongs to whoever takes it seriously first — and he was taking notes while everyone else was checking out.',
        wrong: 'He had no money and no luck to spare. The difference was smaller and bigger than that: everyone else saw an annoyance, and he treated it as a problem someone could actually work on.'
      } },
    { art: ['ritesh'], who: null, mood: 'wow',
      text: 'At eighteen he moved to Delhi and started up — first a site for listing stays, which taught him his idea was half-wrong, and then, in 2013, the corrected idea: OYO, which worked with guest houses to fix the basics — clean sheets, working shower, honest photos — so a traveller booking an OYO room knew what they would get. That same year, a global fellowship for young founders picked him from applicants around the world, and paid him to build his company instead of going to college.' },
    { art: ['ritesh'], who: null,
      text: 'From that start, OYO spread to thousands of small hotels across India and far beyond, with the road ahead holding the usual weather of young companies — good years and hard ones alike. But the founding itself stands: a shopkeeper’s son from a small Odisha town looked at the most ordinary annoyance in Indian travel and decided it was his to solve.' },
    { art: ['ritesh'], who: 'mithu',
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
      text: 'Kiran Mazumdar grew up in Bangalore in the 1950s and 60s, the daughter of a head brewmaster — and she fell in love not with beer but with the science underneath it: fermentation, the ancient trick by which invisible living things, yeasts and enzymes, quietly turn one substance into another. She went to Australia to study brewing properly, and finished at the top of her class.' },
    { art: ['kiran_shaw'], who: null, mood: 'sad',
      text: 'Then she came home with her qualification — and found every door in her field closed. Brewery after brewery told her, in the India of the 1970s, what she has retold ever since: the brewhouse was no place to put a woman in charge. Her marks did not matter. Her training did not matter. The answer was simply no.',
      ask: {
        q: 'Your training is real, your marks are the best, and every door in your field is shut. What is your training actually worth now?',
        options: ['Nothing — the doors decide', 'Everything — fermentation science works in more places than breweries', 'Only what someone else can be persuaded to say it is worth'],
        answer: 1,
        right: 'That is the turn her life took. Brewing science is enzyme science — and enzymes have a thousand uses beyond beer. The skill was a key, and keys open more than one lock.',
        wrong: 'It felt like nothing, she has said — for a while. But brewing science is enzyme science, and enzymes have a thousand uses beyond beer. The skill was a key, and keys open more than one lock.'
      } },
    { art: ['kiran_shaw'], who: null,
      text: 'In 1978 an Irish company that made industrial enzymes went looking for an Indian partner, and found the brewmaster nobody would hire. Kiran, twenty-five, started Biocon India in the garage of her rented house in Bangalore, with about ten thousand rupees. The early days were a museum of refusals: banks would not lend to a young woman running a company built on a word — biotechnology — that no bank manager had ever heard.' },
    { art: ['kiran_shaw'], who: null, mood: 'wow',
      text: 'The garage got to work anyway, coaxing enzymes out of papaya fruit — and within a year, this tiny company was exporting enzymes to Europe and America, the first Indian company ever to do so. The science India’s breweries had turned away was now being shipped, in barrels, to the world.' },
    { art: ['kiran_shaw'], who: null, mood: 'wow',
      text: 'Then came the bigger idea: if enzymes, why not medicines? Biocon turned its fermenters toward pharmaceuticals — above all insulin, the daily medicine millions of Indians with diabetes cannot live without, made at Indian scale and Indian prices. The company from the garage grew into the biggest biotechnology company in India. The garage is the point of the story; the refusals are its fuel.' },
    { art: ['kiran_shaw'], who: 'mithu',
      text: 'They would not let her make beer, so she made medicine. When a door closes on you, check what your key really opens — it is usually more than the one lock you had in mind.' }
  ],
  moral: 'A closed door tells you about the door, not about you. Skills are keys — and most keys open more than one lock.',
  source: 'Biocon’s own company history: founded 1978 in the garage of her rented Bangalore house, in partnership with Biocon Biochemicals of Ireland, on seed capital of about ₹10,000; the papain exports within the first year — the first Indian enzyme exports — and the later move into biopharmaceuticals and affordable insulin. Her brewmaster training in Australia and the refusals at Indian breweries and banks are her own oft-recorded telling, paraphrased here, never quoted.'
},

{
  id: 'rah.hansa',
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
      text: 'Hansa Mehta was born in 1897 into a scholarly family of Baroda, in Gujarat, and spent her life on education — she wrote and translated books for Gujarati children, Gulliver’s adventures among them, and built schools and colleges. She was one of just fifteen women in the assembly that wrote India’s Constitution; and at the midnight hour of independence, 14 August 1947, it was Hansa Mehta who presented the national flag to the assembly on behalf of the women of India. That is in the assembly’s own record.' },
    { art: ['hansa_mehta'], who: null,
      text: 'In 1947 she was sent to the United Nations, to the commission drafting something the world had never had: the Universal Declaration of Human Rights — a promise-list belonging to every person on Earth, written in the shadow of a war that had shown what happens when such promises do not exist. The chair was Eleanor Roosevelt of America. And the draft of the very first article began: “All men are born free and equal.”' },
    { art: ['hansa_mehta'], who: null, mood: 'think',
      text: 'To most of the room, that wording seemed fine. “All men”, everyone agreed, obviously meant everyone.',
      ask: {
        q: '“All men” means everyone — everybody knows that. Does the wording matter?',
        options: ['No — everyone knows what is meant', 'Yes — words written for the whole world, for all time, should say exactly what they mean', 'Only lawyers care about such things'],
        answer: 1,
        right: 'That was Hansa Mehta’s argument, made patiently, meeting after meeting: somewhere, someday, someone would read “men” and use it to mean men only. A promise to everyone had to name everyone.',
        wrong: 'Hansa Mehta thought otherwise, and said so, patiently, meeting after meeting: somewhere, someday, someone would read “men” and use it to mean men only. A promise to everyone had to name everyone.'
      } },
    { art: ['hansa_mehta'], who: null, mood: 'wow',
      text: 'She won. When the Universal Declaration was adopted in December 1948, its first article read — and reads today, in over five hundred languages: “All human beings are born free and equal in dignity and rights.” The United Nations itself tells the story of who insisted on those words: Hansa Mehta of India. Two words, changed by one careful reader, in the sentence the whole world now begins with.' },
    { art: ['hansa_mehta'], who: null,
      text: 'Then she went home and kept building. When Baroda’s new university opened in 1949, Hansa Mehta led it as its first Vice-Chancellor — a scholar running a university at a time when that too was a door not yet open. She spent her life on exactly one conviction, applied everywhere: that every human being, and she did mean every, deserves the dignity of learning.' },
    { art: ['hansa_mehta'], who: 'mithu',
      text: 'Most people skim. She read. Next time you meet a rule, a form, a promise — read the small words. The whole world once hung on two of them, and somebody from Baroda was paying attention.' }
  ],
  moral: 'Check the small words. The whole world can hang on them — and somebody has to be the one reading carefully.',
  source: 'United Nations records: the UN’s own published histories of the Universal Declaration of Human Rights credit Hansa Mehta of India with changing Article 1 from “all men” to “all human beings” (adopted 10 December 1948) — the Article 1 text is quoted from the document itself; the Constituent Assembly of India’s records for the flag presentation of 14–15 August 1947; the Maharaja Sayajirao University of Baroda, of which she was the first Vice-Chancellor from 1949.'
},

{
  id: 'rah.savitribai',
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
      text: 'Savitribai was born in 1831 in Naigaon, a village in Maharashtra, and married very young, as was the custom of the time, to Jyotirao Phule of Pune. Jyotirao believed something then considered strange: that his wife should read. He taught her letters at home — and Savitribai took to learning the way dry ground takes to rain. The first door of her life opened over a slate at her own kitchen floor.' },
    { art: ['savitribai'], who: null, mood: 'wow',
      text: 'She did not stop at reading. She trained as a teacher — proper training, at institutions in Ahmednagar and Pune — and in January 1848, she and Jyotirao opened a school for girls at Bhide Wada in Pune. Savitribai stood at the front of the class and taught: one of the first Indian women ever to do so, in one of the first schools for girls that Indians had ever run, teaching children whom no school had wanted.' },
    { art: ['savitribai'], who: null, mood: 'sad',
      text: 'Not everyone rejoiced. Many people were furious that these children should learn at all, and some showed their anger cruelly — jeering at Savitribai on her walk to school, and throwing mud and dung at her clothes. Her answer has been remembered for a hundred and seventy years: she carried a second sari in her bag, changed when she arrived, and began the day’s lessons. Then she came back the next morning. That was the whole of her argument, and it won.' },
    { art: ['savitribai'], who: null,
      text: 'Within three years there were three schools and about a hundred and fifty girls learning in them. Savitribai and Jyotirao kept opening doors all their lives — classes for grown-ups who had never been allowed to learn, a home for children no one else would take. At twenty-three she published a book of her own poems; their message, over and over, was the one she had lived: go, get education.' },
    { art: ['savitribai'], who: null,
      text: 'In 1897, when plague came to Pune, Savitribai — by then in her sixties — worked caring for the sick, and caught the illness herself. She died as she had lived, walking toward people everyone else avoided. Today the great university of Pune carries her name, and in Maharashtra her birthday, the third of January, is kept in honour of girls and the people who teach them.' },
    { art: ['savitribai'], who: 'mithu',
      text: 'A slate at a kitchen floor, a spare sari in a bag, a door held open for a hundred and fifty girls — and now for every girl reading this. Some doors are opened once, by one person who simply refuses to stop walking to them.' }
  ],
  moral: 'Courage is not always loud. Sometimes it is a teacher, walking the same hard road to school every morning, until the world gives way.',
  source: 'Documented histories and biographies of Savitribai and Jyotirao Phule: the girls’ school at Bhide Wada, Pune, January 1848; her teacher training at Ahmednagar and Pune; the spare sari carried against the mud and dung flung at her, as recorded in standard accounts of her life; her poems (Kavya Phule, 1854); her death in the Pune plague of 1897; Savitribai Phule Pune University (renamed in her honour, 2014) and Maharashtra’s observance of 3 January. needs_review: this story borders caste history, kept here at a child’s level without caste vocabulary per docs/05 §6 — a named human reviewer must sign off before publish.'
},

{
  id: 'rah.ela',
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
      text: 'Ela Bhatt was a young lawyer in Ahmedabad — soft-spoken, khadi-wearing, the gentlest person in most rooms — working for the textile workers’ union in the city Gandhi had made famous for exactly that kind of work. But the workers inside the mills had a union. Her eye kept catching the workers outside them: women carrying cloth bales on their heads, pulling handcarts, rolling papads at home before dawn, selling vegetables from baskets. They worked every daylight hour. And officially, they did not exist — no register counted them, no law protected them, because no factory owned them.' },
    { art: ['ela_bhatt'], who: null, mood: 'think',
      text: 'The rulebooks had a phrase for such women — self-employed — and treated it as a reason to do nothing. Ela Bhatt read it the other way: if they are self-employed, they are workers, and workers can have a union. In 1972 she founded SEWA, the Self-Employed Women’s Association — a trade union for women the rulebooks had never imagined. The membership card mattered as much as anything the union ever won: a piece of paper that said, for the first time in these women’s lives, I am a worker.' },
    { art: ['ela_bhatt'], who: null, mood: 'sad',
      text: 'Then came the money problem. The members earned coin by coin, daily, with no safe place to keep a paisa of it — and the banks would not have them. Some of the women could not sign their names; none had the papers and property a bank wanted; the queues and the counters were not built for a vegetable seller who loses a day’s income by standing in one. The banks were not going to change.' },
    { art: ['ela_bhatt'], who: null, mood: 'wow',
      text: 'So in 1974, about four thousand SEWA members did something almost cheeky in its simplicity: they put in ten rupees each — ten rupees, from women counted as too poor to bank — and founded their own bank. A cooperative, owned by its account holders, run for headloaders and papad rollers and cart pullers; and for members who could not sign, the bank used photographs instead of signatures. The problem was never that the women did not fit banking. It was that banking had not yet been built to fit them.' },
    { art: ['ela_bhatt'], who: null,
      text: 'The bank held, and the union grew — trade by trade, town by town, until SEWA counted its members in the millions, one of the largest organisations of working women anywhere on Earth. When Ela Bhatt finally wrote their story down, she gave the book a title that says everything this shelf could hope to: We Are Poor but So Many.' },
    { art: ['ela_bhatt'], who: 'mithu',
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
