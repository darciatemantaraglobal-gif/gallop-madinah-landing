import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, MessageCircle, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import { quote } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { waLink, trackWhatsApp } from "@/lib/whatsapp";
import { AddonPicker, PackagePicker, PeopleStepper, QuoteSummary, bookingHref } from "@/components/booking/Pickers";

// Group price calculator: pick a package, the group size and add-ons, see the total,
// then continue to the booking form with everything filled in.
const CalculatorSection = () => {
  const { t } = useLanguage();
  const { prices } = useSiteData();

  const defaultPkg = prices.packages.find((p) => p.featured)?.id ?? prices.packages[0].id;
  const [packageId, setPackageId] = useState(defaultPkg);
  const [people, setPeople] = useState(2);
  const [addonIds, setAddonIds] = useState<string[]>([]);

  // Count the calculator as "used" once per visit, on the first change.
  const usedRef = useRef(false);
  const markUsed = () => {
    if (usedRef.current) return;
    usedRef.current = true;
    track("calculator_used");
  };

  const pkg = prices.packages.find((p) => p.id === packageId) ?? prices.packages[0];
  const q = useMemo(() => quote(prices, { packageId: pkg.id, people, addonIds }), [prices, pkg.id, people, addonIds]);

  const askText = t("calc.wa.ask").replace("{pkg}", pkg.name).replace("{people}", t("price.people.n").replace("{n}", String(people)));

  return (
    <section id="kalkulator" className="py-16 md:py-24 bg-background border-t border-border scroll-mt-16">
      <div className="container mx-auto px-5 md:px-8 max-w-5xl">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("calc.subtitle")}</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground">
            {t("calc.title1")} <span className="text-gold">{t("calc.title2")}</span>
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base mt-3 max-w-xl mx-auto">{t("calc.desc")}</p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] border border-border bg-card">
          <div className="p-5 md:p-8 space-y-7">
            <PackagePicker prices={prices} value={pkg.id} onChange={(id) => { markUsed(); setPackageId(id); }} />
            <PeopleStepper
              prices={prices}
              packageId={pkg.id}
              value={people}
              onChange={(n) => { markUsed(); setPeople(n); }}
              inputId="calc-people"
            />
            <AddonPicker
              prices={prices}
              value={addonIds}
              onToggle={(id) => {
                markUsed();
                setAddonIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
              }}
            />
          </div>

          <div className="border-t md:border-t-0 md:border-s border-border bg-background/60 p-5 md:p-8 flex flex-col" aria-live="polite">
            <p className="flex items-center gap-2 text-muted-foreground font-body text-[11px] tracking-[0.2em] uppercase mb-4">
              <Calculator className="w-4 h-4 text-gold" strokeWidth={1.5} /> {t("calc.result")}
            </p>
            <QuoteSummary prices={prices} q={q} packageId={pkg.id} people={people} addonIds={addonIds} onSwitchPackage={setPackageId} />

            <div className="mt-auto pt-5">
              {q.status === "ok" && (
                <Link
                  to={bookingHref(pkg.id, people, addonIds)}
                  onClick={() => track("calculator_to_booking", { paket: pkg.id, orang: people, total: q.total })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-5 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {t("calc.book")}
                </Link>
              )}
              {q.status === "on_request" && (
                <a
                  href={waLink(askText)}
                  onClick={() => trackWhatsApp("calculator", { paket: pkg.id, orang: people })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground px-5 py-3.5 font-body font-bold text-xs tracking-[0.15em] uppercase hover:bg-gold-highlight transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("calc.ask")}
                </a>
              )}
              <p className="text-muted-foreground font-note font-light text-xs mt-2.5 text-center">{t("calc.note")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
