'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './CategoryNav.module.css';

interface NavItem {
  id: string;
  label: string;
  count: number;
}

export default function CategoryNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // Scrollspy: the category crossing the upper-middle of the viewport is active.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting && !e.target.hasAttribute('hidden'));
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Slide the copper marker to the active link and keep it in view on the mobile chip row.
  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !indicator || !link) return;
    indicator.style.setProperty('--x', `${link.offsetLeft}px`);
    indicator.style.setProperty('--y', `${link.offsetTop}px`);
    indicator.style.setProperty('--w', `${link.offsetWidth}px`);
    indicator.style.setProperty('--h', `${link.offsetHeight}px`);
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' });
    }
  }, [active]);

  return (
    <nav className={styles.nav} aria-label="Menu categories">
      <ul ref={listRef} className={styles.list}>
        <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.link}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={() => setActive(item.id)}
            >
              <span>{item.label}</span>
              <span className={styles.count}>{item.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
