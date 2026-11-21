import { z } from "zod";
import { imageUrl } from "@/lib/drive";
import {
  FALLBACK_BOOKING,
  FALLBACK_FAQ,
  FALLBACK_PARTNERS,
  FALLBACK_SAFETY,
  type Bilingual,
  type BookingSettings,
  type FaqItem,
  type Partner,
  type Safety,
} from "@/data/content";

// Shape of the data the site reads from the database (see src/lib/backend.ts).
// FALLBACK_DATA below is what the site shows when the database is not configured or unreachable,
// so it must always match what is live today.

export const packageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  short: z.string().min(1),
  /** Price per person in SAR (for Premium this is the 1-person price; group tiers override it). */
  price: z.number().positive(),
  /** Smallest group the price applies to (Open Trip: 20). */
  minPeople: z.number().int().min(1),
  /** Keys of the comparison-table rows this package includes (price.f.<key>). */
  features: z.array(z.string()),
  featured: z.boolean(),
  /** True when the per-person price depends on group size (uses `groupTiers`). */
  tiered: z.boolean(),
});

export const groupTierSchema = z.object({
  from: z.number().int().min(1),
  /** null = no upper limit */
  to: z.number().int().min(1).nullable(),
  /** null = price on request ("hubungi kami") */
  price: z.number().positive().nullable(),
});

export const addonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
});

export const pricesSchema = z.object({
  packages: z.array(packageSchema).min(1),
  groupTiers: z.array(groupTierSchema).min(1),
  addons: z.array(addonSchema),
});

export type Package = z.infer<typeof packageSchema>;
export type GroupTier = z.infer<typeof groupTierSchema>;
export type Addon = z.infer<typeof addonSchema>;
export type Prices = z.infer<typeof pricesSchema>;

export const FALLBACK_PRICES: Prices = {
  packages: [
    {
      id: "open_trip",
      name: "Open Trip",
      short: "Open Trip",
      price: 350,
      minPeople: 20,
      features: ["horse", "coach", "rest"],
      featured: false,
      tiered: false,
    },
    {
      id: "premium",
      name: "Premium Experience",
      short: "Premium",
      price: 1250,
      minPeople: 1,
      features: ["horse", "helmet", "boots", "coach", "rest", "transport", "videographer"],
      featured: true,
      tiered: true,
    },
  ],
  groupTiers: [
    { from: 1, to: 1, price: 1250 },
    { from: 2, to: 4, price: 850 },
    { from: 5, to: 10, price: 750 },
    { from: 11, to: null, price: null },
  ],
  addons: [
    { id: "gmc", name: "GMC", price: 800 },
    { id: "drone", name: "Video drone", price: 600 },
  ],
};

export const testimonialSchema = z.object({
  name: z.string().trim().min(1),
  /** e.g. "Jakarta" or "Rombongan Travel X"; may be empty */
  origin: z.string().trim().default(""),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(1),
});

/** Only plain https links are accepted, so nothing like "javascript:" can end up in an href. */
const httpsUrl = z
  .string()
  .trim()
  .refine((s) => s === "" || /^https:\/\/[^\s]+$/i.test(s), "must be an https link");

export const reviewLinksSchema = z.object({
  /** Gallop on Google Maps (read reviews) */
  mapsUrl: httpsUrl,
  /** Google "write a review" link */
  writeReviewUrl: httpsUrl,
});

export type Testimonial = z.infer<typeof testimonialSchema>;
export type ReviewLinks = z.infer<typeof reviewLinksSchema>;

const bilingualSchema = z.object({
  id: z.string().trim().min(1),
  /** Other languages may be left empty; see `pick` for the fallback order. */
  en: z.string().trim().default(""),
  ms: z.string().trim().default(""),
  ar: z.string().trim().default(""),
});

const faqItemSchema = z.object({ q: bilingualSchema, a: bilingualSchema });

const partnerSchema = z.object({
  name: z.string().trim().min(1),
  logo: z.string().trim().min(1),
  size: z.enum(["normal", "large", "tall"]).catch("normal"),
});

const bookingSchema = z.object({
  /** e.g. ["07:00", "16:30"] */
  times: z.array(z.string().trim().min(1)).max(12),
  maxDaysAhead: z.number().int().min(1).max(365),
});

