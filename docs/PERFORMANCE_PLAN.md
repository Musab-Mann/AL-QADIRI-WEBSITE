# PERFORMANCE PLAN

## Budgets (mobile, 4G, mid-range device)
| Metric | Target |
|---|---|
| LCP | < 2.5s (hero image) |
| CLS | < 0.05 |
| INP | < 200ms |
| Hero image at 400px wide | <= 180KB AVIF |
| Web fonts | 2 families (+ Arabic subset only where used), Latin subset, `display: swap` |
| Lighthouse (mobile) | Performance >= 90, Accessibility 100, Best Practices 100, SEO 100 |

## Rendering
- Every route statically generated at build (`generateStaticParams` for 58 dish pages).
- Server Components by default. Client islands only:
  - `HeaderState` (IntersectionObserver sentinel)
  - `MobileNav` (dialog)
  - `CategoryNav` (scrollspy)
  - `MenuSearch` (text filter over server-rendered rows)
  - `MotionDirector` (imports GSAP + ScrollTrigger after hydration, skipped under reduced motion)
- No data fetching at runtime; no API routes.

## Images
- `next/image` with explicit `sizes` for every placement; AVIF then WebP.
- Hero: `priority` + `fetchPriority="high"`; separate wide (desktop) and tall (mobile) art direction via `<picture>`-style source switching.
- All other images lazy. Fixed aspect-ratio wrappers so nothing shifts.
- Source files pre-compressed by `scripts/optimize-images.ts` (sharp).

## Fonts
- `next/font/google`: Cormorant Garamond (500, 500 italic), Geist (400, 500, 600). Noto Naskh Arabic 500 loaded only on components rendering Arabic.
- Fallback metrics adjusted by next/font to avoid layout shift.

## JavaScript
- Dependencies: next, react, react-dom, gsap, @phosphor-icons/react (imported from the SSR entry so icons render on the server with zero client JS).
- No Three.js, R3F, Lenis, Motion, Tailwind, UI kits, analytics or third-party embeds in v1.
- GSAP (about 45KB gzip with ScrollTrigger) never blocks first paint.

## Checks
- `npm run build` output reviewed for route sizes.
- Lighthouse mobile on `/`, `/menu`, one dish page.
- Browser pane: throttled load, no console errors, no hydration warnings.
