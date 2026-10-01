"use client";

import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";
import HeroResults from "./HeroResults";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <h1 className={styles.headline}>
              Product Lead impact
              <br />
              without a full-time&nbsp;hire.
            </h1>
            <p className={styles.subhead}>
              I&apos;m Laura. I&apos;ve spent 8+ years building and scaling products at
              consumer startups across marketplaces, healthcare, and DTC ecommerce, from
              seed to Series C. Now I help founders solve the right problems, unblock engineering,
              and ship faster. NYC-based.
            </p>
          </div>

          <div className={styles.panelCol}>
            <HeroResults />
          </div>

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
