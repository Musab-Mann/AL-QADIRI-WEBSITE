import { EnvelopeSimple, MapPin, Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { contact, copy } from '@/content/site';
import { directionsHref, mailHref, telHref, waHref } from '@/lib/links';
import styles from './VisitUs.module.css';

export default function VisitUs() {
  return (
    <section className={styles.band} aria-labelledby="visit-title" data-scroll3d>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.lead}>
          <p className="label">{contact.delivery}</p>
          <h2 id="visit-title" className={styles.title}>
            {copy.visit.title}
          </h2>
          <address className={styles.address}>{contact.address}</address>
        </div>

        <ul className={styles.list}>
          {contact.whatsappPhones.map((phone) => (
            <li key={`wa-${phone.e164}`}>
              <a href={waHref(undefined, phone)} target="_blank" rel="noopener noreferrer" className={styles.item}>
                <WhatsappLogo aria-hidden="true" />
                <span className={styles.kind}>WhatsApp</span>
                <span className={styles.value}>{phone.display}</span>
              </a>
            </li>
          ))}
          {contact.phones.map((phone) => (
            <li key={phone.e164}>
              <a href={telHref(phone)} className={styles.item}>
                <Phone aria-hidden="true" />
                <span className={styles.kind}>Call</span>
                <span className={styles.value}>{phone.display}</span>
              </a>
            </li>
          ))}
          <li>
            <a href={mailHref()} className={styles.item}>
              <EnvelopeSimple aria-hidden="true" />
              <span className={styles.kind}>Email</span>
              <span className={styles.value}>{contact.email}</span>
            </a>
          </li>
          <li>
            <a href={directionsHref()} target="_blank" rel="noopener noreferrer" className={styles.item}>
              <MapPin aria-hidden="true" />
              <span className={styles.kind}>Get directions</span>
              <span className={styles.value}>{contact.addressShort}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
