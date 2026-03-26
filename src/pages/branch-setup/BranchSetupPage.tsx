import { useMemo, useState } from "react";
import { useOnboarding } from "../../app/OnboardingContext";
import { useNavigate } from "react-router-dom";
import styles from "./BranchSetupPage.module.css";
import { Button } from "../../components/button/Button";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import { ArrowLeftIcon } from "../../components/icons/ArrowLeftIcon";
import { StepDots } from "../../components/onboarding/StepDots";
import { clampSpaces } from "../../utils/text";

type Branch = { name: string; street: string };


export function BranchSetupPage() {
  const navigate = useNavigate();

  const { setData } = useOnboarding();

  // Start with one blank branch row; user can add as many as needed.
  const [branches, setBranches] = useState<Branch[]>([
    { name: "", street: "" },
  ]);

  const canContinue = useMemo(() => {
    // Gate CTA until every branch row has required fields filled.
    return branches.length > 0 && branches.every((b) => b.name.trim() && b.street.trim());
  }, [branches]);

  return (
    <div className={styles.page}>
      <AuthHeader variant="dashboard" userInitial="J" />

      <main className={styles.main}>
        <section className={styles.shell}>
          <div className={styles.left}>
            <StepDots
              current={2}
              total={3}
              containerClassName={styles.stepDots}
              activeDotClassName={styles.dotActive}
              dotClassName={styles.dot}
            />
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
            <section className={styles.card} aria-label="Set up your branch">
              <h2 className={styles.cardTitle}>Set up your branch</h2>
              <p className={styles.cardSubtitle}>
                Track equipment and members per branch while keeping one dashboard.
              </p>

              <div className={styles.gridHead} aria-hidden="true">
                <div className={styles.label}>BRANCH NAME</div>
                <div className={styles.label}>BRANCH STREET</div>
              </div>

              <div className={styles.rows}>
                {branches.map((b, idx) => (
                  <div className={styles.row} key={idx}>
                    <input
                      className={styles.input}
                      placeholder={idx === 0 ? "e.g. Annex 1" : ""}
                      value={b.name}
                      onChange={(e) => {
                        // Capture value before state update to avoid event reuse issues.
                        const next = clampSpaces(e.currentTarget.value);
                        setBranches((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, name: next } : x)),
                        );
                      }}
                    />
                    <input
                      className={styles.input}
                      placeholder={idx === 0 ? "e.g. Headingley, Leeds" : ""}
                      value={b.street}
                      onChange={(e) => {
                        const next = clampSpaces(e.currentTarget.value);
                        setBranches((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, street: next } : x)),
                        );
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addMore}
                // Append a new empty row instead of using a fixed/static form.
                onClick={() => setBranches((prev) => [...prev, { name: "", street: "" }])}
              >
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
                ADD MORE
              </button>

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.backBtn}
                  aria-label="Back"
                  onClick={() => navigate("/onboarding/gym-setup")}
                >
                  <ArrowLeftIcon />
                </button>

                <Button
                  type="button"
                  fullWidth
                  pill
                  size="lg"
                  disabled={!canContinue}
                  onClick={() => {
                    setData({
                      branches: branches.map((b) => ({ name: b.name, address: b.street })),
                    });
                    navigate("/onboarding/add-equipment");
                  }}
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

