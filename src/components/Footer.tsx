import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.name}>Laura Harris</span>
        <a href="mailto:lauraharrispm@gmail.com" className={styles.link}>
          lauraharrispm@gmail.com
        </a>
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
