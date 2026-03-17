import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...props }: ButtonProps) {
  const classes = className ? `${styles.button} ${className}` : styles.button;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
