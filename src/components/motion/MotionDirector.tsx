'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Page motion from one island, so sections stay server components.
 * GSAP loads after hydration on every device (client decision); reduce-motion devices get the
 * calmer `k` scale on angles and depth. Transform and opacity only.
 * This island lives in the root layout, so it re-runs on every route change: pins are undone
 * before Next swaps the tree, then everything is built again for the page that just arrived.
 *   [data-hero]              entrance; 3D scroll story on every screen size: pinned on wide screens,
 *                            scrubbed without a pin on phones and tablets (3D turn, push-in, steam swell)
 *   [data-scroll3d]          section rises in tilted back in perspective and settles flat (scrubbed)
 *   [data-hero-tilt]         scene tilts toward the pointer (mouse only)
 *   [data-magnetic]          buttons lean toward the pointer (mouse only)
 *   [data-tilt-card]         cards tilt in 3D toward the pointer (mouse only)
 *   [data-site-header]       hides while scrolling down, returns when scrolling up
 *   [data-motion="mask"]     photo fades up while its image settles from a slight zoom (once)
 *   [data-motion="lines"]    each [data-line] rises through its own mask (once)
 *   [data-motion="rise"]     children lift in, in order (once)
 *   [data-ticker]            infinite ticker, paused while off screen
 */
// Scroll storytelling is width based, so a touch screen never loses it. Pointer effects need a mouse.
const WIDE = '(min-width: 1024px)';
const POINTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const COMPACT = '(max-width: 1023px)';

