import { z } from "zod";
import { SHEET_API_URL } from "@/lib/sheetApi";
import { AGENT_CODE_RE } from "@/lib/booking";

// Travel-partner page (/partner/KODE): agent prices, a personal booking link, promo material.

export const DEMO_AGENT_CODE = "DEMO";

const rawAgentSchema = z.object({
  kode: z.string(),
  namaTravel: z.string().default(""),
  hargaOpenTrip: z.number().nullable().catch(null),
  hargaPremium: z.number().nullable().catch(null),
  kontak: z.string().default(""),
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
  const code = r.data.kode.trim().toUpperCase();
  if (!AGENT_CODE_RE.test(code)) return null;
  return {
    code,
    name: r.data.namaTravel.trim() || code,
    priceOpenTrip: price(r.data.hargaOpenTrip),
    pricePremium: price(r.data.hargaPremium),
    contact: r.data.kontak.trim(),
  };
}

export async function fetchAgent(code: string, url = SHEET_API_URL): Promise<AgentResult> {
  if (!AGENT_CODE_RE.test(code)) return { status: "not_found" };
  if (!url) return { status: "unavailable" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${url}?action=agen&kode=${encodeURIComponent(code)}`, { signal: controller.signal });
    if (!res.ok) return { status: "unavailable" };
    const body = (await res.json()) as { found?: boolean; data?: unknown };
    if (!body?.found) return { status: "not_found" };
    const agent = resolveAgent(body.data);
    return agent ? { status: "found", agent } : { status: "not_found" };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timer);
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
