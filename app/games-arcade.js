/* Bizzing India — the board games: LUDO, with SAAP-SIDI inside it (games spec §4.6).

   One card, two boards, both Indian by birth, and both say so on their start screen:

     ludo     · Ludo — Pachisi in a British suit. The cross-and-circle race
                is centuries older than the boxed export.
     saapsidi · Saap-Sidi — began as Gyan Chaupar / Moksha Patam, where every
                ladder was a virtue and every snake a slip. Here the ladders
                get their old names back (Daya, Seva, Satya, Himmat, Vidya)
                and the snakes are gentle slips (Krodh, Jhooth, Lalach, Aalas,
                Ghamand) — a slide and a smile, never a lecture. It is the
                second mode inside Ludo's card now (spec §3.1); its own entry
                stays registered with hide:true, so an old link still opens —
                on Ludo's Saap-Sidi tab.

   Contract (docs/32-games-contract.md): played for fun — teaches:false, no
   answer() reports (so the host shows no counter), and done({win, score,
   asked:0, firstTryRight:0}) pays nothing. Extended cover contract for the
   shelf: each entry also carries
     tag         — short chip ('Board' / 'Race')
     c, c2       — two hexes for the cover gradient
     scene       — a self-animating 48x48 SVG string; all motion lives inside
                   the SVG via inline animations whose @keyframes are in the
                   injected CSS below (arc- prefix), so the shelf needs nothing.

   THE 2026 REDESIGN. The first build of these two boards was rejected flat,
   and deservedly: half its CSS pointed at tokens that do not exist in
   tokens.css (--surface, --bg2), so cells painted transparent and the whole
   thing read as a spreadsheet. This version draws both boards as crafted
   objects:
     · Saap-Sidi is one warm painted board — cream-and-marigold checker in a
       terracotta frame, tapered patterned snakes with real heads, wooden
       ladders with perspective rails, a diya glowing on square 100, and the
       virtue/slip names lettered at each foot and head.
     · Ludo is the classic four-colour cross, drawn from the app's own tokens:
       two live quadrants (indigo and marigold), two greyed elegantly, star
       safe cells, a centre rosette, ringed avatar tokens.
     · Both boards MEASURE the viewport on mount and scale themselves so the
       whole board + die + player chips fit without page scroll, phones up.
     · The die is a real die — pips, a tumble — and the child's own buddy
       avatar rides in their token.

   House rules honoured throughout:
     · EVERY game plays fully with keyboard AND with touch/mouse, with no
       prior click needed (focus lands on the primary control on mount and a
       document-level Space/Enter catch-all backs it up).
     · prefers-reduced-motion is respected (walks jump, nothing pulses).
     · No lives, no shaming. Gattu rolls the same fair die you do.
     · Teardown removes every document/window listener and timer.

   Registers by PUSHING into window.IND_GAMES — this file loads after games.js
   and never redefines the array. Plain script, no modules, no build. */

