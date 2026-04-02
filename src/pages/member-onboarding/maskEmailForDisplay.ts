import { splitEmail } from "./emailUtils";

/** e.g. fego@outlook.com → f***@outlook.com */
export function maskEmailForDisplay(email: string): string {
  const { local, domain } = splitEmail(email);
  if (!local) return "";
  if (!domain) return local;
  const masked = local.length <= 1 ? "*" : `${local[0]}***`;
  return `${masked}@${domain}`;
}
