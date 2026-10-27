import Link from 'next/link';
import { ArrowUp, ArrowUpRight, EnvelopeSimple, MapPin, Moped, Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { getPublicMenuItems } from '@/server/public-menu.ts';
import { brand, contact, nav } from '@/content/site';
import { directionsHref, mailHref, telHref, waHref } from '@/lib/links';
import styles from './Footer.module.css';

export default function Footer() {
  // One entry per dish name (Daal and Sabzi appear twice on the menu; the first listing is linked).
  const menuItems = getPublicMenuItems();
  const tickerDishes = menuItems.filter((item, index) => menuItems.findIndex((other) => other.name === item.name) === index);
  return (
    <footer className={styles.footer}>
      {/* slow ticker of every dish on the menu */}
      <nav className={styles.ticker} aria-label="Dishes on the menu" data-ticker>
        <div className={styles.track}>
          {[0, 1].map((copyIndex) => (
            <ul key={copyIndex} className={styles.run} aria-hidden={copyIndex === 1 || undefined}>
              {tickerDishes.map((dish) => (
                <li key={`${copyIndex}-${dish.slug}`}>
                  <Link href={`/menu/${dish.slug}`} className={styles.dish} tabIndex={copyIndex === 1 ? -1 : undefined}>
                    {dish.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </nav>

      {/* order panel */}
      <section className={`wrap ${styles.order}`} aria-labelledby="footer-order-title">
        <div className={styles.orderText}>
          <p className={styles.badge}>
            <Moped aria-hidden="true" /> {contact.delivery}
          </p>
          <h2 id="footer-order-title" className={styles.orderTitle}>
            Hungry? <em>Order now.</em>
          </h2>
          <div className={styles.orderActions}>
            <a className="btn btn-primary" href={waHref()} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
            </a>
            {contact.phones.map((phone) => (
              <a key={phone.e164} className="btn btn-ghost" href={telHref(phone)}>
                <Phone aria-hidden="true" /> {phone.display}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <Moped aria-hidden="true" className={styles.cardIcon} />
            <p className={styles.cardTitle}>{contact.delivery}</p>
            <p className="muted">Send your order on WhatsApp and we will confirm it with you.</p>
          </div>
          <ul className={styles.cardList}>
            {contact.whatsappPhones.map((phone) => (
              <li key={`card-${phone.e164}`}>
                <a href={waHref(undefined, phone)} target="_blank" rel="noopener noreferrer" className={styles.cardRow}>
                  <WhatsappLogo aria-hidden="true" weight="fill" />
                  <span>{phone.display}</span>
                  <ArrowUpRight aria-hidden="true" className={styles.cardArrow} />
                </a>
              </li>
            ))}
            <li>
              <a href={directionsHref()} target="_blank" rel="noopener noreferrer" className={styles.cardRow}>
                <MapPin aria-hidden="true" />
                <span>Get directions</span>
                <ArrowUpRight aria-hidden="true" className={styles.cardArrow} />
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* details */}
      <div className={`wrap ${styles.grid}`}>
        <div>
          <h3 className="label">Visit</h3>
          <address className={styles.address}>
            <a href={directionsHref()} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <MapPin aria-hidden="true" />
              <span>{contact.address}</span>
            </a>
          </address>
        </div>

        <div>
          <h3 className="label">WhatsApp</h3>
          <ul className={styles.links}>
            {contact.whatsappPhones.map((phone) => (
              <li key={`wa-${phone.e164}`}>
                <a href={waHref(undefined, phone)} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                  <WhatsappLogo aria-hidden="true" />
                  <span>{phone.display}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={mailHref()} className={styles.iconLink}>
                <EnvelopeSimple aria-hidden="true" />
                <span>{contact.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h3 className="label">Explore</h3>
          <ul className={`${styles.links} ${styles.navLinks}`}>
            <li>
              <Link href="/">Home</Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.top}>
          <a href="#main" className={styles.topLink}>
            <ArrowUp aria-hidden="true" />
            <span>Back to top</span>
          </a>
        </div>
      </div>

      {/* signature */}
      <div className={`wrap ${styles.signature}`} aria-hidden="true">
        <span className={styles.bigName}>Al Qadri</span>
        <span className={styles.bigArabic} lang="ar" dir="rtl">
          {brand.nameArabic}
        </span>
      </div>

      <div className={`wrap ${styles.base}`}>
        <p>
          © {new Date().getFullYear()} {brand.name}. {brand.tagline}.
        </p>
        <p>Sajja, Sharjah, United Arab Emirates</p>
      </div>
    </footer>
  );
}
