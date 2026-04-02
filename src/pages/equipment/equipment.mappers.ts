import type { EquipmentItem, EquipmentListApiItem, EquipmentStatus } from "./equipment.types";

export function parseApiDateTime(value: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function mapApiStatus(status: string): EquipmentStatus {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_");
  const unavailableStates = new Set([
    "unavailable",
    "inactive",
    "disabled",
    "out_of_service",
    "out-of-service",
    "maintenance",
  ]);
  return unavailableStates.has(normalized) ? "Unavailable" : "Available";
}

export function getApiEquipmentId(item: Pick<EquipmentListApiItem, "id" | "equipment_id">): string | null {
  const raw = item.id ?? item.equipment_id;
  if (raw === null || raw === undefined) return null;
  const id = String(raw).trim();
  return id.length > 0 ? id : null;
}

export function mapEquipmentListItemToEquipment(item: EquipmentListApiItem, idx: number): EquipmentItem {
  const apiEquipmentId = getApiEquipmentId(item);
  return {
    id: apiEquipmentId ?? `${item.name.toLowerCase().replace(/\s+/g, "-")}-${idx}-${Date.now()}`,
    name: item.name,
    serialNumber: "",
    addedOn: parseApiDateTime(item.date_created),
    category: item.category,
    status: mapApiStatus(item.status),
    totalUnits: Number(item.total_units) || 0,
    frequency: Number(item.frequency) || 0,
  };
}

export function mapEquipmentListToItems(items: EquipmentListApiItem[]): EquipmentItem[] {
  return items.map(mapEquipmentListItemToEquipment);
}
