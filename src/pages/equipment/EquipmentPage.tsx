import { useEffect, useId, useMemo, useRef, useState } from "react";
import Api from "../../api/Api";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { SuccessModal } from "../../components/success-modal/SuccessModal";
import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";
import { EquipmentDetailPanel } from "./EquipmentDetailPanel";
import styles from "./EquipmentPage.module.css";

type EquipmentStatus = "Available" | "Unavailable";

type EquipmentItem = {
  id: string;
  name: string;
  serialNumber?: string;
  addedOn: Date;
  category: string;
  status: EquipmentStatus;
  totalUnits: number;
  frequency: number;
};

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

function IconExport() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

function IconPhoto() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v7.9l2.6-2.5a1.5 1.5 0 0 1 2 0l1.7 1.6 3.2-3.1a1.5 1.5 0 0 1 2 0l2.5 2.4V6.5a.5.5 0 0 0-.5-.5h-11ZM6 17.5c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-3.9l-3.2-3.1a.5.5 0 0 0-.7 0l-3.9 3.8a1.5 1.5 0 0 1-2.1 0L6 12.8v4.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

type AddEquipmentDraft = {
  imageFile: File | null;
  name: string;
  serialNumber: string;
  category: string;
  notifyMember: boolean;
};

type EquipmentListApiItem = {
  id?: string | number;
  equipment_id?: string | number;
  name: string;
  date_created: string;
  category: string;
  status: string;
  total_units: number;
  frequency: number;
};

type EquipmentListApiResponse = {
  total: number;
  available: number;
  unavailable: number;
  equipments: EquipmentListApiItem[];
};

