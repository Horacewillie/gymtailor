import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import styles from "./OnboardingLoadingPage.module.css";

export function OnboardingLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | null)?.email ?? "";

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        navigate("/onboarding/request-magic-link", {
          replace: true,
          state: { email: emailFromState },
        });
      }
    }, 2200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [emailFromState, navigate]);

  return (
    <div className={styles.page}>
      <AuthHeader variant="dashboard" userInitial="J" />

      <main className={styles.main} aria-label="Setting up account">
        <div className={styles.center}>
          {/* Purely decorative animation; hidden from assistive tech. */}
          <div className={styles.anim} aria-hidden="true">
            <span className={styles.barLeft} />
            <span className={styles.ball} />
            <span className={styles.barRight} />
          </div>
          <h1 className={styles.title}>We are setting up your account...</h1>
        </div>
      </main>
    </div>
  );
}
