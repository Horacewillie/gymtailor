import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/button/Button";
import { getEquipmentDetail, getEquipmentUnits, type EquipmentUnit } from "../../services/equipmentService";
import equipmentPageStyles from "./EquipmentPage.module.css";
import styles from "./EquipmentDetailPanel.module.css";

export type EquipmentDetailSource = {
  id: string;
  name: string;
  category: string;
  totalUnits: number;
  frequency: number;
};

type UnitStatus = "AVAILABLE" | "OUT OF SERVICE";

type UnitRow = {
  unitId: string;
  serial: string;
  status: UnitStatus;
  lastUpdated: string;
  updatedBy: string;
};

type EquipmentDetailMetrics = {
  totalUnits: number;
  available: number;
  outOfService: number;
  usageRate: number;
  uniqueMembers: number;
  downtimeHours: number;
  frequency: number;
};

type CommonUseRow = {
  workout: string;
  usage: number;
  completion: number;
};

/** Upward / export style arrow — matches reference */
function IconExport() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M7 17L17 7M17 7H10M17 7V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch(props: { className?: string }) {
  return (
    <svg className={props.className} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 3a7.5 7.5 0 1 0 4.7 13.4l4.1 4.1a1 1 0 0 0 1.4-1.4l-4.1-4.1A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Same icons as Equipment page table */
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 17.25V20h2.75L17.8 8.95l-2.75-2.75L4 17.25Zm16.7-10.7a1 1 0 0 0 0-1.4l-1.85-1.85a1 1 0 0 0-1.4 0l-1.45 1.45 3.25 3.25 1.45-1.45Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 2v0h4V5h-4Zm-3 2v14h10V7H7Zm3 3a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm6 1v7a1 1 0 1 1-2 0v-7a1 1 0 1 1 2 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Standard curved back arrow for the return action. */
function IconReturnArrow(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 19l-7-7 7-7M3 12h10a8 8 0 0 1 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function normalizeUnitStatus(status: string): UnitStatus {
  const normalized = status.trim().toLowerCase().replace(/[_-]+/g, " ");
  if (
    normalized.includes("out of service") ||
    normalized.includes("unavailable") ||
    normalized.includes("inactive")
  ) {
    return "OUT OF SERVICE";
  }
  return "AVAILABLE";
}

function formatUnitDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value || "—";
  const date = parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} • ${time}`;
}

function mapApiUnitToRow(unit: EquipmentUnit): UnitRow {
  return {
    unitId: unit.unitId || "—",
    serial: unit.serialNumber || "—",
    status: normalizeUnitStatus(unit.status),
    lastUpdated: formatUnitDateTime(unit.lastUpdated),
    updatedBy: unit.updatedBy || "—",
  };
}

/** Page numbers + ellipsis for table footer (matches design reference). */
function buildPageList(totalPages: number, current: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

type EquipmentDetailPanelProps = {
  item: EquipmentDetailSource;
  /** When true, slide-in animation is active (entered). */
  open: boolean;
  onBack: () => void;
  onAddUnit: () => void;
  /** Fires after exit animation so parent can unmount. */
  onExitAnimationEnd: () => void;
};

/**
 * Full-viewport equipment detail layer (below dashboard header).
 * Slides in from bottom-right; list remains mounted underneath.
 */
export function EquipmentDetailPanel({ item, open, onBack, onAddUnit, onExitAnimationEnd }: EquipmentDetailPanelProps) {
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [metrics, setMetrics] = useState<EquipmentDetailMetrics>({
    totalUnits: item.totalUnits,
    available: item.totalUnits,
    outOfService: 0,
    usageRate: 0,
    uniqueMembers: 0,
    downtimeHours: 0,
    frequency: item.frequency,
  });
  const [commonUseRows, setCommonUseRows] = useState<CommonUseRow[]>([]);
  const [unitsPage, setUnitsPage] = useState(1);
  const [unitsPageSize, setUnitsPageSize] = useState(10);
  const totalUnits = units.length;
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalUnits) / unitsPageSize));
  const pageClamped = Math.min(unitsPage, totalPages);
  const unitRows = useMemo(() => {
    const start = (pageClamped - 1) * unitsPageSize;
    const end = start + unitsPageSize;
    return units.slice(start, end);
  }, [units, pageClamped, unitsPageSize]);
  const pageList = useMemo(() => buildPageList(totalPages, pageClamped), [totalPages, pageClamped]);
  const rangeStart = totalUnits === 0 ? 0 : (pageClamped - 1) * unitsPageSize + 1;
  const rangeEnd = Math.min(pageClamped * unitsPageSize, totalUnits);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    setUnitsPage((p) => Math.min(p, totalPages));
  }, [totalPages, item.id]);

  useEffect(() => {
    let mounted = true;
    setUnitsLoading(true);
    void getEquipmentUnits(item.id)
      .then((rows) => {
        if (!mounted) return;
        setUnits(rows.map(mapApiUnitToRow));
      })
      .catch((error) => {
        console.error("Failed to load equipment units:", error);
        if (mounted) setUnits([]);
      })
      .finally(() => {
        if (mounted) setUnitsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [item.id]);

  useEffect(() => {
    let mounted = true;
    void getEquipmentDetail(item.id)
      .then((response) => {
        if (!mounted) return;
        const detail = response?.equipment ?? response?.data ?? response ?? {};
        const totalUnitsFromApi = Number(detail?.total_units ?? detail?.totalUnits);
        const outOfServiceFromApi = Number(detail?.out_of_service ?? detail?.out_of_service_units ?? detail?.outOfService);
        const safeTotalUnits = Number.isFinite(totalUnitsFromApi) ? totalUnitsFromApi : item.totalUnits;
        const safeOutOfService = Number.isFinite(outOfServiceFromApi) ? outOfServiceFromApi : 0;
        const availableFromApi = Number(detail?.available_units ?? detail?.available);
        const safeAvailable = Number.isFinite(availableFromApi)
          ? availableFromApi
          : Math.max(0, safeTotalUnits - safeOutOfService);
        const usageRateFromApi = Number(detail?.usage_rate ?? detail?.usageRate);
        const uniqueMembersFromApi = Number(detail?.unique_members ?? detail?.uniqueMembers);
        const downtimeFromApi = Number(detail?.downtime_hours ?? detail?.downtimeHours ?? detail?.downtime);
        const frequencyFromApi = Number(detail?.frequency);

        setMetrics({
          totalUnits: safeTotalUnits,
          available: safeAvailable,
          outOfService: safeOutOfService,
          usageRate: Number.isFinite(usageRateFromApi) ? usageRateFromApi : 0,
          uniqueMembers: Number.isFinite(uniqueMembersFromApi) ? uniqueMembersFromApi : 0,
          downtimeHours: Number.isFinite(downtimeFromApi) ? downtimeFromApi : 0,
          frequency: Number.isFinite(frequencyFromApi) ? frequencyFromApi : item.frequency,
        });

        const commonUse = detail?.common_use ?? detail?.commonUse ?? response?.common_use ?? response?.commonUse ?? [];
        if (!Array.isArray(commonUse)) {
          setCommonUseRows([]);
          return;
        }
        setCommonUseRows(
          commonUse.map((row: any) => ({
            workout: String(row?.workout ?? row?.name ?? row?.title ?? "—"),
            usage: Number(row?.usage ?? row?.usage_count ?? row?.count ?? 0),
            completion: Number(row?.completion ?? row?.completion_rate ?? row?.completion_percent ?? 0),
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to load equipment detail metrics:", error);
      });
    return () => {
      mounted = false;
    };
  }, [item.id, item.totalUnits, item.frequency]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onBack]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (!open) onExitAnimationEnd();
  };

  return (
    <div
      className={[styles.root, open ? styles.rootEnter : ""].filter(Boolean).join(" ")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="equipment-detail-title"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.inner}>
        <header className={styles.detailHeader}>
          <div className={styles.detailHeaderLeft}>
            <div className={styles.thumb} aria-hidden="true">
              <span className={styles.thumbInner} />
            </div>
            <div>
              <h1 id="equipment-detail-title" className={styles.detailTitle}>
                {item.name}
              </h1>
              <p className={styles.detailCategory}>{item.category}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            pill
            size="md"
            className={styles.returnBtn}
            onClick={onBack}
          >
            <IconReturnArrow className={styles.returnBtnIcon} />
            RETURN TO EQUIPMENT
          </Button>
        </header>

        <div className={styles.topGrid}>
          <div className={styles.statColumn}>
            <div className={[styles.statCard, styles.statCardTotal].join(" ")}>
              <div className={styles.statLabel}>Total Units</div>
              <div className={styles.statTotalBottom}>
                <div className={styles.statValue}>{metrics.totalUnits}</div>
                <div className={styles.statPills}>
                  <span className={styles.pillAvail}>Available: {metrics.available}</span>
                  <span className={styles.pillOos}>
                    Out of Service {metrics.outOfService}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.statGrid2}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Usage rate</div>
                <div className={styles.statValue}>{metrics.usageRate}%</div>
                <div className={styles.statTrendBelow}>↑ 14% this week</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Downtime</div>
                <div className={styles.statValue}>
                  {metrics.downtimeHours}h
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Unique Members</div>
                <div className={styles.statValue}>{metrics.uniqueMembers}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Frequency</div>
                <div className={styles.statValue}>{metrics.frequency}</div>
              </div>
            </div>
          </div>

          <div className={styles.commonCard}>
            <div className={styles.commonTitle}>Common use</div>
            <div className={styles.commonHead} aria-hidden="true">
              <span>WORKOUT</span>
              <span className={styles.commonHeadNum}>USAGE</span>
              <span className={styles.commonHeadNum}>COMPLETION</span>
            </div>
            <div className={styles.commonList} role="list">
              {commonUseRows.map((row) => (
                <div key={row.workout} className={styles.commonBar} role="listitem">
                  <span className={styles.commonWorkout}>{row.workout}</span>
                  <span className={styles.commonUsage}>{row.usage}</span>
                  <span className={styles.commonCompletion}>{row.completion}%</span>
                </div>
              ))}
              {commonUseRows.length === 0 ? (
                <div className={styles.commonBar} role="listitem">
                  <span className={styles.commonWorkout}>No common use data.</span>
                  <span className={styles.commonUsage}>0</span>
                  <span className={styles.commonCompletion}>0%</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <section className={styles.unitsSection} aria-label="All units">
          <div className={styles.unitsHead}>
            <h2 className={styles.unitsTitle}>All Units</h2>
            <div className={styles.unitsActions}>
              <button type="button" className={styles.exportLink}>
                <IconExport /> EXPORT
              </button>
              <Button type="button" pill size="md" className={styles.addUnitBtn} onClick={onAddUnit}>
                + ADD UNIT
              </Button>
            </div>
          </div>

          <div className={styles.unitsTableCard}>
          <div className={styles.unitsToolbar}>
            <div className={styles.searchWrap}>
              <IconSearch className={styles.searchIcon} />
              <input className={styles.searchInput} placeholder="Search by serial no" aria-label="Search by serial" />
            </div>
            <div className={styles.unitFilters}>
              <select className={styles.filterSelect} aria-label="Filter by status">
                <option>All statuses</option>
                <option>Available</option>
                <option>Out of service</option>
              </select>
              <select className={styles.filterSelect} aria-label="Sort by last updated">
                <option>Last updated</option>
              </select>
            </div>
          </div>

          <div className={styles.unitsTableWrap}>
            <table className={styles.unitsTable}>
              <thead>
                <tr>
                  <th className={styles.checkboxCol} scope="col">
                    <span className={styles.thCheckboxWrap}>
                      <input type="checkbox" className={styles.tableCheckbox} aria-label="Select all units" />
                    </span>
                  </th>
                  <th>UNIT ID</th>
                  <th>SERIAL NO.</th>
                  <th>STATUS</th>
                  <th>LAST UPDATED</th>
                  <th>UPDATED BY</th>
                  <th
                    className={[equipmentPageStyles.rightAlign, styles.unitsActionsCol].join(" ")}
                    scope="col"
                    aria-label="Actions"
                  />
                </tr>
              </thead>
              <tbody>
                {unitRows.map((u) => (
                  <tr key={u.unitId}>
                    <td className={styles.checkboxCol}>
                      <input type="checkbox" className={styles.tableCheckbox} aria-label={`Select ${u.unitId}`} />
                    </td>
                    <td className={styles.mono}>{u.unitId}</td>
                    <td className={styles.mono}>{u.serial}</td>
                    <td>
                      <span
                        className={
                          u.status === "AVAILABLE" ? styles.unitPillAvail : styles.unitPillOos
                        }
                      >
                        <span className={styles.statusDot} aria-hidden />
                        {u.status}
                      </span>
                    </td>
                    <td className={styles.cellMuted}>{u.lastUpdated}</td>
                    <td className={styles.cellEmail}>{u.updatedBy}</td>
                    <td
                      className={[equipmentPageStyles.rightAlign, styles.unitsActionsCol].join(" ")}
                    >
                      <span className={equipmentPageStyles.actions}>
                        <button
                          type="button"
                          className={equipmentPageStyles.iconBtn}
                          aria-label={`Edit ${u.unitId}`}
                        >
                          <IconEdit />
                        </button>
                        <button
                          type="button"
                          className={[equipmentPageStyles.iconBtn, equipmentPageStyles.iconBtnDanger].join(
                            " ",
                          )}
                          aria-label={`Delete ${u.unitId}`}
                        >
                          <IconTrash />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
                {unitRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.cellMuted}>
                      {unitsLoading ? "Loading units..." : "No units found for this equipment."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className={styles.unitsFooter}>
            <div className={styles.rowsPerPage}>
              <select
                className={styles.rowsSelect}
                aria-label="Rows per page"
                value={unitsPageSize}
                onChange={(e) => {
                  setUnitsPageSize(Number(e.target.value));
                  setUnitsPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className={styles.rowsLabel}>ROWS PER PAGE</span>
            </div>
            <div className={styles.pager}>
              <button
                type="button"
                className={styles.pageArrow}
                aria-label="Previous page"
                disabled={pageClamped <= 1}
                onClick={() => setUnitsPage((p) => Math.max(1, p - 1))}
              >
                <IconChevronLeft />
              </button>
              {pageList.map((entry, i) =>
                entry === "ellipsis" ? (
                  <span key={`e-${i}`} className={styles.pageEllipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    className={entry === pageClamped ? styles.pageBtnActive : styles.pageBtn}
                    onClick={() => setUnitsPage(entry)}
                  >
                    {entry}
                  </button>
                ),
              )}
              <button
                type="button"
                className={styles.pageArrow}
                aria-label="Next page"
                disabled={pageClamped >= totalPages}
                onClick={() => setUnitsPage((p) => Math.min(totalPages, p + 1))}
              >
                <IconChevronRight />
              </button>
            </div>
            <div className={styles.pagerMeta}>
              {rangeStart === 0 ? "0" : `${rangeStart} - ${rangeEnd}`} OF {totalUnits}
            </div>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
