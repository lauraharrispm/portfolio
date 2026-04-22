import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.name}>Laura Harris</span>
        <span className={styles.sep}>|</span>
        <a href="mailto:laura@laurakayharris.com" className={styles.link}>
          laura@laurakayharris.com
        </a>
        <span className={styles.sep}>|</span>
        <a
          href="https://www.linkedin.com/in/laurakayharris"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          LinkedIn
        </a>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© 2026 Laura Harris</span>
      </div>
    </footer>
  );
}
