import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import MobileActionBar from '@/components/layout/MobileActionBar';
import MotionDirector from '@/components/motion/MotionDirector';
import OrderTray from '@/components/order/OrderTray';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
      <OrderTray />
      <MotionDirector />
    </>
  );
}
