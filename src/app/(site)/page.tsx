import Hero from '@/components/sections/Hero';
import MenuSwiper from '@/components/sections/MenuSwiper';
import StoryTeaser from '@/components/sections/StoryTeaser';
import VisitUs from '@/components/sections/VisitUs';
import JsonLd from '@/components/ui/JsonLd';
import { restaurantJsonLd } from '@/lib/schema';

// Rendered per request so availability, prices and photos edited in the admin dashboard show at once.
export const revalidate = 0;

// Home: the 3D hero, then the whole menu in one swipeable strip, then the story and the visit band.
// Dish photos live in one place (the strip) instead of being scattered across separate sections.
export default function HomePage() {
  return (
    <>
      <JsonLd data={restaurantJsonLd()} />
      <Hero />
      <MenuSwiper />
      <StoryTeaser />
      <VisitUs />
    </>
  );
}
