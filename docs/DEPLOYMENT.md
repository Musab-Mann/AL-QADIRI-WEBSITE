# Deployment

The project runs in two modes from the same code.

## 1. On the restaurant's computer: full site with the dashboard

`Open Al Qadri Website.cmd` or `Open Al Qadri Admin.cmd` on the Desktop. They build once, then run
`npm run start`, which is the production Node server (much smoother than `npm run dev`).

- Website: http://localhost:3000
- Dashboard: http://localhost:3000/admin
- Database: `data/al-qadri.db` (SQLite through `node:sqlite`). Orders, menu edits, availability,
  prices, admin login and WhatsApp settings all live here.
- After any code change, run `Rebuild Al Qadri Website.cmd` so the fast version picks it up.

## 2. Published on Vercel: the public site only

Vercel gives every request a fresh, read-only container, so a SQLite file cannot survive there.
The published site therefore runs without a database:

- The menu comes straight from `src/data/menu.ts` (the audited printed menu, all 58 dishes with
  their photos).
- Checkout collects the same details and hands the finished order to WhatsApp
  (+971 50 258 2786) instead of saving it. Nothing is lost: the order arrives as a message.
- `/admin` and `/api/admin/*` return 404 there. The dashboard is not merely locked, it is absent.

The switch is automatic: Vercel sets `VERCEL=1`, which `next.config.ts` and
`src/server/public-menu.ts` read. To reproduce the published behaviour locally, build and start
with `STATIC_MENU=1` set.

### Deploying

```
npm run login     # once, opens the browser for Vercel sign in
npm run deploy    # builds on Vercel and publishes to the production URL
```

`.vercelignore` keeps the database, the raw image downloads and the Windows launchers off the
deployment.

## 3. Later: the dashboard on Vercel too

That needs a hosted database, because of the read-only disk. The work is contained:

1. Create a database in the Vercel dashboard (Neon Postgres) or at turso.tech (cloud SQLite).
2. Replace `src/server/db.ts` with that driver. Every other server file talks to `db.prepare(...)`
   and `db.exec(...)` only, so the call sites stay as they are; with Postgres the SQL needs the
   usual porting (`AUTOINCREMENT`, `?` placeholders).
3. Delete the `STATIC_MENU` branch in `src/server/public-menu.ts` and the `publicSiteOnly` flag in
   `next.config.ts`, so admin, orders and the live menu come back on.
4. Dish photos uploaded from the dashboard need somewhere to live as well: either Vercel Blob or a
   column in the database, since the deployed filesystem cannot be written to.
