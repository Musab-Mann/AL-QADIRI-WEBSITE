import { MapPin, Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { contact } from '@/content/site';
import { directionsHref, telHref, waHref } from '@/lib/links';
import styles from './MobileActionBar.module.css';

export default function MobileActionBar() {
  return (
    <nav className={styles.bar} aria-label="Quick actions">
      <a className={`${styles.action} ${styles.primary}`} href={waHref()} target="_blank" rel="noopener noreferrer">
        <WhatsappLogo aria-hidden="true" />
        Order now
      </a>
      <a className={styles.action} href={telHref(contact.phones[0])}>
        <Phone aria-hidden="true" />
        Call
      </a>
      <a className={styles.action} href={directionsHref()} target="_blank" rel="noopener noreferrer">
        <MapPin aria-hidden="true" />
        Directions
      </a>
    </nav>
  );
}
