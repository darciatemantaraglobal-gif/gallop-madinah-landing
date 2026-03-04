import { Phone } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/6281234567890?text=Halo%20Gallop%20Madinah%2C%20saya%20ingin%20booking%20berkuda";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full gradient-gold blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
          Slot terbatas setiap hari.
        </h2>
        <p className="text-muted-foreground font-body text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Konsultasikan jadwal berkuda Anda sekarang dan rasakan pengalaman berkuda yang tak terlupakan di Madinah.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 gradient-gold text-primary-foreground px-12 py-5 rounded-full text-xl font-bold font-body hover:shadow-gold transition-all duration-300 hover:scale-105"
        >
          <Phone className="w-6 h-6" />
          Chat WhatsApp
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;
