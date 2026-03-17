import styles from "./HomePage.module.css";

export function HomePage() {
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
