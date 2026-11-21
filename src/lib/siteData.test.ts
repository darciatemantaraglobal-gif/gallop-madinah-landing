import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FALLBACK_DATA, FALLBACK_PRICES, parseSiteData, pick } from "@/data/siteData";
import { fetchSiteData } from "@/lib/siteData";
import { mapSiteRows } from "@/lib/backend";

const review = (over: Record<string, unknown> = {}) => ({
  name: "Aisyah",
  origin: "Jakarta",
  rating: 5,
  text: "Coachnya sabar sekali.",
  ...over,
});

/** A minimal stand-in for the Supabase client: every table returns the given rows. */
const fakeClient = (tables: Record<string, unknown[]>, fail = false) => {
  const result = (table: string) => Promise.resolve(fail ? { data: null, error: { message: "down" } } : { data: tables[table] ?? [], error: null });
  const builder = (table: string) => {
    const b = {
      select: () => b,
      eq: () => b,
      order: () => b,
      then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => result(table).then(ok, bad),
    };
    return b;
  };
  return { from: builder } as unknown as SupabaseClient;
};

const dbRows = {
  packages: [
    { id: "premium", name: "Premium Experience", short_name: "Premium", price: 1250, min_people: 1, features: ["horse"], featured: true, tiered: true, sort: 2 },
    { id: "open_trip", name: "Open Trip", short_name: "Open Trip", price: 350, min_people: 20, features: ["horse"], featured: false, tiered: false, sort: 1 },
  ],
  group_tiers: [
    { from_people: 2, to_people: 4, price: 850 },
    { from_people: 1, to_people: 1, price: 1250 },
  ],
  addons: [{ id: "gmc", name: "GMC", price: 900, sort: 1 }],
  faqs: [{ sort: 1, q_id: "Boleh bawa kamera?", a_id: "Boleh.", q_en: "", a_en: "", q_ms: "", a_ms: "", q_ar: "", a_ar: "" }],
  safety_rules: [{ sort: 1, text_id: "Ikuti coach", text_en: "", text_ms: "", text_ar: "" }],
  partners: [{ sort: 1, name: "Lintas", logo_url: "/partners/lintas-haramain.png", size: "normal" }],
  testimonials: [{ name: "Aisyah", origin: "Jakarta", rating: 5, body: "Mantap" }],
  site_settings: [{ booking_times: ["07:00"], max_days_ahead: 60, min_age: 6, max_weight: 110, maps_url: "https://maps.app.goo.gl/x", review_url: "" }],
};

describe("fetchSiteData", () => {
  it("uses the fallback when no database is configured", async () => {
    expect(await fetchSiteData(null)).toEqual(FALLBACK_DATA);
  });

  it("maps database rows into site data, in display order", async () => {
    const data = await fetchSiteData(fakeClient(dbRows));
    expect(data.prices.packages.map((p) => p.id)).toEqual(["open_trip", "premium"]);
    expect(data.prices.groupTiers.map((t) => t.from)).toEqual([1, 2]);
    expect(data.prices.addons).toEqual([{ id: "gmc", name: "GMC", price: 900 }]);
    expect(data.faq[0].q.id).toBe("Boleh bawa kamera?");
    expect(data.partners).toEqual([{ name: "Lintas", logo: "/partners/lintas-haramain.png", size: "normal" }]);
    expect(data.testimonials).toEqual([{ name: "Aisyah", origin: "Jakarta", rating: 5, text: "Mantap" }]);
    expect(data.booking).toEqual({ times: ["07:00"], maxDaysAhead: 60 });
    expect(data.safety.minAge).toBe(6);
    expect(data.reviews.mapsUrl).toBe("https://maps.app.goo.gl/x");
  });

  it("falls back when the database errors", async () => {
    expect(await fetchSiteData(fakeClient(dbRows, true))).toEqual(FALLBACK_DATA);
  });

  it("keeps built-in content for empty tables, without losing the owner's limits", async () => {
    const data = await fetchSiteData(fakeClient({ ...dbRows, faqs: [], partners: [], safety_rules: [] }));
    expect(data.faq).toEqual(FALLBACK_DATA.faq);
    expect(data.partners).toEqual(FALLBACK_DATA.partners);
    expect(data.safety.rules).toEqual(FALLBACK_DATA.safety.rules);
    expect(data.safety.minAge).toBe(6);
    expect(data.safety.maxWeight).toBe(110);
  });
});