(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : null;
  if (!W) return;
  var D = W.document || null;
  /* games.js owns the registry; with no array there is nothing to join. */
  if (!W.IND_GAMES) return;

  /* ==================================================================
     STYLE — injected once, everything scoped under .arc-
     Only tokens that actually exist in tokens.css are referenced:
     --ground --card --card2 --line --line2 --text --text2 --muted
     --accent --accent-soft --accent2 --accent3 --good --mist
     --display --body --radius-* --space-* --shadow
     The Saap-Sidi board interior uses literal warm pigments on purpose:
     it is a painted wooden object and stays the same board in every world
     and at night, the way a real one on the shelf would.
     ================================================================== */

  var CSS = [
    '.arc-wrap{display:flex;flex-direction:column;gap:10px;color:var(--text);font-family:var(--body,system-ui,sans-serif);-webkit-tap-highlight-color:transparent}',
    '.arc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:34px}',
    '.arc-top b{display:block;font:800 18px/1.1 var(--display,Georgia,serif);letter-spacing:-.01em}',
    '.arc-kicker{display:block;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}',
    '.arc-leave{flex:none;cursor:pointer;border:1px solid var(--line2);background:var(--card);color:var(--text2);border-radius:999px;padding:7px 14px;font:700 13px var(--body,inherit)}',
    '.arc-leave:hover{border-color:var(--accent);color:var(--accent)}',
    '.arc-leave:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.arc-stage{position:relative}',

    /* the one calm status line — whose turn, what rolled, what next */
    '.arc-feed{min-height:40px;margin:0;display:flex;align-items:center;justify-content:center;text-align:center;font:600 14.5px/1.35 var(--body,inherit);color:var(--text2)}',
    '.arc-feed.good{color:var(--good)}',
    '.arc-feed.warm{color:var(--accent3)}',
    '.arc-hint{font-size:12.5px;color:var(--muted);text-align:center;margin:10px 0 0}',
    '.arc-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
    '.arc-btn{cursor:pointer;min-height:46px;padding:11px 22px;border-radius:999px;border:1px solid var(--accent);background:var(--accent);color:#fff;font:700 15px var(--body,inherit)}',
    '.arc-btn.ghost{background:var(--card);color:var(--text);border-color:var(--line2)}',
    '.arc-btn:hover:not(:disabled){filter:brightness(1.06)}',
    '.arc-btn:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.arc-btn:disabled{opacity:.5;cursor:default}',

    /* intro & finish cards */
    '.arc-intro{text-align:center;max-width:520px;margin:0 auto}',
    '.arc-intro p{margin:0 0 8px;font-size:15px;line-height:1.6;color:var(--text)}',
    '.arc-intro .arc-heritage{color:var(--muted);font-size:14px;font-style:italic}',
    '.arc-art{display:flex;justify-content:center;margin:2px auto 10px}',
    '.arc-art img,.arc-art svg{display:block;width:92px;height:92px;border-radius:20px}',
    '.arc-done{text-align:center}',
    '.arc-done h3{font:800 24px var(--display,Georgia,serif);margin:6px 0 4px}',
    '.arc-done p{margin:0 0 4px;font-size:15.5px;line-height:1.55;color:var(--muted)}',
    '.arc-tally{display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center;margin:12px 0 2px}',
    '.arc-chip{background:var(--card2);border:1px solid var(--line);border-radius:999px;padding:7px 16px;font:700 14px var(--body,inherit)}',
    '.arc-chip b{color:var(--accent3);font-size:17px}',

    /* shared in-game bar: player chip · die · player chip */
    '.arc-bar{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:nowrap;margin:0 0 10px}',
    '.arc-pl{display:inline-flex;gap:8px;align-items:center;background:var(--card2);border:1.5px solid var(--line);border-radius:999px;padding:4px 13px 4px 5px;color:var(--text2);min-width:0}',
    '.arc-pl .face{flex:none;width:30px;height:30px;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center;font:800 14px var(--body,inherit);color:#fff}',
    '.arc-pl .face img{width:100%;height:100%;object-fit:cover;display:block}',
    '.arc-pl.you .face{box-shadow:0 0 0 2px var(--accent)}',
    '.arc-pl.you .face span{background:var(--accent)}',
    '.arc-pl.gattu .face{box-shadow:0 0 0 2px var(--accent2)}',
    '.arc-pl .tag{display:flex;flex-direction:column;min-width:0}',
    '.arc-pl [data-n]{font:700 11.5px/1.25 var(--body,inherit);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:11ch;color:var(--muted)}',
    '.arc-pl [data-t]{font:800 13.5px/1.25 var(--body,inherit);white-space:nowrap;color:var(--text2)}',
    '.arc-pl.now{border-color:var(--accent);background:var(--accent-soft)}',
    '.arc-pl.now [data-n],.arc-pl.now [data-t]{color:var(--text)}',
    '.arc-pl.gattu.now{border-color:var(--accent2)}',
    /* on short screens the title row bows out during play — the board is the title */
    '@media(max-height:760px){.arc-wrap.playing .arc-top{display:none}}',

    /* the die — a physical object: pips, bevel, tumble */
    '.arc-die{flex:none;position:relative;width:54px;height:54px;border-radius:14px;border:1px solid rgba(60,40,10,.22);cursor:pointer;padding:0;',
      'background:linear-gradient(148deg,#fffdf6 8%,#f4ecd8 60%,#e7dabd 100%);',
      'box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18)}',
    '.arc-die:disabled{cursor:default;filter:saturate(.6);opacity:.72;box-shadow:0 2px 5px rgba(30,20,70,.14),inset 0 -3px 6px rgba(120,85,25,.12)}',
    '.arc-die:focus-visible{outline:3px solid var(--accent2);outline-offset:3px}',
    '.arc-die:not(:disabled):hover{filter:brightness(1.04)}',
    '.arc-die.ready:not(:disabled){animation:arc-nudge 1.6s ease-in-out infinite}',
    '.arc-die.roll{animation:arc-tumble .55s cubic-bezier(.35,.9,.4,1)}',
    '.arc-pip{position:absolute;width:19%;height:19%;border-radius:50%;transform:translate(-50%,-50%);',
      'background:radial-gradient(circle at 36% 32%,#4d3f6e 0%,#241a3f 70%);box-shadow:inset 0 1px 2px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.5)}',
    '@keyframes arc-tumble{0%{transform:rotate(0) translateY(0) scale(1)}22%{transform:rotate(-16deg) translateY(-9px) scale(1.08)}',
      '52%{transform:rotate(11deg) translateY(2px) scale(.97)}78%{transform:rotate(-5deg) translateY(-2px)}100%{transform:rotate(0) translateY(0) scale(1)}}',
    '@keyframes arc-nudge{0%,100%{box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18),0 0 0 0 var(--accent-soft)}',
      '50%{box-shadow:0 4px 10px rgba(30,20,70,.20),inset 0 2px 3px rgba(255,255,255,.9),inset 0 -4px 7px rgba(120,85,25,.18),0 0 0 7px var(--accent-soft)}}',

    /* -------- Pachisi: six cowries in place of the die (a tray of shells, tapped or Space) -------- */
    '.arc-die.lu-cow{width:auto;min-width:112px;height:58px;padding:4px 8px;display:grid;grid-template-columns:repeat(3,22px);grid-auto-rows:24px;gap:2px 8px;justify-content:center;align-content:center;',
      'background:radial-gradient(120% 120% at 50% 30%,#a13a2a 0%,#7a1f1a 70%);border-color:#4a120e;border-radius:16px}',
    '.lu-cw{display:block;width:18px;height:23px;margin:auto;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}',
    '.lu-cowtab{border-collapse:collapse;margin:6px auto 2px;font:700 13px/1.3 var(--body,inherit);color:var(--text)}',
    '.lu-cowtab caption{font:600 12.5px/1.4 var(--body,inherit);color:var(--text2);padding-bottom:4px}',
    '.lu-cowtab th{font:800 11px var(--body,inherit);text-align:left;color:var(--muted);padding:3px 6px 3px 0;white-space:nowrap}',
    '.lu-cowtab td{min-width:30px;text-align:center;padding:4px 3px;border:1px solid var(--line2);background:var(--card)}',
    '.lu-cowtab td.g{background:var(--accent-soft)}',
    '.lu-cowtab td small{display:block;font:600 9.5px var(--body,inherit);color:var(--text2)}',
    '.lu-src{margin:6px 0 0;font-size:11.5px;line-height:1.45;color:var(--muted);text-align:center}',

    /* -------- Saap-Sidi board -------- */
    '.arc-sswrap{position:relative;width:100%;max-width:480px;margin:0 auto;border-radius:12px;box-shadow:var(--shadow-lg,0 12px 40px rgba(30,20,70,.12))}',
    '.arc-sswrap svg{display:block;width:100%;height:auto;border-radius:12px}',
    '.arc-ssnum{font:700 3px var(--body,sans-serif);fill:#96702f;user-select:none}',
    '.arc-ssnum.hot{fill:#7c4a1d}',
    '.arc-sslabel{font:800 2.5px var(--body,sans-serif);user-select:none}',

    /* tokens: ringed avatar discs riding above the painted board */
    '.arc-tok{position:absolute;width:8.6%;aspect-ratio:1/1;transform:translate(-50%,-56%);pointer-events:none;',
      'transition:left .13s linear,top .13s linear}',
    '.arc-tok.you{z-index:5}.arc-tok.gattu{z-index:4}',
    '.arc-tokface{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center;',
      'font:800 13px var(--body,inherit);color:#fff;',
      'box-shadow:0 0 0 2px #fff,0 3px 7px rgba(40,20,5,.4)}',
    '.arc-tok.you .arc-tokface{border:2.5px solid var(--accent)}',
    '.arc-tok.gattu .arc-tokface{border:2.5px solid var(--accent2)}',
    '.arc-tokface img{width:100%;height:100%;object-fit:cover;display:block}',
    '.arc-tokface span{width:100%;height:100%;display:grid;place-items:center}',
    '.arc-tok.you .arc-tokface span{background:var(--accent)}',
    '.arc-tok.gattu .arc-tokface span{background:var(--accent2)}',

    /* the moment banner: a virtue lifts / a slip slides — said plainly */
    '.arc-toast{position:absolute;left:50%;bottom:5%;transform:translate(-50%,10px);opacity:0;z-index:6;pointer-events:none;',
      'transition:opacity .28s ease,transform .28s ease;background:rgba(43,26,11,.93);color:#ffe9c2;',
      'border:1px solid rgba(230,185,92,.55);border-radius:12px;padding:7px 15px;max-width:92%;',
      'font:600 12.5px/1.45 var(--body,inherit);text-align:center}',
    '.arc-toast b{display:block;font-weight:800;font-size:12.5px;letter-spacing:.05em}',
    '.arc-toast.lad b{color:#9fe6b7}',
    '.arc-toast.snk b{color:#ffb89b}',
    '.arc-toast.show{opacity:1;transform:translate(-50%,0)}',

    /* -------- Ludo board -------- */
    '.arc-lwrap{width:100%;max-width:480px;margin:0 auto}',
    '.arc-lsvg{display:block;width:100%;height:auto}',
    '.arc-ltok{transition:transform .16s linear}',
    '.arc-ltok.ride{transition:transform .75s cubic-bezier(.4,0,.25,1)}',
    '.arc-ltok .hit{pointer-events:all}',
    '.arc-ltok .halo{fill:none;stroke:var(--accent3);stroke-width:.1;opacity:0}',
    '.arc-ltok.live{cursor:pointer}',
    '.arc-ltok.live .halo{opacity:.75;animation:arc-halo 1s ease-in-out infinite alternate}',
    '.arc-ltok.sel .halo{opacity:1;stroke-width:.16;animation:none}',
    '@keyframes arc-halo{from{stroke-opacity:.35}to{stroke-opacity:1}}',

    /* -------- cover-scene keyframes (the shelf injects the SVG strings;
       the motion is defined here so the covers animate anywhere) -------- */
    '@keyframes arc-pulse{from{opacity:.35}to{opacity:.95}}',
    '@keyframes arc-climb{0%{transform:translate(0,0) rotate(0deg);opacity:0}12%{opacity:1}',
    '50%{transform:translate(5px,-13px) rotate(180deg)}88%{opacity:1}100%{transform:translate(10px,-26px) rotate(360deg);opacity:0}}',
    '@keyframes arc-sway{from{transform:translateX(-1.4px)}to{transform:translateX(1.4px)}}',
    '@keyframes arc-hop{0%{transform:translate(0,0);opacity:0}10%{transform:translate(0,0);opacity:1}',
    '25%{transform:translate(9px,-5px)}40%{transform:translate(18px,0)}60%{transform:translate(27px,-5px)}',
    '80%{transform:translate(36px,0);opacity:1}100%{transform:translate(36px,0);opacity:0}}',
    '@keyframes arc-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',

    /* -------- Ludo's card: the start screen, the seats, the moves -------- */
    '.lu-wrap>.arc-feed{display:none}',
    '.lu-setup{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:8px}',
    '.lu-seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px;border-radius:999px;background:var(--card2);border:1px solid var(--line2)}',
    '.lu-segb{min-height:46px;border:0;border-radius:999px;background:transparent;color:var(--text2);font:800 15px var(--body,inherit);cursor:pointer;padding:6px 10px}',
    '.lu-segb small{display:block;font:600 11px var(--body,inherit);color:var(--muted)}',
    '.lu-segb.on{background:var(--accent);color:#fff}.lu-segb.on small{color:rgba(255,255,255,.85)}',
    '.lu-lab{margin:8px 0 0;font:800 11px var(--body,inherit);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}',
    '.lu-note{margin:0;font-size:13.5px;line-height:1.5;color:var(--text2)}',
    '.lu-lens,.lu-tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.lu-len,.lu-tier{min-height:64px;text-align:left;cursor:pointer;border:1.5px solid var(--line2);border-radius:14px;background:var(--card);color:var(--text);padding:8px 10px;display:flex;flex-direction:column;gap:2px}',
    '.lu-len b,.lu-tier b{font:800 15px var(--body,inherit)}.lu-len b small{font-weight:600;color:var(--muted)}',
    '.lu-len span,.lu-tier span{font-size:12px;line-height:1.3;color:var(--muted)}',
    '.lu-len.on,.lu-tier.on{border-color:var(--accent);background:var(--accent-soft);box-shadow:inset 0 0 0 1px var(--accent)}',
    '.lu-count{display:flex;gap:8px}',
    '.lu-cnt{width:52px;min-height:44px;border-radius:12px;border:1.5px solid var(--line2);background:var(--card);color:var(--text);font:800 17px var(--body,inherit);cursor:pointer}',
    '.lu-cnt.on{border-color:var(--accent);background:var(--accent);color:#fff}',
    '.lu-seats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.lu-seat{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:14px;background:var(--card);border:1.5px solid var(--line);border-left:6px solid var(--sc)}',
    '.lu-colb{flex:none;min-width:44px;min-height:44px;border-radius:12px;border:1.5px solid var(--line2);background:var(--card2);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:2px 6px;color:var(--text2);font:700 10.5px var(--body,inherit)}',
    '.lu-colb i{width:18px;height:18px;border-radius:50%;background:var(--sc);box-shadow:inset 0 -2px 0 rgba(0,0,0,.2)}',
    '.lu-face{flex:none;width:40px;height:40px;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 2.5px var(--sc)}',
    '.lu-face img{width:100%;height:100%;object-fit:cover;display:block}',
    '.lu-face>span{width:100%;height:100%;display:grid;place-items:center;background:var(--sc);color:#fff;font:800 17px var(--body,inherit)}',
    '.lu-face.big{width:84px;height:84px;margin:0 auto 4px;box-shadow:0 0 0 4px var(--sc)}',
    '.lu-sname{flex:1;min-width:0;font:800 15px var(--body,inherit);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.lu-mini{flex:none;min-height:44px;padding:0 12px;border-radius:999px;border:1px solid var(--line2);background:var(--card2);color:var(--text2);font:700 13px var(--body,inherit);cursor:pointer}',
    '.lu-setup button:focus-visible,.lu-choice:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}',
    '.lu-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:0 0 8px}',
    '.lu-pl{display:inline-flex;align-items:center;gap:6px;padding:3px 10px 3px 3px;border-radius:999px;background:var(--card2);border:1.5px solid var(--line);min-width:0;max-width:48%}',
    '.lu-pl .lu-face{width:30px;height:30px;box-shadow:0 0 0 2px var(--sc)}',
    '.lu-plt{display:flex;flex-direction:column;min-width:0}',
    '.lu-plt b{font:800 12.5px/1.2 var(--body,inherit);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.lu-plt span{font:600 11px/1.2 var(--body,inherit);color:var(--muted);white-space:nowrap}',
    '.lu-pl.now{border-color:var(--sc);background:var(--card);box-shadow:0 0 0 3px color-mix(in srgb,var(--sc) 30%,transparent)}',
    '.lu-board{position:relative;width:100%;max-width:520px;margin:0 auto;filter:drop-shadow(0 10px 24px rgba(40,20,5,.22))}',
    '.lu-svg{display:block;width:100%;height:auto}',
    '.lu-tok .halo{fill:none;stroke:#fff;stroke-width:.1;opacity:0}',
    '.lu-tok.live{cursor:pointer}.lu-tok.live .halo{opacity:.95;stroke:#2a1a3f;stroke-dasharray:.18 .12}',
    '.lu-tok.sel .halo{stroke-width:.16;stroke-dasharray:none}',
    '.lu-tok .hit{pointer-events:all}',
    '.lu-tok .lu-badge{display:none}.lu-tok.live .lu-badge{display:inline}',
    '.lu-badge text,.lu-mark text{font:800 .3px var(--body,sans-serif);fill:#fff}',
    '.lu-mark text{fill:#2a1a3f;font-size:.42px}',
    '.lu-mark{cursor:pointer}',
    '.lu-ini{font:800 .5px var(--body,sans-serif);fill:#fff}',
    '.lu-act{display:flex;align-items:center;gap:12px;justify-content:center;margin:10px auto 0;max-width:520px}',
    '.lu-feed{flex:1;margin:0;min-height:44px;display:flex;align-items:center;font:600 14.5px/1.35 var(--body,inherit);color:var(--text2)}',
    '.lu-feed.lift{color:var(--good)}.lu-feed.calm{color:var(--text2)}',
    '.lu-choices{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:520px;margin:6px auto 0;min-height:0}',
    '.lu-choice{min-height:44px;display:inline-flex;align-items:center;gap:7px;padding:4px 14px 4px 5px;border-radius:999px;border:1.5px solid var(--line2);background:var(--card);color:var(--text);font:700 13.5px var(--body,inherit);cursor:pointer}',
    '.lu-choice i{font-style:normal;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;font-weight:800}',
    '.lu-choice.lift{border-color:var(--good)}.lu-choice.safe{border-color:var(--accent2)}.lu-choice.risk{border-color:var(--accent3);border-style:dashed}',
    '.lu-choice.sel{box-shadow:0 0 0 3px var(--accent-soft);border-width:2.5px}',
    '.lu-sstok{width:7.4%}.lu-sstok .arc-tokface{border:2.5px solid var(--sc)!important}.lu-sstok .arc-tokface span{background:var(--sc)!important}',
    '.lu-sstok.now{z-index:6}',
    '.lu-ssboard svg{cursor:default}',
    '.lu-cursor,.lu-target{position:absolute;width:9.3%;aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:8px;pointer-events:none;z-index:7}',
    '.lu-cursor{border:3px solid var(--accent)}',
    '.lu-target{background:rgba(255,214,90,.45);box-shadow:0 0 0 3px #e6a21c}',
    '.lu-over{text-align:center;max-width:460px;margin:0 auto}',
    '.lu-over h3{font:800 26px var(--display,Georgia,serif);margin:6px 0 2px}',
    '.lu-over>p{margin:0 0 8px;color:var(--text2)}',
    '.lu-places{list-style:none;padding:0;margin:8px 0;display:flex;flex-direction:column;gap:6px}',
    '.lu-places li{display:flex;align-items:center;gap:10px;padding:6px 12px 6px 6px;border-radius:999px;background:var(--card);border:1px solid var(--line);text-align:left}',
    '.lu-places li b{flex:1}.lu-places li span{color:var(--muted);font-size:13px}',
    '.lu-setup>.arc-row{position:sticky;bottom:calc(var(--lu-bar,0px) + 6px);z-index:3;margin:6px auto 0}',
    '@media(max-width:520px){.lu-len,.lu-tier{padding:6px 8px;min-height:56px}.lu-len b,.lu-tier b{font-size:14px}.lu-len span,.lu-tier span{font-size:11px}.lu-pl{max-width:none}.lu-seat{gap:6px}.lu-mini{padding:0 10px}}',
    '@media(prefers-reduced-motion:reduce){.arc-wrap *,.arc-wrap *:before,.arc-wrap *:after{animation:none!important;transition:none!important}',
    '.arc-anim{animation:none!important}}'
  ].join('');

  var cssDone = false;
  function injectCSS() {
    if (cssDone || !D) return;
    cssDone = true;
    if (D.getElementById('arc-css')) return;
    var s = D.createElement('style');
    s.id = 'arc-css';
    s.appendChild(D.createTextNode(CSS));
    (D.head || D.documentElement).appendChild(s);
  }

  /* ==================================================================
     SMALL HELPERS — same shapes as games.js; duplicated because that
     file exports engines, not utilities, and a cross-file dependency on
     its internals would rot silently.
     ================================================================== */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function reducedMotion() {
    try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }
  function focusSoft(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (e2) {} }
  }
  function rollDie() { return 1 + Math.floor(Math.random() * 6); }
  function r2(n) { return Math.round(n * 100) / 100; }

  /* The child's profile lives at window.BI.S — but games must not assume the
     shell exists (a bare host is a legal way to mount an engine). */
  function profile() {
    try { return (W.BI && W.BI.S) || {}; } catch (e) { return {}; }
  }
  function playerName() {
    var n = profile().name;
    return (typeof n === 'string' && n.trim()) ? n.trim() : 'You';
  }
  function artSrc(id) {
    try { return (W.IND_ART_SRC && W.IND_ART_SRC(id)) || ''; } catch (e) { return ''; }
  }
  /* The child's chosen buddy, and THE PIECE RULE (docs/05, the companion
     framework): a fictional tales-shelf character may BE the token in a
     child's hands — the tortoise races, the jackal jumps. A sacred figure or
     a real person stays AT the child's side: their face appears in the
     player chip (a companion, a witness), but the token on the board is the
     child's own — never Ganesha down a snake. */
  function buddySrc() { return artSrc(profile().buddy || 'ganesha'); }
  function buddyTier() {
    try {
      return (W.IND_BUDDY_TIER && W.IND_BUDDY_TIER(profile().buddy || 'ganesha')) || 'tales';
    } catch (e) { return 'tales'; }
  }
  function pieceSrc() { return buddyTier() === 'tales' ? buddySrc() : ''; }
  function gattuSrc() { return artSrc('gattu'); }
  function gattuHTML(size) {
    var src = gattuSrc();
    if (src) return '<img src="' + esc(src) + '" width="' + (size || 92) + '" height="' + (size || 92) + '" alt="">';
    if (W.GATTU) {
      var g = W.GATTU('happy');
      if (g) return g.replace('<svg ', '<svg width="' + (size || 92) + '" height="' + (size || 92) + '" ');
    }
    return '';
  }
  /* Small round face for chips and tokens; falls back to an initial disc. */
  function faceHTML(src, initial) {
    if (src) return '<img src="' + esc(src) + '" alt="">';
    return '<span>' + esc((initial || 'Y').charAt(0).toUpperCase()) + '</span>';
  }

  /* Run-scope for timers and listeners so teardown is always clean. */
  function scope() {
    var timers = [], offs = [], dead = false;
    return {
      get dead() { return dead; },
      later: function (fn, ms) {
        if (dead) return 0;
        var t = W.setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(t); return t;
      },
      on: function (target, type, fn, capture) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, capture || false);
        offs.push(function () { target.removeEventListener(type, fn, capture || false); });
      },
      kill: function () {
        if (dead) return;
        dead = true;
        for (var i = 0; i < timers.length; i++) { W.clearTimeout(timers[i]); W.clearInterval(timers[i]); }
        for (var j = 0; j < offs.length; j++) { try { offs[j](); } catch (e) {} }
        timers = []; offs = [];
      }
    };
  }

  /* A shell may throw the host away without calling teardown (a plain back
     button does exactly that). Notice, and clean up rather than leaving a
     document-level key handler behind. */
  function detached(host) {
    return !!(D && D.body && host && host.nodeType === 1 && !D.body.contains(host));
  }
  function teardownOf(sc, extra) {
    var fn = function () { sc.kill(); if (extra) { try { extra(); } catch (e) {} } };
    fn.destroy = fn;
    return fn;
  }

  /* Leave mid-game: hand control back to the shell, which unmounts us
     through our own teardown. Standalone (no shell), end honestly instead. */
  function leaveVia(endFn) {
    if (W.BI && typeof W.BI.go === 'function') { W.BI.go('mela'); return; }
    endFn();
  }

  /* Shared chrome: one compact title row (with the way out), the stage, and
     the single always-legible status line underneath. */
  function frame(host, title, kicker) {
    injectCSS();
    host.innerHTML =
      '<div class="arc-wrap">' +
        '<div class="arc-top">' +
          '<div><span class="arc-kicker">' + esc(kicker) + '</span><b>' + esc(title) + '</b></div>' +
          '<button type="button" class="arc-leave" data-go="leave">Mela</button>' +
        '</div>' +
        '<div class="arc-stage"></div>' +
        '<p class="arc-feed" role="status" aria-live="polite"></p>' +
      '</div>';
    var ref = {
      wrap: host.querySelector('.arc-wrap'),
      stage: host.querySelector('.arc-stage'),
      feed: host.querySelector('.arc-feed')
    };
    ref.say = function (msg, tone) {
      if (!ref.feed) return;
      ref.feed.textContent = msg || '';
      ref.feed.className = 'arc-feed' + (tone ? ' ' + tone : '');
    };
    return ref;
  }

  /* The board must fit the viewport WITH the die and chips — measured, not
     hoped. The board is square, so surplus page height converts 1:1 into a
     narrower board. A fixed bar pinned to the bottom of the viewport (the
     shell's mobile tab bar) is measured and respected, never guessed.
     Re-runs on every resize/orientation change. */
  function bottomBarH() {
    try {
      var el = D.elementFromPoint(Math.floor(W.innerWidth / 2), W.innerHeight - 6);
      while (el && el !== D.body && el !== D.documentElement) {
        var cs = W.getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'sticky') {
          var r = el.getBoundingClientRect();
          if (r.top > W.innerHeight * 0.5) return Math.max(0, W.innerHeight - r.top);
        }
        el = el.parentElement;
      }
    } catch (e) {}
    return 0;
  }
  /* ---- the die: pips + tumble ---- */
  var PIPS = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[27, 27], [50, 50], [73, 73]],
    4: [[31, 31], [69, 31], [31, 69], [69, 69]],
    5: [[29, 29], [71, 29], [50, 50], [29, 71], [71, 71]],
    6: [[31, 26], [69, 26], [31, 50], [69, 50], [31, 74], [69, 74]]
  };
  function dieBtnHTML() {
    return '<button type="button" class="arc-die ready" data-go="roll" aria-label="Roll the die">' + pipsHTML(6) + '</button>';
  }
  function pipsHTML(v) {
    var p = PIPS[v] || PIPS[6], out = '', i;
    for (i = 0; i < p.length; i++) {
      out += '<span class="arc-pip" style="left:' + p[i][0] + '%;top:' + p[i][1] + '%"></span>';
    }
    return out;
  }
  function dieShow(ref, v) {
    var b = ref.stage.querySelector('.arc-die');
    if (b) b.innerHTML = pipsHTML(v);
  }
  /* Tumble, flashing random faces, then settle on the real roll. */
  function dieRoll(sc, ref, RM, v, then) {
    var b = ref.stage.querySelector('.arc-die');
    if (RM || !b) { dieShow(ref, v); sc.later(then, 60); return; }
    b.classList.remove('ready');
    b.classList.add('roll');
    var i;
    for (i = 1; i <= 4; i++) {
      (function (k) { sc.later(function () { dieShow(ref, rollDie()); }, k * 85); })(i);
    }
    sc.later(function () { dieShow(ref, v); }, 430);
    sc.later(function () { if (b) b.classList.remove('roll'); then(); }, 560);
  }
  function dieEnable(ref, on) {
    var b = ref.stage.querySelector('.arc-die');
    if (b) { b.disabled = !on; b.classList.toggle('ready', !!on); }
  }

  /* ==================================================================
     PACHISI — the cowrie throw (games spec §4.6.5), a bonus way to play
     Ludo's card: bought at its printed price in the Shop
     (economy.js 'mode-ludo-pachisi'), switched on and off in the game's
     own title card, and played for fun like the rest of the card — no
     coins, no counter. Cowries are luck, and luck is never a reward.

     THE RULE IS SOURCED, NOT REMEMBERED (docs/05 §6). Six cowrie shells
     are thrown and the shells that land mouth up are counted; the count
     is looked up in the table below. 6, 10 and 25 are "graces": a grace
     may bring a token out of the yard, and the thrower throws again. The
     table and the grace are as the sources give them; the sources also
     say the number of shells (five, six or seven) and the counts differ
     across India, which the start screen says too. What is NOT claimed:
     the board is Ludo's cross, not the cloth Pachisi board, and here a
     throw bigger than the steps left still takes a token home — the
     cowries cannot make a 1, so the exact-number rule would strand a
     token one step short. Both are said on the start screen.

     Read through web search results on 9 Oct 2026 (the pages agree with
     each other; Culin's 1898 catalogue could not be opened from here).
     ================================================================== */
  var PACHISI = {
    id: 'ludo.pachisi.cowries',
    badge: 'aaj',                      /* how the game is played: a rule, as it is told */
    shells: 6,
    /* mouths up → the move */
    throws: { 0: 25, 1: 10, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },
    grace: [6, 10, 25],
    name: 'Pachisi',
    meaning: 'from pachis, twenty-five — the highest throw',
    where: 'India and the wider subcontinent, under many names — pachisi, chaupar, chausar',
    varies: 'Five, six or seven cowries, and what each throw counts, differ from place to place and family to family.',
    sources: [
      { type: 'institution', short: 'Penn Museum, Expedition (1964)', ref: 'Penn Museum, Expedition Magazine (1964), “The Indian Games of Pachisi, Chaupar, and Chausar”: played with cowries — five, six or seven — and named from pachis, twenty-five',
        url: 'https://www.penn.museum/sites/expedition/the-indian-games-of-pachisi-chaupar-and-chausar/' },
      { type: 'secondary', short: 'F. W. Pritchett, Columbia University', ref: 'Frances W. Pritchett, Columbia University, glossary entry “pachisi”: the six-cowrie throws (none up 25, one up 10, two to six up count as they fall; 25, 10 and 6 throw again), and that the game differs across India',
        url: 'https://www.columbia.edu/itc/mealac/pritchett/00glossarydata/terms/pachisi/pachisi.html' },
      { type: 'secondary', short: 'Masters Traditional Games', ref: 'Masters Traditional Games, “The Rules of Pachisi & Chaupur”: the six-cowrie table, with 6, 10 and 25 as graces',
        url: 'https://www.mastersofgames.com/rules/pachisi-rules.htm' },
      { type: 'secondary', short: 'Wikipedia, “Pachisi”', ref: 'Wikipedia, “Pachisi”: the same table; a grace brings a piece in and the turn repeats',
        url: 'https://en.wikipedia.org/wiki/Pachisi' }
    ],
    age_gate: 4,
    checked: '2026-10-09'
  };
  /* each shell falls mouth up or mouth down at even odds here (a real shell need not) */
  function throwCowries() {
    var f = [], up = 0, i;
    for (i = 0; i < PACHISI.shells; i++) { f.push(Math.random() < 0.5); if (f[i]) up++; }
    return { faces: f, up: up, value: PACHISI.throws[up], grace: PACHISI.grace.indexOf(PACHISI.throws[up]) >= 0 };
  }
  function upWords(n) { return (n === 0 ? 'none' : String(n)) + (n === 1 ? ' mouth up' : ' mouths up'); }
  /* one cowrie, drawn: mouth up shows the toothed slit; mouth down shows the humped back */
  function cowrieSVG(up) {
    return '<svg class="lu-cw" viewBox="0 0 20 26" aria-hidden="true" focusable="false">' +
      (up
        ? '<ellipse cx="10" cy="13" rx="8.4" ry="11.4" fill="#f6ecd4" stroke="#8a6a3a" stroke-width="1.2"/>' +
          '<path d="M10 3.6q-1.6 9.4 0 18.8" fill="none" stroke="#4a2e12" stroke-width="1.8" stroke-linecap="round"/>' +
          '<path d="M7.6 7h1.6M7.3 10.2h1.8M7.2 13.4h1.9M7.3 16.6h1.8M7.6 19.8h1.6M10.8 7h1.6M10.9 10.2h1.8M11 13.4h1.9M10.9 16.6h1.8M10.8 19.8h1.6" stroke="#8a6a3a" stroke-width=".9" stroke-linecap="round"/>'
        : '<ellipse cx="10" cy="13" rx="8.4" ry="11.4" fill="#d6b27a" stroke="#7a5426" stroke-width="1.2"/>' +
          '<ellipse cx="8.2" cy="10" rx="3.6" ry="5.2" fill="#f1ddb4" opacity=".75"/>' +
          '<circle cx="12.4" cy="16.4" r="1.3" fill="#a77b42" opacity=".6"/>') +
      '</svg>';
  }
  function cowriesHTML(faces) {
    var s = '', i;
    for (i = 0; i < PACHISI.shells; i++) s += cowrieSVG(faces ? faces[i] : i % 2 === 0);
    return s;
  }
  function cowBtnHTML() {
    return '<button type="button" class="arc-die lu-cow ready" data-go="roll" aria-label="Throw the six cowries">' + cowriesHTML(null) + '</button>';
  }
  function cowShow(ref, faces) {
    var b = ref.stage.querySelector('.lu-cow');
    if (b) b.innerHTML = cowriesHTML(faces);
  }
  /* a shake of the shells, then they settle as they fell; still under reduced motion */
  function cowRoll(sc, ref, RM, th, then) {
    var b = ref.stage.querySelector('.lu-cow');
    if (RM || !b) { cowShow(ref, th.faces); sc.later(then, 60); return; }
    b.classList.remove('ready'); b.classList.add('roll');
    for (var i = 1; i <= 4; i++) (function (k) { sc.later(function () { cowShow(ref, throwCowries().faces); }, k * 85); })(i);
    sc.later(function () { cowShow(ref, th.faces); }, 430);
    sc.later(function () { if (b) b.classList.remove('roll'); then(); }, 560);
  }
  /* the throw table, as the start screen shows it */
  function cowTableHTML() {
    var order = [0, 1, 2, 3, 4, 5, 6];
    return '<table class="lu-cowtab"><caption>Six cowries: count the ones that land mouth up</caption>' +
      '<tr><th scope="row">Mouths up</th>' + order.map(function (n) { return '<td>' + (n === 0 ? 'none' : n) + '</td>'; }).join('') + '</tr>' +
      '<tr><th scope="row">Move</th>' + order.map(function (n) {
        var v = PACHISI.throws[n], g = PACHISI.grace.indexOf(v) >= 0;
        return '<td' + (g ? ' class="g"' : '') + '>' + v + (g ? '<small>grace</small>' : '') + '</td>'; }).join('') + '</tr></table>';
  }

  /* ==================================================================
     GAME 1 · SAAP-SIDI  (Gyan Chaupar / Moksha Patam)

     The board this game descends from was Indian long before it was
     English: in Gyan Chaupar every ladder was a named virtue and every
     snake a named slip, and the whole point was that the two were
     teachable. We keep the names and the gentleness, and drop the
     export's blank moralising. A snake here is a slide and a smile.
     ================================================================== */

  /* Ladders: foot → top, each a virtue with a one-line meaning. */
  var SS_LADDERS = [
    { foot: 4,  top: 25, name: 'Daya',   gloss: 'kindness — a hand held out lifts you with it' },
    { foot: 13, top: 46, name: 'Seva',   gloss: 'helping — pitch in and up you go' },
    { foot: 33, top: 68, name: 'Satya',  gloss: 'the truth — it stands steady, like a ladder' },
    { foot: 50, top: 91, name: 'Himmat', gloss: 'courage — one brave step climbs a long way' },
    { foot: 62, top: 81, name: 'Vidya',  gloss: 'learning — every new thing you learn lifts you' }
  ];
  /* Snakes: head → tail, each a slip. The lines are written to be said with
     a grin — no scolding, ever. Each snake wears its own pigment. */
  var SS_SNAKES = [
    { head: 27, tail: 9,  name: 'Krodh',   gloss: 'a stomp of temper — deep breath, little slide, on we go',
      body: '#c1502f', dark: '#8e3218', belly: '#f4cda6' },
    { head: 43, tail: 18, name: 'Jhooth',  gloss: 'a fib — it slips you back a bit, no harm done',
      body: '#2f7d7a', dark: '#1c5a57', belly: '#c2e5da' },
    { head: 56, tail: 37, name: 'Lalach',  gloss: 'grabbing more — and dropping the lot, wheee',
      body: '#c08a2a', dark: '#8f6116', belly: '#f4e0ad' },
    { head: 75, tail: 32, name: 'Aalas',   gloss: 'couldn’t be bothered — the board slid for you instead',
      body: '#5f6cae', dark: '#404b85', belly: '#ced5f0' },
    { head: 96, tail: 65, name: 'Ghamand', gloss: 'showing off — it wobbles the ladder, down and onward',
      body: '#96477c', dark: '#6d2c58', belly: '#ebc8dd' }
  ];

  /* Square 1 sits bottom-left; each row snakes back the other way
     (boustrophedon), so 100 lands top-left. */
  function ssRC(sq) {
    var i = sq - 1, br = Math.floor(i / 10), c = i % 10;
    if (br % 2 === 1) c = 9 - c;
    return { row: 9 - br, col: c };
  }
  /* Centre of a square in board units: 10-unit cells inside a 4-unit frame,
     viewBox 0 0 108 108. */
  function ssXYu(sq) {
    var rc = ssRC(sq);
    return { x: 4 + (rc.col + 0.5) * 10, y: 4 + (rc.row + 0.5) * 10 };
  }
  function ssPct(v) { return r2(v / 108 * 100); }

  /* ---- painted-board art builders ---- */

  function ssPoly(pts) {
    var d = 'M' + r2(pts[0][0]) + ' ' + r2(pts[0][1]), i;
    for (i = 1; i < pts.length; i++) d += 'L' + r2(pts[i][0]) + ' ' + r2(pts[i][1]);
    return d + 'Z';
  }

  /* A ladder with perspective: rails converge and thin toward the top,
     rungs evenly spaced and shortening, a soft cast shadow underneath. */
  function ssLadderSVG(foot, top) {
    var A = ssXYu(foot), B = ssXYu(top);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L;
    var g0 = 2.0, g1 = 1.35;            /* half-gap between rails: wide foot, narrow top */
    var w0 = 0.62, w1 = 0.44;           /* rail thickness foot → top */
    function rail(sgn) {
      return ssPoly([
        [A.x + nx * (sgn * g0 - w0 / 2), A.y + ny * (sgn * g0 - w0 / 2)],
        [A.x + nx * (sgn * g0 + w0 / 2), A.y + ny * (sgn * g0 + w0 / 2)],
        [B.x + nx * (sgn * g1 + w1 / 2), B.y + ny * (sgn * g1 + w1 / 2)],
        [B.x + nx * (sgn * g1 - w1 / 2), B.y + ny * (sgn * g1 - w1 / 2)]
      ]);
    }
    var rails = rail(1) + ' ' + rail(-1);
    var railPath = '<path d="' + rail(1) + '"/><path d="' + rail(-1) + '"/>';
    var rungs = '', k = Math.max(4, Math.round(L / 5.2)), i;
    for (i = 1; i < k; i++) {
      var t = i / k, cx = A.x + dx * t, cy = A.y + dy * t;
      var half = (g0 + (g1 - g0) * t) - 0.12;
      rungs += '<line x1="' + r2(cx + nx * half) + '" y1="' + r2(cy + ny * half) +
               '" x2="' + r2(cx - nx * half) + '" y2="' + r2(cy - ny * half) + '"/>';
    }
    return '<g>' +
      '<g transform="translate(0.55 0.85)" fill="rgba(70,40,10,.16)"><path d="' + rails + '"/></g>' +
      '<g stroke="#96601f" stroke-width="0.52" stroke-linecap="round">' + rungs + '</g>' +
      '<g fill="#b4783a" stroke="#7c4f1c" stroke-width="0.14" stroke-linejoin="round">' + railPath + '</g>' +
    '</g>';
  }

  /* A snake with a life of its own: a tapered body sampled along a wavy
     centreline, diamond-patterned back, pale belly stripe, a real head
     with eyes and a forked tongue, all anchored head-square to tail-square. */
  function ssSnakeSVG(sn, idx) {
    var A = ssXYu(sn.head), B = ssXYu(sn.tail);
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / L, ny = dx / L;
    var waves = Math.max(1, Math.round(L / 24));
    var amp = Math.max(3.0, Math.min(7.0, L * 0.13));
    var ph = (idx % 2) ? Math.PI * 0.85 : 0.25;
    var N = 30, pts = [], i, t;
    for (i = 0; i <= N; i++) {
      t = i / N;
      var wob = Math.sin(t * Math.PI * 2 * waves + ph) * amp * Math.sin(Math.PI * t);
      pts.push([A.x + dx * t + nx * wob, A.y + dy * t + ny * wob]);
    }
    function tangentAt(i2) {
      var p0 = pts[Math.max(0, i2 - 1)], p1 = pts[Math.min(N, i2 + 1)];
      var tx = p1[0] - p0[0], ty = p1[1] - p0[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
      return { ux: tx / tl, uy: ty / tl, px: -ty / tl, py: tx / tl };
    }
    function widthAt(t2) { return 2.1 * Math.pow(1 - t2, 0.9) + 0.38; }
    function outline(f) {
      var Ls = [], Rs = [], j;
      for (j = 0; j <= N; j++) {
        var tg = tangentAt(j), w = widthAt(j / N) * f;
        Ls.push([pts[j][0] + tg.px * w, pts[j][1] + tg.py * w]);
        Rs.push([pts[j][0] - tg.px * w, pts[j][1] - tg.py * w]);
      }
      var d = 'M' + r2(Ls[0][0]) + ' ' + r2(Ls[0][1]);
      for (j = 1; j <= N; j++) d += 'L' + r2(Ls[j][0]) + ' ' + r2(Ls[j][1]);
      for (j = N; j >= 0; j--) d += 'L' + r2(Rs[j][0]) + ' ' + r2(Rs[j][1]);
      return d + 'Z';
    }
    var body = outline(1), belly = outline(0.4);
    /* diamond spots along the spine */
    var spots = '';
    for (i = 3; i < N - 1; i += 3) {
      var tg2 = tangentAt(i), w2 = widthAt(i / N);
      var s1 = w2 * 0.62, s2 = w2 * 0.44, px2 = pts[i][0], py2 = pts[i][1];
      spots += '<path d="' + ssPoly([
        [px2 + tg2.ux * s1, py2 + tg2.uy * s1],
        [px2 + tg2.px * s2, py2 + tg2.py * s2],
        [px2 - tg2.ux * s1, py2 - tg2.uy * s1],
        [px2 - tg2.px * s2, py2 - tg2.py * s2]
      ]) + '"/>';
    }
    /* head at the head square, looking away from the body */
    var t0 = tangentAt(0);
    var hdx = -t0.ux, hdy = -t0.uy;                 /* out of the board toward the head cell edge */
    var hx = A.x + hdx * 0.5, hy = A.y + hdy * 0.5;
    var ang = r2(Math.atan2(hdy, hdx) * 180 / Math.PI);
    var hnx = -hdy, hny = hdx;
    var e1x = hx + hdx * 0.55 + hnx * 0.92, e1y = hy + hdy * 0.55 + hny * 0.92;
    var e2x = hx + hdx * 0.55 - hnx * 0.92, e2y = hy + hdy * 0.55 - hny * 0.92;
    var tipx = hx + hdx * 2.35, tipy = hy + hdy * 2.35;
    var midx = hx + hdx * 3.5, midy = hy + hdy * 3.5;
    var f1x = midx + hdx * 0.9 + hnx * 0.5, f1y = midy + hdy * 0.9 + hny * 0.5;
    var f2x = midx + hdx * 0.9 - hnx * 0.5, f2y = midy + hdy * 0.9 - hny * 0.5;
    return '<g opacity="0.96">' +
      '<path d="' + body + '" transform="translate(0.5 0.8)" fill="rgba(60,30,10,.15)"/>' +
      '<path d="' + body + '" fill="' + sn.body + '" stroke="' + sn.dark + '" stroke-width="0.2" stroke-linejoin="round"/>' +
      '<path d="' + belly + '" fill="' + sn.belly + '" opacity="0.55"/>' +
      '<g fill="' + sn.dark + '" opacity="0.5">' + spots + '</g>' +
      '<path d="M' + r2(tipx) + ' ' + r2(tipy) + 'L' + r2(midx) + ' ' + r2(midy) +
        'M' + r2(midx) + ' ' + r2(midy) + 'L' + r2(f1x) + ' ' + r2(f1y) +
        'M' + r2(midx) + ' ' + r2(midy) + 'L' + r2(f2x) + ' ' + r2(f2y) +
        '" stroke="#cf3b28" stroke-width="0.3" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="' + r2(hx) + '" cy="' + r2(hy) + '" rx="2.5" ry="1.9" transform="rotate(' + ang + ' ' + r2(hx) + ' ' + r2(hy) + ')"' +
        ' fill="' + sn.body + '" stroke="' + sn.dark + '" stroke-width="0.2"/>' +
      '<circle cx="' + r2(e1x) + '" cy="' + r2(e1y) + '" r="0.56" fill="#fffbe9"/>' +
      '<circle cx="' + r2(e2x) + '" cy="' + r2(e2y) + '" r="0.56" fill="#fffbe9"/>' +
      '<circle cx="' + r2(e1x + hdx * 0.16) + '" cy="' + r2(e1y + hdy * 0.16) + '" r="0.27" fill="#2a1608"/>' +
      '<circle cx="' + r2(e2x + hdx * 0.16) + '" cy="' + r2(e2y + hdy * 0.16) + '" r="0.27" fill="#2a1608"/>' +
    '</g>';
  }

  /* Name chips at ladder feet and snake heads — the old names, quietly. */
  function ssLabelSVG(sq, text, kind) {
    var rc = ssRC(sq);
    var cw = text.length * 1.5 + 2.2, ch = 3.3;
    var cx = 4 + rc.col * 10 + 5, cy = 4 + rc.row * 10 + 8.55;
    cx = Math.max(4 + cw / 2 + 0.3, Math.min(104 - cw / 2 - 0.3, cx));
    var col = kind === 'lad' ? '#1e7a4c' : '#a8452b';
    return '<g>' +
      '<rect x="' + r2(cx - cw / 2) + '" y="' + r2(cy - ch / 2) + '" width="' + r2(cw) + '" height="' + ch +
        '" rx="1.6" fill="#fffcf2" opacity="0.94" stroke="' + col + '" stroke-width="0.16"/>' +
      '<text class="arc-sslabel" x="' + r2(cx) + '" y="' + r2(cy + 0.88) + '" text-anchor="middle" fill="' + col + '">' +
        esc(text) + '</text>' +
    '</g>';
  }

  /* The diya on square 100 — the little lamp the whole climb is for. */
  function ssDiyaSVG() {
    return '<g>' +
      '<circle cx="9" cy="9.4" r="3.9" fill="#f6c04a" opacity="0.35"/>' +
      '<circle cx="9" cy="9.4" r="2.6" fill="#ffd873" opacity="0.4"/>' +
      '<path d="M9 6.1C10 7.3 9.9 8.7 9 9.3C8.1 8.7 8 7.3 9 6.1Z" fill="#f0912b"/>' +
      '<path d="M9 7.1C9.5 7.8 9.45 8.6 9 8.95C8.55 8.6 8.5 7.8 9 7.1Z" fill="#ffe08a"/>' +
      '<path d="M5.7 9.9Q9 10.7 12.3 9.9Q11.6 12.4 9 12.6Q6.4 12.4 5.7 9.9Z" fill="#a8452b"/>' +
      '<path d="M5.7 9.9Q9 10.85 12.3 9.9" fill="none" stroke="#7c2d1a" stroke-width="0.22"/>' +
    '</g>';
  }

  function ssBoardSVG() {
    var s = '<svg viewBox="0 0 108 108" role="img" aria-label="Saap-Sidi board — 100 squares, ladders of virtue, snakes of little slips">';
    /* terracotta frame with a gold pinstripe */
    s += '<rect x="0" y="0" width="108" height="108" rx="3.4" fill="#a3492b"/>';
    s += '<rect x="0" y="0" width="108" height="108" rx="3.4" fill="none" stroke="rgba(60,20,5,.35)" stroke-width="0.5"/>';
    s += '<rect x="2.4" y="2.4" width="103.2" height="103.2" rx="1.8" fill="none" stroke="#e6b95c" stroke-width="0.5"/>';
    s += '<rect x="4" y="4" width="100" height="100" fill="#fdf3dd"/>';
    /* the checker, with soft green washes at ladder feet and rose at snake heads */
    var ladAt = {}, snkAt = {}, i;
    for (i = 0; i < SS_LADDERS.length; i++) ladAt[SS_LADDERS[i].foot] = 1;
    for (i = 0; i < SS_SNAKES.length; i++) snkAt[SS_SNAKES[i].head] = 1;
    var dr, c;
    for (dr = 0; dr < 10; dr++) {
      var br = 9 - dr;
      for (c = 0; c < 10; c++) {
        var sq = br % 2 === 0 ? br * 10 + c + 1 : br * 10 + (10 - c);
        var x = 4 + c * 10, y = 4 + dr * 10;
        var fill = ((dr + c) % 2) ? '#f6dfae' : '#fdf3dd';
        s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="' + fill + '" stroke="#ecd6a2" stroke-width="0.16"/>';
        if (ladAt[sq]) s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="#2f8f5f" opacity="0.16"/>';
        if (snkAt[sq]) s += '<rect x="' + x + '" y="' + y + '" width="10" height="10" fill="#c65a3a" opacity="0.14"/>';
        if (sq === 100) {
          s += ssDiyaSVG();
          s += '<text class="arc-ssnum hot" x="' + (x + 1) + '" y="' + (y + 3.2) + '" font-size="2.4">100</text>';
        } else {
          s += '<text class="arc-ssnum' + ((ladAt[sq] || snkAt[sq]) ? ' hot' : '') + '" x="' + (x + 1) + '" y="' + (y + 3.4) + '">' + sq + '</text>';
        }
      }
    }
    /* art: ladders under snakes, name chips on top of both */
    for (i = 0; i < SS_LADDERS.length; i++) s += ssLadderSVG(SS_LADDERS[i].foot, SS_LADDERS[i].top);
    for (i = 0; i < SS_SNAKES.length; i++) s += ssSnakeSVG(SS_SNAKES[i], i);
    for (i = 0; i < SS_LADDERS.length; i++) s += ssLabelSVG(SS_LADDERS[i].foot, SS_LADDERS[i].name, 'lad');
    for (i = 0; i < SS_SNAKES.length; i++) s += ssLabelSVG(SS_SNAKES[i].head, SS_SNAKES[i].name, 'snk');
    s += '</svg>';
    return s;
  }

  /* ==================================================================
     LUDO — the family board, with Saap-Sidi inside it (games spec §4.6)

     For fun: it teaches nothing the app measures, reports no answers and
     pays nothing, so the host shows no counter. What it is for is the
     carpet — a child, a grandparent and Gattu round one phone.

       · three lengths: Jaldi (2 tokens, one already out), Classic (4),
         Lambi (4, the full rules: a capture or a token home rolls again,
         a third six is lost)
       · real choices: when more than one token can move, every legal
         destination is numbered on the board and named in a chip under
         it — safe star, captures Gattu, next to Gattu — risky, reaches
         home. When exactly one move is legal it makes itself after a
         beat: no dead taps.
       · pass-and-play for 2–4 seats; any seat can be Gattu; each seat
         picks its colour and its face (the household's children come
         with their own avatar).
       · Gattu plays at three tiers, deterministically: Naya moves his
         furthest token, Saathi captures and hides on stars, Ustaad weighs
         risk. Two games running won by the family moves him up a tier;
         two running lost moves him down. The dice are fair and the same
         for everyone; nothing here is a reward.
       · Saap-Sidi (Gyan Chaupar) is the card's second mode: the same
         seats, the virtue and slip of every ladder and snake said aloud
         with a one-line meaning, and the youngest band counts its own
         way: they tap the square they land on.
     ================================================================== */

  var LU_COL = [                 /* quadrant order: top-left, top-right, bottom-right, bottom-left */
    { id: 'red',    name: 'Red',    hex: '#d0453b', dark: '#9b2b22', soft: '#f7d3cd' },
    { id: 'green',  name: 'Green',  hex: '#2c9a5a', dark: '#1b6a3c', soft: '#cdeedb' },
    { id: 'yellow', name: 'Yellow', hex: '#e2a11c', dark: '#a0700b', soft: '#f9e8b8' },
    { id: 'blue',   name: 'Blue',   hex: '#3a6cd0', dark: '#234a98', soft: '#d2def7' }
  ];
  /* the classic 52-cell ring, clockwise from (0,6) */
  var L_RING = (function () {
    var r = [], i;
    for (i = 0; i < 6; i++) r.push([i, 6]);
    for (i = 5; i >= 0; i--) r.push([6, i]);
    r.push([7, 0]);
    for (i = 0; i < 6; i++) r.push([8, i]);
    for (i = 9; i < 15; i++) r.push([i, 6]);
    r.push([14, 7]);
    for (i = 14; i >= 9; i--) r.push([i, 8]);
    for (i = 9; i < 15; i++) r.push([8, i]);
    r.push([7, 14]);
    for (i = 14; i >= 9; i--) r.push([6, i]);
    for (i = 5; i >= 0; i--) r.push([i, 8]);
    r.push([0, 7]);
    return r;
  })();
  var LU_START = [1, 14, 27, 40];
  var LU_SAFE = { 1: 1, 9: 1, 14: 1, 22: 1, 27: 1, 35: 1, 40: 1, 48: 1 };
  var LU_HOMECOL = [
    [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
    [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]]
  ];
  var LU_Q0 = [[0, 0], [9, 0], [9, 9], [0, 9]];
  var LU_HOME_AT = [[6.55, 7.5, 0, 1], [7.5, 6.55, 1, 0], [8.45, 7.5, 0, 1], [7.5, 8.45, 1, 0]];
  var L_HOME_P = 56;
  var LU_LEN = {
    jaldi:   { name: 'Jaldi', en: 'Quick', n: 2, mins: 'about 4 min', out1: true, exact: false, bonus: false,
               note: '2 tokens each, one already out; any big enough roll takes a token home.' },
    classic: { name: 'Classic', en: '', n: 4, mins: 'about 10 min', out1: false, exact: true, bonus: false,
               note: '4 tokens each; the last step home needs the exact number.' },
    lambi:   { name: 'Lambi', en: 'Long', n: 4, mins: '15 min and more', out1: false, exact: true, bonus: true,
               note: 'The full rules: a capture or a token home rolls again, and a third six is lost.' }
  };
  var LU_TIERS = [
    { name: 'Naya', en: 'beginner', how: 'moves his furthest token' },
    { name: 'Saathi', en: 'partner', how: 'captures when he can and hides on stars' },
    { name: 'Ustaad', en: 'expert', how: 'weighs every risk' }
  ];
  /* the faces a grown-up or a friend may pick: the Panchatantra's animals, which the piece
     rule lets ride in a token (a sacred figure or a real person never does) */
  var LU_FACES = ['pt_tortoise', 'pt_monkey', 'pt_crow', 'pt_mouse', 'pt_rabbit', 'pt_jackal', 'pt_bull', 'pt_lion'];
  var LU_KEY = 'india.ludo.v1';

  function luRidx(q, p) { return (LU_START[q] + p) % 52; }
  function luYardXY(q, ti) { var o = LU_Q0[q]; return { x: o[0] + (ti % 2 ? 4 : 2), y: o[1] + (ti < 2 ? 2 : 4) }; }
  function luXY(q, ti, p) {
    if (p < 0) return luYardXY(q, ti);
    if (p <= 50) { var c = L_RING[luRidx(q, p)]; return { x: c[0] + 0.5, y: c[1] + 0.5 }; }
    if (p < L_HOME_P) { var h = LU_HOMECOL[q][p - 51]; return { x: h[0] + 0.5, y: h[1] + 0.5 }; }
    var a = LU_HOME_AT[q], off = (ti - 1.5) * 0.3;
    return { x: a[0] + off * a[2], y: a[1] + off * a[3] };
  }

  /* this child's own memory of the board: Gattu's tier, how the last games went, the length */
  function luLoad() {
    try { var raw = W.IND_STORE && W.IND_STORE.kidGet(LU_KEY); var o = raw ? JSON.parse(raw) : null; if (o && typeof o === 'object') return o; }
    catch (e) {}
    return { tier: 1, run: 0, len: 'jaldi', mode: 'ludo' };
  }
  function luSave(o) { try { if (W.IND_STORE) W.IND_STORE.kidSet(LU_KEY, JSON.stringify(o)); } catch (e) {} }
  /* two games running won by the family → one tier up; two running lost → one down. Nothing random. */
  function luAdapt(mem, familyWon) {
    var run = mem.run || 0;
    run = familyWon ? (run > 0 ? run + 1 : 1) : (run < 0 ? run - 1 : -1);
    var tier = typeof mem.tier === 'number' ? mem.tier : 1;
    if (run >= 2) { tier = Math.min(2, tier + 1); run = 0; }
    else if (run <= -2) { tier = Math.max(0, tier - 1); run = 0; }
    mem.tier = tier; mem.run = run;
    return mem;
  }

  /* the household's children, through the shell when it is there; a bare host has one "You" */
  function luKids() {
    var out = [];
    try {
      var ks = W.BI && W.BI.Store && W.BI.Store.kids ? W.BI.Store.kids() : [];
      for (var i = 0; i < ks.length; i++) if (ks[i].name) out.push({ name: ks[i].name, av: ks[i].buddy || 'pt_tortoise', active: !!ks[i].active });
    } catch (e) {}
    if (!out.length) out.push({ name: playerName(), av: profile().buddy || 'pt_tortoise', active: true });
    out.sort(function (a, b) { return (b.active ? 1 : 0) - (a.active ? 1 : 0); });
    return out;
  }
  function luWho() {
    var w = luKids().map(function (k) { return { kind: 'human', name: k.name, av: k.av, kid: true }; });
    w.push({ kind: 'human', name: 'Grown-up', av: 'pt_bull' });
    w.push({ kind: 'human', name: 'Friend', av: 'pt_rabbit' });
    w.push({ kind: 'gattu', name: 'Gattu', av: 'gattu' });
    return w;
  }
  function tierOf(av) {
    try { return (W.IND_BUDDY_TIER && W.IND_BUDDY_TIER(av)) || 'tales'; } catch (e) { return 'tales'; }
  }
  function seatFace(seat) { return seat.kind === 'gattu' ? gattuSrc() : artSrc(seat.av); }
  /* THE PIECE RULE: only a tales-shelf character rides in a token */
  function seatPiece(seat) { return seat.kind === 'gattu' ? gattuSrc() : (tierOf(seat.av) === 'tales' ? artSrc(seat.av) : ''); }

  /* the effects a board makes, through the one sound path (sfx.js): its own kind if
     sfx.js ever grows one, else the nearest soft sound it already has */
  var LU_SFX = { die: 'tap', step: 'tap', capture: 'medal', home: 'win', ladder: 'unlock', snake: 'tap' };
  function sfx(kind) {
    var S = W.IND_SFX;
    if (!S || !S.play) return;
    try { S.play((S.KINDS || []).indexOf(kind) >= 0 ? kind : LU_SFX[kind] || 'tap'); } catch (e) {}
  }
  function sayAloud(text) {
    try {
      if (W.IND_SFX_MUTED && W.IND_SFX_MUTED()) return;
      if (!W.speechSynthesis || !W.SpeechSynthesisUtterance) return;
      W.speechSynthesis.cancel();
      var u = new W.SpeechSynthesisUtterance(text);
      u.lang = 'en-IN'; u.rate = 0.92;
      W.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function luBoardSVG(seats, cloth) {
    var uid = 'lu' + Math.floor(Math.random() * 1e6);
    var used = {}, i, c, q;
    for (i = 0; i < seats.length; i++) used[seats[i].q] = seats[i];
    var s = '<svg class="lu-svg" viewBox="-0.7 -0.7 16.4 16.4" role="img" aria-label="' + (cloth ? 'The race board, played with cowries' : 'Ludo board') + '">';
    s += '<defs><clipPath id="' + uid + '"><circle r="0.36"/></clipPath>' +
      '<radialGradient id="' + uid + 'g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f3e4c4"/></radialGradient></defs>';
    /* a painted wooden board: walnut frame, gold pinstripe, cream field */
    /* with cowries, the frame is a madder-red cloth with a running stitch, as Pachisi boards are cloth */
    s += '<rect x="-0.7" y="-0.7" width="16.4" height="16.4" rx="0.9" fill="' + (cloth ? '#7a1f1a' : '#6e3f1f') + '"/>';
    s += '<rect x="-0.42" y="-0.42" width="15.84" height="15.84" rx="0.6" fill="none" stroke="#e6b95c" stroke-width="0.07"' + (cloth ? ' stroke-dasharray="0.22 0.14"' : '') + '/>';
    s += '<rect x="-0.25" y="-0.25" width="15.5" height="15.5" rx="0.4" fill="url(#' + uid + 'g)"/>';
    for (i = 0; i < L_RING.length; i++) {
      c = L_RING[i];
      s += '<rect x="' + (c[0] + 0.04) + '" y="' + (c[1] + 0.04) + '" width="0.92" height="0.92" rx="0.14" fill="#fffaf0" stroke="#d9c49a" stroke-width="0.04"/>';
    }
    for (q = 0; q < 4; q++) {
      var col = LU_COL[q], live = !!used[q], o = LU_Q0[q];
      var tone = live ? col.hex : '#cbbd9f', op = live ? 1 : 0.55;
      /* start cell and home column in the seat's colour */
      c = L_RING[LU_START[q]];
      s += '<rect x="' + (c[0] + 0.04) + '" y="' + (c[1] + 0.04) + '" width="0.92" height="0.92" rx="0.14" fill="' + tone + '" opacity="' + op + '"/>';
      for (i = 0; i < 5; i++) {
        c = LU_HOMECOL[q][i];
        s += '<rect x="' + (c[0] + 0.04) + '" y="' + (c[1] + 0.04) + '" width="0.92" height="0.92" rx="0.14" fill="' + tone + '" opacity="' + (live ? 0.85 : 0.45) + '"/>';
      }
      /* the yard: a coloured square with a cream court and four nests */
      s += '<rect x="' + (o[0] + 0.1) + '" y="' + (o[1] + 0.1) + '" width="5.8" height="5.8" rx="0.6" fill="' + tone + '" opacity="' + op + '"/>';
      s += '<rect x="' + (o[0] + 0.95) + '" y="' + (o[1] + 0.95) + '" width="4.1" height="4.1" rx="0.5" fill="#fffaf0"/>';
      for (i = 0; i < 4; i++) {
        var y = luYardXY(q, i);
        s += '<circle cx="' + y.x + '" cy="' + y.y + '" r="0.62" fill="' + (live ? col.soft : '#efe6d2') + '" stroke="' + tone + '" stroke-width="0.09" opacity="' + (live ? 1 : 0.7) + '"/>';
      }
    }
    /* the centre: four home triangles and a rosette */
    var tri = ['6,6 6,9 7.5,7.5', '6,6 9,6 7.5,7.5', '9,6 9,9 7.5,7.5', '6,9 9,9 7.5,7.5'];
    for (q = 0; q < 4; q++) s += '<polygon points="' + tri[q] + '" fill="' + (used[q] ? LU_COL[q].hex : '#cbbd9f') + '" opacity="' + (used[q] ? 1 : 0.55) + '" stroke="#fffaf0" stroke-width="0.05"/>';
    s += '<circle cx="7.5" cy="7.5" r="0.5" fill="#fffaf0" stroke="#e6b95c" stroke-width="0.06"/>';
    for (i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      s += '<circle cx="' + r2(7.5 + Math.cos(a) * 0.32) + '" cy="' + r2(7.5 + Math.sin(a) * 0.32) + '" r="0.08" fill="#c0392b"/>';
    }
    /* the eight safe stars */
    for (var idx in LU_SAFE) {
      if (!LU_SAFE.hasOwnProperty(idx)) continue;
      c = L_RING[+idx];
      var st = LU_START.indexOf(+idx) >= 0;
      s += '<path d="' + lStar5(c[0] + 0.5, c[1] + 0.5, 0.33) + '"' +
        (st ? ' fill="#fff" fill-opacity="0.9"' : ' fill="#f6d77a" stroke="#a8732a" stroke-width="0.05" stroke-linejoin="round"') + '/>';
    }
    s += '<g data-marks></g><g data-toks>';
    for (i = 0; i < seats.length; i++) {
      var se = seats[i], src = seatPiece(se), t;
      for (t = 0; t < se.T.length; t++) {
        var xy = luXY(se.q, t, se.T[t]);
        s += '<g class="lu-tok" data-seat="' + i + '" data-i="' + t + '" transform="translate(' + r2(xy.x) + ',' + r2(xy.y) + ')">' +
          '<ellipse cx="0" cy="0.36" rx="0.32" ry="0.11" fill="rgba(40,20,5,.3)"/>' +
          '<circle class="halo" r="0.6"/>' +
          '<circle r="0.44" fill="' + LU_COL[se.q].hex + '" stroke="#fff" stroke-width="0.08"/>' +
          (src ? '<circle r="0.36" fill="#fff"/><image href="' + esc(src) + '" x="-0.36" y="-0.36" width="0.72" height="0.72" clip-path="url(#' + uid + ')"/>'
               : '<text y="0.17" text-anchor="middle" class="lu-ini">' + esc(se.name.charAt(0).toUpperCase()) + '</text>') +
          '<circle r="0.44" fill="none" stroke="' + LU_COL[se.q].dark + '" stroke-width="0.06"/>' +
          '<g class="lu-badge"><circle cx="0.36" cy="-0.36" r="0.22" fill="#2a1a3f"/><text x="0.36" y="-0.28" text-anchor="middle"></text></g>' +
          '<circle class="hit" r="0.62" fill="transparent"/>' +
        '</g>';
      }
    }
    return s + '</g></svg>';
  }

  /* A proper five-point star, filled. */
  function lStar5(cx, cy, R) {
    var d = '', i, r = R * 0.42;
    for (i = 0; i < 10; i++) {
      var ang = -Math.PI / 2 + i * Math.PI / 5;
      var rad = (i % 2 === 0) ? R : r;
      d += (i === 0 ? 'M' : 'L') + r2(cx + Math.cos(ang) * rad) + ' ' + r2(cy + Math.sin(ang) * rad);
    }
    return d + 'Z';
  }

  function ludo(host, opts, done) {
    opts = opts || {};
    var sc = scope();
    var RM = !!opts.reduced || reducedMotion();
    var young = opts.band === '4-7';
    var mem = luLoad();
    var ref = frame(host, 'Ludo', 'Aangan ke khel · played for fun');
    ref.wrap.classList.add('lu-wrap');
    var leaveB = ref.wrap.querySelector('.arc-leave');
    if (leaveB) leaveB.textContent = 'Leave';
    var mode = opts.mode === 'saapsidi' ? 'saapsidi' : (mem.mode === 'saapsidi' && opts.mode !== 'ludo' ? 'saapsidi' : 'ludo');
    var lenId = LU_LEN[mem.len] ? mem.len : 'jaldi';
    var tier = typeof mem.tier === 'number' ? Math.max(0, Math.min(2, mem.tier)) : 1;
    var who = luWho();
    var seats = [];                  /* {kind,name,av,q, T[] | pos} */
    var view = 'setup';              /* setup | play | over */
    var phase = 'idle';              /* roll | busy | choose | count */
    var cur = 0, die = 0, sixes = 0, moves = [], sel = 0, finished = false, winner = -1;
    /* PACHISI: the bought way to play the race board, from the title card (opts.skin). Saap-Sidi keeps its die. */
    var pc = opts.skin === 'mode-ludo-pachisi', thrown = null, tlog = [];   /* tlog: every throw and every token out, for the check */
    function cow() { return pc && mode === 'ludo'; }
    /* a token leaves the yard on a six — or, with cowries, on a grace (6, 10 or 25) */
    function enters(v) { return cow() ? PACHISI.grace.indexOf(v) >= 0 : v === 6; }
    /* can a token d steps behind reach this cell in one throw? */
    function reach(d) {
      if (d <= 0) return false;
      if (!cow()) return d <= 6;
      for (var n in PACHISI.throws) if (PACHISI.throws.hasOwnProperty(n) && PACHISI.throws[n] === d) return true;
      return false;
    }
    function exact() { return LEN.exact && !cow(); }
    function rolled(v) { return cow() && thrown ? 'threw ' + v + ' (' + upWords(thrown.up) + ')' : 'rolled ' + v; }
    function bigName() { return cow() ? 'Pachisi' : 'Ludo'; }
    var pend = [], moving = {}, countMiss = 0, countAt = 0, cursorSq = 0;

    /* a beat that never changes the game while the page is hidden (games contract: clock) */
    function beat(fn, ms) {
      return sc.later(function () { if (D && D.hidden) { pend.push(fn); return; } fn(); }, ms);
    }
    sc.on(D, 'visibilitychange', function () {
      if (D.hidden || sc.dead) return;
      var p = pend; pend = [];
      for (var i = 0; i < p.length; i++) p[i]();
    });

    function defaultSeats(n) {
      var kid = who[0];
      var base = [
        { kind: kid.kind, name: kid.name, av: kid.av, w: 0, q: 0 },
        { kind: 'gattu', name: 'Gattu', av: 'gattu', w: who.length - 1, q: 2 }
      ];
      if (n >= 3) base.push({ kind: 'human', name: who[who.length - 3].name, av: who[who.length - 3].av, w: who.length - 3, q: 1 });
      if (n >= 4) base.push({ kind: 'human', name: who[who.length - 2].name, av: who[who.length - 2].av, w: who.length - 2, q: 3 });
      return base;
    }
    seats = defaultSeats(2);

    /* ---------------------------------------------------------------- setup */
    function hasGattu() { for (var i = 0; i < seats.length; i++) if (seats[i].kind === 'gattu') return true; return false; }
    function faceTag(seat, cls) {
      var src = seatFace(seat);
      return '<span class="' + (cls || 'lu-face') + '" style="--sc:' + LU_COL[seat.q].hex + '">' +
        (src ? '<img src="' + esc(src) + '" alt="">' : '<span>' + esc(seat.name.charAt(0).toUpperCase()) + '</span>') + '</span>';
    }
    function setupHTML() {
      var h = '<div class="lu-setup">';
      h += '<div class="lu-seg" role="tablist" aria-label="Which board">' +
        '<button type="button" role="tab" class="lu-segb' + (mode === 'ludo' ? ' on' : '') + '" aria-selected="' + (mode === 'ludo') + '" data-go="mode" data-v="ludo">' + (pc ? 'Pachisi <small>six cowries</small>' : 'Ludo') + '</button>' +
        '<button type="button" role="tab" class="lu-segb' + (mode === 'saapsidi' ? ' on' : '') + '" aria-selected="' + (mode === 'saapsidi') + '" data-go="mode" data-v="saapsidi">Saap-Sidi <small>Gyan Chaupar</small></button>' +
      '</div>';
      if (mode === 'ludo') {
        h += '<p class="lu-lab">How long?</p><div class="lu-lens">';
        ['jaldi', 'classic', 'lambi'].forEach(function (id) {
          var L = LU_LEN[id];
          h += '<button type="button" class="lu-len' + (lenId === id ? ' on' : '') + '" data-go="len" data-v="' + id + '" aria-pressed="' + (lenId === id) + '">' +
            '<b>' + L.name + (L.en ? ' <small>' + L.en + '</small>' : '') + '</b><span>' + L.n + ' tokens · ' + L.mins + '</span></button>';
        });
        h += '</div><p class="lu-note">' + esc(pc ? LU_LEN[lenId].note.replace(/,? and a third six is lost/, '').replace('; the last step home needs the exact number', '').replace(/; any big enough roll takes a token home/, '').replace('rolls again', 'throws again') : LU_LEN[lenId].note) + '</p>';
      } else {
        h += '<p class="lu-note">Race to square 100, where the diya is lit. Every ladder is a virtue and every snake a slip — each one is said aloud with what it means.' +
          (young ? ' You count your own way: tap the square you land on.' : '') + '</p>';
      }
      h += '<p class="lu-lab">Who is playing?</p><div class="lu-count" role="group" aria-label="How many players">';
      for (var n = 2; n <= 4; n++) h += '<button type="button" class="lu-cnt' + (seats.length === n ? ' on' : '') + '" data-go="count" data-v="' + n + '" aria-pressed="' + (seats.length === n) + '">' + n + '</button>';
      h += '</div><ol class="lu-seats">';
      seats.forEach(function (se, i) {
        h += '<li class="lu-seat" style="--sc:' + LU_COL[se.q].hex + '">' +
          '<button type="button" class="lu-colb" data-go="col" data-v="' + i + '" aria-label="Colour: ' + LU_COL[se.q].name + ' — change"><i></i><span>' + LU_COL[se.q].name + '</span></button>' +
          faceTag(se) +
          '<b class="lu-sname">' + esc(se.name) + '</b>' +
          '<button type="button" class="lu-mini" data-go="who" data-v="' + i + '" aria-label="Seat ' + (i + 1) + ': ' + esc(se.name) + ' — change who">Who ▸</button>' +
          (se.kind === 'gattu' ? '' : '<button type="button" class="lu-mini" data-go="face" data-v="' + i + '" aria-label="Change ' + esc(se.name) + '’s face">Face ▸</button>') +
        '</li>';
      });
      h += '</ol>';
      if (hasGattu()) {
        h += '<p class="lu-lab">Gattu plays as</p><div class="lu-tiers" role="group" aria-label="How Gattu plays">';
        LU_TIERS.forEach(function (t, i) {
          h += '<button type="button" class="lu-tier' + (tier === i ? ' on' : '') + '" data-go="tier" data-v="' + i + '" aria-pressed="' + (tier === i) + '"><b>' + t.name + '</b><span>' + t.how + '</span></button>';
        });
        h += '</div><p class="lu-note">He moves a tier after two games running go one way — up when the family wins both, down when he does.</p>';
      }
      h += '<div class="arc-row"><button type="button" class="arc-btn lu-start" data-go="start">Start ' + (mode === 'ludo' ? bigName() : 'Saap-Sidi') + '</button></div>';
      if (cow()) return h + pachisiHow() + '</div>';
      h += '<p class="arc-hint">' + (mode === 'ludo'
        ? 'Ludo is <b>Pachisi</b> in a British suit — families across India were racing tokens round the cross-and-circle board long before the boxed version.'
        : 'Saap-Sidi began as <b>Gyan Chaupar</b> — Moksha Patam — where the ladders were virtues and the snakes were slips. “Snakes and Ladders” is the export.') +
        ' Played for fun: nothing here pays coins.</p>';
      return h + '</div>';
    }
    /* the how-to for the cowries: where the game is from, the table, the grace, that it differs, and the sources */
    function pachisiHow() {
      return '<p class="arc-hint"><b>Pachisi</b> — ' + esc(PACHISI.meaning) + ' — is played across ' + esc(PACHISI.where) + '.</p>' +
        cowTableHTML() +
        '<p class="arc-hint">A <b>grace</b> — 6, 10 or 25 — can bring a token out of its yard, and you throw again. ' + esc(PACHISI.varies) +
          ' In many families it is counted differently — ask yours.</p>' +
        '<p class="arc-hint">The throw is Pachisi’s; the board is Ludo’s cross, and here a throw bigger than the steps left still takes a token home. Played for fun: nothing here pays coins.</p>' +
        '<p class="lu-src">Sources: ' + PACHISI.sources.map(function (x) { return esc(x.short); }).join(' · ') + '</p>';
    }
    function showSetup() {
      view = 'setup'; phase = 'idle';
      ref.wrap.classList.remove('playing');
      var top = ref.wrap.querySelector('.arc-top b');
      if (top) top.textContent = mode === 'ludo' ? bigName() : 'Saap-Sidi';
      ref.stage.innerHTML = setupHTML();
      ref.wrap.style.setProperty('--lu-bar', bottomBarH() + 'px');
      ref.say('');
    }
    function freeColour(i) {
      var taken = {};
      seats.forEach(function (s, j) { if (j !== i) taken[s.q] = 1; });
      for (var k = 1; k <= 4; k++) { var q = (seats[i].q + k) % 4; if (!taken[q]) return q; }
      return seats[i].q;
    }
    function setupAct(what, v) {
      if (['mode', 'len', 'tier', 'count', 'col', 'who', 'face'].indexOf(what) < 0) return false;
      if (what === 'mode') { mode = v; showSetup(); focusSoft(ref.stage.querySelector('[data-go="mode"][data-v="' + v + '"]')); return true; }
      if (what === 'len') { lenId = v; showSetup(); focusSoft(ref.stage.querySelector('[data-go="len"][data-v="' + v + '"]')); return true; }
      if (what === 'tier') { tier = +v; showSetup(); focusSoft(ref.stage.querySelector('[data-go="tier"][data-v="' + v + '"]')); return true; }
      if (what === 'count') {
        var n = +v;
        while (seats.length < n) {
          var used = {}, names = {};
          seats.forEach(function (s) { used[s.q] = 1; names[s.name] = 1; });
          var q = [1, 3, 0, 2].filter(function (x) { return !used[x]; })[0];
          var wi = 0;
          for (var c = 0; c < who.length; c++) if (who[c].kind === 'human' && !names[who[c].name]) { wi = c; break; }
          var w = who[wi];
          seats.push({ kind: w.kind, name: names[w.name] ? w.name + ' ' + (seats.length + 1) : w.name, av: w.av, w: wi, q: q });
        }
        seats.length = n;
        showSetup(); focusSoft(ref.stage.querySelector('[data-go="count"][data-v="' + n + '"]'));
        return true;
      }
      var i = +v, se = seats[i];
      if (!se) return false;
      if (what === 'col') { se.q = freeColour(i); }
      else if (what === 'who') {
        /* the next one along; a child already sitting at another seat is skipped, and two
           grown-ups (or two Gattus) are numbered, so no two seats read as one player */
        var nw = null;
        for (var tries = 0; tries < who.length; tries++) {
          se.w = ((se.w || 0) + 1) % who.length;
          var cand = who[se.w], clash = false;
          seats.forEach(function (s, j) { if (j !== i && s.name === cand.name) clash = true; });
          if (!(cand.kid && clash)) { nw = cand; break; }
        }
        if (!nw) return true;
        se.kind = nw.kind; se.name = nw.name; se.av = nw.av;
        var same = 0;
        seats.forEach(function (s, j) { if (j !== i && (s.name === nw.name || s.name.indexOf(nw.name + ' ') === 0)) same++; });
        if (same) se.name = nw.name + ' ' + (same + 1);
      }
      else if (what === 'face') {
        var k = LU_FACES.indexOf(se.av);
        se.av = LU_FACES[(k + 1) % LU_FACES.length];
      }
      showSetup();
      focusSoft(ref.stage.querySelector('[data-go="' + what + '"][data-v="' + i + '"]'));
      return true;
    }

    /* ----------------------------------------------------------- shared play */
    function chipsHTML() {
      return '<div class="lu-chips">' + seats.map(function (se, i) {
        return '<span class="lu-pl" data-pl="' + i + '" style="--sc:' + LU_COL[se.q].hex + '">' + faceTag(se) +
          '<span class="lu-plt"><b>' + esc(se.name) + '</b><span data-t></span></span></span>';
      }).join('') + '</div>';
    }
    function chipsUpdate() {
      seats.forEach(function (se, i) {
        var el = ref.stage.querySelector('[data-pl="' + i + '"]');
        if (!el) return;
        el.classList.toggle('now', view === 'play' && i === cur);
        var t = el.querySelector('[data-t]');
        if (t) t.textContent = mode === 'ludo' ? homeOf(i) + '/' + se.T.length + ' home' : 'square ' + se.pos;
      });
    }
    function actionHTML() {
      return '<div class="lu-act">' + (cow() ? cowBtnHTML() : dieBtnHTML()) + '<p class="lu-feed" role="status" aria-live="polite"></p></div>' +
        '<div class="lu-choices" role="group" aria-label="Your moves"></div>';
    }
    function say(msg, tone) {
      var f = ref.stage.querySelector('.lu-feed');
      if (f) { f.textContent = msg || ''; f.className = 'lu-feed' + (tone ? ' ' + tone : ''); }
    }
    function isBot(i) { return seats[i] && seats[i].kind === 'gattu'; }
    function you(i) {
      var humans = seats.filter(function (s) { return s.kind === 'human'; }).length;
      return humans === 1 && !isBot(i);
    }
    function nmTurn(i) { return you(i) ? 'Your' : seats[i].name + '’s'; }
    function nmDo(i) { return you(i) ? 'You' : seats[i].name; }
    function fit() {
      if (sc.dead || detached(host)) return;
      var wrap = ref.stage.querySelector('.lu-board');
      if (!wrap) return;
      wrap.style.width = '100%';
      var rect = wrap.getBoundingClientRect(), natural = rect.width;
      var below = 0, act = ref.stage.querySelector('.lu-act'), ch = ref.stage.querySelector('.lu-choices');
      if (act) below += act.offsetHeight + 8;
      if (ch) below += Math.max(ch.offsetHeight, 52) + 6;
      var avail = W.innerHeight - (rect.top + (W.pageYOffset || 0)) - bottomBarH() - below - 10;
      var w = Math.max(260, Math.min(natural, avail));
      if (w < natural) wrap.style.width = r2(w) + 'px';
    }
    sc.on(W, 'resize', fit);
    function refit() { fit(); sc.later(fit, 80); sc.later(fit, 320); }

    function startTurn() {
      if (view !== 'play') return;
      phase = 'roll'; moves = []; renderChoices();
      chipsUpdate(); paintToks();
      dieEnable(ref, !isBot(cur));
      if (isBot(cur)) {
        say(seats[cur].name + '’s turn…', 'calm');
        beat(roll, RM ? 250 : 650);
      } else {
        say(nmTurn(cur) + (cow() ? ' turn — throw the cowries (Space or tap).' : ' turn — roll the die (Space or tap).'));
        sc.later(function () { focusSoft(ref.stage.querySelector('.arc-die')); }, 40);
      }
    }
    function roll() {
      if (view !== 'play' || phase !== 'roll') return;
      phase = 'busy';
      dieEnable(ref, false);
      sfx('die');
      if (cow()) {
        thrown = throwCowries(); die = thrown.value;
        tlog.push({ seat: cur, up: thrown.up, value: thrown.value, faces: thrown.faces.slice() });
        cowRoll(sc, ref, RM, thrown, function () { if (view === 'play') luAfterRoll(); });
        return;
      }
      thrown = null;
      die = rollDie();
      dieRoll(sc, ref, RM, die, function () { if (view === 'play') (mode === 'ludo' ? luAfterRoll : ssAfterRoll)(); });
    }

    /* ================================================================ LUDO */
    var LEN = LU_LEN[lenId];
    function homeOf(i) { var n = 0, T = seats[i].T || []; for (var k = 0; k < T.length; k++) if (T[k] === L_HOME_P) n++; return n; }
    function threatAt(i, ridx) {
      /* how many other seats' tokens could land on this ring cell with their next roll */
      if (LU_SAFE[ridx]) return 0;
      var n = 0;
      seats.forEach(function (se, j) {
        if (j === i) return;
        var d = (ridx - LU_START[se.q] + 52) % 52;
        se.T.forEach(function (op) {
          if (op >= 0 && op <= 50 && d > op && reach(d - op)) n++;
          else if (op === -1 && d === 0) n++;
        });
      });
      return n;
    }
    function victimsAt(i, ridx) {
      var out = [];
      if (LU_SAFE[ridx]) return out;
      seats.forEach(function (se, j) {
        if (j === i) return;
        se.T.forEach(function (op, t) { if (op >= 0 && op <= 50 && luRidx(se.q, op) === ridx) out.push([j, t]); });
      });
      return out;
    }
    function legal(i, v) {
      var m = [], T = seats[i].T;
      for (var t = 0; t < T.length; t++) {
        var p = T[t], to;
        if (p === L_HOME_P) continue;
        if (p === -1) { if (enters(v)) m.push({ t: t, from: -1, to: 0 }); continue; }
        to = p + v;
        if (to > L_HOME_P) { if (exact()) continue; to = L_HOME_P; }
        m.push({ t: t, from: p, to: to });
      }
      /* two tokens on one cell move alike: offer the choice once */
      var seen = {}, out = [];
      m.forEach(function (mv) { var k = mv.from + '>' + mv.to; if (seen[k]) return; seen[k] = 1; out.push(mv); });
      out.forEach(function (mv) { describeMove(i, mv); });
      return out;
    }
    function describeMove(i, mv) {
      var se = seats[i], to = mv.to;
      mv.cap = []; mv.safe = false; mv.risk = 0; mv.home = to === L_HOME_P; mv.out = mv.from === -1;
      if (to >= 0 && to <= 50) {
        var ridx = luRidx(se.q, to);
        mv.cap = victimsAt(i, ridx);
        mv.safe = !!LU_SAFE[ridx];
        mv.risk = mv.safe ? 0 : threatAt(i, ridx);
        mv.near = nearName(i, ridx);
      } else if (to > 50) mv.safe = true;
      mv.danger = mv.from >= 0 && mv.from <= 50 ? threatAt(i, luRidx(se.q, mv.from)) : 0;
      mv.label = mv.home ? 'reaches home'
        : mv.cap.length ? 'captures ' + seats[mv.cap[0][0]].name
        : mv.out ? 'comes out'
        : to > 50 ? 'home path — safe'
        : mv.safe ? 'safe star'
        : mv.risk ? 'next to ' + (mv.near || 'a token') + ' — risky'
        : 'moves ' + (to - mv.from);
      mv.tone = mv.home || mv.cap.length ? 'lift' : mv.safe || to > 50 ? 'safe' : mv.risk ? 'risk' : '';
    }
    function nearName(i, ridx) {
      var nm = '';
      seats.forEach(function (se, j) {
        if (j === i || nm) return;
        var d = (ridx - LU_START[se.q] + 52) % 52;
        se.T.forEach(function (op) { if (!nm && ((op >= 0 && op <= 50 && d > op && reach(d - op)) || (op === -1 && d === 0))) nm = se.name; });
      });
      return nm;
    }
    /* Gattu's three tiers — deterministic, ties to the lowest token */
    function botPick(i, ms) {
      var best = ms[0], bs = -1e9;
      ms.forEach(function (mv) {
        var s;
        if (tier === 0) s = mv.from;                                    /* Naya: the furthest token */
        else if (tier === 1) s = (mv.cap.length ? 1000 : 0) + (mv.home ? 800 : 0) + (mv.safe ? 400 : 0) + (mv.out ? 300 : 0) + mv.from;
        else s = mv.cap.length * 120 + (mv.home ? 90 : 0) + (mv.out ? 50 : 0) + (mv.safe ? 35 : 0) +
          (mv.danger && !mv.risk ? 45 * mv.danger : 0) - mv.risk * 60 + mv.to / 10;
        if (s > bs) { bs = s; best = mv; }
      });
      return best;
    }
    function luAfterRoll() {
      if (die === 6 && !cow()) sixes++;
      var se = seats[cur];
      if (LEN.bonus && !cow() && die === 6 && sixes >= 3) {
        say('A third six — ' + (you(cur) ? 'your' : se.name + '’s') + ' turn passes.', 'calm');
        beat(nextTurn, 1100);
        return;
      }
      moves = legal(cur, die);
      if (!moves.length) {
        var allIn = true;
        se.T.forEach(function (p) { if (p >= 0 && p < L_HOME_P) allIn = false; });
        var need = cow() ? 'a grace — 6, 10 or 25 —' : 'a 6';
        if (allIn) say(isBot(cur) ? se.name + ' ' + rolled(die) + ' — he needs ' + need + ' to bring a token out.'
                                  : (cow() ? nmDo(cur) + ' ' + rolled(die) + '. ' : '') + (you(cur) ? 'You need ' + need + ' to bring a token out.' : se.name + ', you need ' + need + ' to bring a token out.'), 'calm');
        else say(nmDo(cur) + ' ' + rolled(die) + ' — no token can move: the last steps home need the exact number.', 'calm');
        beat(nextTurn, 1250);
        return;
      }
      if (moves.length === 1) {
        say(nmDo(cur) + ' ' + rolled(die) + ' — one move, and it makes itself.');
        markMoves([moves[0]]);
        beat(function () { doMove(moves[0]); }, isBot(cur) ? 500 : 750);
        return;
      }
      if (isBot(cur)) {
        var pick = botPick(cur, moves);
        say(se.name + ' ' + rolled(die) + ' — ' + pick.label + '.', 'calm');
        beat(function () { doMove(pick); }, 600);
        return;
      }
      phase = 'choose'; sel = 0;
      renderChoices(); markMoves(moves); paintToks();
      say(nmDo(cur) + ' ' + rolled(die) + ' — choose a move: tap it, or 1–' + moves.length + '.');
      refit();
      sc.later(function () { focusSoft(ref.stage.querySelector('.lu-choice')); }, 40);
    }
    function renderChoices() {
      var box = ref.stage.querySelector('.lu-choices');
      if (!box) return;
      if (phase !== 'choose') { box.innerHTML = ''; markMoves([]); return; }
      box.innerHTML = moves.map(function (mv, k) {
        return '<button type="button" class="lu-choice ' + mv.tone + (k === sel ? ' sel' : '') + '" data-go="pick" data-v="' + k + '">' +
          '<i>' + (k + 1) + '</i>' + esc(mv.label) + '</button>';
      }).join('');
    }
    function markMoves(ms) {
      var g = ref.stage.querySelector('[data-marks]');
      if (!g) return;
      var se = seats[cur];
      g.innerHTML = ms.map(function (mv, k) {
        var xy = luXY(se.q, mv.t, mv.to);
        return '<g class="lu-mark ' + (mv.tone || '') + '" data-go="pick" data-v="' + k + '" transform="translate(' + r2(xy.x) + ',' + r2(xy.y) + ')">' +
          '<circle r="0.46" fill="rgba(255,255,255,.55)" stroke="' + LU_COL[se.q].dark + '" stroke-width="0.07" stroke-dasharray="0.16 0.1"/>' +
          (ms.length > 1 ? '<text y="0.15" text-anchor="middle">' + (k + 1) + '</text>' : '') +
          '<circle r="0.55" fill="transparent"/></g>';
      }).join('');
    }
    function tokEl(i, t) { return ref.stage.querySelector('.lu-tok[data-seat="' + i + '"][data-i="' + t + '"]'); }
    function paintToks() {
      if (mode !== 'ludo') return;
      var spots = {};
      seats.forEach(function (se, i) {
        se.T.forEach(function (p, t) {
          var xy = luXY(se.q, t, p), key = p < 0 || p === L_HOME_P ? 'y' + i + ':' + t + ':' + p : r2(xy.x) + ',' + r2(xy.y);
          (spots[key] = spots[key] || []).push(i + ':' + t);
        });
      });
      seats.forEach(function (se, i) {
        se.T.forEach(function (p, t) {
          var el = tokEl(i, t);
          if (!el) return;
          var live = phase === 'choose' && i === cur, k = -1;
          if (live) for (var m = 0; m < moves.length; m++) if (moves[m].t === t) k = m;
          el.setAttribute('class', 'lu-tok' + (k >= 0 ? ' live' : '') + (k >= 0 && k === sel ? ' sel' : '') + (p === L_HOME_P ? ' done' : ''));
          var b = el.querySelector('.lu-badge text');
          if (b) b.textContent = k >= 0 && moves.length > 1 ? String(k + 1) : '';
          if (moving[i + ':' + t]) return;
          var xy = luXY(se.q, t, p), key = p < 0 || p === L_HOME_P ? 'y' + i + ':' + t + ':' + p : r2(xy.x) + ',' + r2(xy.y);
          var list = spots[key] || [], n = list.length, slot = list.indexOf(i + ':' + t);
          var off = n > 1 ? (slot - (n - 1) / 2) * 0.3 : 0;
          var sc2 = p === L_HOME_P ? ' scale(.62)' : n > 1 ? ' scale(.82)' : '';
          el.setAttribute('transform', 'translate(' + r2(xy.x + off) + ',' + r2(xy.y - (n > 1 ? off * 0.25 : 0)) + ')' + sc2);
        });
      });
      chipsUpdate();
    }
    /* a smooth hop: requestAnimationFrame with real elapsed time; none under reduced motion */
    function hopTo(el, a, b, ms, then) {
      if (RM || !el || !W.requestAnimationFrame) { then(); return; }
      var t0 = null;
      function f(ts) {
        if (sc.dead) return;
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e - Math.sin(Math.PI * k) * 0.42;
        el.setAttribute('transform', 'translate(' + r2(x) + ',' + r2(y) + ') scale(' + r2(1 + 0.12 * Math.sin(Math.PI * k)) + ')');
        if (k < 1) W.requestAnimationFrame(f); else then();
      }
      W.requestAnimationFrame(f);
    }
    function doMove(mv) {
      if (view !== 'play') return;
      phase = 'busy'; renderChoices();
      var se = seats[cur], i = cur, t = mv.t, el = tokEl(i, t);
      if (mv.from === -1 && cow()) tlog.push({ seat: i, out: true, value: die });
      var path = [], s;
      if (mv.from === -1) path = [0];
      else for (s = mv.from + 1; s <= mv.to; s++) path.push(s);
      if (el && el.parentNode) el.parentNode.appendChild(el);   /* the moving token rides on top */
      var k = 0;
      moving[i + ':' + t] = true;
      (function step() {
        if (sc.dead || view !== 'play') return;
        if (k >= path.length) { delete moving[i + ':' + t]; se.T[t] = mv.to; paintToks(); beat(function () { luResolve(i, t, mv); }, RM ? 120 : 220); return; }
        var a = luXY(se.q, t, k === 0 ? mv.from : path[k - 1]), b = luXY(se.q, t, path[k]);
        se.T[t] = path[k];
        sfx('step');
        hopTo(el, a, b, 150, function () {
          k++;
          if (RM) { step(); return; }
          if (el) el.setAttribute('transform', 'translate(' + r2(b.x) + ',' + r2(b.y) + ')');
          sc.later(step, 15);
        });
      })();
    }
    function luResolve(i, t, mv) {
      if (view !== 'play') return;
      var se = seats[i], p = se.T[t], caught = [];
      if (p >= 0 && p <= 50) {
        caught = victimsAt(i, luRidx(se.q, p));
        caught.forEach(function (v) {
          var vs = seats[v[0]], vel = tokEl(v[0], v[1]), from = luXY(vs.q, v[1], vs.T[v[1]]);
          vs.T[v[1]] = -1;
          var to = luXY(vs.q, v[1], -1);
          moving[v[0] + ':' + v[1]] = true;
          hopTo(vel, from, to, 650, function () { delete moving[v[0] + ':' + v[1]]; paintToks(); });
        });
      }
      paintToks();
      if (caught.length) { sfx('capture'); say(nmDo(i) + ' caught ' + seats[caught[0][0]].name + '! The token rides back to its yard.', 'lift'); }
      else if (p === L_HOME_P) { sfx('home'); say(nmDo(i) + ' brought a token home!', 'lift'); }
      if (homeOf(i) === se.T.length) { beat(function () { gameOver(i); }, 900); return; }
      var again = (cow() ? enters(die) : die === 6 && sixes < 3) || (LEN.bonus && (caught.length > 0 || p === L_HOME_P));
      var wait = caught.length || p === L_HOME_P ? 1000 : 380;
      if (again) {
        beat(function () {
          if (view !== 'play') return;
          if (die !== 6) sixes = 0;
          say(nmDo(i) + (cow() ? (enters(die) ? ' threw a grace — throw again!' : ' throws again!') : die === 6 ? ' rolled a six — roll again!' : ' rolls again!'), 'lift');
          phase = 'roll'; moves = []; renderChoices(); paintToks();
          dieEnable(ref, !isBot(cur));
          if (isBot(cur)) beat(roll, RM ? 250 : 600);
          else sc.later(function () { focusSoft(ref.stage.querySelector('.arc-die')); }, 40);
        }, wait);
        return;
      }
      beat(nextTurn, wait);
    }
    function nextTurn() {
      if (view !== 'play') return;
      sixes = 0;
      cur = (cur + 1) % seats.length;
      startTurn();
    }
    function pick(k) {
      if (phase !== 'choose' || !moves[k]) return;
      sel = k;
      doMove(moves[k]);
    }

    /* =========================================================== SAAP-SIDI */
    var ladAt = {}, snkAt = {}, ii;
    for (ii = 0; ii < SS_LADDERS.length; ii++) ladAt[SS_LADDERS[ii].foot] = SS_LADDERS[ii];
    for (ii = 0; ii < SS_SNAKES.length; ii++) snkAt[SS_SNAKES[ii].head] = SS_SNAKES[ii];
    function ssToksHTML() {
      return seats.map(function (se, i) {
        var src = seatPiece(se), xy = ssXYu(1);
        return '<div class="arc-tok lu-sstok" data-tok="' + i + '" aria-hidden="true" style="--sc:' + LU_COL[se.q].hex + ';left:' + ssPct(xy.x) + '%;top:' + ssPct(xy.y) + '%">' +
          '<div class="arc-tokface">' + (src ? '<img src="' + esc(src) + '" alt="">' : '<span>' + esc(se.name.charAt(0).toUpperCase()) + '</span>') + '</div></div>';
      }).join('');
    }
    function ssPlace() {
      var at = {};
      seats.forEach(function (se, i) { (at[se.pos] = at[se.pos] || []).push(i); });
      seats.forEach(function (se, i) {
        var el = ref.stage.querySelector('.lu-sstok[data-tok="' + i + '"]');
        if (!el) return;
        var xy = ssXYu(se.pos), list = at[se.pos], n = list.length, k = list.indexOf(i);
        var dx = n > 1 ? (k - (n - 1) / 2) * 2.6 : 0, dy = n > 1 ? (k % 2 ? 1 : -1) * 1.1 : 0;
        el.style.left = ssPct(xy.x + dx) + '%';
        el.style.top = ssPct(xy.y + dy) + '%';
        el.classList.toggle('now', i === cur && view === 'play');
      });
      chipsUpdate();
    }
    function ssHop(i) {
      if (RM) return;
      var el = ref.stage.querySelector('.lu-sstok[data-tok="' + i + '"] .arc-tokface');
      if (!el || !el.animate) return;
      try {
        el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-34%) scale(.94,1.07)', offset: 0.45 },
          { transform: 'translateY(0) scale(1.08,.92)', offset: 0.82 }, { transform: 'none' }], { duration: 150, easing: 'ease-out' });
      } catch (e) {}
    }
    function ssPath(from, v) {
      var path = [], sq;
      if (from + v <= 100) { for (sq = from + 1; sq <= from + v; sq++) path.push(sq); return path; }
      if (young) return path;                     /* the youngest stay put rather than count backwards */
      for (sq = from + 1; sq <= 100; sq++) path.push(sq);
      for (sq = 99; sq >= 200 - from - v; sq--) path.push(sq);
      return path;
    }
    function ssAfterRoll() {
      var se = seats[cur], path = ssPath(se.pos, die);
      if (!path.length) {
        say(nmDo(cur) + ' rolled ' + die + ' — that would pass 100, so ' + (you(cur) ? 'you stay' : 'the token stays') + ' on ' + se.pos + '.', 'calm');
        beat(nextTurn, 1200);
        return;
      }
      if (young && !isBot(cur)) {
        phase = 'count'; countMiss = 0; countAt = path[path.length - 1]; cursorSq = se.pos;
        say(nmDo(cur) + ' rolled ' + die + '. Count ' + die + ' from square ' + se.pos + ' and tap where ' + (you(cur) ? 'you' : 'the token') + ' will land.');
        ssCursor();
        return;
      }
      say(nmDo(cur) + ' rolled ' + die + (se.pos + die > 100 ? ' — bounced off 100.' : '.'), isBot(cur) ? 'calm' : '');
      ssWalk(cur, path);
    }
    function ssCursor() {
      var c = ref.stage.querySelector('.lu-cursor');
      if (!c) return;
      if (phase !== 'count') { c.hidden = true; return; }
      var xy = ssXYu(cursorSq || 1);
      c.hidden = false;
      c.style.left = ssPct(xy.x) + '%'; c.style.top = ssPct(xy.y) + '%';
      c.classList.toggle('hint', countMiss >= 2 && cursorSq === countAt);
    }
    function ssTap(sq) {
      if (phase !== 'count') return;
      var se = seats[cur];
      if (sq === countAt) {
        phase = 'busy'; ssCursor();
        say('Yes — square ' + sq + '!', 'lift');
        ssWalk(cur, ssPath(se.pos, die));
        return;
      }
      countMiss++;
      say('Count again: ' + die + ' steps on from square ' + se.pos + '.' + (countMiss >= 2 ? ' The glowing square is the one.' : ''), 'calm');
      if (countMiss >= 2) {
        cursorSq = countAt; ssCursor();
        var g = ref.stage.querySelector('.lu-target');
        var xy = ssXYu(countAt);
        if (g) { g.hidden = false; g.style.left = ssPct(xy.x) + '%'; g.style.top = ssPct(xy.y) + '%'; }
      }
    }
    function ssWalk(i, path) {
      var se = seats[i], k = 0;
      var tg = ref.stage.querySelector('.lu-target'); if (tg) tg.hidden = true;
      if (RM) { se.pos = path[path.length - 1]; ssPlace(); beat(function () { ssSettle(i); }, 120); return; }
      (function step() {
        if (sc.dead || view !== 'play') return;
        se.pos = path[k]; ssPlace(); ssHop(i); sfx('step');
        k++;
        if (k < path.length) sc.later(step, 165); else beat(function () { ssSettle(i); }, 220);
      })();
    }
    function ssToast(kind, title, text) {
      var el = ref.stage.querySelector('[data-toast]');
      if (!el) return;
      el.className = 'arc-toast ' + kind + ' show';
      el.querySelector('b').textContent = title;
      el.querySelector('span').textContent = text;
      sc.later(function () { if (el) el.classList.remove('show'); }, 3600);
    }
    function ssGlide(i, sq, then) {
      var se = seats[i], el = ref.stage.querySelector('.lu-sstok[data-tok="' + i + '"]');
      if (RM || !el) { se.pos = sq; ssPlace(); beat(then, 120); return; }
      el.style.transition = 'left .8s cubic-bezier(.45,0,.25,1), top .8s cubic-bezier(.45,0,.25,1)';
      se.pos = sq; ssPlace();
      beat(function () { if (el) el.style.transition = ''; then(); }, 850);
    }
    function ssSettle(i) {
      var se = seats[i], sq = se.pos;
      if (ladAt[sq]) {
        var l = ladAt[sq];
        sfx('ladder');
        ssToast('lad', 'Sidi · ' + l.name, l.gloss);
        sayAloud(l.name + '. ' + l.gloss);
        say(nmDo(i) + ' found ' + l.name + ' — ' + l.gloss + '. Up to ' + l.top + '!', 'lift');
        beat(function () { ssGlide(i, l.top, function () { ssAfter(i); }); }, 900);
        return;
      }
      if (snkAt[sq]) {
        var s = snkAt[sq];
        sfx('snake');
        ssToast('snk', 'Saap · ' + s.name, s.gloss);
        sayAloud(s.name + '. ' + s.gloss);
        say(nmDo(i) + ' met ' + s.name + ' — ' + s.gloss + '. Down to ' + s.tail + '.', 'calm');
        beat(function () { ssGlide(i, s.tail, function () { ssAfter(i); }); }, 900);
        return;
      }
      ssAfter(i);
    }
    function ssAfter(i) {
      if (seats[i].pos === 100) { sfx('home'); beat(function () { gameOver(i); }, 700); return; }
      beat(nextTurn, 420);
    }
    function ssXYtoSq(ev) {
      var svg = ref.stage.querySelector('.lu-ssboard svg');
      if (!svg) return 0;
      var r = svg.getBoundingClientRect();
      var ux = (ev.clientX - r.left) / r.width * 108, uy = (ev.clientY - r.top) / r.height * 108;
      var col = Math.floor((ux - 4) / 10), row = Math.floor((uy - 4) / 10);
      if (col < 0 || col > 9 || row < 0 || row > 9) return 0;
      var br = 9 - row;
      return br % 2 === 0 ? br * 10 + col + 1 : br * 10 + (10 - col);
    }

    /* ------------------------------------------------------------ the game */
    function startGame() {
      LEN = LU_LEN[lenId];
      mem.len = lenId; mem.mode = mode; mem.tier = tier; luSave(mem);
      seats.forEach(function (se) {
        se.T = []; se.pos = 1;
        if (mode === 'ludo') for (var t = 0; t < LEN.n; t++) se.T.push(LEN.out1 && t === 0 ? 0 : -1);
      });
      view = 'play'; cur = 0; die = 0; sixes = 0; moves = []; winner = -1;
      ref.wrap.classList.add('playing');
      var top = ref.wrap.querySelector('.arc-top b');
      if (top) top.textContent = mode === 'ludo' ? bigName() + ' · ' + LEN.name : 'Saap-Sidi';
      if (mode === 'ludo') {
        ref.stage.innerHTML = chipsHTML() + '<div class="lu-board">' + luBoardSVG(seats, cow()) + '</div>' + actionHTML();
        paintToks();
      } else {
        ref.stage.innerHTML = chipsHTML() +
          '<div class="lu-board lu-ssboard arc-sswrap">' + ssBoardSVG() + ssToksHTML() +
            '<span class="lu-target" hidden></span><span class="lu-cursor" hidden></span>' +
            '<div class="arc-toast" data-toast aria-hidden="true"><b></b><span></span></div></div>' + actionHTML();
        ssPlace();
      }
      refit();
      startTurn();
    }
    function gameOver(i) {
      if (view !== 'play') return;
      view = 'over'; phase = 'idle'; winner = i;
      var humans = seats.filter(function (s) { return s.kind === 'human'; }).length;
      if (hasGattu() && humans) { mem = luAdapt(mem, !isBot(i)); luSave(mem); tier = mem.tier; }
      ref.wrap.classList.remove('playing');
      var order = seats.map(function (s, k) { return k; }).sort(function (a, b) {
        if (a === i) return -1; if (b === i) return 1;
        return mode === 'ludo' ? (homeOf(b) - homeOf(a)) || (prog(b) - prog(a)) : seats[b].pos - seats[a].pos;
      });
      var se = seats[i];
      ref.stage.innerHTML = '<div class="lu-over">' + faceTag(se, 'lu-face big') +
        '<h3>' + esc(you(i) ? 'You win!' : se.name + ' wins!') + '</h3>' +
        '<p>' + (mode === 'ludo' ? (se.T.length === 2 ? 'Both' : 'All four') + ' tokens home first.' : 'Square 100 — the diya is lit.') + '</p>' +
        '<ol class="lu-places">' + order.map(function (k) {
          var s2 = seats[k];
          return '<li style="--sc:' + LU_COL[s2.q].hex + '">' + faceTag(s2) + '<b>' + esc(s2.name) + '</b><span>' +
            (mode === 'ludo' ? homeOf(k) + ' of ' + s2.T.length + ' home' : 'square ' + s2.pos) + '</span></li>';
        }).join('') + '</ol>' +
        (hasGattu() && humans ? '<p class="lu-note">Gattu plays as <b>' + LU_TIERS[tier].name + '</b> next time.</p>' : '') +
        '<div class="arc-row"><button type="button" class="arc-btn" data-go="out">Finish</button>' +
        '<button type="button" class="arc-btn ghost" data-go="again">Play again</button>' +
        '<button type="button" class="arc-btn ghost" data-go="setup">Change players</button></div></div>';
      sc.later(function () { focusSoft(ref.stage.querySelector('[data-go="again"]')); }, 60);
    }
    function prog(k) { var s = 0; (seats[k].T || []).forEach(function (p) { s += p + 1; }); return s; }
    function endGame() {
      if (finished) return;
      finished = true;
      var w = winner >= 0 && !isBot(winner);
      var first = 0;
      for (var k = 0; k < seats.length; k++) if (!isBot(k)) { first = k; break; }
      var score = mode === 'ludo' ? Math.round(100 * homeOf(first) / Math.max(1, (seats[first].T || []).length)) : seats[first].pos;
      sc.kill();
      try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {}
      if (typeof done === 'function') done({ win: w, score: score, asked: 0, firstTryRight: 0 });
    }

    /* ------------------------------------------------------------- input */
    sc.on(ref.wrap, 'click', function (e) {
      var go = e.target.closest ? e.target.closest('[data-go]') : null;
      if (view === 'play' && mode === 'ludo' && phase === 'choose' && !go) {
        var tk = e.target.closest ? e.target.closest('.lu-tok') : null;
        if (tk && +tk.getAttribute('data-seat') === cur) {
          var t = +tk.getAttribute('data-i');
          for (var m = 0; m < moves.length; m++) if (moves[m].t === t) { pick(m); return; }
        }
        return;
      }
      if (view === 'play' && mode === 'saapsidi' && phase === 'count' && !go) {
        var sq = ssXYtoSq(e);
        if (sq) { cursorSq = sq; ssTap(sq); }
        return;
      }
      if (!go) return;
      var what = go.getAttribute('data-go'), v = go.getAttribute('data-v');
      if (view === 'setup' && setupAct(what, v)) return;
      if (what === 'start') startGame();
      else if (what === 'roll') { if (phase === 'roll' && !isBot(cur)) roll(); }
      else if (what === 'pick') pick(+v);
      else if (what === 'leave') leaveVia(function () { endGame(); });
      else if (what === 'again') startGame();
      else if (what === 'setup') showSetup();
      else if (what === 'out') endGame();
    });

    sc.on(D, 'keydown', function (e) {
      if (sc.dead) return;
      if (detached(host)) { sc.kill(); return; }
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      var k = e.key;
      if (view === 'play' && phase === 'choose') {
        if (k >= '1' && k <= '9' && moves[+k - 1]) { e.preventDefault(); pick(+k - 1); return; }
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % moves.length; renderChoices(); paintToks(); focusSoft(ref.stage.querySelectorAll('.lu-choice')[sel]); return; }
        if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + moves.length) % moves.length; renderChoices(); paintToks(); focusSoft(ref.stage.querySelectorAll('.lu-choice')[sel]); return; }
        if ((k === 'Enter' || k === ' ') && !(e.target.closest && e.target.closest('button'))) { e.preventDefault(); pick(sel); }
        return;
      }
      if (view === 'play' && phase === 'count') {
        if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); cursorSq = Math.min(100, cursorSq + 1); ssCursor(); return; }
        if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); cursorSq = Math.max(1, cursorSq - 1); ssCursor(); return; }
        if (k === 'Enter' || k === ' ') { e.preventDefault(); ssTap(cursorSq); }
        return;
      }
      if (e.target && e.target.closest && e.target.closest('button')) return;   /* a focused button clicks itself */
      var gameKey = k === ' ' || k === 'Spacebar' || k === 'Enter' || k.indexOf('Arrow') === 0;
      if (view === 'play' && gameKey) e.preventDefault();
      if (k !== ' ' && k !== 'Enter' && k !== 'Spacebar') return;
      if (view === 'setup') { e.preventDefault(); startGame(); return; }
      if (view === 'over') { e.preventDefault(); endGame(); return; }
      if (view === 'play' && phase === 'roll' && !isBot(cur)) roll();
    });

    showSetup();
    sc.later(function () { focusSoft(ref.stage.querySelector('.lu-start')); }, 60);
    /* test handle: the state a browser check reads, never shown */
    host.__ludo = { get phase() { return phase; }, get view() { return view; }, get cur() { return cur; }, get moves() { return moves; },
      get seats() { return seats; }, get tier() { return tier; }, get pachisi() { return cow(); }, get thrown() { return thrown; }, get die() { return die; }, get log() { return tlog; } };
    return teardownOf(sc, function () { finished = true; try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {} });
  }

  /* ==================================================================
     COVER SCENES — self-animating 48x48 SVG for the arcade shelf.
     The icon acts out its game: on Saap-Sidi a die tumbles up the ladder
     while the snake sways; on Ludo a token hops cell by cell across the
     cross. Motion lives inside the SVG (inline animations, keyframes in
     the injected CSS above), and .arc-anim goes still under
     prefers-reduced-motion.
     ================================================================== */

  var SS_SCENE =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M15 43 21 7"/><path d="M23 43 29 7"/>' +
      '<path d="M17 35h8"/><path d="M18.4 27h8"/><path d="M19.8 19h8"/><path d="M21.2 11h8"/>' +
      '<g class="arc-anim" style="animation:arc-sway 1.6s ease-in-out infinite alternate">' +
        '<path d="M35 8c7 4-2 10 4 15 5 4 1 10-4 12"/>' +
        '<circle cx="35" cy="8" r="2.6" fill="#fff" stroke="none"/>' +
      '</g>' +
      '<g class="arc-anim" style="animation:arc-climb 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center">' +
        '<rect x="6" y="33" width="9" height="9" rx="2"/>' +
        '<circle cx="10.5" cy="37.5" r="1.1" fill="#fff" stroke="none"/>' +
      '</g>' +
    '</svg>';

  var LUDO_SCENE =
    '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18 4h12v14h14v12H30v14H18V30H4V18h14Z"/>' +
      '<path d="M24 18v-4"/><path d="M18 24h-4"/><path d="M30 24h4"/><path d="M24 30v4"/>' +
      '<circle class="arc-anim" style="animation:arc-hop 2.6s ease-in-out infinite" cx="6" cy="24" r="3.2"/>' +
      '<g class="arc-anim" style="animation:arc-spin 5s linear infinite;transform-box:fill-box;transform-origin:center">' +
        '<rect x="20" y="20" width="8" height="8" rx="1.8"/>' +
        '<circle cx="24" cy="24" r="1" fill="#fff" stroke="none"/>' +
      '</g>' +
    '</svg>';

  /* ==================================================================
     REGISTRY — push, never replace: games.js owns the array.
     ================================================================== */

  /* for tools/check-ludo.js: the real rule, not a copy */
  W.IND_GAMES_TEST = W.IND_GAMES_TEST || {};
  W.IND_GAMES_TEST.ludoAdapt = luAdapt;
  W.IND_GAMES_TEST.pachisi = PACHISI;

  W.IND_GAMES.push(
    { id: 'ludo', name: 'Ludo', sub: 'the family race board, with Saap-Sidi inside', icon: 'game', minutes: 10, tag: 'Race',
      teaches: false,
      c: '#3b6fd4', c2: '#d94f3d',
      blurb: 'Pachisi in a British suit, for two to four round one phone — Gattu plays at three tiers. Saap-Sidi, the board that began as Gyan Chaupar, is inside. Played for fun.',
      scene: LUDO_SCENE,
      engine: ludo },
    /* Saap-Sidi's old card, kept so an old link still opens — on Ludo's Saap-Sidi tab.
       hide: the Play hub never shows it (one card, spec §3.1). */
    { id: 'saapsidi', name: 'Saap-Sidi', sub: 'Gyan Chaupar, inside Ludo', icon: 'game', minutes: 5, tag: 'Board',
      teaches: false, hide: true,
      c: '#149a6d', c2: '#e8912d',
      blurb: 'The board that began as Gyan Chaupar: every ladder a virtue, every snake a little slip. Now a mode inside Ludo.',
      scene: SS_SCENE,
      engine: function (host, opts, done) {
        var o = {}, k;
        for (k in (opts || {})) if (opts.hasOwnProperty(k)) o[k] = opts[k];
        o.mode = 'saapsidi';
        return ludo(host, o, done);
      } }
  );

  injectCSS();
})();
