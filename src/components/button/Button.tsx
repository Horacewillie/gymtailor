import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Visual style only (colors/border). Keep behavior in consumers.
     * Default is "primary" to match the onboarding CTAs.
     */
    variant?: Variant;
    /** Size controls padding/height and font sizing. */
    size?: Size;
    /** Common design motif across the app (rounded "pill" CTAs). */
    pill?: boolean;
    /** Convenience for forms where CTA should span the card width. */
    fullWidth?: boolean;
    /**
     * Dashboard/onboarding buttons use a distinct tracking style (Geist Mono look).
     * "wide" is the default to match the design system used across screens.
     */
    tracking?: "tight" | "wide";
  }
>;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  pill = false,
  fullWidth = false,
  tracking = "wide",
  disabled,
  ...props
}: ButtonProps) {
  // Build a predictable class list so consumers can override via `className`
  // without having to remember internal module class ordering.
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    pill ? styles.pill : "",
    fullWidth ? styles.fullWidth : "",
    tracking === "wide" ? styles.trackingWide : styles.trackingTight,
    disabled ? styles.disabled : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