describe("mapSiteRows", () => {
  it("handles a missing settings row", () => {
    const raw = mapSiteRows({ packages: [], tiers: [], addons: [], faqs: [], rules: [], partners: [], testimonials: [], settings: null });
    expect(raw.booking).toEqual({ times: [], maxDaysAhead: 90 });
    expect(raw.safety.minAge).toBeNull();
  });
});

describe("parseSiteData: each section stands alone", () => {
  it("keeps fallback prices when a price is typed as text, but still uses valid testimonials", () => {
    const data = parseSiteData({
      prices: { ...FALLBACK_PRICES, addons: [{ id: "gmc", name: "GMC", price: "delapan ratus" }] },
      testimonials: [review()],
    });
    expect(data.prices).toEqual(FALLBACK_PRICES);
    expect(data.testimonials).toHaveLength(1);
  });

  it("skips only the broken testimonial rows", () => {
    const data = parseSiteData({
      testimonials: [review(), review({ rating: 9 }), review({ text: "" }), review({ name: "Budi" })],
    });
    expect(data.testimonials.map((t) => t.name)).toEqual(["Aisyah", "Budi"]);
  });

  it("only accepts https review links", () => {
    expect(parseSiteData({ reviews: { mapsUrl: "javascript:alert(1)", writeReviewUrl: "" } }).reviews).toEqual(
      FALLBACK_DATA.reviews,
    );
    const ok = { mapsUrl: "https://maps.app.goo.gl/abc", writeReviewUrl: "https://g.page/r/xyz/review" };
    expect(parseSiteData({ reviews: ok }).reviews).toEqual(ok);
  });

  it("keeps a good review link when the other one is bad", () => {
    const data = parseSiteData({ reviews: { mapsUrl: "https://maps.app.goo.gl/abc", writeReviewUrl: "javascript:alert(1)" } });
    expect(data.reviews).toEqual({ mapsUrl: "https://maps.app.goo.gl/abc", writeReviewUrl: "" });
  });

  it("converts Drive partner logos and drops unsafe ones", () => {
    const data = parseSiteData({
      partners: [
        { name: "A", logo: "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view", size: "large" },
        { name: "B", logo: "http://insecure.example/logo.png", size: "normal" },
        { name: "C", logo: "https://cdn.example/c.png", size: "aneh" },
      ],
    });
    expect(data.partners).toEqual([
      { name: "A", logo: "https://drive.google.com/thumbnail?id=1AbCdEfGhIjKlMnOpQrStUvWxYz012345&sz=w600", size: "large" },
      { name: "C", logo: "https://cdn.example/c.png", size: "normal" },
    ]);
  });

  it("accepts booking slots and safety limits", () => {
    const data = parseSiteData({
      booking: { times: ["07:00", "16:30"], maxDaysAhead: 60 },
      safety: { rules: [{ id: "Ikuti coach", en: "" }], minAge: 6, maxWeight: 110 },
    });
    expect(data.booking).toEqual({ times: ["07:00", "16:30"], maxDaysAhead: 60 });
    expect(data.safety).toEqual({ rules: [{ id: "Ikuti coach", en: "", ms: "", ar: "" }], minAge: 6, maxWeight: 110 });
  });

  it("picks the visitor's language with sensible fallbacks", () => {
    const text = { id: "Halo", en: "Hello", ms: "", ar: "" };
    expect(pick(text, "en")).toBe("Hello");
    expect(pick(text, "ms")).toBe("Halo");
    expect(pick(text, "ar")).toBe("Hello");
    expect(pick({ ...text, ar: "مرحبا" }, "ar")).toBe("مرحبا");
  });

  it("returns the fallback for junk", () => {
    expect(parseSiteData(null)).toEqual(FALLBACK_DATA);
    expect(parseSiteData("oops")).toEqual(FALLBACK_DATA);
  });
});
