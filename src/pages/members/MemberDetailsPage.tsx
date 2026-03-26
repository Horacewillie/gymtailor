import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DashboardShell } from "../../components/dashboard-shell/DashboardShell";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { SuccessModal } from "../../components/success-modal/SuccessModal";
import {
  PeakHoursChart,
  ProductivityTrendChart,
  SessionsOverTimeChart,
  WeightRecordChart,
} from "../../components/member-performance-charts/MemberPerformanceCharts";
import { MOCK_MEMBERS } from "./MembersPage";
import imgBarbellBenchPress from "../../assets/BarbellBenchPress.png";
import imgDeadlift from "../../assets/Deadlift.png";
import imgBicepCurl from "../../assets/BicepCurl.png";
import imgDumbbellFlyess from "../../assets/DumbbellFlyess.png";
import imgDumbellShoulderPress from "../../assets/DumbellShoulderPress.png";
import styles from "./MemberDetailsPage.module.css";

function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.5 25C29.5 25.3978 29.342 25.7794 29.0607 26.0607C28.7794 26.342 28.3978 26.5 28 26.5C27.6022 26.5 27.2207 26.342 26.9394 26.0607C26.6581 25.7794 26.5 25.3978 26.5 25C26.497 22.2162 25.3898 19.5472 23.4214 17.5787C21.4529 15.6102 18.7839 14.503 16 14.5H7.62502L11.065 17.9388C11.3468 18.2206 11.5051 18.6027 11.5051 19.0013C11.5051 19.3998 11.3468 19.782 11.065 20.0638C10.7832 20.3456 10.401 20.5039 10.0025 20.5039C9.60401 20.5039 9.22182 20.3456 8.94002 20.0638L2.94002 14.0638C2.80018 13.9244 2.68923 13.7588 2.61352 13.5765C2.53781 13.3942 2.49884 13.1987 2.49884 13.0013C2.49884 12.8038 2.53781 12.6084 2.61352 12.426C2.68923 12.2437 2.80018 12.0781 2.94002 11.9388L8.94002 5.93876C9.07955 5.79923 9.2452 5.68855 9.4275 5.61304C9.60981 5.53752 9.8052 5.49866 10.0025 5.49866C10.1998 5.49866 10.3952 5.53752 10.5775 5.61304C10.7598 5.68855 10.9255 5.79923 11.065 5.93876C11.2046 6.07829 11.3152 6.24393 11.3907 6.42624C11.4663 6.60854 11.5051 6.80393 11.5051 7.00126C11.5051 7.19858 11.4663 7.39398 11.3907 7.57628C11.3152 7.75858 11.2046 7.92423 11.065 8.06376L7.62502 11.5H16C19.5792 11.504 23.0107 12.9276 25.5416 15.4585C28.0725 17.9893 29.4961 21.4208 29.5 25Z" fill="currentColor"/>
    </svg>
  );
}

