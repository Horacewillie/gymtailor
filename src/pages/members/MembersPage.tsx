import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { SuccessModal } from "../../components/success-modal/SuccessModal";
import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";
import styles from "./MembersPage.module.css";

type MemberStatus = "ACTIVE" | "NEW" | "INACTIVE";

type MemberRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: MemberStatus;
  lastActive: string;
  addOn: string;
};

type TabFilter = "ALL" | "ACTIVE" | "INACTIVE" | "NEW";

const TOTAL_MEMBERS = 124;
const STAT_TOTAL = 1834;
const STAT_ACTIVE = 1734;
const STAT_INACTIVE = 100;
const STAT_NEW = 34;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const FIRST = [
  "Jesse",
  "Morgan",
  "Alex",
  "Riley",
  "Jordan",
  "Casey",
  "Taylor",
  "Quinn",
  "Avery",
  "Skyler",
];
const LAST = [
  "Hayes",
  "Brooks",
  "Chen",
  "Patel",
  "Reed",
  "Nguyen",
  "Fox",
  "Diaz",
  "Stone",
  "Rivera",
];

function buildMockMembers(count: number): MemberRow[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    let status: MemberStatus;
    if (i % 11 === 0) status = "INACTIVE";
    else if (i % 6 === 0) status = "NEW";
    else status = "ACTIVE";
    return {
      id: `member-${n}`,
      name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
      phone: `+1 (555) ${String(200 + (i % 700)).padStart(3, "0")}-${String(3000 + i).slice(-4)}`,
      email: `${FIRST[i % FIRST.length].toLowerCase()}.${LAST[i % LAST.length].toLowerCase()}@email.com`,
      status,
      lastActive: `${15 + (i % 10)} Dec 2026`,
      addOn: `${1 + (i % 28)} Nov 2025`,
    };
  });
}

export const MOCK_MEMBERS = buildMockMembers(TOTAL_MEMBERS);

function IconPlus(props: { className?: string }) {
  return (
    <svg className={props.className} width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.5 16C28.5 16.3978 28.342 16.7794 28.0607 17.0607C27.7794 17.342 27.3978 17.5 27 17.5H17.5V27C17.5 27.3978 17.342 27.7794 17.0607 28.0607C16.7794 28.342 16.3978 28.5 16 28.5C15.6022 28.5 15.2206 28.342 14.9393 28.0607C14.658 27.7794 14.5 27.3978 14.5 27V17.5H5C4.60218 17.5 4.22064 17.342 3.93934 17.0607C3.65804 16.7794 3.5 16.3978 3.5 16C3.5 15.6022 3.65804 15.2206 3.93934 14.9393C4.22064 14.658 4.60218 14.5 5 14.5H14.5V5C14.5 4.60218 14.658 4.22064 14.9393 3.93934C15.2206 3.65804 15.6022 3.5 16 3.5C16.3978 3.5 16.7794 3.65804 17.0607 3.93934C17.342 4.22064 17.5 4.60218 17.5 5V14.5H27C27.3978 14.5 27.7794 14.658 28.0607 14.9393C28.342 15.2206 28.5 15.6022 28.5 16Z" fill="#343330"/>
    </svg>
  );
}

function IconChevronDown(props: { className?: string }) {
  return (
    <svg className={props.className} width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.0613 13.0615L17.0613 23.0615C16.9219 23.2013 16.7563 23.3123 16.574 23.388C16.3917 23.4637 16.1962 23.5027 15.9988 23.5027C15.8013 23.5027 15.6059 23.4637 15.4235 23.388C15.2412 23.3123 15.0756 23.2013 14.9363 23.0615L4.93626 13.0615C4.65446 12.7797 4.49615 12.3975 4.49615 11.999C4.49615 11.6005 4.65446 11.2183 4.93626 10.9365C5.21805 10.6547 5.60024 10.4964 5.99876 10.4964C6.39727 10.4964 6.77946 10.6547 7.06126 10.9365L16 19.8752L24.9388 10.9352C25.2205 10.6534 25.6027 10.4951 26.0013 10.4951C26.3998 10.4951 26.782 10.6534 27.0638 10.9352C27.3455 11.217 27.5039 11.5992 27.5039 11.9977C27.5039 12.3962 27.3455 12.7784 27.0638 13.0602L27.0613 13.0615Z" fill="#343330"/>
    </svg>
  );
}

