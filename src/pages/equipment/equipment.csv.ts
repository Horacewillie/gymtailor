import type { EquipmentItem } from "./equipment.types";

export const MAX_CSV_IMPORT_BYTES = 50 * 1024 * 1024;

export const EQUIPMENT_IMPORT_CSV_TEMPLATE = `Serial Number,Product VA,Grouping
D92CBNE020000160,Group Cycle Connect with Console,Group Cycle
D92CBNE020000165,Group Cycle Connect with Console,Group Cycle
D92CBNE020000168,Group Cycle Connect with Console,Group Cycle
`;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else if (c !== "\r") {
      cur += c;
    }
  }
  result.push(cur);
  return result.map((s) => s.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function parseEquipmentImportCsv(text: string): EquipmentItem[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && l.includes(","));
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const serialIdx = headers.findIndex((h) => h === "serialnumber");
  const productIdx = headers.findIndex((h) => h === "productva" || h === "equipment");
  const groupingIdx = headers.findIndex((h) => h === "grouping" || h === "category");
  const totalUnitsIdx = headers.findIndex((h) => h === "totalunits");

  const hasUnitRowsFormat = serialIdx >= 0 && productIdx >= 0 && groupingIdx >= 0;
  const hasLegacyFormat = productIdx >= 0 && groupingIdx >= 0 && totalUnitsIdx >= 0;
  if (!hasUnitRowsFormat && !hasLegacyFormat) return [];

  const out: EquipmentItem[] = [];
  const grouped = new Map<string, { name: string; category: string; serials: string[] }>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const name = (cols[productIdx] ?? "").trim();
    const cat = (cols[groupingIdx] ?? "").trim() || "General";
    if (!name) continue;

    if (hasUnitRowsFormat) {
      const serial = (cols[serialIdx] ?? "").trim();
      if (!serial) continue;
      const key = `${name.toLowerCase()}::${cat.toLowerCase()}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.serials.push(serial);
      } else {
        grouped.set(key, { name, category: cat, serials: [serial] });
      }
      continue;
    }

    const unitsRaw = (cols[totalUnitsIdx] ?? "").trim();
    const units = Math.max(1, Math.floor(Number(unitsRaw)) || 1);
    out.push({
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-csv-${Date.now()}-${i}`,
      name,
      addedOn: new Date(),
      category: cat,
      status: "Available",
      totalUnits: units,
      serialNumber: "",
      frequency: 0,
    });
  }

  if (hasUnitRowsFormat) {
    grouped.forEach((entry, idx) => {
      out.push({
        id: `${entry.name.toLowerCase().replace(/\s+/g, "-")}-csv-${Date.now()}-${idx}`,
        name: entry.name,
        addedOn: new Date(),
        category: entry.category,
        status: "Available",
        totalUnits: entry.serials.length,
        serialNumber: entry.serials[0] ?? "",
        frequency: 0,
      });
    });
  }

  return out;
}
