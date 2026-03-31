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

export type TenantMember = {
  id: string;
  user_id?: string;
  tenant_id?: string;
  role?: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  invitation_status?: string;
  status?: string;
  phone?: string;
  last_active?: string;
};

export async function getTenantMembers(): Promise<TenantMember[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const response = await apiClient.get<any>(
    `/api/tenants/${encodeURIComponent(tenantId)}/members`,
    { headers: getAuthHeaders() },
  );
  const rows: any[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.members)
      ? response.members
      : Array.isArray(response?.data)
        ? response.data
        : [];
  return rows.map((row) => ({
    id: String(row?.id ?? ""),
    user_id: row?.user_id !== undefined ? String(row.user_id) : undefined,
    tenant_id: row?.tenant_id !== undefined ? String(row.tenant_id) : undefined,
    role: row?.role !== undefined ? String(row.role) : undefined,
    email: String(row?.email ?? ""),
    name: String(row?.name ?? ""),
    created_at: row?.created_at !== undefined ? String(row.created_at) : undefined,
    updated_at: row?.updated_at !== undefined ? String(row.updated_at) : undefined,
    invitation_status:
      row?.invitation_status !== undefined ? String(row.invitation_status) : undefined,
    status: row?.status !== undefined ? String(row.status) : undefined,
    phone: row?.phone !== undefined ? String(row.phone) : undefined,
    last_active: row?.last_active !== undefined ? String(row.last_active) : undefined,
  }));
}
