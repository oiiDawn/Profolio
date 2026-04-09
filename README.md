# Profolio

A modern personal homepage built with Next.js, React, TypeScript, and Tailwind CSS.

## Live Repository

- GitHub: [https://github.com/oiiDawn/Profolio](https://github.com/oiiDawn/Profolio)

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn-style UI components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install and Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
lib/
```

## Deploy (Vercel Auto Deploy)

This repository is ready for Vercel automatic deployments:

1. Go to [Vercel New Project](https://vercel.com/new).
2. Import `oiiDawn/Profolio`.
3. Keep defaults (framework is detected as Next.js).
4. Click **Deploy**.

After that:
- pushes to `main` trigger production deployments automatically;
- pull requests trigger preview deployments automatically.

## License

This project is licensed under the MIT License. See `LICENSE`.
