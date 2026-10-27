// Food and ingredient photography only. `src` is added once each approved image is optimized into /public.
export interface GalleryShot {
  id: string;
  subject: string;
  alt: string;
  ratio: '3 / 2' | '4 / 5' | '1 / 1';
  src?: string;
}

export const gallery: readonly GalleryShot[] = [
  {
    id: 'chicken-fresh-karahi',
    subject: 'Chicken Fresh Karahi',
    alt: 'Steaming Chicken Fresh Karahi in a steel karahi',
    ratio: '4 / 5',
    src: '/menu/chicken-fresh-karahi-v3.webp',
  },
  {
    id: 'spices-detail',
    subject: 'Whole spices',
    alt: 'Whole spices on dark stone',
    ratio: '3 / 2',
    src: '/menu/gallery-spices.webp',
  },
  {
    id: 'roti-stack',
    subject: 'Fresh roti',
    alt: 'A stack of fresh tandoori roti in a cloth lined basket',
    ratio: '4 / 5',
    src: '/menu/roti-v2.webp',
  },
  {
    id: 'mix-grill',
    subject: 'Mix Grill',
    alt: 'Mix Grill platter with kababs and tikka',
    ratio: '3 / 2',
    src: '/menu/gallery-mix-grill.webp',
  },
  { id: 'fresh-chai', subject: 'Fresh Chai', alt: 'Fresh chai in a steel cup', ratio: '1 / 1', src: '/menu/fresh-chai.webp' },
  { id: 'chicken-biryani', subject: 'Chicken Biryani', alt: 'Chicken Biryani on a plate', ratio: '4 / 5', src: '/menu/chicken-biryani-v2.webp' },
  {
    id: 'jalebi-close',
    subject: 'Jalebi',
    alt: 'Close view of fresh jalebi',
    ratio: '3 / 2',
    src: '/menu/gallery-jalebi.webp',
  },
  { id: 'samosa-raita', subject: 'Samosa + Raita', alt: 'Samosa with a bowl of raita', ratio: '1 / 1', src: '/menu/samosa-raita.webp' },
  {
    id: 'fresh-lassi',
    subject: 'Fresh Lassi',
    alt: 'A glass of fresh lassi',
    ratio: '4 / 5',
    src: '/menu/gallery-lassi.webp',
  },
];
