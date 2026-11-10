import { Phone, Tent, User, Car, Camera, Coffee, MessageCircle, Check, X } from "lucide-react";
import arabianCampImg from "@/assets/arabian-camp-cover.jpg";
import HorseIcon from "@/components/icons/HorseIcon";
import { useLanguage } from "@/contexts/LanguageContext";

// Rows of the comparison table, in the order of the hand-drawn price list.
// Label = price.f.<key>, small explanation = price.f.<key>.desc
const ITEMS = ["horse", "helmet", "boots", "coach", "transport", "videographer", "drone"];
// Item column flexes; package columns are fixed so ✓/✗ line up (narrow on phones).
const GRID_COLS =
  "grid-cols-[minmax(0,1fr)_58px_58px_66px] sm:grid-cols-[minmax(0,1fr)_96px_96px_104px] md:grid-cols-[minmax(0,1fr)_170px_170px_190px]";
const FEATURED_CELL = "bg-forest/45";

const PricelistSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useLanguage();

  const getWhatsAppLink = (packageName: string) =>
    `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.template").replace("{pkg}", packageName))}`;

  const WHATSAPP_CAMP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.camp.template"))}`;

  // `features` lists which ITEMS each package includes (✓); the rest show ✗.
  const packages = [
    { letter: "A", short: "Stable", name: "Stable Experience", price: "350", featured: false,
      features: ["horse", "helmet"] },
    { letter: "B", short: "Gallop", name: "Gallop Experience", price: "850", featured: false,
      features: ["horse", "helmet", "boots", "coach", "videographer"] },
    { letter: "C", short: "Premium", name: "Premium Experience", price: "1.250", featured: true,
      features: ["horse", "helmet", "boots", "coach", "transport", "videographer", "drone"] },
  ];

  const addOns = [
    { icon: Car, label: t("price.a.transport"), price: "250" },
    { icon: Camera, label: t("price.a.photo"), price: "250" },
    { icon: User, label: t("price.a.coach"), price: "200" },
    { icon: Coffee, label: t("price.a.snack"), price: "50" },
  ];

  const campItems = [
    t("price.camp1"), t("price.camp2"), t("price.camp3"), t("price.camp4"),
    t("price.camp5"), t("price.camp6"), t("price.camp7"), t("price.camp8"),
  ];

  return (
    <section id="pricelist" className="section-padding bg-card scroll-mt-14">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        {!hideHeader && (
          <div className="text-center mb-10 md:mb-20">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">{t("price.subtitle")}</p>
            <h2 className="font-display text-2xl md:text-5xl text-foreground">
              {t("price.title1")} <span className="text-gold">{t("price.title2")}</span>
            </h2>
          </div>
        )}

        {/* Experience Packages: comparison table, laid out like the hand-drawn price list
            (items down the left with a small explanation, packages across, ✓ / ✗ per cell) */}
        <div className="max-w-5xl mx-auto mb-6 md:mb-8 border border-border bg-background">
          <div className={`grid ${GRID_COLS}`} role="table" aria-label={`${t("price.title1")} ${t("price.title2")}`}>
            {/* Header row: package name + price */}
            <div className="px-3 md:px-6 py-4 md:py-6 flex items-end border-b border-border" role="columnheader">
              <span className="text-muted-foreground font-body text-[11px] md:text-xs tracking-[0.25em] uppercase">{t("price.items")}</span>
            </div>
            {packages.map((pkg) => (
              <div
                key={pkg.letter}
                role="columnheader"
                className={`relative px-1 md:px-4 pt-6 pb-4 md:pt-8 md:pb-6 text-center border-b border-l border-border ${pkg.featured ? FEATURED_CELL : ""}`}
              >
                {pkg.featured && (
                  <span className="absolute top-0 inset-x-0 bg-gold text-primary-foreground py-0.5 font-body text-[8px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] uppercase">
                    {t("price.complete")}
                  </span>
                )}
                <HorseIcon className="w-4 h-4 md:w-5 md:h-5 text-gold mx-auto mb-1.5" />
                <h3 className="font-body font-bold md:font-display text-[11px] md:text-base text-foreground tracking-[0.08em] md:tracking-[0.05em] uppercase leading-tight mb-1.5 md:mb-2">
                  <span className="md:hidden">{pkg.short}</span>
                  <span className="hidden md:inline">{pkg.name}</span>
                </h3>
                <p className={`font-body font-bold text-base md:text-3xl normal-case tracking-normal leading-none ${pkg.featured ? "text-gold" : "text-foreground"}`}>
                  {pkg.price}
                </p>
                <p className="text-muted-foreground font-body text-[10px] md:text-xs mt-1">SAR{" "}<span className="hidden md:inline">{t("price.perperson")}</span></p>
              </div>
            ))}

            {/* Item rows */}
            {ITEMS.map((item, r) => (
              <div key={item} className="contents" role="row">
                <div className={`px-3 md:px-6 py-3 md:py-4 ${r < ITEMS.length - 1 ? "border-b border-border" : ""}`} role="rowheader">
                  <span className="block text-foreground/90 font-body text-sm leading-snug">{t(`price.f.${item}`)}</span>
                  <span className="block text-muted-foreground font-note font-light text-[12px] md:text-[13px] leading-snug tracking-wide mt-0.5">
                    {t(`price.f.${item}.desc`)}
                  </span>
                </div>
                {packages.map((pkg) => {
                  const included = pkg.features.includes(item);
                  return (
                    <div
                      key={pkg.letter}
                      role="cell"
                      className={`flex items-center justify-center border-l border-border ${r < ITEMS.length - 1 ? "border-b" : ""} ${pkg.featured ? FEATURED_CELL : ""}`}
                    >
                      {included ? (
                        <Check className="w-5 h-5 text-gold" strokeWidth={2.25} aria-label={t("price.included")} />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} aria-label={t("price.notincluded")} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* One booking button per package */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4 mb-10 md:mb-16">
          {packages.map((pkg) => (
            <a
              key={pkg.letter}
              href={getWhatsAppLink(`${pkg.name} - ${pkg.price} SAR/person`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 border px-4 py-3.5 font-body text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                pkg.featured
                  ? "border-gold bg-gold text-primary-foreground hover:bg-gold/90"
                  : "border-gold/50 text-gold hover:bg-gold hover:text-primary-foreground"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {t("price.book")} {pkg.short} · {pkg.price} SAR
            </a>
          ))}
        </div>

        {/* Additional Services */}
        <div className="max-w-6xl mx-auto mb-10 md:mb-16">
          <div className="text-center mb-4 md:mb-6">
            <h3 className="font-display text-lg md:text-xl text-foreground mb-1">{t("price.addons")}</h3>
            <p className="text-muted-foreground font-body text-xs md:text-sm">{t("price.addons.desc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
            {addOns.map((item) => (
              <div key={item.label} className="bg-background border border-border p-4 md:p-5 flex items-center justify-between gap-3 hover:border-gold/30 transition-all duration-500">
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground/85 font-body text-sm">{item.label}</span>
                </div>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="font-body font-bold text-lg md:text-xl text-gold normal-case tracking-normal">{item.price}</span>
                  <span className="text-muted-foreground font-body text-xs">SAR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Package Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-background border border-gold/20 overflow-hidden">
            <div className="relative h-36 md:h-72">
              <img src={arabianCampImg} alt="Arabian Camp Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3">
                <Tent className="w-4 h-4 md:w-6 md:h-6 text-gold" strokeWidth={1.2} />
                <h3 className="font-display text-lg md:text-3xl text-white">
                  {t("price.arabian.title1")} <span className="text-gold">{t("price.arabian.title2")}</span>
                </h3>
              </div>
            </div>
            <div className="p-5 md:p-10">
              <div className="flex items-baseline gap-2 mb-4 md:mb-8">
                <span className="font-body font-bold text-2xl md:text-4xl text-gold normal-case tracking-normal">5.500</span>
                <span className="text-muted-foreground font-body text-xs md:text-sm">{t("price.arabian.for30")}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-2.5 mb-6 md:mb-10">
                {campItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 md:gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-foreground/80 font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP_CAMP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 border border-gold/60 text-gold px-6 py-3 md:px-8 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
              >
                <Phone className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {t("price.arabian.book")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricelistSection;
