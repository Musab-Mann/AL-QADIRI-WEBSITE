import type { NextConfig } from 'next';

// Two ways to run this project:
//  - On the restaurant's own computer (npm run build + npm run start): SQLite database, admin
//    dashboard, saved orders.
//  - Published to Vercel: public site only. There is no writable disk there, so the menu is read
//    from src/data/menu.ts and orders are handed to WhatsApp. VERCEL is set by Vercel itself;
//    STATIC_MENU=1 reproduces that mode locally for testing.
const publicSiteOnly = Boolean(process.env.VERCEL) || process.env.STATIC_MENU === '1';

const nextConfig: NextConfig = {
  // A stray package-lock.json higher up otherwise makes Turbopack pick the wrong workspace root.
  turbopack: {
    root: __dirname,
  },
  images: {
    // WebP only: AVIF encoding is very CPU-heavy and made the dev machine stutter; sources are already WebP.
    formats: ['image/webp'],
  },
  env: {
    NEXT_PUBLIC_ORDER_MODE: publicSiteOnly ? 'whatsapp' : 'server',
    NEXT_PUBLIC_ADMIN_ENABLED: publicSiteOnly ? '0' : '1',
  },
};

export default nextConfig;
