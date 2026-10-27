# SITE MAP

## Routes
| Route | H1 | Sections | Primary action |
|---|---|---|---|
| `/` | The taste of home. | Hero, Signature dishes, Menu index, Story, Gallery, Visit us, Closing order | Order now |
| `/menu` | Menu | Intro + legend, Search, Category nav, 6 category sections | Order now |
| `/menu/[slug]` (58) | {Dish name} | Breadcrumb, Photo, Prices, Order actions, More from category | Order now |
| `/about` | Our story | Facts, story placeholder, photo | View menu |
| `/gallery` | Gallery | Asymmetric food photo grid | Order now |
| `/contact` | Visit Al Qadri | Address, phones, email, actions | Get directions |
| `/sitemap.xml`, `/robots.txt` | | | |
| 404 | Page not found | Links to Home and Menu | View menu |

Sitemap total: 5 pages + 58 dishes = **63 URLs**.

## Navigation
Header (desktop, one line): wordmark | Menu, About, Gallery, Contact | Order now
Mobile: wordmark | "Menu" button opening full-screen dialog (same links + Call + WhatsApp both lines)
Mobile action bar (all pages): Order now, Call, Directions
Footer: wordmark + Arabic name, address, both phones, email, nav links, Free Home Delivery, copyright

## Menu anchors
`/menu#breakfast` · `/menu#bbq-grill` · `/menu#curry` · `/menu#rice` · `/menu#special` · `/menu#refreshment`

## Action labels (one label per intent, used everywhere)
| Intent | Label | Target |
|---|---|---|
| WhatsApp order | Order now | `https://wa.me/971502582786?text=...` (the only number, client decision 2026-09-19) |
| Browse menu | View menu | `/menu` |
| Phone | Call | `tel:+971502582786`, displayed as "+971 50 258 2786" |
| Email | Email | `mailto:alqadrirestaurant@gmail.com` |
| Map | Get directions | Owner Maps link, else Google Maps search for the printed address |

## Homepage section order and layout family
1. Hero: image-as-canvas
2. Signature dishes: asymmetric six-cell bento
3. Menu index: typographic list with hover preview
4. Story: split text + image
5. Gallery: off-grid mosaic
6. Visit us: full-width green band with large type
7. Closing order: centered statement
Omitted until information exists: dining experience, reviews, opening hours.
