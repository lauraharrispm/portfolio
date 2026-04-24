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
              marketplace, subscription, and mental healthcare. I&apos;ve opened acquisition channels that didn&apos;t exist before, run experimentation programs, and built a product team from scratch.
            </p>
            <p className={styles.body}>
              I do my best work untangling messy problems to figure out what
              actually matters before jumping to solutions. As PM knowledge becomes
              increasingly commoditized in an AI-driven world, I lean into what isn&apos;t:
              a strong sense of what people want, what good looks like, and the judgment to connect the two.
            </p>
            <p className={styles.body}>
              I love working with people who are smart, dynamic, considerate, and endlessly curious.
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
