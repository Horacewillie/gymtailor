import { splitEmail } from "./emailUtils";

/** "fego@outlook.com" → "Fego" for greetings */
export function firstNameFromEmail(email: string): string {
  const { local } = splitEmail(email);
  if (!local) return "there";
  const raw = (local.split(/[._-]/)[0] ?? local).replace(/[^a-zA-Z0-9]/g, "");
  if (!raw) return "there";
  return raw.slice(0, 1).toUpperCase() + raw.slice(1).toLowerCase();
}
