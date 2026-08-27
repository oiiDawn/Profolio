# Product

## Purpose

A faithful local snapshot of Filip Gres's portfolio as it appeared on 2026-08-27. It presents his introduction, work history, side projects, working approach, tool stack, contact links, and complete case studies.

## Surface

- One responsive page at `/`.
- Three native case-study dialogs: Felix, Mimo, and Avocode.
- Desktop reference: 1440×900.
- Mobile reference: 390×844.

## Content source

`lib/portfolio-data.ts` is the single editable source for visible facts and links. Media is stored under `public/portfolio/`.

## Constraints

- Match the frozen reference rather than tracking future upstream changes.
- Preserve keyboard interaction, dialog focus behavior, reduced motion, and working external links.
- Do not reintroduce the previous OII DAWN routes, scenes, content, or assets.
