/* Bizzing India — Neeti deck: what each value DOES for you, where it is spoken
   of, and the deeds that earn a bead.
 *
 * WHY A SECOND FILE. data-neeti.js carries the twelve values and their prose,
 * and that prose is good. This one adds the deck layer without touching it:
 * the benefit line (the honest payoff, which the value pages never had), where
 * the value is spoken of, and — the real gap — the DEEDS. The pillar has always
 * said "you get a bead when you DO one of these, not when you read about it",
 * and then offered exactly one deed per value. Twelve deeds in the whole
 * subject. Here there are six each.
 *
 * EDITORIAL (docs/05).
 *   · `where` names TEXTS AND TRADITIONS, never a chapter and never a verse
 *     number. A precise citation is a factual claim and this file was written
 *     without one open on the desk; naming that the Thirukkural treats a value
 *     at length is safe, inventing which couplet is not. Anything numbered
 *     belongs in `verse` on the value itself, where a human put it.
 *   · Traditions are never ranked. "Jains carried this furthest" is a statement
 *     about distance travelled, not about who is right.
 *   · The dilemmas and the added lives are flagged needs_review: they touch
 *     what faiths hold and what real people did, and both need a named
 *     reviewer before they are published as settled.
 */
window.IND_NEETI_DECK = {

  /* ---- the deck layer, keyed by value id -------------------------------- */
  values: {
    ahimsa: {
      benefit: 'People trust someone who is safe to be around. That is a quiet kind of power, and it lasts longer than being feared.',
      where: 'The Thirukkural gives a whole run of couplets to not causing pain. The Tattvartha Sutra opens Jain ethics with it. The Dhammapada returns to it again and again.',
      deeds: [
        { t: 'Move a spider or an insect outside instead of anything else.', at: 'home' },
        { t: 'Let something go that you were about to say about someone.', at: 'anywhere' },
        { t: 'Put water out for birds where you can see it from a window.', at: 'home' },
        { t: 'Walk around the ants instead of through them.', at: 'outside' },
        { t: 'Say the kinder version of the true thing.', at: 'school' },
        { t: 'Break up an argument instead of joining a side.', at: 'school' }
      ]
    },
    satya: {
      benefit: 'You stop having to remember what you told which person. That is a lot of room in your head, given back.',
      where: 'The Mundaka Upanishad is where "satyameva jayate" comes from — the line on India’s state emblem. The Thirukkural treats truth at length, and so does the Guru Granth Sahib.',
      deeds: [
        { t: 'Own up to a small thing before anyone finds out.', at: 'home' },
        { t: 'Say "I do not know" once today instead of guessing.', at: 'school' },
        { t: 'Tell someone the real reason, not the easy one.', at: 'anywhere' },
        { t: 'Correct something you said wrong yesterday.', at: 'anywhere' },
        { t: 'Say a true thing that is not to your advantage.', at: 'anywhere' },
        { t: 'Do not let someone else take the blame for you.', at: 'school' }
      ]
    },
    karuna: {
      benefit: 'You notice more. People who feel with others read a room faster than people who do not.',
      where: 'Karuna is one of the four brahmaviharas the Buddha taught. The Bhagavata Purana returns to it constantly, and langar — Sikh free kitchen — is it made into a daily habit.',
      deeds: [
        { t: 'Sit with whoever is on their own at lunch.', at: 'school' },
        { t: 'Ask someone how they actually are, then wait for the answer.', at: 'anywhere' },
        { t: 'Give away something of yours that somebody needs more.', at: 'home' },
        { t: 'Notice who did not get asked, and ask them.', at: 'school' },
        { t: 'Feed a street animal, or leave food where one will find it.', at: 'outside' },
        { t: 'Be kind to the person nobody is being kind to today.', at: 'anywhere' }
      ]
    },
    seva: {
      benefit: 'Work done for nothing makes you useful, and useful people are never lonely for long.',
      where: 'Seva is a pillar of Sikhi — the langar feeds anyone who sits down, and the sangat sweeps its own floor. The Bhagavad Gita’s karma yoga is the same idea from another door.',
      deeds: [
        { t: 'Do a chore that is not yours and do not mention it.', at: 'home' },
        { t: 'Clear somebody else’s plate as well as your own.', at: 'home' },
        { t: 'Help at a gurudwara, temple, mosque or church kitchen.', at: 'outside' },
        { t: 'Carry something heavy for somebody older.', at: 'anywhere' },
        { t: 'Pick up litter that you did not drop.', at: 'outside' },
        { t: 'Teach a younger child something you are good at.', at: 'home' }
      ]
    },
    dhairya: {
      benefit: 'Most things you want are on the far side of being bored for a while. Patience is how you get across.',
      where: 'The Bhagavad Gita speaks of steadiness under both praise and blame. The Jataka tales are full of it, and the Thirukkural treats endurance as a strength rather than a lack.',
      deeds: [
        { t: 'Finish something you started and wanted to quit.', at: 'anywhere' },
        { t: 'Wait your turn without saying anything about it.', at: 'anywhere' },
        { t: 'Practise the hard bit ten more times.', at: 'home' },
        { t: 'Let someone finish their sentence.', at: 'anywhere' },
        { t: 'Plant a seed and look after it for a week.', at: 'home' },
        { t: 'Do the boring part first, properly.', at: 'school' }
      ]
    },
    buddhi: {
      benefit: 'Thinking twice costs a few seconds. Not thinking twice can cost a whole afternoon.',
      where: 'The Panchatantra is a nitishastra — a treatise on wise conduct — and nearly every fable in it turns on someone thinking or failing to. Vidur Niti and Chanakya Niti do the same for grown-ups.',
      deeds: [
        { t: 'Ask why before you agree with something.', at: 'anywhere' },
        { t: 'Check a fact somebody told you today.', at: 'anywhere' },
        { t: 'Change your mind out loud when you are shown you were wrong.', at: 'anywhere' },
        { t: 'Read the whole question before you answer it.', at: 'school' },
        { t: 'Work out one problem without being shown how.', at: 'school' },
        { t: 'Wait a night before deciding something big.', at: 'home' }
      ]
    },
    sahas: {
      benefit: 'The first time is the hardest. Every brave thing after it is a little cheaper.',
      where: 'The Ramayana and the Mahabharata are both, in part, arguments about what courage is for. Guru Tegh Bahadur is remembered in Sikh tradition for standing up for the right of others to their own faith.',
      deeds: [
        { t: 'Say the unpopular true thing in a group.', at: 'school' },
        { t: 'Stand next to someone being picked on.', at: 'school' },
        { t: 'Try the thing you are bad at, in front of people.', at: 'anywhere' },
        { t: 'Ask the question everyone is too shy to ask.', at: 'school' },
        { t: 'Admit you are frightened, out loud.', at: 'home' },
        { t: 'Go first.', at: 'anywhere' }
      ]
    },
    kshama: {
      benefit: 'Carrying a grudge is work. Putting it down is the only way to get your hands free.',
      where: 'Michhami Dukkadam — the Jain asking of forgiveness at the close of Paryushan — is this made into a day in the year. The Thirukkural and the Guru Granth Sahib both treat forgiveness as strength.',
      deeds: [
        { t: 'Forgive someone without making them ask twice.', at: 'anywhere' },
        { t: 'Say sorry first, even if it was mostly them.', at: 'home' },
        { t: 'Stop bringing up the old thing.', at: 'home' },
        { t: 'Let a sibling off something.', at: 'home' },
        { t: 'Give someone a second chance they half deserve.', at: 'school' },
        { t: 'Forgive yourself for one thing, properly.', at: 'anywhere' }
      ]
    },
    vidya: {
      benefit: 'Nobody can take it off you. Not thieves, not water, not a move to another country.',
      where: 'Saraswati is the goddess of learning across Hindu tradition, and Vasant Panchami is her day. The Thirukkural opens with learning, and Sikh tradition holds the Guru — the teacher — at its centre.',
      deeds: [
        { t: 'Learn one word in your family’s language today.', at: 'home' },
        { t: 'Teach somebody the thing you just learnt.', at: 'anywhere' },
        { t: 'Read something you were not made to read.', at: 'home' },
        { t: 'Ask a grown-up to explain their job properly.', at: 'home' },
        { t: 'Find out where one thing in your house comes from.', at: 'home' },
        { t: 'Look up the thing you pretended to know.', at: 'anywhere' }
      ]
    },
    kritagyata: {
      benefit: 'It is very hard to feel hard done by and grateful in the same minute. Only one of them is any use.',
      where: 'Ardas in Sikh practice closes with thanks. Annadata sukhi bhava — "may the giver of food be happy" — is said at Indian tables. The Thirukkural treats ingratitude as among the worst faults.',
      deeds: [
        { t: 'Thank whoever cooked, before you eat.', at: 'home' },
        { t: 'Thank somebody who is never thanked — a cleaner, a driver, a guard.', at: 'outside' },
        { t: 'Tell a grandparent one thing you are glad they taught you.', at: 'home' },
        { t: 'Write down three things that went right today.', at: 'home' },
        { t: 'Thank someone by name and say what for.', at: 'anywhere' },
        { t: 'Say thank you to a teacher after the lesson.', at: 'school' }
      ]
    },
    namrata: {
      benefit: 'People tell you things when you are not busy being impressive. You find out much more.',
      where: 'Bowing — to elders, at a threshold, before learning — runs through Indian practice. Kabir’s couplets return to it constantly, and Sikh tradition treats haumai, the "I-am-ness", as the thing to be got past.',
      deeds: [
        { t: 'Let someone else tell the story, even if you were there.', at: 'anywhere' },
        { t: 'Do not correct somebody about something that does not matter.', at: 'anywhere' },
        { t: 'Touch your grandparents’ feet, or greet them their way.', at: 'home' },
        { t: 'Ask for help with something you said you could do.', at: 'school' },
        { t: 'Praise somebody who beat you.', at: 'school' },
        { t: 'Do the humblest job in the room without being asked.', at: 'home' }
      ]
    },
    vachan: {
      benefit: 'A person whose word is good gets asked. A person whose word is not gets left out, and never told why.',
      where: 'Raja Harishchandra, who is said to have given up everything rather than break his word, is the story Indian children are told about this. The Ramayana turns on Dasharatha’s promise. The Thirukkural treats a broken word as a debt.',
      deeds: [
        { t: 'Do the thing you said you would, on the day you said.', at: 'anywhere' },
        { t: 'Say no to something instead of saying yes and not doing it.', at: 'anywhere' },
        { t: 'Be on time for one thing you are usually late for.', at: 'anywhere' },
        { t: 'Keep a secret somebody trusted you with.', at: 'school' },
        { t: 'Give back what you borrowed, before being asked.', at: 'home' },
        { t: 'Finish the promise you half forgot about.', at: 'anywhere' }
      ]
    }
  },

  /* ---- DVANDVA — when two goods collide --------------------------------
     Twelve virtues, all good, never in tension, is a poster. The thinking a
     child actually has to do is between two RIGHT things, and this tradition
     is rich in exactly that: the Mahabharata is a hundred thousand verses of
     argument about dharma in conflict.

     No card is scored and none has a right answer. What each tradition tends
     to say is written from the inside and never ranked, and every one of these
     needs a named reviewer before it is anything but a draft. */
  needs_review: true,
  reviewer: null,
  dvandva: [
    { id: 'truth-kind', a: 'satya', b: 'karuna',
      scene: 'Your friend has made a painting and is very proud of it. You do not think it is good. They ask you straight out: do you like it?',
      ask: 'Which do you hold on to?',
      opts: ['Tell them the truth as gently as you can',
             'Find the true thing you CAN praise, and say that',
             'Say you like it — their day matters more than your opinion'],
      after: 'There is no scoring here. Notice what the second one does: it refuses to choose. A lot of Indian ethical writing looks for that third road rather than picking a side.',
      says: 'Ahimsa asks whether your words wound. Satya asks whether they are true. The Thirukkural, which treats both, does not resolve it for you.' },
    { id: 'brave-harm', a: 'sahas', b: 'ahimsa',
      scene: 'Somebody bigger is being cruel to a smaller child in the yard. Stopping them might mean a fight.',
      ask: 'What do you do?',
      opts: ['Step in physically and take what comes',
             'Stand between them and refuse to move, without hitting',
             'Get an adult, fast, even though it takes time'],
      after: 'The middle one is the harder trick and the one Gandhi spent a lifetime on: courage that does not become harm.',
      says: 'Every tradition here holds both courage and non-harm. They differ on what to do when only one can be had.' },
    { id: 'promise-kind', a: 'vachan', b: 'karuna',
      scene: 'You promised to go to a friend’s house. On the way, a neighbour who is very old needs help and it will take an hour.',
      ask: 'Which do you keep?',
      opts: ['The promise — you said you would',
             'The neighbour — the need is in front of you',
             'Stop, message your friend, then help'],
      after: 'Most real dilemmas dissolve when you tell the truth to the person you are about to let down. That is not a dodge; it is the work.',
      says: 'A broken word is treated as a debt in the Thirukkural. Seva says the need in front of you is the one that is yours.' },
    { id: 'forgive-just', a: 'kshama', b: 'satya',
      scene: 'Someone copied your homework and let you take the blame. They have said sorry. The teacher still thinks it was you.',
      ask: 'Now what?',
      opts: ['Forgive them and say nothing — it is done',
             'Forgive them, and tell them to tell the teacher themselves',
             'Tell the teacher what happened'],
      after: 'Forgiving somebody and letting them off the consequence are two different things. You can do the first without the second.',
      says: 'Michhami Dukkadam asks forgiveness of everyone every year. It does not ask you to pretend nothing happened.' },
    { id: 'seva-vidya', a: 'seva', b: 'vidya',
      scene: 'There is an exam tomorrow you have not finished revising for. Your family is cooking for fifty people at the gurudwara and is short of hands.',
      ask: 'Where do you go?',
      opts: ['Revise — the exam is yours to fail',
             'Go and help — the langar feeds people tonight',
             'Go for an hour, then revise'],
      after: 'Notice that "an hour" is a real answer and not a cop-out. Most of these are questions about proportion, not about which value wins.',
      says: 'Karma yoga in the Gita holds that the work is yours and the fruit is not. It does not say which work.' },
    { id: 'humble-true', a: 'namrata', b: 'satya',
      scene: 'A grown-up is telling your whole family a fact about your religion that you know is wrong.',
      ask: 'Do you say so?',
      opts: ['Correct them there and then',
             'Say nothing now, ask them about it privately after',
             'Say nothing — it is not your place'],
      after: 'Humility is not the same as silence. The second answer keeps both.',
      says: 'Kabir’s couplets are humble and blunt at once, which suggests these two were never meant to be opposites.' },
    { id: 'patience-brave', a: 'dhairya', b: 'sahas',
      scene: 'You have been picked last for a team all term. Today it happens again.',
      ask: 'Wait, or speak?',
      opts: ['Say nothing, keep turning up, get better',
             'Say out loud that it is not fair',
             'Ask the captain privately why'],
      after: 'Patience that never becomes a voice is just putting up with something. Courage without patience often arrives too early to work.',
      says: 'Endurance is treated as a strength in the Thirukkural rather than as a lack of one — but the epics are full of people who waited too long.' },
    { id: 'thanks-true', a: 'kritagyata', b: 'satya',
      scene: 'Someone gives you a present you do not like at all. They watch you open it.',
      ask: 'What comes out of your mouth?',
      opts: ['"Thank you, I love it"',
             '"Thank you — you thought of me"',
             'Say nothing about liking it, just thank them warmly'],
      after: 'The second one is entirely true AND entirely kind. Look for that shape; it is there more often than you expect.',
      says: 'Gratitude is for the giving, not the gift. That is how most of these traditions frame it.' }
  ],

  /* ---- GHAR KI BAAT — the question you take home -----------------------
     The strongest thing this app has is the grandparent at the other end of a
     video call, and docs/05 says "ask your family" outright.

     NO CHILD FREE TEXT, EVER. India's DPDP Act, COPPA and GDPR-K all point the
     same way and CLAUDE.md states it flatly: first name and an age band, and
     nothing else. So the answer is PICKED, never typed, and the last option is
     deliberately unrecorded — the interesting answers are the ones that do not
     fit our list, and those belong to the family and not to us. */
  ghar: [
    { v: 'ahimsa', q: 'Ask at home: is there a food nobody in our family eats, and why?',
      opts: ['Yes — and it goes back generations', 'Yes — someone chose it themselves', 'No, we eat everything', 'They told me something else'] },
    { v: 'satya', q: 'Ask a grandparent: what happened the time you told the truth and it cost you something?',
      opts: ['They had a story ready', 'They had to think about it', 'They said they would rather not', 'They told me something else'] },
    { v: 'karuna', q: 'Ask: who did our family look after when they had almost nothing themselves?',
      opts: ['A relative', 'A neighbour or a stranger', 'Nobody they can remember', 'They told me something else'] },
    { v: 'seva', q: 'Ask: what work does our family do for other people and take no money for?',
      opts: ['At a place of worship', 'For neighbours or relatives', 'Nothing regular', 'They told me something else'] },
    { v: 'dhairya', q: 'Ask: what is the longest anybody in our family waited for something they wanted?',
      opts: ['Years', 'Months', 'They said everybody waits', 'They told me something else'] },
    { v: 'buddhi', q: 'Ask: what is the cleverest thing anyone in our family ever did to get out of trouble?',
      opts: ['They laughed and told me', 'They said it was not clever, just lucky', 'Nobody could think of one', 'They told me something else'] },
    { v: 'sahas', q: 'Ask: who in our family did something frightening because it was right?',
      opts: ['Someone still alive', 'Someone before my grandparents', 'Nobody they know of', 'They told me something else'] },
    { v: 'kshama', q: 'Ask: has our family ever forgiven something big? Did it hold?',
      opts: ['Yes, and it held', 'Yes, and it did not', 'They would rather not say', 'They told me something else'] },
    { v: 'vidya', q: 'Ask: who was the first person in our family to go to school, and how far did they get?',
      opts: ['They knew exactly', 'They knew roughly', 'Nobody knows any more', 'They told me something else'] },
    { v: 'kritagyata', q: 'Ask: who helped our family when it mattered, and are they still thanked?',
      opts: ['Yes, we still talk about them', 'We lost touch', 'Nobody they can name', 'They told me something else'] },
    { v: 'namrata', q: 'Ask: what does our family do to greet an elder, and where did it come from?',
      opts: ['Touch their feet', 'Fold hands, say a name', 'Something regional or particular to us', 'They told me something else'] },
    { v: 'vachan', q: 'Ask: what promise in our family has been kept for the longest?',
      opts: ['Something to a person', 'Something to a place, a village or a temple', 'They could not think of one', 'They told me something else'] }
  ]
};
