import type { ButtonHTMLAttributes } from "react";
import styles from "./MemberOnboardingSignInRow.module.css";

export type MemberOnboardingSignInRowProps = {
  /** “Already registered?” row centered (welcome) or end-aligned (onboarding header). */
  align?: "center" | "end";
  /** Slightly smaller type for the top app bar. */
  compact?: boolean;
  className?: string;
  signInProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

/**
 * “Already registered? SIGN IN” — shared copy/styles for member onboarding screens.
 */
export function MemberOnboardingSignInRow({
  align = "center",
  compact = false,
  className,
  signInProps,
}: MemberOnboardingSignInRowProps) {
  return (
    <p
      className={[
        styles.root,
        align === "end" ? styles.rootAlignEnd : styles.rootAlignCenter,
        compact ? styles.compact : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.muted}>Already registered? </span>
      <button type="button" className={styles.link} {...signInProps}>
        SIGN IN
      </button>
    </p>
  );
}
