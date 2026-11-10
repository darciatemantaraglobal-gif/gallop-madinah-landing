import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Desktop: floating WhatsApp bubble.
// Phones: a sticky bottom bar ("See prices" + "Book") that appears once the visitor
// scrolls past the first screen, so the next step is always one thumb-tap away
// without a bubble covering card buttons.
const FloatingChat = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [showBar, setShowBar] = useState(false);
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Pages that contain the price list scroll to it; others go to /prices.
  const pricesInPage = pathname === "/" || pathname === "/prices";
  const pricesBtnClass =
    "flex-1 inline-flex items-center justify-center gap-2 border border-white/25 text-foreground py-3 font-body text-xs tracking-[0.15em] uppercase active:bg-white/10";

  return (
    <>
      {/* Desktop / tablet bubble */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:block fixed bottom-6 right-6 z-40 group"
        aria-label={t("wa.aria")}
      >
        <div className="relative w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.55)] hover:scale-105 transition-all duration-300">
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 motion-reduce:hidden" />
          <MessageCircle className="w-8 h-8 text-white relative z-10" />
        </div>
      </a>

      {/* Phone sticky bar */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <div className="flex gap-2.5">
          {pricesInPage ? (
            <a href="#pricelist" className={pricesBtnClass} tabIndex={showBar ? 0 : -1}>
              <Tag className="w-4 h-4 text-gold" strokeWidth={1.5} />
              {t("bar.prices")}
            </a>
          ) : (
            <Link to="/prices" className={pricesBtnClass} tabIndex={showBar ? 0 : -1}>
              <Tag className="w-4 h-4 text-gold" strokeWidth={1.5} />
              {t("bar.prices")}
            </Link>
          )}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={showBar ? 0 : -1}
            className="flex-[1.3] inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 font-body font-bold text-xs tracking-[0.15em] uppercase active:brightness-95"
          >
            <MessageCircle className="w-4 h-4" />
            {t("bar.book")}
          </a>
        </div>
      </div>
    </>
  );
};

export default FloatingChat;
