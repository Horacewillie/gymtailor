import type { ButtonHTMLAttributes } from "react";
import styles from "./MemberMobileCircleNextButton.module.css";

export type MemberMobileCircleNextButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Accessible label; defaults to “Next”. */
  label?: string;
};

/**
 * Member app: circular white control with a right arrow (paired with {@link MemberMobilePillButton}).
 */
export function MemberMobileCircleNextButton({
  className,
  type = "button",
  label = "Next",
  ...props
}: MemberMobileCircleNextButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...props}
    >
      <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h12M15 8l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
