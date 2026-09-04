# 18 — The City Kit

The parts list for rendering Sabhyata's cities as composed SVG instead of painted plates.

**291 units**, twelve categories. Nothing is drawn yet — this is the list the drawing works from.

Machine-readable source: [`tools/city-kit.json`](../tools/city-kit.json).

## The unit

`L × B × H` — length, breadth, height, in grid units. A basic house is `1×1×1`; a tower is `1×1×5`.

| | |
|---|---|
| Real size | 1 unit = **4 metres** on all three axes |
| Projection | **2:1 dimetric (true isometric would break pixel-crisp tiling)**; one ground tile 64 × 32 px, one height unit rises 32 px |
| Canvas | a part L x B x H draws into a viewBox 32*(L+B) wide by 16*(L+B)+32*H tall |
| Anchor | south corner of the footprint diamond |
| Draw order | painter's, by (gx+gy) then by height |
| Board | 36 × 24 tiles |

L = along +x (screen down-right), B = along +y (screen down-left), H = up. Figures are drawn at 1.5x true human scale, the one deliberate exaggeration.

## Ground & terrain — 26 parts

The board itself. Flat tiles unless a height is given; all four rotations must butt seamlessly.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `gnd-plain` | Alluvial plain | `1×1×0` | 0-12 | Pale ochre river earth with a faint grass fleck. The default ground of the Gangetic cities. | hastinapura, kashi, vaishali, pataliputra, nalanda, mathura |
| `gnd-salt` | Salt flat | `1×1×0` | 0-12 | White crust cracked into hairline polygons; blinding at golden hour. | dholavira |
| `gnd-sand-river` | River sand | `1×1×0` | 0-12 | Warm pale sand, ripple lines, the odd pebble. Meets water tiles without a bank piece. | kalibangan, hastinapura |
| `gnd-dune` | Dune sand | `1×1×0.5` | 0-12 | A rolling swell rather than a flat tile; stacks to build a dune field. | konark, mamallapuram |
| `gnd-black` | Black cotton soil | `1×1×0` | 0-12 | Dark cracked Deccan earth, faintly purple in shadow. | ajanta, sopara |
| `gnd-laterite` | Red laterite | `1×1×0` | 0-12 | Iron-red pitted ground of the Konkan and Malabar. | muziris, sopara |
| `gnd-rock` | Granite sheet | `1×1×0` | 0-12 | Bare exfoliating rock, gold in low light, with shallow pooling in the hollows. | hampi, dhauli, mamallapuram, bengaluru |
| `gnd-scrub` | Thorn scrub | `1×1×0` | 0-12 | Dusty grey-green ground, thin grass, scattered stones. | delhi, kalibangan |
| `gnd-grass` | Green sward | `1×1×0` | 0-12 | Unmown grass of a hill or a common. | sanchi, rakhigarhi, vaishali |
| `gnd-lawn` | Mown lawn | `1×1×0` | 9-12 | Flat modern turf with a mower's banding. | chandigarh, bengaluru |
| `gnd-mud` | Churned mud | `1×1×0` | 0-12 | Wet worked earth around a tank, a kiln or a cattle stand. | all |
| `gnd-beach` | Beach sand | `1×1×0` | 0-12 | Tideline piece: dry sand up-slope, dark wet sand and a wrack line down-slope. | mamallapuram, konark, sriharikota, sopara |
| `gnd-forest` | Forest floor | `1×1×0` | 0-12 | Leaf litter and root shadow under a canopy. | ajanta, sriharikota |
| `gnd-tarmac` | Asphalt | `1×1×0` | 9-12 | Grey road surface for the modern sectors; not a road piece, just the ground under one. | mumbai, kolkata, chandigarh, bengaluru |
| `gnd-court` | Swept courtyard | `1×1×0` | 0-12 | Beaten earth or flagging inside a compound, kept clean; takes a rangoli overlay. | all |
| `ter-step` | Terrace riser | `1×1×1` | 0-12 | One unit of retaining edge. Stack and butt to raise any platform. | sanchi, thanjavur, rakhigarhi |
| `ter-ramp` | Earth ramp | `1×1×1` | 0-12 | Climbs exactly one unit over one tile; the only legal way a road changes level. | dholavira, sanchi |
| `ter-mound` | Settlement mound | `2×2×1` | 0-12 | Low rounded tell — the shape a buried city makes. | rakhigarhi, kalibangan, sopara |
| `ter-hill` | Hill segment | `3×3×2` | 0-12 | A rounded green shoulder; three or four of these make a stupa hill. | sanchi, bengaluru |
| `ter-cliff` | Cliff face | `1×1×4` | 0-12 | Sheer basalt with horizontal bedding; the wall a cave is cut into. | ajanta |
| `ter-gorge` | Gorge curve | `1×1×3` | 0-12 | Cliff piece with a 30 degree turn, so a horseshoe closes in twelve. | ajanta |
| `ter-boulder-s` | Boulder, small | `1×1×1` | 0-12 | One rounded golden granite ball. | hampi, mamallapuram, dhauli |
| `ter-boulder-l` | Boulder, large | `2×2×3` | 0-12 | A house-sized boulder to break a street line. | hampi |
| `ter-boulder-bal` | Balancing boulder | `1×1×2` | 0-12 | A ball resting on a slope, apparently about to go and never going. | mamallapuram |
| `ter-ravine` | Dry ravine | `1×1×0` | 0-12 | A cut channel with no water in it; reads as a shadow line from above. | kalibangan, delhi |
| `ter-sandbar` | Sandbar | `2×1×0` | 0-12 | Mid-river bank; boats are drawn up on it, never sailing past it. | hastinapura, pataliputra |

## Roads, steps & rails — 18 parts

