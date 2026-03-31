import styles from "./MemberOnboardingHeader.module.css";
import { MemberOnboardingBackButton } from "./MemberOnboardingBackButton";
import { MemberOnboardingSignInRow } from "./MemberOnboardingSignInRow";

export type MemberOnboardingHeaderProps = {
  onBack: () => void;
  backLabel?: string;
  showSignIn?: boolean;
};

/**
 * Member onboarding top bar: back control + optional “Already registered? SIGN IN” on the right.
 */
export function MemberOnboardingHeader({
  onBack,
  backLabel = "Back",
  showSignIn = true,
}: MemberOnboardingHeaderProps) {
  return (
    <header className={styles.bar}>
      <MemberOnboardingBackButton onClick={onBack} backLabel={backLabel} />
      {showSignIn ? (
        <div className={styles.right}>
          <MemberOnboardingSignInRow align="end" compact />
        </div>
      ) : null}
    </header>
  );
}
