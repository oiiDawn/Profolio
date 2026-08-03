import Link from "next/link";

import styles from "./topbar.module.css";

export function Topbar() {
  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        aria-label="Primary navigation"
      >
        <div className={styles.links}>
          <Link className={styles.navLink} href="/#about">
            ABOUT
          </Link>
          <Link className={styles.navLink} href="/#work">
            WORK
          </Link>
        </div>
        <Link
          href="/#home"
          className={styles.brand}
          aria-label="Home"
        >
          OII
          <span aria-hidden />
        </Link>
        <div className={`${styles.links} ${styles.linksEnd}`}>
          <Link className={styles.navLink} href="/#contact">
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  );
}
