// Set NEXT_PUBLIC_SITE_URL on deploy; without it canonical URLs, Open Graph and the sitemap point at localhost.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
