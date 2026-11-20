import { afterEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_DATA, FALLBACK_PRICES, parseSiteData, pick } from "@/data/siteData";
import { fetchSiteData } from "@/lib/siteData";

const respond = (body: unknown, ok = true) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok, json: async () => body } as Response);

const review = (over: Record<string, unknown> = {}) => ({
  name: "Aisyah",
  origin: "Jakarta",
  rating: 5,
  text: "Coachnya sabar sekali.",
  ...over,
});

afterEach(() => vi.restoreAllMocks());

describe("fetchSiteData", () => {
  it("uses the fallback when no Sheet URL is configured", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    expect(await fetchSiteData("")).toEqual(FALLBACK_DATA);
    expect(spy).not.toHaveBeenCalled();
  });

  it("uses Sheet prices when they are valid", async () => {
    const prices = { ...FALLBACK_PRICES, addons: [{ id: "gmc", name: "GMC", price: 900 }] };
    respond({ prices });
    expect((await fetchSiteData("https://example.test")).prices.addons).toEqual(prices.addons);
  });

  it("falls back on HTTP errors and network failures", async () => {
    respond({}, false);
    expect(await fetchSiteData("https://example.test")).toEqual(FALLBACK_DATA);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await fetchSiteData("https://example.test")).toEqual(FALLBACK_DATA);
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

  it("takes FAQ rows from the Sheet, skipping rows without a question", () => {
    const data = parseSiteData({
      faq: [
        { q: { id: "Boleh bawa kamera?", en: "" }, a: { id: "Boleh.", en: "" } },
        { q: { id: "", en: "" }, a: { id: "tanpa pertanyaan", en: "" } },
      ],
    });
    expect(data.faq).toHaveLength(1);
    expect(data.faq[0].q.id).toBe("Boleh bawa kamera?");
  });

  it("keeps the built-in FAQ when the Sheet tab is empty", () => {
    expect(parseSiteData({ faq: [] }).faq).toEqual(FALLBACK_DATA.faq);
  });

  it("converts Drive partner logos and drops non-https ones", () => {
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

  it("accepts booking slots and safety limits from the Sheet", () => {
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
    expect(pick(text, "ms")).toBe("Halo"); // Malay falls back to Indonesian
    expect(pick(text, "ar")).toBe("Hello"); // Arabic falls back to English
    expect(pick({ ...text, ar: "مرحبا" }, "ar")).toBe("مرحبا");
  });

  it("returns the fallback for junk", () => {
    expect(parseSiteData(null)).toEqual(FALLBACK_DATA);
    expect(parseSiteData("oops")).toEqual(FALLBACK_DATA);
  });
});
