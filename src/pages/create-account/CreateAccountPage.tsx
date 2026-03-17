import { AuthHeader } from "../../components/auth-header/AuthHeader";
import styles from "./CreateAccountPage.module.css";

export function CreateAccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.topTint} />

      <main className={styles.main}>
        <p className={styles.breadcrumb}>Gym Tailor &gt; Signup 5</p>
        <section className={styles.panel}>
          <AuthHeader />
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.stepDots} aria-hidden="true">
                <span className={styles.dotActive} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>

              <h1 className={styles.title}>Create owner account</h1>
              <p className={styles.subtitle}>
                This account gives you access to manage your gym and members.
              </p>
            </div>
            <div className={styles.right}>
              <form className={styles.form}>
                <label className={styles.label} htmlFor="email">
                  Work Email
                </label>
                <input
                  className={styles.input}
                  id="email"
                  type="email"
                  placeholder="jeremy@fitness.com"
                  autoComplete="email"
                />

                <label className={styles.label} htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className={styles.input}
                  id="fullName"
                  type="text"
                  placeholder="Jeremy Johnson"
                  autoComplete="name"
                />

                <label className={styles.checkboxRow}>
                  <input className={styles.checkbox} type="checkbox" defaultChecked />
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

                <button type="button" className={styles.cta}>
                  Continue
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
