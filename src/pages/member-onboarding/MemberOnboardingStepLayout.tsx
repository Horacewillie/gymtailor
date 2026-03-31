import { useRef, type ReactNode } from "react";
import {
  MemberMobileCircleNextButton,
  MemberMobilePillButton,
  MemberOnboardingHeader,
} from "../../components/member-mobile";
import { useBindVisualViewportToElement } from "../../hooks/useBindVisualViewportToElement";
import styles from "./MemberOnboardingStepLayout.module.css";

export type MemberOnboardingStepLayoutProps = {
  onBack: () => void;
  /** Rendered above the title (e.g. illustration). */
  preTitle?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  /** When set, replaces the mint pill + circle row (domain pill always shows below). */
  customFooter?: ReactNode;
  primaryCtaLabel?: string;
  primaryCtaDisabled?: boolean;
  onPrimaryCta?: () => void;
  circleNextLabel?: string;
};

/**
 * Shared shell for member onboarding steps (visual viewport, top bar, centered stack, CTA row).
 */
export function MemberOnboardingStepLayout({
  onBack,
  preTitle,
  title,
  lead,
  children,
  customFooter,
  primaryCtaLabel,
  primaryCtaDisabled,
  onPrimaryCta,
  circleNextLabel = "Next",
}: MemberOnboardingStepLayoutProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  useBindVisualViewportToElement(shellRef);

  return (
    <div ref={shellRef} className={styles.shell}>
      <div className={styles.safe}>
        <div className={styles.topBar}>
          <MemberOnboardingHeader onBack={onBack} />
        </div>

        <div className={styles.centerColumn}>
          <div className={styles.centerInner}>
            <main className={styles.main}>
              {preTitle != null ? <div className={styles.preTitle}>{preTitle}</div> : null}
              <h1 className={styles.title}>{title}</h1>
              {lead != null ? <div className={styles.lead}>{lead}</div> : null}
              {children}
            </main>

            <footer className={styles.bottom}>
              {customFooter != null ? (
                customFooter
              ) : (
                <div className={styles.ctaRow}>
                  <MemberMobilePillButton
                    type="button"
                    disabled={Boolean(primaryCtaDisabled)}
                    onClick={onPrimaryCta}
                  >
                    {primaryCtaLabel}
                  </MemberMobilePillButton>
                  <MemberMobileCircleNextButton
                    type="button"
                    disabled={Boolean(primaryCtaDisabled)}
                    onClick={onPrimaryCta}
                    label={circleNextLabel}
                  />
                </div>
              )}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
