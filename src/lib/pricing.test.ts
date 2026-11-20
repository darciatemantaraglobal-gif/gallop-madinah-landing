import { describe, expect, it } from "vitest";
import { FALLBACK_PRICES } from "@/data/siteData";
import { formatSar, nextCheaperTier, quote } from "@/lib/pricing";

const premium = (people: number, addonIds: string[] = []) =>
  quote(FALLBACK_PRICES, { packageId: "premium", people, addonIds });
const openTrip = (people: number, addonIds: string[] = []) =>
  quote(FALLBACK_PRICES, { packageId: "open_trip", people, addonIds });

describe("quote: Premium group tiers", () => {
  it.each([
    [1, 1250, 1250],
    [2, 850, 1700],
    [4, 850, 3400],
    [5, 750, 3750],
    [7, 750, 5250],
    [10, 750, 7500],
  ])("%i people → %i SAR each, %i total", (people, perPerson, total) => {
    expect(premium(people)).toMatchObject({ status: "ok", perPerson, total });
  });

  it("11 or more people is quoted on request", () => {
    expect(premium(11)).toEqual({ status: "on_request", fromPeople: 11 });
    expect(premium(40)).toEqual({ status: "on_request", fromPeople: 11 });
  });
});

describe("quote: Open Trip minimum", () => {
  it("needs at least 20 people", () => {
    expect(openTrip(19)).toEqual({ status: "below_min", minPeople: 20 });
    expect(openTrip(1)).toEqual({ status: "below_min", minPeople: 20 });
  });

  it("is 350 SAR per person from 20 people, with no upper tier", () => {
    expect(openTrip(20)).toMatchObject({ status: "ok", perPerson: 350, total: 7000 });
    expect(openTrip(45)).toMatchObject({ status: "ok", perPerson: 350, total: 15750 });
  });
});

describe("quote: add-ons", () => {
  it("adds each chosen add-on once per booking", () => {
    const q = premium(7, ["drone"]);
    expect(q).toMatchObject({ status: "ok", subtotal: 5250, total: 5850 });
    expect(premium(2, ["gmc", "drone"])).toMatchObject({ total: 1700 + 800 + 600 });
  });

  it("ignores unknown add-on ids", () => {
    expect(premium(2, ["helicopter"])).toMatchObject({ total: 1700 });
  });
});

describe("quote: bad input", () => {
  it.each([0, -1, 2.5, NaN])("rejects %s people", (people) => {
    expect(premium(people)).toEqual({ status: "invalid" });
  });

  it("rejects an unknown package", () => {
    expect(quote(FALLBACK_PRICES, { packageId: "vip", people: 2, addonIds: [] })).toEqual({ status: "invalid" });
  });
});

describe("nextCheaperTier", () => {
  it("nudges 4 people toward the 5-person price", () => {
    expect(nextCheaperTier(FALLBACK_PRICES, "premium", 4)).toEqual({ addPeople: 1, price: 750 });
  });

  it("nudges 1 person toward the 2-person price", () => {
    expect(nextCheaperTier(FALLBACK_PRICES, "premium", 1)).toEqual({ addPeople: 1, price: 850 });
  });

  it("has no nudge once on the cheapest listed tier or for flat packages", () => {
    expect(nextCheaperTier(FALLBACK_PRICES, "premium", 7)).toBeNull();
    expect(nextCheaperTier(FALLBACK_PRICES, "open_trip", 25)).toBeNull();
  });
});

describe("formatSar", () => {
  it("uses a dot as thousands separator", () => {
    expect(formatSar(1250)).toBe("1.250");
    expect(formatSar(350)).toBe("350");
  });
});