function formatAddedOn(d: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const h = d.getHours();
  const hh = String(((h + 11) % 12) + 1);
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${day} ${month} ${year} • ${hh}:${mm} ${ampm}`;
}

function parseApiDateTime(value: string): Date {
  if (!value) return new Date();
  // API sends "YYYY-MM-DD HH:mm:ss"; normalize so Date parsing is reliable.
  const normalized = value.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function mapApiStatus(status: string): EquipmentStatus {
  return status.toLowerCase() === "unavailable" ? "Unavailable" : "Available";
}

function getApiEquipmentId(item: EquipmentListApiItem): string | null {
  const raw = item.id ?? item.equipment_id;
  if (raw === null || raw === undefined) return null;
  const id = String(raw).trim();
  return id.length > 0 ? id : null;
}

function toCsv(items: EquipmentItem[]) {
  const rows = [
    ["Equipment", "Added on", "Category", "Status", "Total units", "Frequency"],
    ...items.map((i) => [
      i.name,
      formatAddedOn(i.addedOn),
      i.category,
      i.status,
      String(i.totalUnits),
      String(i.frequency),
    ]),
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return rows.map((r) => r.map(escape).join(",")).join("\n");
}

function downloadTextFile(filename: string, contents: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Max upload size for CSV import (matches UI copy). */
const MAX_CSV_IMPORT_BYTES = 50 * 1024 * 1024;

/** Template users download before filling data — columns documented in the modal. */
const EQUIPMENT_IMPORT_CSV_TEMPLATE = `Serial Number,Product VA,Grouping
D92CBNE020000160,Group Cycle Connect with Console,Group Cycle
D92CBNE020000165,Group Cycle Connect with Console,Group Cycle
D92CBNE020000168,Group Cycle Connect with Console,Group Cycle
`;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else if (c !== "\r") {
      cur += c;
    }
  }
  result.push(cur);
  return result.map((s) => s.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseEquipmentImportCsv(text: string): EquipmentItem[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.includes(","));
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const serialIdx = headers.findIndex((h) => h === "serialnumber");
  const productIdx = headers.findIndex((h) => h === "productva" || h === "equipment");
  const groupingIdx = headers.findIndex((h) => h === "grouping" || h === "category");
  const totalUnitsIdx = headers.findIndex((h) => h === "totalunits");

  const hasUnitRowsFormat = serialIdx >= 0 && productIdx >= 0 && groupingIdx >= 0;
  const hasLegacyFormat = productIdx >= 0 && groupingIdx >= 0 && totalUnitsIdx >= 0;
  if (!hasUnitRowsFormat && !hasLegacyFormat) return [];

  const out: EquipmentItem[] = [];
  const grouped = new Map<string, { name: string; category: string; serials: string[] }>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const name = (cols[productIdx] ?? "").trim();
    const cat = (cols[groupingIdx] ?? "").trim() || "General";
    if (!name) continue;

    if (hasUnitRowsFormat) {
      const serial = (cols[serialIdx] ?? "").trim();
      if (!serial) continue;
      const key = `${name.toLowerCase()}::${cat.toLowerCase()}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.serials.push(serial);
      } else {
        grouped.set(key, { name, category: cat, serials: [serial] });
      }
      continue;
    }

    const unitsRaw = (cols[totalUnitsIdx] ?? "").trim();
    const units = Math.max(1, Math.floor(Number(unitsRaw)) || 1);
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-csv-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`;
    out.push({
      id,
      name,
      addedOn: new Date(),
      category: cat,
      status: "Available",
      totalUnits: units,
      serialNumber: "",
      frequency: 0,
    });
  }

  if (hasUnitRowsFormat) {
    grouped.forEach((entry, idx) => {
      const id = `${entry.name.toLowerCase().replace(/\s+/g, "-")}-csv-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 9)}`;
      out.push({
        id,
        name: entry.name,
        addedOn: new Date(),
        category: entry.category,
        status: "Available",
        totalUnits: entry.serials.length,
        serialNumber: entry.serials[0] ?? "",
        frequency: 0,
      });
    });
  }

  return out;
}

const INITIAL_EQUIPMENT_ITEMS: EquipmentItem[] = [];

/**
 * Equipment dashboard route (`/dashboard/equipment`).
 *
 * Key goals:
 * - Keep UI dynamic (search/filter/pagination) so it can be wired to live data later.
 * - Keep the header/nav reusable via `DashboardShell`.
 * - Match the screenshot layout while avoiding hard-coded “only works for this data” behavior.
 */
export function EquipmentPage() {
  const api = useMemo(() => new Api(), []);
  const [items, setItems] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_ITEMS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | EquipmentStatus>("All");
  const [category, setCategory] = useState<"All" | string>("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuWrapRef = useRef<HTMLDivElement | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  /** After add form submit. */
  const [addSuccessModalOpen, setAddSuccessModalOpen] = useState(false);

  const [importCsvModalOpen, setImportCsvModalOpen] = useState(false);
  const [csvImportFile, setCsvImportFile] = useState<File | null>(null);
  const [csvImportError, setCsvImportError] = useState<string | null>(null);
  const csvImportFileInputId = useId();

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<AddEquipmentDraft>({
    imageFile: null,
    name: "",
    serialNumber: "",
    category: "",
    notifyMember: false,
  });
  const updateFileInputId = useId();
  const [updateSuccessModalOpen, setUpdateSuccessModalOpen] = useState(false);

  /** Row pending removal — confirmation modal open when set. */
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [removeSuccessModalOpen, setRemoveSuccessModalOpen] = useState(false);

  /** Equipment detail overlay (slides in over list; nav stays visible). */
  const [equipmentDetailId, setEquipmentDetailId] = useState<string | null>(null);
  const [equipmentDetailOpen, setEquipmentDetailOpen] = useState(false);

  const addFileInputId = useId();
  const [draft, setDraft] = useState<AddEquipmentDraft>({
    imageFile: null,
    name: "",
    serialNumber: "",
    category: "",
    notifyMember: false,
  });

  const canAdd =
    draft.name.trim().length > 0 &&
    draft.serialNumber.trim().length > 0 &&
    draft.category.trim().length > 0;
  const canSaveEdit =
    editingId !== null &&
    editDraft.name.trim().length > 0 &&
    editDraft.serialNumber.trim().length > 0 &&
    editDraft.category.trim().length > 0;

  const editImageUrl = useMemo(() => {
    if (!editDraft.imageFile) return null;
    return URL.createObjectURL(editDraft.imageFile);
  }, [editDraft.imageFile]);

  useEffect(() => {
    return () => {
      if (editImageUrl) URL.revokeObjectURL(editImageUrl);
    };
  }, [editImageUrl]);

  const addMenuOptions = useMemo(() => {
    return [
      {
        id: "manual",
        label: "Add manually",
        onSelect: () => {
          setAddModalOpen(true);
        },
      },
      {
        id: "csv",
        label: "Upload CSV for bulk import",
        onSelect: () => {
          setImportCsvModalOpen(true);
        },
      },
    ] as const;
  }, []);

  const equipmentDetailItem = useMemo(
    () => (equipmentDetailId ? items.find((i) => i.id === equipmentDetailId) ?? null : null),
    [items, equipmentDetailId],
  );

  useEffect(() => {
    if (!equipmentDetailId) {
      setEquipmentDetailOpen(false);
      return;
    }
    setEquipmentDetailOpen(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEquipmentDetailOpen(true));
    });
    return () => cancelAnimationFrame(id);
  }, [equipmentDetailId]);

  useEffect(() => {
    if (!addMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = addMenuWrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setAddMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [addMenuOpen]);


  const total = items.length;
  const availableCount = useMemo(() => items.filter((i) => i.status === "Available").length, [items]);
  const unavailableCount = useMemo(() => items.filter((i) => i.status === "Unavailable").length, [items]);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (status !== "All" && i.status !== status) return false;
      if (category !== "All" && i.category !== category) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, status, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * rowsPerPage;
  const endIdx = Math.min(filtered.length, startIdx + rowsPerPage);

  const pageRows = useMemo(() => filtered.slice(startIdx, endIdx), [filtered, startIdx, endIdx]);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const tenantId = localStorage.getItem("tenantId") || localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (!tenantId) return;
    const endpoint = `/api/tenant/${encodeURIComponent(tenantId)}/equipment`;
    console.log("[EquipmentPage] Request URL:", endpoint);

    void api
      .get<EquipmentListApiResponse>(endpoint, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      .then((response) => {
        console.log("[EquipmentPage] API response:", response);
        if (!mounted || !Array.isArray(response?.equipments)) return;
        const mapped = response.equipments.map((equipment, idx) => {
          const apiEquipmentId = getApiEquipmentId(equipment);
          return {
            id: apiEquipmentId ?? `${equipment.name.toLowerCase().replace(/\s+/g, "-")}-${idx}-${Date.now()}`,
            name: equipment.name,
            serialNumber: "",
            addedOn: parseApiDateTime(equipment.date_created),
            category: equipment.category,
            status: mapApiStatus(equipment.status),
            totalUnits: Number(equipment.total_units) || 0,
            frequency: Number(equipment.frequency) || 0,
          };
        });
        setItems(mapped);
        setPage(1);
      })
      .catch((error) => {
        console.error("Failed to load equipment list:", error);
      });

    return () => {
      mounted = false;
    };
  }, [api]);

  const toggleAll = (next: boolean) => {
    setChecked((prev) => {
      const copy = { ...prev };
      for (const r of pageRows) copy[r.id] = next;
      return copy;
    });
  };

  const exportRows = () => {
    const csv = toCsv(filtered);
    downloadTextFile("equipment.csv", csv, "text/csv;charset=utf-8");
  };

  return (
    <div className={styles.page}>
      <DashboardShell>
        <main className={styles.main}>
          <section className={styles.container}>
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.h1}>Equipment</h1>
                <p className={styles.sub}>Workouts are recommended based on what&apos;s available here.</p>
              </div>

              <div className={styles.addMenuWrap} ref={addMenuWrapRef}>
                <Button
                  pill
                  size="md"
                  className={styles.addBtn}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={addMenuOpen}
                  onClick={() => setAddMenuOpen((v) => !v)}
                >
                  ADD EQUIPMENT <IconChevronDown className={styles.addBtnIcon} />
                </Button>

                {addMenuOpen ? (
                  <div className={styles.addMenu} role="menu" aria-label="Add equipment options">
                    {addMenuOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={styles.addMenuItem}
                        role="menuitem"
                        onClick={() => {
                          setAddMenuOpen(false);
                          opt.onSelect();
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <Modal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              title="Add equipment"
              titleId="add-equipment-title"
              size="sm"
              footer={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    pill
                    fullWidth
                    size="lg"
                    onClick={() => setAddModalOpen(false)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    pill
                    fullWidth
                    size="sm"
                    disabled={!canAdd}
                    onClick={() => {
                      if (!canAdd) return;
                      const next: EquipmentItem = {
                        id: `${draft.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
                        name: draft.name.trim(),
                        serialNumber: draft.serialNumber.trim(),
                        addedOn: new Date(),
                        category: draft.category,
                        status: "Available",
                        totalUnits: 1,
                        frequency: 0,
                      };
                      setItems((prev) => [next, ...prev]);
                      setAddModalOpen(false);
                      setDraft({
                        imageFile: null,
                        name: "",
                        serialNumber: "",
                        category: "",
                        notifyMember: false,
                      });
                      setPage(1);
                      setAddSuccessModalOpen(true);
                    }}
                  >
                    ADD EQUIPMENT
                  </Button>
                </>
              }
            >
              <>
                <div className={styles.fieldLabel}>UPLOAD EQUIPMENT IMAGE</div>

                <input
                  id={addFileInputId}
                  className={styles.fileInput}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const input = e.currentTarget;
                    const f = input.files?.[0] ?? null;
                    setDraft((d) => ({ ...d, imageFile: f }));
                  }}
                />

                <label className={styles.dropzone} htmlFor={addFileInputId}>
                  <span className={styles.dropIcon} aria-hidden="true">
                    <IconPhoto />
                  </span>
                  <span className={styles.dropText}>
                    Drop your files here or <span className={styles.dropLink}>Click to upload</span>
                  </span>
                  <span className={styles.dropHint}>JPG, PNG. Max size: 2MB</span>
                </label>

                <div className={styles.noteRow}>
                  <span className={styles.noteIcon} aria-hidden="true">
                    i
                  </span>
                  <span>Your gym members will see this image on their end.</span>
                </div>

                <div className={styles.fieldLabel}>EQUIPMENT NAME</div>
                <input
                  className={styles.input}
                  placeholder="Enter equipment name"
                  value={draft.name}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setDraft((d) => ({ ...d, name: next }));
                  }}
                />

                <div style={{ height: 14 }} />

                <div className={styles.fieldLabel}>SERIAL NUMBER</div>
                <input
                  className={styles.input}
                  placeholder="Enter serial number"
                  value={draft.serialNumber}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setDraft((d) => ({ ...d, serialNumber: next }));
                  }}
                />

                <div style={{ height: 14 }} />

                <div className={styles.fieldLabel}>CATEGORY</div>
                <select
                  className={styles.select}
                  value={draft.category}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setDraft((d) => ({ ...d, category: next }));
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={draft.notifyMember}
                    onChange={(e) => {
                      const next = e.currentTarget.checked;
                      setDraft((d) => ({ ...d, notifyMember: next }));
                    }}
                  />
                  Notify member about this update
                </label>
              </>
            </Modal>

            <Modal
              open={importCsvModalOpen}
              onClose={() => {
                setImportCsvModalOpen(false);
                setCsvImportFile(null);
                setCsvImportError(null);
              }}
              title="Import equipment from CSV"
              titleId="import-equipment-csv-title"
              size="sm"
              footer={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    pill
                    fullWidth
                    size="md"
                    onClick={() => {
                      setImportCsvModalOpen(false);
                      setCsvImportFile(null);
                      setCsvImportError(null);
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    pill
                    fullWidth
                    size="md"
                    disabled={!csvImportFile}
                    onClick={() => {
                      if (!csvImportFile) return;
                      void (async () => {
                        try {
                          const text = await csvImportFile.text();
                          const parsed = parseEquipmentImportCsv(text);
                          if (parsed.length === 0) {
                            setCsvImportError(
                              "No valid equipment rows found. Use columns: Serial Number, Product VA, Grouping.",
                            );
                            return;
                          }
                          setCsvImportError(null);
                          setItems((prev) => [...parsed, ...prev]);
                          setImportCsvModalOpen(false);
                          setCsvImportFile(null);
                          setPage(1);
                          setAddSuccessModalOpen(true);
                        } catch {
                          setCsvImportError("Could not read this file. Try a UTF-8 CSV export.");
                        }
                      })();
                    }}
                  >
                    CONTINUE
                  </Button>
                </>
              }
            >
              <>
                <div className={styles.csvTemplateBox}>
                  <div className={styles.csvTemplateHeading}>Download the origin template</div>
                  <p className={styles.csvTemplateDesc}>
                    Download a CSV template to match the required format and fill in the data. Then upload the file below
                    to add multiple equipment.
                  </p>
                  <div className={styles.csvTemplateBtnRow}>
                    <Button
                      type="button"
                      variant="ghost"
                      pill
                      fullWidth
                      size="md"
                      className={styles.csvTemplateDownloadBtn}
                      onClick={() => {
                        downloadTextFile(
                          "equipment-import-template.csv",
                          EQUIPMENT_IMPORT_CSV_TEMPLATE,
                          "text/csv;charset=utf-8",
                        );
                      }}
                    >
                      DOWNLOAD CSV TEMPLATE
                    </Button>
                  </div>
                </div>

                <div className={styles.csvUploadHeading}>Upload your CSV file</div>
                <p className={styles.csvUploadDesc}>
                  Upload your CSV with columns: Serial Number, Product VA, Grouping.
                </p>

                <input
                  id={csvImportFileInputId}
                  className={styles.fileInput}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const input = e.currentTarget;
                    const f = input.files?.[0] ?? null;
                    setCsvImportError(null);
                    if (!f) {
                      setCsvImportFile(null);
                      return;
                    }
                    if (f.size > MAX_CSV_IMPORT_BYTES) {
                      setCsvImportError("Maximum file size is 50MB.");
                      setCsvImportFile(null);
                      input.value = "";
                      return;
                    }
                    setCsvImportFile(f);
                  }}
                />
                <label
                  className={`${styles.dropzone} ${styles.csvImportDropzone}`}
                  htmlFor={csvImportFileInputId}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const f = e.dataTransfer.files?.[0];
                    setCsvImportError(null);
                    if (!f) return;
                    if (!/\.csv$/i.test(f.name) && f.type !== "text/csv" && f.type !== "application/vnd.ms-excel") {
                      setCsvImportError("Please choose a .csv file.");
                      return;
                    }
                    if (f.size > MAX_CSV_IMPORT_BYTES) {
                      setCsvImportError("Maximum file size is 50MB.");
                      setCsvImportFile(null);
                      return;
                    }
                    setCsvImportFile(f);
                  }}
                >
                  <span className={styles.csvDropBadge} aria-hidden="true">
                    CSV
                  </span>
                  <span className={styles.dropText}>
                    Drop your files here or <span className={styles.dropLink}>Click to upload</span>
                  </span>
                  <span className={styles.dropHint}>Maximum size: 50MB</span>
                </label>
                {csvImportFile ? (
                  <div className={styles.csvSelectedFile} aria-live="polite">
                    Selected: <strong>{csvImportFile.name}</strong>
                  </div>
                ) : null}
                {csvImportError ? (
                  <div className={styles.csvImportError} role="alert">
                    {csvImportError}
                  </div>
                ) : null}
              </>
            </Modal>

            <Modal
              open={updateModalOpen}
              onClose={() => {
                setUpdateModalOpen(false);
                setEditingId(null);
                setEditDraft({
                  imageFile: null,
                  name: "",
                  serialNumber: "",
                  category: "",
                  notifyMember: false,
                });
              }}
              title="Update equipment"
              titleId="update-equipment-title"
              size="sm"
              footer={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    pill
                    fullWidth
                    size="lg"
                    onClick={() => {
                      setUpdateModalOpen(false);
                      setEditingId(null);
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="button"
                    pill
                    fullWidth
                    size="lg"
                    className={styles.modalSaveBtn}
                    disabled={!canSaveEdit}
                    onClick={() => {
                      if (!canSaveEdit || !editingId) return;
                      setItems((prev) =>
                        prev.map((it) =>
                          it.id === editingId
                            ? {
                                ...it,
                                name: editDraft.name.trim(),
                                serialNumber: editDraft.serialNumber.trim(),
                                category: editDraft.category,
                              }
                            : it,
                        ),
                      );
                      setUpdateModalOpen(false);
                      setEditingId(null);
                      setEditDraft({
                        imageFile: null,
                        name: "",
                        serialNumber: "",
                        category: "",
                        notifyMember: false,
                      });
                      setUpdateSuccessModalOpen(true);
                    }}
                  >
                    SAVE CHANGES
                  </Button>
                </>
              }
            >
              <>
                <div className={styles.fieldLabel}>UPLOAD EQUIPMENT IMAGE</div>
                <input
                  id={updateFileInputId}
                  className={styles.fileInput}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const input = e.currentTarget;
                    const f = input.files?.[0] ?? null;
                    setEditDraft((d) => ({ ...d, imageFile: f }));
                  }}
                />
                {editImageUrl ? (
                  <div className={styles.imagePreviewWrap}>
                    <img className={styles.imagePreview} src={editImageUrl} alt="" />
                  </div>
                ) : (
                  <label className={styles.dropzone} htmlFor={updateFileInputId}>
                    <span className={styles.dropIcon} aria-hidden="true">
                      <IconPhoto />
                    </span>
                    <span className={styles.dropText}>
                      Drop your files here or <span className={styles.dropLink}>Click to upload</span>
                    </span>
                    <span className={styles.dropHint}>JPG, PNG. Max size: 2MB</span>
                  </label>
                )}

                <div className={styles.noteRow}>
                  <span className={styles.noteIcon} aria-hidden="true">
                    i
                  </span>
                  <span>Your gym members will see this image on their end.</span>
                </div>

                <div className={styles.fieldLabel}>EQUIPMENT NAME</div>
                <input
                  className={styles.input}
                  placeholder="Enter equipment name"
                  value={editDraft.name}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setEditDraft((d) => ({ ...d, name: next }));
                  }}
                />

                <div style={{ height: 14 }} />

                <div className={styles.fieldLabel}>SERIAL NUMBER</div>
                <input
                  className={styles.input}
                  placeholder="Enter serial number"
                  value={editDraft.serialNumber}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setEditDraft((d) => ({ ...d, serialNumber: next }));
                  }}
                />

                <div style={{ height: 14 }} />

                <div className={styles.fieldLabel}>CATEGORY</div>
                <select
                  className={styles.select}
                  value={editDraft.category}
                  onChange={(e) => {
                    const next = e.currentTarget.value;
                    setEditDraft((d) => ({ ...d, category: next }));
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={editDraft.notifyMember}
                    onChange={(e) => {
                      const next = e.currentTarget.checked;
                      setEditDraft((d) => ({ ...d, notifyMember: next }));
                    }}
                  />
                  Notify member about this update
                </label>
              </>
            </Modal>

            <SuccessModal
              open={addSuccessModalOpen}
              onClose={() => setAddSuccessModalOpen(false)}
              titleId="equipment-added-success"
              line1="Equipment added"
              line2="successfully"
              primaryLabel="ADD EQUIPMENT UNIT"
              onPrimary={() => setAddSuccessModalOpen(false)}
              secondaryLabel="DISMISS"
              onSecondary={() => setAddSuccessModalOpen(false)}
              primaryLayout="narrow"
            />

            <SuccessModal
              open={updateSuccessModalOpen}
              onClose={() => setUpdateSuccessModalOpen(false)}
              titleId="equipment-updated-success"
              line1="Equipment updated"
              line2="successfully"
              primaryLabel="DISMISS"
              onPrimary={() => setUpdateSuccessModalOpen(false)}
              primaryLayout="full"
            />

            <Modal
              open={removeTarget !== null}
              onClose={() => setRemoveTarget(null)}
              title="Remove equipment?"
              titleId="remove-equipment-title"
              titleClassName={styles.removeModalTitle}
              size="sm"
              footerAlign="end"
              footer={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    pill
                    size="md"
                    className={styles.removeModalCancelBtn}
                    onClick={() => setRemoveTarget(null)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    pill
                    size="md"
                    className={styles.removeModalConfirmBtn}
                    onClick={async () => {
                      if (!removeTarget) return;
                      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
                      try {
                        await api.delete(`/api/equipment/${encodeURIComponent(removeTarget.id)}`, {
                          headers: {
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                          },
                        });
                        setItems((prev) => prev.filter((x) => x.id !== removeTarget.id));
                        setChecked((prev) => {
                          const next = { ...prev };
                          delete next[removeTarget.id];
                          return next;
                        });
                        setRemoveTarget(null);
                        setRemoveSuccessModalOpen(true);
                      } catch (error) {
                        console.error("Failed to delete equipment:", error);
                      }
                    }}
                  >
                    YES, REMOVE
                  </Button>
                </>
              }
            >
              {removeTarget ? (
                <p className={styles.removeModalBody}>
                  Are you sure you want to remove <strong>{removeTarget.name}</strong> from your inventory?
                  Removing it will stop it from appearing in member workout recommendations for all your branches.
                </p>
              ) : null}
            </Modal>

            <SuccessModal
              open={removeSuccessModalOpen}
              onClose={() => setRemoveSuccessModalOpen(false)}
              titleId="equipment-removed-success"
              line1="Equipment removed"
              line2="successfully"
              primaryLabel="DISMISS"
              onPrimary={() => setRemoveSuccessModalOpen(false)}
              primaryLayout="full"
            />

            <section className={styles.stats} aria-label="Equipment overview">
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Equipment</div>
                <div className={styles.statValue}>{total}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Available</div>
                <div className={styles.statValue}>{availableCount}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Unavailable</div>
                <div className={styles.statValue}>{unavailableCount}</div>
              </div>
            </section>

            <div className={styles.sectionRow}>
              <div className={styles.sectionTitle}>All Equipment</div>
              <button type="button" className={styles.exportBtn} onClick={exportRows}>
                <IconExport /> EXPORT
              </button>
            </div>

            <section className={styles.tableCard} aria-label="Equipment table">
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <IconSearch className={styles.searchIcon} />
                  <input
                    className={styles.searchInput}
                    value={query}
                    placeholder="Search"
                    onChange={(e) => {
                      const next = e.currentTarget.value;
                      setQuery(next);
                      setPage(1);
                    }}
                    aria-label="Search equipment"
                  />
                </div>

                <div className={styles.filters}>
                  <select
                    className={styles.filterSelect}
                    value={status}
                    onChange={(e) => {
                      const next = e.currentTarget.value as any;
                      setStatus(next);
                      setPage(1);
                    }}
                    aria-label="Filter by status"
                  >
                    <option value="All">All statuses</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={category}
                    onChange={(e) => {
                      const next = e.currentTarget.value;
                      setCategory(next);
                      setPage(1);
                    }}
                    aria-label="Filter by category"
                  >
                    <option value="All">Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkCell}>
                      <input
                        type="checkbox"
                        aria-label="Select all rows on page"
                        checked={pageRows.length > 0 && pageRows.every((r) => checked[r.id])}
                        onChange={(e) => toggleAll(e.currentTarget.checked)}
                      />
                    </th>
                    <th>EQUIPMENT</th>
                    <th>ADDED ON</th>
                    <th>CATEGORY</th>
                    <th>STATUS</th>
                    <th className={styles.rightAlign}>TOTAL UNITS</th>
                    <th className={styles.rightAlign}>FREQUENCY</th>
                    <th className={styles.rightAlign} aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td className={styles.checkCell}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${r.name}`}
                          checked={Boolean(checked[r.id])}
                          onChange={(e) => {
                            const isChecked = e.currentTarget.checked;
                            setChecked((prev) => ({ ...prev, [r.id]: isChecked }));
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.equipmentNameBtn}
                          onClick={() => setEquipmentDetailId(r.id)}
                        >
                          {r.name}
                        </button>
                      </td>
                      <td>{formatAddedOn(r.addedOn)}</td>
                      <td>{r.category}</td>
                      <td>
                        <span
                          className={[
                            styles.statusPill,
                            r.status === "Available" ? styles.statusAvailable : styles.statusUnavailable,
                          ].join(" ")}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className={styles.rightAlign}>{r.totalUnits}</td>
                      <td className={styles.rightAlign}>{r.frequency}</td>
                      <td className={styles.rightAlign}>
                        <span className={styles.actions}>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            aria-label={`Edit ${r.name}`}
                            onClick={() => {
                              setEditingId(r.id);
                              setEditDraft({
                                imageFile: null,
                                name: r.name,
                                serialNumber: r.serialNumber ?? "",
                                category: r.category,
                                notifyMember: false,
                              });
                              setUpdateModalOpen(true);
                            }}
                          >
                            <IconEdit />
                          </button>
                          <button
                            type="button"
                            className={[styles.iconBtn, styles.iconBtnDanger].join(" ")}
                            aria-label={`Delete ${r.name}`}
                            onClick={() => setRemoveTarget({ id: r.id, name: r.name })}
                          >
                            <IconTrash />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 16, color: "rgba(31,39,50,0.55)" }}>
                        No equipment matches your filters.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <div className={styles.pagination} aria-label="Pagination">
                <div>
                  <select
                    className={styles.rowsSelect}
                    value={rowsPerPage}
                    onChange={(e) => {
                      const next = Number(e.currentTarget.value);
                      setRowsPerPage(next);
                      setPage(1);
                    }}
                    aria-label="Rows per page"
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>{" "}
                  <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.5rem" }}>
                    Rows per page
                  </span>
                </div>

                <div className={styles.pager}>
                  {Array.from({ length: pageCount }).slice(0, 5).map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={p === safePage ? styles.pageBtnActive : styles.pageBtn}
                        onClick={() => setPage(p)}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <div>
                  {filtered.length === 0 ? "0" : `${startIdx + 1} - ${endIdx}`} of {filtered.length}
                </div>
              </div>
            </section>
          </section>
        </main>
      </DashboardShell>

      {equipmentDetailItem ? (
        <EquipmentDetailPanel
          item={equipmentDetailItem}
          open={equipmentDetailOpen}
          onBack={() => setEquipmentDetailOpen(false)}
          onExitAnimationEnd={() => setEquipmentDetailId(null)}
        />
      ) : null}
    </div>
  );
}