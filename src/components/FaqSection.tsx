import { MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ_COUNT = 10;

// Common questions as an accordion: short on phones, one tap to read an answer.
const FaqSection = () => {
  const { t } = useLanguage();
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;
  const items = Array.from({ length: FAQ_COUNT }, (_, i) => i + 1);

  return (
    <section id="faq" className="py-16 md:py-24 bg-card border-t border-border scroll-mt-16">
      <div className="container mx-auto px-5 md:px-8 max-w-3xl">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold font-body text-xs md:text-sm tracking-[0.35em] uppercase mb-3 md:mb-4">{t("faq.subtitle")}</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground">
            {t("faq.title1")} <span className="text-gold">{t("faq.title2")}</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="border-t border-border">
          {items.map((n) => (
            <AccordionItem key={n} value={`q${n}`} className="border-border">
              <AccordionTrigger className="gap-4 py-4 md:py-5 text-left font-body font-bold text-[15px] md:text-base text-foreground normal-case tracking-normal leading-snug hover:no-underline hover:text-gold [&[data-state=open]]:text-gold [&>svg]:text-gold">
                {t(`faq.q${n}`)}
              </AccordionTrigger>
              <AccordionContent className="pr-8 text-muted-foreground font-body text-sm md:text-[15px] leading-relaxed">
                {t(`faq.a${n}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8 md:mt-10">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold font-body text-sm hover:text-gold-highlight transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {t("faq.more")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
