export type ResultIconKind = "check" | "trend";

// Same plain inline-SVG, coral-line-icon treatment used elsewhere on the
// site (see HowIWork's AIIcon): replaces the raw 📈/✅ emoji that used to
// prefix each results-list line, which rendered inconsistently across
// platforms and didn't match the brand's line-icon style.
export default function ResultIcon({ kind, className }: { kind: ResultIconKind; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--coral)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {kind === "check" ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </>
      ) : (
        <>
          <path d="M3 17 9 11 13 15 21 7" />
          <path d="M15 7h6v6" />
        </>
      )}
    </svg>
  );
}
