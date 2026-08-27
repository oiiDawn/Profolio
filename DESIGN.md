---
name: gresfilip Replica
description: Faithful single-page portfolio replica of the frozen 2026-08-27 competitor canon.
colors:
  canvas: "#f9f7f5"
typography:
  body:
    fontFamily: "Geist, sans-serif"
---

# Design System: gresfilip Replica

## Overview

**Creative North Star: "Frozen Competitor Canon"**

This shipped replica follows the gresfilip competitor canon frozen on 2026-08-27. Snapshot seed `snapshot-gresfilip-20260827` is the reference for visual fidelity; preserve the existing composition instead of extending it into a new identity.

**Key Characteristics:**

- One restrained portfolio page with three native dialogs.
- Compact editorial presentation centered on the work.
- Local, deterministic content and imagery.

## Colors

The page uses the warm off-white canvas token as its defining neutral surface.

**The Canon Rule.** Preserve the frozen reference palette; do not introduce speculative accent colors.

## Typography

**Display Font:** Geist (sans-serif fallback)
**Body Font:** Geist (sans-serif fallback)

**Character:** Neutral, compact, and content-led. Typography supports the replica rather than adding a separate stylistic voice.

## Layout

Desktop content is 576px wide. The responsive acceptance targets are 1440x900 and 390x844; preserve the single-page hierarchy and readable flow at both sizes.

## Elevation & Depth

Keep the page visually restrained. The three dialogs use native dialog behavior; avoid ornamental depth that departs from the frozen canon.

## Shapes

Preserve the implemented geometry and native dialog form rather than inventing a generalized radius system.

## Components

The shipped surface is one page plus three native dialogs. Portfolio content comes from `lib/portfolio-data.ts`; imagery and other replica assets come from `public/portfolio`.

## Do's and Don'ts

### Do:

- **Do** treat `snapshot-gresfilip-20260827` as the visual canon.
- **Do** keep data in `lib/portfolio-data.ts` and assets in `public/portfolio`.
- **Do** verify the 1440x900 desktop and 390x844 mobile targets.

### Don't:

- **Don't** widen the 576px desktop content column.
- **Don't** add pages, custom modal systems, remote assets, or a new visual identity.
- **Don't** reinterpret the competitor canon after its 2026-08-27 freeze.
