import { useMemo, useState, useEffect } from "react";
import Api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";
import styles from "./OwnerDashboardPage.module.css";

type TimeKey = "7d" | "1m" | "3m" | "6m" | "1y" | "ytd";

const TIME_OPTIONS: Array<{ value: TimeKey; label: string }> = [
  { value: "7d", label: "7D" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "ytd", label: "YTD" },
];

// Helper to map API equipment to table row format
type EquipmentApi = {
  id: number;
  name: string;
  serial_number: string;
  members_used: number[];
  usage_rate: number;
  frequency: number;
  trend: Array<{ user_id: number; last_used_at: string }>;
};

type TableRow = {
  rank: number;
  equipment: string;
  members: number;
  usageRate: string;
  frequency: number | string;
  trend: number;
};

function mapEquipmentToRow(equip: EquipmentApi, idx: number): TableRow {
  return {
    rank: idx + 1,
    equipment: equip.name,
    members: Array.isArray(equip.members_used) ? equip.members_used.length : 0,
    usageRate: equip.usage_rate ? `${equip.usage_rate}%` : "-",
    frequency: equip.frequency ?? "-",
    trend:
      Array.isArray(equip.trend) && equip.trend.length > 0
        ? (() => {
            // Calculate trend as difference in usage (example: last vs previous)
            // Here, just show +N for new users in trend array
            return equip.trend.length;
          })()
        : 0,
  };
}

function MiniLegendDot(props: { color: string }) {
  return (
    <span className={styles.legendDot} style={{ background: props.color }} />
  );
}

/** Trend color: positive = green; any negative / downward = red. */
function trendClassForValue(t: number) {
  if (t > 0) return styles.trendUp;
  if (t < 0) return styles.trendDown;
  return styles.trendNeutral;
}

