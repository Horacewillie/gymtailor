import { useRef, type ReactNode } from "react";
import { MemberMobileCircleNextButton } from "./MemberMobileCircleNextButton";
import { MemberMobilePillButton } from "./MemberMobilePillButton";
import { MemberOnboardingBackButton } from "./MemberOnboardingBackButton";
import { MemberOnboardingProgress } from "./MemberOnboardingProgress";
import { useBindVisualViewportToElement } from "../../hooks/useBindVisualViewportToElement";
import styles from "./MemberOnboardingSetupLayout.module.css";

export type MemberOnboardingSetupLayoutProps = {
  currentStep: number;
  totalSteps: number;
  showBack: boolean;
  onBack: () => void;
  title: ReactNode;
  /** Center title (default) or left-align (e.g. weight / sex). */
  titleAlign?: "center" | "left";
  children: ReactNode;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  circleLabel?: string;
};

/**
 * Shell for the 7-step member setup wizard: back + progress, scroll body, mint pill + circle + domain.
 */
export function MemberOnboardingSetupLayout({
  currentStep,
  totalSteps,
  showBack,
  onBack,
  title,
  titleAlign = "center",
  children,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  circleLabel = "Continue",
}: MemberOnboardingSetupLayoutProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  useBindVisualViewportToElement(shellRef);

  return (
    <div ref={shellRef} className={styles.shell}>
      <div className={styles.safe}>
        <header className={styles.topBar}>
          {showBack ? (
            <MemberOnboardingBackButton onClick={onBack} backLabel="Back" />
          ) : (
            <span className={styles.topBarSpacer} aria-hidden />
          )}
          <div className={styles.progressWrap}>
            <MemberOnboardingProgress current={currentStep} total={totalSteps} />
          </div>
          <span className={styles.topBarSpacer} aria-hidden />
        </header>

        <div className={styles.scroll}>
          <div className={styles.inner}>
            <h1
              id="member-setup-title"
              className={[styles.title, titleAlign === "left" ? styles.titleLeft : ""].filter(Boolean).join(" ")}
            >
              {title}
            </h1>
            {children}
          </div>
        </div>

        <footer className={styles.bottom}>
          <div className={styles.ctaRow}>
            <MemberMobilePillButton
              type="button"
              disabled={Boolean(primaryDisabled)}
              onClick={onPrimary}
            >
              {primaryLabel}
            </MemberMobilePillButton>
            <MemberMobileCircleNextButton
              type="button"
              disabled={Boolean(primaryDisabled)}
              onClick={onPrimary}
              label={circleLabel}
            />
          </div>
          {/* <span className={styles.domainPill}>gymtailor.com</span> */}
        </footer>
      </div>
    </div>
  );
}
