import partnerValeoora from "@/assets/partner-valeoora.png";
import partner1 from "@/assets/partner-1.png";
import partner4 from "@/assets/partner-4.png";
import partner5 from "@/assets/partner-5.png";
import partner8 from "@/assets/partner-8.png";
import partnerAteena from "@/assets/partner-ateena.png";
import partnerLintas from "@/assets/partner-lintas.png";
import { useLanguage } from "@/contexts/LanguageContext";

// Every logo sits in the same box and is scaled to fit it; logos whose shape
// would otherwise look smaller than the rest get a slightly larger box.
const BOX = "w-[120px] h-[40px] md:w-[150px] md:h-[48px]";
const BOX_LARGE = "w-[140px] h-[46px] md:w-[170px] md:h-[54px]";
const BOX_STACKED = "w-[120px] h-[52px] md:w-[150px] md:h-[62px]";

const partners = [
  { src: partnerValeoora, alt: "Valeoora Art", box: BOX },
  { src: partner1, alt: "Partner 1", box: BOX },
  { src: partner4, alt: "Partner 4", box: BOX },
  { src: partner5, alt: "Partner 5", box: BOX },
  { src: partner8, alt: "Umroh Moment", box: BOX_LARGE },
  { src: partnerLintas, alt: "Lintas Haramain Services", box: BOX },
  { src: partnerAteena, alt: "Ateena Visual", box: BOX_STACKED },
];

const PartnersSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-card border-t border-border">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <p className="text-center text-muted-foreground font-body text-xs md:text-sm tracking-[0.2em] uppercase mb-8 md:mb-10">
          {t("partners.title")}
        </p>
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          {partners.map((partner) => (
            <div key={partner.alt} className={`flex items-center justify-center ${partner.box}`}>
              <img
                src={partner.src}
                alt={partner.alt}
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
