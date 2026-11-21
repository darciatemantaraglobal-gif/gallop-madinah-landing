import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase, withTimeout } from "@/lib/supabase";

// Everything the public site reads from / writes to the database, in one place.
// Database rows (snake_case) are mapped to the shapes the site already validates
// (see parseSiteData, resolveMember, resolveAgent), so a bad row is skipped, never shown.

type Row = Record<string, unknown>;

const bySort = (a: Row, b: Row) => Number(a.sort ?? 0) - Number(b.sort ?? 0);

/** Rows from the database → the raw shape parseSiteData() checks. */
export function mapSiteRows(rows: {
  packages: Row[];
  tiers: Row[];
  addons: Row[];
  faqs: Row[];
  rules: Row[];
  partners: Row[];
  testimonials: Row[];
  settings: Row | null;
}) {
  const s = rows.settings ?? {};
  return {
    prices: {
      packages: [...rows.packages].sort(bySort).map((p) => ({
        id: p.id,
        name: p.name,
        short: p.short_name,
        price: p.price,
        minPeople: p.min_people,
        features: p.features,
        featured: p.featured,
        tiered: p.tiered,
      })),
      groupTiers: [...rows.tiers]
        .sort((a, b) => Number(a.from_people) - Number(b.from_people))
        .map((t) => ({ from: t.from_people, to: t.to_people, price: t.price })),
      addons: [...rows.addons].sort(bySort).map((a) => ({ id: a.id, name: a.name, price: a.price })),
    },
    testimonials: rows.testimonials.map((t) => ({ name: t.name, origin: t.origin, rating: t.rating, text: t.body })),
    reviews: { mapsUrl: s.maps_url ?? "", writeReviewUrl: s.review_url ?? "" },
    faq: [...rows.faqs].sort(bySort).map((f) => ({
      q: { id: f.q_id, en: f.q_en, ms: f.q_ms, ar: f.q_ar },
      a: { id: f.a_id, en: f.a_en, ms: f.a_ms, ar: f.a_ar },
    })),
    partners: [...rows.partners].sort(bySort).map((p) => ({ name: p.name, logo: p.logo_url, size: p.size })),
    booking: { times: s.booking_times ?? [], maxDaysAhead: s.max_days_ahead ?? 90 },
    safety: {
      rules: [...rows.rules].sort(bySort).map((r) => ({ id: r.text_id, en: r.text_en, ms: r.text_ms, ar: r.text_ar })),
      minAge: s.min_age ?? null,
      maxWeight: s.max_weight ?? null,
    },
  };
}

/** Loads all public site content. Throws when the database can't be reached (caller falls back). */
export async function loadSiteRows(client: SupabaseClient) {
  const q = (table: string, columns = "*") =>
    client
      .from(table)
      .select(columns)
      .then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as unknown as Row[];
      });
  const [packages, tiers, addons, faqs, rules, partners, testimonials, settings] = await Promise.all([
    q("packages"),
    q("group_tiers"),
    q("addons"),
    q("faqs"),
    q("safety_rules"),
    q("partners"),
    // RLS already hides unpublished testimonials from visitors; the filter keeps admins' preview honest.
    client
      .from("testimonials")
      .select("name, origin, rating, body, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as unknown as Row[];
      }),
    q("site_settings"),
  ]);
  return mapSiteRows({ packages, tiers, addons, faqs, rules, partners, testimonials, settings: settings[0] ?? null });
}

// ---------- writes from visitors ----------

export type BookingRow = {
  code: string;
  package: string;
  ride_date: string;
  ride_time: string;
  people: number;
  addons: string[];
  total: number | null;
  name: string;
  phone: string;
  hotel: string;
  notes: string;
  agent_code: string;
  lang: string;
};

/** Saves a booking. Resolves true when stored, false when there's no database or it failed. */
export async function saveBooking(row: BookingRow, client = supabase): Promise<boolean> {
  if (!client) return false;
  try {
    const { error } = await withTimeout(client.from("bookings").insert(row), 8000);
    return !error;
  } catch {
    return false;
  }
}

export type RegistrationRow = {
  booking_code: string;
  name: string;
  age: number;
  weight: number;
  experience: "none" | "some" | "regular";
  agreed: true;
};

export async function saveRegistrations(rows: RegistrationRow[], client = supabase): Promise<boolean> {
  if (!client || rows.length === 0) return false;
  try {
    const { error } = await withTimeout(client.from("registrations").insert(rows), 8000);
    return !error;
  } catch {
    return false;
  }
}
