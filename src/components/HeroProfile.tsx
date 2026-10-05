"use client";

import Image from "next/image";
import styles from "./HeroProfile.module.css";

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Just the photo plus two location facts now: the results/logos that used
// to live in this panel moved to their own ProductOutcomes section. No
// mount-time reveal here either, that animation existed to soften the old
// panel's size; this is small enough not to need it.
export default function HeroProfile() {
  return (
    <div className={styles.wrap}>
      <div className={styles.photoWrap}>
        {/* Intrinsic size well above the ~160px/130px this actually displays
           at (see .photoWrap/.photoImg): next/image otherwise generates a
           srcset capped near the requested size, which reads as pixelated
           under zoom even though the source file itself is high-res. */}
        <Image
          src="/headshot.jpg"
          alt="Laura Harris"
          width={512}
          height={512}
          quality={90}
          preload
          className={styles.photoImg}
        />
      </div>
      <ul className={styles.locationList}>
        <li className={styles.locationRow}>
          <PinIcon />
          <span>NYC</span>
        </li>
        <li className={styles.locationRow}>
          <a
            href="https://www.linkedin.com/in/laurakayharris/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={styles.linkedinLink}
          >
            <LinkedinIcon />
          </a>
        </li>
      </ul>
    </div>
  );
}
