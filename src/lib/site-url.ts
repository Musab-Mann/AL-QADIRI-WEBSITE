// Override with NEXT_PUBLIC_SITE_URL when a custom domain is configured.
// Keep production metadata off localhost when the variable is missing in Vercel.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://al-qadiri-website-musab17.vercel.app').replace(/\/$/, '');
