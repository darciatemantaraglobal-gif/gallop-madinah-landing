import { describe, expect, it } from "vitest";
import { translations } from "@/contexts/LanguageContext";
import { ar } from "@/i18n/ar";
import { ms } from "@/i18n/ms";

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

describe.each([
  ["ms", ms],
  ["ar", ar],
])("%s translations", (_, dict) => {
  it("covers every key", () => {
    const missing = Object.keys(translations).filter((k) => !(k in dict));
    expect(missing).toEqual([]);
  });

  it("has no keys that don't exist in the main table", () => {
    const extra = Object.keys(dict).filter((k) => !(k in translations));
    expect(extra).toEqual([]);
  });

  it("keeps every {placeholder}", () => {
    const broken = Object.keys(translations).filter(
      (k) => k in dict && placeholders(dict[k]).join() !== placeholders(translations[k].en).join(),
    );
    expect(broken).toEqual([]);
  });

  it("has no empty strings", () => {
    expect(Object.entries(dict).filter(([, v]) => !v.trim()).map(([k]) => k)).toEqual([]);
  });
});