function IconChevronDown({ className, isOpen }: { className?: string; isOpen?: boolean }) {
  return (
    <svg 
      className={className} 
      style={{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', width: 14, height: 14 }} 
      viewBox="0 0 24 24" 
      fill="none"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PERF_TIME_KEYS = ["7D", "1M", "3M", "6M", "1Y", "YTD"] as const;
type PerfTimeKey = (typeof PERF_TIME_KEYS)[number];

function IconInfoCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 16.5v-6M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const TOP_EXERCISES = [
  { name: "Barbell Bench Press", detail: "50 kg in 4 sets", image: imgBarbellBenchPress },
  { name: "Back Squat", detail: "80 kg in 5 sets", image: imgDumbellShoulderPress },
  { name: "Romanian Deadlift", detail: "60 kg in 4 sets", image: imgDeadlift },
  { name: "Lat Pulldown", detail: "45 kg in 4 sets", image: imgDumbbellFlyess },
  { name: "Cable Row", detail: "40 kg in 4 sets", image: imgBicepCurl },
] as const;

const TOP_EQUIPMENT = [
  { name: "Adjustable Dumbbells", detail: "Used in 18 sessions" },
  { name: "Battle Ropes", detail: "Used in 14 sessions" },
  { name: "Smith Machine", detail: "Used in 12 sessions" },
  { name: "Leg Press", detail: "Used in 10 sessions" },
] as const;

const SESSION_MONTH_OPTIONS = [
  { value: "2026-12", label: "December 2026" },
  { value: "2026-11", label: "November 2026" },
  { value: "2026-10", label: "October 2026" },
] as const;

type SessionExercise = {
  workout: string;
  set: string;
  rep: string;
  kg: string;
};

type WorkoutSession = {
  id: string;
  title: string;
  when: string;
  exercises?: readonly SessionExercise[];
};

const SESSION_WORKOUTS: readonly WorkoutSession[] = [
  {
    id: "s1",
    title: "Chest & Biceps",
    when: "Mon, Dec 1 • 8:20 AM",
    exercises: [
      { workout: "Barbell Bench Press", set: "13", rep: "x12", kg: "10" },
      { workout: "Dumbbell Bench Press", set: "10", rep: "x12", kg: "10" },
      { workout: "Incline Dumbbell Press", set: "8", rep: "x10", kg: "10" },
      { workout: "Chest Fly", set: "12", rep: "x12", kg: "8" },
      { workout: "Cable Chest Fly", set: "9", rep: "x10", kg: "5" },
    ],
  },
  { id: "s2", title: "Back & Shoulders", when: "Tue, Dec 2 • 7:15 AM" },
  { id: "s3", title: "Leg Day", when: "Wed, Dec 3 • 6:45 AM" },
  { id: "s4", title: "Cardio & Abs", when: "Thu, Dec 4 • 5:30 PM" },
  { id: "s5", title: "Full Body Workout", when: "Fri, Dec 5 • 8:00 AM" },
  { id: "s6", title: "Yoga & Flexibility", when: "Sat, Dec 6 • 10:00 AM" },
  { id: "s7", title: "Rest Day", when: "Sun, Dec 7 • —" },
  { id: "s8", title: "Chest & Triceps", when: "Mon, Dec 8 • 8:20 AM" },
  { id: "s9", title: "Legs & Core", when: "Tue, Dec 9 • 7:00 AM" },
  { id: "s10", title: "Cardio Intervals", when: "Wed, Dec 10 • 6:30 PM" },
  { id: "s11", title: "Body Pump", when: "Thu, Dec 11 • 6:00 PM" },
];

export function MemberDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<"PROFILE" | "PERFORMANCE" | "SESSION">("PROFILE");
  
  // Accordion state
  const [userDetailsOpen, setUserDetailsOpen] = useState(true);
  const [trainingProfileOpen, setTrainingProfileOpen] = useState(true);

  const [editingDetails, setEditingDetails] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRemoveSuccessOpen, setIsRemoveSuccessOpen] = useState(false);
  const [perfTime, setPerfTime] = useState<PerfTimeKey>("7D");
  const [sessionMonth, setSessionMonth] = useState<string>(SESSION_MONTH_OPTIONS[0]!.value);
  const [openSessionId, setOpenSessionId] = useState<string>("s1");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    dob: ""
  });

  const rawMember = MOCK_MEMBERS.find((m) => m.id === id);

  if (!rawMember) {
    return (
      <div className={styles.page}>
        <DashboardShell>
          <div style={{ padding: 40, textAlign: "center" }}>Member not found.</div>
        </DashboardShell>
      </div>
    );
  }

  // Combine dynamic base data with mock extended details
  const member = {
    name: rawMember.name,
    email: rawMember.email,
    initials: rawMember.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2),
    status: rawMember.status,
    dateAdded: rawMember.addOn + " • 11:23 PM", // keeping time mocked for design
    lastActive: rawMember.lastActive,
    branch: "High Street, Slough",
    phone: rawMember.phone,
    gender: "Male",
    address: "14 Willowbrook Close, Headingley, Leeds LS6 3QH",
    dob: "24 July 1989",
    training: {
      goal: "Improve endurance",
      experience: "Intermediate",
      frequency: "4-5 days a week",
      style: "Longer structured workouts, Minimal cardio",
      limitations: "Joint discomfort, Specific movements to avoid"
    }
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone.replace("+44", "").replace("+1", "").replace(/\s/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/-/g, "").trim(),
      gender: member.gender,
      address: member.address,
      dob: member.dob
    });
    setEditingDetails(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // typically save to API here
    setEditingDetails(false);
  };

  return (
    <div className={styles.page}>
      <DashboardShell>
        <main className={styles.main}>
          <div className={styles.container}>
            
            {/* Header Area */}
            <div className={styles.headerArea}>
              <div className={styles.headerTop}>
                <div className={styles.profileIdentify}>
                   <div className={styles.avatar}>{member.initials}</div>
                   <div>
                     <h1 className={styles.name}>{member.name}</h1>
                     <div className={styles.statusPill}>
                       <span className={styles.statusDot}></span> {member.status}
                     </div>
                   </div>
                </div>
                <Link to="/dashboard/members" className={styles.returnBtn}>
                  <IconChevronLeft /> RETURN TO MEMBERS
                </Link>
              </div>

              {/* Summary Columns */}
              <div className={styles.summaryGrid}>
                 <div className={styles.summaryCol}>
                   <div className={styles.summaryLabel}>Member email</div>
                   <div className={styles.summaryValue}>{member.email}</div>
                 </div>
                 <div className={styles.summaryCol}>
                   <div className={styles.summaryLabel}>Dated Added</div>
                   <div className={styles.summaryValue}>{member.dateAdded}</div>
                 </div>
                 <div className={styles.summaryCol}>
                   <div className={styles.summaryLabel}>Last Active</div>
                   <div className={styles.summaryValue}>{member.lastActive}</div>
                 </div>
                 <div className={styles.summaryCol}>
                   <div className={styles.summaryLabel}>Branch</div>
                   <div className={styles.summaryValue}>{member.branch}</div>
                 </div>
              </div>
            </div>

            {/* Navigation Row */}
            <div className={styles.navRow}>
              <div className={styles.tabsWrapper}>
                {(["PROFILE", "PERFORMANCE", "SESSION"] as const).map(tab => (
                  <button 
                    key={tab} 
                    className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <Button type="button" className={styles.deactivateBtn}>
                DEACTIVATE
              </Button>
            </div>

            {/* Content Cards */}
            {activeTab === "PROFILE" && (
              <div className={styles.contentSections}>
                
                {/* User Details */}
                <section className={styles.card}>
                  <div 
                    className={styles.cardHeader} 
                    onClick={() => setUserDetailsOpen(!userDetailsOpen)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.cardTitleWrap}>
                      <IconChevronDown isOpen={userDetailsOpen} className={styles.cardChevron} />
                      <h2 className={styles.cardTitle}>User Details</h2>
                    </div>
                    {editingDetails ? (
                      <button className={styles.saveBtn} onClick={handleSave}>
                        <IconCheck /> SAVE CHANGES
                      </button>
                    ) : (
                      <button className={styles.editBtn} onClick={handleEditStart}>
                        <IconPencil /> EDIT DETAILS
                      </button>
                    )}
                  </div>
                  {userDetailsOpen && (
                    <div className={styles.cardBody}>
                      <div className={styles.grid2Col}>
                        {editingDetails ? (
                          <>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>FULL NAME</div>
                              <input className={styles.editInput} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>EMAIL ADDRESS</div>
                              <input className={styles.editInput} value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>PHONE NUMBER</div>
                              <div className={styles.phoneGroup}>
                                <div className={styles.phonePrefixWrap}>🇬🇧 +44</div>
                                <input className={styles.phoneInputRaw} value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                              </div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>GENDER</div>
                              <select className={`${styles.editInput} ${styles.editSelect}`} value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>ADDRESS</div>
                              <input className={styles.editInput} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabelUppercase}>DATE OF BIRTH</div>
                              <div className={styles.dateWrap}>
                                <div className={styles.dateIcon}><IconCalendar /></div>
                                <input className={`${styles.editInput} ${styles.dateInputRaw}`} value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Full Name:</div>
                              <div className={styles.dataValue}>{member.name}</div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Email Address:</div>
                              <div className={styles.dataValue}>{member.email}</div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Phone Number:</div>
                              <div className={styles.dataValue}>{member.phone}</div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Gender:</div>
                              <div className={styles.dataValue}>{member.gender}</div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Address:</div>
                              <div className={styles.dataValue}>{member.address}</div>
                            </div>
                            <div className={styles.dataField}>
                              <div className={styles.dataLabel}>Date of Birth</div>
                              <div className={styles.dataValue}>{member.dob}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                {/* Training Profile */}
                <section className={styles.card}>
                  <div 
                    className={styles.cardHeader} 
                    onClick={() => setTrainingProfileOpen(!trainingProfileOpen)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.cardTitleWrap}>
                      <IconChevronDown isOpen={trainingProfileOpen} className={styles.cardChevron} />
                      <h2 className={styles.cardTitle}>Training Profile</h2>
                    </div>
                  </div>
                  {trainingProfileOpen && (
                    <div className={styles.cardBody}>
                      <div className={styles.grid2Col}>
                        <div className={styles.dataField}>
                           <div className={styles.dataLabel}>Goal:</div>
                           <div className={styles.dataValue}>{member.training.goal}</div>
                        </div>
                        <div className={styles.dataField}>
                           <div className={styles.dataLabel}>Experience Level:</div>
                           <div className={styles.dataValue}>{member.training.experience}</div>
                        </div>
                        <div className={styles.dataField}>
                           <div className={styles.dataLabel}>Training Frequency:</div>
                           <div className={styles.dataValue}>{member.training.frequency}</div>
                        </div>
                        <div className={styles.dataField}>
                           <div className={styles.dataLabel}>Training Style:</div>
                           <div className={styles.dataValue}>{member.training.style}</div>
                        </div>
                        <div className={styles.dataField} style={{ gridColumn: '1 / -1' }}>
                           <div className={styles.dataLabel}>Body and Limitations:</div>
                           <div className={styles.dataValue}>{member.training.limitations}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Danger Zone */}
                <div className={styles.dangerZoneWrap}>
                  <h3 className={styles.dangerTitle}>Danger Zone</h3>
                  <div className={styles.dangerCard}>
                    <div className={styles.dangerInfo}>
                      <h4 className={styles.dangerActionTitle}>Remove member account</h4>
                      <p className={styles.dangerActionDesc}>
                        Removing this member is permanent and cannot be undone.
                      </p>
                    </div>
                    <Button variant="ghost" className={styles.removeBtn} onClick={() => setIsRemoveModalOpen(true)}>
                      <IconTrash /> REMOVE MEMBER
                    </Button>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "PERFORMANCE" && (
              <div className={styles.performanceSection}>
                <div className={styles.perfTimeTabs} role="tablist" aria-label="Performance period">
                  {PERF_TIME_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={perfTime === key}
                      className={[
                        styles.perfTimeTab,
                        perfTime === key ? styles.perfTimeTabActive : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setPerfTime(key)}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className={styles.perfStatGrid} aria-label="Performance summary">
                  <div className={styles.perfStatCard}>
                    <div className={styles.perfStatLabel}>Sessions completed</div>
                    <div className={styles.perfStatValue}>12</div>
                  </div>
                  <div className={styles.perfStatCard}>
                    <div className={styles.perfStatLabel}>Consistency streak</div>
                    <div className={styles.perfStatValue}>5 days</div>
                  </div>
                  <div className={styles.perfStatCard}>
                    <div className={styles.perfStatLabel}>Workout fit score</div>
                    <div className={styles.perfStatValue}>4.3 / 5</div>
                  </div>
                </div>

                <div className={styles.perfChartsRow}>
                  <div className={styles.perfChartCard}>
                    <div className={styles.perfChartCardHead}>
                      <div className={styles.perfChartTitleRow}>
                        <h3 className={styles.perfChartTitle}>Productivity Trend</h3>
                        <button type="button" className={styles.perfChartInfoBtn} aria-label="About productivity trend">
                          <IconInfoCircle />
                        </button>
                      </div>
                      <p className={styles.perfChartSub}>Last 7 days</p>
                    </div>
                    <div className={styles.perfChartValueRow}>
                      <span className={styles.perfHeroValue}>2hr:45m:32s</span>
                    </div>
                    <p className={styles.perfMetricSubline}>
                      <span className={styles.perfMetricSublineLabel}>Workout Time: </span>
                      <span className={styles.perfDelta}>+65 mins</span>
                    </p>
                    <ProductivityTrendChart />
                  </div>
                  <div className={styles.perfChartCard}>
                    <div className={styles.perfChartCardHead}>
                      <div className={styles.perfChartTitleRow}>
                        <h3 className={styles.perfChartTitle}>Weight record</h3>
                        <button type="button" className={styles.perfChartInfoBtn} aria-label="About weight record">
                          <IconInfoCircle />
                        </button>
                      </div>
                      <p className={styles.perfChartSub}>Last 7 days</p>
                    </div>
                    <div className={styles.perfChartValueRow}>
                      <span className={styles.perfHeroValue}>76lbs</span>
                    </div>
                    <p className={styles.perfMetricSubline}>
                      <span className={styles.perfMetricSublineLabel}>Current Weight: </span>
                      <span className={styles.perfDelta}>+12lbs</span>
                    </p>
                    <WeightRecordChart />
                  </div>
                </div>

                <div className={styles.perfChartsRow}>
                  <div className={styles.perfChartCard}>
                    <div className={styles.perfChartCardHead}>
                      <div className={styles.perfChartTitleRow}>
                        <h3 className={styles.perfChartTitle}>Sessions over time</h3>
                        <button type="button" className={styles.perfChartInfoBtn} aria-label="About sessions over time">
                          <IconInfoCircle />
                        </button>
                      </div>
                      <p className={styles.perfChartSub}>Last 7 days</p>
                    </div>
                    <SessionsOverTimeChart />
                  </div>
                  <div className={styles.perfChartCard}>
                    <div className={styles.perfChartCardHead}>
                      <div className={styles.perfChartTitleRow}>
                        <h3 className={styles.perfChartTitle}>Peak hours</h3>
                        <button type="button" className={styles.perfChartInfoBtn} aria-label="About peak hours">
                          <IconInfoCircle />
                        </button>
                      </div>
                      <p className={styles.perfChartSub}>Last 7 days</p>
                    </div>
                    <PeakHoursChart />
                  </div>
                </div>

                <div className={styles.perfChartsRow}>
                  <div className={styles.perfChartCard}>
                    <h3 className={styles.perfChartTitle}>Top exercises</h3>
                    <ul className={styles.perfRankList}>
                      {TOP_EXERCISES.map((row) => (
                        <li key={row.name} className={styles.perfRankItem}>
                          <div className={styles.perfThumb}>
                            <img
                              src={row.image}
                              alt=""
                              className={styles.perfThumbImg}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div className={styles.perfRankText}>
                            <div className={styles.perfRankName}>{row.name}</div>
                            <div className={styles.perfRankDetail}>{row.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.perfChartCard}>
                    <h3 className={styles.perfChartTitle}>Top equipment</h3>
                    <ul className={styles.perfRankList}>
                      {TOP_EQUIPMENT.map((row) => (
                        <li key={row.name} className={styles.perfRankItem}>
                          <div className={styles.perfThumb} aria-hidden="true" />
                          <div className={styles.perfRankText}>
                            <div className={styles.perfRankName}>{row.name}</div>
                            <div className={styles.perfRankDetail}>{row.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "SESSION" && (
              <div className={styles.sessionSection}>
                <div className={styles.sessionMonthRow}>
                  <select
                    id="session-month-select"
                    className={styles.sessionMonthSelect}
                    value={sessionMonth}
                    onChange={(e) => setSessionMonth(e.target.value)}
                    aria-label="Session month"
                  >
                    {SESSION_MONTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.perfStatGrid} aria-label="Session summary">
                  <div className={styles.perfStatCard}>
                    <div className={styles.sessionStatHead}>
                      <span className={styles.perfStatLabel}>Total workouts</span>
                      <button
                        type="button"
                        className={styles.sessionStatInfoBtn}
                        aria-label="About total workouts"
                      >
                        <IconInfoCircle />
                      </button>
                    </div>
                    <div className={styles.perfStatValue}>8</div>
                  </div>
                  <div className={styles.perfStatCard}>
                    <div className={styles.sessionStatHead}>
                      <span className={styles.perfStatLabel}>Completion rate</span>
                      <button
                        type="button"
                        className={styles.sessionStatInfoBtn}
                        aria-label="About completion rate"
                      >
                        <IconInfoCircle />
                      </button>
                    </div>
                    <div className={styles.perfStatValue}>80%</div>
                  </div>
                  <div className={styles.perfStatCard}>
                    <div className={styles.sessionStatHead}>
                      <span className={styles.perfStatLabel}>Total session time</span>
                      <button
                        type="button"
                        className={styles.sessionStatInfoBtn}
                        aria-label="About total session time"
                      >
                        <IconInfoCircle />
                      </button>
                    </div>
                    <div className={`${styles.perfStatValue} ${styles.sessionStatValueTight}`}>
                      30 hr 16 mins
                    </div>
                  </div>
                </div>

                <div className={styles.sessionAccordion} role="list">
                  {SESSION_WORKOUTS.map((s) => {
                    const isOpen = openSessionId === s.id;
                    const hasTable = Boolean(s.exercises?.length);
                    return (
                      <div key={s.id} className={styles.sessionAccordionItem} role="listitem">
                        <button
                          type="button"
                          className={styles.sessionAccordionTrigger}
                          aria-expanded={isOpen}
                          onClick={() =>
                            setOpenSessionId((prev) => (prev === s.id ? "" : s.id))
                          }
                        >
                          <span className={styles.sessionAccordionLeft}>
                            <IconChevronDown isOpen={isOpen} className={styles.sessionAccordionChevron} />
                            <span className={styles.sessionAccordionTitle}>{s.title}</span>
                          </span>
                          <span className={styles.sessionAccordionWhen}>{s.when}</span>
                        </button>
                        {isOpen ? (
                          hasTable ? (
                            <div className={styles.sessionAccordionPanel}>
                              <table className={styles.sessionTable}>
                                <thead>
                                  <tr>
                                    <th scope="col">WORKOUT</th>
                                    <th scope="col">SET</th>
                                    <th scope="col">REP</th>
                                    <th scope="col">KG</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.exercises!.map((row) => (
                                    <tr key={row.workout}>
                                      <td>{row.workout}</td>
                                      <td>{row.set}</td>
                                      <td>{row.rep}</td>
                                      <td>{row.kg}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className={styles.sessionAccordionPanel}>
                              <p className={styles.sessionNoDetail}>
                                No exercise breakdown for this session.
                              </p>
                            </div>
                          )
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </main>
      </DashboardShell>

      <Modal
        open={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Remove member?"
        titleId="remove-member-title"
        titleClassName={styles.dangerModalTitle}
        footer={
          <div className={styles.dangerModalActions}>
            <Button variant="secondary" className={styles.dangerModalBtn} onClick={() => setIsRemoveModalOpen(false)}>
              CANCEL
            </Button>
            <Button
              className={`${styles.dangerModalBtn} ${styles.dangerModalConfirmRed}`}
              onClick={() => {
                setIsRemoveModalOpen(false);
                setIsRemoveSuccessOpen(true);
              }}
            >
              YES, REMOVE
            </Button>
          </div>
        }
      >
        <p className={styles.dangerModalBody}>
          Are you sure you want remove <strong>"{member.name}"</strong> from your member? This will remove them from i-Fitness and revoke access to Gym Tailor through your gym.
        </p>
      </Modal>

      <SuccessModal
        open={isRemoveSuccessOpen}
        onClose={() => {
          setIsRemoveSuccessOpen(false);
          navigate("/dashboard/members");
        }}
        titleId="member-removed-success"
        line1="Member successfully"
        line2="removed"
        primaryLabel="DISMISS"
        primaryLayout="full"
        onPrimary={() => {
          setIsRemoveSuccessOpen(false);
          navigate("/dashboard/members");
        }}
      />
    </div>
  );
}
