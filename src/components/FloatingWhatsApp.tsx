import { MessageCircle } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const FloatingChat = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat with us"
    >
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gold flex items-center justify-center shadow-[0_4px_24px_hsl(var(--gold)/0.4)] hover:shadow-[0_6px_32px_hsl(var(--gold)/0.55)] hover:scale-105 transition-all duration-300">
        <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground relative z-10" />
      </div>
    </a>
  );
};

export default FloatingChat;
