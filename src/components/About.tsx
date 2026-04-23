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
              I&apos;ve spent 7+ years driving growth at consumer startups. I started
              in DTC ecommerce at{" "}
              <a href="https://www.thirdlove.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>ThirdLove</a>
              {" "}and{" "}
              <a href="https://burrow.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>Burrow</a>
              , building the first digital product function at Burrow from the ground up.
              Then I moved into marketplace businesses, leading product growth at{" "}
              <a href="https://www.rula.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>Rula Health</a>
              {" "}across patients, providers, and payers, and most recently owning
              onboarding and monetization at{" "}
              <a href="https://glossgenius.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>GlossGenius</a>
              , helping beauty and wellness entrepreneurs run and grow their businesses.
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
