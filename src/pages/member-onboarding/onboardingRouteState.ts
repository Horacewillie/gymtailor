export type EmailGymLocationState = {
  email?: string;
  gymName?: string;
};

export function readEmailGymLocationState(state: unknown): { email: string; gymName: string } {
  const source = (state as EmailGymLocationState | null) ?? {};
  return {
    email: source.email ?? "",
    gymName: source.gymName ?? "",
  };
}
