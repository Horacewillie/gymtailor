import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GymSetupPage.module.css";
import { Button } from "../../components/button/Button";
import { AuthHeader } from "../../components/auth-header/AuthHeader";

type GymSetupValues = {
  gymName: string;
  gymContactEmail: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  logoFile: File | null;
};

/**
 * Keep user input readable while they type:
 * - collapse repeated spaces inside the string
 * - preserve leading space typing behavior minimally (trimStart)
 */
function clampSpaces(value: string) {
  return value.replace(/\s+/g, " ").trimStart();
}

/**
 * Visual-only onboarding step indicator (kept consistent with other pages).
 * We keep it `aria-hidden` and communicate step context through headings/content.
 */
function StepDots(props: { current: number; total: number }) {
  return (
    <div className={styles.stepDots} aria-hidden="true">
      {Array.from({ length: props.total }).map((_, idx) => {
        const isActive = idx === props.current - 1;
        return <span key={idx} className={isActive ? styles.dotActive : styles.dot} />;
      })}
    </div>
  );
}

export function GymSetupPage() {
  const navigate = useNavigate();
  const fileInputId = useId();

  const [values, setValues] = useState<GymSetupValues>({
    gymName: "",
    gymContactEmail: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    logoFile: null,
  });

  const logoUrl = useMemo(() => {
    if (!values.logoFile) return null;
    return URL.createObjectURL(values.logoFile);
  }, [values.logoFile]);

  useEffect(() => {
    return () => {
      // Object URLs must be revoked to avoid leaking memory when the user navigates away
      // or changes the uploaded logo multiple times.
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Basic gating: enable CTA only when required fields are filled.
  // (We keep this simple for now; real validation can be added later.)
  const canContinue =
    values.gymName.trim().length > 0 &&
    values.gymContactEmail.trim().length > 0 &&
    values.streetAddress.trim().length > 0 &&
    values.city.trim().length > 0 &&
    values.state.trim().length > 0 &&
    values.postalCode.trim().length > 0 &&
    values.country.trim().length > 0;

  const uploadLabel = values.logoFile ? "CHANGE IMAGE" : "UPLOAD GYM LOGO";

  return (
    <div className={styles.page}>
      <AuthHeader variant="dashboard" userInitial="J" />

      <main className={styles.main}>
        <section className={styles.shell}>
          <div className={styles.left}>
            <StepDots current={1} total={3} />
            <h1 className={styles.title}>
              Set up your
              <br />
              gym on Gym
              <br />
              Tailor.
            </h1>
            <p className={styles.subtitle}>
              Set up your gym once, then let members
              <br />
              get workouts based on the equipment
              <br />
              you have.
            </p>
          </div>

          <div className={styles.right}>
            <section className={styles.card} aria-label="Confirm your gym">
              <h2 className={styles.cardTitle}>Confirm your gym</h2>
              <p className={styles.cardSubtitle}>
                We&apos;ll use this information to personalize your members work out experience.
              </p>

              <div className={styles.logoRow}>
                <div className={styles.logoBox} aria-label="Gym logo">
                  {logoUrl ? (
                    <img className={styles.logoImg} src={logoUrl} alt="Gym logo" />
                  ) : (
                    <div className={styles.logoPlaceholder} aria-hidden="true">
                      <span className={styles.photoGlyph} />
                    </div>
                  )}
                </div>

                <div className={styles.logoActions}>
                  <input
                    id={fileInputId}
                    className={styles.fileInput}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      // Read from the input immediately; relying on the event object later can be flaky
                      // under React's event scheduling.
                      const input = e.currentTarget;
                      const f = input.files?.[0] ?? null;
                      setValues((v) => ({ ...v, logoFile: f }));
                    }}
                  />
                  <label className={styles.uploadBtn} htmlFor={fileInputId}>
                    {uploadLabel}
                  </label>
                  <div className={styles.helpText}>Recommended size: 500 x 500 px | JPG, PNG</div>
                </div>
              </div>

              <div className={styles.form}>
                <label className={styles.label} htmlFor="gymName">
                  GYM NAME
                </label>
                <input
                  id="gymName"
                  className={styles.input}
                  placeholder="i-Fitness Gym & Wellness Center"
                  value={values.gymName}
                  onChange={(e) => {
                    // Capture the value first to avoid null/invalid reads during React re-renders.
                    const next = clampSpaces(e.currentTarget.value);
                    setValues((v) => ({ ...v, gymName: next }));
                  }}
                />

                <label className={styles.label} htmlFor="gymEmail">
                  GYM CONTACT EMAIL
                </label>
                <input
                  id="gymEmail"
                  className={styles.input}
                  type="email"
                  placeholder="info@ifitness.ng"
                  value={values.gymContactEmail}
                  onChange={(e) => {
                    // For emails we only normalize leading whitespace (avoid surprising edits).
                    const next = e.currentTarget.value.trimStart();
                    setValues((v) => ({ ...v, gymContactEmail: next }));
                  }}
                />

                <div className={styles.sectionLabel}>PRIMARY LOCATION</div>

                <input
                  className={styles.input}
                  placeholder="Street address"
                  value={values.streetAddress}
                  onChange={(e) => {
                    const next = clampSpaces(e.currentTarget.value);
                    setValues((v) => ({ ...v, streetAddress: next }));
                  }}
                />

                <div className={styles.row2}>
                  <select
                    className={styles.select}
                    value={values.city}
                    onChange={(e) => {
                      // Capture value before state update to avoid event reuse issues.
                      const next = e.currentTarget.value;
                      setValues((v) => ({ ...v, city: next }));
                    }}
                  >
                    <option value="" disabled>
                      City
                    </option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Lagos">Lagos</option>
                    <option value="London">London</option>
                  </select>

                  <select
                    className={styles.select}
                    value={values.state}
                    onChange={(e) => {
                      const next = e.currentTarget.value;
                      setValues((v) => ({ ...v, state: next }));
                    }}
                  >
                    <option value="" disabled>
                      State
                    </option>
                    <option value="California">California</option>
                    <option value="Lagos">Lagos</option>
                    <option value="England">England</option>
                  </select>
                </div>

                <div className={styles.row2}>
                  <input
                    className={styles.input}
                    placeholder="Zip/Postal Code"
                    value={values.postalCode}
                    onChange={(e) => {
                      const next = e.currentTarget.value.trimStart();
                      setValues((v) => ({ ...v, postalCode: next }));
                    }}
                  />

                  <select
                    className={styles.select}
                    value={values.country}
                    onChange={(e) => {
                      const next = e.currentTarget.value;
                      setValues((v) => ({ ...v, country: next }));
                    }}
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    <option value="United States">United States</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>

                <Button
                  type="button"
                  fullWidth
                  pill
                  size="lg"
                  className={styles.continueBtn}
                  disabled={!canContinue}
                  onClick={() => navigate("/onboarding/branch-setup")}
                >
                  SAVE AND CONTINUE
                </Button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

