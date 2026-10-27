'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  ForkKnife,
  Gauge,
  Gear,
  List,
  Receipt,
  SignOut,
  SquaresFour,
  UserCircle,
} from '@phosphor-icons/react';
import styles from '../../app/admin/admin.module.css';

const NAV: { href: string; label: string; icon: typeof Gauge; exact?: boolean }[] = [
  { href: '/admin', label: 'Dashboard', icon: Gauge, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: Receipt },
  { href: '/admin/menu', label: 'Menu', icon: ForkKnife },
  { href: '/admin/categories', label: 'Categories', icon: SquaresFour },
  { href: '/admin/settings', label: 'Settings', icon: Gear },
  { href: '/admin/account', label: 'Admin Account', icon: UserCircle },
];

export default function AdminShell({ username, children }: { username: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setNavOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={navOpen}
        >
          <List aria-hidden="true" />
        </button>
        <span className={styles.topbarBrand}>Al Qadri Admin</span>
      </header>

      {navOpen && (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close admin menu"
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside className={styles.sidebar} data-open={navOpen || undefined}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Al Qadri</span>
          <span className={styles.brandTag}>Admin</span>
        </div>
        <nav className={styles.nav} aria-label="Admin">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={styles.navLink}
                data-active={active || undefined}
                onClick={() => setNavOpen(false)}
              >
                <Icon aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFoot}>
          <p className={styles.userRow}>
            Signed in as <strong>{username}</strong>
          </p>
          <button type="button" className="btn btn-ghost btn-block" onClick={logout}>
            <SignOut aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