Every road type ships as five connector pieces — straight, corner, tee, cross, end — each 1×1×0 unless noted. Walkers use only these.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `rd-mud` | Mud road | `1×1×0` | 0-12 | Unit 1 of the whole kit: beaten earth, cart ruts, a soft edge that bleeds into the ground tile. Every city has it. | all |
| `rd-brick` | Baked-brick street | `1×1×0` | 0-1 | Harappan street of standard bricks laid in courses, with a covered drain line down one side. | dholavira, lothal, rakhigarhi, kalibangan |
| `rd-stone` | Dressed stone paving | `1×1×0` | 2-12 | Irregular slabs, worn smooth down the middle. | pataliputra, nalanda, madurai, thanjavur, hampi, delhi |
| `rd-flag` | Processional avenue | `2×1×0` | 3-8 | Two units wide, flagged, kerbed, wide enough for a temple car. Its own corner and tee pieces. | thanjavur, madurai, konark |
| `rd-bazaar` | Colonnaded bazaar street | `3×1×0` | 4-9 | A road tile with a pillared arcade one unit deep on each side; shops slot into the arcade. | hampi, delhi, madurai |
| `rd-garden` | Char bagh walk | `1×1×0` | 7-7 | Paved walk paired with a sunken water channel; only turns at right angles. | agra |
| `rd-avenue` | Tree-lined avenue | `2×1×0` | 9-12 | Two-lane tarmac with a planted verge each side; the piece includes its verge. | chandigarh, bengaluru, mumbai |
| `rd-track` | Cart track | `1×1×0` | 0-12 | Two ruts through grass or crop. Half the width of a mud road, no drain, no kerb. | rakhigarhi, kalibangan, vaishali |
| `rd-causeway` | Causeway | `1×1×1` | 0-12 | Raised road across water or marsh, stone-faced. Butts to a bank piece at each end. | amritsar, sriharikota, lothal |
| `rd-ghat` | Ghat steps | `1×1×1` | 1-12 | One unit of river stair, descending one unit. Stack five or six to reach the water. | kashi, ujjain, mathura, vaishali |
| `rd-ghat-land` | Ghat landing | `2×1×0` | 1-12 | A flat landing that breaks a flight of steps; where a boat ties up and a lamp is lit. | kashi, mathura |
| `rd-jetty` | Timber jetty | `1×1×0.5` | 0-12 | Planks on piles running out over water; a walkable road tile that sits on a water tile. | lothal, sopara, muziris, surat |
| `rd-wharf` | Stone wharf | `3×1×0.5` | 2-12 | Faced quay edge with bollards and a mooring ring. | pataliputra, surat, mumbai |
| `rd-rail` | Rail track | `1×1×0` | 9-12 | Two rails on sleepers in ballast. Straight, curve and points; the points is the only three-way piece. | mumbai, kolkata, chandigarh, sriharikota |
| `rd-tram` | Tram rails | `1×1×0` | 9-11 | Grooved rails set flush into a paved street, with an overhead wire post every four tiles. | kolkata, mumbai |
| `rd-bridge-timber` | Timber footbridge | `2×1×1` | 0-8 | Planks and a rope rail; spans two tiles of water. | hastinapura, vaishali, ajanta |
| `rd-bridge-stone` | Stone arch bridge | `3×1×2` | 2-12 | One semicircular arch, cutwaters, a parapet. Repeat for a longer crossing. | ujjain, madurai, agra |
| `rd-drain` | Covered drain | `1×1×0` | 0-1 | A slab-topped channel running alongside a street. The Harappan cities are known for it, so it is a piece and not a texture. | dholavira, lothal, rakhigarhi |

## Water — 18 parts

Water tiles sit 0.25 below grade so banks read. Never put a boat on a river that the game does not moor.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `wa-river` | River | `1×1×0` | 0-12 | Straight, bend, fork and mouth. Slow olive-green with a paler thread of current. | hastinapura, kashi, ujjain, pataliputra, mathura, agra, ahmedabad, surat, kolkata |
| `wa-bank` | River bank | `1×1×0` | 0-12 | The transition tile: earth or stone above, wet line below. Four rotations plus inner and outer corners. | all river cities |
| `wa-sea` | Open sea | `1×1×0` | 0-12 | Deep blue-green with a long swell. | sopara, mamallapuram, konark, muziris, mumbai, sriharikota |
| `wa-surf` | Surf edge | `1×1×0` | 0-12 | Breaking white water; always sits between sea and beach. | mamallapuram, konark, sriharikota |
| `wa-backwater` | Backwater | `1×1×0` | 0-12 | Still green channel under palms, edged with reed. | muziris, sriharikota |
| `wa-lagoon` | Lagoon | `1×1×0` | 0-12 | Shallow flat water, pale, with sandbars showing through. | sriharikota, konark |
| `wa-canal` | Irrigation channel | `1×1×0` | 0-12 | Silver thread between fields; straight and corner only. | lothal, thanjavur, muziris |
| `wa-channel` | Garden channel | `1×1×0` | 7-7 | Cut stone runnel of a formal garden, with a fountain jet piece every fourth tile. | agra |
| `wa-tank` | Temple tank | `3×3×1` | 1-12 | Square tank sunk one unit, stone steps on all four sides. | madurai, vaishali, thanjavur |
| `wa-kund` | Stepped kund | `2×2×1` | 0-12 | Smaller tank whose steps step in as they descend, so the plan reads as a spiral. | ujjain, dholavira |
| `wa-reservoir` | Stepped reservoir | `4×3×2` | 0-0 | Rock-cut rainwater reservoir with stairs running down inside it. Chain several; Dholavira had sixteen. | dholavira |
| `wa-basin` | Dockyard basin | `6×4×1` | 0-0 | Rectangular baked-brick basin with an inlet channel and a spillway. | lothal |
| `wa-sarovar` | Shrine pool | `6×6×1` | 7-12 | Large still square pool with a marble walkway all round and one causeway in. | amritsar |
| `wa-well` | Open well | `1×1×1` | 0-12 | Round stone-lined well with a low parapet. | all |
| `wa-well-pulley` | Well with hoist | `1×1×2` | 0-12 | The same well with a timber frame, pulley and rope. | rakhigarhi, kalibangan, delhi |
| `wa-waterfall` | Waterfall | `1×1×3` | 0-12 | A fall down three units of cliff, with spray at the foot. | ajanta |
| `wa-lotus` | Lotus patch | `1×1×0.25` | 0-12 | Overlay for a tank or a slow river; pads and two or three flowers. | madurai, vaishali, thanjavur |
| `wa-moat` | Moat | `1×1×0` | 1-8 | Water tile that only ever runs against a rampart piece. | pataliputra, delhi, hampi |

## Trees & crops — 32 parts

