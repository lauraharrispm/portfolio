"use client";

import { useState, useEffect } from "react";
import styles from "./Nav.module.css";
import { trackEvent } from "@/lib/analytics";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setMenuOpen(false);

  const trackNav = (label: string, location: "nav_desktop" | "nav_mobile") => {
    trackEvent("cta_click", { cta_label: label, cta_location: location });
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a
          href="#hero"
          className={styles.wordmark}
          onClick={() => {
            close();
            trackNav("wordmark", "nav_desktop");
          }}
        >
          Laura Harris
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          <li>
            <a href="#about" onClick={() => trackNav("about", "nav_desktop")}>
              About
            </a>
          </li>
          <li>
            <a href="#work" onClick={() => trackNav("work", "nav_desktop")}>
              Work
            </a>
          </li>
          <li>
            <a
              href="#fit"
              className={styles.fitLink}
              onClick={() => trackNav("should_we_work_together", "nav_desktop")}
            >
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
            <li>
              <a
                href="#about"
                onClick={() => {
                  close();
                  trackNav("about", "nav_mobile");
                }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#work"
                onClick={() => {
                  close();
                  trackNav("work", "nav_mobile");
                }}
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#fit"
                className={styles.fitLink}
                onClick={() => {
                  close();
                  trackNav("should_we_work_together", "nav_mobile");
                }}
              >
                Should We Work Together?
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
