import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberMobileSearchField } from "../../components/member-mobile";
import { MemberOnboardingStepLayout } from "./MemberOnboardingStepLayout";
import stepStyles from "./MemberOnboardingStepLayout.module.css";
import styles from "./MemberOnboardingGymPage.module.css";

/**
 * Member onboarding — step 1: choose gym (search).
 * Route: `/member/onboarding/gym`.
 */
export function MemberOnboardingGymPage() {
  const navigate = useNavigate();
  const [gymQuery, setGymQuery] = useState("");

  const canContinue = useMemo(() => gymQuery.trim().length > 0, [gymQuery]);

  const goBack = useCallback(() => {
    navigate("/member");
  }, [navigate]);

  const goNext = useCallback(() => {
    if (!canContinue) return;
    navigate("/member/onboarding/confirm");
  }, [canContinue, navigate]);

  return (
    <MemberOnboardingStepLayout
      onBack={goBack}
      title="Which gym do you train at?"
      lead={
        <>
          Your workouts are built around your gym&apos;s actual equipment. Start by selecting where
          you train.
        </>
      }
      primaryCtaLabel="CONTINUE"
      primaryCtaDisabled={!canContinue}
      onPrimaryCta={goNext}
      circleNextLabel="Continue to next step"
    >
      <MemberMobileSearchField
        wrapClassName={stepStyles.field}
        value={gymQuery}
        onChange={(e) => setGymQuery(e.target.value)}
        placeholder="Search gym name"
        aria-label="Search gym name"
      />

      {canContinue ? (
        <div className={styles.info}>
          <svg className={styles.infoIcon} viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M10 2a8 8 0 110 16 8 8 0 010-16zM10 4.5v6M10 13.5h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className={styles.infoText}>Members of this gym can join Gym Tailor.</p>
        </div>
      ) : null}
    </MemberOnboardingStepLayout>
  );
}
