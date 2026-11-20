import { describe, expect, it } from "vitest";
import { certificateFileName, fitFontSize } from "@/lib/certificate";

describe("fitFontSize", () => {
  // Pretend each character is 0.7 × font size wide.
  const measureFor = (text: string) => (size: number) => text.length * size * 0.7;

  it("keeps the starting size for short names", () => {
    expect(fitFontSize(measureFor("AISYAH"), 1400, 110, 44)).toBe(110);
  });

  it("shrinks long names until they fit", () => {
    const name = "MUHAMMAD ABDULLAH AL-FARUQI RAHMAN";
    const size = fitFontSize(measureFor(name), 1400, 110, 44);
    expect(size).toBeLessThan(110);
    expect(name.length * size * 0.7).toBeLessThanOrEqual(1400);
  });

  it("never goes below the minimum", () => {
    expect(fitFontSize(measureFor("X".repeat(500)), 1400, 110, 44)).toBe(44);
  });
});

describe("certificateFileName", () => {
  it("makes a safe file name from the rider's name", () => {
    expect(certificateFileName("Aisyah Rahman")).toBe("sertifikat-first-gallop-aisyah-rahman.png");
    expect(certificateFileName("Zoë / Ömer!")).toBe("sertifikat-first-gallop-zoe-omer.png");
    expect(certificateFileName("  ")).toBe("sertifikat-first-gallop.png");
  });
});
