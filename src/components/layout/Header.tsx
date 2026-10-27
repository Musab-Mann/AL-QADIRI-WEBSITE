import Link from 'next/link';
import { Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { brand, contact, nav } from '@/content/site';
import { telHref, waHref } from '@/lib/links';
import HeaderSentinel from './HeaderSentinel';
import MobileNav from './MobileNav';
import styles from './Header.module.css';

export default function Header() {
  return (
    <>
      <HeaderSentinel />
      <header className={styles.header} data-site-header>
        <div className={`wrap ${styles.bar}`}>
          <Link href="/" className={styles.wordmark} aria-label={`${brand.name}, home`}>
            <span className={styles.latin}>Al Qadri</span>
            <span className={styles.arabic} lang="ar" dir="rtl">
              {brand.nameArabic}
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.end}>
            <a className={styles.call} href={telHref(contact.phones[0])} aria-label={`Call ${contact.phones[0].display}`}>
              <Phone aria-hidden="true" />
              <span className={styles.callNumber}>{contact.phones[0].display}</span>
            </a>
            <a className={`btn btn-primary ${styles.order}`} href={waHref()} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
            </a>
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
