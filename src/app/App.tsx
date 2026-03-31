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
import { MultiFactorPage } from "../pages/multi-factor/MultiFactorPage";
import { MembersPage } from "../pages/members/MembersPage";
import { MemberDetailsPage } from "../pages/members/MemberDetailsPage";
import { MemberOnboardingWelcomePage } from "../pages/member-onboarding/MemberOnboardingWelcomePage";
import { MemberOnboardingGymPage } from "../pages/member-onboarding/MemberOnboardingGymPage";
import { MemberOnboardingConfirmPage } from "../pages/member-onboarding/MemberOnboardingConfirmPage";
import { MemberOnboardingSentPage } from "../pages/member-onboarding/MemberOnboardingSentPage";
import { MemberOnboardingTrainingIntroPage } from "../pages/member-onboarding/MemberOnboardingTrainingIntroPage";
import { MemberOnboardingSetupPage } from "../pages/member-onboarding/MemberOnboardingSetupPage";

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
          Copy the error text above and send it to Horace.
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
          <Route path="/" element={<Navigate to="/onboarding/request-magic-link" replace />} />
          <Route path="/invitation/:invitationId/view" element={<CreateAccountPage />} />
          {/* Post-onboarding destination. */}
          <Route path="/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/dashboard/equipment" element={<EquipmentPage />} />
          <Route path="/dashboard/equipment/:equipmentId" element={<EquipmentPage />} />
          <Route
            path="/dashboard/members"
            element={<MembersPage />}
          />
          <Route path="/dashboard/members/:id" element={<MemberDetailsPage />} />
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
          <Route path="/onboarding/secure-account" element={<SecureAccountPage />} />
          <Route path="/onboarding/gym-setup" element={<GymSetupPage />} />
          <Route path="/onboarding/branch-setup" element={<BranchSetupPage />} />
          <Route path="/onboarding/add-equipment" element={<AddEquipmentPage />} />
          <Route path="/onboarding/loading" element={<OnboardingLoadingPage />} />
          <Route path="/onboarding/request-magic-link" element={<MagicLoginPage />} />
          <Route path="/onboarding/magic-login" element={<Navigate to="/onboarding/request-magic-link" replace />} />
          <Route path="/magic-login" element={<MultiFactorPage />} />
          <Route path="/onboarding/multi-factor" element={<MultiFactorPage />} />

          {/* Member / end-user app (mobile-first); does not overlap admin `/dashboard` routes. */}
          <Route path="/member" element={<MemberOnboardingWelcomePage />} />
          <Route path="/member/onboarding/gym" element={<MemberOnboardingGymPage />} />
          <Route path="/member/onboarding/confirm" element={<MemberOnboardingConfirmPage />} />
          <Route path="/member/onboarding/sent" element={<MemberOnboardingSentPage />} />
          <Route
            path="/member/onboarding/training-intro"
            element={<MemberOnboardingTrainingIntroPage />}
          />
          <Route
            path="/member/onboarding/setup"
            element={<Navigate to="/member/onboarding/setup/1" replace />}
          />
          <Route path="/member/onboarding/setup/:step" element={<MemberOnboardingSetupPage />} />
          <Route
            path="/member/onboarding/step-2"
            element={<Navigate to="/member/onboarding/confirm" replace />}
          />
        </Routes>
      </AppErrorBoundary>
    </div>
  );
}
