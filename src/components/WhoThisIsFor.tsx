import styles from "./WhoThisIsFor.module.css";

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

export default function WhoThisIsFor() {
  return (
    <section id="fit" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>Who I work with</h2>
        <p className={styles.lead}>
          I&apos;m best at untangling messy growth problems, finding the real
          constraint, and shipping what moves the metric. I click with founders who
          treat growth as a learning loop.
        </p>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>We&apos;re a fit if you:</h3>
            <ul className={styles.list}>
              <li>
                <CheckIcon />
                <span>Run a consumer business: DTC, marketplace, subscription, or B2B2C</span>
              </li>
              <li>
                <CheckIcon />
                <span>
                  Have found product-market fit and need to grow faster, because growth
                  has stalled and you&apos;re not sure why
                </span>
              </li>
              <li>
                <CheckIcon />
                <span>Have engineers but little or no dedicated senior product guidance</span>
              </li>
              <li>
                <CheckIcon />
                <span>Want someone who ships, not someone who hands you a deck</span>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>We&apos;re not a fit (right now) if you:</h3>
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
                <span>Need a full-time PM starting today</span>
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
