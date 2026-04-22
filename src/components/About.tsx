import Image from "next/image";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.inner}>
          {/* Body copy — left, with heading inside */}
          <div className={styles.copy}>
            <h2 className={styles.sectionLabel}>About</h2>
            <p className={styles.body}>
              I&apos;ve spent 7+ years driving growth at consumer startups. I started
              in DTC ecommerce at{" "}
              <a href="https://www.thirdlove.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>ThirdLove</a>
              {" "}and{" "}
              <a href="https://burrow.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>Burrow</a>
              , building the first digital product function at Burrow from the ground up.
              Then I moved into marketplace businesses, leading growth product at{" "}
              <a href="https://www.rula.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>Rula Health</a>
              {" "}across patients, providers, and payers, and most recently owning
              onboarding and monetization at{" "}
              <a href="https://glossgenius.com" target="_blank" rel="noopener noreferrer" className={styles.companyLink}>GlossGenius</a>
              , helping beauty and wellness entrepreneurs run and grow their businesses.
            </p>
          </div>

          {/* Right side: headshot — circle is the flex item itself so
               aspect-ratio:1/1 correctly derives width from stretch-height */}
          <div className={styles.headshotWrap}>
            <Image
              src="/headshot.jpg"
              alt="Laura Harris"
              fill
              className={styles.headshotImg}
              sizes="(max-width: 768px) 140px, 240px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
