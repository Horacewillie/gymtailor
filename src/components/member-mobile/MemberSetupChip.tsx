import type { ReactNode } from "react";
import styles from "./MemberSetupChip.module.css";

function ChipCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 4L6.5 10.5 3 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type MemberSetupChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function MemberSetupChip({ label, selected, onClick }: MemberSetupChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, selected ? styles.chipSelected : ""].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-pressed={selected}
    >
      {selected ? <ChipCheckIcon className={styles.check} /> : null}
      {label}
    </button>
  );
}

/** Wrap chips for goals step — centered wrapping rows. */
export function MemberSetupChipRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
