import styles from "./MemberBarsBallLoader.module.css";

/** Decorative loader — same structure as admin onboarding loading (green bars, white ball for member). */
export function MemberBarsBallLoader({ className }: { className?: string }) {
  return (
    <div className={[styles.anim, className].filter(Boolean).join(" ")} aria-hidden>
      <span className={styles.barLeft} />
      <span className={styles.ball} />
      <span className={styles.barRight} />
    </div>
  );
}
