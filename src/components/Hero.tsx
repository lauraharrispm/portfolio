"use client";

import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";
import HeroProfile from "./HeroProfile";
import ResultIcon from "./ResultIcon";

const OUTCOMES = [
  {
    stat: "80% onboarding lift",
    company: "GlossGenius",
    href: "https://glossgenius.com",
  },
  {
    stat: "50%+ patient growth",
    company: "Rula",
    href: "https://rula.com",
  },
  {
    stat: "4x revenue growth",
    company: "Burrow",
    href: "https://burrow.com",
  },
];

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <h1 className={styles.headline}>Product expert impact without a full-time hire.</h1>
            <p className={styles.subhead}>
              I&apos;m Laura, a fractional product leader. I help consumer startup
              founders find the right product bets, align engineering, and ship
              faster, all without a full-time hire. I bring 8+ years of experience
              across marketplaces, healthcare, and ecommerce, from seed to Series C.
            </p>
          </div>

          {/* display:contents outside the 768px breakpoint (see .photoRow):
             this wrapper only exists so photo and outcomes can become a
             real flex row on mobile, where centering the shorter photo
             against the boxes needs actual flex alignment, not CSS
             Grid's row auto-sizing (which doesn't reliably unify two
             columns' heights into one shared track to center within). */}
          <div className={styles.photoRow}>
            <div className={styles.panelCol}>
              <HeroProfile />
            </div>

            <ul className={styles.outcomesList}>
              {OUTCOMES.map((outcome) => (
                <li key={outcome.company} className={styles.outcomeItem}>
                  <ResultIcon kind="trend" className={styles.outcomeIcon} />
                  <span>
                    {outcome.stat} at{" "}
                    <a
                      href={outcome.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.outcomeLink}
                    >
                      {outcome.company}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
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
