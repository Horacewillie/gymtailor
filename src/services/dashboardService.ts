import { apiClient } from "../api/Api";
import { getAuthHeaders, getTenantId } from "../lib/session";

export type DashboardResponse = {
  member_count?: number;
  equipment_utilization?: number;
  equipments?: Array<{
    id: number;
    name: string;
    serial_number: string;
    members_used: number[];
    usage_rate: number;
    frequency: number;
    trend: Array<{ user_id: number; last_used_at: string }>;
  }>;
};

export async function getDashboardData(): Promise<DashboardResponse> {
  return apiClient.get<DashboardResponse>("/api/dashboard", {
    headers: getAuthHeaders(),
  });
}

export type TenantBranch = {
  id: string;
  name: string;
};

export async function getTenantBranches(): Promise<TenantBranch[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const response = await apiClient.get<any>(
    `/api/tenants/${encodeURIComponent(tenantId)}/branches`,
    { headers: getAuthHeaders() },
  );
  const rows: any[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.branches)
      ? response.branches
      : Array.isArray(response?.data)
        ? response.data
        : [];
  return rows
    .map((row, idx) => ({
      id: String(row?.id ?? row?.branch_id ?? idx),
      name: String(row?.name ?? "").trim(),
    }))
    .filter((row) => row.name.length > 0);
}

export async function inviteMember(recipientEmail: string): Promise<unknown> {
  return apiClient.post(
    "/api/invite-member",
    { recipient_email: recipientEmail },
    { headers: getAuthHeaders() },
  );
}
