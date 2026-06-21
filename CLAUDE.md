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

**Pages** live in [app/](app/) using the App Router convention. Each route is a `page.tsx` inside its folder. The root layout ([app/layout.tsx](app/layout.tsx)) wraps all pages with `<Navbar>` and `<Footer>`.

**Components** in [components/](components/) include several data-visualization panels used inside page files:
- `InteractiveNetworkMap` — city/network metaphor visualization
- `SatelliteOrbitDiagram` — custom SVG orbit animation
- `PredictionDashboard` — time-series chart using Recharts with confidence intervals
- `CybersecurityPanel` — security metrics dashboard

Pages that need interactivity (click handlers, `useState`) must have `'use client'` at the top.

**Styling:** Tailwind utility classes only — no separate CSS modules. Global styles and font imports are in [app/globals.css](app/globals.css). Three fonts loaded from Google Fonts: Inter (body), Playfair Display (headings), JetBrains Mono (code).

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
