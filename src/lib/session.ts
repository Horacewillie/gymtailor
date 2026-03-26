const TOKEN_KEYS = ["token", "access_token"] as const;
const TENANT_KEYS = ["tenantId", "tenant_id"] as const;

function readFirstAvailable(keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value && value.trim().length > 0) return value;
  }
  return null;
}

export function getAccessToken(): string | null {
  return readFirstAvailable(TOKEN_KEYS);
}

export function getTenantId(): string | null {
  return readFirstAvailable(TENANT_KEYS);
}

export function getAuthHeaders(): Record<string, string> {
  // Auth now relies on Sanctum session cookies.
  // Keep the helper to avoid touching every call site.
  return {};
}

export function saveAccessToken(token: string): void {
  localStorage.setItem("token", token);
}

export function saveTenantId(tenantId: string | number): void {
  localStorage.setItem("tenantId", String(tenantId));
}
