# DESIGN TOKENS

Implemented as CSS custom properties in `src/app/globals.css`. Contrast ratios are approximate and re-checked in QA.

## Color
| Token | Value | Use | Contrast |
|---|---|---|---|
| `--c-canvas` | #15110E | Page background | |
| `--c-surface` | #211A15 | Raised surface | |
| `--c-green` | #233A2E | Visit band, delivery tag | |
| `--c-ink` | #F3ECE1 | Primary text | 15.9:1 canvas, 14.6:1 surface, 10.4:1 green |
| `--c-ink-2` | #B9AC9D | Secondary text | 8.4:1 canvas, 7.7:1 surface, 5.5:1 green |
| `--c-accent` | #C07A45 | Buttons, active, focus | 5.5:1 canvas, 5.0:1 surface; do not use as text on green (3.6:1) |
| `--c-accent-hover` | #A9683A | Button hover | |
| `--c-on-accent` | #15110E | Text on copper | 5.5:1 |
| `--c-line` | rgba(243,236,225,0.12) | Dividers | |
| `--c-line-strong` | rgba(243,236,225,0.4) | Secondary button border | |
| `--c-scrim` | linear-gradient(to top right, rgba(21,17,14,0.85), rgba(21,17,14,0) 60%) | Hero copy zone | |

## Typography
| Token | Family | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| `--t-display` | Cormorant Garamond | 500 | clamp(3rem, 1.8rem + 5vw, 6rem) | 1.0 | -0.015em |
| `--t-h1` | Cormorant Garamond | 500 | clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem) | 1.05 | -0.01em |
| `--t-h2` | Cormorant Garamond | 500 | clamp(2rem, 1.4rem + 2.2vw, 3.25rem) | 1.1 | -0.005em |
| `--t-h3` | Geist | 500 | clamp(1.125rem, 1rem + 0.4vw, 1.375rem) | 1.3 | -0.005em |
| `--t-body-lg` | Geist | 400 | 1.1875rem | 1.6 | 0 |
| `--t-body` | Geist | 400 | 1rem | 1.65 | 0 |
| `--t-small` | Geist | 400 | 0.875rem | 1.5 | 0.005em |
| `--t-label` | Geist | 500, uppercase | 0.75rem | 1.2 | 0.14em |
| `--t-price` | Geist | 500, tabular-nums | 1rem / 1.25rem feature | 1 | 0.01em |
| `--t-button` | Geist | 500 | 0.9375rem | 1 | 0.02em |
| `--t-arabic` | Noto Naskh Arabic | 500 | per use | 1.4 | 0 |

## Space
`--s-1` 0.25rem · `--s-2` 0.5rem · `--s-3` 0.75rem · `--s-4` 1rem · `--s-5` 1.5rem · `--s-6` 2rem · `--s-7` 3rem · `--s-8` 4rem · `--s-9` 6rem
`--gutter` clamp(1.25rem, 3vw, 2.5rem) · `--section` clamp(3.5rem, 8vw, 7rem) · `--wrap` 1400px · `--measure` 65ch

## Shape
`--radius` 0 (all components). No exceptions.

## Layout
Breakpoints: 640 / 768 / 1024 / 1280. Grid: 4 cols (<768), 8 cols (768-1023), 12 cols (1024+).
Header height 72px desktop, 64px mobile. Mobile action bar 56px + `env(safe-area-inset-bottom)`.

## Motion
`--ease-out` cubic-bezier(0.16, 1, 0.3, 1) · `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1)
`--d-fast` 180ms · `--d-base` 320ms · `--d-slow` 600ms · hero settle 12s

## Z-index (also in `src/lib/z.ts`)
| Layer | Value |
|---|---|
| base | 0 |
| sticky category nav | 20 |
| header | 30 |
| mobile action bar | 40 |
| mobile nav dialog | 50 |
| skip link | 60 |
