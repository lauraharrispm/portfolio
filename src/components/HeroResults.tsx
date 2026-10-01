"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./HeroResults.module.css";

interface ResultDef {
  name: string;
  src: string;
  /** intrinsic SVG viewBox dimensions, used to derive width from height */
  w: number;
  h: number;
  /** optical height, tuned per logo so they read as equally weighted */
  height: number;
  /** Overrides the slot's own max-width for this logo specifically (see
   * .logoSlot): used to size GlossGenius's wordmark down independent of
   * the shared slot width the other logos align against. */
  maxWidth?: number;
  /** faux-bold this mark slightly (see .logoBold): for source art that's a lighter cut than its neighbors */
  bold?: boolean;
  number: string;
  label: string;
}

const RESULTS: ResultDef[] = [
  {
    name: "GlossGenius",
    src: "/logos/glossgenius.svg",
    w: 1213.44,
    h: 88.19,
    height: 30,
    maxWidth: 136,
    bold: true,
    number: "80%",
    label: "onboarding lift",
  },
  {
    name: "Rula Health",
    src: "/logos/rula.svg",
    w: 1800,
    h: 504,
    height: 18,
    number: "50%+",
    label: "patient growth",
  },
  {
    name: "Burrow",
    src: "/logos/burrow.svg",
    w: 1554,
    h: 246,
    height: 14,
    number: "4x",
    label: "revenue growth",
  },
  {
    name: "ThirdLove",
    src: "/logos/thirdlove.svg",
    w: 921,
    h: 180,
    height: 17,
    number: "34%",
    label: "revenue growth",
  },
];

// Sized by height first (its own aspect ratio sets the width), same as the
// old logo strip, so each logo keeps its tuned optical weight. max-width on
// the slot (see .logoSlot) only kicks in for a wordmark wide enough to need
// it (GlossGenius, at height 30, would otherwise run ~413px wide): mask-size
// contain then scales that one down to fit without distorting or
// overlapping the result text beside it.
function Logo({ result }: { result: ResultDef }) {
  return (
    <span
      className={`${styles.logo} ${result.bold ? styles.logoBold : ""}`}
      role="img"
      aria-label={result.name}
      style={
        {
          aspectRatio: `${result.w} / ${result.h}`,
          maskImage: `url(${result.src})`,
          WebkitMaskImage: `url(${result.src})`,
          "--logo-h": `${result.height}px`,
          ...(result.maxWidth ? { maxWidth: `${result.maxWidth}px` } : {}),
        } as React.CSSProperties
      }
    />
  );
}

// Fades and rises in once, shortly after the hero text, via a mount-time
// reveal (the panel is always above the fold, so there's nothing to
// scroll-observe): same transform/opacity-only pattern used elsewhere on
// the site (see WorkSummary's card/image/badge reveals), skipped entirely
// under reduced motion via the CSS media query in HeroResults.module.css.
export default function HeroResults() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`${styles.panel} ${entered ? styles.panelIn : ""}`}>
      <div className={styles.headingRow}>
        <h3 className={styles.heading}>
          Product outcomes,
          <br />
          led with my teams
        </h3>
        <div className={styles.photoWrap}>
          <Image
            src="/headshot.jpg"
            alt="Laura Harris"
            width={108}
            height={108}
            priority
            className={styles.photoImg}
          />
        </div>
      </div>
      <ul className={styles.list}>
        {RESULTS.map((result) => (
          <li key={result.name} className={styles.row}>
            <span className={styles.logoSlot}>
              <Logo result={result} />
            </span>
            <span className={styles.result}>
              <span className={styles.number}>{result.number}</span>
              <span className={styles.label}>{result.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
