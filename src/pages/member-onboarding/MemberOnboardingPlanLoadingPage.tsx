import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberBarsBallLoader } from "../../components/member-mobile";
import { useBindVisualViewportToElement } from "../../hooks/useBindVisualViewportToElement";
import styles from "./MemberOnboardingPlanLoadingPage.module.css";

export const MEMBER_PLAN_LOADING_DEFAULT_GYM = "i-Fitness Gym & Wellness Center, Ikeja.";

type PlanLoadingState = {
  email?: string;
  gymName?: string;
};

const REDIRECT_MS = 3200;

/**
 * Post–setup: “Creating your first workout plan” loading (member theme).
 * Route: `/member/onboarding/plan-loading`.
 */
export function MemberOnboardingPlanLoadingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, gymName } = (state as PlanLoadingState | null) ?? {};

  const resolvedGym = useMemo(
    () => (gymName?.trim() ? gymName.trim() : MEMBER_PLAN_LOADING_DEFAULT_GYM),
    [gymName],
  );

  const passThrough = useMemo(
    () => ({ email: email ?? "", gymName: gymName ?? "" }),
    [email, gymName],
  );

  const shellRef = useRef<HTMLDivElement>(null);
  useBindVisualViewportToElement(shellRef);

  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(() => {
      if (alive) navigate("/member/onboarding/welcome-back", { replace: true, state: passThrough });
    }, REDIRECT_MS);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [navigate, passThrough]);

  return (
    <div ref={shellRef} className={styles.shell}>
      <div className={styles.safe}>
        <main className={styles.main} aria-busy="true" aria-live="polite" aria-label="Creating your workout plan">
          <div className={styles.center}>
            <div className={styles.loaderSlot}>
              <MemberBarsBallLoader />
            </div>
            <h1 className={styles.title}>Creating your first workout plan</h1>
            <p className={styles.body}>
              {"We\u2019re matching your "}
              <strong className={styles.bodyStrong}>goals</strong>
              {" with the equipment available at "}
              <strong className={styles.bodyStrong}>{resolvedGym}</strong>
            </p>
            <p className={styles.note}>This may take up to a minute.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
