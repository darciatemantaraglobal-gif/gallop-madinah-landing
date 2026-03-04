import horsePortrait from "@/assets/horse-portrait.jpg";
import { MapPin, Clock, Moon, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ExperienceSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useLanguage();

  const experiences = [
    { icon: MapPin, text: t("exp.e1.text"), desc: t("exp.e1.desc") },
    { icon: Clock, text: t("exp.e2.text"), desc: t("exp.e2.desc") },
    { icon: Moon, text: t("exp.e3.text"), desc: t("exp.e3.desc") },
    { icon: Coffee, text: t("exp.e4.text"), desc: t("exp.e4.desc") },
  ];

  return (
    <section id="experience" className="bg-card">
      {!hideHeader && (
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
          <img src={horsePortrait} alt="Kuda di padang pasir Madinah" className="w-full h-full object-cover scale-125" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-8 pb-10 md:pb-16 max-w-6xl mx-auto">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("exp.subtitle")}</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3 leading-tight">
              {t("exp.title1")} <span className="text-gold">{t("exp.title2")}</span>
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mb-4 md:mb-6" />
            <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed max-w-md md:max-w-lg">
              {t("exp.desc")}
            </p>
          </div>
        </div>
      )}
      <div className="section-padding">
        <div className="container mx-auto px-5 md:px-8 max-w-6xl">
          <div className="grid grid-cols-2 gap-3">
            {experiences.map((item, i) => (
              <div key={i} className="bg-background border border-border p-4 md:p-6 flex flex-col items-center text-center gap-3 hover:border-gold/30 transition-all duration-500 group">
                <div className="w-10 h-10 md:w-12 md:h-12 border border-border rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-colors duration-500">
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-body font-bold text-sm md:text-base text-foreground normal-case tracking-normal mb-1">{item.text}</h3>
                  <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
