import { MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { waLink, trackWhatsApp } from "@/lib/whatsapp";
import { useSiteData } from "@/lib/siteData";
import { pick } from "@/data/siteData";

// Common questions as an accordion: short on phones, one tap to read an answer.
// Questions come from the Sheet ("FAQ" tab) or the built-in copy.
const FaqSection = () => {
  const { t, lang } = useLanguage();
  const { faq } = useSiteData();
  const WHATSAPP_LINK = waLink(t("wa.general"));

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
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-border">
              <AccordionTrigger className="gap-4 py-4 md:py-5 text-start font-body font-bold text-[15px] md:text-base text-foreground normal-case tracking-normal leading-snug hover:no-underline hover:text-gold [&[data-state=open]]:text-gold [&>svg]:text-gold">
                {pick(item.q, lang)}
              </AccordionTrigger>
              <AccordionContent className="pe-8 text-muted-foreground font-body text-sm md:text-[15px] leading-relaxed">
                {pick(item.a, lang)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8 md:mt-10">
          <a
            href={WHATSAPP_LINK}
            onClick={() => trackWhatsApp("faq")}
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
