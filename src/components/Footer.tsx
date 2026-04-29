"use client";

import styles from "./Footer.module.css";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.name}>Laura Harris</span>
        <a
          href="mailto:laura.harris.pm@gmail.com"
          className={styles.link}
          onClick={() =>
            trackEvent("cta_click", {
              cta_label: "email",
              cta_location: "footer",
            })
          }
        >
          laura.harris.pm@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/laurakayharris"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          onClick={() =>
            trackEvent("cta_click", {
              cta_label: "linkedin",
              cta_location: "footer",
            })
          }
        >
          LinkedIn
        </a>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© 2026 Laura Harris</span>
      </div>
    </footer>
  );
}
