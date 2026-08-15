"""Restore alpha on the avatar tiles.

Two different problems:
 1. The 11 adopted from Bizzing Bee were converted webp -> PNG by compositing
    onto white, which threw away a perfectly good alpha channel. Re-convert
    from source.
 2. The 37 Gemini tiles were generated on a white studio background. Flood-fill
    the surround from the edges so the character keeps its own whites (a heron,
    Gandhi's shawl, the Buddha's robe) while the background goes clear.
"""
import os, glob, sys
from PIL import Image
from collections import deque

SRC = '/tmp/bblive/avatars'
ART = 'app/art'
ADOPTED = {'ganesha':'ganesha','krishna':'krishna','hanuman':'hanuman','durga':'durga',
           'saraswati':'saraswati','shiva':'shiva','rama':'rama','lakshmi':'lakshmi',
           'buddha':'buddha','gandhi':'gandhi','aryabhatta':'aryabhata'}

def reconvert_adopted():
    n = 0
    for s, d in ADOPTED.items():
        p = os.path.join(SRC, s + '.webp')
        if not os.path.exists(p):
            print('  missing source', s); continue
        im = Image.open(p).convert('RGBA').resize((256, 256), Image.LANCZOS)
        im.save(os.path.join(ART, d + '.png'), 'PNG', optimize=True)
        n += 1
    return n

def dealpha(path, tol=18):
    """Flood-fill near-white inward from the border only."""
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q = deque()
    def white(x, y):
        r, g, b, a = px[x, y]
        return a > 0 and r >= 255 - tol and g >= 255 - tol and b >= 255 - tol
    for x in range(w):
        for y in (0, h - 1):
            if not seen[y * w + x] and white(x, y): q.append((x, y)); seen[y * w + x] = 1
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y * w + x] and white(x, y): q.append((x, y)); seen[y * w + x] = 1
    cleared = 0
    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0); cleared += 1
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and white(nx, ny):
                seen[ny * w + nx] = 1; q.append((nx, ny))
    im.save(path, 'PNG', optimize=True)
    return cleared

if __name__ == '__main__':
    print('re-converted from source (alpha preserved):', reconvert_adopted())
    done = 0
    for f in sorted(glob.glob(os.path.join(ART, '*.png'))):
        if os.path.basename(f)[:-4] in ADOPTED.values(): continue
        c = dealpha(f)
        if c: done += 1
    print('background cleared on:', done, 'tiles')
