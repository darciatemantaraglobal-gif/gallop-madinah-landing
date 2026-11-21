// Field definitions for the admin editors, and the conversions between what a form shows
// (strings, checkboxes) and what the database stores (numbers, arrays, nulls).

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "tags" | "date" | "url" | "image" | "images";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Codes are stored in capitals (GM-7K2QX, LINTAS). */
  upper?: boolean;
  min?: number;
  max?: number;
  /** Max characters for text fields. */
  maxLength?: number;
  /** Text fields only: allowed pattern (checked before saving). */
  pattern?: RegExp;
  patternHelp?: string;
  /** Storage folder for image uploads. */
  folder?: string;
  /** Only editable when creating (primary keys such as codes). */
  createOnly?: boolean;
  /** Takes the full width in the form grid. */
  wide?: boolean;
};

export type FormValue = string | boolean | string[];
export type FormValues = Record<string, FormValue>;
export type Row = Record<string, unknown>;

/** Database value → form value. */
export function toForm(field: Field, v: unknown): FormValue {
  switch (field.type) {
    case "boolean":
      return Boolean(v);
    case "tags":
      return Array.isArray(v) ? v.join(", ") : "";
    case "images":
      return Array.isArray(v) ? v.map(String) : [];
    case "number":
      return v === null || v === undefined ? "" : String(v);
    default:
      return v === null || v === undefined ? "" : String(v);
  }
}

/** Form value → database value. */
export function toDb(field: Field, v: FormValue): unknown {
  switch (field.type) {
    case "boolean":
      return Boolean(v);
    case "tags":
      return String(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    case "images":
      return Array.isArray(v) ? v : [];
    case "number": {
      const s = String(v).trim();
      return s === "" ? null : Number(s.replace(/\./g, "").replace(",", "."));
    }
    case "date":
      return String(v).trim() || null;
    default: {
      const s = String(v).trim();
      return field.upper ? s.toUpperCase() : s;
    }
  }
}

/** Problem with one field, in plain Indonesian, or null when it's fine. */
export function checkField(field: Field, v: FormValue): string | null {
  const db = toDb(field, v);
  const empty = db === null || db === "" || (Array.isArray(db) && db.length === 0);
  if (field.required && empty && field.type !== "boolean") return `${field.label} wajib diisi.`;
  if (empty) return null;
  if (field.type === "number") {
    const n = db as number;
    if (!Number.isFinite(n) || !Number.isInteger(n)) return `${field.label} harus angka bulat.`;
    if (field.min !== undefined && n < field.min) return `${field.label} minimal ${field.min}.`;
    if (field.max !== undefined && n > field.max) return `${field.label} maksimal ${field.max}.`;
  }
  if ((field.type === "text" || field.type === "textarea") && field.maxLength && String(db).length > field.maxLength)
    return `${field.label} maksimal ${field.maxLength} karakter.`;
  if (field.type === "url" && !/^https:\/\/\S+$/i.test(String(db))) return `${field.label} harus diawali https://`;
  if (field.type === "image" && !/^(https:\/\/\S+|\/(?!\/)\S+)$/i.test(String(db))) return `${field.label} belum valid.`;
  if (field.pattern && !field.pattern.test(String(db))) return field.patternHelp ?? `${field.label} belum sesuai format.`;
  return null;
}

export const emptyForm = (fields: Field[], defaults: Row = {}): FormValues =>
  Object.fromEntries(fields.map((f) => [f.key, toForm(f, defaults[f.key])]));

export const rowToForm = (fields: Field[], row: Row): FormValues =>
  Object.fromEntries(fields.map((f) => [f.key, toForm(f, row[f.key])]));

export const formToRow = (fields: Field[], values: FormValues, { creating }: { creating: boolean }): Row =>
  Object.fromEntries(
    fields.filter((f) => creating || !f.createOnly).map((f) => [f.key, toDb(f, values[f.key])]),
  );

export function checkForm(fields: Field[], values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const e = checkField(f, values[f.key]);
    if (e) errors[f.key] = e;
  }
  return errors;
}
