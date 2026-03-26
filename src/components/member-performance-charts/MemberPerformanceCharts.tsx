import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./MemberPerformanceCharts.module.css";

const TEAL = "#115e59";
const ORANGE = "#ea580c";
const BAR_MUTED = "#94a3b8";

const gridProps = {
  stroke: "#e2e8f0",
  strokeDasharray: "3 3" as const,
  vertical: false,
};

function ProductivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value ?? 0;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{v === 0 ? "0M" : `${v}m`}</div>
      <div className={styles.tooltipSub}>
        {label === "Dec 4" ? "Dec 1 - Dec 3" : `${label}`}
      </div>
    </div>
  );
}

const productivityData = [
  { day: "Dec 1", v: 0 },
  { day: "Dec 2", v: 0 },
  { day: "Dec 3", v: 0 },
  { day: "Dec 4", v: 0 },
  { day: "Dec 5", v: 0 },
  { day: "Dec 6", v: 48 },
  { day: "Dec 7", v: 92 },
];

/** Area + line: flat through Dec 5, sharp rise Dec 6–7; gradient fill under line. */
export function ProductivityTrendChart() {
  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={productivityData} margin={{ top: 12, right: 8, left: -18, bottom: 4 }}>
          <defs>
            <linearGradient id="prodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip content={<ProductivityTooltip />} cursor={{ stroke: TEAL, strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Area
            type="linear"
            dataKey="v"
            stroke={TEAL}
            strokeWidth={2.5}
            fill="url(#prodFill)"
            dot={{ r: 4, fill: "#fff", stroke: TEAL, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#fff", stroke: TEAL, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const weightData = [
  { day: "Dec 1", w: 68 },
  { day: "Dec 2", w: 72 },
  { day: "Dec 3", w: 76 },
  { day: "Dec 4", w: 74 },
  { day: "Dec 5", w: 75 },
  { day: "Dec 6", w: 76 },
  { day: "Dec 7", w: 76 },
];

/** Bars: muted grey; Dec 3 highlighted teal. Y-axis 0–80 step 20. */
export function WeightRecordChart() {
  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weightData} margin={{ top: 12, right: 8, left: -8, bottom: 4 }} barCategoryGap="18%">
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis
            domain={[0, 80]}
            ticks={[0, 20, 40, 60, 80]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            width={36}
          />
          <Tooltip
            cursor={{ fill: "rgba(17, 94, 89, 0.06)" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipLabel}>{payload[0]?.payload?.day}</div>
                  <div className={styles.tooltipSub}>{payload[0]?.value} lbs</div>
                </div>
              ) : null
            }
          />
          <Bar dataKey="w" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {weightData.map((_, i) => (
              <Cell key={weightData[i]!.day} fill={i === 2 ? TEAL : BAR_MUTED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const sessionsData = [
  { day: "Dec 1", completed: 26, startedDash: 0, startedSolid: null as number | null },
  { day: "Dec 2", completed: 32, startedDash: 0, startedSolid: null },
  { day: "Dec 3", completed: 38, startedDash: 0, startedSolid: null },
  { day: "Dec 4", completed: 52, startedDash: null, startedSolid: 18 },
  { day: "Dec 5", completed: 65, startedDash: null, startedSolid: 28 },
  { day: "Dec 6", completed: 82, startedDash: null, startedSolid: 42 },
  { day: "Dec 7", completed: 96, startedDash: null, startedSolid: 58 },
];

function SessionsLegend() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", paddingTop: 8 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#525866" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
        Completed
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#525866" }}>
        <span style={{ width: 10, height: 3, borderRadius: 2, background: ORANGE }} />
        Started
      </span>
    </div>
  );
}

/** Completed: solid teal upward. Started: dashed at 0 Dec 1–3, solid orange Dec 4–7. */
export function SessionsOverTimeChart() {
  return (
    <div className={styles.chartBoxTall}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sessionsData} margin={{ top: 16, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} width={32} />
          <Tooltip
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) return null;
              const completed = payload.find((p) => p.dataKey === "completed")?.value;
              const dash = payload.find((p) => p.dataKey === "startedDash")?.value;
              const solid = payload.find((p) => p.dataKey === "startedSolid")?.value;
              const started = solid ?? dash ?? "—";
              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipLabel}>{label}</div>
                  <div className={styles.tooltipSub}>Completed: {completed}</div>
                  <div className={styles.tooltipSub}>Started: {started}</div>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke={TEAL}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="linear"
            dataKey="startedDash"
            name="Started"
            stroke={ORANGE}
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="startedSolid"
            name="Started"
            stroke={ORANGE}
            strokeWidth={2.5}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <SessionsLegend />
    </div>
  );
}

/** 5 time slots × 2 bars; uniform teal; peak mid-day. */
const peakData = [
  { slot: "6AM", a: 34, b: 38 },
  { slot: "10AM", a: 86, b: 92 },
  { slot: "2PM", a: 78, b: 82 },
  { slot: "6PM", a: 54, b: 50 },
  { slot: "10PM", a: 30, b: 26 },
];

export function PeakHoursChart() {
  return (
    <div className={styles.chartBoxTall}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={peakData} margin={{ top: 16, right: 8, left: -18, bottom: 4 }} barGap={4} barCategoryGap="12%">
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="slot" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            cursor={{ fill: "rgba(17, 94, 89, 0.06)" }}
            content={({ active, label, payload }) =>
              active && payload?.length ? (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipLabel}>{label}</div>
                  {payload.map((p) => (
                    <div key={String(p.dataKey)} className={styles.tooltipSub}>
                      {String(p.name)}: {p.value}
                    </div>
                  ))}
                </div>
              ) : null
            }
          />
          <Bar dataKey="a" fill={TEAL} radius={[3, 3, 0, 0]} maxBarSize={14} />
          <Bar dataKey="b" fill={TEAL} radius={[3, 3, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
