export type EquipmentStatus = "Available" | "Unavailable";

export type EquipmentItem = {
  id: string;
  name: string;
  serialNumber?: string;
  addedOn: Date;
  category: string;
  status: EquipmentStatus;
  totalUnits: number;
  frequency: number;
};

export type AddEquipmentDraft = {
  imageFile: File | null;
  name: string;
  category: string;
  notifyMember: boolean;
};

export type EquipmentListApiItem = {
  id?: string | number;
  equipment_id?: string | number;
  name: string;
  date_created: string;
  category: string;
  status: string;
  total_units: number;
  frequency: number;
};

export type EquipmentListApiResponse = {
  total: number;
  available: number;
  unavailable: number;
  equipments: EquipmentListApiItem[];
};

export type CreateEquipmentApiResponse = {
  id?: string | number;
  equipment_id?: string | number;
  name?: string;
  date_created?: string;
  category?: string;
  status?: string;
  total_units?: number;
  frequency?: number;
  serial_number?: string;
};

export const DEFAULT_GYM_CATEGORIES = [
  "Cardio",
  "Strength",
  "Free Weights",
  "Functional Training",
  "Group Cycle",
  "Machine",
  "Recovery",
];
