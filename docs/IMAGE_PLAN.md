# IMAGE PLAN

**Status 2026-09-16 (latest):** the category fallback images were removed from `src/data/menu.ts`. Every dish now shows either its own photo or no photo at all, so no dish is ever illustrated with another dish's picture (CLAUDE.md image rule). 13 of 58 dishes have their own photo; the remaining 45 render as text rows until their photo exists.

Newly wired from approved shots already on disk: `mix-grill.webp`, `jalebi-1kg.webp`, `roti.webp`, `fresh-lassi.webp`. The gallery page now uses `gallery-spices`, `gallery-roti-stack`, `gallery-mix-grill`, `gallery-jalebi`, `gallery-lassi`, so it has no empty slots left.

Remaining 43 photos to produce (shared: `daal.webp` for both Daal rows, `sabzi.webp` for both Sabzi rows), generated in ChatGPT against the approved style anchor.

**Current approach (client decision 2026-09-16, latest):** a mix of real and AI. Each menu photo starts from a real free-license stock photo (Unsplash / Pexels), which is uploaded to ChatGPT and enhanced (light, color, steam, plating polish) while keeping the real food, vessel and composition, so the result is premium but does not look AI-generated. The hero keeps the ChatGPT close-up steaming karahi the client preferred, animated in CSS 3D with layered steam.

**Approved house style (client, 2026-09-16):** `assets-source/chicken-fresh-karahi-enhanced.png`. Every photo matches it: warm natural side light, dark walnut table, polished steel or plain white serveware, fresh garnish, soft real steam, naan or sides softly out of focus behind, landscape or portrait crops with the whole dish visible. Workflow per dish: real stock photo of that exact dish + this reference uploaded together to ChatGPT, prompt "keep the real food from image 1, match the style of image 2".

