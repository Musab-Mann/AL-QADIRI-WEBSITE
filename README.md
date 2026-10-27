# Al Qadri Restaurant — Website

A responsive restaurant website for **Al Qadri Restaurant in Sajja, Sharjah, UAE**, built to make menu discovery, restaurant information, and WhatsApp ordering easy on desktop and mobile.

<div align="center">

**[Live Website](https://al-qadiri-website-musab17.vercel.app)** · **[Source Code](https://github.com/Musab-Mann/AL-QADIRI-WEBSITE)** · **[Report a Bug](https://github.com/Musab-Mann/AL-QADIRI-WEBSITE/issues/new?template=bug_report.md)**

</div>

---

## Overview

This project brings a restaurant's menu and essential information into a single mobile-friendly experience. Customers can browse dishes, explore categories, review menu details, and continue an order through WhatsApp.

## Highlights

- **Responsive experience:** layouts and actions designed for desktop and mobile.
- **Menu discovery:** category navigation, search, dish imagery, and pricing from a centralized data module.
- **WhatsApp order handoff:** customers can prepare an order and continue it in WhatsApp.
- **Restaurant pages:** home, menu, about, gallery, and contact.
- **Motion and visual design:** interactive presentation supported by GSAP.
- **SEO foundations:** page metadata, canonical URLs, sitemap, robots rules, and structured data.
- **Maintainable content:** restaurant copy, contact details, menu data, and gallery entries are separated from page components.
- **Quality tooling:** menu validation, TypeScript checks, ESLint, and production builds.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | CSS Modules and global CSS |
| Motion | GSAP |
| Icons | Phosphor Icons |
| Image processing | Sharp |
| Hosting | Vercel |

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Restaurant introduction and featured dishes |
| `/menu` | Browse the menu, search and build an order |
| `/about` | Restaurant story |
| `/gallery` | Food and restaurant imagery |
| `/contact` | Contact and visit information |

## Run Locally

### Requirements

- Node.js 22.x
- npm

### Install and start

```bash
git clone https://github.com/Musab-Mann/AL-QADIRI-WEBSITE.git
cd AL-QADIRI-WEBSITE
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

Run these before submitting a change:

```bash
npm run validate
npm run typecheck
npm run lint
npm run build
```

- `validate` checks the public menu data.
- `typecheck` generates Next.js types and runs TypeScript.
- `lint` runs ESLint.
- `build` creates the production application and runs menu validation before building.

## Project Structure

```text
src/
  app/          Next.js routes and page metadata
  content/      Restaurant identity, contact details, and copy
  data/         Public menu and gallery data
  lib/          Shared helpers, metadata, and schema
  components/   Reusable interface components
scripts/        Menu validation and image optimization
public/         Public website assets
```

## Content Maintenance

- Restaurant details and site copy: `src/content/site.ts`
- Menu catalogue and prices: `src/data/menu.ts`
- Gallery entries: `src/data/gallery.ts`
- SEO and structured data: `src/lib/schema.ts` and app metadata
- Menu documentation: `docs/MENU_DATA.md` and `docs/MENU_VALIDATION.md`

Restaurant prices, phone details, delivery terms, opening hours, and location links should be confirmed with the restaurant before being treated as final. The Google Maps place link is currently not configured in source.

## Deployment Notes

The Vercel deployment is intended to serve the **public website**:

- Menu content is read from the version-controlled public data.
- Orders are handed off to WhatsApp.
- The local SQLite-backed admin workflow is not a persistent Vercel database and is not part of the public production flow.
- Keep secrets, environment files, local databases, private uploads, and customer/order records out of Git.

After changes, verify the deployment is ready and test the home, menu, gallery, contact, and WhatsApp order flow on both desktop and mobile.

## Security

Please do not publish credentials, personal customer data, or order records in issues. See [GitHub's private vulnerability reporting options](https://docs.github.com/en/code-security/security-advisories) for security concerns.

## Author

**Musab Hafeez Mann** · [GitHub](https://github.com/Musab-Mann) · [LinkedIn](https://www.linkedin.com/in/musab-mann-572aa3315/)

---

*Built to make restaurant menu browsing visual, straightforward, and convenient.*
