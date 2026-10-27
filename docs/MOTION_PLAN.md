# MOTION PLAN

Engine: GSAP 3 + ScrollTrigger (dynamic import after hydration) and CSS transitions. No Lenis, no Motion library, no Lottie or video.
Timings below are provisional; they are refined in Jitter prototypes and updated here.

## Principles
- Motion supports hierarchy: page entrance, then section reveal, then micro-interaction.
- Content is visible by default. JavaScript sets the "from" state, so a failed script never hides content.
- Animate only transform, opacity and clip-path.
- Under `prefers-reduced-motion: reduce`, GSAP never loads and CSS transitions are near-instant.
- No `window` scroll listeners: ScrollTrigger and IntersectionObserver only.

## Moments
| # | Moment | Where | Provisional spec | Jitter prototype |
|---|---|---|---|---|
| 1 | Hero entrance | `/` hero | Photo clip-path inset(8% 6% 8% 6%) to inset(0) 1.2s expo.out; headline lines yPercent 110 to 0, 0.9s expo.out, stagger 0.08s, start 0.25s; body and buttons opacity 0 to 1 + y 16 to 0, 0.7s power3.out, start 0.6s; photo scale 1.06 to 1 over 12s linear-out | Yes |
| 2 | Image mask reveal | Signature dishes, story, gallery | `[data-motion="mask"]` clip-path inset(12% 9%) to inset(0), scrub 0.6 from top 95% to top 50%; inner image scale 1.2 to 1, yPercent -5 to 5 over full pass | Yes |
| 3 | Headline lines | Section H2s | `[data-motion="lines"]` each line rises through its mask, 1.05s expo.out, stagger 0.09, once at top 88% | No |
| 4 | Group rise | Short groups (max 6 children) | `[data-motion="rise"]` y 26 to 0 + opacity, 0.9s power3.out, stagger 0.08, once | No |
| 5 | Menu index hover preview | `/` menu index (desktop, pointer: fine) | Preview image opacity 0 to 1 + scale 0.96 to 1, 320ms ease-out; follows active row, not the cursor | Yes |
| 6 | Category marker | `/menu` nav | 2px copper bar translateY/translateX to active item, 320ms ease-out | Yes (with 5) |
| 7 | Header state | All pages | Background transparent to canvas, 320ms, via IntersectionObserver sentinel | No |
| 8 | Micro | Global | Photo hover scale 1.03 600ms ease-out; button active translateY(1px) 180ms | No |
| 9 | Add to order | Menu rows, dish page, signature dishes | Portion choice (Half / Full) slides a copper indicator between options (transform, 320ms ease-out); "Add" button morphs label to "Added" with a check (opacity/translate crossfade 240ms); a small copper dot travels from the button toward the order tray along a curved path (transform only, 520ms power2.inOut, skipped under reduced motion) | Yes |
| 10 | Order tray | All pages when list is not empty | Tray rises from the bottom (translateY 100% to 0, 420ms expo.out); item count rolls (old number up and out, new number up and in, 260ms); tray expands to a sheet listing items (clip-path from bottom, 480ms expo.out); removing an item collapses its row (opacity + translateX then height via FLIP transform, 280ms) | Yes |
| 11 | Send order | Order sheet | "Send on WhatsApp" press: 1px press, then the sheet eases down 300ms as WhatsApp opens in a new tab; list is kept so the customer can return | No |

## Added 2026-09-16 (client requests)
| Moment | Where | Spec |
|---|---|---|
| Hero 3D scene | `/` hero | CSS 3D stage (perspective 1300px), idle sway rotateY plus or minus 4deg (14s), pointer tilt up to 10deg / 6deg, three steam planes at translateZ 40 / 110 / 190px |
| Hero pinned scroll story | `/` hero, desktop only | Pin for 80% of viewport height, scrub 0.7: photo scale 1.2, scene rotateY -14deg rotateX 16deg, steam yPercent -30 scale 1.45, headline lines split left/right, copy fades, vignette closes in. Compact screens: unpinned parallax only |
| Header hide/show | All pages | Hides after 320px while scrolling down, returns on scroll up (transform 480ms) |
| Tilt cards | Signature dishes, desktop | Pointer tilt up to 8deg with transformPerspective 1000 |
| Magnetic buttons | Hero CTAs, desktop | Button leans up to about a quarter of the pointer offset, eases back on leave |

## Jitter workflow (Chrome)
1. New 1440x900 artboard: hero with placeholder photo block and two headline lines. Animate moment 1 and export an MP4 preview to `docs/design/jitter/hero-entrance.mp4` (download confirmed with client).
2. 1440x900 artboard: a photo tile scrolling into view. Animate moment 2, export `image-mask.mp4`.
3. 1440x900 artboard: menu index list with preview image and category marker. Animate moments 5 and 6, export `menu-hover.mp4`.
4. Copy final durations and easings from Jitter into the table above.

## Not used
Scroll hijacking, pinned horizontal pans, bounce/spring easing, perpetual loops, cursor followers, parallax on text, per-row menu animation.
