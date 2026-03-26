import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

function IconClose() {
  return (
    <svg className={styles.closeIconSvg} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4l4.9-4.9-4.9-4.9a1 1 0 0 1 1.4-1.4l4.9 4.9 4.9-4.9a1 1 0 0 1 1.4 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Main content (form fields, etc.). */
  children: ReactNode;
  /** Sticky footer row (e.g. Cancel + Save). */
  footer?: ReactNode;
  /** For `aria-labelledby`. */
  titleId: string;
  /** `lg` = wide form; `sm` = compact (e.g. CSV import). */
  size?: "md" | "lg" | "sm";
  /** Optional title style (e.g. Loubag serif on confirm dialogs). */
  titleClassName?: string;
  /** `end` = footer actions aligned to the right (e.g. Cancel + destructive). */
  footerAlign?: "default" | "end";
};

function cardClassForSize(size: ModalProps["size"]) {
  if (size === "lg") return styles.cardWide;
  if (size === "sm") return styles.cardSm;
  return styles.card;
}

/**
 * Accessible modal shell: overlay click + Escape close.
 * Does not include form styling — pass page-level `className` wrappers inside children if needed.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  titleId,
  size = "md",
  titleClassName,
  footerAlign = "default",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cardClassForSize(size)}>
        <div className={styles.header}>
          <h2 id={titleId} className={[styles.title, titleClassName].filter(Boolean).join(" ")}>
            {title}
          </h2>
          <button type="button" className={styles.closeBtn} aria-label="Close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? (
          <div
            className={[styles.footer, footerAlign === "end" ? styles.footerEnd : ""].filter(Boolean).join(" ")}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
