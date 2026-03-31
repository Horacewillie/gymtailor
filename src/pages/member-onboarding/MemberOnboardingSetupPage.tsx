import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MemberOnboardingSetupLayout,
  MemberSetupCheckboxCard,
  MemberSetupCheckboxStack,
  MemberSetupChip,
  MemberSetupChipRow,
  MemberSetupRadioCard,
  MemberSetupRadioStack,
} from "../../components/member-mobile";
import {
  MEMBER_SETUP_TOTAL_STEPS,
  SETUP_EXPERIENCE,
  SETUP_FREQUENCY,
  SETUP_GOALS,
  SETUP_SEX,
  SETUP_TRAIN_STYLES,
  SETUP_WORK_AROUND,
  type WeightUnit,
} from "./memberOnboardingSetupData";
import styles from "./MemberOnboardingSetupPage.module.css";

type SetupLocationState = { email?: string; gymName?: string };

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

const NOTE_MAX = 200;

export function MemberOnboardingSetupPage() {
  const navigate = useNavigate();
  const { step } = useParams();
  const { state } = useLocation();
  const email = (state as SetupLocationState | null)?.email ?? "";
  const gymName = (state as SetupLocationState | null)?.gymName ?? "";

  const stepNum = Number(step);
  const stepValid =
    Number.isInteger(stepNum) && stepNum >= 1 && stepNum <= MEMBER_SETUP_TOTAL_STEPS;

  const [goals, setGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState<string | null>(null);
  const [trainStyles, setTrainStyles] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");
  const [workAround, setWorkAround] = useState<string[]>([]);
  const [workAroundNote, setWorkAroundNote] = useState("");

  const passState = useMemo(() => ({ email, gymName }), [email, gymName]);

  const goBack = useCallback(() => {
    if (stepNum <= 1) {
      navigate("/member/onboarding/training-intro", { state: passState });
      return;
    }
    navigate(`/member/onboarding/setup/${stepNum - 1}`, { state: passState });
  }, [navigate, passState, stepNum]);

  const goNext = useCallback(() => {
    if (stepNum >= MEMBER_SETUP_TOTAL_STEPS) {
      navigate("/member/onboarding/plan-loading", { state: passState });
      return;
    }
    navigate(`/member/onboarding/setup/${stepNum + 1}`, { state: passState });
  }, [navigate, passState, stepNum]);

  const toggleMulti = useCallback(
    (id: string, setList: Dispatch<SetStateAction<string[]>>) => {
      setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [],
  );

  const weightOk = useMemo(() => {
    const raw = weight.trim().replace(/,/g, ".");
    if (!raw) return false;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0;
  }, [weight]);

  const primaryDisabled = useMemo(() => {
    if (!stepValid) return true;
    switch (stepNum) {
      case 1:
        return goals.length === 0;
      case 2:
        return experience == null;
      case 3:
        return trainStyles.length === 0;
      case 4:
        return frequency == null;
      case 5:
        return sex == null;
      case 6:
        return !weightOk;
      default:
        return false;
    }
  }, [
    stepValid,
    stepNum,
    goals.length,
    experience,
    trainStyles.length,
    frequency,
    sex,
    weightOk,
  ]);

  const title = useMemo(() => {
    switch (stepNum) {
      case 1:
        return "What are you training for right now?";
      case 2:
        return "How would you rate your gym experience?";
      case 3:
        return "How do you like to train?";
      case 4:
        return "How often do you workout?";
      case 5:
        return "What is your sex?";
      case 6:
        return "How much do you currently weigh?";
      case 7:
        return "Anything we should work around?";
      default:
        return "";
    }
  }, [stepNum]);

  const primaryLabel = stepNum === MEMBER_SETUP_TOTAL_STEPS ? "SUBMIT" : "NEXT";
  const circleLabel =
    stepNum === MEMBER_SETUP_TOTAL_STEPS ? "Submit answers" : "Next step";

  const onWhySex = useCallback(() => {
    window.alert(
      "We use this to personalize training recommendations and recovery guidance. You can update it anytime.",
    );
  }, []);

  if (!stepValid) {
    return <Navigate to="/member/onboarding/setup/1" replace state={passState} />;
  }

  return (
    <MemberOnboardingSetupLayout
      currentStep={stepNum}
      totalSteps={MEMBER_SETUP_TOTAL_STEPS}
      showBack={stepNum > 1}
      onBack={goBack}
      title={title}
      titleAlign={stepNum === 5 || stepNum === 6 ? "left" : "center"}
      primaryLabel={primaryLabel}
      primaryDisabled={primaryDisabled}
      onPrimary={goNext}
      circleLabel={circleLabel}
    >
      {stepNum === 1 ? (
        <MemberSetupChipRow>
          {SETUP_GOALS.map((g) => (
            <MemberSetupChip
              key={g.id}
              label={g.label}
              selected={goals.includes(g.id)}
              onClick={() => toggleMulti(g.id, setGoals)}
            />
          ))}
        </MemberSetupChipRow>
      ) : null}

      {stepNum === 2 ? (
        <MemberSetupRadioStack>
          {SETUP_EXPERIENCE.map((e) => (
            <MemberSetupRadioCard
              key={e.id}
              value={e.id}
              title={e.title}
              subtitle={e.subtitle}
              selected={experience === e.id}
              onClick={() => setExperience(e.id)}
            />
          ))}
        </MemberSetupRadioStack>
      ) : null}

      {stepNum === 3 ? (
        <MemberSetupCheckboxStack>
          {SETUP_TRAIN_STYLES.map((t) => (
            <MemberSetupCheckboxCard
              key={t.id}
              label={t.label}
              selected={trainStyles.includes(t.id)}
              onClick={() => toggleMulti(t.id, setTrainStyles)}
            />
          ))}
        </MemberSetupCheckboxStack>
      ) : null}

      {stepNum === 4 ? (
        <MemberSetupRadioStack>
          {SETUP_FREQUENCY.map((f) => (
            <MemberSetupRadioCard
              key={f.id}
              value={f.id}
              title={f.label}
              selected={frequency === f.id}
              onClick={() => setFrequency(f.id)}
            />
          ))}
        </MemberSetupRadioStack>
      ) : null}

      {stepNum === 5 ? (
        <div className={styles.stackGap}>
          <MemberSetupRadioStack>
            {SETUP_SEX.map((s) => (
              <MemberSetupRadioCard
                key={s.id}
                value={s.id}
                title={s.label}
                selected={sex === s.id}
                onClick={() => setSex(s.id)}
              />
            ))}
          </MemberSetupRadioStack>
          <button type="button" className={styles.whyRow} onClick={onWhySex}>
            <InfoIcon className={styles.whyIcon} />
            Why do we need this?
          </button>
        </div>
      ) : null}

      {stepNum === 6 ? (
        <div className={styles.weightRow}>
          <input
            className={styles.weightInput}
            inputMode="decimal"
            autoComplete="off"
            placeholder="175"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            aria-label="Current weight"
          />
          <select
            className={styles.unitSelect}
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
            aria-label="Weight unit"
          >
            <option value="lbs">Lbs</option>
            <option value="kg">Kg</option>
          </select>
        </div>
      ) : null}

      {stepNum === 7 ? (
        <div className={styles.stackGap}>
          <MemberSetupCheckboxStack>
            {SETUP_WORK_AROUND.map((w) => (
              <MemberSetupCheckboxCard
                key={w.id}
                label={w.label}
                selected={workAround.includes(w.id)}
                onClick={() => toggleMulti(w.id, setWorkAround)}
              />
            ))}
          </MemberSetupCheckboxStack>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              placeholder="Tell us more"
              maxLength={NOTE_MAX}
              value={workAroundNote}
              onChange={(e) => setWorkAroundNote(e.target.value.slice(0, NOTE_MAX))}
              aria-label="Additional notes"
            />
            <span className={styles.charCount}>
              {workAroundNote.length}/{NOTE_MAX}
            </span>
          </div>
          <div className={styles.hintRow}>
            <LightbulbIcon className={styles.hintIcon} />
            <p className={styles.hintText}>
              Your trainer will adjust, not push through pain.
            </p>
          </div>
        </div>
      ) : null}
    </MemberOnboardingSetupLayout>
  );
}
