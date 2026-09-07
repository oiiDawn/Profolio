---
version: 1
slug: "app-components-inner-world-tsx"
primary_target: "app/components/inner-world.tsx"
related_targets: ["app/routes/home.tsx"]
---

# Inner World Surface Brief

- **Scope and mode:** `app/components/inner-world.tsx` is an Experience-mode hidden surface reached only through the homepage's five-click, code-entry, and breach sequence. The 3D map is the primary navigation; future destination copy remains ordinary DOM.
- **Visitor path:** The breach lands directly on a central chip connected to FITNESS, GAMING, FOOD, and TRAVEL. Desktop pointer position adds restrained parallax. Selecting a diorama moves the camera, switches that node from cyan to its destination accent, emits one energy wave, and reveals the destination title. EXIT returns from a destination to the overview, then fades back to the public surface and resets the gateway.
- **Composition:** Near-black infinite grid, fixed isometric camera, cyan hub and paths, four recognizable primitive dioramas, square white EXIT control, and a white centered title only while focused. Mobile keeps one fixed view with every destination visible and disables Bloom.
- **Implementation boundary:** Each destination owns one small `*Visual` component. Primitive geometry is the approved first release; a future GLB replaces only that component. No model registry, asset framework, audio, video, content panel, admin, free camera, drag control, or interaction hint.
- **Accessibility and motion:** A keyboard-operable DOM navigation mirrors Canvas hit targets. Touch hit areas exceed the visible platforms. Reduced motion skips breach continuation, energy wave, and camera tween while preserving navigation.
- **Direction provenance:** The user explicitly selected a basic adaptation of `https://merodev.net/` after a one-question-at-a-time design interview. This approved direct-reference substitution replaces a concept roll; no FORM seed key exists.
