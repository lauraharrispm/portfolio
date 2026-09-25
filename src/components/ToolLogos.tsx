import styles from "./ToolLogos.module.css";

interface LogoDef {
  name: string;
  src: string;
  w: number;
  h: number;
  height: number;
}

const TOOL_LOGOS: LogoDef[] = [
  { name: "Claude", src: "/logos/tools/claude.png", w: 288, h: 288, height: 30 },
  { name: "Claude Code", src: "/logos/tools/claude-code.png", w: 512, h: 236, height: 22 },
  { name: "Codex", src: "/logos/tools/codex.png", w: 526, h: 526, height: 30 },
  { name: "Muse", src: "/logos/tools/muse.png", w: 562, h: 550, height: 30 },
  { name: "Wispr", src: "/logos/tools/wispr.png", w: 899, h: 892, height: 28 },
  { name: "Granola", src: "/logos/tools/granola.png", w: 225, h: 135, height: 22 },
  { name: "Mobbin", src: "/logos/tools/mobbin.png", w: 409, h: 426, height: 30 },
  { name: "Dribbble", src: "/logos/tools/dribbble.png", w: 2500, h: 2500, height: 30 },
  { name: "Flora", src: "/logos/tools/flora.png", w: 534, h: 534, height: 30 },
  { name: "Chrome", src: "/logos/tools/chrome.svg", w: 512, h: 512, height: 30 },
];

export default function ToolLogos() {
  return (
    <ul className={styles.row}>
      {TOOL_LOGOS.map((logo) => (
        <li key={logo.name} className={styles.item} tabIndex={0}>
          <span
            className={styles.logo}
            aria-hidden="true"
            style={
              {
                aspectRatio: `${logo.w} / ${logo.h}`,
                maskImage: `url(${logo.src})`,
                WebkitMaskImage: `url(${logo.src})`,
                "--logo-h": `${logo.height}px`,
              } as React.CSSProperties
            }
          />
          <span className={styles.tooltip}>{logo.name}</span>
        </li>
      ))}
    </ul>
  );
}
