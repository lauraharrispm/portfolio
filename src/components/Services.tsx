import { Fragment } from "react";
import styles from "./Services.module.css";

interface FunnelStage {
  category: string;
  body: string;
  href?: string;
}

const STAGES: FunnelStage[] = [
  {
    category: "Acquisition",
    body: "Turning traffic into signups: landing pages, entry flows, and organic channels.",
    href: "#work-therapist-directory",
  },
  {
    category: "Activation",
    body: "Getting new users to value fast: onboarding, intake, and first-run experiences.",
    href: "#work-payments-onboarding",
  },
  {
    category: "Monetization",
    body: "Pricing, plans, and upgrade paths that grow revenue without hurting activation.",
    href: "#work-annual-plans",
  },
  {
    category: "Retention",
    body: "Lifecycle, churn diagnosis, and the moments that bring people back.",
  },
];

function FunnelArrow() {
  return (
    <span className={styles.funnelArrow} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12H20M20 12L14 6M20 12L14 18"
          stroke="var(--charcoal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="var(--coral)" strokeWidth="1.5" />
      <path
        d="M6 10.5L8.5 13L14 7"
        stroke="var(--coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="var(--charcoal-muted)" strokeWidth="1.5" />
      <path
        d="M7 7L13 13M13 7L7 13"
        stroke="var(--charcoal-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>What I do</h2>
        <p className={styles.intro}>
          I own growth across the full funnel, from first visit to happy customer. I
          untangle messy growth problems, find the real constraint, and ship what
          moves the metric.
        </p>

        <div className={styles.funnel}>
          {STAGES.map((stage, i) => (
            <Fragment key={stage.category}>
              <div className={styles.funnelItem}>
                <h3 className={styles.funnelTitle}>{stage.category}</h3>
                <p className={styles.funnelBody}>{stage.body}</p>
                {stage.href && (
                  <a className={styles.proof} href={stage.href}>
                    Case study →
                  </a>
                )}
              </div>
              {i < STAGES.length - 1 && <FunnelArrow />}
            </Fragment>
          ))}
        </div>

        <p className={styles.fitIntro}>
          Who do I do this for? Here&apos;s a quick guide to see if your company
          could be a good fit.
        </p>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h4 className={styles.columnHeading}>We&apos;re a fit if you:</h4>
            <ul className={styles.list}>
              <li>
                <CheckIcon />
                <span>Run a consumer-facing business</span>
              </li>
              <li>
                <CheckIcon />
                <span>Have found product-market fit and need to grow faster</span>
              </li>
              <li>
                <CheckIcon />
                <span>Have engineers but little or no dedicated product guidance</span>
              </li>
              <li>
                <CheckIcon />
                <span>Want someone to actually ship their recommendations</span>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnHeading}>We&apos;re not a fit (right now) if you:</h4>
            <ul className={styles.list}>
              <li>
                <XIcon />
                <span>Are still searching for product-market fit</span>
              </li>
              <li>
                <XIcon />
                <span>Sell enterprise software to other businesses</span>
              </li>
              <li>
                <XIcon />
                <span>Need a full-time product manager ASAP</span>
              </li>
              <li>
                <XIcon />
                <span>Need someone to manage a product team day to day</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
