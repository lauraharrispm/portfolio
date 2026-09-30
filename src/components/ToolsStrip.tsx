import styles from "./ToolsStrip.module.css";

interface Tool {
  name: string;
  src: string;
  /** intrinsic dimensions, used to derive width from height so the mask
   * doesn't distort the icon (see .icon) */
  w: number;
  h: number;
  /** optical height, tuned per icon so they read as equally weighted */
  height: number;
}

// Same icon files/dimensions as the old "My stack" panel; flattened into
// one low-emphasis row instead of grouped categories, since this strip
// sits quietly under the "leave the team stronger" point in How I Work
// rather than reading as its own section.
const TOOLS: Tool[] = [
  { name: "Claude", src: "/logos/tools/claude.png", w: 288, h: 288, height: 20 },
  { name: "Claude Code", src: "/logos/tools/claude%20code.png", w: 225, h: 135, height: 16 },
  { name: "Codex", src: "/logos/tools/codex.png", w: 526, h: 526, height: 20 },
  // Cropped to just the "M" swoosh (muse.png has "Muse" baked into the
  // art below it); the name still reads on hover via the tooltip.
  { name: "Muse", src: "/logos/tools/muse-mark.png", w: 506, h: 341, height: 17 },
  { name: "Granola", src: "/logos/tools/granola.png", w: 409, h: 426, height: 20 },
  { name: "Wispr", src: "/logos/tools/wispr.png", w: 899, h: 892, height: 19 },
  { name: "Chrome", src: "/logos/tools/chrome.svg", w: 512, h: 512, height: 20 },
  { name: "Linear", src: "/logos/tools/linear.webp", w: 512, h: 512, height: 20 },
  { name: "Flora", src: "/logos/tools/flora.png", w: 534, h: 534, height: 20 },
  { name: "Mobbin", src: "/logos/tools/mobbin.png", w: 409, h: 426, height: 20 },
  { name: "Dribbble", src: "/logos/tools/dribbble.png", w: 2500, h: 2500, height: 20 },
];

export default function ToolsStrip() {
  return (
    <div className={styles.inner}>
      <p className={styles.label}>Tools in my stack</p>
      <ul className={styles.row}>
        {TOOLS.map((tool) => (
          <li
            key={tool.name}
            className={styles.item}
            tabIndex={0}
            role="img"
            aria-label={tool.name}
          >
            <span
              className={styles.icon}
              aria-hidden="true"
              style={
                {
                  aspectRatio: `${tool.w} / ${tool.h}`,
                  maskImage: `url(${tool.src})`,
                  WebkitMaskImage: `url(${tool.src})`,
                  "--icon-h": `${tool.height}px`,
                } as React.CSSProperties
              }
            />
            <span className={styles.tooltip} aria-hidden="true">
              {tool.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