// Rules and limits are checked separately: an empty rules table must not drop the owner's limits.
const minAgeSchema = z.number().int().min(1).max(99).nullable();
const maxWeightSchema = z.number().int().min(20).max(300).nullable();

export type SiteData = {
  prices: Prices;
  testimonials: Testimonial[];
  reviews: ReviewLinks;
  faq: FaqItem[];
  partners: Partner[];
  booking: BookingSettings;
  safety: Safety;
};

// No testimonials are built in: the section stays hidden until real ones are added in /admin.
export const FALLBACK_DATA: SiteData = {
  prices: FALLBACK_PRICES,
  testimonials: [],
  reviews: { mapsUrl: "", writeReviewUrl: "" },
  faq: FALLBACK_FAQ,
  partners: FALLBACK_PARTNERS,
  booking: FALLBACK_BOOKING,
  safety: FALLBACK_SAFETY,
};

/** Valid rows of a list; bad rows are skipped. A missing or empty list keeps the fallback. */
function rowsOf<T>(raw: unknown, schema: z.ZodTypeAny, fallback: T[]): T[] {
  if (!Array.isArray(raw)) return fallback;
  const rows = raw.flatMap((row) => {
    const r = schema.safeParse(row);
    return r.success ? [r.data as T] : [];
  });
  return rows.length ? rows : fallback;
}

/**
 * Turns whatever the database returned into SiteData, section by section:
 * a broken section falls back on its own, and a broken row in a list is simply skipped.
 */
export function parseSiteData(raw: unknown): SiteData {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const prices = pricesSchema.safeParse(obj.prices);
  // Each review link on its own: a bad "write a review" link must not hide a good Maps link.
  const rawReviews = (obj.reviews && typeof obj.reviews === "object" ? obj.reviews : {}) as Record<string, unknown>;
  const link = (v: unknown) => {
    const r = httpsUrl.safeParse(v);
    return r.success ? r.data : "";
  };
  const reviews = { mapsUrl: link(rawReviews.mapsUrl), writeReviewUrl: link(rawReviews.writeReviewUrl) };
  // Testimonials have no built-in copy: an empty list means "none yet".
  const testimonials = Array.isArray(obj.testimonials) ? rowsOf<Testimonial>(obj.testimonials, testimonialSchema, []) : [];

  // Partner logos must be https or a path on this site (Drive share links are converted to image links).
  const partners = rowsOf<Partner>(obj.partners, partnerSchema, [])
    .map((p) => ({ ...p, logo: imageUrl(p.logo, 600) }))
    .filter((p) => p.logo);

  const booking = bookingSchema.safeParse(obj.booking);
  const rawSafety = (obj.safety && typeof obj.safety === "object" ? obj.safety : {}) as Record<string, unknown>;
  const minAge = minAgeSchema.safeParse(rawSafety.minAge);
  const maxWeight = maxWeightSchema.safeParse(rawSafety.maxWeight);
  const safety: Safety = {
    rules: rowsOf<Bilingual>(rawSafety.rules, bilingualSchema, FALLBACK_SAFETY.rules),
    minAge: minAge.success ? minAge.data : FALLBACK_SAFETY.minAge,
    maxWeight: maxWeight.success ? maxWeight.data : FALLBACK_SAFETY.maxWeight,
  };

  return {
    prices: prices.success ? prices.data : FALLBACK_DATA.prices,
    testimonials,
    reviews,
    faq: rowsOf<FaqItem>(obj.faq, faqItemSchema, FALLBACK_FAQ),
    partners: partners.length ? partners : FALLBACK_PARTNERS,
    booking: booking.success ? (booking.data as BookingSettings) : FALLBACK_BOOKING,
    safety,
  };
}

/** Text in the visitor's language, falling back to Indonesian when the English cell is empty. */
/**
 * Text in the visitor's language. Missing translations fall back sensibly:
 * Malay → Indonesian (closest), Arabic → English → Indonesian, English → Indonesian.
 */
export const pick = (text: Bilingual, lang: "id" | "en" | "ms" | "ar") => {
  if (lang === "ms") return text.ms || text.id;
  if (lang === "ar") return text.ar || text.en || text.id;
  if (lang === "en") return text.en || text.id;
  return text.id;
};
