import { describe, expect, it } from "vitest";
import { riderErrors, riderWarnings, ridersValid, type Rider } from "@/lib/registration";

const rider = (over: Partial<Rider> = {}): Rider => ({ name: "Aisyah", age: "12", weight: "40", experience: "none", ...over });

describe("riderErrors", () => {
  it("accepts a complete rider", () => {
    expect(riderErrors(rider())).toEqual({});
  });

  it("flags every missing or impossible field", () => {
    expect(riderErrors({ name: " ", age: "0", weight: "500", experience: "" })).toEqual({
      name: true,
      age: true,
      weight: true,
      experience: true,
    });
    expect(riderErrors(rider({ age: "dua belas" }))).toEqual({ age: true });
    expect(riderErrors(rider({ weight: "45.5" }))).toEqual({ weight: true });
  });
});

describe("riderWarnings", () => {
  it("warns only when the owner has set a limit", () => {
    expect(riderWarnings(rider({ age: "5", weight: "130" }), { minAge: null, maxWeight: null })).toEqual({ young: false, heavy: false });
    expect(riderWarnings(rider({ age: "5", weight: "130" }), { minAge: 6, maxWeight: 110 })).toEqual({ young: true, heavy: true });
    expect(riderWarnings(rider({ age: "6", weight: "110" }), { minAge: 6, maxWeight: 110 })).toEqual({ young: false, heavy: false });
  });
});

describe("ridersValid", () => {
  it("needs at least one rider and every rider complete", () => {
    expect(ridersValid([])).toBe(false);
    expect(ridersValid([rider(), rider({ name: "" })])).toBe(false);
    expect(ridersValid([rider(), rider({ name: "Budi" })])).toBe(true);
  });
});
