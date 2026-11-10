import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingChat = () => {
  const { t } = useLanguage();
  const WHATSAPP_LINK = `https://wa.me/628118880818?text=${encodeURIComponent(t("wa.general"))}`;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label={t("wa.aria")}
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.55)] hover:scale-105 transition-all duration-300">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 motion-reduce:hidden" />
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10" />
      </div>
    </a>
  );
};

export default FloatingChat;
