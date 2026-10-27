# Al Qadri Restaurant — Website

A modern, responsive restaurant website for **Al Qadri Restaurant** in Sajja, Sharjah, UAE. The experience brings the restaurant's menu, food photography, story, location and WhatsApp ordering together in one place.

**Live website:** https://al-qadiri-website-musab17.vercel.app  
**Repository:** https://github.com/Musab-Mann/AL-QADIRI-WEBSITE

> The production deployment should be considered live only when the latest Vercel deployment reports **Ready**. If the link is temporarily unavailable, check the deployment dashboard.

## Project highlights

- **Restaurant-first design:** cinematic hero, editorial typography, food imagery and a consistent dark visual identity.
- **Menu discovery:** menu grouped by category, dish imagery, prices, search and category navigation.
- **WhatsApp ordering:** customers can build an order and continue it through WhatsApp.
- **Responsive experience:** dedicated mobile actions and layouts designed for smaller screens.
- **Restaurant information:** story, gallery, contact details and visit information.
- **Search and sharing metadata:** page titles, descriptions, canonical URLs, Open Graph metadata and restaurant/menu structured data.
- **Accessibility foundations:** skip-to-content link, semantic page structure and descriptive image text.
- **Centralised content:** restaurant details and public menu content live in dedicated data modules to make updates easier.

## Tech stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- CSS Modules and global CSS
- [Phosphor Icons](https://phosphoricons.com/)
- [GSAP](https://gsap.com/) for motion
- [Vercel](https://vercel.com/) for hosting

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home page and featured dishes |
| `/menu` | Full menu, category navigation, search and ordering |
| `/about` | Restaurant story |
| `/gallery` | Food and kitchen gallery |
| `/contact` | Contact and visit information |

## Run locally

### Requirements

- Node.js 22.x
- npm

### Setup

```bash
git clone https://github.com/Musab-Mann/AL-QADIRI-WEBSITE.git
cd AL-QADIRI-WEBSITE
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Validate and build

```bash
npm run validate
npm run typecheck
npm run lint
npm run build
```

If the type-check script runs `next typegen` before TypeScript, allow it to finish before reviewing any errors.

## Content and configuration

- Restaurant identity, contact details and site copy: `src/content/site.ts`
- Public menu catalogue and prices: `src/data/menu.ts`
- Gallery entries: `src/data/gallery.ts`
- SEO and restaurant structured data: `src/lib/schema.ts` and app route metadata
- Public menu data documentation: `docs/MENU_DATA.md` and `docs/MENU_VALIDATION.md`

Confirm menu prices, contact details, opening hours and location links with the restaurant before treating them as final. The Google Maps place URL is not configured in the current source.

## Deployment notes

The Vercel production mode is intentionally a **public website**:

- Menu content is read from the version-controlled public menu data.
- Orders are handed off to WhatsApp.
- The local SQLite-backed admin/dashboard is not part of the Vercel production experience; Vercel's filesystem is not a persistent writable database.
- Keep secrets, environment files, local databases, customer/order records and private uploads out of Git.

Connect the repository to Vercel and deploy the production branch. After each change, verify the deployment reaches **Ready**, then check the home, menu, gallery and contact pages on desktop and mobile.

## Project status

This repository is a work in progress. Before presenting it as a finished client case study, verify the latest production deployment, confirm the restaurant's final content and map link, and test all key routes and the WhatsApp order handoff.

## Author

**Musab Hafeez Mann**  
Computer Science student · Software & Web Development

- GitHub: [@Musab-Mann](https://github.com/Musab-Mann)
- LinkedIn: [Musab Mann](https://www.linkedin.com/in/musab-mann-572aa3315/)

---

Built to make browsing a restaurant menu simple, visual and convenient on any device.
