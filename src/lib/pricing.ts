import type { GroupTier, Prices } from "@/data/siteData";

// All price maths lives here so the price table, the calculator and (later) the booking
// form always agree.

export type QuoteInput = {
  packageId: string;
  people: number;
  addonIds: string[];
};

export type Quote =
  | {
      status: "ok";
      perPerson: number;
      people: number;
      subtotal: number;
      addons: { id: string; name: string; price: number }[];
      total: number;
    }
  /** Fewer people than the package allows (Open Trip needs 20). */
  | { status: "below_min"; minPeople: number }
  /** Group too big for a listed price: ask on WhatsApp. */
  | { status: "on_request"; fromPeople: number }
  | { status: "invalid" };

export const findTier = (tiers: GroupTier[], people: number) =>
  tiers.find((t) => people >= t.from && (t.to === null || people <= t.to));

export function quote(prices: Prices, { packageId, people, addonIds }: QuoteInput): Quote {
  const pkg = prices.packages.find((p) => p.id === packageId);
  if (!pkg || !Number.isInteger(people) || people < 1) return { status: "invalid" };
  if (people < pkg.minPeople) return { status: "below_min", minPeople: pkg.minPeople };

  let perPerson = pkg.price;
  if (pkg.tiered) {
    const tier = findTier(prices.groupTiers, people);
    if (!tier) return { status: "invalid" };
    if (tier.price === null) return { status: "on_request", fromPeople: tier.from };
    perPerson = tier.price;
  }

  const addons = prices.addons
    .filter((a) => addonIds.includes(a.id))
    .map((a) => ({ id: a.id, name: a.name, price: a.price }));
  const subtotal = perPerson * people;
  const total = subtotal + addons.reduce((sum, a) => sum + a.price, 0);
  return { status: "ok", perPerson, people, subtotal, addons, total };
}

/**
 * For tiered packages: the closest bigger group that gets a cheaper per-person price,
 * e.g. "add 1 more person and it's 750 SAR each". Null when there is none or it's far away.
 */
export function nextCheaperTier(prices: Prices, packageId: string, people: number, maxGap = 3) {
  const pkg = prices.packages.find((p) => p.id === packageId);
  if (!pkg?.tiered) return null;
  const current = findTier(prices.groupTiers, people);
  if (!current || current.price === null) return null;
  const next = prices.groupTiers
    .filter((t) => t.from > people && t.price !== null && t.price < current.price!)
    .sort((a, b) => a.from - b.from)[0];
  if (!next || next.from - people > maxGap) return null;
  return { addPeople: next.from - people, price: next.price as number };
}

/** "1 orang", "2–4 orang", "11+ orang" (or English) for a group-size range. */
export function peopleLabel(t: (key: string) => string, from: number, to: number | null) {
  if (to === null) return t("price.people.plus").replace("{n}", String(from));
  if (from === to) return from === 1 ? t("price.people.one") : t("price.people.n").replace("{n}", String(from));
  return t("price.people.range").replace("{a}", String(from)).replace("{b}", String(to));
}

/** 1250 → "1.250" (Indonesian thousands separator, as used on the price list). */
export const formatSar = (n: number) => n.toLocaleString("id-ID");
