import { useEffect } from "react";
import { Button } from "../button/Button";
import styles from "./SuccessModal.module.css";

function IconSuccessCheck() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
    </svg>
  );
}

export type SuccessModalProps = {
  open: boolean;
  onClose: () => void;
  /** `aria-labelledby` target */
  titleId: string;
  line1: string;
  line2: string;
  primaryLabel: string;
  onPrimary: () => void;
  /** Optional underlined action (e.g. DISMISS under ADD EQUIPMENT UNIT). */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** `full` = wide dark pill (e.g. only DISMISS). `narrow` = smaller pill + optional link. */
  primaryLayout?: "full" | "narrow";
  /** Optional sans-serif lines below the Loubag title (e.g. unit update context). */
  descriptionLine1?: string;
  descriptionLine2?: string;
};

/**
 * Reusable success / confirmation card (green check + two-line Loubag title + Geist Mono CTA).
 */
export function SuccessModal({
  open,
  onClose,
  titleId,
  line1,
  line2,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  primaryLayout = "narrow",
  descriptionLine1,
  descriptionLine2,
}: SuccessModalProps) {
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
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <IconSuccessCheck />
        </div>
        <h2 id={titleId} className={styles.title}>
          {line1}
          <br />
          {line2}
        </h2>
        {descriptionLine1 || descriptionLine2 ? (
          <p className={styles.description}>
            {descriptionLine1}
            {descriptionLine2 ? (
              <>
                <br />
                {descriptionLine2}
              </>
            ) : null}
          </p>
        ) : null}
        <Button
          type="button"
          pill
          size="lg"
          fullWidth={primaryLayout === "full"}
          className={primaryLayout === "full" ? styles.primaryBtn : styles.primaryBtnNarrow}
          onClick={onPrimary}
        >
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary ? (
          <button type="button" className={styles.secondaryLink} onClick={onSecondary}>
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
