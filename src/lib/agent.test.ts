import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { agentBookingUrl, fetchAgent, resolveAgent } from "@/lib/agent";

const rpcClient = (result: { data: unknown; error: unknown }) =>
  ({ rpc: () => Promise.resolve(result) }) as unknown as SupabaseClient;

describe("resolveAgent", () => {
  it("cleans a database row", () => {
    expect(
      resolveAgent({ code: "travelx", name: " Travel X ", price_open_trip: 300, price_premium: 700.4, contact: "+62 811" }),
    ).toEqual({ code: "TRAVELX", name: "Travel X", priceOpenTrip: 300, pricePremium: 700, contact: "+62 811" });
  });

  it("treats missing or bad prices as not set", () => {
    expect(resolveAgent({ code: "TRAVELX", name: null, price_open_trip: null, price_premium: 0 })).toMatchObject({
      priceOpenTrip: null,
      pricePremium: null,
      name: "TRAVELX",
    });
  });

  it("rejects unsafe codes", () => {
    expect(resolveAgent({ code: "<script>" })).toBeNull();
  });
});

describe("fetchAgent", () => {
  it("does not look up malformed codes and reports a missing database", async () => {
    expect(await fetchAgent("a b", rpcClient({ data: null, error: null }))).toEqual({ status: "not_found" });
    expect(await fetchAgent("TRAVELX", null)).toEqual({ status: "unavailable" });
  });

  it("returns the agent when found", async () => {
    const r = await fetchAgent("TRAVELX", rpcClient({ data: { code: "TRAVELX", name: "Travel X" }, error: null }));
    expect(r.status === "found" && r.agent.name).toBe("Travel X");
  });
});

describe("agentBookingUrl", () => {
  it("builds the partner's booking link", () => {
    expect(agentBookingUrl("https://gallopmadinah.id", "TRAVELX")).toBe("https://gallopmadinah.id/booking?agen=TRAVELX");
  });
});
