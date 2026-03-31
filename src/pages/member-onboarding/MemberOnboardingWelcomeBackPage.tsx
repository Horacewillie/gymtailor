import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MemberMobileCircleNextButton,
  MemberMobilePillButton,
  MemberMobileSearchField,
} from "../../components/member-mobile";
import { useBindVisualViewportToElement } from "../../hooks/useBindVisualViewportToElement";
import styles from "./MemberOnboardingWelcomeBackPage.module.css";

type WelcomeBackState = { email?: string; gymName?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * After plan-loading: returning member sign-in (email + continue).
 * Route: `/member/onboarding/welcome-back`.
 */
export function MemberOnboardingWelcomeBackPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const incoming = (state as WelcomeBackState | null) ?? {};
  const [email, setEmail] = useState(() => incoming.email?.trim() ?? "");

  const shellRef = useRef<HTMLDivElement>(null);
  useBindVisualViewportToElement(shellRef);

  const canContinue = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const gymName = incoming.gymName ?? "";

  const onContinue = useCallback(() => {
    if (!canContinue) return;
    navigate("/member/onboarding/sent", {
      state: { email: email.trim(), gymName },
    });
  }, [canContinue, email, gymName, navigate]);

  const onFindGym = useCallback(() => {
    navigate("/member/onboarding/gym");
  }, [navigate]);

  return (
    <div ref={shellRef} className={styles.shell}>
      <div className={styles.safe}>
        <div className={styles.scroll}>
          <div className={styles.inner}>
            <h1 className={styles.title}>Welcome back!</h1>
            <p className={styles.lead}>
              Sign in with your registered email address to resume your workout.
            </p>

            <MemberMobileSearchField
              wrapClassName={styles.field}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
            />

            <div className={styles.ctaRow}>
              <MemberMobilePillButton type="button" disabled={!canContinue} onClick={onContinue}>
                CONTINUE
              </MemberMobilePillButton>
              <MemberMobileCircleNextButton
                type="button"
                disabled={!canContinue}
                onClick={onContinue}
                label="Continue"
              />
            </div>

            <p className={styles.findGym}>
              <span className={styles.findGymMuted}>New here? </span>
              <button type="button" className={styles.findGymLink} onClick={onFindGym}>
                FIND YOUR GYM
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
