import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteData } from "@/lib/siteData";
import type { PartnerSize } from "@/data/content";

// Every logo sits in the same box and is scaled to fit it; logos whose shape
// would otherwise look smaller than the rest get a slightly larger box.
const BOX: Record<PartnerSize, string> = {
  normal: "w-[120px] h-[40px] md:w-[150px] md:h-[48px]",
  large: "w-[140px] h-[46px] md:w-[170px] md:h-[54px]",
  tall: "w-[120px] h-[52px] md:w-[150px] md:h-[62px]",
};

// Logos come from the Sheet ("Partner" tab) or the built-in set.
const PartnersSection = () => {
  const { t } = useLanguage();
  const { partners } = useSiteData();

  return (
    <section className="py-12 md:py-16 bg-card border-t border-border">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <p className="text-center text-muted-foreground font-body text-xs md:text-sm tracking-[0.2em] uppercase mb-8 md:mb-10">
          {t("partners.title")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          {partners.map((partner) => (
            <div key={partner.name} className={`flex items-center justify-center ${BOX[partner.size]}`}>
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full w-auto h-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
