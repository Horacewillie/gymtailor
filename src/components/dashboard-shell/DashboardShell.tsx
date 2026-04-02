import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthHeader } from "../auth-header/AuthHeader";
import { getTenantBranches } from "../../services/dashboardService";
function DotHome() {
  return <span aria-hidden="true" style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: "rgba(15,24,34,0.9)" }} />;
}


type TabKey = "Home" | "Equipment" | "Members" | "Report" | "Branding";

type DashboardShellProps = {
  userInitial?: string;
  branchLabel?: string;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
};

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.3a15.5 15.5 0 0 0-1.1-5.1A8.03 8.03 0 0 1 19.9 11ZM12 4c.9 1.2 1.8 3.2 2.3 7H9.7c.5-3.8 1.4-5.8 2.3-7ZM8.5 5.9A15.5 15.5 0 0 0 7.4 11H4.1a8.03 8.03 0 0 1 4.4-5.1ZM4.1 13h3.3c.2 2 .6 3.8 1.1 5.1A8.03 8.03 0 0 1 4.1 13Zm8 7c-.9-1.2-1.8-3.2-2.3-7h4.6c-.5 3.8-1.4 5.8-2.3 7Zm3.5-1.9c.5-1.3.9-3.1 1.1-5.1h3.3a8.03 8.03 0 0 1-4.4 5.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2Zm0 2.2 6.8 3.4L12 11 5.2 7.6 12 4.2ZM5 9.4l6 3v7.1l-6-3V9.4Zm14 7.1-6 3v-7.1l6-3v7.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMembers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-2.9 0-5.3 1.6-5.3 3.6V19h10.6v-1.4C21.3 15.6 18.9 14 16 14Zm-8 0c-2.9 0-5.3 1.6-5.3 3.6V19h10.6v-1.4C13.3 15.6 10.9 14 8 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconReport() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h16v16H4V4Zm2 2v12h12V6H6Zm2 9h2v2H8v-2Zm0-7h2v6H8V8Zm4 3h2v6h-2v-6Zm4-2h2v8h-2V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconBranding() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l2.6 6.2L21 11l-6.4 2.8L12 20l-2.6-6.2L3 11l6.4-2.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getActiveTab(pathname: string): TabKey {
  if (pathname.startsWith("/dashboard/equipment")) return "Equipment";
  if (pathname.startsWith("/dashboard/members")) return "Members";
  if (pathname.startsWith("/dashboard/report")) return "Report";
  if (pathname.startsWith("/dashboard/branding")) return "Branding";
  return "Home";
}

/**
 * Shared wrapper for all dashboard routes.
 *
 * Responsibilities:
 * - Renders the reusable dashboard header/nav.
 * - Determines the active tab from the current URL.
 * - Leaves page content/layout to individual routes (Home vs Equipment etc.).
 */
export function DashboardShell({
  userInitial = "J",
  branchLabel = "All branches",
  rightIcon,
  children,
}: DashboardShellProps) {
  const { pathname } = useLocation();
  const active = useMemo(() => getActiveTab(pathname), [pathname]);
  const [branchNames, setBranchNames] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    void getTenantBranches()
      .then((branches) => {
        if (!mounted) return;
        setBranchNames(branches.map((b) => b.name));
      })
      .catch((error) => {
        console.error("Failed to load tenant branches:", error);
        if (mounted) setBranchNames([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <AuthHeader
        variant="dashboardNav"
        userInitial={userInitial}
        branchLabel={branchLabel}
        branchOptions={branchNames}
        dashboardRightIcon={rightIcon ?? <IconGlobe />}
        dashboardTabs={[
          {
            label: "Home",
            href: "/dashboard",
            active: active === "Home",
            icon: <DotHome />,
          },
          {
            label: "Equipment",
            href: "/dashboard/equipment",
            active: active === "Equipment",
            icon: <IconBox />,
          },
          {
            label: "Members",
            href: "/dashboard/members",
            active: active === "Members",
            icon: <IconMembers />,
          },
          {
            label: "Report",
            href: "/dashboard/report",
            active: active === "Report",
            icon: <IconReport />,
          },
          {
            label: "Branding",
            href: "/dashboard/branding",
            active: active === "Branding",
            icon: <IconBranding />,
          },
        ]}
      />
      {children}
    </>
  );
}

