import Link from 'next/link';
import styles from './page-intro.module.css';

export default function NotFound() {
  return (
    <section className={styles.intro} aria-labelledby="not-found-title">
      <div className="wrap">
        <h1 id="not-found-title" className={styles.title}>
          Page not found
        </h1>
        <p className={styles.tagline}>This page does not exist, but the menu does.</p>
        <div className={styles.actions} style={{ marginTop: '2rem' }}>
          <Link className="btn btn-primary" href="/menu">
            View menu
          </Link>
          <Link className="btn btn-ghost" href="/">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
