# CONTENT MODEL

One source per kind of content. Components never hardcode menu names, prices, phones or copy.

## `src/data/menu.ts`
```ts
export type CategoryId = 'breakfast' | 'bbq-grill' | 'curry' | 'rice' | 'special' | 'refreshment';

export interface Category {
  id: CategoryId;
  label: string;          // "Special Lunch & Dinner"
  printedHeading: string; // "Special / Lunch & Dinner"
  order: number;
  leadSlug: string;       // item whose photo leads the category
}

export type Prices = readonly [string] | readonly [string, string] | readonly [string, string, string];

export interface MenuItem {
  slug: string;
  name: string;           // display spelling (client list)
  sourceName: string;     // as printed
  category: CategoryId;
  prices: Prices;
  sourcePrice: string;    // verbatim, e.g. "18/35 AED"
  image?: string;         // "/menu/chicken-handi.webp"
  imageAlt?: string;
  description?: string;   // owner-supplied only
  featured?: boolean;
}
```
Helpers: `categories`, `menuItems`, `getItemsByCategory(id)`, `getItem(slug)`, `getFeatured()`, `getLead(id)`.
Featured (in order, only dishes with finished photography): chicken-fresh-karahi, mutton-fresh-karahi, chicken-biryani, alo-gosht, chicken-tikka, chicken-handi.
Category leads: breakfast sada-paratha · bbq-grill chicken-tikka · curry alo-gosht · rice chicken-biryani · special chicken-fresh-karahi · refreshment samosa-raita. (Changed 2026-09-16 so every homepage visual has a finished photo; no "Photo coming soon" tiles on the homepage.)
Story section photo: fresh-chai. About page photo: sada-paratha.

## `src/lib/price.ts`
| Function | Input | Output |
|---|---|---|
| `formatPrice(prices)` | ["12"] | `AED 12` |
| | ["3","6"] | `AED 3 / 6` |
| | ["30","40","50"] | `AED 30 / 40 / 50` |
| `portionLabels(prices)` | 2 prices | `["Half","Full"]`; otherwise `null` |
| `priceAriaLabel(prices)` | ["15","30"] | `Half 15 dirhams, Full 30 dirhams` |
| | ["30","40","50"] | `30, 40 or 50 dirhams` |
| `orderLine(item)` | Chicken Handi | `Chicken Handi (Half AED 15 / Full AED 30)` |

## `src/content/site.ts`
```ts
brand   = { name: 'Al Qadri Restaurant', nameArabic: 'مطعم القادري', tagline: 'The Best Taste', cuisine: 'Pakistani' }
contact = {
  address: 'AL QADRI RESTAURANT NEAR BIG BAZAAR SAJJA SHARJAH',
  phones: [
    { display: '0502582786', e164: '+971502582786', whatsapp: true, primary: true },
    { display: '0561080497', e164: '+971561080497', whatsapp: true },
  ],
  email: 'alqadrirestaurant@gmail.com',
  mapsUrl: null,          // owner to supply; fallback = Maps search URL
  delivery: 'Free Home Delivery',
}
```
Link helpers in `src/lib/links.ts`: `telHref(phone)`, `waHref(phone, message)`, `mailHref()`, `directionsHref()`.

## WhatsApp messages
| Context | Message |
|---|---|
| General order | `Assalam o Alaikum, I would like to place an order with Al Qadri Restaurant.` |
| Dish order | `Assalam o Alaikum, I would like to order: {orderLine(item)}` |

## Site copy (`src/content/site.ts` → `copy`)
| Key | Text | Status |
|---|---|---|
| hero.eyebrow | Pakistani cuisine in Sajja, Sharjah | Draft, factual |
| hero.title | The taste of home. | Draft |
| hero.body | Karahi, handi, BBQ and breakfast favourites near Big Bazaar. Free home delivery. | Draft, factual |
| dishes.title | Signature dishes | Draft |
| menuIndex.title | From chai to karahi. | Draft |
| story.title | Authentic food. Warm hospitality. | Draft (brief wording) |
| story.body | [PLACEHOLDER: restaurant story from owner] | Placeholder |
| gallery.title | From our kitchen | Draft; images are illustrative until real photos arrive |
| visit.title | Visit Al Qadri | Draft |
| closing.title | Hungry? Order now. | Draft |
| menu.legend | Half / Full shows the two portion prices. | Draft |

Rule: zero em-dashes or en-dashes in any string (checked by `npm run validate`).

## `src/data/gallery.ts`
`{ src, alt, width, height, span: 'wide' | 'tall' | 'square' }[]`: food and ingredient images only.
