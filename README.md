# MJM LINE — Railway presentation

Current journey: **PUI Groups cover → MJM Central → Ice Breaker → Game Station → Rest Station → Team Recipe → Leadership Line (Joanne Goh) → Mentor Express (Mr Pui Yuh Tzer) → Final Stop / Thank You**.

## Open

Open `MJM-Line-Scroll-Prototype.html` directly in a modern browser. The standalone file embeds Three.js, the characters and twelve original Blender landmark exports. No internet connection or installation is required. WebGL / hardware acceleration must be available.

The editable website is in `dist/`. Preview locally with `python3 -m http.server 8777 --directory dist`.

The repository root `index.html` opens the presentation in `dist/` when served by a static host. No package installation or server-side application is needed. The standalone HTML is also included for offline use.

## Controls

- Scroll down once, Right Arrow, Space or Next: complete the next station journey and stop.
- Scroll up once, Left Arrow or Previous: return to the previous station.
- The cover uses direct scroll progress before the first departure.
- Drag / swipe or the railway slider: scrub the reversible timeline.
- Home / End: cover beginning / Final Stop.
- F or the full-screen control: full screen.
- Sound is off by default. Reduced motion skips timed travel.

## Game Station

The route continues from Ice Breaker into an open miniature landmark city. Low coral canopies, coloured property paving, giant dice, gardens and original Blender miniatures distinguish the station from the earlier terminals while retaining their daylight, materials and railway design.

The original eight exports are retained: Petronas Twin Towers, Eiffel Tower, Big Ben, Taj Mahal, Sydney Opera House, Neuschwanstein Castle, Pyramids of Giza and Marina Bay Sands. Editable originals remain in `../art/blender-landmarks/`; local source exports are copied into `dist/assets/landmarks/`. `dist/game-assets.js` contains the embedded model bytes, decoded synchronously with their original materials and transforms. The final skyline leaves the railway and camera sightline open.

The environment upgrade adds Colosseum, Taipei 101, Sagrada Família and Acropolis. Eight perimeter European buildings, café terraces, boulevards, crossings, pocket parks, street furniture and property-colour paving connect the landmarks into districts. Three layers of generated Alpine terrain and soft cloud banks replace the old Game Station backdrop. All twelve landmark entrances face the audience. The detailed artist exports replace the simplified game meshes. The camera and navigation remain unchanged. Shared Blender materials reduce rendering overhead. The whole railway uses adaptive supersampling, 4K shadow maps, 1024px colour textures, smoother 512px surface maps and rounded architectural edges. Late-built trees now receive individual leaf detail as well.

Timeline: Ice Breaker continues directly to Game Station in one gesture. Joanne remains at 8.5; Mr Pui’s relocated Mentor Express is at 9.9; Thank You is at 11.3. Each station parks until the next gesture, and the route is reversible.

## Build and checks

Run `python3 build.py` to rebuild `dist/runtime.js` and the standalone HTML. Run `node --test tests/*.test.mjs` to verify reversible positions, smooth displacement, station endpoints and title/departure order.

The upgraded city was visually checked in the browser with no console errors. The environment test verifies all twelve real Blender assets, original camera and rail geometry, hidden Alpine terrain in earlier stations, district construction and shared materials. The standalone script was syntax-checked. Performance on the event projector laptop still needs event-device review.


Rest Station follows Game Station: a daylight Swiss Grand Café with a dining terrace, bakery, espresso counter and breakfast place settings. One forward gesture reaches its parked title view; another returns the title to its environmental sign and reveals the café. Reverse restores the Game Station night scene. End jumps to the café title. The standalone HTML includes this station offline.


Team Recipe is the next station after Rest Station. Its new range uses two gesture-triggered journeys: first stop at the bakery entrance and header, then enter the bakery and stop at the gallery. The train arrives before the title focus; the title returns before entering the glass bakery. The final view displays all 15 qualities and their reference descriptions together. End jumps to the gallery. All visuals and gallery textures are generated locally and embedded in the offline build.

### Leadership Line — Joanne Goh
After the Team Recipe gallery, one forward wheel gesture or Next action completes the bakery exit, railway journey, and Joanne's mentor arrival. It stops for the sharing until another input. Previous returns to the gallery. The character uses the same transparent rendered-figure format as Mr Pui and is included in the offline bundle. The new terminal has a clear foreground, a golden-hour sky, and a dedicated route entry. End jumps to the final Thank You frame.


### Final Stop — Thank You
After Joanne, one forward gesture reaches Mr Pui Yuh Tzer at Mentor Express. The next gesture continues along the railway to a terminal built with the same architecture as MJM Central. The final frame shows only the large THANK YOU heading. The train parks before the heading appears, and the presentation stays at the end. Previous returns to Mr Pui. End jumps to this final frame. The ending is included in the standalone offline HTML. Local geometry and timeline tests verify camera/rail clearance, reversible travel, and a stable endpoint; browser visual verification was unavailable during this update.


### Railway and train finish upgrade
The train now has an enclosed, continuous black panoramic window belt, curved front glazing, pearl bodywork, flush doors, slim lights and metal trim. All cars and wheels use physical route distance rather than a shared progress multiplier, so spacing stays consistent along the later sections. Camera travel uses denser arc-length sampling. Gesture travel has a smoother acceleration ramp, a slightly slower duration, and a bounded frame clock to avoid jumps after a delayed frame.

Organized terrace streets and trees enrich every route section. Candidate sites are checked against all rail routes, camera positions, view corridors and existing tall architecture. Existing village houses gain window surrounds, shutters and stone bases; civic buildings gain fine cornice and roof vent detailing. Scene geometry is batched with shared materials. The local tests cover geometry, camera clearance, enclosed glazing and car spacing; browser visual review remains pending because the browser approval service was unavailable.


The final terminal track now continues 48 metres beyond the train stopping point. Steel rail heads and webs sit above the ballast; sleepers and fasteners continue through the station. Overhead wires join directly to the previous segment, and a buffer stop finishes the line 46 metres ahead of the parked train. Track geometry and terminal-camera clearance are checked locally.

### Game Station street life
Short connecting streets, pavements and crossings fill the gaps between the landmark districts. Low planting includes 19 flower beds and 342 blossoms; 33 pedestrians and 14 vehicles, including a minibus, give the streets scale and activity. The new objects use shared materials and static batching. Their placements preserve landmark footprints, railway clearance and the camera view corridors. All seven local test files pass; the offline HTML includes the update. Browser visual review remains pending because automatic approval could not complete due to a usage limit.

### Team Recipe performance
The bakery keeps its original camera paths, architecture, equipment, signs and supplied fifteen-card artwork. Small pastries use fewer subdivisions; geometry drops from roughly 1.65 million to 0.60 million triangles in the complete scene. Four static render zones preserve culling, and equipment labels share a texture atlas. Glass renders in one pass without casting solid shadows. Bakery textures and shaders are prepared during startup so arrival does not compile them for the first time. This section uses a two-million-pixel render budget and 2048px shadows; other sections retain their usual resolution and 4096px shadows. Shadows update when the train, doors, lighting or station visibility changes, and are reused while the world is still. Two-sample antialiasing complements supersampling. Local tests cover geometry budgets, single-pass glass, shader preparation and preserved navigation/clearance.
