'use client';

import { useEffect, useRef } from 'react';

// A marker at the top of the page; once it scrolls out, the header turns solid.
export default function HeaderSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.scrolled = String(!entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 48 }} />;
}
