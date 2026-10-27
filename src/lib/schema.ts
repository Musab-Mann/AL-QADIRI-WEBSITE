import { getPublicCategories, getPublicItemsByCategory } from '@/server/public-menu.ts';
import { brand, contact } from '@/content/site';
import { portionLabels } from '@/lib/price';
import { siteUrl } from '@/lib/site-url';

// Only facts the restaurant has supplied: no geo, hours, ratings or social profiles until provided.
export function restaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: brand.name,
    alternateName: brand.nameArabic,
    slogan: brand.tagline,
    servesCuisine: brand.cuisine,
    url: siteUrl,
    telephone: contact.phones.map((p) => p.e164),
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Big Bazaar',
      addressLocality: 'Sajja',
      addressRegion: 'Sharjah',
      addressCountry: 'AE',
    },
    hasMenu: `${siteUrl}/menu`,
  };
}

export function menuJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${brand.name} Menu`,
    url: `${siteUrl}/menu`,
    inLanguage: 'en',
    hasMenuSection: getPublicCategories().map((category) => ({
      '@type': 'MenuSection',
      name: category.label,
      hasMenuItem: getPublicItemsByCategory(category.id).map((item) => {
        const labels = portionLabels(item.prices);
        return {
          '@type': 'MenuItem',
          name: item.name,
          url: `${siteUrl}/menu/${item.slug}`,
          offers: item.prices.map((price, index) => ({
            '@type': 'Offer',
            price,
            priceCurrency: 'AED',
            ...(labels ? { name: labels[index] } : {}),
          })),
        };
      }),
    })),
  };
}
