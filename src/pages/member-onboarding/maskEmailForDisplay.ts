/** e.g. fego@outlook.com → f***@outlook.com */
export function maskEmailForDisplay(email: string): string {
  const t = email.trim();
  if (!t) return "";
  const at = t.indexOf("@");
  if (at <= 0 || at === t.length - 1) return t;
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  const masked = local.length <= 1 ? "*" : `${local[0]}***`;
  return `${masked}@${domain}`;
}
