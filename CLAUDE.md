# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server (localhost:3000)
npm run build    # Production build — static export to /out
npm run lint     # ESLint check
npm run test     # Run tests with Vitest
npm run clean    # Clear Next.js cache
```

To run a single test file: `npx vitest run __tests__/yourfile.test.tsx`

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3 + Motion (Framer Motion fork)

**Deployment:** Static export (`output: 'export'` in [next.config.ts](next.config.ts)) — builds to `/out` for hosting on Google Cloud Run via AI Studio. No server-side rendering; all dynamic behavior is client-side.

**Pages** live in [app/](app/) using the App Router convention. The site is effectively one page: [app/page.tsx](app/page.tsx) carries every section behind an anchor id (`#about`, `#research`, `#work`, `#publications`, `#skills`, `#log`, `#metrics`, `#hobbies`, `#contact`). Only `/education` and `/publications` remain as separate routes, for detail too long to inline. The root layout ([app/layout.tsx](app/layout.tsx)) wraps everything with `<BootSequence>`, `<Navbar>` and `<Footer>`.

Experience and project content lives in [lib/work.ts](lib/work.ts) as plain data (no JSX), which is what lets the home page stay a server component.

**Components** in [components/](components/):
- `BootSequence` — terminal boot overlay; decorative, skippable, once per session, skipped under `prefers-reduced-motion`
- `SatelliteOrbitDiagram` — custom SVG orbit animation, used as the hero visual
- `PredictionDashboard` — time-series chart using Recharts with confidence intervals
- `CybersecurityPanel` — security metrics dashboard

Pages that need interactivity (click handlers, `useState`) must have `'use client'` at the top.

**Styling:** Tailwind utility classes only — no separate CSS modules. The dark palette is defined once as CSS custom properties on `:root` in [app/globals.css](app/globals.css) and mirrored as Tailwind tokens in [tailwind.config.js](tailwind.config.js): `bg`, `surface`, `surface-2`, `line`, `body`, `muted`, `accent`, `accent-dim`, `warn`, `danger`. Use those rather than hardcoding slate/indigo values. Two fonts load from Google Fonts: Inter (`font-sans`, body copy) and JetBrains Mono (`font-mono`, headings, nav, labels, metadata).

**Utilities:** [lib/utils.ts](lib/utils.ts) exports `cn()` (clsx + tailwind-merge) for conditional class composition.

**Path alias:** `@/*` maps to the repo root (defined in [tsconfig.json](tsconfig.json) and [vitest.config.ts](vitest.config.ts)).

## Environment Variables

See [.env.example](.env.example). Key vars:
- `GEMINI_API_KEY` — Google Gemini AI API key
- `APP_URL` — injected at runtime by AI Studio (Cloud Run URL)

## Key Constraints

- ESLint is **disabled during builds** (`eslint: { ignoreDuringBuilds: true }` in next.config.ts), but TypeScript errors will still fail the build.
- Images are unoptimized (`unoptimized: true`) due to static export — use `<Image>` from `next/image` but don't rely on server-side optimization.
- The `motion` package must be listed under `transpilePackages` in next.config.ts (already configured).
- HMR can be disabled via `DISABLE_HMR=true` env var (used in AI Studio environment).
