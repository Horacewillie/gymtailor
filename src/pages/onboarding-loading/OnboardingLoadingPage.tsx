import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import styles from "./OnboardingLoadingPage.module.css";

import Api from "../../api/Api";

export function OnboardingLoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const api = new Api();
    const timer = setTimeout(async () => {
      let dashboardData = undefined;
      try {
      
        const token = localStorage.getItem('token');
        console.log("Token in localStorage:", token);
        dashboardData = await api.get("/api/dashboard", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      } catch (err) {
        // Ignore error, just proceed
      } finally {
        if (isMounted) {
          navigate("/dashboard", { replace: true, state: { dashboardData } });
        }
      }
    }, 2200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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
