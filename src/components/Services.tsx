import Toggle from "./Toggle";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>What I do</h2>
        <p className={styles.intro}>
          I own growth across the full funnel, from first visit to happy customer.
        </p>

        <div className={styles.funnel}>
          <div className={styles.funnelItem}>
            <p className={styles.funnelBody}>
              <strong>Acquisition.</strong> Turning traffic into signups: landing pages,
              entry flows, and organic channels.
            </p>
            <p className={styles.proof}>
              <a href="#work-therapist-directory">
                Tripled organic traffic at Rula with a redesigned therapist directory.
              </a>
            </p>
          </div>

          <span className={styles.funnelArrow} aria-hidden="true">→</span>

          <div className={styles.funnelItem}>
            <p className={styles.funnelBody}>
              <strong>Activation.</strong> Getting new users to value fast: onboarding,
              intake, and first-run experiences.
            </p>
            <p className={styles.proof}>
              <a href="#work-payments-onboarding">
                Lifted payments onboarding completion 80% at GlossGenius.
              </a>
            </p>
          </div>

          <span className={styles.funnelArrow} aria-hidden="true">→</span>

          <div className={styles.funnelItem}>
            <p className={styles.funnelBody}>
              <strong>Monetization.</strong> Pricing, plans, and upgrade paths that grow
              revenue without hurting activation.
            </p>
            <p className={styles.proof}>
              <a href="#work-annual-plans">
                Launched annual plans at GlossGenius, with adoption beating projections.
              </a>
            </p>
          </div>

          <span className={styles.funnelArrow} aria-hidden="true">→</span>

          <div className={styles.funnelItem}>
            <p className={styles.funnelBody}>
              <strong>Retention.</strong> Lifecycle, churn diagnosis, and the moments
              that bring people back.
            </p>
            <p className={styles.proof}>
              Drove 11% patient growth at Rula through lifecycle marketing.
            </p>
          </div>
        </div>

        <h3 className={styles.subheading}>Two ways to work together</h3>
        <p className={styles.subIntro}>
          I did fractional work on the side of my day jobs for years, and in 2026 I
          went all in because the math changed. With AI, one senior PM can now take a
          project from diagnosis to launch, work that used to take a team.{" "}
          <strong>Part-time no longer means partial impact.</strong>
        </p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Fractional</h4>
            <p className={styles.cardCadence}>1 to 3 days a week, ongoing</p>
            <p className={styles.cardBody}>
              Senior product leadership embedded in your team. I own your biggest
              growth problems and keep engineering building from a queue that stays
              ahead of them.
            </p>
            <p className={styles.cardBestFor}>
              Best for: teams with engineers ready to build and no one owning growth.
            </p>

            <Toggle label="See what your first 90 days look like">
              <div className={styles.milestones}>
                <div className={styles.milestone}>
                  <h5 className={styles.milestoneHeading}>By Day 30</h5>
                  <ul className={styles.milestoneList}>
                    <li>
                      A clear read on where your funnel is losing people, from your
                      data, not opinions
                    </li>
                    <li>
                      A staged plan ranked by confidence and engineering effort, with a
                      success metric and a guardrail for every bet
                    </li>
                    <li>Your first project ready to build, with the next two queued behind it</li>
                  </ul>
                </div>
                <div className={styles.milestone}>
                  <h5 className={styles.milestoneHeading}>By Day 60</h5>
                  <ul className={styles.milestoneList}>
                    <li>Engineering building from a queue that stays ahead of them</li>
                    <li>High-confidence changes live or in QA, with analytics in place before launch</li>
                    <li>Every decision written down somewhere you own</li>
                  </ul>
                </div>
                <div className={styles.milestone}>
                  <h5 className={styles.milestoneHeading}>By Day 90</h5>
                  <ul className={styles.milestoneList}>
                    <li>Your most important bet shipped</li>
                    <li>A post-launch plan with named owners and a written definition of success</li>
                    <li>A clear call on what&apos;s next: keep going, expand scope, or hand off to your full-time hire</li>
                  </ul>
                </div>
              </div>
            </Toggle>
          </div>

          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Growth Sprint</h4>
            <p className={styles.cardCadence}>Fixed scope, 2 to 4 weeks</p>
            <p className={styles.cardBody}>
              A deep dive into one growth problem, grounded in your real data. You get
              a staged plan ranked by confidence and effort, specific enough that your
              team could start building it tomorrow.
            </p>
            <p className={styles.cardBestFor}>
              Best for: founders who know something is stuck and want a clear diagnosis
              before committing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
