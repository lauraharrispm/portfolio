"use client";

import { trackEvent } from "@/lib/analytics";
import styles from "./HowIWork.module.css";

export default function HowIWork() {
  return (
    <section id="how" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>How I Work</h2>
        <p className={styles.intro}>Part-time only works when it&apos;s set up on purpose.</p>

        <ol className={styles.principles}>
          <li>
            <strong>We pick the goal at kickoff.</strong> Shipped work and a measured
            result pull in different directions. We choose one out loud.
          </li>
          <li>
            <strong>You tell me what you don&apos;t know.</strong> A one-page list of
            your open questions is the fastest way to shorten my ramp-up.
          </li>
          <li>
            <strong>Depth over breadth.</strong> My best work comes from going deep on
            a few priorities, not skimming many.
          </li>
          <li>
            <strong>Everything I write lives somewhere you keep.</strong>{" "}
            Not only in a Slack thread you&apos;ll never find again.
          </li>
        </ol>

        <h3 className={styles.subheading}>AI-native, judgment-first</h3>
        <p className={styles.aiLede}>10× faster from idea to shareable artifact.</p>

        <p className={styles.body}>
          Engineering teams now ship dramatically more with AI, so product has to
          keep pace. Here&apos;s how I divide the work:
        </p>

        <ul className={styles.stack}>
          <li>
            <strong>Claude Code</strong> pulls ground truth from your codebase and
            production data, with sources I can defend in a meeting.
          </li>
          <li>
            <strong>Claude Design</strong> turns specs into working prototypes.
          </li>
          <li>
            <strong>Claude and Cowork</strong> diagnose problems, write specs, and check
            every prototype against the spec.
          </li>
          <li>
            <strong>Granola</strong>{" "}
            captures every meeting, so decisions don&apos;t live only in someone&apos;s
            memory.
          </li>
          <li>
            <strong>I make the calls.</strong> Priorities, scope, tradeoffs, and
            anything legal or compliance-related stay with me.
          </li>
        </ul>

        <p className={styles.body}>
          <strong>AI starts the work. A human finishes it.</strong>{" "}
          AI is fast, but it&apos;s sometimes confidently wrong, and its output can look
          done before it is. So every word and number I hand you has been checked by
          me. Knowing the difference is what you&apos;re paying for.
        </p>

        <p className={styles.bafLabel}>Before and after</p>
        <div className={styles.bafTable} role="table" aria-label="Before and after AI-native workflow">
          <div className={styles.bafHeader} role="row">
            <span role="columnheader">Before</span>
            <span role="columnheader">After</span>
          </div>
          <div className={styles.bafRow} role="row">
            <span role="cell">Waiting on a data partner for answers</span>
            <span role="cell">
              <span className={styles.bafArrow} aria-hidden="true">→</span>
              First-pass analysis in minutes, more time on interpretation
            </span>
          </div>
          <div className={styles.bafRow} role="row">
            <span role="cell">Waiting days for design availability</span>
            <span role="cell">
              <span className={styles.bafArrow} aria-hidden="true">→</span>
              Working prototypes the same day, faster feedback loops
            </span>
          </div>
          <div className={styles.bafRow} role="row">
            <span role="cell">Specs written from scratch</span>
            <span role="cell">
              <span className={styles.bafArrow} aria-hidden="true">→</span>
              A first draft ready to react to, grounded in the actual code
            </span>
          </div>
        </div>

        <p className={styles.closing}>
          I&apos;ve also rolled this out beyond my own work: at GlossGenius, I deployed
          Claude Enterprise across product, engineering, and operations, starting with
          the workflows people complained about most. And I built this site with Claude
          Code in a few days.
        </p>

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
