"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { InlineWidget } from "react-calendly";
import styles from "./LetsChat.module.css";

// Direct event-type link (not the profile URL) so the embed opens straight
// to the calendar instead of the "30 Minute Meeting" landing page.
const CALENDLY_URL = "https://calendly.com/laura-harris-pm/30min";
// Matches the InlineWidget's own height below: reserving it up front
// avoids layout shift whether or not the embed has loaded yet.
const CALENDLY_HEIGHT = 700;

export default function LetsChat() {
  const [nearViewport, setNearViewport] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nearViewport) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nearViewport]);

  return (
    <section id="book" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.photoWrap}>
            <Image
              src="/headshot.jpg"
              alt="Laura Harris"
              fill
              className={styles.photoImg}
              sizes="(max-width: 768px) 160px, 360px"
            />
          </div>

          <div className={styles.copy}>
            <h2 className={styles.heading}>Let&apos;s chat</h2>
            <p className={styles.body}>
              Tell me what you know and what you don&apos;t know. In 30 minutes,
              I&apos;ll share how I&apos;d approach it and whether we&apos;re a fit.
            </p>
          </div>
        </div>

        <div
          ref={sectionRef}
          className={styles.calendlyWrap}
          style={{ minHeight: CALENDLY_HEIGHT }}
        >
          {nearViewport ? (
            <InlineWidget
              url={CALENDLY_URL}
              styles={{ minWidth: "100%", height: `${CALENDLY_HEIGHT}px` }}
              pageSettings={{
                primaryColor: "2E2820",
                textColor: "2E2820",
                backgroundColor: "FAF9F6",
              }}
            />
          ) : (
            <div className={styles.calendlyPlaceholder} aria-hidden="true" />
          )}
        </div>

        <p className={styles.altContact}>
          Rather write? Reach me at{" "}
          <a href="mailto:laura.harris.pm@gmail.com">laura.harris.pm@gmail.com</a> or on{" "}
          <a
            href="https://www.linkedin.com/in/laurakayharris/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>
    </section>
  );
}