### Source photos (real) and credits
| Dish / use | Source | Photographer | File in assets-source |
|---|---|---|---|
| Hero (live, client choice: enhanced mutton karahi, 3D animated) | Unsplash 7-TOCB28rms enhanced in ChatGPT | Daily Slowdown | mutton-fresh-karahi-enhanced.png -> images/hero/mutton-fresh-karahi-hero-v3.webp |
| Hero (live as images/hero/mutton-fresh-karahi-hero-v4.webp) | Mutton enhanced photo widened to 16:9 in ChatGPT | Daily Slowdown (base) | mutton-fresh-karahi-hero-wide.png |
| Fresh Chai (to enhance) | Unsplash TlFf1kJm_zU | Dilpreet Singh | stock-chai-tray-unsplash-TlFf1kJm_zU.jpg |
| Chicken Tikka, BBQ lead (live, enhanced as chicken-tikka.webp) | Unsplash uIiMSu88RZQ | Hamid Roshaan | stock-chicken-tikka-grill-unsplash-uIiMSu88RZQ.jpg, chicken-tikka-enhanced.png |
| Sada Paratha, Breakfast lead (to enhance) | Unsplash Q_lbJP1NBoI | Hamza Dildar | stock-paratha-tawa-unsplash-Q_lbJP1NBoI.jpg |
| Samosa + Raita, Refreshment lead (to enhance) | Unsplash 8T9AVksyt7s | kabir cheema | stock-samosa-unsplash-8T9AVksyt7s.jpg |
| Not matched (text rows until a real photo exists) | Mutton Palao, Mutton Qorma, Mix Grill, Kabab Karahi, Aloo Paratha | | |
| Chicken Fresh Karahi (live, enhanced in the mutton style as chicken-fresh-karahi-v3.webp) | Unsplash jjoyL1hk1Vo + mutton style reference | Raman | stock-chicken-karahi-spoon-unsplash-jjoyL1hk1Vo.jpg, chicken-fresh-karahi-enhanced.png |
| Alo Gosht (live, enhanced as alo-gosht.webp) | Unsplash RVWHhDVjBNI | Rimsha Noor | stock-alo-gosht-unsplash-RVWHhDVjBNI.jpg, alo-gosht-enhanced.png |
| Chicken Karahi (not used) | Pexels 39378356 | Bachir Mamud | stock-chicken-karahi-pexels-39378356.jpg |
| Chicken Karahi alt | Unsplash jjoyL1hk1Vo | Raman | stock-chicken-karahi-spoon-unsplash-jjoyL1hk1Vo.jpg |
| Chicken Karahi alt | Unsplash hEMOwugpjJk | Dr Muhammad Amer | stock-chicken-karahi-closeup-unsplash-hEMOwugpjJk.jpg |
| Chicken Karahi top-down | Unsplash HRamW92xlCI | Rimsha Noor | stock-karahi-topdown-unsplash-HRamW92xlCI.jpg |
| Mutton Fresh Karahi (enhanced in ChatGPT, live) | Unsplash 7-TOCB28rms | Daily Slowdown | stock-mutton-karahi-unsplash-7-TOCB28rms.jpg, mutton-fresh-karahi-enhanced.png |
| Alo Gosht | Unsplash RVWHhDVjBNI | Rimsha Noor | stock-alo-gosht-unsplash-RVWHhDVjBNI.jpg |
| Chicken Handi (live, enhanced as chicken-handi.webp) | Unsplash tG9eGRhaSXE | Azmaan Baluch | stock-chicken-handi-unsplash-tG9eGRhaSXE.jpg, chicken-handi-enhanced.png |
| Samosa + Raita (live, enhanced as samosa-raita.webp) | Unsplash 8T9AVksyt7s | kabir cheema | stock-samosa-unsplash-8T9AVksyt7s.jpg, samosa-raita-enhanced.png |
| Sada Paratha (live, enhanced as sada-paratha.webp) | Unsplash Q_lbJP1NBoI | Hamza Dildar | stock-paratha-tawa-unsplash-Q_lbJP1NBoI.jpg, sada-paratha-enhanced.png |
| Chicken Biryani (enhanced in ChatGPT, live as chicken-biryani-v2.webp) | Unsplash q29oNjt3sEQ | Sarabjeet Singh | stock-chicken-biryani-unsplash-q29oNjt3sEQ.jpg, chicken-biryani-enhanced.png |

---

## History

**Source changed 2026-09-16:** the client judged the ChatGPT images "totally AI generated vibe" and approved **free stock photography from Pexels, Unsplash or Pixabay** (licenses allow free commercial use without attribution). All generated images are being replaced. The client approved downloading each planned stock photo without per-image confirmation.

Selection rules for stock:
- The photo must clearly show the named dish (no generic curry labelled as karahi, no Indian thali labelled as a single dish).
- Prefer warm, natural, real-restaurant looks; avoid heavy filters, text overlays, watermarks, hands/faces where possible.
- Record source URL and photographer for each file in the table at the bottom of this document.
- If no honest match exists for a dish, it stays a text row (no substitute).

Images are **illustrative** until the restaurant supplies its own photography.

## Rules
- Food and ingredients only. Never generate the restaurant interior, exterior, staff, customers, signage or logo.
- One conversation per campaign so the style stays consistent; the approved style-anchor image is referenced in every later prompt.
- One image per dish, filename = slug. Exception: `daal.webp`, `sabzi.webp` are shared by the Breakfast and Curry entries.
- No dish is ever shown with another dish's photo. No image = text row.
- Raw downloads go to `assets-source/` (not committed). `scripts/optimize-images.ts` (sharp) writes WebP to `public/` (hero 2400px wide, others 1600px long edge, quality 80).

## Master style prompt
Revised 2026-09-16 after client feedback: the first (dark, muted, low-key) hero was "not attractive". Direction is now **rich, glowing, appetizing restaurant-campaign photography** that still reads as a real photograph.