Trees are single pieces; crops are seamless field tiles.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `tr-peepal` | Peepal | `1×1×3` | 0-12 | Heart leaves on a pale trunk; the tree a village council sits under. | hastinapura, vaishali, rakhigarhi |
| `tr-banyan` | Banyan | `2×2×3` | 0-12 | Wide crown on aerial roots. Its footprint is two tiles because a gurukul sits inside it. | vaishali, madurai, bengaluru |
| `tr-mango` | Mango | `1×1×2` | 0-12 | Dense dark rounded crown; tiles into an orchard without looking stamped. | vaishali, sanchi, nalanda |
| `tr-neem` | Neem | `1×1×2` | 0-12 | Airy pale-green canopy, the shade tree of a courtyard. | ahmedabad, delhi, mathura |
| `tr-coconut` | Coconut palm | `1×1×4` | 0-12 | Leaning trunk, eight fronds, nuts in the crown. | muziris, sopara, mamallapuram, thanjavur |
| `tr-palmyra` | Palmyra | `1×1×4` | 0-12 | Straight black trunk, stiff fan leaves; the drier southern coast. | madurai, mamallapuram |
| `tr-casuarina` | Casuarina | `1×1×3` | 0-12 | Feathery grey-green needle tree planted in windbreak rows on sand. | konark, mamallapuram, sriharikota |
| `tr-raintree` | Rain tree | `2×2×3` | 9-12 | Broad flat umbrella crown over a road; the colonial avenue tree. | bengaluru, mumbai |
| `tr-gulmohar` | Gulmohar | `1×1×2` | 9-12 | Flame-red flowering crown. | bengaluru, chandigarh |
| `tr-jacaranda` | Jacaranda | `1×1×2` | 9-12 | Mauve flowering crown with a drift of fallen petals on the tile below. | bengaluru |
| `tr-cypress` | Cypress | `1×1×3` | 7-8 | Narrow dark column; only ever planted in a formal Mughal garden, in rows. | agra, delhi |
| `tr-banana` | Banana clump | `1×1×2` | 0-12 | Torn bright green blades around a stem. | hampi, muziris, thanjavur |
| `tr-bamboo` | Bamboo clump | `1×1×3` | 0-12 | Fine culms, leaf mass high up. | ajanta, sopara, kolkata |
| `tr-babul` | Thorn babul | `1×1×1` | 0-12 | Flat-topped scrappy thorn tree of the scrub. | delhi, kalibangan, dholavira |
| `tr-teak` | Teak | `1×1×3` | 0-12 | Big paddle leaves, straight bole; the forest above a gorge. | ajanta |
| `tr-tamarind` | Tamarind | `1×1×3` | 0-12 | Fine feathery dark crown by a road or a tank. | madurai, hampi, dhauli |
| `tr-shrub` | Shrub | `1×1×0.5` | 0-12 | Filler bush for a compound edge; three silhouettes. | all |
| `tr-hedge` | Clipped hedge | `1×1×0.5` | 7-12 | Straight and corner. Only where a garden is designed, never in a village. | agra, chandigarh, bengaluru |
| `tr-grove` | Orchard tile | `1×1×2` | 0-12 | Four small trees in a planted grid on one tile — the cheap way to fill mango country. | vaishali, sanchi, nalanda, agra |
| `cr-wheat` | Wheat field | `1×1×0.25` | 0-12 | Gold, seamless, with a faint furrow direction that must be respected when tiling. | rakhigarhi, amritsar, kalibangan |
| `cr-barley` | Barley field | `1×1×0.25` | 0-4 | Paler and shorter than wheat, with awns. | rakhigarhi, hastinapura |
| `cr-paddy-wet` | Flooded paddy | `1×1×0.25` | 0-12 | Sheet water inside a low bund, reflecting the sky; young shoots in rows. | thanjavur, dhauli, madurai, muziris |
| `cr-paddy-green` | Standing paddy | `1×1×0.25` | 0-12 | The same bunded field grown out to solid emerald. | thanjavur, dhauli |
| `cr-mustard` | Mustard strip | `1×1×0.25` | 0-12 | One tile of hard yellow flower, used as a stripe across a wheat field. | kalibangan, rakhigarhi, amritsar |
| `cr-furrow` | Ploughed furrows | `1×1×0.25` | 0-12 | Criss-crossed furrows in dark earth. Kalibangan's field is the oldest one known, so it is its own piece. | kalibangan |
| `cr-cotton` | Cotton field | `1×1×0.25` | 0-12 | Grey-green bushes with white bolls. | ahmedabad, surat |
| `cr-sugarcane` | Cane field | `1×1×1` | 0-12 | Tall enough to hide a cart; the only crop that blocks sight lines. | hastinapura, kashi |
| `cr-pepper` | Pepper vines | `1×1×2` | 0-12 | Vines climbing standard poles in rows. | muziris |
| `cr-spice` | Spice garden | `1×1×1` | 0-12 | Cardamom and ginger under light shade. | muziris |
| `cr-kitchen` | Kitchen garden | `1×1×0.25` | 0-12 | Small beds, a gourd frame, a fence of split bamboo. | all |
| `cr-threshing` | Threshing floor | `2×2×0` | 0-12 | Round beaten circle with a pole at the centre and heaped straw at the edge. | rakhigarhi, kalibangan, amritsar |
| `cr-haystack` | Haystack | `1×1×1` | 0-12 | Conical stack around a pole. | rakhigarhi, vaishali, amritsar |

## Dwellings — 28 parts

