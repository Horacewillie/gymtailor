import { useEffect, useRef, useState } from "react";
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
  /** Branch selector options loaded from API. */
  branchOptions?: string[];
};

export function AuthHeader({
  variant = "auth",
  userInitial = "J",
  showSignIn = true,
  signInHref = "#",
  dashboardTabs = [],
  dashboardRightIcon,
  branchLabel = "All branches",
  branchOptions = [],
}: AuthHeaderProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const branchWrapRef = useRef<HTMLDivElement | null>(null);
  const selectedBranchLabel = selectedBranch || branchLabel;

  useEffect(() => {
    if (!branchOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = branchWrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setBranchOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBranchOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [branchOpen]);

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

            <div className={styles.branchWrap} ref={branchWrapRef}>
              <button
                type="button"
                className={styles.branchPill}
                aria-haspopup="listbox"
                aria-expanded={branchOpen}
                onClick={() => setBranchOpen((v) => !v)}
              >
                <span className={styles.branchDot} aria-hidden="true" />
                <span className={styles.branchValue}>{selectedBranchLabel}</span>
                <span className={styles.branchChev} aria-hidden="true" />
              </button>
              {branchOpen ? (
                <div className={styles.branchMenu} role="listbox" aria-label="Branches">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedBranch === ""}
                    className={[styles.branchOption, selectedBranch === "" ? styles.branchOptionActive : ""].join(" ")}
                    onClick={() => {
                      setSelectedBranch("");
                      setBranchOpen(false);
                    }}
                  >
                    {branchLabel}
                  </button>
                  {branchOptions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={selectedBranch === name}
                      className={[styles.branchOption, selectedBranch === name ? styles.branchOptionActive : ""].join(
                        " ",
                      )}
                      onClick={() => {
                        setSelectedBranch(name);
                        setBranchOpen(false);
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : null}
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
