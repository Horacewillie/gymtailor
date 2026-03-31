/** Wizard copy + option ids for `/member/onboarding/setup/:step`. */

export const MEMBER_SETUP_TOTAL_STEPS = 7;

export const SETUP_GOALS = [
  { id: "build_strength", label: "Build strength" },
  { id: "lose_fat", label: "Lose fat" },
  { id: "improve_endurance", label: "Improve endurance" },
  { id: "gain_muscle", label: "Gain muscle" },
  { id: "stay_healthy", label: "Stay healthy" },
  { id: "sport_specific", label: "Sport-specific training" },
] as const;

export const SETUP_EXPERIENCE = [
  { id: "new", title: "New to the gym", subtitle: "Still learning the basics" },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "I know my way around most equipment",
  },
  {
    id: "advanced",
    title: "Advanced",
    subtitle: "I train consistently and know what I\u2019m doing",
  },
] as const;

export const SETUP_TRAIN_STYLES = [
  { id: "short_sessions", label: "Short, efficient sessions" },
  { id: "machines", label: "Machines over free weights" },
  { id: "balanced", label: "Balanced strength + cardio" },
  { id: "long_workouts", label: "Longer structured workouts" },
  { id: "free_weights", label: "Free weights over machines" },
  { id: "minimal_cardio", label: "Minimal cardio" },
] as const;

export const SETUP_FREQUENCY = [
  { id: "daily", label: "Every day" },
  { id: "four_five", label: "4-5 days a week" },
  { id: "weekends", label: "Only weekends" },
  { id: "whenever", label: "When I feel like it" },
] as const;

export const SETUP_SEX = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "non_binary", label: "Non-binary" },
  { id: "prefer_not", label: "Prefer not to say" },
] as const;

export const SETUP_WORK_AROUND = [
  { id: "past_injuries", label: "Past injuries" },
  { id: "joint_discomfort", label: "Joint discomfort" },
  { id: "movements_avoid", label: "Specific movements to avoid" },
] as const;

export type WeightUnit = "lbs" | "kg";
