import heroImage from "@/assets/hero-desert.jpg";
import gallopTitle from "@/assets/gallop-title-2.png";
import { Phone, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Berkuda di padang pasir Madinah saat golden hour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112919]/[0.92] to-[#193B2C]/[0.92]" />
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-4">
        <img src={gallopTitle} alt="Gallop Madinah" className="w-56 md:w-80 lg:w-[420px] xl:w-[480px] mb-8 md:mb-10" />
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 border border-gold/60 text-gold px-8 md:px-10 py-3 md:py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-all duration-300"
        >
          <Phone className="w-4 h-4" />
          {t("hero.booking")}
        </a>
      </div>
      <div className="relative z-10 flex flex-col items-center pb-8 md:pb-10 gap-2 animate-bounce">
        <span className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50">{t("hero.scroll")}</span>
        <ChevronDown className="w-4 h-4 text-white/50" />
      </div>
    </section>
  );
};

export default HeroSection;