Where people live. Region and era decide the skin, never the footprint.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `hs-hut-round` | Round thatch hut | `1×1×1` | 0-12 | Unit 1 of the dwellings: circular mud wall, conical thatch, one low door. Still the right piece for a village in any era. | rakhigarhi, dhauli, kalibangan, vaishali |
| `hs-hut-rect` | Ridge thatch hut | `1×1×1` | 0-12 | Rectangular mud walls under a ridged thatch roof, eaves overhanging one side. | dhauli, sopara, muziris |
| `hs-hut-pair` | Hut pair with yard | `2×1×1` | 0-12 | Two huts sharing a swept yard and a fence — reads as a household, not a building. | rakhigarhi, vaishali |
| `hs-mud-flat` | Mud-brick flat-roof house | `1×1×1` | 0-8 | Flat mud roof with a parapet and a ladder; things dry up there. | kalibangan, dholavira, delhi |
| `hs-mud-flat-2` | Mud-brick, two storey | `1×1×2` | 0-8 | The same with an upper room and an outside stair. | dholavira, delhi |
| `hs-harappan` | Harappan courtyard house | `2×2×1` | 0-1 | Baked brick around a small court, its own well and bathing platform, drain to the street. | lothal, dholavira, rakhigarhi |
| `hs-stone-low` | Low stone house | `1×1×1` | 0-2 | Dry-laid stone walls, flat roof of beams and earth. | dholavira |
| `hs-timber-hall` | Carved timber hall | `2×1×2` | 1-2 | Post-and-beam hall with carved brackets and a banner on the ridge. | hastinapura, vaishali |
| `hs-tile-court` | Tiled courtyard house | `2×2×1` | 1-12 | Rooms on four sides of an open court, half-round tile roof pitched inward. | vaishali, madurai, ujjain |
| `hs-tile-veranda` | House with pillared veranda | `2×1×1` | 3-12 | Raised plinth, wooden posts, a thinnai bench along the front. | madurai, thanjavur, mamallapuram |
| `hs-brick-cell` | Monastery cell | `1×1×1` | 2-4 | One doorway, one niche, one stone bed. Tile eight of them into a courtyard block. | nalanda, sanchi, sopara |
| `hs-brick-hall` | Red-brick hall | `3×1×2` | 3-4 | Long monastic hall, corbelled openings, a broad plinth. | nalanda |
| `hs-kerala` | Kerala tiled house | `2×1×2` | 4-12 | Steep hipped tile roof with a gable vent, wide eaves against the rain. | muziris |
| `hs-bengal-chala` | Bengal chala hut | `1×1×1` | 9-12 | The curved thatch roof whose line later ends up carved in brick temples. | kolkata |
| `hs-raj-flat` | Desert flat-roof house | `1×1×2` | 0-12 | Thick walls, tiny windows, a stepped parapet, a wind-shaded terrace. | kalibangan, delhi |
| `hs-guj-pol` | Pol house | `1×1×2` | 7-12 | Narrow front with a carved wooden bracket and a first-floor otla; only in a tight lane. | ahmedabad, surat |
| `hs-haveli` | Haveli | `2×2×3` | 6-10 | Courtyard mansion with jharokha oriels and a carved gateway. | ahmedabad, delhi, surat |
| `hs-konkan` | Konkan tiled house | `1×1×1` | 2-12 | Low laterite walls, red pantile roof, a jackfruit tree beside it. | sopara |
| `hs-flat-medieval` | Flat-roofed town house | `1×1×2` | 5-8 | Rubble and plaster, an arched doorway, roof terrace with a jali screen. | delhi, agra, hampi |
| `hs-flat-medieval-3` | Town house, three storey | `1×1×3` | 5-9 | The same stacked, with a projecting timber balcony. | delhi, surat, ahmedabad |
| `hs-shop-house` | Shop below, home above | `1×1×2` | 4-12 | Open shutter at street level, living rooms over. The building a bazaar is made of. | hampi, delhi, madurai, ahmedabad |
| `hs-chawl` | Chawl | `3×1×3` | 9-11 | Single rooms off a shared open gallery, common taps at the end. | mumbai |
| `hs-colonnade` | Colonnaded street front | `3×1×3` | 9-11 | Continuous arcaded pavement under three storeys of shuttered windows. | kolkata, mumbai |
| `hs-bungalow` | Garden bungalow | `2×2×1` | 9-12 | Hipped roof, deep veranda, monkey-top gable, a compound wall and a gate. | bengaluru, chandigarh |
| `hs-sector-house` | Sector house | `2×1×1` | 11-12 | Exposed brick, a concrete sun-breaker, a small front lawn. | chandigarh |
| `hs-flat-block` | Flat block | `2×2×4` | 11-12 | Four floors of balconies, a stair tower, water tanks on the roof. | chandigarh, mumbai, bengaluru |
| `hs-glass-block` | Glass office block | `2×2×5` | 12-12 | Curtain wall reflecting the sky, a landscaped forecourt. | bengaluru |
| `hs-ashram-cottage` | Ashram cottage | `2×1×1` | 10-10 | Whitewashed walls, tile roof, a low veranda, a spinning wheel inside the door. | ahmedabad |

## Work & civic buildings — 26 parts

