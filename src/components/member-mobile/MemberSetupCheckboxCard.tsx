import type { ReactNode } from "react";
import styles from "./MemberSetupCheckboxCard.module.css";

function BoxCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M11.5 3.5L5.25 9.75 2.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type MemberSetupCheckboxCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function MemberSetupCheckboxCard({ label, selected, onClick }: MemberSetupCheckboxCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={[styles.card, selected ? styles.cardSelected : ""].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      <span
        className={[styles.box, selected ? styles.boxSelected : ""].filter(Boolean).join(" ")}
        aria-hidden
      >
        {selected ? <BoxCheckIcon className={styles.check} /> : null}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}

export function MemberSetupCheckboxStack({ children }: { children: ReactNode }) {
  return (
    <div className={styles.stack} role="group">
      {children}
    </div>
  );
}
