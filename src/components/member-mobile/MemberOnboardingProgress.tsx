import styles from "./MemberOnboardingProgress.module.css";

export type MemberOnboardingProgressProps = {
  /** 1-based index of active step */
  current: number;
  total: number;
};

/** Dots with active step as a mint pill (member setup wizard). */
export function MemberOnboardingProgress({ current, total }: MemberOnboardingProgressProps) {
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const active = step === current;
        return <span key={step} className={active ? styles.pill : styles.dot} aria-hidden />;
      })}
    </div>
  );
}