What the player raises and what the city works in.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `bd-granary` | Granary | `2×2×2` | 0-12 | Player building. Raised platform, air ducts under the floor, a thatched cap. Era skins: mud-brick block, clay bin, masonry kotha. Always stands in a field, never on a street. | player, rakhigarhi, harappa |
| `bd-workshop` | Workshop | `2×1×1.5` | 0-12 | Player building. Open-sided lean-to over a kiln and a bench. Skins: bead workshop, potter, sculptor's shed, weaver's shed. | player, lothal, mathura, ahmedabad |
| `bd-gurukul` | Gurukul | `2×2×1` | 0-12 | Player building. Low stone platform and a woven mat under a tree, palm-leaf shelf, a lamp. Skins: gurukul, vihara, madrasa, schoolroom. | player, vaishali, nalanda |
| `bd-bazaar` | Bazaar | `2×1×1` | 0-12 | Player building. A run of striped awnings on bamboo, a balance, baskets. Skins: village haat, covered bazaar, colonial godown front. | player, ujjain, hampi, delhi |
| `bd-stepwell` | Stepwell | `2×2×2` | 0-12 | Player building. Sinks two units below grade with flights of steps in the shaft and a small pavilion at the rim. The only piece that reads downward. | player, dholavira, ahmedabad |
| `bd-warehouse` | Warehouse | `3×2×2` | 0-12 | Long blank-walled store with a loading door on the water side. | lothal, sopara, surat, muziris, kolkata |
| `bd-weighing` | Weighing yard | `2×2×1` | 0-12 | Walled yard with a great beam balance, stacked standard weights, a clerk's shelter. | muziris, surat, lothal |
| `bd-crane` | Timber hoist | `1×1×3` | 0-12 | A-frame, rope, hook. Sits at a wharf or against a scaffold. | lothal, surat, mamallapuram |
| `bd-pavilion-thatch` | Trading pavilion | `2×2×1.5` | 0-8 | Palm-thatch roof on posts, open on all sides, goods stacked under it. | sopara, muziris |
| `bd-mandapa` | Pillared mandapa | `3×3×2` | 3-8 | Stone pillared pavilion, flat slab roof. Tiles edge to edge to make a hall of any length. | hampi, madurai, thanjavur, mamallapuram |
| `bd-assembly` | Assembly hall | `4×3×2` | 1-2 | Vast open pillared hall with mats in ordered rows — where a sabha meets. | vaishali, pataliputra |
| `bd-palace-hall` | Pillared palace hall | `6×4×3` | 2-2 | Eighty polished sandstone columns under a timber roof; the Mauryan hall. | pataliputra |
| `bd-observatory` | Observatory roof | `2×2×2` | 1-12 | Flat terrace with a masonry gnomon and a bronze sighting rod; charts weighted down. | ujjain |
| `bd-library-tower` | Library tower | `3×3×7` | 3-3 | Nine storeys of brick with corbelled openings; manuscripts by the shelf-mile. | nalanda |
| `bd-langar-hall` | Langar hall | `4×2×2` | 7-12 | Long hall with an open kitchen end; rows of mats, huge cooking vessels. | amritsar |
| `bd-mill` | Mill with chimney | `2×2×6` | 9-11 | Brick shed under a saw-tooth roof and one tall round chimney with a smoke plume. | mumbai, ahmedabad |
| `bd-press` | Printing shop | `2×1×2` | 9-11 | Ground-floor press, type cases in the window, bundles of sheets drying. | kolkata |
| `bd-bookstall` | Bookstall | `1×1×1` | 9-12 | Tarpaulin over a plank counter, books stacked in walls two deep. | kolkata |
| `bd-sculpture-yard` | Sculpture yard | `2×2×1` | 3-4 | Open compound of plinths with figures at every stage of finish, chips underfoot. | mathura, mamallapuram |
| `bd-lab` | Institute block | `3×2×3` | 11-12 | Pale stone teaching block, a colonnade, a clock face, a lawn in front. | bengaluru |
| `bd-vab` | Assembly building | `4×4×8` | 12-12 | Windowless hall tall enough to stand a rocket up inside, with a rail door. | sriharikota |
| `bd-kiln` | Kiln | `1×1×1` | 0-12 | Beehive brick kiln with a stoke hole and a thread of smoke. | lothal, mathura, ahmedabad |
| `bd-forge` | Forge | `1×1×1` | 1-12 | Charcoal hearth, bellows, anvil, under a half roof. | hastinapura, delhi |
| `bd-shrine-small` | Wayside shrine | `1×1×1` | 1-12 | A niche, a step, a pennant. Deliberately generic — no deity is depicted at board scale. | all |
| `bd-stable` | Stable | `2×1×1` | 1-12 | Open byre with tethering rings and a fodder trough. | hastinapura, delhi, hampi |
| `bd-station` | Railway station | `4×2×2` | 9-12 | Platform, awning on iron brackets, a name board left blank at board scale. | mumbai, kolkata, chandigarh |

## Walls, gates & defence — 11 parts

Prakara and durg are built from these. No piece here is a national boundary and none of it animates.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `wl-mud` | Mud rampart | `1×1×2` | 0-8 | Rammed earth with a battered face. Straight and corner. The first prakara a player builds. | player, kalibangan, rakhigarhi |
| `wl-brick` | Brick rampart | `1×1×2` | 0-8 | Coursed brick with a walkway on top. | dholavira, pataliputra, delhi |
| `wl-stone` | Stone rampart | `1×1×3` | 2-12 | Dressed stone with a crenellated parapet. | hampi, delhi, agra, surat |
| `wl-palisade` | Timber palisade | `1×1×2` | 1-2 | Split logs set upright with a lashed rail; Pataliputra's famous wooden wall. | pataliputra, hastinapura |
| `wl-parapet` | Compound wall | `1×1×1` | 0-12 | Low boundary wall of a house or a garden, with a gate gap piece. | all |
| `wl-bastion` | Round bastion | `2×2×4` | 2-12 | Projecting drum with arrow slits, one unit taller than the wall it interrupts. | delhi, hampi, surat |
| `wl-watchtower` | Watchtower | `2×2×5` | 1-8 | Timber or stone tower with a covered top and a beacon pan. | pataliputra, hampi, delhi |
| `wl-gate` | Gate arch | `2×1×3` | 1-12 | A road passes through it; the piece carries the road tile inside its opening. | all walled cities |
| `wl-gate-carved` | Carved stone gateway | `3×1×4` | 4-8 | Deep-carved jambs, a heavy lintel, brackets, a chamber over. | hampi, delhi, thanjavur |
| `wl-corner` | Wall corner | `1×1×3` | 0-12 | Right-angle piece; matches any rampart skin. | all walled cities |
| `wl-keep` | Durg keep | `3×3×5` | 3-12 | Player building. Solid stone block with a ramp entry — shelters a monument through a raid. | player, delhi, hampi, surat |

## Monument parts — 46 parts

