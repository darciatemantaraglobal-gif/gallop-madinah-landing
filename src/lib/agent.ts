import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase, withTimeout } from "@/lib/supabase";
import { AGENT_CODE_RE } from "@/lib/booking";

// Travel-partner page (/partner/KODE): agent prices, a personal booking link, promo material.

export const DEMO_AGENT_CODE = "DEMO";

// What public.get_agent() returns (one active row of the agents table).
const rawAgentSchema = z.object({
  code: z.string(),
  name: z.string().nullish().transform((v) => v ?? ""),
  price_open_trip: z.number().nullable().catch(null),
  price_premium: z.number().nullable().catch(null),
  contact: z.string().nullish().transform((v) => v ?? ""),
});

export type Agent = {
  code: string;
  name: string;
  /** Agent price per person, or null when not set. */
  priceOpenTrip: number | null;
  pricePremium: number | null;
  contact: string;
  isDemo?: boolean;
};

export type AgentResult = { status: "found"; agent: Agent } | { status: "not_found" } | { status: "unavailable" };

const price = (n: number | null) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.round(n) : null);

export function resolveAgent(raw: unknown): Agent | null {
  const r = rawAgentSchema.safeParse(raw);
  if (!r.success) return null;
  const code = r.data.code.trim().toUpperCase();
  if (!AGENT_CODE_RE.test(code)) return null;
  return {
    code,
    name: r.data.name.trim() || code,
    priceOpenTrip: price(r.data.price_open_trip),
    pricePremium: price(r.data.price_premium),
    contact: r.data.contact.trim(),
  };
}

/** Looks up one active agent through public.get_agent (visitors cannot list the agents table). */
export async function fetchAgent(code: string, client: SupabaseClient | null = supabase): Promise<AgentResult> {
  if (!AGENT_CODE_RE.test(code)) return { status: "not_found" };
  if (!client) return { status: "unavailable" };
  try {
    const { data, error } = await withTimeout(client.rpc("get_agent", { p_code: code }), 8000);
    if (error) return { status: "unavailable" };
    if (!data) return { status: "not_found" };
    const agent = resolveAgent(data);
    return agent ? { status: "found", agent } : { status: "not_found" };
  } catch {
    return { status: "unavailable" };
  }
}

export const DEMO_AGENT: Agent = {
  code: DEMO_AGENT_CODE,
  name: "Travel Contoh",
  priceOpenTrip: 300,
  pricePremium: 700,
  contact: "",
  isDemo: true,
};

/** The partner's personal booking link (absolute, for sharing). */
export const agentBookingUrl = (origin: string, code: string) => `${origin}/booking?agen=${encodeURIComponent(code)}`;
