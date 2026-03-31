import type { EquipmentItem } from "./equipment.types";

export function formatAddedOn(d: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const h = d.getHours();
  const hh = String(((h + 11) % 12) + 1);
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${day} ${month} ${year} • ${hh}:${mm} ${ampm}`;
}

export function toEquipmentCsv(items: EquipmentItem[]) {
  const rows = [
    ["Equipment", "Added on", "Category", "Status", "Total units", "Frequency"],
    ...items.map((i) => [
      i.name,
      formatAddedOn(i.addedOn),
      i.category,
      i.status,
      String(i.totalUnits),
      String(i.frequency),
    ]),
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return rows.map((r) => r.map(escape).join(",")).join("\n");
}

export function downloadTextFile(filename: string, contents: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
