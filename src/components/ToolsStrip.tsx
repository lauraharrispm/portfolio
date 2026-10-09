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

// No more category grouping/labels: just one row of all 10 tools.
// Icon heights bumped up again (~25%) now that there's no label row
// eating into the vertical rhythm above them.
const TOOLS: Tool[] = [
  { name: "Claude", src: "/logos/tools/claude.png", w: 288, h: 288, height: 38 },
  { name: "Codex", src: "/logos/tools/codex.png", w: 526, h: 526, height: 38 },
  // The only portrait mark in the row: at the shared 38px height it comes out
  // ~25px wide, so it sits narrower than the square icons on either side.
  { name: "Conductor", src: "/logos/tools/conductor.svg", w: 115, h: 174, height: 38 },
  // Cropped to just the "M" swoosh (muse.png has "Muse" baked into the
  // art below it); the name still reads on hover/tap via the tooltip.
  { name: "Muse", src: "/logos/tools/muse-mark.png", w: 506, h: 341, height: 33 },
  { name: "Granola", src: "/logos/tools/granola.png", w: 409, h: 426, height: 38 },
  { name: "Wispr", src: "/logos/tools/wispr.png", w: 899, h: 892, height: 37 },
  { name: "Linear", src: "/logos/tools/linear.webp", w: 512, h: 512, height: 38 },
  { name: "Flora", src: "/logos/tools/flora.png", w: 534, h: 534, height: 38 },
  { name: "Mobbin", src: "/logos/tools/mobbin.png", w: 409, h: 426, height: 38 },
  { name: "Dribbble", src: "/logos/tools/dribbble.png", w: 2500, h: 2500, height: 38 },
];

export default function ToolsStrip() {
  return (
    <div className={styles.inner}>
      <h3 className={styles.subhead}>Tools in my stack:</h3>
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
