import { Phone, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { copy, contact } from '@/content/site';
import { telHref, waHref } from '@/lib/links';
import styles from './ClosingOrder.module.css';

export default function ClosingOrder() {
  return (
    <section className={`section ${styles.closing}`} aria-labelledby="closing-title">
      <div className="wrap">
        <h2 id="closing-title" className={styles.title} data-motion="lines">
          <span data-line>
            <span>{copy.closing.title}</span>
          </span>
        </h2>
        <div className={styles.actions}>
          <a className="btn btn-primary" href={waHref()} target="_blank" rel="noopener noreferrer">
            <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
          </a>
          {contact.phones.map((phone) => (
            <a key={phone.e164} className="text-link" href={telHref(phone)}>
              <Phone aria-hidden="true" /> Call {phone.display}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
