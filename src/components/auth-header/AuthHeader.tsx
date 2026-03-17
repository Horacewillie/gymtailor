import styles from "./AuthHeader.module.css";

export function AuthHeader() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="Gym Tailor home">
      GYM TAILOR
      </a>
      <p className={styles.accountText}>
      I already have an account{" "}
      <a href="#" className={styles.signInLink}>
        SIGN IN
      </a>
      </p>
    </header>
  );
}
