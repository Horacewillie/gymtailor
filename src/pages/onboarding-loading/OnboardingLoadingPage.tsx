import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import styles from "./OnboardingLoadingPage.module.css";

export function OnboardingLoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Intentional short delay: allows the onboarding "completion" animation
    // to play before landing on the dashboard.
    const id = window.setTimeout(() => navigate("/dashboard", { replace: true }), 2200);
    return () => window.clearTimeout(id);
  }, [navigate]);

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

