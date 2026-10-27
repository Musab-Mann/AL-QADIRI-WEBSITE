# STITCH PROMPTS: Al Qadri Restaurant

How to use: in Stitch (web), paste the **Design System** block once when creating the project, then generate each screen with its prompt. Stitch output is a visual reference only. All names and prices come from `MENU_DATA.md`; never let Stitch invent dishes, reviews, hours or statistics.

---

## DESIGN SYSTEM (REQUIRED, paste into every screen if Stitch does not keep project tokens)
- Platform: Web, responsive (desktop 1440px and mobile 390px)
- Theme: Dark only. Warm, cinematic, editorial restaurant brand. Low-key food photography glowing on a deep espresso canvas. Generous whitespace, offset asymmetric layouts, square corners everywhere.
- Background: Espresso Night (#15110E) for the whole page
- Surface: Roasted Umber (#211A15) for raised cards, search field and dialogs
- Supporting surface: Cardamom Green (#233A2E) for the single contact band only
- Text Primary: Ivory (#F3ECE1) for headlines and body
- Text Secondary: Sand Ash (#B9AC9D) for metadata, counts and "Half / Full" labels
- Primary Accent: Burnished Copper (#C07A45) for primary buttons (dark text #15110E on copper), active states and focus rings. The only accent color.
- Dividers: thin 1px ivory lines at 12% opacity, used sparingly between groups
- Headline font: elegant high-contrast editorial serif (Cormorant Garamond style), medium weight, tight tracking
- UI/body font: clean modern geometric sans (Geist style); prices use tabular numerals
- Buttons: sharp square corners, no shadows, no glow. Primary copper fill; secondary transparent with thin ivory outline
- Cards and images: 0px radius, no drop shadows, captions always below images, never overlaid
- Icons: thin line icons
- Forbidden: emojis, gradients on text, glassmorphism, neon, purple, red or yellow, rounded pill cards, three equal cards in a row, star ratings, reviews, fake statistics, scroll arrows, section numbers, badges on photos, em-dashes

---

## 1. Home, desktop (1440px)
A cinematic, editorial homepage for Al Qadri Restaurant, a Pakistani restaurant near Big Bazaar in Sajja, Sharjah, designed to make visitors order on WhatsApp.

**Page Structure:**
1. **Header (72px, one line, transparent over hero):** left "AL QADRI" serif wordmark with small Arabic "مطعم القادري" beneath; center text links Menu, About, Gallery, Contact; right copper button "Order now".
2. **Hero (full viewport height), image-as-canvas:** full-bleed photograph of Chicken Fresh Karahi in a steel karahi on dark stone, dish in the right two-thirds, deep shadow in the lower left. Copy anchored lower left over the shadow: small uppercase label "Pakistani cuisine in Sajja, Sharjah"; large two-line serif headline "The taste of home."; one sentence "Karahi, handi, BBQ and breakfast favourites near Big Bazaar. Free home delivery."; copper button "Order now" and outlined button "View menu". Nothing else in the hero.
3. **Signature dishes, asymmetric six-tile grid:** serif heading "Signature dishes". One large portrait tile (Mutton Fresh Karahi) spanning two rows on the left; five smaller photo tiles of varied widths: Chicken Fresh Karahi, Chicken Biryani, Mutton Palao, Kabab Karahi, Chicken Handi. Below each photo: dish name in sans, price such as "AED 25 / 50" with "Half / Full" in muted text (Chicken Biryani "AED 10", Mutton Palao "AED 10", Kabab Karahi "AED 22").
4. **Menu index, typographic list:** serif heading "From chai to karahi." with a tiny rounded-square photo of chai placed inline between words and another of karahi. Below, a large vertical list of six category names in serif with item counts in small sans on the right: Breakfast 18, BBQ / Grill 9, Curry 13, Rice 3, Special Lunch & Dinner 6, Refreshment 9. The hovered row shows a floating preview photo on the right side.
5. **Story, split layout:** left a tall food detail photograph (whole spices on dark stone); right serif heading "Authentic food. Warm hospitality." and a short paragraph placeholder "[Restaurant story from owner]", text link "Our story".
6. **Gallery, off-grid mosaic:** five food photographs of different sizes arranged asymmetrically with generous gaps, no captions on images. Text link "View gallery".
7. **Visit us band (Cardamom Green, full width):** very large serif address "Near Big Bazaar, Sajja, Sharjah"; two phone numbers "0502582786" and "0561080497"; email "alqadrirestaurant@gmail.com"; a row of actions: copper "Order now", outlined "Call", "Email", "Get directions". Small tag "Free Home Delivery".
8. **Closing statement:** centered large serif "Hungry? Order now." with copper "Order now" button and "Call" text link.
9. **Footer:** wordmark with Arabic name, address, phones, email, nav links, "Free Home Delivery", copyright line.

## 2. Home, mobile (390px)
The same homepage adapted for a phone, single column, thumb-friendly.

**Page Structure:**
1. **Header (64px):** wordmark left; text button "Menu" right.
2. **Hero:** Chicken Fresh Karahi photograph on top (4:5, full width); below it on the dark canvas the label, two-line serif headline "The taste of home.", the one-sentence subtext, full-width copper "Order now", outlined "View menu".
3. **Signature dishes:** horizontal scroll-snap row of six portrait photo tiles with name and price under each.
4. **Menu index:** heading "From chai to karahi." (inline photos drop below the heading), six full-width category rows with counts.
5. **Story:** photo then heading then paragraph.
6. **Gallery:** two-column staggered grid of five photos.
7. **Visit us band:** address, phones, email, stacked full-width action buttons.
8. **Footer.**
9. **Fixed bottom action bar (56px):** three equal buttons: copper "Order now", "Call", "Directions" with thin icons.

## 3. Menu, desktop (1440px)
A beautiful editorial restaurant menu page, easy to scan, photography-led, not a spreadsheet.

**Page Structure:**
1. **Header:** same as home, solid espresso background.
2. **Intro:** serif H1 "Menu"; one line "Half / Full shows the two portion prices."; copper "Order now"; search field labelled "Search dishes" on the right.
3. **Body, two columns:** left sticky vertical category rail (Breakfast, BBQ / Grill, Curry, Rice, Special Lunch & Dinner, Refreshment) with a thin copper bar marking the active category; right the menu content.
4. **Category section (show Special Lunch & Dinner and Curry):** serif category heading with item count; one wide feature card on Roasted Umber with a 3:2 photo and caption below (Chicken Fresh Karahi, AED 18 / 35, Half / Full); then dish rows in two columns: small square thumbnail, dish name, dotted leader, right-aligned price with "Half / Full" beneath when there are two prices. Rows: Chicken Handi AED 15 / 30, Mutton Handi AED 18 / 35, Mutton Fresh White Karahi AED 30 / 60, Chicken Fresh White Karahi AED 22 / 40, Mutton Fresh Karahi AED 25 / 50. Curry rows: Curry Pakora AED 6, Tawa Qeema AED 10, Roti AED 1, Daal AED 4 / 6, Sabzi AED 4 / 6, Alo Gosht AED 10, Chicken Qorma AED 8, Sarson Ka Saag AED 7, Mutton Qorma AED 12, Chicken Achari AED 12, Mutton Achari AED 14, White Mutton Qorma AED 13, Kabab Karahi AED 22.
5. **Footer.**

## 4. Menu, mobile (390px)
The menu on a phone: fast to scan with one thumb.

**Page Structure:**
1. **Header** with "Menu" button.
2. **Intro:** H1 "Menu", legend line, full-width search field.
3. **Sticky horizontal category chips** (text only, copper underline on active): Breakfast, BBQ / Grill, Curry, Rice, Special, Refreshment.
4. **Category section (Breakfast):** heading "Breakfast" with count 18; feature card photo of Aloo Paratha with "Aloo Paratha AED 3"; single-column rows with thumbnail, name and price: Sada Chai AED 1, Fresh Chai AED 2, Kashmiri Chai AED 2.5, Sada Paratha AED 1.5, Moli Paratha AED 3, Anda Paratha AED 3, Lahori Chana AED 3 / 5 (Half / Full), Mutton Paya AED 8, Nehari AED 8, Aloo Qeema AED 5 / 10 (Half / Full), Maghaz AED 5 / 10, Kaleji AED 5 / 10, Haleem AED 5 / 10.
5. **Fixed bottom action bar:** Order now, Call, Directions.

## 5. Dish detail, desktop (1440px)
A focused product-style page for one dish that leads straight to ordering.

**Page Structure:**
1. **Header.**
2. **Main, split:** left large 4:5 photograph of Chicken Handi in a clay handi (sticky); right breadcrumb "Menu / Special Lunch & Dinner", serif H1 "Chicken Handi", price "AED 15 / 30" large with "Half / Full" beneath, short muted line "Description from the restaurant coming soon", copper "Order now", outlined "WhatsApp 0561080497", text link "Call 0502582786", small tag "Free Home Delivery".
3. **More from Special Lunch & Dinner:** horizontal row of four compact items with thumbnail, name and price (Mutton Handi AED 18 / 35, Chicken Fresh Karahi AED 18 / 35, Mutton Fresh Karahi AED 25 / 50, Chicken Fresh White Karahi AED 22 / 40).
4. **Footer.**

## 6. About, desktop (1440px)
A quiet editorial story page that states only verified facts.

**Page Structure:**
1. **Header.**
2. **Opening:** serif H1 "Our story"; wide food photograph (roti stack on dark wood) below.
3. **Story text:** narrow single column, serif heading "Authentic food. Warm hospitality.", body placeholder "[Restaurant story from owner]".
4. **Facts list, three short stacked rows (not cards):** "Pakistani cuisine" / "Near Big Bazaar, Sajja, Sharjah" / "Free Home Delivery".
5. **Call to action:** outlined "View menu" and copper "Order now".
6. **Footer.**

## 7. Gallery, desktop (1440px)
An art-directed food photography gallery.

**Page Structure:**
1. **Header.**
2. **Intro:** serif H1 "Gallery", one line "From our kitchen".
3. **Asymmetric masonry grid:** nine food photographs in mixed portrait, landscape and square sizes (karahi, biryani, grill platter, spices, roti, chai, jalebi, samosa, lassi), generous gaps, no captions or overlays.
4. **Closing:** copper "Order now".
5. **Footer.**

## 8. Contact / location, desktop (1440px)
A clear, confident contact page that makes calling, messaging and finding the restaurant effortless.

**Page Structure:**
1. **Header.**
2. **Main, asymmetric split:** left very large serif H1 "Visit Al Qadri" and the address exactly as "AL QADRI RESTAURANT NEAR BIG BAZAAR SAJJA SHARJAH" in large readable sans; right a vertical list of contact actions, each a full-width row with a thin icon, label and value: Call 0502582786, Call 0561080497, WhatsApp 0502582786, WhatsApp 0561080497, Email alqadrirestaurant@gmail.com, Get directions.
3. **Directions band (Cardamom Green):** large text "Near Big Bazaar, Sajja" with copper "Get directions" button. No map pin graphic, no opening hours.
4. **Free Home Delivery note** with copper "Order now".
5. **Footer.**
