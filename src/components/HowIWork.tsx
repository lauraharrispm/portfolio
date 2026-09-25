"use client";

import { trackEvent } from "@/lib/analytics";
import ToolLogos from "./ToolLogos";
import styles from "./HowIWork.module.css";

function FunFactCallout({ className }: { className: string }) {
  return (
    <div className={className}>
      <p className={styles.calloutLabel}>Fun fact</p>
      <p className={styles.calloutBody}>
        I designed and built this site with Claude Code in less than a week.
      </p>
    </div>
  );
}

const PROCESS_STRIP = ["Define", "Prioritize", "Explore", "Ship", "Iterate"];

interface Claim {
  title: string;
  body: string;
}

const CLAIMS: Claim[] = [
  {
    title: "Faster at every step.",
    body: "10× faster from idea to shareable artifact. Answers from your data in minutes, working prototypes the same day.",
  },
  {
    title: "Still solving the right problems.",
    body: "AI changed my speed, not my judgment. Building is cheap now, but building the wrong thing still wastes time and money. What gets built, and why, is my call.",
  },
  {
    title: "Human-verified.",
    body: "AI starts the work. A human finishes it. Every word and number I hand you has been checked by me.",
  },
  {
    title: "Your team levels up too.",
    body: "I leave behind AI workflows your team keeps using. At GlossGenius, I rolled out Claude Enterprise across product, engineering, and operations, starting with the workflows people complained about most.",
  },
];

export default function HowIWork() {
  return (
    <section id="how" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>How I work</h2>

        <h3 className={styles.subheading}>Two ways to work together</h3>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Fractional</h4>
            <p className={styles.cardCadence}>Multiple months at 1-3 days/week</p>
            <p className={styles.cardBody}>
              Senior product leadership embedded in your team. I own your biggest
              growth problems and keep engineering building from a queue that stays
              ahead of them.
            </p>
            <p className={styles.cardBestFor}>
              Best for: teams where growth matters but nobody has the hours to give it
              real focus right now. You get dedicated senior time on it, every week.
            </p>
          </div>

          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Growth Sprint</h4>
            <p className={styles.cardCadence}>2-4 weeks</p>
            <p className={styles.cardBody}>
              A deep dive into one growth problem, grounded in your real data. You get
              a staged plan ranked by confidence and effort, specific enough that your
              team could start building it tomorrow.
            </p>
            <p className={styles.cardBestFor}>
              Best for: teams with someone already owning product, like a first PM or a
              founder splitting their time, who want senior growth firepower on one
              problem without an ongoing commitment.
            </p>
          </div>
        </div>

        <p className={styles.ninetyDays}>
          Your first 90 days of fractional work: by day 30, we&apos;ve agreed on what
          we&apos;re optimizing for, you have a clear read on where your funnel loses
          people, and your first project is ready to build. By day 60, engineering is
          building from a queue that stays ahead of them. By day 90, your most
          important bet has shipped, with a plan for what comes next.
        </p>

        <h3 className={styles.subheading}>My AI-native approach</h3>

        <div className={styles.aiTop}>
          <p className={styles.aiStatement}>
            Part-time no longer means partial impact.
          </p>
          <FunFactCallout className={styles.calloutTop} />
        </div>

        <div className={styles.claimsGrid}>
          {CLAIMS.map((claim) => (
            <div className={styles.claim} key={claim.title}>
              <h4 className={styles.claimTitle}>{claim.title}</h4>
              <p className={styles.claimBody}>{claim.body}</p>
              {claim.title === "Still solving the right problems." && (
                <ol className={styles.processStrip} aria-label="My process">
                  {PROCESS_STRIP.map((step, i) => (
                    <li key={step} className={styles.processStripItem}>
                      {step}
                      {i < PROCESS_STRIP.length - 1 && (
                        <span className={styles.processStripArrow} aria-hidden="true">
                          →
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>

        <div className={styles.toolsBar}>
          <p className={styles.toolsLabel}>Tools in my stack</p>
          <ToolLogos />
        </div>

        <FunFactCallout className={styles.calloutBottom} />

        <a
          href="#book"
          className={styles.cta}
          onClick={() =>
            trackEvent("cta_click", { cta_label: "lets_chat", cta_location: "how_i_work" })
          }
        >
          Let&apos;s chat
        </a>
      </div>
    </section>
  );
}
