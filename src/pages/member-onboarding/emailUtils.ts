export function splitEmail(email: string): { local: string; domain: string | null } {
  const trimmed = email.trim();
  if (!trimmed) return { local: "", domain: null };

  const at = trimmed.indexOf("@");
  if (at <= 0 || at === trimmed.length - 1) {
    return { local: trimmed, domain: null };
  }

  return {
    local: trimmed.slice(0, at),
    domain: trimmed.slice(at + 1),
  };
}
