# Tomorrow Park · Controls Lab

Created by Raina / 乙南 · [中文](README.md)

Two extracted learning modules: a Three.js model viewer with orbit/zoom/focus controls, and character exploration with keyboard movement, grid-based A*, collision sliding and a follow camera.

This is a standalone code example, **not the complete Tomorrow Park artwork**. It contains no private photographs, songs, Raina appearance model, original park assets, exhibition artworks or brand imagery. Simple procedural objects and a test robot demonstrate behavior only.

Private candidate; an original-code license has not yet been approved. See LICENSE_PROPOSAL.md.

## Run

Node.js 22.18+:

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Drag to orbit, scroll to zoom, click a building to focus. WASD/arrows move the robot; Shift speeds up. Click open ground to navigate. Keyboard input cancels an existing route. Follow character and Free camera control the camera independently.

Import a self-contained local GLB for viewing without uploading it. Imported models are view-only: arbitrary models do not automatically acquire navigation or animation. Reset demo restores the test scene.

The grid assumes flat terrain and explicit obstacles. Dynamic crowd avoidance, sloping terrain, full festival interactions and camera/architecture occlusion recovery are outside this extraction. Desktop keyboard use is the primary exploration input.

See PROVENANCE.md for extraction details and RELEASE_REVIEW.md for the exact scope and test limitations. Upstream licenses remain in licenses/.
