import { afterEach, describe, expect, it, vi } from "vitest";
import { agentBookingUrl, fetchAgent, resolveAgent } from "@/lib/agent";

afterEach(() => vi.restoreAllMocks());

describe("resolveAgent", () => {
  it("cleans a Sheet row", () => {
    expect(
      resolveAgent({ kode: "travelx", namaTravel: " Travel X ", hargaOpenTrip: 300, hargaPremium: 700.4, kontak: "+62 811" }),
    ).toEqual({ code: "TRAVELX", name: "Travel X", priceOpenTrip: 300, pricePremium: 700, contact: "+62 811" });
  });

  it("treats missing or bad prices as not set", () => {
    expect(resolveAgent({ kode: "TRAVELX", hargaOpenTrip: "tiga ratus", hargaPremium: 0 })).toMatchObject({
      priceOpenTrip: null,
      pricePremium: null,
      name: "TRAVELX",
    });
  });

  it("rejects unsafe codes", () => {
    expect(resolveAgent({ kode: "<script>" })).toBeNull();
  });
});

describe("fetchAgent", () => {
  it("does not call the Sheet for malformed codes and reports a missing connection", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    expect(await fetchAgent("a b", "https://example.test")).toEqual({ status: "not_found" });
    expect(spy).not.toHaveBeenCalled();
    expect(await fetchAgent("TRAVELX", "")).toEqual({ status: "unavailable" });
  });

  it("returns the agent when found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ found: true, data: { kode: "TRAVELX", namaTravel: "Travel X", hargaOpenTrip: 300, hargaPremium: 700 } }),
    } as Response);
    const r = await fetchAgent("TRAVELX", "https://example.test");
    expect(r.status === "found" && r.agent.name).toBe("Travel X");
  });
});

describe("agentBookingUrl", () => {
  it("builds the partner's booking link", () => {
    expect(agentBookingUrl("https://gallopmadinah.id", "TRAVELX")).toBe("https://gallopmadinah.id/booking?agen=TRAVELX");
  });
});
