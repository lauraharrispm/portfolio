import styles from "./WhoThisIsFor.module.css";

export default function WhoThisIsFor() {
  return (
    <section id="fit" className={styles.section} aria-label="Who this is for">
      <div className="container">
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>We&apos;re a fit if you:</h3>
            <ul className={styles.list}>
              <li>Run a consumer business: DTC, marketplace, subscription, or B2B2C</li>
              <li>
                Have found product-market fit and need to grow faster, because growth
                has stalled and you&apos;re not sure why
              </li>
              <li>Have engineers but little or no dedicated senior product guidance</li>
              <li>Want someone who ships, not someone who hands you a deck</li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>We&apos;re not a fit (right now) if you:</h3>
            <ul className={styles.list}>
              <li>Are still searching for product-market fit</li>
              <li>Sell enterprise software to other businesses</li>
              <li>Need a full-time PM starting today</li>
              <li>Need someone to manage a product team day to day</li>
            </ul>
          </div>
        </div>

        <p className={styles.cta}>
          <a href="#book" className={styles.ctaLink}>
            Still not sure? Let&apos;s chat and I&apos;ll give you my hot takes.
          </a>
        </p>
      </div>
    </section>
  );
}
