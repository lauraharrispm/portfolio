import Image from "next/image";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        {/* Heading sits above the grid so the headshot aligns with body copy only */}
        <h2 className={styles.sectionLabel}>About</h2>
        <div className={styles.inner}>
          {/* Body copy */}
          <div className={styles.copy}>
            <p className={styles.body}>
              I&apos;ve spent 7+ years building growth products at consumer startups across DTC ecommerce,
              marketplaces, and mental healthcare. I&apos;ve worked at stages from seed to Series C and team sizes from 30 to 550. I work full funnel: acquisition, activation, monetization, and retention.
            </p>
            <p className={styles.body}>
              The work I&apos;m best at is untangling messy growth problems, finding the real constraint, and shipping what moves the metric. I click with founders who treat growth as a learning loop. Curious, scrappy, biased toward action.
            </p>
          </div>

          {/* Headshot — circle aligns with body copy, not the heading */}
          <div className={styles.headshotWrap}>
            <Image
              src="/headshot.jpg"
              alt="Laura Harris"
              fill
              className={styles.headshotImg}
              sizes="(max-width: 768px) 140px, 400px"
              quality={90}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
