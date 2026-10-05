"use client";

import Image from "next/image";
import styles from "./HeroProfile.module.css";

// Just the photo, availability pill, and a LinkedIn link now. Order is
// photo -> pill -> LinkedIn on desktop, but pill -> photo -> LinkedIn on
// mobile (see each element's own `order` in HeroProfile.module.css): same
// three elements, reordered per breakpoint via flex `order` rather than
// duplicated markup.
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
      <span className={styles.availabilityPill}>
        Available for fractional and project-based work
      </span>
      <a
        href="https://www.linkedin.com/in/laurakayharris/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkedinLink}
      >
        LinkedIn
      </a>
    </div>
  );
}
