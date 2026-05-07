"use client";

import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Senior Growth PM impact without a full-time hire.
          </h1>
          <p className={styles.tagline}>
            4x&apos;d revenue at Burrow. Drove 50%+ patient growth at Rula. 7+ years of full-funnel growth at consumer startups in healthtech, ecommerce, and marketplaces.
          </p>
          <p className={styles.subhead}>
            I work with consumer startups that have found product-market fit and need Senior Growth PM
            ownership to scale it, across healthtech, ecommerce, and marketplace businesses.
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
              href="#fit"
              className={styles.ctaPrimary}
              onClick={() =>
                trackEvent("cta_click", {
                  cta_label: "see_if_were_a_fit",
                  cta_location: "hero",
                })
              }
            >
              See if we&apos;re a fit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
