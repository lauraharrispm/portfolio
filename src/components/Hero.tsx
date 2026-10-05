"use client";

import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";
import HeroProfile from "./HeroProfile";
import ProductOutcomes from "./ProductOutcomes";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <h1 className={styles.headline}>Build products people want, faster.</h1>
            <p className={styles.subhead}>
              I&apos;m Laura. I help consumer startup founders find the right product
              bets, align engineering, and ship faster. I bring 8+ years of experience
              across marketplaces, healthcare, and ecommerce, spanning seed to Series C.
            </p>
          </div>

          <div className={styles.panelCol}>
            <HeroProfile />
          </div>

          <div className={styles.outcomesSlot}>
            <ProductOutcomes />
          </div>

          <div className={styles.ctas}>
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
