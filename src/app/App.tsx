import React from "react";
import styles from "./App.module.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { CreateAccountPage } from "../pages/create-account/CreateAccountPage";
import { BranchSetupPage } from "../pages/branch-setup/BranchSetupPage";
import { AddEquipmentPage } from "../pages/add-equipment/AddEquipmentPage";
import { GymSetupPage } from "../pages/gym-setup/GymSetupPage";
import { OwnerDashboardPage } from "../pages/dashboard/OwnerDashboardPage";
import { DashboardPlaceholderPage } from "../pages/dashboard/DashboardPlaceholderPage";
import { SecureAccountPage } from "../pages/secure-account/SecureAccountPage";
import { OnboardingLoadingPage } from "../pages/onboarding-loading/OnboardingLoadingPage";
import { EquipmentPage } from "../pages/equipment/EquipmentPage";
import { MagicLoginPage } from "../pages/magic-login/MagicLoginPage";
import { MagicLoginCallbackPage } from "../pages/magic-login-callback/MagicLoginCallbackPage";
import { MultiFactorPage } from "../pages/multi-factor/MultiFactorPage";

type OnboardingSnapshot = {
  email?: string;
  first_name?: string;
  last_name?: string;
  tenant_name?: string;
  tenant_email?: string;
  branches?: Array<{ name?: string; address?: string }>;
  [key: string]: any;
};

function readOnboardingSnapshot(): OnboardingSnapshot {
  try {
    const raw = localStorage.getItem("onboardingData");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function hasCreateAccountProgress(): boolean {
  const data = readOnboardingSnapshot();
  return Boolean(data.email?.trim() && data.first_name?.trim());
}

function hasGymSetupProgress(): boolean {
  const data = readOnboardingSnapshot();
  return Boolean(data.tenant_name?.trim() && data.tenant_email?.trim());
}

function hasBranchSetupProgress(): boolean {
  const data = readOnboardingSnapshot();
  return Boolean(Array.isArray(data.branches) && data.branches.length > 0);
}

function OnboardingGate(props: { allow: boolean; fallbackTo: string; children: React.ReactElement }) {
  if (!props.allow) return <Navigate to={props.fallbackTo} replace />;
  return props.children;
}

/**
 * App-level error boundary used during UI build-out.
 *
 * Why this exists:
 * - A runtime error inside any page/component can otherwise blank the screen, which makes it hard to
 *   capture the exact error message during iterative styling and form wiring.
 * - We intentionally show a copy-friendly message so errors can be reported verbatim.
 *
 * Notes:
 * - This is not meant to replace proper logging/monitoring; it's a dev-friendly safety net.
 */
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>App crashed</h2>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "rgba(31,39,50,0.06)",
            border: "1px solid rgba(31,39,50,0.12)",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            color: "rgba(31,39,50,0.85)",
          }}
        >
          {String(this.state.error?.message || this.state.error)}
        </pre>
        <p style={{ marginTop: 10, color: "rgba(31, 39, 50, 0.65)" }}>
          Copy the error text above and send it to me.
        </p>
      </div>
    );
  }
}

export function App() {
  return (
    <div className={styles.appShell}>
      <AppErrorBoundary>
        <Routes>
          {/* Default entry for unauthenticated users. */}
          <Route path="/" element={<Navigate to="/onboarding/magic-login" replace />} />
          <Route path="/accept-invitation/invitation/:invitationId/view" element={<CreateAccountPage />} />
          <Route path="/invitation/:invitationId/view" element={<CreateAccountPage />} />
          {/* Post-onboarding destination. */}
          <Route path="/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/dashboard/equipment" element={<EquipmentPage />} />
          <Route
            path="/dashboard/members"
            element={
              <DashboardPlaceholderPage
                title="Members"
                description="Members management is being prepared and will be available soon."
              />
            }
          />
          <Route
            path="/dashboard/report"
            element={
              <DashboardPlaceholderPage
                title="Report"
                description="Reporting tools are being prepared and will be available soon."
              />
            }
          />
          <Route
            path="/dashboard/branding"
            element={
              <DashboardPlaceholderPage
                title="Branding"
                description="Brand customization tools are being prepared and will be available soon."
              />
            }
          />

          {/* Onboarding flow (owner setup). */}
          <Route path="/onboarding/create-account" element={<CreateAccountPage />} />
          <Route
            path="/onboarding/secure-account"
            element={
              <OnboardingGate allow={hasCreateAccountProgress()} fallbackTo="/onboarding/create-account">
                <SecureAccountPage />
              </OnboardingGate>
            }
          />
          <Route
            path="/onboarding/gym-setup"
            element={
              <OnboardingGate allow={hasCreateAccountProgress()} fallbackTo="/onboarding/create-account">
                <GymSetupPage />
              </OnboardingGate>
            }
          />
          <Route
            path="/onboarding/branch-setup"
            element={
              <OnboardingGate allow={hasGymSetupProgress()} fallbackTo="/onboarding/gym-setup">
                <BranchSetupPage />
              </OnboardingGate>
            }
          />
          <Route
            path="/onboarding/add-equipment"
            element={
              <OnboardingGate allow={hasBranchSetupProgress()} fallbackTo="/onboarding/branch-setup">
                <AddEquipmentPage />
              </OnboardingGate>
            }
          />
          <Route
            path="/onboarding/loading"
            element={
              <OnboardingGate allow={hasBranchSetupProgress()} fallbackTo="/onboarding/create-account">
                <OnboardingLoadingPage />
              </OnboardingGate>
            }
          />
          <Route path="/onboarding/magic-login" element={<MagicLoginPage />} />
          <Route path="/magic-login-callback" element={<MagicLoginCallbackPage />} />
          <Route path="/onboarding/magic-login-callback" element={<MagicLoginCallbackPage />} />
          <Route path="/onboarding/multi-factor" element={<MultiFactorPage />} />
        </Routes>
      </AppErrorBoundary>
    </div>
  );
}
