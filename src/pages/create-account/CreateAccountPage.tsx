import styles from "./CreateAccountPage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import { StepDots } from "../../components/onboarding/StepDots";
import { useEffect, useMemo, useState } from "react";
import { useOnboarding } from "../../app/OnboardingContext";
import { API_BASE_URL } from "../../api/Api";

export function CreateAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { invitationId: invitationIdParam } = useParams<{ invitationId?: string }>();

  const { setData } = useOnboarding();

  // Controlled inputs so we can gate the CTA and preserve typed values across renders.
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canContinue = useMemo(() => {
    // Simple required-field gating. Keep validation light until backend rules are defined.
    return email.trim().length > 0 && fullName.trim().length > 0 && agreed;
  }, [email, fullName, agreed]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const signature = params.get("signature")?.trim() ?? "";
    const expires = params.get("expires")?.trim() ?? "";
    const invitationIdFromQuery = params.get("invitation_id")?.trim() ?? params.get("id")?.trim() ?? "";
    const invitationId = (invitationIdParam ?? invitationIdFromQuery).trim();

    if (!invitationId || !signature || !expires) return;

    const canonicalInvitationUrl = `${API_BASE_URL}/api/invitation/${encodeURIComponent(
      invitationId,
    )}/view?expires=${encodeURIComponent(expires)}&signature=${encodeURIComponent(signature)}`;

    localStorage.setItem("pendingInvitationId", invitationId);
    localStorage.setItem("pendingInvitationSignature", signature);
    localStorage.setItem("pendingInvitationExpires", expires);
    localStorage.setItem("pendingInvitationUrl", canonicalInvitationUrl);
  }, [invitationIdParam, location.search]);

  return (
    <div className={styles.page}>
      <AuthHeader variant="auth" />

      <main className={styles.main}>
        <section className={styles.shell}>
          <div className={styles.left}>
            <StepDots
              current={1}
              total={3}
              containerClassName={styles.stepDots}
              activeDotClassName={styles.dotActive}
              dotClassName={styles.dot}
            />
            <h1 className={styles.title}>
              Create owner
              <br />
              account.
            </h1>
            <p className={styles.subtitle}>
              This account gives you access to
              <br />
              manage your gym and members.
            </p>
          </div>

          <div className={styles.right}>
            <section className={styles.card} aria-label="Create owner account form">
              <form className={styles.form}>
                <label className={styles.label} htmlFor="email">
                  WORK EMAIL
                </label>
                <input
                  className={styles.input}
                  id="email"
                  type="email"
                  placeholder="jeremy@ifitness.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    // Capture early; keeps behavior consistent with other onboarding pages.
                    const next = e.currentTarget.value;
                    setEmail(next);
                  }}
                />

                <label className={styles.label} htmlFor="fullName">
                  FULL NAME
                </label>
                <input
                  className={styles.input}
                  id="fullName"
                  type="text"
                  placeholder="Enter your first name and last name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setFullName(next);
                  }}
                />

                <label className={styles.checkboxRow}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      const next = e.currentTarget.checked;
                      setAgreed(next);
                    }}
                  />
                  <span>
                    I agree to Gym Tailor&apos;s{" "}
                    <a href="#" className={styles.link}>
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className={styles.link}>
                      Terms of Service
                    </a>
                  </span>
                </label>

                <Button
                  type="button"
                  fullWidth
                  pill
                  size="lg"
                  disabled={!canContinue}
                  // Next onboarding step.
                  onClick={() => {
                    const [first_name, ...lastNameParts] = fullName.trim().split(" ");
                    setData({
                      email,
                      first_name: first_name || "",
                      last_name: lastNameParts.join(" ") || "",
                    });
                    navigate("/onboarding/secure-account");
                  }}
                >
                  CONTINUE
                </Button>
              </form>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
