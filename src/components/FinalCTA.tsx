import { Phone } from "lucide-react";
import ctaBg from "@/assets/cta-background.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const FinalCTA = () => {
  const { t } = useLanguage();
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={ctaBg} alt="Desert horse riding experience" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
      </div>
      <div className="relative z-10 text-center px-5 md:px-4">
        <h2 className="font-display text-2xl md:text-5xl lg:text-6xl text-white mb-3 md:mb-5 leading-tight">
          {t("cta.title1")} <span className="text-gold">{t("cta.title2")}</span>
        </h2>
        <p className="text-white/60 font-body text-sm md:text-lg tracking-wide max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed italic">
          {t("cta.desc")}
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 border border-gold/60 text-gold px-8 md:px-10 py-3 md:py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          {t("cta.booking")}
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;
