import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react/ssr';
import { copy } from '@/content/site';
import { waHref } from '@/lib/links';
import styles from './Hero.module.css';

// Steam in three depth planes in front of the photo; each plane sits at its own translateZ,
// so the planes separate as the scene rotates.
const layers = [
  {
    name: 'layerBack',
    wisps: [
      { sprite: 1, x: '14%', w: '42%', dur: '9s', delay: '0s', drift: '-14%', rot: '-8deg', o: 0.5 },
      { sprite: 3, x: '50%', w: '38%', dur: '10.5s', delay: '3.4s', drift: '10%', rot: '6deg', o: 0.45 },
    ],
  },
  {
    name: 'layerMid',
    wisps: [
      { sprite: 2, x: '28%', w: '52%', dur: '7.4s', delay: '1.2s', drift: '12%', rot: '10deg', o: 0.62 },
      { sprite: 1, x: '2%', w: '48%', dur: '8.2s', delay: '4.8s', drift: '-10%', rot: '-6deg', o: 0.55 },
    ],
  },
  {
    name: 'layerFront',
    wisps: [
      { sprite: 3, x: '20%', w: '64%', dur: '6.2s', delay: '2.3s', drift: '-18%', rot: '-12deg', o: 0.5 },
      { sprite: 2, x: '42%', w: '58%', dur: '6.8s', delay: '5.4s', drift: '16%', rot: '9deg', o: 0.44 },
    ],
  },
] as const;

export default function Hero() {
  return (
    <section className={styles.hero} data-hero data-active aria-labelledby="hero-title">
      <div className={styles.media} data-hero-media>
        <div className={styles.stage}>
          <div className={styles.space} data-hero-scrolltilt>
            <div className={`${styles.space} ${styles.orbit}`}>
              <div className={styles.space} data-hero-tilt>
                <div className={styles.parallax} data-hero-parallax>
                  <Image
                    src="/images/hero/mutton-fresh-karahi-hero-v4.webp"
                    alt="Steaming Mutton Fresh Karahi with green chilli, ginger and coriander, naan behind it"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className={styles.image}
                  />
                </div>

                <div
                  className={styles.smoke}
                  data-hero-smoke
                  aria-hidden="true"
                  style={{ '--smoke-x': '46%', '--smoke-y': '4%' } as React.CSSProperties}
                >
                  {layers.map((layer) => (
                    <div key={layer.name} className={`${styles.layer} ${styles[layer.name]}`}>
                      {layer.wisps.map((w, i) => (
                        <span
                          key={i}
                          className={styles.wisp}
                          style={
                            {
                              '--x': w.x,
                              '--w': w.w,
                              '--dur': w.dur,
                              '--delay': w.delay,
                              '--drift': w.drift,
                              '--rot': w.rot,
                              '--o': w.o,
                              backgroundImage: `url(/images/hero/smoke-${w.sprite}.webp)`,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.vignette} data-hero-vignette aria-hidden="true" />
      </div>

      <div className={`wrap ${styles.content}`}>
        <div className={styles.copy} data-hero-copy>
          <p className={`label ${styles.eyebrow}`} data-hero-fade>
            {copy.hero.eyebrow}
          </p>
          <h1 id="hero-title" className={styles.title}>
            {copy.hero.titleLines.map((line) => (
              <span key={line} data-line>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p className={styles.body} data-hero-fade>
            {copy.hero.body}
          </p>
          <div className={styles.actions} data-hero-fade>
            <a className="btn btn-primary" href={waHref()} target="_blank" rel="noopener noreferrer" data-magnetic>
              <WhatsappLogo aria-hidden="true" weight="fill" /> Order now
            </a>
            <Link className="btn btn-ghost" href="/menu" data-magnetic>
              View menu <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
