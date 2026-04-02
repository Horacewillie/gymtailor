# GymTailor Frontend

Scaffolded with React + TypeScript + Vite and organized for CSS Modules.

## Prerequisites

- Node.js 20+
- npm 10+ (or another package manager)

## Run locally

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - type-check then build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks

## Structure

```text
src/
  app/              # App shell and top-level composition
  pages/            # Route-level pages
  components/       # Reusable UI components
  styles/           # Global styles and tokens
```

When you share initial page images, implement each screen as a page-level component and keep component styles in colocated `*.module.css` files.
