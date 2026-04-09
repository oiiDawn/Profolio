# CLAUDE.md

This file provides guidance for Claude Code when working with this project.

## Project Overview

- **Project**: Personal homepage
- **Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Package manager**: pnpm (lockfile present)
- **Language**: UI content is primarily Simplified Chinese

## Setup and Common Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## File Structure

```text
app/
  layout.tsx        # root layout and metadata
  page.tsx          # homepage content
  globals.css       # global styles and design tokens
components/
  ui/               # reusable UI primitives
postcss.config.js
package.json
```

## Working Rules

1. Keep changes focused and minimal; avoid broad refactors unless requested.
2. Prefer TypeScript-safe updates and preserve existing component patterns.
3. Keep copy consistent with current Chinese tone unless user requests English.
4. Reuse existing UI components from `components/ui` before creating new ones.
5. Run lint after substantive edits and fix introduced issues.

## Styling Guidelines

- Use utility-first classes and existing style conventions in `app/page.tsx`.
- Prefer semantic spacing and typography changes over one-off magic values.
- Keep visual behavior smooth; avoid heavy animation unless requested.
- When changing global styles, verify impact on all sections of the homepage.

## Content and Accessibility

- Preserve section anchor navigation (`#about`, `#timeline`, `#shares`, `#top`).
- Keep button and link `aria-label` text meaningful.
- Maintain heading hierarchy and readable line lengths.

## Git and Delivery

- Use small, descriptive commits.
- Do not commit secrets or local-only env files.
- For publish/release, confirm target platform (GitHub/Vercel/other) if not explicit.

## Notes for Future Work

- If sections grow significantly, consider splitting homepage sections into `components/sections`.
- If design tokens expand, centralize them in `globals.css` with clear naming.