Heroes are assembled from shared parts so a new monument needs no new art.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `mn-plinth` | Stepped plinth | `1×1×0.5` | 0-12 | Mouldings, a course of lotus petals, a drip edge. Tiles under any footprint. | all monuments |
| `mn-terrace` | Marble terrace | `6×6×1` | 7-7 | Raised faced platform with a rail, a corner chhatri socket at each end. | agra |
| `mn-stupa-dome` | Stupa dome | `4×4×3` | 2-4 | Solid hemisphere on a drum with a circumambulatory path. | sanchi, sopara, nalanda |
| `mn-harmika` | Harmika | `1×1×1` | 2-4 | Square railed box on the dome's crown. | sanchi, sopara |
| `mn-chattra` | Umbrella spire | `1×1×1` | 2-4 | One stone parasol on a mast; stack three. | sanchi, sopara |
| `mn-vedika` | Stone railing | `1×1×1` | 2-4 | Uprights, three lens-section rails, a coping. Straight and corner. | sanchi, dhauli |
| `mn-torana` | Torana gateway | `2×1×3` | 2-4 | Two carved pillars, three curved architraves, volute ends. | sanchi |
| `mn-vimana-tier` | Vimana tier | `3×3×1` | 4-8 | One tapering storey with miniature shrines along its parapet. Stack eleven for Thanjavur. | thanjavur, mamallapuram |
| `mn-vimana-cap` | Vimana cap | `2×2×2` | 4-8 | The octagonal capping stone and finial that ends a stack of tiers. | thanjavur |
| `mn-gopuram-tier` | Gopuram tier | `4×2×1` | 4-12 | Tapering gate tower storey crowded with figures. Stack seven, then cap with a barrel roof. | madurai, thanjavur |
| `mn-gopuram-cap` | Gopuram barrel roof | `3×1×1.5` | 4-12 | The wagon-vault crest with its row of finials. | madurai |
| `mn-shikhara` | Nagara shikhara | `2×2×4` | 3-12 | Curvilinear spire with a vertical band up each face. | kashi, mathura, konark |
| `mn-amalaka` | Amalaka and kalash | `1×1×1` | 3-12 | Ribbed disc and pot finial; ends a shikhara. | kashi, konark |
| `mn-mandapa-bay` | Mandapa bay | `2×2×2` | 3-12 | One structural bay of a pillared hall — four columns, beams, a slab. Tile to any hall. | thanjavur, madurai, hampi |
| `mn-nandi-pavilion` | Nandi pavilion | `2×2×2` | 4-12 | Open pillared canopy facing a shrine, with a couchant bull inside. | thanjavur |
| `mn-chariot-wheel` | Chariot wheel | `1×1×2` | 4-4 | Carved stone wheel with spokes, hub medallion and axle. Konark has twenty-four. | konark |
| `mn-chariot-horse` | Straining horse | `1×1×2` | 4-4 | Stone horse leaning into the traces. Konark has seven. | konark |
| `mn-chariot-body` | Chariot shrine body | `4×3×4` | 4-4 | The temple mass the wheels are attached to, carved in bands. | konark |
| `mn-ratha` | Monolithic ratha | `2×2×3` | 4-4 | A whole small temple cut from one boulder, roof imitating timber. | mamallapuram |
| `mn-relief-cliff` | Carved cliff panel | `4×1×4` | 4-4 | A rock face worked into a crowded relief; elephants at the foot. | mamallapuram, dhauli |
| `mn-cave-veranda` | Rock-cut cave mouth | `2×1×3` | 3-3 | Pillared veranda cut back into the cliff, a dark doorway behind. | ajanta |
| `mn-cave-chaitya` | Chaitya arch cave | `2×1×4` | 3-3 | The tall horseshoe window over a cave entrance. | ajanta |
| `mn-minar-drum` | Minar drum | `2×2×3` | 5-5 | One tapering fluted storey of a victory tower. Stack five, ring each with a balcony. | delhi |
| `mn-balcony-ring` | Balcony ring | `2.5×2.5×0.5` | 5-8 | Corbelled bracket gallery around a tower drum. | delhi, agra |
| `mn-iron-pillar` | Iron pillar | `1×1×2` | 3-12 | A slender dark shaft that does not rust, standing in a paved court. | delhi |
| `mn-iwan` | Great arched portal | `3×1×5` | 5-8 | Pointed recessed arch in a rectangular frame, inlaid spandrels. | delhi, agra |
| `mn-dome-onion` | Onion dome | `4×4×4` | 7-8 | Bulbous marble dome on a constricted neck, lotus crest and finial. | agra, delhi |
| `mn-chhatri` | Chhatri | `2×2×2` | 6-9 | Small domed kiosk on slender pillars; corners of terraces and gates. | agra, delhi, amritsar |
| `mn-minaret` | Minaret | `1×1×7` | 7-8 | Slim three-stage tower with balconies, canted slightly outward. | agra |
| `mn-charbagh-quarter` | Char bagh quarter | `4×4×0` | 7-8 | One of four garden squares, sunk parterres, a path cross. Water channel pieces run between them. | agra, delhi |
| `mn-golden-shrine` | Golden shrine | `4×4×4` | 7-12 | Two-storey gilded pavilion standing in water, a dome above; painted with reverence, never as a prize. | amritsar |
| `mn-shrine-causeway` | Shrine causeway | `4×1×1` | 7-12 | Marble walk out to a shrine in a pool, lamps along the parapet. | amritsar |
| `mn-edict-rock` | Edict rock | `3×2×3` | 2-2 | Rounded granite mass with a polished inscribed face and the front of an elephant emerging above it. | dhauli |
| `mn-lion-pillar` | Lion pillar | `1×1×6` | 2-2 | Polished monolithic shaft, bell capital, a single seated lion on top. | vaishali, sanchi |
| `mn-stone-chariot` | Stone chariot | `2×2×3` | 6-6 | A shrine cut as a temple car with stone wheels that turn, elephants at the shafts. | hampi |
| `mn-terminus` | Terminus block | `6×5×7` | 9-9 | Carved civic pile with a ribbed central dome, gables and a stone figure on the crown. | mumbai |
| `mn-train-shed` | Train shed | `6×4×4` | 9-12 | Iron and glass arched roof over the platforms, open at the far end. | mumbai |
| `mn-truss-span` | Steel truss span | `6×1×5` | 9-12 | One bay of a riveted cantilever bridge; repeat across the river. | kolkata |
| `mn-truss-tower` | Bridge tower | `3×3×8` | 9-12 | The tall braced pylon the spans hang from. | kolkata |
| `mn-open-hand` | Open Hand | `2×2×6` | 11-11 | Sheet-metal hand on a bearing, turning with the wind above a sunken plaza. | chandigarh |
| `mn-plaza-pit` | Sunken plaza | `6×6×1` | 11-12 | A trench of a public square, concrete steps on all sides. | chandigarh |
| `mn-launch-gantry` | Launch gantry | `3×3×10` | 12-12 | Steel service tower with swing arms and a lightning mast. | sriharikota |
| `mn-rocket` | Launch vehicle | `1×1×8` | 12-12 | Four stages, a saffron band, strap-on boosters. | sriharikota |
| `mn-reservoir-flight` | Reservoir flight | `4×3×2` | 0-0 | One rock-cut tank of a chain, its inner stair and its spill lip. | dholavira |
| `mn-signboard` | Signboard post | `1×1×2` | 0-0 | A timber board on two posts above a gate. Dholavira's ten great signs hung on one; the glyphs are drawn as unreadable shapes, because they are. | dholavira |
| `mn-scaffold` | Bamboo scaffold | `2×2×2` | 0-12 | Lashed lattice with a rope hoist. Ships in three shells — 2x2, 4x4, 6x6 — each stretched to the height it wraps. This is what an unfinished monument wears. | player, all |

## Props & dressing — 26 parts

