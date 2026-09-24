"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { InlineWidget } from "react-calendly";
import styles from "./LetsChat.module.css";

const CALENDLY_URL = "https://calendly.com/laura-harris-pm";
// Matches the InlineWidget's own height below — reserving it up front
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
              I&apos;m Laura. I&apos;ve spent 8+ years building growth products at
              consumer startups across DTC ecommerce, marketplaces, and healthcare,
              from seed to Series C.
            </p>
            <p className={styles.body}>
              I did fractional work on the side of my day jobs for years, and in 2026 I
              went all in because the math changed. With AI, one senior PM can now take
              a project from diagnosis to launch, work that used to take a team.{" "}
              <strong>Part-time no longer means partial impact.</strong>
            </p>
            <p className={styles.body}>
              I&apos;m best at untangling messy growth problems, finding the real
              constraint, and shipping what moves the metric. I click with founders who
              treat growth as a learning loop.
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
