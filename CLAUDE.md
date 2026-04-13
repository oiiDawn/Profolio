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
  layout.tsx        # root layout, metadata, Topbar + Footer
  page.tsx          # hub homepage (hero + module entry cards)
  about/page.tsx    # about + timeline
  projects/page.tsx # project grid
  learning/page.tsx # learning tracker (Supabase: projects + chapters + progress)
  writing/page.tsx  # shares / writing list
  globals.css       # global styles and design tokens
components/
  layout/           # Topbar, Footer, ContactLinksNav
  learning-chapters.tsx # expandable chapter list + share links
  ui/               # reusable UI primitives
lib/
  site.ts           # shared site copy and data (contact, timeline, shares, projects)
  supabase.ts       # Supabase browser/server client factory (env-gated)
  learning.ts       # fetch learning projects from Supabase
  types.ts          # shared types (learning tracker)
supabase/
  learning.sql      # DDL + RLS + optional seed (run in Supabase SQL editor)
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

- Use route-based navigation (`/`, `/about`, `/projects`, `/learning`, `/writing`); top bar highlights the active page.
- Learning data: set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.local.example`); run `supabase/learning.sql` once.
- Keep button and link `aria-label` text meaningful.
- Maintain heading hierarchy and readable line lengths.

## Git and Delivery

- Use small, descriptive commits.
- Do not commit secrets or local-only env files.
- For publish/release, confirm target platform (GitHub/Vercel/other) if not explicit.

## Notes for Future Work

- Shared page chrome lives in `components/layout`; shared copy/data in `lib/site.ts`.
- If design tokens expand, centralize them in `globals.css` with clear naming.
