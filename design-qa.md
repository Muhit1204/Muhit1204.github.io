# Interactive City v2 — Design QA

Date: 2026-08-30

## Evidence

- Visual source: `source-docs/image-originals/city-map.png` and the supplied annotated city screenshot.
- Final artwork: `source-docs/image-originals/city-v2/city-expanded.png`.
- Desktop capture: `qa-captures/playwright-1440.png`.
- Mobile capture: `qa-captures/playwright-390.png`.
- Lighthouse report: `qa-captures/lighthouse-mobile-standard.json`.

## Comparison results

- Fidelity: the five original landmarks, signs, palette, isometric perspective, ship, roads, and landscaping remain recognizable. The lower ground plane is expanded and the new glass Gallery pavilion sits on the right extension without a label or interactive state.
- Layout: the city breaks out to a 1440px maximum while the rest of the homepage keeps its existing width. Labels align with their destination buildings at desktop and remain usable inside the 760–860px mobile panorama.
- Typography and content: persistent destination labels are concise and legible. The section instruction reads “Choose a destination,” and the mobile guidance copy matches the specification.
- Image quality: the expanded background and transparent sprites use real raster assets; there is no visible CSS or SVG-drawn city art. Crops and alpha edges are clean in both captures.
- Interaction: five labels are links with 44px minimum height, focus, hover, and pressed states. Mobile horizontal panning works while vertical pan remains enabled. Gallery is decorative only.
- Motion: six staggered desktop cars follow three lane-center paths traced over unobstructed asphalt, two satellites cross the sky, the dish scans, two cafe smoke puffs rise from the chimney, and four exact window masks alternate between clearly visible lights-off and lights-on states. Mobile keeps two cars, one satellite, the dish, and smoke while hiding window twinkles. Motion pauses off-screen, on hidden tabs, and for reduced-motion preference.
- Accessibility: all links have accessible names, focus indicators are visible, the panorama is keyboard focusable, and Lighthouse reports no unnamed controls.
- Responsive checks: automated browser assertions passed at 320, 375, 390, 430, 768, 1024, 1280, and 1440px with no page-level horizontal overflow.

## Verification

- `npm run lint`: passed.
- `npm test`: 3 files, 6 tests passed.
- `npm run build`: passed.
- Browser responsive suite: 9 checks passed.
- Lighthouse standard mobile: Performance 94, Accessibility 96, CLS 0.001, no unnamed controls.
- 1280px AVIF background: 44,813 bytes (budget: under 100 KiB).
- Initially eligible mobile motion assets: 50,846 bytes (budget: under 70 KiB).
- Off-screen loading: the final Lighthouse trace requests the city background but defers all sprite requests until the scene approaches the viewport.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: none.

final result: passed
