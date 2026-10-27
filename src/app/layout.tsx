import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Geist, Noto_Nastaliq_Urdu, Noto_Naskh_Arabic } from 'next/font/google';
import Script from 'next/script';
import { brand } from '@/content/site';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: '500',
  variable: '--font-naskh',
  display: 'swap',
  preload: false,
});

// Urdu is set in nastaliq, the script the printed menu uses.
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-nastaliq',
  display: 'swap',
  preload: false,
});

const description =
  'Al Qadri Restaurant serves Pakistani food near Big Bazaar in Sajja, Sharjah: karahi, handi, BBQ, biryani and breakfast. See the full menu with prices and order on WhatsApp. Free home delivery.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Al Qadri Restaurant | Pakistani Food near Big Bazaar, Sajja, Sharjah',
    template: '%s | Al Qadri Restaurant',
  },
  description,
  applicationName: brand.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: '/',
    siteName: brand.name,
    title: 'Al Qadri Restaurant, Sajja, Sharjah',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Qadri Restaurant, Sajja, Sharjah',
    description,
  },
};

export const viewport: Viewport = {
  themeColor: '#15110e',
  colorScheme: 'dark',
};

// Runs before paint so hero from-states apply without a flash. Client decision 2026-09-19: the 3D
// scroll story plays on every device, including ones set to reduce motion (common on low-power
// laptops and phones in battery saver); those get a calmer version via the `calm` class.
const motionFlag = `document.documentElement.classList.add('motion');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('calm')}`;

// This root layout only sets up html/body, fonts and the skip link. The public restaurant
// chrome (Header, Footer, mobile action bar, order tray, motion director) now lives in
// src/app/(site)/layout.tsx so the /admin dashboard renders its own separate shell instead of
// the customer site's header, footer and order tray.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geist.variable} ${naskh.variable} ${nastaliq.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="motion-flag" strategy="beforeInteractive">
          {motionFlag}
        </Script>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
