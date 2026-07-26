# CLAUDE.md

## Project

- Next.js 15 App Router portfolio.
- Routes: `/`, `/about`, `/work`, `/work/[slug]`, `/contact`.
- Package manager: `pnpm`.
- Dark editorial visual system; desktop pages fit one viewport, mobile pages may scroll.

## Work

- Keep changes scoped and reuse existing components.
- Preserve keyboard access and `prefers-reduced-motion`.
- Project data lives in `lib/showcase-projects.ts`.
- Shared navigation lives in `components/layout/topbar.tsx`.
- Shared scenes and their styles live in `components/portfolio-animation.tsx` and `components/portfolio-animation.module.css`.

## Check

```bash
pnpm check:fast
pnpm build
```