Small things that make a street lived-in.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `pr-awning` | Awning stall | `1×1×1.5` | 0-12 | Striped cloth on four bamboo poles over a plank counter. | all |
| `pr-scale` | Beam balance | `1×1×1.5` | 0-12 | Brass pans on a stand, a box of weights beside it. | muziris, surat, lothal |
| `pr-sacks` | Sack stack | `1×1×1` | 0-12 | Jute sacks stacked three high, one open with pepper or grain spilling. | muziris, rakhigarhi, surat |
| `pr-amphora` | Amphora stack | `1×1×1` | 3-4 | Tall pointed jars racked in a timber cradle. | muziris |
| `pr-bales` | Bale stack | `1×1×1` | 0-12 | Corded cloth bales under a tarpaulin. | surat, sopara, ahmedabad |
| `pr-baskets` | Basket stack | `1×1×0.5` | 0-12 | Nested cane baskets, one on its side. | all |
| `pr-pots` | Pot stack | `1×1×0.5` | 0-12 | Painted clay pots in a pyramid. | mathura, ujjain |
| `pr-cloth-line` | Drying cloth | `2×1×1.5` | 0-12 | Lengths of dyed cotton on a line between two posts, moving in code. | rakhigarhi, ahmedabad, madurai |
| `pr-loom` | Pit loom | `2×1×1` | 0-12 | Frame over a foot pit, warp stretched, a shuttle at rest. | ahmedabad, madurai |
| `pr-wheel` | Potter's wheel | `1×1×0.5` | 0-12 | Heavy disc on a pivot with a stick, wet clay beside it. | mathura, lothal |
| `pr-blocks` | Dressed stone blocks | `1×1×0.5` | 0-12 | Squared blocks with mason's marks, waiting at the foot of a scaffold. | mamallapuram, thanjavur, konark, agra |
| `pr-fire` | Cooking fire | `1×1×1` | 0-12 | Three stones, a pot, a thin smoke curl. | all |
| `pr-lamp-post` | Lamp post | `1×1×1.5` | 1-12 | Oil lamp in a stone bracket on a pillar; casts the fx-lampglow layer. | kashi, madurai, ujjain |
| `pr-diya` | Floating lamps | `1×1×0` | 1-12 | Leaf boats with small flames drifting on a water tile. | kashi, ujjain, vaishali |
| `pr-pennant` | Pennant pole | `1×1×3` | 0-12 | Tall pole with a triangular flag; the only piece allowed to flutter. | hastinapura, thanjavur, hampi |
| `pr-banner-arch` | Banner arch | `2×1×3` | 1-12 | Festival arch of leaves and cloth over a street. | madurai, thanjavur, amritsar |
| `pr-garland` | Jasmine strings | `2×1×0.5` | 3-12 | Hanks of flower garlands on a rack; the piece carries a scent nobody can draw, so it is drawn white. | madurai |
| `pr-milestone` | Milestone | `1×1×0.5` | 1-12 | Carved stone at a road fork. | ujjain, delhi |
| `pr-plough` | Plough at rest | `1×1×0.5` | 0-12 | Wooden ard tipped up against a bund. | kalibangan, rakhigarhi |
| `pr-nets` | Drying nets | `2×1×1` | 0-12 | Fishing nets spread on poles above the sand. | mamallapuram, sopara, muziris |
| `pr-bench` | Street bench | `1×1×0.5` | 1-12 | Stone or timber seat in shade. | all |
| `pr-streetlight` | Street light | `1×1×2` | 9-12 | Cast-iron standard, then a concrete one; the era decides which. | mumbai, kolkata, chandigarh |
| `pr-signal` | Rail signal | `1×1×3` | 9-12 | Lattice post with a semaphore arm and a lamp. | mumbai, kolkata |
| `pr-tap` | Public standpipe | `1×1×1` | 9-12 | Iron tap on a plinth with a queue of vessels. | mumbai, kolkata |
| `pr-rack` | Book rack | `1×1×1.5` | 9-12 | Planks stacked to head height with second-hand books. | kolkata |
| `pr-kite` | Kite in the sky | `—` | 6-12 | Sky-layer piece with a long string; never collides, never lands. | ahmedabad, delhi |

## Vessels & vehicles — 17 parts

Moved by code along road and water paths.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `vh-cart-bullock` | Bullock cart | `2×1×1.5` | 0-12 | Two solid wheels, a load of sacks and cloth, two humped oxen, a driver. Travels only on road pieces. | all |
| `vh-cart-camel` | Camel cart | `2×1×2` | 1-12 | Higher, lighter, two spoked wheels. | ujjain, delhi, kalibangan |
| `vh-handcart` | Handcart | `1×1×1` | 0-12 | Two wheels and a pair of shafts, pushed. | surat, kolkata, mumbai |
| `vh-palanquin` | Palanquin | `1×1×1` | 2-9 | Covered litter on a pole, four bearers. | delhi, hampi, madurai |
| `vh-boat-river` | River boat | `3×1×2` | 0-12 | Shallow hull, one square ochre sail on a bamboo mast, a poler at the stern. | kashi, pataliputra, hastinapura, kolkata |
| `vh-longboat` | Longboat | `2×1×0.5` | 0-12 | Open ferry boat for bales, rowed. | muziris, sopara, surat |
| `vh-catamaran` | Catamaran | `2×1×0.5` | 0-12 | Three lashed logs drawn up on sand. | mamallapuram, konark |
| `vh-fishing-sail` | Fishing boat | `2×1×2` | 0-12 | Small hull with a lateen sail. | konark, sopara, mumbai |
| `vh-ship-teak` | Teak sailing ship | `5×2×5` | 6-9 | Three masts, a high stern, an anchored ship at a river mouth. | surat, sopara |
| `vh-ship-foreign` | Foreign trader | `5×2×5` | 3-9 | Broad-beamed hull from across the sea, tied at a wharf with amphorae coming ashore. | muziris, surat |
| `vh-ferry` | River ferry | `3×1×1` | 9-12 | Flat steam ferry with a funnel and an awning deck. | kolkata, mumbai |
| `vh-train` | Steam train | `6×1×2` | 9-12 | Locomotive and three carriages; runs only on rail pieces, at a fixed speed. | mumbai, kolkata |
| `vh-tram` | Tram | `3×1×2` | 9-11 | Double-decker on grooved rails with a trolley pole. | kolkata |
| `vh-bus` | Bus | `2×1×1.5` | 9-12 | Red double-decker, then a single-decker; the era decides. | mumbai, bengaluru |
| `vh-truck` | Lorry | `2×1×1.5` | 10-12 | Painted cab, wooden body, a mudflap slogan drawn as pattern, not text. | chandigarh, mumbai |
| `vh-cycle` | Bicycle | `1×1×1` | 9-12 | With a rack of tiffin carriers on the back. | mumbai, ahmedabad, chandigarh |
| `vh-scooter` | Scooter | `1×1×1` | 11-12 | A family of four is the joke everyone makes; the piece carries two. | bengaluru, chandigarh |

