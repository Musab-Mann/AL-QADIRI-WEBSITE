import type { MetadataRoute } from 'next';
import { getPublicMenuItems } from '@/server/public-menu.ts';
import { siteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/menu', '/about', '/gallery', '/contact'].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : path === '/menu' ? 0.9 : 0.6,
  }));
  const dishes = getPublicMenuItems().map((item) => ({
    url: `${siteUrl}/menu/${item.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  return [...pages, ...dishes];
}
