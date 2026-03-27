import { apiClient } from "../api/Api";
import { getAuthHeaders, getTenantId } from "../lib/session";
import { mapEquipmentListToItems } from "../pages/equipment/equipment.mappers";
import type {
  CreateEquipmentApiResponse,
  EquipmentItem,
  EquipmentListApiResponse,
} from "../pages/equipment/equipment.types";

export async function getTenantEquipmentList(): Promise<EquipmentItem[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const response = await apiClient.get<EquipmentListApiResponse>(
    `/api/tenant/${encodeURIComponent(tenantId)}/equipment`,
    { headers: getAuthHeaders() },
  );
  if (!Array.isArray(response?.equipments)) return [];
  return mapEquipmentListToItems(response.equipments);
}

export async function createEquipment(payload: {
  tenant_id: string | number;
  name: string;
  category: string;
  unit: number;
  status: string;
}): Promise<CreateEquipmentApiResponse> {
  return apiClient.post<CreateEquipmentApiResponse>("/api/equipment", payload, {
    headers: getAuthHeaders(),
  });
}

export async function importEquipmentCsv(file: File): Promise<unknown> {
  const tenantId = getTenantId();
  if (!tenantId) throw new Error("Missing tenant id.");
  const formData = new FormData();
  formData.append("tenant_id", tenantId);
  formData.append("file", file);
  return apiClient.postFormData("/api/equipment/import", formData, {
    headers: getAuthHeaders(),
  });
}

export async function deleteEquipment(equipmentId: string): Promise<void> {
  await apiClient.delete(`/api/equipment/${encodeURIComponent(equipmentId)}`, {
    headers: getAuthHeaders(),
  });
}

export async function createEquipmentUnit(payload: {
  equipmentId: string;
  serial_number: string;
  status: string;
}): Promise<unknown> {
  return apiClient.post(
    `/api/equipment/${encodeURIComponent(payload.equipmentId)}/units`,
    {
      serial_number: payload.serial_number,
      status: payload.status,
    },
    { headers: getAuthHeaders() },
  );
}
