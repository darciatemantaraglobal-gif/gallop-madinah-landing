// Helpers shared by the booking and registration pages.

// No 0/O or 1/I/L, so a code read out over the phone is never ambiguous.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Short reference like "GM-7K2QX" that links a booking to its WhatsApp chat and registrations. */
export function makeBookingCode(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const bytes = random(5);
  return "GM-" + Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export const BOOKING_CODE_RE = /^GM-[A-Z0-9]{4,8}$/;
/** Travel-partner codes from /partner links, e.g. "TRAVELX". */
export const AGENT_CODE_RE = /^[A-Z0-9-]{2,20}$/;

/** yyyy-mm-dd in the visitor's local calendar (not UTC, which can shift the day). */
export function isoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Date formats per site language. Arabic is pinned to the Gregorian calendar
 * (ar-SA would otherwise show Hijri dates, which would not match the booking calendar).
 */
export const DATE_LOCALE: Record<"id" | "en" | "ms" | "ar", string> = {
  id: "id-ID",
  en: "en-GB",
  ms: "ms-MY",
  ar: "ar-SA-u-ca-gregory",
};

/** "Jumat, 20 Desember 2026" / "Friday, 20 December 2026" / "الجمعة، 20 ديسمبر 2026" */
export function longDate(d: Date, lang: keyof typeof DATE_LOCALE) {
  return d.toLocaleDateString(DATE_LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Very loose phone check: optional, but when given it must look like a phone number. */
export function isPhoneLike(s: string) {
  const digits = s.replace(/[\s()+-]/g, "");
  return /^\d{8,15}$/.test(digits);
}

/** Read and clean ?paket=&orang=&addon=&agen= from the booking link. */
export function readBookingParams(search: string, packageIds: string[], addonIds: string[]) {
  const p = new URLSearchParams(search);
  const paket = p.get("paket") ?? "";
  const orang = Number(p.get("orang"));
  const agen = (p.get("agen") ?? "").trim().toUpperCase();
  return {
    packageId: packageIds.includes(paket) ? paket : null,
    people: Number.isInteger(orang) && orang >= 1 && orang <= 200 ? orang : null,
    addonIds: (p.get("addon") ?? "")
      .split(",")
      .map((a) => a.trim())
      .filter((a) => addonIds.includes(a)),
    agentCode: AGENT_CODE_RE.test(agen) ? agen : "",
  };
}
