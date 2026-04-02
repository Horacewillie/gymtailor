import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/Api";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import { Button } from "../../components/button/Button";
import styles from "./MagicLoginPage.module.css";

export function MagicLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const api = useMemo(() => apiClient, []);
  const prefetchedEmail = (location.state as { email?: string } | null)?.email ?? "";
  const callbackError = (location.state as { error?: string } | null)?.error ?? "";

  const [email, setEmail] = useState(prefetchedEmail);
  const [error, setError] = useState(callbackError);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authenticatedInitial, setAuthenticatedInitial] = useState<string | null>(null);

  const canContinue = email.trim().length > 0;

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const status = await api.get<any>("/api/authentication-status");
        if (!mounted) return;

        const user = status?.user;
        const isAuthenticated = Boolean(status?.authenticated ?? user);
        if (!isAuthenticated) {
          setAuthenticatedInitial(null);
          return;
        }

        const name = String(user?.name ?? user?.first_name ?? "").trim();
        if (name) {
          setAuthenticatedInitial(name.slice(0, 1).toUpperCase());
          return;
        }

        const emailFallback = String(user?.email ?? "").trim();
        setAuthenticatedInitial(emailFallback ? emailFallback.slice(0, 1).toUpperCase() : "U");
      } catch {
        if (mounted) setAuthenticatedInitial(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [api]);

  return (
    <div className={styles.page}>
      <AuthHeader
        variant="dashboard"
        showUserInitial={authenticatedInitial !== null}
        userInitial={authenticatedInitial ?? "U"}
      />

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>
            Enter your register email address to access your Gym Tailor account.
          </p>
        </div>

        <section className={styles.card} aria-label="Magic login">
          <div className={styles.fieldWrap}>
            <label className={styles.label} htmlFor="magic-login-email">
              EMAIL ADDRESS
            </label>
            <input
              id="magic-login-email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="name@email.com"
              autoComplete="email"
            />
          </div>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          {success ? <p className={styles.success}>{success}</p> : null}

          <div className={styles.ctaWrap}>
            <Button
              type="button"
              pill
              size="sm"
              className={styles.cta}
              disabled={!canContinue || isSubmitting}
              onClick={() => {
                if (!canContinue || isSubmitting) return;
                void (async () => {
                  setError("");
                  setSuccess("");
                  setIsSubmitting(true);
                  try {
                    await api.csrfCookie("/sanctum/csrf-cookie");
                    await api.post("/api/magic-login", {
                      email: email.trim(),
                    });
                    setSuccess("Magic link sent. Check your email and open the link to continue.");
                  } catch {
                    setError("Could not continue. Please check the email and try again.");
                  } finally {
                    setIsSubmitting(false);
                  }
                })();
              }}
            >
              {isSubmitting ? "PLEASE WAIT..." : "CONTINUE"}
            </Button>
          </div>

          <div className={styles.inlineHint}>
            Already got the email link?{" "}
            <button type="button" className={styles.inlineLink} onClick={() => navigate("/magic-login")}>
              Open magic link route
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
