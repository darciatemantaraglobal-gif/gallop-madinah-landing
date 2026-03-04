import { Award, Shield, Heart, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhySection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useLanguage();

  const reasons = [
    { icon: Award, title: t("why.r1.title"), desc: t("why.r1.desc") },
    { icon: Shield, title: t("why.r2.title"), desc: t("why.r2.desc") },
    { icon: Heart, title: t("why.r3.title"), desc: t("why.r3.desc") },
    { icon: Users, title: t("why.r4.title"), desc: t("why.r4.desc") },
  ];

  return (
    <section id="why" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        {!hideHeader && (
          <div className="text-center mb-10 md:mb-16">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">{t("why.subtitle")}</p>
            <h2 className="font-display text-2xl md:text-5xl text-foreground mb-5 md:mb-8">
              {t("why.title1")} <span className="text-gold">{t("why.title2")}</span>
            </h2>
            <p className="text-muted-foreground font-body text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t("why.desc")}
            </p>
          </div>
        )}
        {hideHeader && (
          <div className="text-center mb-10 md:mb-16">
            <p className="text-muted-foreground font-body text-sm md:text-base tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t("why.desc")}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto">
          {reasons.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 border border-border rounded-full flex items-center justify-center group-hover:border-gold/60 transition-all duration-500">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-body font-bold text-sm md:text-base text-foreground mb-2 md:mb-3 normal-case tracking-normal">{item.title}</h3>
              <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
