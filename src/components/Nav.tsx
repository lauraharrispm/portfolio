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
            <a href="#services" onClick={() => trackNav("services", "nav_desktop")}>
              Services
            </a>
          </li>
          <li>
            <a href="#how" onClick={() => trackNav("how_i_work", "nav_desktop")}>
              How I Work
            </a>
          </li>
          <li>
            <a href="#work" onClick={() => trackNav("work", "nav_desktop")}>
              Work
            </a>
          </li>
          <li>
            <a
              href="#book"
              className={styles.ctaButton}
              onClick={() => trackNav("lets_chat", "nav_desktop")}
            >
              Let&apos;s chat
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
                href="#services"
                onClick={() => {
                  close();
                  trackNav("services", "nav_mobile");
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#how"
                onClick={() => {
                  close();
                  trackNav("how_i_work", "nav_mobile");
                }}
              >
                How I Work
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
                href="#book"
                className={styles.ctaButton}
                onClick={() => {
                  close();
                  trackNav("lets_chat", "nav_mobile");
                }}
              >
                Let&apos;s chat
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
