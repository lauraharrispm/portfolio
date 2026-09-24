"use client";

import { useId, useState } from "react";
import styles from "./Toggle.module.css";

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function Toggle({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = `toggle-panel-${useId()}`;

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <span
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>
      <div id={panelId} className={styles.panelOuter} data-open={open}>
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}
