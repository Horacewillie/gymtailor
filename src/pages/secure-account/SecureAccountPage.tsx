import { useNavigate } from "react-router-dom";
import styles from "./SecureAccountPage.module.css";
import { Button } from "../../components/button/Button";
import { AuthHeader } from "../../components/auth-header/AuthHeader";

/**
 * Static QR illustration to match the design without needing a QR generator dependency.
 * (In production this would be replaced by a real QR generated from a 2FA secret.)
 */
function QrGlyph(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 92 92"
      role="img"
      aria-label="QR code"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="92" height="92" rx="10" fill="#fff" />
      <g fill="#101417">
        <rect x="10" y="10" width="22" height="22" rx="2" />
        <rect x="14" y="14" width="14" height="14" rx="2" fill="#fff" />
        <rect x="18" y="18" width="6" height="6" rx="1" />

        <rect x="60" y="10" width="22" height="22" rx="2" />
        <rect x="64" y="14" width="14" height="14" rx="2" fill="#fff" />
        <rect x="68" y="18" width="6" height="6" rx="1" />

        <rect x="10" y="60" width="22" height="22" rx="2" />
        <rect x="14" y="64" width="14" height="14" rx="2" fill="#fff" />
        <rect x="18" y="68" width="6" height="6" rx="1" />

        {/* pseudo data modules */}
        <rect x="38" y="14" width="4" height="4" rx="1" />
        <rect x="46" y="14" width="4" height="4" rx="1" />
        <rect x="42" y="18" width="4" height="4" rx="1" />
        <rect x="38" y="22" width="4" height="4" rx="1" />
        <rect x="50" y="22" width="4" height="4" rx="1" />

        <rect x="38" y="34" width="4" height="4" rx="1" />
        <rect x="46" y="34" width="4" height="4" rx="1" />
        <rect x="54" y="34" width="4" height="4" rx="1" />
        <rect x="42" y="38" width="4" height="4" rx="1" />
        <rect x="50" y="38" width="4" height="4" rx="1" />

        <rect x="34" y="46" width="4" height="4" rx="1" />
        <rect x="42" y="46" width="4" height="4" rx="1" />
        <rect x="50" y="46" width="4" height="4" rx="1" />
        <rect x="58" y="46" width="4" height="4" rx="1" />

        <rect x="38" y="54" width="4" height="4" rx="1" />
        <rect x="46" y="54" width="4" height="4" rx="1" />
        <rect x="54" y="54" width="4" height="4" rx="1" />

        <rect x="38" y="62" width="4" height="4" rx="1" />
        <rect x="46" y="62" width="4" height="4" rx="1" />
        <rect x="54" y="62" width="4" height="4" rx="1" />
        <rect x="62" y="62" width="4" height="4" rx="1" />

        <rect x="38" y="70" width="4" height="4" rx="1" />
        <rect x="46" y="70" width="4" height="4" rx="1" />
        <rect x="58" y="70" width="4" height="4" rx="1" />
        <rect x="66" y="70" width="4" height="4" rx="1" />
      </g>
    </svg>
  );
}

export function SecureAccountPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <AuthHeader variant="dashboard" userInitial="J" />

      <main className={styles.main}>
        <section className={styles.shell}>
          <div className={styles.left}>
            <h1 className={styles.title}>
              Secure your
              <br />
              account
            </h1>
            <p className={styles.subtitle}>
              Add an extra layer of security to your
              <br />
              account by enabling two-factor
              <br />
              authentication (2FA).
            </p>
          </div>

          <div className={styles.right} aria-label="Setup steps">
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.stepNum}>1.</span>
                <span className={styles.stepTitle}>DOWNLOAD AN AUTHENTICATION APP</span>
              </div>
              <p className={styles.cardBody}>
                Install Google Authenticator, Authy or Microsoft Authenticator from
                the Google Play Store or Apple Store on your phone.
              </p>
            </section>

            <section className={styles.card}>
              <div className={styles.cardTopRow}>
                <div className={styles.cardTopLeft}>
                  <div className={styles.cardHead}>
                    <span className={styles.stepNum}>2.</span>
                    <span className={styles.stepTitle}>SCAN QR CODE</span>
                  </div>
                  <p className={styles.cardBody}>
                    On the authenticator app, select the option to add a new account and
                    scan the QR Code below to get verification codes.
                  </p>
                </div>

                <QrGlyph className={styles.qr} />
              </div>

              <p className={styles.muted}>
                Alternatively, enter the setup key
                <br />
                below manually:
              </p>

              <div className={styles.keyRow}>
                <code className={styles.key}>X9Z4-7QW2-3ER8-3ER8</code>
                <button type="button" className={styles.copyBtn} aria-label="Copy setup key">
                  {/* UI-only (no clipboard wiring yet). */}
                  <span className={styles.copyIcon} aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.stepNum}>3.</span>
                <span className={styles.stepTitle}>ENTER VERIFICATION CODE</span>
              </div>
              <p className={styles.cardBody}>
                Enter the 6-digit code from your authenticator app to complete setup.
              </p>

              <div className={styles.actions}>
                <input
                  className={styles.codeInput}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="345-149"
                  aria-label="Verification code"
                />
                <Button
                  type="button"
                  pill
                  size="sm"
                  tracking="wide"
                  // Next onboarding step (gym details).
                  onClick={() => navigate("/onboarding/gym-setup")}
                >
                  SUBMIT
                </Button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

