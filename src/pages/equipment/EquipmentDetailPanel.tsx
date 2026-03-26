import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { SuccessModal } from "../../components/success-modal/SuccessModal";
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

type UnitReason =
  | "broken"
  | "under_inspection"
  | "scheduled_maintenance"
  | "moved"
  | "other";

const UNIT_REASON_OPTIONS: { value: UnitReason; label: string }[] = [
  { value: "broken", label: "Broken" },
  { value: "under_inspection", label: "Under inspection" },
  { value: "scheduled_maintenance", label: "Scheduled maintenance" },
  { value: "moved", label: "Moved" },
  { value: "other", label: "Other" },
];

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

function IconLightbulb() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4M12 3a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V14h4v-3.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Curved return arrow — design asset; stroke uses `currentColor`. */
function IconReturnArrow(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="28"
      height="15"
      viewBox="0 0 28 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M26.5 13.4994C26.4999 11.1261 25.796 8.80618 24.4775 6.83289C23.1589 4.85961 21.2848 3.32162 19.0921 2.41342C16.8995 1.50521 14.4868 1.26758 12.1591 1.73055C9.83137 2.19353 7.69323 3.33633 6.015 5.01444L1.5 9.49944"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function shortPrefix(name: string): string {
  const w = name.replace(/[^a-zA-Z]/g, "");
  if (w.length >= 2) return w.slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const LAST_UPDATED_SAMPLES = [
  "25 Dec 2026 • 11:15 AM",
  "24 Dec 2026 • 4:30 PM",
  "23 Dec 2026 • 9:00 AM",
  "22 Dec 2026 • 2:45 PM",
  "21 Dec 2026 • 8:20 AM",
  "20 Dec 2026 • 6:10 PM",
  "19 Dec 2026 • 12:00 PM",
  "18 Dec 2026 • 3:33 PM",
  "17 Dec 2026 • 10:05 AM",
  "16 Dec 2026 • 5:50 PM",
] as const;

function serialForIndex(i: number): string {
  const a = 847 + ((i * 31) % 200);
  const b = 8932 + ((i * 17) % 100);
  const suffix = ["KJ", "LM", "ZX", "QP", "RN", "TW"][i % 6];
  return `${a}-${b}${suffix}`;
}

function buildUnitRows(
  item: EquipmentDetailSource,
  page: number,
  pageSize: number,
): UnitRow[] {
  const prefix = shortPrefix(item.name);
  const total = item.totalUnits;
  if (total <= 0) return [];
  const start = (page - 1) * pageSize;
  const count = Math.min(pageSize, Math.max(0, total - start));

  return Array.from({ length: count }, (_, j) => {
    const idx = start + j;
    const status: UnitStatus = idx % 9 === 1 || idx % 11 === 4 ? "OUT OF SERVICE" : "AVAILABLE";
    return {
      unitId: `${prefix}-${String(idx + 1).padStart(3, "0")}`,
      serial: serialForIndex(idx),
      status,
      lastUpdated: LAST_UPDATED_SAMPLES[idx % LAST_UPDATED_SAMPLES.length],
      updatedBy: "samuel@ifitness.com",
    };
  });
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

const COMMON_USE = [
  { workout: "Warm-up", usage: 13, completion: 75 },
  { workout: "Incline Walk Session", usage: 10, completion: 80 },
  { workout: "Endurance Builder", usage: 8, completion: 85 },
  { workout: "Fat Loss Cardio Session", usage: 12, completion: 70 },
  { workout: "HIIT Cardio (Intervals)", usage: 9, completion: 65 },
] as const;

type EquipmentDetailPanelProps = {
  item: EquipmentDetailSource;
  /** When true, slide-in animation is active (entered). */
  open: boolean;
  onBack: () => void;
  /** Fires after exit animation so parent can unmount. */
  onExitAnimationEnd: () => void;
};

/**
 * Full-viewport equipment detail layer (below dashboard header).
 * Slides in from bottom-right; list remains mounted underneath.
 */
export function EquipmentDetailPanel({ item, open, onBack, onExitAnimationEnd }: EquipmentDetailPanelProps) {
  const outOfService = Math.min(2, Math.max(0, Math.floor(item.totalUnits * 0.03)));
  const available = Math.max(0, item.totalUnits - outOfService);
  const usageRate = Math.min(99, 42 + (item.frequency % 40));
  const uniqueMembers = Math.min(999, Math.round(item.totalUnits * 1.28 + item.frequency * 0.02));
  const downtimeHours = 0;
  const [unitsPage, setUnitsPage] = useState(1);
  const [unitsPageSize, setUnitsPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(Math.max(0, item.totalUnits) / unitsPageSize));
  const pageClamped = Math.min(unitsPage, totalPages);
  const unitRowsBuilt = useMemo(
    () => buildUnitRows(item, pageClamped, unitsPageSize),
    [item, pageClamped, unitsPageSize],
  );
  const [unitRowOverrides, setUnitRowOverrides] = useState<
    Record<string, Partial<Pick<UnitRow, "serial" | "status">>>
  >({});
  const unitRows = useMemo(
    () =>
      unitRowsBuilt.map((row) => {
        const o = unitRowOverrides[row.unitId];
        if (!o) return row;
        return {
          ...row,
          ...(o.serial !== undefined ? { serial: o.serial } : {}),
          ...(o.status !== undefined ? { status: o.status } : {}),
        };
      }),
    [unitRowsBuilt, unitRowOverrides],
  );
  const pageList = useMemo(() => buildPageList(totalPages, pageClamped), [totalPages, pageClamped]);
  const rangeStart = item.totalUnits === 0 ? 0 : (pageClamped - 1) * unitsPageSize + 1;
  const rangeEnd = Math.min(pageClamped * unitsPageSize, item.totalUnits);

  const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
  const [addUnitSuccessOpen, setAddUnitSuccessOpen] = useState(false);
  const [removeUnitTarget, setRemoveUnitTarget] = useState<UnitRow | null>(null);
  const [removeUnitSuccessOpen, setRemoveUnitSuccessOpen] = useState(false);
  const [editUnitTarget, setEditUnitTarget] = useState<UnitRow | null>(null);
  const [updateUnitSuccessOpen, setUpdateUnitSuccessOpen] = useState(false);
  const [updateSuccessOosSubtext, setUpdateSuccessOosSubtext] = useState(false);
  const [updateUnitDraft, setUpdateUnitDraft] = useState({
    serial: "",
    status: "available" as "available" | "out_of_service",
    reason: "" as "" | UnitReason,
    notifyMember: true,
  });
  const [addUnitDraft, setAddUnitDraft] = useState({
    serial: "",
    status: "" as "" | "available" | "out_of_service",
    notifyMember: false,
  });

  const canSubmitAddUnit =
    addUnitDraft.serial.trim().length > 0 && addUnitDraft.status !== "";

  const canSubmitUpdate =
    updateUnitDraft.serial.trim().length > 0 &&
    (updateUnitDraft.status === "available" ||
      (updateUnitDraft.status === "out_of_service" && updateUnitDraft.reason !== ""));

  useEffect(() => {
    if (!addUnitModalOpen) return;
    setAddUnitDraft({ serial: "", status: "", notifyMember: false });
  }, [addUnitModalOpen]);

  useEffect(() => {
    if (!editUnitTarget) return;
    setUpdateUnitDraft({
      serial: editUnitTarget.serial,
      status: editUnitTarget.status === "AVAILABLE" ? "available" : "out_of_service",
      reason: editUnitTarget.status === "OUT OF SERVICE" ? "broken" : "",
      notifyMember: true,
    });
  }, [editUnitTarget]);

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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (
        addUnitModalOpen ||
        addUnitSuccessOpen ||
        removeUnitTarget !== null ||
        removeUnitSuccessOpen ||
        editUnitTarget !== null ||
        updateUnitSuccessOpen
      )
        return;
      onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    open,
    onBack,
    addUnitModalOpen,
    addUnitSuccessOpen,
    removeUnitTarget,
    removeUnitSuccessOpen,
    editUnitTarget,
    updateUnitSuccessOpen,
  ]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (!open) onExitAnimationEnd();
  };

  return (
    <>
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
                <div className={styles.statValue}>{item.totalUnits}</div>
                <div className={styles.statPills}>
                  <span className={styles.pillAvail}>Available: {available}</span>
                  <span className={styles.pillOos}>
                    Out of Service {outOfService}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.statGrid2}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Usage rate</div>
                <div className={styles.statValue}>{usageRate}%</div>
                <div className={styles.statTrendBelow}>↑ 14% this week</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Downtime</div>
                <div className={styles.statValue}>
                  {downtimeHours}h
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Unique Members</div>
                <div className={styles.statValue}>{uniqueMembers}</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Frequency</div>
                <div className={styles.statValue}>{item.frequency}</div>
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
              {COMMON_USE.map((row) => (
                <div key={row.workout} className={styles.commonBar} role="listitem">
                  <span className={styles.commonWorkout}>{row.workout}</span>
                  <span className={styles.commonUsage}>{row.usage}</span>
                  <span className={styles.commonCompletion}>{row.completion}%</span>
                </div>
              ))}
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
              <Button
                type="button"
                pill
                size="md"
                className={styles.addUnitBtn}
                onClick={() => setAddUnitModalOpen(true)}
              >
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
                          onClick={() => setEditUnitTarget(u)}
                        >
                          <IconEdit />
                        </button>
                        <button
                          type="button"
                          className={[equipmentPageStyles.iconBtn, equipmentPageStyles.iconBtnDanger].join(
                            " ",
                          )}
                          aria-label={`Delete ${u.unitId}`}
                          onClick={() => setRemoveUnitTarget(u)}
                        >
                          <IconTrash />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
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
              {rangeStart === 0 ? "0" : `${rangeStart} - ${rangeEnd}`} OF {item.totalUnits}
            </div>
          </div>
          </div>
        </section>
      </div>
    </div>

    <Modal
      open={addUnitModalOpen}
      onClose={() => setAddUnitModalOpen(false)}
      title="Add equipment unit"
      titleId="add-equipment-unit-title"
      size="sm"
      titleClassName={styles.addUnitModalTitle}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            pill
            fullWidth
            size="lg"
            onClick={() => setAddUnitModalOpen(false)}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="primary"
            pill
            fullWidth
            size="sm"
            disabled={!canSubmitAddUnit}
            onClick={() => {
              if (!canSubmitAddUnit) return;
              setAddUnitModalOpen(false);
              setAddUnitSuccessOpen(true);
            }}
          >
            ADD UNIT
          </Button>
        </>
      }
    >
      <>
        <div className={equipmentPageStyles.fieldLabel}>EQUIPMENT NAME</div>
        <input
          className={[equipmentPageStyles.input, styles.addUnitReadonlyInput].join(" ")}
          readOnly
          aria-readonly="true"
          value={item.name}
        />

        <div className={styles.addUnitFieldGap} />

        <div className={equipmentPageStyles.fieldLabel}>SERIAL NUMBER</div>
        <input
          className={equipmentPageStyles.input}
          placeholder="e.g SN-8932KJ"
          value={addUnitDraft.serial}
          onChange={(e) => setAddUnitDraft((d) => ({ ...d, serial: e.target.value }))}
          autoComplete="off"
        />
        <div className={equipmentPageStyles.noteRow}>
          <span className={equipmentPageStyles.noteIcon} aria-hidden="true">
            i
          </span>
          <span>Use the serial number on the equipment label.</span>
        </div>

        <div className={equipmentPageStyles.fieldLabel}>STATUS</div>
        <select
          className={equipmentPageStyles.select}
          aria-label="Unit status"
          value={addUnitDraft.status}
          onChange={(e) =>
            setAddUnitDraft((d) => ({
              ...d,
              status: e.target.value as "" | "available" | "out_of_service",
            }))
          }
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="available">Available</option>
          <option value="out_of_service">Out of service</option>
        </select>

        <label className={equipmentPageStyles.checkRow}>
          <input
            type="checkbox"
            checked={addUnitDraft.notifyMember}
            onChange={(e) =>
              setAddUnitDraft((d) => ({ ...d, notifyMember: e.target.checked }))
            }
          />
          Notify member about this update
        </label>
      </>
    </Modal>

    <SuccessModal
      open={addUnitSuccessOpen}
      onClose={() => setAddUnitSuccessOpen(false)}
      titleId="add-unit-success-title"
      line1="Equipment unit"
      line2="added successfully"
      primaryLabel="DISMISS"
      onPrimary={() => setAddUnitSuccessOpen(false)}
      primaryLayout="full"
    />

    <Modal
      open={editUnitTarget !== null}
      onClose={() => setEditUnitTarget(null)}
      title="Update equipment unit"
      titleId="update-equipment-unit-title"
      size="sm"
      titleClassName={styles.addUnitModalTitle}
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            pill
            fullWidth
            size="lg"
            onClick={() => setEditUnitTarget(null)}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="primary"
            pill
            fullWidth
            size="sm"
            disabled={!canSubmitUpdate}
            onClick={() => {
              if (!canSubmitUpdate || !editUnitTarget) return;
              setUnitRowOverrides((prev) => ({
                ...prev,
                [editUnitTarget.unitId]: {
                  serial: updateUnitDraft.serial.trim(),
                  status:
                    updateUnitDraft.status === "available" ? "AVAILABLE" : "OUT OF SERVICE",
                },
              }));
              setUpdateSuccessOosSubtext(updateUnitDraft.status === "out_of_service");
              setEditUnitTarget(null);
              setUpdateUnitSuccessOpen(true);
            }}
          >
            SAVE CHANGES
          </Button>
        </>
      }
    >
      <>
        <div className={equipmentPageStyles.fieldLabel}>EQUIPMENT NAME</div>
        <input
          className={[equipmentPageStyles.input, styles.addUnitReadonlyInput].join(" ")}
          readOnly
          aria-readonly="true"
          value={item.name}
        />

        <div className={styles.addUnitFieldGap} />

        <div className={equipmentPageStyles.fieldLabel}>SERIAL NUMBER</div>
        <input
          className={equipmentPageStyles.input}
          value={updateUnitDraft.serial}
          onChange={(e) => setUpdateUnitDraft((d) => ({ ...d, serial: e.target.value }))}
          autoComplete="off"
        />
        <div className={equipmentPageStyles.noteRow}>
          <span className={equipmentPageStyles.noteIcon} aria-hidden="true">
            i
          </span>
          <span>Use the serial number on the equipment label.</span>
        </div>

        <div className={equipmentPageStyles.fieldLabel}>STATUS</div>
        <select
          className={equipmentPageStyles.select}
          aria-label="Unit status"
          value={updateUnitDraft.status}
          onChange={(e) => {
            const v = e.target.value as "available" | "out_of_service";
            setUpdateUnitDraft((d) => ({
              ...d,
              status: v,
              reason: v === "out_of_service" ? d.reason || "broken" : "",
            }));
          }}
        >
          <option value="available">Available</option>
          <option value="out_of_service">Out of service</option>
        </select>

        {updateUnitDraft.status === "out_of_service" ? (
          <>
            <div className={styles.addUnitFieldGap} />
            <div className={equipmentPageStyles.fieldLabel}>REASON</div>
            <select
              className={equipmentPageStyles.select}
              aria-label="Reason for out of service"
              value={updateUnitDraft.reason}
              onChange={(e) =>
                setUpdateUnitDraft((d) => ({
                  ...d,
                  reason: e.target.value as UnitReason,
                }))
              }
            >
              {UNIT_REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        ) : null}

        <label className={equipmentPageStyles.checkRow}>
          <input
            type="checkbox"
            checked={updateUnitDraft.notifyMember}
            onChange={(e) =>
              setUpdateUnitDraft((d) => ({ ...d, notifyMember: e.target.checked }))
            }
          />
          Notify member about this update
        </label>

        {updateUnitDraft.status === "out_of_service" ? (
          <div className={styles.updateUnitAlert}>
            <span className={styles.updateUnitAlertIcon}>
              <IconLightbulb />
            </span>
            <span>
              This will reduce available {item.name} by 1 and remove it from recommendations until
              it&apos;s available again.
            </span>
          </div>
        ) : null}
      </>
    </Modal>

    <SuccessModal
      open={updateUnitSuccessOpen}
      onClose={() => {
        setUpdateUnitSuccessOpen(false);
        setUpdateSuccessOosSubtext(false);
      }}
      titleId="update-unit-success-title"
      line1="Equipment unit updated"
      line2="successfully"
      primaryLabel="DISMISS"
      onPrimary={() => {
        setUpdateUnitSuccessOpen(false);
        setUpdateSuccessOosSubtext(false);
      }}
      primaryLayout="full"
      descriptionLine1={
        updateSuccessOosSubtext
          ? "You marked this unit as out of service."
          : "Your changes have been saved."
      }
      descriptionLine2={updateSuccessOosSubtext ? "Workouts will automatically adjust." : undefined}
    />

    <Modal
      open={removeUnitTarget !== null}
      onClose={() => setRemoveUnitTarget(null)}
      title="Remove equipment unit?"
      titleId="remove-equipment-unit-title"
      titleClassName={equipmentPageStyles.removeModalTitle}
      size="sm"
      footerAlign="end"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            pill
            size="md"
            className={equipmentPageStyles.removeModalCancelBtn}
            onClick={() => setRemoveUnitTarget(null)}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            variant="primary"
            pill
            size="md"
            className={equipmentPageStyles.removeModalConfirmBtn}
            onClick={() => {
              setRemoveUnitTarget(null);
              setRemoveUnitSuccessOpen(true);
            }}
          >
            YES, REMOVE
          </Button>
        </>
      }
    >
      {removeUnitTarget ? (
        <p className={equipmentPageStyles.removeModalBody}>
          Are you sure you want to remove unit <strong>&quot;{removeUnitTarget.serial}&quot;</strong> from your
          inventory? This will reduce available <strong>{item.name}</strong> by 1 and remove it from
          recommendations until it&apos;s available again.
        </p>
      ) : null}
    </Modal>

    <SuccessModal
      open={removeUnitSuccessOpen}
      onClose={() => setRemoveUnitSuccessOpen(false)}
      titleId="remove-unit-success-title"
      line1="Equipment unit"
      line2="removed successfully"
      primaryLabel="DISMISS"
      onPrimary={() => setRemoveUnitSuccessOpen(false)}
      primaryLayout="narrow"
    />
    </>
  );
}
