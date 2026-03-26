import { apiClient } from "../api/Api";
import { getAuthHeaders } from "../lib/session";

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
