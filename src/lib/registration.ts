import type { Safety } from "@/data/content";

export type Experience = "none" | "some" | "regular";
export type Rider = { name: string; age: string; weight: string; experience: Experience | "" };
export type RiderErrors = Partial<Record<keyof Rider, true>>;

export const MAX_RIDERS = 30;
export const emptyRider = (): Rider => ({ name: "", age: "", weight: "", experience: "" });

const toInt = (s: string) => (/^\d{1,3}$/.test(s.trim()) ? Number(s.trim()) : NaN);

/** Which fields of a rider are missing or out of a sane range. */
export function riderErrors(r: Rider): RiderErrors {
  const e: RiderErrors = {};
  const age = toInt(r.age);
  const weight = toInt(r.weight);
  if (!r.name.trim()) e.name = true;
  if (!(age >= 1 && age <= 99)) e.age = true;
  if (!(weight >= 10 && weight <= 250)) e.weight = true;
  if (!r.experience) e.experience = true;
  return e;
}

/** Soft warnings against the owner's limits (the coach decides; the form never blocks on these). */
export function riderWarnings(r: Rider, safety: Pick<Safety, "minAge" | "maxWeight">) {
  const age = toInt(r.age);
  const weight = toInt(r.weight);
  return {
    young: safety.minAge !== null && age >= 1 && age < safety.minAge,
    heavy: safety.maxWeight !== null && weight > safety.maxWeight,
  };
}

export const ridersValid = (riders: Rider[]) => riders.length > 0 && riders.every((r) => Object.keys(riderErrors(r)).length === 0);
