/* Bizzing India — THE SAGA · "Gattu & the Great Forgetting"
   ACT 1 · The Fading Village.

   Shape (mirrors Bizzing Bee's ACTS / CH_META / SB_SAGA_SCRIPT so tooling ports):

     window.IND_SAGA = { acts: [ {n, id, title, blurb, place, banner} ],
                         chapters: [ {n, act, title, world, blurb,
                                      engine, opts, script, reward:{kauris}} ] }
     window.IND_SAGA_SCRIPT = { <script-key>: { title, intro[], win[], lose[] } }

   A dialogue beat is [speakerId, 'line']. Speaker ids are either avatar ids from
   window.IND_AVATAR_NAMES (avatars.js) or one of the three mascots: gattu, mithu,
   vismriti. Act 1's cast is only the three — there is no village-folk avatar in the
   art set, and borrowing a courtier or a Panchatantra animal to play a farmer would
   be worse than staging the villagers in reported speech, which is what Gattu and
   Mithu do. The child of the village who finally tells the story is the player.

   `engine` is an id in window.IND_GAMES (games.js), contract engine(host, opts, done)
   -> done({win, score, kauris}). None of the four shipped engines read `opts`, so every
   chapter passes {} — the field is kept because the contract has it and later engines
   (and later acts) will want it.

   Editorial (docs/05, binding):
     · Badge 🪔 katha throughout. This is a told story, and it says so.
     · Amwa and its festival, Kahani Raat, are INVENTED — a fictional village for a
       fictional saga. No real festival, date, text or tradition is described, claimed
       or put in anyone's mouth. Chapter 3 and 4 lean on the festival/jataka engines,
       whose content is sourced in games.js; the dialogue around them makes no factual
       claim of its own.
     · Vismriti is an impersonal mist. It never threatens, never bargains, never
       addresses the child. It "speaks" only as village sentences coming apart —
       sad, not frightening. It is undone by telling, never by fighting.
     · No lives, no losing. Every `lose` beat is an invitation, never a scolding.
     · "Ask your family" is built in (ch3 win) and the act ends on many languages,
       not one — Kahani Raat is what THIS village calls it. */

window.IND_SAGA = {

  acts: [
    { n: 1, id: 'act1',
      title: 'The Fading Village',
      blurb: 'A village wakes up on the morning of its own festival and cannot remember what the festival is called. Gattu and Mithu have until the lamps are lit.',
      place: 'IN-MP',
      banner: 'art/banner/saga.jpg',
      badge: 'katha',
      age_gate: 4,
      recovers: 'That a story only survives if somebody tells it.' }
  ],

  chapters: [

    { n: 1, act: 'act1',
      title: 'Forty-One Empty Doorways',
      world: 'gond',
      blurb: 'Every door in the village should be wearing a rangoli by now. Every door is bare, and the woman who has drawn hers since she was six is standing in front of it with the colours in her hand.',
      engine: 'rangoli', opts: {}, script: 'ch1',
      badge: 'katha',
      reward: { kauris: 12 } },

    { n: 2, act: 'act1',
      title: 'The Bus With a Blank Board',
      world: 'chitrakatha',
      blurb: 'Tonight is the night everybody comes home. The bus that brings them has been standing at the turning for two hours, because nobody can remember where its passengers live now.',
      engine: 'statehunt', opts: {}, script: 'ch2',
      badge: 'katha',
      reward: { kauris: 14 } },

    { n: 3, act: 'act1',
      title: 'The Shop That Sold Everything',
      world: 'gond',
      blurb: 'Lamps, colours, kites, sugar and a bucket of water, all stacked outside one small shop — because the shopkeeper has given up asking what the festival needs.',
      engine: 'festival', opts: {}, script: 'ch3',
      badge: 'katha',
      reward: { kauris: 16 } },

    { n: 4, act: 'act1',
      title: 'The Endings Under the Tree',
      world: 'chitrakatha',
      blurb: 'The old stories are still here, every animal and every joke. It is the last lines that have gone — and the last line is the part you are supposed to carry home.',
      engine: 'jataka', opts: {}, script: 'ch4',
      badge: 'katha',
      reward: { kauris: 18 } },

    { n: 5, act: 'act1',
      title: 'The Night Somebody Told It',
      world: 'gond',
      blurb: 'Every lamp is filled. Every door has its pattern. The whole village is sitting in the courtyard waiting for someone to begin, and Mithu is not allowed to be the one.',
      engine: 'rangoli', opts: {}, script: 'ch5',
      badge: 'katha',
      reward: { kauris: 30 } }

  ]
};