export default function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('motion')) return;

    let cancelled = false;
    let revert: (() => void) | undefined;
    let reverted = false;
    const teardown = () => {
      reverted = true;
      revert?.();
      revert = undefined;
    };
    // A pin wraps its section in a spacer, so the current page is undone before Next swaps the tree.
    const onInternalNavigation = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!target || target.target === '_blank' || target.hasAttribute('download')) return;
      const url = new URL(target.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname) teardown();
    };
    document.addEventListener('click', onInternalNavigation, true);

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

      const mm = gsap.matchMedia();
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      // Reduce-motion devices still get the 3D story, at about two thirds of the angle and depth.
      const k = root.classList.contains('calm') ? 0.6 : 1;

      /* ------------------------------------------------------------ hero */
      if (hero) {
        const q = (selector: string) => hero.querySelector<HTMLElement>(selector);
        const image = hero.querySelector<HTMLImageElement>('[data-hero-media] img');
        const parallax = q('[data-hero-parallax]');
        const scrollTilt = q('[data-hero-scrolltilt]');
        const smoke = q('[data-hero-smoke]');
        const tilt = q('[data-hero-tilt]');
        const heroCopy = q('[data-hero-copy]');
        const vignette = q('[data-hero-vignette]');
        const titleLines = hero.querySelectorAll<HTMLElement>('h1 [data-line]');

        // Steam only appears once the photo has loaded, so it never floats over an empty frame.
        if (image) {
          const markLoaded = () => hero.setAttribute('data-loaded', '');
          if (image.complete && image.naturalWidth > 0) markLoaded();
          else image.addEventListener('load', markLoaded, { once: true });
        }

        // Pinned scroll story (wide screens). Created first so later triggers measure the pin spacing.
        mm.add(WIDE, () => {
          const story = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=80%',
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          if (parallax) story.to(parallax, { scale: 1.2, yPercent: -3, force3D: true }, 0);
          if (scrollTilt) story.to(scrollTilt, { rotationY: -14 * k, rotationX: 16 * k, z: 40 * k }, 0);
          if (smoke) story.to(smoke, { yPercent: -30, scale: 1.45, force3D: true }, 0);
          if (titleLines[0]) story.to(titleLines[0], { xPercent: -16 }, 0.08);
          if (titleLines[1]) story.to(titleLines[1], { xPercent: 16 }, 0.08);
          if (heroCopy) story.to(heroCopy, { yPercent: -10, autoAlpha: 0 }, 0.12);
          if (vignette) story.to(vignette, { autoAlpha: 1 }, 0.4);
        });

        // Pointer: the scene tilts toward the cursor (mouse only).
        mm.add(POINTER, () => {
          if (!tilt) return;
          const rotateY = gsap.quickTo(tilt, 'rotationY', { duration: 1, ease: 'power3.out' });
          const rotateX = gsap.quickTo(tilt, 'rotationX', { duration: 1, ease: 'power3.out' });
          const onMove = (event: PointerEvent) => {
            const box = hero.getBoundingClientRect();
            rotateY(((event.clientX - box.left) / box.width - 0.5) * 10);
            rotateX(-((event.clientY - box.top) / box.height - 0.5) * 6);
          };
          const onLeave = () => {
            rotateY(0);
            rotateX(0);
          };
          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', onLeave);
          return () => {
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
          };
        });

        // Phones and tablets: the same 3D turn, push-in and steam swell, scrubbed as the hero
        // scrolls away. No pin, so touch scrolling stays native and never fights the address bar.
        mm.add(COMPACT, () => {
          const story = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true },
          });
          if (parallax) story.to(parallax, { scale: 1.22, yPercent: 6, force3D: true }, 0);
          if (scrollTilt) story.to(scrollTilt, { rotationY: -16 * k, rotationX: 14 * k, z: 30 * k }, 0);
          if (smoke) story.to(smoke, { yPercent: -35, scale: 1.5, force3D: true }, 0);
          if (vignette) story.to(vignette, { autoAlpha: 1 }, 0.3);
        });
      }

      /* ------------------------------------------------- pointer effects */
      mm.add(POINTER, () => {
        const cleanups: Array<() => void> = [];

        document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
          const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
          const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
          const onMove = (event: PointerEvent) => {
            const box = el.getBoundingClientRect();
            x((event.clientX - (box.left + box.width / 2)) * 0.22);
            y((event.clientY - (box.top + box.height / 2)) * 0.32);
          };
          const onLeave = () => {
            x(0);
            y(0);
          };
          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
          });
        });

        document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((card) => {
          gsap.set(card, { transformPerspective: 1000 });
          const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' });
          const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' });
          const onMove = (event: PointerEvent) => {
            const box = card.getBoundingClientRect();
            rotateY(((event.clientX - box.left) / box.width - 0.5) * 8);
            rotateX(-((event.clientY - box.top) / box.height - 0.5) * 8);
          };
          const onLeave = () => {
            rotateX(0);
            rotateY(0);
          };
          card.addEventListener('pointermove', onMove);
          card.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerleave', onLeave);
          });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });

      /* ------------------------------------------------ everything else */
      const ctx = gsap.context(() => {
        if (hero) {
          const image = hero.querySelector<HTMLElement>('[data-hero-media] img');
          // The hero photo is the LCP element: it is never hidden, only settles from a slight zoom.
          const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
          if (image) intro.fromTo(image, { scale: 1.04 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0);
          intro.fromTo(hero.querySelectorAll('[data-line] > span'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.3);
          intro.fromTo(
            hero.querySelectorAll('[data-hero-fade]'),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
            0.7,
          );

          // Looping steam and sway only run while the hero is on screen.
          ScrollTrigger.create({
            trigger: hero,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => hero.toggleAttribute('data-active', self.isActive),
          });
        }

        // Header steps out of the way while reading down, returns on the way up.
        if (document.querySelector('[data-site-header]')) {
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              const hide = String(self.direction === 1 && self.scroll() > 320);
              if (root.dataset.headerHidden !== hide) root.dataset.headerHidden = hide;
            },
          });
        }

        gsap.utils.toArray<HTMLElement>('[data-motion="mask"]').forEach((el) => {
          const inner = el.querySelector<HTMLElement>('img');
          const reveal = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
          reveal.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0);
          if (inner) reveal.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0);
        });

        gsap.utils.toArray<HTMLElement>('[data-motion="lines"]').forEach((el) => {
          gsap.from(el.querySelectorAll('[data-line] > span'), {
            yPercent: 110,
            duration: 1.05,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-motion="rise"]').forEach((el) => {
          gsap.from(el.children, {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        // 3D scroll: a section rises in tilted back in perspective and settles flat as it reaches
        // the middle of the screen. Scrubbed, so it plays forwards and backwards with the scroll.
        gsap.utils.toArray<HTMLElement>('[data-scroll3d]').forEach((el) => {
          gsap.fromTo(
            el,
            { rotationX: 16 * k, y: 70 * k, z: -60 * k, transformPerspective: 1200, transformOrigin: '50% 100%' },
            {
              rotationX: 0,
              y: 0,
              z: 0,
              ease: 'none',
              force3D: true,
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-ticker]').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => el.toggleAttribute('data-offscreen', !self.isActive),
          });
        });
      });

      // Trigger positions are measured once; re-measure after layout, fonts and images settle.
      const refresh = () => ScrollTrigger.refresh();
      const frame = requestAnimationFrame(refresh);
      document.fonts?.ready.then(refresh);
      if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

      // A page that loaded or scrolled while in a background tab measured with the animation frame
      // asleep, so it re-measures and catches up the moment it is looked at again.
      const onVisible = () => {
        if (document.visibilityState === 'visible') refresh();
      };
      document.addEventListener('visibilitychange', onVisible);

      revert = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener('visibilitychange', onVisible);
        window.removeEventListener('load', refresh);
        delete root.dataset.headerHidden;
        ctx.revert();
        mm.revert();
      };

      // A navigation may have happened while GSAP was still loading.
      if (cancelled || reverted) teardown();
    })();

    return () => {
      cancelled = true;
      document.removeEventListener('click', onInternalNavigation, true);
      teardown();
    };
  }, [pathname]);

  return null;
}
