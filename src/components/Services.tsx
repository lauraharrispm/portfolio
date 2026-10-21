"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Services.module.css";

interface FunnelStage {
  category: string;
  body: string;
  href: string;
  linkLabel: string;
}

const STAGES: FunnelStage[] = [
  {
    category: "Acquisition",
    body: "Turn the product into a channel, so the right people find it with intent.",
    href: "#work-therapist-directory",
    linkLabel: "Read the Rula directory story",
  },
  {
    category: "Activation",
    body: "Cut the time to first value so new customers commit on their own.",
    href: "#work-payments-onboarding",
    linkLabel: "Read the GlossGenius onboarding story",
  },
  {
    category: "Monetization",
    body: "Build self-serve plans and upgrades customers say yes to.",
    href: "#work-annual-plans",
    linkLabel: "Read the GlossGenius billing story",
  },
  {
    category: "Retention",
    body: "Give customers reasons to stay, expand, and recommend you.",
    // Billing rebuild for AI add-ons and annual subscriptions: the same target as
    // Monetization. That's fine, both formats can point at the same study.
    href: "#work-annual-plans",
    linkLabel: "Read the GlossGenius billing story",
  },
];

const STAGE_BAR_COLORS = ["var(--stage-bar-1)", "var(--stage-bar-2)", "var(--stage-bar-3)", "var(--coral)"];

// Fade/rise-in once a block comes into view: same IntersectionObserver +
// toggled-class pattern used elsewhere (see HowIWork), skipped entirely
// under reduced motion via the CSS media query.
function useInViewOnce<T extends HTMLElement>() {
  const [inView, setInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

export default function Services() {
  const [stagesRef, stagesInView] = useInViewOnce<HTMLOListElement>();

  return (
    <section id="services" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>What I do</h2>
        <p className={styles.intro}>
          I lead product growth across the full funnel, from first visit to repeat customer.
          <br className={styles.introBreak} />
          {" "}I untangle messy growth problems and ship what moves the metric.
        </p>

        <ol
          ref={stagesRef}
          aria-label="Growth funnel stages, in order"
          className={`${styles.stages} ${stagesInView ? styles.stagesIn : ""}`}
        >
          {STAGES.map((stage, i) => (
            <li className={styles.stage} key={stage.category}>
              <span
                className={styles.marker}
                aria-hidden="true"
                style={
                  {
                    "--marker-color": STAGE_BAR_COLORS[i],
                    "--marker-delay": `${i * 120}ms`,
                  } as React.CSSProperties
                }
              />
              <div className={styles.stageContent}>
                <span className={styles.stageNumber}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.stageName}>{stage.category}</h3>
                {/* .stageLink nested inside the paragraph, not a sibling
                   after it: on mobile (its default inline display) that
                   lets it flow right at the end of the body text instead
                   of forcing its own line; desktop overrides it back to
                   display:block (see the min-width:769px rule) to keep
                   the previous on-its-own-line look there. */}
                <p className={styles.stageBody}>
                  {stage.body}{" "}
                  <a className={styles.stageLink} href={stage.href}>
                    {stage.linkLabel}{" "}
                    <span className={styles.stageLinkArrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
