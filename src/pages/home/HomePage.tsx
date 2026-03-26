import styles from "./HomePage.module.css";

export function HomePage() {
  /**
   * Legacy starter page kept for reference.
   *
   * The app now routes onboarding + dashboard via `App.tsx`, but leaving this page in place
   * can be useful as a sandbox while iterating on layout/styles.
   */
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>GymTailor</p>
        <h1 className={styles.title}>React + CSS Modules starter is ready.</h1>
        <p className={styles.copy}>
          Share the first page image and I will implement it in this structure.
        </p>
      </section>
    </main>
  );
}
