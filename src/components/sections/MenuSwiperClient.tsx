'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import type { CategoryId, Prices } from '@/data/menu';
import AddToOrder from '@/components/order/AddToOrder';
import Price from '@/components/ui/Price';
import styles from './MenuSwiper.module.css';

export interface SwiperDish {
  slug: string;
  name: string;
  nameUr: string;
  category: CategoryId;
  categoryLabel: string;
  prices: Prices;
  image?: string;
  imageAlt?: string;
  available: boolean;
}

export interface SwiperTab {
  id: string;
  label: string;
  labelUr: string;
  items: SwiperDish[];
}

export default function MenuSwiperClient({ tabs }: { tabs: SwiperTab[] }) {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const tab = tabs[active];

  // Coverflow: every card turns in 3D by its distance from the centre of the strip.
  // Card centres are measured once (layout never moves on scroll), so each frame only reads scrollLeft.
  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!stage || !viewport || !track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    let centres: number[] = [];
    let frame = 0;

    const measure = () => {
      centres = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
    };
    const paint = () => {
      frame = 0;
      const mid = viewport.scrollLeft + viewport.clientWidth / 2;
      const span = viewport.clientWidth / 2 || 1;
      cards.forEach((card, index) => {
        const offset = Math.max(-1.5, Math.min(1.5, (centres[index] - mid) / span));
        card.style.setProperty('--o', offset.toFixed(3));
        card.style.setProperty('--a', Math.abs(offset).toFixed(3));
      });
      const max = viewport.scrollWidth - viewport.clientWidth;
      stage.style.setProperty('--progress', (max > 0 ? viewport.scrollLeft / max : 0).toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    viewport.scrollLeft = 0;
    measure();
    paint();
    viewport.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(viewport);

    return () => {
      viewport.removeEventListener('scroll', schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [active]);

  // Mouse drag to swipe (touch and trackpads already swipe natively).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = viewport.scrollLeft;
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        viewport.dataset.dragging = '';
      }
      if (moved) viewport.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      delete viewport.dataset.dragging;
    };
    // A drag must not also count as a click on the card it started on.
    const click = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    viewport.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    viewport.addEventListener('click', click, true);
    return () => {
      viewport.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      viewport.removeEventListener('click', click, true);
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!viewport || !track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    viewport.scrollBy({ left: direction * (first.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className={styles.shell}>
      <div className={`wrap ${styles.controls}`}>
        <div role="tablist" aria-label="Menu categories" className={styles.tabs}>
          {tabs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${id}-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              className={styles.tab}
              onClick={() => setActive(index)}
            >
              <span>{item.label}</span>
              {item.labelUr && (
                <span lang="ur" dir="rtl" className={styles.tabUr}>
                  {item.labelUr}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} aria-label="Previous dishes" onClick={() => step(-1)}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" className={styles.arrow} aria-label="Next dishes" onClick={() => step(1)}>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div
          ref={viewportRef}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab.id}`}
          tabIndex={0}
          className={styles.viewport}
        >
          <ul key={tab.id} ref={trackRef} className={styles.track}>
            {tab.items.map((dish, index) => (
              <li key={dish.slug} className={styles.card} style={{ '--i': index } as React.CSSProperties}>
                <article className={styles.cardInner}>
                  <Link href={`/menu/${dish.slug}`} className={styles.media} draggable={false} tabIndex={-1} aria-hidden="true">
                    {dish.image && (
                      <Image
                        src={dish.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22rem, 72vw"
                        draggable={false}
                      />
                    )}
                  </Link>
                  <div className={styles.body}>
                    <span className={styles.cat}>{dish.categoryLabel}</span>
                    <h3 className={styles.name}>
                      <Link href={`/menu/${dish.slug}`} draggable={false}>
                        {dish.name}
                      </Link>
                    </h3>
                    {dish.nameUr && (
                      <span lang="ur" dir="rtl" className={styles.urdu}>
                        {dish.nameUr}
                      </span>
                    )}
                    <div className={styles.buy}>
                      <Price prices={dish.prices} size="feature" />
                      <AddToOrder item={dish} variant="compact" available={dish.available} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
        <div className={`wrap ${styles.progress}`} aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