function IconSearch(props: { className?: string }) {
  return (
    <svg className={props.className} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 3a7.5 7.5 0 1 0 4.7 13.4l4.1 4.1a1 1 0 0 0 1.4-1.4l-4.1-4.1A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

/** Grouped bar chart — inactive (teal) vs active (mint) by day */
function MemberActivityChart() {
  const days = ["DEC 1", "DEC 2", "DEC 3", "DEC 4", "DEC 5", "DEC 6", "DEC 7"];
  const inactiveH = [52, 48, 55, 50, 46, 44, 42];
  const activeH = [120, 128, 118, 132, 125, 130, 135];
  const max = 180;
  const barW = 14;
  const gap = 28;
  const baseY = 200;
  const originX = 40;

  return (
    <svg className={styles.chartSvg} viewBox="0 0 520 240" role="img" aria-label="Member activity trend">
      <g stroke="rgba(31,39,50,0.08)" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="36" x2="500" y1={40 + i * 40} y2={40 + i * 40} />
        ))}
      </g>
      {days.map((d, i) => {
        const x = originX + i * gap;
        const ih = (inactiveH[i]! / max) * 140;
        const ah = (activeH[i]! / max) * 140;
        return (
          <g key={d}>
            <rect
              x={x}
              y={baseY - ih}
              width={barW}
              height={ih}
              rx="4"
              fill="#115e59"
              opacity={0.92}
            />
            <rect
              x={x + barW + 4}
              y={baseY - ah}
              width={barW}
              height={ah}
              rx="4"
              fill="#38f7a1"
            />
            <text
              x={x + barW + 2}
              y={baseY + 22}
              textAnchor="middle"
              fill="rgba(31,39,50,0.45)"
              fontSize="10"
              fontFamily="Onest, Inter, system-ui, sans-serif"
            >
              {d}
            </text>
          </g>
        );
      })}
      <text x="36" y="28" fill="rgba(31,39,50,0.45)" fontSize="10" fontFamily="Onest, Inter, system-ui, sans-serif">
        Inactive
      </text>
      <rect x="78" y="18" width="10" height="10" rx="2" fill="#115e59" opacity={0.92} />
      <text x="94" y="28" fill="rgba(31,39,50,0.45)" fontSize="10" fontFamily="Onest, Inter, system-ui, sans-serif">
        Active
      </text>
      <rect x="138" y="18" width="10" height="10" rx="2" fill="#38f7a1" />
    </svg>
  );
}

/** Line chart — retention % */
function RetentionChart() {
  const pathD =
    "M40 168 L108 150 L176 142 L244 128 L312 118 L380 108 L448 98 L500 88";
  return (
    <svg className={styles.chartSvg} viewBox="0 0 520 240" role="img" aria-label="New member retention">
      <g stroke="rgba(31,39,50,0.08)" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="36" x2="500" y1={48 + i * 36} y2={48 + i * 36} />
        ))}
      </g>
      <text x="8" y="56" fill="rgba(31,39,50,0.4)" fontSize="9" fontFamily="Onest, Inter, system-ui, sans-serif">
        100%
      </text>
      <text x="14" y="200" fill="rgba(31,39,50,0.4)" fontSize="9" fontFamily="Onest, Inter, system-ui, sans-serif">
        0%
      </text>
      <path d={pathD} fill="none" stroke="#115e59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {["DEC 1", "DEC 2", "DEC 3", "DEC 4", "DEC 5", "DEC 6", "DEC 7"].map((d, i) => (
        <text
          key={d}
          x={52 + i * 72}
          y="228"
          textAnchor="middle"
          fill="rgba(31,39,50,0.45)"
          fontSize="10"
          fontFamily="Onest, Inter, system-ui, sans-serif"
        >
          {d}
        </text>
      ))}
      <text x="36" y="28" fill="rgba(31,39,50,0.5)" fontSize="10" fontFamily="Onest, Inter, system-ui, sans-serif">
        Retention trend
      </text>
    </svg>
  );
}

