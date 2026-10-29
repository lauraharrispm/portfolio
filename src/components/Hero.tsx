"use client";

import CursorChat from "./CursorChat";
import styles from "./Hero.module.css";
import { trackEvent } from "@/lib/analytics";
import HeroProfile from "./HeroProfile";

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
      <CursorChat />
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.content}>
            <h1 className={styles.headline}>
              Product growth, from roadmap to revenue.
            </h1>
            {/* The break only shows on desktop, where it splits the subhead
               into two even lines instead of a long first line. */}
            <p className={styles.subhead}>
              For consumer and marketplace startups with more growth{" "}
              <br className={styles.desktopBreak} />
              potential than time to chase it.
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

            {/* Desktop: display:contents, so the list stays the grid item.
               Mobile: one card holding a bulleted list. */}
            <div className={styles.outcomesCard}>
              <ul className={styles.outcomesList}>
              {OUTCOMES.map((outcome) => (
                <li key={outcome.company} className={styles.outcomeItem}>
                  {/* The stat, then "at Company" on line two, on every
                     screen size. */}
                  <span className={styles.outcomeStat}>{outcome.stat}</span>
                  <span>
                    at{" "}
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
