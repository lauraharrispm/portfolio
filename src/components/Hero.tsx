"use client";

import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Product Lead impact without a full-time hire.
          </h1>
          <p className={styles.subhead}>
            I&apos;m Laura. I&apos;ve spent 8+ years building growth products at consumer startups across DTC ecommerce, marketplaces, and healthcare, from seed to Series C. I 4x&apos;d revenue at Burrow and drove 50%+ patient growth at Rula. Now I help founders solve the right problems and ship faster.
          </p>
          <div className={styles.ctas}>
            <a
              href="#work"
              className={styles.ctaSecondary}
              onClick={() =>
                trackEvent("cta_click", {
                  cta_label: "see_my_work",
                  cta_location: "hero",
                })
              }
            >
              See my work
            </a>
            <a
              href="#book"
              className={styles.ctaPrimary}
              onClick={() =>
                trackEvent("cta_click", {
                  cta_label: "lets_chat",
                  cta_location: "hero",
                })
              }
            >
              Let&apos;s chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
