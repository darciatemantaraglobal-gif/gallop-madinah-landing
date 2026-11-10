import { MessageCircle, ChevronRight } from "lucide-react";
import HorseIcon from "@/components/icons/HorseIcon";
import { useLanguage } from "@/contexts/LanguageContext";

// Three-step "how do I book?" explainer shown right after the price list,
// so visitors know exactly what happens after they pick a package.
const HowToBookSection = () => {
  const { t } = useLanguage();
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  const steps = [
    { n: "01", title: t("how.s1.title"), desc: t("how.s1.desc") },
    { n: "02", title: t("how.s2.title"), desc: t("how.s2.desc") },
    { n: "03", title: t("how.s3.title"), desc: t("how.s3.desc") },
  ];

  return (
    <section id="how-to-book" className="py-16 md:py-24 bg-background border-t border-border scroll-mt-16">
      <div className="container mx-auto px-5 md:px-8 max-w-6xl">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("how.subtitle")}</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground">
            {t("how.title1")} <span className="text-gold">{t("how.title2")}</span>
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 mb-10 md:mb-12">
          {steps.map((s, i) => (
            <li key={s.n} className="relative flex md:flex-col gap-4 md:gap-5 bg-card border border-border p-5 md:p-7">
              <div className="flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full bg-forest/50 border border-forest-light/40 flex items-center justify-center">
                {i === 0 ? (
                  <HorseIcon className="w-5 h-5 text-gold" />
                ) : i === 1 ? (
                  <MessageCircle className="w-5 h-5 text-gold" strokeWidth={1.5} />
                ) : (
                  <span className="font-body font-bold text-sm text-gold">{s.n}</span>
                )}
              </div>
              <div>
                <p className="text-gold/80 font-body text-[11px] tracking-[0.25em] uppercase mb-1">{t("how.step")} {s.n}</p>
                <h3 className="font-body font-bold text-base text-foreground normal-case tracking-normal mb-1.5">{s.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gold text-primary-foreground px-10 py-3.5 font-body font-bold text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-gold-highlight transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            {t("how.cta")}
            <ChevronRight className="w-4 h-4" />
          </a>
          <p className="text-muted-foreground font-body text-xs mt-3">{t("how.note")}</p>
        </div>
      </div>
    </section>
  );
};

export default HowToBookSection;
