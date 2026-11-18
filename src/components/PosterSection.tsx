import { ChevronRight } from "lucide-react";
import poster from "@/assets/poster-gallop.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

// The "Gallop" campaign poster. It already carries its own type, so nothing is laid over it:
// phones show it full width; desktop pairs it with a short story and a link to the packages.
const PosterSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background border-t border-border md:py-24">
      <div className="md:container md:mx-auto md:px-8 max-w-6xl md:grid md:grid-cols-[minmax(0,420px)_1fr] md:gap-16 lg:gap-24 md:items-center">
        <img
          src={poster}
          alt="Gallop: riders in Arabian dress on white horses in the Madinah desert"
          loading="lazy"
          className="block w-full h-auto"
        />

        <div className="px-5 py-10 md:p-0 text-center md:text-left">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-5">{t("story.eyebrow")}</p>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4 md:mb-6">
            {t("story.title1")} <span className="text-gold">{t("story.title2")}</span>
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0 mb-7 md:mb-10">
            {t("story.body")}
          </p>
          <a
            href="#pricelist"
            className="inline-flex items-center gap-2 border border-gold/60 text-gold px-8 py-3.5 font-body text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-primary-foreground transition-colors duration-300"
          >
            {t("story.cta")}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PosterSection;
