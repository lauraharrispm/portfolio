import styles from "./LogoStrip.module.css";

interface LogoDef {
  name: string;
  src: string;
  /** intrinsic SVG viewBox dimensions, used to keep aspect ratio */
  w: number;
  h: number;
  /** optical height per breakpoint — tuned per logo so wordmarks and compact marks read as equally heavy */
  desktopHeight: number;
  mobileHeight: number;
  /** faux-bold this mark slightly (see .logoBold) — for source art that's a lighter cut than its neighbors */
  bold?: boolean;
}

const LOGOS: LogoDef[] = [
  { name: "GlossGenius", src: "/logos/glossgenius.svg", w: 1213.44, h: 88.19, desktopHeight: 13, mobileHeight: 7, bold: true },
  { name: "Rula Health", src: "/logos/rula.svg", w: 1800, h: 504, desktopHeight: 24, mobileHeight: 14 },
  { name: "Burrow", src: "/logos/burrow.svg", w: 1554, h: 246, desktopHeight: 19, mobileHeight: 11 },
  { name: "ThirdLove", src: "/logos/thirdlove.svg", w: 921, h: 180, desktopHeight: 24, mobileHeight: 14 },
];

const MARQUEE_REPEATS = 6;

function Logo({ logo }: { logo: LogoDef }) {
  return (
    <span
      className={`${styles.logo} ${logo.bold ? styles.logoBold : ""}`}
      style={
        {
          aspectRatio: `${logo.w} / ${logo.h}`,
          maskImage: `url(${logo.src})`,
          WebkitMaskImage: `url(${logo.src})`,
          "--logo-h": `${logo.desktopHeight}px`,
          "--logo-h-mobile": `${logo.mobileHeight}px`,
        } as React.CSSProperties
      }
    />
  );
}

export default function LogoStrip() {
  return (
    <section
      className={styles.section}
      aria-label="Full-time product roles at GlossGenius, Rula Health, Burrow, and ThirdLove"
    >
      <div className={`container ${styles.bar}`}>
        <p className={styles.label}>Full-time product roles at</p>

        {/* Desktop / tablet: static evenly-spaced row, inline with the label */}
        <div className={styles.row} aria-hidden="true">
          {LOGOS.map((logo) => (
            <Logo key={logo.name} logo={logo} />
          ))}
        </div>

        {/* Small screens: continuous marquee, stacked below the label */}
        <div className={styles.marqueeViewport} aria-hidden="true">
          <div className={styles.track}>
            {Array.from({ length: MARQUEE_REPEATS }).map((_, repeatIndex) => (
              <div className={styles.trackGroup} key={repeatIndex}>
                {LOGOS.map((logo) => (
                  <Logo key={`${repeatIndex}-${logo.name}`} logo={logo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
