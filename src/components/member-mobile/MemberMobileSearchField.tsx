import type { InputHTMLAttributes } from "react";
import styles from "./MemberMobileSearchField.module.css";

export type MemberMobileSearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  className?: string;
  /** Wrapper class (e.g. layout spacing). */
  wrapClassName?: string;
};

/**
 * Rounded search field with grey border that highlights mint on focus (member onboarding).
 */
export function MemberMobileSearchField({
  className,
  wrapClassName,
  type = "text",
  autoComplete = "off",
  ...props
}: MemberMobileSearchFieldProps) {
  return (
    <div className={[styles.wrap, wrapClassName].filter(Boolean).join(" ")}>
      <input className={[styles.input, className].filter(Boolean).join(" ")} type={type} autoComplete={autoComplete} {...props} />
    </div>
  );
}
