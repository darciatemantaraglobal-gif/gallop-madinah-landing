import { Waypoints, Car, UserCheck, Camera, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useLanguage();

  const services = [
    { icon: Waypoints, title: t("svc.s1.title"), desc: t("svc.s1.desc") },
    { icon: Car, title: t("svc.s2.title"), desc: t("svc.s2.desc") },
    { icon: UserCheck, title: t("svc.s3.title"), desc: t("svc.s3.desc") },
    { icon: Camera, title: t("svc.s4.title"), desc: t("svc.s4.desc") },
    { icon: UtensilsCrossed, title: t("svc.s5.title"), desc: t("svc.s5.desc") },
    { icon: Waypoints, title: t("svc.s6.title"), desc: t("svc.s6.desc") },
  ];

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        {!hideHeader && (
          <div className="text-center mb-10 md:mb-16">
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-4 md:mb-5">{t("svc.subtitle")}</p>
            <h2 className="font-display text-2xl md:text-5xl text-foreground">
              {t("svc.title1")} <span className="text-gold">{t("svc.title2")}</span>
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 max-w-6xl mx-auto">
          {services.map((item, i) => (
            <div key={i} className="bg-card border border-border p-4 md:p-7 group hover:border-gold/30 transition-all duration-500">
              <div className="w-9 h-9 md:w-12 md:h-12 border border-border rounded-full flex items-center justify-center mb-3 md:mb-5 group-hover:border-gold/40 transition-colors duration-500">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-body font-bold text-sm md:text-base text-foreground mb-1.5 md:mb-2 normal-case tracking-normal">{item.title}</h3>
              <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
