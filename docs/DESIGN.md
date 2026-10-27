# Design System: Al Qadri Restaurant

## 1. Visual Theme & Atmosphere
"Night kitchen." A warm, cinematic, editorial interface for a Pakistani restaurant in Sajja, Sharjah. The whole site lives on one dark espresso canvas, echoing the dark maroon printed menu, so low-key food photography glows like a dish under a single warm lamp. Ivory type is calm and generous; one burnished copper accent marks every action. Layouts are offset and asymmetric but never chaotic; every element owns its own space.

- Density: 3, "Art Gallery Airy" (menu page 5, "Daily App Balanced")
- Variance: 7, "Offset Asymmetric"
- Motion: 5, "Fluid and restrained": slow mask reveals, gentle parallax, no bounce, no perpetual loops
- Theme: dark only (brand decision, matches the printed menu). No light mode, no section theme flips.

## 2. Color Palette & Roles
- **Espresso Night** (#15110E) - Page canvas for every section
- **Roasted Umber** (#211A15) - Raised surfaces: menu feature cards, dialog panels, search field
- **Cardamom Green** (#233A2E) - Tonal surface for the Visit Us band and the "Free Home Delivery" tag. Never interactive, never text
- **Ivory** (#F3ECE1) - Headlines, primary text, icons (about 15.9:1 on Espresso)
- **Sand Ash** (#B9AC9D) - Secondary text, category counts, Half / Full labels (about 8.4:1 on Espresso)
- **Burnished Copper** (#C07A45) - The single accent: primary button fill with Espresso text (about 5.5:1), active category marker, focus ring, feature prices
- **Hairline** (rgba(243,236,225,0.12)) - Sparse 1px structural dividers between groups, never under every row

Max one accent. No pure black, no pure white. No red/yellow from the old print. No purple, neon, glow or gradient text.

## 3. Typography Rules
- **Display / Headlines:** Cormorant Garamond, weight 500 (italic for single emphasized words only). Controlled scale: DISPLAY clamp(3rem, 1.8rem + 5vw, 6rem) / line-height 1.0 / tracking -0.015em; H1 clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem) / 1.05; H2 clamp(2rem, 1.4rem + 2.2vw, 3.25rem) / 1.1. Italic words with descenders get line-height 1.1 minimum and a small bottom reserve.
- **UI / Body:** Geist. H3 500 clamp(1.125rem, 1rem + 0.4vw, 1.375rem); body 400 1rem / 1.65, max 65 characters per line; body large 1.1875rem / 1.6; small 0.875rem / 1.5.
- **Labels:** Geist 500, 0.75rem, uppercase, tracking 0.14em. Used at most once per three sections.
- **Prices:** Geist 500 with tabular numerals, 1rem in rows, 1.25rem on feature cards. Format "AED 18 / 35" with "Half / Full" in Sand Ash beneath.
- **Buttons:** Geist 500, 0.9375rem, tracking 0.02em, labels of three words or fewer, never wrapping.
- **Arabic wordmark:** Noto Naskh Arabic, only for مطعم القادري.
- **Banned:** Inter, Fraunces, Instrument Serif, Times New Roman, Georgia, system serif fallbacks as a visible face.

## 4. Component Stylings
* **Buttons:** Perfectly square corners (0 radius). Primary: Burnished Copper fill, Espresso text, no shadow, no glow; hover darkens copper slightly; active presses down 1px. Secondary: transparent with a 1px Ivory hairline border (40% opacity) and Ivory text. One label per intent everywhere: "Order now" (WhatsApp order), "Call", "View menu", "Get directions", "Email".
* **Menu rows:** Dish name left, dotted leader, price stack right. Optional 64px square thumbnail on the far left. Rows grouped in two columns on desktop with generous vertical rhythm instead of borders.
* **Feature cards (menu page, one per category):** Roasted Umber surface, square corners, large 3:2 photo on top, caption beneath the image (never overlaid): name, price, Half / Full.
* **Signature dish tiles:** Photo-led, square corners, caption below the image. Exactly six tiles in an asymmetric grid.
* **Category navigation:** Desktop sticky vertical text rail; active item in Ivory with a 2px copper bar that slides between items. Mobile sticky horizontal row of text chips with a copper underline.
* **Search:** Label above the field ("Search dishes"), Roasted Umber field with hairline border, copper focus ring, live result count below, empty state with a Call link.
* **Mobile action bar:** Fixed bottom, 56px plus safe area, three equal targets: Order now (copper), Call, Directions.
* **Loaders:** Not needed (fully static). Image slots reserve exact aspect ratio with a Roasted Umber fill.
* **Icons:** Phosphor icon set, regular weight, 20px, Ivory. Never hand-drawn SVG.

## 5. Layout Principles
- CSS Grid, 12 columns desktop, 8 tablet, 4 mobile. Max width 1400px, gutters clamp(1.25rem, 3vw, 2.5rem).
- Section spacing clamp(3.5rem, 8vw, 7rem). Hero top padding no more than 6rem.
- Every homepage section uses a different layout family: image-as-canvas hero, asymmetric six-cell bento, typographic index, split story, off-grid mosaic, full-width band, closing statement.
- Hero: full-bleed Chicken Fresh Karahi photograph with deliberate dark negative space in the lower left, where the copy sits. Maximum four text elements. Headline two lines at most, subtext 20 words at most.
- No split headers (big headline left + small paragraph right). Headline then body, stacked.
- No overlapping text on busy image areas; on mobile the hero image sits above the copy.
- Below 768px every multi-column layout collapses to a single column; rails become scroll-snap rows; nothing depends on hover.
- Touch targets at least 44px. Full-height sections use min-height 100dvh.

## 6. Motion & Interaction
- Engine: GSAP with ScrollTrigger, loaded after hydration; CSS transitions for hover and press.
- Hero load: headline lines rise through masks (about 0.9s, expo out, 0.08s stagger); photo opens from an inset clip; a 12-second slow settle from scale 1.06 to 1.
- Scroll: images open from an inset mask with subtle counter-parallax; section headlines rise line by line; short groups lift in with a small stagger.
- Menu page: no row-by-row animation; only the copper category marker slides.
- Hover: photos scale to 1.03 over 600ms; buttons press 1px.
- Only transform, opacity and clip-path animate. Content is visible without JavaScript. Everything collapses to static under reduced motion.
- Final timings are prototyped in Jitter and recorded in MOTION_PLAN.md.

## 7. Anti-Patterns (Banned)
- No em-dashes or en-dashes anywhere in visible copy
- No emojis
- No Inter, Fraunces or Instrument Serif
- No pure black or pure white
- No neon glows, gradient text, glassmorphism, blobs, particles, 3D or WebGL
- No three equal cards in a row
- No pills, tags or captions overlaid on photos
- No eyebrow above every section (max one per three sections)
- No section numbering ("01 / Menu"), scroll cues, bouncing arrows, decorative dots
- No custom cursors
- No invented reviews, ratings, awards, years, history, opening hours, map pins or statistics
- No AI copy cliches ("Elevate", "Seamless", "Unleash", "Culinary journey")
- No photos of a restaurant interior, staff or customers unless supplied by the owner
- No substitute photo next to the wrong dish
- No borders under every menu row
