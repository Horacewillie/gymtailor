import type { ReactNode } from "react";
import styles from "./MemberSetupRadioCard.module.css";

export type MemberSetupRadioCardProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  value: string;
};

export function MemberSetupRadioCard({
  title,
  subtitle,
  selected,
  onClick,
  value,
}: MemberSetupRadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-value={value}
      className={[styles.card, selected ? styles.cardSelected : ""].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      <span
        className={[styles.radioOuter, selected ? styles.radioOuterSelected : ""].filter(Boolean).join(" ")}
        aria-hidden
      >
        {selected ? <span className={styles.radioInner} /> : null}
      </span>
      <span className={styles.textBlock}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
    </button>
  );
}

export function MemberSetupRadioStack({ children }: { children: ReactNode }) {
  return <div className={styles.stack} role="radiogroup">{children}</div>;
}
