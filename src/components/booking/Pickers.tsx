import { Check, Info, Minus, Plus, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Prices } from "@/data/siteData";
import { formatSar, nextCheaperTier, quote, type Quote } from "@/lib/pricing";

// Inputs shared by the price calculator and the booking form.

export const MAX_PEOPLE = 200;
export const clampPeople = (n: number) => Math.min(MAX_PEOPLE, Math.max(1, Math.round(n) || 1));

const label = "block text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-2.5";

export function useAddonLabel() {
  const { t } = useLanguage();
  return (id: string, fallback: string) => {
    const key = `price.a.${id}`;
    return t(key) === key ? fallback : t(key);
  };
}

export const PackagePicker = ({
  prices,
  value,
  onChange,
}: {
  prices: Prices;
  value: string;
  onChange: (id: string) => void;
}) => {
  const { t } = useLanguage();
  const cheapestTier = Math.min(...prices.groupTiers.flatMap((g) => (g.price ? [g.price] : [])));
  return (
    <fieldset>
      <legend className={label}>{t("calc.package")}</legend>
      <div className="grid grid-cols-2 gap-2">
        {prices.packages.map((p) => {
          const on = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              aria-pressed={on}
              className={`text-start border px-3.5 py-3 transition-colors ${on ? "border-gold bg-forest/40" : "border-border hover:border-gold/40"}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-body font-bold text-sm text-foreground">{p.short}</span>
                {on && <Check className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={3} />}
              </span>
              <span className="block text-muted-foreground font-body text-xs mt-0.5">
                {p.tiered ? `${t("calc.from")} ${formatSar(cheapestTier)}` : formatSar(p.price)} SAR
                {p.minPeople > 1 ? ` · ${t("price.min").replace("{n}", String(p.minPeople))}` : ""}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export const PeopleStepper = ({
  prices,
  packageId,
  value,
  onChange,
  inputId,
}: {
  prices: Prices;
  packageId: string;
  value: number;
  onChange: (n: number) => void;
  inputId: string;
}) => {
  const { t } = useLanguage();
  const nudge = nextCheaperTier(prices, packageId, value);
  return (
    <div>
      <label htmlFor={inputId} className={label}>
        {t("calc.people")}
      </label>
      <div className="flex items-stretch w-full max-w-[260px] border border-border">
        <button
          type="button"
          onClick={() => onChange(clampPeople(value - 1))}
          disabled={value <= 1}
          aria-label={t("calc.less")}
          className="w-14 flex items-center justify-center text-gold hover:bg-gold/10 disabled:text-muted-foreground/40 disabled:hover:bg-transparent"
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_PEOPLE}
          value={value}
          onChange={(e) => onChange(clampPeople(Number(e.target.value)))}
          className="flex-1 min-w-0 bg-transparent border-x border-border text-center font-body font-bold text-2xl py-2.5 outline-none focus:bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(clampPeople(value + 1))}
          disabled={value >= MAX_PEOPLE}
          aria-label={t("calc.more")}
          className="w-14 flex items-center justify-center text-gold hover:bg-gold/10 disabled:text-muted-foreground/40"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {nudge && (
        <p className="flex items-center gap-1.5 text-gold font-body text-xs mt-2.5">
          <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
          {t("calc.nudge").replace("{n}", String(nudge.addPeople)).replace("{price}", formatSar(nudge.price))}
        </p>
      )}
    </div>
  );
};

export const AddonPicker = ({
  prices,
  value,
  onToggle,
}: {
  prices: Prices;
  value: string[];
  onToggle: (id: string) => void;
}) => {
  const { t } = useLanguage();
  const addonLabel = useAddonLabel();
  if (!prices.addons.length) return null;
  return (
    <fieldset>
      <legend className={label}>{t("calc.addons")}</legend>
      <div className="space-y-2">
        {prices.addons.map((a) => {
          const on = value.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              aria-pressed={on}
              className={`w-full flex items-center gap-3 border px-3.5 py-3 text-start transition-colors ${on ? "border-gold bg-forest/40" : "border-border hover:border-gold/40"}`}
            >
              <span className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${on ? "bg-gold border-gold" : "border-muted-foreground/50"}`}>
                {on && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
              </span>
              <span className="flex-1 font-body text-sm text-foreground">{addonLabel(a.id, a.name)}</span>
              <span className="font-body text-sm text-muted-foreground whitespace-nowrap">+{formatSar(a.price)} SAR</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

/**
 * Price breakdown for the chosen package / group / add-ons, with the "below minimum" and
 * "price on request" cases. The call-to-action button is left to the parent.
 */
export const QuoteSummary = ({
  prices,
  q,
  packageId,
  people,
  addonIds,
  onSwitchPackage,
}: {
  prices: Prices;
  q: Quote;
  packageId: string;
  people: number;
  addonIds: string[];
  onSwitchPackage: (id: string) => void;
}) => {
  const { t } = useLanguage();
  const addonLabel = useAddonLabel();
  const pkg = prices.packages.find((p) => p.id === packageId) ?? prices.packages[0];
  // When Open Trip is below its minimum, show what the same group would pay on the tiered package.
  const tieredPkg = prices.packages.find((p) => p.tiered);
  const altQuote = q.status === "below_min" && tieredPkg ? quote(prices, { packageId: tieredPkg.id, people, addonIds }) : null;

  if (q.status === "ok")
    return (
      <>
        <dl className="space-y-2.5 font-body text-sm mb-5">
          <div className="flex justify-between gap-3">
            <dt className="text-foreground/80">
              {pkg.short} · {people} × {formatSar(q.perPerson)}
            </dt>
            <dd className="text-foreground whitespace-nowrap">{formatSar(q.subtotal)} SAR</dd>
          </div>
          {q.addons.map((a) => (
            <div key={a.id} className="flex justify-between gap-3">
              <dt className="text-foreground/80">{addonLabel(a.id, a.name)}</dt>
              <dd className="text-foreground whitespace-nowrap">{formatSar(a.price)} SAR</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-border pt-4 mb-1">
          <p className="text-muted-foreground font-body text-xs mb-1">{t("calc.total")}</p>
          <p className="font-body font-bold text-3xl md:text-4xl text-gold leading-none">
            {formatSar(q.total)} <span className="text-base text-muted-foreground font-normal">SAR</span>
          </p>
          {people > 1 && (
            <p className="text-muted-foreground font-body text-xs mt-2">
              ≈ {formatSar(Math.round(q.total / people))} SAR {t("price.perperson")}
            </p>
          )}
        </div>
      </>
    );

  if (q.status === "below_min")
    return (
      <div className="space-y-3 mb-2">
        <p className="flex gap-2 font-body text-sm text-foreground">
          <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          {t("calc.belowmin").replace("{pkg}", pkg.short).replace("{n}", String(q.minPeople))}
        </p>
        {tieredPkg && altQuote?.status === "ok" && (
          <button
            type="button"
            onClick={() => onSwitchPackage(tieredPkg.id)}
            className="w-full border border-gold/50 text-gold px-4 py-3 font-body text-xs tracking-[0.12em] uppercase hover:bg-gold/10"
          >
            {t("calc.switch").replace("{pkg}", tieredPkg.short).replace("{total}", formatSar(altQuote.total))}
          </button>
        )}
      </div>
    );

  if (q.status === "on_request")
    return (
      <p className="flex gap-2 font-body text-sm text-foreground mb-2">
        <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
        {t("calc.onrequest").replace("{n}", String(q.fromPeople))}
      </p>
    );

  return null;
};

/** Link to the booking form with the current choices filled in. */
export const bookingHref = (packageId: string, people: number, addonIds: string[], agentCode = "") => {
  const p = new URLSearchParams({ paket: packageId, orang: String(people) });
  if (addonIds.length) p.set("addon", addonIds.join(","));
  if (agentCode) p.set("agen", agentCode);
  return `/booking?${p.toString()}`;
};
