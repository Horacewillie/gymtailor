import membersHeroPhoto from "../../assets/member-homescreen.jpg";
import { useNavigate } from "react-router-dom";
import {
  MemberMobileCircleNextButton,
  MemberMobilePillButton,
  MemberOnboardingSignInRow,
} from "../../components/member-mobile";
import styles from "./MemberOnboardingWelcomePage.module.css";

/**
 * Member app — first onboarding screen (mobile-first).
 * Route: `/member` (see App.tsx).
 * Hero: `member-homescreen.jpg` (photo-only; HTML wordmark is separate).
 */
export function MemberOnboardingWelcomePage() {
  const navigate = useNavigate();
  const goFindGym = () => navigate("/member/onboarding/gym");

  return (
    <div className={styles.screenOuter}>
      <div className={styles.screen}>
        <div
          className={styles.photo}
          style={{ backgroundImage: `url(${membersHeroPhoto})` }}
          aria-hidden
        />
        <div className={styles.scrim} aria-hidden />

        <div className={styles.safe}>
          <div className={styles.main}>
            <div className={styles.heroBand}>
              <p className={styles.wordmark}>
                GYM <span className={styles.wordmarkTailor}>TAILOR</span>
              </p>

              <h1 className={styles.headline}>
                <span className={styles.headlineLine}>Workout plans</span>
                <span className={styles.headlineLine}>built for your gym</span>
                <span className={styles.headlineLine}>and your body</span>
                <span className={styles.headlineLine}>goals</span>
              </h1>
            </div>

            <div className={styles.ctaBlock}>
              <div className={styles.ctaRow}>
                <MemberMobilePillButton type="button" onClick={goFindGym}>
                  FIND YOUR GYM
                </MemberMobilePillButton>
                <MemberMobileCircleNextButton type="button" onClick={goFindGym} />
              </div>

              <MemberOnboardingSignInRow />
            </div>

            <div className={styles.bottomSpacer} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
