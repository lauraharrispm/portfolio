"use client";

import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#hero" className={styles.wordmark} onClick={close}>
          Laura Harris
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li>
            <a href="#fit" className={styles.fitLink}>
              Should We Work Together?
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={menuOpen ? styles.barOpen1 : styles.bar} />
          <span className={menuOpen ? styles.barOpen2 : styles.bar} />
          <span className={menuOpen ? styles.barOpen3 : styles.bar} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          <ul>
            <li><a href="#about" onClick={close}>About</a></li>
            <li><a href="#work" onClick={close}>Work</a></li>
            <li>
              <a href="#fit" className={styles.fitLink} onClick={close}>
                Should We Work Together?
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