## Figures & animals — 31 parts

One tile each. No faces at board scale, no deities, ever.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `fg-kisan` | Kisan | `1×1×1` | 0-12 | Farmer with a wheat sheaf and a sickle. Existing sprite; to be redrawn as vector. | player |
| `fg-karigar` | Karigar | `1×1×1` | 0-12 | Artisan with a painted pot and a mallet. | player |
| `fg-kathakar` | Kathakar | `1×1×1` | 0-12 | Storyteller with an ektara and a bag of scrolls. | player |
| `fg-rakshak` | Rakshak | `1×1×1` | 0-12 | Watchman with a lathi and a lantern. | player |
| `fg-yatri` | Yatri | `1×1×1` | 0-12 | The child's own walker: staff, lamp, bundle. Pathfinds on roads only. | player |
| `fg-annadata` | Annadata | `1×1×1.5` | 0-12 | Great one, drawn half a unit taller than an ordinary figure. | player |
| `fg-sthapati` | Sthapati | `1×1×1.5` | 0-12 | Great one: plan, plumb-line, a model tower at the feet. | player |
| `fg-acharya` | Acharya | `1×1×1.5` | 0-12 | Great one: manuscripts and a raised lamp. | player |
| `fg-vendor` | Vendor | `1×1×1` | 0-12 | Seated behind a counter, one arm up. | all |
| `fg-child` | Child | `1×1×0.75` | 0-12 | Running, or crouched over a game of five stones. | all |
| `fg-monk` | Monk | `1×1×1` | 2-6 | Robed, bowl in hand, walking. | sanchi, nalanda, ajanta, sopara |
| `fg-teacher` | Teacher and pupils | `2×1×1` | 1-12 | One seated figure and four smaller ones on a mat — a single piece, because they belong together. | vaishali, nalanda, madurai |
| `fg-pilgrim` | Pilgrim | `1×1×1` | 1-12 | Bundle on the head, walking a long road. | kashi, sanchi, amritsar |
| `fg-boatman` | Boatman | `1×1×1` | 0-12 | Standing with a pole; ships with the boat pieces. | kashi, pataliputra |
| `fg-mason` | Mason | `1×1×1` | 0-12 | Kneeling at a block with a chisel and mallet. | mamallapuram, thanjavur, agra |
| `fg-weaver` | Weaver | `1×1×1` | 0-12 | Seated at a loom pit. | ahmedabad, madurai |
| `fg-porter` | Porter | `1×1×1` | 0-12 | Bent under a sack, moving between wharf and warehouse. | surat, muziris, kolkata |
| `fg-guard` | Guard | `1×1×1` | 1-12 | Standing at a gate with a spear. Never drawn attacking anything. | all walled cities |
| `an-ox` | Humped ox | `1×1×1` | 0-12 | White or dun, standing or yoked. | all |
| `an-buffalo` | Buffalo | `1×1×1` | 0-12 | Wallowing or being driven. | dhauli, thanjavur, kashi |
| `an-cow` | Cow and calf | `1×1×1` | 0-12 | Standing in a street or a byre. | all |
| `an-goat` | Goat | `1×1×0.5` | 0-12 | Two or three on one tile. | all |
| `an-elephant` | Elephant | `2×1×2` | 1-12 | Working: carrying timber or standing at a gate with a mahout. | hampi, thanjavur, madurai |
| `an-camel` | Camel | `1×1×2` | 1-12 | Loaded, standing or led. | ujjain, delhi, kalibangan |
| `an-horse` | Horse | `1×1×1.5` | 1-12 | Saddled or in cart traces. | hastinapura, delhi, hampi |
| `an-dog` | Street dog | `1×1×0.5` | 0-12 | Asleep in the sun on a road tile. | all |
| `an-monkey` | Langur | `1×1×0.5` | 0-12 | On a wall or a roof edge. | hampi, mathura, kashi |
| `an-peacock` | Peacock | `1×1×1` | 0-12 | On a wall, tail down. | mathura, sanchi, hampi |
| `an-heron` | Egret or heron | `1×1×1` | 0-12 | Standing in a paddy or on a bank. | dhauli, lothal, thanjavur |
| `an-flamingo` | Flamingo | `1×1×1` | 0-12 | A flock on a lagoon tile. | sriharikota |
| `an-kite-bird` | Kite | `—` | 0-12 | Sky layer, circling. | delhi, ahmedabad, mumbai |

## Light & weather layers — 12 parts

Full-plate overlays, no footprint.

| id | part | L×B×H | eras | description | used in |
|---|---|---|---|---|---|
| `fx-dawn` | Dawn wash | `—` | 0-12 | Cool blue shadows, a warm rim on east faces, long shadows west. | all |
| `fx-golden` | Golden hour | `—` | 0-12 | The default. Warm ground, long soft shadows, saturated colour. | all |
| `fx-dusk` | Dusk | `—` | 0-12 | Indigo air, lamps carrying the scene, silhouetted trees. | kashi, madurai, ujjain |
| `fx-night-stars` | Star field | `—` | 0-12 | Deep sky with real constellations; the observatory city earns it. | ujjain |
| `fx-monsoon` | Monsoon | `—` | 0-12 | Grey light, rain streaks, wet sheen on every horizontal face, puddles. | dhauli, ajanta, muziris |
| `fx-mist` | Vismriti mist | `—` | 0-12 | Impersonal grey fog that drains colour tile by tile. It has no face and never will. | all |
| `fx-lampglow` | Lamp glow | `—` | 1-12 | Warm radial pool cast by each lamp piece after dusk. | all |
| `fx-shadow` | Contact shadow | `—` | 0-12 | Soft ellipse generated under every placed piece from its footprint. Not hand-drawn. | all |
| `fx-shimmer` | Water shimmer | `—` | 0-12 | Slow highlight drift across water tiles. | all water |
| `fx-smoke` | Smoke | `—` | 0-12 | Thin curl from a fire, thick plume from a chimney. | all |
| `fx-dust` | Dust | `—` | 0-12 | Puff behind a cart on a mud road. | all |
| `fx-scaffold-dust` | Building dust | `—` | 0-12 | Fine haze around a monument under construction, so progress reads from the map. | player |

