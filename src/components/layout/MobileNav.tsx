'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { List, Phone, WhatsappLogo, X } from '@phosphor-icons/react';
import { brand, contact, nav } from '@/content/site';
import { telHref, waHref } from '@/lib/links';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
        <span>Menu</span>
        <List aria-hidden="true" />
      </button>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label="Site navigation"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={`wrap ${styles.panel}`}>
          <div className={styles.top}>
            <span className={styles.brand}>{brand.shortName}</span>
            <button type="button" className={styles.close} onClick={close} aria-label="Close navigation">
              <X aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Main">
            <ul className={styles.links}>
              <li style={{ '--i': 0 } as React.CSSProperties}>
                <Link href="/" onClick={close}>
                  Home
                </Link>
              </li>
              {nav.map((item, index) => (
                <li key={item.href} style={{ '--i': index + 1 } as React.CSSProperties}>
                  <Link href={item.href} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contact}>
            <a className="btn btn-primary btn-block" href={waHref()} target="_blank" rel="noopener noreferrer">
              <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
            </a>
            {contact.whatsappPhones.map((phone) => (
              <a
                key={`wa-${phone.e164}`}
                className={styles.phone}
                href={waHref(undefined, phone)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo aria-hidden="true" /> <span className="muted">WhatsApp</span> {phone.display}
              </a>
            ))}
            {contact.phones.map((phone) => (
              <a key={`tel-${phone.e164}`} className={styles.phone} href={telHref(phone)}>
                <Phone aria-hidden="true" /> <span className="muted">Call</span> {phone.display}
              </a>
            ))}
            <p className="muted">{contact.addressShort}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
