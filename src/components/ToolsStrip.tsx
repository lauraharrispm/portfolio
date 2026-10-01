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

interface ToolGroup {
  label: string;
  tools: Tool[];
}

// Icon heights are 1.5x the original row (20 -> 30, etc.), per request to
// make the whole strip 50% larger.
const TOOL_GROUPS: ToolGroup[] = [
  {
    label: "Building",
    tools: [
      { name: "Claude", src: "/logos/tools/claude.png", w: 288, h: 288, height: 30 },
      { name: "Claude Code", src: "/logos/tools/claude%20code.png", w: 225, h: 135, height: 24 },
      { name: "Codex", src: "/logos/tools/codex.png", w: 526, h: 526, height: 30 },
      // Cropped to just the "M" swoosh (muse.png has "Muse" baked into the
      // art below it); the name still reads on hover via the tooltip.
      { name: "Muse", src: "/logos/tools/muse-mark.png", w: 506, h: 341, height: 26 },
    ],
  },
  {
    label: "Productivity",
    tools: [
      { name: "Granola", src: "/logos/tools/granola.png", w: 409, h: 426, height: 30 },
      { name: "Wispr", src: "/logos/tools/wispr.png", w: 899, h: 892, height: 29 },
      { name: "Chrome", src: "/logos/tools/chrome.svg", w: 512, h: 512, height: 30 },
      { name: "Linear", src: "/logos/tools/linear.webp", w: 512, h: 512, height: 30 },
    ],
  },
  {
    label: "Design",
    tools: [
      { name: "Flora", src: "/logos/tools/flora.png", w: 534, h: 534, height: 30 },
      { name: "Mobbin", src: "/logos/tools/mobbin.png", w: 409, h: 426, height: 30 },
      { name: "Dribbble", src: "/logos/tools/dribbble.png", w: 2500, h: 2500, height: 30 },
    ],
  },
];

export default function ToolsStrip() {
  return (
    <div className={styles.inner}>
      <h3 className={styles.subhead}>Tools in my stack</h3>
      <div className={styles.groups}>
        {TOOL_GROUPS.map((group) => (
          <div className={styles.group} key={group.label}>
            <p className={styles.groupLabel}>{group.label}</p>
            <ul className={styles.row}>
              {group.tools.map((tool) => (
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
        ))}
      </div>
    </div>
  );
}
