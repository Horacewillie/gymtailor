import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberMobileSearchField } from "../../components/member-mobile";
import { MemberOnboardingStepLayout } from "./MemberOnboardingStepLayout";
import stepStyles from "./MemberOnboardingStepLayout.module.css";

/**
 * Member onboarding — confirm identity / email for magic link.
 * Route: `/member/onboarding/confirm`.
 */
type ConfirmLocationState = { email?: string; gymName?: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MemberOnboardingConfirmPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const prefilled = (state as ConfirmLocationState | null)?.email ?? "";
  const gymName = (state as ConfirmLocationState | null)?.gymName ?? "";
  const [email, setEmail] = useState(prefilled);

  /* Match gym step: enable CTAs as soon as the field has a valid email */
  const canSubmit = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const goBack = useCallback(() => {
    navigate("/member/onboarding/gym");
  }, [navigate]);

  const goNext = useCallback(() => {
    if (!canSubmit) return;
    navigate("/member/onboarding/sent", {
      state: { email: email.trim(), gymName },
    });
  }, [canSubmit, email, gymName, navigate]);

  return (
    <MemberOnboardingStepLayout
      onBack={goBack}
      title={"Confirm it\u2019s you"}
      lead={
        <>
          We&apos;ll send a secure sign-in link to the email your gym has on record.
        </>
      }
      primaryCtaLabel="SEND SIGN-IN LINK"
      primaryCtaDisabled={!canSubmit}
      onPrimaryCta={goNext}
      circleNextLabel="Send sign-in link"
    >
      <MemberMobileSearchField
        wrapClassName={stepStyles.field}
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address"
      />
    </MemberOnboardingStepLayout>
  );
}
