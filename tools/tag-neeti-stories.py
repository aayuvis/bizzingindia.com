#!/usr/bin/env python3
"""Map the story corpus onto the twelve values, by what each story's own moral
says.

Every story in this app already carries a `moral` — the line it leaves behind —
and that is the honest key. A value used to link one or two stories by hand;
there are 344 morals sitting there unused.

This SUGGESTS, it does not decide. It writes a review file with the matched
phrase beside every hit so a person can strike the wrong ones out; the shipped
mapping is whatever survives that. Keyword lists are deliberately narrow —
a loose list would put every story under every value and be worth nothing.
"""
import io, json, os, re, subprocess, sys

KEYS = {
    'ahimsa':     ['not hurt', 'without hurting', 'harm', 'cruel', 'kind to animal', 'spare', 'gentle', 'violence', 'kill'],
    'satya':      ['truth', 'true', 'honest', 'lie', 'lied', 'liar', 'pretend', 'deceiv', 'trick'],
    'karuna':     ['kind', 'kindness', 'pity', 'mercy', 'compassion', 'feel for', 'suffering', 'help the'],
    'seva':       ['serve', 'service', 'without being asked', 'for nothing', 'give away', 'feed', 'share'],
    'dhairya':    ['patien', 'wait', 'slow', 'steady', 'keep going', 'endure', 'persever', 'again and again'],
    'buddhi':     ['clever', 'wit', 'wisdom', 'think', 'thought', 'cunning', 'outwit', 'plan', 'sense'],
    'sahas':      ['brave', 'courage', 'fear', 'afraid', 'stood up', 'stand up', 'dare'],
    # FORGIVENESS IS THE CORPUS'S THIN SPOT. Only a handful of the 344 stories
    # are about it, and no widening of this list changes that — what turns up
    # instead is anger, which is the same subject seen from the near side.
    # Reported rather than padded: kshama wants stories written for it.
    'kshama':     ['forgiv', 'pardon', 'second chance', 'grudge', 'let go of',
                   'sorry', 'apolog', 'revenge', 'anger', 'angry', 'made peace'],
    'vidya':      ['learn', 'taught', 'teach', 'school', 'study', 'knowledge', 'read'],
    'kritagyata': ['grateful', 'gratitude', 'thank', 'remember who', 'repaid', 'repay'],
    # 'small' and 'quiet' were in here and had to come out: they matched fifty
    # stories about being physically small, which is size and not humility.
    'namrata':    ['humble', 'humility', 'boast', 'brag', 'show off', 'showing off',
                   'arrogan', 'vain', 'swagger', 'too pleased with'],
    'vachan':     ['promise', 'word', 'vow', 'swore', 'oath', 'kept his', 'kept her'],
}
MAX_PER_VALUE = 10

def load_stories(app):
    """Read the corpus through node, which is the only thing that can parse it."""
    js = r'''
      global.window = {};
      const fs = require('fs');
      fs.readdirSync(process.argv[1]).filter(f => /^data-stories/.test(f))
        .forEach(f => { try { eval(fs.readFileSync(process.argv[1] + '/' + f, 'utf8')
          .replace(/window\./g, 'global.window.')); } catch (e) {} });
      let all = [];
      Object.keys(global.window).forEach(k => { const v = global.window[k];
        if (Array.isArray(v) && v[0] && v[0].id && v[0].title) all = all.concat(v); });
      console.log(JSON.stringify(all.map(s => ({ id: s.id, title: s.title,
        moral: s.moral || '', hook: s.hook || '', collection: s.collection || '' }))));
    '''
    out = subprocess.run(['node', '-e', js, app], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

def main():
    app = os.path.join(os.path.dirname(__file__), '..', 'app')
    stories = load_stories(app)
    hits, review = {}, []
    for vid, words in KEYS.items():
        scored = []
        for s in stories:
            hay = (s['moral'] + ' ' + s['hook']).lower()
            # WORD STARTS, NOT SUBSTRINGS. A plain `in` put "anger" inside
            # "stranger" and filed three stories about hospitality under
            # forgiveness. Anchoring to a word boundary keeps the stems
            # working — "forgiv" still catches forgive and forgiving — while
            # a keyword can no longer hide in the middle of another word.
            found = [w for w in words if re.search(r'\b' + re.escape(w), hay)]
            if not found:
                continue
            # a hit in the MORAL is worth more than one in the hook: the moral is
            # the story's own claim about what it leaves behind
            weight = len(found) + (2 if any(re.search(r'\b' + re.escape(w), s['moral'].lower())
                                             for w in found) else 0)
            scored.append((weight, s, found))
        scored.sort(key=lambda t: -t[0])
        keep = scored[:MAX_PER_VALUE]
        hits[vid] = [s['id'] for _, s, _ in keep]
        review.append('## ' + vid + '  (' + str(len(scored)) + ' matched, keeping ' + str(len(keep)) + ')')
        for w, s, found in keep:
            review.append('  [%2d] %-24s %s' % (w, s['id'], s['moral'][:88]))
            review.append('       matched: ' + ', '.join(found))
        review.append('')

    out = os.path.join(app, 'data-neeti-stories.js')
    body = ',\n'.join('  ' + json.dumps(v) + ': ' + json.dumps(ids) for v, ids in hits.items())
    io.open(out, 'w', encoding='utf-8').write(
        '/* GENERATED by tools/tag-neeti-stories.py — do not hand-edit.\n'
        ' * Which stories carry which value, taken from each story\'s OWN moral.\n'
        ' * A value used to link one or two stories chosen by hand while 344 morals\n'
        ' * sat unused. Suggested by keyword, then read: see the review file the\n'
        ' * tool prints beside it. Re-run after adding stories. */\n'
        'window.IND_NEETI_STORIES = {\n' + body + '\n};\n')
    io.open(os.path.join(os.path.dirname(__file__), '..', 'docs',
                         'neeti-story-tags.txt'), 'w', encoding='utf-8').write('\n'.join(review))
    total = sum(len(v) for v in hits.values())
    print('tagged %d links across %d values (%d stories in the corpus)' % (total, len(hits), len(stories)))
    for v, ids in hits.items():
        print('  %-12s %d' % (v, len(ids)))

if __name__ == '__main__':
    main()
