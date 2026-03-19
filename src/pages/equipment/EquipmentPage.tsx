import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "../../components/button/Button";
import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";
import styles from "./EquipmentPage.module.css";

type EquipmentStatus = "Available" | "Unavailable";

type EquipmentItem = {
  id: string;
  name: string;
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

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4l4.9-4.9-4.9-4.9a1 1 0 0 1 1.4-1.4l4.9 4.9 4.9-4.9a1 1 0 0 1 1.4 0Z"
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
  category: string;
  notifyMember: boolean;
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

const SEED_ITEMS: EquipmentItem[] = [
  {
    id: "treadmill",
    name: "Treadmill",
    addedOn: new Date("2026-12-25T11:15:00"),
    category: "Cardio",
    status: "Available",
    totalUnits: 74,
    frequency: 612,
  },
  {
    id: "dumbbells",
    name: "Dumbbells",
    addedOn: new Date("2026-12-25T11:00:00"),
    category: "Free weights",
    status: "Available",
    totalUnits: 64,
    frequency: 548,
  },
  {
    id: "barbell",
    name: "Barbell",
    addedOn: new Date("2026-12-23T10:45:00"),
    category: "Free weights",
    status: "Available",
    totalUnits: 59,
    frequency: 472,
  },
  {
    id: "rowing",
    name: "Rowing Machine",
    addedOn: new Date("2026-12-23T10:30:00"),
    category: "Cardio",
    status: "Unavailable",
    totalUnits: 67,
    frequency: 451,
  },
  {
    id: "stair",
    name: "Stair Climber",
    addedOn: new Date("2026-12-23T10:15:00"),
    category: "Cardio",
    status: "Available",
    totalUnits: 55,
    frequency: 404,
  },
  {
    id: "cable",
    name: "Cable Machine",
    addedOn: new Date("2026-12-23T10:00:00"),
    category: "Machine",
    status: "Unavailable",
    totalUnits: 50,
    frequency: 403,
  },
  {
    id: "bench",
    name: "Adjustable Bench",
    addedOn: new Date("2026-12-19T09:45:00"),
    category: "Free weights",
    status: "Available",
    totalUnits: 47,
    frequency: 301,
  },
  {
    id: "assisted-pullup",
    name: "Assisted Pull-Up",
    addedOn: new Date("2026-12-18T09:30:00"),
    category: "Machine",
    status: "Unavailable",
    totalUnits: 41,
    frequency: 200,
  },
  {
    id: "smith",
    name: "Smith Machine",
    addedOn: new Date("2026-12-17T09:15:00"),
    category: "Machine",
    status: "Available",
    totalUnits: 39,
    frequency: 189,
  },
  {
    id: "kettlebell",
    name: "Kettlebell",
    addedOn: new Date("2026-12-16T09:00:00"),
    category: "Free weights",
    status: "Available",
    totalUnits: 12,
    frequency: 130,
  },
];

/**
 * Equipment dashboard route (`/dashboard/equipment`).
 *
 * Key goals:
 * - Keep UI dynamic (search/filter/pagination) so it can be wired to live data later.
 * - Keep the header/nav reusable via `DashboardShell`.
 * - Match the screenshot layout while avoiding hard-coded “only works for this data” behavior.
 */
export function EquipmentPage() {
  const [items, setItems] = useState<EquipmentItem[]>(SEED_ITEMS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | EquipmentStatus>("All");
  const [category, setCategory] = useState<"All" | string>("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuWrapRef = useRef<HTMLDivElement | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const addFileInputId = useId();
  const [draft, setDraft] = useState<AddEquipmentDraft>({
    imageFile: null,
    name: "",
    category: "",
    notifyMember: false,
  });

  const canAdd = draft.name.trim().length > 0 && draft.category.trim().length > 0;

  const addMenuOptions = useMemo(() => {
    return [
      {
        id: "manual",
        label: "Add manually",
        onSelect: () => {
          setAddModalOpen(true);
        },
      },
      { id: "csv", label: "Upload CSV for bulk import", onSelect: () => window.alert("Upload CSV") },
    ] as const;
  }, []);

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

  useEffect(() => {
    if (!addModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [addModalOpen]);

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

            {addModalOpen ? (
              <div
                className={styles.modalOverlay}
                role="dialog"
                aria-modal="true"
                aria-label="Add equipment"
                onMouseDown={(e) => {
                  // Close when clicking the overlay, but not when clicking inside the modal.
                  if (e.target === e.currentTarget) setAddModalOpen(false);
                }}
              >
                <div className={styles.modal}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Add equipment</h2>
                    <button
                      type="button"
                      className={styles.closeBtn}
                      aria-label="Close"
                      onClick={() => setAddModalOpen(false)}
                    >
                      <IconX />
                    </button>
                  </div>

                  <div className={styles.modalBody}>
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
                        // Capture first to avoid React event/value becoming null during scheduling.
                        const next = e.currentTarget.value;
                        setDraft((d) => ({ ...d, name: next }));
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
                  </div>

                  <div className={styles.modalFooter}>
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
                      size="lg"
                      disabled={!canAdd}
                      onClick={() => {
                        if (!canAdd) return;
                        const next: EquipmentItem = {
                          id: `${draft.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
                          name: draft.name.trim(),
                          addedOn: new Date(),
                          category: draft.category,
                          status: "Available",
                          totalUnits: 1,
                          frequency: 0,
                        };
                        setItems((prev) => [next, ...prev]);
                        setAddModalOpen(false);
                        setDraft({ imageFile: null, name: "", category: "", notifyMember: false });
                        setPage(1);
                      }}
                    >
                      ADD EQUIPMENT
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

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
                          onChange={(e) =>
                            setChecked((prev) => ({ ...prev, [r.id]: e.currentTarget.checked }))
                          }
                        />
                      </td>
                      <td>{r.name}</td>
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
                              // Placeholder: wiring a real edit flow would open a modal/drawer.
                              window.alert(`Edit: ${r.name}`);
                            }}
                          >
                            <IconEdit />
                          </button>
                          <button
                            type="button"
                            className={[styles.iconBtn, styles.iconBtnDanger].join(" ")}
                            aria-label={`Delete ${r.name}`}
                            onClick={() => setItems((prev) => prev.filter((x) => x.id !== r.id))}
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
    </div>
  );
}

