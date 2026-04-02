import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";

type DashboardPlaceholderPageProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholderPage({ title, description }: DashboardPlaceholderPageProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#1f2732" }}>
      <DashboardShell>
        <main style={{ width: "min(1000px, calc(100% - 48px))", margin: "0 auto", padding: "24px 0 56px" }}>
          <section
            style={{
              border: "1px solid rgba(31,39,50,0.08)",
              borderRadius: 16,
              padding: 20,
              background: "rgba(255,255,255,0.95)",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>{title}</h1>
            <p style={{ marginTop: 8, color: "rgba(31,39,50,0.65)" }}>{description}</p>
          </section>
        </main>
      </DashboardShell>
    </div>
  );
}
