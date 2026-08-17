# The recording booth

For recording the 72 Hindi conversation lines in a real voice. You need Node and
Chrome. Nothing is uploaded anywhere — the page talks to a server on your own
machine and writes straight into this git checkout.

## Recording

```sh
node tools/gen-voice-script.js     # once
node tools/studio.js               # then open http://localhost:8123
```

Use **Chrome or Edge**. Both record Opus, which is about half the size of the old
MP3s at better quality. Safari records a bigger format and works, but if you have
the choice, use Chrome.

Each line shows the Hindi, the romanisation, the English, and which scene it
belongs to. Record it once in a woman's voice and once in a man's. Press the
button to start, press it again (or **Space**) to stop. Listen back; re-record
anything you don't like — a re-take replaces the old one, so there is nothing to
clean up afterwards.

**Takes are saved the moment you stop recording.** You can close the tab and come
back tomorrow; the page shows what is already done and picks up where you left off.

**Send to git** makes one commit of everything recorded so far. Push it yourself
when you are ready — the booth never pushes.

## What to record, and in what order

The list is ordered so the half that unblocks the app comes first:

| | | |
|---|---|---|
| **Prompts** | 72 lines | what Nani, the vendor or the teacher says |
| **Replies** | 72 lines | the child's own answer |
| *Options* | 216 lines | *optional* — the other choices on screen |

Prompts and replies are **144 lines, 288 takes**, and that is enough to make the
conversation stage work. The options matter for a child too young to read the
choices, but they can come later.

## Reading them

- Read at the speed you would speak to a child — not slowly, not clearly. A child
  learning to answer their grandmother needs to hear how their grandmother
  actually talks.
- The **prompt** is an adult speaking to a child. The **reply** is the child's own
  line: read it the way a six-year-old would say it.
- Leave about half a second of silence at the start and end. Don't trim; the app
  handles it.
- One take, one line. If you fluff it, stop and press record again.

## Where it goes

`app/voice/hi/d-07-p-f.webm` — dialogue 7, prompt, female voice.

The app prefers a human recording over the synthesised clip **always**, and falls
back to the synthesised one if a browser cannot play the file. Once both voices
exist for some lines, a woman's/man's voice switch appears in the app's Grown-ups
settings.

## If something goes wrong

- **"Could not load the script"** — run `node tools/gen-voice-script.js` first.
- **No microphone** — Chrome needs permission; check the address-bar icon.
- **Commit failed** — the booth runs `git add` and `git commit` in this checkout.
  If git is mid-rebase or the working tree is odd, sort that out and press Send
  again. Nothing is lost; the takes are already on disk.