window.IND_SAGA_SCRIPT = {

  /* ------------------------------------------------------------------ CH 1 */
  ch1: {
    title: 'Forty-One Empty Doorways',
    intro: [
      ['gattu', 'Somebody told me about this village once. Amwa. Forty-one houses, one mango grove, one well with a chip out of the rim. I have never been here in my life and I remember all of it.'],
      ['mithu', 'And I can smell lamp oil, which means it is the morning of their festival, which means every one of those forty-one doorways should have a rangoli in front of it by now. Big ones. Show-off ones. My favourite kind.'],
      ['gattu', 'Mithu. The doorways are empty.'],
      ['mithu', 'I asked the aunty at the second house why. She said she would start hers the moment she remembered how it went. She has drawn that pattern every year since she was six years old. She is holding the colours right now.'],
      ['vismriti', 'first the dot in the middle… then four dots… then four… then… then the…'],
      ['gattu', 'It is not angry. It is not anything at all. That is the strange part — it just sits on a thing until the thing goes quiet. Come on. She only needs to see it once. Watch the pattern, hold it in your head, and put it back down on the ground where she can see it too.']
    ],
    win: [
      ['mithu', 'She looked at it for about four seconds and her hands took over. Then she did the next house herself. Then the one after that.'],
      ['gattu', 'Forty-one doorways. By the time we reached the well there were three children on their knees copying her, and one of them was doing it better.'],
      ['mithu', 'That is the whole trick of a rangoli, you know. Nobody ever wrote it down. They just draw it on the ground, in front of the house, exactly where the children walk past. That is the entire filing system, and it has never once crashed.']
    ],
    lose: [
      ['mithu', 'Nope! Not that one. Nor the eleven I got wrong before I got good, and I have never mentioned those to anybody, so we are even.'],
      ['gattu', 'Look at one half only. The other half is the same half, standing in a mirror. Take your time — the aunty is not going anywhere and neither am I.']
    ]
  },

  /* ------------------------------------------------------------------ CH 2 */
  ch2: {
    title: 'The Bus With a Blank Board',
    intro: [
      ['mithu', 'Ha! Now this is the good part. Amwa’s festival is the night everybody comes back. Every son, every daughter, every cousin who moved away for work — one night, one grove, one enormous dinner and somebody’s uncle falling asleep in a chair.'],
      ['gattu', 'Eleven of them are on the bus at the turning. It has been standing there for two hours with its engine running.'],
      ['mithu', 'The board on the front has gone blank. The driver keeps wiping it with his sleeve, like the words have only smudged.'],
      ['vismriti', 'from the place where the sun comes up first… from the place where the sun… from the place where…'],
      ['gattu', 'He knows all eleven by name. He knows what they were like as children. He simply cannot remember where any of them live now.'],
      ['mithu', 'Right. You have got a map in your head and I have got a very loud beak. Work out the state from what he remembers about it, and I will shout it out of the window until he writes it down.']
    ],
    win: [
      ['gattu', 'The board is full. Eleven names, eleven states. He read it out twice because he liked the sound of it.'],
      ['mithu', 'Look at that bus. Somebody on it has come from tea gardens, somebody from a coast, somebody from a city so cold in December she has packed a shawl for August.'],
      ['gattu', 'Dinner tonight has rice from three states in it and four different words for grandmother.']
    ],
    lose: [
      ['mithu', 'Wrong turning! It happens. I once flew to Bhopal when I meant Bhubaneswar and I have never told a living soul, so please forget I said that.'],
      ['gattu', 'Read the clue again like it is a riddle, because it is one. The bus is not leaving without us.']
    ]
  },

  /* ------------------------------------------------------------------ CH 3 */
  ch3: {
    title: 'The Shop That Sold Everything',
    intro: [
      ['gattu', 'The shop at the corner has put out lamps, colours, kites, sugar, marigolds and a bucket of water. All of it. At the same time.'],
      ['mithu', 'Because he has stopped asking. Nobody can tell him what they need tonight, so he is selling the whole of India at once and hoping.'],
      ['gattu', 'A boy asked his mother what the festival is called. She opened her mouth, and there was nothing in it. She was more surprised than he was.'],
      ['vismriti', 'it is the one where we… every year on the night of the… we all go down to the…'],
      ['mithu', 'Fine. FINE. We do this the long way, and luckily the long way is my best subject. Every festival in this country, and what it is actually for — the lights one, the colours one, the boat one, the one with the drums that go all night.'],
      ['gattu', 'Ask why. Where and when come loose. Why is the part that stays.']
    ],
    win: [
      ['gattu', 'Twelve festivals. Different months, different states, different reasons — and every single one of them is a day somebody decided to remember something out loud.'],
      ['mithu', 'And the shopkeeper has just sold four lamps and one kite to a man who suddenly knows exactly which he needs. Do not ask me how. He would not say.'],
      ['mithu', 'Go and ask your own family what yours is for, by the way. Ask two people. You will get two different answers, and the funny thing is they are both right — that is how big these things are.']
    ],
    lose: [
      ['mithu', 'Not that one — but I like the way you thought about it. Festivals are sneaky. Two of them can share a month and mean completely different things.'],
      ['gattu', 'Try another. There is no hurry in here at all; the lamps do not get lit until dark.']
    ]
  },

  /* ------------------------------------------------------------------ CH 4 */
  ch4: {
    title: 'The Endings Under the Tree',
    intro: [
      ['gattu', 'They sit under the mango tree after dark. That is where the telling happens, always has. I am carrying six hundred and forty stories that began under a tree like this one.'],
      ['mithu', 'Six hundred and forty. Adorable. Anyway — the stories are all still here. Every animal, every joke, every good bit.'],
      ['gattu', 'It is the endings. Listen.'],
      ['vismriti', 'and the crocodile said… and the little monkey said… and that is why you should always… that is why you should always'],
      ['mithu', 'That is what it takes first, every time. Not the animals. Not the jokes. The last line — the bit you are meant to carry home in your pocket.'],
      ['mithu', 'So I shall tell them. Properly. With the voices. You find the last line and say it back, and once it is said out loud it is back for good.']
    ],
    win: [
      ['mithu', 'Six tales. Six last lines. All of them said out loud, all of them stuck, and my crocodile was magnificent.'],
      ['gattu', 'Now the children under the tree know the endings again. Tomorrow one of them will tell it slightly wrong, and somebody will interrupt to correct them.'],
      ['gattu', 'That is not a problem, Mithu. That is exactly how it survives.']
    ],
    lose: [
      ['gattu', 'That is not the lesson — but it is a good guess, and guessing is what listening properly feels like from the inside.'],
      ['mithu', 'Shall I tell it again? I shall tell it again. I have been wanting another go at that crocodile.']
    ]
  },

  /* ------------------------------------------------------------------ CH 5 */
  ch5: {
    title: 'The Night Somebody Told It',
    intro: [
      ['gattu', 'Every lamp in Amwa is filled. Every doorway has its pattern. Eleven people came home on the bus and one of them is already asleep in a chair.'],
      ['gattu', 'And the courtyard has been quiet for ten whole minutes, because nobody can remember how it starts.'],
      ['mithu', 'I could start it. I could start it BEAUTIFULLY. I would have them crying by the second lamp, and I would not even be showing off, much.'],
      ['gattu', 'You cannot, Mithu. It is not your village.'],
      ['mithu', '…No. It is not. And a story told by a visitor is a lovely evening. A story told by somebody who belongs here is a festival. There is a difference and it is the whole difference.'],
      ['gattu', 'You have been carrying it since the doorway — the pattern, the road, the endings under the tree. Here they tell it by drawing it, big, in the middle of the courtyard, where everyone can see. So put it down. All of it. And say the name at the end.']
    ],
    win: [
      ['mithu', 'KAHANI RAAT. You said it out loud in the middle of the courtyard and forty-one people said it straight back, as if they had never once let go of it.'],
      ['gattu', 'Kahani Raat. The night of the telling. That is what this village calls it. Other villages have their own night and call it something else, in their own language, and every one of those names is the right one.'],
      ['mithu', 'And now you know what Vismriti actually eats. Not stories — stories are tough, stories are leather. It eats the quiet in between the times somebody says them out loud.'],
      ['gattu', 'A story only survives if someone tells it. That is the whole rule. There is no second rule.'],
      ['gattu', 'Mithu. The grey is off Amwa — look at the map. But look north-west, where the river goes. There is a city under the ground there, and nobody living has ever heard it speak.']
    ],
    lose: [
      ['mithu', 'The lamps will wait. They have waited this long and they are not going anywhere, and I will hum something until you are ready.'],
      ['gattu', 'Nothing is lost. It is only not down on the ground yet. Begin again.']
    ]
  }

};
