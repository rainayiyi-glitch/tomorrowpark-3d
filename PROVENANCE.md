# Extraction notes

- `src/navigation.ts`: preserves cell indexing, line checks, binary-heap A*, diagonal corner-cut prevention, path smoothing, temporary blockers and sliding from Tomorrow Park V17.4 `v13-navigation.ts`. Replaces private park polygon, asset-name-based mesh scanning and terrain dependencies with a small generic grid and explicit box/circle obstacles.
- `src/explorer.js`: a standalone adaptation of `v13-raina.tsx` movement flow: keyboard takeover, exponential velocity/yaw damping, path following, blur cleanup, follow-target interpolation. React hooks, private GLB loading, costume/animation bindings, crowds, animal interactions, photos and music are removed. This is a runnable extraction, not an untouched copy of the entire Raina component.
- `src/viewer.js`: expands the existing candidate `src/example.js` OrbitControls/GLTFLoader viewer with explicit disposal, deterministic framing, focus transition and rejection of external GLB resource URLs.
- `src/main.js`: newly authored generic test geometry. No original festival model is included.
- Existing required attribution is preserved in `licenses/upstream-attribution-MIT.txt`; it does not grant rights to any excluded private or third-party media.