/** Generic chevron icon (reused in the "ADD EQUIPMENT" CTA). */
function IconChevronDown(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.2l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Action card icon for equipment. */
function IconDumbbell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2Zm14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2ZM11 10h2v4h-2v-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Action card icon for members. */
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-3.6-5.7A5 5 0 0 1 16 11ZM8 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.3 0-6 1.8-6 4v1h12v-1c0-2.2-2.7-4-6-4Zm8 0c-.7 0-1.4.1-2 .3 1.5.9 2.5 2.2 2.5 3.7v1H22v-1c0-2.2-2.7-4-6-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Small info icon used in card headers (visual). */
function IconInfo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM10.9 10h2.2v8h-2.2v-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SessionsChart() {
  // Static SVG chart drawn to match screenshot shape/layout.
  // This avoids pulling a charting dependency while design is being finalized.
  return (
    <svg
      className={styles.chart}
      viewBox="0 0 520 240"
      role="img"
      aria-label="Sessions chart"
    >
      <defs>
        <clipPath id="clip">
          <rect x="20" y="16" width="482" height="176" rx="10" />
        </clipPath>
      </defs>

      {/* grid */}
      <g stroke="rgba(31,39,50,0.10)" strokeWidth="1">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="20" x2="502" y1={32 + i * 36} y2={32 + i * 36} />
        ))}
      </g>

      {/* lines intentionally removed: will render when data is available */}

      {/* x labels */}
      <g
        fill="rgba(31,39,50,0.45)"
        fontSize="10"
        fontFamily="Onest, Inter, system-ui, sans-serif"
      >
        {["DEC 1", "DEC 2", "DEC 3", "DEC 4", "DEC 6", "DEC 7"].map((d, i) => (
          <text key={d} x={60 + i * 84} y="220" textAnchor="middle">
            {d}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function OwnerDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(
    location.state?.dashboardData || null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback: fetch from API if not present in state
  useEffect(() => {
    if (!dashboardData) {
      setLoading(true);
      const api = new Api();
      const token = localStorage.getItem("token");
      api
        .get<any>("/api/dashboard", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        .then((data) => {
          console.log("dashboardData:", data);
          setDashboardData(data);
          setError(null);
        })
        .catch(() => {
          setError("Could not load dashboard data.");
        })
        .finally(() => setLoading(false));
    }
  }, [dashboardData]);

  // console.log('dashboardData:', dashboardData);
  const tableRows = Array.isArray(dashboardData?.equipments)
    ? dashboardData.equipments.map(mapEquipmentToRow)
    : [];

  // Fallbacks for member count and utilization
  const memberCount =
    typeof dashboardData?.member_count === "number"
      ? dashboardData.member_count
      : 0;
  const equipmentUtilization =
    typeof dashboardData?.equipment_utilization === "number"
      ? dashboardData.equipment_utilization.toFixed(2)
      : "0.00";
  // UI-only state for time toggles and active nav styling.
  const [time, setTime] = useState<TimeKey>("7d");

  const timeLabel = useMemo(
    () => TIME_OPTIONS.find((t) => t.value === time)?.label ?? "7D",
    [time],
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <DashboardShell>
          <main className={styles.main}>
            <div>Loading dashboard...</div>
          </main>
        </DashboardShell>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <DashboardShell>
          <main className={styles.main}>
            <div style={{ color: "red" }}>{error}</div>
          </main>
        </DashboardShell>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <DashboardShell>
        <main className={styles.main}>
          <section className={styles.container}>
            <header className={styles.header}>
              <h1 className={styles.h1}>Good Morning!</h1>
              <p className={styles.h1Sub}>
                Track what&apos;s happening across members, workouts, and
                equipment.
              </p>
            </header>

            <section className={styles.actions} aria-label="Quick actions">
              <div className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <IconDumbbell />
                </div>
                <div className={styles.actionCopy}>
                  <div className={styles.actionTitle}>Add your equipment</div>
                  <div className={styles.actionSub}>
                    Upload a CSV to import everything at once, or add items
                    manually.
                  </div>
                </div>
                <Button
                  className={styles.darkBtn}
                  pill
                  size="md"
                  onClick={() =>
                    navigate("/dashboard/equipment", {
                      state: { openAdd: true },
                    })
                  }
                >
                  ADD EQUIPMENT{" "}
                  <IconChevronDown className={styles.chevDownIcon} />
                </Button>
              </div>

              <div className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <IconUsers />
                </div>
                <div className={styles.actionCopy}>
                  <div className={styles.actionTitle}>Add your members</div>
                  <div className={styles.actionSub}>
                    Members sign in by selecting your gym and confirming their
                    email.
                  </div>
                </div>
                <Button className={styles.darkBtn} pill size="md">
                  ADD MEMBERS
                </Button>
              </div>
            </section>

            <section className={styles.overview} aria-label="Overview">
              <div className={styles.timeRow}>
                <div
                  className={styles.timePills}
                  role="tablist"
                  aria-label="Time period"
                >
                  {TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={
                        opt.value === time
                          ? styles.timePillActive
                          : styles.timePill
                      }
                      onClick={() => setTime(opt.value)}
                      aria-label={`Time period ${opt.label}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className={styles.timeLabel} aria-hidden="true">
                  {timeLabel}
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.colLeft}>
                  <div className={styles.statCard}>
                    <div className={styles.cardHeadRow}>
                      <div className={styles.cardHead}>Total members</div>
                      <span className={styles.info} aria-hidden="true">
                        <IconInfo />
                      </span>
                    </div>
                    <div className={styles.bigNum}>{memberCount}</div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.cardHeadRow}>
                      <div className={styles.cardHead}>
                        Equipment utilization
                      </div>
                      <span className={styles.info} aria-hidden="true">
                        <IconInfo />
                      </span>
                    </div>
                    <div className={styles.utilRow}>
                      <div className={styles.bigNum}>
                        {equipmentUtilization}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <div className={styles.cardHeadRow}>
                    <div className={styles.cardHead}>Sessions over time</div>
                    <span className={styles.info} aria-hidden="true">
                      <IconInfo />
                    </span>
                  </div>
                  <div className={styles.chartWrap}>
                    <SessionsChart />
                  </div>
                  <div className={styles.legend}>
                    <span className={styles.legendItem}>
                      <MiniLegendDot color="#0f8f64" /> Completed
                    </span>
                    <span className={styles.legendItem}>
                      <MiniLegendDot color="#f97316" /> Started
                    </span>
                    <span className={styles.legendItem}>
                      <MiniLegendDot color="rgba(31,39,50,0.22)" /> Abandoned
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section
              className={styles.tableSection}
              aria-label="Most used equipment"
            >
              <h2 className={styles.h2}>Most used equipment</h2>
              <p className={styles.h2Sub}>
                See which equipment appears most often in member workouts.
              </p>

              <div className={styles.tableCard}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col" className={styles.thRank}>
                        RANK
                      </th>
                      <th scope="col" className={styles.thEquipment}>
                        EQUIPMENT
                      </th>
                      <th scope="col" className={styles.thNum}>
                        MEMBERS
                      </th>
                      <th scope="col" className={styles.thNum}>
                        USAGE RATE
                      </th>
                      <th scope="col" className={styles.thNum}>
                        FREQUENCY
                      </th>
                      <th scope="col" className={styles.thTrend}>
                        TREND
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r: TableRow) => (
                      <tr key={r.rank}>
                        <td className={styles.tdRank}>{r.rank}</td>
                        <td className={styles.tdEquipment}>{r.equipment}</td>
                        <td className={styles.tdNum}>{r.members}</td>
                        <td className={styles.tdNum}>{r.usageRate}</td>
                        <td className={styles.tdNum}>{r.frequency}</td>
                        <td className={styles.tdTrend}>
                          <span className={trendClassForValue(r.trend)}>
                            {r.trend >= 0 ? "↑" : "↓"} {Math.abs(r.trend)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </main>
      </DashboardShell>
    </div>
  );
}
