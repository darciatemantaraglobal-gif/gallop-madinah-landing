import { Phone, Tent, User, ChevronRight, Car, Camera, Coffee, MessageCircle } from "lucide-react";
import arabianCampImg from "@/assets/arabian-camp-cover.jpg";
import HorseIcon from "@/components/icons/HorseIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const PricelistSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useLanguage();

  const getWhatsAppLink = (packageName: string) =>
    `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.template").replace("{pkg}", packageName))}`;

  const WHATSAPP_CAMP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.camp.template"))}`;

  const packages = [
    {
      letter: "A",
      name: "Stable Experience",
      price: "350",
      desc: t("price.stable.desc"),
      features: [t("price.f.horse"), t("price.f.stableride"), t("price.f.groom")],
      featured: false,
    },
    {
      letter: "B",
      name: "Gallop Experience",
      price: "850",
      desc: t("price.gallop.desc"),
      features: [t("price.f.horse"), t("price.f.coach"), t("price.f.trekking")],
      featured: false,
    },
    {
      letter: "C",
      name: "Premium Experience",
      price: "1.300",
      desc: t("price.premium.desc"),
      features: [
        t("price.f.horse"), t("price.f.privatecoach"), t("price.f.transport"),
        t("price.f.snack"), t("price.f.photo"), t("price.f.premiumtrek"),
      ],
      featured: true,
    },
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

        {/* Experience Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto mb-10 md:mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.letter}
              className={`relative border p-5 md:p-6 flex flex-col transition-all duration-500 ${
                pkg.featured
                  ? "bg-gradient-to-b from-forest to-forest-deep/60 border-gold/60 hover:border-gold"
                  : "bg-background border-border hover:border-forest-light/60"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-2.5 right-5 bg-gold text-primary-foreground px-3 py-0.5 font-body text-[10px] tracking-[0.2em] uppercase">
                  {t("price.complete")}
                </span>
              )}
              <div className="flex items-center gap-2 mb-2 text-gold">
                <HorseIcon className="w-5 h-5" />
                <span className="font-body text-xs tracking-[0.3em] uppercase">{pkg.letter}</span>
              </div>
              <h3 className="font-display text-lg md:text-xl text-foreground mb-1">{pkg.name}</h3>
              <p className="text-muted-foreground font-body text-[13px] md:text-xs mb-4">{pkg.desc}</p>
              <div className="flex items-baseline gap-1.5 pb-4 mb-4 border-b border-border">
                <span className={`font-body font-bold text-2xl md:text-3xl normal-case tracking-normal ${pkg.featured ? "text-gold" : "text-foreground"}`}>
                  {pkg.price}
                </span>
                <span className="text-muted-foreground font-body text-xs">SAR {t("price.perperson")}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="text-foreground/85 font-body text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              {!pkg.featured && (
                <p className="text-muted-foreground font-body text-xs leading-relaxed mb-5">{t("price.addable")}</p>
              )}
              <a
                href={getWhatsAppLink(`${pkg.name} - ${pkg.price} SAR/person`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto w-full flex items-center justify-center gap-2 border px-4 py-3 md:py-2.5 font-body text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  pkg.featured
                    ? "border-gold bg-gold text-primary-foreground hover:bg-gold/90"
                    : "border-gold/50 text-gold hover:bg-gold hover:text-primary-foreground"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {t("price.booknow")}
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
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