function statusPillClass(s: MemberStatus) {
  if (s === "ACTIVE") return styles.pillActive;
  if (s === "NEW") return styles.pillNew;
  return styles.pillInactive;
}

function statusLabel(s: MemberStatus) {
  if (s === "ACTIVE") return "ACTIVE";
  if (s === "NEW") return "NEW";
  return "INACTIVE";
}

export function MembersPage() {
  const [tab, setTab] = useState<TabFilter>("ALL");
  const [query, setQuery] = useState("");
  const [statusSelect, setStatusSelect] = useState<"all" | MemberStatus>("all");
  const [lastActiveFilter, setLastActiveFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuWrapRef = useRef<HTMLDivElement | null>(null);

  const [addManualModalOpen, setAddManualModalOpen] = useState(false);
  const [memberDraft, setMemberDraft] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
  });
  const [emailTouched, setEmailTouched] = useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(memberDraft.email);
  const showEmailError = emailTouched && memberDraft.email.length > 0 && !isEmailValid;

  const canAddMember =
    memberDraft.name.trim().length > 0 &&
    EMAIL_REGEX.test(memberDraft.email) &&
    memberDraft.phone.trim().length > 0 &&
    memberDraft.branch.length > 0;

  const addMenuOptions = useMemo(() => {
    return [
      {
        id: "manual",
        label: "Add manually",
        onSelect: () => {
          setAddManualModalOpen(true);
        },
      },
      {
        id: "csv",
        label: "Upload CSV for bulk import",
        onSelect: () => {
          // Placeholder for import csv modal
        },
      },
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

  const filtered = useMemo(() => {
    let rows = [...MOCK_MEMBERS];
    if (tab !== "ALL") {
      rows = rows.filter((r) => r.status === tab);
    }
    if (statusSelect !== "all") {
      rows = rows.filter((r) => r.status === statusSelect);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      );
    }
    if (lastActiveFilter === "week") {
      rows = rows.filter((r) => r.lastActive.includes("Dec 2026"));
    }
    return rows;
  }, [tab, query, statusSelect, lastActiveFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIdx, startIdx + rowsPerPage);
  const endIdx = Math.min(startIdx + pageRows.length, filtered.length);

  return (
    <div className={styles.page}>
      <DashboardShell>
        <main className={styles.main}>
          <div className={styles.container}>
            <header className={styles.headerRow}>
              <div>
                <h1 className={styles.h1}>Members</h1>
                <p className={styles.subtitle}>
                  Manage member access, track training activity, and spot drop-offs early.
                </p>
              </div>
              <div className={styles.addMembersWrap} ref={addMenuWrapRef}>
                <Button 
                  type="button" 
                  pill 
                  size="sm" 
                  className={styles.addMembersBtn}
                  aria-haspopup="menu"
                  aria-expanded={addMenuOpen}
                  onClick={() => setAddMenuOpen((v) => !v)}
                >
                  <IconPlus className={styles.addMembersBtnPlus} />
                  ADD MEMBERS
                  <div className={styles.addMembersDivider} />
                  <IconChevronDown className={styles.addMembersBtnIcon} />
                </Button>
                {addMenuOpen ? (
                  <div className={styles.addMenu} role="menu" aria-label="Add members options">
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
            </header>

            <Modal
              open={addManualModalOpen}
              onClose={() => setAddManualModalOpen(false)}
              title="Add new member"
              titleId="add-member-title"
              size="sm"
              titleClassName={styles.modalTitleSerif}
              footer={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    pill
                    fullWidth
                    size="lg"
                    onClick={() => setAddManualModalOpen(false)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    pill
                    fullWidth
                    size="sm"
                    disabled={!canAddMember}
                    onClick={() => {
                      if (!canAddMember) return;
                      // Form submission placeholder
                      setAddManualModalOpen(false);
                      setMemberDraft({ name: "", email: "", phone: "", branch: "" });
                      setEmailTouched(false);
                      setAddSuccessOpen(true);
                    }}
                  >
                    ADD MEMBER
                  </Button>
                </>
              }
            >
              <>
                <div className={styles.fieldLabel}>MEMBER NAME</div>
                <input
                  className={styles.input}
                  placeholder="Enter member full name"
                  value={memberDraft.name}
                  onChange={(e) => setMemberDraft({ ...memberDraft, name: e.target.value })}
                />

                <div className={styles.fieldLabel}>EMAIL</div>
                <input
                  type="email"
                  className={[styles.input, showEmailError ? styles.inputError : ""].filter(Boolean).join(" ")}
                  placeholder="Enter member email address"
                  value={memberDraft.email}
                  onChange={(e) => setMemberDraft({ ...memberDraft, email: e.target.value })}
                  onBlur={() => setEmailTouched(true)}
                />
                {showEmailError && (
                  <div className={styles.errorText}>Please enter a valid email address</div>
                )}

                <div className={styles.fieldLabel}>PHONE NUMBER</div>
                <div className={styles.phoneInputWrap}>
                  <div className={styles.phonePrefix}>
                    <span>🇬🇧</span> +44
                  </div>
                  <input
                    type="tel"
                    className={styles.phoneInputInside}
                    placeholder="000 0000 000"
                    value={memberDraft.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setMemberDraft({ ...memberDraft, phone: digits });
                    }}
                  />
                </div>

                <div className={styles.fieldLabel}>BRANCH</div>
                <select
                  className={styles.select}
                  value={memberDraft.branch}
                  onChange={(e) => setMemberDraft({ ...memberDraft, branch: e.target.value })}
                >
                  <option value="" disabled>
                    Select branch
                  </option>
                  <option value="downtown">Downtown Gym</option>
                  <option value="uptown">Uptown Fitness</option>
                </select>

                <div className={styles.infoAlert}>
                  <span className={styles.infoAlertIcon} aria-hidden="true">💡</span>
                  <span className={styles.infoAlertText}>
                    This member will be able to join your app with the email you enter here.
                  </span>
                </div>
              </>
            </Modal>

            <section className={styles.statGrid} aria-label="Member metrics">
              <div className={styles.statCard}>
                <div className={styles.statCardHead}>
                  <span className={styles.statLabel}>Total members</span>
                  <span className={styles.infoBtn} title="Info">
                    <IconInfo />
                  </span>
                </div>
                <div className={styles.statValue}>{STAT_TOTAL.toLocaleString()}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardHead}>
                  <span className={styles.statLabel}>Active members</span>
                  <span className={styles.infoBtn} title="Info">
                    <IconInfo />
                  </span>
                </div>
                <div className={styles.statValue}>{STAT_ACTIVE.toLocaleString()}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardHead}>
                  <span className={styles.statLabel}>Inactive members</span>
                  <span className={styles.infoBtn} title="Info">
                    <IconInfo />
                  </span>
                </div>
                <div className={styles.statValue}>{STAT_INACTIVE.toLocaleString()}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardHead}>
                  <span className={styles.statLabel}>New members</span>
                  <span className={styles.infoBtn} title="Info">
                    <IconInfo />
                  </span>
                </div>
                <div className={styles.statValue}>{STAT_NEW.toLocaleString()}</div>
              </div>
            </section>

            <section className={styles.chartsRow} aria-label="Charts">
              <div className={styles.chartCard}>
                <div className={styles.chartCardTop}>
                  <h2 className={styles.chartTitle}>Member activity trend</h2>
                  <select className={styles.chartSelect} aria-label="Activity period" defaultValue="week">
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
                <MemberActivityChart />
              </div>
              <div className={styles.chartCard}>
                <div className={styles.chartCardTop}>
                  <h2 className={styles.chartTitle}>New member retention</h2>
                  <select className={styles.chartSelect} aria-label="Retention period" defaultValue="week">
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
                <RetentionChart />
              </div>
            </section>

            <div className={styles.filterTabs} role="tablist" aria-label="Member segments">
              {(
                [
                  ["ALL", "ALL"],
                  ["ACTIVE", "ACTIVE"],
                  ["INACTIVE", "INACTIVE"],
                  ["NEW", "NEW"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className={[styles.filterTab, tab === key ? styles.filterTabActive : ""].filter(Boolean).join(" ")}
                  onClick={() => {
                    setTab(key);
                    setPage(1);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.sectionRow}>
              <h2 className={styles.sectionTitle}>All Members</h2>
              <button type="button" className={styles.exportBtn}>
                <IconExport /> EXPORT
              </button>
            </div>

            <section className={styles.tableCard} aria-label="Members table">
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <IconSearch className={styles.searchIcon} />
                  <input
                    className={styles.searchInput}
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Search by name or email"
                  />
                </div>
                <div className={styles.filters}>
                  <select
                    className={styles.filterSelect}
                    value={statusSelect}
                    onChange={(e) => {
                      setStatusSelect(e.target.value as typeof statusSelect);
                      setPage(1);
                    }}
                    aria-label="Filter by status"
                  >
                    <option value="all">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="NEW">New</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <select
                    className={styles.filterSelect}
                    value={lastActiveFilter}
                    onChange={(e) => {
                      setLastActiveFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Last active"
                  >
                    <option value="all">Last active</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkCell} scope="col">
                      <input type="checkbox" className={styles.tableCheckbox} aria-label="Select all" />
                    </th>
                    <th scope="col">NAME</th>
                    <th scope="col">PHONE NUMBER</th>
                    <th scope="col">EMAIL</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">LAST ACTIVE</th>
                    <th scope="col">ADD ON</th>
                    <th className={styles.actionsCol} scope="col" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td className={styles.checkCell}>
                        <input type="checkbox" className={styles.tableCheckbox} aria-label={`Select ${r.name}`} />
                      </td>
                      <td className={styles.nameCell}>
                        <Link to={`/dashboard/members/${r.id}`} className={styles.nameLink}>
                          {r.name}
                        </Link>
                      </td>
                      <td>{r.phone}</td>
                      <td>{r.email}</td>
                      <td>
                        <span className={[styles.statusPill, statusPillClass(r.status)].join(" ")}>
                          <span className={styles.statusDot} aria-hidden />
                          {statusLabel(r.status)}
                        </span>
                      </td>
                      <td>{r.lastActive}</td>
                      <td>{r.addOn}</td>
                      <td className={styles.actionsCol}>
                        <button type="button" className={styles.iconBtnDanger} aria-label={`Remove ${r.name}`}>
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <div>
                  <select
                    className={styles.rowsSelect}
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    aria-label="Rows per page"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className={styles.rowsLabel}>Rows per page</span>
                </div>
                <div className={styles.pager}>
                  <button
                    type="button"
                    className={styles.pageArrow}
                    aria-label="Previous page"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <IconChevronLeft />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={p === safePage ? styles.pageBtnActive : styles.pageBtn}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={styles.pageArrow}
                    aria-label="Next page"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <IconChevronRight />
                  </button>
                </div>
                <div className={styles.pagerMeta}>
                  {filtered.length === 0 ? "0" : `${startIdx + 1} - ${endIdx}`} OF {filtered.length}
                </div>
              </div>
            </section>
          </div>
        </main>
      </DashboardShell>

      <SuccessModal
        open={addSuccessOpen}
        onClose={() => setAddSuccessOpen(false)}
        titleId="member-success-title"
        line1="Member added"
        line2="successfully"
        primaryLabel="DISMISS"
        onPrimary={() => setAddSuccessOpen(false)}
        primaryLayout="full"
      />
    </div>
  );
}
