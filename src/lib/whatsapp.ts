import { track } from "@/lib/analytics";

// The one place that knows Gallop's WhatsApp number and how chat links are built.
export const WA_NUMBER = "628118880818";

/** Where on the site a WhatsApp button lives; sent with every click for tracking. */
export type WaSource =
  | "navbar"
  | "navbar_mobile"
  | "hero"
  | "pricelist"
  | "group_rate"
  | "arabian_camp"
  | "how_to_book"
  | "calculator"
  | "faq"
  | "final_cta"
  | "floating"
  | "sticky_bar";

export const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/** Call from a WhatsApp link's onClick so the click is counted (feature 10). */
export const trackWhatsApp = (source: WaSource, detail: Record<string, string | number> = {}) =>
  track("wa_click", { source, ...detail });
