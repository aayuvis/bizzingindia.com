/* family/bridge.js — the family's shared code, handed to a classic-script app.

   The four files beside this one are byte-for-byte copies of Bizzing_Schedule's
   integration/ (family standard §1, §8, §19): never edited here, never re-implemented.
   They are ES modules; this app is still classic scripts (docs/07), so this one module
   imports them and puts them where the classic code looks for them. A module runs after
   the page is parsed and before DOMContentLoaded — which is when app.js boots — so every
   caller finds them in place. Update them by copying the files again, nothing else.

     window.IND_WALLET          earn · spend · balance · migrateFrom · refund · ledger
     window.IND_ACTIVITY        trackActivity · trackMilestone
     window.IND_AVATAR_ENGINE   validate · stateOf · buy · buyWorld · sacredSafe · worldOf ·
                                worldOpen · TIERS · SHAPE · PACKS · PER_PACK · FREE_WORLDS · WORLD_PRICE
     window.IND_FEED_ENGINE     feedFor · order · hash · LIMIT — My Feed's one engine (app/feed.js
                                only adapts India's signals to it; docs/30) */
import * as wallet from './bizzing-wallet.js';
import * as activity from './bizzing-activity.js';
import * as avatars from './bizzing-avatars.js';

window.IND_WALLET = Object.assign({ KEY: 'bizzing.wallet' }, wallet);
window.IND_ACTIVITY = Object.assign({}, activity);
window.IND_AVATAR_ENGINE = Object.assign({}, avatars);

/* MY FEED (FAMILY-STANDARD §6a): the family's one feed engine. India keeps its own card look
   (family.css .fd-*), so bizzing-feed.css is carried, unedited, for the day it moves to the
   family card — and not linked. */
import * as feedKit from './bizzing-feed.js';
window.IND_FEED_ENGINE = Object.assign({}, feedKit);

/* THE SHELL (owner, 2 Oct 2026): Bizzing Bee's top bar, tabs, ☰ drawer and home grid as one
   measured drop-in, copied byte for byte like the rest. app.js renders every screen inside it. */
import * as shellKit from './bizzing-shell.js';
window.IND_SHELL = Object.assign({}, shellKit);
window.dispatchEvent(new CustomEvent('bz-family'));