> A real photograph from a premium restaurant advertising campaign for a Pakistani restaurant, shot on a full-frame camera with a 50mm lens at f/2.8, shallow depth of field, crisp focus on the front of the dish. Warm golden backlight from behind on the left makes real steam rise and glow and highlights rims and glossy sauces; soft warm fill from the front keeps colors rich, vivid and natural. Generous, freshly served portion: glossy masala, visible ghee sheen, juicy meat, bright fresh coriander, slivered green chillies, fine ginger julienne, lemon where authentic. Supporting sides slightly out of focus (blistered tandoori naan with charred spots on linen, small brass bowl of sliced red onion and green chutney, raita). Dark walnut wood table with warm tones, background falling into deep warm shadow. Real details: a few drops of sauce on the wood, a torn piece of naan, natural imperfections.
>
> Avoid: perfect symmetry, glossy plastic sheen, over-sharpening, HDR look, oversaturated colors, glowing edges, floating ingredients, splashes, smoke effects, bokeh orbs, garnish sprinkled everywhere, identical repeated pieces, text, logos, hands, people, extra cutlery, props that do not belong on a Pakistani table. Do not use words like "hyper-realistic", "8k" or "ultra-detailed" in follow-up prompts; they push the AI look.

### Making images read as real, not AI
- Generate at the largest size, then review at 100% zoom for melted edges, fused grains of rice, extra chillies, warped vessel rims.
- Prefer slightly imperfect results over flawless ones; ask ChatGPT to "make it less perfect and more like a real restaurant plate" when a result looks too clean.
- Post-process every approved image with the same treatment in `scripts/optimize-images.ts`: gentle crop to the target ratio, very light shared color grade (lifted blacks toward #15110E, slightly warm highlights), 2-3% film grain, no sharpening.
- Keep one light direction (from the left) across the whole set.

Per-image suffix: `Subject: {dish}. {angle}. Aspect ratio {ratio}. {composition note}`

## Tier 1 (13 images, generated first)
| # | File | Subject | Angle | Ratio | Composition note |
|---|---|---|---|---|---|
| 1 | images/hero/chicken-fresh-karahi-wide.webp | Chicken Fresh Karahi in a steel karahi | 45 degrees | 3:2 (cropped to 16:9) | Dish in the right two-thirds; deep, clean dark negative space in the lower left for text |
| 2 | images/hero/chicken-fresh-karahi-tall.webp | Chicken Fresh Karahi (same scene) | 45 degrees | 2:3 (cropped to 4:5) | Dish centered, dark space above |
| 3 | menu/chicken-fresh-karahi.webp | Chicken Fresh Karahi | overhead | 2:3 (4:5 crop) | Dish centered, small margin |
| 4 | menu/mutton-fresh-karahi.webp | Mutton Fresh Karahi | 45 degrees | 2:3 (4:5 crop) | Dish centered |
| 5 | menu/chicken-biryani.webp | Chicken Biryani on a plate | 45 degrees | 2:3 (4:5 crop) | Grains visible, raita bowl allowed at edge |
| 6 | menu/mutton-palao.webp | Mutton Palao on a plate | 45 degrees | 2:3 (4:5 crop) | Dish centered |
| 7 | menu/kabab-karahi.webp | Kabab Karahi in a steel karahi | 45 degrees | 2:3 (4:5 crop) | Dish centered |
| 8 | menu/chicken-handi.webp | Chicken Handi in a clay handi | 45 degrees | 2:3 (4:5 crop) | Dish centered |
| 9 | menu/aloo-paratha.webp | Aloo Paratha | overhead | 3:2 | Folded paratha, butter sheen |
| 10 | menu/mix-grill.webp | Mix Grill platter | overhead | 3:2 | Kababs, tikka, boti arranged naturally |
| 11 | menu/mutton-qorma.webp | Mutton Qorma in a bowl | 45 degrees | 3:2 | Dish off-center right |
| 12 | menu/samosa-raita.webp | Samosa with a small bowl of raita | 45 degrees | 3:2 | Dish off-center left |
| 13 | menu/fresh-chai.webp | Fresh Chai in a glass or steel cup | 45 degrees | 1:1 | Tight crop, steam, used inline in a headline |

Gallery (Tier 1 adds 2): `images/gallery/spices-detail.webp` (whole spices on dark stone, overhead, 3:2) and `images/gallery/roti-stack.webp` (fresh roti stack, 45 degrees, 2:3).

## Tier 2 (remaining dishes, batches by category)
Breakfast: sada-chai, kashmiri-chai, sada-paratha, moli-paratha, anda-paratha, lahori-chana, mutton-paya, nehari, aloo-qeema, maghaz, kaleji, haleem, daal (shared), sabzi (shared), anda-amlet, anda-fry
BBQ / Grill: fish-fry, chicken-charcoal, chicken-kabab, chapli-kabab, tikka-boti, fish-grill, malai-boti, chicken-tikka
Curry: curry-pakora, tawa-qeema, roti, alo-gosht, chicken-qorma, sarson-ka-saag, chicken-achari, mutton-achari, white-mutton-qorma
Rice: daal-chawal
Special: mutton-handi, mutton-fresh-white-karahi, chicken-fresh-white-karahi
Refreshment: samosa-chaat, chana-chaat, pakora-1kg, jalebi-1kg, kheer, milk-jalebi, fresh-lassi, rabri-milk
Gallery: 3 more food-detail images (e.g. chai-pour, grill-smoke, jalebi-close)

Tier 2 prompts use a 2:3 ratio (4:5 crop) and the angle of their category: overhead for breads, platters and chaat; 45 degrees for curries, karahi, handi, rice, drinks and desserts.

## Review checklist per image
- [ ] Dish is recognisably the named dish
- [ ] No text, hands, people, logos, cutlery clutter
- [ ] Lighting, surface and color match the style anchor
- [ ] No AI artifacts (melted edges, impossible objects, duplicated garnish)
- [ ] Negative space where the layout needs it


## Pixabay round (2026-09-16)

ChatGPT hit the Free plan image limit, so this round uses free-licence Pixabay photographs (free for commercial use, no attribution required), each put through the shared grade and grain in `scripts/optimize-images.mts`. Raw files are in `assets-source/stock/`. They are queued for a ChatGPT restyle to the house look once the image quota resets.

| Dish | Pixabay file |
| --- | --- |
| Nehari | nihari-5496504 |
| Lahori Chana | chana-masala-1271639 |
| Pakora (1kg) | pakora-959089 |
| Chicken Kabab | kabab-4954818 |
| Chapli Kabab | chapli-kebab-7262657 |
| Chicken Charcoal | chicken-drumsticks-5205207 |
| Fish Fry | fried-fish-with-chilli-4388141 |
| Kaleji | liver-4846584 |
| Mutton Palao | pulao-with-mutton-kadai-7262667 |
| Tikka Boti | chicken-tikka-7076645 |
| Chicken Qorma | hyderabadi-chicken-korma-6667608 |
| Anda Amlet | omelette-1071021 |

Rejected rather than used, because the photo did not honestly show the dish: Daal, Sabzi, Anda Fry, Sada Chai, Kheer, Chana Chaat, Samosa Chaat, Sarson Ka Saag, Mutton Qorma, Fish Grill, Malai Boti.

Still without a photo (33 dishes, all queued for ChatGPT): the three stuffed parathas, Kashmiri Chai, Sada Chai, Mutton Paya, Maghaz, Haleem, Aloo Qeema, Tawa Qeema, Daal, Sabzi, Anda Fry, Fish Grill, Malai Boti, Curry Pakora, Sarson Ka Saag, Mutton Qorma, Chicken Achari, Mutton Achari, White Mutton Qorma, Kabab Karahi, Daal Chawal, Mutton Handi, both White Karahis, Samosa Chaat, Chana Chaat, Kheer, Milk Jalebi, Rabri Milk.
