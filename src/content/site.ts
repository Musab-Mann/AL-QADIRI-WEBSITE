export const brand = {
  name: 'Al Qadri Restaurant',
  shortName: 'Al Qadri',
  nameArabic: 'مطعم القادري',
  tagline: 'The Best Taste',
  cuisine: 'Pakistani',
} as const;

export interface Phone {
  display: string;
  e164: string;
}

export const contact = {
  address: 'AL QADRI RESTAURANT NEAR BIG BAZAAR SAJJA SHARJAH',
  addressShort: 'Near Big Bazaar, Sajja, Sharjah',
  // Client decision 2026-09-19: one number only, for calls and WhatsApp.
  whatsappPhone: { display: '+971 50 258 2786', e164: '+971502582786' } satisfies Phone,
  whatsappPhones: [{ display: '+971 50 258 2786', e164: '+971502582786' }] satisfies Phone[],
  phones: [{ display: '+971 50 258 2786', e164: '+971502582786' }] satisfies Phone[],
  email: 'alqadrirestaurant@gmail.com',
  // Owner to supply the Google Maps place link from the printed location QR code.
  mapsUrl: null as string | null,
  delivery: 'Free Home Delivery',
} as const;

export const messages = {
  general: 'Assalam o Alaikum, I would like to place an order with Al Qadri Restaurant.',
  dish: (line: string) => `Assalam o Alaikum, I would like to order: ${line}`,
  list: (lines: string[]) =>
    ['Assalam o Alaikum, I would like to place this order with Al Qadri Restaurant:', '', ...lines].join('\n'),
} as const;

export function isPlaceholder(text: string): boolean {
  return text.startsWith('[PLACEHOLDER');
}

export const nav = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
] as const;

export const copy = {
  hero: {
    eyebrow: 'Pakistani cuisine in Sajja, Sharjah',
    titleLines: ['The taste', 'of home.'],
    body: 'Karahi, handi, BBQ and breakfast favourites near Big Bazaar. Free home delivery.',
  },
  dishes: { title: 'Signature dishes' },
  swiper: { title: 'Swipe the menu', hint: 'Swipe or drag to browse. Tap Add to build your order.' },
  menuIndex: { titleStart: 'From', titleMiddle: 'chai to', titleEnd: 'karahi.' },
  story: {
    title: 'Authentic food. Warm hospitality.',
    body: 'Al Qadri Restaurant brings the comforting flavours of Pakistani home cooking to Sajja, Sharjah. From fresh breakfast parathas and chai to karahi, handi, BBQ and biryani, every dish is prepared for generous sharing, warm hospitality and easy home delivery near Big Bazaar.',
  },
  gallery: { title: 'From our kitchen' },
  visit: { title: 'Visit Al Qadri' },
  closing: { title: 'Hungry? Order now.' },
  menu: { legend: 'Half / Full shows the two portion prices.' },
} as const;
