---
version: 1
slug: "app-components-inner-world-tsx"
primary_target: "app/components/inner-world.tsx"
related_targets: ["app/routes/home.tsx"]
---

# Inner World Surface Brief

- **Scope and mode:** `app/components/inner-world.tsx` remains an Experience-mode hidden surface entered through the existing homepage gateway. The 3D world is navigation; destination content panels remain out of scope.
- **Visitor path:** The visitor arrives at one continuous colorful low-poly tabletop island. A personal avatar begins at the central camp. Selecting FITNESS, GAMING, FOOD, or TRAVEL makes the avatar turn and walk along the matching curved path; the camera lowers to follow, then settles into a short three-quarter destination view. Selecting another destination redirects from the current position. EXIT returns to the overview, then to the public site.
- **Approved direction:** Compass island based on `.impeccable/mocks/inner-world-comp-a-compass-island.png`. The central camp and four equally legible radial biomes carry a vivid tabletop world with open water, a waterfall, sculpted clouds, layered vegetation, flowers, rocks, and biome-specific props. Preserve the clear color families, chunky faceted silhouettes, and rich ecology of the reference.
- **Avatar:** Original tabletop-adventure character derived from the user's reference photo: short black hair, square black sunglasses, silver necklace, white short-sleeve T-shirt, black shell jacket, blue jeans, and a small black backpack. Use stylized proportions rather than a realistic likeness.
- **Implementation boundary:** Blender owns the avatar, island, four compact destination sets, walkable collision surface, and idle/walk/arrival clips. React Three Fiber owns selection state, deterministic curved XZ movement, direct single-surface ground raycasts, camera transitions, loading/error fallbacks, labels, and accessibility. No free walking, pathfinding system, content panel, audio, day/night cycle, or copied game assets.
- **Implementation fidelity:** The normal render path uses the approved Astra-authored GLBs only, with the Blender preview's vivid afternoon sky, desktop-first fixed orthographic overview at its 28-unit visible height, curved centerlines, and physical 3D destination signs. Asset failure degrades to the remaining successfully loaded scene rather than substituting a competing procedural world.
- **Asset inventory:** `/portfolio/inner-world/world.glb`, `avatar.glb`, `fitness.glb`, `gaming.glb`, `food.glb`, and `travel.glb`; the avatar provides exact `Idle` (2s), `Walk` (0.8s), and `Arrive` (1.2s) clips. Each destination GLB contains its English wooden sign. `/portfolio/inner-world/ui/exit-sign.png` remains the visible EXIT control; destination DOM buttons remain as a nonvisual accessibility layer.
- **Accessibility and motion:** Keep the DOM destination navigation and large touch targets. Reduced motion jumps the avatar and camera directly to the selected state while preserving navigation and readable labels.
- **Direction provenance:** User-pinned colorful low-poly tabletop adventure world; concept seed `5a79e36b`; approved composition A with desktop-first presentation.
