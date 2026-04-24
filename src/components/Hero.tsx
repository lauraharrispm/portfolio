import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Senior Growth PM impact without a full-time hire.
          </h1>
          <p className={styles.subhead}>
            I work with consumer startups that have found product-market fit and need senior growth PM
            ownership to scale it, across healthtech, ecommerce, and marketplace businesses.
          </p>
          <div className={styles.ctas}>
            <a href="#fit" className={styles.ctaPrimary}>
              See if we&apos;re a fit
            </a>
            <a href="#work" className={styles.ctaSecondary}>
              See my work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
