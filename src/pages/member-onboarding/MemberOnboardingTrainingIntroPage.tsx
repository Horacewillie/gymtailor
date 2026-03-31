import { useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberMobileCircleNextButton, MemberMobilePillButton } from "../../components/member-mobile";
import { useBindVisualViewportToElement } from "../../hooks/useBindVisualViewportToElement";
import { firstNameFromEmail } from "./firstNameFromEmail";
import styles from "./MemberOnboardingTrainingIntroPage.module.css";

type TrainingIntroState = { email?: string };

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M16.25 5.625L8.125 13.75 3.75 9.375"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BULLETS = [
  "Your goals",
  "Your experience",
  "The equipment available in your gym",
] as const;

/**
 * Post sign-in: orient the member before workout setup (left-aligned column, max 402px).
 * Route: `/member/onboarding/training-intro` — optional `location.state.email` for greeting.
 */
export function MemberOnboardingTrainingIntroPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const shellRef = useRef<HTMLDivElement>(null);
  useBindVisualViewportToElement(shellRef);

  const email = (state as TrainingIntroState | null)?.email ?? "";
  const firstName = useMemo(() => (email ? firstNameFromEmail(email) : "there"), [email]);

  const startSetup = useCallback(() => {
    navigate("/member/onboarding/setup/1", { state: { email } });
  }, [email, navigate]);

  return (
    <div ref={shellRef} className={styles.shell}>
      <div className={styles.safe}>
        <div className={styles.scroll}>
          <div className={styles.content}>
            <p className={styles.greeting}>Hi {firstName}!</p>
            <h1 className={styles.title}>{"Let\u2019s tailor your training"}</h1>
            <p className={styles.tagline}>Every workout you get here is built around:</p>
            <ul className={styles.list}>
              {BULLETS.map((line) => (
                <li key={line} className={styles.listItem}>
                  <CheckIcon className={styles.checkIcon} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className={styles.footerBlock}>
              <div className={styles.ctaRow}>
                <MemberMobilePillButton type="button" onClick={startSetup}>
                  START SETUP
                </MemberMobilePillButton>
                <MemberMobileCircleNextButton type="button" onClick={startSetup} label="Start setup" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
