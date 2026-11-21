import { describe, expect, it } from "vitest";
import { checkField, checkForm, emptyForm, formToRow, rowToForm, toDb, toForm, type Field } from "@/lib/admin/fields";

const price: Field = { key: "price", label: "Harga", type: "number", required: true, min: 1 };
const tiers: Field = { key: "features", label: "Fitur", type: "tags" };
const code: Field = { key: "code", label: "Kode", type: "text", required: true, upper: true, createOnly: true, pattern: /^[A-Z0-9-]{2,20}$/ };
const link: Field = { key: "maps_url", label: "Link Maps", type: "url" };
const logo: Field = { key: "logo_url", label: "Logo", type: "image", required: true };

describe("toForm / toDb", () => {
  it("round-trips numbers, accepting Indonesian thousands separators", () => {
    expect(toForm(price, 1250)).toBe("1250");
    expect(toDb(price, "1.250")).toBe(1250);
    expect(toDb(price, "")).toBeNull();
  });

  it("turns comma lists into arrays and back", () => {
    expect(toForm(tiers, ["horse", "coach"])).toBe("horse, coach");
    expect(toDb(tiers, " horse , coach,, ")).toEqual(["horse", "coach"]);
  });

  it("upper-cases codes and trims text", () => {
    expect(toDb(code, "  lintas ")).toBe("LINTAS");
  });
});

describe("checkField", () => {
  it("requires required fields", () => {
    expect(checkField(price, "")).toMatch(/wajib/);
  });

  it("rejects non-whole and too-small numbers", () => {
    expect(checkField(price, "12,5")).toMatch(/angka bulat/);
    expect(checkField(price, "0")).toMatch(/minimal 1/);
    expect(checkField(price, "abc")).toMatch(/angka bulat/);
  });

  it("checks link and code formats", () => {
    expect(checkField(link, "http://maps.google.com")).toMatch(/https/);
    expect(checkField(link, "")).toBeNull();
    expect(checkField(code, "lin tas")).toMatch(/format/);
    expect(checkField(code, "lintas")).toBeNull();
  });

  it("accepts uploaded logos and site paths, not other things", () => {
    expect(checkField(logo, "https://x.supabase.co/storage/v1/object/public/media/p.png")).toBeNull();
    expect(checkField(logo, "/partners/x.png")).toBeNull();
    expect(checkField(logo, "javascript:alert(1)")).toMatch(/valid/);
  });
});

describe("forms", () => {
  const fields = [code, price, tiers];

  it("skips create-only fields when updating", () => {
    const values = rowToForm(fields, { code: "LINTAS", price: 300, features: [] });
    expect(formToRow(fields, values, { creating: false })).toEqual({ price: 300, features: [] });
    expect(formToRow(fields, values, { creating: true })).toEqual({ code: "LINTAS", price: 300, features: [] });
  });

  it("collects every error", () => {
    expect(Object.keys(checkForm(fields, emptyForm(fields)))).toEqual(["code", "price"]);
  });
});
