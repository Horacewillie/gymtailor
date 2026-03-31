import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./MemberMobilePillButton.module.css";

export type MemberMobilePillButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

/**
 * Member app: full-width pill CTA (neon mint, dark uppercase label).
 * Use inside a flex row with {@link MemberMobileCircleNextButton} for the onboarding pattern.
 */
export function MemberMobilePillButton({
  children,
  className,
  type = "button",
  ...props
}: MemberMobilePillButtonProps) {
  return (
    <button type={type} className={[styles.root, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}
