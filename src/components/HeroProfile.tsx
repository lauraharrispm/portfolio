"use client";

import Image from "next/image";
import styles from "./HeroProfile.module.css";

// Just the photo now.
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
        <Image
          src="/headshot-hover.jpg"
          alt=""
          aria-hidden="true"
          width={2000}
          height={2000}
          quality={90}
          className={`${styles.photoImg} ${styles.photoImgAlt}`}
        />
      </div>
    </div>
  );
}
