import styles from "./AuthHeader.module.css";
import { Link } from "react-router-dom";

type DashboardTab = {
  label: string;
  href?: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type AuthHeaderProps = {
  /**
   * "auth": onboarding header with optional SIGN IN prompt.
   * "dashboard": minimal header with avatar (used on onboarding steps after sign-in).
   * "dashboardNav": full dashboard navigation bar (brand left, tabs centered, controls right).
   */
  variant?: "auth" | "dashboard" | "dashboardNav";
  userInitial?: string;
  showSignIn?: boolean;
  signInHref?: string;
  /** Tabs are only rendered for the "dashboardNav" variant. */
  dashboardTabs?: DashboardTab[];
  /** Optional right-side icon pill (e.g. notifications/globe). */
  dashboardRightIcon?: React.ReactNode;
  /** Branch selector label shown in the right-side pill. */
  branchLabel?: string;
};

export function AuthHeader({
  variant = "auth",
  userInitial = "J",
  showSignIn = true,
  signInHref = "#",
  dashboardTabs = [],
  dashboardRightIcon,
  branchLabel = "All branches",
}: AuthHeaderProps) {
  return (
    <header className={styles.header} data-variant={variant}>
      {variant === "dashboardNav" ? (
        <div className={styles.dashboardNav}>
          <div className={styles.dashboardLeft}>
            <Link to="/dashboard" className={styles.brand} aria-label="Gym Tailor home">
              GYM TAILOR
            </Link>
          </div>

          <nav className={styles.tabs} aria-label="Dashboard sections">
            {dashboardTabs.map((t) => (
              t.href && t.href.startsWith("/") && !t.onClick ? (
                <Link
                  key={t.label}
                  className={t.active ? styles.tabActive : styles.tab}
                  to={t.href}
                >
                  {t.icon ? <span className={styles.tabIcon}>{t.icon}</span> : null}
                  {t.label}
                </Link>
              ) : (
                <a
                  key={t.label}
                  className={t.active ? styles.tabActive : styles.tab}
                  href={t.href ?? "#"}
                  onClick={t.onClick}
                >
                  {t.icon ? <span className={styles.tabIcon}>{t.icon}</span> : null}
                  {t.label}
                </a>
              )
            ))}
          </nav>

          <div className={styles.dashboardRight}>
            {dashboardRightIcon ? (
              <div className={styles.pillIcon} aria-hidden="true">
                {dashboardRightIcon}
              </div>
            ) : null}

            {/* Visual-only selector pill for the "All branches" control. */}
            <div className={styles.branchPill}>
              <span className={styles.branchDot} aria-hidden="true" />
              <span>{branchLabel}</span>
              <span className={styles.branchChev} aria-hidden="true" />
            </div>

            <div className={styles.avatarSmall} aria-label="Account">
              {userInitial}
            </div>
          </div>
        </div>
      ) : (
        <Link to="/" className={styles.brand} aria-label="Gym Tailor home">
          GYM TAILOR
        </Link>
      )}

      {variant === "auth" ? (
        showSignIn ? (
          <p className={styles.accountText}>
            I already have an account{" "}
            {signInHref.startsWith("/") ? (
              <Link to={signInHref} className={styles.signInLink}>
                SIGN IN
              </Link>
            ) : (
              <a href={signInHref} className={styles.signInLink}>
                SIGN IN
              </a>
            )}
          </p>
        ) : (
          <span />
        )
      ) : variant === "dashboard" ? (
        <div className={styles.avatar} aria-label="Account">
          {userInitial}
        </div>
      ) : null}
    </header>
  );
}
