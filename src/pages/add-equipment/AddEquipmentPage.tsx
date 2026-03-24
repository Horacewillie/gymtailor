import { useEffect, useId, useMemo, useState } from "react";
import { useOnboarding } from "../../app/OnboardingContext";
import Api from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { AuthHeader } from "../../components/auth-header/AuthHeader";
import { Button } from "../../components/button/Button";
import styles from "./AddEquipmentPage.module.css";

type Mode = "manual" | "csv";

/**
 * Visual-only onboarding step indicator (kept consistent with other pages).
 * We keep it `aria-hidden` and communicate step context through headings/content.
 */
function StepDots(props: { current: number; total: number }) {
  return (
    <div className={styles.stepDots} aria-hidden="true">
      {Array.from({ length: props.total }).map((_, idx) => {
        const isActive = idx === props.current - 1;
        return <span key={idx} className={isActive ? styles.dotActive : styles.dot} />;
      })}
    </div>
  );
}

/**
 * Back icon used in the footer back button.
 * Inline SVG keeps the design pixel-consistent without an icon dependency.
 */
function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.7 5.3a1 1 0 0 1 0 1.4L10.41 11H20a1 1 0 1 1 0 2h-9.59l4.3 4.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.41 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Small image glyph used in the upload dropzone. */
function ImageGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v7.9l2.6-2.5a1.5 1.5 0 0 1 2 0l1.7 1.6 3.2-3.1a1.5 1.5 0 0 1 2 0l2.5 2.4V6.5a.5.5 0 0 0-.5-.5h-11ZM6 17.5c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-3.9l-3.2-3.1a.5.5 0 0 0-.7 0l-3.9 3.8a1.5 1.5 0 0 1-2.1 0L6 12.8v4.7Zm4-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Small CSV/document glyph used in the upload dropzone. */
function CsvGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 3h7.2c.4 0 .8.16 1.06.44l2.8 2.97c.27.28.42.65.42 1.03V20a1.8 1.8 0 0 1-1.8 1.8h-9.7A1.8 1.8 0 0 1 4.7 20V4.8A1.8 1.8 0 0 1 6.5 3Zm7.1 1.9V7a.6.6 0 0 0 .6.6h2.2L13.6 4.9ZM7.2 12.2h9.6v1.6H7.2v-1.6Zm0 3.2h6.7V17H7.2v-1.6Z"
        fill="currentColor"
      />
      <path
        d="M9.2 10.3h-.9c-.9 0-1.6-.7-1.6-1.6V8.4c0-.9.7-1.6 1.6-1.6h.9c.9 0 1.6.7 1.6 1.6v.3H9.7v-.3c0-.3-.2-.5-.5-.5h-.9c-.3 0-.5.2-.5.5v.3c0 .3.2.5.5.5h.9c.9 0 1.6.7 1.6 1.6v.3c0 .9-.7 1.6-1.6 1.6h-.9c-.9 0-1.6-.7-1.6-1.6V11h1.1v.3c0 .3.2.5.5.5h.9c.3 0 .5-.2.5-.5v-.3c0-.3-.2-.5-.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AddEquipmentPage() {
    // const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const imageInputId = useId();
  const csvInputId = useId();

  const { data, reset } = useOnboarding();
  const api = useMemo(() => new Api(), []);
  // For demo: hardcoded invitationId and signature/url, adapt as needed
  const invitationId = 20;
  const invitationUrl = "http:\/\/localhost:8080\/api\/invitation\/20\/view?expires=1774337920&signature=887954891885f299d8e44d163cadcdd16ecb68567428bdbe42afdf1c1236f7f9";
  const signature = "887954891885f299d8e44d163cadcdd16ecb68567428bdbe42afdf1c1236f7f9";

  // Two entry modes per design: manual item entry vs CSV bulk import.
  const [mode, setMode] = useState<Mode>("manual");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  useEffect(() => {
    return () => {
      // Prevent leaking object URLs when changing uploads or leaving the page.
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const [equipmentName, setEquipmentName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");

  const [csvFile, setCsvFile] = useState<File | null>(null);

  const canComplete =
    mode === "manual"
      ? equipmentName.trim() &&
        category.trim() &&
        quantity.trim() &&
        status.trim() &&
        // Keep the quantity rule strict: only positive numbers enable completion.
        Number.isFinite(Number(quantity)) &&
        Number(quantity) > 0
      : Boolean(csvFile);

  return (
    <div className={styles.page}>

      <AuthHeader variant="dashboard" userInitial="J" />

      <main className={styles.main}>
        <section className={styles.shell}>
          <div className={styles.left}>
            <StepDots current={3} total={3} />
            <h1 className={styles.title}>
              Set up your
              <br />
              gym on Gym
              <br />
              Tailor.
            </h1>
            <p className={styles.subtitle}>
              Set up your gym once, then let members
              <br />
              get workouts based on the equipment
              <br />
              you have.
            </p>
          </div>

          <div className={styles.right}>
            <section className={styles.card} aria-label="Add equipment">
              <h2 className={styles.cardTitle}>Add equipment</h2>
              <p className={styles.cardSubtitle}>
                Member workouts are built from the equipment you add.
              </p>

              <div className={styles.modeRow} role="radiogroup" aria-label="Add equipment mode">
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "manual"}
                    onChange={() => setMode("manual")}
                  />
                  <span className={styles.radioDot} aria-hidden="true" />
                  <span className={styles.radioText}>Add manually</span>
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "csv"}
                    onChange={() => setMode("csv")}
                  />
                  <span className={styles.radioDot} aria-hidden="true" />
                  <span className={styles.radioText}>Upload CSV for bulk import</span>
                </label>
              </div>

              {mode === "manual" ? (
                <>
                  <div className={styles.sectionLabel}>UPLOAD EQUIPMENT IMAGE</div>

                  <input
                    id={imageInputId}
                    className={styles.fileInput}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      // Capture immediately; don't depend on event object after state updates.
                      const input = e.currentTarget;
                      const f = input.files?.[0] ?? null;
                      setImageFile(f);
                    }}
                  />

                  {imageUrl ? (
                    <div className={styles.imagePreviewWrap}>
                      <img className={styles.imagePreview} src={imageUrl} alt="Equipment" />
                    </div>
                  ) : (
                    <label className={styles.dropzone} htmlFor={imageInputId}>
                      <span className={styles.dropIcon} aria-hidden="true">
                        <ImageGlyph />
                      </span>
                      <span className={styles.dropText}>
                        Drop your files here or <span className={styles.dropLink}>Click to upload</span>
                      </span>
                      <span className={styles.dropHint}>JPG, PNG, Max size: 2MB</span>
                    </label>
                  )}

                  <div className={styles.noteRow}>
                    <span className={styles.infoDot} aria-hidden="true">
                      i
                    </span>
                    <span className={styles.noteText}>
                      Your gym members will see this image on their end.
                    </span>
                  </div>

                  <label className={styles.label} htmlFor="equipName">
                    EQUIPMENT NAME
                  </label>
                  <input
                    id="equipName"
                    className={styles.input}
                    placeholder="Enter equipment name"
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.currentTarget.value)}
                  />

                  <label className={styles.label} htmlFor="category">
                    CATEGORY
                  </label>
                  <select
                    id="category"
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.currentTarget.value)}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Cardio">Cardio</option>
                    <option value="Free weights">Free weights</option>
                    <option value="Machines">Machines</option>
                  </select>

                  <label className={styles.label} htmlFor="qty">
                    QUANTITY
                  </label>
                  <input
                    id="qty"
                    className={styles.input}
                    inputMode="numeric"
                    placeholder="0"
                    value={quantity}
                    // Allow typing but normalize leading whitespace; numeric validation is in `canComplete`.
                    onChange={(e) => setQuantity(e.currentTarget.value.trimStart())}
                  />

                  <label className={styles.label} htmlFor="status">
                    STATUS
                  </label>
                  <select
                    id="status"
                    className={styles.select}
                    value={status}
                    onChange={(e) => setStatus(e.currentTarget.value)}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </>
              ) : (
                <>
                  <div className={styles.templateCard}>
                    <div className={styles.templateTitle}>Download the origin template</div>
                    <div className={styles.templateCopy}>
                      Download a CSV template to match the required format and fill in the data.
                      Then upload the file below to add multiple equipment.
                    </div>
                    <Button variant="secondary" pill fullWidth size="lg">
                      DOWNLOAD CSV TEMPLATE
                    </Button>
                  </div>

                  <div className={styles.csvSectionTitle}>Upload your CSV file</div>
                  <div className={styles.csvSectionCopy}>
                    Upload the CSV file with your equipment inventory below.
                  </div>

                  <input
                    id={csvInputId}
                    className={styles.fileInput}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      // Capture immediately; don't depend on event object after state updates.
                      const input = e.currentTarget;
                      const f = input.files?.[0] ?? null;
                      setCsvFile(f);
                    }}
                  />

                  <label className={styles.dropzone} htmlFor={csvInputId}>
                    <span className={styles.dropIcon} aria-hidden="true">
                      <CsvGlyph />
                    </span>
                    <span className={styles.dropText}>
                      Drop your files here or <span className={styles.dropLink}>Click to upload</span>
                    </span>
                    <span className={styles.dropHint}>Maximum size: 50MB</span>
                    {csvFile ? <span className={styles.fileName}>{csvFile.name}</span> : null}
                  </label>
                </>
              )}

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.backBtn}
                  aria-label="Back"
                  onClick={() => navigate("/onboarding/branch-setup")}
                >
                  <ArrowLeft />
                </button>

                <Button
                  type="button"
                  fullWidth
                  pill
                  size="lg"
                  onClick={async () => {
                    if (!canComplete) return;
                    const password = "@MighTy#009";
                    const payload = {
                      url: invitationUrl,
                      signature,
                      id: invitationId,
                      first_name: data.first_name || "",
                      last_name: data.last_name || "",
                      role: "admin",
                      password,
                      email: data.email,
                      password_confirmation: password,
                      tenant_name: data.tenant_name,
                      tenant_email: data.tenant_email,
                      primary_location: [
                        typeof data.primary_location === "string"
                          ? data.primary_location
                          : data.primary_location?.name || "",
                        data.primary_location?.city,
                        data.primary_location?.state,
                        data.primary_location?.country,
                        data.primary_location?.postal_code
                      ]
                        .filter(Boolean)
                        .join(", "),
                      branches: data.branches || [],
                      equipments: [
                        {
                          name: equipmentName,
                          category,
                          unit: 5,
                          status: status === "Available" ? "active" : status.toLowerCase(),
                        },
                      ],
                    };
                    try {
                      // Accept invitation (uses /api path)
                      const response: any = await api.post(`/api/invitation/${invitationId}/accept`, payload);
                      console.log(response)
                      // Store tenant_id from accept response
                      if (response && response.tenant_id) {
                        localStorage.setItem('tenantId', response.tenant_id);
                      }
                      // Login user (login is NOT under /api, so use Api class with full endpoint)
                      const loginData = await api.post<any>(
                        '/api/login',
                        {
                          email: data.email,
                          password,
                        }
                      );
                       console.log(loginData)
                      // Persist access_token as token
                      if (loginData && loginData.access_token) {
                        localStorage.setItem('token', loginData.access_token);
                      }
                      reset();
                      navigate("/onboarding/loading");
                    } catch (err) {
                      console.error("API error:", err);
                    }
                  }}
                >
                  COMPLETE SET UP
                </Button>
                {/* Optional bypass: user can proceed to the dashboard and finish setup later. */}
                <button type="button" className={styles.doLater} onClick={() => navigate("/dashboard")}> 
                  DO THIS LATER
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

