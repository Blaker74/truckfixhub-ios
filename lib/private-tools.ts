export type FieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  capitalization?: "none" | "sentences" | "words" | "characters";
};

export type ToolId = "trucks" | "parts" | "calls" | "calendar" | "warranty";

export const PRIVATE_TOOLS: Record<ToolId, {
  title: string;
  subtitle: string;
  table: string;
  columns: string;
  orderBy: string;
  ascending: boolean;
  icon: string;
  fields: FieldDefinition[];
}> = {
  trucks: {
    title: "Trucks & VINs",
    subtitle: "Your private truck list and vehicle details.",
    table: "tfh_trucks",
    columns: "id,unit_number,vin,year,make,model,engine,engine_serial,notes",
    orderBy: "unit_number",
    ascending: true,
    icon: "bus-outline",
    fields: [
      { key: "unit_number", label: "Unit number", placeholder: "e.g. 104" },
      { key: "vin", label: "VIN", placeholder: "17-character VIN", capitalization: "characters" },
      { key: "year", label: "Year", placeholder: "2022", keyboardType: "numeric" },
      { key: "make", label: "Make", placeholder: "Manufacturer", capitalization: "words" },
      { key: "model", label: "Model", placeholder: "Model", capitalization: "words" },
      { key: "engine", label: "Engine", placeholder: "Engine model", capitalization: "words" },
      { key: "engine_serial", label: "Engine serial number", placeholder: "Optional", capitalization: "characters" },
      { key: "notes", label: "Notes", placeholder: "Fleet or truck notes", multiline: true },
    ],
  },
  parts: {
    title: "Saved parts",
    subtitle: "Keep part numbers and availability with your account.",
    table: "tfh_saved_parts",
    columns: "*",
    orderBy: "created_at",
    ascending: false,
    icon: "construct-outline",
    fields: [
      { key: "part_number", label: "Part number", placeholder: "Part number", capitalization: "characters" },
      { key: "description", label: "Description", placeholder: "Part or component", capitalization: "sentences" },
      { key: "brand", label: "Brand", placeholder: "Manufacturer", capitalization: "words" },
      { key: "availability", label: "Location / quantity", placeholder: "Bin, store, or quantity" },
      { key: "notes", label: "Notes", placeholder: "Additional details", multiline: true },
    ],
  },
  calls: {
    title: "Call notes",
    subtitle: "Save contacts, requests, and follow-up actions.",
    table: "tfh_call_notes",
    columns: "*",
    orderBy: "created_at",
    ascending: false,
    icon: "call-outline",
    fields: [
      { key: "customer", label: "Contact", placeholder: "Person or customer" },
      { key: "phone", label: "Phone", placeholder: "Phone number", keyboardType: "phone-pad" },
      { key: "vehicle", label: "Company / vehicle", placeholder: "Company or truck" },
      { key: "request", label: "Call notes", placeholder: "What was discussed?", multiline: true },
      { key: "next_action", label: "Follow-up", placeholder: "Next step", multiline: true },
    ],
  },
  calendar: {
    title: "Calendar",
    subtitle: "Keep service dates and follow-ups in one place.",
    table: "tfh_calendar_events",
    columns: "*",
    orderBy: "event_date",
    ascending: true,
    icon: "calendar-outline",
    fields: [
      { key: "title", label: "Event", placeholder: "Service, inspection, or follow-up" },
      { key: "event_date", label: "Date", placeholder: "YYYY-MM-DD", capitalization: "none" },
      { key: "event_time", label: "Time (optional)", placeholder: "HH:MM", capitalization: "none" },
      { key: "customer", label: "Customer / truck", placeholder: "Optional" },
      { key: "notes", label: "Notes", placeholder: "Details", multiline: true },
    ],
  },
  warranty: {
    title: "Warranty records",
    subtitle: "Keep warranty details tied to your trucks and parts.",
    table: "tfh_warranty_sheets",
    columns: "*",
    orderBy: "created_at",
    ascending: false,
    icon: "shield-checkmark-outline",
    fields: [
      { key: "customer", label: "Customer", placeholder: "Optional" },
      { key: "unit_number", label: "Unit number", placeholder: "Truck unit" },
      { key: "vin", label: "VIN", placeholder: "Optional", capitalization: "characters" },
      { key: "vehicle", label: "Vehicle", placeholder: "Year / make / model" },
      { key: "mileage", label: "Mileage", placeholder: "Odometer reading", keyboardType: "numeric" },
      { key: "engine", label: "Engine", placeholder: "Engine model" },
      { key: "failed_part_number", label: "Failed part number", placeholder: "Part number" },
      { key: "part_serial_number", label: "Part serial number", placeholder: "Optional" },
      { key: "invoice_number", label: "Invoice number", placeholder: "Optional" },
      { key: "purchase_date", label: "Purchase date", placeholder: "YYYY-MM-DD" },
      { key: "complaint", label: "Complaint", placeholder: "Customer-reported issue", multiline: true },
      { key: "cause", label: "Cause", placeholder: "Finding", multiline: true },
      { key: "correction", label: "Correction", placeholder: "Work performed", multiline: true },
      { key: "replacement_part_number", label: "Replacement part number", placeholder: "Optional" },
    ],
  },
};

export function rowTitle(tool: ToolId, row: Record<string, unknown>) {
  if (tool === "trucks") {
    const identity = [row.year, row.make, row.model].filter(Boolean).join(" ");
    return String(row.unit_number || identity || row.vin || "Truck record");
  }
  if (tool === "parts") return String(row.part_number || row.description || "Saved part");
  if (tool === "calls") return String(row.customer || row.vehicle || "Call note");
  if (tool === "calendar") return String(row.title || "Calendar event");
  return String(row.failed_part_number || row.unit_number || row.customer || "Warranty record");
}

export function rowSubtitle(tool: ToolId, row: Record<string, unknown>) {
  if (tool === "trucks") return [row.vin ? `VIN ${row.vin}` : null, row.engine ? `Engine ${row.engine}` : null].filter(Boolean).join(" · ") || "Add vehicle details";
  if (tool === "parts") return [row.description, row.brand, row.availability].filter(Boolean).join(" · ") || "Saved part details";
  if (tool === "calls") return [row.phone, row.request, row.next_action].filter(Boolean).join(" · ") || "Call details";
  if (tool === "calendar") return [row.event_date, row.event_time, row.customer].filter(Boolean).join(" · ") || "Event details";
  return [row.vin, row.vehicle, row.complaint].filter(Boolean).join(" · ") || "Warranty details";
}
